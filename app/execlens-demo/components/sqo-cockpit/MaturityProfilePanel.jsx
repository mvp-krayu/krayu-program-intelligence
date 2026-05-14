export default function MaturityProfilePanel({ maturityData }) {
  if (!maturityData) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Maturity Profile</h2>
        <p className="sqo-panel__empty-notice">No maturity profile data available.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--maturity">
      <h2>Maturity Profile</h2>

      <div className="sqo-maturity-overall">
        <div className="sqo-maturity-overall__score">{maturityData.overall.score.toFixed(3)}</div>
        <div className={`sqo-maturity-overall__classification sqo-maturity-overall__classification--${maturityData.overall.classification.toLowerCase()}`}>
          {maturityData.overall.classification_label}
        </div>
      </div>

      <div className="sqo-maturity-dimensions">
        <h3>Dimension Scores (D1–D8)</h3>
        {Object.entries(maturityData.dimensions).map(([key, dim]) => (
          <div key={key} className="sqo-maturity-dimension">
            <div className="sqo-maturity-dimension__header">
              <span className="sqo-maturity-dimension__id">{dim.id}</span>
              <span className="sqo-maturity-dimension__label">{formatDimensionLabel(dim.label)}</span>
              <span className={`sqo-maturity-dimension__classification sqo-maturity-dimension__classification--${dim.classification.toLowerCase()}`}>
                {dim.classification_label}
              </span>
            </div>
            <div className="sqo-maturity-dimension__bar">
              <div
                className={`sqo-maturity-dimension__fill sqo-maturity-dimension__fill--${dim.classification.toLowerCase()}`}
                style={{ width: `${(dim.score * 100).toFixed(1)}%` }}
              />
            </div>
            <span className="sqo-maturity-dimension__score">{dim.score.toFixed(3)}</span>
          </div>
        ))}
      </div>

      <div className="sqo-maturity-composites">
        {maturityData.gravity && (
          <div className="sqo-maturity-composite">
            <h3>Semantic Gravity</h3>
            <div className="sqo-maturity-composite__score">{maturityData.gravity.score.toFixed(3)}</div>
            <div className={`sqo-maturity-composite__classification sqo-maturity-composite__classification--${maturityData.gravity.classification.toLowerCase()}`}>
              {maturityData.gravity.classification_label}
            </div>
            <div className="sqo-maturity-composite__formula">avg(D1, D2, D3, D5, D7)</div>
          </div>
        )}

        {maturityData.stability && (
          <div className="sqo-maturity-composite">
            <h3>Qualification Stability</h3>
            <div className="sqo-maturity-composite__score">{maturityData.stability.score.toFixed(3)}</div>
            <div className={`sqo-maturity-composite__classification sqo-maturity-composite__classification--${maturityData.stability.classification.toLowerCase()}`}>
              {maturityData.stability.classification_label}
            </div>
            <div className="sqo-maturity-composite__formula">avg(D1, D3, D4, D5)</div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDimensionLabel(label) {
  return label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
