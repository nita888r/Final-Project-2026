import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { fmtDate, fmtDateTime, rupiah } from '@/lib/utils';
import Badge from '@/components/Badge';
import Pagination from '@/components/Pagination';

export const metadata = { title: 'Monitoring Transaksi – RUANG AKSARA' };
const PER_PAGE = 20;

// Whitelist kondisi filter (bukan input mentah)
const FILTERS = {
    menunggu_konfirmasi: "l.status = 'menunggu_konfirmasi'",
    sedang_dipinjam: "l.status = 'sedang_dipinjam'",
    selesai: "l.status = 'selesai'",
    ditolak: "l.status = 'ditolak'",
    terlambat: "l.status = 'sedang_dipinjam' AND l.jatuh_tempo < CURRENT_DATE",
};

export default async function Transaksi({ searchParams }) {
    await requirePage(['admin']);
    const status = FILTERS[searchParams.status] ? searchParams.status : '';
    const cond = status ? FILTERS[status] : 'TRUE';
    const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

const [{ total }] = await query(`SELECT COUNT(*) AS total FROM loans l WHERE ${cond}`);
const rows = await query(
    `SELECT l.id, l.kode_pinjam, l.status, l.tanggal_pengajuan, l.jatuh_tempo, l.tanggal_kembali,
            (l.status='sedang_dipinjam' AND l.jatuh_tempo < CURRENT_DATE) AS terlambat,
            u.nama_lengkap, b.judul, f.jumlah_denda, f.status AS status_denda
        FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id LEFT JOIN fines f ON f.loan_id=l.id
     WHERE ${cond} ORDER BY l.tanggal_pengajuan DESC LIMIT ${PER_PAGE} OFFSET $1`, [(page - 1) * PER_PAGE]
);
const [rekap] = await query(
    `SELECT COALESCE(SUM(jumlah_denda) FILTER (WHERE status='tertunggak'),0) AS tertunggak,
            COALESCE(SUM(jumlah_denda) FILTER (WHERE status='lunas'),0) AS lunas FROM fines`
);

return (
    <div className="space-y-5">
    <h1>Monitoring Transaksi</h1>
    <div className="grid gap-3 sm:grid-cols-2">
        <div className="card"><p className="text-sm">Denda tertunggak</p><p className="font-display text-2xl font-bold text-brick">{rupiah(rekap.tertunggak)}</p></div>
        <div className="card"><p className="text-sm">Denda lunas</p><p className="font-display text-2xl font-bold text-bottle">{rupiah(rekap.lunas)}</p></div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="flex gap-2">
        <select name="status" defaultValue={status} className="input" aria-label="Filter status">
            <option value="">Semua status</option>
            {Object.keys(FILTERS).map((k) => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
        </select>
        <button className="btn btn-primary">Filter</button>
        </form>
        <div className="flex gap-2">
        <a href="/api/export/loans?jenis=transaksi" className="btn btn-outline btn-sm">Unduh transaksi (CSV)</a>
        <a href="/api/export/loans?jenis=denda" className="btn btn-outline btn-sm">Unduh rekap denda (CSV)</a>
        </div>
    </div>
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
    <Pagination basePath="/admin/transaksi" params={{ status }} page={page} totalPages={Math.ceil(total / PER_PAGE)} />
    </div>
);
}
