'use strict';

const fs = require('fs');
const path = require('path');
const { loadAllCockpitArtifacts, getArtifactData, isArtifactAvailable, SQO_COCKPIT_ARTIFACT_KEYS } = require('../../sqo-cockpit/SQOCockpitArtifactLoader');
const { compileRuntimeQualificationProjection } = require('./RuntimeQualificationProjectionCompiler');

const SUBSTRATE_VERSION = '1.0';

const OWNERSHIP_BOUNDARIES = {
  qualification_core: {
    owner: 'SQO',
    description: 'S-state machine, Q-class resolution, maturity, gravity, stability, progression',
    artifacts: [
      'qualification_state',
      'semantic_maturity_profile',
      'semantic_gravity_assessment',
      'qualification_stability',
      'progression_readiness',
      'qualification_history',
      'maturity_dimension_breakdown',
    ],
    engines: [
      'QualificationStateEngine',
      'MaturityScoringEngine',
      'SemanticGravityEngine',
      'QualificationStabilityEngine',
      'ProgressionReadinessEngine',
      'QualificationHistory',
    ],
    projections: [],
    mutation_authority: 'SQO_ENGINES',
    runtime_integration: 'SQOCockpitFormatter.formatOverview + formatMaturitySection + formatProgressionSection',
  },
  semantic_debt: {
    owner: 'SQO',
    description: 'Debt inventory, 4-axis debt index, remediation pathways',
    artifacts: [
      'semantic_debt_inventory',
      'semantic_debt_index',
    ],
    engines: [
      'SemanticDebtEngine',
      'DebtPriorityEngine',
      'RemediationPathResolver',
    ],
    compilers: ['SemanticDebtIndexCompiler'],
    projections: ['SemanticDebtIndexProjection'],
    mutation_authority: 'DEBT_ENGINES',
    runtime_integration: 'SQOCockpitFormatter.formatDebtSection',
  },
  reconciliation: {
    owner: 'SQO',
    description: 'Structural-semantic correspondence, enrichment, progressive lifecycle',
    artifacts: [
      'reconciliation_correspondence',
      'reconciliation_lifecycle',
      'continuity_assessment',
    ],
    compilers: [],
    projections: ['ReconciliationLifecycleProjection'],
    mutation_authority: 'RECONCILIATION_COMPILERS',
    runtime_integration: 'SQOCockpitFormatter.formatReconciliationSection + formatContinuitySection',
  },
  temporal_analytics: {
    owner: 'SQO',
    description: 'Trend classification, enrichment effectiveness, debt reduction, degradation detection',
    artifacts: ['reconciliation_temporal_analytics'],
    compilers: ['ReconciliationTemporalAnalyticsCompiler'],
    projections: ['TemporalAnalyticsProjection'],
    mutation_authority: 'TEMPORAL_COMPILER',
    runtime_integration: 'SQOCockpitFormatter.formatReconciliationSection (temporalAnalytics)',
  },
  evidence_intake: {
    owner: 'SQO',
    description: 'Evidence registration, classification, hash validation, eligibility determination',
    artifacts: ['semantic_evidence_intake'],
    compilers: ['SemanticEvidenceIntakeLoop'],
    projections: ['EvidenceIntakeProjection'],
    mutation_authority: 'INTAKE_LOOP',
    runtime_integration: 'SQOCockpitFormatter.formatEvidenceReplaySection (evidenceIntake)',
  },
  replay_and_certification: {
    owner: 'SQO',
    description: 'Replay verification, certification, evidence integrity',
    artifacts: [
      'maturity_replay_verification',
      'qualification_state_replay_verification',
      'debt_replay_verification',
      'maturity_certification',
      'qualification_state_certification',
      'debt_certification',
    ],
    engines: ['ReplayVerifier', 'MaturityReplayVerifier', 'DebtReplayVerifier'],
    projections: [],
    mutation_authority: 'VERIFIERS',
    runtime_integration: 'SQOCockpitFormatter.formatEvidenceReplaySection',
  },
  qualification_projection: {
    owner: 'SQO',
    description: 'Unified posture aggregation, propagation readiness, semantic envelope',
    artifacts: ['runtime_qualification_projection'],
    compilers: ['RuntimeQualificationProjectionCompiler'],
    projections: ['RuntimeQualificationProjection'],
    mutation_authority: 'PROJECTION_COMPILER',
    runtime_integration: 'SQOCockpitFormatter.formatOverview (qualificationProjection)',
  },
  reconciliation_loop: {
    owner: 'SQO',
    description: 'Operational semantic reconciliation loop lifecycle, phase orchestration, rerun chains',
    artifacts: ['reconciliation_loop_state'],
    compilers: ['ReconciliationLoopOrchestrator'],
    projections: ['ReconciliationLoopProjection'],
    mutation_authority: 'LOOP_ORCHESTRATOR',
    runtime_integration: 'SQOCockpitFormatter.formatOverview (reconciliationLoop)',
  },
};

const PROPAGATION_CONTRACTS = [
  {
    id: 'PROP-01',
    from: 'qualification_core',
    to: 'semantic_debt',
    contract: 'S-state and maturity inform debt severity and blocking classification',
    artifacts_consumed: ['qualification_state', 'semantic_maturity_profile'],
    artifacts_produced: ['semantic_debt_inventory'],
    direction: 'DOWNSTREAM',
  },
  {
    id: 'PROP-02',
    from: 'reconciliation',
    to: 'semantic_debt',
    contract: 'Correspondence and enrichment status inform debt index classification (reducibility, origin)',
    artifacts_consumed: ['reconciliation_correspondence'],
    artifacts_produced: ['semantic_debt_index'],
    direction: 'DOWNSTREAM',
  },
  {
    id: 'PROP-03',
    from: 'reconciliation',
    to: 'temporal_analytics',
    contract: 'Lifecycle epochs provide temporal basis for trend, enrichment effectiveness, degradation',
    artifacts_consumed: ['reconciliation_lifecycle'],
    artifacts_produced: ['reconciliation_temporal_analytics'],
    direction: 'DOWNSTREAM',
  },
  {
    id: 'PROP-04',
    from: 'semantic_debt',
    to: 'temporal_analytics',
    contract: 'Debt index provides debt reduction metrics and irreducible floor',
    artifacts_consumed: ['semantic_debt_index'],
    artifacts_produced: ['reconciliation_temporal_analytics'],
    direction: 'DOWNSTREAM',
  },
  {
    id: 'PROP-05',
    from: 'evidence_intake',
    to: 'qualification_projection',
    contract: 'Intake validity feeds propagation readiness gate assessment',
    artifacts_consumed: ['semantic_evidence_intake'],
    artifacts_produced: ['runtime_qualification_projection'],
    direction: 'DOWNSTREAM',
  },
  {
    id: 'PROP-06',
    from: ['qualification_core', 'semantic_debt', 'reconciliation', 'temporal_analytics', 'evidence_intake', 'replay_and_certification'],
    to: 'qualification_projection',
    contract: 'All postures aggregate into unified qualification projection',
    artifacts_consumed: SQO_COCKPIT_ARTIFACT_KEYS.filter(k =>
      k !== 'runtime_qualification_projection' && k !== 'runtime_semantic_operations_substrate' && k !== 'reconciliation_loop_state'
    ),
    artifacts_produced: ['runtime_qualification_projection'],
    direction: 'CONVERGENT',
  },
  {
    id: 'PROP-07',
    from: ['qualification_core', 'semantic_debt', 'reconciliation', 'temporal_analytics', 'evidence_intake', 'replay_and_certification', 'qualification_projection'],
    to: 'semantic_operations_substrate',
    contract: 'All ownership domains converge into unified operational substrate',
    artifacts_consumed: SQO_COCKPIT_ARTIFACT_KEYS.filter(k => k !== 'runtime_semantic_operations_substrate' && k !== 'reconciliation_loop_state'),
    artifacts_produced: [],
    direction: 'CONVERGENT',
  },
  {
    id: 'PROP-08',
    from: ['qualification_core', 'semantic_debt', 'reconciliation', 'temporal_analytics', 'evidence_intake', 'replay_and_certification', 'qualification_projection'],
    to: 'reconciliation_loop',
    contract: 'All domain states converge into operational lifecycle loop assessment',
    artifacts_consumed: SQO_COCKPIT_ARTIFACT_KEYS.filter(k => k !== 'reconciliation_loop_state'),
    artifacts_produced: ['reconciliation_loop_state'],
    direction: 'CONVERGENT',
  },
];

const ORCHESTRATION_BOUNDARIES = {
  compilation_order: [
    { phase: 1, domain: 'qualification_core', description: 'SQO engines produce qualification state, maturity, gravity, stability, progression' },
    { phase: 2, domain: 'semantic_debt', description: 'Debt engine produces inventory; debt index compiler classifies' },
    { phase: 3, domain: 'reconciliation', description: 'Correspondence and lifecycle compiled from evidence' },
    { phase: 4, domain: 'temporal_analytics', description: 'Temporal analytics compiled from lifecycle epochs and debt index' },
    { phase: 5, domain: 'evidence_intake', description: 'Intake loop validates, classifies, determines eligibility' },
    { phase: 6, domain: 'replay_and_certification', description: 'Replay verification and certification assessment' },
    { phase: 7, domain: 'qualification_projection', description: 'Unified posture aggregation from all prior phases' },
    { phase: 8, domain: 'semantic_operations_substrate', description: 'Substrate consolidation from all domains' },
    { phase: 9, domain: 'reconciliation_loop', description: 'Operational lifecycle loop assessment and state determination' },
  ],
  replay_semantics: {
    all_compilers_deterministic: true,
    all_projections_deterministic: true,
    timestamp_excluded_from_replay_comparison: true,
    compilation_order_invariant: true,
  },
  mutation_rules: {
    upstream_immutable_during_downstream: true,
    no_circular_propagation: true,
    convergent_phases_read_only: true,
    substrate_never_mutates_source_artifacts: true,
  },
};

const RUNTIME_STABILIZATION_RULES = [
  'All SQO operational semantic primitives are governed by OWNERSHIP_BOUNDARIES',
  'No new operational semantic primitive may be added without updating OWNERSHIP_BOUNDARIES',
  'Propagation contracts are explicit — no implicit data flow between domains',
  'Compilation order is fixed — downstream phases cannot influence upstream',
  'Substrate is a convergent read-only aggregation — it never mutates source artifacts',
  'Consumer surfaces (LENS, Cockpit, Reports) consume substrate or individual artifacts — never both for the same facet',
  'All compilers and projections must remain deterministic and replay-safe',
  'New ownership domains require G1 stream authorization',
];

function assessOperationalHealth(loadResult) {
  const domainHealth = {};

  for (const [domainId, domain] of Object.entries(OWNERSHIP_BOUNDARIES)) {
    const artifacts = domain.artifacts || [];
    const present = artifacts.filter(k => isArtifactAvailable(loadResult, k));
    const missing = artifacts.filter(k => !isArtifactAvailable(loadResult, k));

    domainHealth[domainId] = {
      artifact_count: artifacts.length,
      present_count: present.length,
      missing_count: missing.length,
      coverage: artifacts.length > 0 ? +(present.length / artifacts.length).toFixed(4) : 1,
      healthy: missing.length === 0,
      missing_artifacts: missing,
    };
  }

  const allHealthy = Object.values(domainHealth).every(d => d.healthy);
  const totalArtifacts = Object.values(domainHealth).reduce((s, d) => s + d.artifact_count, 0);
  const totalPresent = Object.values(domainHealth).reduce((s, d) => s + d.present_count, 0);

  return {
    overall_healthy: allHealthy,
    total_artifacts: totalArtifacts,
    total_present: totalPresent,
    coverage: totalArtifacts > 0 ? +(totalPresent / totalArtifacts).toFixed(4) : 1,
    domains: domainHealth,
  };
}

function assessPropagationIntegrity(loadResult) {
  const results = [];

  for (const contract of PROPAGATION_CONTRACTS) {
    const consumed = contract.artifacts_consumed || [];
    const produced = contract.artifacts_produced || [];
    const consumedPresent = consumed.filter(k => isArtifactAvailable(loadResult, k));
    const producedPresent = produced.filter(k => isArtifactAvailable(loadResult, k));

    const inputsSatisfied = consumedPresent.length === consumed.length;
    const outputsPresent = producedPresent.length === produced.length;

    results.push({
      id: contract.id,
      from: contract.from,
      to: contract.to,
      direction: contract.direction,
      inputs_satisfied: inputsSatisfied,
      outputs_present: outputsPresent,
      intact: inputsSatisfied && outputsPresent,
      missing_inputs: consumed.filter(k => !isArtifactAvailable(loadResult, k)),
      missing_outputs: produced.filter(k => !isArtifactAvailable(loadResult, k)),
    });
  }

  return {
    total_contracts: results.length,
    intact_count: results.filter(r => r.intact).length,
    broken_count: results.filter(r => !r.intact).length,
    all_intact: results.every(r => r.intact),
    contracts: results,
  };
}

function compileSemanticOperationsSubstrate(client, runId) {
  const loadResult = loadAllCockpitArtifacts(client, runId);

  if (!loadResult.ok) {
    return {
      ok: false,
      error: loadResult.error,
      client,
      run_id: runId,
    };
  }

  const qualificationProjection = compileRuntimeQualificationProjection(client, runId);
  const operationalHealth = assessOperationalHealth(loadResult);
  const propagationIntegrity = assessPropagationIntegrity(loadResult);

  return {
    ok: true,
    schema_version: '1.0',
    artifact_type: 'runtime_semantic_operations_substrate',
    client,
    run_id: runId,
    generated_at: new Date().toISOString(),
    substrate_version: SUBSTRATE_VERSION,

    operational_model: {
      ownership_domain_count: Object.keys(OWNERSHIP_BOUNDARIES).length,
      propagation_contract_count: PROPAGATION_CONTRACTS.length,
      orchestration_phase_count: ORCHESTRATION_BOUNDARIES.compilation_order.length,
      registered_artifact_count: SQO_COCKPIT_ARTIFACT_KEYS.length,
      stabilization_rule_count: RUNTIME_STABILIZATION_RULES.length,
    },

    operational_health: operationalHealth,
    propagation_integrity: propagationIntegrity,

    qualification_projection: qualificationProjection.ok ? {
      qualification_posture: qualificationProjection.qualification_posture,
      reconciliation_posture: qualificationProjection.reconciliation_posture,
      semantic_debt_posture: qualificationProjection.semantic_debt_posture,
      temporal_analytics_posture: qualificationProjection.temporal_analytics_posture,
      evidence_intake_posture: qualificationProjection.evidence_intake_posture,
      replay_and_certification: qualificationProjection.replay_and_certification,
      propagation_readiness: qualificationProjection.propagation_readiness,
      semantic_envelope: qualificationProjection.semantic_envelope,
    } : null,

    ownership_boundaries: Object.entries(OWNERSHIP_BOUNDARIES).map(([id, domain]) => ({
      id,
      owner: domain.owner,
      description: domain.description,
      artifact_count: (domain.artifacts || []).length,
      mutation_authority: domain.mutation_authority,
    })),

    propagation_contracts: PROPAGATION_CONTRACTS.map(c => ({
      id: c.id,
      from: c.from,
      to: c.to,
      direction: c.direction,
      contract: c.contract,
    })),

    orchestration: {
      phases: ORCHESTRATION_BOUNDARIES.compilation_order,
      replay_semantics: ORCHESTRATION_BOUNDARIES.replay_semantics,
      mutation_rules: ORCHESTRATION_BOUNDARIES.mutation_rules,
    },

    stabilization_rules: RUNTIME_STABILIZATION_RULES,

    boundary_disclosure: {
      client,
      run_id: runId,
      artifact_root: `artifacts/sqo/${client}/${runId}`,
      governance: {
        deterministic: true,
        replay_safe: true,
        no_inference: true,
        no_enrichment: true,
        no_path_a_mutation: true,
        no_path_b_mutation: true,
        no_authority_promotion: true,
        substrate_only: true,
      },
      provenance: {
        compiler: 'RuntimeSemanticOperationsSubstrate',
        substrate_version: SUBSTRATE_VERSION,
        stream: 'PI.SQO.RUNTIME-SEMANTIC-OPERATIONS-CONSOLIDATION.01',
      },
    },
  };
}

function emitSubstrate(substrate, client, runId) {
  const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');
  const outDir = path.join(REPO_ROOT, 'artifacts', 'sqo', client, runId);
  const outPath = path.join(outDir, 'runtime_semantic_operations_substrate.v1.json');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const { ok, ...artifactData } = substrate;
  fs.writeFileSync(outPath, JSON.stringify(artifactData, null, 2), 'utf8');

  return { ok: true, path: outPath, size: fs.statSync(outPath).size };
}

module.exports = {
  OWNERSHIP_BOUNDARIES,
  PROPAGATION_CONTRACTS,
  ORCHESTRATION_BOUNDARIES,
  RUNTIME_STABILIZATION_RULES,
  assessOperationalHealth,
  assessPropagationIntegrity,
  compileSemanticOperationsSubstrate,
  emitSubstrate,
};
