import ActionForm, { SubmitButton } from '@/components/ActionForm';

export default function CategoryForm({ action, item }) {
  const edit = !!item;
  return (
    <ActionForm action={action} className="card grid gap-4 md:grid-cols-2">
      {edit && <input type="hidden" name="id" value={item.id} />}
      <div><label className="label" htmlFor="nama_kategori">Nama kategori</label><input id="nama_kategori" name="nama_kategori" required defaultValue={item?.nama_kategori ?? ''} className="input" /></div>
      <div><label className="label" htmlFor="kode_klasifikasi">Kode klasifikasi</label><input id="kode_klasifikasi" name="kode_klasifikasi" required defaultValue={item?.kode_klasifikasi ?? ''} className="input" /></div>
      <div className="md:col-span-2"><label className="label" htmlFor="deskripsi">Deskripsi singkat</label><textarea id="deskripsi" name="deskripsi" rows={2} defaultValue={item?.deskripsi ?? ''} className="input" /></div>
      <div className="md:col-span-2 flex gap-3">
        <SubmitButton className="btn btn-primary">{edit ? 'Simpan perubahan' : 'Tambah kategori'}</SubmitButton>
        {edit && <a href="/admin/kategori" className="btn btn-outline">Batal</a>}
      </div>
    </ActionForm>
  );
}
