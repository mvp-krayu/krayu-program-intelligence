export default function AuthorityPostureBanner({ posture }) {
  if (!posture) return null;

  const sLevelClass = posture.s_level === 'S1' ? 'sqo-posture--s1' :
    posture.s_level === 'S1.5' ? 'sqo-posture--s15' :
    posture.s_level === 'S2' ? 'sqo-posture--s2' : '';

  return (
    <div className={`sqo-posture-banner ${sLevelClass}`}>
      <div className="sqo-posture-banner__primary">
        <span className="sqo-posture-banner__s-level">{posture.s_level}</span>
        <span className="sqo-posture-banner__ceiling">Authority Ceiling: {posture.authority_ceiling}</span>
        <span className={`sqo-posture-banner__eligibility ${posture.promotion_eligible ? 'sqo-posture-banner__eligibility--eligible' : ''}`}>
          {posture.promotion_eligible ? 'Qualification Advancement Eligible' : 'Advancement Blocked'}
        </span>
      </div>

      {posture.insufficiency_acknowledged && (
        <div className="sqo-posture-banner__insufficiency">
          <span className="sqo-posture-banner__insufficiency-label">
            Insufficiency Acknowledged{posture.insufficiency_permanent ? ' (Permanent)' : ' (Temporary)'}
          </span>
          {posture.insufficiency_justification && (
            <span className="sqo-posture-banner__insufficiency-reason">{posture.insufficiency_justification}</span>
          )}
        </div>
      )}

      <div className="sqo-posture-banner__lanes">
        {(posture.lanes_summary || []).map(lane => (
          <div key={lane.lane} className={`sqo-posture-banner__lane ${lane.has_gaps ? 'sqo-posture-banner__lane--blocked' : 'sqo-posture-banner__lane--clear'}`}>
            <span className="sqo-posture-banner__lane-name">{lane.lane.replace(/_/g, ' ')}</span>
            <span className="sqo-posture-banner__lane-state">{lane.state}</span>
          </div>
        ))}
      </div>

      {posture.promotion_authority_ownership && posture.promotion_authority_ownership.promotion_authority_owner && (
        <div className="sqo-posture-banner__ownership">
          <span>Authority Owner: {posture.promotion_authority_ownership.promotion_authority_owner}</span>
          <span>Scope: {posture.promotion_authority_ownership.promotion_scope}</span>
        </div>
      )}
    </div>
  );
}
