import Link from "next/link";

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-[#F5ECD9]/40 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Bagian 1: Header Atas */}
        <section className="text-center max-w-3xl mx-auto pb-4">
          <p className="text-xs font-semibold tracking-widest text-[#2F4F3E] uppercase mb-2">
            PERPUSTAKAAN DIGITAL
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F3A2E] mb-3">
            Tentang RUANG AKSARA
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            RUANG AKSARA adalah sistem manajemen perpustakaan kampus untuk menelusuri katalog,
            mengajukan peminjaman, memperpanjang masa pinjam, memantau denda, serta memberi
            rating dan ulasan. Tempat setiap ilmu menemukan pembacanya.
          </p>
        </section>

        {/* Bagian 2: Grid 2 Kolom (Cara Meminjam Kiri, Kontak Admin Kanan) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Kolom Kiri: Cara Meminjam Buku */}
          <div className="bg-[#FAF7F0] border border-[#E5DEC9] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F3A2E] mb-4">
              Cara meminjam buku
            </h2>
            <ol className="list-decimal list-inside space-y-2.5 text-sm text-stone-700 leading-relaxed">
              <li>
                Daftar sebagai Mahasiswa dengan email kampus (.ac.id / .edu), lalu masuk.
              </li>
              <li>
                Buka detail buku dan tekan <strong className="text-[#1F3A2E]">Ajukan Pinjam</strong>.
              </li>
              <li>
                Datang ke meja sirkulasi; Pegawai akan menyetujui atau menolak pengajuan.
              </li>
              <li>
                Kembalikan buku sebelum jatuh tempo. Keterlambatan dikenai denda per hari sesuai tarif buku.
              </li>
            </ol>
          </div>

          {/* Kolom Kanan: Kontak Admin */}
          <div className="bg-[#FAF7F0] border border-[#E5DEC9] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-center">
            <h2 className="text-xl font-bold text-[#1F3A2E] mb-4">
              Kontak Admin
            </h2>
            <div className="space-y-3 text-sm text-stone-700">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-500">Email</span>
                <a
                  href="mailto:admin@ruangaksara.id"
                  className="col-span-2 font-medium text-[#1F3A2E] underline"
                >
                  admin@ruangaksara.id
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-500">Lokasi</span>
                <span className="col-span-2">Meja Sirkulasi Perpustakaan Kampus</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-500">Jam layanan</span>
                <span className="col-span-2">Senin – Sabtu, 08.00 – 20.00 WITA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian 3: Full-Width Card Bawah */}
        <div className="bg-[#FAF7F0] border border-[#E5DEC9] rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1F3A2E] mb-2">
            Ingin menjadi Pegawai Perpustakaan?
          </h2>
          <p className="text-sm text-stone-700 mb-5 leading-relaxed">
            Pendaftaran mandiri hanya untuk akun Mahasiswa. Akun Pegawai dibuat oleh Admin,
            jadi silakan hubungi Admin melalui kontak di atas dan sertakan nama lengkap,
            email, serta nomor identitas (NIP).
          </p>
          <Link
            href="/katalog"
            className="inline-block bg-[#244234] hover:bg-[#1a3126] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
          >
            Jelajahi katalog
          </Link>
        </div>

      </div>
    </main>
  );
}