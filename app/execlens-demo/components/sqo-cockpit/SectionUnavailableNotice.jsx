export default function SectionUnavailableNotice({ section, reason, client, runId }) {
  return (
    <div className="sqo-section-unavailable">
      <div className="sqo-section-unavailable__header">
        <span className="sqo-section-unavailable__badge">UNAVAILABLE</span>
        <span className="sqo-section-unavailable__section">{section}</span>
      </div>
      <p className="sqo-section-unavailable__message">
        This section is not available for the current client and run.
      </p>
      {reason && (
        <div className="sqo-section-unavailable__reason">
          <span className="sqo-section-unavailable__reason-label">Reason</span>
          <span className="sqo-section-unavailable__reason-value">{reason}</span>
        </div>
      )}
      <div className="sqo-section-unavailable__governance">
        No silent fallback · No cross-client data · Fail-closed
      </div>
    </div>
  );
}
