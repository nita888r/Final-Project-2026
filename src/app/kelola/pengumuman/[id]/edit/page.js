import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import AnnouncementForm from '@/components/AnnouncementForm';
import { updateAnnouncement } from '@/app/actions/announcements';

export default async function PengumumanEdit({ params }) {
  await requirePage(['pegawai', 'admin']);
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [item] = await query('SELECT * FROM announcements WHERE id=$1', [id]);
  if (!item) notFound();
  return (<div className="mx-auto max-w-3xl"><h1 className="mb-5">Ubah pengumuman</h1><AnnouncementForm action={updateAnnouncement} item={item} /></div>);
}
