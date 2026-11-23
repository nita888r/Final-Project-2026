import Link from 'next/link';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { registerAction } from '@/app/actions/auth';

export const metadata = { title: 'Daftar – RUANG AKSARA' };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="mb-1 text-3xl">Daftar Mahasiswa</h1>
        <p className="mb-5 text-sm text-ink/70">Gunakan email kampus (berakhiran .ac.id atau .edu). Akun Pegawai dibuat oleh Admin.</p>
        <ActionForm action={registerAction} className="space-y-4">
          <div><label className="label" htmlFor="nama_lengkap">Nama lengkap</label><input id="nama_lengkap" name="nama_lengkap" required className="input" /></div>
          <div><label className="label" htmlFor="email">Email kampus</label><input id="email" name="email" type="email" required className="input" placeholder="nama@student.univ.ac.id" /></div>
          <div><label className="label" htmlFor="nomor_identitas">NIM</label><input id="nomor_identitas" name="nomor_identitas" required maxLength={30} placeholder="Contoh: H071231001" className="input" /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required minLength={6} className="input" /></div>
          <div><label className="label" htmlFor="konfirmasi">Konfirmasi password</label><input id="konfirmasi" name="konfirmasi" type="password" required className="input" /></div>
          <SubmitButton className="btn btn-primary w-full">Buat akun</SubmitButton>
        </ActionForm>
        <p className="mt-4 text-center text-sm">Sudah punya akun? <Link href="/login" className="text-bottle underline">Masuk</Link></p>
      </div>
    </div>
  );
}
