export default function SemanticQualificationIntakePanel({ intakeData }) {
  if (!intakeData || !intakeData.available) {
    return (
      <div className="sqo-semantic-intake sqo-semantic-intake--empty">
        <p>Semantic qualification intake data not available.</p>
      </div>
    );
  }

  const { posture, intake_summary, qualification_blockers, lane_summary, operational_guidance, governance, derivation_provenance } = intakeData;
  const isSpe = intakeData.derivation_path === 'SPE';

  return (
    <div className={`sqo-semantic-intake ${isSpe ? 'sqo-semantic-intake--spe' : 'sqo-semantic-intake--csr'}`}>
      <div className="sqo-semantic-intake__posture-header">
        <span className="sqo-semantic-intake__s-badge">{posture.s_level || 'S0'}</span>
        <span className="sqo-semantic-intake__posture-state">{posture.posture_label}</span>
        <span className="sqo-semantic-intake__path-badge">{isSpe ? 'SPE' : 'CSR'}</span>
        {posture.insufficiency_permanent && (
          <span className="sqo-semantic-intake__insufficiency-badge">PERMANENT INSUFFICIENCY</span>
        )}
        {posture.insufficiency_acknowledged && !posture.insufficiency_permanent && (
          <span className="sqo-semantic-intake__insufficiency-badge sqo-semantic-intake__insufficiency-badge--temporary">INSUFFICIENT EVIDENCE</span>
        )}
      </div>

      <p className="sqo-semantic-intake__summary">{posture.posture_summary}</p>

      {isSpe ? (
        <SpeMetrics intake={intake_summary} />
      ) : (
        <CsrMetrics intake={intake_summary} />
      )}

      {isSpe && intake_summary.by_class && Object.keys(intake_summary.by_class).length > 0 && (
        <div className="sqo-semantic-intake__class-distribution">
          <h3 className="sqo-semantic-intake__section-title">Proposition Class Distribution</h3>
          <div className="sqo-semantic-intake__class-list">
            {Object.entries(intake_summary.by_class).map(([cls, count]) => (
              <div key={cls} className="sqo-semantic-intake__class-item">
                <span className="sqo-semantic-intake__class-name">{formatClassName(cls)}</span>
                <span className="sqo-semantic-intake__class-bar">
                  <span
                    className="sqo-semantic-intake__class-fill"
                    style={{ width: `${(count / intake_summary.total_propositions) * 100}%` }}
                  />
                </span>
                <span className="sqo-semantic-intake__class-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSpe && intake_summary.mean_confidence > 0 && (
        <div className="sqo-semantic-intake__confidence-envelope">
          <h3 className="sqo-semantic-intake__section-title">Confidence Envelope</h3>
          <div className="sqo-semantic-intake__confidence-range">
            <div className="sqo-semantic-intake__confidence-track">
              <span
                className="sqo-semantic-intake__confidence-bar"
                style={{
                  left: `${intake_summary.min_confidence * 100}%`,
                  width: `${(intake_summary.max_confidence - intake_summary.min_confidence) * 100}%`,
                }}
              />
              <span
                className="sqo-semantic-intake__confidence-mean"
                style={{ left: `${intake_summary.mean_confidence * 100}%` }}
              />
            </div>
            <div className="sqo-semantic-intake__confidence-labels">
              <span className="sqo-semantic-intake__confidence-val">{intake_summary.min_confidence.toFixed(3)}</span>
              <span className="sqo-semantic-intake__confidence-val sqo-semantic-intake__confidence-val--mean">{intake_summary.mean_confidence.toFixed(3)}</span>
              <span className="sqo-semantic-intake__confidence-val">{intake_summary.max_confidence.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}

      {!isSpe && intake_summary.capability_groups && Object.keys(intake_summary.capability_groups).length > 0 && (
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

      {qualification_blockers && (qualification_blockers.total > 0 || (qualification_blockers.resolved && qualification_blockers.resolved > 0)) && (
        <div className="sqo-semantic-intake__blockers">
          <h3 className="sqo-semantic-intake__section-title">
            Qualification Blockers
            <span className="sqo-semantic-intake__blocker-count">{qualification_blockers.total} unresolved</span>
            {qualification_blockers.resolved > 0 && (
              <span className="sqo-semantic-intake__blocker-resolved-count">{qualification_blockers.resolved} resolved</span>
            )}
          </h3>
          {qualification_blockers.blocking_lanes && qualification_blockers.blocking_lanes.length > 0 && (
            <div className="sqo-semantic-intake__blocker-lanes">
              {qualification_blockers.blocking_lanes.map(lane => (
                <span key={lane} className="sqo-semantic-intake__blocker-lane">{lane}</span>
              ))}
            </div>
          )}
          <div className="sqo-semantic-intake__blocker-items">
            {qualification_blockers.items.map(b => (
              <div key={b.blocker_id} className={`sqo-semantic-intake__blocker-item ${b.resolved ? 'sqo-semantic-intake__blocker-item--resolved' : ''}`}>
                <span className="sqo-semantic-intake__blocker-id">{b.blocker_id}</span>
                <span className="sqo-semantic-intake__blocker-gap">{b.gap}</span>
                <span className={`sqo-semantic-intake__blocker-resolution ${b.resolved ? 'sqo-semantic-intake__blocker-resolution--done' : ''}`}>
                  {b.resolution}
                </span>
                {b.resolved && <span className="sqo-semantic-intake__blocker-resolved-badge">RESOLVED</span>}
                {b.resolution_note && <span className="sqo-semantic-intake__blocker-note">{b.resolution_note}</span>}
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

      {derivation_provenance && (
        <div className="sqo-semantic-intake__provenance">
          <span className="sqo-semantic-intake__provenance-label">Engine</span>
          <span className="sqo-semantic-intake__provenance-value">{derivation_provenance.engine}</span>
          {isSpe && derivation_provenance.contract_id && (
            <>
              <span className="sqo-semantic-intake__provenance-label">Contract</span>
              <span className="sqo-semantic-intake__provenance-value">{derivation_provenance.contract_id}</span>
            </>
          )}
          {!isSpe && derivation_provenance.compiler_version && (
            <>
              <span className="sqo-semantic-intake__provenance-label">Compiler</span>
              <span className="sqo-semantic-intake__provenance-value">v{derivation_provenance.compiler_version}</span>
            </>
          )}
          {derivation_provenance.generated_at && (
            <>
              <span className="sqo-semantic-intake__provenance-label">Generated</span>
              <span className="sqo-semantic-intake__provenance-value">{new Date(derivation_provenance.generated_at).toLocaleDateString()}</span>
            </>
          )}
          {isSpe && derivation_provenance.learning_events_emitted > 0 && (
            <>
              <span className="sqo-semantic-intake__provenance-label">Learning Events</span>
              <span className="sqo-semantic-intake__provenance-value">{derivation_provenance.learning_events_emitted}</span>
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

function SpeMetrics({ intake }) {
  return (
    <div className="sqo-semantic-intake__metrics">
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{intake.total_propositions}</span>
        <span className="sqo-semantic-intake__metric-label">Propositions</span>
      </div>
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{Object.keys(intake.by_class || {}).length}</span>
        <span className="sqo-semantic-intake__metric-label">Classes</span>
      </div>
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{intake.ceu_coverage}</span>
        <span className="sqo-semantic-intake__metric-label">CEU Coverage</span>
      </div>
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{intake.review_item_count}</span>
        <span className="sqo-semantic-intake__metric-label">Review Items</span>
      </div>
    </div>
  );
}

function CsrMetrics({ intake }) {
  return (
    <div className="sqo-semantic-intake__metrics">
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{intake.total_capabilities}</span>
        <span className="sqo-semantic-intake__metric-label">Capabilities</span>
      </div>
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{intake.total_components}</span>
        <span className="sqo-semantic-intake__metric-label">Components</span>
      </div>
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{(intake.direct_evidence_ratio * 100).toFixed(0)}%</span>
        <span className="sqo-semantic-intake__metric-label">Direct Evidence</span>
      </div>
      <div className="sqo-semantic-intake__metric">
        <span className="sqo-semantic-intake__metric-value">{intake.review_item_count}</span>
        <span className="sqo-semantic-intake__metric-label">Review Items</span>
      </div>
    </div>
  );
}

function formatClassName(cls) {
  return cls.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).toLowerCase().replace(/^\w/, c => c.toUpperCase());
}
