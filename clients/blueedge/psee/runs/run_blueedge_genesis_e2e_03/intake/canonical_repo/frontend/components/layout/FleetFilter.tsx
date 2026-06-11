// Extracted from dashboard.html — FleetFilter
// Line 1127 | 11 lines

export default function FleetFilter({ value, onChange }: any) {
  return (
    <div className="fleet-filter">
      {['all','tanker','bus','taxi'].map(f => (
        <button key={f} className={`fleet-btn ${value===f?'active':''}`} onClick={() => onChange(f)}>
          {f === 'all' ? '🚛 All Fleets' : f === 'tanker' ? '⛽ Tankers' : f === 'bus' ? '🚌 Buses' : '🚕 Taxis'}
        </button>
      ))}
    </div>
  );
}
