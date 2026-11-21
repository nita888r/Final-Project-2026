import Link from 'next/link';
import { getSession } from '@/lib/session';
import { logoutAction } from '@/app/actions/auth';
import LibraryIcon from '@/components/LibraryIcon';
import LogoMark from '@/components/LogoMark';

const LINKS = {
  guest: [['/', 'Beranda'], ['/katalog', 'Katalog'], ['/pengumuman', 'Pengumuman']],
  mahasiswa: [['/', 'Beranda'], ['/katalog', 'Katalog'], ['/mahasiswa', 'Pinjaman Saya'], ['/pengumuman', 'Pengumuman']],
  pegawai: [['/pegawai', 'Dashboard'], ['/pegawai/sirkulasi', 'Sirkulasi'], ['/kelola/buku', 'Kelola Buku'], ['/kelola/pengumuman', 'Pengumuman'], ['/katalog', 'Katalog']],
  admin: [['/admin', 'Dashboard'], ['/admin/pengguna', 'Pengguna'], ['/admin/kategori', 'Kategori'], ['/kelola/buku', 'Buku'], ['/kelola/pengumuman', 'Pengumuman'], ['/admin/transaksi', 'Transaksi']],
};

export default async function Navbar() {
  const s = await getSession();
  const links = LINKS[s?.role ?? 'guest'];

  const auth = s ? (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-cream/80 lg:inline">{s.nama}</span>
      <form action={logoutAction}><button className="btn btn-gold btn-sm">Keluar</button></form>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link href="/login" className="btn nav-login">Masuk</Link>
      <Link href="/register" className="btn btn-gold nav-register">Daftar</Link>
    </div>
  );

  return (
    <header className="site-header border-b-[3px] border-gold bg-brown text-cream">
      <div className="container-page flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark size={40} />
          <span className="font-display text-xl font-bold leading-none tracking-wide text-cream">
            RUANG AKSARA
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm xl:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="nav-link text-cream/90 hover:text-gold">{label}</Link>
          ))}
        </nav>
        <div className="hidden xl:block">{auth}</div>
        <details className="relative xl:hidden">
          <summary className="btn btn-gold btn-sm cursor-pointer list-none">Menu</summary>
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-gold bg-brown p-3 shadow-lg">
            <nav className="flex flex-col gap-2 text-sm">
              {links.map(([href, label]) => (
                <Link key={href} href={href} className="py-1 text-cream hover:text-gold">{label}</Link>
              ))}
            </nav>
            <div className="mt-3 border-t border-gold/40 pt-3">{auth}</div>
          </div>
        </details>
      </div>
      {( !s || s.role === 'mahasiswa') && <nav className="mobile-dock" aria-label="Navigasi cepat">
        <Link href="/"><LibraryIcon name="layers" />Koleksi</Link>
        <Link href="/katalog"><LibraryIcon name="book" />Katalog</Link>
        <Link href="/pengumuman"><LibraryIcon name="news" />Info</Link>
        <Link href={s ? '/mahasiswa' : '/login'}><LibraryIcon name="people" />{s ? 'Pinjaman' : 'Masuk'}</Link>
      </nav>}
    </header>
  );
}
