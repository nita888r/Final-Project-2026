import Link from 'next/link';
import BookCover from '@/components/BookCover';
import Stars from '@/components/Stars';

export default function BookCard({ b, showCount }) {
  return (
    <Link href={`/buku/${b.id}`} className="book-card card flex flex-col">
      <div className="book-cover-frame"><BookCover src={b.sampul} title={b.judul} className="aspect-[4/5] w-full" /></div>
      <div className="flex flex-1 flex-col gap-1 px-2 pb-2 pt-3">
        <h3 className="line-clamp-2 text-base leading-snug">{b.judul}</h3>
        <p className="text-xs text-ink/70">{b.pengarang}</p>
        {b.nama_kategori && <span className="badge w-fit bg-gold/25 text-brown">{b.nama_kategori}</span>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-1 pt-3 text-xs">
          <Stars value={b.rata_rating} />
          <span className={b.stok_tersedia > 0 ? 'text-bottle' : 'text-brick'}>
            {b.stok_tersedia > 0 ? `Stok ${b.stok_tersedia}` : 'Stok habis'}
          </span>
        </div>
        {showCount && <p className="text-xs text-brown">{b.total_pinjam}x dipinjam</p>}
      </div>
    </Link>
  );
}
