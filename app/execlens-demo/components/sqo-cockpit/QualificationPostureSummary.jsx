export default function QualificationPostureSummary({ qualificationPosture, sectionAvailability, navigation, runtimeCapabilities, onNavigate }) {
  if (!qualificationPosture) {
    return (
      <div className="sqo-posture-summary sqo-posture-summary--empty">
        <p>No qualification data available for this client.</p>
      </div>
    );
  }

  const { posture, postureLabel, s_level, summary } = qualificationPosture;
  const availableSections = navigation ? navigation.filter(n => n.section !== 'overview' && sectionAvailability && sectionAvailability[n.section]) : [];
  const caps = runtimeCapabilities || {};

  return (
    <div className="sqo-posture-summary">
      <div className="sqo-posture-summary__header">
        {s_level && <span className="sqo-posture-summary__s-badge">{s_level}</span>}
        <span className="sqo-posture-summary__posture">{postureLabel}</span>
      </div>

      <p className="sqo-posture-summary__headline">{summary}</p>

      <div className="sqo-posture-summary__capabilities">
        <h3 className="sqo-posture-summary__section-title">Runtime Capabilities</h3>
        <div className="sqo-posture-summary__cap-grid">
          {caps.structural_topology && (
            <div className="sqo-posture-summary__cap-item sqo-posture-summary__cap-item--active">
              <span className="sqo-posture-summary__cap-indicator">●</span>
              <span className="sqo-posture-summary__cap-label">Structural Topology</span>
            </div>
          )}
          {caps.semantic_candidates && (
            <div className="sqo-posture-summary__cap-item sqo-posture-summary__cap-item--active">
              <span className="sqo-posture-summary__cap-indicator">●</span>
              <span className="sqo-posture-summary__cap-label">Semantic Intake</span>
            </div>
          )}
          {caps.authority_runtime && (
            <div className="sqo-posture-summary__cap-item sqo-posture-summary__cap-item--active">
              <span className="sqo-posture-summary__cap-indicator">●</span>
              <span className="sqo-posture-summary__cap-label">Authority Workflow</span>
            </div>
          )}
          {caps.qualification_blockers && (
            <div className="sqo-posture-summary__cap-item sqo-posture-summary__cap-item--active">
              <span className="sqo-posture-summary__cap-indicator">●</span>
              <span className="sqo-posture-summary__cap-label">Qualification Blockers</span>
            </div>
          )}
          {caps.vault_readiness && (
            <div className="sqo-posture-summary__cap-item sqo-posture-summary__cap-item--active">
              <span className="sqo-posture-summary__cap-indicator">●</span>
              <span className="sqo-posture-summary__cap-label">Vault Readiness</span>
            </div>
          )}
          {caps.event_lineage && (
            <div className="sqo-posture-summary__cap-item sqo-posture-summary__cap-item--active">
              <span className="sqo-posture-summary__cap-indicator">●</span>
              <span className="sqo-posture-summary__cap-label">Event Lineage</span>
            </div>
          )}
          {caps.static_qualification && (
            <div className="sqo-posture-summary__cap-item sqo-posture-summary__cap-item--active">
              <span className="sqo-posture-summary__cap-indicator">●</span>
              <span className="sqo-posture-summary__cap-label">Static Qualification</span>
            </div>
          )}
        </div>
      </div>

      {availableSections.length > 0 && (
        <div className="sqo-posture-summary__sections">
          <h3 className="sqo-posture-summary__section-title">Available Sections</h3>
          <nav className="sqo-posture-summary__section-nav">
            {availableSections.map(nav => (
              <a
                key={nav.section}
                href={nav.path}
                className="sqo-posture-summary__section-link"
                onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(nav.section); } }}
              >
                {nav.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div className="sqo-posture-summary__governance">
        Qualification posture derived from operational state · No visualization projection · Deterministic
      </div>
    </div>
  );
}
