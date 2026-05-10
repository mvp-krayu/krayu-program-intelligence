export default function ProgressionRail({ progression, validationGates, visualState }) {
  const isExpansion = visualState && visualState.severity_class === 'expansion';

  return (
    <div className={`sqo-progression-rail ${visualState ? visualState.chromatic_class : ''}`}>
      <h2 className="sqo-progression-rail__title">Progression Pathway</h2>

      {progression ? (
        <div className="sqo-progression-rail__status">
          <div className="sqo-progression-rail__transition">
            <span className="sqo-progression-rail__from">{progression.current}</span>
            <span className="sqo-progression-rail__arrow">→</span>
            <span className="sqo-progression-rail__to">{progression.target}</span>
          </div>
          <div className="sqo-progression-rail__readiness">
            <div className="sqo-progression-rail__bar">
              <div
                className="sqo-progression-rail__fill"
                style={{ width: `${(progression.readiness * 100).toFixed(1)}%` }}
              />
            </div>
            <span className="sqo-progression-rail__readiness-label">
              {resolveReadinessLabel(progression, isExpansion)}
            </span>
          </div>
          <div className="sqo-progression-rail__stats">
            <span>{progression.blocking_count} progression constraints</span>
            <span>{progression.total} total debt items</span>
          </div>
        </div>
      ) : (
        <div className="sqo-progression-rail__status sqo-progression-rail__status--empty">
          <p>Progression data not available.</p>
        </div>
      )}

      {validationGates && validationGates.target && (
        <div className="sqo-progression-rail__gates">
          <h3>{validationGates.target} Eligibility Gates</h3>
          <div className="sqo-progression-rail__gate-status">
            <span className={`sqo-progression-rail__gate-verdict sqo-progression-rail__gate-verdict--${validationGates.current_status.toLowerCase().replace(/_/g, '-')}`}>
              {validationGates.current_status.replace(/_/g, ' ')}
            </span>
          </div>
          <ul className="sqo-progression-rail__gate-list">
            {validationGates.gates.map((gate, idx) => (
              <li key={idx} className={`sqo-progression-rail__gate sqo-progression-rail__gate--${gate.met ? 'met' : 'unmet'}`}>
                <span className="sqo-progression-rail__gate-icon">{gate.met ? '✓' : '✗'}</span>
                <span className="sqo-progression-rail__gate-label">{gate.gate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function resolveReadinessLabel(progression, isExpansion) {
  const pct = progression.readiness * 100;
  if (pct === 0) {
    return isExpansion
      ? `${progression.target} grounding readiness not yet established`
      : `${progression.target} qualification prerequisites incomplete`;
  }
  if (pct < 25) {
    return isExpansion
      ? `${progression.target} grounding readiness emerging`
      : `${progression.target} qualification prerequisites incomplete`;
  }
  if (pct < 75) {
    return isExpansion
      ? `${progression.target} grounding readiness progressing`
      : `${progression.target} qualification readiness progressing`;
  }
  return isExpansion
    ? `${progression.target} grounding readiness approaching`
    : `${progression.target} qualification readiness approaching`;
}
