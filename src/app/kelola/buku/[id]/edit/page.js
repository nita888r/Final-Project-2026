import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import BookForm from '@/components/BookForm';
import { updateBook } from '@/app/actions/books';

export default async function BukuEdit({ params }) {
  await requirePage(['pegawai', 'admin']);

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const [book] = await query('SELECT * FROM books WHERE id=$1', [id]);
  if (!book) notFound();

  const categories = await query(
    'SELECT id, nama_kategori FROM categories ORDER BY nama_kategori'
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-5">Ubah buku</h1>
      <BookForm action={updateBook} book={book} categories={categories} />
    </div>
  );
}