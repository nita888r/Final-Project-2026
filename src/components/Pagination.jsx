import Link from 'next/link';

// pageParam: nama query string halaman (default "page"); dipakai bila satu halaman punya beberapa tabel.
export default function Pagination({ basePath, params = {}, page, totalPages, pageParam = 'page' }) {
  if (totalPages <= 1) return null;
  const href = (p) => {
    const sp = new URLSearchParams();
    Object.entries({ ...params, [pageParam]: p }).forEach(([k, v]) => {
      if (v !== '' && v != null && !(k === pageParam && p === 1)) sp.set(k, v);
    });
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  return (
    <nav className="!mt-12 flex items-center justify-center gap-3 text-sm" aria-label="Halaman">
      {page > 1 ? <Link className="btn btn-outline btn-sm" href={href(page - 1)}>Sebelumnya</Link> : <span />}
      <span>Halaman {page} dari {totalPages}</span>
      {page < totalPages ? <Link className="btn btn-outline btn-sm" href={href(page + 1)}>Berikutnya</Link> : <span />}
    </nav>
  );
}