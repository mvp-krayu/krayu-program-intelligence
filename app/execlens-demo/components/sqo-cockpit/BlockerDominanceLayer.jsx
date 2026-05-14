export default function BlockerDominanceLayer({ blockers, debtCounts, visualState }) {
  if (!blockers || blockers.length === 0) return null;

  const isProjection = visualState && visualState.severity_class === 'projection';
  const isExpansion = visualState && visualState.severity_class === 'expansion';

  const headerLabel = isProjection
    ? `${blockers.length} Qualification Blocker${blockers.length !== 1 ? 's' : ''}`
    : isExpansion
      ? `${blockers.length} ${blockers[0].blocks_s_state} Expansion Gap${blockers.length !== 1 ? 's' : ''}`
      : `${blockers.length} Qualification Gap${blockers.length !== 1 ? 's' : ''}`;

  const subtitleLabel = isProjection
    ? `Blocking ${blockers[0].blocks_s_state} qualification`
    : isExpansion
      ? `${blockers[0].blocks_s_state} maturation pending`
      : `Remediation required for ${blockers[0].blocks_s_state}`;

  const severityFrame = isProjection ? 'sqo-blocker-dominance--projection'
    : isExpansion ? 'sqo-blocker-dominance--expansion'
    : 'sqo-blocker-dominance--qualification';

  return (
    <div className={`sqo-blocker-dominance ${severityFrame} ${visualState ? visualState.blocker_class : ''}`}>
      <div className="sqo-blocker-dominance__header">
        <h2 className="sqo-blocker-dominance__title">{headerLabel}</h2>
        <span className="sqo-blocker-dominance__subtitle">{subtitleLabel}</span>
      </div>

      <div className="sqo-blocker-dominance__items">
        {blockers.map(item => (
          <div key={item.id} className={`sqo-blocker-dominance__item sqo-blocker-dominance__item--${isExpansion ? 'expansion' : item.severity.toLowerCase()}`}>
            <div className="sqo-blocker-dominance__item-header">
              <span className="sqo-blocker-dominance__item-severity">
                {isExpansion ? 'EXPANSION' : item.severity}
              </span>
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
