<div align="center">
  <img src="public/images/logo.png" alt="Logo Ruang Aksara" width="200" />

  <h1>RUANG AKSARA: Perpustakaan Digital</h1>

  <strong>Sistem Manajemen Perpustakaan Kampus</strong>

  <em>Tempat setiap ilmu menemukan pembacanya.</em>

  <p>
    <img src="https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js App Router" />
    <img src="https://img.shields.io/badge/JavaScript-JSX-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript JSX" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Status-Completed-2F4F3E?style=for-the-badge" alt="Status Completed" />
  </p>
</div>

---

## 🧭 Navigasi

- [Tentang Ruang Aksara](#-tentang-ruang-aksara)
- [Fitur Utama Sistem](#-fitur-utama-sistem)
- [Alur Sirkulasi](#-alur-sirkulasi-buku)
- [Tingkat Pengguna](#-tingkat-pengguna)
- [Teknologi](#-teknologi-yang-digunakan)
- [Struktur Direktori](#-struktur-direktori)
- [Instalasi](#-panduan-instalasi-dan-menjalankan-project)
- [Akun Demo](#-akun-demo-untuk-pengujian)

## 🌿 Tentang Ruang Aksara

**Ruang Aksara** adalah sistem manajemen perpustakaan kampus yang memudahkan mahasiswa menelusuri katalog, mengajukan peminjaman, memperpanjang masa pinjam, memantau denda, serta memberi rating dan ulasan. Di sisi pengelola, sistem ini membantu Pegawai Perpustakaan dan Admin mengelola koleksi, sirkulasi, pengumuman, dan data pengguna dalam satu aplikasi.

Ruang Aksara menggabungkan tiga hal utama:

- **Katalog terbuka:** koleksi, buku terpopuler, dan pengumuman dapat dilihat siapa saja tanpa login.
- **Layanan sirkulasi:** pengajuan pinjam, persetujuan, pengembalian, perpanjangan, dan denda tercatat jelas dalam satu alur.
- **Pengelolaan terpusat:** Admin dan Pegawai memiliki dashboard sesuai peran masing-masing.

## ✨ Fitur Utama Sistem

### 1. 📖 Katalog dan Penjelajahan Buku

- **Beranda:** hero perpustakaan, pencarian cepat koleksi, daftar semua koleksi, **Buku Terpopuler** (lima buku dengan peminjaman terbanyak), dan pengumuman terbaru.
- **Katalog publik:** pengunjung dapat menjelajahi koleksi berdasarkan kategori tanpa harus masuk ke akun, lengkap dengan rak buku pilihan.
- **Pencarian, filter, dan pengurutan:** mencari buku, menyaring per kategori, dan mengurutkan hasil, dengan pagination.
- **Detail buku:** menampilkan ISBN, judul, pengarang, penerbit, tahun terbit, kategori, stok tersedia, durasi maksimal peminjaman, tarif denda harian, rata-rata rating, dan ulasan pembaca.

### 2. 🔐 Autentikasi dan Hak Akses

- Login untuk **Admin**, **Pegawai Perpustakaan**, dan **Mahasiswa**.
- Registrasi mandiri khusus **Mahasiswa** dengan **email kampus (berakhiran `.ac.id` atau `.edu`)** dan nomor identitas (NIM) bebas huruf, angka, atau campuran (maksimal 30 karakter).
- Akun **Pegawai** dan **Admin** hanya dibuat oleh Admin melalui menu Pengguna.
- Akses **Guest** untuk menjelajahi halaman publik tanpa autentikasi.
- Pembatasan halaman dan tindakan berdasarkan peran (*Role-Based Access Control* / RBAC), serta pengecekan status akun aktif.
- Sesi login berbasis cookie `httpOnly`.

### 3. 🔄 Peminjaman, Pengembalian, dan Perpanjangan

- Mahasiswa mengajukan peminjaman melalui halaman detail buku (**Ajukan Pinjam**).
- Pegawai memeriksa antrean pengajuan, lalu menyetujui atau menolaknya disertai alasan penolakan.
- Persetujuan peminjaman mengurangi stok tersedia dan konfirmasi pengembalian menambah stok kembali, keduanya melalui transaksi PostgreSQL.
- Mahasiswa dapat mengajukan perpanjangan untuk buku yang sedang dipinjam dan belum terlambat, **maksimal 1 kali per transaksi**. Pegawai memvalidasi permohonan tersebut.
- Satu mahasiswa tidak dapat memiliki dua pengajuan atau pinjaman aktif untuk buku yang sama.

### 4. ⏰ Perhitungan dan Pengelolaan Denda

- Keterlambatan dihitung otomatis dari tanggal jatuh tempo dan tanggal pengembalian.
- Nominal denda adalah jumlah hari terlambat dikalikan tarif denda harian buku. Tarif disalin ke tabel denda saat dicatat, sehingga perubahan tarif buku di kemudian hari tidak mengubah denda lama.
- Pegawai mencatat pelunasan denda di meja sirkulasi.
- Mahasiswa dengan denda **tertunggak** tidak dapat mengajukan peminjaman baru sampai denda dilunasi.

### 5. ⭐ Rating dan Ulasan Buku

- Mahasiswa dapat memberi rating skala 1 sampai 5 beserta komentar.
- Ulasan hanya dapat diberikan untuk peminjaman yang sudah **selesai**, dan **satu ulasan per transaksi**.
- Halaman katalog dan detail buku menampilkan rata-rata rating serta ulasan pembaca.

### 6. 🗂️ Pengelolaan Data

- **Manajemen pengguna (Admin):** melihat, menambah, mengubah, menonaktifkan, dan menghapus akun. Akun sendiri serta akun yang memiliki transaksi aktif tidak dapat dihapus.
- **Manajemen kategori (Admin):** mengelola nama kategori, kode klasifikasi unik, dan deskripsi. Kategori yang masih dipakai buku tidak dapat dihapus.
- **Manajemen buku (Pegawai dan Admin):** mengelola metadata buku, jumlah stok, dan **unggah gambar sampul** (`JPG`, `PNG`, `WEBP`, `GIF`, maksimal 5 MB). Buku yang masih memiliki transaksi aktif tidak dapat dihapus.
- **Manajemen pengumuman (Pegawai dan Admin):** membuat, mengubah, dan menerbitkan pengumuman dengan status draft atau terbit, dalam kategori operasional, layanan, atau acara.

### 7. 📊 Dashboard dan Laporan Berdasarkan Peran

| Peran | Fokus Dashboard |
|---|---|
| **Admin** | Statistik koleksi, pengguna, dan transaksi, manajemen akun dan kategori, serta monitoring transaksi dengan pencarian, filter status, dan filter periode. |
| **Pegawai Perpustakaan** | Antrean pengajuan pinjam, validasi perpanjangan, pengembalian buku, pencatatan denda tertunggak, katalog buku, dan pengumuman. |
| **Mahasiswa** | Katalog dan rak buku, pinjaman aktif, jatuh tempo, pengajuan perpanjangan, riwayat transaksi, ulasan, dan status denda. |
| **Guest** | Beranda, katalog, detail buku, pengumuman publik, dan halaman Tentang. |

- **Ekspor CSV (Admin):** transaksi dan rekap denda dapat diunduh sebagai CSV, mengikuti filter yang sedang dipakai.
- **Halaman Tentang:** panduan cara meminjam buku dan kontak admin.

## 🧭 Alur Sirkulasi Buku

Alur peminjaman dirancang agar status transaksi dan stok koleksi tetap konsisten.

```text
Mahasiswa mengajukan peminjaman
              │
              ▼
     menunggu_konfirmasi
              │
       ┌──────┴──────┐
       ▼             ▼
  sedang_dipinjam   ditolak
       │          (dengan alasan)
       ▼
Pegawai mengonfirmasi
    pengembalian
       │
       ▼
     selesai
       │
       ▼
Denda dicatat jika terlambat
```

**Prinsip penting:** pengajuan yang masih menunggu konfirmasi belum mengurangi stok. Stok berkurang ketika Pegawai menyetujui peminjaman dan bertambah kembali ketika pengembalian dikonfirmasi.

## 👥 Tingkat Pengguna

| Role | Hak Akses Utama |
|---|---|
| **Admin** | Mengelola akun dan kategori, memantau statistik dan transaksi, mengunduh laporan CSV, serta mengakses pengelolaan buku dan pengumuman. |
| **Pegawai Perpustakaan** | Mengelola buku dan pengumuman, memvalidasi peminjaman dan perpanjangan, memproses pengembalian, serta mencatat pelunasan denda. |
| **Mahasiswa** | Menjelajahi katalog, mengajukan peminjaman dan perpanjangan, memantau transaksi dan denda, serta memberi ulasan setelah peminjaman selesai. |
| **Guest** | Menjelajahi katalog, detail buku, dan pengumuman publik tanpa melakukan transaksi. |

> **Kebijakan Pendaftaran Akun:** Registrasi publik hanya untuk Mahasiswa dan **wajib menggunakan email kampus berakhiran `.ac.id` atau `.edu`**. Akun **Pegawai** dan **Admin** dibuat langsung oleh Admin.

## 💻 Teknologi yang Digunakan

| Bagian | Teknologi | Peran |
|---|---|---|
| Framework | **Next.js (App Router)** | Routing, halaman, dan logika aplikasi. |
| Bahasa | **JavaScript (JSX)** | Logika aplikasi dan komponen antarmuka. |
| Styling | **Tailwind CSS** | Styling responsif dan konsistensi tampilan. |
| Database | **PostgreSQL** | Penyimpanan data pengguna, kategori, buku, pengumuman, transaksi, denda, dan ulasan. |
| Database Driver | **node-postgres (`pg`)** | Koneksi PostgreSQL dan eksekusi query Raw SQL berparameter. |
| Password Hashing | **bcryptjs** | Hash dan verifikasi kata sandi pengguna. |
| Sesi | **jose (JWT)** | Penandatanganan dan verifikasi token sesi pada cookie. |

## 📁 Struktur Direktori

Seluruh file SQL disimpan di folder `database/`, di luar folder aplikasi.

```text
Final-Project-2026/
├── database/
│   ├── schema.sql                  # Tabel, constraint, dan index
│   ├── seed.sql                    # Akun demo, kategori, buku, pengumuman, dan transaksi contoh
│   └── migration_book_covers.sql   # Tambahan tabel book_covers untuk database lama
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── library-hero.webp
│   └── uploads/
│       └── books/                  # Gambar sampul buku
├── src/
│   ├── app/
│   │   ├── page.js                 # Beranda
│   │   ├── layout.js
│   │   ├── globals.css
│   │   ├── login/
│   │   ├── register/
│   │   ├── katalog/
│   │   ├── buku/
│   │   ├── pengumuman/
│   │   ├── tentang/
│   │   ├── ulasan/
│   │   ├── mahasiswa/
│   │   ├── pegawai/
│   │   ├── kelola/                 # Pengelolaan buku dan pengumuman
│   │   ├── admin/                  # Pengguna, kategori, dan monitoring transaksi
│   │   ├── actions/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   └── middleware.js
├── .env.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

## 🚀 Panduan Instalasi dan Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/nita888r/Final-Project-2026.git
cd Final-Project-2026
```

### 2. Install Dependencies

Pastikan **Node.js 20 atau lebih baru**, **npm**, dan **PostgreSQL** sudah terpasang, lalu jalankan:

```bash
npm install
```

### 3. Buat dan Isi Database PostgreSQL

1. Buka **pgAdmin 4**, klik kanan pada `Databases` → `Create` → `Database...`, lalu buat database bernama **`ruang_aksara`**:
   ```sql
   CREATE DATABASE ruang_aksara;
   ```
2. Klik kanan database **`ruang_aksara`** → pilih **Query Tool**.
3. Jalankan file berikut **secara berurutan** (klik ikon **Open File**, pilih file, lalu tekan **Execute / F5**):
   1. `database/schema.sql` membuat 8 tabel (`users`, `categories`, `books`, `book_covers`, `announcements`, `loans`, `fines`, `reviews`), constraint, dan index. File ini aman dijalankan ulang karena tabel lama akan dihapus terlebih dahulu.
   2. `database/seed.sql` mengisi akun demo, 6 kategori, 30 buku beserta sampulnya, pengumuman, dan transaksi contoh.

### 4. Konfigurasi Environment

Salin file `.env.example` menjadi **`.env.local`** di root project (sejajar dengan `package.json`), lalu isi nilainya:

```env
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/ruang_aksara
AUTH_SECRET=ganti-dengan-string-acak-panjang
```

Ganti `PASSWORD_ANDA` dengan password PostgreSQL lokal Anda. Untuk `AUTH_SECRET`, gunakan string acak yang panjang, misalnya hasil dari `openssl rand -hex 32`. Jangan mengunggah `.env.local` ke GitHub.

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka aplikasi melalui browser di alamat:

```text
http://localhost:3000
```

Untuk memeriksa build production:

```bash
npm run build
npm run start
```

## 🔑 Akun Demo untuk Pengujian

**Password semua akun demo: `password123`**

Data demo sudah dilengkapi riwayat transaksi yang beragam sehingga seluruh alur sirkulasi dapat langsung dicoba.

| Role | Nama | Email | Identitas | Kondisi Demo |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Administrator Ruang Aksara | `admin@ruangaksara.id` | `ADM-001` | Akses penuh: pengguna, kategori, buku, pengumuman, monitoring transaksi, dan ekspor CSV. |
| **Pegawai** | Nafisha Kasman | `pegawai@ruangaksara.id` | `NIP-1001` | Meja sirkulasi: antrean pinjam, perpanjangan, pengembalian, denda, buku, dan pengumuman. |
| **Mahasiswa** | Aliyah Alpat | `aliyah@student.ac.id` | `H071231001` | Memiliki pinjaman aktif (*Database System Concepts*), riwayat selesai, dan ulasan. |
| **Mahasiswa** | Addah Uddin | `addah@student.ac.id` | `H071231002` | Riwayat peminjaman selesai beserta ulasan buku. |
| **Mahasiswa** | Aura Autang | `aura@student.ac.id` | `H071231003` | Denda **tertunggak** (pinjam baru diblokir), pinjaman yang sudah terlambat, dan satu pengajuan berstatus menunggu konfirmasi. |
| **Guest** | - | - | - | Pengunjung tanpa login: beranda, katalog, detail buku, dan pengumuman. |

---

<div align="center">
  <sub>RUANG AKSARA</sub>
  <br />
  <sub>Individual Project 5, 2026</sub>
</div>