BEGIN;

-- 1. DATA USERS
INSERT INTO users (nama_lengkap, email, password_hash, nomor_identitas, role) VALUES
    ('Administrator Ruang Aksara', 'admin@ruangaksara.id', '$2a$10$wogglTa5MvgS3tZAi5c.vet1VdPcvpcivHOJ08rmb832Vo44cTHG2', 'ADM-001', 'admin'),
    ('Nafisha Kasman', 'pegawai@ruangaksara.id', '$2a$10$wogglTa5MvgS3tZAi5c.vet1VdPcvpcivHOJ08rmb832Vo44cTHG2', 'NIP-1001', 'pegawai'),
    ('Aliyah Alpat', 'aliyah@student.ac.id', '$2a$10$wogglTa5MvgS3tZAi5c.vet1VdPcvpcivHOJ08rmb832Vo44cTHG2', 'H071231001', 'mahasiswa'),
    ('Addah Uddin', 'addah@student.ac.id', '$2a$10$wogglTa5MvgS3tZAi5c.vet1VdPcvpcivHOJ08rmb832Vo44cTHG2', 'H071231002', 'mahasiswa'),
    ('Aura Autang', 'aura@student.ac.id', '$2a$10$wogglTa5MvgS3tZAi5c.vet1VdPcvpcivHOJ08rmb832Vo44cTHG2', 'H071231003', 'mahasiswa');

-- 2. DATA KATEGORI
INSERT INTO categories (nama_kategori, kode_klasifikasi, deskripsi) VALUES
    ('Teknologi Informasi', 'TI-000', 'Pemrograman, basis data, jaringan, dan rekayasa perangkat lunak'),
    ('Hukum', 'HK-300', 'Ilmu hukum, perundang-undangan, dan kajian peradilan'),
    ('Kedokteran', 'KD-600', 'Ilmu kedokteran dan kesehatan'),
    ('Sastra & Bahasa', 'SB-800', 'Novel, kumpulan puisi, linguistik, dan kajian sastra'),
    ('Ekonomi & Bisnis', 'EB-330', 'Ekonomi, manajemen, dan akuntansi'),
    ('Sains Dasar', 'SD-500', 'Biologi, fisika, kimia, dan matematika');

-- 3. DATA KOLEKSI BUKU
INSERT INTO books 
    ```sql
-- 3A. URL SAMPUL BUKU
UPDATE books
SET sampul = CASE isbn

    WHEN '9780135957059' THEN '/uploads/books/1795202235243-9a01e1a9b3c2.jpg'
    WHEN '9780078022159' THEN '/uploads/books/1795202093191-2c10f0c82fd9.jpg'
    WHEN '9780136681557' THEN '/uploads/books/1795201971843-60799eaed4c2.jpg'
    WHEN '9780262033848' THEN '/uploads/books/1795203170155-29c38718fad6.jpg'
    WHEN '9780132350884' THEN '/uploads/books/1795201941363-5681ad7b5e9f.jpg'

    WHEN '9789790072763' THEN '/uploads/books/1795203224579-0182d0076f1f.jpg'
    WHEN '9789797695774' THEN '/uploads/books/1795202980629-84414d96fc7c.jpg'
    WHEN '9789794146002' THEN '/uploads/books/1795203139890-680718f1e637.jpg'
    WHEN '9789790980891' THEN '/uploads/books/1795201801394-df3254897ce0.jpg'
    WHEN '9786024220228' THEN '/uploads/books/1795203348097-f923a52a07ce.jpg'

    WHEN '9781264268504' THEN '/uploads/books/1795203077959-44a3a757c2bd.jpg'
    WHEN '9780323353175' THEN '/uploads/books/1795203430504-da0cf2bf8956.jpg'
    WHEN '9780323393225' THEN '/uploads/books/1795201823043-c650012f9ef4.jpg'
    WHEN '9780702077050' THEN '/uploads/books/1795203019164-e7d35361a41d.jpg'
    WHEN '9780323597128' THEN '/uploads/books/1795203054181-48b365d680a3.jpg'

    WHEN '9780553213690' THEN '/uploads/books/1795202467920-dca27ac72488.jpg'
    WHEN '9780451524935' THEN '/uploads/books/1795201552969-3acb3e25464b.jpg'
    WHEN '9786024246945' THEN '/uploads/books/1795203298120-193b803d5f87.jpg'
    WHEN '9789793062792' THEN '/uploads/books/1795203258199-b5348ad140cf.jpg'
    WHEN '9789799731234' THEN '/uploads/books/1795201846126-4fa39f266fb4.jpg'

    WHEN '9780857197689' THEN '/uploads/books/1795202193008-8f14c4fd4535.jpg'
    WHEN '9780140445688' THEN '/uploads/books/1795202502874-160e2c62d5a3.jpg'
    WHEN '9780679783367' THEN '/uploads/books/1795202042580-55ea0947a6b7.jpg'
    WHEN '9781305585126' THEN '/uploads/books/1795203392869-9cee042af50b.jpg'
    WHEN '9780060555665' THEN '/uploads/books/1795202159844-82667762326c.jpg'

    WHEN '9780321775658' THEN '/uploads/books/1795201886169-8849df677bf1.jpg'
    WHEN '9780134414232' THEN '/uploads/books/1795201913927-ceadd63e5d41.jpg'
    WHEN '9781119801122' THEN '/uploads/books/1795202127711-f50a3f046d08.jpg'
    WHEN '9780345539434' THEN '/uploads/books/1795202002206-527e10868941.jpg'
    WHEN '9780553380163' THEN '/uploads/books/1795201659598-11484f12784b.jpg'

    ELSE sampul
END
WHERE isbn IN (
    '9780135957059',
    '9780078022159',
    '9780136681557',
    '9780262033848',
    '9780132350884',
    '9789790072763',
    '9789797695774',
    '9789794146002',
    '9789790980891',
    '9786024220228',
    '9781264268504',
    '9780323353175',
    '9780323393225',
    '9780702077050',
    '9780323597128',
    '9780553213690',
    '9780451524935',
    '9786024246945',
    '9789793062792',
    '9789799731234',
    '9780857197689',
    '9780140445688',
    '9780679783367',
    '9781305585126',
    '9780060555665',
    '9780321775658',
    '9780134414232',
    '9781119801122',
    '9780345539434',
    '9780553380163'
);
 (category_id, isbn, judul, pengarang, penerbit, tahun_terbit, stok_total, stok_tersedia, durasi_maks_pinjam, denda_per_hari, sampul)
SELECT c.id, v.isbn, v.judul, v.pengarang, v.penerbit, v.tahun, v.stok, v.stok, v.durasi, v.denda, NULL
FROM (VALUES
    -- EKONOMI & BISNIS (5 BUKU)
    ('EB-330', '9780679783367', 'The Wealth of Nations', 'Adam Smith', 'Modern Library', 2000, 4, 14, 1000),
    ('EB-330', '9781305585126', 'Principles of Economics', 'N. Gregory Mankiw', 'Cengage Learning', 2017, 4, 14, 1000),
    ('EB-330', '9780140445688', 'Das Kapital: Volume 1', 'Karl Marx', 'Penguin Classics', 1990, 3, 14, 1000),
    ('EB-330', '9780060555665', 'The Intelligent Investor', 'Benjamin Graham', 'HarperBusiness', 2003, 5, 14, 1000),
    ('EB-330', '9780857197689', 'The Psychology of Money', 'Morgan Housel', 'Harriman House', 2020, 6, 7, 1000),

    -- HUKUM (5 BUKU)
    ('HK-300', '9786024220228', 'Pengantar Ilmu Hukum', 'Peter Mahmud Marzuki', 'Kencana', 2020, 5, 7, 1000),
    ('HK-300', '9789790980891', 'Asas-Asas Hukum Pidana', 'Moeljatno', 'Rineka Cipta', 2009, 4, 14, 1000),
    ('HK-300', '9789794146002', 'Ilmu Hukum', 'Satjipto Rahardjo', 'Citra Aditya Bakti', 2014, 3, 14, 1000),
    ('HK-300', '9789797695774', 'Sosiologi Suatu Pengantar', 'Soerjono Soekanto dan Budi Sulistyowati', 'Rajawali Pers', 2013, 4, 14, 1000),
    ('HK-300', '9789790072763', 'Konstitusi dan Konstitusionalisme Indonesia', 'Jimly Asshiddiqie', 'Sinar Grafika', 2010, 3, 14, 1000),

    -- KEDOKTERAN (5 BUKU)
    ('KD-600', '9780323597128', 'Guyton and Hall Textbook of Medical Physiology', 'John E. Hall dan Michael E. Hall', 'Elsevier', 2021, 3, 7, 2000),
    ('KD-600', '9780702077050', 'Gray''s Anatomy', 'Susan Standring (Editor)', 'Elsevier', 2020, 2, 7, 2000),
    ('KD-600', '9780323393225', 'Atlas of Human Anatomy', 'Frank H. Netter', 'Elsevier', 2019, 3, 7, 2000),
    ('KD-600', '9780323353175', 'Robbins Basic Pathology', 'Vinay Kumar, Abul K. Abbas dan Jon C. Aster', 'Elsevier', 2018, 2, 7, 2000),
    ('KD-600', '9781264268504', 'Harrison''s Principles of Internal Medicine', 'Joseph Loscalzo dkk.', 'McGraw Hill', 2022, 2, 7, 2000),

    -- SAINS DASAR (5 BUKU)
    ('SD-500', '9780553380163', 'A Brief History of Time', 'Stephen Hawking', 'Bantam Books', 1998, 5, 14, 1000),
    ('SD-500', '9780345539434', 'Cosmos', 'Carl Sagan', 'Ballantine Books', 2013, 4, 14, 1000),
    ('SD-500', '9781119801122', 'Fundamentals of Physics', 'David Halliday, Robert Resnick dan Jearl Walker', 'Wiley', 2021, 4, 14, 1500),
    ('SD-500', '9780134414232', 'Chemistry: The Central Science', 'Theodore L. Brown dkk.', 'Pearson', 2018, 3, 14, 1500),
    ('SD-500', '9780321775658', 'Campbell Biology', 'Jane B. Reece dkk.', 'Pearson', 2014, 3, 14, 1500),

    -- SASTRA & BAHASA (5 BUKU)
    ('SB-800', '9789799731234', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 2005, 4, 7, 500),
    ('SB-800', '9789793062792', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 6, 7, 500),
    ('SB-800', '9786024246945', 'Laut Bercerita', 'Leila S. Chudori', 'Kepustakaan Populer Gramedia', 2017, 6, 7, 500),
    ('SB-800', '9780451524935', '1984', 'George Orwell', 'Signet Classics', 1950, 5, 7, 500),
    ('SB-800', '9780553213690', 'The Metamorphosis', 'Franz Kafka', 'Bantam Classics', 1986, 4, 7, 500),

    -- TEKNOLOGI INFORMASI (5 BUKU)
    ('TI-000', '9780132350884', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 4, 7, 1000),
    ('TI-000', '9780262033848', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest dan Clifford Stein', 'MIT Press', 2009, 3, 14, 1500),
    ('TI-000', '9780136681557', 'Computer Networking: A Top-Down Approach', 'James F. Kurose dan Keith W. Ross', 'Pearson', 2021, 4, 14, 1500),
    ('TI-000', '9780078022159', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth dan S. Sudarshan', 'McGraw Hill', 2019, 3, 14, 1500),
    ('TI-000', '9780135957059', 'The Pragmatic Programmer', 'David Thomas dan Andrew Hunt', 'Addison-Wesley', 2019, 4, 7, 1000)
) AS v (kode, isbn, judul, pengarang, penerbit, tahun, stok, durasi, denda)
JOIN categories c ON c.kode_klasifikasi = v.kode;

-- 4. DATA PENGUMUMAN
INSERT INTO announcements (judul, konten, kategori, tanggal_rilis, status, created_by)
SELECT v.judul, v.konten, v.kat, CURRENT_DATE - v.hari, v.status, u.id
FROM (VALUES
    ('Jam Layanan Selama Masa Ujian', 'Selama masa ujian akhir semester, layanan sirkulasi dibuka pukul 08.00 sampai 20.00 WITA setiap hari Senin sampai Sabtu. Pengembalian buku tetap dapat dilakukan di meja sirkulasi.', 'operasional', 1, 'published'),
    ('Pengadaan Buku Baru Semester Ganjil', 'Perpustakaan menambah koleksi buku Teknologi Informasi dan Ekonomi. Buku baru dapat dipinjam mulai pekan ini setelah proses katalogisasi selesai.', 'layanan', 3, 'published'),
    ('Bedah Buku dan Diskusi Sastra', 'Diskusi bulanan bersama penulis lokal akan diselenggarakan di ruang baca lantai dua. Terbuka untuk seluruh mahasiswa.', 'acara', 5, 'published'),
    ('Rencana Penataan Rak (Draft)', 'Draft pengumuman penataan ulang rak koleksi hukum dan kedokteran.', 'operasional', 0, 'draft')
) AS v (judul, konten, kat, hari, status)
CROSS JOIN (SELECT id FROM users WHERE email = 'pegawai@ruangaksara.id') u;

-- 5. DATA TRANSAKSI PEMINJAMAN
INSERT INTO loans (kode_pinjam, user_id, book_id, status, tanggal_pengajuan, tanggal_pinjam, jatuh_tempo, tanggal_kembali, approved_by, returned_by)
SELECT v.kode, u.id, b.id, v.status, now() - make_interval(days => v.ajuan),
    now() - make_interval(days => v.pinjam), CURRENT_DATE + v.jt, now() - make_interval(days => v.kembali),
    CASE WHEN v.status IN ('sedang_dipinjam', 'selesai') THEN p.id END,
    CASE WHEN v.status = 'selesai' THEN p.id END
FROM (VALUES
    ('LN-SEED-001', 'aliyah@student.ac.id', '9780132350884', 'selesai', 40, 38, -31, 32),
    ('LN-SEED-002', 'addah@student.ac.id', '9780132350884', 'selesai', 35, 34, -27, 29),
    ('LN-SEED-003', 'addah@student.ac.id', '9789793062792', 'selesai', 30, 29, -22, 24),
    ('LN-SEED-004', 'aura@student.ac.id', '9780262033848', 'selesai', 25, 24, -10, 5),
    ('LN-SEED-005', 'aliyah@student.ac.id', '9789793062792', 'selesai', 20, 19, -12, 13),
    ('LN-SEED-006', 'aliyah@student.ac.id', '9780078022159', 'sedang_dipinjam', 5, 4, 10, NULL),
    ('LN-SEED-007', 'aura@student.ac.id', '9781305585126', 'sedang_dipinjam', 20, 19, -5, NULL)
) AS v (kode, email, isbn, status, ajuan, pinjam, jt, kembali)
JOIN users u ON u.email = v.email
JOIN books b ON b.isbn = v.isbn
CROSS JOIN (SELECT id FROM users WHERE email = 'pegawai@ruangaksara.id') p;

-- 6. TRANSAKSI MENUNGGU KONFIRMASI
INSERT INTO loans (kode_pinjam, user_id, book_id, status, tanggal_pengajuan)
SELECT 'LN-SEED-008', u.id, b.id, 'menunggu_konfirmasi', now() - interval '1 hour'
FROM users u
CROSS JOIN books b
WHERE u.email = 'aura@student.ac.id' AND b.isbn = '9789799731234';

-- 7. DATA DENDA
-- Budi terlambat mengembalikan buku selama 5 hari.
INSERT INTO fines (loan_id, hari_terlambat, tarif_per_hari, jumlah_denda, status, dicatat_oleh)
SELECT l.id, 5, b.denda_per_hari, 5 * b.denda_per_hari, 'tertunggak', p.id
FROM loans l
JOIN books b ON b.id = l.book_id
CROSS JOIN (SELECT id FROM users WHERE email = 'pegawai@ruangaksara.id') p
WHERE l.kode_pinjam = 'LN-SEED-004';

-- 8. DATA REVIEW BUKU
INSERT INTO reviews (loan_id, book_id, user_id, rating, komentar)
SELECT l.id, l.book_id, l.user_id, v.rating, v.komentar
FROM (VALUES
    ('LN-SEED-001', 5, 'Wajib dibaca untuk membangun kebiasaan menulis kode yang rapi.'),
    ('LN-SEED-002', 4, 'Contohnya jelas, hanya beberapa bagian terasa panjang.'),
    ('LN-SEED-003', 5, 'Cerita yang hangat dan menginspirasi.'),
    ('LN-SEED-005', 5, 'Dibaca ulang dan tetap menyenangkan.')
) AS v (kode, rating, komentar)
JOIN loans l ON l.kode_pinjam = v.kode;

-- 9. SINKRONISASI STOK BUKU
UPDATE books b
SET stok_tersedia = b.stok_total - COALESCE(
    (SELECT COUNT(*) FROM loans l
     WHERE l.book_id = b.id AND l.status = 'sedang_dipinjam'), 0
);

-- 10. SELESAIKAN TRANSAKSI DATABASE
COMMIT;

-- 11. VERIFIKASI DATA
SELECT c.nama_kategori AS kategori, COUNT(b.id) AS jumlah_buku, SUM(b.stok_total) AS total_stok,
    SUM(b.stok_tersedia) AS stok_tersedia
FROM categories c
LEFT JOIN books b ON b.category_id = c.id
GROUP BY c.id, c.nama_kategori
ORDER BY c.nama_kategori;

-- Tampilkan total koleksi buku
SELECT COUNT(*) AS total_koleksi FROM books;


