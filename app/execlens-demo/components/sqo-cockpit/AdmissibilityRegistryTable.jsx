import { useState } from 'react';

function AdmissibilityBadge({ state }) {
  const classMap = {
    ADMISSIBLE: 'corridor-badge--safe',
    QUARANTINED: 'corridor-badge--warn',
    REJECTED: 'corridor-badge--danger',
    UNRESOLVED: 'corridor-badge--neutral',
  };
  return <span className={`corridor-badge ${classMap[state] || 'corridor-badge--neutral'}`}>{state}</span>;
}

function StructuralBadge({ level }) {
  const classMap = {
    HIGH: 'corridor-badge--safe',
    MODERATE: 'corridor-badge--warn',
    LOW: 'corridor-badge--critical',
    NONE: 'corridor-badge--danger',
  };
  return <span className={`corridor-badge ${classMap[level] || 'corridor-badge--neutral'}`}>{level}</span>;
}

function EvaluationDetailCard({ evaluation }) {
  return (
    <div className="admissibility-table__detail-card">
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Label</span>
        <span className="admissibility-table__detail-value">{evaluation.extracted_label}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Evidence ID</span>
        <span className="admissibility-table__detail-value">{evaluation.evidence_id}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Source Path</span>
        <span className="admissibility-table__detail-value">{evaluation.source_path}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Source Span</span>
        <span className="admissibility-table__detail-value">{evaluation.source_span_reference}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Hash</span>
        <span className="admissibility-table__detail-value">{evaluation.source_hash}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Extraction Method</span>
        <span className="admissibility-table__detail-value">{evaluation.extraction_method}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Domain Lineage</span>
        <span className="admissibility-table__detail-value">{evaluation.domain_lineage_state}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Evidence Repetition</span>
        <span className="admissibility-table__detail-value">{evaluation.evidence_repetition_score} evidence source(s)</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Replay Compatibility</span>
        <span className="admissibility-table__detail-value">{evaluation.replay_compatibility}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Conflict Status</span>
        <span className="admissibility-table__detail-value">{evaluation.conflict_status}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Admissibility Reason</span>
        <span className="admissibility-table__detail-value">{evaluation.admissibility_reason}</span>
      </div>
      {evaluation.quarantine_reason && (
        <div className="admissibility-table__detail-row">
          <span className="admissibility-table__detail-label">Quarantine Reason</span>
          <span className="admissibility-table__detail-value">{evaluation.quarantine_reason}</span>
        </div>
      )}
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Required Next Step</span>
        <span className="admissibility-table__detail-value">{evaluation.required_next_step}</span>
      </div>
      <div className="admissibility-table__detail-row">
        <span className="admissibility-table__detail-label">Authority State</span>
        <span className="admissibility-table__detail-value">{evaluation.authority_state}</span>
      </div>
    </div>
  );
}

function EvaluationSection({ title, badge, evaluations, emptyText }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!evaluations || evaluations.length === 0) {
    return null;
  }

  return (
    <div className="admissibility-table__section">
      <div className="admissibility-table__section-header">
        <span className="admissibility-table__section-title">{title}</span>
        {badge}
        <span className="admissibility-table__section-count">{evaluations.length}</span>
      </div>

      <div className="admissibility-table__grid">
        <div className="admissibility-table__grid-header">
          <span>ID</span>
          <span>Domain</span>
          <span>State</span>
          <span>Structural</span>
          <span>Confidence</span>
          <span>Next Step</span>
        </div>

        {evaluations.map(evaluation => (
          <div key={evaluation.candidate_id}>
            <div
              className="admissibility-table__grid-row"
              onClick={() => setExpandedId(expandedId === evaluation.candidate_id ? null : evaluation.candidate_id)}
            >
              <span className="admissibility-table__cell-id">{evaluation.candidate_id}</span>
              <span className="admissibility-table__cell-domain">{evaluation.candidate_domain}</span>
              <span><AdmissibilityBadge state={evaluation.admissibility_state} /></span>
              <span><StructuralBadge level={evaluation.structural_compatibility} /></span>
              <span className="admissibility-table__cell-confidence">{evaluation.confidence_class}</span>
              <span className="admissibility-table__cell-next">{evaluation.admissibility_state === 'ADMISSIBLE' ? 'OVERLAY ELIGIBLE' : evaluation.admissibility_state === 'QUARANTINED' ? 'REVIEW REQUIRED' : 'BLOCKED'}</span>
            </div>
            {expandedId === evaluation.candidate_id && (
              <EvaluationDetailCard evaluation={evaluation} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdmissibilityRegistryTable({ evaluations, summary }) {
  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="admissibility-table admissibility-table--empty">
        <h3 className="admissibility-table__title">Admissibility Registry</h3>
        <p>No evaluations available.</p>
      </div>
    );
  }

  const admissible = evaluations.filter(e => e.is_admissible);
  const quarantined = evaluations.filter(e => e.is_quarantined);
  const rejected = evaluations.filter(e => e.is_rejected);
  const unresolved = evaluations.filter(e => e.is_unresolved);

  return (
    <div className="admissibility-table">
      <div className="admissibility-table__header">
        <h3 className="admissibility-table__title">Admissibility Registry</h3>
        <span className="admissibility-table__total">{evaluations.length} candidates evaluated</span>
      </div>

      <EvaluationSection
        title="Admissible Candidates"
        badge={<span className="corridor-badge corridor-badge--safe">ADMISSIBLE</span>}
        evaluations={admissible}
      />

      <EvaluationSection
        title="Quarantined Candidates"
        badge={<span className="corridor-badge corridor-badge--warn">QUARANTINED</span>}
        evaluations={quarantined}
      />

      <EvaluationSection
        title="Rejected Candidates"
        badge={<span className="corridor-badge corridor-badge--danger">REJECTED</span>}
        evaluations={rejected}
      />

      {unresolved.length > 0 && (
        <EvaluationSection
          title="Unresolved Candidates"
          badge={<span className="corridor-badge corridor-badge--neutral">UNRESOLVED</span>}
          evaluations={unresolved}
        />
      )}
    </div>
  );
}
