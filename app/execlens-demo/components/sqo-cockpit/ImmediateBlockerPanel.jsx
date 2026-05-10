export default function ImmediateBlockerPanel({ blockers, debtCounts }) {
  if (!blockers || blockers.length === 0) {
    return (
      <div className="sqo-panel sqo-panel--blockers sqo-panel--clear">
        <h2>Immediate Blockers</h2>
        <p className="sqo-panel__clear-notice">No immediate blockers detected.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--blockers sqo-panel--has-blockers">
      <h2>Immediate Blockers</h2>
      {debtCounts && (
        <div className="sqo-blocker-summary">
          <span className="sqo-blocker-summary__immediate">{debtCounts.immediate} immediate</span>
          <span className="sqo-blocker-summary__active">{debtCounts.active} active</span>
          <span className="sqo-blocker-summary__deferred">{debtCounts.deferred} deferred</span>
          <span className="sqo-blocker-summary__total">{debtCounts.total} total</span>
        </div>
      )}

      <div className="sqo-blocker-list">
        {blockers.map(item => (
          <div key={item.id} className={`sqo-blocker-item sqo-blocker-item--${item.severity.toLowerCase()}`}>
            <div className="sqo-blocker-item__header">
              <span className="sqo-blocker-item__id">{item.id}</span>
              <span className="sqo-blocker-item__severity">{item.severity}</span>
              <span className="sqo-blocker-item__blocks">Blocks {item.blocks_s_state}</span>
            </div>
            <p className="sqo-blocker-item__description">{item.description}</p>
            <div className="sqo-blocker-item__urgency">
              <span>{item.urgency_reason}</span>
            </div>
            {item.remediation_pathway && (
              <div className="sqo-blocker-item__remediation">
                <span>Pathway: {item.remediation_pathway}</span>
                {item.remediation_action && <p>{item.remediation_action}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
