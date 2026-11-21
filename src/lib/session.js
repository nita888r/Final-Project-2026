import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, signToken, verifyToken } from '@/lib/auth-token';
import { query } from '@/lib/db';
import { AppError } from '@/lib/utils';

export async function createSession(user) {
  const token = await signToken({ id: user.id, role: user.role, nama: user.nama_lengkap });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const p = await verifyToken(token);
  return p ? { id: Number(p.id), role: p.role, nama: p.nama } : null;
}

// Untuk Server Action / Route Handler: cek sesi + role + akun masih aktif (langsung ke database).
export async function requireRole(roles) {
  const s = await getSession();
  if (!s || !roles.includes(s.role)) throw new AppError('Akses ditolak. Masuk dengan akun yang sesuai.');
  const rows = await query('SELECT is_active, role FROM users WHERE id = $1', [s.id]);
  if (!rows[0] || !rows[0].is_active || !roles.includes(rows[0].role)) {
    throw new AppError('Akun tidak aktif atau tidak berwenang.');
  }
  return s;
}

// Untuk halaman (Server Component): redirect bila tidak berhak.
export async function requirePage(roles) {
  const s = await getSession();
  if (!s) redirect('/login');
  if (!roles.includes(s.role)) redirect('/');
  return s;
}
