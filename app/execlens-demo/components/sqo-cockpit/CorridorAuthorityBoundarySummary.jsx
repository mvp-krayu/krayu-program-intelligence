export default function CorridorAuthorityBoundarySummary({ authorityBoundary }) {
  if (!authorityBoundary || !authorityBoundary.available) {
    return (
      <div className="corridor-section corridor-section--unavailable">
        <h3 className="corridor-section__title">Authority Boundary</h3>
        <p className="corridor-section__empty">Authority boundary data not available.</p>
      </div>
    );
  }

  const boundaries = authorityBoundary.boundaries || {};
  const antiLeakage = authorityBoundary.anti_leakage || {};
  const coverage = authorityBoundary.authority_coverage || {};

  const boundaryItems = [
    { label: 'Sandbox State', value: boundaries.sandbox_state, description: 'Provisional — sandbox-computed overlays' },
    { label: 'Certified State', value: boundaries.certified_state, description: 'Requires replay + rollback certification' },
    { label: 'Authority State', value: boundaries.authority_state, description: 'Requires operator-authorized promotion' },
    { label: 'Publication State', value: boundaries.publication_state, description: 'Requires authority + zone + governance' },
  ];

  const allAntiLeakage = Object.values(antiLeakage).every(Boolean);

  return (
    <div className="corridor-section">
      <h3 className="corridor-section__title">Authority Boundary</h3>

      <div className="corridor-boundary-chain">
        {boundaryItems.map((item, idx) => (
          <div key={item.label} className="corridor-boundary-chain__node">
            <div className="corridor-boundary-chain__header">
              <span className="corridor-boundary-chain__label">{item.label}</span>
              <span className={`corridor-badge corridor-badge--${item.value === 'PROVISIONAL' ? 'active' : 'blocked'}`}>
                {item.value}
              </span>
            </div>
            <span className="corridor-boundary-chain__desc">{item.description}</span>
            {idx < boundaryItems.length - 1 && (
              <div className="corridor-boundary-chain__separator">&#9553;</div>
            )}
          </div>
        ))}
        <div className="corridor-boundary-chain__node corridor-boundary-chain__node--terminal">
          <div className="corridor-boundary-chain__header">
            <span className="corridor-boundary-chain__label">LENS Consumable</span>
            <span className={`corridor-badge corridor-badge--${boundaries.lens_consumable ? 'safe' : 'blocked'}`}>
              {boundaries.lens_consumable ? 'YES' : 'NOT LENS-CONSUMABLE'}
            </span>
          </div>
          <span className="corridor-boundary-chain__desc">LENS-consumable only after publication</span>
        </div>
      </div>

      <div className="corridor-section__grid" style={{ marginTop: '16px' }}>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Anti-Leakage</span>
          <span className={`corridor-kv__value corridor-badge corridor-badge--${allAntiLeakage ? 'safe' : 'warn'}`}>
            {allAntiLeakage ? 'ALL ENFORCED' : 'PARTIAL'}
          </span>
        </div>
        {coverage.total_fields > 0 && (
          <div className="corridor-kv">
            <span className="corridor-kv__key">Authority Coverage</span>
            <span className="corridor-kv__value">
              {coverage.baseline_fields}/{coverage.total_fields} baseline · {coverage.overlay_provisional} overlay provisional
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
