export default function CorridorLineageTraceSummary({ lineageTrace }) {
  if (!lineageTrace || !lineageTrace.available) {
    return (
      <div className="corridor-section corridor-section--unavailable">
        <h3 className="corridor-section__title">Lineage Trace</h3>
        <p className="corridor-section__empty">Lineage trace data not available.</p>
      </div>
    );
  }

  const chains = [
    { label: 'Evidence Lineage', data: lineageTrace.evidence_lineage, detail: `${lineageTrace.evidence_lineage.nodes} nodes` },
    { label: 'Overlay Lineage', data: lineageTrace.overlay_lineage, detail: `${lineageTrace.overlay_lineage.nodes} nodes` },
    {
      label: 'Replay Lineage',
      data: lineageTrace.replay_lineage,
      detail: `${lineageTrace.replay_lineage.verifications} verifications · ${lineageTrace.replay_lineage.all_match ? 'all match' : 'divergence detected'}`,
    },
    {
      label: 'Rollback Lineage',
      data: lineageTrace.rollback_lineage,
      detail: lineageTrace.rollback_lineage.round_trip ? 'round-trip verified' : 'round-trip pending',
    },
  ];

  const statusClass = (status) => {
    if (status === 'VERIFIED' || status === 'INTACT') return 'safe';
    if (status === 'PENDING' || status === 'NOT_STARTED') return 'blocked';
    return 'warn';
  };

  return (
    <div className="corridor-section">
      <h3 className="corridor-section__title">Lineage Trace</h3>
      <div className="corridor-lineage-list">
        {chains.map(chain => (
          <div key={chain.label} className="corridor-lineage-item">
            <div className="corridor-lineage-item__header">
              <span className="corridor-lineage-item__label">{chain.label}</span>
              <span className={`corridor-badge corridor-badge--${statusClass(chain.data.status)}`}>
                {chain.data.status}
              </span>
            </div>
            <span className="corridor-lineage-item__detail">{chain.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
