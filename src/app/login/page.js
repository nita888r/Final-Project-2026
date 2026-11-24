import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import AuthPanel from '@/components/AuthPanel';

export const metadata = {
  title: 'Masuk – RUANG AKSARA'
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    const destination = {
      admin: '/admin',
      pegawai: '/pegawai',
      mahasiswa: '/mahasiswa',
    }[session.role];

    if (destination) redirect(destination);
  }

  return <AuthPanel initialRegister={false} />;
}