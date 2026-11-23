import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { PAGE_SIZE } from '@/lib/config';
import { rupiah } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { deleteBook } from '@/app/actions/books';

export const metadata = { title: 'Kelola Buku – RUANG AKSARA' };

export default async function KelolaBuku({ searchParams }) {
  await requirePage(['pegawai', 'admin']);
  const q = (searchParams.q ?? '').trim();
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const where = `($1::text = '' OR b.judul ILIKE $2 OR b.pengarang ILIKE $2 OR b.isbn ILIKE $2)`;
  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM books b WHERE ${where}`, [q, `%${q}%`]);
  const books = await query(
    `SELECT b.*, c.nama_kategori FROM books b JOIN categories c ON c.id=b.category_id
     WHERE ${where} ORDER BY b.judul LIMIT ${PAGE_SIZE} OFFSET $3`, [q, `%${q}%`, (page - 1) * PAGE_SIZE]
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>Kelola Buku</h1>
        <Link href="/kelola/buku/baru" className="btn btn-green">Tambah buku</Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} className="input" placeholder="Cari judul, pengarang, atau ISBN" aria-label="Cari buku" />
        <button className="btn btn-primary">Cari</button>
      </form>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Judul</th><th>Kategori</th><th>ISBN</th><th>Stok total</th><th>Tersedia</th><th>Denda/hari</th><th>Aksi</th></tr></thead>
        <tbody>
          {books.length === 0 && <tr><td colSpan={7}>Tidak ada buku.</td></tr>}
          {books.map((b) => (
            <tr key={b.id}>
              <td><div className="font-medium">{b.judul}</div><div className="text-xs text-ink/60">{b.pengarang}</div></td>
              <td>{b.nama_kategori}</td><td>{b.isbn}</td><td>{b.stok_total}</td><td>{b.stok_tersedia}</td><td>{rupiah(b.denda_per_hari)}</td>
              <td>
                <div className="flex items-start gap-2">
                  <Link href={`/kelola/buku/${b.id}/edit`} className="btn btn-outline btn-sm">Ubah</Link>
                  <ActionForm action={deleteBook}>
                    <input type="hidden" name="id" value={b.id} />
                    <SubmitButton className="btn btn-red btn-sm" confirmText={`Hapus buku "${b.judul}"?`}>Hapus</SubmitButton>
                  </ActionForm>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <Pagination basePath="/kelola/buku" params={{ q }} page={page} totalPages={Math.ceil(total / PAGE_SIZE)} />
    </div>
  );
}
