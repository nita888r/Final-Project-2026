import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import CategoryForm from '@/components/CategoryForm';
import { updateCategory } from '@/app/actions/categories';

export default async function KategoriEdit({ params }) {
  await requirePage(['admin']);

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const [item] = await query('SELECT * FROM categories WHERE id=$1', [id]);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-5">Ubah kategori</h1>
      <CategoryForm action={updateCategory} item={item} />
    </div>
  );
}