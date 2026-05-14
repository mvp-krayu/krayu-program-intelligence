export default function CandidateCompatibilitySummary({ summary, upstreamCandidateCount, upstreamRegistryId }) {
  if (!summary) {
    return (
      <div className="admissibility-summary admissibility-summary--empty">
        <h3 className="admissibility-summary__title">Compatibility Summary</h3>
        <p>No summary data available.</p>
      </div>
    );
  }

  const structDist = summary.structural_compatibility_distribution || {};
  const replayDist = summary.replay_compatibility_distribution || {};

  return (
    <div className="admissibility-summary">
      <div className="admissibility-summary__header">
        <h3 className="admissibility-summary__title">Compatibility Summary</h3>
        {upstreamRegistryId && (
          <span className="admissibility-summary__registry-id">Upstream: {upstreamRegistryId}</span>
        )}
      </div>

      <div className="admissibility-summary__stats">
        <div className="admissibility-summary__stat">
          <span className="admissibility-summary__stat-value">{summary.total_evaluated}</span>
          <span className="admissibility-summary__stat-label">Total Evaluated</span>
        </div>
        <div className="admissibility-summary__stat admissibility-summary__stat--admissible">
          <span className="admissibility-summary__stat-value">{summary.admissible}</span>
          <span className="admissibility-summary__stat-label">Admissible</span>
        </div>
        <div className="admissibility-summary__stat admissibility-summary__stat--quarantined">
          <span className="admissibility-summary__stat-value">{summary.quarantined}</span>
          <span className="admissibility-summary__stat-label">Quarantined</span>
        </div>
        <div className="admissibility-summary__stat admissibility-summary__stat--rejected">
          <span className="admissibility-summary__stat-value">{summary.rejected}</span>
          <span className="admissibility-summary__stat-label">Rejected</span>
        </div>
      </div>

      <div className="admissibility-summary__distributions">
        <div className="admissibility-summary__distribution">
          <span className="admissibility-summary__dist-title">Structural Compatibility</span>
          <div className="admissibility-summary__dist-items">
            <span className="admissibility-summary__dist-item admissibility-summary__dist-item--high">
              HIGH: {structDist.HIGH || 0}
            </span>
            <span className="admissibility-summary__dist-item admissibility-summary__dist-item--moderate">
              MODERATE: {structDist.MODERATE || 0}
            </span>
            <span className="admissibility-summary__dist-item admissibility-summary__dist-item--low">
              LOW: {structDist.LOW || 0}
            </span>
            <span className="admissibility-summary__dist-item admissibility-summary__dist-item--none">
              NONE: {structDist.NONE || 0}
            </span>
          </div>
        </div>

        <div className="admissibility-summary__distribution">
          <span className="admissibility-summary__dist-title">Replay Compatibility</span>
          <div className="admissibility-summary__dist-items">
            <span className="admissibility-summary__dist-item admissibility-summary__dist-item--high">
              COMPATIBLE: {replayDist.COMPATIBLE || 0}
            </span>
            <span className="admissibility-summary__dist-item admissibility-summary__dist-item--moderate">
              UNCERTAIN: {replayDist.UNCERTAIN || 0}
            </span>
            <span className="admissibility-summary__dist-item admissibility-summary__dist-item--none">
              INCOMPATIBLE: {replayDist.INCOMPATIBLE || 0}
            </span>
          </div>
        </div>
      </div>

      {summary.admissible_domains && summary.admissible_domains.length > 0 && (
        <div className="admissibility-summary__domains">
          <span className="admissibility-summary__domains-title">Admissible Domains</span>
          <div className="admissibility-summary__domain-chips">
            {summary.admissible_domains.map(domain => (
              <span key={domain} className="admissibility-summary__domain-chip">{domain}</span>
            ))}
          </div>
        </div>
      )}

      {summary.none_domains_with_admissible && summary.none_domains_with_admissible.length > 0 && (
        <div className="admissibility-summary__domains">
          <span className="admissibility-summary__domains-title">NONE-Lineage Domains with Admissible Candidates</span>
          <div className="admissibility-summary__domain-chips">
            {summary.none_domains_with_admissible.map(domain => (
              <span key={domain} className="admissibility-summary__domain-chip admissibility-summary__domain-chip--none">{domain}</span>
            ))}
          </div>
        </div>
      )}

      {summary.conflict_count > 0 && (
        <div className="admissibility-summary__conflict-notice">
          <span className="corridor-badge corridor-badge--critical">CONFLICTS: {summary.conflict_count}</span>
        </div>
      )}

      <div className="admissibility-summary__authority">
        <span className="admissibility-summary__authority-label">Authority State</span>
        <span className="admissibility-summary__authority-value">
          {summary.all_non_authoritative ? 'ALL NON_AUTHORITATIVE_ADMISSIBILITY_RESULT' : 'MIXED — governance review required'}
        </span>
      </div>
    </div>
  );
}
