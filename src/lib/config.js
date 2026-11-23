// Konstanta kebijakan (dapat diubah tanpa menyentuh logika)
export const EMAIL_KAMPUS_REGEX = /^[^\s@]+@([a-z0-9-]+\.)*(ac\.id|edu)$/i;
export const MAKS_PERPANJANGAN = 1; // maksimal perpanjangan per transaksi
export const PAGE_SIZE = 12;
export const KATEGORI_PENGUMUMAN = ['operasional', 'layanan', 'acara'];
export const ROLES = ['admin', 'pegawai', 'mahasiswa'];
export const TABLE_PAGE_SIZE = 10; // baris per halaman untuk tabel dashboard/kelola
export const ANNOUNCE_PAGE_SIZE = 6;
// Nomor identitas (NIM/NIP) bebas: huruf, angka, atau campuran. Hanya dibatasi panjang kolom database.
export const ID_MAX_LENGTH = 30;
// Info kontak yang tampil di halaman Tentang & footer (ubah sesuai kebutuhan)
export const KONTAK = {
  email: 'admin@ruangaksara.id',
  telepon: '',
  lokasi: 'Meja Sirkulasi Perpustakaan Kampus',
  jam: 'Senin - Sabtu, 08.00 - 20.00 WITA',
};
