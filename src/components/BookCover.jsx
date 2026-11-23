'use client';

import { useState } from 'react';

export default function BookCover({ src, title, className = '' }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-brown p-3 text-center font-display text-sm font-semibold text-gold ${className}`}>
        {title}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`Sampul ${title}`} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
