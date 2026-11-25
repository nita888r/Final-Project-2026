import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { fmtDate } from '@/lib/utils';
import { TABLE_PAGE_SIZE } from '@/lib/config';
import { pageOf, paginate } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import Badge from '@/components/Badge';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { deleteAnnouncement } from '@/app/actions/announcements';

export const metadata = { title: 'Kelola Pengumuman – RUANG AKSARA' };

export default async function KelolaPengumuman({ searchParams }) {
  await requirePage(['pegawai', 'admin']);
  const resolvedParams = searchParams && typeof searchParams.then === 'function'
    ? await searchParams
    : searchParams;

  const rawStatus = String(resolvedParams?.status ?? '').trim().toLowerCase();
  const status = ['draft', 'published'].includes(rawStatus) ? rawStatus : '';

  const whereClause = `($1::text = '' OR LOWER(TRIM(status)) = $1)`;
  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM announcements WHERE ${whereClause}`, [status]);
  const { page, totalPages, offset } = paginate(total, TABLE_PAGE_SIZE, pageOf(resolvedParams));
  const rows = await query(
    `SELECT id, judul, kategori, tanggal_rilis, status FROM announcements WHERE ${whereClause}
     ORDER BY tanggal_rilis DESC, id DESC LIMIT ${TABLE_PAGE_SIZE} OFFSET $2`, [status, offset]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>Kelola Pengumuman</h1>
        <Link href="/kelola/pengumuman/baru" className="btn btn-green">Buat pengumuman</Link>
      </div>
      <form method="GET" className="flex flex-wrap items-center gap-3">
        <select
          name="status"
          defaultValue={status}
          className="input max-w-md w-full sm:w-96 !py-3.5 !px-4 !text-base"
          aria-label="Filter status"
        >
          <option value="">Semua status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="btn btn-primary !py-3.5 !px-6 !text-base">Filter</button>
      </form>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Judul</th><th>Kategori</th><th>Tanggal rilis</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={5}>Belum ada pengumuman.</td></tr>}
          {rows.map((a) => (
            <tr key={a.id}>
              <td><Link href={`/pengumuman/${a.id}`} className="underline">{a.judul}</Link></td>
              <td className="capitalize">{a.kategori}</td><td>{fmtDate(a.tanggal_rilis)}</td><td><Badge status={a.status} /></td>
              <td>
                <div className="flex items-start gap-2">
                  <Link href={`/kelola/pengumuman/${a.id}/edit`} className="btn btn-outline btn-sm">Ubah</Link>
                  <ActionForm action={deleteAnnouncement}>
                    <input type="hidden" name="id" value={a.id} />
                    <SubmitButton className="btn btn-red btn-sm" confirmText="Hapus pengumuman ini?">Hapus</SubmitButton>
                  </ActionForm>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <Pagination basePath="/kelola/pengumuman" params={{ status }} page={page} totalPages={totalPages} />
    </div>
  );
}