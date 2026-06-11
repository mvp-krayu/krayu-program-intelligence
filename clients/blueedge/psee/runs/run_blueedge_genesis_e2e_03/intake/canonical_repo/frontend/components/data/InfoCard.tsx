// Extracted from dashboard.html — InfoCard
// Line 1112 | 9 lines

import { useI18n } from '@/hooks';

export default function InfoCard({ title, rows }: any) {
  const { t } = useI18n();
  return (
    <div className="info-card">
      <h4>{t(title)}</h4>
      {rows.map((r, i) => <div key={i} className="info-row"><span className="label">{t(r.label)}</span><span className="value" style={r.color ? { color: `var(--${r.color})` } : {}}>{r.value}</span></div>)}
    </div>
  );
}
