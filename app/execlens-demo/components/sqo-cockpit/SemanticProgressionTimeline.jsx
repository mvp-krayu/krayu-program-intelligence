export default function SemanticProgressionTimeline({ progression, maturity, continuity, narratives }) {
  return (
    <div className="sqo-panel sqo-panel--timeline">
      <h2>Semantic Progression</h2>

      {progression ? (
        <div className="sqo-progression-detail">
          <div className="sqo-progression-detail__header">
            <span className="sqo-progression-detail__current">{progression.current}</span>
            <span className="sqo-progression-detail__arrow">→</span>
            <span className="sqo-progression-detail__target">{progression.target}</span>
          </div>
          <div className="sqo-progression-detail__readiness">
            <span className="sqo-progression-detail__readiness-label">Readiness</span>
            <span className="sqo-progression-detail__readiness-value">
              {(progression.readiness * 100).toFixed(1)}%
            </span>
          </div>
          <div className="sqo-progression-detail__debt">
            <span>{progression.blocking_count} blocking / {progression.total} total debt items</span>
          </div>
        </div>
      ) : (
        <div className="sqo-progression-detail sqo-progression-detail--empty">
          <p>Progression data not available.</p>
        </div>
      )}

      <div className="sqo-progression-metrics">
        {maturity && (
          <div className="sqo-progression-metric">
            <span className="sqo-progression-metric__label">Maturity</span>
            <span className="sqo-progression-metric__value">{maturity.score.toFixed(3)}</span>
            <span className="sqo-progression-metric__class">{maturity.classification}</span>
          </div>
        )}
        {continuity && (
          <div className="sqo-progression-metric">
            <span className="sqo-progression-metric__label">Continuity</span>
            <span className="sqo-progression-metric__value">{continuity.status}</span>
            <span className="sqo-progression-metric__class">{(continuity.coverage * 100).toFixed(1)}% coverage</span>
          </div>
        )}
      </div>

      {narratives && (
        <div className="sqo-progression-narratives">
          {narratives.current && (
            <div className="sqo-progression-narrative">
              <span className="sqo-progression-narrative__label">Current state</span>
              <p className="sqo-progression-narrative__text">{narratives.current}</p>
            </div>
          )}
          {narratives.blocked && (
            <div className="sqo-progression-narrative sqo-progression-narrative--blocked">
              <span className="sqo-progression-narrative__label">Blocked by</span>
              <p className="sqo-progression-narrative__text">{narratives.blocked}</p>
            </div>
          )}
          {narratives.after_rerun && (
            <div className="sqo-progression-narrative sqo-progression-narrative--after">
              <span className="sqo-progression-narrative__label">After remediation</span>
              <p className="sqo-progression-narrative__text">{narratives.after_rerun}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
