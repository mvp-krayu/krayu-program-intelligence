export default function RemediationWorkflowPanel({ stages, currentStage }) {
  if (!stages || stages.length === 0) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Remediation Workflow</h2>
        <p className="sqo-panel__empty-notice">No remediation stages resolved.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--remediation">
      <h2>Remediation Workflow</h2>

      {currentStage && (
        <div className="sqo-remediation-current">
          <span className="sqo-remediation-current__label">Current Stage:</span>
          <span className="sqo-remediation-current__value">
            Stage {currentStage.stage} — {currentStage.label} ({currentStage.pathway})
          </span>
        </div>
      )}

      <div className="sqo-remediation-stages">
        {stages.map(stage => (
          <div
            key={stage.id}
            className={`sqo-remediation-stage ${currentStage && stage.id === currentStage.id ? 'sqo-remediation-stage--active' : ''} ${stage.all_blocking ? 'sqo-remediation-stage--blocking' : ''}`}
          >
            <div className="sqo-remediation-stage__header">
              <span className="sqo-remediation-stage__number">Stage {stage.stage}</span>
              <span className="sqo-remediation-stage__label">{stage.label}</span>
              <span className="sqo-remediation-stage__pathway">{stage.pathway}</span>
              <span className="sqo-remediation-stage__count">{stage.item_count} items</span>
            </div>
            <p className="sqo-remediation-stage__description">{stage.description}</p>
            <div className="sqo-remediation-stage__items">
              {stage.items.map(item => (
                <div key={item.id} className="sqo-remediation-stage__item">
                  <span className="sqo-remediation-stage__item-id">{item.id}</span>
                  <span className="sqo-remediation-stage__item-severity">{item.severity}</span>
                  <span className="sqo-remediation-stage__item-desc">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
