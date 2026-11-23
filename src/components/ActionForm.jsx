'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { showToast } from '@/lib/toast';

export function SubmitButton({ children, className = 'btn btn-primary', pendingText = 'Memproses...', confirmText }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => { if (confirmText && !window.confirm(confirmText)) e.preventDefault(); }}
    >
      {pending ? pendingText : children}
    </button>
  );
}

// Pembungkus <form> untuk Server Action: menampilkan pesan error inline,
// dan notifikasi (toast) saat aksi berhasil.
export default function ActionForm({ action, children, className = '' }) {
  const wrapped = async (prev, fd) => {
    const res = await action(prev, fd);
    if (res?.success) showToast(res.success);
    return res;
  };
  const [state, formAction] = useFormState(wrapped, null);
  return (
    <form action={formAction} className={className}>
      {state?.error && <div role="alert" className="alert alert-error">{state.error}</div>}
      {children}
    </form>
  );
}