<div align="center">
  <img src="public/images/logo.png" alt="Logo Ruang Aksara" width="120" />
  <h1>RUANG AKSARA</h1>
  <p><strong>Sistem Manajemen Perpustakaan Kampus</strong></p>
  <p>Katalog digital, pengajuan peminjaman, perpanjangan, dan pengelolaan denda dalam satu aplikasi web.</p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-App_Router-2F4F3E?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js App Router" />
    <img src="https://img.shields.io/badge/React-19-2F4F3E?style=flat-square&logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-2F4F3E?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
    <img src="https://img.shields.io/badge/PostgreSQL-SQL-2F4F3E?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

## Navigasi

- [Tentang Ruang Aksara](#tentang-ruang-aksara)
- [Fitur Utama Sistem](#fitur-utama-sistem)
- [Alur Peminjaman](#alur-peminjaman)
- [Tingkat Pengguna](#tingkat-pengguna)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi](#instalasi)
- [Akun Demo](#akun-demo)

## Tentang Ruang Aksara

**Ruang Aksara** adalah aplikasi perpustakaan kampus yang membantu pengunjung menemukan buku dan membantu petugas mengelola peminjaman buku fisik. Mahasiswa bisa melihat stok sebelum datang, mengajukan pinjaman, dan mengikuti statusnya dari dashboard. Pegawai mencatat persetujuan, pengembalian, dan pelunasan denda di meja sirkulasi, sementara Admin mengelola akun, kategori, memantau transaksi, serta mengunduh laporan.

## Fitur Utama Sistem

### 1. Beranda dan katalog publik

- **Beranda.** Menampilkan hero perpustakaan, pencarian cepat, daftar koleksi, lima **Buku Terpopuler**, dan pengumuman terbaru.
- **Katalog.** Cari buku, pilih kategori, urutkan hasil (tahun terbit terbaru, tahun terbit terlama, rating tertinggi, atau judul A sampai Z), dan jelajahi lewat pagination. Rak buku pilihan tampil di halaman katalog.
- **Detail buku.** Lihat sampul, ISBN, pengarang, penerbit, tahun terbit, kategori, stok tersedia, durasi pinjam maksimal, tarif denda harian, rating, dan ulasan pembaca.
- **Pengumuman dan Tentang.** Baca pengumuman yang sudah terbit, panduan cara meminjam buku, dan kontak admin.

### 2. Autentikasi dan hak akses

- Login untuk **Admin**, **Pegawai Perpustakaan**, dan **Mahasiswa**.
- Registrasi mandiri khusus **Mahasiswa** dengan **email kampus berakhiran `.ac.id` atau `.edu`**. Nomor identitas (NIM) bebas huruf, angka, atau campuran, maksimal 30 karakter.
- Akun **Pegawai** dan **Admin** hanya dibuat oleh Admin lewat menu Pengguna.
- Halaman dan tindakan dibatasi berdasarkan peran (*Role-Based Access Control*). Akun yang dinonaktifkan tidak dapat memakai sistem.
- Sesi login memakai cookie `httpOnly`.

### 3. Peminjaman, perpanjangan, pengembalian, dan denda

- Mahasiswa mengajukan pinjaman lewat tombol **Ajukan Pinjam** di detail buku. Satu mahasiswa tidak dapat memiliki dua pengajuan atau pinjaman aktif untuk judul yang sama.
- Pegawai memeriksa antrean lalu menyetujui atau menolak pengajuan. Penolakan wajib disertai alasan. Stok berkurang saat pengajuan disetujui.
- Mahasiswa dapat mengajukan **satu perpanjangan per transaksi** selama buku belum terlambat. Pegawai memvalidasi permohonan tersebut.
- Saat buku kembali, Pegawai mengonfirmasi pengembalian dan stok bertambah. Jika terlambat, **denda = jumlah hari terlambat × tarif harian buku**. Tarif disalin ke catatan denda, jadi perubahan tarif buku di kemudian hari tidak mengubah denda lama.
- Pegawai mencatat pelunasan denda setelah pembayaran diterima. Denda **tertunggak** memblokir pengajuan pinjam baru.

### 4. Rating dan ulasan

Setelah peminjaman berstatus **selesai**, mahasiswa dapat memberi **rating 1 sampai 5 bintang** dan menulis komentar. Satu transaksi hanya dapat diulas satu kali. Rata-rata rating dan ulasan tampil di katalog serta detail buku.

### 5. Pengelolaan perpustakaan

- **Koleksi buku.** Pegawai dan Admin dapat menambah, mengubah, dan menghapus buku, mengatur stok, durasi pinjam, tarif denda, serta mengunggah sampul (JPG, PNG, WEBP, atau GIF, maksimal 5 MB). Buku yang masih memiliki transaksi aktif tidak dapat dihapus.
- **Pengumuman.** Pegawai dan Admin dapat membuat dan mengubah pengumuman dengan kategori operasional, layanan, atau acara, serta status draft atau terbit.
- **Pengguna.** Admin dapat menambah, mengubah, menonaktifkan, dan menghapus akun. Akun sendiri dan akun yang memiliki transaksi aktif tidak dapat dihapus. Akun yang sudah punya riwayat cukup dinonaktifkan.
- **Kategori.** Admin mengelola nama, kode klasifikasi unik, dan deskripsi. Kategori yang masih dipakai buku tidak dapat dihapus.

### 6. Monitoring transaksi dan unduh laporan CSV (Admin)

Halaman **Monitoring Transaksi** punya pencarian, filter status, dan filter periode. Unduhan CSV mengikuti filter yang sedang dipakai.

| Laporan | Di mana mengunduh | Isi |
| --- | --- | --- |
| Transaksi | **Monitoring Transaksi → Unduh transaksi (CSV)** | Data peminjaman sesuai pencarian, status, dan periode yang dipilih. |
| Rekap denda | **Monitoring Transaksi → Unduh rekap denda (CSV)** | Data denda sesuai filter. Rekap denda memakai tanggal denda dicatat. |

CSV dapat dibuka di Excel atau Google Sheets.

## Alur Peminjaman

```text
Mahasiswa memilih buku di katalog
        │
        ▼
Klik Ajukan Pinjam
        │
        ▼
Menunggu Konfirmasi
        ├── Ditolak ──► Alasan tampil di riwayat mahasiswa
        │
        ▼ Disetujui oleh Pegawai
Sedang Dipinjam ──► Stok berkurang dan jatuh tempo ditetapkan
        │
        ▼
Pegawai mengonfirmasi pengembalian
        │
        ▼
Selesai ──► Stok bertambah dan mahasiswa dapat memberi ulasan
        └── Jika terlambat ──► Denda dicatat sebagai Tertunggak
```

Pengajuan yang masih menunggu konfirmasi belum mengurangi stok. Persetujuan dan pengembalian dijalankan sebagai transaksi PostgreSQL agar stok dan status tetap konsisten.

## Tingkat Pengguna

| Peran | Cara masuk | Yang dapat dilakukan |
| --- | --- | --- |
| **Tamu** | Buka beranda atau katalog tanpa login | Cari buku, lihat detail dan ulasan, baca pengumuman, dan buka halaman Tentang. |
| **Mahasiswa** | Daftar dengan email kampus `.ac.id` atau `.edu`, lalu masuk | Ajukan pinjam dan perpanjangan, cek riwayat dan denda, serta beri ulasan setelah peminjaman selesai. |
| **Pegawai Perpustakaan** | Akun dibuat oleh Admin, lalu masuk ke Dashboard Pegawai | Kelola koleksi dan pengumuman, setujui atau tolak pinjaman, validasi perpanjangan, catat pengembalian, dan catat pelunasan denda. |
| **Admin** | Akun demo atau akun yang sudah ada, lalu masuk ke Dashboard Admin | Kelola akun dan kategori, akses pengelolaan koleksi dan pengumuman, pantau transaksi, dan unduh CSV. |

## Teknologi

| Bagian | Yang digunakan |
| --- | --- |
| **Frontend** | React 19 dan JavaScript JSX untuk halaman dan komponen. Tailwind CSS 4 untuk layout dan tampilan responsif. |
| **Backend** | Next.js App Router untuk routing, halaman, dan logika aplikasi. |
| **Database** | PostgreSQL dengan driver `pg` dan query Raw SQL berparameter. |
| **Akun dan sesi** | `bcryptjs` untuk hash kata sandi dan `jose` (JWT) untuk token sesi pada cookie. |

## Struktur Proyek

Seluruh file SQL ada di folder `database/`, di luar folder aplikasi.

```text
Final-Project-2026/
├── .env.example                  # Contoh pengaturan lokal
├── package.json                  # Skrip npm dan paket aplikasi
├── package-lock.json
├── next.config.mjs
├── eslint.config.mjs
├── jsconfig.json
├── postcss.config.js
├── tailwind.config.js
├── README.md
├── database/
│   ├── schema.sql                # Tabel, constraint, dan index PostgreSQL
│   ├── seed.sql                  # Akun demo, kategori, buku, pengumuman, dan transaksi contoh
│   └── migration_book_covers.sql # Tambahan tabel book_covers untuk database lama
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── library-hero.webp
│   └── uploads/
│       └── books/                # Sampul buku
└── src/
    ├── app/
    │   ├── page.js               # Beranda
    │   ├── layout.js
    │   ├── globals.css
    │   ├── login/
    │   ├── register/
    │   ├── katalog/
    │   ├── buku/
    │   ├── pengumuman/
    │   ├── tentang/
    │   ├── ulasan/
    │   ├── mahasiswa/            # Area mahasiswa
    │   ├── pegawai/              # Dashboard dan sirkulasi Pegawai
    │   ├── kelola/               # Pengelolaan buku dan pengumuman
    │   ├── admin/                # Pengguna, kategori, dan monitoring transaksi
    │   ├── actions/              # Proses formulir dan transaksi
    │   └── api/                  # Pencarian buku, sampul, dan unduhan CSV
    ├── components/               # Komponen antarmuka
    ├── lib/                      # Koneksi database, sesi, dan aturan aplikasi
    └── middleware.js             # Pemeriksaan awal halaman yang dilindungi
```

## Instalasi

### Langkah Pemasangan

Siapkan **Git**, **Node.js 20.9 atau lebih baru**, **npm**, dan **PostgreSQL**. Jika memakai antarmuka grafis untuk database, siapkan **pgAdmin**.

1. **Kloning repositori dan masuk ke folder proyek.**

   ```bash
   git clone https://github.com/nita888r/Final-Project-2026.git
   cd Final-Project-2026
   ```

2. **Pasang paket yang dibutuhkan.**

   ```bash
   npm install
   ```

3. **Siapkan database PostgreSQL.** Di pgAdmin, buat database kosong bernama `ruang_aksara`. Buka **Query Tool** pada database tersebut, lalu jalankan [`schema.sql`](database/schema.sql) dan setelah itu [`seed.sql`](database/seed.sql) (buka file, tekan F5). `schema.sql` membuat 8 tabel (`users`, `categories`, `books`, `book_covers`, `announcements`, `loans`, `fines`, `reviews`) dan aman dijalankan ulang. `seed.sql` mengisi akun demo, 6 kategori, 30 buku, pengumuman, dan transaksi contoh. Sampul buku data contoh sudah tersedia di `public/uploads/books/`.

4. **Konfigurasi variabel lingkungan.** Salin [`.env.example`](.env.example) menjadi `.env.local` di root proyek, lalu isi kredensial PostgreSQL lokalmu.

   ```dotenv
   DATABASE_URL=postgresql://postgres:PASSWORD_POSTGRES@localhost:5432/ruang_aksara
   AUTH_SECRET=GANTI_DENGAN_KUNCI_ACAK_PANJANG
   ```

   Ganti `PASSWORD_POSTGRES` dengan kata sandi PostgreSQL milikmu. Buat nilai `AUTH_SECRET` dengan `openssl rand -hex 32`, atau dengan `node -p "require('node:crypto').randomBytes(32).toString('hex')"`. Simpan pengaturan asli di `.env.local` dan jangan mengunggah file itu ke GitHub.

5. **Jalankan server pengembangan.**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

6. **Periksa build production (opsional).**

   ```bash
   npm run build
   npm run start
   ```

## Akun Demo

Setelah mengimpor `seed.sql`, ada 5 akun contoh dengan kata sandi **`password123`**. Semua akun berstatus aktif.

| Peran | Nama | Email | Kata sandi | Kondisi demo |
| --- | --- | --- | --- | --- |
| Admin | Administrator Ruang Aksara | `admin@ruangaksara.id` | `password123` | Akses penuh: pengguna, kategori, buku, pengumuman, monitoring transaksi, dan CSV. |
| Pegawai Perpustakaan | Nafisha Kasman | `pegawai@ruangaksara.id` | `password123` | Antrean pinjam, perpanjangan, pengembalian, denda, buku, dan pengumuman. |
| Mahasiswa | Aliyah Alpat | `aliyah@student.ac.id` | `password123` | Punya pinjaman aktif (*Database System Concepts*), riwayat selesai, dan ulasan. |
| Mahasiswa | Addah Uddin | `addah@student.ac.id` | `password123` | Riwayat peminjaman selesai beserta ulasan buku. |
| Mahasiswa | Aura Autang | `aura@student.ac.id` | `password123` | Denda **tertunggak** (pinjam baru diblokir), pinjaman yang sudah terlambat, dan satu pengajuan menunggu konfirmasi. |