export default function SemanticQualificationIntakePanel({ intakeData }) {
  if (!intakeData || !intakeData.available) {
    return (
      <div className="sqo-semantic-intake sqo-semantic-intake--empty">
        <p>Semantic qualification intake data not available.</p>
      </div>
    );
  }

  const { posture, intake_summary, qualification_blockers, lane_summary, operational_guidance, governance, derivation_provenance } = intakeData;

  return (
    <div className="sqo-semantic-intake">
      <div className="sqo-semantic-intake__posture-header">
        <span className="sqo-semantic-intake__s-badge">{posture.s_level || 'S0'}</span>
        <span className="sqo-semantic-intake__posture-state">{posture.posture_label}</span>
        {posture.insufficiency_permanent && (
          <span className="sqo-semantic-intake__insufficiency-badge">PERMANENT INSUFFICIENCY</span>
        )}
        {posture.insufficiency_acknowledged && !posture.insufficiency_permanent && (
          <span className="sqo-semantic-intake__insufficiency-badge sqo-semantic-intake__insufficiency-badge--temporary">INSUFFICIENT EVIDENCE</span>
        )}
      </div>

      <p className="sqo-semantic-intake__summary">{posture.posture_summary}</p>

      <div className="sqo-semantic-intake__metrics">
        <div className="sqo-semantic-intake__metric">
          <span className="sqo-semantic-intake__metric-value">{intake_summary.total_capabilities}</span>
          <span className="sqo-semantic-intake__metric-label">Capabilities</span>
        </div>
        <div className="sqo-semantic-intake__metric">
          <span className="sqo-semantic-intake__metric-value">{intake_summary.total_components}</span>
          <span className="sqo-semantic-intake__metric-label">Components</span>
        </div>
        <div className="sqo-semantic-intake__metric">
          <span className="sqo-semantic-intake__metric-value">{(intake_summary.direct_evidence_ratio * 100).toFixed(0)}%</span>
          <span className="sqo-semantic-intake__metric-label">Direct Evidence</span>
        </div>
        <div className="sqo-semantic-intake__metric">
          <span className="sqo-semantic-intake__metric-value">{intake_summary.review_item_count}</span>
          <span className="sqo-semantic-intake__metric-label">Review Items</span>
        </div>
      </div>

      {intake_summary.capability_groups && Object.keys(intake_summary.capability_groups).length > 0 && (
        <div className="sqo-semantic-intake__capability-groups">
          <h3 className="sqo-semantic-intake__section-title">Capability Distribution</h3>
          <div className="sqo-semantic-intake__group-list">
            {Object.entries(intake_summary.capability_groups).map(([type, count]) => (
              <div key={type} className="sqo-semantic-intake__group-item">
                <span className="sqo-semantic-intake__group-type">{type}</span>
                <span className="sqo-semantic-intake__group-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {qualification_blockers && qualification_blockers.total > 0 && (
        <div className="sqo-semantic-intake__blockers">
          <h3 className="sqo-semantic-intake__section-title">
            Qualification Blockers
            <span className="sqo-semantic-intake__blocker-count">{qualification_blockers.total}</span>
          </h3>
          <div className="sqo-semantic-intake__blocker-lanes">
            {qualification_blockers.blocking_lanes.map(lane => (
              <span key={lane} className="sqo-semantic-intake__blocker-lane">{lane}</span>
            ))}
          </div>
          <div className="sqo-semantic-intake__blocker-items">
            {qualification_blockers.items.map(b => (
              <div key={b.blocker_id} className="sqo-semantic-intake__blocker-item">
                <span className="sqo-semantic-intake__blocker-id">{b.blocker_id}</span>
                <span className="sqo-semantic-intake__blocker-gap">{b.gap}</span>
                <span className="sqo-semantic-intake__blocker-resolution">{b.resolution}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lane_summary && lane_summary.length > 0 && (
        <div className="sqo-semantic-intake__lanes">
          <h3 className="sqo-semantic-intake__section-title">Lane Status</h3>
          <div className="sqo-semantic-intake__lane-list">
            {lane_summary.map(l => (
              <div key={l.lane} className={`sqo-semantic-intake__lane-item ${l.blocked ? 'sqo-semantic-intake__lane-item--blocked' : ''}`}>
                <span className="sqo-semantic-intake__lane-name">{l.lane}</span>
                <span className={`sqo-semantic-intake__lane-state sqo-semantic-intake__lane-state--${l.state.toLowerCase()}`}>{l.state}</span>
                {l.blocked && <span className="sqo-semantic-intake__lane-blocked">BLOCKED</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {operational_guidance && operational_guidance.next_steps && operational_guidance.next_steps.length > 0 && (
        <div className="sqo-semantic-intake__guidance">
          <h3 className="sqo-semantic-intake__section-title">Next Governed Actions</h3>
          <ul className="sqo-semantic-intake__steps">
            {operational_guidance.next_steps.map((step, i) => (
              <li key={i} className="sqo-semantic-intake__step">{step}</li>
            ))}
          </ul>
        </div>
      )}

      {derivation_provenance && derivation_provenance.compiler_version && (
        <div className="sqo-semantic-intake__provenance">
          <span className="sqo-semantic-intake__provenance-label">Compiler</span>
          <span className="sqo-semantic-intake__provenance-value">v{derivation_provenance.compiler_version}</span>
          {derivation_provenance.generated_at && (
            <>
              <span className="sqo-semantic-intake__provenance-label">Generated</span>
              <span className="sqo-semantic-intake__provenance-value">{new Date(derivation_provenance.generated_at).toLocaleDateString()}</span>
            </>
          )}
        </div>
      )}

      <div className="sqo-semantic-intake__governance-footer">
        {governance && governance.disclaimer}
        {' · '}Deterministic · Fail-closed · No grounding mutation
      </div>
    </div>
  );
}
