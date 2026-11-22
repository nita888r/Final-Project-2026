import ActionForm, { SubmitButton } from '@/components/ActionForm';
import CoverUpload from '@/components/CoverUpload';

export default function BookForm({ action, book, categories }) {
  const edit = !!book;
  const F = ({ name, label, type = 'text', ...rest }) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={book?.[name] ?? ''} required className="input" {...rest} />
    </div>
  );
  return (
    <ActionForm action={action} className="card grid gap-4 md:grid-cols-2">
      {edit && <input type="hidden" name="id" value={book.id} />}
      <div className="md:col-span-2"><F name="judul" label="Judul buku" /></div>
      <div>
        <label className="label" htmlFor="isbn">ISBN</label>
        <input id="isbn" name="isbn" defaultValue={book?.isbn ?? ''} required readOnly={edit} className={`input ${edit ? 'opacity-60' : ''}`} />
      </div>
      <div>
        <label className="label" htmlFor="category_id">Kategori</label>
        <select id="category_id" name="category_id" required defaultValue={book?.category_id ?? ''} className="input">
          <option value="" disabled>Pilih kategori</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.nama_kategori}</option>)}
        </select>
      </div>
      <F name="pengarang" label="Pengarang" />
      <F name="penerbit" label="Penerbit" />
      <F name="tahun_terbit" label="Tahun terbit" type="number" min="1000" />
      <F name="stok_total" label="Jumlah stok" type="number" min="0" />
      <F name="durasi_maks_pinjam" label="Durasi maksimal pinjam (hari)" type="number" min="1" />
      <F name="denda_per_hari" label="Tarif denda per hari (Rp)" type="number" min="0" step="100" />
      <div className="md:col-span-2"><CoverUpload current={book?.sampul} required={!edit} /></div>
      <div className="md:col-span-2 flex gap-3">
        <SubmitButton className="btn btn-primary">{edit ? 'Simpan perubahan' : 'Tambah buku'}</SubmitButton>
        <a href="/kelola/buku" className="btn btn-outline">Batal</a>
      </div>
    </ActionForm>
  );
}
