'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import LibraryIcon from '@/components/LibraryIcon';
import LogoMark from '@/components/LogoMark';

const LINKS = {
  guest: [['/', 'Beranda'], ['/katalog', 'Katalog'], ['/pengumuman', 'Pengumuman'], ['/tentang', 'Tentang']],
  mahasiswa: [['/', 'Beranda'], ['/katalog', 'Katalog'], ['/mahasiswa', 'Pinjaman Saya'], ['/pengumuman', 'Pengumuman'], ['/tentang', 'Tentang']],
  pegawai: [['/pegawai', 'Dashboard'], ['/pegawai/sirkulasi', 'Sirkulasi'], ['/kelola/buku', 'Kelola Buku'], ['/kelola/pengumuman', 'Pengumuman'], ['/katalog', 'Katalog']],
  admin: [['/admin', 'Dashboard'], ['/admin/pengguna', 'Pengguna'], ['/admin/kategori', 'Kategori'], ['/kelola/buku', 'Buku'], ['/kelola/pengumuman', 'Pengumuman'], ['/admin/transaksi', 'Transaksi']],
};

export default function Navbar({ session: s }) {
  const pathname = usePathname();
  const links = LINKS[s?.role ?? 'guest'];

  const isActive = (href) => {
    if (!pathname) return false;
    return pathname === href;
  };

  const auth = s ? (
    <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:gap-3">
      <span className="text-sm text-cream/90">
        <span className="font-semibold">{s.nama}</span>
        <span className="ml-1 text-xs capitalize text-gold">({s.role})</span>
      </span>
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
        <nav className="hidden items-center gap-5 text-sm xl:flex">
          {links.map(([href, label]) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`nav-link ra-nav-item ${active ? 'ra-nav-item--active' : ''}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden xl:block">{auth}</div>
        <details className="ra-mobile-menu relative xl:hidden">
          <summary className="ra-menu-trigger" aria-label="Buka menu navigasi" title="Menu navigasi">
            <svg className="ra-menu-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className="ra-menu-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </summary>
          <div className="ra-mobile-panel">
            <div className="ra-mobile-heading">
              <span>NAVIGASI UTAMA</span>
              <small>RUANG AKSARA</small>
            </div>
            <nav className="ra-mobile-links" aria-label="Navigasi mobile">
              {links.map(([href, label]) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`ra-mobile-link ${active ? 'ra-mobile-link--active' : ''}`}
                  >
                    {label}<span aria-hidden="true">›</span>
                  </Link>
                );
              })}
            </nav>
            <div className="ra-mobile-account">
              {s && (
                <>
                  <div className="ra-mobile-user">
                    <span className="ra-mobile-avatar">{s.nama?.charAt(0)?.toUpperCase() || 'U'}</span>
                    <span className="min-w-0">
                      <strong className="block truncate text-sm">{s.nama}</strong>
                      <small className="capitalize text-gold">{s.role}</small>
                    </span>
                  </div>
                  {s.role === 'mahasiswa' && (
                    <Link href="/mahasiswa/profil" className="ra-mobile-link ra-profile-link">
                      Profil<span aria-hidden="true">›</span>
                    </Link>
                  )}
                </>
              )}
              {auth}
            </div>
          </div>
        </details>
      </div>
      {( !s || s.role === 'mahasiswa') && <nav className="mobile-dock" aria-label="Navigasi cepat">
        <Link href="/" className={isActive('/') ? 'ra-dock-active' : ''}><LibraryIcon name="layers" />Koleksi</Link>
        <Link href="/katalog" className={isActive('/katalog') ? 'ra-dock-active' : ''}><LibraryIcon name="book" />Katalog</Link>
        <Link href="/pengumuman" className={isActive('/pengumuman') ? 'ra-dock-active' : ''}><LibraryIcon name="news" />Info</Link>
        <Link href={s ? '/mahasiswa' : '/login'} className={isActive(s ? '/mahasiswa' : '/login') ? 'ra-dock-active' : ''}><LibraryIcon name="people" />{s ? 'Pinjaman' : 'Masuk'}</Link>
      </nav>}
      <style jsx global>{`
        .ra-nav-item {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 8px;
          color: rgba(255, 248, 232, 0.88);
          font-weight: 500;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .ra-nav-item:hover {
          color: #f3d488;
          background: rgba(255, 255, 255, 0.08);
        }
        .ra-nav-item--active,
        .ra-nav-item--active:hover {
          color: #162b20 !important;
          background: #e5c16c !important;
          font-weight: 700;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        .ra-dock-active {
          color: #e5c16c !important;
          font-weight: 700;
        }
        .ra-menu-trigger {
          display: flex;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          color: #fff8e8;
          background: #c9a24b;
          border: 1px solid #e6c879;
          border-radius: 10px;
          cursor: pointer;
          list-style: none;
        }
        .ra-menu-trigger::-webkit-details-marker { display: none; }
        .ra-menu-trigger svg { width: 23px; height: 23px; }
        .ra-menu-close { display: none; }
        .ra-mobile-menu[open] .ra-menu-open { display: none; }
        .ra-mobile-menu[open] .ra-menu-close { display: block; }
        .ra-mobile-panel {
          position: absolute;
          top: calc(100% + 11px);
          right: 0;
          z-index: 100;
          width: min(290px, calc(100vw - 28px));
          max-height: min(75vh, 620px);
          overflow-y: auto;
          padding: 16px;
          color: #fff8e8;
          background: linear-gradient(145deg, #254838, #183326);
          border: 1px solid #c9a24b;
          border-radius: 14px;
          box-shadow: 0 15px 35px rgba(0,0,0,.25);
          animation: ra-mobile-menu-in .18s ease-out;
        }
        @keyframes ra-mobile-menu-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ra-mobile-heading {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 2px 3px 12px;
          color: #e8c879;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          border-bottom: 1px solid rgba(201,162,75,.4);
        }
        .ra-mobile-heading small { color: rgba(255,255,255,.6); font-size: 9px; }
        .ra-mobile-links { display: flex; flex-direction: column; gap: 3px; padding: 11px 0; }
        .ra-mobile-link {
          display: flex;
          min-height: 42px;
          align-items: center;
          justify-content: space-between;
          padding: 9px 10px;
          color: #fff8e8 !important;
          font-size: 13px;
          border-radius: 8px;
        }
        .ra-mobile-link:hover { color: #e8c879 !important; background: rgba(255,255,255,.09); }
        .ra-mobile-link--active {
          color: #183326 !important;
          background: #d9b86c !important;
          font-weight: 700;
        }
        .ra-mobile-link--active span { color: #183326 !important; }
        .ra-mobile-link span { color: #d9b86c; font-size: 20px; }
        .ra-mobile-account { padding-top: 12px; border-top: 1px solid rgba(201,162,75,.4); }
        .ra-mobile-user { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .ra-mobile-avatar {
          display: grid;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          place-items: center;
          color: #234232;
          background: #d9b86c;
          border-radius: 50%;
          font-weight: 700;
        }
        .ra-mobile-account form { margin-top: 9px; }
        .ra-mobile-account form button { width: 100%; }
        .ra-menu-trigger:focus-visible, .ra-mobile-link:focus-visible {
          outline: 2px solid #f0d69e;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .ra-mobile-panel { animation: none; }
        }
      `}</style>
    </header>
  );
}