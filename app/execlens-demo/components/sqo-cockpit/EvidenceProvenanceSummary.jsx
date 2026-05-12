export default function EvidenceProvenanceSummary({ summary, registryId, ingestionBoundary }) {
  if (!summary) {
    return (
      <div className="evidence-provenance evidence-provenance--empty">
        <h3 className="evidence-provenance__title">Provenance Summary</h3>
        <p className="evidence-provenance__empty-msg">No provenance data available.</p>
      </div>
    );
  }

  return (
    <div className="evidence-provenance">
      <div className="evidence-provenance__header">
        <h3 className="evidence-provenance__title">Provenance Summary</h3>
        <span className="corridor-badge corridor-badge--warn">{ingestionBoundary}</span>
      </div>
      <div className="evidence-provenance__meta">
        <div className="evidence-provenance__meta-item">
          <span className="evidence-provenance__meta-label">Registry</span>
          <span className="evidence-provenance__meta-value">{registryId}</span>
        </div>
        <div className="evidence-provenance__meta-item">
          <span className="evidence-provenance__meta-label">Total Items</span>
          <span className="evidence-provenance__meta-value">{summary.total_items}</span>
        </div>
        <div className="evidence-provenance__meta-item">
          <span className="evidence-provenance__meta-label">Domains Covered</span>
          <span className="evidence-provenance__meta-value">{summary.domains_covered}</span>
        </div>
        <div className="evidence-provenance__meta-item">
          <span className="evidence-provenance__meta-label">Total Size</span>
          <span className="evidence-provenance__meta-value">{summary.total_size_bytes.toLocaleString()} bytes</span>
        </div>
        <div className="evidence-provenance__meta-item">
          <span className="evidence-provenance__meta-label">Correlations Pending</span>
          <span className="evidence-provenance__meta-value">{summary.correlations_pending}</span>
        </div>
      </div>
      <div className="evidence-provenance__source-types">
        <span className="evidence-provenance__source-label">Source Types</span>
        <div className="evidence-provenance__source-list">
          {summary.source_types.map(st => (
            <span key={st} className="evidence-provenance__source-chip">{st}</span>
          ))}
        </div>
      </div>
      <div className="evidence-provenance__flags">
        <div className={`evidence-provenance__flag evidence-provenance__flag--${summary.all_non_authoritative ? 'safe' : 'warn'}`}>
          <span className="evidence-provenance__flag-label">All Non-Authoritative</span>
          <span className="evidence-provenance__flag-value">{summary.all_non_authoritative ? 'YES' : 'NO'}</span>
        </div>
        <div className={`evidence-provenance__flag evidence-provenance__flag--${summary.all_replay_safe ? 'safe' : 'warn'}`}>
          <span className="evidence-provenance__flag-label">All Replay Safe</span>
          <span className="evidence-provenance__flag-value">{summary.all_replay_safe ? 'YES' : 'NO'}</span>
        </div>
      </div>
    </div>
  );
}
