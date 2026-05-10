'use strict';

const path = require('node:path');
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { resolveVisualState, S_STATE_VISUAL, BLOCKER_VISUAL, resolveDebtVisual } = require('../../lib/sqo-cockpit/QualificationVisualStateResolver');
const { resolveAttentionHierarchy, ATTENTION_ZONES } = require('../../lib/sqo-cockpit/OperationalAttentionResolver');
const { resolveWorkflowDominance, WORKFLOW_PROMINENCE } = require('../../lib/sqo-cockpit/WorkflowDominanceResolver');
const { resolveCognitiveGroups, COGNITIVE_GROUPS } = require('../../lib/sqo-cockpit/CognitiveGroupingResolver');
const { resolveDeferredVisibility, VISIBILITY_DEFAULTS } = require('../../lib/sqo-cockpit/DeferredVisibilityResolver');
const { loadAllCockpitArtifacts } = require('../../lib/sqo-cockpit/SQOCockpitArtifactLoader');
const { resolveQualificationJourney } = require('../../lib/sqo-cockpit/QualificationJourneyResolver');

const FA_CLIENT = 'fastapi';
const FA_RUN = 'run_02_oss_fastapi_pipeline';
const BE_CLIENT = 'blueedge';
const BE_RUN = 'run_blueedge_productized_01_fixed';

let faJourney;
let beJourney;

before(() => {
  const faLoad = loadAllCockpitArtifacts(FA_CLIENT, FA_RUN);
  faJourney = resolveQualificationJourney(faLoad);

  const beLoad = loadAllCockpitArtifacts(BE_CLIENT, BE_RUN);
  beJourney = resolveQualificationJourney(beLoad);
});

// ────────────────────────────────────────────────────────────────────────────
// 1. Qualification Visual State
// ────────────────────────────────────────────────────────────────────────────

describe('QualificationVisualStateResolver', () => {
  it('S1 state resolves to amber palette', () => {
    const vs = resolveVisualState('S1', 'NONE');
    assert.equal(vs.palette, 'amber');
    assert.equal(vs.chromatic_class, 'sqo-state--amber');
  });

  it('S2 state resolves to blue palette', () => {
    const vs = resolveVisualState('S2', 'NONE');
    assert.equal(vs.palette, 'blue');
    assert.equal(vs.chromatic_class, 'sqo-state--blue');
  });

  it('S3 state resolves to green palette', () => {
    const vs = resolveVisualState('S3', 'NONE');
    assert.equal(vs.palette, 'green');
    assert.equal(vs.intensity, 'governed');
  });

  it('critical blockers override posture to critical', () => {
    const vs = resolveVisualState('S1', 'MISSING_QUALIFICATION_ARTIFACTS');
    assert.equal(vs.posture, 'critical');
    assert.equal(vs.is_blocked, true);
    assert.equal(vs.blocker_class, 'sqo-blocker--critical');
  });

  it('FastAPI visual state is blocked amber', () => {
    const vs = resolveVisualState(faJourney.banner.s_state, faJourney.banner.blocker_class);
    assert.equal(vs.palette, 'amber');
    assert.equal(vs.is_blocked, true);
  });

  it('BlueEdge visual state is stabilized blue', () => {
    const vs = resolveVisualState(beJourney.banner.s_state, beJourney.banner.blocker_class);
    assert.equal(vs.palette, 'blue');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Operational Attention Hierarchy
// ────────────────────────────────────────────────────────────────────────────

describe('OperationalAttentionResolver', () => {
  it('FastAPI attention focuses on blockers', () => {
    const attn = resolveAttentionHierarchy(faJourney);
    assert.equal(attn.primary_focus, 'blockers');
    assert.ok(attn.zones.length >= 6);
  });

  it('attention hierarchy renders 6 zones', () => {
    const attn = resolveAttentionHierarchy(faJourney);
    assert.equal(attn.zones.length, 6);
    assert.equal(attn.zones[0].id, 'current_state');
    assert.equal(attn.zones[1].id, 'blockers');
    assert.equal(attn.zones[5].id, 'forensic_detail');
  });

  it('empty journey returns minimal hierarchy', () => {
    const attn = resolveAttentionHierarchy(null);
    assert.equal(attn.primary_focus, null);
    assert.equal(attn.cognitive_load, 'minimal');
  });

  it('attention resolver is deterministic', () => {
    const a1 = resolveAttentionHierarchy(faJourney);
    const a2 = resolveAttentionHierarchy(faJourney);
    assert.deepStrictEqual(a1, a2);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Workflow Dominance
// ────────────────────────────────────────────────────────────────────────────

describe('WorkflowDominanceResolver', () => {
  it('resolves workflow dominance for FastAPI', () => {
    const dom = resolveWorkflowDominance(faJourney.remediationStages, faJourney.currentStage);
    assert.ok(dom.stages.length > 0);
    assert.ok(dom.spineNodes.length > 0);
    assert.ok(dom.activeStageId);
  });

  it('active stage has dominant prominence', () => {
    const dom = resolveWorkflowDominance(faJourney.remediationStages, faJourney.currentStage);
    const active = dom.stages.find(s => s.id === dom.activeStageId);
    assert.equal(active.prominence, 'dominant');
    assert.equal(active.visual_state, 'active');
    assert.equal(active.expanded, true);
  });

  it('future stages have muted prominence', () => {
    const dom = resolveWorkflowDominance(faJourney.remediationStages, faJourney.currentStage);
    const future = dom.stages.filter(s => s.visual_state === 'future');
    for (const s of future) {
      assert.equal(s.prominence, 'muted');
      assert.equal(s.expanded, false);
    }
  });

  it('spine nodes match stages', () => {
    const dom = resolveWorkflowDominance(faJourney.remediationStages, faJourney.currentStage);
    assert.equal(dom.spineNodes.length, dom.stages.length);
    const activeNode = dom.spineNodes.find(n => n.is_active);
    assert.ok(activeNode);
    assert.equal(activeNode.id, dom.activeStageId);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Cognitive Grouping
// ────────────────────────────────────────────────────────────────────────────

describe('CognitiveGroupingResolver', () => {
  it('resolves cognitive groups for FastAPI', () => {
    const attn = resolveAttentionHierarchy(faJourney);
    const groups = resolveCognitiveGroups(faJourney, attn);
    assert.ok(groups.groups.length >= 6);
    assert.ok(groups.activeGroup);
  });

  it('deferred context group is collapsed by default', () => {
    const attn = resolveAttentionHierarchy(faJourney);
    const groups = resolveCognitiveGroups(faJourney, attn);
    const deferred = groups.groups.find(g => g.id === 'deferred_context');
    assert.equal(deferred.collapsed, true);
  });

  it('forensic exploration group is collapsed by default', () => {
    const attn = resolveAttentionHierarchy(faJourney);
    const groups = resolveCognitiveGroups(faJourney, attn);
    const forensic = groups.groups.find(g => g.id === 'forensic_exploration');
    assert.equal(forensic.collapsed, true);
  });

  it('groups are deterministic', () => {
    const attn = resolveAttentionHierarchy(faJourney);
    const g1 = resolveCognitiveGroups(faJourney, attn);
    const g2 = resolveCognitiveGroups(faJourney, attn);
    assert.deepStrictEqual(g1, g2);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Deferred Visibility
// ────────────────────────────────────────────────────────────────────────────

describe('DeferredVisibilityResolver', () => {
  it('resolves visibility for FastAPI journey', () => {
    const vis = resolveDeferredVisibility(faJourney);
    assert.ok(vis.visible_count > 0);
    assert.ok(vis.collapsed_count > 0);
  });

  it('qualification hero is always visible and expanded', () => {
    const vis = resolveDeferredVisibility(faJourney);
    assert.equal(vis.panels.qualification_hero.visible, true);
    assert.equal(vis.panels.qualification_hero.collapsed, false);
  });

  it('deferred debt is collapsed by default', () => {
    const vis = resolveDeferredVisibility(faJourney);
    assert.equal(vis.panels.deferred_debt.collapsed, true);
  });

  it('maturity internals are collapsed by default', () => {
    const vis = resolveDeferredVisibility(faJourney);
    assert.equal(vis.panels.maturity_internals.collapsed, true);
  });

  it('immediate blockers are never collapsed', () => {
    const vis = resolveDeferredVisibility(faJourney);
    if (vis.panels.immediate_blockers.visible) {
      assert.equal(vis.panels.immediate_blockers.collapsed, false);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Cross-Client Visual Differentiation
// ────────────────────────────────────────────────────────────────────────────

describe('Cross-Client Visual Differentiation', () => {
  it('FastAPI and BlueEdge resolve to different visual states', () => {
    const faVs = resolveVisualState(faJourney.banner.s_state, faJourney.banner.blocker_class);
    const beVs = resolveVisualState(beJourney.banner.s_state, beJourney.banner.blocker_class);
    assert.notEqual(faVs.palette, beVs.palette);
    assert.notEqual(faVs.chromatic_class, beVs.chromatic_class);
  });

  it('visual state derives from SQO state not client name', () => {
    const s1Visual = resolveVisualState('S1', 'MISSING_QUALIFICATION_ARTIFACTS');
    const s2Visual = resolveVisualState('S2', 'NONE');
    assert.equal(s1Visual.palette, 'amber');
    assert.equal(s2Visual.palette, 'blue');
    assert.equal(s1Visual.is_blocked, true);
    assert.equal(s2Visual.is_blocked, false);
  });

  it('no client-name branching in visual resolution', () => {
    const resolverSource = require('node:fs').readFileSync(
      path.join(__dirname, '..', '..', 'lib', 'sqo-cockpit', 'QualificationVisualStateResolver.js'),
      'utf-8'
    );
    assert.ok(!resolverSource.includes('fastapi'), 'resolver should not reference fastapi');
    assert.ok(!resolverSource.includes('blueedge'), 'resolver should not reference blueedge');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. Governance Compliance
// ────────────────────────────────────────────────────────────────────────────

describe('Governance Compliance — Operational UX', () => {
  it('no AI language in visual state labels', () => {
    const aiTerms = ['recommend', 'suggest', 'believe', 'think', 'feel', 'opinion', 'you should'];
    for (const [state, visual] of Object.entries(S_STATE_VISUAL)) {
      for (const term of aiTerms) {
        assert.ok(!visual.label.toLowerCase().includes(term),
          `S_STATE_VISUAL.${state}.label contains AI language: "${term}"`);
      }
    }
  });

  it('no artifact mutation during orchestration', () => {
    const faLoad = loadAllCockpitArtifacts(FA_CLIENT, FA_RUN);
    const origCount = faLoad.loaded_count;
    const journey = resolveQualificationJourney(faLoad);
    resolveVisualState(journey.banner.s_state, journey.banner.blocker_class);
    resolveAttentionHierarchy(journey);
    resolveWorkflowDominance(journey.remediationStages, journey.currentStage);
    resolveDeferredVisibility(journey);
    assert.equal(faLoad.loaded_count, origCount);
  });

  it('no PATH B or LENS coupling in orchestration modules', () => {
    const modules = [
      'QualificationVisualStateResolver.js',
      'OperationalAttentionResolver.js',
      'WorkflowDominanceResolver.js',
      'CognitiveGroupingResolver.js',
      'DeferredVisibilityResolver.js',
    ];
    const fs = require('node:fs');
    for (const mod of modules) {
      const source = fs.readFileSync(
        path.join(__dirname, '..', '..', 'lib', 'sqo-cockpit', mod), 'utf-8'
      );
      assert.ok(!source.includes('PATH_B'), `${mod} should not reference PATH_B`);
      assert.ok(!source.includes('pathB'), `${mod} should not reference pathB`);
      assert.ok(!source.includes('lens_projection'), `${mod} should not reference lens_projection`);
      assert.ok(!source.includes('LENS'), `${mod} should not reference LENS`);
    }
  });

  it('progressive disclosure is deterministic', () => {
    const vis1 = resolveDeferredVisibility(faJourney);
    const vis2 = resolveDeferredVisibility(faJourney);
    assert.deepStrictEqual(vis1, vis2);
  });

  it('existing SQO cockpit routes remain functional', () => {
    const { validateRouteParams } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');
    assert.equal(validateRouteParams(FA_CLIENT, FA_RUN).valid, true);
    assert.equal(validateRouteParams(BE_CLIENT, BE_RUN).valid, true);
  });
});
