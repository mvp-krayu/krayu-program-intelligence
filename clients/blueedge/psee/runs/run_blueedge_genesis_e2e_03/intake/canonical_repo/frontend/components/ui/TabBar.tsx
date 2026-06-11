// Extracted from dashboard.html — TabBar
// Line 1139 | 3 lines

export default function TabBar({ tabs, active, onChange }: any) {
  return <div className="tab-bar">{tabs.map(t => <div key={t.id} className={`tab-item ${active===t.id?'active':''}`} onClick={() => onChange(t.id)}>{t.label}</div>)}</div>;
}
