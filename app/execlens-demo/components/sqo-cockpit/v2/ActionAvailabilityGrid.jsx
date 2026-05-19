const CATEGORY_LABELS = {
  review: 'Review Actions',
  promotion: 'Promotion Actions',
  structural: 'Structural Actions',
  escalation: 'Escalation Actions',
  insufficiency: 'Insufficiency',
};

const CATEGORY_ORDER = ['review', 'promotion', 'structural', 'escalation', 'insufficiency'];

export default function ActionAvailabilityGrid({ availableActions, roleProjection, onActionSelect }) {
  if (!availableActions) return null;

  const grouped = {};
  for (const action of availableActions) {
    const cat = action.category || 'review';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(action);
  }

  return (
    <div className="sqo-v2-action-grid">
      <div className="sqo-v2-action-grid__header">
        <span className="sqo-v2-action-grid__title">Available Actions</span>
        <span className="sqo-v2-action-grid__role-badge">{roleProjection?.roleLabel || 'Unknown'}</span>
      </div>

      <div className="sqo-v2-action-grid__categories">
        {CATEGORY_ORDER.filter(cat => grouped[cat]).map(cat => (
          <div key={cat} className="sqo-v2-action-grid__category">
            <span className="sqo-v2-action-grid__category-label">{CATEGORY_LABELS[cat]}</span>
            <div className="sqo-v2-action-grid__items">
              {grouped[cat].map(action => {
                const isRoleBlocked = !action.available && action.required_role;
                const isStateBlocked = !action.available && !action.required_role;
                const stateClass = action.available
                  ? 'sqo-v2-action-grid__item--available'
                  : isRoleBlocked
                    ? 'sqo-v2-action-grid__item--role-blocked'
                    : 'sqo-v2-action-grid__item--state-blocked';

                return (
                  <div key={action.action} className={`sqo-v2-action-grid__item ${stateClass}`}>
                    <div className="sqo-v2-action-grid__item-header">
                      <span className="sqo-v2-action-grid__item-label">{action.label}</span>
                      <span className="sqo-v2-action-grid__item-level">{action.authority_level}</span>
                    </div>
                    {action.available && action.target_count !== null && (
                      <span className="sqo-v2-action-grid__item-count">{action.target_count} target{action.target_count !== 1 ? 's' : ''}</span>
                    )}
                    {!action.available && (
                      <span className="sqo-v2-action-grid__item-reason">{action.reason_if_unavailable}</span>
                    )}
                    {isRoleBlocked && (
                      <span className="sqo-v2-action-grid__item-required-role">Requires: {action.required_role}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
