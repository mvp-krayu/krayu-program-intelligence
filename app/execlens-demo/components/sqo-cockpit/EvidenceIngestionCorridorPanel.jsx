import EvidenceAuthorityBoundaryNotice from './EvidenceAuthorityBoundaryNotice';
import EvidenceRegistryTable from './EvidenceRegistryTable';
import EvidenceProvenanceSummary from './EvidenceProvenanceSummary';

export default function EvidenceIngestionCorridorPanel({ evidence }) {
  if (!evidence || !evidence.available) {
    return (
      <div className="evidence-corridor evidence-corridor--unavailable">
        <div className="evidence-corridor__header">
          <h2 className="evidence-corridor__title">Evidence Ingestion Corridor</h2>
          <span className="corridor-badge corridor-badge--critical">UNAVAILABLE</span>
        </div>
        <p className="evidence-corridor__error">
          {evidence && evidence.error ? evidence.error : 'Evidence ingestion data could not be loaded.'}
        </p>
      </div>
    );
  }

  return (
    <div className="evidence-corridor">
      <div className="evidence-corridor__header">
        <div className="evidence-corridor__header-left">
          <h2 className="evidence-corridor__title">Evidence Ingestion Corridor</h2>
          <span className="evidence-corridor__subtitle">
            {evidence.client} / {evidence.run_id}
          </span>
        </div>
        <div className="evidence-corridor__header-right">
          <span className="corridor-badge corridor-badge--warn">{evidence.ingestion_boundary}</span>
          <span className="evidence-corridor__item-count">
            {evidence.item_count} evidence candidate{evidence.item_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="evidence-corridor__governance-notice">
        <span>Evidence Ingestion Corridor · Evidence candidates are NOT semantic authority · Ingestion does not mutate grounding, qualification, overlays, or publication · Registration and provenance binding only</span>
      </div>

      <div className="evidence-corridor__sections">
        <EvidenceAuthorityBoundaryNotice governance={evidence.governance} />
        <EvidenceProvenanceSummary
          summary={evidence.summary}
          registryId={evidence.registry_id}
          ingestionBoundary={evidence.ingestion_boundary}
        />
        <EvidenceRegistryTable
          items={evidence.items}
          allVerified={evidence.all_verified}
        />
      </div>

      <div className="evidence-corridor__footer">
        <span className="evidence-corridor__footer-text">
          Evidence candidate registration only · No semantic extraction · No overlay generation · No qualification mutation · No authority assertion
        </span>
      </div>
    </div>
  );
}
