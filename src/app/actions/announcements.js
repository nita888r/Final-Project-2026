'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/session';
import { safe, AppError, str, int } from '@/lib/utils';
import { KATEGORI_PENGUMUMAN } from '@/lib/config';

function fields(fd) {
  const f = {
    judul: str(fd, 'judul'),
    konten: str(fd, 'konten'),
    kategori: str(fd, 'kategori'),
    tanggal: str(fd, 'tanggal_rilis'),
    status: str(fd, 'status'),
  };
  if (!f.judul || !f.konten) throw new AppError('Judul dan konten wajib diisi.');
  if (!KATEGORI_PENGUMUMAN.includes(f.kategori)) throw new AppError('Kategori pengumuman tidak valid.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.tanggal)) throw new AppError('Tanggal rilis tidak valid.');
  if (!['draft', 'published'].includes(f.status)) throw new AppError('Status publikasi tidak valid.');
  return f;
}

export async function createAnnouncement(_prev, fd) {
  const r = await safe(async () => {
    const s = await requireRole(['pegawai', 'admin']);
    const f = fields(fd);
    await query(
      `INSERT INTO announcements (judul,konten,kategori,tanggal_rilis,status,created_by) VALUES ($1,$2,$3,$4,$5,$6)`,
      [f.judul, f.konten, f.kategori, f.tanggal, f.status, s.id]
    );
  });
  if (r?.error) return r;
  revalidatePath('/kelola/pengumuman');
  revalidatePath('/');
  redirect('/kelola/pengumuman?notif=pengumuman-ditambah');
}

export async function updateAnnouncement(_prev, fd) {
  const r = await safe(async () => {
    await requireRole(['pegawai', 'admin']);
    const id = int(fd, 'id');
    if (!Number.isInteger(id)) throw new AppError('Pengumuman tidak valid.');
    const f = fields(fd);
    await query(
      `UPDATE announcements SET judul=$1,konten=$2,kategori=$3,tanggal_rilis=$4,status=$5,updated_at=now() WHERE id=$6`,
      [f.judul, f.konten, f.kategori, f.tanggal, f.status, id]
    );
  });
  if (r?.error) return r;
  revalidatePath('/kelola/pengumuman');
  revalidatePath('/');
  redirect('/kelola/pengumuman?notif=pengumuman-diubah');
}

export async function deleteAnnouncement(_prev, fd) {
  return safe(async () => {
    await requireRole(['pegawai', 'admin']);
    const id = int(fd, 'id');
    if (!Number.isInteger(id)) throw new AppError('Pengumuman tidak valid.');
    await query('DELETE FROM announcements WHERE id=$1', [id]);
    revalidatePath('/kelola/pengumuman');
    revalidatePath('/');
    return { success: 'Pengumuman dihapus.' };
  });
}