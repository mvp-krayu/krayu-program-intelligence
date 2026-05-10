'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
  DEBT_CATEGORIES,
  runFullDebtDetection,
  buildDebtInventoryArtifact,
  emitDebtInventory,
  detectGroundingGapDebt,
  detectLabelDebt,
  detectContinuityGapDebt,
  detectValidationDebt,
  detectReproducibilityDebt,
  detectRenderingMetadataDebt,
  detectMissingArtifactDebt,
  computeDebtSummary,
} = require('../../lib/lens-v2/sqo/SemanticDebtEngine');

const {
  SEVERITY_WEIGHTS,
  computePriorityScore,
  prioritizeDebtItems,
  classifyImpact,
  classifyDependency,
} = require('../../lib/lens-v2/sqo/DebtPriorityEngine');

const {
  REMEDIATION_PATHWAYS,
  CATEGORY_PATHWAY_MAP,
  resolveRemediationPath,
  enrichDebtItemWithRemediation,
} = require('../../lib/lens-v2/sqo/RemediationPathResolver');

const {
  computeCoverageMetrics,
  identifyContinuityGaps,
  buildContinuityAssessment,
  emitContinuityAssessment,
  loadArtifactsForInspection,
} = require('../../lib/lens-v2/sqo/ContinuityAssessmentEngine');

const {
  verifyDebtOutputHash,
  runDebtReplayVerification,
} = require('../../lib/lens-v2/sqo/DebtReplayVerifier');

const { loadManifest } = require('../../lib/lens-v2/manifests');

const BLUEEDGE_CLIENT = 'blueedge';
const BLUEEDGE_RUN = 'run_blueedge_productized_01_fixed';
const FASTAPI_CLIENT = 'fastapi';
const FASTAPI_RUN = 'run_02_oss_fastapi_pipeline';

const SQO_ARTIFACT_DIR = path.join(process.env.REPO_ROOT, 'artifacts', 'sqo');

function cleanupDebtArtifacts() {
  const debtFiles = [
    'semantic_debt_inventory.v1.json',
    'continuity_assessment.v1.json',
    'debt_replay_verification.v1.json',
    'debt_certification.v1.json',
  ];
  for (const clientRun of [
    [BLUEEDGE_CLIENT, BLUEEDGE_RUN],
    [FASTAPI_CLIENT, FASTAPI_RUN],
  ]) {
    const dir = path.join(SQO_ARTIFACT_DIR, clientRun[0], clientRun[1]);
    for (const f of debtFiles) {
      const p = path.join(dir, f);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 1. BlueEdge debt detection
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge semantic debt detection', () => {
  let result;
  before(() => {
    result = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
  });

  it('detection succeeds with S2', () => {
    assert.ok(result.ok);
    assert.equal(result.s_state, 'S2');
  });

  it('Missing Artifact count = 0', () => {
    const items = result.debt_items.filter(d => d.category === 'missing_artifact');
    assert.equal(items.length, 0);
  });

  it('Grounding Gap count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'grounding_gap');
    assert.ok(items.length > 0, 'must have grounding gap debt');
    assert.equal(items.length, 13);
  });

  it('Continuity Gap count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'continuity_gap');
    assert.ok(items.length > 0, 'must have continuity gap debt');
  });

  it('Label count = 0', () => {
    const items = result.debt_items.filter(d => d.category === 'label');
    assert.equal(items.length, 0);
  });

  it('Validation count = 0', () => {
    const items = result.debt_items.filter(d => d.category === 'validation');
    assert.equal(items.length, 0);
  });

  it('Reproducibility count = 0', () => {
    const items = result.debt_items.filter(d => d.category === 'reproducibility');
    assert.equal(items.length, 0);
  });

  it('Rendering Metadata count = 0', () => {
    const items = result.debt_items.filter(d => d.category === 'rendering_metadata');
    assert.equal(items.length, 0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. FastAPI debt detection
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI semantic debt detection', () => {
  let result;
  before(() => {
    result = runFullDebtDetection(FASTAPI_CLIENT, FASTAPI_RUN);
  });

  it('detection succeeds with S1', () => {
    assert.ok(result.ok);
    assert.equal(result.s_state, 'S1');
  });

  it('Missing Artifact count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'missing_artifact');
    assert.ok(items.length > 0);
    assert.equal(items.length, 3);
  });

  it('Grounding Gap count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'grounding_gap');
    assert.ok(items.length > 0);
    assert.equal(items.length, 9);
  });

  it('Continuity Gap present (crosswalk absent)', () => {
    const items = result.debt_items.filter(d => d.category === 'continuity_gap');
    assert.ok(items.length > 0);
    assert.ok(items[0].has_upstream_dependency, 'crosswalk-absent gap has upstream dependency');
  });

  it('Label count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'label');
    assert.ok(items.length > 0);
    assert.equal(items.length, 9);
  });

  it('Validation count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'validation');
    assert.ok(items.length > 0);
  });

  it('Reproducibility count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'reproducibility');
    assert.ok(items.length > 0);
  });

  it('Rendering Metadata count > 0', () => {
    const items = result.debt_items.filter(d => d.category === 'rendering_metadata');
    assert.ok(items.length > 0);
    assert.ok(items[0].has_upstream_dependency, 'RM debt has upstream dependency');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Priority engine
// ────────────────────────────────────────────────────────────────────────────

describe('Debt priority engine', () => {
  it('CRITICAL scores higher than HIGH', () => {
    const critical = computePriorityScore({ severity: 'CRITICAL', blocks_s_state: 'S2', has_upstream_dependency: false });
    const high = computePriorityScore({ severity: 'HIGH', blocks_s_state: 'S3', has_upstream_dependency: false });
    assert.ok(critical > high);
  });

  it('HIGH scores higher than MEDIUM-HIGH', () => {
    const high = computePriorityScore({ severity: 'HIGH', blocks_s_state: 'none', has_upstream_dependency: false });
    const medHigh = computePriorityScore({ severity: 'MEDIUM-HIGH', blocks_s_state: 'none', has_upstream_dependency: false });
    assert.ok(high > medHigh);
  });

  it('blocking S-state gets 2x multiplier', () => {
    const blocking = computePriorityScore({ severity: 'HIGH', blocks_s_state: 'S3', has_upstream_dependency: false });
    const nonBlocking = computePriorityScore({ severity: 'HIGH', blocks_s_state: 'none', has_upstream_dependency: false });
    assert.equal(blocking, nonBlocking * 2);
  });

  it('upstream dependency halves the score', () => {
    const noDep = computePriorityScore({ severity: 'MEDIUM', blocks_s_state: 'none', has_upstream_dependency: false });
    const hasDep = computePriorityScore({ severity: 'MEDIUM', blocks_s_state: 'none', has_upstream_dependency: true });
    assert.equal(hasDep, noDep * 0.5);
  });

  it('prioritizeDebtItems sorts descending and assigns rank', () => {
    const items = [
      { severity: 'MEDIUM', blocks_s_state: 'none', has_upstream_dependency: false },
      { severity: 'CRITICAL', blocks_s_state: 'S2', has_upstream_dependency: false },
      { severity: 'HIGH', blocks_s_state: 'S3', has_upstream_dependency: false },
    ];
    const sorted = prioritizeDebtItems(items);
    assert.equal(sorted[0].severity, 'CRITICAL');
    assert.equal(sorted[1].severity, 'HIGH');
    assert.equal(sorted[2].severity, 'MEDIUM');
    assert.equal(sorted[0].priority, 1);
    assert.equal(sorted[2].priority, 3);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Continuity assessment engine
// ────────────────────────────────────────────────────────────────────────────

describe('Continuity assessment engine', () => {
  it('BlueEdge has PARTIAL continuity with measurable metrics', () => {
    const manifest = loadManifest(BLUEEDGE_CLIENT, BLUEEDGE_RUN).manifest;
    const loaded = loadArtifactsForInspection(manifest);
    const metrics = computeCoverageMetrics(loaded);
    assert.equal(metrics.overall_status, 'PARTIAL');
    assert.ok(metrics.coverage_ratio > 0 && metrics.coverage_ratio < 1);
    assert.ok(metrics.label_fidelity_ratio > 0 && metrics.label_fidelity_ratio < 1);
    assert.ok(metrics.lineage_strength > 0 && metrics.lineage_strength < 1);
    assert.equal(metrics.crosswalk_present, true);
  });

  it('FastAPI has NO_ASSESSMENT (crosswalk absent)', () => {
    const manifest = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN).manifest;
    const loaded = loadArtifactsForInspection(manifest);
    const metrics = computeCoverageMetrics(loaded);
    assert.equal(metrics.overall_status, 'NO_ASSESSMENT');
    assert.equal(metrics.crosswalk_present, false);
    assert.equal(metrics.coverage_ratio, 0);
  });

  it('BlueEdge continuity gaps include entity_coverage and label_fidelity', () => {
    const manifest = loadManifest(BLUEEDGE_CLIENT, BLUEEDGE_RUN).manifest;
    const loaded = loadArtifactsForInspection(manifest);
    const gaps = identifyContinuityGaps(loaded);
    const types = gaps.map(g => g.gap_type);
    assert.ok(types.includes('entity_coverage'));
    assert.ok(types.includes('label_fidelity'));
  });

  it('FastAPI continuity gaps indicate crosswalk_absent', () => {
    const manifest = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN).manifest;
    const loaded = loadArtifactsForInspection(manifest);
    const gaps = identifyContinuityGaps(loaded);
    assert.equal(gaps.length, 1);
    assert.equal(gaps[0].gap_type, 'crosswalk_absent');
    assert.equal(gaps[0].severity, 'CRITICAL');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Remediation path resolver
// ────────────────────────────────────────────────────────────────────────────

describe('Remediation path resolver', () => {
  it('missing_artifact maps to R2 (Semantic Pipeline Re-Run)', () => {
    assert.equal(CATEGORY_PATHWAY_MAP.missing_artifact, 'R2');
  });

  it('grounding_gap maps to R4 (Structural Grounding Extension)', () => {
    assert.equal(CATEGORY_PATHWAY_MAP.grounding_gap, 'R4');
  });

  it('label maps to R1 (Source Material Enrichment)', () => {
    assert.equal(CATEGORY_PATHWAY_MAP.label, 'R1');
  });

  it('rendering_metadata maps to R3', () => {
    assert.equal(CATEGORY_PATHWAY_MAP.rendering_metadata, 'R3');
  });

  it('enrichDebtItemWithRemediation adds remediation field', () => {
    const item = { category: 'missing_artifact', severity: 'CRITICAL', blocks_s_state: 'S2' };
    const enriched = enrichDebtItemWithRemediation(item);
    assert.ok(enriched.remediation);
    assert.equal(enriched.remediation.enrichment_pathway, 'R2');
    assert.equal(enriched.remediation.expected_impact.s_state_progression, 'S1_TO_S2');
  });

  it('all 4 remediation pathways are defined', () => {
    assert.ok(REMEDIATION_PATHWAYS.R1);
    assert.ok(REMEDIATION_PATHWAYS.R2);
    assert.ok(REMEDIATION_PATHWAYS.R3);
    assert.ok(REMEDIATION_PATHWAYS.R4);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Debt replay verification
// ────────────────────────────────────────────────────────────────────────────

describe('Debt replay verification', () => {
  it('BlueEdge debt artifact output hash verifies', () => {
    const debt = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildDebtInventoryArtifact(debt);
    const check = verifyDebtOutputHash(artifact);
    assert.ok(check.pass);
  });

  it('FastAPI debt artifact output hash verifies', () => {
    const debt = runFullDebtDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    const artifact = buildDebtInventoryArtifact(debt);
    const check = verifyDebtOutputHash(artifact);
    assert.ok(check.pass);
  });

  it('determinism: two runs produce same debt inventory', () => {
    const run1 = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const run2 = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    assert.equal(run1.total_debt_items, run2.total_debt_items);
    assert.equal(run1.s_state, run2.s_state);
    assert.deepEqual(run1.summary, run2.summary);
    for (let i = 0; i < run1.debt_items.length; i++) {
      assert.equal(run1.debt_items[i].id, run2.debt_items[i].id);
      assert.equal(run1.debt_items[i].priority_score, run2.debt_items[i].priority_score);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. Unknown client/run fails closed
// ────────────────────────────────────────────────────────────────────────────

describe('Unknown client/run handling', () => {
  it('unknown client fails closed', () => {
    const result = runFullDebtDetection('nonexistent', 'some_run');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });

  it('known client unknown run fails closed', () => {
    const result = runFullDebtDetection(BLUEEDGE_CLIENT, 'nonexistent_run');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. No client-name branching in debt modules
// ────────────────────────────────────────────────────────────────────────────

describe('No client-name branching in debt modules', () => {
  const SQO_DIR = path.join(__dirname, '..', '..', 'lib', 'lens-v2', 'sqo');

  it('debt modules contain no client-specific string literals', () => {
    const debtFiles = [
      'SemanticDebtEngine.js',
      'DebtPriorityEngine.js',
      'ContinuityAssessmentEngine.js',
      'RemediationPathResolver.js',
      'DebtReplayVerifier.js',
    ];
    for (const file of debtFiles) {
      const content = fs.readFileSync(path.join(SQO_DIR, file), 'utf8');
      assert.ok(!content.includes("'blueedge'"), `${file} must not contain 'blueedge'`);
      assert.ok(!content.includes("'fastapi'"), `${file} must not contain 'fastapi'`);
      assert.ok(!content.includes('"blueedge"'), `${file} must not contain "blueedge"`);
      assert.ok(!content.includes('"fastapi"'), `${file} must not contain "fastapi"`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. Debt inventory artifact structure
// ────────────────────────────────────────────────────────────────────────────

describe('Debt inventory artifact structure', () => {
  it('artifact includes provenance with output hash', () => {
    const debt = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildDebtInventoryArtifact(debt);
    assert.ok(artifact.provenance);
    assert.ok(artifact.provenance.output_hash);
    assert.ok(artifact.provenance.output_hash.startsWith('sha256:'));
    assert.ok(artifact.provenance.source_commit);
    assert.equal(artifact.provenance.operation, 'detect_semantic_debt');
  });

  it('artifact includes governance flags', () => {
    const debt = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const artifact = buildDebtInventoryArtifact(debt);
    assert.equal(artifact.governance.fail_closed, true);
    assert.equal(artifact.governance.client_agnostic, true);
    assert.equal(artifact.governance.no_semantic_fabrication, true);
    assert.equal(artifact.governance.no_source_mutation, true);
  });

  it('all debt items have remediation paths', () => {
    const debt = runFullDebtDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    for (const item of debt.debt_items) {
      assert.ok(item.remediation, `${item.id} must have remediation`);
      assert.ok(item.remediation.enrichment_pathway, `${item.id} must have pathway`);
    }
  });

  it('debt summary counts match item counts', () => {
    const debt = runFullDebtDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    const manualSummary = computeDebtSummary(debt.debt_items);
    assert.deepEqual(debt.summary, manualSummary);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 10. Artifact emission (writes files — cleanup after)
// ────────────────────────────────────────────────────────────────────────────

describe('Debt artifact emission', () => {
  before(() => cleanupDebtArtifacts());
  after(() => cleanupDebtArtifacts());

  it('emitDebtInventory writes semantic_debt_inventory.v1.json for BlueEdge', () => {
    const debt = runFullDebtDetection(BLUEEDGE_CLIENT, BLUEEDGE_RUN);
    const result = emitDebtInventory(debt);
    assert.ok(fs.existsSync(result.path));
    const data = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(data.schema_version, '1.0');
    assert.equal(data.client, BLUEEDGE_CLIENT);
    assert.equal(data.s_state, 'S2');
    assert.ok(data.total_debt_items > 0);
  });

  it('emitContinuityAssessment writes continuity_assessment.v1.json for BlueEdge', () => {
    const manifest = loadManifest(BLUEEDGE_CLIENT, BLUEEDGE_RUN).manifest;
    const loaded = loadArtifactsForInspection(manifest);
    const result = emitContinuityAssessment(BLUEEDGE_CLIENT, BLUEEDGE_RUN, loaded);
    assert.ok(fs.existsSync(result.path));
    const data = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(data.overall_status, 'PARTIAL');
    assert.ok(data.coverage_ratio > 0);
  });

  it('emitDebtInventory writes for FastAPI', () => {
    const debt = runFullDebtDetection(FASTAPI_CLIENT, FASTAPI_RUN);
    const result = emitDebtInventory(debt);
    assert.ok(fs.existsSync(result.path));
    const data = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(data.s_state, 'S1');
    assert.ok(data.total_debt_items > 0);
  });
});
