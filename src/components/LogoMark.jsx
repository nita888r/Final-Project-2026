// Memotong emblem lingkaran dari logo.png (emblem = ±39% lebar gambar)
export default function LogoMark({ size = 40 }) {
  const w = size / 0.395;
  return (
    <span className="inline-block shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo.png" alt="Logo Ruang Aksara"
        style={{ width: w, maxWidth: 'none', marginLeft: -0.303 * w, marginTop: -0.1156 * w }} />
    </span>
  );
}
