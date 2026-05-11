'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { loadCorridorData, CLIENT, RUN, SANDBOX_ID } = require('../../lib/sqo-cockpit/server/BlueEdgeRuntimeCorridorLoader.server');
const { buildCorridorViewModel } = require('../../lib/sqo-cockpit/client/BlueEdgeRuntimeCorridorViewModel');
const { COCKPIT_SECTIONS, SECTION_ROUTES, SECTION_LABELS, buildNavigationItems } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');

const REPO_ROOT = process.env.REPO_ROOT;

// ────────────────────────────────────────────────────────────────────────────
// 1. Corridor Route
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge corridor route configuration', () => {
  it('corridor section exists in COCKPIT_SECTIONS', () => {
    assert.ok(COCKPIT_SECTIONS.includes('corridor'));
  });

  it('corridor route is defined', () => {
    assert.equal(SECTION_ROUTES.corridor, '/corridor');
  });

  it('corridor label is defined', () => {
    assert.equal(SECTION_LABELS.corridor, 'Runtime Corridor');
  });

  it('navigation includes corridor section', () => {
    const nav = buildNavigationItems('blueedge', 'run_blueedge_productized_01_fixed', 'corridor');
    const corridorNav = nav.find(n => n.section === 'corridor');
    assert.ok(corridorNav);
    assert.equal(corridorNav.active, true);
    assert.ok(corridorNav.path.includes('/corridor'));
  });

  it('corridor page file exists', () => {
    const pagePath = path.join(REPO_ROOT, 'app/execlens-demo/pages/sqo/client/[client]/run/[run]/corridor.js');
    assert.ok(fs.existsSync(pagePath), 'corridor.js page file should exist');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. No FastAPI corridor route
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI corridor route is not implemented', () => {
  it('corridor loader is scoped to BlueEdge only', () => {
    assert.equal(CLIENT, 'blueedge');
    assert.equal(RUN, 'run_blueedge_productized_01_fixed');
    assert.equal(SANDBOX_ID, 'sandbox-multi-001');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Server-Side Loader
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdgeRuntimeCorridorLoader', () => {
  it('loads corridor data successfully', () => {
    const data = loadCorridorData();
    assert.equal(data.ok, true);
    assert.equal(data.client, 'blueedge');
    assert.equal(data.run_id, 'run_blueedge_productized_01_fixed');
    assert.equal(data.sandbox_id, 'sandbox-multi-001');
    assert.ok(data.loaded_count > 0);
  });

  it('loads manifest artifact', () => {
    const data = loadCorridorData();
    assert.ok(data.artifacts.manifest.ok);
    assert.equal(data.artifacts.manifest.data.sandbox_type, 'MULTI_OVERLAY_ORCHESTRATION');
  });

  it('loads composite state artifact', () => {
    const data = loadCorridorData();
    assert.ok(data.artifacts.composite_state.ok);
    assert.ok(data.artifacts.composite_state.data.state_history);
  });

  it('loads replay verification artifact', () => {
    const data = loadCorridorData();
    assert.ok(data.artifacts.replay_verification.ok);
    assert.ok(data.artifacts.replay_verification.data.verifications.length > 0);
  });

  it('loads coexistence artifact', () => {
    const data = loadCorridorData();
    assert.ok(data.artifacts.coexistence.ok);
  });

  it('loads all three overlay packages', () => {
    const data = loadCorridorData();
    const overlays = data.artifacts.overlays;
    assert.ok(overlays['SEP-multi-001'].activation.ok);
    assert.ok(overlays['SEP-multi-002'].activation.ok);
    assert.ok(overlays['SEP-multi-003'].activation.ok);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. View Model
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdgeRuntimeCorridorViewModel', () => {
  let vm;

  it('builds view model from corridor data', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.equal(vm.available, true);
    assert.equal(vm.client, 'blueedge');
    assert.equal(vm.sandbox_id, 'sandbox-multi-001');
  });

  it('sandbox session summary renders', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.ok(vm.session.available);
    assert.ok(vm.session.session_id);
    assert.ok(vm.session.lifecycle_status);
    assert.ok(vm.session.isolation);
  });

  it('overlay chain summary renders', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.ok(vm.overlayChain.available);
    assert.equal(vm.overlayChain.count, 3);
    assert.equal(vm.overlayChain.overlays.length, 3);
    assert.ok(vm.overlayChain.coexistence);
    assert.equal(vm.overlayChain.coexistence.health, 'HEALTHY');
  });

  it('replay/rollback summary renders', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.ok(vm.replayRollback.available);
    assert.ok(vm.replayRollback.replay.all_match);
    assert.equal(vm.replayRollback.rollback.round_trip_verified, true);
    assert.equal(vm.replayRollback.baseline_hash_status, 'VERIFIED');
  });

  it('certification summary renders', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.ok(vm.certification.available);
    assert.ok(vm.certification.current_certification);
    assert.ok(vm.certification.s_state);
    assert.equal(vm.certification.authority_eligible, false);
    assert.equal(vm.certification.publication_eligible, false);
    assert.ok(vm.certification.blocking_gates.length > 0);
  });

  it('governance zone summary renders', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.ok(vm.governanceZone.available);
    assert.equal(vm.governanceZone.current_zone, 'SAFE');
    assert.ok(vm.governanceZone.metrics);
    assert.equal(vm.governanceZone.escalation.g_level, 'G-0');
  });

  it('authority boundary summary renders', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.ok(vm.authorityBoundary.available);
    assert.equal(vm.authorityBoundary.boundaries.sandbox_state, 'PROVISIONAL');
    assert.equal(vm.authorityBoundary.boundaries.lens_consumable, false);
    assert.ok(vm.authorityBoundary.anti_leakage);
  });

  it('lineage summary renders', () => {
    const data = loadCorridorData();
    vm = buildCorridorViewModel(data);
    assert.ok(vm.lineageTrace.available);
    assert.ok(vm.lineageTrace.evidence_lineage);
    assert.ok(vm.lineageTrace.overlay_lineage);
    assert.ok(vm.lineageTrace.replay_lineage);
    assert.ok(vm.lineageTrace.rollback_lineage);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. No Artifact Mutation
// ────────────────────────────────────────────────────────────────────────────

describe('No artifact mutation', () => {
  it('corridor loader performs read-only operations', () => {
    const manifestPath = path.join(
      REPO_ROOT, 'artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/sandbox-multi-001/manifest.json'
    );
    const before = fs.readFileSync(manifestPath, 'utf8');
    loadCorridorData();
    const after = fs.readFileSync(manifestPath, 'utf8');
    assert.equal(before, after, 'Manifest must not be mutated by corridor loader');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. No PATH A / PATH B / LENS Imports
// ────────────────────────────────────────────────────────────────────────────

describe('No PATH A / PATH B / LENS coupling', () => {
  it('corridor loader does not import FastAPI modules', () => {
    const loaderSrc = fs.readFileSync(
      path.join(REPO_ROOT, 'app/execlens-demo/lib/sqo-cockpit/server/BlueEdgeRuntimeCorridorLoader.server.js'), 'utf8'
    );
    assert.ok(!loaderSrc.includes('fastapi'), 'No FastAPI import in corridor loader');
    assert.ok(!loaderSrc.includes('path_a'), 'No PATH A import');
    assert.ok(!loaderSrc.includes('path_b'), 'No PATH B import');
  });

  it('view model does not import server modules', () => {
    const vmSrc = fs.readFileSync(
      path.join(REPO_ROOT, 'app/execlens-demo/lib/sqo-cockpit/client/BlueEdgeRuntimeCorridorViewModel.js'), 'utf8'
    );
    assert.ok(!vmSrc.includes("require('fs')"), 'No fs import in view model');
    assert.ok(!vmSrc.includes("require('path')"), 'No path import in view model');
    assert.ok(!vmSrc.includes('SemanticArtifactLoader'), 'No server loader import in view model');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. No Browser-Side fs Import
// ────────────────────────────────────────────────────────────────────────────

describe('No browser-side fs import', () => {
  it('corridor page uses getServerSideProps for data loading', () => {
    const pageSrc = fs.readFileSync(
      path.join(REPO_ROOT, 'app/execlens-demo/pages/sqo/client/[client]/run/[run]/corridor.js'), 'utf8'
    );
    assert.ok(pageSrc.includes('getServerSideProps'), 'Page must use getServerSideProps');
    assert.ok(!pageSrc.includes("import fs"), 'No fs import at page top');
    assert.ok(!pageSrc.includes("require('fs')") || pageSrc.indexOf("require('fs')") > pageSrc.indexOf('getServerSideProps'),
      'fs require only inside getServerSideProps');
  });

  it('view model has no fs or path requires', () => {
    const vmSrc = fs.readFileSync(
      path.join(REPO_ROOT, 'app/execlens-demo/lib/sqo-cockpit/client/BlueEdgeRuntimeCorridorViewModel.js'), 'utf8'
    );
    assert.ok(!vmSrc.includes("require('fs')"), 'No fs in view model');
    assert.ok(!vmSrc.includes("require('path')"), 'No path in view model');
  });

  it('corridor components have no server imports', () => {
    const componentDir = path.join(REPO_ROOT, 'app/execlens-demo/components/sqo-cockpit');
    const corridorComponents = fs.readdirSync(componentDir)
      .filter(f => f.startsWith('Corridor') || f === 'BlueEdgeRuntimeCorridorPanel.jsx');

    for (const file of corridorComponents) {
      const src = fs.readFileSync(path.join(componentDir, file), 'utf8');
      assert.ok(!src.includes("require('fs')"), `${file}: no fs import`);
      assert.ok(!src.includes("require('path')"), `${file}: no path import`);
      assert.ok(!src.includes('SemanticArtifactLoader'), `${file}: no server loader import`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. Full Regression
// ────────────────────────────────────────────────────────────────────────────

describe('Full regression — existing cockpit not broken', () => {
  it('existing COCKPIT_SECTIONS still contains all original sections', () => {
    const original = ['overview', 'debt', 'continuity', 'maturity', 'progression', 'evidence', 'handoff'];
    for (const section of original) {
      assert.ok(COCKPIT_SECTIONS.includes(section), `Section ${section} must still exist`);
    }
  });

  it('existing artifact loader still works', () => {
    const { loadAllCockpitArtifacts } = require('../../lib/sqo-cockpit/SQOCockpitArtifactLoader');
    const result = loadAllCockpitArtifacts('blueedge', 'run_blueedge_productized_01_fixed');
    assert.equal(result.ok, true);
    assert.equal(result.loaded_count, 15);
  });

  it('existing workspace data resolver still works', () => {
    const { resolveWorkspaceData } = require('../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
    const result = resolveWorkspaceData('blueedge', 'run_blueedge_productized_01_fixed', 'overview');
    assert.equal(result.error, null);
    assert.ok(result.cockpitState);
  });
});
