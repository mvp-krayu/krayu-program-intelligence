export default function QualificationStateRibbon({ banner, visualState, debtCounts, maturity, continuity }) {
  if (!banner) return null;

  return (
    <div className={`sqo-ribbon ${visualState ? visualState.chromatic_class : ''}`}>
      <div className="sqo-ribbon__segment sqo-ribbon__segment--state">
        <span className="sqo-ribbon__key">{banner.s_state}</span>
        <span className="sqo-ribbon__val">{banner.s_state_label}</span>
      </div>

      <div className="sqo-ribbon__segment sqo-ribbon__segment--auth">
        <span className="sqo-ribbon__label">Auth</span>
        <span className="sqo-ribbon__val">{banner.authorization}</span>
      </div>

      {debtCounts && (
        <div className="sqo-ribbon__segment sqo-ribbon__segment--debt">
          {debtCounts.immediate > 0 && (
            <span className="sqo-ribbon__badge sqo-ribbon__badge--critical">{debtCounts.immediate} blockers</span>
          )}
          <span className="sqo-ribbon__badge sqo-ribbon__badge--total">{debtCounts.total} debt</span>
        </div>
      )}

      {maturity && (
        <div className="sqo-ribbon__segment sqo-ribbon__segment--maturity">
          <span className="sqo-ribbon__label">Maturity</span>
          <span className="sqo-ribbon__val">{maturity.score.toFixed(3)} {maturity.classification}</span>
        </div>
      )}

      {continuity && (
        <div className="sqo-ribbon__segment sqo-ribbon__segment--continuity">
          <span className="sqo-ribbon__label">Continuity</span>
          <span className="sqo-ribbon__val">{continuity.status}</span>
        </div>
      )}
    </div>
  );
}
