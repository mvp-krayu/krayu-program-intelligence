export default function QualificationHeroRegion({ banner, visualState, narratives }) {
  if (!banner || !visualState) {
    return (
      <div className="sqo-hero sqo-hero--empty">
        <h2>Qualification State</h2>
        <p>Insufficient data to resolve qualification posture.</p>
      </div>
    );
  }

  return (
    <div className={`sqo-hero ${visualState.chromatic_class} ${visualState.blocker_class}`}>
      <div className="sqo-hero__state-block">
        <div className="sqo-hero__s-state">{banner.s_state}</div>
        <div className="sqo-hero__state-label">{visualState.state_label}</div>
      </div>

      {visualState.is_blocked && (
        <div className="sqo-hero__blockage">
          <div className="sqo-hero__blockage-label">BLOCKED</div>
          <div className="sqo-hero__blockage-reason">{visualState.blocker_label}</div>
        </div>
      )}

      <div className="sqo-hero__progression">
        {banner.next_reachable && (
          <div className="sqo-hero__next-state">
            <span className="sqo-hero__next-label">Next Possible</span>
            <span className="sqo-hero__next-value">{banner.next_reachable} qualification re-evaluation</span>
          </div>
        )}
        {banner.workflow_stage !== 'No active workflow' && (
          <div className="sqo-hero__workflow">
            <span className="sqo-hero__workflow-label">Active Workflow</span>
            <span className="sqo-hero__workflow-value">
              {banner.workflow_pathway} {banner.workflow_stage.toLowerCase()}
            </span>
          </div>
        )}
      </div>

      {narratives && narratives.current && (
        <div className="sqo-hero__narrative">
          <p>{narratives.current}</p>
        </div>
      )}
    </div>
  );
}
