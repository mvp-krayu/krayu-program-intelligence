export default function CandidateEvidenceLineageSummary({ extractionLog, summary, evidenceRegistryId }) {
  if (!extractionLog || extractionLog.length === 0) {
    return (
      <div className="candidate-lineage candidate-lineage--empty">
        <h3 className="candidate-lineage__title">Evidence Lineage</h3>
        <p className="candidate-lineage__empty-msg">No extraction lineage data available.</p>
      </div>
    );
  }

  return (
    <div className="candidate-lineage">
      <div className="candidate-lineage__header">
        <h3 className="candidate-lineage__title">Evidence Lineage</h3>
        <span className="candidate-lineage__registry-id">{evidenceRegistryId}</span>
      </div>
      <div className="candidate-lineage__summary">
        <div className="candidate-lineage__stat">
          <span className="candidate-lineage__stat-label">Total Candidates</span>
          <span className="candidate-lineage__stat-value">{summary.total_candidates}</span>
        </div>
        <div className="candidate-lineage__stat">
          <span className="candidate-lineage__stat-label">Mapped</span>
          <span className="candidate-lineage__stat-value">{summary.mapped_candidates}</span>
        </div>
        <div className="candidate-lineage__stat">
          <span className="candidate-lineage__stat-label">Unmapped</span>
          <span className="candidate-lineage__stat-value candidate-lineage__stat-value--unmapped">
            {summary.unmapped_candidates}
          </span>
        </div>
        <div className="candidate-lineage__stat">
          <span className="candidate-lineage__stat-label">Domains</span>
          <span className="candidate-lineage__stat-value">{summary.domains_referenced}</span>
        </div>
      </div>
      <div className="candidate-lineage__methods">
        <span className="candidate-lineage__methods-label">Extraction Methods</span>
        <div className="candidate-lineage__method-list">
          {summary.extraction_methods_used.map(m => (
            <span key={m} className="candidate-lineage__method-chip">{m}</span>
          ))}
        </div>
      </div>
      <div className="candidate-lineage__confidence">
        <span className="candidate-lineage__confidence-label">Confidence Distribution</span>
        <div className="candidate-lineage__confidence-row">
          {Object.entries(summary.confidence_distribution).map(([cls, count]) => (
            <div key={cls} className={`candidate-lineage__confidence-item candidate-lineage__confidence-item--${cls.toLowerCase()}`}>
              <span className="candidate-lineage__confidence-count">{count}</span>
              <span className="candidate-lineage__confidence-class">{cls}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="candidate-lineage__log">
        <span className="candidate-lineage__log-label">Extraction Log</span>
        {extractionLog.map(entry => (
          <div key={entry.evidence_id} className={`candidate-lineage__log-entry candidate-lineage__log-entry--${entry.status.toLowerCase()}`}>
            <span className="candidate-lineage__log-id">{entry.evidence_id}</span>
            <span className="candidate-lineage__log-type">{entry.source_type || '—'}</span>
            <span className={`corridor-badge corridor-badge--${entry.status === 'EXTRACTED' ? 'safe' : 'warn'}`}>
              {entry.status}
            </span>
            <span className="candidate-lineage__log-count">{entry.candidates_extracted} candidate{entry.candidates_extracted !== 1 ? 's' : ''}</span>
            <span className={`corridor-badge corridor-badge--${entry.hash_verified ? 'safe' : 'critical'}`}>
              {entry.hash_verified ? 'HASH OK' : 'HASH FAIL'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
