'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/session';
import { safe, AppError, str, int } from '@/lib/utils';

function fields(fd) {
  const f = { nama: str(fd, 'nama_kategori'), kode: str(fd, 'kode_klasifikasi'), desk: str(fd, 'deskripsi') };
  if (!f.nama || !f.kode) throw new AppError('Nama dan kode kategori wajib diisi.');
  return f;
}

export async function createCategory(_prev, fd) {
  return safe(async () => {
    await requireRole(['admin']);
    const f = fields(fd);
    const dup = await query('SELECT 1 FROM categories WHERE lower(nama_kategori)=lower($1) OR lower(kode_klasifikasi)=lower($2)', [f.nama, f.kode]);
    if (dup.length) throw new AppError('Nama atau kode kategori sudah ada.');
    await query('INSERT INTO categories (nama_kategori,kode_klasifikasi,deskripsi) VALUES ($1,$2,$3)', [f.nama, f.kode, f.desk || null]);
    revalidatePath('/admin/kategori');
    return { success: 'Kategori ditambahkan.' };
  });
}

export async function updateCategory(_prev, fd) {
  const r = await safe(async () => {
    await requireRole(['admin']);
    const id = int(fd, 'id');
    if (!Number.isInteger(id)) throw new AppError('Kategori tidak valid.');
    const f = fields(fd);
    const dup = await query('SELECT 1 FROM categories WHERE (lower(nama_kategori)=lower($1) OR lower(kode_klasifikasi)=lower($2)) AND id<>$3', [f.nama, f.kode, id]);
    if (dup.length) throw new AppError('Nama atau kode kategori sudah dipakai kategori lain.');
    await query('UPDATE categories SET nama_kategori=$1, kode_klasifikasi=$2, deskripsi=$3, updated_at=now() WHERE id=$4', [f.nama, f.kode, f.desk || null, id]);
  });
  if (r?.error) return r;
  revalidatePath('/admin/kategori');
  redirect('/admin/kategori?notif=kategori-diubah');
}

export async function deleteCategory(_prev, fd) {
  return safe(async () => {
    await requireRole(['admin']);
    const id = int(fd, 'id');
    if (!Number.isInteger(id)) throw new AppError('Kategori tidak valid.');
    const [{ n }] = await query('SELECT COUNT(*) AS n FROM books WHERE category_id=$1', [id]);
    if (n > 0) throw new AppError(`Kategori masih dipakai ${n} buku dan tidak dapat dihapus.`);
    await query('DELETE FROM categories WHERE id=$1', [id]);
    revalidatePath('/admin/kategori');
    return { success: 'Kategori dihapus.' };
  });
}