import Link from 'next/link';
import { query } from '@/lib/db';
import { fmtDate } from '@/lib/utils';
import BookShelf from '@/components/BookShelf';
import CollectionCards from '@/components/CollectionCards';
import QuickSearch from '@/components/QuickSearch';
import LibraryIcon from '@/components/LibraryIcon';

export default async function Home() {
  // 5 buku terpopuler: JOIN + COUNT + GROUP BY
  const populer = await query(
    `SELECT b.id, b.judul, b.pengarang, b.sampul, b.stok_tersedia, c.nama_kategori,
            COUNT(l.id) AS total_pinjam,
            COALESCE((SELECT ROUND(AVG(r.rating),1) FROM reviews r WHERE r.book_id=b.id),0) AS rata_rating
     FROM books b
     JOIN loans l ON l.book_id = b.id
     JOIN categories c ON c.id = b.category_id
     WHERE l.status IN ('sedang_dipinjam','selesai')
     GROUP BY b.id, c.nama_kategori
     ORDER BY total_pinjam DESC, b.judul
     LIMIT 5`
  );
  const pengumuman = await query(
    `SELECT id, judul, konten, kategori, tanggal_rilis FROM announcements
     WHERE status='published' AND tanggal_rilis <= CURRENT_DATE
     ORDER BY tanggal_rilis DESC, id DESC LIMIT 3`
  );

  const categories = await query(`SELECT c.id, c.nama_kategori, COUNT(b.id) AS total FROM categories c LEFT JOIN books b ON b.category_id=c.id GROUP BY c.id, c.nama_kategori ORDER BY c.nama_kategori`);
  const previews = await query(`SELECT id, judul, sampul, category_id FROM (SELECT id, judul, sampul, category_id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY id) AS rn FROM books) ranked WHERE rn <= 3 ORDER BY category_id, rn`);

  return (
    <div className="home-page space-y-12">
      <section className="collection-intro">
        <p className="collection-kicker">RUANG AKSARA · PERPUSTAKAAN DIGITAL</p>
        <h1>Dunia ilmu, <em>dalam genggaman.</em></h1>
        <p>Temukan bacaan yang menemani perjalanan ilmumu.</p>
        <div className="collection-search"><QuickSearch /></div>
        <div className="hero-catalog-link"><Link href="/katalog">Jelajahi katalog <span aria-hidden="true">↗</span></Link><span>{categories.length} kategori bacaan</span></div>
      </section>
      <section className="home-section">
        <div className="section-heading"><h2>Semua koleksi</h2><Link href="/katalog" className="section-link">Lihat semua <LibraryIcon name="arrow" /></Link></div>
        <CollectionCards categories={categories} books={previews} />
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2><LibraryIcon name="book" /> Buku Terpopuler</h2>
          <Link href="/katalog" className="section-link">Lihat seluruh koleksi <LibraryIcon name="arrow" /></Link>
        </div>
        {populer.length === 0 ? (
          <p className="card text-sm">Belum ada data peminjaman. Buku terpopuler akan muncul setelah ada transaksi.</p>
        ) : (
          <BookShelf books={populer} />
        )}
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2><LibraryIcon name="news" /> Pengumuman Terbaru</h2>
          <Link href="/pengumuman" className="section-link">Semua pengumuman <LibraryIcon name="arrow" /></Link>
        </div>
        {pengumuman.length === 0 ? (
          <p className="card text-sm">Belum ada pengumuman yang dipublikasikan.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {pengumuman.map((a) => (
              <Link key={a.id} href={`/pengumuman/${a.id}`} className="card block transition hover:border-gold">
                <span className="badge bg-gold/30 text-brown capitalize">{a.kategori}</span>
                <h3 className="mt-2">{a.judul}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-ink/80">{a.konten}</p>
                <p className="mt-3 text-xs text-ink/60">{fmtDate(a.tanggal_rilis)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
