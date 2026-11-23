import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { fmtDate, rupiah } from '@/lib/utils';
import { MAKS_PERPANJANGAN } from '@/lib/config';
import Badge from '@/components/Badge';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { ajukanPerpanjangan } from '@/app/actions/loans';

export const metadata = { title: 'Pinjaman Saya – RUANG AKSARA' };

export default async function MahasiswaDashboard() {
  const s = await requirePage(['mahasiswa']);

  const aktif = await query(
    `SELECT l.id, l.kode_pinjam, l.status, l.jatuh_tempo, l.status_perpanjangan, l.jumlah_perpanjangan, l.tanggal_pengajuan,
            b.id AS book_id, b.judul, b.denda_per_hari,
            GREATEST(0, CURRENT_DATE - l.jatuh_tempo) AS hari_terlambat,
            (l.status='sedang_dipinjam' AND l.jatuh_tempo < CURRENT_DATE) AS terlambat
     FROM loans l JOIN books b ON b.id=l.book_id
     WHERE l.user_id=$1 AND l.status IN ('menunggu_konfirmasi','sedang_dipinjam')
     ORDER BY l.tanggal_pengajuan DESC`, [s.id]
  );
  const denda = await query(
    `SELECT f.id, f.jumlah_denda, f.hari_terlambat, b.judul
     FROM fines f JOIN loans l ON l.id=f.loan_id JOIN books b ON b.id=l.book_id
     WHERE l.user_id=$1 AND f.status='tertunggak' ORDER BY f.created_at`, [s.id]
  );
  const riwayat = await query(
    `SELECT l.id, l.kode_pinjam, l.status, l.alasan_penolakan, l.tanggal_pinjam, l.tanggal_kembali, b.id AS book_id, b.judul,
            f.jumlah_denda, f.status AS status_denda, (r.id IS NOT NULL) AS sudah_ulas
     FROM loans l JOIN books b ON b.id=l.book_id
     LEFT JOIN fines f ON f.loan_id=l.id LEFT JOIN reviews r ON r.loan_id=l.id
     WHERE l.user_id=$1 AND l.status IN ('selesai','ditolak') ORDER BY l.updated_at DESC`, [s.id]
  );
  const totalDenda = denda.reduce((a, d) => a + d.jumlah_denda, 0);

  return (
    <div className="space-y-8">
      <h1>Halo, {s.nama}</h1>

      {denda.length > 0 && (
        <section className="rounded-lg border-2 border-brick bg-brick/10 p-5" role="alert">
          <h2 className="!text-brick">Denda tertunggak: {rupiah(totalDenda)}</h2>
          <p className="mt-1 text-sm">Peminjaman baru diblokir sampai denda dilunasi di meja sirkulasi.</p>
          <ul className="mt-3 space-y-1 text-sm">
            {denda.map((d) => <li key={d.id}>{d.judul}: terlambat {d.hari_terlambat} hari, {rupiah(d.jumlah_denda)}</li>)}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-3">Pinjaman aktif</h2>
        {aktif.length === 0 ? (
          <p className="card text-sm">Tidak ada pinjaman aktif. <Link href="/katalog" className="text-bottle underline">Cari buku di katalog</Link>.</p>
        ) : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Buku</th><th>Status</th><th>Jatuh tempo</th><th>Perpanjangan</th><th>Aksi</th></tr></thead>
            <tbody>
              {aktif.map((l) => (
                <tr key={l.id}>
                  <td><Link href={`/buku/${l.book_id}`} className="font-medium text-brown underline">{l.judul}</Link><div className="text-xs text-ink/60">{l.kode_pinjam}</div></td>
                  <td><Badge status={l.terlambat ? 'terlambat' : l.status} />
                    {l.terlambat && <div className="mt-1 text-xs text-brick">{l.hari_terlambat} hari, denda berjalan {rupiah(l.hari_terlambat * l.denda_per_hari)}</div>}</td>
                  <td>{l.status === 'sedang_dipinjam' ? fmtDate(l.jatuh_tempo) : 'Menunggu persetujuan Pegawai'}</td>
                  <td>{l.status_perpanjangan !== 'tidak_ada' ? <Badge status={l.status_perpanjangan} /> : '-'}</td>
                  <td>
                    {l.status === 'sedang_dipinjam' && !l.terlambat && l.jumlah_perpanjangan < MAKS_PERPANJANGAN && l.status_perpanjangan !== 'perpanjangan_diajukan' && (
                      <ActionForm action={ajukanPerpanjangan}>
                        <input type="hidden" name="loanId" value={l.id} />
                        <SubmitButton className="btn btn-outline btn-sm">Ajukan Perpanjangan</SubmitButton>
                      </ActionForm>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>

      <section>
        <h2 className="mb-3">Riwayat transaksi</h2>
        {riwayat.length === 0 ? <p className="card text-sm">Belum ada riwayat.</p> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Buku</th><th>Status</th><th>Dipinjam</th><th>Dikembalikan</th><th>Denda</th><th>Ulasan</th></tr></thead>
            <tbody>
              {riwayat.map((l) => (
                <tr key={l.id}>
                  <td><Link href={`/buku/${l.book_id}`} className="underline">{l.judul}</Link><div className="text-xs text-ink/60">{l.kode_pinjam}</div></td>
                  <td><Badge status={l.status} />{l.alasan_penolakan && <div className="mt-1 text-xs text-brick">{l.alasan_penolakan}</div>}</td>
                  <td>{fmtDate(l.tanggal_pinjam)}</td>
                  <td>{fmtDate(l.tanggal_kembali)}</td>
                  <td>{l.jumlah_denda ? <>{rupiah(l.jumlah_denda)} <Badge status={l.status_denda} /></> : '-'}</td>
                  <td>{l.status === 'selesai' ? (l.sudah_ulas ? <span className="text-xs text-bottle">Sudah diulas</span> : <Link href={`/ulasan/${l.id}`} className="btn btn-gold btn-sm">Tulis Ulasan</Link>) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}
