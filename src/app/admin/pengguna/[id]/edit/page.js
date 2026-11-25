import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import UserForm from '@/components/UserForm';
import { updateUser } from '@/app/actions/users';

export default async function PenggunaEdit({ params }) {
  await requirePage(['admin']);

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const [user] = await query(
    `SELECT id, nama_lengkap, email, nomor_identitas, role, is_active
     FROM users WHERE id=$1`,
    [id]
  );
  if (!user) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-5">Ubah pengguna</h1>
      <UserForm action={updateUser} user={user} />
    </div>
  );
}