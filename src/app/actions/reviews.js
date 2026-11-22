'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/session';
import { safe, AppError, str, int } from '@/lib/utils';

export async function tulisUlasan(_prev, fd) {
  const r = await safe(async () => {
    const s = await requireRole(['mahasiswa']);
    const loanId = int(fd, 'loanId');
    const rating = int(fd, 'rating');
    const komentar = str(fd, 'komentar');
    if (!Number.isInteger(loanId)) throw new AppError('Transaksi tidak valid.');
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new AppError('Rating harus 1 sampai 5.');
    const [loan] = await query('SELECT id, book_id, status FROM loans WHERE id=$1 AND user_id=$2', [loanId, s.id]);
    if (!loan) throw new AppError('Transaksi tidak ditemukan.');
    if (loan.status !== 'selesai') throw new AppError('Ulasan hanya untuk buku yang peminjamannya sudah selesai.');
    const ada = await query('SELECT 1 FROM reviews WHERE loan_id=$1', [loanId]);
    if (ada.length) throw new AppError('Anda sudah mengulas transaksi ini.');
    await query(
      'INSERT INTO reviews (loan_id, book_id, user_id, rating, komentar) VALUES ($1,$2,$3,$4,$5)',
      [loanId, loan.book_id, s.id, rating, komentar || null]
    );
    revalidatePath(`/buku/${loan.book_id}`);
    revalidatePath('/katalog');
  });
  if (r?.error) return r;
  redirect('/mahasiswa?notif=ulasan-terkirim');
}
