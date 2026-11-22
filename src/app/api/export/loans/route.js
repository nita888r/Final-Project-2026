import { getSession } from '@/lib/session';
import { query } from '@/lib/db';

const esc = (v) => {
  const s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// GET /api/export/loans?jenis=transaksi|denda  (khusus Admin) -> CSV
export async function GET(req) {
  const s = await getSession();
  if (s?.role !== 'admin') return new Response('Forbidden', { status: 403 });
  const jenis = new URL(req.url).searchParams.get('jenis') === 'denda' ? 'denda' : 'transaksi';

  const rows = jenis === 'denda'
    ? await query(`SELECT l.kode_pinjam, u.nama_lengkap, u.nomor_identitas, b.judul, f.hari_terlambat,
          f.tarif_per_hari, f.jumlah_denda, f.status, f.created_at, f.dibayar_at
        FROM fines f JOIN loans l ON l.id=f.loan_id JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
        ORDER BY f.created_at DESC`)
    : await query(`SELECT l.kode_pinjam, u.nama_lengkap, u.nomor_identitas, b.judul, l.status,
          l.tanggal_pengajuan, l.tanggal_pinjam, l.jatuh_tempo, l.tanggal_kembali,
          COALESCE(f.jumlah_denda,0) AS denda, f.status AS status_denda
        FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
        LEFT JOIN fines f ON f.loan_id=l.id ORDER BY l.tanggal_pengajuan DESC`);

  const head = rows[0] ? Object.keys(rows[0]) : [];
  const csv = '\uFEFF' + [head.join(','), ...rows.map((r) => head.map((h) => esc(r[h])).join(','))].join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ruang-aksara-${jenis}.csv"`,
    },
  });
}
