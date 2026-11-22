'use server';

import { revalidatePath } from 'next/cache';
import { query, withTransaction } from '@/lib/db';
import { requireRole } from '@/lib/session';
import { safe, AppError, str, int } from '@/lib/utils';
import { MAKS_PERPANJANGAN } from '@/lib/config';

const kode = () => 'LN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
const refresh = () => ['/mahasiswa', '/pegawai', '/pegawai/sirkulasi', '/admin', '/admin/transaksi'].forEach((p) => revalidatePath(p));

// ---------- MAHASISWA ----------
export async function ajukanPinjam(_prev, fd) {
  return safe(async () => {
    const s = await requireRole(['mahasiswa']);
    const bookId = int(fd, 'bookId');
    if (!Number.isInteger(bookId)) throw new AppError('Buku tidak valid.');

    const [book] = await query('SELECT id, stok_tersedia FROM books WHERE id=$1', [bookId]);
    if (!book) throw new AppError('Buku tidak ditemukan.');
    if (book.stok_tersedia < 1) throw new AppError('Stok buku sedang habis.');

    const denda = await query(
      `SELECT 1 FROM fines f JOIN loans l ON l.id=f.loan_id WHERE l.user_id=$1 AND f.status='tertunggak' LIMIT 1`, [s.id]
    );
    if (denda.length) throw new AppError('Anda masih memiliki denda tertunggak. Lunasi di meja sirkulasi terlebih dahulu.');

    const aktif = await query(
      `SELECT 1 FROM loans WHERE user_id=$1 AND book_id=$2 AND status IN ('menunggu_konfirmasi','sedang_dipinjam')`, [s.id, bookId]
    );
    if (aktif.length) throw new AppError('Anda sudah memiliki pengajuan/pinjaman aktif untuk buku ini.');

    await query(`INSERT INTO loans (kode_pinjam, user_id, book_id) VALUES ($1,$2,$3)`, [kode(), s.id, bookId]);
    refresh();
    revalidatePath(`/buku/${bookId}`);
    return { success: 'Pengajuan terkirim. Datang ke meja sirkulasi untuk diperiksa Pegawai.' };
  });
}

export async function ajukanPerpanjangan(_prev, fd) {
  return safe(async () => {
    const s = await requireRole(['mahasiswa']);
    const id = int(fd, 'loanId');
    if (!Number.isInteger(id)) throw new AppError('Transaksi tidak valid.');
    const [l] = await query(
      `SELECT status, status_perpanjangan, jumlah_perpanjangan, (jatuh_tempo < CURRENT_DATE) AS terlambat
       FROM loans WHERE id=$1 AND user_id=$2`, [id, s.id]
    );
    if (!l) throw new AppError('Transaksi tidak ditemukan.');
    if (l.status !== 'sedang_dipinjam') throw new AppError('Perpanjangan hanya untuk buku yang sedang dipinjam.');
    if (l.terlambat) throw new AppError('Buku sudah terlambat dan tidak dapat diperpanjang.');
    if (l.jumlah_perpanjangan >= MAKS_PERPANJANGAN) throw new AppError('Batas perpanjangan sudah tercapai.');
    if (l.status_perpanjangan === 'perpanjangan_diajukan') throw new AppError('Perpanjangan sudah diajukan.');
    await query(`UPDATE loans SET status_perpanjangan='perpanjangan_diajukan', updated_at=now() WHERE id=$1`, [id]);
    refresh();
    return { success: 'Perpanjangan diajukan.' };
  });
}

// ---------- PEGAWAI ----------
export async function approveLoan(_prev, fd) {
  return safe(async () => {
    const s = await requireRole(['pegawai']);
    const id = int(fd, 'loanId');
    if (!Number.isInteger(id)) throw new AppError('Transaksi tidak valid.');
    await withTransaction(async (c) => {
      const { rows: [loan] } = await c.query('SELECT id, book_id, user_id, status FROM loans WHERE id=$1 FOR UPDATE', [id]);
      if (!loan || loan.status !== 'menunggu_konfirmasi') throw new AppError('Pengajuan tidak ditemukan atau sudah diproses.');
      // kunci baris buku agar stok tidak negatif saat persetujuan bersamaan
      const { rows: [b] } = await c.query('SELECT id, stok_tersedia, durasi_maks_pinjam FROM books WHERE id=$1 FOR UPDATE', [loan.book_id]);
      if (b.stok_tersedia < 1) throw new AppError('Stok buku habis. Pengajuan tidak dapat disetujui.');
      const { rows: f } = await c.query(
        `SELECT 1 FROM fines f JOIN loans l ON l.id=f.loan_id WHERE l.user_id=$1 AND f.status='tertunggak' LIMIT 1`, [loan.user_id]
      );
      if (f.length) throw new AppError('Mahasiswa masih memiliki denda tertunggak.');
      await c.query('UPDATE books SET stok_tersedia = stok_tersedia - 1, updated_at=now() WHERE id=$1', [b.id]);
      await c.query(
        `UPDATE loans SET status='sedang_dipinjam', tanggal_pinjam=now(), jatuh_tempo=CURRENT_DATE + $2::int,
           approved_by=$3, updated_at=now() WHERE id=$1`,
        [id, b.durasi_maks_pinjam, s.id]
      );
    });
    refresh();
    return { success: 'Pengajuan disetujui. Stok berkurang 1.' };
  });
}

export async function rejectLoan(_prev, fd) {
  return safe(async () => {
    await requireRole(['pegawai']);
    const id = int(fd, 'loanId');
    const alasan = str(fd, 'alasan');
    if (!Number.isInteger(id)) throw new AppError('Transaksi tidak valid.');
    if (!alasan) throw new AppError('Alasan penolakan wajib diisi.');
    const res = await query(
      `UPDATE loans SET status='ditolak', alasan_penolakan=$2, updated_at=now()
       WHERE id=$1 AND status='menunggu_konfirmasi' RETURNING id`, [id, alasan]
    );
    if (!res.length) throw new AppError('Pengajuan tidak ditemukan atau sudah diproses.');
    refresh();
    return { success: 'Pengajuan ditolak.' };
  });
}

export async function validasiPerpanjangan(_prev, fd) {
  return safe(async () => {
    await requireRole(['pegawai']);
    const id = int(fd, 'loanId');
    const setuju = str(fd, 'keputusan') === 'setuju';
    if (!Number.isInteger(id)) throw new AppError('Transaksi tidak valid.');
    await withTransaction(async (c) => {
      const { rows: [l] } = await c.query(
        `SELECT l.status, l.status_perpanjangan, l.jumlah_perpanjangan, b.durasi_maks_pinjam
         FROM loans l JOIN books b ON b.id=l.book_id WHERE l.id=$1 FOR UPDATE OF l`, [id]
      );
      if (!l || l.status !== 'sedang_dipinjam' || l.status_perpanjangan !== 'perpanjangan_diajukan') {
        throw new AppError('Pengajuan perpanjangan tidak ditemukan atau sudah diproses.');
      }
      if (setuju) {
        if (l.jumlah_perpanjangan >= MAKS_PERPANJANGAN) throw new AppError('Batas perpanjangan sudah tercapai.');
        await c.query(
          `UPDATE loans SET jatuh_tempo = jatuh_tempo + $2::int, jumlah_perpanjangan = jumlah_perpanjangan + 1,
             status_perpanjangan='perpanjangan_disetujui', updated_at=now() WHERE id=$1`,
          [id, l.durasi_maks_pinjam]
        );
      } else {
        await c.query(`UPDATE loans SET status_perpanjangan='perpanjangan_ditolak', updated_at=now() WHERE id=$1`, [id]);
      }
    });
    refresh();
    return { success: setuju ? 'Perpanjangan disetujui. Jatuh tempo bertambah.' : 'Perpanjangan ditolak.' };
  });
}

export async function konfirmasiPengembalian(_prev, fd) {
  return safe(async () => {
    const s = await requireRole(['pegawai']);
    const id = int(fd, 'loanId');
    if (!Number.isInteger(id)) throw new AppError('Transaksi tidak valid.');
    const hasil = await withTransaction(async (c) => {
      const { rows: [loan] } = await c.query('SELECT id, book_id, status, jatuh_tempo FROM loans WHERE id=$1 FOR UPDATE', [id]);
      if (!loan || loan.status !== 'sedang_dipinjam') throw new AppError('Transaksi tidak aktif.');
      const { rows: [b] } = await c.query('SELECT id, denda_per_hari FROM books WHERE id=$1 FOR UPDATE', [loan.book_id]);
      await c.query('UPDATE books SET stok_tersedia = LEAST(stok_total, stok_tersedia + 1), updated_at=now() WHERE id=$1', [b.id]);
      // keterlambatan dihitung di database berdasarkan tanggal (runtime)
      const { rows: [{ hari }] } = await c.query('SELECT GREATEST(0, CURRENT_DATE - $1::date) AS hari', [loan.jatuh_tempo]);
      await c.query(`UPDATE loans SET status='selesai', tanggal_kembali=now(), returned_by=$2, updated_at=now() WHERE id=$1`, [id, s.id]);
      let denda = 0;
      if (hari > 0 && Number(b.denda_per_hari) > 0) {
        denda = hari * Number(b.denda_per_hari);
        await c.query(
          `INSERT INTO fines (loan_id, hari_terlambat, tarif_per_hari, jumlah_denda, status, dicatat_oleh)
           VALUES ($1,$2,$3,$4,'tertunggak',$5)`,
          [id, hari, b.denda_per_hari, denda, s.id]
        );
      }
      return { hari, denda };
    });
    refresh();
    return {
      success: hasil.denda > 0
        ? `Pengembalian dikonfirmasi. Terlambat ${hasil.hari} hari, denda Rp${hasil.denda.toLocaleString('id-ID')} tercatat (tertunggak).`
        : 'Pengembalian dikonfirmasi. Tidak ada denda.',
    };
  });
}

export async function catatLunas(_prev, fd) {
  return safe(async () => {
    const s = await requireRole(['pegawai']);
    const id = int(fd, 'fineId');
    if (!Number.isInteger(id)) throw new AppError('Denda tidak valid.');
    const res = await query(
      `UPDATE fines SET status='lunas', dibayar_at=now(), dicatat_oleh=$2 WHERE id=$1 AND status='tertunggak' RETURNING id`, [id, s.id]
    );
    if (!res.length) throw new AppError('Denda tidak ditemukan atau sudah lunas.');
    refresh();
    return { success: 'Denda dicatat lunas. Blokir peminjaman dicabut.' };
  });
}
