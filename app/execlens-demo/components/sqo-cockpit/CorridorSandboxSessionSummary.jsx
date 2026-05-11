export default function CorridorSandboxSessionSummary({ session }) {
  if (!session || !session.available) {
    return (
      <div className="corridor-section corridor-section--unavailable">
        <h3 className="corridor-section__title">Sandbox Session</h3>
        <p className="corridor-section__empty">Sandbox session data not available.</p>
      </div>
    );
  }

  const isolation = session.isolation || {};
  const composite = session.composite || {};
  const allIsolated = isolation.sandbox_isolation && isolation.no_path_a_mutation
    && isolation.no_path_b_mutation && isolation.no_lens_mutation;

  return (
    <div className="corridor-section">
      <h3 className="corridor-section__title">Sandbox Session</h3>
      <div className="corridor-section__grid">
        <div className="corridor-kv">
          <span className="corridor-kv__key">Session ID</span>
          <span className="corridor-kv__value corridor-kv__value--mono">{session.session_id}</span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Status</span>
          <span className={`corridor-kv__value corridor-badge corridor-badge--${session.lifecycle_status === 'CLOSED' ? 'neutral' : 'active'}`}>
            {session.lifecycle_status}
          </span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Type</span>
          <span className="corridor-kv__value">{session.sandbox_type}</span>
        </div>
        <div className="corridor-kv">
          <span className="corridor-kv__key">Namespace Isolation</span>
          <span className={`corridor-kv__value corridor-badge corridor-badge--${allIsolated ? 'safe' : 'warn'}`}>
            {allIsolated ? 'ENFORCED' : 'PARTIAL'}
          </span>
        </div>
        {session.wave && (
          <div className="corridor-kv">
            <span className="corridor-kv__key">Wave</span>
            <span className="corridor-kv__value">{session.wave} — {session.wave_label}</span>
          </div>
        )}
        {session.substrate_hash && (
          <div className="corridor-kv">
            <span className="corridor-kv__key">Substrate Hash</span>
            <span className="corridor-kv__value corridor-kv__value--mono">{session.substrate_hash}</span>
          </div>
        )}
        {session.baseline_hash && (
          <div className="corridor-kv">
            <span className="corridor-kv__key">Baseline Hash</span>
            <span className="corridor-kv__value corridor-kv__value--mono">{session.baseline_hash}</span>
          </div>
        )}
      </div>
      {composite && composite.s_state && (
        <div className="corridor-section__sub">
          <span className="corridor-section__sub-label">Composite State</span>
          <div className="corridor-section__grid">
            <div className="corridor-kv">
              <span className="corridor-kv__key">S-State</span>
              <span className="corridor-kv__value corridor-badge corridor-badge--state">{composite.s_state}</span>
            </div>
            <div className="corridor-kv">
              <span className="corridor-kv__key">Q-Class</span>
              <span className="corridor-kv__value">{composite.q_class}</span>
            </div>
            <div className="corridor-kv">
              <span className="corridor-kv__key">Grounding</span>
              <span className="corridor-kv__value">{composite.backed_count}/{composite.total_count} ({(composite.grounding_ratio * 100).toFixed(1)}%)</span>
            </div>
            <div className="corridor-kv">
              <span className="corridor-kv__key">Certification</span>
              <span className="corridor-kv__value">{composite.certification_level}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
