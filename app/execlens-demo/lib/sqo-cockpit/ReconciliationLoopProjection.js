'use strict';

function projectLifecycleSummary(loopState) {
  if (!loopState || !loopState.lifecycle) return null;

  const lc = loopState.lifecycle;
  return {
    state: lc.current_state,
    description: lc.state_description,
    terminal: lc.is_terminal,
    successors: lc.successors,
  };
}

function projectPhaseAssessment(loopState) {
  if (!loopState || !loopState.phase_assessment) return null;

  const pa = loopState.phase_assessment;
  return {
    total: pa.total_phases,
    completed: pa.completed_phases,
    completion_ratio: pa.completion_ratio,
    all_complete: pa.all_complete,
    blocked: pa.blocked_phases,
    pending: pa.pending_phases,
    phases: (pa.phases || []).map(p => ({
      id: p.id,
      phase: p.phase,
      complete: p.complete,
      inputs_satisfied: p.inputs_satisfied,
      outputs_present: p.outputs_present,
    })),
  };
}

function projectRerunChain(loopState) {
  if (!loopState || !loopState.rerun_chain) return null;

  const rc = loopState.rerun_chain;
  return {
    id: rc.id,
    description: rc.description,
    entry_phase: rc.entry_phase,
    script_count: rc.script_count,
    scripts: rc.scripts,
  };
}

function projectProgressionReadiness(loopState) {
  if (!loopState || !loopState.progression_readiness) return null;

  const pr = loopState.progression_readiness;
  return {
    ready: pr.ready,
    gates_met: pr.gates_met,
    gate_count: pr.gate_count,
    blocking_gates: pr.blocking_gates,
    s_state_current: pr.s_state_current,
    s_state_target: pr.s_state_target,
  };
}

function projectPropagationChain(loopState) {
  if (!loopState || !loopState.propagation_chain) return null;

  const pc = loopState.propagation_chain;
  return {
    step_count: pc.step_count,
    steps: (pc.steps || []).map(s => ({
      step: s.step,
      source: s.source,
      target: s.target,
      action: s.action,
    })),
  };
}

function projectProvenance(loopState) {
  if (!loopState || !loopState.provenance) return null;

  return {
    compiled_at: loopState.provenance.compiled_at,
    compiler: loopState.provenance.compiler,
    source_commit: loopState.provenance.source_commit,
  };
}

function projectReconciliationLoopForRuntime(loopState) {
  if (!loopState || !loopState.ok) return null;

  return {
    lifecycle: projectLifecycleSummary(loopState),
    phaseAssessment: projectPhaseAssessment(loopState),
    rerunChain: projectRerunChain(loopState),
    progressionReadiness: projectProgressionReadiness(loopState),
    propagationChain: projectPropagationChain(loopState),
    provenance: projectProvenance(loopState),
  };
}

module.exports = {
  projectReconciliationLoopForRuntime,
  projectLifecycleSummary,
  projectPhaseAssessment,
  projectRerunChain,
  projectProgressionReadiness,
  projectPropagationChain,
  projectProvenance,
};
