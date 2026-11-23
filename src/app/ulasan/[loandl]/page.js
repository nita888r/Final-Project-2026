import { notFound, redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { tulisUlasan } from '@/app/actions/reviews';

export default async function UlasanPage({ params }) {
  const s = await requirePage(['mahasiswa']);
  const loanId = Number(params.loanId);
  if (!Number.isInteger(loanId)) notFound();
  const [l] = await query(
    `SELECT l.id, l.status, b.judul, (SELECT 1 FROM reviews r WHERE r.loan_id=l.id) AS ada
     FROM loans l JOIN books b ON b.id=l.book_id WHERE l.id=$1 AND l.user_id=$2`, [loanId, s.id]
  );
  if (!l) notFound();
  if (l.status !== 'selesai' || l.ada) redirect('/mahasiswa');
  return (
    <div className="mx-auto max-w-lg">
      <div className="card">
        <h1 className="text-3xl">Tulis ulasan</h1>
        <p className="mb-4 mt-1 text-sm text-ink/70">{l.judul}</p>
        <ActionForm action={tulisUlasan} className="space-y-4">
          <input type="hidden" name="loanId" value={l.id} />
          <div>
            <label className="label" htmlFor="rating">Rating</label>
            <select id="rating" name="rating" required defaultValue="5" className="input">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} {'★'.repeat(n)}</option>)}
            </select>
          </div>
          <div><label className="label" htmlFor="komentar">Komentar</label><textarea id="komentar" name="komentar" rows={4} className="input" placeholder="Ceritakan pengalaman membaca Anda" /></div>
          <SubmitButton className="btn btn-green">Kirim ulasan</SubmitButton>
        </ActionForm>
      </div>
    </div>
  );
}
