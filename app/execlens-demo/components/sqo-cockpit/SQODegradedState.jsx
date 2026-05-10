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
    NO_SQO_DATA: 'No SQO artifacts found for this client/run. Initiate a semantic pipeline assessment to generate qualification data.',
    LOAD_FAILURE: 'Failed to load SQO artifacts. Check that artifacts exist at the expected path.',
    CRITICAL_DEGRADATION: `Critical artifacts missing: ${degradation.missing_critical ? degradation.missing_critical.join(', ') : 'unknown'}. Core qualification data is unavailable.`,
    PARTIAL_DEGRADATION: `Some sections are operating with incomplete data. ${degradation.degraded_sections?.length || 0} section(s) degraded, ${degradation.unavailable_sections?.length || 0} unavailable.`,
    REPLAY_FAILED: 'Replay verification has failed. Qualification data integrity cannot be confirmed. Handoff is blocked.',
  };

  const message = stateMessages[degradation.state] || degradation.reason || 'Unknown degradation state.';
  const severity = ['CRITICAL_DEGRADATION', 'NO_SQO_DATA', 'CLIENT_NOT_REGISTERED', 'LOAD_FAILURE'].includes(degradation.state)
    ? 'critical' : 'warning';

  return (
    <div className={`sqo-degraded sqo-degraded--${severity}`}>
      <h2 className="sqo-degraded__title">
        {severity === 'critical' ? 'Cockpit Unavailable' : 'Degraded Operation'}
        {section && <span className="sqo-degraded__section"> — {section}</span>}
      </h2>
      <p className="sqo-degraded__message">{message}</p>
      <div className="sqo-degraded__governance">
        Governance: Missing data is explicitly displayed. No silent fallback. No fabrication.
      </div>
    </div>
  );
}
