export default function Stars({ value = 0, count }) {
  const v = Math.round(Number(value) || 0);
  return (
    <span className="inline-flex items-center gap-1 text-xs" title={`Rating ${Number(value).toFixed(1)}`}>
      <span className="text-gold" aria-hidden>{'★'.repeat(v)}{'☆'.repeat(5 - v)}</span>
      <span className="text-ink/70">{Number(value) > 0 ? Number(value).toFixed(1) : 'Belum ada'}{count != null ? ` (${count})` : ''}</span>
    </span>
  );
}
