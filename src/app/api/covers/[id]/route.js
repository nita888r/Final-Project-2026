import { queryOne } from '@/lib/db';

// Menyajikan gambar sampul langsung dari PostgreSQL.
// Publik: katalog dapat dilihat tanpa login.
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return new Response('Not found', { status: 404 });
  }

  const row = await queryOne(
    `SELECT mime_type, data
     FROM book_covers
     WHERE book_id = $1`,
    [id]
  );

  if (!row) {
    return new Response('Not found', { status: 404 });
  }

  const data = Buffer.isBuffer(row.data)
    ? row.data
    : Buffer.from(row.data);

  return new Response(data, {
    headers: {
      'Content-Type': row.mime_type,
      'Content-Length': String(data.length),
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}