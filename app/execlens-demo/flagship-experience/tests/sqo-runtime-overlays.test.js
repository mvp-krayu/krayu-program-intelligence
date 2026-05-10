'use strict';

/**
 * sqo-runtime-overlays.test.js
 * PI.SQO.RUNTIME-OVERLAY-BOUNDARY-CORRECTION.01
 *
 * Boundary enforcement tests. Asserts that LENS does NOT directly
 * consume SQO artifacts or render SQO overlay components.
 *
 * SQO backend engines remain intact and tested by their own suites.
 * Direct SQO→LENS rendering was reclassified as non-canonical
 * experimental prototype per boundary correction contract.
 */

const path = require('node:path');
const fs = require('node:fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
  resolveFlagshipBinding,
  DEFAULT_BINDING_CLIENT,
  DEFAULT_BINDING_RUN,
} = require('../../lib/lens-v2/flagshipBinding');
const { resolveBlueEdgePayload } = require('../../lib/lens-v2/BlueEdgePayloadResolver');

const BE_CLIENT = 'blueedge';
const BE_RUN = 'run_blueedge_productized_01_fixed';

// ────────────────────────────────────────────────────────────────────────────
// 1. LENS does not directly render SQO panels
// ────────────────────────────────────────────────────────────────────────────

describe('LENS does not directly render SQO panels', () => {
  const pageSource = fs.readFileSync(
    path.join(__dirname, '..', '..', 'pages', 'lens-v2-flagship.js'),
    'utf-8',
  );

  it('no SQO maturity panel component in page', () => {
    assert.ok(!pageSource.includes('SQOMaturityPanel'), 'SQOMaturityPanel found in LENS page');
  });

  it('no SQO debt panel component in page', () => {
    assert.ok(!pageSource.includes('SQODebtProgressionPanel'), 'SQODebtProgressionPanel found in LENS page');
  });

  it('no SQO gravity panel component in page', () => {
    assert.ok(!pageSource.includes('SQOGravityStabilityPanel'), 'SQOGravityStabilityPanel found in LENS page');
  });

  it('no SQO progression panel component in page', () => {
    assert.ok(!pageSource.includes('SQODebtProgressionPanel'), 'SQODebtProgressionPanel found in LENS page');
  });

  it('no SQO qualification banner component in page', () => {
    assert.ok(!pageSource.includes('SQOQualificationBanner'), 'SQOQualificationBanner found in LENS page');
  });

  it('no SQO governance strip component in page', () => {
    assert.ok(!pageSource.includes('SQOGovernanceStrip'), 'SQOGovernanceStrip found in LENS page');
  });

  it('no SQO runtime warnings component in page', () => {
    assert.ok(!pageSource.includes('SQORuntimeWarnings'), 'SQORuntimeWarnings found in LENS page');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. LENS page does not import SQO overlay modules
// ────────────────────────────────────────────────────────────────────────────

describe('LENS page does not import SQO overlay modules', () => {
  const pageSource = fs.readFileSync(
    path.join(__dirname, '..', '..', 'pages', 'lens-v2-flagship.js'),
    'utf-8',
  );

  it('no SQOOverlayStateResolver import', () => {
    assert.ok(!pageSource.includes('SQOOverlayStateResolver'), 'SQOOverlayStateResolver import in LENS page');
  });

  it('no SQORuntimeOverlayLoader import', () => {
    assert.ok(!pageSource.includes('SQORuntimeOverlayLoader'), 'SQORuntimeOverlayLoader import in LENS page');
  });

  it('no SQOOverlayFormatter import', () => {
    assert.ok(!pageSource.includes('SQOOverlayFormatter'), 'SQOOverlayFormatter import in LENS page');
  });

  it('no SQOOverlayDegradationHandler import', () => {
    assert.ok(!pageSource.includes('SQOOverlayDegradationHandler'), 'SQOOverlayDegradationHandler import in LENS page');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. flagshipBinding does not carry SQO overlays
// ────────────────────────────────────────────────────────────────────────────

describe('flagshipBinding does not carry sqoOverlays', () => {
  const bindingSource = fs.readFileSync(
    path.join(__dirname, '..', '..', 'lib', 'lens-v2', 'flagshipBinding.js'),
    'utf-8',
  );

  it('no sqoOverlays in binding module', () => {
    assert.ok(!bindingSource.includes('sqoOverlays'), 'sqoOverlays found in flagshipBinding');
  });

  it('no SQOOverlayStateResolver import in binding', () => {
    assert.ok(!bindingSource.includes('SQOOverlayStateResolver'), 'SQOOverlayStateResolver found in binding');
  });

  it('default route props do not contain sqoOverlays', () => {
    const result = resolveFlagshipBinding({ query: {} });
    assert.equal(result.statusCode, 200);
    assert.ok(!('sqoOverlays' in result.props), 'sqoOverlays key found in binding props');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. PATH B projection behavior preserved
// ────────────────────────────────────────────────────────────────────────────

describe('PATH B projection behavior preserved', () => {
  it('default route returns valid projection payload', () => {
    const result = resolveFlagshipBinding({ query: {} });
    assert.equal(result.statusCode, 200);
    assert.ok(result.props.livePayload);
    assert.ok(result.props.livePayload.ok);
    assert.ok(result.props.livePayload.evidence_blocks);
  });

  it('evidence_blocks match direct resolver output', () => {
    const directPayload = resolveBlueEdgePayload(BE_CLIENT, BE_RUN);
    const bindingResult = resolveFlagshipBinding({ query: {} });
    assert.deepEqual(
      bindingResult.props.livePayload.evidence_blocks,
      directPayload.evidence_blocks,
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Q-class behavior preserved
// ────────────────────────────────────────────────────────────────────────────

describe('Q-class behavior preserved', () => {
  it('qualifier_class unchanged', () => {
    const directPayload = resolveBlueEdgePayload(BE_CLIENT, BE_RUN);
    const bindingResult = resolveFlagshipBinding({ query: {} });
    assert.equal(
      bindingResult.props.livePayload.qualifier_class,
      directPayload.qualifier_class,
    );
    assert.equal(
      bindingResult.props.livePayload.qualifier_summary.qualifier_class,
      directPayload.qualifier_summary.qualifier_class,
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. SQO backend engines remain available
// ────────────────────────────────────────────────────────────────────────────

describe('SQO backend engines remain available', () => {
  it('QualificationStateEngine loads', () => {
    const mod = require('../../lib/lens-v2/sqo/QualificationStateEngine');
    assert.ok(mod.runFullDetection);
  });

  it('SemanticDebtEngine loads', () => {
    const mod = require('../../lib/lens-v2/sqo/SemanticDebtEngine');
    assert.ok(mod.runFullDebtDetection);
  });

  it('MaturityScoringEngine loads', () => {
    const mod = require('../../lib/lens-v2/sqo/MaturityScoringEngine');
    assert.ok(mod.runMaturityScoring);
  });

  it('SQO overlay modules still exist (retained as prototype)', () => {
    const sqoDir = path.join(__dirname, '..', '..', 'lib', 'lens-v2', 'sqo');
    assert.ok(fs.existsSync(path.join(sqoDir, 'SQORuntimeOverlayLoader.js')));
    assert.ok(fs.existsSync(path.join(sqoDir, 'SQOOverlayStateResolver.js')));
    assert.ok(fs.existsSync(path.join(sqoDir, 'SQOOverlayFormatter.js')));
    assert.ok(fs.existsSync(path.join(sqoDir, 'SQOOverlayDegradationHandler.js')));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. SQO artifacts remain available
// ────────────────────────────────────────────────────────────────────────────

describe('SQO artifacts remain available', () => {
  const artifactDir = path.join(process.env.REPO_ROOT, 'artifacts', 'sqo');

  it('BlueEdge SQO artifacts exist', () => {
    const beDir = path.join(artifactDir, 'blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(fs.existsSync(path.join(beDir, 'qualification_state.v1.json')));
    assert.ok(fs.existsSync(path.join(beDir, 'semantic_maturity_profile.v1.json')));
    assert.ok(fs.existsSync(path.join(beDir, 'semantic_gravity_assessment.v1.json')));
  });

  it('FastAPI SQO artifacts exist', () => {
    const faDir = path.join(artifactDir, 'fastapi', 'run_02_oss_fastapi_pipeline');
    assert.ok(fs.existsSync(path.join(faDir, 'qualification_state.v1.json')));
    assert.ok(fs.existsSync(path.join(faDir, 'semantic_maturity_profile.v1.json')));
  });
});
