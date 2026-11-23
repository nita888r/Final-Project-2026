import { requirePage } from '@/lib/session';
import UserForm from '@/components/UserForm';
import { createUser } from '@/app/actions/users';

export default async function PenggunaBaru() {
  await requirePage(['admin']);
  return (<div className="mx-auto max-w-xl"><h1 className="mb-5">Tambah pengguna</h1><UserForm action={createUser} /></div>);
}
