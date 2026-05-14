'use strict';

const path = require('path');
const { loadManifest, isClientRunAllowed } = require('../manifests');
const { loadJSON } = require('../SemanticArtifactLoader');
const { runFullDetection } = require('./QualificationStateEngine');
const { runFullDebtDetection } = require('./SemanticDebtEngine');
const { computeCoverageMetrics, loadArtifactsForInspection } = require('./ContinuityAssessmentEngine');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const OPERATION_VERSION = '1.0';

const DIMENSION_IDS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];

const DIMENSION_LABELS = {
  D1: 'STRUCTURAL_CONTINUITY',
  D2: 'SEMANTIC_GROUNDING',
  D3: 'LINEAGE_STRENGTH',
  D4: 'REPRODUCIBILITY',
  D5: 'GOVERNANCE_COMPLETENESS',
  D6: 'PROJECTION_READINESS',
  D7: 'SEMANTIC_COHERENCE',
  D8: 'ENRICHMENT_READINESS',
};

const S_STATE_PROJECTION = {
  S0: 0.0,
  S1: 0.25,
  S2: 0.75,
  S3: 1.0,
};

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function classifyScore(score) {
  if (score <= 0.24) return 'LOW';
  if (score <= 0.49) return 'PARTIAL';
  if (score <= 0.74) return 'STABLE';
  return 'STRONG';
}

function computeDimensionScore(dimensionId, inputs) {
  const cm = inputs.coverageMetrics;
  const la = inputs.loadedArtifacts;
  const det = inputs.detection;
  const debt = inputs.debtResult;
  const replay = inputs.replayResult;

  switch (dimensionId) {
    case 'D1':
      return round3((cm.coverage_ratio + cm.label_fidelity_ratio) / 2);

    case 'D2':
      return cm.domain_count > 0 ? round3(cm.domains_grounded / cm.domain_count) : 0;

    case 'D3':
      return cm.lineage_strength;

    case 'D4': {
      const rv = la.reproducibility_verdict;
      if (!rv || !rv.ok || !rv.data) return 0;
      if (rv.data.verdict === 'FULL_REPRODUCIBILITY') return 1.0;
      if (rv.data.verdict === 'PARTIAL_REPRODUCIBILITY') return 0.5;
      return 0;
    }

    case 'D5': {
      const rm = la.rendering_metadata;
      const rmPresent = (rm && rm.ok && rm.data) ? 1.0 : 0.0;
      const qClass = (det.evidence && det.evidence.q_class) || 'NOT_AVAILABLE';
      const qClassPresent = qClass !== 'NOT_AVAILABLE' ? 1.0 : 0.0;
      const integrityEnforced = (rm && rm.ok && rm.data &&
        rm.data.inference_prohibition_status === 'ENFORCED') ? 1.0 : 0.0;
      const replayPass = (replay && replay.ok && replay.data &&
        replay.data.overall_verdict === 'PASS') ? 1.0 : 0.0;
      return round3((rmPresent + qClassPresent + integrityEnforced + replayPass) / 4);
    }

    case 'D6': {
      const sState = det.qualification.s_state;
      return S_STATE_PROJECTION[sState] !== undefined ? S_STATE_PROJECTION[sState] : 0.0;
    }

    case 'D7': {
      const inverseDebtPressure = debt.total_debt_items > 0
        ? round3(1 - ((debt.summary.critical_count + debt.summary.high_count) / debt.total_debt_items))
        : 1.0;
      return round3((cm.coverage_ratio + cm.lineage_strength + inverseDebtPressure) / 3);
    }

    case 'D8': {
      const replayPass = (replay && replay.ok && replay.data &&
        replay.data.overall_verdict === 'PASS') ? 1.0 : 0.0;
      const manifestRegistered = (det.evidence && det.evidence.manifest_registered) ? 1.0 : 0.0;
      const remediationResolvable = (debt.ok && debt.debt_items &&
        debt.debt_items.every(item => item.remediation != null)) ? 1.0 : 0.0;
      return round3((replayPass + manifestRegistered + remediationResolvable) / 3);
    }

    default:
      return 0;
  }
}

function computeAllDimensions(inputs) {
  const dimensions = {};
  for (const id of DIMENSION_IDS) {
    const score = computeDimensionScore(id, inputs);
    dimensions[id] = {
      id,
      label: DIMENSION_LABELS[id],
      score,
      classification: classifyScore(score),
    };
  }
  return dimensions;
}

function computeOverallMaturity(dimensions) {
  let sum = 0;
  for (const id of DIMENSION_IDS) {
    sum += dimensions[id].score;
  }
  return round3(sum / DIMENSION_IDS.length);
}

function gatherInputs(client, runId) {
  const detection = runFullDetection(client, runId);
  if (!detection.ok) return { ok: false, error: detection.error };

  const debtResult = runFullDebtDetection(client, runId);
  if (!debtResult.ok) return { ok: false, error: debtResult.error };

  const manifestResult = loadManifest(client, runId);
  if (!manifestResult.ok) return { ok: false, error: 'MANIFEST_LOAD_FAILED' };

  const loadedArtifacts = loadArtifactsForInspection(manifestResult.manifest);
  const coverageMetrics = computeCoverageMetrics(loadedArtifacts);

  const replayPath = path.join(
    'artifacts', 'sqo', client, runId,
    'qualification_state_replay_verification.v1.json'
  );
  const replayResult = loadJSON(replayPath);

  return {
    ok: true,
    coverageMetrics,
    loadedArtifacts,
    detection,
    debtResult,
    replayResult,
  };
}

function collectMaturityInputHashes(loadedArtifacts, client, runId) {
  const hashes = {};
  for (const [key, result] of Object.entries(loadedArtifacts)) {
    hashes[key] = result.ok ? 'present' : 'absent';
  }
  const replayPath = path.join(
    'artifacts', 'sqo', client, runId,
    'qualification_state_replay_verification.v1.json'
  );
  const replayResult = loadJSON(replayPath);
  hashes['sqo_qualification_state_replay'] = (replayResult && replayResult.ok) ? 'present' : 'absent';

  const debtPath = path.join(
    'artifacts', 'sqo', client, runId,
    'semantic_debt_inventory.v1.json'
  );
  const debtResult = loadJSON(debtPath);
  hashes['sqo_semantic_debt_inventory'] = (debtResult && debtResult.ok) ? 'present' : 'absent';

  return hashes;
}

function runMaturityScoring(client, runId) {
  if (!isClientRunAllowed(client, runId)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED', client, run_id: runId };
  }

  const inputs = gatherInputs(client, runId);
  if (!inputs.ok) {
    return { ok: false, error: inputs.error, client, run_id: runId };
  }

  const dimensions = computeAllDimensions(inputs);
  const overallScore = computeOverallMaturity(dimensions);

  return {
    ok: true,
    client,
    run_id: runId,
    s_state: inputs.detection.qualification.s_state,
    dimensions,
    overall_maturity_score: overallScore,
    overall_classification: classifyScore(overallScore),
    coverage_metrics: inputs.coverageMetrics,
    debt_summary: inputs.debtResult.summary,
    total_debt_items: inputs.debtResult.total_debt_items,
    input_hashes: collectMaturityInputHashes(inputs.loadedArtifacts, client, runId),
  };
}

function buildMaturityProfileArtifact(maturityResult) {
  const body = {
    schema_version: SCHEMA_VERSION,
    client: maturityResult.client,
    run_id: maturityResult.run_id,
    timestamp: new Date().toISOString(),
    s_state: maturityResult.s_state,
    overall_maturity_score: maturityResult.overall_maturity_score,
    overall_classification: maturityResult.overall_classification,
    dimensions: maturityResult.dimensions,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      no_source_mutation: true,
      sqo_advisory_only: true,
      no_hidden_weights: true,
      deterministic: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      input_hashes: maturityResult.input_hashes || {},
      operation: 'compute_maturity_profile',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitMaturityProfile(maturityResult) {
  const artifact = buildMaturityProfileArtifact(maturityResult);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', maturityResult.client, maturityResult.run_id);
  const outputPath = path.join(outputDir, 'semantic_maturity_profile.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

function buildMaturityCertificationArtifact(certData) {
  const body = {
    schema_version: SCHEMA_VERSION,
    client: certData.client,
    run_id: certData.run_id,
    timestamp: new Date().toISOString(),
    certification_status: certData.all_pass ? 'CERTIFIED' : 'NOT_CERTIFIED',
    overall_maturity_score: certData.overall_maturity_score,
    overall_classification: certData.overall_classification,
    semantic_gravity: certData.semantic_gravity,
    qualification_stability: certData.qualification_stability,
    progression_readiness: certData.progression_readiness,
    dimension_count: DIMENSION_IDS.length,
    checks: certData.checks,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      no_source_mutation: true,
      sqo_advisory_only: true,
      deterministic: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'certify_maturity_scoring',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitMaturityCertification(certData) {
  const artifact = buildMaturityCertificationArtifact(certData);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', certData.client, certData.run_id);
  const outputPath = path.join(outputDir, 'maturity_certification.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

function buildDimensionBreakdownArtifact(maturityResult) {
  const breakdown = {};
  for (const id of DIMENSION_IDS) {
    const dim = maturityResult.dimensions[id];
    breakdown[id] = {
      label: dim.label,
      score: dim.score,
      classification: dim.classification,
    };
  }

  const body = {
    schema_version: SCHEMA_VERSION,
    client: maturityResult.client,
    run_id: maturityResult.run_id,
    timestamp: new Date().toISOString(),
    overall_maturity_score: maturityResult.overall_maturity_score,
    overall_classification: maturityResult.overall_classification,
    dimension_breakdown: breakdown,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      deterministic: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'compute_dimension_breakdown',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitDimensionBreakdown(maturityResult) {
  const artifact = buildDimensionBreakdownArtifact(maturityResult);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', maturityResult.client, maturityResult.run_id);
  const outputPath = path.join(outputDir, 'maturity_dimension_breakdown.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  OPERATION_VERSION,
  DIMENSION_IDS,
  DIMENSION_LABELS,
  S_STATE_PROJECTION,
  classifyScore,
  round3,
  computeDimensionScore,
  computeAllDimensions,
  computeOverallMaturity,
  gatherInputs,
  runMaturityScoring,
  collectMaturityInputHashes,
  buildMaturityProfileArtifact,
  emitMaturityProfile,
  buildMaturityCertificationArtifact,
  emitMaturityCertification,
  buildDimensionBreakdownArtifact,
  emitDimensionBreakdown,
};
