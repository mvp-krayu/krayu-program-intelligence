'use strict';

const path = require('node:path');
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { classifyDebtUrgency, DEBT_URGENCY, getNextSState, getDeferredSummary } = require('../../lib/sqo-cockpit/DeferredDebtClassifier');
const { resolveRemediationStages, getCurrentStage, REMEDIATION_STAGES } = require('../../lib/sqo-cockpit/RemediationStageResolver');
const { resolveQualificationJourney, SOURCE_MATERIAL_MAP, MATURATION_NARRATIVES, buildRerunChecklist, buildValidationGates } = require('../../lib/sqo-cockpit/QualificationJourneyResolver');
const { prioritizeWorkflow, PRIORITY_CLASSES, getWorkflowSummary } = require('../../lib/sqo-cockpit/WorkflowPrioritizationEngine');
const { loadAllCockpitArtifacts, getArtifactData } = require('../../lib/sqo-cockpit/SQOCockpitArtifactLoader');

const FA_CLIENT = 'fastapi';
const FA_RUN = 'run_02_oss_fastapi_pipeline';

let faLoadResult;
let faDebtItems;
let faSState;

before(() => {
  faLoadResult = loadAllCockpitArtifacts(FA_CLIENT, FA_RUN);
  const qualState = getArtifactData(faLoadResult, 'qualification_state');
  const debt = getArtifactData(faLoadResult, 'semantic_debt_inventory');
  faSState = qualState.qualification_state.s_state;
  faDebtItems = debt.debt_items;
});

// ────────────────────────────────────────────────────────────────────────────
// 1. DeferredDebtClassifier
// ────────────────────────────────────────────────────────────────────────────

describe('DeferredDebtClassifier', () => {
  it('classifies FastAPI debt into IMMEDIATE, ACTIVE, DEFERRED', () => {
    const classified = classifyDebtUrgency(faDebtItems, faSState);
    assert.ok(classified.immediate.length > 0, 'should have immediate blockers');
    assert.ok(classified.deferred.length > 0, 'should have deferred items');
    assert.equal(classified.counts.total, faDebtItems.length);
  });

  it('marks S2-blocking items as IMMEDIATE for S1 client', () => {
    const classified = classifyDebtUrgency(faDebtItems, 'S1');
    for (const item of classified.immediate) {
      assert.equal(item.blocks_s_state, 'S2', `${item.id} should block S2`);
      assert.equal(item.urgency, DEBT_URGENCY.IMMEDIATE);
    }
  });

  it('marks S3-blocking items as DEFERRED for S1 client', () => {
    const classified = classifyDebtUrgency(faDebtItems, 'S1');
    const s3Deferred = classified.deferred.filter(i => i.blocks_s_state === 'S3');
    assert.ok(s3Deferred.length > 0, 'S3 grounding should be deferred from S1');
    for (const item of s3Deferred) {
      assert.equal(item.urgency, DEBT_URGENCY.DEFERRED);
    }
  });

  it('resolves S-state progression correctly', () => {
    assert.equal(getNextSState('S0'), 'S1');
    assert.equal(getNextSState('S1'), 'S2');
    assert.equal(getNextSState('S2'), 'S3');
    assert.equal(getNextSState('S3'), null);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. RemediationStageResolver
// ────────────────────────────────────────────────────────────────────────────

describe('RemediationStageResolver', () => {
  it('resolves FastAPI debt into remediation stages', () => {
    const stages = resolveRemediationStages(faDebtItems);
    assert.ok(stages.length > 0, 'should have remediation stages');
    for (const stage of stages) {
      assert.ok(stage.has_items, `stage ${stage.id} should have items`);
      assert.ok(stage.item_count > 0);
    }
  });

  it('assigns Stage 1 to missing_artifact blockers', () => {
    const stages = resolveRemediationStages(faDebtItems);
    const stage1 = stages.find(s => s.id === 'SEMANTIC_QUALIFICATION_BLOCKERS');
    if (stage1) {
      for (const item of stage1.items) {
        assert.equal(item.category, 'missing_artifact');
        assert.ok(item.blocks_s_state, `${item.id} should be blocking`);
      }
    }
  });

  it('assigns grounding_gap items to Stage 5', () => {
    const stages = resolveRemediationStages(faDebtItems);
    const stage5 = stages.find(s => s.id === 'GROUNDING_EXPANSION');
    assert.ok(stage5, 'should have grounding expansion stage');
    for (const item of stage5.items) {
      assert.equal(item.category, 'grounding_gap');
    }
  });

  it('returns current stage as first non-empty stage', () => {
    const stages = resolveRemediationStages(faDebtItems);
    const current = getCurrentStage(stages);
    assert.ok(current, 'should have a current stage');
    assert.equal(current.id, stages[0].id);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. QualificationJourneyResolver
// ────────────────────────────────────────────────────────────────────────────

describe('QualificationJourneyResolver', () => {
  it('resolves full journey for FastAPI', () => {
    const journey = resolveQualificationJourney(faLoadResult);
    assert.equal(journey.available, true);
    assert.ok(journey.banner);
    assert.ok(journey.immediateBlockers);
    assert.ok(journey.remediationStages);
    assert.ok(journey.sourceGuidance);
    assert.ok(journey.rerunChecklist);
    assert.ok(journey.validationGates);
    assert.ok(journey.narratives);
  });

  it('banner reflects S1 state for FastAPI', () => {
    const journey = resolveQualificationJourney(faLoadResult);
    assert.equal(journey.banner.s_state, 'S1');
    assert.equal(journey.banner.client, FA_CLIENT);
    assert.ok(journey.banner.blocker_class !== 'NONE', 'FastAPI should have blockers');
  });

  it('source material guidance maps debt categories to materials', () => {
    const journey = resolveQualificationJourney(faLoadResult);
    assert.ok(journey.sourceGuidance.length > 0);
    for (const entry of journey.sourceGuidance) {
      assert.ok(SOURCE_MATERIAL_MAP[entry.category], `${entry.category} should have source mapping`);
      assert.ok(entry.materials.length > 0);
    }
  });

  it('builds S1→S2 validation gates', () => {
    const gates = buildValidationGates('S1');
    assert.equal(gates.target, 'S2');
    assert.equal(gates.current_status, 'NOT_ELIGIBLE');
    assert.ok(gates.gates.length > 0);
    assert.ok(gates.explanation.length > 0);
  });

  it('builds rerun checklist with pre-run requirements', () => {
    const qualState = getArtifactData(faLoadResult, 'qualification_state');
    const debt = getArtifactData(faLoadResult, 'semantic_debt_inventory');
    const missingArtifacts = qualState.evidence ? qualState.evidence.required_artifacts_missing : [];
    const checklist = buildRerunChecklist('S1', missingArtifacts, debt.debt_items);
    assert.ok(checklist.pre_run.length > 0);
    assert.ok(checklist.expected_outputs.length > 0);
    assert.ok(checklist.validation_gates.length > 0);
    assert.equal(typeof checklist.all_pre_run_met, 'boolean');
  });

  it('returns unavailable journey for insufficient data', () => {
    const emptyResult = { ok: true, client: 'test', artifacts: {} };
    const journey = resolveQualificationJourney(emptyResult);
    assert.equal(journey.available, false);
    assert.equal(journey.reason, 'INSUFFICIENT_DATA');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. WorkflowPrioritizationEngine
// ────────────────────────────────────────────────────────────────────────────

describe('WorkflowPrioritizationEngine', () => {
  it('prioritizes FastAPI debt items by class', () => {
    const prioritized = prioritizeWorkflow(faDebtItems, faSState);
    assert.equal(prioritized.length, faDebtItems.length);
    for (let i = 1; i < prioritized.length; i++) {
      assert.ok(prioritized[i].priority_order >= prioritized[i - 1].priority_order,
        'items should be sorted by priority order');
    }
  });

  it('assigns CRITICAL_BLOCKER to critical S2-blocking items', () => {
    const prioritized = prioritizeWorkflow(faDebtItems, 'S1');
    const criticalBlockers = prioritized.filter(i => i.priority_class === 'CRITICAL_BLOCKER');
    for (const item of criticalBlockers) {
      assert.equal(item.blocks_s_state, 'S2');
      assert.equal(item.severity, 'CRITICAL');
    }
  });

  it('generates workflow summary', () => {
    const prioritized = prioritizeWorkflow(faDebtItems, faSState);
    const summary = getWorkflowSummary(prioritized);
    assert.equal(summary.total, faDebtItems.length);
    assert.ok(summary.by_class);
    assert.ok(summary.primary_class);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Governance Compliance
// ────────────────────────────────────────────────────────────────────────────

describe('Governance Compliance', () => {
  it('narratives contain no AI language', () => {
    const aiTerms = ['recommend', 'suggest', 'believe', 'think', 'feel', 'opinion', 'might want to', 'you should', 'we recommend'];
    for (const [state, narr] of Object.entries(MATURATION_NARRATIVES)) {
      for (const [key, text] of Object.entries(narr)) {
        for (const term of aiTerms) {
          assert.ok(!text.toLowerCase().includes(term),
            `MATURATION_NARRATIVES.${state}.${key} contains AI language: "${term}"`);
        }
      }
    }
  });

  it('no mutation occurs during journey resolution', () => {
    const originalLength = faDebtItems.length;
    const originalFirst = { ...faDebtItems[0] };
    resolveQualificationJourney(faLoadResult);
    assert.equal(faDebtItems.length, originalLength);
    assert.equal(faDebtItems[0].id, originalFirst.id);
    assert.equal(faDebtItems[0].severity, originalFirst.severity);
  });

  it('no pipeline execution or side effects', () => {
    const journey = resolveQualificationJourney(faLoadResult);
    assert.equal(journey.available, true);
    assert.ok(!journey.pipelineExecuted, 'should not execute pipeline');
    assert.ok(!journey.mutated, 'should not mutate artifacts');
  });

  it('no PATH B or LENS coupling in journey output', () => {
    const journey = resolveQualificationJourney(faLoadResult);
    const journeyStr = JSON.stringify(journey);
    assert.ok(!journeyStr.includes('PATH_B'), 'should not reference PATH B');
    assert.ok(!journeyStr.includes('pathB'), 'should not reference pathB');
    assert.ok(!journeyStr.includes('lens_projection'), 'should not reference lens projection');
  });

  it('existing SQO cockpit routes remain functional', () => {
    const { validateRouteParams, COCKPIT_SECTIONS } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');
    const validation = validateRouteParams(FA_CLIENT, FA_RUN);
    assert.equal(validation.valid, true);
    assert.ok(COCKPIT_SECTIONS.length >= 7, 'should have at least 7 cockpit sections');
  });
});
