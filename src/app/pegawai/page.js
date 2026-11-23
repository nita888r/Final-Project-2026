import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { fmtDateTime, fmtDate, rupiah } from '@/lib/utils';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { approveLoan, rejectLoan, validasiPerpanjangan } from '@/app/actions/loans';

export const metadata = { title: 'Dashboard Pegawai – RUANG AKSARA' };

export default async function PegawaiDashboard() {
  await requirePage(['pegawai']);
  const antrean = await query(
    `SELECT l.id, l.kode_pinjam, l.tanggal_pengajuan, u.nama_lengkap, u.nomor_identitas, b.judul, b.stok_tersedia
     FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
     WHERE l.status='menunggu_konfirmasi' ORDER BY l.tanggal_pengajuan`
  );
  const perpanjangan = await query(
    `SELECT l.id, l.kode_pinjam, l.jatuh_tempo, b.judul, b.durasi_maks_pinjam, u.nama_lengkap
     FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
     WHERE l.status='sedang_dipinjam' AND l.status_perpanjangan='perpanjangan_diajukan' ORDER BY l.updated_at`
  );
  const [ringkas] = await query(
    `SELECT COUNT(*) AS n, COALESCE(SUM(jumlah_denda),0) AS total FROM fines WHERE status='tertunggak'`
  );

  return (
    <div className="space-y-8">
      <h1>Dashboard Pegawai</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/pegawai/sirkulasi" className="card hover:border-gold"><h3>Meja sirkulasi</h3><p className="text-sm">Pengembalian dan pelunasan denda</p></Link>
        <Link href="/kelola/buku" className="card hover:border-gold"><h3>Kelola buku</h3><p className="text-sm">Koleksi dan stok</p></Link>
        <Link href="/kelola/pengumuman" className="card hover:border-gold"><h3>Kelola pengumuman</h3><p className="text-sm">Agenda dan berita</p></Link>
      </div>
      {ringkas.n > 0 && (
        <p className="alert alert-error">Ada {ringkas.n} denda tertunggak senilai {rupiah(ringkas.total)}. <Link href="/pegawai/sirkulasi" className="underline">Buka meja sirkulasi</Link></p>
      )}

      <section>
        <h2 className="mb-3">Antrean peminjaman ({antrean.length})</h2>
        {antrean.length === 0 ? <p className="card text-sm">Tidak ada pengajuan yang menunggu.</p> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Peminjam</th><th>Buku</th><th>Diajukan</th><th>Aksi</th></tr></thead>
            <tbody>
              {antrean.map((l) => (
                <tr key={l.id}>
                  <td>{l.nama_lengkap}<div className="text-xs text-ink/60">{l.nomor_identitas}</div></td>
                  <td>{l.judul}<div className="text-xs text-ink/60">Stok tersedia: {l.stok_tersedia}</div></td>
                  <td>{fmtDateTime(l.tanggal_pengajuan)}</td>
                  <td>
                    <div className="flex flex-col gap-2 md:flex-row md:items-start">
                      <ActionForm action={approveLoan}><input type="hidden" name="loanId" value={l.id} /><SubmitButton className="btn btn-green btn-sm">Approve</SubmitButton></ActionForm>
                      <ActionForm action={rejectLoan} className="flex gap-2">
                        <input type="hidden" name="loanId" value={l.id} />
                        <input name="alasan" required placeholder="Alasan penolakan" className="input !py-1 text-xs" aria-label="Alasan penolakan" />
                        <SubmitButton className="btn btn-red btn-sm">Reject</SubmitButton>
                      </ActionForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>

      <section>
        <h2 className="mb-3">Perpanjangan diajukan ({perpanjangan.length})</h2>
        {perpanjangan.length === 0 ? <p className="card text-sm">Tidak ada pengajuan perpanjangan.</p> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Peminjam</th><th>Buku</th><th>Jatuh tempo saat ini</th><th>Aksi</th></tr></thead>
            <tbody>
              {perpanjangan.map((l) => (
                <tr key={l.id}>
                  <td>{l.nama_lengkap}</td>
                  <td>{l.judul}<div className="text-xs text-ink/60">+{l.durasi_maks_pinjam} hari bila disetujui</div></td>
                  <td>{fmtDate(l.jatuh_tempo)}</td>
                  <td>
                    <div className="flex gap-2">
                      {['setuju', 'tolak'].map((k) => (
                        <ActionForm key={k} action={validasiPerpanjangan}>
                          <input type="hidden" name="loanId" value={l.id} /><input type="hidden" name="keputusan" value={k} />
                          <SubmitButton className={`btn btn-sm ${k === 'setuju' ? 'btn-green' : 'btn-red'}`}>{k === 'setuju' ? 'Setujui' : 'Tolak'}</SubmitButton>
                        </ActionForm>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}
