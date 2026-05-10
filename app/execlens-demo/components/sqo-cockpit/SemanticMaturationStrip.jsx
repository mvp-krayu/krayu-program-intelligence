export default function SemanticMaturationStrip({ journey }) {
  if (!journey || !journey.available) {
    return null;
  }

  const { banner, debtCounts, immediateBlockers, remediationStages } = journey;

  return (
    <div className="sqo-maturation-strip">
      <div className="sqo-maturation-strip__state">
        <span className="sqo-maturation-strip__s-state">{banner.s_state}</span>
        {banner.next_reachable && (
          <>
            <span className="sqo-maturation-strip__arrow">→</span>
            <span className="sqo-maturation-strip__target">{banner.next_reachable}</span>
          </>
        )}
      </div>

      <div className="sqo-maturation-strip__counts">
        {debtCounts.immediate > 0 && (
          <span className="sqo-maturation-strip__count sqo-maturation-strip__count--immediate">
            {debtCounts.immediate} blockers
          </span>
        )}
        <span className="sqo-maturation-strip__count sqo-maturation-strip__count--total">
          {debtCounts.total} total debt
        </span>
      </div>

      <div className="sqo-maturation-strip__workflow">
        {remediationStages && remediationStages.length > 0 && (
          <span className="sqo-maturation-strip__stage">
            {remediationStages[0].label} ({remediationStages[0].pathway})
          </span>
        )}
      </div>

      {immediateBlockers && immediateBlockers.length > 0 && (
        <div className="sqo-maturation-strip__blocker-summary">
          {immediateBlockers.slice(0, 3).map(b => (
            <span key={b.id} className="sqo-maturation-strip__blocker">{b.id}</span>
          ))}
          {immediateBlockers.length > 3 && (
            <span className="sqo-maturation-strip__more">+{immediateBlockers.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
}
