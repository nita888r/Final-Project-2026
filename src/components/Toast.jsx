'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { NOTIF } from '@/lib/notif';

export default function Toast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const pathname = usePathname();
  const params = useSearchParams();

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const open = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    setToast({ message, type, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    const h = (e) => open(e.detail.message, e.detail.type);
    window.addEventListener('app:toast', h);
    return () => window.removeEventListener('app:toast', h);
  }, [open]);

  useEffect(() => {
  const key = params.get('notif');
  if (!key) return;
  if (NOTIF[key]) {
    queueMicrotask(() => open(NOTIF[key]));
  }
  const next = new URLSearchParams(params.toString());
  next.delete('notif');
  const qs = next.toString();
  window.history.replaceState(null, '', pathname + (qs ? `?${qs}` : ''));
}, [params, pathname, open]);

  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className="fixed inset-x-0 top-4 z-[100] flex justify-center px-4 pointer-events-none">
      <div
        key={toast.id}
        role={ok ? 'status' : 'alert'}
        className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${ok ? 'bg-bottle' : 'bg-brick'}`}
      >
        <span aria-hidden="true">{ok ? '✓' : '!'}</span>
        <span className="flex-1">{toast.message}</span>
        <button type="button" onClick={close} aria-label="Tutup notifikasi" className="ml-1 rounded px-1 text-lg leading-none text-white/80 hover:text-white">×</button>
      </div>
    </div>
  );
}