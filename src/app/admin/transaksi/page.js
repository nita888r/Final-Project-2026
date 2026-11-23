import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { fmtDate, fmtDateTime, rupiah, pageOf, paginate } from '@/lib/utils';
import { loanFilter, STATUS_FILTERS } from '@/lib/loan-filter';
import Badge from '@/components/Badge';
import Pagination from '@/components/Pagination';

export const metadata = { title: 'Monitoring Transaksi – RUANG AKSARA' };
const PER_PAGE = 20;

export default async function Transaksi({ searchParams }) {
  await requirePage(['admin']);
  const f = loanFilter(searchParams, 'l.tanggal_pengajuan');
  const FROM = `FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id LEFT JOIN fines fn ON fn.loan_id=l.id`;

  const [{ total }] = await query(`SELECT COUNT(*) AS total ${FROM} WHERE ${f.cond}`, f.params);
  const { page, totalPages, offset } = paginate(total, PER_PAGE, pageOf(searchParams));
  const rows = await query(
    `SELECT l.id, l.kode_pinjam, l.status, l.tanggal_pengajuan, l.jatuh_tempo, l.tanggal_kembali,
            (l.status='sedang_dipinjam' AND l.jatuh_tempo < CURRENT_DATE) AS terlambat,
            u.nama_lengkap, b.judul, fn.jumlah_denda, fn.status AS status_denda
     ${FROM} WHERE ${f.cond} ORDER BY l.tanggal_pengajuan DESC LIMIT ${PER_PAGE} OFFSET $${f.params.length + 1}`,
    [...f.params, offset]
  );
  const [rekap] = await query(
    `SELECT COALESCE(SUM(jumlah_denda) FILTER (WHERE status='tertunggak'),0) AS tertunggak,
            COALESCE(SUM(jumlah_denda) FILTER (WHERE status='lunas'),0) AS lunas FROM fines`
  );

  const exportQs = (jenis) => {
    const sp = new URLSearchParams({ jenis });
    if (jenis === 'transaksi' && f.status) sp.set('status', f.status);
    if (f.q) sp.set('q', f.q);
    if (f.dari) sp.set('dari', f.dari);
    if (f.sampai) sp.set('sampai', f.sampai);
    return `/api/export/loans?${sp.toString()}`;
  };
  const adaFilter = f.status || f.q || f.dari || f.sampai;

  return (
    <div className="space-y-5">
      <h1>Monitoring Transaksi</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card"><p className="text-sm">Denda tertunggak</p><p className="font-display text-2xl font-bold text-brick">{rupiah(rekap.tertunggak)}</p></div>
        <div className="card"><p className="text-sm">Denda lunas</p><p className="font-display text-2xl font-bold text-bottle">{rupiah(rekap.lunas)}</p></div>
      </div>

      <form className="card grid gap-3 md:grid-cols-[1fr_190px_160px_160px_auto]">
        <input name="q" defaultValue={f.q} className="input" placeholder="Cari kode, peminjam, NIM, atau judul" aria-label="Cari transaksi" />
        <select name="status" defaultValue={f.status} className="input" aria-label="Filter status">
          <option value="">Semua status</option>
          {Object.keys(STATUS_FILTERS).map((k) => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
        </select>
        <label className="text-xs text-ink/70">Dari tanggal<input type="date" name="dari" defaultValue={f.dari} className="input mt-1" /></label>
        <label className="text-xs text-ink/70">Sampai tanggal<input type="date" name="sampai" defaultValue={f.sampai} className="input mt-1" /></label>
        <div className="flex items-end gap-2">
          <button className="btn btn-primary">Terapkan</button>
          {adaFilter && <Link href="/admin/transaksi" className="btn btn-outline">Reset</Link>}
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/70">{total} transaksi{adaFilter ? ' (terfilter)' : ''}</p>
        <div className="flex flex-wrap gap-2">
          <a href={exportQs('transaksi')} className="btn btn-outline btn-sm">Unduh transaksi (CSV)</a>
          <a href={exportQs('denda')} className="btn btn-outline btn-sm">Unduh rekap denda (CSV)</a>
        </div>
      </div>
      <p className="-mt-3 text-xs text-ink/60">Unduhan mengikuti pencarian dan periode di atas. Rekap denda memakai tanggal denda dicatat.</p>

      <div className="table-wrap"><table className="table">
        <thead><tr><th>Kode</th><th>Peminjam</th><th>Buku</th><th>Status</th><th>Diajukan</th><th>Jatuh tempo</th><th>Kembali</th><th>Denda</th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={8}>Tidak ada transaksi.</td></tr>}
          {rows.map((l) => (
            <tr key={l.id}>
              <td>{l.kode_pinjam}</td><td>{l.nama_lengkap}</td><td>{l.judul}</td>
              <td><Badge status={l.terlambat ? 'terlambat' : l.status} /></td>
              <td>{fmtDateTime(l.tanggal_pengajuan)}</td><td>{fmtDate(l.jatuh_tempo)}</td><td>{fmtDate(l.tanggal_kembali)}</td>
              <td>{l.jumlah_denda ? <>{rupiah(l.jumlah_denda)} <Badge status={l.status_denda} /></> : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <Pagination basePath="/admin/transaksi" params={{ status: f.status, q: f.q, dari: f.dari, sampai: f.sampai }} page={page} totalPages={totalPages} />
    </div>
  );
}
