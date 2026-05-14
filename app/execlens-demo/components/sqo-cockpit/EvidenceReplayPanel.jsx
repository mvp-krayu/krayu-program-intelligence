export default function EvidenceReplayPanel({ evidenceData }) {
  if (!evidenceData) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Evidence & Replay</h2>
        <p className="sqo-panel__empty-notice">No evidence or replay data available.</p>
      </div>
    );
  }

  return (
    <div className="sqo-panel sqo-panel--evidence">
      <h2>Evidence & Replay</h2>

      <div className="sqo-evidence-summary">
        <div className={`sqo-evidence-verdict sqo-evidence-verdict--${evidenceData.all_replays_passed ? 'pass' : 'fail'}`}>
          Replay: {evidenceData.all_replays_passed ? 'ALL PASSED' : 'FAILURE DETECTED'}
        </div>
        <div className={`sqo-evidence-verdict sqo-evidence-verdict--${evidenceData.all_certifications_passed ? 'pass' : 'fail'}`}>
          Certification: {evidenceData.all_certifications_passed ? 'ALL CERTIFIED' : 'NOT FULLY CERTIFIED'}
        </div>
      </div>

      <div className="sqo-evidence-replays">
        <h3>Replay Verifications</h3>
        {evidenceData.replays.map(replay => (
          <div key={replay.key} className={`sqo-evidence-replay sqo-evidence-replay--${replay.available ? (replay.verdict === 'PASS' ? 'pass' : 'fail') : 'missing'}`}>
            <div className="sqo-evidence-replay__header">
              <span className="sqo-evidence-replay__label">{replay.label}</span>
              {replay.available ? (
                <span className={`sqo-evidence-replay__verdict sqo-evidence-replay__verdict--${replay.verdict.toLowerCase()}`}>
                  {replay.verdict}
                </span>
              ) : (
                <span className="sqo-evidence-replay__verdict sqo-evidence-replay__verdict--missing">NOT AVAILABLE</span>
              )}
            </div>
            {replay.checks && (
              <div className="sqo-evidence-replay__checks">
                {replay.checks.map(check => (
                  <div key={check.name} className={`sqo-evidence-check sqo-evidence-check--${check.pass ? 'pass' : 'fail'}`}>
                    <span className="sqo-evidence-check__icon">{check.pass ? '✓' : '✕'}</span>
                    <span className="sqo-evidence-check__name">{formatCheckName(check.name)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sqo-evidence-certifications">
        <h3>Certifications</h3>
        {evidenceData.certifications.map(cert => (
          <div key={cert.key} className={`sqo-evidence-certification sqo-evidence-certification--${cert.available ? (cert.status === 'CERTIFIED' ? 'pass' : 'fail') : 'missing'}`}>
            <div className="sqo-evidence-certification__header">
              <span className="sqo-evidence-certification__label">{cert.label}</span>
              {cert.available ? (
                <span className={`sqo-evidence-certification__status sqo-evidence-certification__status--${cert.status === 'CERTIFIED' ? 'pass' : 'fail'}`}>
                  {cert.status}
                </span>
              ) : (
                <span className="sqo-evidence-certification__status sqo-evidence-certification__status--missing">NOT AVAILABLE</span>
              )}
            </div>
            {cert.checks && cert.checks.length > 0 && (
              <div className="sqo-evidence-certification__checks">
                {cert.checks.map(check => (
                  <div key={check.name} className={`sqo-evidence-check sqo-evidence-check--${check.pass ? 'pass' : 'fail'}`}>
                    <span className="sqo-evidence-check__icon">{check.pass ? '✓' : '✕'}</span>
                    <span className="sqo-evidence-check__name">{formatCheckName(check.name)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCheckName(name) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
