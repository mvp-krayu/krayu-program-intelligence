import CandidateAuthorityBoundaryNotice from './CandidateAuthorityBoundaryNotice';
import CandidateEvidenceLineageSummary from './CandidateEvidenceLineageSummary';
import SemanticCandidateRegistryTable from './SemanticCandidateRegistryTable';

export default function SemanticCandidateExtractionPanel({ extraction }) {
  if (!extraction || !extraction.available) {
    return (
      <div className="candidate-panel candidate-panel--unavailable">
        <div className="candidate-panel__header">
          <h2 className="candidate-panel__title">Semantic Candidate Extraction</h2>
          <span className="corridor-badge corridor-badge--critical">UNAVAILABLE</span>
        </div>
        <p className="candidate-panel__error">
          {extraction && extraction.error ? extraction.error : 'Semantic candidate data could not be loaded.'}
        </p>
      </div>
    );
  }

  return (
    <div className="candidate-panel">
      <div className="candidate-panel__header">
        <div className="candidate-panel__header-left">
          <h2 className="candidate-panel__title">Semantic Candidate Extraction</h2>
          <span className="candidate-panel__subtitle">
            {extraction.client} / {extraction.run_id}
          </span>
        </div>
        <div className="candidate-panel__header-right">
          <span className="corridor-badge corridor-badge--warn">NON-AUTHORITATIVE</span>
          <span className="candidate-panel__count">
            {extraction.candidate_count} candidate signal{extraction.candidate_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {extraction.source_status && (
        <div className="candidate-panel__source-status">
          <div className="candidate-panel__source-status-row">
            <span className="candidate-panel__source-label">Evidence Set</span>
            <span className="candidate-panel__source-value">{extraction.evidence_set_id}</span>
          </div>
          <div className="candidate-panel__source-status-row">
            <span className="candidate-panel__source-label">Source Status</span>
            <span className="corridor-badge corridor-badge--ok">{extraction.source_status}</span>
          </div>
          <div className="candidate-panel__source-status-row">
            <span className="candidate-panel__source-label">Source Class</span>
            <span className="candidate-panel__source-value">{extraction.source_class}</span>
          </div>
          {extraction.evidence_files && extraction.evidence_files.length > 0 && (
            <div className="candidate-panel__source-status-row">
              <span className="candidate-panel__source-label">Source Files</span>
              <span className="candidate-panel__source-value">{extraction.evidence_files.join(', ')}</span>
            </div>
          )}
          <div className="candidate-panel__source-warning">
            Tier-1/Tier-2/LENS/gauge outputs are not admissible primary SQO semantic evidence. Only evidence listed in evidence_sources.yaml is valid for SQO semantic analysis.
          </div>
        </div>
      )}

      <div className="candidate-panel__governance-notice">
        <span>Semantic Candidate Extraction Corridor · Candidate semantic signals are NOT qualified semantic truth · Extraction does not mutate grounding, overlays, qualification, or authority · All candidates require Dynamic CEU admissibility evaluation</span>
      </div>

      <div className="candidate-panel__sections">
        <CandidateAuthorityBoundaryNotice governance={extraction.governance} />
        <CandidateEvidenceLineageSummary
          extractionLog={extraction.extraction_log}
          summary={extraction.summary}
          evidenceRegistryId={extraction.evidence_registry_id}
        />
        <SemanticCandidateRegistryTable candidates={extraction.candidates} />
      </div>

      <div className="candidate-panel__footer">
        <span className="candidate-panel__footer-text">
          Candidate semantic signal extraction only · No grounding mutation · No overlay generation · No qualification mutation · No authority assertion · Dynamic CEU admissibility required
        </span>
      </div>
    </div>
  );
}
