'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  mapNarrativeRenderState,
  mapNarrativeQualifierBanner,
  mapNarrativeDensity,
  scanNarrativeText,
} = require('../NarrativeSemanticMapper');

const { resolveDensityLayout } = require('../NarrativeDensityController');

const { NARRATIVE_EXECUTIVE_READY_FIXTURE } = require('../fixtures/narrative_executive_ready.fixture');
const { NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE } = require('../fixtures/narrative_executive_ready_q01.fixture');
const { NARRATIVE_EXECUTIVE_READY_Q02_FIXTURE } = require('../fixtures/narrative_executive_ready_q02.fixture');
const { NARRATIVE_DIAGNOSTIC_FIXTURE } = require('../fixtures/narrative_diagnostic.fixture');
const { NARRATIVE_BLOCKED_FIXTURE } = require('../fixtures/narrative_blocked.fixture');
const { NARRATIVE_STRUCTURAL_FINDINGS_FIXTURE } = require('../fixtures/narrative_structural_findings.fixture');
const { NARRATIVE_WHY_RENDER_FIXTURE } = require('../fixtures/narrative_why_render.fixture');
const { NARRATIVE_DENSITY_BALANCED_FIXTURE } = require('../fixtures/narrative_density_balanced.fixture');
const { NARRATIVE_DENSITY_DENSE_FIXTURE } = require('../fixtures/narrative_density_dense.fixture');
const { NARRATIVE_FORBIDDEN_PROMPT_FIXTURE } = require('../fixtures/narrative_forbidden_prompt.fixture');
const { NARRATIVE_FORBIDDEN_GEIOS_FIXTURE } = require('../fixtures/narrative_forbidden_geios_internal.fixture');

// ─── 1. Render state mapping ──────────────────────────────────────────────────

describe('mapNarrativeRenderState — EXECUTIVE_READY', () => {
  test('returns FULL_EXECUTIVE narrative_mode', () => {
    const result = mapNarrativeRenderState(NARRATIVE_EXECUTIVE_READY_FIXTURE.renderState);
    assert.equal(result.narrative_mode, NARRATIVE_EXECUTIVE_READY_FIXTURE.expected_mode);
  });

  test('returns correct surface_token', () => {
    const result = mapNarrativeRenderState(NARRATIVE_EXECUTIVE_READY_FIXTURE.renderState);
    assert.equal(result.surface_token, NARRATIVE_EXECUTIVE_READY_FIXTURE.expected_surface_token);
  });

  test('qualifier_banner_active is false for EXECUTIVE_READY', () => {
    const result = mapNarrativeRenderState('EXECUTIVE_READY');
    assert.equal(result.qualifier_banner_active, false);
  });

  test('all_sections_visible is true for EXECUTIVE_READY', () => {
    const result = mapNarrativeRenderState('EXECUTIVE_READY');
    assert.equal(result.all_sections_visible, true);
  });

  test('no error on known state', () => {
    const result = mapNarrativeRenderState('EXECUTIVE_READY');
    assert.equal(result.error, null);
  });
});

describe('mapNarrativeRenderState — EXECUTIVE_READY_WITH_QUALIFIER', () => {
  test('returns QUALIFIED_EXECUTIVE mode', () => {
    const result = mapNarrativeRenderState(NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE.renderState);
    assert.equal(result.narrative_mode, NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE.expected_mode);
  });

  test('qualifier_banner_active is true', () => {
    const result = mapNarrativeRenderState('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.qualifier_banner_active, true);
  });

  test('all_sections_visible is true', () => {
    const result = mapNarrativeRenderState('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.all_sections_visible, true);
  });
});

describe('mapNarrativeRenderState — DIAGNOSTIC_ONLY', () => {
  test('returns DIAGNOSTIC_FRAME mode', () => {
    const result = mapNarrativeRenderState(NARRATIVE_DIAGNOSTIC_FIXTURE.renderState);
    assert.equal(result.narrative_mode, NARRATIVE_DIAGNOSTIC_FIXTURE.expected_mode);
  });

  test('diagnostic_notice is populated', () => {
    const result = mapNarrativeRenderState('DIAGNOSTIC_ONLY');
    assert.equal(result.diagnostic_notice, NARRATIVE_DIAGNOSTIC_FIXTURE.expected_diagnostic_notice);
  });

  test('surface_token matches fixture', () => {
    const result = mapNarrativeRenderState('DIAGNOSTIC_ONLY');
    assert.equal(result.surface_token, NARRATIVE_DIAGNOSTIC_FIXTURE.expected_surface_token);
  });
});

describe('mapNarrativeRenderState — BLOCKED', () => {
  test('returns BLOCKED mode', () => {
    const result = mapNarrativeRenderState(NARRATIVE_BLOCKED_FIXTURE.renderState);
    assert.equal(result.narrative_mode, NARRATIVE_BLOCKED_FIXTURE.expected_mode);
  });

  test('blocked_notice populated with required text', () => {
    const result = mapNarrativeRenderState('BLOCKED');
    assert.equal(result.blocked_notice, NARRATIVE_BLOCKED_FIXTURE.expected_blocked_notice);
  });

  test('all_sections_visible is false', () => {
    const result = mapNarrativeRenderState('BLOCKED');
    assert.equal(result.all_sections_visible, NARRATIVE_BLOCKED_FIXTURE.expected_all_sections_visible);
  });

  test('qualifier_banner_active is false', () => {
    const result = mapNarrativeRenderState('BLOCKED');
    assert.equal(result.qualifier_banner_active, false);
  });

  test('unknown state fails closed to BLOCKED', () => {
    const result = mapNarrativeRenderState('UNKNOWN_STATE');
    assert.equal(result.narrative_mode, 'BLOCKED');
    assert.ok(result.error && result.error.includes('NSM-01'));
  });

  test('null state fails closed to BLOCKED', () => {
    const result = mapNarrativeRenderState(null);
    assert.equal(result.narrative_mode, 'BLOCKED');
  });
});

// ─── 2. Qualifier banner mapping ─────────────────────────────────────────────

describe('mapNarrativeQualifierBanner — Q-00', () => {
  test('renders is false for Q-00', () => {
    const result = mapNarrativeQualifierBanner('Q-00');
    assert.equal(result.renders, false);
  });

  test('banner_text is null for Q-00', () => {
    const result = mapNarrativeQualifierBanner('Q-00');
    assert.equal(result.banner_text, null);
  });
});

describe('mapNarrativeQualifierBanner — Q-01', () => {
  test('renders is true', () => {
    const result = mapNarrativeQualifierBanner('Q-01');
    assert.equal(result.renders, NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE.expected_banner_renders);
  });

  test('banner_token matches', () => {
    const result = mapNarrativeQualifierBanner('Q-01');
    assert.equal(result.banner_token, NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE.expected_banner_token);
  });

  test('banner_text is populated', () => {
    const result = mapNarrativeQualifierBanner('Q-01');
    assert.ok(result.banner_text && result.banner_text.length > 0);
  });
});

describe('mapNarrativeQualifierBanner — Q-04', () => {
  test('renders is false', () => {
    const result = mapNarrativeQualifierBanner('Q-04');
    assert.equal(result.renders, false);
  });

  test('absence_notice is populated — Signal intelligence withheld', () => {
    const result = mapNarrativeQualifierBanner('Q-04');
    assert.equal(result.absence_notice, 'Signal intelligence withheld from this view.');
  });

  test('unknown qualifier fails closed with NSM-02 error', () => {
    const result = mapNarrativeQualifierBanner('Q-99');
    assert.equal(result.renders, false);
    assert.ok(result.error && result.error.includes('NSM-02'));
  });
});

// ─── 3. Density layout — structural findings ──────────────────────────────────

describe('resolveDensityLayout — structural findings preservation', () => {
  test('EXECUTIVE_DENSE shows structural findings when present', () => {
    const layout = resolveDensityLayout(
      NARRATIVE_STRUCTURAL_FINDINGS_FIXTURE.densityClass,
      { structural_summary: NARRATIVE_STRUCTURAL_FINDINGS_FIXTURE.structural_summary }
    );
    assert.equal(layout.show_structural_findings, NARRATIVE_STRUCTURAL_FINDINGS_FIXTURE.expected_show_structural_findings);
  });

  test('max_primary_findings matches fixture', () => {
    const layout = resolveDensityLayout(
      NARRATIVE_STRUCTURAL_FINDINGS_FIXTURE.densityClass,
      { structural_summary: NARRATIVE_STRUCTURAL_FINDINGS_FIXTURE.structural_summary }
    );
    assert.equal(layout.max_primary_findings, NARRATIVE_STRUCTURAL_FINDINGS_FIXTURE.expected_max_primary_findings);
  });

  test('evidence_references_preserved is always true — DENSE', () => {
    const layout = resolveDensityLayout('EXECUTIVE_DENSE', { structural_summary: 'x' });
    assert.equal(layout.evidence_references_preserved, true);
  });
});

describe('resolveDensityLayout — EXECUTIVE_DENSE', () => {
  test('all sections visible in DENSE mode when props present', () => {
    const layout = resolveDensityLayout(
      NARRATIVE_DENSITY_DENSE_FIXTURE.densityClass,
      NARRATIVE_DENSITY_DENSE_FIXTURE.narrativeProps
    );
    assert.equal(layout.show_executive_summary, NARRATIVE_DENSITY_DENSE_FIXTURE.expected.show_executive_summary);
    assert.equal(layout.show_why_statement, NARRATIVE_DENSITY_DENSE_FIXTURE.expected.show_why_statement);
    assert.equal(layout.show_structural_findings, NARRATIVE_DENSITY_DENSE_FIXTURE.expected.show_structural_findings);
  });

  test('max_primary_findings is 3 in DENSE', () => {
    const layout = resolveDensityLayout(NARRATIVE_DENSITY_DENSE_FIXTURE.densityClass, NARRATIVE_DENSITY_DENSE_FIXTURE.narrativeProps);
    assert.equal(layout.max_primary_findings, NARRATIVE_DENSITY_DENSE_FIXTURE.expected.max_primary_findings);
  });

  test('evidence_references_preserved is true in DENSE', () => {
    const layout = resolveDensityLayout(NARRATIVE_DENSITY_DENSE_FIXTURE.densityClass, NARRATIVE_DENSITY_DENSE_FIXTURE.narrativeProps);
    assert.equal(layout.evidence_references_preserved, NARRATIVE_DENSITY_DENSE_FIXTURE.expected.evidence_references_preserved);
  });
});

describe('resolveDensityLayout — EXECUTIVE_BALANCED', () => {
  test('structural findings hidden in BALANCED', () => {
    const layout = resolveDensityLayout(
      NARRATIVE_DENSITY_BALANCED_FIXTURE.densityClass,
      NARRATIVE_DENSITY_BALANCED_FIXTURE.narrativeProps
    );
    assert.equal(layout.show_structural_findings, NARRATIVE_DENSITY_BALANCED_FIXTURE.expected.show_structural_findings);
  });

  test('max_primary_findings is 2 in BALANCED', () => {
    const layout = resolveDensityLayout(NARRATIVE_DENSITY_BALANCED_FIXTURE.densityClass, NARRATIVE_DENSITY_BALANCED_FIXTURE.narrativeProps);
    assert.equal(layout.max_primary_findings, NARRATIVE_DENSITY_BALANCED_FIXTURE.expected.max_primary_findings);
  });

  test('evidence_references_preserved is always true in BALANCED', () => {
    const layout = resolveDensityLayout(NARRATIVE_DENSITY_BALANCED_FIXTURE.densityClass, NARRATIVE_DENSITY_BALANCED_FIXTURE.narrativeProps);
    assert.equal(layout.evidence_references_preserved, true);
  });

  test('executive summary still shown in BALANCED', () => {
    const layout = resolveDensityLayout(NARRATIVE_DENSITY_BALANCED_FIXTURE.densityClass, NARRATIVE_DENSITY_BALANCED_FIXTURE.narrativeProps);
    assert.equal(layout.show_executive_summary, NARRATIVE_DENSITY_BALANCED_FIXTURE.expected.show_executive_summary);
  });
});

// ─── 4. WHY narrative block ───────────────────────────────────────────────────

describe('WHY narrative render — fixture', () => {
  test('show_why_statement is true for EXECUTIVE_DENSE with why_primary_statement', () => {
    const layout = resolveDensityLayout(
      NARRATIVE_WHY_RENDER_FIXTURE.densityClass,
      { why_primary_statement: NARRATIVE_WHY_RENDER_FIXTURE.why_primary_statement }
    );
    assert.equal(layout.show_why_statement, NARRATIVE_WHY_RENDER_FIXTURE.expected_show_why_statement);
  });

  test('why_default_expanded is true', () => {
    const layout = resolveDensityLayout(
      NARRATIVE_WHY_RENDER_FIXTURE.densityClass,
      { why_primary_statement: NARRATIVE_WHY_RENDER_FIXTURE.why_primary_statement }
    );
    assert.equal(layout.why_default_expanded, NARRATIVE_WHY_RENDER_FIXTURE.expected_why_default_expanded);
  });
});

// ─── 5. No narrative generation ───────────────────────────────────────────────

describe('No narrative generation — pass-through only', () => {
  test('mapNarrativeRenderState does not modify input text', () => {
    const input = 'EXECUTIVE_READY';
    const result = mapNarrativeRenderState(input);
    assert.equal(input, 'EXECUTIVE_READY');
    assert.ok(result.narrative_mode);
  });

  test('resolveDensityLayout does not modify narrativeProps', () => {
    const props = { executive_summary: 'Original text.', why_primary_statement: 'Original why.' };
    const propsCopy = { ...props };
    resolveDensityLayout('EXECUTIVE_DENSE', props);
    assert.deepEqual(props, propsCopy);
  });

  test('executive_summary content is never rewritten by mapper', () => {
    const original = 'Execution topology shows concentrated pressure in the primary delivery domain.';
    const props = { executive_summary: original };
    const layout = resolveDensityLayout('EXECUTIVE_DENSE', props);
    assert.equal(layout.has_executive_summary, true);
    assert.equal(props.executive_summary, original);
  });
});

// ─── 6. Forbidden vocabulary scan ─────────────────────────────────────────────

describe('scanNarrativeText — recommendation language (NORM-FORBID-02)', () => {
  test('detects "we recommend" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.recommendation_text);
    assert.ok(scan.violations.length > 0);
    assert.ok(scan.recommendation.some(v => v.toLowerCase() === 'we recommend'));
  });

  test('detects "the team should" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.recommendation_text);
    assert.ok(scan.recommendation.some(v => v.toLowerCase() === 'the team should'));
  });

  test('detects "address this" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.recommendation_text);
    assert.ok(scan.recommendation.some(v => v.toLowerCase() === 'address this'));
  });
});

describe('scanNarrativeText — predictive language (NORM-FORBID-01)', () => {
  test('detects "will result in" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.predictive_text);
    assert.ok(scan.predictive.some(v => v.toLowerCase() === 'will result in'));
  });
});

describe('scanNarrativeText — AI phrasing (NORM-FORBID-04)', () => {
  test('detects "I think" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.ai_phrasing_text);
    assert.ok(scan.ai_phrasing.some(v => v.toLowerCase() === 'i think'));
  });

  test('detects "Let me explain" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.ai_phrasing_text);
    assert.ok(scan.ai_phrasing.some(v => v.toLowerCase() === 'let me explain'));
  });
});

describe('scanNarrativeText — speculative language (NORM-FORBID-03)', () => {
  test('detects "possibly" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.speculative_text);
    assert.ok(scan.speculative.some(v => v.toLowerCase() === 'possibly'));
  });

  test('detects "perhaps" violation', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_PROMPT_FIXTURE.speculative_text);
    assert.ok(scan.speculative.some(v => v.toLowerCase() === 'perhaps'));
  });
});

describe('scanNarrativeText — GEIOS internal identifiers', () => {
  test('GEIOS text has violations', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_GEIOS_FIXTURE.geios_text);
    assert.equal(scan.violations.length > 0, NARRATIVE_FORBIDDEN_GEIOS_FIXTURE.expected.geios_text_has_violations);
  });

  test('clean text has no violations', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_GEIOS_FIXTURE.clean_text);
    assert.equal(scan.violations.length === 0, !NARRATIVE_FORBIDDEN_GEIOS_FIXTURE.expected.clean_text_has_violations);
    assert.equal(scan.violations.length, 0);
  });

  test('DPSIG detected as GEIOS identifier', () => {
    const scan = scanNarrativeText(NARRATIVE_FORBIDDEN_GEIOS_FIXTURE.geios_text);
    assert.ok(NARRATIVE_FORBIDDEN_GEIOS_FIXTURE.expected.geios_identifiers_in_geios_text.every(id => {
      return scan.geios.includes(id);
    }));
  });
});

// ─── 7. Clean executive narrative passes scan ──────────────────────────────────

describe('scanNarrativeText — governed narrative fixtures pass clean', () => {
  test('EXECUTIVE_READY executive_summary has no violations', () => {
    const scan = scanNarrativeText(NARRATIVE_EXECUTIVE_READY_FIXTURE.narrativeProps.executive_summary);
    assert.equal(scan.violations.length, 0);
  });

  test('EXECUTIVE_READY why_primary_statement has no violations', () => {
    const scan = scanNarrativeText(NARRATIVE_EXECUTIVE_READY_FIXTURE.narrativeProps.why_primary_statement);
    assert.equal(scan.violations.length, 0);
  });

  test('EXECUTIVE_READY structural_summary has no violations', () => {
    const scan = scanNarrativeText(NARRATIVE_EXECUTIVE_READY_FIXTURE.narrativeProps.structural_summary);
    assert.equal(scan.violations.length, 0);
  });

  test('Q-01 narrative has no violations', () => {
    const scan = scanNarrativeText(NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE.narrativeProps.executive_summary);
    assert.equal(scan.violations.length, 0);
  });

  test('DIAGNOSTIC narrative has no forbidden patterns (beyond advisory)', () => {
    const scan = scanNarrativeText(NARRATIVE_DIAGNOSTIC_FIXTURE.narrativeProps.structural_summary);
    assert.equal(scan.violations.length, 0);
  });
});

// ─── 8. Governance: determinism ──────────────────────────────────────────────

describe('Determinism — same input produces same output', () => {
  test('mapNarrativeRenderState is deterministic', () => {
    const r1 = mapNarrativeRenderState('EXECUTIVE_READY');
    const r2 = mapNarrativeRenderState('EXECUTIVE_READY');
    assert.deepEqual(r1, r2);
  });

  test('mapNarrativeQualifierBanner is deterministic', () => {
    const r1 = mapNarrativeQualifierBanner('Q-02');
    const r2 = mapNarrativeQualifierBanner('Q-02');
    assert.deepEqual(r1, r2);
  });

  test('resolveDensityLayout is deterministic', () => {
    const props = { executive_summary: 'Test.', why_primary_statement: 'Why.', structural_summary: 'Struct.' };
    const r1 = resolveDensityLayout('EXECUTIVE_DENSE', props);
    const r2 = resolveDensityLayout('EXECUTIVE_DENSE', props);
    assert.deepEqual(r1, r2);
  });
});

// ─── 9. Governance: no mutation ──────────────────────────────────────────────

describe('No mutation — input objects not modified', () => {
  test('mapNarrativeDensity does not modify NARRATIVE_DENSITY_MAP entries', () => {
    const before = JSON.stringify(mapNarrativeDensity('EXECUTIVE_DENSE'));
    mapNarrativeDensity('EXECUTIVE_DENSE');
    const after = JSON.stringify(mapNarrativeDensity('EXECUTIVE_DENSE'));
    assert.equal(before, after);
  });

  test('resolveDensityLayout spreads density — does not modify source', () => {
    const props = { executive_summary: 'Original' };
    resolveDensityLayout('EXECUTIVE_BALANCED', props);
    assert.equal(props.executive_summary, 'Original');
  });
});

// ─── 10. scanNarrativeText edge cases ────────────────────────────────────────

describe('scanNarrativeText — edge cases', () => {
  test('null input returns empty violations', () => {
    const scan = scanNarrativeText(null);
    assert.equal(scan.violations.length, 0);
  });

  test('empty string returns empty violations', () => {
    const scan = scanNarrativeText('');
    assert.equal(scan.violations.length, 0);
  });

  test('non-string input returns empty violations', () => {
    const scan = scanNarrativeText(42);
    assert.equal(scan.violations.length, 0);
  });

  test('all violation categories present in result', () => {
    const scan = scanNarrativeText('');
    assert.ok('violations' in scan);
    assert.ok('predictive' in scan);
    assert.ok('recommendation' in scan);
    assert.ok('speculative' in scan);
    assert.ok('ai_phrasing' in scan);
    assert.ok('geios' in scan);
  });
});
