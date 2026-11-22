import ActionForm, { SubmitButton } from '@/components/ActionForm';

export default function UserForm({ action, user }) {
  const edit = !!user;
  return (
    <ActionForm action={action} className="card space-y-4">
      {edit && <input type="hidden" name="id" value={user.id} />}
      <div><label className="label" htmlFor="nama_lengkap">Nama lengkap</label><input id="nama_lengkap" name="nama_lengkap" required defaultValue={user?.nama_lengkap ?? ''} className="input" /></div>
      <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required defaultValue={user?.email ?? ''} className="input" /></div>
      <div><label className="label" htmlFor="nomor_identitas">Nomor identitas (NIM/NIP)</label><input id="nomor_identitas" name="nomor_identitas" required defaultValue={user?.nomor_identitas ?? ''} className="input" /></div>
      <div>
        <label className="label" htmlFor="role">Role</label>
        <select id="role" name="role" defaultValue={user?.role ?? 'mahasiswa'} className="input">
          <option value="admin">Admin</option><option value="pegawai">Pegawai</option><option value="mahasiswa">Mahasiswa</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="password">{edit ? 'Password baru (kosongkan bila tidak diubah)' : 'Password'}</label>
        <input id="password" name="password" type="password" minLength={6} required={!edit} className="input" />
      </div>
      {edit && (
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={user.is_active} /> Akun aktif</label>
      )}
      <div className="flex gap-3">
        <SubmitButton className="btn btn-primary">{edit ? 'Simpan perubahan' : 'Buat pengguna'}</SubmitButton>
        <a href="/admin/pengguna" className="btn btn-outline">Batal</a>
      </div>
    </ActionForm>
  );
}
