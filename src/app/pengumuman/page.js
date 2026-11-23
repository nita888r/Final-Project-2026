import Link from 'next/link';
import { query } from '@/lib/db';
import { fmtDate } from '@/lib/utils';

export const metadata = { title: 'Pengumuman – RUANG AKSARA' };

export default async function PengumumanList() {
  const rows = await query(
    `SELECT id, judul, konten, kategori, tanggal_rilis FROM announcements
     WHERE status='published' AND tanggal_rilis <= CURRENT_DATE ORDER BY tanggal_rilis DESC, id DESC`
  );
  return (
    <div>
      <h1 className="mb-5">Pengumuman</h1>
      {rows.length === 0 ? <p className="card">Belum ada pengumuman.</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((a) => (
            <Link key={a.id} href={`/pengumuman/${a.id}`} className="card block transition hover:border-gold">
              <span className="badge bg-gold/30 capitalize text-brown">{a.kategori}</span>
              <h3 className="mt-2">{a.judul}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink/80">{a.konten}</p>
              <p className="mt-3 text-xs text-ink/60">{fmtDate(a.tanggal_rilis)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
