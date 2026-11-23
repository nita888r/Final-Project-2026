import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { fmtDate } from '@/lib/utils';
import Badge from '@/components/Badge';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { deleteAnnouncement } from '@/app/actions/announcements';

export const metadata = { title: 'Kelola Pengumuman – RUANG AKSARA' };

export default async function KelolaPengumuman() {
  await requirePage(['pegawai', 'admin']);
  const rows = await query('SELECT id, judul, kategori, tanggal_rilis, status FROM announcements ORDER BY tanggal_rilis DESC, id DESC');
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>Kelola Pengumuman</h1>
        <Link href="/kelola/pengumuman/baru" className="btn btn-green">Buat pengumuman</Link>
      </div>
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
    </div>
  );
}
