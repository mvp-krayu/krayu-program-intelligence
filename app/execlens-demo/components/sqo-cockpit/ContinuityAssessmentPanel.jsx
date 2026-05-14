export default function ContinuityAssessmentPanel({ continuityData }) {
  if (!continuityData) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Continuity Assessment</h2>
        <p className="sqo-panel__empty-notice">No continuity assessment data available.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--continuity">
      <h2>Continuity Assessment</h2>

      <div className={`sqo-continuity-status sqo-continuity-status--${continuityData.overall_status.toLowerCase()}`}>
        {continuityData.overall_status}
      </div>

      <div className="sqo-continuity-metrics">
        <div className="sqo-continuity-metric">
          <span className="sqo-continuity-metric__label">Coverage</span>
          <div className="sqo-continuity-metric__bar">
            <div className="sqo-continuity-metric__fill" style={{ width: `${(continuityData.coverage_ratio * 100).toFixed(1)}%` }} />
          </div>
          <span className="sqo-continuity-metric__value">{(continuityData.coverage_ratio * 100).toFixed(1)}%</span>
        </div>

        <div className="sqo-continuity-metric">
          <span className="sqo-continuity-metric__label">Label Fidelity</span>
          <div className="sqo-continuity-metric__bar">
            <div className="sqo-continuity-metric__fill" style={{ width: `${(continuityData.label_fidelity_ratio * 100).toFixed(1)}%` }} />
          </div>
          <span className="sqo-continuity-metric__value">{(continuityData.label_fidelity_ratio * 100).toFixed(1)}%</span>
        </div>

        <div className="sqo-continuity-metric">
          <span className="sqo-continuity-metric__label">Lineage Strength</span>
          <div className="sqo-continuity-metric__bar">
            <div className="sqo-continuity-metric__fill" style={{ width: `${(continuityData.lineage_strength * 100).toFixed(1)}%` }} />
          </div>
          <span className="sqo-continuity-metric__value">{(continuityData.lineage_strength * 100).toFixed(1)}%</span>
        </div>
      </div>

      {continuityData.metrics && (
        <div className="sqo-continuity-counts">
          <div className="sqo-continuity-count">
            <span className="sqo-continuity-count__value">{continuityData.metrics.entity_count}</span>
            <span className="sqo-continuity-count__label">Entities</span>
          </div>
          <div className="sqo-continuity-count">
            <span className="sqo-continuity-count__value">{continuityData.metrics.topology_node_count}</span>
            <span className="sqo-continuity-count__label">Topology Nodes</span>
          </div>
          <div className="sqo-continuity-count">
            <span className="sqo-continuity-count__value">{continuityData.metrics.domain_count}</span>
            <span className="sqo-continuity-count__label">Domains</span>
          </div>
          <div className="sqo-continuity-count">
            <span className="sqo-continuity-count__value">{continuityData.metrics.domains_grounded}/{continuityData.metrics.domain_count}</span>
            <span className="sqo-continuity-count__label">Domains Grounded</span>
          </div>
        </div>
      )}

      {continuityData.gaps.length > 0 && (
        <div className="sqo-continuity-gaps">
          <h3>Continuity Gaps ({continuityData.gaps.length})</h3>
          {continuityData.gaps.map((gap, i) => (
            <div key={i} className={`sqo-continuity-gap sqo-continuity-gap--${gap.severity.toLowerCase()}`}>
              <div className="sqo-continuity-gap__header">
                <span className="sqo-continuity-gap__type">{formatGapType(gap.gap_type)}</span>
                <span className="sqo-continuity-gap__severity">{gap.severity}</span>
                <span className="sqo-continuity-gap__pathway">{gap.remediation_pathway}</span>
              </div>
              <p className="sqo-continuity-gap__description">{gap.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatGapType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
