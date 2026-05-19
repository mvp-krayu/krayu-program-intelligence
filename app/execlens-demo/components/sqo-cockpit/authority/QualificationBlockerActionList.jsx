export default function QualificationBlockerActionList({ blockers }) {
  if (!blockers || blockers.length === 0) {
    return (
      <div className="sqo-blocker-list sqo-blocker-list--empty">
        <p>No qualification blockers.</p>
      </div>
    );
  }

  return (
    <div className="sqo-blocker-list">
      <div className="sqo-blocker-list__count">{blockers.length} qualification blockers</div>
      {blockers.map(blocker => (
        <div key={blocker.blocker_id} className="sqo-blocker-list__item">
          <div className="sqo-blocker-list__item-header">
            <span className="sqo-blocker-list__item-id">{blocker.blocker_id}</span>
            <span className="sqo-blocker-list__item-lane">{blocker.lane}</span>
            <span className="sqo-blocker-list__item-gap">{blocker.gap}</span>
          </div>
          <div className="sqo-blocker-list__item-details">
            <div>
              <span className="sqo-blocker-list__label">Authority:</span>
              {blocker.authority_domain} {blocker.required_level}
            </div>
            <div>
              <span className="sqo-blocker-list__label">Resolution:</span>
              {blocker.resolution}
            </div>
          </div>
          {blocker.related_obligations && blocker.related_obligations.length > 0 && (
            <div className="sqo-blocker-list__related">
              <span className="sqo-blocker-list__label">Related obligations:</span>
              {blocker.related_obligations.map(o => (
                <span key={o.id} className={`sqo-blocker-list__obl sqo-blocker-list__obl--${(o.status || '').toLowerCase()}`}>
                  {o.id} ({o.status})
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
