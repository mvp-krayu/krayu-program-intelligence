export default function QualificationJourneyBanner({ banner }) {
  if (!banner) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Qualification Journey</h2>
        <p className="sqo-panel__empty-notice">Insufficient data to resolve qualification journey.</p>
      </div>
    );
  }

  return (
    <div className={`sqo-journey-banner sqo-journey-banner--${banner.blocker_class.toLowerCase()}`}>
      <div className="sqo-journey-banner__header">
        <div className="sqo-journey-banner__state">
          <span className="sqo-journey-banner__s-state">{banner.s_state}</span>
          <span className="sqo-journey-banner__s-label">{banner.s_state_label}</span>
        </div>
        {banner.next_reachable && (
          <div className="sqo-journey-banner__target">
            <span className="sqo-journey-banner__arrow">→</span>
            <span className="sqo-journey-banner__next">{banner.next_reachable}</span>
          </div>
        )}
      </div>

      <div className="sqo-journey-banner__details">
        <div className="sqo-journey-banner__detail">
          <span className="sqo-journey-banner__detail-label">Authorization</span>
          <span className="sqo-journey-banner__detail-value">{banner.authorization}</span>
        </div>
        <div className="sqo-journey-banner__detail">
          <span className="sqo-journey-banner__detail-label">Blocker Class</span>
          <span className={`sqo-journey-banner__detail-value sqo-journey-banner__detail-value--${banner.blocker_class === 'NONE' ? 'clear' : 'blocked'}`}>
            {formatBlockerClass(banner.blocker_class)}
          </span>
        </div>
        <div className="sqo-journey-banner__detail">
          <span className="sqo-journey-banner__detail-label">Workflow Stage</span>
          <span className="sqo-journey-banner__detail-value">{banner.workflow_stage}</span>
        </div>
        {banner.workflow_pathway && (
          <div className="sqo-journey-banner__detail">
            <span className="sqo-journey-banner__detail-label">Pathway</span>
            <span className="sqo-journey-banner__detail-value">{banner.workflow_pathway}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatBlockerClass(blockerClass) {
  return blockerClass.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
