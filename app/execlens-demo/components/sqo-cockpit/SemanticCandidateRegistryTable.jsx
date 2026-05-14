export default function SemanticCandidateRegistryTable({ candidates }) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="candidate-registry candidate-registry--empty">
        <h3 className="candidate-registry__title">Candidate Registry</h3>
        <p className="candidate-registry__empty-msg">No candidate semantic signals extracted.</p>
      </div>
    );
  }

  const mapped = candidates.filter(c => !c.is_unmapped);
  const unmapped = candidates.filter(c => c.is_unmapped);

  return (
    <div className="candidate-registry">
      <div className="candidate-registry__header">
        <h3 className="candidate-registry__title">Candidate Semantic Signals</h3>
        <div className="candidate-registry__header-meta">
          <span className="candidate-registry__count">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</span>
          <span className="corridor-badge corridor-badge--warn">NON-AUTHORITATIVE</span>
        </div>
      </div>

      <div className="candidate-registry__grid">
        <div className="candidate-registry__row candidate-registry__row--header">
          <span className="candidate-registry__cell candidate-registry__cell--id">ID</span>
          <span className="candidate-registry__cell candidate-registry__cell--label">Extracted Label</span>
          <span className="candidate-registry__cell candidate-registry__cell--domain">Domain</span>
          <span className="candidate-registry__cell candidate-registry__cell--confidence">Confidence</span>
          <span className="candidate-registry__cell candidate-registry__cell--method">Method</span>
          <span className="candidate-registry__cell candidate-registry__cell--gate">Next Gate</span>
        </div>
        {mapped.map(c => (
          <div key={c.candidate_id} className="candidate-registry__row">
            <span className="candidate-registry__cell candidate-registry__cell--id">{c.candidate_id}</span>
            <span className="candidate-registry__cell candidate-registry__cell--label" title={c.extracted_label}>
              {c.extracted_label}
            </span>
            <span className="candidate-registry__cell candidate-registry__cell--domain">{c.candidate_domain}</span>
            <span className="candidate-registry__cell candidate-registry__cell--confidence">
              <span className={`corridor-badge corridor-badge--${c.confidence_class === 'STRONG' ? 'safe' : c.confidence_class === 'MODERATE' ? 'warn' : 'danger'}`}>
                {c.confidence_class}
              </span>
            </span>
            <span className="candidate-registry__cell candidate-registry__cell--method">{c.extraction_method}</span>
            <span className="candidate-registry__cell candidate-registry__cell--gate">
              <span className="corridor-badge corridor-badge--neutral">CEU REQUIRED</span>
            </span>
          </div>
        ))}
      </div>

      {unmapped.length > 0 && (
        <div className="candidate-registry__unmapped">
          <div className="candidate-registry__unmapped-header">
            <span className="candidate-registry__unmapped-title">Unmapped Candidates</span>
            <span className="candidate-registry__unmapped-count">{unmapped.length} unmapped</span>
          </div>
          <div className="candidate-registry__grid">
            {unmapped.map(c => (
              <div key={c.candidate_id} className="candidate-registry__row candidate-registry__row--unmapped">
                <span className="candidate-registry__cell candidate-registry__cell--id">{c.candidate_id}</span>
                <span className="candidate-registry__cell candidate-registry__cell--label" title={c.extracted_label}>
                  {c.extracted_label}
                </span>
                <span className="candidate-registry__cell candidate-registry__cell--domain">
                  <span className="corridor-badge corridor-badge--critical">UNMAPPED</span>
                </span>
                <span className="candidate-registry__cell candidate-registry__cell--confidence">
                  <span className={`corridor-badge corridor-badge--${c.confidence_class === 'STRONG' ? 'safe' : c.confidence_class === 'MODERATE' ? 'warn' : 'danger'}`}>
                    {c.confidence_class}
                  </span>
                </span>
                <span className="candidate-registry__cell candidate-registry__cell--method">{c.extraction_method}</span>
                <span className="candidate-registry__cell candidate-registry__cell--gate">
                  <span className="corridor-badge corridor-badge--neutral">CEU REQUIRED</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="candidate-registry__details">
        {candidates.map(c => (
          <div key={c.candidate_id} className={`candidate-registry__detail ${c.is_unmapped ? 'candidate-registry__detail--unmapped' : ''}`}>
            <div className="candidate-registry__detail-header">
              <span className="candidate-registry__detail-id">{c.candidate_id}</span>
              <span className="candidate-registry__detail-type">{c.candidate_type}</span>
              {c.is_unmapped && <span className="corridor-badge corridor-badge--critical">UNMAPPED</span>}
            </div>
            <div className="candidate-registry__detail-body">
              <div className="candidate-registry__detail-row">
                <span className="candidate-registry__detail-key">Label</span>
                <span className="candidate-registry__detail-val">{c.extracted_label}</span>
              </div>
              <div className="candidate-registry__detail-row">
                <span className="candidate-registry__detail-key">Evidence</span>
                <span className="candidate-registry__detail-val">{c.evidence_id}</span>
              </div>
              <div className="candidate-registry__detail-row">
                <span className="candidate-registry__detail-key">Source</span>
                <span className="candidate-registry__detail-val">{c.source_path}</span>
              </div>
              <div className="candidate-registry__detail-row">
                <span className="candidate-registry__detail-key">Source Span</span>
                <span className="candidate-registry__detail-val">{c.source_span_reference}</span>
              </div>
              <div className="candidate-registry__detail-row">
                <span className="candidate-registry__detail-key">Hash</span>
                <span className="candidate-registry__detail-val">{c.source_hash || '—'}</span>
              </div>
              <div className="candidate-registry__detail-row">
                <span className="candidate-registry__detail-key">Authority</span>
                <span className="candidate-registry__detail-val">{c.authority_state}</span>
              </div>
              <div className="candidate-registry__detail-row">
                <span className="candidate-registry__detail-key">Next Gate</span>
                <span className="candidate-registry__detail-val">{c.next_required_gate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
