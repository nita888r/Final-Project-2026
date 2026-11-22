import ActionForm, { SubmitButton } from '@/components/ActionForm';

export default function AnnouncementForm({ action, item }) {
  const edit = !!item;
  const tgl = item?.tanggal_rilis ?? new Date().toISOString().slice(0, 10);
  return (
    <ActionForm action={action} className="card space-y-4">
      {edit && <input type="hidden" name="id" value={item.id} />}
      <div><label className="label" htmlFor="judul">Judul pengumuman</label><input id="judul" name="judul" required defaultValue={item?.judul ?? ''} className="input" /></div>
      <div><label className="label" htmlFor="konten">Isi pengumuman</label><textarea id="konten" name="konten" rows={8} required defaultValue={item?.konten ?? ''} className="input" /></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="kategori">Kategori</label>
          <select id="kategori" name="kategori" defaultValue={item?.kategori ?? 'operasional'} className="input">
            <option value="operasional">Operasional</option><option value="layanan">Layanan</option><option value="acara">Acara</option>
          </select>
        </div>
        <div><label className="label" htmlFor="tanggal_rilis">Tanggal rilis</label><input id="tanggal_rilis" name="tanggal_rilis" type="date" required defaultValue={tgl} className="input" /></div>
        <div>
          <label className="label" htmlFor="status">Status publikasi</label>
          <select id="status" name="status" defaultValue={item?.status ?? 'draft'} className="input">
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <SubmitButton className="btn btn-primary">{edit ? 'Simpan perubahan' : 'Simpan pengumuman'}</SubmitButton>
        <a href="/kelola/pengumuman" className="btn btn-outline">Batal</a>
      </div>
    </ActionForm>
  );
}
