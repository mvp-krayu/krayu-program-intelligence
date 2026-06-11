// Extracted from dashboard.html — StatCard
// Line 973 | 24 lines

import { useAnimatedValue, useI18n } from '@/hooks';
import { fmt } from '@/utils';

export default function StatCard({ label, value, sub, color }: any) {
  const { t } = useI18n();
  const numericVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
  const animated = useAnimatedValue(isNaN(numericVal) ? 0 : numericVal);
  const isNumeric = !isNaN(numericVal) && typeof value !== 'undefined';
  const formatAnimated = () => {
    if (!isNumeric) return value;
    const sv = String(value);
    const intVal = Math.round(animated);
    if (sv.startsWith('AED')) return `AED ${fmt(intVal)}`;
    if (sv.includes('%')) return `${animated.toFixed(1)}%`;
    const suffix = sv.replace(/[0-9,.%]+/g, '').trim();
    if (suffix && !sv.startsWith('AED')) return `${fmt(intVal)}${suffix ? ' ' + suffix : ''}`;
    return fmt(intVal);
  };

  return (
    <div className="stat-card">
      <div className="stat-label">{t(label)}</div>
      <div className="stat-value counter-val" style={color ? { color: `var(--${color})` } : {}}>{formatAnimated()}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
