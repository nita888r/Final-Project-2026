import { queryOne } from '@/lib/db';

// Menyajikan gambar sampul dari database. Publik (katalog dapat dilihat tanpa login).
export async function GET(_req, { params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return new Response('Not found', { status: 404 });
  const row = await queryOne('SELECT mime_type, data FROM book_covers WHERE book_id=$1', [id]);
  if (!row) return new Response('Not found', { status: 404 });
  return new Response(row.data, {
    headers: {
      'Content-Type': row.mime_type,
      'Content-Length': String(row.data.length),
      'X-Content-Type-Options': 'nosniff',
      // URL memuat ?v=<timestamp>, jadi aman di-cache lama; ganti gambar = URL baru.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
