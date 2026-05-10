export default function ProgressionReadinessPanel({ progressionData }) {
  if (!progressionData) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Progression Readiness</h2>
        <p className="sqo-panel__empty-notice">No progression readiness data available.</p>
      </div>
    );
  }

  const readinessPercent = (progressionData.readiness_score * 100).toFixed(1);

  return (
    <div className="sqo-panel sqo-panel--progression">
      <h2>Progression Readiness</h2>

      <div className="sqo-progression-header">
        <div className="sqo-progression-transition">
          <span className="sqo-progression-transition__current">{progressionData.current_s_state}</span>
          <span className="sqo-progression-transition__arrow">→</span>
          <span className="sqo-progression-transition__target">{progressionData.target_s_state}</span>
        </div>
        <div className="sqo-progression-readiness">
          <div className="sqo-progression-readiness__bar">
            <div className="sqo-progression-readiness__fill" style={{ width: `${readinessPercent}%` }} />
          </div>
          <span className="sqo-progression-readiness__value">{readinessPercent}% ready</span>
        </div>
      </div>

      <div className="sqo-progression-stats">
        <div className="sqo-progression-stat">
          <span className="sqo-progression-stat__value">{progressionData.blocking_debt_count}</span>
          <span className="sqo-progression-stat__label">Blocking Debts</span>
        </div>
        <div className="sqo-progression-stat">
          <span className="sqo-progression-stat__value">{progressionData.total_debt_items}</span>
          <span className="sqo-progression-stat__label">Total Debt Items</span>
        </div>
      </div>

      {progressionData.missing_artifacts && progressionData.missing_artifacts.length > 0 && (
        <div className="sqo-progression-missing">
          <h3>Missing Required Artifacts</h3>
          <ul>
            {progressionData.missing_artifacts.map(art => (
              <li key={art} className="sqo-progression-missing__item">{art}</li>
            ))}
          </ul>
        </div>
      )}

      {progressionData.blocking_debts.length > 0 && (
        <div className="sqo-progression-blocking">
          <h3>Blocking Debt Items ({progressionData.blocking_debts.length})</h3>
          <div className="sqo-progression-blocking__by-pathway">
            {Object.entries(progressionData.debt_by_pathway).map(([pathway, items]) => (
              <div key={pathway} className="sqo-progression-pathway">
                <h4>{pathway} ({items.length} items)</h4>
                {items.map(item => (
                  <div key={item.id} className="sqo-progression-debt-item">
                    <span className="sqo-progression-debt-item__id">{item.id}</span>
                    <span className={`sqo-progression-debt-item__severity sqo-progression-debt-item__severity--${item.severity.toLowerCase()}`}>
                      {item.severity}
                    </span>
                    <span className="sqo-progression-debt-item__blocks">Blocks {item.blocks_s_state}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
