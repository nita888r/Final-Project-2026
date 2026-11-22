'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LibraryIcon from '@/components/LibraryIcon';

// Pencarian cepat: memanggil Route Handler GET /api/books/search
export default function QuickSearch() {
  const [q, setQ] = useState('');
  const [hasil, setHasil] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (q.trim().length < 2) { setHasil([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(q.trim())}`);
        if (res.ok) setHasil(await res.json());
      } catch { setHasil([]); }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative">
      <form onSubmit={(e) => { e.preventDefault(); router.push(`/katalog?q=${encodeURIComponent(q.trim())}`); }} className="quick-search-form">
        <LibraryIcon name="search" className="search-icon" />
        <input value={q} onChange={(e) => setQ(e.target.value)} className="input" placeholder="Cari judul atau pengarang..." aria-label="Cari buku" />
        <button className="btn btn-primary">Cari</button>
      </form>
      {hasil.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-gold bg-cream shadow-lg">
          {hasil.map((b) => (
            <li key={b.id}>
              <Link href={`/buku/${b.id}`} className="block px-3 py-2 text-sm hover:bg-creamdark">
                <span className="font-medium text-brown">{b.judul}</span>
                <span className="ml-2 text-xs text-ink/60">{b.pengarang}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
