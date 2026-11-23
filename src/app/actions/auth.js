'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { createSession, destroySession } from '@/lib/session';
import { safe, AppError, str } from '@/lib/utils';
import { EMAIL_KAMPUS_REGEX, ID_MAX_LENGTH } from '@/lib/config';

const HOME = { admin: '/admin', pegawai: '/pegawai', mahasiswa: '/mahasiswa' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(_prev, fd) {
  let role;
  const r = await safe(async () => {
    const email = str(fd, 'email').toLowerCase();
    const password = str(fd, 'password');
    if (!email || !password) throw new AppError('Email dan password wajib diisi.');
    const rows = await query(
      'SELECT id, nama_lengkap, password_hash, role, is_active FROM users WHERE email = $1',
      [email]
    );
    const u = rows[0];
    if (!u || !(await bcrypt.compare(password, u.password_hash))) {
      throw new AppError('Email atau password salah.');
    }
    if (!u.is_active) throw new AppError('Akun Anda nonaktif. Hubungi Admin.');
    await createSession(u);
    role = u.role;
  });
  if (r?.error) return r;
  redirect(HOME[role]);
}

export async function registerAction(_prev, fd) {
  const r = await safe(async () => {
    const nama = str(fd, 'nama_lengkap');
    const email = str(fd, 'email').toLowerCase();
    const nim = str(fd, 'nomor_identitas');
    const password = str(fd, 'password');
    const konfirmasi = str(fd, 'konfirmasi');

    if (!nama || !email || !nim || !password) throw new AppError('Semua data wajib diisi.');
    if (!EMAIL_RE.test(email)) throw new AppError('Format email tidak valid.');
    if (!EMAIL_KAMPUS_REGEX.test(email)) {
      throw new AppError('Gunakan email kampus (berakhiran .ac.id atau .edu).');
    }
    if (nim.length > ID_MAX_LENGTH) throw new AppError(`NIM maksimal ${ID_MAX_LENGTH} karakter.`);
    if (password.length < 6) throw new AppError('Password minimal 6 karakter.');
    if (password !== konfirmasi) throw new AppError('Konfirmasi password tidak sama.');

    const dup = await query('SELECT email, nomor_identitas FROM users WHERE email = $1 OR nomor_identitas = $2', [email, nim]);
    if (dup.length) throw new AppError('Email atau NIM sudah terdaftar.');

    const hash = await bcrypt.hash(password, 10);
    const rows = await query(
      `INSERT INTO users (nama_lengkap, email, password_hash, nomor_identitas, role)
       VALUES ($1,$2,$3,$4,'mahasiswa') RETURNING id, nama_lengkap, role`,
      [nama, email, hash, nim]
    );
    await createSession(rows[0]);
  });
  if (r?.error) return r;
  redirect('/mahasiswa');
}

export async function logoutAction() {
  destroySession();
  redirect('/');
}
