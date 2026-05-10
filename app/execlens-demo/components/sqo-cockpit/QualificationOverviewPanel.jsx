export default function QualificationOverviewPanel({ overview, cockpitState }) {
  if (!overview) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Qualification Overview</h2>
        <p className="sqo-panel__empty-notice">No qualification data available.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--overview">
      <h2>Qualification Overview</h2>

      {cockpitState && (
        <div className={`sqo-cockpit-state sqo-cockpit-state--${cockpitState.visual_posture}`}>
          <span className="sqo-cockpit-state__label">{cockpitState.label}</span>
        </div>
      )}

      <div className="sqo-overview-grid">
        {overview.s_state ? (
          <div className="sqo-overview-card">
            <h3>S-State</h3>
            <div className="sqo-overview-card__value">{overview.s_state.state}</div>
            <div className="sqo-overview-card__label">{overview.s_state.label}</div>
            {overview.s_state.q_class && (
              <div className="sqo-overview-card__detail">Q-Class: {overview.s_state.q_class}</div>
            )}
            <div className="sqo-overview-card__detail">Authorization: {overview.s_state.authorization_tier}</div>
          </div>
        ) : (
          <div className="sqo-overview-card sqo-overview-card--empty">
            <h3>S-State</h3>
            <p>Not available</p>
          </div>
        )}

        {overview.maturity ? (
          <div className="sqo-overview-card">
            <h3>Maturity</h3>
            <div className="sqo-overview-card__value">{overview.maturity.score.toFixed(3)}</div>
            <div className="sqo-overview-card__label">{overview.maturity.classification_label}</div>
          </div>
        ) : (
          <div className="sqo-overview-card sqo-overview-card--empty">
            <h3>Maturity</h3>
            <p>Not available</p>
          </div>
        )}

        {overview.gravity ? (
          <div className="sqo-overview-card">
            <h3>Semantic Gravity</h3>
            <div className="sqo-overview-card__value">{overview.gravity.score.toFixed(3)}</div>
            <div className="sqo-overview-card__label">{overview.gravity.classification_label}</div>
          </div>
        ) : (
          <div className="sqo-overview-card sqo-overview-card--empty">
            <h3>Semantic Gravity</h3>
            <p>Not available</p>
          </div>
        )}

        {overview.stability ? (
          <div className="sqo-overview-card">
            <h3>Qualification Stability</h3>
            <div className="sqo-overview-card__value">{overview.stability.score.toFixed(3)}</div>
            <div className="sqo-overview-card__label">{overview.stability.classification_label}</div>
          </div>
        ) : (
          <div className="sqo-overview-card sqo-overview-card--empty">
            <h3>Qualification Stability</h3>
            <p>Not available</p>
          </div>
        )}

        {overview.progression ? (
          <div className="sqo-overview-card">
            <h3>Progression</h3>
            <div className="sqo-overview-card__value">{(overview.progression.readiness * 100).toFixed(1)}%</div>
            <div className="sqo-overview-card__label">{overview.progression.current} → {overview.progression.target}</div>
            <div className="sqo-overview-card__detail">
              {overview.progression.blocking_count} blocking / {overview.progression.total_debt} total debt
            </div>
          </div>
        ) : (
          <div className="sqo-overview-card sqo-overview-card--empty">
            <h3>Progression</h3>
            <p>Not available</p>
          </div>
        )}

        {overview.debt_summary ? (
          <div className="sqo-overview-card">
            <h3>Semantic Debt</h3>
            <div className="sqo-overview-card__value">{overview.debt_summary.total_items}</div>
            <div className="sqo-overview-card__label">debt items</div>
          </div>
        ) : (
          <div className="sqo-overview-card sqo-overview-card--empty">
            <h3>Semantic Debt</h3>
            <p>Not available</p>
          </div>
        )}
      </div>
    </div>
  );
}
