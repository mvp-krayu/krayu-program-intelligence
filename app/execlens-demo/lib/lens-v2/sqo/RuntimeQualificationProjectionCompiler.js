'use strict';

const fs = require('fs');
const path = require('path');
const { loadAllCockpitArtifacts, getArtifactData, isArtifactAvailable } = require('../../sqo-cockpit/SQOCockpitArtifactLoader');
const { projectDebtIndexForRuntime } = require('../../sqo-cockpit/SemanticDebtIndexProjection');
const { projectLifecycleForRuntime } = require('../../sqo-cockpit/ReconciliationLifecycleProjection');
const { projectTemporalAnalyticsForRuntime } = require('../../sqo-cockpit/TemporalAnalyticsProjection');
const { projectEvidenceIntakeForRuntime } = require('../../sqo-cockpit/EvidenceIntakeProjection');

const COMPILER_VERSION = '1.0';

const PROPAGATION_GATES = {
  ALL_CRITICAL_ARTIFACTS_PRESENT: 'ALL_CRITICAL_ARTIFACTS_PRESENT',
  NO_CRITICAL_DEBT_UNADDRESSED: 'NO_CRITICAL_DEBT_UNADDRESSED',
  REPLAY_VERIFICATION_PASSED: 'REPLAY_VERIFICATION_PASSED',
  CERTIFICATION_PASSED: 'CERTIFICATION_PASSED',
  EVIDENCE_INTAKE_VALID: 'EVIDENCE_INTAKE_VALID',
  NO_DEGRADATION_DETECTED: 'NO_DEGRADATION_DETECTED',
};

function compileQualificationPosture(loadResult) {
  const qualState = getArtifactData(loadResult, 'qualification_state');
  const maturity = getArtifactData(loadResult, 'semantic_maturity_profile');
  const gravity = getArtifactData(loadResult, 'semantic_gravity_assessment');
  const stability = getArtifactData(loadResult, 'qualification_stability');
  const progression = getArtifactData(loadResult, 'progression_readiness');

  if (!qualState) return null;

  return {
    s_state: qualState.qualification_state.s_state,
    state_label: qualState.qualification_state.state_label,
    state_reason: qualState.qualification_state.state_reason,
    authorization_tier: qualState.qualification_state.authorization_tier,
    q_class: qualState.evidence ? qualState.evidence.q_class : null,
    grounding_ratio: qualState.evidence && qualState.evidence.qualifier_summary
      ? qualState.evidence.qualifier_summary.derivation_inputs.grounding_ratio
      : null,
    maturity: maturity ? {
      score: maturity.overall_maturity_score,
      classification: maturity.overall_classification,
    } : null,
    gravity: gravity ? {
      score: gravity.semantic_gravity_score,
      classification: gravity.classification,
    } : null,
    stability: stability ? {
      score: stability.qualification_stability_score,
      classification: stability.classification,
    } : null,
    progression: progression ? {
      readiness: progression.progression_readiness,
      target: progression.next_s_state_target,
      blocking_debt_count: progression.blocking_debt_count,
      total_debt_items: progression.total_debt_items,
    } : null,
  };
}

function compileReconciliationPosture(loadResult) {
  const recon = getArtifactData(loadResult, 'reconciliation_correspondence');
  const lifecycle = getArtifactData(loadResult, 'reconciliation_lifecycle');

  if (!recon) return null;

  const lifecycleProjection = lifecycle ? projectLifecycleForRuntime(lifecycle) : null;

  return {
    summary: {
      total_semantic_domains: recon.summary ? recon.summary.total_semantic_domains : null,
      reconciled_count: recon.summary ? recon.summary.reconciled_count : null,
      unreconciled_count: recon.summary ? recon.summary.unreconciled_count : null,
      reconciliation_ratio: recon.summary ? recon.summary.reconciliation_ratio : null,
      weighted_confidence: recon.summary ? recon.summary.weighted_confidence_score : null,
      unmatched_structural_count: recon.summary ? recon.summary.unmatched_structural_count : null,
    },
    confidence_distribution: recon.summary ? recon.summary.confidence_distribution : null,
    lifecycle: lifecycleProjection ? {
      trend: lifecycleProjection.trend,
      currentPosture: lifecycleProjection.currentPosture,
      latestDelta: lifecycleProjection.latestDelta,
      unresolvedDomains: lifecycleProjection.unresolvedDomains,
    } : null,
  };
}

function compileSemanticDebtPosture(loadResult) {
  const debt = getArtifactData(loadResult, 'semantic_debt_inventory');
  const debtIndex = getArtifactData(loadResult, 'semantic_debt_index');

  if (!debt && !debtIndex) return null;

  const indexProjection = debtIndex ? projectDebtIndexForRuntime(debtIndex) : null;

  return {
    summary: debt ? {
      total_items: debt.total_debt_items,
      s_state: debt.s_state,
      blocking_count: (debt.debt_items || []).filter(i => i.blocks_s_state).length,
    } : null,
    index: indexProjection ? {
      aggregatePosture: indexProjection.aggregatePosture,
      reducibilitySummary: indexProjection.reducibilitySummary,
      exposureSummary: indexProjection.exposureSummary,
      lifecycle: indexProjection.lifecycle,
    } : null,
    domain_postures: indexProjection ? indexProjection.domainPostures : null,
  };
}

function compileTemporalAnalyticsPosture(loadResult) {
  const analytics = getArtifactData(loadResult, 'reconciliation_temporal_analytics');
  if (!analytics) return null;

  const projection = projectTemporalAnalyticsForRuntime(analytics);
  if (!projection) return null;

  return {
    trend: projection.trend,
    enrichmentEffectiveness: projection.enrichmentEffectiveness,
    debtReduction: projection.debtReduction,
    unresolvedPersistence: projection.unresolvedPersistence,
    degradation: projection.degradation,
    divergence: projection.divergence,
  };
}

function compileEvidenceIntakePosture(loadResult) {
  const intake = getArtifactData(loadResult, 'semantic_evidence_intake');
  if (!intake) return null;

  const projection = projectEvidenceIntakeForRuntime(intake);
  if (!projection) return null;

  return {
    summary: projection.summary,
    eligibility: projection.eligibility,
    accepted_count: projection.summary ? projection.summary.accepted_count : 0,
    rejected_count: projection.summary ? projection.summary.rejected_count : 0,
    quarantined_count: projection.summary ? projection.summary.quarantined_count : 0,
    all_valid: projection.summary ? projection.summary.all_valid : false,
  };
}

function compileReplayAndCertificationPosture(loadResult) {
  const replayKeys = [
    'maturity_replay_verification',
    'qualification_state_replay_verification',
    'debt_replay_verification',
  ];

  const certKeys = [
    'maturity_certification',
    'qualification_state_certification',
    'debt_certification',
  ];

  const replays = {};
  let allReplaysPassed = true;
  for (const key of replayKeys) {
    const data = getArtifactData(loadResult, key);
    if (!data) {
      replays[key] = { available: false, verdict: null };
      allReplaysPassed = false;
    } else {
      replays[key] = { available: true, verdict: data.overall_verdict };
      if (data.overall_verdict !== 'PASS') allReplaysPassed = false;
    }
  }

  const certifications = {};
  let allCertsPassed = true;
  for (const key of certKeys) {
    const data = getArtifactData(loadResult, key);
    if (!data) {
      certifications[key] = { available: false, status: null };
      allCertsPassed = false;
    } else {
      const cases = data.checks || data.certification_cases || data.cases || [];
      const allPassed = cases.length > 0 && cases.every(c => c.pass);
      const status = data.certification_status || (allPassed ? 'CERTIFIED' : 'NOT_CERTIFIED');
      certifications[key] = { available: true, status };
      if (status !== 'CERTIFIED') allCertsPassed = false;
    }
  }

  return {
    replays,
    certifications,
    all_replays_passed: allReplaysPassed,
    all_certifications_passed: allCertsPassed,
  };
}

function compilePropagationReadiness(loadResult, qualPosture, debtPosture, temporalPosture, intakePosture, replayPosture) {
  const gates = [];

  const criticalPresent = isArtifactAvailable(loadResult, 'qualification_state')
    && isArtifactAvailable(loadResult, 'semantic_maturity_profile');
  gates.push({
    gate: PROPAGATION_GATES.ALL_CRITICAL_ARTIFACTS_PRESENT,
    met: criticalPresent,
    detail: criticalPresent ? null : 'Missing critical artifacts',
  });

  const noCriticalDebt = debtPosture && debtPosture.index && debtPosture.index.aggregatePosture
    ? (debtPosture.index.aggregatePosture.severity_distribution || {}).CRITICAL === 0
    : true;
  gates.push({
    gate: PROPAGATION_GATES.NO_CRITICAL_DEBT_UNADDRESSED,
    met: noCriticalDebt,
    detail: noCriticalDebt ? null : 'Critical severity debt items present',
  });

  const replayPassed = replayPosture ? replayPosture.all_replays_passed : false;
  gates.push({
    gate: PROPAGATION_GATES.REPLAY_VERIFICATION_PASSED,
    met: replayPassed,
    detail: replayPassed ? null : 'One or more replay verifications failed or unavailable',
  });

  const certPassed = replayPosture ? replayPosture.all_certifications_passed : false;
  gates.push({
    gate: PROPAGATION_GATES.CERTIFICATION_PASSED,
    met: certPassed,
    detail: certPassed ? null : 'One or more certifications failed or unavailable',
  });

  const intakeValid = intakePosture ? intakePosture.all_valid : false;
  gates.push({
    gate: PROPAGATION_GATES.EVIDENCE_INTAKE_VALID,
    met: intakeValid,
    detail: intakeValid ? null : 'Evidence intake has rejected or quarantined items, or unavailable',
  });

  const noDegradation = temporalPosture && temporalPosture.degradation
    ? !temporalPosture.degradation.detected
    : true;
  gates.push({
    gate: PROPAGATION_GATES.NO_DEGRADATION_DETECTED,
    met: noDegradation,
    detail: noDegradation ? null : 'Temporal degradation signals detected',
  });

  const allGatesMet = gates.every(g => g.met);
  const failedGates = gates.filter(g => !g.met);

  return {
    ready: allGatesMet,
    gate_count: gates.length,
    gates_met: gates.filter(g => g.met).length,
    gates_failed: failedGates.length,
    gates,
    blocking_summary: failedGates.map(g => g.gate),
    s_state_progression: qualPosture && qualPosture.progression ? {
      current: qualPosture.s_state,
      target: qualPosture.progression.target,
      readiness_score: qualPosture.progression.readiness,
      blocking_debt_count: qualPosture.progression.blocking_debt_count,
    } : null,
  };
}

function compileSemanticEnvelope(loadResult) {
  const available = [];
  const missing = [];

  const envelopeKeys = [
    { key: 'qualification_state', facet: 'qualification' },
    { key: 'semantic_maturity_profile', facet: 'maturity' },
    { key: 'semantic_gravity_assessment', facet: 'gravity' },
    { key: 'qualification_stability', facet: 'stability' },
    { key: 'progression_readiness', facet: 'progression' },
    { key: 'semantic_debt_inventory', facet: 'debt_inventory' },
    { key: 'semantic_debt_index', facet: 'debt_index' },
    { key: 'continuity_assessment', facet: 'continuity' },
    { key: 'reconciliation_correspondence', facet: 'reconciliation' },
    { key: 'reconciliation_lifecycle', facet: 'lifecycle' },
    { key: 'reconciliation_temporal_analytics', facet: 'temporal_analytics' },
    { key: 'semantic_evidence_intake', facet: 'evidence_intake' },
    { key: 'maturity_replay_verification', facet: 'maturity_replay' },
    { key: 'qualification_state_replay_verification', facet: 'qualification_replay' },
    { key: 'debt_replay_verification', facet: 'debt_replay' },
    { key: 'maturity_certification', facet: 'maturity_cert' },
    { key: 'qualification_state_certification', facet: 'qualification_cert' },
    { key: 'debt_certification', facet: 'debt_cert' },
    { key: 'qualification_history', facet: 'history' },
    { key: 'maturity_dimension_breakdown', facet: 'maturity_breakdown' },
  ];

  for (const { key, facet } of envelopeKeys) {
    if (isArtifactAvailable(loadResult, key)) {
      available.push(facet);
    } else {
      missing.push(facet);
    }
  }

  return {
    total_facets: envelopeKeys.length,
    available_count: available.length,
    missing_count: missing.length,
    coverage_ratio: +(available.length / envelopeKeys.length).toFixed(4),
    available,
    missing,
    complete: missing.length === 0,
  };
}

function compileBoundaryDisclosure(loadResult, client, runId) {
  const sourceArtifacts = [];
  for (const key of [
    'qualification_state', 'semantic_maturity_profile', 'semantic_gravity_assessment',
    'qualification_stability', 'progression_readiness', 'semantic_debt_inventory',
    'semantic_debt_index', 'continuity_assessment', 'reconciliation_correspondence',
    'reconciliation_lifecycle', 'reconciliation_temporal_analytics', 'semantic_evidence_intake',
  ]) {
    if (isArtifactAvailable(loadResult, key)) {
      sourceArtifacts.push(key);
    }
  }

  return {
    client,
    run_id: runId,
    artifact_root: `artifacts/sqo/${client}/${runId}`,
    source_artifact_count: sourceArtifacts.length,
    source_artifacts: sourceArtifacts,
    governance: {
      deterministic: true,
      replay_safe: true,
      no_inference: true,
      no_enrichment: true,
      no_path_a_mutation: true,
      no_path_b_mutation: true,
      no_authority_promotion: true,
      projection_only: true,
    },
    provenance: {
      compiler: 'RuntimeQualificationProjectionCompiler',
      compiler_version: COMPILER_VERSION,
      stream: 'PI.SQO.RUNTIME-QUALIFICATION-PROJECTION.01',
    },
  };
}

function compileRuntimeQualificationProjection(client, runId) {
  const loadResult = loadAllCockpitArtifacts(client, runId);

  if (!loadResult.ok) {
    return {
      ok: false,
      error: loadResult.error,
      client,
      run_id: runId,
    };
  }

  const qualificationPosture = compileQualificationPosture(loadResult);
  const reconciliationPosture = compileReconciliationPosture(loadResult);
  const semanticDebtPosture = compileSemanticDebtPosture(loadResult);
  const temporalAnalyticsPosture = compileTemporalAnalyticsPosture(loadResult);
  const evidenceIntakePosture = compileEvidenceIntakePosture(loadResult);
  const replayAndCertification = compileReplayAndCertificationPosture(loadResult);
  const propagationReadiness = compilePropagationReadiness(
    loadResult, qualificationPosture, semanticDebtPosture,
    temporalAnalyticsPosture, evidenceIntakePosture, replayAndCertification
  );
  const semanticEnvelope = compileSemanticEnvelope(loadResult);
  const boundaryDisclosure = compileBoundaryDisclosure(loadResult, client, runId);

  return {
    ok: true,
    schema_version: '1.0',
    artifact_type: 'runtime_qualification_projection',
    client,
    run_id: runId,
    generated_at: new Date().toISOString(),
    compiler_version: COMPILER_VERSION,
    qualification_posture: qualificationPosture,
    reconciliation_posture: reconciliationPosture,
    semantic_debt_posture: semanticDebtPosture,
    temporal_analytics_posture: temporalAnalyticsPosture,
    evidence_intake_posture: evidenceIntakePosture,
    replay_and_certification: replayAndCertification,
    propagation_readiness: propagationReadiness,
    semantic_envelope: semanticEnvelope,
    boundary_disclosure: boundaryDisclosure,
  };
}

function emitQualificationProjection(projection, client, runId) {
  const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');
  const outDir = path.join(REPO_ROOT, 'artifacts', 'sqo', client, runId);
  const outPath = path.join(outDir, 'runtime_qualification_projection.v1.json');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const { ok, ...artifactData } = projection;
  fs.writeFileSync(outPath, JSON.stringify(artifactData, null, 2), 'utf8');

  return { ok: true, path: outPath, size: fs.statSync(outPath).size };
}

module.exports = {
  PROPAGATION_GATES,
  compileQualificationPosture,
  compileReconciliationPosture,
  compileSemanticDebtPosture,
  compileTemporalAnalyticsPosture,
  compileEvidenceIntakePosture,
  compileReplayAndCertificationPosture,
  compilePropagationReadiness,
  compileSemanticEnvelope,
  compileBoundaryDisclosure,
  compileRuntimeQualificationProjection,
  emitQualificationProjection,
};
