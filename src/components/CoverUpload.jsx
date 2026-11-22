'use client';

import { useEffect, useState } from 'react';

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function CoverUpload({ current, required }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function onChange(e) {
    const file = e.target.files?.[0];
    setError('');
    setPreview(null);
    if (!file) return;
    if (!TYPES.includes(file.type)) {
      setError('Format harus JPG, PNG, WebP, atau GIF.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Ukuran file ${(file.size / 1024 / 1024).toFixed(1)} MB melebihi batas 5 MB.`);
      e.target.value = '';
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  const shown = preview || current;
  return (
    <div>
      <label className="label" htmlFor="sampul_file">Gambar sampul</label>
      <div className="flex flex-wrap items-start gap-4">
        {shown && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Pratinjau sampul" className="h-36 w-24 rounded-md border border-gold/50 object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <input
            id="sampul_file"
            name="sampul_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required={required}
            onChange={onChange}
            className="input file:mr-3 file:rounded-md file:border-0 file:bg-brown file:px-3 file:py-1 file:text-sm file:text-gold"
          />
          <p className="mt-1 text-sm opacity-70">
            JPG, PNG, WebP, atau GIF, maksimal 5 MB.{!required && ' Kosongkan jika tidak ingin mengganti sampul.'}
          </p>
          {error && <p role="alert" className="mt-1 text-sm text-brick">{error}</p>}
        </div>
      </div>
    </div>
  );
}
