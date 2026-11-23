import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { fmtDate } from '@/lib/utils';
import Badge from '@/components/Badge';

export default async function PengumumanDetail({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [a] = await query(
    `SELECT a.*, u.nama_lengkap FROM announcements a LEFT JOIN users u ON u.id=a.created_by WHERE a.id=$1`, [id]
  );
  const s = await getSession();
  const staff = s && ['pegawai', 'admin'].includes(s.role);
  if (!a || (a.status !== 'published' && !staff)) notFound();
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/pengumuman" className="text-sm text-bottle underline">Kembali ke pengumuman</Link>
      <div className="card mt-3">
        <div className="flex items-center gap-2">
          <span className="badge bg-gold/30 capitalize text-brown">{a.kategori}</span>
          {a.status !== 'published' && <Badge status={a.status} />}
        </div>
        <h1 className="mt-3">{a.judul}</h1>
        <p className="mt-1 text-sm text-ink/60">Terbit {fmtDate(a.tanggal_rilis)}{a.nama_lengkap ? ` oleh ${a.nama_lengkap}` : ''}</p>
        <div className="rule-gold my-4" />
        <p className="whitespace-pre-line leading-relaxed">{a.konten}</p>
      </div>
    </article>
  );
}
