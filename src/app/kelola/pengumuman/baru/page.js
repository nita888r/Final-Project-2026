import { requirePage } from '@/lib/session';
import AnnouncementForm from '@/components/AnnouncementForm';
import { createAnnouncement } from '@/app/actions/announcements';

export default async function PengumumanBaru() {
  await requirePage(['pegawai', 'admin']);
  return (<div className="mx-auto max-w-3xl"><h1 className="mb-5">Buat pengumuman</h1><AnnouncementForm action={createAnnouncement} /></div>);
}
