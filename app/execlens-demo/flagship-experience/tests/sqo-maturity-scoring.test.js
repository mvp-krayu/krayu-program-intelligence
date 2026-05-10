'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
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
  buildMaturityProfileArtifact,
  emitMaturityProfile,
  emitMaturityCertification,
  emitDimensionBreakdown,
} = require('../../lib/lens-v2/sqo/MaturityScoringEngine');

const {
  GRAVITY_DIMENSIONS,
  computeSemanticGravity,
  classifyGravity,
  computeGravityResult,
  emitGravityAssessment,
} = require('../../lib/lens-v2/sqo/SemanticGravityEngine');

const {
  STABILITY_DIMENSIONS,
  computeQualificationStability,
  classifyStability,
  computeStabilityResult,
  emitStabilityAssessment,
} = require('../../lib/lens-v2/sqo/QualificationStabilityEngine');

const {
  computeProgressionReadiness,
  identifyBlockingDebts,
  computeNextSStateTarget,
  computeProgressionResult,
  emitProgressionReadiness,
} = require('../../lib/lens-v2/sqo/ProgressionReadinessEngine');

const {
  verifyMaturityOutputHash,
  runMaturityReplayVerification,
  emitMaturityReplayVerification,
} = require('../../lib/lens-v2/sqo/MaturityReplayVerifier');

const { runFullDebtDetection } = require('../../lib/lens-v2/sqo/SemanticDebtEngine');

const BLUEEDGE_CLIENT = 'blueedge';
const BLUEEDGE_RUN = 'run_blueedge_productized_01_fixed';
const FASTAPI_CLIENT = 'fastapi';
const FASTAPI_RUN = 'run_02_oss_fastapi_pipeline';

const MATURITY_ARTIFACT_FILES = [
  'semantic_maturity_profile.v1.json',
  'semantic_gravity_assessment.v1.json',
  'qualification_stability.v1.json',
  'progression_readiness.v1.json',
  'maturity_replay_verification.v1.json',
  'maturity_certification.v1.json',
  'maturity_dimension_breakdown.v1.json',
];

function cleanupMaturityArtifacts() {
  const repoRoot = process.env.REPO_ROOT;
  for (const client of [BLUEEDGE_CLIENT, FASTAPI_CLIENT]) {
    const runId = client === BLUEEDGE_CLIENT ? BLUEEDGE_RUN : FASTAPI_RUN;
    const dir = path.join(repoRoot, 'artifacts', 'sqo', client, runId);
    for (const file of MATURITY_ARTIFACT_FILES) {
      const p = path.join(dir, file);
      try { fs.unlinkSync(p); } catch (_) { /* ignore */ }
    }
  }
}

describe('MaturityScoringEngine — D1-D8 dimension formulas', () => {
  let beResult;
  let faResult;

  before(() => {
    beResult = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    faResult = runMaturityScoring(FASTAPI_CLIENT, FASTAPI_RUN);
  });

  it('D1 STRUCTURAL_CONTINUITY produces expected BlueEdge score', () => {
    assert.equal(beResult.dimensions.D1.score, 0.532);
    assert.equal(beResult.dimensions.D1.classification, 'STABLE');
  });

  it('D2 SEMANTIC_GROUNDING produces expected BlueEdge score', () => {
    assert.equal(beResult.dimensions.D2.score, 0.235);
    assert.equal(beResult.dimensions.D2.classification, 'LOW');
  });

  it('D3 LINEAGE_STRENGTH equals lineage_strength from continuity', () => {
    assert.equal(beResult.dimensions.D3.score, beResult.coverage_metrics.lineage_strength);
  });

  it('D4 REPRODUCIBILITY returns 1.0 for FULL_REPRODUCIBILITY', () => {
    assert.equal(beResult.dimensions.D4.score, 1.0);
    assert.equal(beResult.dimensions.D4.classification, 'STRONG');
  });

  it('D4 REPRODUCIBILITY returns 0.0 for absent', () => {
    assert.equal(faResult.dimensions.D4.score, 0);
    assert.equal(faResult.dimensions.D4.classification, 'LOW');
  });

  it('D5 GOVERNANCE_COMPLETENESS computed correctly (BlueEdge)', () => {
    assert.equal(beResult.dimensions.D5.score, 1.0);
    assert.equal(beResult.dimensions.D5.classification, 'STRONG');
  });

  it('D6 PROJECTION_READINESS S2 maps to 0.75', () => {
    assert.equal(beResult.dimensions.D6.score, 0.75);
    assert.equal(beResult.dimensions.D6.classification, 'STRONG');
  });

  it('D6 PROJECTION_READINESS S1 maps to 0.25', () => {
    assert.equal(faResult.dimensions.D6.score, 0.25);
    assert.equal(faResult.dimensions.D6.classification, 'PARTIAL');
  });

  it('D7 SEMANTIC_COHERENCE formula produces expected score', () => {
    assert.equal(beResult.dimensions.D7.score, 0.246);
    assert.equal(beResult.dimensions.D7.classification, 'PARTIAL');
  });

  it('D8 ENRICHMENT_READINESS formula produces expected score', () => {
    assert.equal(beResult.dimensions.D8.score, 1.0);
    assert.equal(beResult.dimensions.D8.classification, 'STRONG');
  });
});

describe('MaturityScoringEngine — classification thresholds', () => {
  it('classifyScore thresholds correct', () => {
    assert.equal(classifyScore(0.0), 'LOW');
    assert.equal(classifyScore(0.24), 'LOW');
    assert.equal(classifyScore(0.25), 'PARTIAL');
    assert.equal(classifyScore(0.49), 'PARTIAL');
    assert.equal(classifyScore(0.50), 'STABLE');
    assert.equal(classifyScore(0.74), 'STABLE');
    assert.equal(classifyScore(0.75), 'STRONG');
    assert.equal(classifyScore(1.0), 'STRONG');
  });
});

describe('MaturityScoringEngine — overall maturity', () => {
  let beResult;
  let faResult;

  before(() => {
    beResult = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    faResult = runMaturityScoring(FASTAPI_CLIENT, FASTAPI_RUN);
  });

  it('overall_maturity_score is average of all 8 dimensions', () => {
    let sum = 0;
    for (const id of DIMENSION_IDS) {
      sum += beResult.dimensions[id].score;
    }
    const expected = round3(sum / 8);
    assert.equal(beResult.overall_maturity_score, expected);
  });

  it('BlueEdge overall > FastAPI overall', () => {
    assert.ok(beResult.overall_maturity_score > faResult.overall_maturity_score);
  });

  it('all 8 dimensions present in result', () => {
    assert.equal(Object.keys(beResult.dimensions).length, 8);
    for (const id of DIMENSION_IDS) {
      assert.ok(beResult.dimensions[id]);
      assert.equal(beResult.dimensions[id].id, id);
      assert.equal(beResult.dimensions[id].label, DIMENSION_LABELS[id]);
    }
  });
});

describe('SemanticGravityEngine', () => {
  let beResult;
  let faResult;

  before(() => {
    const be = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const fa = runMaturityScoring(FASTAPI_CLIENT, FASTAPI_RUN);
    beResult = computeGravityResult(BLUEEDGE_CLIENT, BLUEEDGE_RUN, be.dimensions);
    faResult = computeGravityResult(FASTAPI_CLIENT, FASTAPI_RUN, fa.dimensions);
  });

  it('semantic_gravity_score = avg(D1,D2,D3,D5,D7)', () => {
    const be = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    let sum = 0;
    for (const id of GRAVITY_DIMENSIONS) {
      sum += be.dimensions[id].score;
    }
    assert.equal(beResult.score, round3(sum / GRAVITY_DIMENSIONS.length));
  });

  it('gravity classification correct for BlueEdge', () => {
    assert.equal(beResult.classification, 'EMERGING');
  });

  it('gravity classification correct for FastAPI', () => {
    assert.equal(faResult.classification, 'FRAGMENTED');
  });

  it('gravity uses exactly 5 contributing dimensions', () => {
    assert.equal(Object.keys(beResult.contributing_dimensions).length, 5);
  });
});

describe('QualificationStabilityEngine', () => {
  let beResult;
  let faResult;

  before(() => {
    const be = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const fa = runMaturityScoring(FASTAPI_CLIENT, FASTAPI_RUN);
    beResult = computeStabilityResult(BLUEEDGE_CLIENT, BLUEEDGE_RUN, be.dimensions);
    faResult = computeStabilityResult(FASTAPI_CLIENT, FASTAPI_RUN, fa.dimensions);
  });

  it('qualification_stability_score = avg(D1,D3,D4,D5)', () => {
    const be = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    let sum = 0;
    for (const id of STABILITY_DIMENSIONS) {
      sum += be.dimensions[id].score;
    }
    assert.equal(beResult.score, round3(sum / STABILITY_DIMENSIONS.length));
  });

  it('stability classification correct for BlueEdge', () => {
    assert.equal(beResult.classification, 'STABLE');
  });

  it('stability classification correct for FastAPI', () => {
    assert.equal(faResult.classification, 'UNSTABLE');
  });
});

describe('ProgressionReadinessEngine', () => {
  let beDebt;
  let faDebt;

  before(() => {
    beDebt = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    faDebt = runFullDebtDetection(FASTAPI_CLIENT, FASTAPI_RUN);
  });

  it('progression_readiness formula correct', () => {
    const readiness = computeProgressionReadiness(beDebt.summary, beDebt.total_debt_items);
    assert.equal(readiness, round3(1 - (beDebt.summary.s_state_blocking_count / beDebt.total_debt_items)));
  });

  it('blocking debts identified correctly', () => {
    const blocking = identifyBlockingDebts(beDebt.debt_items);
    assert.equal(blocking.length, beDebt.summary.s_state_blocking_count);
    for (const item of blocking) {
      assert.ok(item.blocks_s_state && item.blocks_s_state !== 'none');
    }
  });

  it('next S-state target correct', () => {
    assert.equal(computeNextSStateTarget('S2'), 'S3');
    assert.equal(computeNextSStateTarget('S1'), 'S2');
    assert.equal(computeNextSStateTarget('S0'), 'S1');
    assert.equal(computeNextSStateTarget('S3'), 'S4_PLUS');
  });
});

describe('MaturityScoringEngine — BlueEdge full scoring', () => {
  let result;

  before(() => {
    result = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
  });

  it('run succeeds', () => {
    assert.equal(result.ok, true);
    assert.equal(result.s_state, 'S2');
  });

  it('D2 < 0.5 (low grounding)', () => {
    assert.ok(result.dimensions.D2.score < 0.5);
  });

  it('D5 high governance completeness', () => {
    assert.ok(result.dimensions.D5.score >= 0.75);
  });
});

describe('MaturityScoringEngine — FastAPI full scoring', () => {
  let result;

  before(() => {
    result = runMaturityScoring(FASTAPI_CLIENT, FASTAPI_RUN);
  });

  it('run succeeds with S1', () => {
    assert.equal(result.ok, true);
    assert.equal(result.s_state, 'S1');
  });

  it('D1 approximately 0 (no crosswalk)', () => {
    assert.equal(result.dimensions.D1.score, 0);
  });

  it('D2 approximately 0 (no grounding)', () => {
    assert.equal(result.dimensions.D2.score, 0);
  });

  it('D5 low governance completeness', () => {
    assert.ok(result.dimensions.D5.score < 0.5);
  });
});

describe('MaturityScoringEngine — determinism', () => {
  it('two consecutive runs produce identical maturity scores', () => {
    const run1 = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const run2 = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);

    assert.equal(run1.overall_maturity_score, run2.overall_maturity_score);
    assert.equal(run1.overall_classification, run2.overall_classification);

    for (const id of DIMENSION_IDS) {
      assert.equal(run1.dimensions[id].score, run2.dimensions[id].score);
      assert.equal(run1.dimensions[id].classification, run2.dimensions[id].classification);
    }
  });
});

describe('MaturityScoringEngine — fail closed', () => {
  it('unknown client/run fails closed', () => {
    const result = runMaturityScoring('nonexistent', 'fake_run');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });
});

describe('Maturity artifact emission and replay', () => {
  let beResult;
  let faResult;
  let beDebt;
  let faDebt;

  before(() => {
    beResult = runMaturityScoring(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    faResult = runMaturityScoring(FASTAPI_CLIENT, FASTAPI_RUN);
    beDebt = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    faDebt = runFullDebtDetection(FASTAPI_CLIENT, FASTAPI_RUN);
  });

  after(() => {
    cleanupMaturityArtifacts();
  });

  it('maturity profile artifact has SHA256 output hash', () => {
    const artifact = buildMaturityProfileArtifact(beResult);
    assert.ok(artifact.provenance.output_hash);
    assert.ok(artifact.provenance.output_hash.startsWith('sha256:'));
  });

  it('maturity profile output hash verifies', () => {
    const artifact = buildMaturityProfileArtifact(beResult);
    const check = verifyMaturityOutputHash(artifact);
    assert.equal(check.pass, true);
  });

  it('emits all 7 BlueEdge maturity artifacts', () => {
    const profile = emitMaturityProfile(beResult);
    assert.ok(fs.existsSync(profile.path));

    const gravResult = computeGravityResult(BLUEEDGE_CLIENT, BLUEEDGE_RUN, beResult.dimensions);
    const gravity = emitGravityAssessment(gravResult);
    assert.ok(fs.existsSync(gravity.path));

    const stabResult = computeStabilityResult(BLUEEDGE_CLIENT, BLUEEDGE_RUN, beResult.dimensions);
    const stability = emitStabilityAssessment(stabResult);
    assert.ok(fs.existsSync(stability.path));

    const progResult = computeProgressionResult(BLUEEDGE_CLIENT, BLUEEDGE_RUN, beResult.s_state, beDebt);
    const progression = emitProgressionReadiness(progResult);
    assert.ok(fs.existsSync(progression.path));

    const replay = runMaturityReplayVerification(BLUEEDGE_CLIENT, BLUEEDGE_RUN, profile.artifact);
    const replayEmit = emitMaturityReplayVerification(replay);
    assert.ok(fs.existsSync(replayEmit.path));

    const certData = {
      client: BLUEEDGE_CLIENT,
      run_id: BLUEEDGE_RUN,
      all_pass: true,
      overall_maturity_score: beResult.overall_maturity_score,
      overall_classification: beResult.overall_classification,
      semantic_gravity: { score: gravResult.score, classification: gravResult.classification },
      qualification_stability: { score: stabResult.score, classification: stabResult.classification },
      progression_readiness: progResult.progression_readiness,
      checks: [
        { name: 'maturity_scoring', pass: true },
        { name: 'semantic_gravity', pass: true },
        { name: 'qualification_stability', pass: true },
        { name: 'progression_readiness', pass: true },
        { name: 'replay_verification', pass: replay.overall_verdict === 'PASS' },
        { name: 'deterministic', pass: true },
      ],
    };
    const cert = emitMaturityCertification(certData);
    assert.ok(fs.existsSync(cert.path));

    const breakdown = emitDimensionBreakdown(beResult);
    assert.ok(fs.existsSync(breakdown.path));
  });

  it('maturity replay verification passes', () => {
    const profile = emitMaturityProfile(beResult);
    const replay = runMaturityReplayVerification(BLUEEDGE_CLIENT, BLUEEDGE_RUN, profile.artifact);
    assert.equal(replay.overall_verdict, 'PASS');
    assert.equal(replay.checks.input_integrity.pass, true);
    assert.equal(replay.checks.deterministic_recomputation.pass, true);
    assert.equal(replay.checks.output_hash.pass, true);
  });
});
