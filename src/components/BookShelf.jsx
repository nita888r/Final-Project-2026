import Link from 'next/link';
import BookCover from '@/components/BookCover';
export default function BookShelf({ books }) {
  return <div className="shelf-scroll" tabIndex={0} aria-label="Rak buku, geser untuk melihat koleksi"><div className="shelf-track">{books.map(b => <Link key={b.id} href={`/buku/${b.id}`} className="shelf-book" title={b.judul}><BookCover src={b.sampul} title={b.judul} className="shelf-cover" /></Link>)}</div></div>;
}
