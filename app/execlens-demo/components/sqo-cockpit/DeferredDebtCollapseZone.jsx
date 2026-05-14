import { useState } from 'react';

export default function DeferredDebtCollapseZone({ deferred, active, visibility }) {
  const [expandedSections, setExpandedSections] = useState({});

  const hasDeferred = deferred && deferred.length > 0;
  const hasActive = active && active.length > 0;

  if (!hasDeferred && !hasActive) return null;

  const deferredByTarget = {};
  if (hasDeferred) {
    for (const item of deferred) {
      const target = item.blocks_s_state || 'IMPROVEMENT';
      if (!deferredByTarget[target]) deferredByTarget[target] = [];
      deferredByTarget[target].push(item);
    }
  }

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="sqo-collapse-zone">
      <h2 className="sqo-collapse-zone__title">Deferred &amp; Active Debt</h2>

      {hasActive && (
        <div className="sqo-collapse-zone__section">
          <button
            className={`sqo-collapse-zone__trigger ${expandedSections['active'] ? 'sqo-collapse-zone__trigger--open' : ''}`}
            onClick={() => toggleSection('active')}
          >
            <span className="sqo-collapse-zone__trigger-icon">{expandedSections['active'] ? '▾' : '▸'}</span>
            <span>Active Debt ({active.length})</span>
            <span className="sqo-collapse-zone__trigger-hint">Impacts current posture</span>
          </button>
          {expandedSections['active'] && (
            <div className="sqo-collapse-zone__content">
              {active.map(item => (
                <div key={item.id} className={`sqo-collapse-zone__item sqo-collapse-zone__item--${item.severity.toLowerCase()}`}>
                  <span className="sqo-collapse-zone__item-id">{item.id}</span>
                  <span className="sqo-collapse-zone__item-severity">{item.severity}</span>
                  <p className="sqo-collapse-zone__item-desc">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {Object.entries(deferredByTarget).map(([target, items]) => (
        <div key={target} className="sqo-collapse-zone__section">
          <button
            className={`sqo-collapse-zone__trigger ${expandedSections[target] ? 'sqo-collapse-zone__trigger--open' : ''}`}
            onClick={() => toggleSection(target)}
          >
            <span className="sqo-collapse-zone__trigger-icon">{expandedSections[target] ? '▾' : '▸'}</span>
            <span>{target === 'IMPROVEMENT' ? 'Improvement Debt' : `${target} Expansion Debt`} ({items.length})</span>
            <span className="sqo-collapse-zone__trigger-hint">Deferred</span>
          </button>
          {expandedSections[target] && (
            <div className="sqo-collapse-zone__content">
              {items.map(item => (
                <div key={item.id} className={`sqo-collapse-zone__item sqo-collapse-zone__item--${item.severity.toLowerCase()}`}>
                  <span className="sqo-collapse-zone__item-id">{item.id}</span>
                  <span className="sqo-collapse-zone__item-severity">{item.severity}</span>
                  <p className="sqo-collapse-zone__item-desc">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
