import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req) {
  const q = (new URL(req.url).searchParams.get('q') ?? '').trim();
  if (q.length < 2) return NextResponse.json([]);
  const rows = await query(
    `SELECT id, judul, pengarang FROM books
     WHERE judul ILIKE $1 OR pengarang ILIKE $1 ORDER BY judul LIMIT 6`,
    [`%${q}%`]
  );
  return NextResponse.json(rows);
}