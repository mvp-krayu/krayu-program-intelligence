export default function SourceMaterialGuidancePanel({ guidance }) {
  if (!guidance || guidance.length === 0) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Source Material Guidance</h2>
        <p className="sqo-panel__empty-notice">No source material guidance resolved.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--guidance">
      <h2>Source Material Guidance</h2>
      <p className="sqo-panel__subtitle">Required source materials by debt category</p>

      <div className="sqo-guidance-list">
        {guidance.map(entry => (
          <div key={entry.category} className="sqo-guidance-entry">
            <div className="sqo-guidance-entry__header">
              <span className="sqo-guidance-entry__label">{entry.label}</span>
              <span className="sqo-guidance-entry__count">{entry.debt_count} debt items</span>
            </div>
            <ul className="sqo-guidance-entry__materials">
              {entry.materials.map(material => (
                <li key={material} className="sqo-guidance-entry__material">{material}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
