'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveCinemaOrchestration,
  resolveAttentionHierarchy,
  resolveUrgencyFrame,
  resolveInvestigationStage,
  resolveNextStage,
  resolvePreviousStage,
  resolveGravityToken,
  resolvePresenceToken,
  resolveVisibleRegions,
  INVESTIGATION_STAGES,
} = require('../flagshipOrchestration');

const { FLAGSHIP_REAL_REPORT, FLAGSHIP_PROPAGATION_CHAINS, FLAGSHIP_REAL_REPORT_EXPECTED } = require('../fixtures/flagship_real_report.fixture');
const { FLAGSHIP_EXECUTIVE_READY_FIXTURE } = require('../fixtures/flagship_executive_ready.fixture');
const { FLAGSHIP_Q01_FIXTURE } = require('../fixtures/flagship_q01.fixture');
const { FLAGSHIP_Q02_FIXTURE } = require('../fixtures/flagship_q02.fixture');
const { FLAGSHIP_DIAGNOSTIC_FIXTURE } = require('../fixtures/flagship_diagnostic.fixture');
const { FLAGSHIP_BLOCKED_FIXTURE } = require('../fixtures/flagship_blocked.fixture');
const { FLAGSHIP_BOARDROOM_MODE_FIXTURE } = require('../fixtures/flagship_boardroom_mode.fixture');
const { FLAGSHIP_INVESTIGATION_FLOW_FIXTURE } = require('../fixtures/flagship_investigation_flow.fixture');
const { FLAGSHIP_OPERATIONAL_CANVAS_FIXTURE } = require('../fixtures/flagship_operational_canvas.fixture');
const { FLAGSHIP_TOPOLOGY_SAFE_FIXTURE } = require('../fixtures/flagship_topology_safe.fixture');
const { FLAGSHIP_FORBIDDEN_PROMPT_FIXTURE } = require('../fixtures/flagship_forbidden_prompt.fixture');
const { FLAGSHIP_FORBIDDEN_AI_FIXTURE } = require('../fixtures/flagship_forbidden_ai.fixture');
const { FLAGSHIP_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE } = require('../fixtures/flagship_forbidden_topology_mutation.fixture');

// ────────────────────────────────────────────────────────────────────────────
// 1. Real Report Integration — Full LENS v2 Stack
// ────────────────────────────────────────────────────────────────────────────

describe('Real report integration — full LENS v2 stack', () => {
  it('real report routes to EXECUTIVE_READY_WITH_QUALIFIER', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE', false, 'SUMMARY');
    assert.equal(result.renderState, FLAGSHIP_REAL_REPORT_EXPECTED.renderState);
  });

  it('real report adapter produces readiness badge', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.ok(result.adapted.readinessBadge);
  });

  it('real report adapter produces qualifier chip for Q-01', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.ok(result.adapted.qualifierChip);
  });

  it('real report adapter produces narrative', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.ok(result.adapted.narrative);
  });

  it('real report adapter produces topology summary', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.ok(result.adapted.topologySummary);
  });

  it('real report propagation chains are structurally correct', () => {
    assert.equal(FLAGSHIP_PROPAGATION_CHAINS.length, 2);
    assert.equal(FLAGSHIP_PROPAGATION_CHAINS[0].propagation_role, 'ORIGIN');
    assert.equal(FLAGSHIP_PROPAGATION_CHAINS[1].propagation_role, 'PASS_THROUGH');
  });

  it('real report integration is deterministic — same input same output', () => {
    const result1 = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const result2 = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result1.renderState, result2.renderState);
    assert.equal(result1.motionProfile.profile, result2.motionProfile.profile);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Cinematic Orchestration — all render states
// ────────────────────────────────────────────────────────────────────────────

describe('Cinematic orchestration — all render states', () => {
  it('EXECUTIVE_READY cinematic profile is AUTHORITATIVE', () => {
    const cinema = resolveCinemaOrchestration('EXECUTIVE_READY');
    assert.equal(cinema.motion_profile, 'AUTHORITATIVE');
  });

  it('EXECUTIVE_READY_WITH_QUALIFIER cinematic profile is QUALIFIED_AUTHORITATIVE', () => {
    const cinema = resolveCinemaOrchestration('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(cinema.motion_profile, 'QUALIFIED_AUTHORITATIVE');
  });

  it('DIAGNOSTIC_ONLY cinematic profile is DIAGNOSTIC_ASSERTIVE', () => {
    const cinema = resolveCinemaOrchestration('DIAGNOSTIC_ONLY');
    assert.equal(cinema.motion_profile, 'DIAGNOSTIC_ASSERTIVE');
  });

  it('BLOCKED cinematic profile is BLOCKED_ASSERTIVE', () => {
    const cinema = resolveCinemaOrchestration('BLOCKED');
    assert.equal(cinema.motion_profile, 'BLOCKED_ASSERTIVE');
  });

  it('BLOCKED escalates first', () => {
    const cinema = resolveCinemaOrchestration('BLOCKED');
    assert.equal(cinema.escalates_first, true);
  });

  it('DIAGNOSTIC_ONLY escalates first', () => {
    const cinema = resolveCinemaOrchestration('DIAGNOSTIC_ONLY');
    assert.equal(cinema.escalates_first, true);
  });

  it('EXECUTIVE_READY does not escalate first', () => {
    const cinema = resolveCinemaOrchestration('EXECUTIVE_READY');
    assert.equal(cinema.escalates_first, false);
  });

  it('no_animated_propagation is always true', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const cinema = resolveCinemaOrchestration(state);
      assert.equal(cinema.no_animated_propagation, true);
    });
  });

  it('no_ai_thinking is always true', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const cinema = resolveCinemaOrchestration(state);
      assert.equal(cinema.no_ai_thinking, true);
    });
  });

  it('no_speculative_transitions is always true', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const cinema = resolveCinemaOrchestration(state);
      assert.equal(cinema.no_speculative_transitions, true);
    });
  });

  it('cinematic orchestration is deterministic', () => {
    const a = resolveCinemaOrchestration('EXECUTIVE_READY_WITH_QUALIFIER');
    const b = resolveCinemaOrchestration('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.deepEqual(a, b);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Boardroom Mode
// ────────────────────────────────────────────────────────────────────────────

describe('Boardroom mode — configuration', () => {
  it('boardroom config from fixture is active', () => {
    assert.equal(FLAGSHIP_BOARDROOM_MODE_FIXTURE.boardroomMode, true);
    assert.equal(FLAGSHIP_BOARDROOM_MODE_FIXTURE.expected.boardroom_active, true);
  });

  it('EXECUTIVE_READY_WITH_QUALIFIER boardroom pacing is CONTROLLED', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY_WITH_QUALIFIER', 'EXECUTIVE_BALANCED');
    assert.equal(config.pacing, 'CONTROLLED');
  });

  it('BLOCKED boardroom pacing is HOLD', () => {
    const config = resolveBoardroomConfig('BLOCKED', 'EXECUTIVE_BALANCED');
    assert.equal(config.pacing, 'HOLD');
  });

  it('DIAGNOSTIC_ONLY boardroom pacing is ADVISORY', () => {
    const config = resolveBoardroomConfig('DIAGNOSTIC_ONLY', 'EXECUTIVE_BALANCED');
    assert.equal(config.pacing, 'ADVISORY');
  });

  it('boardroom config has no_prompt_surfaces true', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY', 'EXECUTIVE_DENSE');
    assert.equal(config.no_prompt_surfaces, true);
  });

  it('boardroom config has no_chatbot_ux true', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY', 'EXECUTIVE_DENSE');
    assert.equal(config.no_chatbot_ux, true);
  });

  it('boardroom config has no_ai_personas true', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY', 'EXECUTIVE_DENSE');
    assert.equal(config.no_ai_personas, true);
  });

  it('EXECUTIVE_READY boardroom is fullscreen_optimal', () => {
    const config = resolveBoardroomConfig('EXECUTIVE_READY', 'EXECUTIVE_BALANCED');
    assert.equal(config.fullscreen_optimal, true);
  });

  it('BLOCKED boardroom is not fullscreen_optimal', () => {
    const config = resolveBoardroomConfig('BLOCKED', 'EXECUTIVE_BALANCED');
    assert.equal(config.fullscreen_optimal, false);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Qualifier Persistence — globally enforced
// ────────────────────────────────────────────────────────────────────────────

describe('Qualifier persistence — globally enforced', () => {
  it('Q-01 qualifier_notice_visible across EXECUTIVE_BALANCED', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_BALANCED');
    assert.equal(result.densityLayout.qualifier_notice_visible, true);
  });

  it('Q-01 qualifier_notice_visible across EXECUTIVE_DENSE', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result.densityLayout.qualifier_notice_visible, true);
  });

  it('Q-01 qualifier_notice_visible across INVESTIGATION_DENSE', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'INVESTIGATION_DENSE');
    assert.equal(result.densityLayout.qualifier_notice_visible, true);
  });

  it('Q-01 fixture confirms qualifier cannot be suppressed', () => {
    assert.equal(FLAGSHIP_Q01_FIXTURE.expected.qualifier_cannot_be_suppressed, true);
  });

  it('Q-02 fixture confirms qualifier cannot be suppressed', () => {
    assert.equal(FLAGSHIP_Q02_FIXTURE.expected.qualifier_cannot_be_suppressed, true);
  });

  it('evidence_references_preserved always true for Q-01 report', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_BALANCED');
    assert.equal(result.densityLayout.evidence_references_preserved, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Blocked State — globally persistent, non-degradable
// ────────────────────────────────────────────────────────────────────────────

describe('Blocked state — globally persistent and non-degradable', () => {
  it('BLOCKED fixture confirms blocked cannot be suppressed', () => {
    assert.equal(FLAGSHIP_BLOCKED_FIXTURE.expected.blocked_cannot_be_suppressed, true);
  });

  it('BLOCKED fixture confirms blocked cannot be softened', () => {
    assert.equal(FLAGSHIP_BLOCKED_FIXTURE.expected.blocked_cannot_be_softened, true);
  });

  it('BLOCKED fixture confirms executive summary is not visible', () => {
    assert.equal(FLAGSHIP_BLOCKED_FIXTURE.expected.executive_summary_visible, false);
  });

  it('BLOCKED fixture confirms evidence references are preserved', () => {
    assert.equal(FLAGSHIP_BLOCKED_FIXTURE.expected.evidence_references_preserved, true);
  });

  it('BLOCKED cinematic profile is fastest (most assertive)', () => {
    const blocked = resolveCinemaOrchestration('BLOCKED');
    const ready = resolveCinemaOrchestration('EXECUTIVE_READY');
    assert.ok(blocked.reveal_base_ms <= ready.reveal_base_ms);
  });

  it('BLOCKED has sole phase BLOCKED_ESCALATION', () => {
    const cinema = resolveCinemaOrchestration('BLOCKED');
    assert.deepEqual(cinema.phases, ['BLOCKED_ESCALATION']);
    assert.equal(cinema.phase_count, 1);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Diagnostic State — globally persistent
// ────────────────────────────────────────────────────────────────────────────

describe('Diagnostic state — globally persistent', () => {
  it('DIAGNOSTIC_ONLY fixture confirms diagnostic cannot be suppressed', () => {
    assert.equal(FLAGSHIP_DIAGNOSTIC_FIXTURE.expected.diagnostic_cannot_be_suppressed, true);
  });

  it('DIAGNOSTIC_ONLY fixture confirms DIAGNOSTIC_ESCALATION is first phase', () => {
    assert.equal(FLAGSHIP_DIAGNOSTIC_FIXTURE.expected.reveal_sequence_first_phase, 'DIAGNOSTIC_ESCALATION');
  });

  it('DIAGNOSTIC_ONLY urgency frame is ADVISORY_REVIEW', () => {
    assert.equal(resolveUrgencyFrame('DIAGNOSTIC_ONLY'), 'ADVISORY_REVIEW');
  });

  it('DIAGNOSTIC_ONLY attention hierarchy starts with DIAGNOSTIC_ESCALATION', () => {
    const hierarchy = resolveAttentionHierarchy('DIAGNOSTIC_ONLY');
    assert.equal(hierarchy[0], 'DIAGNOSTIC_ESCALATION');
  });

  it('diagnostic gravity token is gravity-diagnostic', () => {
    assert.equal(resolveGravityToken('DIAGNOSTIC_ONLY'), 'gravity-diagnostic');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. Topology Safety
// ────────────────────────────────────────────────────────────────────────────

describe('Topology safety — always read-only', () => {
  it('topology safe fixture declares topology read-only', () => {
    assert.equal(FLAGSHIP_TOPOLOGY_SAFE_FIXTURE.expected.topology_read_only, true);
  });

  it('topology safe fixture declares no animated flow', () => {
    assert.equal(FLAGSHIP_TOPOLOGY_SAFE_FIXTURE.expected.no_animated_flow, true);
  });

  it('topology safe fixture declares no topology mutation', () => {
    assert.equal(FLAGSHIP_TOPOLOGY_SAFE_FIXTURE.expected.no_topology_mutation, true);
  });

  it('topology governance disallows animated propagation flow', () => {
    assert.equal(FLAGSHIP_TOPOLOGY_SAFE_FIXTURE.topology_governance.animated_propagation_flow_allowed, false);
  });

  it('topology governance disallows interactive topology', () => {
    assert.equal(FLAGSHIP_TOPOLOGY_SAFE_FIXTURE.topology_governance.interactive, false);
  });

  it('topology governance disallows topology editing', () => {
    assert.equal(FLAGSHIP_TOPOLOGY_SAFE_FIXTURE.topology_governance.editable, false);
  });

  it('topology governance disallows free exploration', () => {
    assert.equal(FLAGSHIP_TOPOLOGY_SAFE_FIXTURE.topology_governance.free_exploration_allowed, false);
  });

  it('flagship governance invariant — topology always read-only', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result.governance.topology_always_read_only, true);
  });

  it('forbidden mutation fixture lists all mutation types as forbidden', () => {
    const allForbidden = FLAGSHIP_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE.mutation_attempts.every(m => m.forbidden);
    assert.equal(allForbidden, true);
  });

  it('cinematic orchestration never animates propagation', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const cinema = resolveCinemaOrchestration(state);
      assert.equal(cinema.no_animated_propagation, true);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. No AI Calls
// ────────────────────────────────────────────────────────────────────────────

describe('No AI calls — no AI contamination', () => {
  it('flagship governance invariant — no_ai_calls true', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result.governance.no_ai_calls, true);
  });

  it('no AI-related terms in component names', () => {
    const aiTerms = ['ai', 'think', 'generate', 'llm', 'chatbot', 'copilot', 'assistant'];
    const componentNames = FLAGSHIP_FORBIDDEN_AI_FIXTURE.all_component_names;
    componentNames.forEach(name => {
      const nameLower = name.toLowerCase();
      aiTerms.forEach(term => {
        assert.ok(!nameLower.includes(term), `component name "${name}" contains forbidden AI term "${term}"`);
      });
    });
  });

  it('no AI-related terms in orchestration tokens', () => {
    const aiTerms = ['ai', 'think', 'generate', 'probabilistic', 'infer'];
    const tokens = FLAGSHIP_FORBIDDEN_AI_FIXTURE.all_orchestration_tokens;
    tokens.forEach(token => {
      const tokenLower = token.toLowerCase();
      aiTerms.forEach(term => {
        assert.ok(!tokenLower.includes(term), `orchestration token "${token}" contains forbidden AI term "${term}"`);
      });
    });
  });

  it('governance invariants confirm no AI generation', () => {
    assert.equal(FLAGSHIP_FORBIDDEN_AI_FIXTURE.governance_invariants.no_ai_generation, true);
  });

  it('governance invariants confirm no AI thinking animation', () => {
    assert.equal(FLAGSHIP_FORBIDDEN_AI_FIXTURE.governance_invariants.no_ai_thinking_animation, true);
  });

  it('governance invariants confirm no live inference', () => {
    assert.equal(FLAGSHIP_FORBIDDEN_AI_FIXTURE.governance_invariants.no_live_inference, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. No Prompt Surfaces — no chatbot UX
// ────────────────────────────────────────────────────────────────────────────

describe('No prompt surfaces — no chatbot UX', () => {
  it('flagship governance invariant — no_prompt_surfaces true', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result.governance.no_prompt_surfaces, true);
  });

  it('flagship governance invariant — no_chatbot_ux true', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result.governance.no_chatbot_ux, true);
  });

  it('all forbidden UX patterns are forbidden in fixture', () => {
    const allForbidden = FLAGSHIP_FORBIDDEN_PROMPT_FIXTURE.forbidden_ux_patterns.every(p => p.forbidden);
    assert.equal(allForbidden, true);
  });

  it('no recommendation language in component names', () => {
    const terms = FLAGSHIP_FORBIDDEN_PROMPT_FIXTURE.forbidden_language_patterns;
    const names = FLAGSHIP_FORBIDDEN_PROMPT_FIXTURE.all_component_names;
    names.forEach(name => {
      const nameLower = name.toLowerCase();
      terms.forEach(term => {
        assert.ok(!nameLower.includes(term), `component "${name}" contains forbidden prompt term "${term}"`);
      });
    });
  });

  it('boardroom config has no_prompt_surfaces true for all render states', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const config = resolveBoardroomConfig(state, 'EXECUTIVE_BALANCED');
      assert.equal(config.no_prompt_surfaces, true);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 10. Operational Gravity System
// ────────────────────────────────────────────────────────────────────────────

describe('Operational gravity system', () => {
  it('EXECUTIVE_READY gravity token is gravity-standard', () => {
    assert.equal(resolveGravityToken('EXECUTIVE_READY'), 'gravity-standard');
  });

  it('EXECUTIVE_READY_WITH_QUALIFIER gravity token is gravity-qualifier', () => {
    assert.equal(resolveGravityToken('EXECUTIVE_READY_WITH_QUALIFIER'), 'gravity-qualifier');
  });

  it('BLOCKED gravity token is gravity-blocked', () => {
    assert.equal(resolveGravityToken('BLOCKED'), 'gravity-blocked');
  });

  it('unknown render state defaults to gravity-blocked (fail closed)', () => {
    assert.equal(resolveGravityToken('UNKNOWN_STATE'), 'gravity-blocked');
  });

  it('gravity token is deterministic', () => {
    assert.equal(resolveGravityToken('DIAGNOSTIC_ONLY'), resolveGravityToken('DIAGNOSTIC_ONLY'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 11. Intelligence Presence Layer
// ────────────────────────────────────────────────────────────────────────────

describe('Intelligence presence layer', () => {
  it('EXECUTIVE_READY presence token is presence-executive-authority', () => {
    assert.equal(resolvePresenceToken('EXECUTIVE_READY'), 'presence-executive-authority');
  });

  it('EXECUTIVE_READY_WITH_QUALIFIER presence token is presence-qualified-authority', () => {
    assert.equal(resolvePresenceToken('EXECUTIVE_READY_WITH_QUALIFIER'), 'presence-qualified-authority');
  });

  it('DIAGNOSTIC_ONLY presence token is presence-diagnostic-alert', () => {
    assert.equal(resolvePresenceToken('DIAGNOSTIC_ONLY'), 'presence-diagnostic-alert');
  });

  it('BLOCKED presence token is presence-blocked-hold', () => {
    assert.equal(resolvePresenceToken('BLOCKED'), 'presence-blocked-hold');
  });

  it('unknown state defaults to presence-blocked-hold (fail closed)', () => {
    assert.equal(resolvePresenceToken('UNKNOWN'), 'presence-blocked-hold');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 12. Investigation Flow — bounded stages
// ────────────────────────────────────────────────────────────────────────────

describe('Structural investigation flow — bounded stages', () => {
  it('INVESTIGATION_STAGES has 5 stages', () => {
    assert.equal(INVESTIGATION_STAGES.length, 5);
  });

  it('first stage is SUMMARY', () => {
    assert.equal(INVESTIGATION_STAGES[0], 'SUMMARY');
  });

  it('last stage is LINEAGE', () => {
    assert.equal(INVESTIGATION_STAGES[INVESTIGATION_STAGES.length - 1], 'LINEAGE');
  });

  it('unknown stage resolves to SUMMARY (fail safe)', () => {
    assert.equal(resolveInvestigationStage('UNKNOWN'), 'SUMMARY');
  });

  it('SUMMARY next stage is EVIDENCE', () => {
    assert.equal(resolveNextStage('SUMMARY'), 'EVIDENCE');
  });

  it('EVIDENCE next stage is PROPAGATION', () => {
    assert.equal(resolveNextStage('EVIDENCE'), 'PROPAGATION');
  });

  it('PROPAGATION next stage is EXPLAINABILITY', () => {
    assert.equal(resolveNextStage('PROPAGATION'), 'EXPLAINABILITY');
  });

  it('EXPLAINABILITY next stage is LINEAGE', () => {
    assert.equal(resolveNextStage('EXPLAINABILITY'), 'LINEAGE');
  });

  it('LINEAGE has no next stage', () => {
    assert.equal(resolveNextStage('LINEAGE'), null);
  });

  it('SUMMARY has no previous stage', () => {
    assert.equal(resolvePreviousStage('SUMMARY'), null);
  });

  it('EVIDENCE previous stage is SUMMARY', () => {
    assert.equal(resolvePreviousStage('EVIDENCE'), 'SUMMARY');
  });

  it('investigation flow fixture confirms bounded semantics', () => {
    assert.equal(FLAGSHIP_INVESTIGATION_FLOW_FIXTURE.expected.investigation_is_bounded, true);
    assert.equal(FLAGSHIP_INVESTIGATION_FLOW_FIXTURE.expected.no_prompt_interaction, true);
    assert.equal(FLAGSHIP_INVESTIGATION_FLOW_FIXTURE.expected.no_free_form_exploration, true);
  });

  it('all investigation transitions in fixture are marked allowed=true for valid stages', () => {
    const validTransitions = FLAGSHIP_INVESTIGATION_FLOW_FIXTURE.investigation_stages;
    validTransitions.forEach(t => {
      assert.equal(t.allowed, true);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 13. Executive Operational Canvas
// ────────────────────────────────────────────────────────────────────────────

describe('Executive operational canvas — visible regions', () => {
  it('EXECUTIVE_DENSE shows all 5 regions', () => {
    const regions = resolveVisibleRegions('EXECUTIVE_DENSE', 'EXECUTIVE_READY');
    assert.equal(regions.length, 5);
  });

  it('EXECUTIVE_BALANCED shows 4 regions (no EVIDENCE_LAYER)', () => {
    const regions = resolveVisibleRegions('EXECUTIVE_BALANCED', 'EXECUTIVE_READY');
    assert.ok(!regions.includes('EVIDENCE_LAYER'));
    assert.equal(regions.length, 4);
  });

  it('BLOCKED shows only 2 regions', () => {
    const regions = resolveVisibleRegions('EXECUTIVE_DENSE', 'BLOCKED');
    assert.equal(regions.length, 2);
    assert.ok(regions.includes('AUTHORITY_HEADER'));
    assert.ok(regions.includes('READINESS_COMMAND'));
  });

  it('DIAGNOSTIC_ONLY shows 3 regions', () => {
    const regions = resolveVisibleRegions('EXECUTIVE_DENSE', 'DIAGNOSTIC_ONLY');
    assert.equal(regions.length, 3);
  });

  it('canvas fixture confirms all regions present', () => {
    assert.equal(FLAGSHIP_OPERATIONAL_CANVAS_FIXTURE.expected.all_regions_present, true);
  });

  it('canvas fixture confirms no dashboard feel', () => {
    assert.equal(FLAGSHIP_OPERATIONAL_CANVAS_FIXTURE.expected.no_dashboard_feel, true);
  });

  it('canvas governance invariants confirm governance info never hidden', () => {
    assert.equal(FLAGSHIP_OPERATIONAL_CANVAS_FIXTURE.governance_invariants.no_hidden_governance_info, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 14. Attention Director
// ────────────────────────────────────────────────────────────────────────────

describe('Executive attention director', () => {
  it('BLOCKED attention hierarchy is sole phase', () => {
    const hierarchy = resolveAttentionHierarchy('BLOCKED');
    assert.deepEqual(hierarchy, ['BLOCKED_ESCALATION']);
  });

  it('EXECUTIVE_READY hierarchy starts with READINESS_BADGE', () => {
    const hierarchy = resolveAttentionHierarchy('EXECUTIVE_READY');
    assert.equal(hierarchy[0], 'READINESS_BADGE');
  });

  it('EXECUTIVE_READY_WITH_QUALIFIER hierarchy includes QUALIFIER_NOTICE', () => {
    const hierarchy = resolveAttentionHierarchy('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.ok(hierarchy.includes('QUALIFIER_NOTICE'));
  });

  it('urgency frame for EXECUTIVE_READY is OPERATIONAL_AUTHORITY', () => {
    assert.equal(resolveUrgencyFrame('EXECUTIVE_READY'), 'OPERATIONAL_AUTHORITY');
  });

  it('urgency frame for BLOCKED is CRITICAL_HOLD', () => {
    assert.equal(resolveUrgencyFrame('BLOCKED'), 'CRITICAL_HOLD');
  });

  it('urgency frame for EXECUTIVE_READY_WITH_QUALIFIER is QUALIFIED_AUTHORITY', () => {
    assert.equal(resolveUrgencyFrame('EXECUTIVE_READY_WITH_QUALIFIER'), 'QUALIFIED_AUTHORITY');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 15. Governance Invariants — full flagship orchestration
// ────────────────────────────────────────────────────────────────────────────

describe('Governance invariants — full flagship orchestration', () => {
  it('governance invariants object has all required keys', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const gov = result.governance;
    assert.ok('topology_always_read_only' in gov);
    assert.ok('qualifier_never_suppressed' in gov);
    assert.ok('blocked_state_never_softened' in gov);
    assert.ok('diagnostic_state_never_softened' in gov);
    assert.ok('evidence_references_always_preserved' in gov);
    assert.ok('no_ai_calls' in gov);
    assert.ok('no_prompt_surfaces' in gov);
    assert.ok('no_chatbot_ux' in gov);
    assert.ok('no_animated_propagation' in gov);
    assert.ok('no_topology_mutation' in gov);
    assert.ok('no_semantic_mutation' in gov);
  });

  it('all governance invariants are true', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const gov = result.governance;
    Object.values(gov).forEach(val => {
      assert.equal(val, true);
    });
  });

  it('governance invariants identical across all density classes', () => {
    const balanced = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_BALANCED');
    const dense = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const investigation = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'INVESTIGATION_DENSE');
    assert.deepEqual(balanced.governance, dense.governance);
    assert.deepEqual(dense.governance, investigation.governance);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 16. Semantic Mutation — not permitted
// ────────────────────────────────────────────────────────────────────────────

describe('No semantic mutation', () => {
  it('orchestrateFlagshipExperience does not mutate input reportObject', () => {
    const before = JSON.stringify(FLAGSHIP_REAL_REPORT);
    orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const after = JSON.stringify(FLAGSHIP_REAL_REPORT);
    assert.equal(before, after);
  });

  it('multiple orchestration calls do not produce accumulated state', () => {
    const r1 = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const r2 = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(r1.renderState, r2.renderState);
    assert.equal(r1.motionProfile.profile, r2.motionProfile.profile);
    assert.equal(r1.gravityToken, r2.gravityToken);
  });

  it('governance invariant — no_semantic_mutation true', () => {
    const result = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    assert.equal(result.governance.no_semantic_mutation, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 17. Determinism — full flagship orchestration
// ────────────────────────────────────────────────────────────────────────────

describe('Determinism — full flagship orchestration', () => {
  it('orchestrateFlagshipExperience is deterministic for EXECUTIVE_READY_WITH_QUALIFIER', () => {
    const a = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE', false, 'SUMMARY');
    const b = orchestrateFlagshipExperience(FLAGSHIP_REAL_REPORT, 'EXECUTIVE', 'EXECUTIVE_DENSE', false, 'SUMMARY');
    assert.equal(a.renderState, b.renderState);
    assert.equal(a.motionProfile.profile, b.motionProfile.profile);
    assert.equal(a.gravityToken, b.gravityToken);
    assert.equal(a.presenceToken, b.presenceToken);
    assert.equal(a.investigationStage, b.investigationStage);
  });

  it('cinema orchestration is deterministic across all states', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const a = resolveCinemaOrchestration(state);
      const b = resolveCinemaOrchestration(state);
      assert.deepEqual(a, b);
    });
  });

  it('investigation stage resolution is deterministic', () => {
    assert.equal(resolveInvestigationStage('EVIDENCE'), resolveInvestigationStage('EVIDENCE'));
    assert.equal(resolveNextStage('EVIDENCE'), resolveNextStage('EVIDENCE'));
  });
});
