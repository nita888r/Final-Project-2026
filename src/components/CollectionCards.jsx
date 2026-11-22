import Link from 'next/link';
import BookCover from '@/components/BookCover';
import LibraryIcon from '@/components/LibraryIcon';

export default function CollectionCards({ categories, books }) {
  return <div className="collection-grid">{categories.map(c => <Link key={c.id} href={`/katalog?kategori=${c.id}`} className="collection-tile">
    <div className="collection-meta"><LibraryIcon name="layers" /><span>Koleksi</span><span className="ml-auto">{c.total} buku</span></div>
    <h3>{c.nama_kategori}</h3><p>Jelajahi koleksi pilihan</p>
    <div className="collection-covers">{books.filter(b => String(b.category_id) === String(c.id)).map(b => <BookCover key={b.id} src={b.sampul} title={b.judul} className="collection-cover" />)}</div>
  </Link>)}</div>;
}
