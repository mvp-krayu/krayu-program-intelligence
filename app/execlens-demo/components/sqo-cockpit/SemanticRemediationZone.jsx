export default function SemanticRemediationZone({ sourceGuidance, rerunChecklist }) {
  const hasGuidance = sourceGuidance && sourceGuidance.length > 0;
  const hasChecklist = !!rerunChecklist;

  if (!hasGuidance && !hasChecklist) return null;

  return (
    <div className="sqo-remediation-zone">
      <h2 className="sqo-remediation-zone__title">Remediation Requirements</h2>

      {hasGuidance && (
        <div className="sqo-remediation-zone__guidance">
          <h3>Source Material Requirements</h3>
          <div className="sqo-remediation-zone__guidance-grid">
            {sourceGuidance.map(entry => (
              <div key={entry.category} className="sqo-remediation-zone__guidance-card">
                <div className="sqo-remediation-zone__guidance-header">
                  <span className="sqo-remediation-zone__guidance-label">{entry.label}</span>
                  <span className="sqo-remediation-zone__guidance-count">{entry.debt_count} items</span>
                </div>
                <ul className="sqo-remediation-zone__guidance-materials">
                  {entry.materials.map(m => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasChecklist && (
        <div className="sqo-remediation-zone__checklist">
          <h3>Pipeline Re-Run Checklist</h3>
          <div className={`sqo-remediation-zone__readiness sqo-remediation-zone__readiness--${rerunChecklist.all_pre_run_met ? 'ready' : 'not-ready'}`}>
            {rerunChecklist.all_pre_run_met ? 'Ready for re-run' : 'Not ready for re-run'}
          </div>

          <div className="sqo-remediation-zone__checklist-sections">
            <div className="sqo-remediation-zone__checklist-col">
              <h4>Pre-Run</h4>
              <ul>
                {rerunChecklist.pre_run.map(req => (
                  <li key={req.id} className={req.met ? 'sqo-check--met' : 'sqo-check--unmet'}>
                    <span>{req.met ? '✓' : '✗'}</span> {req.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sqo-remediation-zone__checklist-col">
              <h4>Expected Outputs</h4>
              <ul>
                {rerunChecklist.expected_outputs.map(out => (
                  <li key={out.id} className={out.expected ? 'sqo-check--expected' : 'sqo-check--existing'}>
                    <span>{out.expected ? '◯' : '●'}</span> {out.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
