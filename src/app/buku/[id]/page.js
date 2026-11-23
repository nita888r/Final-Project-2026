import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { fmtDate, rupiah } from '@/lib/utils';
import BookCover from '@/components/BookCover';
import Stars from '@/components/Stars';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { ajukanPinjam } from '@/app/actions/loans';

export default async function BukuDetail({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const rows = await query(
    `SELECT b.*, c.nama_kategori, COALESCE(ROUND(AVG(r.rating),1),0) AS rata_rating, COUNT(r.id) AS jumlah_ulasan
     FROM books b JOIN categories c ON c.id=b.category_id LEFT JOIN reviews r ON r.book_id=b.id
     WHERE b.id=$1 GROUP BY b.id, c.nama_kategori`, [id]
  );
  const b = rows[0];
  if (!b) notFound();
  const ulasan = await query(
    `SELECT r.rating, r.komentar, r.created_at, u.nama_lengkap
     FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.book_id=$1 ORDER BY r.created_at DESC`, [id]
  );

  const s = await getSession();
  let blocked = false, aktif = false, ulasLoanId = null;
  if (s?.role === 'mahasiswa') {
    blocked = (await query(`SELECT 1 FROM fines f JOIN loans l ON l.id=f.loan_id WHERE l.user_id=$1 AND f.status='tertunggak' LIMIT 1`, [s.id])).length > 0;
    aktif = (await query(`SELECT 1 FROM loans WHERE user_id=$1 AND book_id=$2 AND status IN ('menunggu_konfirmasi','sedang_dipinjam')`, [s.id, id])).length > 0;
    const belumUlas = await query(
      `SELECT l.id FROM loans l WHERE l.user_id=$1 AND l.book_id=$2 AND l.status='selesai'
         AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.loan_id=l.id) ORDER BY l.id DESC LIMIT 1`, [s.id, id]
    );
    ulasLoanId = belumUlas[0]?.id ?? null;
  }

  const meta = [
    ['ISBN', b.isbn], ['Pengarang', b.pengarang], ['Penerbit', b.penerbit], ['Tahun terbit', b.tahun_terbit],
    ['Kategori', b.nama_kategori], ['Stok tersedia', `${b.stok_tersedia} dari ${b.stok_total}`],
    ['Maksimal lama pinjam', `${b.durasi_maks_pinjam} hari`], ['Denda per hari', rupiah(b.denda_per_hari)],
  ];

  let aksi;
  if (!s) aksi = <Link href="/login" className="btn btn-primary">Masuk untuk meminjam</Link>;
  else if (s.role !== 'mahasiswa') aksi = <p className="text-sm text-ink/70">Peminjaman hanya tersedia untuk akun Mahasiswa.</p>;
  else if (blocked) aksi = <p className="alert alert-error">Peminjaman diblokir: Anda masih memiliki denda tertunggak. Lunasi di meja sirkulasi.</p>;
  else if (aktif) aksi = <p className="alert alert-ok">Anda sudah memiliki pengajuan atau pinjaman aktif untuk buku ini.</p>;
  else if (b.stok_tersedia < 1) aksi = <button disabled className="btn btn-primary">Stok habis</button>;
  else aksi = (
    <ActionForm action={ajukanPinjam}>
      <input type="hidden" name="bookId" value={b.id} />
      <SubmitButton className="btn btn-green">Ajukan Pinjam</SubmitButton>
    </ActionForm>
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <BookCover src={b.sampul} title={b.judul} className="aspect-[2/3] w-full max-w-[260px] rounded-lg border border-gold/50" />
        <div>
          <h1>{b.judul}</h1>
          <div className="mt-2"><Stars value={b.rata_rating} count={b.jumlah_ulasan} /></div>
          <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {meta.map(([k, v]) => (
              <div key={k} className="flex gap-2 border-b border-gold/20 pb-1">
                <dt className="w-40 shrink-0 text-brown">{k}</dt><dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {aksi}
            {ulasLoanId && <Link href={`/ulasan/${ulasLoanId}`} className="btn btn-gold">Tulis Ulasan</Link>}
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3">Ulasan pembaca</h2>
        {ulasan.length === 0 ? <p className="card text-sm">Belum ada ulasan untuk buku ini.</p> : (
          <div className="space-y-3">
            {ulasan.map((u, i) => (
              <article key={i} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-brown">{u.nama_lengkap}</strong>
                  <Stars value={u.rating} />
                </div>
                {u.komentar && <p className="mt-2 text-sm">{u.komentar}</p>}
                <p className="mt-2 text-xs text-ink/60">{fmtDate(u.created_at)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
