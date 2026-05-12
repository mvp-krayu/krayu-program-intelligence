export default function EvidenceAuthorityBoundaryNotice({ governance }) {
  return (
    <div className="evidence-boundary-notice">
      <div className="evidence-boundary-notice__header">
        <span className="evidence-boundary-notice__title">Evidence Ingestion Boundary</span>
        <span className="corridor-badge corridor-badge--warn">NON-AUTHORITATIVE</span>
      </div>
      <div className="evidence-boundary-notice__rules">
        <span className="evidence-boundary-notice__rule">Evidence candidates are not semantic authority</span>
        <span className="evidence-boundary-notice__separator">&middot;</span>
        <span className="evidence-boundary-notice__rule">Ingestion does not mutate grounding, qualification, overlays, or publication</span>
        <span className="evidence-boundary-notice__separator">&middot;</span>
        <span className="evidence-boundary-notice__rule">Registration and provenance binding only</span>
      </div>
      {governance && (
        <div className="evidence-boundary-notice__flags">
          {governance.no_semantic_mutation && <span className="evidence-boundary-notice__flag">No semantic mutation</span>}
          {governance.no_authority_mutation && <span className="evidence-boundary-notice__flag">No authority mutation</span>}
          {governance.no_overlay_generation && <span className="evidence-boundary-notice__flag">No overlay generation</span>}
          {governance.ingestion_only && <span className="evidence-boundary-notice__flag">Ingestion only</span>}
          {governance.additive_only && <span className="evidence-boundary-notice__flag">Additive only</span>}
        </div>
      )}
    </div>
  );
}
