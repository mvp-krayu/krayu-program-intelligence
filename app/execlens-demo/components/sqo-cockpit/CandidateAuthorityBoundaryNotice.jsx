export default function CandidateAuthorityBoundaryNotice({ governance }) {
  return (
    <div className="candidate-boundary-notice">
      <div className="candidate-boundary-notice__header">
        <span className="candidate-boundary-notice__title">Semantic Candidate Extraction Boundary</span>
        <span className="corridor-badge corridor-badge--warn">NON-AUTHORITATIVE</span>
      </div>
      <div className="candidate-boundary-notice__rules">
        <span className="candidate-boundary-notice__rule">Candidate semantic signals are NOT qualified semantic truth</span>
        <span className="candidate-boundary-notice__separator">&middot;</span>
        <span className="candidate-boundary-notice__rule">Extraction does not mutate grounding, overlays, qualification, or authority</span>
        <span className="candidate-boundary-notice__separator">&middot;</span>
        <span className="candidate-boundary-notice__rule">All candidates require Dynamic CEU admissibility evaluation</span>
      </div>
      {governance && (
        <div className="candidate-boundary-notice__flags">
          {governance.no_grounding_mutation && <span className="candidate-boundary-notice__flag">No grounding mutation</span>}
          {governance.no_overlay_generation && <span className="candidate-boundary-notice__flag">No overlay generation</span>}
          {governance.no_qualification_mutation && <span className="candidate-boundary-notice__flag">No qualification mutation</span>}
          {governance.no_authority_assertion && <span className="candidate-boundary-notice__flag">No authority assertion</span>}
          {governance.no_lens_mutation && <span className="candidate-boundary-notice__flag">No LENS mutation</span>}
          {governance.extraction_only && <span className="candidate-boundary-notice__flag">Extraction only</span>}
        </div>
      )}
    </div>
  );
}
