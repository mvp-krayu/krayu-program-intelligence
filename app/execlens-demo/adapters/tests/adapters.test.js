'use strict';

/**
 * adapters.test.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Comprehensive test suite for all 14 rendering adapters.
 * Tests: input validation, surface mode resolution, readiness badge, qualifier chip,
 * narrative pass-through, evidence adapters, signal card, trace panel,
 * explainability bundle, topology summary, blocked/diagnostic state,
 * audit lineage, pipeline determinism, no-mutation guarantees.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');

const { adaptReport } = require('../index');
const { resolveSurfaceMode, resolveDensityClass } = require('../SurfaceModeResolver');
const { adaptReadinessBadge, READINESS_BADGE_MAP } = require('../ReadinessBadgeAdapter');
const { adaptQualifierChip, QUALIFIER_CHIP_MAP } = require('../QualifierChipAdapter');
const { adaptNarrative } = require('../NarrativeAdapter');
const { adaptEvidencePanel } = require('../EvidencePanelAdapter');
const { adaptEvidenceDrawer } = require('../EvidenceDrawerAdapter');
const { adaptSignalCard, PRESSURE_TIER_MAP } = require('../SignalCardAdapter');
const { adaptTracePanel } = require('../TracePanelAdapter');
const { adaptExplainabilityBundle } = require('../ExplainabilityBundleAdapter');
const { adaptTopologySummary } = require('../TopologySummaryAdapter');
const { adaptBlockedState } = require('../BlockedStateAdapter');
const { adaptDiagnosticState } = require('../DiagnosticStateAdapter');
const { adaptAuditLineage } = require('../AuditLineageAdapter');

const { ADAPTER_VALID_EXECUTIVE_READY } = require('../fixtures/adapter_valid_executive_ready.fixture');
const { ADAPTER_VALID_EXECUTIVE_READY_WITH_QUALIFIER } = require('../fixtures/adapter_valid_executive_ready_with_qualifier.fixture');
const { ADAPTER_VALID_DIAGNOSTIC } = require('../fixtures/adapter_valid_diagnostic.fixture');
const { ADAPTER_VALID_BLOCKED } = require('../fixtures/adapter_valid_blocked.fixture');
const { ADAPTER_MISSING_PANEL_REJECTED } = require('../fixtures/adapter_missing_panel_rejected.fixture');
const { ADAPTER_Q04_ABSENCE_NOTICE } = require('../fixtures/adapter_q04_absence_notice.fixture');
const { ADAPTER_FORBIDDEN_RAW_SIGNAL_KEY } = require('../fixtures/adapter_forbidden_raw_signal_key.fixture');
const { ADAPTER_FORBIDDEN_GEIOS_INTERNAL } = require('../fixtures/adapter_forbidden_geios_internal.fixture');
const { ADAPTER_NO_MUTATION_FIXTURE, ADAPTER_NO_MUTATION_SNAPSHOT } = require('../fixtures/adapter_no_mutation_fixture.fixture');

// ── PIPELINE INTEGRATION ────────────────────────────────────────────────────

test('PIPELINE: EXECUTIVE_READY fixture routes to EXECUTIVE_READY', () => {
  const result = adaptReport(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  assert.equal(result.renderState, 'EXECUTIVE_READY');
  assert.ok(result.readinessBadge, 'readinessBadge must be present');
  assert.ok(result.qualifierChip, 'qualifierChip must be present');
  assert.ok(result.narrative, 'narrative must be present');
  assert.equal(result.blockedState, null);
});

test('PIPELINE: EXECUTIVE_READY_WITH_QUALIFIER fixture routes correctly', () => {
  const result = adaptReport(ADAPTER_VALID_EXECUTIVE_READY_WITH_QUALIFIER, 'EXECUTIVE');
  assert.equal(result.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
  assert.ok(result.qualifierChip.renders, 'qualifier chip must render for Q-01');
});

test('PIPELINE: BLOCKED fixture returns blocked state, no intelligence', () => {
  const result = adaptReport(ADAPTER_VALID_BLOCKED, 'EXECUTIVE');
  assert.equal(result.renderState, 'BLOCKED');
  assert.ok(result.blockedState, 'blockedState must be present');
  assert.equal(result.readinessBadge, null, 'no readinessBadge for BLOCKED');
  assert.equal(result.narrative, null, 'no narrative for BLOCKED');
  assert.equal(result.evidencePanel, null, 'no evidencePanel for BLOCKED');
});

test('PIPELINE: DIAGNOSTIC_ONLY fixture returns diagnostic state', () => {
  const result = adaptReport(ADAPTER_VALID_DIAGNOSTIC, 'ADVISORY');
  assert.equal(result.renderState, 'DIAGNOSTIC_ONLY');
  assert.ok(result.diagnosticState, 'diagnosticState must be present');
  assert.equal(result.narrative, null, 'no narrative for DIAGNOSTIC_ONLY');
});

test('PIPELINE: null input routes to BLOCKED', () => {
  const result = adaptReport(null, 'EXECUTIVE');
  assert.equal(result.renderState, 'BLOCKED');
  assert.ok(result.blockedState);
});

test('PIPELINE: forbidden GEIOS field → validation blocks before adapters run', () => {
  const result = adaptReport(ADAPTER_FORBIDDEN_GEIOS_INTERNAL, 'EXECUTIVE');
  assert.equal(result.renderState, 'BLOCKED');
  assert.ok(result.validationResult.allErrors.some(e => e.id === 'VAL-GOV-02'));
});

test('PIPELINE DETERMINISTIC: same input always produces same renderState', () => {
  const r1 = adaptReport(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  const r2 = adaptReport(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  const r3 = adaptReport(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  assert.equal(r1.renderState, r2.renderState);
  assert.equal(r2.renderState, r3.renderState);
});

test('PIPELINE NO MUTATION: adaptReport does not mutate reportObject', () => {
  const snapshot = JSON.stringify(ADAPTER_NO_MUTATION_FIXTURE);
  adaptReport(ADAPTER_NO_MUTATION_FIXTURE, 'EXECUTIVE');
  assert.equal(JSON.stringify(ADAPTER_NO_MUTATION_FIXTURE), snapshot,
    'reportObject must not be mutated by adaptReport');
});

// ── SURFACE MODE RESOLVER ───────────────────────────────────────────────────

test('SurfaceModeResolver: EXECUTIVE_READY → EXECUTIVE_READY', () => {
  const { surfaceMode } = resolveSurfaceMode('EXECUTIVE_READY', 'PASS');
  assert.equal(surfaceMode, 'EXECUTIVE_READY');
});

test('SurfaceModeResolver: governance_verdict FAIL → BLOCKED', () => {
  const { surfaceMode } = resolveSurfaceMode('EXECUTIVE_READY', 'FAIL');
  assert.equal(surfaceMode, 'BLOCKED');
});

test('SurfaceModeResolver: BLOCKED_PENDING_DOMAIN_GROUNDING → BLOCKED', () => {
  const { surfaceMode } = resolveSurfaceMode('BLOCKED_PENDING_DOMAIN_GROUNDING', 'PASS');
  assert.equal(surfaceMode, 'BLOCKED');
});

test('SurfaceModeResolver: DIAGNOSTIC_ONLY → DIAGNOSTIC_ONLY', () => {
  const { surfaceMode } = resolveSurfaceMode('DIAGNOSTIC_ONLY', 'PASS');
  assert.equal(surfaceMode, 'DIAGNOSTIC_ONLY');
});

test('SurfaceModeResolver: SUPPRESSED_FROM_EXECUTIVE → STRUCTURAL_ONLY', () => {
  const { surfaceMode } = resolveSurfaceMode('SUPPRESSED_FROM_EXECUTIVE', 'PASS');
  assert.equal(surfaceMode, 'STRUCTURAL_ONLY');
});

test('SurfaceModeResolver: unknown readiness_state → BLOCKED with error', () => {
  const { surfaceMode, error } = resolveSurfaceMode('INVENTED_STATE', 'PASS');
  assert.equal(surfaceMode, 'BLOCKED');
  assert.ok(error, 'error must be present for unknown state');
});

test('DensityResolver: EXECUTIVE → EXECUTIVE_DENSE', () => {
  const { densityClass } = resolveDensityClass('EXECUTIVE');
  assert.equal(densityClass, 'EXECUTIVE_DENSE');
});

test('DensityResolver: ADVISORY → INVESTIGATION_DENSE', () => {
  const { densityClass } = resolveDensityClass('ADVISORY');
  assert.equal(densityClass, 'INVESTIGATION_DENSE');
});

test('DensityResolver: AUDIT → AUDIT_DENSE', () => {
  const { densityClass } = resolveDensityClass('AUDIT');
  assert.equal(densityClass, 'AUDIT_DENSE');
});

test('DensityResolver: unknown tier → EXECUTIVE_DENSE with warning', () => {
  const { densityClass, warning } = resolveDensityClass('UNKNOWN_TIER');
  assert.equal(densityClass, 'EXECUTIVE_DENSE');
  assert.ok(warning, 'warning must be present for unknown tier');
});

// ── READINESS BADGE ADAPTER ─────────────────────────────────────────────────

test('ReadinessBadgeAdapter: EXECUTIVE_READY → token-ready', () => {
  const result = adaptReadinessBadge(ADAPTER_VALID_EXECUTIVE_READY);
  assert.equal(result.badge_token, 'token-ready');
  assert.equal(result.readiness_label, 'Executive Ready');
  assert.equal(result.error, null);
});

test('ReadinessBadgeAdapter: EXECUTIVE_READY_WITH_QUALIFIER → token-ready-qualified', () => {
  const result = adaptReadinessBadge(ADAPTER_VALID_EXECUTIVE_READY_WITH_QUALIFIER);
  assert.equal(result.badge_token, 'token-ready-qualified');
});

test('ReadinessBadgeAdapter: raw readiness_state enum not in readiness_label', () => {
  const result = adaptReadinessBadge(ADAPTER_VALID_EXECUTIVE_READY);
  assert.ok(!result.readiness_label.includes('EXECUTIVE_READY'),
    'raw enum must not appear in display label');
});

test('ReadinessBadgeAdapter: null input → blocked fallback', () => {
  const result = adaptReadinessBadge(null);
  assert.equal(result.badge_token, 'token-blocked');
  assert.ok(result.error);
});

test('ReadinessBadgeAdapter: qualifier_label is always string (Q-00 = empty string)', () => {
  const result = adaptReadinessBadge(ADAPTER_VALID_EXECUTIVE_READY);
  assert.equal(typeof result.qualifier_label, 'string');
});

test('ReadinessBadgeAdapter: READINESS_BADGE_MAP covers all valid readiness states', () => {
  const states = ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY',
                  'SUPPRESSED_FROM_EXECUTIVE', 'BLOCKED_PENDING_DOMAIN_GROUNDING'];
  states.forEach(state => {
    assert.ok(READINESS_BADGE_MAP[state], `Missing VIS-READY-01 mapping for ${state}`);
  });
});

// ── QUALIFIER CHIP ADAPTER ──────────────────────────────────────────────────

test('QualifierChipAdapter: Q-00 → renders=false', () => {
  const result = adaptQualifierChip('Q-00', '');
  assert.equal(result.renders, false);
  assert.equal(result.chip_label, null);
  assert.equal(result.absence_notice, null);
});

test('QualifierChipAdapter: Q-01 → renders=true, Partial Grounding', () => {
  const result = adaptQualifierChip('Q-01', 'tooltip text');
  assert.equal(result.renders, true);
  assert.equal(result.chip_label, 'Partial Grounding');
  assert.equal(result.chip_token, 'token-qualifier-amber');
});

test('QualifierChipAdapter: Q-02 → renders=true, Structural View', () => {
  const result = adaptQualifierChip('Q-02', '');
  assert.equal(result.renders, true);
  assert.equal(result.chip_label, 'Structural View');
});

test('QualifierChipAdapter: Q-03 → renders=true, Under Review', () => {
  const result = adaptQualifierChip('Q-03', '');
  assert.equal(result.renders, true);
  assert.equal(result.chip_label, 'Under Review');
});

test('QualifierChipAdapter: Q-04 → renders=false, absence_notice present', () => {
  const result = adaptQualifierChip('Q-04', '');
  assert.equal(result.renders, false);
  assert.ok(result.absence_notice && result.absence_notice.length > 0,
    'Q-04 must have explicit absence notice');
  assert.ok(result.absence_notice.includes('withheld'), 'absence notice must reference withheld intelligence');
});

test('QualifierChipAdapter: Q-01..Q-03 never suppress chip (renders always true)', () => {
  ['Q-01', 'Q-02', 'Q-03'].forEach(q => {
    const result = adaptQualifierChip(q, '');
    assert.equal(result.renders, true, `${q} chip must render — suppression prohibited`);
  });
});

test('QualifierChipAdapter: raw Q-xx enum not in chip_label for Q-01..Q-03', () => {
  ['Q-01', 'Q-02', 'Q-03'].forEach(q => {
    const result = adaptQualifierChip(q, '');
    assert.ok(!result.chip_label || !result.chip_label.startsWith('Q-'),
      `raw qualifier enum must not appear in chip_label for ${q}`);
  });
});

// ── NARRATIVE ADAPTER ───────────────────────────────────────────────────────

test('NarrativeAdapter: valid fixture → executive_summary pass-through', () => {
  const result = adaptNarrative(ADAPTER_VALID_EXECUTIVE_READY);
  assert.equal(result.executive_summary,
    ADAPTER_VALID_EXECUTIVE_READY.narrative_block.executive_summary);
  assert.equal(result.error, null);
});

test('NarrativeAdapter: valid fixture → why_primary_statement pass-through', () => {
  const result = adaptNarrative(ADAPTER_VALID_EXECUTIVE_READY);
  assert.equal(result.why_primary_statement,
    ADAPTER_VALID_EXECUTIVE_READY.narrative_block.why_section);
});

test('NarrativeAdapter: absent narrative_block → diagnostic (not blocked)', () => {
  const fixture = { ...ADAPTER_VALID_EXECUTIVE_READY };
  delete fixture.narrative_block;
  const result = adaptNarrative(fixture);
  assert.ok(result.error && result.error.id === 'ADAPT-NARR-01');
  assert.ok(result.diagnosticFields.length > 0);
  assert.equal(result.executive_summary, null);
});

test('NarrativeAdapter: does not generate or rewrite narrative text', () => {
  const result = adaptNarrative(ADAPTER_VALID_EXECUTIVE_READY);
  // Output must exactly match input — no transformation
  assert.equal(result.executive_summary, ADAPTER_VALID_EXECUTIVE_READY.narrative_block.executive_summary);
  assert.equal(result.structural_summary, ADAPTER_VALID_EXECUTIVE_READY.narrative_block.structural_summary);
});

// ── SIGNAL CARD ADAPTER ─────────────────────────────────────────────────────

test('SignalCardAdapter: valid signal_card → mapped pressure token', () => {
  const card = ADAPTER_VALID_EXECUTIVE_READY.evidence_blocks[0].signal_cards[0];
  const result = adaptSignalCard(card);
  assert.equal(result.pressure_token, PRESSURE_TIER_MAP[card.pressure_tier].pressure_token);
  assert.equal(result.error, null);
});

test('SignalCardAdapter: raw cpi_score in signal_label → ADAPT-GOV-01', () => {
  const badCard = ADAPTER_FORBIDDEN_RAW_SIGNAL_KEY.evidence_blocks[0].signal_cards[0];
  const result = adaptSignalCard(badCard);
  assert.ok(result.error && result.error.id === 'ADAPT-GOV-01',
    'cpi_score in signal_label must produce ADAPT-GOV-01');
});

test('SignalCardAdapter: CFA in signal_label → ADAPT-GOV-01', () => {
  const result = adaptSignalCard({ signal_label: 'CFA distribution', pressure_tier: 'LOW',
    qualifier_label: '', evidence_text: 'test' });
  assert.ok(result.error && result.error.id === 'ADAPT-GOV-01');
});

test('SignalCardAdapter: pressure_label is governance-derived display text, not raw enum', () => {
  const card = ADAPTER_VALID_EXECUTIVE_READY.evidence_blocks[0].signal_cards[0];
  const result = adaptSignalCard(card);
  // The display_label must not be the raw tier name
  assert.notEqual(result.pressure_label, card.pressure_tier);
});

test('SignalCardAdapter: PRESSURE_TIER_MAP covers all four tiers', () => {
  ['HIGH', 'ELEVATED', 'MODERATE', 'LOW'].forEach(tier => {
    assert.ok(PRESSURE_TIER_MAP[tier], `Missing VIS-PRESS-01 mapping for ${tier}`);
    assert.ok(!PRESSURE_TIER_MAP[tier].numerical_value || PRESSURE_TIER_MAP[tier].numerical_value === 'FORBIDDEN',
      'Numerical values must be FORBIDDEN per VIS-PRESS-01');
  });
});

// ── EVIDENCE ADAPTERS ───────────────────────────────────────────────────────

test('EvidencePanelAdapter: valid fixture → domains list present', () => {
  const result = adaptEvidencePanel(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  assert.ok(Array.isArray(result.domains) && result.domains.length > 0);
  assert.equal(result.error, null);
});

test('EvidencePanelAdapter: domain ordering ORIGIN → RECEIVER → PASS_THROUGH → ISOLATED', () => {
  const fixture = {
    ...ADAPTER_VALID_EXECUTIVE_READY,
    evidence_blocks: [
      { ...ADAPTER_VALID_EXECUTIVE_READY.evidence_blocks[0], propagation_role: 'ISOLATED', domain_alias: 'D-ISO', grounding_status: 'Q-00', signal_cards: [], evidence_description: 'iso', grounding_label: 'Full' },
      { ...ADAPTER_VALID_EXECUTIVE_READY.evidence_blocks[0], propagation_role: 'ORIGIN', domain_alias: 'D-ORIG', grounding_status: 'Q-00', signal_cards: [], evidence_description: 'orig', grounding_label: 'Full' },
    ],
    topology_scope: ADAPTER_VALID_EXECUTIVE_READY.topology_scope,
  };
  const result = adaptEvidencePanel(fixture, 'EXECUTIVE');
  assert.equal(result.domains[0].propagation_role, 'ORIGIN');
  assert.equal(result.domains[1].propagation_role, 'ISOLATED');
});

test('EvidencePanelAdapter: absent evidence_blocks → ADAPT-EVID-01', () => {
  const fixture = { ...ADAPTER_VALID_EXECUTIVE_READY, evidence_blocks: [] };
  const result = adaptEvidencePanel(fixture, 'EXECUTIVE');
  assert.ok(result.error && result.error.id === 'ADAPT-EVID-01');
  assert.equal(result.domains.length, 0);
});

test('EvidenceDrawerAdapter: Q-04 domain → is_suppressed=true, no signal_cards', () => {
  const block = {
    ...ADAPTER_VALID_EXECUTIVE_READY.evidence_blocks[0],
    grounding_status: 'Q-04',
    domain_alias: 'Withheld Domain',
    grounding_label: 'Withheld',
  };
  const result = adaptEvidenceDrawer(block, 'EXECUTIVE', 0);
  assert.equal(result.is_suppressed, true);
  assert.equal(result.signal_cards.length, 0);
});

test('EvidenceDrawerAdapter: does not use raw domain ID as fallback when domain_alias present', () => {
  const block = ADAPTER_VALID_EXECUTIVE_READY.evidence_blocks[0];
  const result = adaptEvidenceDrawer(block, 'EXECUTIVE', 0);
  assert.ok(result.domain_alias && !result.domain_alias.includes('dom-'),
    'domain_alias must be governance-derived alias, not raw ID');
});

// ── TRACE PANEL ADAPTER ─────────────────────────────────────────────────────

test('TracePanelAdapter: EXECUTIVE tier → default_collapsed=true, no hash', () => {
  const result = adaptTracePanel(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  assert.equal(result.default_collapsed, true);
  assert.equal(result.derivation_ref_abbreviated, null, 'Executive tier must not see hash');
  assert.equal(result.error, null);
});

test('TracePanelAdapter: ADVISORY tier → abbreviated hash present', () => {
  const result = adaptTracePanel(ADAPTER_VALID_EXECUTIVE_READY, 'ADVISORY');
  assert.equal(result.default_collapsed, false);
  assert.ok(result.derivation_ref_abbreviated, 'Advisory tier should see abbreviated hash');
  assert.ok(result.derivation_ref_abbreviated.endsWith('...'),
    'Abbreviated hash must end with ...');
});

test('TracePanelAdapter: AUDIT tier → abbreviated hash (not full decode)', () => {
  const result = adaptTracePanel(ADAPTER_VALID_EXECUTIVE_READY, 'AUDIT');
  assert.ok(result.derivation_ref_abbreviated);
  const fullHash = ADAPTER_VALID_EXECUTIVE_READY.derivation_hash;
  assert.notEqual(result.derivation_ref_abbreviated, fullHash,
    'Full hash must never be in adapter output');
});

test('TracePanelAdapter: propagation_path preserved as-is (aliases only)', () => {
  const result = adaptTracePanel(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  assert.deepEqual(result.propagation_path,
    ADAPTER_VALID_EXECUTIVE_READY.trace_block.propagation_path);
});

test('TracePanelAdapter: absent trace_block → ADAPT-TRACE-01', () => {
  const fixture = { ...ADAPTER_VALID_EXECUTIVE_READY };
  delete fixture.trace_block;
  const result = adaptTracePanel(fixture, 'EXECUTIVE');
  assert.ok(result.error && result.error.id === 'ADAPT-TRACE-01');
});

// ── EXPLAINABILITY BUNDLE ADAPTER ───────────────────────────────────────────

test('ExplainabilityBundleAdapter: valid fixture → all 7 panels present', () => {
  const result = adaptExplainabilityBundle(ADAPTER_VALID_EXECUTIVE_READY, null, 'EXECUTIVE');
  const panelIds = Object.keys(result.panels);
  assert.equal(panelIds.length, 7);
  ['WHY', 'EVIDENCE', 'TRACE', 'QUALIFIERS', 'LINEAGE', 'CONFIDENCE', 'READINESS_STATE']
    .forEach(id => assert.ok(result.panels[id], `Panel ${id} must be present`));
});

test('ExplainabilityBundleAdapter: missing panel → ADAPT-EXPLAIN-01', () => {
  const result = adaptExplainabilityBundle(ADAPTER_MISSING_PANEL_REJECTED, null, 'EXECUTIVE');
  assert.ok(result.errors.some(e => e.id === 'ADAPT-EXPLAIN-01'));
  assert.equal(result.panels['WHY'].panel_state, 'BLOCKED');
});

test('ExplainabilityBundleAdapter: LINEAGE panel → visible_for_tier=false for EXECUTIVE', () => {
  const result = adaptExplainabilityBundle(ADAPTER_VALID_EXECUTIVE_READY, null, 'EXECUTIVE');
  // LINEAGE panel audience is ADVISORY — not visible for EXECUTIVE
  assert.equal(result.panels['LINEAGE'].visible_for_tier, false);
});

test('ExplainabilityBundleAdapter: content_blocks preserved without mutation', () => {
  const original = JSON.stringify(ADAPTER_VALID_EXECUTIVE_READY.explainability_bundle.why_panel.content_blocks);
  adaptExplainabilityBundle(ADAPTER_VALID_EXECUTIVE_READY, null, 'EXECUTIVE');
  const after = JSON.stringify(ADAPTER_VALID_EXECUTIVE_READY.explainability_bundle.why_panel.content_blocks);
  assert.equal(original, after);
});

// ── TOPOLOGY SUMMARY ADAPTER ────────────────────────────────────────────────

test('TopologySummaryAdapter: Phase 2 → phase_2_placeholder=true, read_only=true', () => {
  const result = adaptTopologySummary(ADAPTER_VALID_EXECUTIVE_READY, 2);
  assert.equal(result.phase_2_placeholder, true);
  assert.equal(result.read_only, true);
  assert.equal(result.error, null);
});

test('TopologySummaryAdapter: domain_count preserved from topology_scope', () => {
  const result = adaptTopologySummary(ADAPTER_VALID_EXECUTIVE_READY, 2);
  assert.equal(result.domain_count, ADAPTER_VALID_EXECUTIVE_READY.topology_scope.domain_count);
});

test('TopologySummaryAdapter: absent topology_scope → diagnostic error, placeholder still rendered', () => {
  const fixture = { ...ADAPTER_VALID_EXECUTIVE_READY };
  delete fixture.topology_scope;
  const result = adaptTopologySummary(fixture, 2);
  assert.equal(result.phase_2_placeholder, true);
  assert.ok(result.error && result.error.id === 'ADAPT-TOPO-01');
});

// ── BLOCKED STATE ADAPTER ───────────────────────────────────────────────────

test('BlockedStateAdapter: EXECUTIVE tier → generic message, no internal codes', () => {
  const validationResult = { blockedReason: 'VAL-BLOCK-01: governance FAIL', renderState: 'BLOCKED' };
  const result = adaptBlockedState(validationResult, 'EXECUTIVE');
  assert.ok(result.blocked_headline, 'blocked_headline must be present');
  assert.equal(result.audit_access_available, false);
  // Must not expose internal validation error IDs to executive surface
  assert.ok(!result.blocked_reason.includes('TAXONOMY-01'));
});

test('BlockedStateAdapter: ADVISORY tier → audit_access_available=true', () => {
  const result = adaptBlockedState({ blockedReason: 'reason', renderState: 'BLOCKED' }, 'ADVISORY');
  assert.equal(result.audit_access_available, true);
});

test('BlockedStateAdapter: no fallback intelligence provided', () => {
  const result = adaptBlockedState({ blockedReason: 'reason', renderState: 'BLOCKED' }, 'EXECUTIVE');
  assert.ok(!result.intelligence_content, 'No intelligence fallback must be provided');
  assert.ok(!result.estimated_readiness, 'No estimated readiness must be provided');
});

// ── DIAGNOSTIC STATE ADAPTER ────────────────────────────────────────────────

test('DiagnosticStateAdapter: produces diagnostic banner text', () => {
  const result = adaptDiagnosticState({ diagnosticReasons: ['VAL-DIAG-01: topology incomplete'] }, []);
  assert.ok(result.diagnostic_banner_text && result.diagnostic_banner_text.length > 0);
  assert.ok(result.advisory_notice && result.advisory_notice.length > 0);
});

test('DiagnosticStateAdapter: affected_panel_ids preserved', () => {
  const result = adaptDiagnosticState({ diagnosticReasons: [] }, ['TRACE', 'LINEAGE']);
  assert.deepEqual(result.affected_panel_ids, ['TRACE', 'LINEAGE']);
});

test('DiagnosticStateAdapter: does not promote diagnostic to executive-ready', () => {
  const result = adaptDiagnosticState({ diagnosticReasons: ['reason'] }, []);
  assert.ok(!result.renderState || result.renderState !== 'EXECUTIVE_READY',
    'Diagnostic adapter must not set renderState to EXECUTIVE_READY');
});

// ── AUDIT LINEAGE ADAPTER ───────────────────────────────────────────────────

test('AuditLineageAdapter: EXECUTIVE tier → visible_for_tier=false, no hash', () => {
  const result = adaptAuditLineage(ADAPTER_VALID_EXECUTIVE_READY, 'EXECUTIVE');
  assert.equal(result.visible_for_tier, false);
  assert.equal(result.evidence_hash_display, null);
  assert.equal(result.run_id, null);
});

test('AuditLineageAdapter: ADVISORY tier → abbreviated hash, no run_id', () => {
  const result = adaptAuditLineage(ADAPTER_VALID_EXECUTIVE_READY, 'ADVISORY');
  assert.equal(result.visible_for_tier, true);
  assert.ok(result.evidence_hash_display && result.evidence_hash_display.endsWith('...'));
  assert.equal(result.run_id, null, 'run_id must not be in ADVISORY output');
});

test('AuditLineageAdapter: AUDIT tier → abbreviated hash + run_id', () => {
  const result = adaptAuditLineage(ADAPTER_VALID_EXECUTIVE_READY, 'AUDIT');
  assert.equal(result.visible_for_tier, true);
  assert.ok(result.evidence_hash_display);
  assert.ok(result.run_id, 'run_id must be in AUDIT output');
});

test('AuditLineageAdapter: full evidence hash never in output at any tier', () => {
  const fullHash = ADAPTER_VALID_EXECUTIVE_READY.trace_linkage.evidence_object_hash;
  ['EXECUTIVE', 'ADVISORY', 'AUDIT'].forEach(tier => {
    const result = adaptAuditLineage(ADAPTER_VALID_EXECUTIVE_READY, tier);
    if (result.evidence_hash_display) {
      assert.notEqual(result.evidence_hash_display, fullHash,
        `Full hash must never appear in output for ${tier} tier`);
    }
  });
});

// ── Q-04 ABSENCE NOTICE ─────────────────────────────────────────────────────

test('Q-04: QualifierChipAdapter produces correct absence notice', () => {
  const result = adaptQualifierChip('Q-04', '');
  assert.equal(result.absence_notice, QUALIFIER_CHIP_MAP['Q-04'].absence_notice);
  assert.ok(result.absence_notice.includes('withheld'));
});

test('Q-04 fixture: ADAPTER_Q04_ABSENCE_NOTICE has qualifier_class Q-04', () => {
  assert.equal(ADAPTER_Q04_ABSENCE_NOTICE.qualifier_class, 'Q-04');
});
