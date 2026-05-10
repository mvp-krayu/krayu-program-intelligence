'use strict';

/**
 * sqo-runtime-overlays.test.js
 * PI.SQO.RUNTIME-OVERLAY-SYSTEM.01
 *
 * Verifies additive SQO overlay integration into the LENS v2 runtime.
 * Covers: overlay resolution for both clients, degradation fail-safety,
 * binding integration, governance disclosure, no PATH B mutation,
 * no Q-class mutation, no substrate mutation, no AI language,
 * no client-name branching, and full regression compatibility.
 */

const path = require('node:path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { resolveSQOOverlays } = require('../../lib/lens-v2/sqo/SQOOverlayStateResolver');
const { loadAllSQOArtifacts, SQO_ARTIFACT_KEYS } = require('../../lib/lens-v2/sqo/SQORuntimeOverlayLoader');
const { assessDegradation, buildDegradedOverlay, buildGovernanceDisclosure, isArtifactAvailable } = require('../../lib/lens-v2/sqo/SQOOverlayDegradationHandler');
const {
  formatQualificationBanner,
  formatMaturityPanel,
  formatGravityIndicator,
  formatStabilityIndicator,
  formatDebtSummary,
  formatProgressionSummary,
  resolveWarnings,
  S_STATE_LABELS,
  S_STATE_AUTHORIZATION,
  S_STATE_BOARDROOM,
  GRAVITY_DESCRIPTIONS,
  STABILITY_DESCRIPTIONS,
} = require('../../lib/lens-v2/sqo/SQOOverlayFormatter');
const {
  resolveFlagshipBinding,
  DEFAULT_BINDING_CLIENT,
  DEFAULT_BINDING_RUN,
} = require('../../lib/lens-v2/flagshipBinding');
const { resolveBlueEdgePayload } = require('../../lib/lens-v2/BlueEdgePayloadResolver');

const BE_CLIENT = 'blueedge';
const BE_RUN = 'run_blueedge_productized_01_fixed';
const FA_CLIENT = 'fastapi';
const FA_RUN = 'run_02_oss_fastapi_pipeline';

// ────────────────────────────────────────────────────────────────────────────
// 1. BlueEdge overlay rendering
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge SQO overlay rendering', () => {
  const overlay = resolveSQOOverlays(BE_CLIENT, BE_RUN);

  it('overlay is available with no degradation', () => {
    assert.equal(overlay.available, true);
    assert.equal(overlay.degradation_reason, null);
  });

  it('qualification banner shows S2 state', () => {
    assert.ok(overlay.qualification_banner);
    assert.equal(overlay.qualification_banner.s_state, 'S2');
    assert.equal(overlay.qualification_banner.s_state_label, 'PARTIAL GROUNDING WITH CONTINUITY');
    assert.equal(overlay.qualification_banner.authorization_tier, 'AUTHORIZED WITH QUALIFICATION');
    assert.equal(overlay.qualification_banner.boardroom_readiness, 'BOARDROOM QUALIFIED');
  });

  it('maturity panel shows STABLE overall with 8 dimensions', () => {
    assert.ok(overlay.maturity_panel);
    assert.equal(overlay.maturity_panel.overall_score, 0.625);
    assert.equal(overlay.maturity_panel.overall_classification, 'STABLE');
    const dims = overlay.maturity_panel.dimensions;
    assert.equal(Object.keys(dims).length, 8);
    assert.equal(dims.D4.classification, 'STRONG');
    assert.equal(dims.D5.classification, 'STRONG');
  });

  it('gravity indicator shows EMERGING', () => {
    assert.ok(overlay.gravity_indicator);
    assert.equal(overlay.gravity_indicator.classification, 'EMERGING');
    assert.equal(overlay.gravity_indicator.score, 0.45);
  });

  it('stability indicator shows STABLE', () => {
    assert.ok(overlay.stability_indicator);
    assert.equal(overlay.stability_indicator.classification, 'STABLE');
    assert.equal(overlay.stability_indicator.score, 0.692);
  });

  it('debt summary populated with non-zero counts', () => {
    assert.ok(overlay.debt_summary);
    assert.ok(overlay.debt_summary.total_debt_items > 0);
    assert.equal(typeof overlay.debt_summary.blocking_count, 'number');
  });

  it('progression summary targets S3', () => {
    assert.ok(overlay.progression_summary);
    assert.equal(overlay.progression_summary.current_s_state, 'S2');
    assert.equal(overlay.progression_summary.next_s_state, 'S3');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. FastAPI overlay rendering
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI SQO overlay rendering', () => {
  const overlay = resolveSQOOverlays(FA_CLIENT, FA_RUN);

  it('overlay is available with no degradation', () => {
    assert.equal(overlay.available, true);
    assert.equal(overlay.degradation_reason, null);
  });

  it('qualification banner shows S1 state', () => {
    assert.ok(overlay.qualification_banner);
    assert.equal(overlay.qualification_banner.s_state, 'S1');
    assert.equal(overlay.qualification_banner.s_state_label, 'STRUCTURAL LABELS ONLY');
    assert.equal(overlay.qualification_banner.authorization_tier, 'NOT AUTHORIZED');
    assert.equal(overlay.qualification_banner.boardroom_readiness, 'NOT READY');
  });

  it('maturity panel shows LOW overall', () => {
    assert.ok(overlay.maturity_panel);
    assert.equal(overlay.maturity_panel.overall_score, 0.208);
    assert.equal(overlay.maturity_panel.overall_classification, 'LOW');
  });

  it('gravity indicator shows FRAGMENTED', () => {
    assert.ok(overlay.gravity_indicator);
    assert.equal(overlay.gravity_indicator.classification, 'FRAGMENTED');
  });

  it('stability indicator shows UNSTABLE', () => {
    assert.ok(overlay.stability_indicator);
    assert.equal(overlay.stability_indicator.classification, 'UNSTABLE');
  });

  it('progression summary targets S2', () => {
    assert.ok(overlay.progression_summary);
    assert.equal(overlay.progression_summary.current_s_state, 'S1');
    assert.equal(overlay.progression_summary.next_s_state, 'S2');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Governance disclosure visibility
// ────────────────────────────────────────────────────────────────────────────

describe('Governance disclosure', () => {
  it('both clients include governance disclosure', () => {
    const be = resolveSQOOverlays(BE_CLIENT, BE_RUN);
    const fa = resolveSQOOverlays(FA_CLIENT, FA_RUN);

    for (const overlay of [be, fa]) {
      assert.ok(overlay.governance_disclosure);
      assert.equal(overlay.governance_disclosure.sqo_advisory_only, true);
      assert.equal(overlay.governance_disclosure.deterministic_scoring, true);
      assert.equal(overlay.governance_disclosure.no_ai_inference, true);
      assert.equal(overlay.governance_disclosure.no_substrate_mutation, true);
      assert.equal(overlay.governance_disclosure.qualification_disclosures_active, true);
    }
  });

  it('degraded overlay still includes governance disclosure', () => {
    const degraded = buildDegradedOverlay();
    assert.ok(degraded.governance_disclosure);
    assert.equal(degraded.governance_disclosure.sqo_advisory_only, true);
    assert.equal(degraded.governance_disclosure.no_ai_inference, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Fail-safety and degradation
// ────────────────────────────────────────────────────────────────────────────

describe('Overlay fail-safety and degradation', () => {
  it('missing artifacts produce degraded overlay shape', () => {
    const degraded = buildDegradedOverlay();
    assert.equal(degraded.available, false);
    assert.equal(degraded.degradation_reason, 'SQO_ARTIFACTS_UNAVAILABLE');
    assert.equal(degraded.qualification_banner, null);
    assert.equal(degraded.maturity_panel, null);
    assert.equal(degraded.gravity_indicator, null);
    assert.equal(degraded.stability_indicator, null);
    assert.equal(degraded.debt_summary, null);
    assert.equal(degraded.progression_summary, null);
    assert.deepEqual(degraded.warnings, []);
  });

  it('assessDegradation detects null/failed result', () => {
    assert.equal(assessDegradation(null).degraded, true);
    assert.equal(assessDegradation({ ok: false }).degraded, true);
  });

  it('assessDegradation detects missing critical artifacts', () => {
    const result = {
      ok: true,
      artifacts: {
        qualification_state: { ok: false },
        semantic_maturity_profile: { ok: false },
      },
    };
    const d = assessDegradation(result);
    assert.equal(d.degraded, true);
    assert.equal(d.reason, 'CRITICAL_ARTIFACTS_MISSING');
    assert.ok(d.missing.includes('qualification_state'));
    assert.ok(d.missing.includes('semantic_maturity_profile'));
  });

  it('isArtifactAvailable returns false for missing/failed', () => {
    assert.equal(isArtifactAvailable(null, 'foo'), false);
    assert.equal(isArtifactAvailable({ artifacts: {} }, 'foo'), false);
    assert.equal(isArtifactAvailable({ artifacts: { foo: { ok: false } } }, 'foo'), false);
    assert.equal(isArtifactAvailable({ artifacts: { foo: { ok: true, data: null } } }, 'foo'), false);
  });

  it('formatter functions return null on null input', () => {
    assert.equal(formatQualificationBanner(null), null);
    assert.equal(formatMaturityPanel(null), null);
    assert.equal(formatGravityIndicator(null), null);
    assert.equal(formatStabilityIndicator(null), null);
    assert.equal(formatDebtSummary(null), null);
    assert.equal(formatProgressionSummary(null), null);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Binding integration — SQO overlays in flagshipBinding
// ────────────────────────────────────────────────────────────────────────────

describe('Binding integration — sqoOverlays in flagshipBinding', () => {
  it('default route returns sqoOverlays in props', () => {
    const result = resolveFlagshipBinding({ query: {} });
    assert.equal(result.statusCode, 200);
    assert.ok(result.props.sqoOverlays);
    assert.equal(result.props.sqoOverlays.available, true);
    assert.equal(result.props.sqoOverlays.qualification_banner.s_state, 'S2');
  });

  it('explicit blueedge route returns sqoOverlays', () => {
    const result = resolveFlagshipBinding({ query: { client: BE_CLIENT, run: BE_RUN } });
    assert.equal(result.statusCode, 200);
    assert.ok(result.props.sqoOverlays);
    assert.equal(result.props.sqoOverlays.available, true);
  });

  it('fastapi route returns sqoOverlays even on payload failure', () => {
    const result = resolveFlagshipBinding({ query: { client: FA_CLIENT, run: FA_RUN } });
    assert.ok(result.props.sqoOverlays);
    assert.equal(result.props.sqoOverlays.qualification_banner.s_state, 'S1');
  });

  it('invalid param route returns sqoOverlays as null', () => {
    const result = resolveFlagshipBinding({ query: { client: '../exploit', run: 'x' } });
    assert.equal(result.statusCode, 400);
    assert.equal(result.props.sqoOverlays, null);
  });

  it('unknown client/run returns sqoOverlays as null', () => {
    const result = resolveFlagshipBinding({ query: { client: 'unknown', run: 'unknown_run' } });
    assert.equal(result.statusCode, 404);
    assert.equal(result.props.sqoOverlays, null);
  });

  it('SQO overlay failure does not crash binding', () => {
    const result = resolveFlagshipBinding({ query: {} });
    assert.ok(result.props.livePayload);
    assert.equal(result.statusCode, 200);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. No PATH B mutation — overlay is additive only
// ────────────────────────────────────────────────────────────────────────────

describe('No PATH B mutation', () => {
  it('livePayload unchanged by overlay presence', () => {
    const withOverlay = resolveFlagshipBinding({ query: {} });
    const payload = withOverlay.props.livePayload;
    assert.ok(payload);
    assert.ok(payload.ok);
    assert.ok(payload.evidence_blocks);
    assert.ok(payload.qualifier_summary);
    assert.ok(!payload.sqoOverlays, 'sqoOverlays must NOT be inside payload');
  });

  it('evidence_blocks unchanged by overlay presence', () => {
    const directPayload = resolveBlueEdgePayload(BE_CLIENT, BE_RUN);
    const bindingResult = resolveFlagshipBinding({ query: {} });
    assert.deepEqual(
      bindingResult.props.livePayload.evidence_blocks,
      directPayload.evidence_blocks,
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. No Q-class mutation
// ────────────────────────────────────────────────────────────────────────────

describe('No Q-class mutation', () => {
  it('qualifier_class unchanged by overlay integration', () => {
    const directPayload = resolveBlueEdgePayload(BE_CLIENT, BE_RUN);
    const bindingResult = resolveFlagshipBinding({ query: {} });
    assert.equal(
      bindingResult.props.livePayload.qualifier_class,
      directPayload.qualifier_class,
    );
    assert.equal(
      bindingResult.props.livePayload.qualifier_summary.qualifier_class,
      directPayload.qualifier_summary.qualifier_class,
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. No AI language in overlay output
// ────────────────────────────────────────────────────────────────────────────

describe('No AI language in overlay output', () => {
  const AI_PATTERNS = [
    /\bpredict\b/i, /\brecommend\b/i, /\bsuggest\b/i,
    /\bmachine learning\b/i, /\bneural\b/i, /\bAI-powered\b/i,
    /\bintelligent\b/i,
  ];

  function checkDescriptiveText(overlay) {
    const textFields = [
      overlay.qualification_banner,
      overlay.gravity_indicator,
      overlay.stability_indicator,
      overlay.debt_summary,
      overlay.progression_summary,
      ...(overlay.warnings || []),
    ].filter(Boolean);
    const text = JSON.stringify(textFields);
    for (const pattern of AI_PATTERNS) {
      assert.ok(!pattern.test(text), `found AI language "${pattern}" in overlay text`);
    }
  }

  it('BlueEdge overlay contains no AI language', () => {
    checkDescriptiveText(resolveSQOOverlays(BE_CLIENT, BE_RUN));
  });

  it('FastAPI overlay contains no AI language', () => {
    checkDescriptiveText(resolveSQOOverlays(FA_CLIENT, FA_RUN));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. No client-name branching in overlay modules
// ────────────────────────────────────────────────────────────────────────────

describe('No client-name branching in overlay modules', () => {
  const fs = require('node:fs');
  const overlayDir = path.join(__dirname, '..', '..', 'lib', 'lens-v2', 'sqo');

  const OVERLAY_FILES = [
    'SQORuntimeOverlayLoader.js',
    'SQOOverlayDegradationHandler.js',
    'SQOOverlayFormatter.js',
    'SQOOverlayStateResolver.js',
  ];

  for (const file of OVERLAY_FILES) {
    it(`${file} contains no hardcoded client names`, () => {
      const content = fs.readFileSync(path.join(overlayDir, file), 'utf-8');
      assert.ok(!content.includes("'blueedge'"), `${file} hardcodes blueedge`);
      assert.ok(!content.includes("'fastapi'"), `${file} hardcodes fastapi`);
      assert.ok(!content.includes('"blueedge"'), `${file} hardcodes blueedge`);
      assert.ok(!content.includes('"fastapi"'), `${file} hardcodes fastapi`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 10. SQO artifact loader
// ────────────────────────────────────────────────────────────────────────────

describe('SQO runtime overlay loader', () => {
  it('loads all BlueEdge artifacts', () => {
    const result = loadAllSQOArtifacts(BE_CLIENT, BE_RUN);
    assert.equal(result.ok, true);
    assert.equal(result.client, BE_CLIENT);
    assert.ok(result.loaded_count > 0);
    assert.equal(result.total_count, SQO_ARTIFACT_KEYS.length);
  });

  it('loads all FastAPI artifacts', () => {
    const result = loadAllSQOArtifacts(FA_CLIENT, FA_RUN);
    assert.equal(result.ok, true);
    assert.equal(result.client, FA_CLIENT);
    assert.ok(result.loaded_count > 0);
  });

  it('unregistered client returns not ok', () => {
    const result = loadAllSQOArtifacts('nonexistent', 'fake_run');
    assert.equal(result.ok, false);
  });

  it('runtime warnings resolve based on s_state', () => {
    const w0 = resolveWarnings('S0');
    assert.ok(w0.length > 0);
    assert.equal(w0[0].s_state, 'S0');
    const w3 = resolveWarnings('S3');
    assert.ok(w3.length > 0);
    assert.equal(w3[0].s_state, 'S3');
  });
});
