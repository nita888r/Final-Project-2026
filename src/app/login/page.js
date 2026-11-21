import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { loginAction } from '@/app/actions/auth';

export const metadata = { title: 'Masuk – RUANG AKSARA' };

export default async function LoginPage() {
  const s = await getSession();
  if (s) redirect({ admin: '/admin', pegawai: '/pegawai', mahasiswa: '/mahasiswa' }[s.role]);
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="mb-1 text-3xl">Masuk</h1>
        <p className="mb-5 text-sm text-ink/70">Untuk Admin, Pegawai, dan Mahasiswa.</p>
        <ActionForm action={loginAction} className="space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="input" autoComplete="email" /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required className="input" autoComplete="current-password" /></div>
          <SubmitButton className="btn btn-primary w-full">Masuk</SubmitButton>
        </ActionForm>
        <div className="rule-gold my-5" />
        <Link href="/katalog" className="btn btn-outline w-full">Continue as Guest</Link>
        <p className="mt-4 text-center text-sm">Belum punya akun? <Link href="/register" className="text-bottle underline">Daftar sebagai Mahasiswa</Link></p>
      </div>
    </div>
  );
}
