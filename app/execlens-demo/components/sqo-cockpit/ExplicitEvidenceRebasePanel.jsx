import { useState } from 'react';

export default function ExplicitEvidenceRebasePanel({ rebase }) {
  const [expandedFile, setExpandedFile] = useState(null);
  const [showCandidates, setShowCandidates] = useState(false);

  if (!rebase || !rebase.available) {
    return (
      <div className="rebase-panel rebase-panel--unavailable">
        <h2 className="rebase-panel__title">Explicit Evidence Rebase</h2>
        <p className="rebase-panel__empty">Evidence rebase data not available.</p>
      </div>
    );
  }

  const { summary, governance } = rebase;

  return (
    <div className="rebase-panel">
      <div className="rebase-panel__header">
        <div className="rebase-panel__header-main">
          <h2 className="rebase-panel__title">Explicit Evidence Rebase</h2>
          <span className="rebase-panel__subtitle">
            {rebase.client} / {rebase.run_id} / {rebase.evidence_set_id}
          </span>
        </div>
        <div className="rebase-panel__header-meta">
          <span className="corridor-badge corridor-badge--ok">UPSTREAM BOUND</span>
          <span className="rebase-panel__count">{rebase.evidence_count} sources</span>
        </div>
      </div>

      {rebase.is_previous_non_authoritative && (
        <div className="rebase-panel__warning">
          <div className="rebase-panel__warning-header">
            <span className="rebase-panel__warning-title">PRE-REBASE CHAIN STATUS</span>
            <span className="corridor-badge corridor-badge--warn">PRE_REBASE_NON_AUTHORITATIVE</span>
          </div>
          <p className="rebase-panel__warning-text">
            Previous extraction and admissibility chain produced from non-explicit evidence sources
            is marked PRE_REBASE_NON_AUTHORITATIVE. Those outputs remain in the repository for
            lineage traceability but are superseded by this rebased chain bound to operator-provided
            upstream evidence.
          </p>
        </div>
      )}

      <div className="rebase-panel__notice">
        <div className="rebase-panel__notice-header">
          <span className="rebase-panel__notice-title">EVIDENCE REBASE GOVERNANCE BOUNDARY</span>
          <span className="corridor-badge corridor-badge--neutral">REBASE ONLY</span>
        </div>
        <div className="rebase-panel__notice-rules">
          <p>This corridor displays the rebased evidence chain bound to explicitly operator-provided
            upstream HTML files. All extraction and admissibility evaluation was performed deterministically
            against these source files only. No prior chain outputs were used as inputs.</p>
        </div>
        {governance && (
          <div className="rebase-panel__governance-flags">
            {governance.no_grounding_mutation && <span className="rebase-panel__flag">No grounding mutation</span>}
            {governance.no_overlay_generation && <span className="rebase-panel__flag">No overlay generation</span>}
            {governance.no_qualification_mutation && <span className="rebase-panel__flag">No qualification mutation</span>}
            {governance.no_authority_assertion && <span className="rebase-panel__flag">No authority assertion</span>}
            {governance.no_lens_mutation && <span className="rebase-panel__flag">No LENS mutation</span>}
            {governance.upstream_evidence_bound && <span className="rebase-panel__flag">Upstream evidence bound</span>}
          </div>
        )}
      </div>

      <div className="rebase-panel__sections">
        <div className="rebase-panel__section">
          <h3 className="rebase-panel__section-title">Evidence Source Set</h3>
          <div className="rebase-panel__stats-grid">
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{rebase.evidence_count}</span>
              <span className="rebase-panel__stat-label">Files</span>
            </div>
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{formatBytes(rebase.total_bytes)}</span>
              <span className="rebase-panel__stat-label">Total Size</span>
            </div>
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{rebase.all_operator_provided ? 'YES' : 'NO'}</span>
              <span className="rebase-panel__stat-label">All Operator-Provided</span>
            </div>
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{rebase.source_status}</span>
              <span className="rebase-panel__stat-label">Source Status</span>
            </div>
          </div>

          <div className="rebase-panel__file-list">
            {rebase.evidence_items.map((item, idx) => (
              <div
                key={item.evidence_id}
                className={`rebase-panel__file-item ${expandedFile === idx ? 'rebase-panel__file-item--expanded' : ''}`}
              >
                <div
                  className="rebase-panel__file-header"
                  onClick={() => setExpandedFile(expandedFile === idx ? null : idx)}
                >
                  <span className="rebase-panel__file-id">{item.evidence_id}</span>
                  <span className="rebase-panel__file-name">{item.filename}</span>
                  <span className="rebase-panel__file-type">{item.source_type}</span>
                  <span className="rebase-panel__file-hash">{item.evidence_hash}</span>
                </div>
                {expandedFile === idx && (
                  <div className="rebase-panel__file-detail">
                    <div className="rebase-panel__detail-row">
                      <span className="rebase-panel__detail-key">Size</span>
                      <span className="rebase-panel__detail-value">{formatBytes(item.byte_size)}</span>
                    </div>
                    <div className="rebase-panel__detail-row">
                      <span className="rebase-panel__detail-key">Source Class</span>
                      <span className="rebase-panel__detail-value">{item.source_class}</span>
                    </div>
                    <div className="rebase-panel__detail-row">
                      <span className="rebase-panel__detail-key">Operator Provided</span>
                      <span className="rebase-panel__detail-value">{item.operator_provided ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="rebase-panel__detail-row">
                      <span className="rebase-panel__detail-key">Full Hash</span>
                      <span className="rebase-panel__detail-value rebase-panel__detail-value--mono">{item.evidence_hash_full}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rebase-panel__section">
          <h3 className="rebase-panel__section-title">Extraction Summary</h3>
          <div className="rebase-panel__stats-grid">
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{summary.total_candidates}</span>
              <span className="rebase-panel__stat-label">Total Candidates</span>
            </div>
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{summary.mapped_candidates}</span>
              <span className="rebase-panel__stat-label">Mapped</span>
            </div>
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{summary.unmapped_candidates}</span>
              <span className="rebase-panel__stat-label">Unmapped</span>
            </div>
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{summary.domains_referenced.length}</span>
              <span className="rebase-panel__stat-label">Domains Referenced</span>
            </div>
          </div>

          <div className="rebase-panel__extraction-log">
            {rebase.extraction_log.map((entry) => (
              <div key={entry.evidence_id} className="rebase-panel__log-entry">
                <span className="rebase-panel__log-id">{entry.evidence_id}</span>
                <span className="rebase-panel__log-type">{entry.source_type}</span>
                <span className="rebase-panel__log-count">{entry.candidates_extracted} candidates</span>
                <span className={`rebase-panel__log-hash ${entry.hash_verified ? 'rebase-panel__log-hash--verified' : ''}`}>
                  {entry.hash_verified ? 'HASH VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rebase-panel__section">
          <h3 className="rebase-panel__section-title">Inline Admissibility</h3>
          <div className="rebase-panel__stats-grid">
            <div className="rebase-panel__stat rebase-panel__stat--ok">
              <span className="rebase-panel__stat-value">{summary.admissible}</span>
              <span className="rebase-panel__stat-label">Admissible</span>
            </div>
            <div className="rebase-panel__stat rebase-panel__stat--warn">
              <span className="rebase-panel__stat-value">{summary.quarantined}</span>
              <span className="rebase-panel__stat-label">Quarantined</span>
            </div>
            <div className="rebase-panel__stat rebase-panel__stat--error">
              <span className="rebase-panel__stat-value">{summary.rejected}</span>
              <span className="rebase-panel__stat-label">Rejected</span>
            </div>
            <div className="rebase-panel__stat">
              <span className="rebase-panel__stat-value">{summary.total_evaluated}</span>
              <span className="rebase-panel__stat-label">Total Evaluated</span>
            </div>
          </div>

          <button
            className="rebase-panel__toggle"
            onClick={() => setShowCandidates(!showCandidates)}
          >
            {showCandidates ? 'Hide' : 'Show'} candidate details ({rebase.evaluation_count})
          </button>

          {showCandidates && (
            <div className="rebase-panel__candidate-list">
              {rebase.evaluations.map((ev) => (
                <div
                  key={ev.candidate_id}
                  className={`rebase-panel__candidate ${
                    ev.is_admissible ? 'rebase-panel__candidate--admissible' :
                    ev.is_quarantined ? 'rebase-panel__candidate--quarantined' :
                    'rebase-panel__candidate--rejected'
                  }`}
                >
                  <div className="rebase-panel__candidate-header">
                    <span className="rebase-panel__candidate-id">{ev.candidate_id}</span>
                    <span className={`corridor-badge corridor-badge--${
                      ev.is_admissible ? 'ok' : ev.is_quarantined ? 'warn' : 'error'
                    }`}>{ev.admissibility_state}</span>
                  </div>
                  <div className="rebase-panel__candidate-body">
                    <div className="rebase-panel__candidate-label">{ev.extracted_label}</div>
                    <div className="rebase-panel__candidate-meta">
                      <span>{ev.candidate_type}</span>
                      <span>{ev.candidate_domain}</span>
                      <span>{ev.structural_compatibility}</span>
                      <span>{ev.confidence_class}</span>
                    </div>
                    <div className="rebase-panel__candidate-reason">{ev.admissibility_reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {summary.domains_referenced.length > 0 && (
          <div className="rebase-panel__section">
            <h3 className="rebase-panel__section-title">Domains Referenced</h3>
            <div className="rebase-panel__domain-chips">
              {summary.domains_referenced.map((domain) => (
                <span key={domain} className="rebase-panel__domain-chip">{domain}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rebase-panel__footer">
        Explicit evidence rebase corridor — upstream evidence bound · Read-only governance · No overlay generation · No qualification mutation
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}
