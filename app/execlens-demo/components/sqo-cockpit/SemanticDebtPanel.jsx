export default function SemanticDebtPanel({ debtData }) {
  if (!debtData) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Semantic Debt</h2>
        <p className="sqo-panel__empty-notice">No debt inventory data available.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--debt">
      <h2>Semantic Debt</h2>

      <div className="sqo-debt-summary">
        <span className="sqo-debt-summary__total">{debtData.total_items} total items</span>
        <span className="sqo-debt-summary__blocking">{debtData.blocking_count} blocking</span>
      </div>

      <div className="sqo-debt-severity-overview">
        {Object.entries(debtData.by_severity).map(([severity, items]) => (
          <div key={severity} className={`sqo-debt-severity sqo-debt-severity--${severity.toLowerCase()}`}>
            <span className="sqo-debt-severity__label">{severity}</span>
            <span className="sqo-debt-severity__count">{items.length}</span>
          </div>
        ))}
      </div>

      <div className="sqo-debt-categories">
        {Object.entries(debtData.by_category).map(([category, items]) => (
          <div key={category} className="sqo-debt-category">
            <h3 className="sqo-debt-category__title">{formatCategory(category)} ({items.length})</h3>
            <div className="sqo-debt-items">
              {items.map(item => (
                <div key={item.id} className={`sqo-debt-item sqo-debt-item--${item.severity.toLowerCase()}`}>
                  <div className="sqo-debt-item__header">
                    <span className="sqo-debt-item__id">{item.id}</span>
                    <span className="sqo-debt-item__severity">{item.severity}</span>
                    {item.blocks_s_state && (
                      <span className="sqo-debt-item__blocks">Blocks {item.blocks_s_state}</span>
                    )}
                  </div>
                  <p className="sqo-debt-item__description">{item.description}</p>
                  {item.remediation_pathway && (
                    <div className="sqo-debt-item__remediation">
                      <span>Pathway: {item.remediation_pathway}</span>
                      {item.remediation_action && (
                        <p className="sqo-debt-item__action">{item.remediation_action}</p>
                      )}
                    </div>
                  )}
                  {item.evidence && (
                    <div className="sqo-debt-item__evidence">
                      <span>{item.evidence.artifact_key}: {item.evidence.field_path}</span>
                      <span>Current: {String(item.evidence.current_value)} | Required: {item.evidence.required_value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCategory(category) {
  return category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
