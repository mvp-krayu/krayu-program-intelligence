// Extracted from dashboard.html — ProgressBar
// Line 1122 | 4 lines

export default function ProgressBar({ value, max, color }: any) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(pct,100)}%`, background: `var(--${color || 'cyan'})` }} /></div>;
}
