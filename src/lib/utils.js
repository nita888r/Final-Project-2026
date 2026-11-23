export class AppError extends Error {}

export const str = (fd, key) => String(fd.get(key) ?? '').trim();
export const int = (fd, key) => {
  const v = str(fd, key);
  return /^-?\d+$/.test(v) ? parseInt(v, 10) : NaN;
};
export const num = (fd, key) => {
  const v = str(fd, key);
  return v !== '' && Number.isFinite(Number(v)) ? Number(v) : NaN;
};

// Membungkus logika action: error bisnis & error database diubah menjadi pesan untuk pengguna.
export async function safe(fn) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    if (e?.code === '23505') return { error: 'Data duplikat: nilai yang harus unik sudah dipakai.' };
    if (e?.code === '23503') return { error: 'Data masih terhubung dengan data lain sehingga tidak dapat diproses.' };
    if (e?.code === '23514') return { error: 'Data melanggar batasan (constraint) database.' };
    console.error(e);
    return { error: 'Terjadi kesalahan pada server. Coba lagi.' };
  }
}

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n) || 0);

export function fmtDate(d) {
  if (!d) return '-';
  let date;
  if (typeof d === 'string' && d.length === 10) {
    const [y, m, day] = d.split('-').map(Number);
    date = new Date(y, m - 1, day);
  } else date = new Date(d);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fmtDateTime(d) {
  if (!d) return '-';
  return new Date(d).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Makassar',
  });
}

// label + kelas warna untuk lencana status
export const LABELS = {
  menunggu_konfirmasi: ['Menunggu Konfirmasi', 'bg-gold/30 text-brown'],
  sedang_dipinjam: ['Sedang Dipinjam', 'bg-bottle/15 text-bottle'],
  selesai: ['Selesai', 'bg-brown/10 text-brown'],
  ditolak: ['Ditolak', 'bg-brick/15 text-brick'],
  terlambat: ['Terlambat', 'bg-brick/15 text-brick'],
  tidak_ada: ['-', ''],
  perpanjangan_diajukan: ['Perpanjangan Diajukan', 'bg-gold/30 text-brown'],
  perpanjangan_disetujui: ['Perpanjangan Disetujui', 'bg-bottle/15 text-bottle'],
  perpanjangan_ditolak: ['Perpanjangan Ditolak', 'bg-brick/15 text-brick'],
  tertunggak: ['Tertunggak', 'bg-brick/15 text-brick'],
  lunas: ['Lunas', 'bg-bottle/15 text-bottle'],
  draft: ['Draft', 'bg-gold/30 text-brown'],
  published: ['Published', 'bg-bottle/15 text-bottle'],
  admin: ['Admin', 'bg-brown/10 text-brown'],
  pegawai: ['Pegawai', 'bg-gold/30 text-brown'],
  mahasiswa: ['Mahasiswa', 'bg-bottle/15 text-bottle'],
};

export function currentYear() {
  return new Date().getFullYear();
}

// ---------- Paginasi ----------
export function pageOf(sp, key = 'page') {
  return Math.max(1, parseInt(sp?.[key] ?? '1', 10) || 1);
}
export function paginate(total, size, requested) {
  const totalPages = Math.max(1, Math.ceil(Number(total) / size));
  const page = Math.min(requested, totalPages);
  return { page, totalPages, offset: (page - 1) * size };
}
// Tanggal YYYY-MM-DD yang benar-benar ada di kalender
export function validDate(v) {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return '';
  const d = new Date(v + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v ? v : '';
}
