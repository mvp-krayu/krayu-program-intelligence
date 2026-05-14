'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  mapPropagationRole,
  mapPressureTier,
  mapPropagationState,
  mapPropagationQualifier,
  mapPropagationDensity,
  scanPropagationText,
  PROPAGATION_ROLE_MAP,
  PRESSURE_TIER_MAP,
} = require('../PropagationSemanticMapper');

const { resolvePropagationDensityLayout } = require('../PropagationDensityController');

const { PROPAGATION_EXECUTIVE_READY_FIXTURE } = require('../fixtures/propagation_executive_ready.fixture');
const { PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE } = require('../fixtures/propagation_executive_ready_q01.fixture');
const { PROPAGATION_EXECUTIVE_READY_Q02_FIXTURE } = require('../fixtures/propagation_executive_ready_q02.fixture');
const { PROPAGATION_DIAGNOSTIC_FIXTURE } = require('../fixtures/propagation_diagnostic.fixture');
const { PROPAGATION_BLOCKED_FIXTURE } = require('../fixtures/propagation_blocked.fixture');
const { PROPAGATION_CHAIN_RENDER_FIXTURE } = require('../fixtures/propagation_chain_render.fixture');
const { PROPAGATION_EVIDENCE_LINKAGE_FIXTURE } = require('../fixtures/propagation_evidence_linkage.fixture');
const { PROPAGATION_DENSITY_DENSE_FIXTURE } = require('../fixtures/propagation_density_dense.fixture');
const { PROPAGATION_DENSITY_BALANCED_FIXTURE } = require('../fixtures/propagation_density_balanced.fixture');
const { PROPAGATION_FORBIDDEN_PROMPT_FIXTURE } = require('../fixtures/propagation_forbidden_prompt.fixture');
const { PROPAGATION_FORBIDDEN_GEIOS_FIXTURE } = require('../fixtures/propagation_forbidden_geios_internal.fixture');
const { PROPAGATION_MISSING_EVIDENCE_FIXTURE } = require('../fixtures/propagation_missing_evidence.fixture');

// ─── 1. Propagation state mapping ─────────────────────────────────────────────

describe('mapPropagationState — EXECUTIVE_READY', () => {
  test('returns FULL_PROPAGATION mode', () => {
    const result = mapPropagationState(PROPAGATION_EXECUTIVE_READY_FIXTURE.renderState);
    assert.equal(result.propagation_mode, PROPAGATION_EXECUTIVE_READY_FIXTURE.expected_mode);
  });

  test('returns correct surface_token', () => {
    const result = mapPropagationState(PROPAGATION_EXECUTIVE_READY_FIXTURE.renderState);
    assert.equal(result.surface_token, PROPAGATION_EXECUTIVE_READY_FIXTURE.expected_surface_token);
  });

  test('all_chains_visible is true', () => {
    const result = mapPropagationState('EXECUTIVE_READY');
    assert.equal(result.all_chains_visible, PROPAGATION_EXECUTIVE_READY_FIXTURE.expected_all_chains_visible);
  });

  test('evidence_linkage_visible is true', () => {
    const result = mapPropagationState('EXECUTIVE_READY');
    assert.equal(result.evidence_linkage_visible, PROPAGATION_EXECUTIVE_READY_FIXTURE.expected_evidence_linkage_visible);
  });

  test('qualifier_overlay_active is false', () => {
    const result = mapPropagationState('EXECUTIVE_READY');
    assert.equal(result.qualifier_overlay_active, false);
  });

  test('no error on known state', () => {
    const result = mapPropagationState('EXECUTIVE_READY');
    assert.equal(result.error, null);
  });
});

describe('mapPropagationState — EXECUTIVE_READY_WITH_QUALIFIER', () => {
  test('returns QUALIFIED_PROPAGATION mode', () => {
    const result = mapPropagationState(PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE.renderState);
    assert.equal(result.propagation_mode, PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE.expected_mode);
  });

  test('qualifier_overlay_active is true', () => {
    const result = mapPropagationState('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.qualifier_overlay_active, true);
  });

  test('all_chains_visible is true', () => {
    const result = mapPropagationState('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.all_chains_visible, true);
  });
});

describe('mapPropagationState — DIAGNOSTIC_ONLY', () => {
  test('returns DIAGNOSTIC_PROPAGATION mode', () => {
    const result = mapPropagationState(PROPAGATION_DIAGNOSTIC_FIXTURE.renderState);
    assert.equal(result.propagation_mode, PROPAGATION_DIAGNOSTIC_FIXTURE.expected_mode);
  });

  test('diagnostic_notice is populated with required text', () => {
    const result = mapPropagationState('DIAGNOSTIC_ONLY');
    assert.equal(result.diagnostic_notice, PROPAGATION_DIAGNOSTIC_FIXTURE.expected_diagnostic_notice);
  });

  test('surface_token is propagation-diagnostic', () => {
    const result = mapPropagationState('DIAGNOSTIC_ONLY');
    assert.equal(result.surface_token, PROPAGATION_DIAGNOSTIC_FIXTURE.expected_surface_token);
  });
});

describe('mapPropagationState — BLOCKED', () => {
  test('returns BLOCKED_PROPAGATION mode', () => {
    const result = mapPropagationState(PROPAGATION_BLOCKED_FIXTURE.renderState);
    assert.equal(result.propagation_mode, PROPAGATION_BLOCKED_FIXTURE.expected_mode);
  });

  test('blocked_notice is populated — Readiness classification unavailable', () => {
    const result = mapPropagationState('BLOCKED');
    assert.equal(result.blocked_notice, PROPAGATION_BLOCKED_FIXTURE.expected_blocked_notice);
  });

  test('all_chains_visible is false', () => {
    const result = mapPropagationState('BLOCKED');
    assert.equal(result.all_chains_visible, PROPAGATION_BLOCKED_FIXTURE.expected_all_chains_visible);
  });

  test('evidence_linkage_visible is false', () => {
    const result = mapPropagationState('BLOCKED');
    assert.equal(result.evidence_linkage_visible, PROPAGATION_BLOCKED_FIXTURE.expected_evidence_linkage_visible);
  });

  test('unknown state fails closed to BLOCKED_PROPAGATION', () => {
    const result = mapPropagationState('UNKNOWN_PROPAGATION_STATE');
    assert.equal(result.propagation_mode, 'BLOCKED_PROPAGATION');
    assert.ok(result.error && result.error.includes('PSM-03'));
  });

  test('null state fails closed to BLOCKED_PROPAGATION', () => {
    const result = mapPropagationState(null);
    assert.equal(result.propagation_mode, 'BLOCKED_PROPAGATION');
  });
});

// ─── 2. Propagation role mapping (VIS-PROP-01) ───────────────────────────────

describe('mapPropagationRole — all four roles', () => {
  test('ORIGIN maps to Origin of Pressure', () => {
    const result = mapPropagationRole('ORIGIN');
    assert.equal(result.display_label, 'Origin of Pressure');
    assert.equal(result.indicator, 'source-indicator');
    assert.equal(result.visual_weight, 'high');
  });

  test('RECEIVER maps to Pressure Receiver', () => {
    const result = mapPropagationRole('RECEIVER');
    assert.equal(result.display_label, 'Pressure Receiver');
    assert.equal(result.indicator, 'receiver-indicator');
  });

  test('PASS_THROUGH maps to Pressure Pass-through', () => {
    const result = mapPropagationRole('PASS_THROUGH');
    assert.equal(result.display_label, 'Pressure Pass-through');
    assert.equal(result.indicator, 'flow-indicator');
  });

  test('ISOLATED maps to Independent Domain', () => {
    const result = mapPropagationRole('ISOLATED');
    assert.equal(result.display_label, 'Independent Domain');
    assert.equal(result.indicator, 'neutral-indicator');
    assert.equal(result.visual_weight, 'low');
  });

  test('raw enum value ORIGIN has no display_label equal to raw string', () => {
    const result = mapPropagationRole('ORIGIN');
    assert.notEqual(result.display_label, 'ORIGIN');
  });

  test('raw enum RECEIVER not exposed in display_label', () => {
    const result = mapPropagationRole('RECEIVER');
    assert.notEqual(result.display_label, 'RECEIVER');
  });

  test('unknown role fails closed to ISOLATED with PSM-01 error', () => {
    const result = mapPropagationRole('UNKNOWN_ROLE');
    assert.equal(result.display_label, 'Independent Domain');
    assert.ok(result.error && result.error.includes('PSM-01'));
  });

  test('role_token present for all roles', () => {
    ['ORIGIN', 'RECEIVER', 'PASS_THROUGH', 'ISOLATED'].forEach(role => {
      const result = mapPropagationRole(role);
      assert.ok(result.role_token && result.role_token.startsWith('token-role-'));
    });
  });
});

// ─── 3. Pressure tier mapping (VIS-PRESS-01) ─────────────────────────────────

describe('mapPressureTier — all four tiers', () => {
  test('HIGH maps to High execution pressure', () => {
    const result = mapPressureTier('HIGH');
    assert.equal(result.display_label, 'High execution pressure');
    assert.equal(result.pressure_token, 'token-pressure-high');
  });

  test('ELEVATED maps to Elevated pressure', () => {
    const result = mapPressureTier('ELEVATED');
    assert.equal(result.display_label, 'Elevated pressure');
    assert.equal(result.pressure_token, 'token-pressure-elevated');
  });

  test('MODERATE maps to Moderate pressure', () => {
    const result = mapPressureTier('MODERATE');
    assert.equal(result.display_label, 'Moderate pressure');
    assert.equal(result.pressure_token, 'token-pressure-moderate');
  });

  test('LOW maps to Stable / low pressure', () => {
    const result = mapPressureTier('LOW');
    assert.equal(result.display_label, 'Stable / low pressure');
    assert.equal(result.pressure_token, 'token-pressure-low');
  });

  test('numerical value not present in display_label for any tier', () => {
    ['HIGH', 'ELEVATED', 'MODERATE', 'LOW'].forEach(tier => {
      const result = mapPressureTier(tier);
      assert.ok(!/\d/.test(result.display_label), `No numerical values in display_label for ${tier}`);
    });
  });

  test('unknown tier fails closed to MODERATE with PSM-02 error', () => {
    const result = mapPressureTier('CRITICAL');
    assert.equal(result.display_label, 'Moderate pressure');
    assert.ok(result.error && result.error.includes('PSM-02'));
  });
});

// ─── 4. Qualifier overlay mapping ─────────────────────────────────────────────

describe('mapPropagationQualifier — Q-00', () => {
  test('renders is false for Q-00', () => {
    const result = mapPropagationQualifier('Q-00');
    assert.equal(result.renders, false);
  });

  test('overlay_text is null for Q-00', () => {
    const result = mapPropagationQualifier('Q-00');
    assert.equal(result.overlay_text, null);
  });
});

describe('mapPropagationQualifier — Q-01', () => {
  test('renders is true', () => {
    const result = mapPropagationQualifier('Q-01');
    assert.equal(result.renders, PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE.expected_overlay_renders);
  });

  test('overlay_token matches fixture', () => {
    const result = mapPropagationQualifier('Q-01');
    assert.equal(result.overlay_token, PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE.expected_overlay_token);
  });

  test('overlay_text is populated', () => {
    const result = mapPropagationQualifier('Q-01');
    assert.ok(result.overlay_text && result.overlay_text.length > 0);
  });
});

describe('mapPropagationQualifier — Q-02', () => {
  test('overlay_token is token-qualifier-blue', () => {
    const result = mapPropagationQualifier('Q-02');
    assert.equal(result.overlay_token, PROPAGATION_EXECUTIVE_READY_Q02_FIXTURE.expected_overlay_token);
  });
});

describe('mapPropagationQualifier — Q-04', () => {
  test('renders is false', () => {
    const result = mapPropagationQualifier('Q-04');
    assert.equal(result.renders, false);
  });

  test('absence_notice is Signal intelligence withheld', () => {
    const result = mapPropagationQualifier('Q-04');
    assert.equal(result.absence_notice, 'Signal intelligence withheld from this view.');
  });

  test('unknown qualifier fails closed with PSM-04 error', () => {
    const result = mapPropagationQualifier('Q-99');
    assert.equal(result.renders, false);
    assert.ok(result.error && result.error.includes('PSM-04'));
  });
});

// ─── 5. Propagation chain rendering ──────────────────────────────────────────

describe('Propagation chain rendering — chain ordering preserved', () => {
  test('chain count matches fixture', () => {
    const chains = PROPAGATION_CHAIN_RENDER_FIXTURE.propagation_chains;
    assert.equal(chains.length, PROPAGATION_CHAIN_RENDER_FIXTURE.expected.chain_count);
  });

  test('chain paths are arrays of domain alias strings', () => {
    const chains = PROPAGATION_CHAIN_RENDER_FIXTURE.propagation_chains;
    chains.forEach(chain => {
      assert.ok(Array.isArray(chain.path));
      chain.path.forEach(node => assert.equal(typeof node, 'string'));
    });
  });

  test('propagation roles in chains are valid enum values', () => {
    const validRoles = Object.keys(PROPAGATION_ROLE_MAP);
    PROPAGATION_CHAIN_RENDER_FIXTURE.propagation_chains.forEach(chain => {
      assert.ok(validRoles.includes(chain.propagation_role), `${chain.propagation_role} is valid`);
    });
  });

  test('pressure tiers in chains are valid enum values', () => {
    const validTiers = Object.keys(PRESSURE_TIER_MAP);
    PROPAGATION_CHAIN_RENDER_FIXTURE.propagation_chains.forEach(chain => {
      assert.ok(validTiers.includes(chain.pressure_tier), `${chain.pressure_tier} is valid`);
    });
  });

  test('role display labels are not raw enum values', () => {
    PROPAGATION_CHAIN_RENDER_FIXTURE.propagation_chains.forEach(chain => {
      const roleDisplay = mapPropagationRole(chain.propagation_role);
      assert.notEqual(roleDisplay.display_label, chain.propagation_role);
    });
  });

  test('pressure display labels contain no numerical values', () => {
    PROPAGATION_CHAIN_RENDER_FIXTURE.propagation_chains.forEach(chain => {
      const tierDisplay = mapPressureTier(chain.pressure_tier);
      assert.ok(!/\d/.test(tierDisplay.display_label));
    });
  });
});

// ─── 6. Evidence linkage rendering ───────────────────────────────────────────

describe('Propagation evidence linkage — structure and traceability', () => {
  test('evidence link count matches fixture', () => {
    const links = PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.evidence_links;
    assert.equal(links.length, PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.expected.link_count);
  });

  test('all links have domain_alias', () => {
    PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.evidence_links.forEach(link => {
      assert.ok(link.domain_alias && link.domain_alias.length > 0);
    });
  });

  test('all links have propagation_role', () => {
    PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.evidence_links.forEach(link => {
      assert.ok(link.propagation_role);
    });
  });

  test('all roles map to governance display labels', () => {
    PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.evidence_links.forEach(link => {
      const roleDisplay = mapPropagationRole(link.propagation_role);
      assert.ok(roleDisplay.display_label && roleDisplay.display_label.length > 0);
      assert.equal(roleDisplay.error, null);
    });
  });

  test('evidence summaries preserved — not rewritten', () => {
    const linksCopy = PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.evidence_links.map(l => ({ ...l }));
    assert.equal(linksCopy[0].evidence_summary, PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.evidence_links[0].evidence_summary);
  });
});

// ─── 7. Density layout — EXECUTIVE_DENSE ──────────────────────────────────────

describe('resolvePropagationDensityLayout — EXECUTIVE_DENSE', () => {
  test('all sections visible in DENSE mode when props present', () => {
    const layout = resolvePropagationDensityLayout(
      PROPAGATION_DENSITY_DENSE_FIXTURE.densityClass,
      PROPAGATION_DENSITY_DENSE_FIXTURE.propagationProps
    );
    assert.equal(layout.show_propagation_summary, PROPAGATION_DENSITY_DENSE_FIXTURE.expected.show_propagation_summary);
    assert.equal(layout.show_propagation_chains, PROPAGATION_DENSITY_DENSE_FIXTURE.expected.show_propagation_chains);
    assert.equal(layout.show_evidence_linkage, PROPAGATION_DENSITY_DENSE_FIXTURE.expected.show_evidence_linkage);
  });

  test('max_visible_chains is 3 in DENSE', () => {
    const layout = resolvePropagationDensityLayout(PROPAGATION_DENSITY_DENSE_FIXTURE.densityClass, PROPAGATION_DENSITY_DENSE_FIXTURE.propagationProps);
    assert.equal(layout.max_visible_chains, PROPAGATION_DENSITY_DENSE_FIXTURE.expected.max_visible_chains);
  });

  test('chains_collapsed_by_default is false in DENSE', () => {
    const layout = resolvePropagationDensityLayout(PROPAGATION_DENSITY_DENSE_FIXTURE.densityClass, PROPAGATION_DENSITY_DENSE_FIXTURE.propagationProps);
    assert.equal(layout.chains_collapsed_by_default, PROPAGATION_DENSITY_DENSE_FIXTURE.expected.chains_collapsed_by_default);
  });

  test('evidence_references_preserved is true in DENSE', () => {
    const layout = resolvePropagationDensityLayout(PROPAGATION_DENSITY_DENSE_FIXTURE.densityClass, PROPAGATION_DENSITY_DENSE_FIXTURE.propagationProps);
    assert.equal(layout.evidence_references_preserved, true);
  });
});

// ─── 8. Density layout — EXECUTIVE_BALANCED ───────────────────────────────────

describe('resolvePropagationDensityLayout — EXECUTIVE_BALANCED', () => {
  test('evidence linkage hidden in BALANCED', () => {
    const layout = resolvePropagationDensityLayout(
      PROPAGATION_DENSITY_BALANCED_FIXTURE.densityClass,
      PROPAGATION_DENSITY_BALANCED_FIXTURE.propagationProps
    );
    assert.equal(layout.show_evidence_linkage, PROPAGATION_DENSITY_BALANCED_FIXTURE.expected.show_evidence_linkage);
  });

  test('max_visible_chains is 2 in BALANCED', () => {
    const layout = resolvePropagationDensityLayout(PROPAGATION_DENSITY_BALANCED_FIXTURE.densityClass, PROPAGATION_DENSITY_BALANCED_FIXTURE.propagationProps);
    assert.equal(layout.max_visible_chains, PROPAGATION_DENSITY_BALANCED_FIXTURE.expected.max_visible_chains);
  });

  test('chains_collapsed_by_default is true in BALANCED', () => {
    const layout = resolvePropagationDensityLayout(PROPAGATION_DENSITY_BALANCED_FIXTURE.densityClass, PROPAGATION_DENSITY_BALANCED_FIXTURE.propagationProps);
    assert.equal(layout.chains_collapsed_by_default, PROPAGATION_DENSITY_BALANCED_FIXTURE.expected.chains_collapsed_by_default);
  });

  test('evidence_references_preserved is always true in BALANCED', () => {
    const layout = resolvePropagationDensityLayout(PROPAGATION_DENSITY_BALANCED_FIXTURE.densityClass, PROPAGATION_DENSITY_BALANCED_FIXTURE.propagationProps);
    assert.equal(layout.evidence_references_preserved, true);
  });

  test('propagation summary still shown in BALANCED', () => {
    const layout = resolvePropagationDensityLayout(PROPAGATION_DENSITY_BALANCED_FIXTURE.densityClass, PROPAGATION_DENSITY_BALANCED_FIXTURE.propagationProps);
    assert.equal(layout.show_propagation_summary, PROPAGATION_DENSITY_BALANCED_FIXTURE.expected.show_propagation_summary);
  });
});

// ─── 9. Missing evidence — explicit, not silent ───────────────────────────────

describe('Missing evidence states — explicit rendering', () => {
  test('empty evidence_links array produces has_evidence_links = false', () => {
    const layout = resolvePropagationDensityLayout(
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.densityClass,
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.propagationProps
    );
    assert.equal(layout.has_evidence_links, false);
  });

  test('propagation summary still shown when evidence is missing', () => {
    const layout = resolvePropagationDensityLayout(
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.densityClass,
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.propagationProps
    );
    assert.equal(layout.show_propagation_summary, PROPAGATION_MISSING_EVIDENCE_FIXTURE.expected.propagation_summary_still_shown);
  });

  test('propagation chains still shown when evidence is missing', () => {
    const layout = resolvePropagationDensityLayout(
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.densityClass,
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.propagationProps
    );
    assert.equal(layout.show_propagation_chains, PROPAGATION_MISSING_EVIDENCE_FIXTURE.expected.propagation_chains_still_shown);
  });

  test('evidence_references_preserved remains true even with missing evidence', () => {
    const layout = resolvePropagationDensityLayout(
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.densityClass,
      PROPAGATION_MISSING_EVIDENCE_FIXTURE.propagationProps
    );
    assert.equal(layout.evidence_references_preserved, true);
  });
});

// ─── 10. Forbidden vocabulary scan ────────────────────────────────────────────

describe('scanPropagationText — recommendation language (NORM-FORBID-02)', () => {
  test('detects "we recommend" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.recommendation_text);
    assert.ok(scan.violations.length > 0);
    assert.ok(scan.recommendation.some(v => v.toLowerCase() === 'we recommend'));
  });

  test('detects "the team should" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.recommendation_text);
    assert.ok(scan.recommendation.some(v => v.toLowerCase() === 'the team should'));
  });

  test('detects "address this" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.recommendation_text);
    assert.ok(scan.recommendation.some(v => v.toLowerCase() === 'address this'));
  });
});

describe('scanPropagationText — predictive language (NORM-FORBID-01)', () => {
  test('detects "will result in" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.predictive_text);
    assert.ok(scan.predictive.some(v => v.toLowerCase() === 'will result in'));
  });
});

describe('scanPropagationText — AI phrasing (NORM-FORBID-04)', () => {
  test('detects "I think" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.ai_phrasing_text);
    assert.ok(scan.ai_phrasing.some(v => v.toLowerCase() === 'i think'));
  });

  test('detects "Let me explain" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.ai_phrasing_text);
    assert.ok(scan.ai_phrasing.some(v => v.toLowerCase() === 'let me explain'));
  });
});

describe('scanPropagationText — speculative language (NORM-FORBID-03)', () => {
  test('detects "possibly" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.speculative_text);
    assert.ok(scan.speculative.some(v => v.toLowerCase() === 'possibly'));
  });

  test('detects "perhaps" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.speculative_text);
    assert.ok(scan.speculative.some(v => v.toLowerCase() === 'perhaps'));
  });
});

describe('scanPropagationText — probabilistic semantics (EXP-CONF-01)', () => {
  test('detects "%" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.probabilistic_text);
    assert.ok(scan.probabilistic.some(v => v === '%'));
  });

  test('detects "probability" violation', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_PROMPT_FIXTURE.probabilistic_text);
    assert.ok(scan.probabilistic.some(v => v === 'probability'));
  });
});

describe('scanPropagationText — GEIOS internal identifiers', () => {
  test('GEIOS text has violations', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_GEIOS_FIXTURE.geios_text);
    assert.equal(scan.violations.length > 0, PROPAGATION_FORBIDDEN_GEIOS_FIXTURE.expected.geios_text_has_violations);
  });

  test('clean propagation text has no violations', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_GEIOS_FIXTURE.clean_text);
    assert.equal(scan.violations.length === 0, !PROPAGATION_FORBIDDEN_GEIOS_FIXTURE.expected.clean_text_has_violations);
    assert.equal(scan.violations.length, 0);
  });

  test('all expected GEIOS identifiers detected', () => {
    const scan = scanPropagationText(PROPAGATION_FORBIDDEN_GEIOS_FIXTURE.geios_text);
    PROPAGATION_FORBIDDEN_GEIOS_FIXTURE.expected.geios_identifiers_in_geios_text.forEach(id => {
      assert.ok(scan.geios.includes(id), `GEIOS identifier "${id}" detected`);
    });
  });
});

// ─── 11. Clean propagation fixtures pass scan ─────────────────────────────────

describe('scanPropagationText — governed propagation fixtures pass clean', () => {
  test('EXECUTIVE_READY propagation_summary has no violations', () => {
    const scan = scanPropagationText(PROPAGATION_EXECUTIVE_READY_FIXTURE.propagationProps.propagation_summary);
    assert.equal(scan.violations.length, 0);
  });

  test('Q-01 propagation_summary has no violations', () => {
    const scan = scanPropagationText(PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE.propagationProps.propagation_summary);
    assert.equal(scan.violations.length, 0);
  });

  test('DIAGNOSTIC propagation_summary has no forbidden patterns', () => {
    const scan = scanPropagationText(PROPAGATION_DIAGNOSTIC_FIXTURE.propagationProps.propagation_summary);
    assert.equal(scan.violations.length, 0);
  });

  test('Evidence linkage summaries have no violations', () => {
    PROPAGATION_EVIDENCE_LINKAGE_FIXTURE.evidence_links.forEach(link => {
      const scan = scanPropagationText(link.evidence_summary);
      assert.equal(scan.violations.length, 0);
    });
  });
});

// ─── 12. No topology mutation ─────────────────────────────────────────────────

describe('No topology mutation — input not modified', () => {
  test('mapPropagationState does not modify PROPAGATION_STATE_MAP', () => {
    const before = JSON.stringify(mapPropagationState('EXECUTIVE_READY'));
    mapPropagationState('EXECUTIVE_READY');
    const after = JSON.stringify(mapPropagationState('EXECUTIVE_READY'));
    assert.equal(before, after);
  });

  test('resolvePropagationDensityLayout does not modify propagationProps', () => {
    const props = {
      propagation_summary: 'Original summary.',
      propagation_chains: [{ path: ['A'], pressure_tier: 'HIGH', propagation_role: 'ORIGIN', origin_domain: 'A' }],
      evidence_links: [],
    };
    const propsCopy = { ...props, propagation_chains: [...props.propagation_chains] };
    resolvePropagationDensityLayout('EXECUTIVE_DENSE', props);
    assert.equal(props.propagation_summary, propsCopy.propagation_summary);
    assert.equal(props.propagation_chains.length, propsCopy.propagation_chains.length);
  });

  test('chain paths not reordered by mapper', () => {
    const chains = PROPAGATION_CHAIN_RENDER_FIXTURE.propagation_chains;
    const originalOrder = chains.map(c => c.propagation_role);
    assert.deepEqual(
      chains.map(c => c.propagation_role),
      originalOrder
    );
  });
});

// ─── 13. Determinism ─────────────────────────────────────────────────────────

describe('Determinism — same input produces same output', () => {
  test('mapPropagationState is deterministic', () => {
    const r1 = mapPropagationState('EXECUTIVE_READY_WITH_QUALIFIER');
    const r2 = mapPropagationState('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.deepEqual(r1, r2);
  });

  test('mapPropagationRole is deterministic', () => {
    const r1 = mapPropagationRole('ORIGIN');
    const r2 = mapPropagationRole('ORIGIN');
    assert.deepEqual(r1, r2);
  });

  test('mapPressureTier is deterministic', () => {
    const r1 = mapPressureTier('HIGH');
    const r2 = mapPressureTier('HIGH');
    assert.deepEqual(r1, r2);
  });

  test('resolvePropagationDensityLayout is deterministic', () => {
    const props = PROPAGATION_DENSITY_DENSE_FIXTURE.propagationProps;
    const r1 = resolvePropagationDensityLayout('EXECUTIVE_DENSE', props);
    const r2 = resolvePropagationDensityLayout('EXECUTIVE_DENSE', props);
    assert.deepEqual(r1, r2);
  });
});

// ─── 14. Governance: evidence references always preserved ────────────────────

describe('evidence_references_preserved — always true regardless of density', () => {
  test('EXECUTIVE_DENSE preserves evidence references', () => {
    const layout = resolvePropagationDensityLayout('EXECUTIVE_DENSE', { propagation_summary: 'x', propagation_chains: [{ path: ['A'] }], evidence_links: [{ domain_alias: 'A', propagation_role: 'ORIGIN', evidence_summary: 'y' }] });
    assert.equal(layout.evidence_references_preserved, true);
  });

  test('EXECUTIVE_BALANCED preserves evidence references', () => {
    const layout = resolvePropagationDensityLayout('EXECUTIVE_BALANCED', { propagation_summary: 'x', propagation_chains: [{ path: ['A'] }], evidence_links: [] });
    assert.equal(layout.evidence_references_preserved, true);
  });

  test('INVESTIGATION_DENSE preserves evidence references', () => {
    const layout = resolvePropagationDensityLayout('INVESTIGATION_DENSE', { propagation_summary: 'x', propagation_chains: [], evidence_links: [] });
    assert.equal(layout.evidence_references_preserved, true);
  });
});

// ─── 15. scanPropagationText edge cases ──────────────────────────────────────

describe('scanPropagationText — edge cases', () => {
  test('null input returns empty violations', () => {
    const scan = scanPropagationText(null);
    assert.equal(scan.violations.length, 0);
  });

  test('empty string returns empty violations', () => {
    const scan = scanPropagationText('');
    assert.equal(scan.violations.length, 0);
  });

  test('non-string input returns empty violations', () => {
    const scan = scanPropagationText(42);
    assert.equal(scan.violations.length, 0);
  });

  test('all violation categories present in result', () => {
    const scan = scanPropagationText('');
    assert.ok('violations' in scan);
    assert.ok('predictive' in scan);
    assert.ok('recommendation' in scan);
    assert.ok('speculative' in scan);
    assert.ok('ai_phrasing' in scan);
    assert.ok('geios' in scan);
    assert.ok('probabilistic' in scan);
  });
});
