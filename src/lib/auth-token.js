// Edge-safe (dipakai middleware & server). Tidak memakai pg.
import { jwtVerify, SignJWT } from 'jose';

export const COOKIE_NAME = 'ra_session';
const secret = () => {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    // Secret cadangan hanya untuk development lokal; di production wajib diisi lewat .env.local
    if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET belum diatur di environment.');
    return new TextEncoder().encode('dev-secret-ubah-di-produksi');
  }
  return new TextEncoder().encode(s);
};

export async function signToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}
