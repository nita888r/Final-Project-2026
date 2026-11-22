import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import BookForm from '@/components/BookForm';
import { createBook } from '@/app/actions/books';

export default async function BukuBaru() {
  await requirePage(['pegawai', 'admin']);
  const categories = await query('SELECT id, nama_kategori FROM categories ORDER BY nama_kategori');
  return (<div className="mx-auto max-w-3xl"><h1 className="mb-5">Tambah buku</h1><BookForm action={createBook} categories={categories} /></div>);
}
