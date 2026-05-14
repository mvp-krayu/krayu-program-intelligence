export default function ReconciliationLoopWorkflowPanel({ loopData }) {
  if (!loopData || !loopData.available) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Reconciliation Loop</h2>
        <p className="sqo-panel__empty-notice">
          {loopData && loopData.reason === 'NO_LOOP_STATE_ARTIFACT'
            ? 'No loop state artifact found.'
            : 'Loop state data unavailable.'}
        </p>
        {loopData && loopData.diagnostic && (
          <p className="sqo-panel__diagnostic">{loopData.diagnostic}</p>
        )}
      </div>
    );
  }

  const { lifecycle, completion, phaseWorkflow, currentPhase, blockedPhases, rerunChain, progressionReadiness, propagationChain } = loopData;

  return (
    <div className="sqo-panel sqo-panel--reconciliation-loop">
      <div className="sqo-loop-state-header">
        <div className="sqo-loop-state-header__primary">
          <span className={`sqo-loop-state-badge sqo-loop-state-badge--${lifecycle.terminal ? 'terminal' : 'active'}`}>
            {lifecycle.state}
          </span>
          <span className="sqo-loop-state-header__desc">{lifecycle.description}</span>
        </div>
        <div className="sqo-loop-state-header__completion">
          <span className="sqo-loop-completion-label">{completion.completed}/{completion.total} phases</span>
          <div className="sqo-loop-completion-bar">
            <div
              className="sqo-loop-completion-bar__fill"
              style={{ width: `${(completion.ratio || 0) * 100}%` }}
            />
          </div>
          <span className="sqo-loop-completion-pct">{((completion.ratio || 0) * 100).toFixed(0)}%</span>
        </div>
      </div>

      {lifecycle.next_action && (
        <div className={`sqo-loop-next-action ${lifecycle.terminal ? 'sqo-loop-next-action--complete' : ''}`}>
          <span className="sqo-loop-next-action__label">NEXT ACTION</span>
          <span className="sqo-loop-next-action__text">{lifecycle.next_action}</span>
        </div>
      )}

      <div className="sqo-loop-phase-list">
        <div className="sqo-loop-phase-list__header">IMPROVEMENT PHASES</div>
        {phaseWorkflow.map((phase) => (
          <div
            key={phase.id}
            className={`sqo-loop-phase sqo-loop-phase--${phase.status.toLowerCase()}`}
          >
            <div className="sqo-loop-phase__indicator">
              <span className={`sqo-loop-phase__dot sqo-loop-phase__dot--${phase.status.toLowerCase()}`} />
              {phase.phase < phaseWorkflow.length && (
                <span className="sqo-loop-phase__connector" />
              )}
            </div>
            <div className="sqo-loop-phase__content">
              <div className="sqo-loop-phase__header">
                <span className="sqo-loop-phase__number">{phase.phase}</span>
                <span className="sqo-loop-phase__label">{phase.label}</span>
                <span className={`sqo-loop-phase__status sqo-loop-phase__status--${phase.status.toLowerCase()}`}>
                  {phase.status}
                </span>
              </div>
              {phase.status !== 'COMPLETE' && phase.action && (
                <div className="sqo-loop-phase__action">{phase.action}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {blockedPhases && blockedPhases.length > 0 && (
        <div className="sqo-loop-blocked">
          <div className="sqo-loop-blocked__header">BLOCKED PHASES</div>
          {blockedPhases.map((bp) => (
            <div key={bp.id} className="sqo-loop-blocked__item">
              <span className="sqo-loop-blocked__id">{bp.id}</span>
              <span className="sqo-loop-blocked__missing">
                Missing: {bp.missing.join(', ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {rerunChain && (
        <div className="sqo-loop-rerun">
          <div className="sqo-loop-rerun__header">RECOMMENDED RERUN</div>
          <div className="sqo-loop-rerun__mode">
            <span className="sqo-loop-rerun__id">{rerunChain.id}</span>
            <span className="sqo-loop-rerun__desc">{rerunChain.description}</span>
          </div>
          <div className="sqo-loop-rerun__scripts">
            {rerunChain.scripts.map((script, i) => (
              <div key={script} className="sqo-loop-rerun__script">
                <span className="sqo-loop-rerun__step">{i + 1}</span>
                <span className="sqo-loop-rerun__script-name">{script}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {propagationChain && propagationChain.steps && (
        <div className="sqo-loop-propagation">
          <div className="sqo-loop-propagation__header">RUNTIME PROPAGATION CHAIN</div>
          {propagationChain.steps.map((step) => (
            <div key={step.step} className="sqo-loop-propagation__step">
              <span className="sqo-loop-propagation__number">{step.step}</span>
              <span className="sqo-loop-propagation__source">
                {Array.isArray(step.source) ? step.source.join(' + ') : step.source}
              </span>
              <span className="sqo-loop-propagation__arrow">→</span>
              <span className="sqo-loop-propagation__target">{step.target}</span>
            </div>
          ))}
        </div>
      )}

      {progressionReadiness && (
        <div className="sqo-loop-progression">
          <div className="sqo-loop-progression__header">PROGRESSION READINESS</div>
          <div className="sqo-loop-progression__status">
            <span className={`sqo-loop-progression__badge sqo-loop-progression__badge--${progressionReadiness.ready ? 'ready' : 'blocked'}`}>
              {progressionReadiness.ready ? 'READY' : 'BLOCKED'}
            </span>
            <span className="sqo-loop-progression__gates">
              {progressionReadiness.gates_met}/{progressionReadiness.gate_count} gates met
            </span>
          </div>
          {progressionReadiness.blocking_gates && progressionReadiness.blocking_gates.length > 0 && (
            <div className="sqo-loop-progression__blockers">
              {progressionReadiness.blocking_gates.map((gate) => (
                <span key={gate} className="sqo-loop-progression__blocker">{gate.replace(/_/g, ' ')}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="sqo-loop-governance">
        Read-only operator workflow · No execution buttons · Deterministic artifact consumption
      </div>
    </div>
  );
}
