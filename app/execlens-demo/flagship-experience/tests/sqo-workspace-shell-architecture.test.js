'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { resolveWorkspaceData } = require('../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
const { deriveSectionFromPath, COCKPIT_SECTIONS, SECTION_ROUTES } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');
const { formatDebtSection, formatContinuitySection, formatMaturitySection, formatProgressionSection, formatEvidenceReplaySection, formatHandoffSection } = require('../../lib/sqo-cockpit/SQOCockpitFormatter');
const { resolveCockpitState } = require('../../lib/sqo-cockpit/SQOCockpitStateResolver');
const { loadAllCockpitArtifacts } = require('../../lib/sqo-cockpit/SQOCockpitArtifactLoader');

const FA_CLIENT = 'fastapi';
const FA_RUN = 'run_02_oss_fastapi_pipeline';
const BE_CLIENT = 'blueedge';
const BE_RUN = 'run_blueedge_productized_01_fixed';

let faWorkspace;
let beWorkspace;

before(() => {
  faWorkspace = resolveWorkspaceData(FA_CLIENT, FA_RUN, 'overview');
  beWorkspace = resolveWorkspaceData(BE_CLIENT, BE_RUN, 'overview');
});

describe('Workspace Data Resolver — Structure', () => {
  it('returns complete workspace data for FastAPI', () => {
    assert.ok(faWorkspace);
    assert.equal(faWorkspace.client, FA_CLIENT);
    assert.equal(faWorkspace.runId, FA_RUN);
    assert.equal(faWorkspace.error, null);
    assert.equal(faWorkspace.initialSection, 'overview');
  });

  it('returns complete workspace data for BlueEdge', () => {
    assert.ok(beWorkspace);
    assert.equal(beWorkspace.client, BE_CLIENT);
    assert.equal(beWorkspace.runId, BE_RUN);
    assert.equal(beWorkspace.error, null);
  });

  it('includes all overview-specific resolvers', () => {
    assert.ok(faWorkspace.journey);
    assert.ok(faWorkspace.visualState);
    assert.ok(faWorkspace.attentionHierarchy);
    assert.ok(faWorkspace.workflowDominance);
    assert.ok(faWorkspace.deferredVisibility);
  });

  it('includes all 6 section data keys', () => {
    assert.ok(faWorkspace.sectionData);
    assert.ok(faWorkspace.sectionData.debt);
    assert.ok(faWorkspace.sectionData.continuity);
    assert.ok(faWorkspace.sectionData.maturity);
    assert.ok(faWorkspace.sectionData.progression);
    assert.ok(faWorkspace.sectionData.evidence);
    assert.ok(faWorkspace.sectionData.handoff !== undefined);
  });

  it('includes navigation items', () => {
    assert.ok(faWorkspace.navigation);
    assert.equal(faWorkspace.navigation.length, COCKPIT_SECTIONS.length);
  });

  it('preserves cockpit state', () => {
    assert.ok(faWorkspace.cockpitState);
    assert.ok(faWorkspace.cockpitState.state);
    assert.ok(faWorkspace.cockpitState.label);
  });

  it('handles invalid client gracefully', () => {
    const invalid = resolveWorkspaceData('nonexistent', 'bad_run', 'overview');
    assert.ok(invalid.error);
    assert.equal(invalid.sectionData, null);
    assert.equal(invalid.journey, null);
    assert.equal(invalid.initialSection, 'overview');
  });
});

describe('Workspace Data Resolver — Section Equivalence', () => {
  let faState;

  before(() => {
    faState = resolveCockpitState(FA_CLIENT, FA_RUN);
  });

  it('debt section data matches direct formatter output', () => {
    const direct = formatDebtSection(faState.artifacts);
    assert.deepStrictEqual(faWorkspace.sectionData.debt, direct);
  });

  it('continuity section data matches direct formatter output', () => {
    const direct = formatContinuitySection(faState.artifacts);
    assert.deepStrictEqual(faWorkspace.sectionData.continuity, direct);
  });

  it('maturity section data matches direct formatter output', () => {
    const direct = formatMaturitySection(faState.artifacts);
    assert.deepStrictEqual(faWorkspace.sectionData.maturity, direct);
  });

  it('progression section data matches direct formatter output', () => {
    const direct = formatProgressionSection(faState.artifacts);
    assert.deepStrictEqual(faWorkspace.sectionData.progression, direct);
  });

  it('evidence section data matches direct formatter output', () => {
    const direct = formatEvidenceReplaySection(faState.artifacts);
    assert.deepStrictEqual(faWorkspace.sectionData.evidence, direct);
  });

  it('handoff section data matches direct formatter output', () => {
    const direct = formatHandoffSection(faState.artifacts, faState.handoff_status);
    assert.deepStrictEqual(faWorkspace.sectionData.handoff, direct);
  });
});

describe('Workspace Data Resolver — Initial Section', () => {
  it('respects initialSection parameter', () => {
    const debtWorkspace = resolveWorkspaceData(FA_CLIENT, FA_RUN, 'debt');
    assert.equal(debtWorkspace.initialSection, 'debt');
  });

  it('defaults to overview when initialSection is omitted', () => {
    const defaultWorkspace = resolveWorkspaceData(FA_CLIENT, FA_RUN);
    assert.equal(defaultWorkspace.initialSection, 'overview');
  });

  it('all sections produce valid workspace data', () => {
    for (const section of COCKPIT_SECTIONS) {
      const ws = resolveWorkspaceData(FA_CLIENT, FA_RUN, section);
      assert.equal(ws.error, null);
      assert.equal(ws.initialSection, section);
      assert.ok(ws.sectionData);
    }
  });
});

describe('Section Derivation from Path', () => {
  it('derives overview from base path', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02'), 'overview');
  });

  it('derives overview from base path with trailing slash', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/'), 'overview');
  });

  it('derives debt section', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/debt'), 'debt');
  });

  it('derives continuity section', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/continuity'), 'continuity');
  });

  it('derives maturity section', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/maturity'), 'maturity');
  });

  it('derives progression section', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/progression'), 'progression');
  });

  it('derives evidence section', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/evidence'), 'evidence');
  });

  it('derives handoff section', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/handoff'), 'handoff');
  });

  it('returns overview for unknown suffix', () => {
    assert.equal(deriveSectionFromPath('/sqo/client/fastapi/run/run_02/unknown'), 'overview');
  });
});

describe('Workspace Shell — Deep-Link Routing', () => {
  it('all 7 page files exist', () => {
    const pageDir = path.resolve(__dirname, '..', '..', 'pages', 'sqo', 'client', '[client]', 'run', '[run]');
    const expectedFiles = ['index.js', 'debt.js', 'continuity.js', 'maturity.js', 'progression.js', 'evidence.js', 'handoff.js'];
    for (const file of expectedFiles) {
      assert.ok(fs.existsSync(path.join(pageDir, file)), `${file} must exist`);
    }
  });

  it('all detail pages delegate to SQOWorkspaceShell', () => {
    const pageDir = path.resolve(__dirname, '..', '..', 'pages', 'sqo', 'client', '[client]', 'run', '[run]');
    const detailPages = ['debt.js', 'continuity.js', 'maturity.js', 'progression.js', 'evidence.js', 'handoff.js'];
    for (const file of detailPages) {
      const src = fs.readFileSync(path.join(pageDir, file), 'utf-8');
      assert.ok(src.includes('SQOWorkspaceShell'), `${file} must use SQOWorkspaceShell`);
      assert.ok(src.includes('resolveWorkspaceData'), `${file} must use resolveWorkspaceData`);
    }
  });

  it('overview page delegates to SQOWorkspaceShell', () => {
    const pageDir = path.resolve(__dirname, '..', '..', 'pages', 'sqo', 'client', '[client]', 'run', '[run]');
    const src = fs.readFileSync(path.join(pageDir, 'index.js'), 'utf-8');
    assert.ok(src.includes('SQOWorkspaceShell'));
    assert.ok(src.includes('resolveWorkspaceData'));
  });
});

describe('Workspace Shell — Navigation Transformation', () => {
  it('SQONavigation accepts onNavigate prop', () => {
    const navPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'SQONavigation.jsx');
    const src = fs.readFileSync(navPath, 'utf-8');
    assert.ok(src.includes('onNavigate'));
    assert.ok(src.includes('e.preventDefault'));
  });

  it('SQOWorkspaceShell manages activeSection state', () => {
    const shellPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'SQOWorkspaceShell.jsx');
    const src = fs.readFileSync(shellPath, 'utf-8');
    assert.ok(src.includes('useState'));
    assert.ok(src.includes('activeSection'));
    assert.ok(src.includes('setActiveSection'));
    assert.ok(src.includes('shallow: true'));
  });

  it('SQOWorkspacePanel dispatches to section components', () => {
    const panelPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'SQOWorkspacePanel.jsx');
    const src = fs.readFileSync(panelPath, 'utf-8');
    assert.ok(src.includes('SemanticDebtPanel'));
    assert.ok(src.includes('ContinuityAssessmentPanel'));
    assert.ok(src.includes('MaturityProfilePanel'));
    assert.ok(src.includes('ProgressionReadinessPanel'));
    assert.ok(src.includes('EvidenceReplayPanel'));
    assert.ok(src.includes('HandoffReadinessPanel'));
  });
});

describe('Workspace Shell — Governance', () => {
  it('no client-name branching in workspace resolver', () => {
    const resolverPath = path.resolve(__dirname, '..', '..', 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver.js');
    const src = fs.readFileSync(resolverPath, 'utf-8');
    assert.ok(!src.includes("'blueedge'"));
    assert.ok(!src.includes("'fastapi'"));
  });

  it('no AI patterns in workspace shell', () => {
    const shellPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'SQOWorkspaceShell.jsx');
    const src = fs.readFileSync(shellPath, 'utf-8').toLowerCase();
    assert.ok(!src.includes('ai-assistant'));
    assert.ok(!src.includes('chatbot'));
    assert.ok(!src.includes('copilot'));
  });

  it('no LENS runtime references in workspace components', () => {
    const shellPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'SQOWorkspaceShell.jsx');
    const panelPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'SQOWorkspacePanel.jsx');
    const shellSrc = fs.readFileSync(shellPath, 'utf-8');
    const panelSrc = fs.readFileSync(panelPath, 'utf-8');
    assert.ok(!shellSrc.includes('lens-v2'));
    assert.ok(!panelSrc.includes('lens-v2'));
  });

  it('workspace panel animation uses restrained CSS', () => {
    const cssPath = path.resolve(__dirname, '..', '..', 'styles', 'globals.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    assert.ok(css.includes('sqo-panel-enter'));
    assert.ok(css.includes('0.15s'));
    assert.ok(!css.includes('sqo-panel-bounce'));
    assert.ok(!css.includes('sqo-panel-flash'));
  });

  it('severity classification preserved in workspace data', () => {
    assert.equal(faWorkspace.visualState.severity_class, 'projection');
    assert.equal(beWorkspace.visualState.severity_class, 'expansion');
  });

  it('FastAPI and BlueEdge contexts distinct in workspace data', () => {
    assert.notEqual(faWorkspace.visualState.chromatic_class, beWorkspace.visualState.chromatic_class);
    assert.notEqual(faWorkspace.journey.banner.s_state, beWorkspace.journey.banner.s_state);
  });
});
