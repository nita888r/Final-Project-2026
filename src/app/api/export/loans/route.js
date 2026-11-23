import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { loanFilter } from '@/lib/loan-filter';

const esc = (v) => {
  const s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  // cegah CSV/formula injection di Excel
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

// GET /api/export/loans?jenis=transaksi|denda&q=&status=&dari=&sampai=  (khusus Admin) -> CSV
export async function GET(req) {
  const s = await getSession();
  if (s?.role !== 'admin') return new Response('Forbidden', { status: 403 });
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const jenis = sp.jenis === 'denda' ? 'denda' : 'transaksi';

  let rows;
  if (jenis === 'denda') {
    const f = loanFilter(sp, 'f.created_at', { withStatus: false });
    rows = await query(
      `SELECT l.kode_pinjam, u.nama_lengkap, u.nomor_identitas, b.judul, f.hari_terlambat,
              f.tarif_per_hari, f.jumlah_denda, f.status, f.created_at, f.dibayar_at
       FROM fines f JOIN loans l ON l.id=f.loan_id JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
       WHERE ${f.cond} ORDER BY f.created_at DESC`, f.params);
  } else {
    const f = loanFilter(sp, 'l.tanggal_pengajuan');
    rows = await query(
      `SELECT l.kode_pinjam, u.nama_lengkap, u.nomor_identitas, b.judul, l.status,
              l.tanggal_pengajuan, l.tanggal_pinjam, l.jatuh_tempo, l.tanggal_kembali,
              COALESCE(fn.jumlah_denda,0) AS denda, fn.status AS status_denda
       FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
       LEFT JOIN fines fn ON fn.loan_id=l.id WHERE ${f.cond} ORDER BY l.tanggal_pengajuan DESC`, f.params);
  }

  const head = rows[0] ? Object.keys(rows[0]) : ['kode_pinjam'];
  const csv = '\uFEFF' + [head.join(','), ...rows.map((r) => head.map((h) => esc(r[h])).join(','))].join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ruang-aksara-${jenis}.csv"`,
    },
  });
}
