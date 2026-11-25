import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { TABLE_PAGE_SIZE } from '@/lib/config';
import { pageOf, paginate } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import CategoryForm from '@/components/CategoryForm';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { createCategory, deleteCategory } from '@/app/actions/categories';

export const metadata = { title: 'Kelola Kategori – RUANG AKSARA' };

export default async function Kategori({ searchParams }) {
  await requirePage(['admin']);
  const sp = await searchParams;
  const [{ total }] = await query('SELECT COUNT(*) AS total FROM categories');
  const { page, totalPages, offset } = paginate(total, TABLE_PAGE_SIZE, pageOf(sp));
  const rows = await query(
    `SELECT c.*, COUNT(b.id) AS jumlah_buku FROM categories c LEFT JOIN books b ON b.category_id=c.id
     GROUP BY c.id ORDER BY c.nama_kategori LIMIT ${TABLE_PAGE_SIZE} OFFSET $1`, [offset]
  );
  return (
    <div className="space-y-6">
      <h1>Kelola Kategori</h1>
      <section><h2 className="mb-3 text-xl">Tambah kategori</h2><CategoryForm action={createCategory} /></section>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Nama</th><th>Kode</th><th>Deskripsi</th><th>Jumlah buku</th><th>Aksi</th></tr></thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td className="font-medium">{c.nama_kategori}</td><td>{c.kode_klasifikasi}</td><td>{c.deskripsi ?? '-'}</td><td>{c.jumlah_buku}</td>
              <td>
                <div className="flex items-start gap-2">
                  <Link href={`/admin/kategori/${c.id}`} className="btn btn-outline btn-sm">Ubah</Link>
                  <ActionForm action={deleteCategory}>
                    <input type="hidden" name="id" value={c.id} />
                    <SubmitButton className="btn btn-red btn-sm" confirmText={`Hapus kategori ${c.nama_kategori}?`}>Hapus</SubmitButton>
                  </ActionForm>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <Pagination basePath="/admin/kategori" page={page} totalPages={totalPages} />
    </div>
  );
}
