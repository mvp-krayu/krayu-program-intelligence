export default function CorridorGovernanceZoneSummary({ governanceZone }) {
  if (!governanceZone || !governanceZone.available) {
    return (
      <div className="corridor-section corridor-section--unavailable">
        <h3 className="corridor-section__title">Governance Zone</h3>
        <p className="corridor-section__empty">Governance zone data not available.</p>
      </div>
    );
  }

  const zoneClass = {
    SAFE: 'safe',
    PRESSURE: 'warn',
    RISK: 'danger',
    PROHIBITED: 'critical',
  }[governanceZone.current_zone] || 'neutral';

  const metrics = governanceZone.metrics || {};
  const escalation = governanceZone.escalation || {};

  return (
    <div className="corridor-section">
      <h3 className="corridor-section__title">Governance Zone</h3>
      <div className="corridor-section__grid">
        <div className="corridor-kv">
          <span className="corridor-kv__key">Current Zone</span>
          <span className={`corridor-kv__value corridor-badge corridor-badge--${zoneClass}`}>{governanceZone.current_zone}</span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Escalation Level</span>
          <span className={`corridor-kv__value corridor-badge corridor-badge--${escalation.g_level === 'G-0' ? 'safe' : 'warn'}`}>
            {escalation.g_level} — {escalation.status}
          </span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Active Triggers</span>
          <span className="corridor-kv__value">{escalation.active_triggers}</span>
        </div>
      </div>
      <div className="corridor-section__sub">
        <span className="corridor-section__sub-label">Zone Metrics</span>
        <div className="corridor-metric-list">
          {Object.entries(metrics).map(([key, metric]) => (
            <div key={key} className="corridor-metric-item">
              <span className="corridor-metric-item__label">{key.replace(/_/g, ' ')}</span>
              <div className="corridor-metric-item__bar-container">
                <div
                  className={`corridor-metric-item__bar corridor-metric-item__bar--${metric.status ? metric.status.toLowerCase() : 'safe'}`}
                  style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                />
              </div>
              <span className="corridor-metric-item__value">{metric.value}/{metric.threshold}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
