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
