const STATUS_SYMBOLS = {
  complete: '●',
  current: '◉',
  future: '○',
  blocked: '◎',
  terminal: '✕',
};

export default function ProgressionPathVisualization({ progressionPath, nextPossibleStates }) {
  if (!progressionPath || progressionPath.length === 0) return null;

  return (
    <div className="sqo-v2-progression-path">
      <div className="sqo-v2-progression-path__header">
        <span className="sqo-v2-progression-path__title">Qualification Progression</span>
      </div>

      <div className="sqo-v2-progression-path__steps">
        {progressionPath.map((step, i) => (
          <div key={step.step} className="sqo-v2-progression-path__step-wrapper">
            {i > 0 && (
              <div className={`sqo-v2-progression-path__connector sqo-v2-progression-path__connector--${progressionPath[i - 1].status}`} />
            )}
            <div className={`sqo-v2-progression-path__step sqo-v2-progression-path__step--${step.status}`}>
              <span className="sqo-v2-progression-path__step-dot">{STATUS_SYMBOLS[step.status] || '○'}</span>
              <span className="sqo-v2-progression-path__step-label">{step.label}</span>
              {step.detail && (
                <span className="sqo-v2-progression-path__step-detail">{step.detail}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {nextPossibleStates && nextPossibleStates.length > 0 && (
        <div className="sqo-v2-progression-path__next-states">
          {nextPossibleStates.map(ns => (
            <div key={ns.state} className={`sqo-v2-progression-path__next-state ${ns.reachable ? 'sqo-v2-progression-path__next-state--reachable' : ''}`}>
              <span className="sqo-v2-progression-path__next-state-label">
                {ns.label} ({ns.state})
              </span>
              {!ns.reachable && ns.remaining_prerequisites && (
                <div className="sqo-v2-progression-path__prereqs">
                  {ns.remaining_prerequisites.filter(p => !p.met).map((p, i) => (
                    <span key={i} className="sqo-v2-progression-path__prereq">
                      {p.requirement}: {p.resolution}
                    </span>
                  ))}
                </div>
              )}
              {ns.reachable && (
                <span className="sqo-v2-progression-path__reachable-badge">All prerequisites met</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
