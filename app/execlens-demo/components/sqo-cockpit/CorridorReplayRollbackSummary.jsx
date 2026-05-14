export default function CorridorReplayRollbackSummary({ replayRollback }) {
  if (!replayRollback || !replayRollback.available) {
    return (
      <div className="corridor-section corridor-section--unavailable">
        <h3 className="corridor-section__title">Replay / Rollback Validation</h3>
        <p className="corridor-section__empty">Replay and rollback data not available.</p>
      </div>
    );
  }

  const { replay, rollback } = replayRollback;

  return (
    <div className="corridor-section">
      <h3 className="corridor-section__title">Replay / Rollback Validation</h3>

      <div className="corridor-section__sub">
        <span className="corridor-section__sub-label">Replay Verification</span>
        <div className="corridor-section__grid">
          <div className="corridor-kv">
            <span className="corridor-kv__key">States Verified</span>
            <span className="corridor-kv__value">{replay.states_verified}</span>
          </div>
          <div className="corridor-kv">
            <span className="corridor-kv__key">Replay Status</span>
            <span className={`corridor-kv__value corridor-badge corridor-badge--${replay.all_match ? 'safe' : 'warn'}`}>
              {replay.all_match ? 'ALL MATCH' : `${replay.match_count}/${replay.verifications_count} MATCH`}
            </span>
          </div>
          <div className="corridor-kv">
            <span className="corridor-kv__key">Baseline Hash</span>
            <span className={`corridor-kv__value corridor-badge corridor-badge--${replayRollback.baseline_hash_status === 'VERIFIED' ? 'safe' : 'warn'}`}>
              {replayRollback.baseline_hash_status}
            </span>
          </div>
        </div>
        {replay.states && replay.states.length > 0 && (
          <div className="corridor-state-chain">
            {replay.states.map((state, idx) => (
              <div key={state.label} className="corridor-state-chain__node">
                <span className="corridor-state-chain__label">{state.label.replace(/_/g, ' ')}</span>
                <span className="corridor-state-chain__value">
                  {state.backed_count}/{17} backed · {(state.grounding_ratio * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="corridor-section__sub">
        <span className="corridor-section__sub-label">Rollback Verification</span>
        <div className="corridor-section__grid">
          <div className="corridor-kv">
            <span className="corridor-kv__key">Round-Trip</span>
            <span className={`corridor-kv__value corridor-badge corridor-badge--${rollback.round_trip_verified ? 'safe' : 'warn'}`}>
              {rollback.round_trip_verified ? 'VERIFIED (T0 = T6)' : 'NOT VERIFIED'}
            </span>
          </div>
          <div className="corridor-kv">
            <span className="corridor-kv__key">Proof Type</span>
            <span className="corridor-kv__value">{rollback.proof_type}</span>
          </div>
          <div className="corridor-kv">
            <span className="corridor-kv__key">Overlays in Round-Trip</span>
            <span className="corridor-kv__value">{rollback.overlays_in_round_trip.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
