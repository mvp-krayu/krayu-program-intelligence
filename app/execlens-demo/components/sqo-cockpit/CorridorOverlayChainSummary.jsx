export default function CorridorOverlayChainSummary({ overlayChain }) {
  if (!overlayChain || !overlayChain.available) {
    return (
      <div className="corridor-section corridor-section--unavailable">
        <h3 className="corridor-section__title">Overlay Chain</h3>
        <p className="corridor-section__empty">Overlay chain data not available.</p>
      </div>
    );
  }

  const coex = overlayChain.coexistence;

  return (
    <div className="corridor-section">
      <h3 className="corridor-section__title">Overlay Chain</h3>
      <div className="corridor-section__grid">
        <div className="corridor-kv">
          <span className="corridor-kv__key">Active Overlays</span>
          <span className="corridor-kv__value">{overlayChain.count}</span>
        </div>
        {coex && (
          <>
            <div className="corridor-kv">
              <span className="corridor-kv__key">Coexistence Health</span>
              <span className={`corridor-kv__value corridor-badge corridor-badge--${coex.health === 'HEALTHY' ? 'safe' : 'warn'}`}>
                {coex.health}
              </span>
            </div>
            <div className="corridor-kv">
              <span className="corridor-kv__key">Conflicts</span>
              <span className="corridor-kv__value">{coex.conflicts}</span>
            </div>
            <div className="corridor-kv">
              <span className="corridor-kv__key">Strategy</span>
              <span className="corridor-kv__value">{coex.strategy}</span>
            </div>
          </>
        )}
      </div>
      <div className="corridor-overlay-list">
        {overlayChain.overlays.map((overlay, idx) => (
          <div key={overlay.id} className="corridor-overlay-item">
            <span className="corridor-overlay-item__order">{idx + 1}</span>
            <div className="corridor-overlay-item__detail">
              <span className="corridor-overlay-item__id">{overlay.id}</span>
              <span className="corridor-overlay-item__meta">
                {overlay.domain} · {overlay.semantic_class} · {overlay.lifecycle_phases} phases
              </span>
            </div>
            <span className={`corridor-badge corridor-badge--${overlay.status === 'TERMINAL' ? 'neutral' : 'active'}`}>
              {overlay.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
