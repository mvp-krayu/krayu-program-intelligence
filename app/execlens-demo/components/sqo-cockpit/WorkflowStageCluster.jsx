export default function WorkflowStageCluster({ stages, currentStage, sourceGuidance, rerunChecklist }) {
  if (!stages || stages.length === 0) {
    return (
      <div className="sqo-stage-cluster sqo-stage-cluster--empty">
        <h2>Remediation Workflow</h2>
        <p>No remediation stages resolved.</p>
      </div>
    );
  }

  const activeStage = stages.find(s => s.visual_state === 'active') || stages[0];
  const activeGuidance = sourceGuidance
    ? sourceGuidance.filter(g => {
        const stageItems = activeStage.items || [];
        return stageItems.some(item => item.category === g.category);
      })
    : [];

  return (
    <div className="sqo-stage-cluster">
      <h2 className="sqo-stage-cluster__title">Active Remediation</h2>

      <div className="sqo-stage-cluster__active">
        <div className="sqo-stage-cluster__active-header">
          <span className="sqo-stage-cluster__active-pathway">{activeStage.pathway}</span>
          <span className="sqo-stage-cluster__active-label">{activeStage.label}</span>
          <span className="sqo-stage-cluster__active-count">{activeStage.item_count} items</span>
        </div>
        <p className="sqo-stage-cluster__active-desc">{activeStage.description}</p>

        <div className="sqo-stage-cluster__active-items">
          {(activeStage.items || []).map(item => (
            <div key={item.id} className={`sqo-stage-cluster__item sqo-stage-cluster__item--${item.severity.toLowerCase()}`}>
              <span className="sqo-stage-cluster__item-id">{item.id}</span>
              <span className="sqo-stage-cluster__item-severity">{item.severity}</span>
              <span className="sqo-stage-cluster__item-desc">{item.description}</span>
            </div>
          ))}
        </div>
      </div>

      {activeGuidance.length > 0 && (
        <div className="sqo-stage-cluster__guidance">
          <h3>Required Source Material</h3>
          {activeGuidance.map(g => (
            <div key={g.category} className="sqo-stage-cluster__guidance-entry">
              <span className="sqo-stage-cluster__guidance-label">{g.label}</span>
              <ul className="sqo-stage-cluster__guidance-materials">
                {g.materials.map(m => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {rerunChecklist && (
        <div className="sqo-stage-cluster__checklist">
          <h3>Re-Run Preparation</h3>
          <div className={`sqo-stage-cluster__checklist-status sqo-stage-cluster__checklist-status--${rerunChecklist.all_pre_run_met ? 'ready' : 'not-ready'}`}>
            {rerunChecklist.all_pre_run_met ? 'Pre-run requirements met' : 'Pre-run requirements not met'}
          </div>
          <ul className="sqo-stage-cluster__checklist-items">
            {rerunChecklist.pre_run.map(req => (
              <li key={req.id} className={`sqo-stage-cluster__check sqo-stage-cluster__check--${req.met ? 'met' : 'unmet'}`}>
                <span>{req.met ? '✓' : '✗'}</span>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stages.length > 1 && (
        <div className="sqo-stage-cluster__future">
          <h3>Subsequent Stages</h3>
          {stages.filter(s => s.id !== activeStage.id).map(stage => (
            <div key={stage.id} className={`sqo-stage-cluster__future-stage sqo-stage-cluster__future-stage--${stage.visual_state}`}>
              <span className="sqo-stage-cluster__future-pathway">{stage.pathway}</span>
              <span className="sqo-stage-cluster__future-label">{stage.label}</span>
              <span className="sqo-stage-cluster__future-count">{stage.item_count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
