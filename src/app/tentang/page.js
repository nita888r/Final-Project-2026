import Link from 'next/link';
import { KONTAK } from '@/lib/config';

export const metadata = { title: 'Tentang & Kontak – RUANG AKSARA' };

export default function Tentang() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs tracking-widest text-bottle">PERPUSTAKAAN DIGITAL</p>
        <h1>Tentang RUANG AKSARA</h1>
        <p className="mt-2 text-ink/80">
          RUANG AKSARA adalah sistem manajemen perpustakaan kampus untuk menelusuri katalog, mengajukan peminjaman,
          memperpanjang masa pinjam, memantau denda, serta memberi rating dan ulasan. Tempat setiap ilmu menemukan pembacanya.
        </p>
      </div>

      <section className="card space-y-2">
        <h2>Cara meminjam buku</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>Daftar sebagai Mahasiswa dengan email kampus (.ac.id / .edu), lalu masuk.</li>
          <li>Buka detail buku dan tekan <strong>Ajukan Pinjam</strong>.</li>
          <li>Datang ke meja sirkulasi; Pegawai akan menyetujui atau menolak pengajuan.</li>
          <li>Kembalikan buku sebelum jatuh tempo. Keterlambatan dikenai denda per hari sesuai tarif buku.</li>
        </ol>
      </section>

      <section className="card space-y-2">
        <h2>Kontak Admin</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex gap-2"><dt className="w-28 shrink-0 text-brown">Email</dt><dd><a className="underline" href={`mailto:${KONTAK.email}`}>{KONTAK.email}</a></dd></div>
          {KONTAK.telepon && <div className="flex gap-2"><dt className="w-28 shrink-0 text-brown">Telepon</dt><dd>{KONTAK.telepon}</dd></div>}
          <div className="flex gap-2"><dt className="w-28 shrink-0 text-brown">Lokasi</dt><dd>{KONTAK.lokasi}</dd></div>
          <div className="flex gap-2"><dt className="w-28 shrink-0 text-brown">Jam layanan</dt><dd>{KONTAK.jam}</dd></div>
        </dl>
      </section>

      <section className="card space-y-2">
        <h2>Ingin menjadi Pegawai Perpustakaan?</h2>
        <p className="text-sm">
          Pendaftaran mandiri hanya untuk akun Mahasiswa. Akun Pegawai dibuat oleh Admin, jadi silakan hubungi Admin
          melalui kontak di atas dan sertakan nama lengkap, email, serta nomor identitas (NIP).
        </p>
        <div className="pt-1"><Link href="/katalog" className="btn btn-primary">Jelajahi katalog</Link></div>
      </section>
    </div>
  );
}
