# RUANG AKSARA – Perpustakaan Digital

Sistem manajemen perpustakaan kampus (Individual Project 5). Stack: **Next.js 14 (App Router, JSX) + Tailwind CSS + PostgreSQL (Raw SQL via `pg`)**.

## Menjalankan

1. Prasyarat: Node.js 18+ dan PostgreSQL.
2. Buat database kosong bernama `ruang_aksara` (pgAdmin: klik kanan Databases > Create > Database, atau `createdb ruang_aksara`).
3. Di pgAdmin, buka **Query Tool** pada database `ruang_aksara`, lalu jalankan **berurutan** (buka file, tekan F5):
   1. `database/schema.sql`: membuat tabel, constraint, dan index (aman dijalankan ulang, tabel lama dihapus).
   2. `database/seed.sql`: mengisi akun demo, 6 kategori, 30 buku, pengumuman, dan transaksi contoh.
4. Salin env: `cp .env.example .env.local` (Windows: salin manual), lalu isi `DATABASE_URL` (user, password, dan port PostgreSQL Anda) dan `AUTH_SECRET` (string acak panjang).
5. `npm install` lalu `npm run dev`, buka http://localhost:3000

## Akun demo (password semua: `password123`)

| Role | Email | Keterangan |
|---|---|---|
| Admin | admin@ruangaksara.id | Akses penuh |
| Pegawai | pegawai@ruangaksara.id | Antrean, sirkulasi, buku, pengumuman |
| Mahasiswa | aliyah@student.ac.id | Punya pinjaman aktif dan ulasan |
| Mahasiswa | addah@student.ac.id | Riwayat selesai |
| Mahasiswa | aura@student.ac.id | Denda tertunggak (pinjam diblokir), pinjaman terlambat, pengajuan menunggu konfirmasi |

Register Mahasiswa mewajibkan email berakhiran `.ac.id` atau `.edu` dan NIM bebas (huruf, angka, atau campuran; maks 30 karakter). Akun Pegawai hanya dibuat Admin (menu Pengguna); info kontak Admin ada di halaman `/tentang`.

## Struktur

```
database/            schema.sql, seed.sql (di luar folder app)
.env.example         contoh konfigurasi environment
src/middleware.js    guard halaman private (cookie JWT, tanpa koneksi pg)
src/lib/             db.js (pool + transaction), session.js, utils.js, config.js
src/app/actions/     Server Actions: auth, users, categories, books, announcements, loans, reviews
src/app/api/         Route Handlers: books/search (JSON), export/loans (CSV, Admin)
src/app/...          halaman: katalog, buku, pengumuman, mahasiswa, pegawai, kelola, admin
```

## Poin penilaian

- **Autentikasi**: bcryptjs, session JWT di cookie httpOnly, middleware + cek role dan `is_active` di setiap Server Action.
- **Raw SQL**: semua query parameterized, tanpa ORM. Agregasi: 5 buku terpopuler (JOIN+COUNT), rata-rata rating, statistik Admin.
- **Transaksi DB**: Approve (stok -1) dan Pengembalian (stok +1 + denda) memakai `BEGIN/COMMIT/ROLLBACK` dan `SELECT ... FOR UPDATE`.
- **Denda**: keterlambatan dihitung runtime di SQL; tarif disalin ke tabel `fines`; pinjam diblokir saat ada denda `tertunggak`.
- **Aturan bisnis**: 1 ulasan per transaksi selesai, perpanjangan maks 1x, akun sendiri / akun dan buku dengan transaksi aktif tidak bisa dihapus, kategori terpakai tidak bisa dihapus.
- **Pagination**: katalog, kelola buku/pengguna/kategori/pengumuman, pengumuman publik, antrean dan sirkulasi Pegawai, riwayat Mahasiswa, monitoring transaksi.
- **Laporan**: monitoring transaksi punya pencarian, filter status, dan filter periode; unduhan CSV mengikuti filter yang sama.
- **Opsional dikerjakan**: Export CSV transaksi dan rekap denda (Admin). Reservasi dan Notification Log belum dibuat.

## Catatan

- `CURRENT_DATE` mengikuti timezone server PostgreSQL; atur `timezone = 'Asia/Makassar'` bila perlu.
- Sampul seed memakai Open Library; bila gagal dimuat, tampil sampul pengganti.
- Font (Playfair Display, DM Sans) diunduh dari Google Fonts, jadi perlu internet saat build/dev.

## Unggah sampul buku

Sampul diunggah manual lewat form buku (JPG/PNG/WebP/GIF, maks 5 MB; jenis file diperiksa dari isi file, bukan ekstensi). Gambar disimpan di tabel `book_covers` (bytea) dan disajikan oleh `/api/covers/[id]`; kolom `books.sampul` berisi path ke route itu. Buku lama dengan URL eksternal tetap tampil sampai sampulnya diganti. Batas body Server Action dinaikkan ke 6 MB di `next.config.mjs`.

## Revisi antarmuka

Beranda menggunakan hero perpustakaan dengan gambar lokal `public/images/library-hero.webp`, pencarian cepat, empat penanda manfaat, dan kartu buku dengan efek hover. Tata letak menyesuaikan layar kecil; efek gerak mengikuti preferensi reduced motion. Data buku, rating, stok, dan peminjaman tetap berasal dari database. Tidak ada perubahan schema atau seed untuk revisi UI ini.

