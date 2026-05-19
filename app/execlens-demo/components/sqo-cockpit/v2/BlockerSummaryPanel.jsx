export default function BlockerSummaryPanel({ blockerSummary, roleProjection }) {
  if (!blockerSummary) return null;

  const { total, by_lane, critical_count, escalation_required } = blockerSummary;
  const lanes = Object.entries(by_lane).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="sqo-v2-blocker-summary">
      <div className="sqo-v2-blocker-summary__header">
        <span className="sqo-v2-blocker-summary__title">Qualification Blockers</span>
        <span className={`sqo-v2-blocker-summary__count ${total === 0 ? 'sqo-v2-blocker-summary__count--clear' : ''}`}>
          {total}
        </span>
      </div>

      {total === 0 && (
        <div className="sqo-v2-blocker-summary__clear">No active qualification blockers.</div>
      )}

      {lanes.length > 0 && (
        <div className="sqo-v2-blocker-summary__lanes">
          {lanes.map(([lane, data]) => (
            <div
              key={lane}
              className={`sqo-v2-blocker-summary__lane ${data.resolvable_by_role ? 'sqo-v2-blocker-summary__lane--resolvable' : 'sqo-v2-blocker-summary__lane--escalation'}`}
            >
              <span className="sqo-v2-blocker-summary__lane-indicator" />
              <span className="sqo-v2-blocker-summary__lane-label">{data.label}</span>
              <span className="sqo-v2-blocker-summary__lane-count">{data.count}</span>
              {!data.resolvable_by_role && (
                <span className="sqo-v2-blocker-summary__lane-escalation">escalation required</span>
              )}
            </div>
          ))}
        </div>
      )}

      {escalation_required && (
        <div className="sqo-v2-blocker-summary__escalation-banner">
          Blockers exist that require a different operational role to resolve.
        </div>
      )}

      {critical_count > 0 && (
        <div className="sqo-v2-blocker-summary__critical">
          {critical_count} critical blocker{critical_count !== 1 ? 's' : ''} preventing promotion
        </div>
      )}
    </div>
  );
}
