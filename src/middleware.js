import { NextResponse } from 'next/server';
import { COOKIE_NAME, verifyToken } from '@/lib/auth-token';

// Lapisan pertama: cek cookie & role dasar. Server Action tetap memeriksa ulang di server.
const RULES = [
  ['/admin', ['admin']],
  ['/pegawai', ['pegawai']],
  ['/kelola', ['pegawai', 'admin']],
  ['/mahasiswa', ['mahasiswa']],
  ['/ulasan', ['mahasiswa']],
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const rule = RULES.find(([p]) => pathname === p || pathname.startsWith(p + '/'));
  if (!rule) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.redirect(new URL('/login', req.url));
  if (!rule[1].includes(payload.role)) return NextResponse.redirect(new URL('/', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/pegawai/:path*', '/kelola/:path*', '/mahasiswa/:path*', '/ulasan/:path*'],
};
