import Link from 'next/link';
import BookShelf from '@/components/BookShelf';
import { query } from '@/lib/db';
import { PAGE_SIZE } from '@/lib/config';
import BookCard from '@/components/BookCard';
import Pagination from '@/components/Pagination';

export const metadata = { title: 'Katalog – RUANG AKSARA' };

const SORTS = {
  terbaru: ['Tahun terbit terbaru', 'b.tahun_terbit DESC, b.judul'],
  terlama: ['Tahun terbit terlama', 'b.tahun_terbit ASC, b.judul'],
  rating: ['Rating tertinggi', 'rata_rating DESC, b.judul'],
  judul: ['Judul A-Z', 'b.judul ASC'],
};

export default async function Katalog({ searchParams }) {
  const search = await searchParams;
  const q = (search.q ?? '').trim();
  const kategori = Number.isInteger(Number(search.kategori)) && search.kategori ? Number(search.kategori) : null;
  const sort = SORTS[search.sort] ? search.sort : 'terbaru';
  const page = Math.max(1, parseInt(search.page ?? '1', 10) || 1);

  const where = `($1::text = '' OR b.judul ILIKE $2 OR b.pengarang ILIKE $2) AND ($3::bigint IS NULL OR b.category_id = $3)`;
  const params = [q, `%${q}%`, kategori];

  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM books b WHERE ${where}`, params);
  const books = await query(
    `SELECT b.id, b.judul, b.pengarang, b.sampul, b.stok_tersedia, b.tahun_terbit, c.nama_kategori,
            COALESCE(ROUND(AVG(r.rating),1),0) AS rata_rating
     FROM books b JOIN categories c ON c.id=b.category_id LEFT JOIN reviews r ON r.book_id=b.id
     WHERE ${where}
     GROUP BY b.id, c.nama_kategori
     ORDER BY ${SORTS[sort][1]}
     LIMIT ${PAGE_SIZE} OFFSET $4`,
    [...params, (page - 1) * PAGE_SIZE]
  );
  const categories = await query('SELECT id, nama_kategori FROM categories ORDER BY nama_kategori');

  const selected = categories.find(c => Number(c.id) === kategori);
  const shelf = await query(`SELECT b.id, b.judul, b.sampul FROM books b LEFT JOIN loans l ON l.book_id=b.id AND l.status IN ('sedang_dipinjam','selesai') WHERE ${where} GROUP BY b.id ORDER BY COUNT(l.id) DESC, b.judul LIMIT 5`, params);
  return (
    <div className="catalog-page">
      <Link href="/" className="collection-back">← Semua koleksi</Link>
      <div className="collection-intro"><h1>{selected?.nama_kategori || 'Katalog Buku'}</h1><p>Temukan bacaan favoritmu.</p></div>
      <form className="card mb-6 grid gap-3 md:grid-cols-[1fr_200px_200px_auto]">
        <input name="q" defaultValue={q} className="input" placeholder="Judul atau pengarang" aria-label="Cari" />
        <select name="kategori" defaultValue={kategori ?? ''} className="input" aria-label="Kategori">
          <option value="">Semua kategori</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.nama_kategori}</option>)}
        </select>
        <select name="sort" defaultValue={sort} className="input" aria-label="Urutkan">
          {Object.entries(SORTS).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
        </select>
        <button className="btn btn-primary">Terapkan</button>
      </form>
      {shelf.length > 0 && <section className="catalog-shelf"><h2>Rak buku pilihan</h2><BookShelf books={shelf} /></section>}
      <p className="mb-3 text-sm text-ink/70">{total} buku ditemukan</p>
      {books.length === 0 ? (
        <p className="card">Tidak ada buku yang cocok. Coba kata kunci atau kategori lain.</p>
      ) : (
        <div className="catalog-grid grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => <BookCard key={b.id} b={b} />)}
        </div>
      )}
      <Pagination basePath="/katalog" params={{ q, kategori: kategori ?? '', sort }} page={page} totalPages={Math.ceil(total / PAGE_SIZE)} />
    </div>
  );
}
