export default function DeferredDebtPanel({ deferred, active }) {
  const hasDeferred = deferred && deferred.length > 0;
  const hasActive = active && active.length > 0;

  if (!hasDeferred && !hasActive) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Deferred &amp; Active Debt</h2>
        <p className="sqo-panel__empty-notice">No deferred or active debt items.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--deferred-debt">
      <h2>Deferred &amp; Active Debt</h2>

      {hasActive && (
        <div className="sqo-deferred-section">
          <h3>Active Debt ({active.length})</h3>
          <p className="sqo-deferred-section__subtitle">Impacts current qualification posture</p>
          <div className="sqo-deferred-items">
            {active.map(item => (
              <div key={item.id} className={`sqo-deferred-item sqo-deferred-item--${item.severity.toLowerCase()}`}>
                <div className="sqo-deferred-item__header">
                  <span className="sqo-deferred-item__id">{item.id}</span>
                  <span className="sqo-deferred-item__severity">{item.severity}</span>
                </div>
                <p className="sqo-deferred-item__description">{item.description}</p>
                <span className="sqo-deferred-item__reason">{item.urgency_reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasDeferred && (
        <div className="sqo-deferred-section">
          <h3>Deferred Debt ({deferred.length})</h3>
          <p className="sqo-deferred-section__subtitle">Expansion debt for future S-state progression</p>
          <div className="sqo-deferred-items">
            {deferred.map(item => (
              <div key={item.id} className={`sqo-deferred-item sqo-deferred-item--${item.severity.toLowerCase()}`}>
                <div className="sqo-deferred-item__header">
                  <span className="sqo-deferred-item__id">{item.id}</span>
                  <span className="sqo-deferred-item__severity">{item.severity}</span>
                  {item.blocks_s_state && (
                    <span className="sqo-deferred-item__blocks">{item.blocks_s_state} expansion</span>
                  )}
                </div>
                <p className="sqo-deferred-item__description">{item.description}</p>
                <span className="sqo-deferred-item__reason">{item.urgency_reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
