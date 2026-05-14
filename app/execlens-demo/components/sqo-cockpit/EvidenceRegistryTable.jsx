export default function EvidenceRegistryTable({ items, allVerified }) {
  if (!items || items.length === 0) {
    return (
      <div className="evidence-registry-table evidence-registry-table--empty">
        <h3 className="evidence-registry-table__title">Evidence Registry</h3>
        <p className="evidence-registry-table__empty-msg">No evidence candidates registered.</p>
      </div>
    );
  }

  return (
    <div className="evidence-registry-table">
      <div className="evidence-registry-table__header">
        <h3 className="evidence-registry-table__title">Evidence Registry</h3>
        <div className="evidence-registry-table__header-meta">
          <span className="evidence-registry-table__count">{items.length} candidate{items.length !== 1 ? 's' : ''}</span>
          <span className={`corridor-badge corridor-badge--${allVerified ? 'safe' : 'warn'}`}>
            {allVerified ? 'ALL VERIFIED' : 'VERIFICATION INCOMPLETE'}
          </span>
        </div>
      </div>
      <div className="evidence-registry-table__grid">
        <div className="evidence-registry-table__row evidence-registry-table__row--header">
          <span className="evidence-registry-table__cell evidence-registry-table__cell--id">ID</span>
          <span className="evidence-registry-table__cell evidence-registry-table__cell--type">Source Type</span>
          <span className="evidence-registry-table__cell evidence-registry-table__cell--hash">Evidence Hash</span>
          <span className="evidence-registry-table__cell evidence-registry-table__cell--domains">Domains</span>
          <span className="evidence-registry-table__cell evidence-registry-table__cell--authority">Authority</span>
          <span className="evidence-registry-table__cell evidence-registry-table__cell--verified">Verified</span>
        </div>
        {items.map(item => (
          <div key={item.evidence_id} className="evidence-registry-table__row">
            <span className="evidence-registry-table__cell evidence-registry-table__cell--id">
              {item.evidence_id}
            </span>
            <span className="evidence-registry-table__cell evidence-registry-table__cell--type">
              {item.source_type}
            </span>
            <span className="evidence-registry-table__cell evidence-registry-table__cell--hash" title={item.evidence_hash_full}>
              {item.evidence_hash || '—'}
            </span>
            <span className="evidence-registry-table__cell evidence-registry-table__cell--domains">
              {item.candidate_domain_count} domain{item.candidate_domain_count !== 1 ? 's' : ''}
            </span>
            <span className="evidence-registry-table__cell evidence-registry-table__cell--authority">
              <span className="corridor-badge corridor-badge--warn">{item.authority_state}</span>
            </span>
            <span className="evidence-registry-table__cell evidence-registry-table__cell--verified">
              <span className={`corridor-badge corridor-badge--${item.hash_verified ? 'safe' : 'critical'}`}>
                {item.hash_verified ? 'PASS' : 'FAIL'}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="evidence-registry-table__item-details">
        {items.map(item => (
          <div key={item.evidence_id} className="evidence-registry-table__detail">
            <div className="evidence-registry-table__detail-header">
              <span className="evidence-registry-table__detail-id">{item.evidence_id}</span>
              <span className="evidence-registry-table__detail-type">{item.source_type}</span>
            </div>
            <div className="evidence-registry-table__detail-body">
              <div className="evidence-registry-table__detail-row">
                <span className="evidence-registry-table__detail-label">Source</span>
                <span className="evidence-registry-table__detail-value">{item.source_path}</span>
              </div>
              <div className="evidence-registry-table__detail-row">
                <span className="evidence-registry-table__detail-label">Provenance</span>
                <span className="evidence-registry-table__detail-value">{item.provenance_origin}</span>
              </div>
              <div className="evidence-registry-table__detail-row">
                <span className="evidence-registry-table__detail-label">Replay Hash</span>
                <span className="evidence-registry-table__detail-value">{item.replay_hash || '—'}</span>
              </div>
              <div className="evidence-registry-table__detail-row">
                <span className="evidence-registry-table__detail-label">Correlation</span>
                <span className="evidence-registry-table__detail-value">{item.structural_correlation_status}</span>
              </div>
              <div className="evidence-registry-table__detail-row">
                <span className="evidence-registry-table__detail-label">Size</span>
                <span className="evidence-registry-table__detail-value">{item.file_size_bytes.toLocaleString()} bytes</span>
              </div>
              {item.description && (
                <div className="evidence-registry-table__detail-row">
                  <span className="evidence-registry-table__detail-label">Description</span>
                  <span className="evidence-registry-table__detail-value">{item.description}</span>
                </div>
              )}
              <div className="evidence-registry-table__detail-row">
                <span className="evidence-registry-table__detail-label">Candidate Domains</span>
                <span className="evidence-registry-table__detail-value evidence-registry-table__detail-value--domains">
                  {item.candidate_domains.map(d => (
                    <span key={d} className="evidence-registry-table__domain-chip">{d}</span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
