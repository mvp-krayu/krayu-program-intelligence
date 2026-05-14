'use strict';

/**
 * readinessBadgeSystem.test.js
 * PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *
 * Tests for VisualSemanticMapper.js — the governed visual semantic logic layer.
 * Tests run via: node --test
 * No React rendering required — mapper is pure CJS.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  mapReadinessState,
  mapQualifierClass,
  mapGovernanceState,
  mapBlockedState,
  mapDiagnosticState,
  getQualifierTooltip,
  READINESS_BADGE_MAP,
  QUALIFIER_CHIP_MAP,
  BLOCKED_DISPLAY,
  DIAGNOSTIC_DISPLAY,
} = require('../VisualSemanticMapper');

const { READINESS_EXECUTIVE_READY_FIXTURE } = require('../fixtures/readiness_executive_ready.fixture');
const { READINESS_EXECUTIVE_READY_WITH_Q01_FIXTURE } = require('../fixtures/readiness_executive_ready_with_q01.fixture');
const { READINESS_EXECUTIVE_READY_WITH_Q02_FIXTURE } = require('../fixtures/readiness_executive_ready_with_q02.fixture');
const { READINESS_DIAGNOSTIC_ONLY_FIXTURE } = require('../fixtures/readiness_diagnostic_only.fixture');
const { READINESS_BLOCKED_FIXTURE } = require('../fixtures/readiness_blocked.fixture');
const { QUALIFIER_Q00_FIXTURE } = require('../fixtures/qualifier_q00.fixture');
const { QUALIFIER_Q01_FIXTURE } = require('../fixtures/qualifier_q01.fixture');
const { QUALIFIER_Q02_FIXTURE } = require('../fixtures/qualifier_q02.fixture');
const { QUALIFIER_Q03_FIXTURE } = require('../fixtures/qualifier_q03.fixture');
const { QUALIFIER_Q04_ABSENCE_NOTICE_FIXTURE } = require('../fixtures/qualifier_q04_absence_notice.fixture');
const { GOVERNANCE_FAIL_STATE_FIXTURE } = require('../fixtures/governance_fail_state.fixture');

const FORBIDDEN_GEIOS_IDENTIFIERS = [
  'TAXONOMY-01', 'signal_value', 'activation_state', 'signal_stable_key',
  'DPSIG', 'EXSIG', 'canonical_topology.json', 'GEIOS', 'GEIOS substrate',
  'cpi_score', 'cfa_score', 'CPI', 'CFA',
];

const FORBIDDEN_AI_TERMS = [
  'AI', 'artificial intelligence', 'LLM', 'large language model',
  'prompt', 'embedding', 'RAG', 'hallucination', 'copilot',
];

const FORBIDDEN_PROBABILISTIC_LANGUAGE = [
  'possibly', 'perhaps', 'maybe', 'might indicate', 'could suggest',
  'uncertain', 'unclear', 'confidence:', '% confidence',
];

const RAW_READINESS_ENUM_VALUES = [
  'EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY',
  'SUPPRESSED_FROM_EXECUTIVE', 'BLOCKED_PENDING_DOMAIN_GROUNDING',
];

const RAW_QUALIFIER_ENUM_VALUES = ['Q-00', 'Q-01', 'Q-02', 'Q-03', 'Q-04'];

// ---------------------------------------------------------------------------
// Readiness state mapping — VIS-READY-01
// ---------------------------------------------------------------------------

describe('Readiness state mapping (VIS-READY-01)', () => {
  test('EXECUTIVE_READY → badge_token token-ready', () => {
    const result = mapReadinessState(READINESS_EXECUTIVE_READY_FIXTURE.input.readiness_state);
    assert.strictEqual(result.badge_token, READINESS_EXECUTIVE_READY_FIXTURE.expected.badge_token);
  });

  test('EXECUTIVE_READY → executive_label "Executive Ready"', () => {
    const result = mapReadinessState('EXECUTIVE_READY');
    assert.strictEqual(result.executive_label, 'Executive Ready');
  });

  test('EXECUTIVE_READY_WITH_QUALIFIER → badge_token token-ready-qualified', () => {
    const result = mapReadinessState('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.strictEqual(result.badge_token, 'token-ready-qualified');
  });

  test('EXECUTIVE_READY_WITH_QUALIFIER → executive_label "Executive Ready — Qualified"', () => {
    const result = mapReadinessState('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.strictEqual(result.executive_label, 'Executive Ready — Qualified');
  });

  test('DIAGNOSTIC_ONLY → badge_token token-diagnostic', () => {
    const result = mapReadinessState('DIAGNOSTIC_ONLY');
    assert.strictEqual(result.badge_token, READINESS_DIAGNOSTIC_ONLY_FIXTURE.expected.badge_token);
  });

  test('DIAGNOSTIC_ONLY → executive_label "Under Structural Review"', () => {
    const result = mapReadinessState('DIAGNOSTIC_ONLY');
    assert.strictEqual(result.executive_label, 'Under Structural Review');
  });

  test('SUPPRESSED_FROM_EXECUTIVE → badge_token token-suppressed', () => {
    const result = mapReadinessState('SUPPRESSED_FROM_EXECUTIVE');
    assert.strictEqual(result.badge_token, 'token-suppressed');
  });

  test('SUPPRESSED_FROM_EXECUTIVE → executive_label "Not Available"', () => {
    const result = mapReadinessState('SUPPRESSED_FROM_EXECUTIVE');
    assert.strictEqual(result.executive_label, 'Not Available');
  });

  test('BLOCKED_PENDING_DOMAIN_GROUNDING → badge_token token-blocked', () => {
    const result = mapReadinessState('BLOCKED_PENDING_DOMAIN_GROUNDING');
    assert.strictEqual(result.badge_token, 'token-blocked');
  });

  test('unknown state → fails closed to token-blocked (VIS-BLOCK-02)', () => {
    const result = mapReadinessState('INVALID_STATE');
    assert.strictEqual(result.badge_token, 'token-blocked');
    assert.ok(result.error);
  });

  test('all 5 readiness states covered in READINESS_BADGE_MAP', () => {
    const expectedStates = [
      'EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY',
      'SUPPRESSED_FROM_EXECUTIVE', 'BLOCKED_PENDING_DOMAIN_GROUNDING',
    ];
    expectedStates.forEach(state => {
      assert.ok(READINESS_BADGE_MAP[state], `Missing mapping for ${state}`);
    });
  });
});

// ---------------------------------------------------------------------------
// Raw enum value prohibition in executive labels — VIS-READY-01
// ---------------------------------------------------------------------------

describe('Raw enum values forbidden in executive labels (VIS-READY-01)', () => {
  test('no raw readiness enum values appear in executive_label for any state', () => {
    Object.values(READINESS_BADGE_MAP).forEach(({ executive_label }) => {
      RAW_READINESS_ENUM_VALUES.forEach(raw => {
        assert.ok(
          !executive_label.includes(raw),
          `Raw enum value "${raw}" found in executive_label "${executive_label}"`
        );
      });
    });
  });

  test('no raw qualifier enum values in chip_label for any qualifier', () => {
    Object.values(QUALIFIER_CHIP_MAP).forEach(({ chip_label }) => {
      if (!chip_label) return;
      RAW_QUALIFIER_ENUM_VALUES.forEach(raw => {
        assert.ok(
          !chip_label.includes(raw),
          `Raw qualifier value "${raw}" found in chip_label "${chip_label}"`
        );
      });
    });
  });
});

// ---------------------------------------------------------------------------
// Qualifier chip mapping — VIS-QUAL-01
// ---------------------------------------------------------------------------

describe('Qualifier chip mapping (VIS-QUAL-01)', () => {
  test('Q-00 → renders false', () => {
    const result = mapQualifierClass(QUALIFIER_Q00_FIXTURE.input.qualifier_class);
    assert.strictEqual(result.renders, false);
  });

  test('Q-00 → chip_label null', () => {
    const result = mapQualifierClass('Q-00');
    assert.strictEqual(result.chip_label, null);
  });

  test('Q-01 → renders true (VIS-QUAL-02: persistence enforced)', () => {
    const result = mapQualifierClass(QUALIFIER_Q01_FIXTURE.input.qualifier_class);
    assert.strictEqual(result.renders, true);
  });

  test('Q-01 → chip_label "Partial Grounding"', () => {
    const result = mapQualifierClass('Q-01');
    assert.strictEqual(result.chip_label, QUALIFIER_Q01_FIXTURE.expected.chip_label);
  });

  test('Q-01 → chip_token token-qualifier-amber', () => {
    const result = mapQualifierClass('Q-01');
    assert.strictEqual(result.chip_token, 'token-qualifier-amber');
  });

  test('Q-02 → renders true (VIS-QUAL-02: persistence enforced)', () => {
    const result = mapQualifierClass(QUALIFIER_Q02_FIXTURE.input.qualifier_class);
    assert.strictEqual(result.renders, true);
  });

  test('Q-02 → chip_label "Structural View"', () => {
    const result = mapQualifierClass('Q-02');
    assert.strictEqual(result.chip_label, QUALIFIER_Q02_FIXTURE.expected.chip_label);
  });

  test('Q-02 → chip_token token-qualifier-blue', () => {
    const result = mapQualifierClass('Q-02');
    assert.strictEqual(result.chip_token, 'token-qualifier-blue');
  });

  test('Q-03 → renders true (VIS-QUAL-02: persistence enforced)', () => {
    const result = mapQualifierClass(QUALIFIER_Q03_FIXTURE.input.qualifier_class);
    assert.strictEqual(result.renders, true);
  });

  test('Q-03 → chip_label "Under Review"', () => {
    const result = mapQualifierClass('Q-03');
    assert.strictEqual(result.chip_label, QUALIFIER_Q03_FIXTURE.expected.chip_label);
  });

  test('Q-03 → chip_token token-qualifier-grey', () => {
    const result = mapQualifierClass('Q-03');
    assert.strictEqual(result.chip_token, 'token-qualifier-grey');
  });

  test('Q-04 → renders false', () => {
    const result = mapQualifierClass(QUALIFIER_Q04_ABSENCE_NOTICE_FIXTURE.input.qualifier_class);
    assert.strictEqual(result.renders, false);
  });

  test('Q-04 → absence_notice "Signal intelligence withheld from this view."', () => {
    const result = mapQualifierClass('Q-04');
    assert.strictEqual(
      result.absence_notice,
      QUALIFIER_Q04_ABSENCE_NOTICE_FIXTURE.expected.absence_notice
    );
  });

  test('Q-01..Q-03: renders always true (qualifier persistence)', () => {
    ['Q-01', 'Q-02', 'Q-03'].forEach(q => {
      const result = mapQualifierClass(q);
      assert.strictEqual(result.renders, true, `${q} renders must be true`);
    });
  });

  test('Q-04 absence_notice is non-null (mandatory)', () => {
    const result = mapQualifierClass('Q-04');
    assert.ok(result.absence_notice !== null && result.absence_notice.length > 0);
  });

  test('unknown qualifier_class → fails closed (renders: false)', () => {
    const result = mapQualifierClass('Q-99');
    assert.strictEqual(result.renders, false);
    assert.ok(result.error);
  });
});

// ---------------------------------------------------------------------------
// Governance state indicator
// ---------------------------------------------------------------------------

describe('Governance state indicator', () => {
  test('governance_verdict PASS → governance_indicator PASS', () => {
    const result = mapGovernanceState('PASS', 'EXECUTIVE_READY');
    assert.strictEqual(result.governance_indicator, 'PASS');
  });

  test('governance_verdict FAIL → governance_indicator FAIL_BLOCKED', () => {
    const result = mapGovernanceState(
      GOVERNANCE_FAIL_STATE_FIXTURE.input.governance_verdict,
      GOVERNANCE_FAIL_STATE_FIXTURE.input.renderState
    );
    assert.strictEqual(result.governance_indicator, GOVERNANCE_FAIL_STATE_FIXTURE.expected.governance_indicator);
  });

  test('BLOCKED renderState → blocked_visible true', () => {
    const result = mapGovernanceState('PASS', 'BLOCKED');
    assert.strictEqual(result.blocked_visible, true);
  });

  test('governance_verdict FAIL → blocked_visible true regardless of renderState', () => {
    const result = mapGovernanceState('FAIL', 'EXECUTIVE_READY');
    assert.strictEqual(result.blocked_visible, true);
  });

  test('DIAGNOSTIC_ONLY → diagnostic_visible true', () => {
    const result = mapGovernanceState('PASS', 'DIAGNOSTIC_ONLY');
    assert.strictEqual(result.diagnostic_visible, true);
  });

  test('DIAGNOSTIC_ONLY → blocked_visible false', () => {
    const result = mapGovernanceState('PASS', 'DIAGNOSTIC_ONLY');
    assert.strictEqual(result.blocked_visible, false);
  });

  test('EXECUTIVE_READY PASS → badge_token token-ready', () => {
    const result = mapGovernanceState('PASS', 'EXECUTIVE_READY');
    assert.strictEqual(result.badge_token, 'token-ready');
  });

  test('FAIL → badge_token token-blocked', () => {
    const result = mapGovernanceState('FAIL', 'BLOCKED');
    assert.strictEqual(result.badge_token, GOVERNANCE_FAIL_STATE_FIXTURE.expected.badge_token);
  });

  test('DIAGNOSTIC_ONLY → badge_token token-diagnostic', () => {
    const result = mapGovernanceState('PASS', 'DIAGNOSTIC_ONLY');
    assert.strictEqual(result.badge_token, 'token-diagnostic');
  });
});

// ---------------------------------------------------------------------------
// Blocked state display — VIS-BLOCK-01, VIS-BLOCK-02
// ---------------------------------------------------------------------------

describe('Blocked state display (VIS-BLOCK-01, VIS-BLOCK-02)', () => {
  test('mapBlockedState → blocked_headline "Readiness classification unavailable"', () => {
    const result = mapBlockedState();
    assert.strictEqual(
      result.blocked_headline,
      GOVERNANCE_FAIL_STATE_FIXTURE.blocked_display_expected.blocked_headline
    );
  });

  test('mapBlockedState → blocked_visible true (never silent)', () => {
    const result = mapBlockedState();
    assert.strictEqual(result.blocked_visible, true);
  });

  test('mapBlockedState → badge_token token-blocked', () => {
    const result = mapBlockedState();
    assert.strictEqual(result.badge_token, 'token-blocked');
  });

  test('blocked headline never blank', () => {
    const result = mapBlockedState();
    assert.ok(result.blocked_headline && result.blocked_headline.length > 0);
  });

  test('blocked token distinct from all readiness tokens', () => {
    const readinessTokens = ['token-ready', 'token-ready-qualified', 'token-diagnostic', 'token-suppressed'];
    assert.ok(!readinessTokens.includes(BLOCKED_DISPLAY.badge_token));
  });
});

// ---------------------------------------------------------------------------
// Diagnostic state display — VIS-DIAG-01
// ---------------------------------------------------------------------------

describe('Diagnostic state display (VIS-DIAG-01)', () => {
  test('mapDiagnosticState → advisory_notice_required true', () => {
    const result = mapDiagnosticState();
    assert.strictEqual(result.advisory_notice_required, true);
  });

  test('mapDiagnosticState → diagnostic_visible true', () => {
    const result = mapDiagnosticState();
    assert.strictEqual(result.diagnostic_visible, true);
  });

  test('mapDiagnosticState → badge_token token-diagnostic', () => {
    const result = mapDiagnosticState();
    assert.strictEqual(result.badge_token, 'token-diagnostic');
  });

  test('diagnostic banner_text contains word "advisory" (VIS-DIAG-01)', () => {
    const result = mapDiagnosticState();
    assert.ok(result.banner_text.toLowerCase().includes('advisory'));
  });

  test('diagnostic banner never blank', () => {
    const result = mapDiagnosticState();
    assert.ok(result.banner_text && result.banner_text.length > 0);
  });
});

// ---------------------------------------------------------------------------
// Fixture-driven integration: readiness + qualifier combination
// ---------------------------------------------------------------------------

describe('Readiness + qualifier combination (fixture-driven)', () => {
  test('EXECUTIVE_READY_WITH_QUALIFIER + Q-01 → badge token-ready-qualified + chip token-qualifier-amber', () => {
    const badge = mapReadinessState(READINESS_EXECUTIVE_READY_WITH_Q01_FIXTURE.readiness_input.readiness_state);
    const chip = mapQualifierClass(READINESS_EXECUTIVE_READY_WITH_Q01_FIXTURE.qualifier_input.qualifier_class);
    assert.strictEqual(badge.badge_token, READINESS_EXECUTIVE_READY_WITH_Q01_FIXTURE.expected_badge.badge_token);
    assert.strictEqual(chip.chip_token, READINESS_EXECUTIVE_READY_WITH_Q01_FIXTURE.expected_chip.chip_token);
    assert.strictEqual(chip.renders, true);
  });

  test('EXECUTIVE_READY_WITH_QUALIFIER + Q-02 → badge token-ready-qualified + chip token-qualifier-blue', () => {
    const badge = mapReadinessState(READINESS_EXECUTIVE_READY_WITH_Q02_FIXTURE.readiness_input.readiness_state);
    const chip = mapQualifierClass(READINESS_EXECUTIVE_READY_WITH_Q02_FIXTURE.qualifier_input.qualifier_class);
    assert.strictEqual(badge.badge_token, READINESS_EXECUTIVE_READY_WITH_Q02_FIXTURE.expected_badge.badge_token);
    assert.strictEqual(chip.chip_token, READINESS_EXECUTIVE_READY_WITH_Q02_FIXTURE.expected_chip.chip_token);
    assert.strictEqual(chip.renders, true);
  });

  test('DIAGNOSTIC_ONLY → qualifier_chip_state is token-qualifier-grey (not null)', () => {
    const result = mapReadinessState('DIAGNOSTIC_ONLY');
    assert.strictEqual(result.qualifier_chip_state, READINESS_DIAGNOSTIC_ONLY_FIXTURE.expected.qualifier_chip_state);
  });

  test('BLOCKED → qualifier_chip_state is null (blocked has no chip)', () => {
    const result = mapReadinessState('BLOCKED_PENDING_DOMAIN_GROUNDING');
    assert.strictEqual(result.qualifier_chip_state, null);
  });
});

// ---------------------------------------------------------------------------
// Governance safety — no GEIOS internals in any output label
// ---------------------------------------------------------------------------

describe('Governance safety — no forbidden vocabulary in visual output', () => {
  test('no GEIOS identifiers in any readiness badge label', () => {
    Object.values(READINESS_BADGE_MAP).forEach(mapping => {
      const serialized = JSON.stringify(mapping);
      FORBIDDEN_GEIOS_IDENTIFIERS.forEach(id => {
        assert.ok(!serialized.includes(id), `GEIOS identifier "${id}" in badge mapping`);
      });
    });
  });

  test('no AI/LLM terms in any readiness badge label', () => {
    // Use word boundaries for short abbreviations to avoid false positives
    // (e.g. "AI" must not match "Advisory")
    const wordBoundaryTerms = ['AI', 'LLM', 'ML', 'RAG'];
    const substringTerms = FORBIDDEN_AI_TERMS.filter(t => !wordBoundaryTerms.includes(t));
    Object.values(READINESS_BADGE_MAP).forEach(mapping => {
      const serialized = JSON.stringify(mapping);
      wordBoundaryTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        assert.ok(!regex.test(serialized),
          `AI abbreviation "${term}" found as standalone word in badge mapping`);
      });
      substringTerms.forEach(term => {
        assert.ok(!serialized.toLowerCase().includes(term.toLowerCase()),
          `AI term "${term}" found in badge mapping`);
      });
    });
  });

  test('no GEIOS identifiers in qualifier chip labels', () => {
    Object.values(QUALIFIER_CHIP_MAP).forEach(mapping => {
      const serialized = JSON.stringify(mapping);
      FORBIDDEN_GEIOS_IDENTIFIERS.forEach(id => {
        assert.ok(!serialized.includes(id), `GEIOS identifier "${id}" in chip mapping`);
      });
    });
  });

  test('no probabilistic language in any readiness label', () => {
    Object.values(READINESS_BADGE_MAP).forEach(mapping => {
      const serialized = JSON.stringify(mapping).toLowerCase();
      FORBIDDEN_PROBABILISTIC_LANGUAGE.forEach(phrase => {
        assert.ok(
          !serialized.includes(phrase.toLowerCase()),
          `Probabilistic phrase "${phrase}" in badge mapping`
        );
      });
    });
  });

  test('no probabilistic language in any qualifier label', () => {
    Object.values(QUALIFIER_CHIP_MAP).forEach(mapping => {
      const serialized = JSON.stringify(mapping).toLowerCase();
      FORBIDDEN_PROBABILISTIC_LANGUAGE.forEach(phrase => {
        assert.ok(
          !serialized.includes(phrase.toLowerCase()),
          `Probabilistic phrase "${phrase}" in chip mapping`
        );
      });
    });
  });

  test('blocked display contains no GEIOS identifiers', () => {
    const serialized = JSON.stringify(BLOCKED_DISPLAY);
    FORBIDDEN_GEIOS_IDENTIFIERS.forEach(id => {
      assert.ok(!serialized.includes(id), `GEIOS identifier "${id}" in blocked display`);
    });
  });

  test('diagnostic display contains no GEIOS identifiers', () => {
    const serialized = JSON.stringify(DIAGNOSTIC_DISPLAY);
    FORBIDDEN_GEIOS_IDENTIFIERS.forEach(id => {
      assert.ok(!serialized.includes(id), `GEIOS identifier "${id}" in diagnostic display`);
    });
  });
});

// ---------------------------------------------------------------------------
// No readiness recomputation / no qualifier reinterpretation
// ---------------------------------------------------------------------------

describe('Mapper passthrough — no recomputation or reinterpretation', () => {
  test('mapReadinessState accepts state as input — does not compute it', () => {
    // Mapper must accept and map, never derive from other signals
    const r1 = mapReadinessState('EXECUTIVE_READY');
    const r2 = mapReadinessState('DIAGNOSTIC_ONLY');
    // If the mapper were recomputing, these would reference each other — they must not
    assert.notStrictEqual(r1.badge_token, r2.badge_token);
    assert.notStrictEqual(r1.executive_label, r2.executive_label);
  });

  test('mapQualifierClass accepts class as input — does not derive from readiness', () => {
    const q1 = mapQualifierClass('Q-01');
    const q3 = mapQualifierClass('Q-03');
    assert.notStrictEqual(q1.chip_token, q3.chip_token);
    assert.notStrictEqual(q1.chip_label, q3.chip_label);
  });

  test('mapper functions return plain objects (not Promises — synchronous only)', () => {
    const r = mapReadinessState('EXECUTIVE_READY');
    const q = mapQualifierClass('Q-01');
    const g = mapGovernanceState('PASS', 'EXECUTIVE_READY');
    assert.ok(r !== null && typeof r === 'object' && typeof r.then === 'undefined');
    assert.ok(q !== null && typeof q === 'object' && typeof q.then === 'undefined');
    assert.ok(g !== null && typeof g === 'object' && typeof g.then === 'undefined');
  });
});

// ---------------------------------------------------------------------------
// Token completeness — all governed tokens present
// ---------------------------------------------------------------------------

describe('Governed token completeness', () => {
  test('all 5 readiness tokens are governed strings', () => {
    const tokens = Object.values(READINESS_BADGE_MAP).map(m => m.badge_token);
    tokens.forEach(t => {
      assert.ok(t && t.startsWith('token-'), `Badge token "${t}" is not a governed token string`);
    });
  });

  test('all 3 qualifier tokens are governed strings', () => {
    const activeChips = ['Q-01', 'Q-02', 'Q-03'];
    activeChips.forEach(q => {
      const { chip_token } = QUALIFIER_CHIP_MAP[q];
      assert.ok(chip_token && chip_token.startsWith('token-qualifier-'),
        `Qualifier token "${chip_token}" is not a governed qualifier token`);
    });
  });

  test('Q-00 and Q-04 chip_token is NONE (no visual chip)', () => {
    assert.strictEqual(QUALIFIER_CHIP_MAP['Q-00'].chip_token, 'NONE');
    assert.strictEqual(QUALIFIER_CHIP_MAP['Q-04'].chip_token, 'NONE');
  });

  test('blocked token is token-blocked (distinct from readiness tokens)', () => {
    assert.strictEqual(BLOCKED_DISPLAY.badge_token, 'token-blocked');
  });

  test('diagnostic token is token-diagnostic', () => {
    assert.strictEqual(DIAGNOSTIC_DISPLAY.badge_token, 'token-diagnostic');
  });
});

// ---------------------------------------------------------------------------
// Qualifier tooltip mapping
// ---------------------------------------------------------------------------

describe('Qualifier tooltip mapping', () => {
  test('Q-00 → tooltip null', () => {
    assert.strictEqual(getQualifierTooltip('Q-00'), null);
  });

  test('Q-01 → tooltip is non-null string', () => {
    const tt = getQualifierTooltip('Q-01');
    assert.ok(tt && typeof tt === 'string' && tt.length > 0);
  });

  test('Q-02 → tooltip references structural confirmation', () => {
    const tt = getQualifierTooltip('Q-02');
    assert.ok(tt && tt.toLowerCase().includes('structural'));
  });

  test('Q-03 → tooltip references advisory confirmation', () => {
    const tt = getQualifierTooltip('Q-03');
    assert.ok(tt && tt.toLowerCase().includes('advisory'));
  });

  test('Q-04 → tooltip null (withheld)', () => {
    assert.strictEqual(getQualifierTooltip('Q-04'), null);
  });
});

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

describe('Determinism', () => {
  test('same readiness_state → same output on repeated calls', () => {
    const r1 = mapReadinessState('EXECUTIVE_READY');
    const r2 = mapReadinessState('EXECUTIVE_READY');
    assert.deepStrictEqual(r1, r2);
  });

  test('same qualifier_class → same output on repeated calls', () => {
    const q1 = mapQualifierClass('Q-03');
    const q2 = mapQualifierClass('Q-03');
    assert.deepStrictEqual(q1, q2);
  });

  test('same governance inputs → same indicator on repeated calls', () => {
    const g1 = mapGovernanceState('FAIL', 'BLOCKED');
    const g2 = mapGovernanceState('FAIL', 'BLOCKED');
    assert.deepStrictEqual(g1, g2);
  });
});
