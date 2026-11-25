'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CatalogFilterForm({
  initialQ = '',
  initialKategori = '',
  initialSort = 'terbaru',
  categories = [],
  sorts = {},
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [kategori, setKategori] = useState(initialKategori ? String(initialKategori) : '');
  const [sort, setSort] = useState(initialSort || 'terbaru');

  function applyFilter(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (kategori) params.set('kategori', kategori);
    if (sort) params.set('sort', sort);

    const qs = params.toString();
    router.push(qs ? `/katalog?${qs}` : '/katalog');
    router.refresh();
  }

  return (
    <form
      onSubmit={applyFilter}
      className="card mb-6 p-4 grid gap-3 md:grid-cols-[1fr_200px_210px_auto] items-center"
    >
      <input
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="input !py-2.5 !px-3.5 !text-sm"
        placeholder="Judul atau pengarang"
        aria-label="Cari"
      />
      <select
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="input !py-2.5 !px-3.5 !text-sm"
        aria-label="Kategori"
      >
        <option value="">Semua kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.nama_kategori}
          </option>
        ))}
      </select>
      <select
        name="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="input !py-2.5 !px-3.5 !text-sm"
        aria-label="Urutkan"
      >
        {Object.entries(sorts).map(([k, [label]]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={applyFilter}
        className="btn btn-primary !py-2.5 !px-5 !text-sm"
      >
        Terapkan
      </button>
    </form>
  );
}