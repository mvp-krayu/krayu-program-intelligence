import AdmissibilityRegistryTable from './AdmissibilityRegistryTable';
import CandidateCompatibilitySummary from './CandidateCompatibilitySummary';
import CandidateQuarantineSummary from './CandidateQuarantineSummary';

export default function DynamicCEUAdmissibilityPanel({ admissibility }) {
  if (!admissibility || !admissibility.available) {
    return (
      <div className="admissibility-panel admissibility-panel--unavailable">
        <h2 className="admissibility-panel__title">Dynamic CEU Admissibility</h2>
        <p className="admissibility-panel__empty">Admissibility evaluation data not available.</p>
      </div>
    );
  }

  const { summary, governance } = admissibility;

  return (
    <div className="admissibility-panel">
      <div className="admissibility-panel__header">
        <div className="admissibility-panel__header-main">
          <h2 className="admissibility-panel__title">Dynamic CEU Admissibility Evaluation</h2>
          <span className="admissibility-panel__subtitle">
            {admissibility.client} / {admissibility.run_id}
          </span>
        </div>
        <div className="admissibility-panel__header-meta">
          <span className="corridor-badge corridor-badge--warn">NON-AUTHORITATIVE</span>
          <span className="admissibility-panel__count">{admissibility.evaluation_count} evaluated</span>
        </div>
      </div>

      {admissibility.source_status && (
        <div className="admissibility-panel__source-status">
          <div className="admissibility-panel__source-status-row">
            <span className="admissibility-panel__source-label">Evidence Set</span>
            <span className="admissibility-panel__source-value">{admissibility.evidence_set_id}</span>
          </div>
          <div className="admissibility-panel__source-status-row">
            <span className="admissibility-panel__source-label">Source Status</span>
            <span className="corridor-badge corridor-badge--ok">{admissibility.source_status}</span>
          </div>
          <div className="admissibility-panel__source-status-row">
            <span className="admissibility-panel__source-label">Source Class</span>
            <span className="admissibility-panel__source-value">{admissibility.source_class}</span>
          </div>
          {admissibility.evidence_files && admissibility.evidence_files.length > 0 && (
            <div className="admissibility-panel__source-status-row">
              <span className="admissibility-panel__source-label">Source Files</span>
              <span className="admissibility-panel__source-value">{admissibility.evidence_files.join(', ')}</span>
            </div>
          )}
          <div className="admissibility-panel__source-warning">
            Tier-1/Tier-2/LENS/gauge outputs are not admissible primary SQO semantic evidence. Only evidence listed in evidence_sources.yaml is valid for SQO semantic analysis.
          </div>
        </div>
      )}

      <div className="admissibility-panel__notice">
        <div className="admissibility-panel__notice-header">
          <span className="admissibility-panel__notice-title">ADMISSIBILITY GOVERNANCE BOUNDARY</span>
          <span className="corridor-badge corridor-badge--neutral">ADMISSIBILITY ONLY</span>
        </div>
        <div className="admissibility-panel__notice-rules">
          <p>Admissibility candidates are NOT qualified semantic truth. They are governance-evaluated signals
            that have passed structural compatibility and replay safety checks. Admissible candidates may
            proceed to future overlay proposal corridors — they do not constitute authority, grounding,
            or publication eligibility.</p>
        </div>
        {governance && (
          <div className="admissibility-panel__governance-flags">
            {governance.no_grounding_mutation && <span className="admissibility-panel__flag">No grounding mutation</span>}
            {governance.no_overlay_generation && <span className="admissibility-panel__flag">No overlay generation</span>}
            {governance.no_qualification_mutation && <span className="admissibility-panel__flag">No qualification mutation</span>}
            {governance.no_authority_assertion && <span className="admissibility-panel__flag">No authority assertion</span>}
            {governance.no_lens_mutation && <span className="admissibility-panel__flag">No LENS mutation</span>}
            {governance.admissibility_evaluation_only && <span className="admissibility-panel__flag">Admissibility evaluation only</span>}
          </div>
        )}
      </div>

      <div className="admissibility-panel__sections">
        <CandidateCompatibilitySummary
          summary={summary}
          upstreamCandidateCount={admissibility.upstream_candidate_count}
          upstreamRegistryId={admissibility.upstream_registry_id}
        />

        <CandidateQuarantineSummary
          evaluations={admissibility.evaluations}
          summary={summary}
        />

        <AdmissibilityRegistryTable
          evaluations={admissibility.evaluations}
          summary={summary}
        />
      </div>

      <div className="admissibility-panel__footer">
        Dynamic CEU admissibility evaluation — read-only governance classification · No overlay generation · No qualification mutation
      </div>
    </div>
  );
}
