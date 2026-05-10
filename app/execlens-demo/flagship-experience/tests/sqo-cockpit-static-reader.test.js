'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { SQO_COCKPIT_ARTIFACT_KEYS, loadAllCockpitArtifacts, loadSectionArtifacts, isArtifactAvailable, getArtifactData, areCriticalArtifactsPresent } = require('../../lib/sqo-cockpit/SQOCockpitArtifactLoader');
const { assessDegradation, checkReplayStatus, DEGRADATION_STATES, buildDegradedNotice } = require('../../lib/sqo-cockpit/SQOCockpitDegradationHandler');
const { resolveCockpitState, COCKPIT_STATES } = require('../../lib/sqo-cockpit/SQOCockpitStateResolver');
const { validateRouteParams, buildNavigationItems, COCKPIT_SECTIONS, buildSectionPath } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');
const { formatOverview, formatDebtSection, formatContinuitySection, formatMaturitySection, formatProgressionSection, formatEvidenceReplaySection, formatHandoffSection, formatHistorySection } = require('../../lib/sqo-cockpit/SQOCockpitFormatter');

const BE_CLIENT = 'blueedge';
const BE_RUN = 'run_blueedge_productized_01_fixed';
const FA_CLIENT = 'fastapi';
const FA_RUN = 'run_02_oss_fastapi_pipeline';

// ────────────────────────────────────────────────────────────────────────────
// 1. Artifact Loader
// ────────────────────────────────────────────────────────────────────────────

describe('SQOCockpitArtifactLoader', () => {
  it('defines all 15 SQO artifact keys', () => {
    assert.equal(SQO_COCKPIT_ARTIFACT_KEYS.length, 15);
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('qualification_state'));
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('continuity_assessment'));
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('qualification_history'));
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('qualification_state_certification'));
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('qualification_state_replay_verification'));
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('debt_certification'));
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('debt_replay_verification'));
    assert.ok(SQO_COCKPIT_ARTIFACT_KEYS.includes('maturity_replay_verification'));
  });

  it('loads all BlueEdge artifacts (15/15)', () => {
    const result = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
    assert.equal(result.ok, true);
    assert.equal(result.loaded_count, 15);
    assert.equal(result.total_count, 15);
  });

  it('loads all FastAPI artifacts (15/15)', () => {
    const result = loadAllCockpitArtifacts(FA_CLIENT, FA_RUN);
    assert.equal(result.ok, true);
    assert.equal(result.loaded_count, 15);
    assert.equal(result.total_count, 15);
  });

  it('rejects unregistered client/run', () => {
    const result = loadAllCockpitArtifacts('unknown', 'unknown_run');
    assert.equal(result.ok, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });

  it('loads section-specific artifacts', () => {
    const result = loadSectionArtifacts(BE_CLIENT, BE_RUN, 'overview');
    assert.equal(result.ok, true);
    assert.equal(result.section, 'overview');
    assert.ok(result.loaded_count > 0);
  });

  it('reports critical artifacts present for BlueEdge', () => {
    const result = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
    assert.equal(areCriticalArtifactsPresent(result), true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. State Resolver
// ────────────────────────────────────────────────────────────────────────────

describe('SQOCockpitStateResolver', () => {
  it('returns NO_CLIENT_SELECTED when no params', () => {
    const state = resolveCockpitState(null, null);
    assert.equal(state.cockpit_state, COCKPIT_STATES.NO_CLIENT_SELECTED);
    assert.equal(state.artifacts, null);
  });

  it('resolves BlueEdge to S2_QUALIFIED_WITH_DEBT', () => {
    const state = resolveCockpitState(BE_CLIENT, BE_RUN);
    assert.equal(state.cockpit_state, COCKPIT_STATES.S2_QUALIFIED_WITH_DEBT);
    assert.equal(state.visual_posture, 'active');
    assert.equal(state.client, 'blueedge');
  });

  it('resolves FastAPI to S1_ONBOARDING_REQUIRED', () => {
    const state = resolveCockpitState(FA_CLIENT, FA_RUN);
    assert.equal(state.cockpit_state, COCKPIT_STATES.S1_ONBOARDING_REQUIRED);
    assert.equal(state.visual_posture, 'active');
  });

  it('includes handoff status with blocking conditions', () => {
    const state = resolveCockpitState(BE_CLIENT, BE_RUN);
    assert.ok(state.handoff_status);
    assert.equal(state.handoff_status.ready, false);
    assert.ok(state.handoff_status.blocking_conditions.length > 0);
  });

  it('includes replay status', () => {
    const state = resolveCockpitState(BE_CLIENT, BE_RUN);
    assert.ok(state.replay_status);
    assert.equal(state.replay_status.all_passed, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Degradation Handler
// ────────────────────────────────────────────────────────────────────────────

describe('SQOCockpitDegradationHandler', () => {
  it('returns FULLY_OPERATIONAL for complete BlueEdge', () => {
    const result = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
    const degradation = assessDegradation(result);
    assert.equal(degradation.state, DEGRADATION_STATES.FULLY_OPERATIONAL);
  });

  it('returns CLIENT_NOT_REGISTERED for unknown client', () => {
    const result = loadAllCockpitArtifacts('unknown', 'unknown_run');
    const degradation = assessDegradation(result);
    assert.equal(degradation.state, DEGRADATION_STATES.CLIENT_NOT_REGISTERED);
  });

  it('returns LOAD_FAILURE for null input', () => {
    const degradation = assessDegradation(null);
    assert.equal(degradation.state, DEGRADATION_STATES.LOAD_FAILURE);
  });

  it('builds degraded notice for non-operational states', () => {
    const degradation = assessDegradation(null);
    const notice = buildDegradedNotice(degradation);
    assert.ok(notice);
    assert.equal(notice.severity, 'CRITICAL');
  });

  it('returns null notice for fully operational', () => {
    const result = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
    const degradation = assessDegradation(result);
    const notice = buildDegradedNotice(degradation);
    assert.equal(notice, null);
  });

  it('checks replay status correctly', () => {
    const result = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
    const replayStatus = checkReplayStatus(result);
    assert.equal(replayStatus.all_passed, true);
    assert.equal(replayStatus.any_failed, false);
    assert.equal(replayStatus.results.length, 3);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Route Resolver
// ────────────────────────────────────────────────────────────────────────────

describe('SQOCockpitRouteResolver', () => {
  it('validates registered client/run', () => {
    const result = validateRouteParams(BE_CLIENT, BE_RUN);
    assert.equal(result.valid, true);
  });

  it('rejects unregistered client', () => {
    const result = validateRouteParams('unknown', 'some_run');
    assert.equal(result.valid, false);
    assert.equal(result.error, 'CLIENT_RUN_NOT_REGISTERED');
  });

  it('rejects missing client param', () => {
    const result = validateRouteParams(null, 'run');
    assert.equal(result.valid, false);
    assert.equal(result.error, 'MISSING_CLIENT');
  });

  it('builds correct section paths', () => {
    const basePath = buildSectionPath(BE_CLIENT, BE_RUN, 'overview');
    assert.equal(basePath, `/sqo/client/${BE_CLIENT}/run/${BE_RUN}`);
    const debtPath = buildSectionPath(BE_CLIENT, BE_RUN, 'debt');
    assert.equal(debtPath, `/sqo/client/${BE_CLIENT}/run/${BE_RUN}/debt`);
  });

  it('builds navigation items with active section', () => {
    const nav = buildNavigationItems(BE_CLIENT, BE_RUN, 'debt');
    assert.equal(nav.length, COCKPIT_SECTIONS.length);
    const activeItem = nav.find(n => n.active);
    assert.equal(activeItem.section, 'debt');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Formatter
// ────────────────────────────────────────────────────────────────────────────

describe('SQOCockpitFormatter', () => {
  let blueResult;
  let fastResult;

  before(() => {
    blueResult = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
    fastResult = loadAllCockpitArtifacts(FA_CLIENT, FA_RUN);
  });

  it('formats BlueEdge overview with S2 state', () => {
    const overview = formatOverview(blueResult);
    assert.equal(overview.s_state.state, 'S2');
    assert.equal(overview.maturity.score, 0.625);
    assert.equal(overview.maturity.classification, 'STABLE');
    assert.equal(overview.gravity.score, 0.45);
    assert.equal(overview.gravity.classification, 'EMERGING');
    assert.equal(overview.stability.score, 0.692);
    assert.equal(overview.stability.classification, 'STABLE');
  });

  it('formats FastAPI overview with S1 state', () => {
    const overview = formatOverview(fastResult);
    assert.equal(overview.s_state.state, 'S1');
    assert.equal(overview.maturity.score, 0.208);
    assert.equal(overview.gravity.score, 0.082);
    assert.equal(overview.stability.score, 0.063);
  });

  it('formats BlueEdge debt section with 15 items', () => {
    const debt = formatDebtSection(blueResult);
    assert.ok(debt);
    assert.equal(debt.total_items, 15);
    assert.ok(debt.blocking_count > 0);
    assert.ok(Object.keys(debt.by_category).length > 0);
  });

  it('formats continuity section', () => {
    const continuity = formatContinuitySection(blueResult);
    assert.ok(continuity);
    assert.equal(continuity.overall_status, 'PARTIAL');
    assert.equal(continuity.coverage_ratio, 0.371);
    assert.ok(continuity.gaps.length > 0);
  });

  it('formats maturity section with all 8 dimensions', () => {
    const maturity = formatMaturitySection(blueResult);
    assert.ok(maturity);
    assert.equal(maturity.overall.score, 0.625);
    assert.equal(Object.keys(maturity.dimensions).length, 8);
    assert.ok(maturity.gravity);
    assert.ok(maturity.stability);
  });

  it('formats progression section', () => {
    const progression = formatProgressionSection(blueResult);
    assert.ok(progression);
    assert.equal(progression.current_s_state, 'S2');
    assert.equal(progression.target_s_state, 'S3');
    assert.equal(progression.blocking_debt_count, 13);
  });

  it('formats evidence/replay section with all checks passing', () => {
    const evidence = formatEvidenceReplaySection(blueResult);
    assert.ok(evidence);
    assert.equal(evidence.all_replays_passed, true);
    assert.equal(evidence.all_certifications_passed, true);
    assert.equal(evidence.replays.length, 3);
    assert.equal(evidence.certifications.length, 3);
  });

  it('formats handoff section with blocking conditions', () => {
    const state = resolveCockpitState(BE_CLIENT, BE_RUN);
    const handoff = formatHandoffSection(blueResult, state.handoff_status);
    assert.ok(handoff);
    assert.equal(handoff.ready, false);
    assert.ok(handoff.blocking_conditions.length > 0);
    assert.equal(handoff.governance.no_direct_lens_emission, true);
  });

  it('formats history section', () => {
    const history = formatHistorySection(blueResult);
    assert.ok(history);
    assert.equal(history.current_state, 'S2');
    assert.ok(history.entries.length > 0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Governance Compliance
// ────────────────────────────────────────────────────────────────────────────

describe('Governance Compliance', () => {
  it('cockpit reads SQO artifacts without mutation', () => {
    const artifactDir = path.join(process.env.REPO_ROOT, 'artifacts', 'sqo', BE_CLIENT, BE_RUN);
    const before = {};
    for (const f of fs.readdirSync(artifactDir)) {
      before[f] = fs.readFileSync(path.join(artifactDir, f), 'utf8');
    }
    loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
    for (const f of fs.readdirSync(artifactDir)) {
      assert.equal(fs.readFileSync(path.join(artifactDir, f), 'utf8'), before[f]);
    }
  });

  it('cockpit modules do not import from LENS flagship binding', () => {
    const cockpitDir = path.join(__dirname, '..', '..', 'lib', 'sqo-cockpit');
    const files = fs.readdirSync(cockpitDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(cockpitDir, file), 'utf8');
      assert.ok(!content.includes('flagshipBinding'), `${file} imports flagshipBinding`);
      assert.ok(!content.includes('lens-v2-flagship'), `${file} imports lens-v2-flagship`);
    }
  });

  it('cockpit pages do not import from LENS runtime', () => {
    const pagesDir = path.join(__dirname, '..', '..', 'pages', 'sqo');
    const allPages = [];
    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(path.join(dir, entry.name));
        else if (entry.name.endsWith('.js')) allPages.push(path.join(dir, entry.name));
      }
    }
    walk(pagesDir);
    assert.ok(allPages.length >= 9, `Expected >= 9 pages, found ${allPages.length}`);
    for (const page of allPages) {
      const content = fs.readFileSync(page, 'utf8');
      assert.ok(!content.includes('flagshipBinding'), `${path.basename(page)} imports flagshipBinding`);
      assert.ok(!content.includes('lens-v2-flagship'), `${path.basename(page)} imports lens-v2-flagship`);
      assert.ok(!content.includes('SQORuntimeOverlay'), `${path.basename(page)} imports SQORuntimeOverlay`);
      assert.ok(!content.includes('SQOOverlayStateResolver'), `${path.basename(page)} imports SQOOverlayStateResolver`);
    }
  });

  it('deterministic display: same input produces same output', () => {
    const result1 = formatOverview(loadAllCockpitArtifacts(BE_CLIENT, BE_RUN));
    const result2 = formatOverview(loadAllCockpitArtifacts(BE_CLIENT, BE_RUN));
    assert.equal(JSON.stringify(result1), JSON.stringify(result2));
  });

  it('fail-visible: empty state rendered for missing data', () => {
    const overview = formatOverview({ ok: false, artifacts: {} });
    assert.equal(overview.s_state, null);
    assert.equal(overview.maturity, null);
    assert.equal(overview.gravity, null);
    assert.equal(overview.stability, null);
  });

  it('no AI interpretation terms in formatter output', () => {
    const overview = formatOverview(loadAllCockpitArtifacts(BE_CLIENT, BE_RUN));
    const serialized = JSON.stringify(overview);
    assert.ok(!(/\bpredict\b/i.test(serialized)), 'Found "predict" in output');
    assert.ok(!(/\bestimate\b/i.test(serialized)), 'Found "estimate" in output');
    assert.ok(!(/\bAI confidence\b/i.test(serialized)), 'Found "AI confidence" in output');
    assert.ok(!(/\bmodel thinks\b/i.test(serialized)), 'Found "model thinks" in output');
    assert.ok(!(/\bprobabilistic\b/i.test(serialized)), 'Found "probabilistic" in output');
  });
});
