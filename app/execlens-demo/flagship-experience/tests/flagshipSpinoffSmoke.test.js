'use strict';

/**
 * flagshipSpinoffSmoke.test.js
 * PI.LENS.V2.FLAGSHIP-SPINOFF-MOUNTPOINT.01
 *
 * Smoke test for the /lens-v2-flagship spinoff route data layer.
 * Verifies that all modules the page depends on:
 *   - load without error
 *   - produce correct output from FLAGSHIP_REAL_REPORT
 *   - produce JSON-serializable props (as required by Next.js page rendering)
 *   - preserve all governance invariants
 *
 * Tests the data layer only — no JSX rendering required.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveGravityToken,
  resolvePresenceToken,
} = require('../flagshipOrchestration');

const {
  FLAGSHIP_REAL_REPORT,
  FLAGSHIP_PROPAGATION_CHAINS,
  FLAGSHIP_REAL_REPORT_EXPECTED,
} = require('../fixtures/flagship_real_report.fixture');

// ────────────────────────────────────────────────────────────────────────────
// 1. Module load — all spinoff page dependencies load without error
// ────────────────────────────────────────────────────────────────────────────

describe('Spinoff route — module dependencies load', () => {
  it('orchestrateFlagshipExperience is a function', () => {
    assert.equal(typeof orchestrateFlagshipExperience, 'function');
  });

  it('FLAGSHIP_REAL_REPORT is an object', () => {
    assert.equal(typeof FLAGSHIP_REAL_REPORT, 'object');
    assert.ok(FLAGSHIP_REAL_REPORT !== null);
  });

  it('FLAGSHIP_PROPAGATION_CHAINS is an array', () => {
    assert.ok(Array.isArray(FLAGSHIP_PROPAGATION_CHAINS));
  });

  it('resolveBoardroomConfig is a function', () => {
    assert.equal(typeof resolveBoardroomConfig, 'function');
  });

  it('resolveGravityToken is a function', () => {
    assert.equal(typeof resolveGravityToken, 'function');
  });

  it('resolvePresenceToken is a function', () => {
    assert.equal(typeof resolvePresenceToken, 'function');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Orchestration — real report produces correct state
// ────────────────────────────────────────────────────────────────────────────

describe('Spinoff route — orchestration produces correct state', () => {
  let result;

  // Run once and reuse
  result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE', false, 'SUMMARY');

  it('renderState matches expected', () => {
    assert.equal(result.renderState, FLAGSHIP_REAL_REPORT_EXPECTED.renderState);
  });

  it('renderState is EXECUTIVE_READY_WITH_QUALIFIER', () => {
    assert.equal(result.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
  });

  it('adapted.readinessBadge is present', () => {
    assert.ok(result.adapted.readinessBadge);
  });

  it('adapted.qualifierChip is present for Q-01', () => {
    assert.ok(result.adapted.qualifierChip);
    assert.equal(result.adapted.qualifierChip.renders, true);
  });

  it('adapted.narrative.executive_summary is a non-empty string', () => {
    assert.ok(result.adapted.narrative && result.adapted.narrative.executive_summary);
    assert.equal(typeof result.adapted.narrative.executive_summary, 'string');
    assert.ok(result.adapted.narrative.executive_summary.length > 0);
  });

  it('adapted.narrative.why_primary_statement is a non-empty string', () => {
    assert.ok(result.adapted.narrative && result.adapted.narrative.why_primary_statement);
    assert.equal(typeof result.adapted.narrative.why_primary_statement, 'string');
  });

  it('motionProfile.profile is QUALIFIED_AUTHORITATIVE', () => {
    assert.equal(result.motionProfile.profile, 'QUALIFIED_AUTHORITATIVE');
  });

  it('gravityToken is gravity-qualifier for Q-01 state', () => {
    assert.equal(result.gravityToken, 'gravity-qualifier');
  });

  it('presenceToken is presence-qualified-authority', () => {
    assert.equal(result.presenceToken, 'presence-qualified-authority');
  });

  it('investigationStage is SUMMARY', () => {
    assert.equal(result.investigationStage, 'SUMMARY');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Props serialization — Next.js requires JSON-serializable props
// ────────────────────────────────────────────────────────────────────────────

describe('Spinoff route — props are JSON-serializable', () => {
  it('renderState is JSON-serializable', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.doesNotThrow(() => JSON.stringify(result.renderState));
  });

  it('narrative fields are JSON-serializable', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const narrative = result.adapted.narrative;
    assert.doesNotThrow(() => JSON.stringify({
      executive_summary: narrative.executive_summary,
      why_primary_statement: narrative.why_primary_statement,
      structural_summary: narrative.structural_summary,
    }));
  });

  it('FLAGSHIP_PROPAGATION_CHAINS is JSON-serializable', () => {
    assert.doesNotThrow(() => JSON.stringify(FLAGSHIP_PROPAGATION_CHAINS));
  });

  it('evidence_blocks are JSON-serializable', () => {
    assert.doesNotThrow(() => JSON.stringify(FLAGSHIP_REAL_REPORT.evidence_blocks));
  });

  it('governance invariants are JSON-serializable', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.doesNotThrow(() => JSON.stringify(result.governance));
  });

  it('boardroomConfig is JSON-serializable', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY_WITH_QUALIFIER', 'EXECUTIVE_DENSE');
    assert.doesNotThrow(() => JSON.stringify(config));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Density switching — page supports 3 density classes
// ────────────────────────────────────────────────────────────────────────────

describe('Spinoff route — density switching', () => {
  it('EXECUTIVE_BALANCED density produces correct result', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_BALANCED');
    assert.equal(result.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.densityClass, 'EXECUTIVE_BALANCED');
  });

  it('EXECUTIVE_DENSE density produces correct result', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result.densityClass, 'EXECUTIVE_DENSE');
  });

  it('INVESTIGATION_DENSE density produces correct result', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'INVESTIGATION_DENSE');
    assert.equal(result.densityClass, 'INVESTIGATION_DENSE');
  });

  it('qualifier_notice_visible true across all density classes', () => {
    ['EXECUTIVE_BALANCED', 'EXECUTIVE_DENSE', 'INVESTIGATION_DENSE'].forEach(density => {
      const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', density);
      assert.equal(result.densityLayout.qualifier_notice_visible, true,
        `qualifier_notice_visible should be true for density ${density}`);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Boardroom mode — page exposes boardroom toggle
// ────────────────────────────────────────────────────────────────────────────

describe('Spinoff route — boardroom mode', () => {
  it('boardroomConfig for Q-01 state has CONTROLLED pacing', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY_WITH_QUALIFIER', 'EXECUTIVE_BALANCED');
    assert.equal(config.pacing, 'CONTROLLED');
  });

  it('boardroomConfig has no_prompt_surfaces true', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY_WITH_QUALIFIER', 'EXECUTIVE_BALANCED');
    assert.equal(config.no_prompt_surfaces, true);
  });

  it('boardroomConfig has no_chatbot_ux true', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY_WITH_QUALIFIER', 'EXECUTIVE_DENSE');
    assert.equal(config.no_chatbot_ux, true);
  });

  it('boardroom active flag passed to orchestration correctly', () => {
    const withBoardroom = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_BALANCED', true);
    const withoutBoardroom = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_BALANCED', false);
    assert.equal(withBoardroom.boardroomActive, true);
    assert.equal(withoutBoardroom.boardroomActive, false);
    assert.equal(withBoardroom.renderState, withoutBoardroom.renderState);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Route isolation — old root unchanged
// ────────────────────────────────────────────────────────────────────────────

describe('Spinoff route — isolation verification', () => {
  it('FLAGSHIP_REAL_REPORT has correct report_id', () => {
    assert.equal(FLAGSHIP_REAL_REPORT.report_id, 'RPT-FLAGSHIP-REAL-001');
  });

  it('spinoff route uses distinct stream_ref from 42.x demo', () => {
    assert.equal(FLAGSHIP_REAL_REPORT.stream_ref, 'PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01');
    assert.notEqual(FLAGSHIP_REAL_REPORT.stream_ref, 'PI.LENS.NEXTGEN-REPORTS.TEST.01');
  });

  it('orchestration result governance has all required invariants', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const required = [
      'topology_always_read_only', 'qualifier_never_suppressed',
      'blocked_state_never_softened', 'diagnostic_state_never_softened',
      'evidence_references_always_preserved', 'no_ai_calls',
      'no_prompt_surfaces', 'no_chatbot_ux', 'no_animated_propagation',
      'no_topology_mutation', 'no_semantic_mutation',
    ];
    required.forEach(key => {
      assert.ok(key in result.governance, `governance.${key} missing`);
      assert.equal(result.governance[key], true, `governance.${key} must be true`);
    });
  });
});
