import { LABELS } from '@/lib/utils';

export default function Badge({ status }) {
  const [label, cls] = LABELS[status] ?? [status, 'bg-brown/10 text-brown'];
  return <span className={`badge ${cls}`}>{label}</span>;
}
