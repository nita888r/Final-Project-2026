'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/session';
import { safe, AppError, str, int } from '@/lib/utils';
import { ROLES, EMAIL_KAMPUS_REGEX, ID_MAX_LENGTH } from '@/lib/config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readFields(fd, { needPassword }) {
  const f = {
    nama: str(fd, 'nama_lengkap'),
    email: str(fd, 'email').toLowerCase(),
    nim: str(fd, 'nomor_identitas'),
    role: str(fd, 'role'),
    password: str(fd, 'password'),
    aktif: fd.get('is_active') === 'on',
  };
  if (!f.nama || !f.email || !f.nim || !f.role) throw new AppError('Semua data wajib diisi.');
  if (!EMAIL_RE.test(f.email)) throw new AppError('Format email tidak valid.');
  if (!ROLES.includes(f.role)) throw new AppError('Role tidak valid.');
  if (f.role === 'mahasiswa' && !EMAIL_KAMPUS_REGEX.test(f.email)) {
    throw new AppError('Akun Mahasiswa wajib memakai email kampus (berakhiran .ac.id atau .edu).');
  }
  if (f.nim.length > ID_MAX_LENGTH) throw new AppError(`Nomor identitas maksimal ${ID_MAX_LENGTH} karakter.`);
  if (needPassword && !f.password) throw new AppError('Password wajib diisi.');
  if (f.password && f.password.length < 6) throw new AppError('Password minimal 6 karakter.');
  return f;
}

export async function createUser(_prev, fd) {
  const r = await safe(async () => {
    await requireRole(['admin']);
    const f = readFields(fd, { needPassword: true });
    const dup = await query('SELECT 1 FROM users WHERE email = $1 OR nomor_identitas = $2', [f.email, f.nim]);
    if (dup.length) throw new AppError('Email atau nomor identitas sudah dipakai.');
    const hash = await bcrypt.hash(f.password, 10);
    await query(
      `INSERT INTO users (nama_lengkap,email,password_hash,nomor_identitas,role) VALUES ($1,$2,$3,$4,$5)`,
      [f.nama, f.email, hash, f.nim, f.role]
    );
  });
  if (r?.error) return r;
  revalidatePath('/admin/pengguna');
  redirect('/admin/pengguna?notif=pengguna-ditambah');
}

export async function updateUser(_prev, fd) {
  const r = await safe(async () => {
    const s = await requireRole(['admin']);
    const id = int(fd, 'id');
    if (!Number.isInteger(id)) throw new AppError('Pengguna tidak valid.');
    const f = readFields(fd, { needPassword: false });
    if (id === s.id && (f.role !== 'admin' || !f.aktif)) {
      throw new AppError('Anda tidak dapat menurunkan role atau menonaktifkan akun sendiri.');
    }
    const dup = await query('SELECT 1 FROM users WHERE (email = $1 OR nomor_identitas = $2) AND id <> $3', [f.email, f.nim, id]);
    if (dup.length) throw new AppError('Email atau nomor identitas sudah dipakai pengguna lain.');
    await query(
      `UPDATE users SET nama_lengkap=$1, email=$2, nomor_identitas=$3, role=$4, is_active=$5, updated_at=now() WHERE id=$6`,
      [f.nama, f.email, f.nim, f.role, f.aktif, id]
    );
    if (f.password) {
      await query('UPDATE users SET password_hash=$1 WHERE id=$2', [await bcrypt.hash(f.password, 10), id]);
    }
  });
  if (r?.error) return r;
  revalidatePath('/admin/pengguna');
  redirect('/admin/pengguna?notif=pengguna-diubah');
}

export async function deleteUser(_prev, fd) {
  return safe(async () => {
    const s = await requireRole(['admin']);
    const id = int(fd, 'id');
    if (!Number.isInteger(id)) throw new AppError('Pengguna tidak valid.');
    if (id === s.id) throw new AppError('Anda tidak dapat menghapus akun sendiri.');
    const aktif = await query(
      `SELECT 1 FROM loans WHERE user_id=$1 AND status IN ('menunggu_konfirmasi','sedang_dipinjam') LIMIT 1`, [id]
    );
    if (aktif.length) throw new AppError('Pengguna memiliki transaksi aktif dan tidak dapat dihapus.');
    try {
      await query('DELETE FROM users WHERE id=$1', [id]);
    } catch (e) {
      if (e.code === '23503') {
        throw new AppError('Pengguna memiliki riwayat data (transaksi/ulasan/pengumuman). Nonaktifkan akunnya saja.');
      }
      throw e;
    }
    revalidatePath('/admin/pengguna');
    return { success: 'Pengguna dihapus.' };
  });
}