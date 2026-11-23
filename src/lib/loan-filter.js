import { validDate } from '@/lib/utils';

// Whitelist kondisi filter status (bukan input mentah)
export const STATUS_FILTERS = {
  menunggu_konfirmasi: "l.status = 'menunggu_konfirmasi'",
  sedang_dipinjam: "l.status = 'sedang_dipinjam'",
  selesai: "l.status = 'selesai'",
  ditolak: "l.status = 'ditolak'",
  terlambat: "l.status = 'sedang_dipinjam' AND l.jatuh_tempo < CURRENT_DATE",
};

// Membangun WHERE parameterized untuk laporan transaksi/denda (alias: l=loans, u=users, b=books).
// dateExpr = kolom waktu yang difilter periode (mis. 'l.tanggal_pengajuan' atau 'f.created_at').
export function loanFilter(sp, dateExpr, { withStatus = true } = {}) {
  const params = [];
  const conds = [];
  const status = withStatus && STATUS_FILTERS[sp.status] ? sp.status : '';
  if (status) conds.push(STATUS_FILTERS[status]);
  const q = String(sp.q ?? '').trim();
  if (q) {
    params.push(`%${q}%`);
    const i = params.length;
    conds.push(`(l.kode_pinjam ILIKE $${i} OR u.nama_lengkap ILIKE $${i} OR u.nomor_identitas ILIKE $${i} OR b.judul ILIKE $${i})`);
  }
  let dari = validDate(sp.dari);
  let sampai = validDate(sp.sampai);
  if (dari && sampai && dari > sampai) [dari, sampai] = [sampai, dari];
  if (dari) { params.push(dari); conds.push(`(${dateExpr} AT TIME ZONE 'Asia/Makassar')::date >= $${params.length}::date`); }
  if (sampai) { params.push(sampai); conds.push(`(${dateExpr} AT TIME ZONE 'Asia/Makassar')::date <= $${params.length}::date`); }
  return { status, q, dari, sampai, cond: conds.length ? conds.join(' AND ') : 'TRUE', params };
}
