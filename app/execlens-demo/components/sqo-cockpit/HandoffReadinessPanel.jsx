export default function HandoffReadinessPanel({ handoffData }) {
  if (!handoffData) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>PATH B Handoff</h2>
        <p className="sqo-panel__empty-notice">No handoff readiness data available.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--handoff">
      <h2>PATH B Handoff</h2>

      <div className={`sqo-handoff-status sqo-handoff-status--${handoffData.ready ? 'ready' : 'blocked'}`}>
        <span className="sqo-handoff-status__indicator">{handoffData.ready ? 'READY' : 'BLOCKED'}</span>
        <span className="sqo-handoff-status__reason">{handoffData.reason}</span>
      </div>

      {!handoffData.ready && handoffData.blocking_conditions.length > 0 && (
        <div className="sqo-handoff-blockers">
          <h3>Blocking Conditions ({handoffData.blocking_conditions.length})</h3>
          {handoffData.blocking_conditions.map((cond, i) => (
            <div key={i} className="sqo-handoff-blocker">
              <span className="sqo-handoff-blocker__condition">{cond.condition}</span>
              <span className="sqo-handoff-blocker__detail">{cond.detail}</span>
            </div>
          ))}
        </div>
      )}

      <div className="sqo-handoff-package">
        <h3>Package Summary</h3>
        <div className="sqo-handoff-package__grid">
          <div className="sqo-handoff-package__field">
            <span className="sqo-handoff-package__label">S-State</span>
            <span className="sqo-handoff-package__value">{handoffData.package_summary.s_state || '—'}</span>
          </div>
          <div className="sqo-handoff-package__field">
            <span className="sqo-handoff-package__label">Q-Class</span>
            <span className="sqo-handoff-package__value">{handoffData.package_summary.q_class || '—'}</span>
          </div>
          <div className="sqo-handoff-package__field">
            <span className="sqo-handoff-package__label">Maturity</span>
            <span className="sqo-handoff-package__value">
              {handoffData.package_summary.maturity_score != null
                ? `${handoffData.package_summary.maturity_score.toFixed(3)} (${handoffData.package_summary.maturity_classification})`
                : '—'}
            </span>
          </div>
          <div className="sqo-handoff-package__field">
            <span className="sqo-handoff-package__label">Progression</span>
            <span className="sqo-handoff-package__value">
              {handoffData.package_summary.progression_readiness != null
                ? `${(handoffData.package_summary.progression_readiness * 100).toFixed(1)}%`
                : '—'}
            </span>
          </div>
          <div className="sqo-handoff-package__field">
            <span className="sqo-handoff-package__label">Blocking Debt</span>
            <span className="sqo-handoff-package__value">{handoffData.package_summary.blocking_debt_count ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className="sqo-handoff-governance">
        <h3>Governance</h3>
        <ul>
          <li>Cockpit prepares handoff package — does not execute handoff</li>
          <li>PATH B decides acceptance — cockpit cannot override</li>
          <li>No direct LENS emission from cockpit</li>
        </ul>
      </div>
    </div>
  );
}
