'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { query, withTransaction } from '@/lib/db';
import { requireRole } from '@/lib/session';

import {
  safe,
  AppError,
  str,
  int,
  num,
  currentYear,
} from '@/lib/utils';

// ==================================================
// KONFIGURASI GAMBAR
// ==================================================

const MAX_COVER_BYTES = 5 * 1024 * 1024;

// Mendeteksi format gambar berdasarkan isi file
function sniffImage(b) {
  if (
    b.length >= 3 &&
    b[0] === 0xff &&
    b[1] === 0xd8 &&
    b[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  if (
    b.length >= 8 &&
    b.subarray(0, 8).equals(
      Buffer.from([
        0x89, 0x50, 0x4e, 0x47,
        0x0d, 0x0a, 0x1a, 0x0a,
      ])
    )
  ) {
    return 'image/png';
  }

  if (
    b.length >= 12 &&
    b.toString('ascii', 0, 4) === 'RIFF' &&
    b.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  if (
    b.length >= 6 &&
    ['GIF87a', 'GIF89a'].includes(
      b.toString('ascii', 0, 6)
    )
  ) {
    return 'image/gif';
  }

  return null;
}

// ==================================================
// MEMBACA GAMBAR DARI FORM
// ==================================================

async function readCover(fd, required = false) {
  const file = fd.get('sampul_file');

  if (
    !file ||
    typeof file === 'string' ||
    file.size === 0
  ) {
    if (required) {
      throw new AppError(
        'Gambar sampul wajib diunggah.'
      );
    }

    return null;
  }

  if (file.size > MAX_COVER_BYTES) {
    throw new AppError(
      'Ukuran gambar sampul maksimal 5 MB.'
    );
  }

  const data = Buffer.from(
    await file.arrayBuffer()
  );

  const mime = sniffImage(data);

  if (!mime) {
    throw new AppError(
      'Format sampul harus JPG, PNG, WebP, atau GIF.'
    );
  }

  return {
    data,
    mime,
  };
}

// ==================================================
// VALIDASI DATA BUKU
// ==================================================

function fields(fd) {
  const f = {
    judul: str(fd, 'judul'),
    pengarang: str(fd, 'pengarang'),
    penerbit: str(fd, 'penerbit'),
    tahun: int(fd, 'tahun_terbit'),
    category: int(fd, 'category_id'),
    stok: int(fd, 'stok_total'),
    durasi: int(fd, 'durasi_maks_pinjam'),
    denda: num(fd, 'denda_per_hari'),
  };

  if (!f.judul || !f.pengarang || !f.penerbit) {
    throw new AppError('Semua isian wajib diisi.');
  }

  if (!Number.isInteger(f.category)) {
    throw new AppError('Pilih kategori buku.');
  }

  if (
    !Number.isInteger(f.tahun) ||
    f.tahun < 1000 ||
    f.tahun > currentYear()
  ) {
    throw new AppError(
      `Tahun terbit harus antara 1000 dan ${currentYear()}.`
    );
  }

  if (!Number.isInteger(f.stok) || f.stok < 0) {
    throw new AppError(
      'Stok tidak boleh negatif.'
    );
  }

  if (!Number.isInteger(f.durasi) || f.durasi <= 0) {
    throw new AppError(
      'Durasi maksimal pinjam harus lebih dari 0 hari.'
    );
  }

  if (!Number.isFinite(f.denda) || f.denda < 0) {
    throw new AppError(
      'Tarif denda tidak boleh negatif.'
    );
  }

  return f;
}

// ==================================================
// TAMBAH BUKU
// ==================================================

export async function createBook(_prev, fd) {
  const r = await safe(async () => {
    await requireRole(['pegawai', 'admin']);

    const f = fields(fd);
    const isbn = str(fd, 'isbn');

    if (!isbn) {
      throw new AppError('ISBN wajib diisi.');
    }

    // Membaca gambar yang diunggah
    const cover = await readCover(fd, true);

    // Memeriksa ISBN duplikat
    const dup = await query(
      'SELECT 1 FROM books WHERE isbn=$1',
      [isbn]
    );

    if (dup.length) {
      throw new AppError(
        'ISBN sudah terdaftar.'
      );
    }

    // Simpan buku dan gambar dalam satu transaksi
    await withTransaction(async (c) => {

      // 1. Simpan data buku
      const { rows } = await c.query(
        `INSERT INTO books (
          category_id,
          isbn,
          judul,
          pengarang,
          penerbit,
          tahun_terbit,
          stok_total,
          stok_tersedia,
          durasi_maks_pinjam,
          denda_per_hari,
          sampul
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$7,$8,$9,$10
        )
        RETURNING id`,
        [
          f.category,
          isbn,
          f.judul,
          f.pengarang,
          f.penerbit,
          f.tahun,
          f.stok,
          f.durasi,
          f.denda,
          null,
        ]
      );

      const bookId = rows[0].id;

      // 2. Simpan gambar langsung ke PostgreSQL
      await c.query(
        `INSERT INTO book_covers (
          book_id,
          mime_type,
          data
        )
        VALUES ($1, $2, $3)`,
        [
          bookId,
          cover.mime,
          cover.data,
        ]
      );

      // 3. Hubungkan URL gambar dengan buku
      await c.query(
        `UPDATE books
         SET sampul = $1
         WHERE id = $2`,
        [
          `/api/covers/${bookId}?v=${Date.now()}`,
          bookId,
        ]
      );

    });

    console.log(
      '[DATABASE SUCCESS] Buku dan gambar berhasil disimpan.'
    );
  });

  if (r?.error) return r;

  revalidatePath('/');
  revalidatePath('/kelola/buku');
  revalidatePath('/katalog');

  redirect('/kelola/buku?notif=buku-ditambah');
}

// ==================================================
// EDIT BUKU
// ==================================================

export async function updateBook(_prev, fd) {
  const r = await safe(async () => {
    await requireRole(['pegawai', 'admin']);

    const id = int(fd, 'id');

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('Buku tidak valid.');
    }

    const f = fields(fd);

    // Gambar boleh kosong ketika edit
    const cover = await readCover(fd, false);

    await withTransaction(async (c) => {

      // 1. Ambil data buku lama
      const { rows } = await c.query(
        `SELECT
          stok_total,
          stok_tersedia,
          sampul
         FROM books
         WHERE id=$1
         FOR UPDATE`,
        [id]
      );

      if (!rows[0]) {
        throw new AppError(
          'Buku tidak ditemukan.'
        );
      }

      // 2. Hitung buku yang sedang dipinjam
      const dipinjam =
        rows[0].stok_total -
        rows[0].stok_tersedia;

      if (f.stok < dipinjam) {
        throw new AppError(
          `Stok total tidak boleh kurang dari jumlah yang sedang dipinjam (${dipinjam}).`
        );
      }

      // 3. Perbarui informasi buku
      await c.query(
        `UPDATE books SET
          category_id=$1,
          judul=$2,
          pengarang=$3,
          penerbit=$4,
          tahun_terbit=$5,
          stok_total=$6,
          stok_tersedia=$7,
          durasi_maks_pinjam=$8,
          denda_per_hari=$9,
          updated_at=now()
        WHERE id=$10`,
        [
          f.category,
          f.judul,
          f.pengarang,
          f.penerbit,
          f.tahun,
          f.stok,
          f.stok - dipinjam,
          f.durasi,
          f.denda,
          id,
        ]
      );

      // 4. Jika ada gambar baru, simpan ke PostgreSQL
      if (cover) {

        await c.query(
          `INSERT INTO book_covers (
            book_id,
            mime_type,
            data,
            updated_at
          )
          VALUES ($1, $2, $3, NOW())

          ON CONFLICT (book_id)
          DO UPDATE SET
            mime_type = EXCLUDED.mime_type,
            data = EXCLUDED.data,
            updated_at = NOW()`,
          [
            id,
            cover.mime,
            cover.data,
          ]
        );

        // 5. Perbarui URL gambar
        await c.query(
          `UPDATE books
           SET sampul = $1
           WHERE id = $2`,
          [
            `/api/covers/${id}?v=${Date.now()}`,
            id,
          ]
        );
      }

    });

    console.log(
      '[DATABASE SUCCESS] Buku berhasil diperbarui.'
    );
  });

  if (r?.error) return r;

  revalidatePath('/');
  revalidatePath('/kelola/buku');
  revalidatePath('/katalog');

  redirect('/kelola/buku?notif=buku-diubah');
}

// ==================================================
// HAPUS BUKU
// ==================================================

export async function deleteBook(_prev, fd) {
  return safe(async () => {
    await requireRole(['pegawai', 'admin']);

    const id = int(fd, 'id');

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        'Buku tidak valid.'
      );
    }

    try {
      await withTransaction(async (c) => {

        // 1. Periksa apakah buku tersedia
        const { rows } = await c.query(
          `SELECT id
           FROM books
           WHERE id=$1
           FOR UPDATE`,
          [id]
        );

        if (!rows[0]) {
          throw new AppError(
            'Buku tidak ditemukan.'
          );
        }

        // 2. Periksa transaksi peminjaman aktif
        const active = await c.query(
          `SELECT 1 FROM loans
           WHERE book_id=$1
           AND status IN (
             'menunggu_konfirmasi',
             'sedang_dipinjam'
           )
           LIMIT 1`,
          [id]
        );

        if (active.rows.length) {
          throw new AppError(
            'Buku sedang dipinjam atau memiliki pengajuan aktif dan tidak dapat dihapus.'
          );
        }

        // 3. Hapus buku
        await c.query(
          'DELETE FROM books WHERE id=$1',
          [id]
        );

        // Gambar di book_covers otomatis terhapus
        // melalui ON DELETE CASCADE.

      });
    } catch (error) {
      if (error.code === '23503') {
        throw new AppError(
          'Buku memiliki riwayat transaksi sehingga tidak dapat dihapus.'
        );
      }

      throw error;
    }

    revalidatePath('/');
    revalidatePath('/kelola/buku');
    revalidatePath('/katalog');

    return {
      success: 'Buku dihapus.',
    };
  });
}