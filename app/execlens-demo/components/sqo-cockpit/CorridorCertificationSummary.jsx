export default function CorridorCertificationSummary({ certification }) {
  if (!certification || !certification.available) {
    return (
      <div className="corridor-section corridor-section--unavailable">
        <h3 className="corridor-section__title">Certification Progression</h3>
        <p className="corridor-section__empty">Certification data not available.</p>
      </div>
    );
  }

  return (
    <div className="corridor-section">
      <h3 className="corridor-section__title">Certification Progression</h3>
      <div className="corridor-section__grid">
        <div className="corridor-kv">
          <span className="corridor-kv__key">Current Certification</span>
          <span className="corridor-kv__value corridor-badge corridor-badge--state">{certification.current_certification}</span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">S-State</span>
          <span className="corridor-kv__value corridor-badge corridor-badge--state">{certification.s_state}</span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Authority Eligible</span>
          <span className={`corridor-kv__value corridor-badge corridor-badge--${certification.authority_eligible ? 'safe' : 'blocked'}`}>
            {certification.authority_eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
          </span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Publication Eligible</span>
          <span className={`corridor-kv__value corridor-badge corridor-badge--${certification.publication_eligible ? 'safe' : 'blocked'}`}>
            {certification.publication_eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
          </span>
        </div>
      </div>
      {certification.blocking_gates && certification.blocking_gates.length > 0 && (
        <div className="corridor-section__sub">
          <span className="corridor-section__sub-label">Blocking Gates</span>
          <ul className="corridor-gate-list">
            {certification.blocking_gates.map((gate, idx) => (
              <li key={idx} className="corridor-gate-list__item corridor-gate-list__item--blocked">
                <span className="corridor-gate-list__indicator">&#9679;</span>
                <span className="corridor-gate-list__text">{gate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
