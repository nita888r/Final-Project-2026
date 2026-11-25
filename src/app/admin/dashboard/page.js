import Link from 'next/link';
import {pool} from '@/lib/db'; // Sesuaikan path helper koneksi PostgreSQL/DB jika berbeda

async function getDashboardSummary() {
  const summary = {
    usersTotal: 0,
    usersActive: 0,
    usersBlocked: 0,
    categoriesTotal: 0,
    booksTotal: 0,
    booksStockTotal: 0,
    booksOutOfStock: 0,
    loansActive: 0,
    loansOverdue: 0,
    finesUnpaid: 0,
    announcementsActive: 0,
    reviewsTotal: 0,
    recentLoans: [],
    lowStockBooks: [],
  };

  try {
    // Sesuaikan nama tabel/kolom jika di skema DB Anda berbeda
    const [
      usersRes,
      categoriesRes,
      booksRes,
      loansRes,
      announcementsRes,
      recentLoansRes,
      lowStockRes,
    ] = await Promise.allSettled([
      pool.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE COALESCE(status, 'aktif') = 'aktif')::int AS aktif,
          COUNT(*) FILTER (WHERE COALESCE(is_blocked, false) = true OR status = 'diblokir')::int AS terblokir
        FROM users
      `),
      pool.query(`SELECT COUNT(*)::int AS total FROM categories`),
      pool.query(`
        SELECT
          COUNT(*)::int AS total_judul,
          COALESCE(SUM(stok), 0)::int AS total_stok,
          COUNT(*) FILTER (WHERE COALESCE(stok, 0) <= 0)::int AS habis
        FROM books
      `),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('dipinjam', 'diperpanjang', 'aktif'))::int AS aktif,
          COUNT(*) FILTER (WHERE status = 'terlambat' OR (status IN ('dipinjam', 'diperpanjang') AND tanggal_jatuh_tempo < CURRENT_DATE))::int AS terlambat,
          COALESCE(SUM(COALESCE(denda, 0)) FILTER (WHERE COALESCE(status_denda, 'belum_lunas') <> 'lunas'), 0)::bigint AS denda_belum_lunas
        FROM loans
      `),
      pool.query(`SELECT COUNT(*)::int AS total FROM announcements`),
      pool.query(`
        SELECT
          l.id,
          COALESCE(u.nama, u.name, 'Anggota') AS nama_anggota,
          COALESCE(b.judul, b.title, 'Buku') AS judul_buku,
          COALESCE(l.status, 'dipinjam') AS status
        FROM loans l
        LEFT JOIN users u ON u.id = l.user_id
        LEFT JOIN books b ON b.id = l.book_id
        ORDER BY l.id DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT
          id,
          COALESCE(judul, title, 'Tanpa Judul') AS judul,
          COALESCE(stok, 0)::int AS stok
        FROM books
        WHERE COALESCE(stok, 0) <= 2
        ORDER BY stok ASC, id ASC
        LIMIT 5
      `),
    ]);

    if (usersRes.status === 'fulfilled' && usersRes.value.rows[0]) {
      summary.usersTotal = usersRes.value.rows[0].total ?? 0;
      summary.usersActive = usersRes.value.rows[0].aktif ?? 0;
      summary.usersBlocked = usersRes.value.rows[0].terblokir ?? 0;
    }

    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.rows[0]) {
      summary.categoriesTotal = categoriesRes.value.rows[0].total ?? 0;
    }

    if (booksRes.status === 'fulfilled' && booksRes.value.rows[0]) {
      summary.booksTotal = booksRes.value.rows[0].total_judul ?? 0;
      summary.booksStockTotal = booksRes.value.rows[0].total_stok ?? 0;
      summary.booksOutOfStock = booksRes.value.rows[0].habis ?? 0;
    }

    if (loansRes.status === 'fulfilled' && loansRes.value.rows[0]) {
      summary.loansActive = loansRes.value.rows[0].aktif ?? 0;
      summary.loansOverdue = loansRes.value.rows[0].terlambat ?? 0;
      summary.finesUnpaid = Number(loansRes.value.rows[0].denda_belum_lunas ?? 0);
    }

    if (announcementsRes.status === 'fulfilled' && announcementsRes.value.rows[0]) {
      summary.announcementsActive = announcementsRes.value.rows[0].total ?? 0;
    }

    if (recentLoansRes.status === 'fulfilled') {
      summary.recentLoans = recentLoansRes.value.rows ?? [];
    }

    if (lowStockRes.status === 'fulfilled') {
      summary.lowStockBooks = lowStockRes.value.rows ?? [];
    }
  } catch (err) {
    console.error('Gagal memuat ringkasan dashboard:', err);
  }

  return summary;
}

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default async function AdminDashboardPage() {
  const data = await getDashboardSummary();

  const masterCards = [
    {
      label: 'Master Pengguna',
      value: data.usersTotal,
      unit: 'akun terdaftar',
      meta: `${data.usersActive} aktif · ${data.usersBlocked} diblokir`,
      href: '/admin/pengguna',
      actionLabel: 'Kelola Pengguna →',
    },
    {
      label: 'Master Kategori',
      value: data.categoriesTotal,
      unit: 'kategori buku',
      meta: 'Klasifikasi & rak koleksi',
      href: '/admin/kategori',
      actionLabel: 'Kelola Kategori →',
    },
    {
      label: 'Master Buku',
      value: data.booksTotal,
      unit: 'judul buku',
      meta: `${data.booksStockTotal} eksemplar · ${data.booksOutOfStock} stok habis`,
      href: '/buku',
      actionLabel: 'Kelola Buku →',
    },
    {
      label: 'Transaksi Aktif',
      value: data.loansActive,
      unit: 'peminjaman berjalan',
      meta: `${data.loansOverdue} terlambat · Denda ${formatRupiah(data.finesUnpaid)}`,
      href: '/admin/transaksi',
      actionLabel: 'Kelola Transaksi →',
    },
    {
      label: 'Pengumuman',
      value: data.announcementsActive,
      unit: 'informasi terbit',
      meta: 'Pemberitahuan anggota & layanan',
      href: '/admin/pengumuman',
      actionLabel: 'Kelola Pengumuman →',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 text-[#4A2F1D]">
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#C9A24B]/50 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2F4F3E]">
            Ruang Aksara · Ringkasan Operasional Pegawai
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#4A2F1D]">
            Dashboard Pegawai &amp; Administrator
          </h1>
          <p className="mt-1 text-sm text-[#4A2F1D]/75">
            Ringkasan master data, ketersediaan koleksi, status sirkulasi, dan tindak lanjut harian.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/pengguna/baru"
            className="rounded-lg border border-[#2F4F3E] bg-[#2F4F3E] px-3.5 py-2 text-xs font-semibold text-[#F5ECD9] transition hover:opacity-90"
          >
            + Tambah Pengguna
          </Link>
          <Link
            href="/admin/transaksi"
            className="rounded-lg border border-[#C9A24B] px-3.5 py-2 text-xs font-semibold text-[#4A2F1D] transition hover:bg-[#C9A24B]/15"
          >
            Cek Transaksi &amp; Denda
          </Link>
        </div>
      </div>

      {/* Ringkasan Master Data Utama */}
      <section aria-label="Ringkasan Master Data" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {masterCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col justify-between rounded-xl border border-[#C9A24B]/60 p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2F4F3E]">
                  {card.label}
                </span>
                <span className="text-xs text-[#4A2F1D]/65">{card.unit}</span>
              </div>

              <p className="mt-3 font-serif text-3xl font-bold text-[#4A2F1D]">
                {card.value}
              </p>

              <p className="mt-1.5 text-xs font-medium text-[#4A2F1D]/80">
                {card.meta}
              </p>
            </div>

            <div className="mt-4 border-t border-[#C9A24B]/30 pt-3">
              <Link
                href={card.href}
                className="text-xs font-semibold text-[#2F4F3E] underline-offset-4 hover:underline"
              >
                {card.actionLabel}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Panel Tindak Lanjut Pegawai: Transaksi Terbaru & Stok Menipis/Habis */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#C9A24B]/60 p-5">
          <div className="mb-4 flex items-center justify-between border-b border-[#C9A24B]/35 pb-2.5">
            <h2 className="font-serif text-lg font-bold text-[#4A2F1D]">
              Transaksi Peminjaman Terbaru
            </h2>
            <Link href="/admin/transaksi" className="text-xs font-semibold text-[#2F4F3E] hover:underline">
              Lihat semua →
            </Link>
          </div>

          {data.recentLoans.length === 0 ? (
            <p className="text-sm text-[#4A2F1D]/70">
              Belum ada transaksi terbaru atau data transaksi belum tersedia.
            </p>
          ) : (
            <ul className="divide-y divide-[#C9A24B]/30 text-sm">
              {data.recentLoans.map((loan) => (
                <li key={loan.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="font-semibold text-[#4A2F1D]">{loan.judul_buku}</p>
                    <p className="text-xs text-[#4A2F1D]/75">Peminjam: {loan.nama_anggota}</p>
                  </div>
                  <span className="rounded-md border border-[#2F4F3E]/40 px-2.5 py-0.5 text-xs font-semibold uppercase text-[#2F4F3E]">
                    {loan.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-[#C9A24B]/60 p-5">
          <div className="mb-4 flex items-center justify-between border-b border-[#C9A24B]/35 pb-2.5">
            <h2 className="font-serif text-lg font-bold text-[#4A2F1D]">
              Perhatian Stok Buku (≤ 2 Eksemplar)
            </h2>
            <Link href="/buku" className="text-xs font-semibold text-[#2F4F3E] hover:underline">
              Kelola stok →
            </Link>
          </div>

          {data.lowStockBooks.length === 0 ? (
            <p className="text-sm text-[#4A2F1D]/70">
              Seluruh judul buku memiliki stok aman di atas 2 eksemplar.
            </p>
          ) : (
            <ul className="divide-y divide-[#C9A24B]/30 text-sm">
              {data.lowStockBooks.map((book) => (
                <li key={book.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="font-semibold text-[#4A2F1D]">{book.judul}</span>
                  <span className="text-xs font-bold text-[#2F4F3E]">
                    Sisa stok: {book.stok}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}