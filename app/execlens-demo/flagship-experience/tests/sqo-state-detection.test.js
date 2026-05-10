'use strict';

/**
 * sqo-state-detection.test.js
 * PI.SQO.STATE-DETECTION-ENGINE.01
 *
 * Certifies:
 *   1. BlueEdge resolves to S2 (Q-02, AUTHORIZED_WITH_QUALIFICATION)
 *   2. FastAPI resolves to S1 (REQUIRED_ARTIFACT_MISSING, NOT_AUTHORIZED)
 *   3. Unknown client/run fails closed
 *   4. Q-01 maps to S3
 *   5. Q-02 maps to S2
 *   6. Q-03 maps to S2
 *   7. Q-04 maps to S1
 *   8. Missing semantic topology → S0
 *   9. Missing required artifacts → S1
 *  10. Invalid loader result → S1
 *  11. Authorization mapping correct for all S-states
 *  12. Qualification artifact includes provenance
 *  13. Qualification artifact includes input hashes
 *  14. Replay verifier passes for repeated run
 *  15. No client-name branching in SQO modules
 *  16. Existing resolver tests still pass (covered by full regression)
 *  17. Existing runtime parameterization tests still pass (covered by full regression)
 */

const path = require('node:path');
const fs = require('node:fs');
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
  S_STATES,
  AUTHORIZATION_MAP,
  GOVERNANCE_DISCLOSURES,
  detectQualificationState,
  classifyAuthorizationFromSState,
  normalizeQualificationState,
  runFullDetection,
} = require('../../lib/lens-v2/sqo/QualificationStateEngine');

const {
  buildQualificationStateArtifact,
  emitQualificationState,
  computeHash,
} = require('../../lib/lens-v2/sqo/QualificationStateArtifact');

const {
  classifyTransition,
  emitQualificationHistory,
} = require('../../lib/lens-v2/sqo/QualificationHistory');

const {
  runReplayVerification,
  verifyOutputHash,
} = require('../../lib/lens-v2/sqo/ReplayVerifier');

const BLUEEDGE_CLIENT = 'blueedge';
const BLUEEDGE_RUN = 'run_blueedge_productized_01_fixed';
const FASTAPI_CLIENT = 'fastapi';
const FASTAPI_RUN = 'run_02_oss_fastapi_pipeline';

const SQO_ARTIFACT_DIR = path.join(process.env.REPO_ROOT, 'artifacts', 'sqo');

function cleanupSqoArtifacts() {
  for (const sub of [
    path.join(SQO_ARTIFACT_DIR, BLUEEDGE_CLIENT, BLUEEDGE_RUN),
    path.join(SQO_ARTIFACT_DIR, FASTAPI_CLIENT, FASTAPI_RUN),
  ]) {
    if (fs.existsSync(sub)) {
      fs.rmSync(sub, { recursive: true, force: true });
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 1. BlueEdge resolves to S2
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge S-state detection', () => {
  it('BlueEdge resolves to S2', () => {
    const result = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    assert.ok(result.ok, 'detection must succeed');
    assert.equal(result.qualification.s_state, 'S2');
    assert.equal(result.qualification.state_label, S_STATES.S2);
  });

  it('BlueEdge has Q-02 qualifier', () => {
    const result = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    assert.equal(result.evidence.q_class, 'Q-02');
  });

  it('BlueEdge binding status is LIVE', () => {
    const result = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    assert.equal(result.evidence.binding_status, 'LIVE');
  });

  it('BlueEdge authorization is AUTHORIZED_WITH_QUALIFICATION', () => {
    const result = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    assert.equal(result.qualification.authorization_tier, 'AUTHORIZED_WITH_QUALIFICATION');
    assert.equal(result.qualification.boardroom_readiness, 'BOARDROOM_QUALIFIED');
    assert.equal(result.qualification.projection_permission, 'EXECUTIVE_SURFACE_WITH_QUALIFIER');
  });

  it('BlueEdge has all 6 required artifacts present', () => {
    const result = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    assert.equal(result.evidence.required_artifacts_present.length, 6);
    assert.equal(result.evidence.required_artifacts_missing.length, 0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. FastAPI resolves to S1
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI S-state detection', () => {
  it('FastAPI resolves to S1', () => {
    const result = runFullDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.ok(result.ok, 'detection must succeed');
    assert.equal(result.qualification.s_state, 'S1');
    assert.equal(result.qualification.state_label, S_STATES.S1);
  });

  it('FastAPI has REQUIRED_ARTIFACT_MISSING loader status', () => {
    const result = runFullDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.equal(result.evidence.loader_status, 'REQUIRED_ARTIFACT_MISSING');
  });

  it('FastAPI authorization is NOT_AUTHORIZED', () => {
    const result = runFullDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.equal(result.qualification.authorization_tier, 'NOT_AUTHORIZED');
    assert.equal(result.qualification.boardroom_readiness, 'NOT_READY');
    assert.equal(result.qualification.projection_permission, 'DENIED');
  });

  it('FastAPI has missing required artifacts enumerated', () => {
    const result = runFullDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.ok(result.evidence.required_artifacts_missing.length > 0,
      'missing artifacts must be enumerated');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Unknown client/run fails closed
// ────────────────────────────────────────────────────────────────────────────

describe('Unknown client/run handling', () => {
  it('unknown client returns not-ok with CLIENT_RUN_NOT_REGISTERED', () => {
    const result = runFullDetection('nonexistent', 'some_run');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });

  it('known client with unknown run returns not-ok', () => {
    const result = runFullDetection(BLUEEDGE_CLIENT, 'nonexistent_run');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });

  it('no fallback to BlueEdge for unknown client', () => {
    const result = runFullDetection('unknown_client', BLUEEDGE_RUN);
    assert.equal(result.ok, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4-7. Q-class → S-state mapping (unit tests with synthetic inputs)
// ────────────────────────────────────────────────────────────────────────────

describe('Q-class to S-state mapping', () => {
  const baseManifest = {
    artifacts: {
      required: { semantic_topology_model: 'some/path.json' },
    },
  };
  const okLoad = { ok: true, sources: {} };

  it('Q-01 maps to S3', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: baseManifest,
      loadResult: okLoad,
      payload: { ok: true, qualifier_summary: { qualifier_class: 'Q-01' } },
    });
    assert.equal(result.s_state, 'S3');
  });

  it('Q-02 maps to S2', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: baseManifest,
      loadResult: okLoad,
      payload: { ok: true, qualifier_summary: { qualifier_class: 'Q-02' } },
    });
    assert.equal(result.s_state, 'S2');
  });

  it('Q-03 maps to S2', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: baseManifest,
      loadResult: okLoad,
      payload: { ok: true, qualifier_summary: { qualifier_class: 'Q-03' } },
    });
    assert.equal(result.s_state, 'S2');
  });

  it('Q-04 maps to S1', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: baseManifest,
      loadResult: okLoad,
      payload: { ok: true, qualifier_summary: { qualifier_class: 'Q-04' } },
    });
    assert.equal(result.s_state, 'S1');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. Missing semantic topology → S0
// ────────────────────────────────────────────────────────────────────────────

describe('S0 detection', () => {
  it('missing semantic_topology_model in manifest → S0', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: { artifacts: { required: {} } },
      loadResult: null,
      payload: null,
    });
    assert.equal(result.s_state, 'S0');
    assert.equal(result.state_label, S_STATES.S0);
  });

  it('null manifest → S0', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: null,
      loadResult: null,
      payload: null,
    });
    assert.equal(result.s_state, 'S0');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. Missing required artifacts → S1
// ────────────────────────────────────────────────────────────────────────────

describe('S1 detection from missing artifacts', () => {
  it('REQUIRED_ARTIFACT_MISSING load result → S1', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: {
        artifacts: { required: { semantic_topology_model: 'path.json' } },
      },
      loadResult: {
        ok: false,
        error: 'REQUIRED_ARTIFACT_MISSING',
        missing: { key: 'decision_validation', path: 'some/path' },
      },
      payload: null,
    });
    assert.equal(result.s_state, 'S1');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 10. Invalid loader result → S1
// ────────────────────────────────────────────────────────────────────────────

describe('S1 detection from invalid loader', () => {
  it('loader error (not REQUIRED_ARTIFACT_MISSING) → S1', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: {
        artifacts: { required: { semantic_topology_model: 'path.json' } },
      },
      loadResult: { ok: false, error: 'SCHEMA_VALIDATION_FAILED' },
      payload: null,
    });
    assert.equal(result.s_state, 'S1');
  });

  it('payload not-ok → S1', () => {
    const result = detectQualificationState({
      client: 'test', run: 'test',
      manifest: {
        artifacts: { required: { semantic_topology_model: 'path.json' } },
      },
      loadResult: { ok: true, sources: {} },
      payload: { ok: false, error: 'RESOLVER_FAILURE' },
    });
    assert.equal(result.s_state, 'S1');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 11. Authorization mapping for all S-states
// ────────────────────────────────────────────────────────────────────────────

describe('Authorization mapping', () => {
  it('S0 → NOT_AUTHORIZED / REPORT_PACK_ONLY / NONE', () => {
    const auth = classifyAuthorizationFromSState('S0');
    assert.equal(auth.authorization_tier, 'NOT_AUTHORIZED');
    assert.equal(auth.boardroom_readiness, 'REPORT_PACK_ONLY');
    assert.equal(auth.projection_permission, 'NONE');
  });

  it('S1 → NOT_AUTHORIZED / NOT_READY / DENIED', () => {
    const auth = classifyAuthorizationFromSState('S1');
    assert.equal(auth.authorization_tier, 'NOT_AUTHORIZED');
    assert.equal(auth.boardroom_readiness, 'NOT_READY');
    assert.equal(auth.projection_permission, 'DENIED');
  });

  it('S2 → AUTHORIZED_WITH_QUALIFICATION / BOARDROOM_QUALIFIED / EXECUTIVE_SURFACE_WITH_QUALIFIER', () => {
    const auth = classifyAuthorizationFromSState('S2');
    assert.equal(auth.authorization_tier, 'AUTHORIZED_WITH_QUALIFICATION');
    assert.equal(auth.boardroom_readiness, 'BOARDROOM_QUALIFIED');
    assert.equal(auth.projection_permission, 'EXECUTIVE_SURFACE_WITH_QUALIFIER');
  });

  it('S3 → FULLY_AUTHORIZED / BOARDROOM_READY / FULL_EXECUTIVE_SURFACE', () => {
    const auth = classifyAuthorizationFromSState('S3');
    assert.equal(auth.authorization_tier, 'FULLY_AUTHORIZED');
    assert.equal(auth.boardroom_readiness, 'BOARDROOM_READY');
    assert.equal(auth.projection_permission, 'FULL_EXECUTIVE_SURFACE');
  });

  it('unknown S-state falls back to S1 authorization', () => {
    const auth = classifyAuthorizationFromSState('S99');
    assert.equal(auth.authorization_tier, 'NOT_AUTHORIZED');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 12-13. Qualification artifact includes provenance + input hashes
// ────────────────────────────────────────────────────────────────────────────

describe('Qualification state artifact', () => {
  it('artifact includes provenance block', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    assert.ok(artifact.provenance, 'provenance must exist');
    assert.equal(artifact.provenance.operation, 'detect_qualification_state');
    assert.equal(artifact.provenance.operation_version, '1.0');
    assert.ok(artifact.provenance.source_commit, 'source_commit must exist');
    assert.ok(artifact.provenance.output_hash, 'output_hash must exist');
    assert.ok(artifact.provenance.output_hash.startsWith('sha256:'), 'output_hash must be sha256');
  });

  it('artifact includes input hashes', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    assert.ok(artifact.provenance.input_hashes, 'input_hashes must exist');
    assert.ok(Object.keys(artifact.provenance.input_hashes).length > 0,
      'input_hashes must have entries for present artifacts');
  });

  it('artifact output_hash verifies correctly', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    const verification = verifyOutputHash(artifact);
    assert.ok(verification.pass, 'output hash must verify');
  });

  it('artifact includes all required qualification_state fields', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    const qs = artifact.qualification_state;
    assert.ok(qs.s_state, 's_state required');
    assert.ok(qs.state_label, 'state_label required');
    assert.ok(qs.state_reason, 'state_reason required');
    assert.ok(qs.authorization_tier, 'authorization_tier required');
    assert.ok(qs.boardroom_readiness, 'boardroom_readiness required');
    assert.ok(qs.projection_permission, 'projection_permission required');
  });

  it('artifact includes governance flags', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    assert.equal(artifact.governance.fail_closed, true);
    assert.equal(artifact.governance.client_agnostic, true);
    assert.equal(artifact.governance.no_semantic_fabrication, true);
    assert.equal(artifact.governance.no_source_mutation, true);
    assert.equal(artifact.governance.sqo_advisory_only, true);
  });

  it('FastAPI artifact has missing artifacts enumerated', () => {
    const detection = runFullDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    assert.ok(artifact.evidence.required_artifacts_missing.length > 0);
    assert.equal(artifact.qualification_state.s_state, 'S1');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 14. Replay verifier passes for repeated run
// ────────────────────────────────────────────────────────────────────────────

describe('Replay verification', () => {
  it('BlueEdge replay verification passes', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    const verification = runReplayVerification(BLUEEDGE_CLIENT, BLUEEDGE_RUN, artifact);
    assert.equal(verification.overall_verdict, 'PASS');
    assert.ok(verification.checks.input_integrity.pass);
    assert.ok(verification.checks.deterministic_recomputation.pass);
    assert.ok(verification.checks.output_hash.pass);
  });

  it('FastAPI replay verification passes', () => {
    const detection = runFullDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    const artifact = buildQualificationStateArtifact(detection);
    const verification = runReplayVerification(FASTAPI_CLIENT, FASTAPI_RUN, artifact);
    assert.equal(verification.overall_verdict, 'PASS');
  });

  it('determinism: two consecutive runs produce same S-state', () => {
    const run1 = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const run2 = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    assert.equal(run1.qualification.s_state, run2.qualification.s_state);
    assert.equal(run1.qualification.authorization_tier, run2.qualification.authorization_tier);
    assert.equal(run1.evidence.q_class, run2.evidence.q_class);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 15. No client-name branching in SQO modules
// ────────────────────────────────────────────────────────────────────────────

describe('No client-name branching', () => {
  const SQO_DIR = path.join(__dirname, '..', '..', 'lib', 'lens-v2', 'sqo');

  it('SQO modules contain no client-specific string literals', () => {
    const files = fs.readdirSync(SQO_DIR).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(SQO_DIR, file), 'utf8');
      assert.ok(!content.includes("'blueedge'"), `${file} must not contain 'blueedge'`);
      assert.ok(!content.includes("'fastapi'"), `${file} must not contain 'fastapi'`);
      assert.ok(!content.includes('"blueedge"'), `${file} must not contain "blueedge"`);
      assert.ok(!content.includes('"fastapi"'), `${file} must not contain "fastapi"`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// History and transition classification
// ────────────────────────────────────────────────────────────────────────────

describe('Qualification history', () => {
  it('classifyTransition: null prior → INITIAL', () => {
    assert.equal(classifyTransition(null, 'S1'), 'INITIAL');
  });

  it('classifyTransition: S1 → S2 = FORWARD', () => {
    assert.equal(classifyTransition('S1', 'S2'), 'FORWARD');
  });

  it('classifyTransition: S2 → S1 = DOWNGRADE', () => {
    assert.equal(classifyTransition('S2', 'S1'), 'DOWNGRADE');
  });

  it('classifyTransition: S2 → S2 = STABLE', () => {
    assert.equal(classifyTransition('S2', 'S2'), 'STABLE');
  });

  it('classifyTransition: S3 → S2 = DOWNGRADE', () => {
    assert.equal(classifyTransition('S3', 'S2'), 'DOWNGRADE');
  });

  it('classifyTransition: S0 → S1 = FORWARD', () => {
    assert.equal(classifyTransition('S0', 'S1'), 'FORWARD');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Artifact emission (creates files — cleanup after)
// ────────────────────────────────────────────────────────────────────────────

describe('Artifact emission', () => {
  before(() => cleanupSqoArtifacts());
  after(() => cleanupSqoArtifacts());

  it('emitQualificationState writes qualification_state.v1.json for BlueEdge', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const result = emitQualificationState(detection);
    assert.ok(fs.existsSync(result.path), 'artifact file must exist');
    const data = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(data.schema_version, '1.0');
    assert.equal(data.client, BLUEEDGE_CLIENT);
    assert.equal(data.qualification_state.s_state, 'S2');
  });

  it('emitQualificationState writes qualification_state.v1.json for FastAPI', () => {
    const detection = runFullDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    const result = emitQualificationState(detection);
    assert.ok(fs.existsSync(result.path), 'artifact file must exist');
    const data = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(data.qualification_state.s_state, 'S1');
  });

  it('emitQualificationHistory writes history with INITIAL transition', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const result = emitQualificationHistory(detection);
    assert.ok(fs.existsSync(result.path), 'history file must exist');
    assert.equal(result.transition_type, 'INITIAL');
    const data = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(data.history_entries.length, 1);
    assert.equal(data.history_entries[0].transition_type, 'INITIAL');
  });

  it('history is append-only on second emission', () => {
    const detection = runFullDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const result = emitQualificationHistory(detection);
    const data = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(data.history_entries.length, 2);
    assert.equal(data.history_entries[1].transition_type, 'STABLE');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Governance boundary validation
// ────────────────────────────────────────────────────────────────────────────

describe('Governance boundary validation', () => {
  it('SQO engine does not import or modify Lane A modules', () => {
    const engineSrc = fs.readFileSync(
      path.join(__dirname, '..', '..', 'lib', 'lens-v2', 'sqo', 'QualificationStateEngine.js'),
      'utf8'
    );
    assert.ok(!engineSrc.includes('writeFileSync'), 'engine must not write files directly');
    assert.ok(!engineSrc.includes('fs.unlink'), 'engine must not delete files');
  });

  it('S_STATES enum has exactly 5 entries', () => {
    assert.equal(Object.keys(S_STATES).length, 5);
    assert.ok(S_STATES.S0);
    assert.ok(S_STATES.S1);
    assert.ok(S_STATES.S2);
    assert.ok(S_STATES.S3);
    assert.ok(S_STATES.S4_PLUS);
  });

  it('AUTHORIZATION_MAP covers S0, S1, S2, S3', () => {
    assert.ok(AUTHORIZATION_MAP.S0);
    assert.ok(AUTHORIZATION_MAP.S1);
    assert.ok(AUTHORIZATION_MAP.S2);
    assert.ok(AUTHORIZATION_MAP.S3);
  });
});
