import Link from 'next/link';
import { query } from '@/lib/db';
import { requirePage } from '@/lib/session';
import { ROLES, TABLE_PAGE_SIZE } from '@/lib/config';
import { pageOf, paginate } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import Badge from '@/components/Badge';
import ActionForm, { SubmitButton } from '@/components/ActionForm';
import { deleteUser } from '@/app/actions/users';

export const metadata = { title: 'Kelola Pengguna – RUANG AKSARA' };

export default async function Pengguna({ searchParams }) {
  const s = await requirePage(['admin']);
  const role = ROLES.includes(searchParams.role) ? searchParams.role : '';
  const q = (searchParams.q ?? '').trim();
  const where = `($1::text = '' OR role = $1) AND ($2::text = '' OR nama_lengkap ILIKE $3 OR email ILIKE $3 OR nomor_identitas ILIKE $3)`;
  const wp = [role, q, `%${q}%`];
  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM users WHERE ${where}`, wp);
  const { page, totalPages, offset } = paginate(total, TABLE_PAGE_SIZE, pageOf(searchParams));
  const users = await query(
    `SELECT id, nama_lengkap, email, nomor_identitas, role, is_active FROM users
     WHERE ${where} ORDER BY role, nama_lengkap LIMIT ${TABLE_PAGE_SIZE} OFFSET $4`, [...wp, offset]
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>Kelola Pengguna</h1>
        <Link href="/admin/pengguna/baru" className="btn btn-green">Tambah pengguna</Link>
      </div>
      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} className="input max-w-xs" placeholder="Cari nama, email, atau NIM/NIP" aria-label="Cari pengguna" />
        <select name="role" defaultValue={role} className="input max-w-xs" aria-label="Filter role">
          <option value="">Semua role</option><option value="admin">Admin</option><option value="pegawai">Pegawai</option><option value="mahasiswa">Mahasiswa</option>
        </select>
        <button className="btn btn-primary">Filter</button>
      </form>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Nama</th><th>Email</th><th>Identitas</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          {users.length === 0 && <tr><td colSpan={6}>Tidak ada pengguna yang cocok.</td></tr>}
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.nama_lengkap}</td><td>{u.email}</td><td>{u.nomor_identitas}</td><td><Badge status={u.role} /></td>
              <td>{u.is_active ? <span className="badge bg-bottle/15 text-bottle">Aktif</span> : <span className="badge bg-brick/15 text-brick">Nonaktif</span>}</td>
              <td>
                <div className="flex items-start gap-2">
                  <Link href={`/admin/pengguna/${u.id}/edit`} className="btn btn-outline btn-sm">Ubah</Link>
                  {u.id !== s.id && (
                    <ActionForm action={deleteUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <SubmitButton className="btn btn-red btn-sm" confirmText={`Hapus pengguna ${u.nama_lengkap}?`}>Hapus</SubmitButton>
                    </ActionForm>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <p className="text-sm text-ink/70">{total} pengguna</p>
      <Pagination basePath="/admin/pengguna" params={{ role, q }} page={page} totalPages={totalPages} />
    </div>
  );
}
