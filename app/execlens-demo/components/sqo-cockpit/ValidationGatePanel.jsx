export default function ValidationGatePanel({ gates }) {
  if (!gates || !gates.target) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Validation Gates</h2>
        <p className="sqo-panel__empty-notice">No validation gates defined for current state.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--validation-gates">
      <h2>Validation Gates — {gates.target} Eligibility</h2>

      <div className={`sqo-validation-status sqo-validation-status--${gates.current_status.toLowerCase().replace(/_/g, '-')}`}>
        <span className="sqo-validation-status__label">Status</span>
        <span className="sqo-validation-status__value">{formatStatus(gates.current_status)}</span>
      </div>

      <div className="sqo-validation-gates">
        {gates.gates.map((gate, idx) => (
          <div key={idx} className={`sqo-validation-gate sqo-validation-gate--${gate.met ? 'met' : 'unmet'}`}>
            <span className="sqo-validation-gate__indicator">{gate.met ? '✓' : '✗'}</span>
            <div className="sqo-validation-gate__content">
              <span className="sqo-validation-gate__label">{gate.gate}</span>
              {gate.reason && !gate.met && (
                <span className="sqo-validation-gate__reason">{gate.reason}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sqo-validation-explanation">
        <p>{gates.explanation}</p>
      </div>

      {gates.reeval_condition && (
        <div className="sqo-validation-reeval">
          <span className="sqo-validation-reeval__label">Re-evaluation condition</span>
          <p>{gates.reeval_condition}</p>
        </div>
      )}
    </div>
  );
}

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
