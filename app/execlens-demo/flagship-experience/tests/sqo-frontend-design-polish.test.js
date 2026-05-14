'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { resolveVisualState } = require('../../lib/sqo-cockpit/QualificationVisualStateResolver');
const { resolveAttentionHierarchy } = require('../../lib/sqo-cockpit/OperationalAttentionResolver');
const { resolveWorkflowDominance } = require('../../lib/sqo-cockpit/WorkflowDominanceResolver');
const { resolveDeferredVisibility } = require('../../lib/sqo-cockpit/DeferredVisibilityResolver');
const { loadAllCockpitArtifacts } = require('../../lib/sqo-cockpit/SQOCockpitArtifactLoader');
const { resolveQualificationJourney } = require('../../lib/sqo-cockpit/QualificationJourneyResolver');

const FA_CLIENT = 'fastapi';
const FA_RUN = 'run_02_oss_fastapi_pipeline';
const BE_CLIENT = 'blueedge';
const BE_RUN = 'run_blueedge_productized_01_fixed';

let faJourney;
let beJourney;
let faVisualState;
let beVisualState;

before(() => {
  const faLoad = loadAllCockpitArtifacts(FA_CLIENT, FA_RUN);
  faJourney = resolveQualificationJourney(faLoad);
  faVisualState = resolveVisualState(faJourney.banner.s_state, faJourney.banner.blocker_class);

  const beLoad = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
  beJourney = resolveQualificationJourney(beLoad);
  beVisualState = resolveVisualState(beJourney.banner.s_state, beJourney.banner.blocker_class);
});

describe('Frontend Design Polish — Orchestration Preservation', () => {
  it('FastAPI journey still resolves correctly after visual polish', () => {
    assert.ok(faJourney.available);
    assert.equal(faJourney.banner.s_state, 'S1');
    assert.ok(faJourney.immediateBlockers.length > 0);
    assert.ok(faJourney.debtCounts.total > 0);
  });

  it('BlueEdge journey still resolves correctly after visual polish', () => {
    assert.ok(beJourney.available);
    assert.equal(beJourney.banner.s_state, 'S2');
    assert.ok(beJourney.debtCounts.total > 0);
  });

  it('FastAPI visual state preserves severity classification', () => {
    assert.equal(faVisualState.severity_class, 'projection');
    assert.ok(faVisualState.is_projection_blocked);
    assert.ok(!faVisualState.is_expansion_constrained);
    assert.ok(faVisualState.is_blocked);
  });

  it('BlueEdge visual state preserves severity classification', () => {
    assert.equal(beVisualState.severity_class, 'expansion');
    assert.ok(!beVisualState.is_projection_blocked);
    assert.ok(beVisualState.is_expansion_constrained);
    assert.ok(!beVisualState.is_blocked);
  });

  it('attention hierarchy still functions for both clients', () => {
    const faAttn = resolveAttentionHierarchy(faJourney, faVisualState);
    assert.ok(faAttn);
    assert.ok(faAttn.primary_focus);
    assert.ok(faAttn.zones);
    assert.ok(faAttn.zones.length === 6);

    const beAttn = resolveAttentionHierarchy(beJourney, beVisualState);
    assert.ok(beAttn);
    assert.ok(beAttn.primary_focus);
    assert.ok(beAttn.zones);
  });

  it('workflow dominance still resolves', () => {
    const faDom = resolveWorkflowDominance(faJourney.remediationStages, faJourney.currentStage);
    assert.ok(faDom);
    assert.ok(faDom.stages);
    assert.ok(faDom.spineNodes);
  });

  it('deferred visibility still resolves', () => {
    const faVis = resolveDeferredVisibility(faJourney);
    assert.ok(faVis);
    assert.ok(faVis.panels);
    assert.ok(typeof faVis.collapsed_count === 'number');
    assert.ok(typeof faVis.visible_count === 'number');
  });
});

describe('Frontend Design Polish — No Logic Changes', () => {
  it('resolveVisualState returns same structure for FastAPI', () => {
    const keys = Object.keys(faVisualState);
    assert.ok(keys.includes('chromatic_class'));
    assert.ok(keys.includes('blocker_class'));
    assert.ok(keys.includes('state_label'));
    assert.ok(keys.includes('severity_class'));
    assert.ok(keys.includes('operational_label'));
    assert.ok(keys.includes('is_blocked'));
    assert.ok(keys.includes('has_constraints'));
  });

  it('resolveVisualState returns same structure for BlueEdge', () => {
    const keys = Object.keys(beVisualState);
    assert.ok(keys.includes('chromatic_class'));
    assert.ok(keys.includes('blocker_class'));
    assert.ok(keys.includes('state_label'));
    assert.ok(keys.includes('severity_class'));
    assert.ok(keys.includes('operational_label'));
    assert.ok(keys.includes('is_blocked'));
    assert.ok(keys.includes('has_constraints'));
  });

  it('FastAPI and BlueEdge chromatic classes differ as expected', () => {
    assert.notEqual(faVisualState.chromatic_class, beVisualState.chromatic_class);
  });

  it('FastAPI and BlueEdge blocker classes differ as expected', () => {
    assert.notEqual(faVisualState.blocker_class, beVisualState.blocker_class);
  });
});

describe('Frontend Design Polish — CSS Integrity', () => {
  const cssPath = path.resolve(__dirname, '..', '..', 'styles', 'globals.css');
  let cssContent;

  before(() => {
    cssContent = fs.readFileSync(cssPath, 'utf-8');
  });

  it('navigation sidebar CSS exists', () => {
    assert.ok(cssContent.includes('.sqo-cockpit-nav'));
    assert.ok(cssContent.includes('.sqo-cockpit-nav__header'));
    assert.ok(cssContent.includes('.sqo-cockpit-nav__list'));
    assert.ok(cssContent.includes('.sqo-cockpit-nav__item'));
    assert.ok(cssContent.includes('.sqo-cockpit-nav__governance'));
  });

  it('maturation strip base CSS exists', () => {
    assert.ok(cssContent.includes('.sqo-maturation-strip {'));
    assert.ok(cssContent.includes('.sqo-maturation-strip__state'));
    assert.ok(cssContent.includes('.sqo-maturation-strip__counts'));
    assert.ok(cssContent.includes('.sqo-maturation-strip__workflow'));
    assert.ok(cssContent.includes('.sqo-maturation-strip__blocker-summary'));
  });

  it('interaction transitions are defined', () => {
    assert.ok(cssContent.includes('transition: background 0.15s ease'));
  });

  it('focus-visible styles exist', () => {
    assert.ok(cssContent.includes(':focus-visible'));
  });

  it('hero region uses box-shadow for blockage depth', () => {
    assert.ok(cssContent.includes('sqo-hero__blockage--projection'));
    assert.ok(cssContent.includes('inset 3px 0 0'));
  });

  it('blocker items have elevation shadows', () => {
    assert.ok(cssContent.includes('.sqo-blocker-dominance__item'));
    assert.ok(cssContent.includes('box-shadow: 0 1px 4px'));
  });

  it('font-ui is used for description text', () => {
    const fontUiMatches = cssContent.match(/font-family:\s*var\(--font-ui\)/g);
    assert.ok(fontUiMatches && fontUiMatches.length >= 5);
  });

  it('no AI theater CSS patterns present', () => {
    assert.ok(!cssContent.includes('ai-assistant'));
    assert.ok(!cssContent.includes('chatbot'));
    assert.ok(!cssContent.includes('copilot'));
    assert.ok(!cssContent.includes('ai-widget'));
    assert.ok(!cssContent.includes('pulse'));
    assert.ok(!cssContent.includes('.glow'));
  });
});

describe('Frontend Design Polish — Severity Hierarchy Preserved', () => {
  const cssPath = path.resolve(__dirname, '..', '..', 'styles', 'globals.css');
  let cssContent;

  before(() => {
    cssContent = fs.readFileSync(cssPath, 'utf-8');
  });

  it('chromatic system classes still defined', () => {
    assert.ok(cssContent.includes('.sqo-state--neutral'));
    assert.ok(cssContent.includes('.sqo-state--amber'));
    assert.ok(cssContent.includes('.sqo-state--blue'));
    assert.ok(cssContent.includes('.sqo-state--green'));
  });

  it('blocker severity classes still defined', () => {
    assert.ok(cssContent.includes('.sqo-blocker--critical'));
    assert.ok(cssContent.includes('.sqo-blocker--operational'));
    assert.ok(cssContent.includes('.sqo-blocker--constrained'));
    assert.ok(cssContent.includes('.sqo-blocker--clear'));
  });

  it('hero blockage severity variants still defined', () => {
    assert.ok(cssContent.includes('.sqo-hero__blockage--projection'));
    assert.ok(cssContent.includes('.sqo-hero__blockage--expansion'));
    assert.ok(cssContent.includes('.sqo-hero__blockage--remediation'));
  });

  it('blocker dominance severity variants still defined', () => {
    assert.ok(cssContent.includes('.sqo-blocker-dominance--projection'));
    assert.ok(cssContent.includes('.sqo-blocker-dominance--expansion'));
    assert.ok(cssContent.includes('.sqo-blocker-dominance--qualification'));
  });
});

describe('Frontend Design Polish — Governance', () => {
  it('no client-name branching in CSS', () => {
    const cssPath = path.resolve(__dirname, '..', '..', 'styles', 'globals.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    assert.ok(!css.includes('blueedge'));
    assert.ok(!css.includes('fastapi'));
  });

  it('no AI language in CSS', () => {
    const cssPath = path.resolve(__dirname, '..', '..', 'styles', 'globals.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    const lowerCss = css.toLowerCase();
    assert.ok(!lowerCss.includes('artificial intelligence'));
    assert.ok(!lowerCss.includes('machine learning'));
    assert.ok(!lowerCss.includes('neural'));
  });

  it('no LENS runtime references in SQO CSS', () => {
    const cssPath = path.resolve(__dirname, '..', '..', 'styles', 'globals.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    const sqoSection = css.substring(css.indexOf('SQO COCKPIT'));
    assert.ok(!sqoSection.includes('.lens-'));
    assert.ok(!sqoSection.includes('.pathb-'));
  });

  it('collapse behavior preserved — DeferredDebtCollapseZone uses useState', () => {
    const componentPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'DeferredDebtCollapseZone.jsx');
    const src = fs.readFileSync(componentPath, 'utf-8');
    assert.ok(src.includes('useState'));
    assert.ok(src.includes('expandedSections'));
    assert.ok(src.includes('toggleSection'));
  });

  it('hero region renders correctly — no structural changes', () => {
    const componentPath = path.resolve(__dirname, '..', '..', 'components', 'sqo-cockpit', 'QualificationHeroRegion.jsx');
    const src = fs.readFileSync(componentPath, 'utf-8');
    assert.ok(src.includes('sqo-hero__state-block'));
    assert.ok(src.includes('sqo-hero__blockage--projection'));
    assert.ok(src.includes('sqo-hero__blockage--expansion'));
    assert.ok(src.includes('QUALIFICATION INCOMPLETE'));
    assert.ok(src.includes('EXPANSION CONSTRAINED'));
  });
});
