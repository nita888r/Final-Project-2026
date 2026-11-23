import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { fmtDate, rupiah, pageOf, paginate } from '@/lib/utils';
import { TABLE_PAGE_SIZE } from '@/lib/config';
import Pagination from '@/components/Pagination';
import Badge from '@/components/Badge';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { konfirmasiPengembalian, catatLunas } from '@/app/actions/loans';

export const metadata = { title: 'Meja Sirkulasi – RUANG AKSARA' };

export default async function Sirkulasi({ searchParams }) {
  await requirePage(['pegawai']);
  const q = (searchParams.q ?? '').trim();
  const like = `%${q}%`;
  const FILTER = `($1::text = '' OR l.kode_pinjam ILIKE $2 OR u.nama_lengkap ILIKE $2 OR u.nomor_identitas ILIKE $2 OR b.judul ILIKE $2)`;
  const [{ n: nAktif }] = await query(
    `SELECT COUNT(*) AS n FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id WHERE l.status='sedang_dipinjam' AND ${FILTER}`, [q, like]);
  const [{ n: nDenda }] = await query(
    `SELECT COUNT(*) AS n FROM fines f JOIN loans l ON l.id=f.loan_id JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id WHERE f.status='tertunggak' AND ${FILTER}`, [q, like]);
  const pk = paginate(nAktif, TABLE_PAGE_SIZE, pageOf(searchParams, 'pk'));
  const pd = paginate(nDenda, TABLE_PAGE_SIZE, pageOf(searchParams, 'pd'));

  const aktif = await query(
    `SELECT l.id, l.kode_pinjam, l.jatuh_tempo, u.nama_lengkap, u.nomor_identitas, b.judul, b.denda_per_hari,
            GREATEST(0, CURRENT_DATE - l.jatuh_tempo) AS hari_terlambat,
            GREATEST(0, CURRENT_DATE - l.jatuh_tempo) * b.denda_per_hari AS denda_estimasi
     FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
     WHERE l.status='sedang_dipinjam'
       AND ($1::text = '' OR l.kode_pinjam ILIKE $2 OR u.nama_lengkap ILIKE $2 OR u.nomor_identitas ILIKE $2 OR b.judul ILIKE $2)
     ORDER BY l.jatuh_tempo LIMIT ${TABLE_PAGE_SIZE} OFFSET $3`, [q, like, pk.offset]
  );
  const denda = await query(
    `SELECT f.id, f.hari_terlambat, f.tarif_per_hari, f.jumlah_denda, f.created_at, l.kode_pinjam,
            u.nama_lengkap, u.nomor_identitas, b.judul
     FROM fines f JOIN loans l ON l.id=f.loan_id JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
     WHERE f.status='tertunggak'
       AND ($1::text = '' OR l.kode_pinjam ILIKE $2 OR u.nama_lengkap ILIKE $2 OR u.nomor_identitas ILIKE $2 OR b.judul ILIKE $2)
     ORDER BY f.created_at LIMIT ${TABLE_PAGE_SIZE} OFFSET $3`, [q, like, pd.offset]
  );

  return (
    <div className="space-y-8">
      <h1>Meja Sirkulasi</h1>
      <form className="card flex flex-col gap-2 sm:flex-row">
        <input name="q" defaultValue={q} className="input" placeholder="Cari kode pinjam, nama, NIM, atau judul" aria-label="Cari transaksi" />
        <button className="btn btn-primary">Cari</button>
      </form>

      <section>
        <h2 className="mb-3">Pengembalian buku ({nAktif})</h2>
        {aktif.length === 0 ? <p className="card text-sm">Tidak ada transaksi aktif yang cocok.</p> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Kode</th><th>Peminjam</th><th>Buku</th><th>Jatuh tempo</th><th>Denda jika dikembalikan hari ini</th><th>Aksi</th></tr></thead>
            <tbody>
              {aktif.map((l) => (
                <tr key={l.id}>
                  <td>{l.kode_pinjam}</td>
                  <td>{l.nama_lengkap}<div className="text-xs text-ink/60">{l.nomor_identitas}</div></td>
                  <td>{l.judul}</td>
                  <td>{fmtDate(l.jatuh_tempo)} {l.hari_terlambat > 0 && <Badge status="terlambat" />}</td>
                  <td>{l.hari_terlambat > 0 ? <span className="text-brick">{l.hari_terlambat} hari × {rupiah(l.denda_per_hari)} = {rupiah(l.denda_estimasi)}</span> : 'Tidak ada'}</td>
                  <td>
                    <ActionForm action={konfirmasiPengembalian}>
                      <input type="hidden" name="loanId" value={l.id} />
                      <SubmitButton className="btn btn-green btn-sm" confirmText="Konfirmasi buku sudah dikembalikan?">Konfirmasi kembali</SubmitButton>
                    </ActionForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
        <Pagination basePath="/pegawai/sirkulasi" params={{ q, pd: pd.page }} page={pk.page} totalPages={pk.totalPages} pageParam="pk" />
      </section>

      <section>
        <h2 className="mb-3">Denda tertunggak ({nDenda})</h2>
        {denda.length === 0 ? <p className="card text-sm">Tidak ada denda tertunggak.</p> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Kode</th><th>Peminjam</th><th>Buku</th><th>Terlambat</th><th>Jumlah</th><th>Aksi</th></tr></thead>
            <tbody>
              {denda.map((f) => (
                <tr key={f.id}>
                  <td>{f.kode_pinjam}</td>
                  <td>{f.nama_lengkap}<div className="text-xs text-ink/60">{f.nomor_identitas}</div></td>
                  <td>{f.judul}</td>
                  <td>{f.hari_terlambat} hari × {rupiah(f.tarif_per_hari)}</td>
                  <td className="font-semibold text-brick">{rupiah(f.jumlah_denda)}</td>
                  <td>
                    <ActionForm action={catatLunas}>
                      <input type="hidden" name="fineId" value={f.id} />
                      <SubmitButton className="btn btn-gold btn-sm" confirmText="Catat denda ini sebagai lunas?">Catat lunas</SubmitButton>
                    </ActionForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
        <Pagination basePath="/pegawai/sirkulasi" params={{ q, pk: pk.page }} page={pd.page} totalPages={pd.totalPages} pageParam="pd" />
      </section>
    </div>
  );
}
