import Link from 'next/link';
import { KONTAK } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gold/60 bg-creamdark/50 py-5 text-center text-sm text-brown">
      <p className="font-display text-base font-semibold">RUANG AKSARA</p>
      <p>Tempat setiap ilmu menemukan pembacanya. Baca · Pinjam · Tumbuh</p>
      <p className="mt-1 text-xs">
        Butuh bantuan atau ingin menjadi Pegawai? Hubungi Admin: <a href={`mailto:${KONTAK.email}`} className="underline">{KONTAK.email}</a>
        {' · '}<Link href="/tentang" className="underline">Tentang & Kontak</Link>
      </p>
    </footer>
  );
}
