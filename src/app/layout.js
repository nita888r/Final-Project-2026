import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import { Suspense } from 'react';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/session';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
});

export const metadata = {
  title: 'RUANG AKSARA – Perpustakaan Digital',
  description: 'Tempat setiap ilmu menemukan pembacanya.',
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="id" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col">

        <Navbar session={session} />

        <Suspense fallback={null}>
          <Toast />
        </Suspense>

        <main className="container-page flex-1 py-8">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}