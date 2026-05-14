'use strict';

const { getArtifactData } = require('./SQOCockpitArtifactLoader');
const { classifyDebtUrgency } = require('./DeferredDebtClassifier');
const { resolveRemediationStages, getCurrentStage } = require('./RemediationStageResolver');

const SOURCE_MATERIAL_MAP = {
  label: {
    label: 'Business Semantic Material',
    materials: ['Architecture Decision Records (ADRs)', 'Capability models', 'Bounded context descriptions', 'Domain glossaries'],
  },
  grounding_gap: {
    label: 'Structural Grounding Evidence',
    materials: ['Structural evidence mappings', 'Repository lineage evidence', 'Ownership mappings', 'Component-to-domain traceability'],
  },
  missing_artifact: {
    label: 'Semantic Pipeline Inputs',
    materials: ['Semantic continuity crosswalk inputs', 'Validation evidence', 'Reproducibility evidence', 'Business semantic references'],
  },
  validation: {
    label: 'Validation Evidence',
    materials: ['Semantic derivation evidence', 'Decision validation inputs'],
  },
  reproducibility: {
    label: 'Reproducibility Evidence',
    materials: ['Reproducibility verification inputs', 'Pipeline execution evidence'],
  },
  continuity_gap: {
    label: 'Continuity Source Material',
    materials: ['Entity-to-topology mapping', 'Crosswalk source definitions', 'Business label assignments'],
  },
  rendering_metadata: {
    label: 'Rendering Configuration',
    materials: ['Rendering metadata definitions'],
  },
};

const MATURATION_NARRATIVES = {
  S1: {
    current: 'exposes structural semantics without continuity qualification',
    blocked: 'Critical qualification artifacts required for continuity assessment are absent',
    deferred: 'Grounding expansion debt remains deferred until S2 qualification is achieved',
    after_rerun: 'After R2 re-run: continuity assessable, maturity recomputable, projection qualification possible',
  },
  S2: {
    current: 'has partial grounding with validated semantic continuity',
    blocked: 'Grounding gaps prevent full semantic governance',
    deferred: 'Full S3 governance requires structural grounding for all domains',
    after_rerun: 'After R4 grounding: full semantic governance achievable',
  },
};

function resolveQualificationJourney(loadResult) {
  const qualState = getArtifactData(loadResult, 'qualification_state');
  const debt = getArtifactData(loadResult, 'semantic_debt_inventory');
  const progression = getArtifactData(loadResult, 'progression_readiness');
  const maturity = getArtifactData(loadResult, 'semantic_maturity_profile');
  const continuity = getArtifactData(loadResult, 'continuity_assessment');

  if (!qualState || !debt) {
    return { available: false, reason: 'INSUFFICIENT_DATA' };
  }

  const sState = qualState.qualification_state.s_state;
  const debtItems = debt.debt_items || [];
  const classified = classifyDebtUrgency(debtItems, sState);
  const stages = resolveRemediationStages(debtItems);
  const currentStage = getCurrentStage(stages);
  const missingArtifacts = qualState.evidence ? qualState.evidence.required_artifacts_missing : [];

  const blockerClass = classified.immediate.length > 0
    ? categorizeBlockerClass(classified.immediate)
    : 'NONE';

  const sourceGuidance = resolveSourceMaterialGuidance(debtItems);

  const rerunChecklist = buildRerunChecklist(sState, missingArtifacts, debtItems);

  const validationGates = buildValidationGates(sState);

  const narratives = MATURATION_NARRATIVES[sState] || MATURATION_NARRATIVES.S1;

  return {
    available: true,
    banner: {
      client: loadResult.client,
      s_state: sState,
      s_state_label: qualState.qualification_state.state_label,
      next_reachable: progression ? progression.next_s_state_target : null,
      authorization: qualState.qualification_state.authorization_tier,
      blocker_class: blockerClass,
      workflow_stage: currentStage ? currentStage.label : 'No active workflow',
      workflow_pathway: currentStage ? currentStage.pathway : null,
    },
    immediateBlockers: classified.immediate,
    deferredDebt: classified.deferred,
    activeDebt: classified.active,
    debtCounts: classified.counts,
    remediationStages: stages,
    currentStage,
    progression: progression ? {
      readiness: progression.progression_readiness,
      current: progression.current_s_state,
      target: progression.next_s_state_target,
      blocking_count: progression.blocking_debt_count,
      total: progression.total_debt_items,
    } : null,
    maturity: maturity ? {
      score: maturity.overall_maturity_score,
      classification: maturity.overall_classification,
    } : null,
    continuity: continuity ? {
      status: continuity.overall_status,
      coverage: continuity.coverage_ratio,
    } : null,
    missingArtifacts,
    sourceGuidance,
    rerunChecklist,
    validationGates,
    narratives,
  };
}

function categorizeBlockerClass(immediateItems) {
  const categories = [...new Set(immediateItems.map(i => i.category))];
  if (categories.includes('missing_artifact')) return 'MISSING_QUALIFICATION_ARTIFACTS';
  if (categories.includes('grounding_gap')) return 'GROUNDING_GAPS';
  return 'MIXED_BLOCKERS';
}

function resolveSourceMaterialGuidance(debtItems) {
  const categories = [...new Set(debtItems.map(i => i.category))];
  const guidance = [];

  for (const cat of categories) {
    const mapping = SOURCE_MATERIAL_MAP[cat];
    if (!mapping) continue;
    const count = debtItems.filter(i => i.category === cat).length;
    guidance.push({
      category: cat,
      label: mapping.label,
      materials: mapping.materials,
      debt_count: count,
    });
  }

  return guidance;
}

function buildRerunChecklist(sState, missingArtifacts, debtItems) {
  const preRunRequirements = [
    { id: 'crosswalk_inputs', label: 'Semantic continuity crosswalk inputs available', met: !missingArtifacts.includes('semantic_continuity_crosswalk') },
    { id: 'validation_evidence', label: 'Validation evidence available', met: !missingArtifacts.includes('decision_validation') },
    { id: 'reproducibility_evidence', label: 'Reproducibility evidence available', met: !missingArtifacts.includes('reproducibility_verdict') },
    { id: 'business_references', label: 'Business semantic references available', met: false },
    { id: 'replay_prerequisites', label: 'Replay prerequisites satisfied', met: true },
  ];

  const expectedOutputs = [
    { id: 'decision_validation', label: 'decision_validation artifact', expected: missingArtifacts.includes('decision_validation') },
    { id: 'reproducibility_verdict', label: 'reproducibility_verdict artifact', expected: missingArtifacts.includes('reproducibility_verdict') },
    { id: 'semantic_continuity_crosswalk', label: 'semantic_continuity_crosswalk artifact', expected: missingArtifacts.includes('semantic_continuity_crosswalk') },
    { id: 'updated_maturity', label: 'Updated maturity profile', expected: true },
    { id: 'updated_continuity', label: 'Updated continuity assessment', expected: true },
  ];

  const validationGatesChecklist = [
    { id: 's2_eligibility', label: 'S2 eligibility re-evaluated', gate: true },
    { id: 'continuity_present', label: 'Continuity assessment present', gate: true },
    { id: 'replay_pass', label: 'Replay certification PASS', gate: true },
    { id: 'stability_recomputed', label: 'Qualification stability recomputed', gate: true },
  ];

  return {
    pre_run: preRunRequirements,
    expected_outputs: expectedOutputs,
    validation_gates: validationGatesChecklist,
    all_pre_run_met: preRunRequirements.every(r => r.met),
  };
}

function buildValidationGates(sState) {
  if (sState === 'S1') {
    return {
      target: 'S2',
      current_status: 'NOT_ELIGIBLE',
      gates: [
        { gate: 'All required semantic artifacts present', met: false, reason: 'Critical artifacts missing' },
        { gate: 'At least one domain with structural grounding', met: false, reason: 'No grounding established' },
        { gate: 'Semantic continuity crosswalk validated', met: false, reason: 'Crosswalk absent' },
        { gate: 'Decision validation passing', met: false, reason: 'Decision validation artifact missing' },
        { gate: 'Reproducibility verified', met: false, reason: 'Reproducibility verdict missing' },
      ],
      explanation: 'S2 qualification requires all critical semantic artifacts to be present and passing. Current S1 state cannot be re-evaluated until the R2 semantic pipeline re-run produces the missing artifacts.',
      reeval_condition: 'Eligible for re-evaluation after R2 re-run produces missing artifacts and validation passes.',
    };
  }

  if (sState === 'S2') {
    return {
      target: 'S3',
      current_status: 'NOT_ELIGIBLE',
      gates: [
        { gate: 'All domains structurally grounded', met: false, reason: 'Grounding gaps remain' },
        { gate: 'Full crosswalk coverage', met: false, reason: 'Partial coverage only' },
        { gate: 'All business labels assigned', met: false, reason: 'Structural labels persist' },
        { gate: 'Governance completeness verified', met: false, reason: 'Incomplete governance' },
      ],
      explanation: 'S3 qualification requires full structural grounding for all semantic domains. Current grounding gaps must be resolved through R4 structural grounding extension.',
      reeval_condition: 'Eligible for re-evaluation after R4 grounding extension resolves domain grounding gaps.',
    };
  }

  return {
    target: null,
    current_status: 'UNKNOWN',
    gates: [],
    explanation: 'Validation gates not defined for current state.',
    reeval_condition: null,
  };
}

module.exports = {
  SOURCE_MATERIAL_MAP,
  MATURATION_NARRATIVES,
  resolveQualificationJourney,
  resolveSourceMaterialGuidance,
  buildRerunChecklist,
  buildValidationGates,
};
