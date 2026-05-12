export default function SQODegradedState({ degradation, section }) {
  if (!degradation) {
    return (
      <div className="sqo-degraded sqo-degraded--critical">
        <h2 className="sqo-degraded__title">Load Failure</h2>
        <p className="sqo-degraded__message">Unable to load cockpit data. No silent fallback.</p>
      </div>
    );
  }

  const stateMessages = {
    CLIENT_NOT_REGISTERED: 'This client/run pair is not registered in the manifest. Select a registered client/run to proceed.',
    NO_SQO_DATA: 'No SQO artifacts found for this client/run.',
    LOAD_FAILURE: 'Failed to load SQO artifacts. Check that artifacts exist at the expected path.',
    CRITICAL_DEGRADATION: `Critical artifacts missing: ${degradation.missing_critical ? degradation.missing_critical.join(', ') : 'unknown'}. Core qualification data is unavailable.`,
    PARTIAL_DEGRADATION: `Some sections are operating with incomplete data. ${degradation.degraded_sections?.length || 0} section(s) degraded, ${degradation.unavailable_sections?.length || 0} unavailable.`,
    REPLAY_FAILED: 'Replay verification has failed. Qualification data integrity cannot be confirmed. Handoff is blocked.',
  };

  const message = stateMessages[degradation.state] || degradation.reason || 'Unknown degradation state.';
  const severity = ['CRITICAL_DEGRADATION', 'NO_SQO_DATA', 'CLIENT_NOT_REGISTERED', 'LOAD_FAILURE'].includes(degradation.state)
    ? 'critical' : 'warning';

  const diag = degradation.diagnostics || null;

  return (
    <div className={`sqo-degraded sqo-degraded--${severity}`}>
      <h2 className="sqo-degraded__title">
        {severity === 'critical' ? 'Cockpit Unavailable' : 'Degraded Operation'}
        {section && <span className="sqo-degraded__section"> — {section}</span>}
      </h2>
      <p className="sqo-degraded__message">{message}</p>
      {diag && (
        <div className="sqo-degraded__diagnostics">
          <div className="sqo-degraded__diag-header">Artifact Binding Diagnostics</div>
          <div className="sqo-degraded__diag-row">
            <span className="sqo-degraded__diag-key">Client</span>
            <span className="sqo-degraded__diag-value">{diag.client}</span>
          </div>
          <div className="sqo-degraded__diag-row">
            <span className="sqo-degraded__diag-key">Run</span>
            <span className="sqo-degraded__diag-value">{diag.run_id}</span>
          </div>
          <div className="sqo-degraded__diag-row">
            <span className="sqo-degraded__diag-key">Expected path</span>
            <span className="sqo-degraded__diag-value">{diag.artifact_root}</span>
          </div>
          <div className="sqo-degraded__diag-row">
            <span className="sqo-degraded__diag-key">Present</span>
            <span className="sqo-degraded__diag-value">{diag.present_count} artifacts</span>
          </div>
          <div className="sqo-degraded__diag-row">
            <span className="sqo-degraded__diag-key">Missing</span>
            <span className="sqo-degraded__diag-value">{diag.missing_count} artifacts</span>
          </div>
          {diag.missing && diag.missing.length > 0 && (
            <div className="sqo-degraded__diag-missing">
              {diag.missing.map((m) => (
                <div key={m.key} className="sqo-degraded__diag-missing-item">
                  <span className={`sqo-degraded__diag-status sqo-degraded__diag-status--${m.status === 'MISSING_REQUIRED' ? 'required' : 'optional'}`}>
                    {m.status}
                  </span>
                  <span className="sqo-degraded__diag-path">{m.path}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="sqo-degraded__governance">
        Governance: Missing data is explicitly displayed. No silent fallback. No fabrication.
      </div>
    </div>
  );
}
