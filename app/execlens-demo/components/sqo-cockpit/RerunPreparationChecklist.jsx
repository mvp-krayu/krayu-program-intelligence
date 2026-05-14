export default function RerunPreparationChecklist({ checklist }) {
  if (!checklist) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Re-Run Preparation</h2>
        <p className="sqo-panel__empty-notice">No re-run checklist available.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--rerun">
      <h2>Re-Run Preparation</h2>

      <div className={`sqo-rerun-status sqo-rerun-status--${checklist.all_pre_run_met ? 'ready' : 'not-ready'}`}>
        <span>{checklist.all_pre_run_met ? 'All pre-run requirements met' : 'Pre-run requirements not fully met'}</span>
      </div>

      <div className="sqo-rerun-section">
        <h3>Pre-Run Requirements</h3>
        <ul className="sqo-rerun-checklist">
          {checklist.pre_run.map(req => (
            <li key={req.id} className={`sqo-rerun-check sqo-rerun-check--${req.met ? 'met' : 'unmet'}`}>
              <span className="sqo-rerun-check__indicator">{req.met ? '✓' : '✗'}</span>
              <span className="sqo-rerun-check__label">{req.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sqo-rerun-section">
        <h3>Expected Outputs</h3>
        <ul className="sqo-rerun-checklist">
          {checklist.expected_outputs.map(output => (
            <li key={output.id} className={`sqo-rerun-output sqo-rerun-output--${output.expected ? 'expected' : 'existing'}`}>
              <span className="sqo-rerun-output__indicator">{output.expected ? '◯' : '●'}</span>
              <span className="sqo-rerun-output__label">{output.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sqo-rerun-section">
        <h3>Validation Gates</h3>
        <ul className="sqo-rerun-checklist">
          {checklist.validation_gates.map(gate => (
            <li key={gate.id} className="sqo-rerun-gate">
              <span className="sqo-rerun-gate__indicator">◇</span>
              <span className="sqo-rerun-gate__label">{gate.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
