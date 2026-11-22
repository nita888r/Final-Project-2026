import Link from 'next/link';

export default function Pagination({ basePath, params = {}, page, totalPages }) {
  if (totalPages <= 1) return null;
  const href = (p) => {
    const sp = new URLSearchParams();
    Object.entries({ ...params, page: p }).forEach(([k, v]) => { if (v) sp.set(k, v); });
    return `${basePath}?${sp.toString()}`;
  };
  return (
    <nav className="mt-6 flex items-center justify-center gap-3 text-sm" aria-label="Halaman">
      {page > 1 ? <Link className="btn btn-outline btn-sm" href={href(page - 1)}>Sebelumnya</Link> : <span />}
      <span>Halaman {page} dari {totalPages}</span>
      {page < totalPages ? <Link className="btn btn-outline btn-sm" href={href(page + 1)}>Berikutnya</Link> : <span />}
    </nav>
  );
}
