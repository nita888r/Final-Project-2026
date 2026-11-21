// Edge-safe (dipakai middleware & server). Tidak memakai pg.
import { jwtVerify, SignJWT } from 'jose';

export const COOKIE_NAME = 'ra_session';
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-ubah-di-produksi');

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
