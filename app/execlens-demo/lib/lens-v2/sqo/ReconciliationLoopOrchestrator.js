'use strict';

const path = require('path');
const { loadAllCockpitArtifacts, getArtifactData, isArtifactAvailable } = require('../../sqo-cockpit/SQOCockpitArtifactLoader');
const { writeArtifact, getSourceCommit } = require('./QualificationStateArtifact');

const SCHEMA_VERSION = '1.0';

const LIFECYCLE_STATES = {
  IDLE: {
    id: 'IDLE',
    description: 'No active improvement cycle — system stable at current qualification posture',
    terminal: false,
    successors: ['EVIDENCE_SUBMITTED'],
  },
  EVIDENCE_SUBMITTED: {
    id: 'EVIDENCE_SUBMITTED',
    description: 'New semantic evidence submitted — awaiting intake registration',
    terminal: false,
    successors: ['INTAKE_REGISTERED', 'INTAKE_REJECTED'],
  },
  INTAKE_REGISTERED: {
    id: 'INTAKE_REGISTERED',
    description: 'Evidence accepted by semantic evidence intake loop',
    terminal: false,
    successors: ['ENRICHMENT_ELIGIBLE', 'ENRICHMENT_NOT_REQUIRED'],
  },
  INTAKE_REJECTED: {
    id: 'INTAKE_REJECTED',
    description: 'Evidence rejected — does not meet admissibility criteria',
    terminal: true,
    successors: [],
  },
  ENRICHMENT_ELIGIBLE: {
    id: 'ENRICHMENT_ELIGIBLE',
    description: 'Evidence eligible for AI-assisted enrichment',
    terminal: false,
    successors: ['ENRICHMENT_COMPLETE'],
  },
  ENRICHMENT_NOT_REQUIRED: {
    id: 'ENRICHMENT_NOT_REQUIRED',
    description: 'Evidence structurally sufficient — enrichment not required',
    terminal: false,
    successors: ['RECONCILIATION_PENDING'],
  },
  ENRICHMENT_COMPLETE: {
    id: 'ENRICHMENT_COMPLETE',
    description: 'AI-assisted enrichment complete — enriched evidence available',
    terminal: false,
    successors: ['RECONCILIATION_PENDING'],
  },
  RECONCILIATION_PENDING: {
    id: 'RECONCILIATION_PENDING',
    description: 'Evidence ready for reconciliation correspondence rerun',
    terminal: false,
    successors: ['RECONCILIATION_COMPLETE'],
  },
  RECONCILIATION_COMPLETE: {
    id: 'RECONCILIATION_COMPLETE',
    description: 'Reconciliation rerun complete — correspondence and lifecycle updated',
    terminal: false,
    successors: ['DEBT_UPDATED'],
  },
  DEBT_UPDATED: {
    id: 'DEBT_UPDATED',
    description: 'Semantic debt index recalculated with updated reconciliation state',
    terminal: false,
    successors: ['QUALIFICATION_REPROJECTED'],
  },
  QUALIFICATION_REPROJECTED: {
    id: 'QUALIFICATION_REPROJECTED',
    description: 'Qualification projection updated — posture, propagation readiness, envelope refreshed',
    terminal: false,
    successors: ['PROPAGATED'],
  },
  PROPAGATED: {
    id: 'PROPAGATED',
    description: 'Runtime artifacts updated — LENS and consumers reflect new state',
    terminal: true,
    successors: ['IDLE'],
  },
};

const IMPROVEMENT_PHASES = [
  {
    phase: 1,
    id: 'EVIDENCE_INTAKE',
    description: 'Register, classify, and validate new semantic evidence',
    lifecycle_entry: 'EVIDENCE_SUBMITTED',
    lifecycle_exit: 'INTAKE_REGISTERED',
    preconditions: [
      'Evidence file submitted to evidence-ingestion directory',
      'Evidence registry updated with new item',
      'File passes CEU admissibility check',
    ],
    postconditions: [
      'Evidence registered in intake manifest',
      'Evidence classified (ACCEPTED / REJECTED / QUARANTINED)',
      'Eligible operations determined',
    ],
    compilation_target: 'compile_blueedge_evidence_intake.js',
    compilation_phase: 5,
    artifacts_consumed: ['semantic_evidence_intake'],
    artifacts_produced: ['semantic_evidence_intake'],
    mutation_boundary: 'evidence_intake',
    replay_safe: true,
  },
  {
    phase: 2,
    id: 'ENRICHMENT_ELIGIBILITY',
    description: 'Determine if evidence requires or is eligible for AI-assisted enrichment',
    lifecycle_entry: 'INTAKE_REGISTERED',
    lifecycle_exit: 'ENRICHMENT_ELIGIBLE',
    lifecycle_exit_alt: 'ENRICHMENT_NOT_REQUIRED',
    preconditions: [
      'Evidence intake registration complete',
      'Eligible operations include ENRICHMENT or SEMANTIC_RECONSTRUCTION',
    ],
    postconditions: [
      'Enrichment eligibility determined per evidence source class',
      'Enrichment artifacts produced (if applicable)',
    ],
    compilation_target: null,
    compilation_phase: null,
    artifacts_consumed: ['semantic_evidence_intake'],
    artifacts_produced: [],
    mutation_boundary: 'evidence_intake',
    replay_safe: true,
  },
  {
    phase: 3,
    id: 'RECONCILIATION_RERUN',
    description: 'Rerun reconciliation correspondence and lifecycle with new or enriched evidence',
    lifecycle_entry: 'RECONCILIATION_PENDING',
    lifecycle_exit: 'RECONCILIATION_COMPLETE',
    preconditions: [
      'Evidence intake complete (accepted items exist)',
      'Enrichment complete or not required',
      'Previous reconciliation artifacts accessible',
    ],
    postconditions: [
      'Reconciliation correspondence updated with new evidence',
      'Reconciliation lifecycle epoch recorded',
      'Continuity assessment updated',
    ],
    compilation_target: 'compile_blueedge_correspondence.js',
    compilation_phase: 3,
    artifacts_consumed: ['reconciliation_correspondence', 'reconciliation_lifecycle', 'continuity_assessment'],
    artifacts_produced: ['reconciliation_correspondence', 'reconciliation_lifecycle', 'continuity_assessment'],
    mutation_boundary: 'reconciliation',
    replay_safe: true,
  },
  {
    phase: 4,
    id: 'DEBT_RECALCULATION',
    description: 'Recalculate semantic debt index with updated reconciliation state',
    lifecycle_entry: 'RECONCILIATION_COMPLETE',
    lifecycle_exit: 'DEBT_UPDATED',
    preconditions: [
      'Reconciliation rerun complete',
      'Updated correspondence and lifecycle artifacts available',
    ],
    postconditions: [
      'Semantic debt index recalculated',
      'Debt items reclassified per updated reconciliation',
      'Reducibility and origin axes updated',
    ],
    compilation_target: 'compile_blueedge_debt_index.js',
    compilation_phase: 2,
    artifacts_consumed: ['reconciliation_correspondence', 'semantic_debt_inventory', 'semantic_debt_index'],
    artifacts_produced: ['semantic_debt_index'],
    mutation_boundary: 'semantic_debt',
    replay_safe: true,
  },
  {
    phase: 5,
    id: 'QUALIFICATION_REPROJECTION',
    description: 'Reproject unified qualification posture with updated debt and reconciliation',
    lifecycle_entry: 'DEBT_UPDATED',
    lifecycle_exit: 'QUALIFICATION_REPROJECTED',
    preconditions: [
      'Debt recalculation complete',
      'All upstream artifacts (qualification, reconciliation, debt, temporal, intake, replay) accessible',
    ],
    postconditions: [
      'Qualification projection updated',
      'Propagation readiness reassessed',
      'Semantic envelope refreshed',
    ],
    compilation_target: 'compile_blueedge_qualification_projection.js',
    compilation_phase: 7,
    artifacts_consumed: [
      'qualification_state', 'semantic_maturity_profile', 'semantic_gravity_assessment',
      'qualification_stability', 'progression_readiness', 'semantic_debt_inventory',
      'semantic_debt_index', 'reconciliation_correspondence', 'reconciliation_lifecycle',
      'reconciliation_temporal_analytics', 'semantic_evidence_intake',
    ],
    artifacts_produced: ['runtime_qualification_projection'],
    mutation_boundary: 'qualification_projection',
    replay_safe: true,
  },
  {
    phase: 6,
    id: 'LIFECYCLE_PROGRESSION',
    description: 'Assess and apply S-state transition if propagation gates are met',
    lifecycle_entry: 'QUALIFICATION_REPROJECTED',
    lifecycle_exit: 'QUALIFICATION_REPROJECTED',
    preconditions: [
      'Qualification reprojection complete',
      'Propagation readiness gates assessed',
    ],
    postconditions: [
      'S-state transition applied if all gates met',
      'If gates not met, current S-state retained with blocking gate disclosure',
    ],
    compilation_target: null,
    compilation_phase: 1,
    artifacts_consumed: ['runtime_qualification_projection', 'qualification_state'],
    artifacts_produced: ['qualification_state'],
    mutation_boundary: 'qualification_core',
    replay_safe: true,
  },
  {
    phase: 7,
    id: 'TEMPORAL_ANALYTICS_UPDATE',
    description: 'Rerun temporal analytics with updated lifecycle epochs and debt state',
    lifecycle_entry: 'QUALIFICATION_REPROJECTED',
    lifecycle_exit: 'QUALIFICATION_REPROJECTED',
    preconditions: [
      'Reconciliation lifecycle updated with new epoch',
      'Debt index updated',
    ],
    postconditions: [
      'Temporal trend classification updated',
      'Enrichment effectiveness recalculated',
      'Debt reduction ratio updated',
      'Degradation detection refreshed',
    ],
    compilation_target: 'compile_blueedge_temporal_analytics.js',
    compilation_phase: 4,
    artifacts_consumed: ['reconciliation_lifecycle', 'semantic_debt_index'],
    artifacts_produced: ['reconciliation_temporal_analytics'],
    mutation_boundary: 'temporal_analytics',
    replay_safe: true,
  },
  {
    phase: 8,
    id: 'RUNTIME_PROPAGATION',
    description: 'Update runtime substrate and propagate to consumer surfaces',
    lifecycle_entry: 'QUALIFICATION_REPROJECTED',
    lifecycle_exit: 'PROPAGATED',
    preconditions: [
      'All upstream phases complete',
      'All produced artifacts written',
    ],
    postconditions: [
      'Runtime semantic operations substrate updated',
      'LENS runtime binding reflects new state',
      'SQO Cockpit reflects updated posture',
    ],
    compilation_target: 'compile_blueedge_semantic_operations.js',
    compilation_phase: 8,
    artifacts_consumed: ['runtime_qualification_projection'],
    artifacts_produced: ['runtime_semantic_operations_substrate'],
    mutation_boundary: 'semantic_operations_substrate',
    replay_safe: true,
  },
];

const TRANSITION_RULES = [
  {
    from: 'IDLE',
    to: 'EVIDENCE_SUBMITTED',
    guard: 'New evidence file present in evidence-ingestion directory',
    trigger: 'OPERATOR',
  },
  {
    from: 'EVIDENCE_SUBMITTED',
    to: 'INTAKE_REGISTERED',
    guard: 'Evidence passes CEU admissibility and intake validation',
    trigger: 'COMPILATION',
  },
  {
    from: 'EVIDENCE_SUBMITTED',
    to: 'INTAKE_REJECTED',
    guard: 'Evidence fails admissibility or intake validation',
    trigger: 'COMPILATION',
  },
  {
    from: 'INTAKE_REGISTERED',
    to: 'ENRICHMENT_ELIGIBLE',
    guard: 'Evidence eligible_operations includes ENRICHMENT',
    trigger: 'ASSESSMENT',
  },
  {
    from: 'INTAKE_REGISTERED',
    to: 'ENRICHMENT_NOT_REQUIRED',
    guard: 'Evidence eligible_operations does not include ENRICHMENT',
    trigger: 'ASSESSMENT',
  },
  {
    from: 'ENRICHMENT_ELIGIBLE',
    to: 'ENRICHMENT_COMPLETE',
    guard: 'Enriched correspondence artifact produced',
    trigger: 'OPERATOR',
  },
  {
    from: 'ENRICHMENT_NOT_REQUIRED',
    to: 'RECONCILIATION_PENDING',
    guard: 'Intake registration complete, enrichment not required',
    trigger: 'AUTOMATIC',
  },
  {
    from: 'ENRICHMENT_COMPLETE',
    to: 'RECONCILIATION_PENDING',
    guard: 'Enrichment artifacts available',
    trigger: 'AUTOMATIC',
  },
  {
    from: 'RECONCILIATION_PENDING',
    to: 'RECONCILIATION_COMPLETE',
    guard: 'Reconciliation correspondence rerun produces updated artifacts',
    trigger: 'COMPILATION',
  },
  {
    from: 'RECONCILIATION_COMPLETE',
    to: 'DEBT_UPDATED',
    guard: 'Debt index recompilation with updated reconciliation complete',
    trigger: 'COMPILATION',
  },
  {
    from: 'DEBT_UPDATED',
    to: 'QUALIFICATION_REPROJECTED',
    guard: 'Qualification projection recompilation complete',
    trigger: 'COMPILATION',
  },
  {
    from: 'QUALIFICATION_REPROJECTED',
    to: 'PROPAGATED',
    guard: 'Runtime substrate updated, all consumer projections refreshed',
    trigger: 'COMPILATION',
  },
  {
    from: 'PROPAGATED',
    to: 'IDLE',
    guard: 'Improvement cycle complete, system stable',
    trigger: 'AUTOMATIC',
  },
];

const RUNTIME_PROPAGATION_CHAIN = [
  {
    step: 1,
    source: 'evidence_file',
    target: 'semantic_evidence_intake',
    action: 'Register evidence via intake loop',
    script: 'compile_blueedge_evidence_intake.js',
  },
  {
    step: 2,
    source: 'semantic_evidence_intake',
    target: 'reconciliation_correspondence',
    action: 'Rerun correspondence with new evidence',
    script: 'compile_blueedge_correspondence.js',
  },
  {
    step: 3,
    source: 'reconciliation_correspondence',
    target: 'reconciliation_lifecycle',
    action: 'Update lifecycle with new epoch',
    script: 'compile_blueedge_lifecycle.js',
  },
  {
    step: 4,
    source: 'reconciliation_correspondence',
    target: 'semantic_debt_index',
    action: 'Recalculate debt index with updated reconciliation',
    script: 'compile_blueedge_debt_index.js',
  },
  {
    step: 5,
    source: ['reconciliation_lifecycle', 'semantic_debt_index'],
    target: 'reconciliation_temporal_analytics',
    action: 'Rerun temporal analytics with updated lifecycle and debt',
    script: 'compile_blueedge_temporal_analytics.js',
  },
  {
    step: 6,
    source: 'all_upstream_artifacts',
    target: 'runtime_qualification_projection',
    action: 'Reproject unified qualification posture',
    script: 'compile_blueedge_qualification_projection.js',
  },
  {
    step: 7,
    source: 'runtime_qualification_projection',
    target: 'runtime_semantic_operations_substrate',
    action: 'Update operations substrate with new posture',
    script: 'compile_blueedge_semantic_operations.js',
  },
];

const RERUN_ORCHESTRATION = {
  FULL_RERUN: {
    id: 'FULL_RERUN',
    description: 'Complete rerun from evidence intake through runtime propagation',
    entry_phase: 1,
    phases: [1, 2, 3, 4, 5, 6, 7, 8],
    scripts: [
      'compile_blueedge_evidence_intake.js',
      'compile_blueedge_correspondence.js',
      'compile_blueedge_lifecycle.js',
      'compile_blueedge_debt_index.js',
      'compile_blueedge_temporal_analytics.js',
      'compile_blueedge_qualification_projection.js',
      'compile_blueedge_semantic_operations.js',
    ],
  },
  FROM_RECONCILIATION: {
    id: 'FROM_RECONCILIATION',
    description: 'Rerun from reconciliation through runtime propagation (evidence already registered)',
    entry_phase: 3,
    phases: [3, 4, 5, 6, 7, 8],
    scripts: [
      'compile_blueedge_correspondence.js',
      'compile_blueedge_lifecycle.js',
      'compile_blueedge_debt_index.js',
      'compile_blueedge_temporal_analytics.js',
      'compile_blueedge_qualification_projection.js',
      'compile_blueedge_semantic_operations.js',
    ],
  },
  FROM_DEBT: {
    id: 'FROM_DEBT',
    description: 'Rerun from debt recalculation through runtime propagation',
    entry_phase: 4,
    phases: [4, 5, 6, 7, 8],
    scripts: [
      'compile_blueedge_debt_index.js',
      'compile_blueedge_temporal_analytics.js',
      'compile_blueedge_qualification_projection.js',
      'compile_blueedge_semantic_operations.js',
    ],
  },
  FROM_PROJECTION: {
    id: 'FROM_PROJECTION',
    description: 'Rerun qualification projection and runtime propagation only',
    entry_phase: 5,
    phases: [5, 7, 8],
    scripts: [
      'compile_blueedge_qualification_projection.js',
      'compile_blueedge_semantic_operations.js',
    ],
  },
  PROPAGATION_ONLY: {
    id: 'PROPAGATION_ONLY',
    description: 'Update runtime substrate only (all upstream already current)',
    entry_phase: 8,
    phases: [8],
    scripts: [
      'compile_blueedge_semantic_operations.js',
    ],
  },
};

const REPLAY_BOUNDARIES = {
  determinism: 'All phases produce deterministic output from the same input artifacts',
  timestamp_exclusion: 'Timestamps are excluded from replay comparison — only structural content compared',
  provenance_tracking: 'Each phase records trigger source, input artifact hashes, and output artifact hashes',
  rerun_safety: 'Reruns from any phase produce identical output given identical upstream artifacts',
  no_side_effects: 'No phase produces side effects beyond writing governed artifacts',
  no_upstream_mutation: 'No downstream phase may mutate upstream artifacts',
  compilation_order_invariant: 'Phase ordering is fixed — downstream cannot execute before upstream completes',
};

function assessPhaseCompletion(loadResult) {
  const phases = [];

  for (const phaseDef of IMPROVEMENT_PHASES) {
    const consumed = phaseDef.artifacts_consumed || [];
    const produced = phaseDef.artifacts_produced || [];
    const consumedPresent = consumed.filter(k => isArtifactAvailable(loadResult, k));
    const producedPresent = produced.filter(k => isArtifactAvailable(loadResult, k));

    phases.push({
      phase: phaseDef.phase,
      id: phaseDef.id,
      inputs_satisfied: consumedPresent.length === consumed.length,
      outputs_present: producedPresent.length === produced.length,
      complete: consumedPresent.length === consumed.length && producedPresent.length === produced.length,
      missing_inputs: consumed.filter(k => !isArtifactAvailable(loadResult, k)),
      missing_outputs: produced.filter(k => !isArtifactAvailable(loadResult, k)),
      compilation_target: phaseDef.compilation_target,
      mutation_boundary: phaseDef.mutation_boundary,
    });
  }

  return phases;
}

function resolveCurrentLifecycleState(loadResult, phaseAssessment) {
  const allComplete = phaseAssessment.every(p => p.complete);
  if (allComplete) return 'PROPAGATED';

  const intakeComplete = phaseAssessment.find(p => p.id === 'EVIDENCE_INTAKE');
  if (!intakeComplete || !intakeComplete.complete) return 'IDLE';

  const intakeData = getArtifactData(loadResult, 'semantic_evidence_intake');
  if (!intakeData) return 'IDLE';

  const hasAccepted = intakeData.intake_summary && intakeData.intake_summary.accepted_count > 0;
  if (!hasAccepted) return 'INTAKE_REJECTED';

  const reconComplete = phaseAssessment.find(p => p.id === 'RECONCILIATION_RERUN');
  if (!reconComplete || !reconComplete.complete) return 'RECONCILIATION_PENDING';

  const debtComplete = phaseAssessment.find(p => p.id === 'DEBT_RECALCULATION');
  if (!debtComplete || !debtComplete.complete) return 'RECONCILIATION_COMPLETE';

  const projComplete = phaseAssessment.find(p => p.id === 'QUALIFICATION_REPROJECTION');
  if (!projComplete || !projComplete.complete) return 'DEBT_UPDATED';

  const propComplete = phaseAssessment.find(p => p.id === 'RUNTIME_PROPAGATION');
  if (!propComplete || !propComplete.complete) return 'QUALIFICATION_REPROJECTED';

  return 'PROPAGATED';
}

function resolveRerunChain(currentState) {
  switch (currentState) {
    case 'IDLE':
    case 'EVIDENCE_SUBMITTED':
      return RERUN_ORCHESTRATION.FULL_RERUN;
    case 'INTAKE_REGISTERED':
    case 'ENRICHMENT_ELIGIBLE':
    case 'ENRICHMENT_NOT_REQUIRED':
    case 'ENRICHMENT_COMPLETE':
    case 'RECONCILIATION_PENDING':
      return RERUN_ORCHESTRATION.FROM_RECONCILIATION;
    case 'RECONCILIATION_COMPLETE':
      return RERUN_ORCHESTRATION.FROM_DEBT;
    case 'DEBT_UPDATED':
      return RERUN_ORCHESTRATION.FROM_PROJECTION;
    case 'QUALIFICATION_REPROJECTED':
      return RERUN_ORCHESTRATION.PROPAGATION_ONLY;
    case 'PROPAGATED':
      return null;
    default:
      return RERUN_ORCHESTRATION.FULL_RERUN;
  }
}

function assessProgressionReadiness(loadResult) {
  const projData = getArtifactData(loadResult, 'runtime_qualification_projection');
  if (!projData || !projData.propagation_readiness) return null;

  const pr = projData.propagation_readiness;
  return {
    ready: pr.overall_ready,
    gates_met: pr.gates_met,
    gate_count: pr.gate_count,
    blocking_gates: pr.blocking_gates || [],
    s_state_current: pr.s_state_current,
    s_state_target: pr.s_state_target,
  };
}

function compileReconciliationLoopState(client, runId) {
  const loadResult = loadAllCockpitArtifacts(client, runId);

  if (!loadResult.ok) {
    return {
      ok: false,
      error: loadResult.error,
      client,
      run_id: runId,
    };
  }

  const phaseAssessment = assessPhaseCompletion(loadResult);
  const lifecycleState = resolveCurrentLifecycleState(loadResult, phaseAssessment);
  const rerunChain = resolveRerunChain(lifecycleState);
  const progressionReadiness = assessProgressionReadiness(loadResult);

  const completedPhases = phaseAssessment.filter(p => p.complete).length;
  const totalPhases = phaseAssessment.length;
  const blockedPhases = phaseAssessment.filter(p => !p.complete && p.missing_inputs.length > 0);
  const pendingPhases = phaseAssessment.filter(p => !p.complete && p.missing_inputs.length === 0 && p.missing_outputs.length > 0);

  return {
    ok: true,
    schema_version: SCHEMA_VERSION,
    artifact_type: 'reconciliation_loop_state',
    client,
    run_id: runId,
    lifecycle: {
      current_state: lifecycleState,
      state_description: LIFECYCLE_STATES[lifecycleState]
        ? LIFECYCLE_STATES[lifecycleState].description
        : 'Unknown state',
      is_terminal: LIFECYCLE_STATES[lifecycleState]
        ? LIFECYCLE_STATES[lifecycleState].terminal
        : false,
      successors: LIFECYCLE_STATES[lifecycleState]
        ? LIFECYCLE_STATES[lifecycleState].successors
        : [],
    },
    phase_assessment: {
      total_phases: totalPhases,
      completed_phases: completedPhases,
      completion_ratio: totalPhases > 0 ? +(completedPhases / totalPhases).toFixed(4) : 0,
      all_complete: completedPhases === totalPhases,
      phases: phaseAssessment,
      blocked_phases: blockedPhases.map(p => ({ id: p.id, missing: p.missing_inputs })),
      pending_phases: pendingPhases.map(p => ({ id: p.id, missing_outputs: p.missing_outputs })),
    },
    rerun_chain: rerunChain ? {
      id: rerunChain.id,
      description: rerunChain.description,
      entry_phase: rerunChain.entry_phase,
      script_count: rerunChain.scripts.length,
      scripts: rerunChain.scripts,
    } : null,
    progression_readiness: progressionReadiness,
    propagation_chain: {
      step_count: RUNTIME_PROPAGATION_CHAIN.length,
      steps: RUNTIME_PROPAGATION_CHAIN,
    },
    replay_boundaries: REPLAY_BOUNDARIES,
    provenance: {
      compiled_at: new Date().toISOString(),
      compiler: 'ReconciliationLoopOrchestrator',
      compiler_version: SCHEMA_VERSION,
      source_commit: getSourceCommit(),
    },
  };
}

function emitLoopState(compiled, client, runId) {
  const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
  const outputPath = path.join(
    REPO_ROOT, 'artifacts', 'sqo', client, runId,
    'reconciliation_loop_state.v1.json'
  );
  writeArtifact(outputPath, compiled);
  return { path: outputPath };
}

module.exports = {
  LIFECYCLE_STATES,
  IMPROVEMENT_PHASES,
  TRANSITION_RULES,
  RUNTIME_PROPAGATION_CHAIN,
  RERUN_ORCHESTRATION,
  REPLAY_BOUNDARIES,
  assessPhaseCompletion,
  resolveCurrentLifecycleState,
  resolveRerunChain,
  assessProgressionReadiness,
  compileReconciliationLoopState,
  emitLoopState,
};
