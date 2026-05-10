export default function BlockerDominanceLayer({ blockers, debtCounts, visualState }) {
  if (!blockers || blockers.length === 0) return null;

  return (
    <div className={`sqo-blocker-dominance ${visualState ? visualState.blocker_class : ''}`}>
      <div className="sqo-blocker-dominance__header">
        <h2 className="sqo-blocker-dominance__title">
          {blockers.length} Critical Blocker{blockers.length !== 1 ? 's' : ''}
        </h2>
        <span className="sqo-blocker-dominance__subtitle">
          Blocking {blockers[0].blocks_s_state} qualification
        </span>
      </div>

      <div className="sqo-blocker-dominance__items">
        {blockers.map(item => (
          <div key={item.id} className="sqo-blocker-dominance__item">
            <div className="sqo-blocker-dominance__item-header">
              <span className="sqo-blocker-dominance__item-severity">{item.severity}</span>
              <span className="sqo-blocker-dominance__item-id">{item.id}</span>
              <span className="sqo-blocker-dominance__item-pathway">{item.remediation_pathway}</span>
            </div>
            <p className="sqo-blocker-dominance__item-desc">{item.description}</p>
            {item.remediation_action && (
              <p className="sqo-blocker-dominance__item-action">{item.remediation_action}</p>
            )}
          </div>
        ))}
      </div>

      {debtCounts && (
        <div className="sqo-blocker-dominance__context">
          <span>{debtCounts.active} active</span>
          <span>{debtCounts.deferred} deferred</span>
          <span>{debtCounts.total} total</span>
        </div>
      )}
    </div>
  );
}
