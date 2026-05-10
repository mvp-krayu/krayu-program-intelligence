'use strict';

const path = require('node:path');
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { resolveVisualState, S_STATE_VISUAL, BLOCKER_VISUAL } = require('../../lib/sqo-cockpit/QualificationVisualStateResolver');
const { resolveAttentionHierarchy } = require('../../lib/sqo-cockpit/OperationalAttentionResolver');
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

// ────────────────────────────────────────────────────────────────────────────
// 1. BlueEdge Not Projection-Blocked
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge Severity Correction', () => {
  it('BlueEdge is not rendered as projection-blocked', () => {
    assert.equal(beVisualState.is_projection_blocked, false);
    assert.equal(beVisualState.is_blocked, false);
  });

  it('BlueEdge severity is expansion-constrained not critical', () => {
    assert.equal(beVisualState.severity_class, 'expansion');
    assert.equal(beVisualState.posture, 'constrained');
    assert.notEqual(beVisualState.posture, 'critical');
  });

  it('BlueEdge blocker label uses expansion language not critical', () => {
    assert.ok(beVisualState.blocker_label.includes('Expansion') || beVisualState.blocker_label.includes('Grounding'),
      `blocker_label should use expansion language: ${beVisualState.blocker_label}`);
    assert.ok(!beVisualState.blocker_label.includes('Critical'),
      'blocker_label should not use critical language');
  });

  it('BlueEdge operational label is Expansion Constrained', () => {
    assert.equal(beVisualState.operational_label, 'Expansion Constrained');
  });

  it('BlueEdge state label reflects projection-authorized status', () => {
    assert.ok(beVisualState.state_label.includes('Projection-Authorized') || beVisualState.state_label.includes('Qualified'),
      `state_label should reflect authorized status: ${beVisualState.state_label}`);
  });

  it('BlueEdge chromatic class is blue not red', () => {
    assert.equal(beVisualState.chromatic_class, 'sqo-state--blue');
    assert.notEqual(beVisualState.blocker_class, 'sqo-blocker--critical');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. FastAPI Remains Escalation-Class
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI Severity Preservation', () => {
  it('FastAPI remains projection-blocked', () => {
    assert.equal(faVisualState.is_projection_blocked, true);
    assert.equal(faVisualState.is_blocked, true);
  });

  it('FastAPI severity class is projection', () => {
    assert.equal(faVisualState.severity_class, 'projection');
    assert.equal(faVisualState.posture, 'critical');
  });

  it('FastAPI blocker class is critical', () => {
    assert.equal(faVisualState.blocker_class, 'sqo-blocker--critical');
  });

  it('FastAPI state label indicates onboarding required', () => {
    assert.ok(faVisualState.state_label.includes('Onboarding'),
      `state_label should indicate onboarding: ${faVisualState.state_label}`);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Blocker Classification Split
// ────────────────────────────────────────────────────────────────────────────

describe('Blocker Classification Split', () => {
  it('MISSING_QUALIFICATION_ARTIFACTS is Class A (projection)', () => {
    const vis = BLOCKER_VISUAL.MISSING_QUALIFICATION_ARTIFACTS;
    assert.equal(vis.severity_class, 'projection');
    assert.equal(vis.severity, 'critical');
    assert.equal(vis.frame, 'escalation');
  });

  it('GROUNDING_GAPS is Class C (expansion)', () => {
    const vis = BLOCKER_VISUAL.GROUNDING_GAPS;
    assert.equal(vis.severity_class, 'expansion');
    assert.equal(vis.severity, 'constrained');
    assert.equal(vis.frame, 'progression');
  });

  it('MIXED_BLOCKERS is Class B (qualification)', () => {
    const vis = BLOCKER_VISUAL.MIXED_BLOCKERS;
    assert.equal(vis.severity_class, 'qualification');
    assert.equal(vis.severity, 'operational');
    assert.equal(vis.frame, 'remediation');
  });

  it('S3 expansion gaps render differently from S2 qualification artifacts', () => {
    const projVs = resolveVisualState('S1', 'MISSING_QUALIFICATION_ARTIFACTS');
    const expVs = resolveVisualState('S2', 'GROUNDING_GAPS');
    assert.notEqual(projVs.blocker_class, expVs.blocker_class);
    assert.notEqual(projVs.severity_class, expVs.severity_class);
    assert.notEqual(projVs.posture, expVs.posture);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Progression Semantics
// ────────────────────────────────────────────────────────────────────────────

describe('Progression Semantics Correction', () => {
  it('expansion-constrained attention is not escalated', () => {
    const beVs = resolveVisualState(beJourney.banner.s_state, beJourney.banner.blocker_class);
    const attn = resolveAttentionHierarchy(beJourney, beVs);
    const blockerZone = attn.zones.find(z => z.id === 'blockers');
    assert.notEqual(blockerZone.emphasis, 'escalated');
    assert.equal(blockerZone.emphasis, 'constrained');
  });

  it('projection-blocked attention is escalated', () => {
    const faVs = resolveVisualState(faJourney.banner.s_state, faJourney.banner.blocker_class);
    const attn = resolveAttentionHierarchy(faJourney, faVs);
    const blockerZone = attn.zones.find(z => z.id === 'blockers');
    assert.equal(blockerZone.emphasis, 'escalated');
  });

  it('BlueEdge primary focus is operator_action not blockers', () => {
    const beVs = resolveVisualState(beJourney.banner.s_state, beJourney.banner.blocker_class);
    const attn = resolveAttentionHierarchy(beJourney, beVs);
    assert.equal(attn.primary_focus, 'operator_action');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Governance Compliance
// ────────────────────────────────────────────────────────────────────────────

describe('Severity Correction Governance', () => {
  it('no client-name branching in visual state resolver', () => {
    const fs = require('node:fs');
    const source = fs.readFileSync(
      path.join(__dirname, '..', '..', 'lib', 'sqo-cockpit', 'QualificationVisualStateResolver.js'),
      'utf-8'
    );
    assert.ok(!source.includes('fastapi'), 'should not reference fastapi');
    assert.ok(!source.includes('blueedge'), 'should not reference blueedge');
  });

  it('no AI language in severity labels', () => {
    const aiTerms = ['recommend', 'suggest', 'believe', 'think', 'feel', 'opinion'];
    for (const [key, vis] of Object.entries(BLOCKER_VISUAL)) {
      for (const term of aiTerms) {
        assert.ok(!vis.label.toLowerCase().includes(term),
          `BLOCKER_VISUAL.${key}.label contains AI language`);
        assert.ok(!vis.operational_label.toLowerCase().includes(term),
          `BLOCKER_VISUAL.${key}.operational_label contains AI language`);
      }
    }
  });

  it('no artifact mutation during severity resolution', () => {
    const faLoad = loadAllCockpitArtifacts(FA_CLIENT, FA_RUN);
    const origCount = faLoad.loaded_count;
    const journey = resolveQualificationJourney(faLoad);
    resolveVisualState(journey.banner.s_state, journey.banner.blocker_class);
    assert.equal(faLoad.loaded_count, origCount);
  });

  it('no PATH B or LENS coupling', () => {
    const fs = require('node:fs');
    const source = fs.readFileSync(
      path.join(__dirname, '..', '..', 'lib', 'sqo-cockpit', 'QualificationVisualStateResolver.js'),
      'utf-8'
    );
    assert.ok(!source.includes('PATH_B'));
    assert.ok(!source.includes('LENS'));
  });

  it('full visual state is deterministic', () => {
    const vs1 = resolveVisualState('S2', 'GROUNDING_GAPS');
    const vs2 = resolveVisualState('S2', 'GROUNDING_GAPS');
    assert.deepStrictEqual(vs1, vs2);
  });
});
