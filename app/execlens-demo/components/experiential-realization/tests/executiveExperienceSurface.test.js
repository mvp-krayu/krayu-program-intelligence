'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  resolveRevealSequence,
  resolveMotionProfile,
  resolveDensityTransition,
  resolveEvidenceEmphasis,
  getPhaseIndex,
  isBlockedOrDiagnosticFirst,
  REVEAL_SEQUENCE_MAP,
  MOTION_PROFILE_MAP,
  MOTION_GOVERNANCE_INVARIANTS,
} = require('../MotionSemanticController');

const { resolveExperientialDensityLayout, EXPERIENTIAL_DENSITY_MAP } = require('../IntelligenceDensityOrchestrator');

const { EXPERIENTIAL_EXECUTIVE_READY_FIXTURE } = require('../fixtures/experiential_executive_ready.fixture');
const { EXPERIENTIAL_Q01_FIXTURE } = require('../fixtures/experiential_q01.fixture');
const { EXPERIENTIAL_Q02_FIXTURE } = require('../fixtures/experiential_q02.fixture');
const { EXPERIENTIAL_DIAGNOSTIC_FIXTURE } = require('../fixtures/experiential_diagnostic.fixture');
const { EXPERIENTIAL_BLOCKED_FIXTURE } = require('../fixtures/experiential_blocked.fixture');
const { EXPERIENTIAL_PRESENTATION_MODE_FIXTURE } = require('../fixtures/experiential_presentation_mode.fixture');
const { EXPERIENTIAL_REVEAL_SEQUENCE_FIXTURE } = require('../fixtures/experiential_reveal_sequence.fixture');
const { EXPERIENTIAL_DENSITY_BALANCED_FIXTURE } = require('../fixtures/experiential_density_balanced.fixture');
const { EXPERIENTIAL_DENSITY_DENSE_FIXTURE } = require('../fixtures/experiential_density_dense.fixture');
const { EXPERIENTIAL_TOPOLOGY_SAFE_FIXTURE } = require('../fixtures/experiential_topology_safe.fixture');
const { EXPERIENTIAL_FORBIDDEN_PROMPT_FIXTURE } = require('../fixtures/experiential_forbidden_prompt.fixture');
const { EXPERIENTIAL_FORBIDDEN_AI_FIXTURE } = require('../fixtures/experiential_forbidden_ai.fixture');
const { EXPERIENTIAL_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE } = require('../fixtures/experiential_forbidden_topology_mutation.fixture');

// ─── 1. Reveal sequence — deterministic ordering ─────────────────────────────

describe('resolveRevealSequence — EXECUTIVE_READY', () => {
  test('returns correct reveal phases', () => {
    const result = resolveRevealSequence(EXPERIENTIAL_EXECUTIVE_READY_FIXTURE.renderState);
    assert.deepEqual(result.phases, EXPERIENTIAL_EXECUTIVE_READY_FIXTURE.expected.reveal_sequence);
  });

  test('READINESS_BADGE is always first for EXECUTIVE_READY', () => {
    const result = resolveRevealSequence('EXECUTIVE_READY');
    assert.equal(result.phases[0], 'READINESS_BADGE');
  });

  test('phase_count matches phases array length', () => {
    const result = resolveRevealSequence('EXECUTIVE_READY');
    assert.equal(result.phase_count, result.phases.length);
  });

  test('no error on known state', () => {
    const result = resolveRevealSequence('EXECUTIVE_READY');
    assert.equal(result.error, null);
  });
});

describe('resolveRevealSequence — EXECUTIVE_READY_WITH_QUALIFIER', () => {
  test('QUALIFIER_NOTICE follows READINESS_BADGE immediately', () => {
    const result = resolveRevealSequence('EXECUTIVE_READY_WITH_QUALIFIER');
    const badgeIdx = result.phases.indexOf('READINESS_BADGE');
    const qualifierIdx = result.phases.indexOf('QUALIFIER_NOTICE');
    assert.equal(qualifierIdx, badgeIdx + 1);
  });

  test('returns all expected phases', () => {
    const result = resolveRevealSequence('EXECUTIVE_READY_WITH_QUALIFIER');
    const expected = EXPERIENTIAL_REVEAL_SEQUENCE_FIXTURE.sequences['EXECUTIVE_READY_WITH_QUALIFIER'];
    assert.deepEqual(result.phases, expected.expected_phases);
  });

  test('phase count is 5', () => {
    const result = resolveRevealSequence('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.phase_count, EXPERIENTIAL_REVEAL_SEQUENCE_FIXTURE.sequences['EXECUTIVE_READY_WITH_QUALIFIER'].expected_count);
  });
});

describe('resolveRevealSequence — DIAGNOSTIC_ONLY', () => {
  test('DIAGNOSTIC_ESCALATION is first phase', () => {
    const result = resolveRevealSequence('DIAGNOSTIC_ONLY');
    assert.equal(result.phases[0], EXPERIENTIAL_REVEAL_SEQUENCE_FIXTURE.sequences['DIAGNOSTIC_ONLY'].expected_first_phase);
  });

  test('READINESS_BADGE follows DIAGNOSTIC_ESCALATION', () => {
    const result = resolveRevealSequence('DIAGNOSTIC_ONLY');
    const escalationIdx = result.phases.indexOf('DIAGNOSTIC_ESCALATION');
    const badgeIdx = result.phases.indexOf('READINESS_BADGE');
    assert.equal(badgeIdx, escalationIdx + 1);
  });

  test('phase count is 5', () => {
    const result = resolveRevealSequence('DIAGNOSTIC_ONLY');
    assert.equal(result.phase_count, 5);
  });
});

describe('resolveRevealSequence — BLOCKED', () => {
  test('BLOCKED_ESCALATION is the sole phase', () => {
    const result = resolveRevealSequence('BLOCKED');
    assert.deepEqual(result.phases, ['BLOCKED_ESCALATION']);
    assert.equal(result.phase_count, EXPERIENTIAL_BLOCKED_FIXTURE.expected.phase_count);
  });

  test('no content phases follow BLOCKED_ESCALATION', () => {
    const result = resolveRevealSequence('BLOCKED');
    assert.equal(result.phases.includes('EXECUTIVE_NARRATIVE'), false);
    assert.equal(result.phases.includes('EVIDENCE_POSTURE'), false);
  });

  test('unknown renderState fails closed to BLOCKED_ESCALATION', () => {
    const result = resolveRevealSequence('UNKNOWN_RENDER_STATE');
    assert.deepEqual(result.phases, ['BLOCKED_ESCALATION']);
    assert.ok(result.error && result.error.includes('MSC-01'));
  });
});

// ─── 2. Motion profiles ───────────────────────────────────────────────────────

describe('resolveMotionProfile — all render states', () => {
  test('EXECUTIVE_READY returns AUTHORITATIVE profile', () => {
    const result = resolveMotionProfile('EXECUTIVE_READY');
    assert.equal(result.profile, EXPERIENTIAL_EXECUTIVE_READY_FIXTURE.expected.motion_profile);
  });

  test('EXECUTIVE_READY_WITH_QUALIFIER returns QUALIFIED_AUTHORITATIVE', () => {
    const result = resolveMotionProfile('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.profile, 'QUALIFIED_AUTHORITATIVE');
  });

  test('DIAGNOSTIC_ONLY returns DIAGNOSTIC_ASSERTIVE', () => {
    const result = resolveMotionProfile('DIAGNOSTIC_ONLY');
    assert.equal(result.profile, EXPERIENTIAL_DIAGNOSTIC_FIXTURE.expected.motion_profile);
  });

  test('BLOCKED returns BLOCKED_ASSERTIVE', () => {
    const result = resolveMotionProfile('BLOCKED');
    assert.equal(result.profile, EXPERIENTIAL_BLOCKED_FIXTURE.expected.motion_profile);
  });

  test('BLOCKED reveal_base_ms is fastest (assertive, impossible to ignore)', () => {
    const blocked = resolveMotionProfile('BLOCKED');
    const ready = resolveMotionProfile('EXECUTIVE_READY');
    assert.ok(blocked.reveal_base_ms <= ready.reveal_base_ms);
  });

  test('BLOCKED stagger_ms is 0 — single phase, no stagger', () => {
    const result = resolveMotionProfile('BLOCKED');
    assert.equal(result.stagger_ms, EXPERIENTIAL_BLOCKED_FIXTURE.expected.stagger_ms);
  });

  test('Q01 qualifier_emphasis_ms is 300 — qualifier prominence', () => {
    const result = resolveMotionProfile('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.qualifier_emphasis_ms, EXPERIENTIAL_Q01_FIXTURE.expected.qualifier_emphasis_ms);
  });

  test('no_animation_on_propagation is true for all profiles', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const result = resolveMotionProfile(state);
      assert.equal(result.no_animation_on_propagation, true, `${state} must have no_animation_on_propagation = true`);
    });
  });

  test('unknown state fails closed to BLOCKED_ASSERTIVE with MSC-02 error', () => {
    const result = resolveMotionProfile('UNKNOWN');
    assert.equal(result.profile, 'BLOCKED_ASSERTIVE');
    assert.ok(result.error && result.error.includes('MSC-02'));
  });
});

// ─── 3. isBlockedOrDiagnosticFirst ───────────────────────────────────────────

describe('isBlockedOrDiagnosticFirst — escalation ordering', () => {
  test('BLOCKED returns true', () => {
    assert.equal(isBlockedOrDiagnosticFirst('BLOCKED'), EXPERIENTIAL_BLOCKED_FIXTURE.expected.escalates_first);
  });

  test('DIAGNOSTIC_ONLY returns true', () => {
    assert.equal(isBlockedOrDiagnosticFirst('DIAGNOSTIC_ONLY'), EXPERIENTIAL_DIAGNOSTIC_FIXTURE.expected.escalates_first);
  });

  test('EXECUTIVE_READY returns false', () => {
    assert.equal(isBlockedOrDiagnosticFirst('EXECUTIVE_READY'), EXPERIENTIAL_EXECUTIVE_READY_FIXTURE.expected.escalates_first);
  });

  test('EXECUTIVE_READY_WITH_QUALIFIER returns false', () => {
    assert.equal(isBlockedOrDiagnosticFirst('EXECUTIVE_READY_WITH_QUALIFIER'), false);
  });

  test('unknown state returns true (fail closed)', () => {
    assert.equal(isBlockedOrDiagnosticFirst('UNKNOWN'), true);
  });
});

// ─── 4. Phase index computation ───────────────────────────────────────────────

describe('getPhaseIndex — phase ordering', () => {
  test('READINESS_BADGE is at index 0 for EXECUTIVE_READY', () => {
    assert.equal(getPhaseIndex('EXECUTIVE_READY', 'READINESS_BADGE'), 0);
  });

  test('QUALIFIER_NOTICE is at index 1 for EXECUTIVE_READY_WITH_QUALIFIER', () => {
    assert.equal(getPhaseIndex('EXECUTIVE_READY_WITH_QUALIFIER', 'QUALIFIER_NOTICE'), 1);
  });

  test('DIAGNOSTIC_ESCALATION is at index 0 for DIAGNOSTIC_ONLY', () => {
    assert.equal(getPhaseIndex('DIAGNOSTIC_ONLY', 'DIAGNOSTIC_ESCALATION'), 0);
  });

  test('BLOCKED_ESCALATION is at index 0 for BLOCKED', () => {
    assert.equal(getPhaseIndex('BLOCKED', 'BLOCKED_ESCALATION'), 0);
  });

  test('phase not in sequence returns -1', () => {
    assert.equal(getPhaseIndex('BLOCKED', 'EXECUTIVE_NARRATIVE'), -1);
  });
});

// ─── 5. Density transition profiles ──────────────────────────────────────────

describe('resolveDensityTransition — all density classes', () => {
  test('EXECUTIVE_BALANCED returns transition_ms 250', () => {
    const result = resolveDensityTransition('EXECUTIVE_BALANCED');
    assert.equal(result.transition_ms, 250);
  });

  test('EXECUTIVE_DENSE returns transition_ms 300', () => {
    const result = resolveDensityTransition('EXECUTIVE_DENSE');
    assert.equal(result.transition_ms, 300);
  });

  test('INVESTIGATION_DENSE returns transition_ms 200', () => {
    const result = resolveDensityTransition('INVESTIGATION_DENSE');
    assert.equal(result.transition_ms, 200);
  });

  test('EXECUTIVE_BALANCED has density_token', () => {
    const result = resolveDensityTransition('EXECUTIVE_BALANCED');
    assert.ok(result.density_token && result.density_token.length > 0);
  });

  test('presentation mode — EXECUTIVE_BALANCED is compatible', () => {
    const layout = resolveExperientialDensityLayout('EXECUTIVE_BALANCED', 'EXECUTIVE_READY', {});
    assert.equal(layout.presentation_compatible, EXPERIENTIAL_PRESENTATION_MODE_FIXTURE.expected.presentation_compatible);
  });
});

// ─── 6. Experiential density layout — governance-critical overrides ──────────

describe('resolveExperientialDensityLayout — governance overrides always active', () => {
  test('evidence_references_preserved always true — BALANCED', () => {
    const layout = resolveExperientialDensityLayout(
      EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.densityClass,
      EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.renderState,
      EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps
    );
    assert.equal(layout.evidence_references_preserved, true);
  });

  test('evidence_references_preserved always true — DENSE', () => {
    const layout = resolveExperientialDensityLayout(
      EXPERIENTIAL_DENSITY_DENSE_FIXTURE.densityClass,
      EXPERIENTIAL_DENSITY_DENSE_FIXTURE.renderState,
      EXPERIENTIAL_DENSITY_DENSE_FIXTURE.adaptedProps
    );
    assert.equal(layout.evidence_references_preserved, true);
  });

  test('qualifier_notice_visible true for Q-01 regardless of density', () => {
    const layout = resolveExperientialDensityLayout(
      'EXECUTIVE_BALANCED',
      'EXECUTIVE_READY_WITH_QUALIFIER',
      { qualifier_class: 'Q-01', executive_summary: 'x', why_primary_statement: 'y' }
    );
    assert.equal(layout.qualifier_notice_visible, true);
  });

  test('qualifier_notice_visible false for Q-00', () => {
    const layout = resolveExperientialDensityLayout(
      'EXECUTIVE_DENSE',
      'EXECUTIVE_READY',
      EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps
    );
    assert.equal(layout.qualifier_notice_visible, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.expected.qualifier_notice_visible);
  });

  test('blocked_notice_visible true when BLOCKED regardless of density', () => {
    const layout = resolveExperientialDensityLayout(
      'EXECUTIVE_BALANCED',
      'BLOCKED',
      EXPERIENTIAL_BLOCKED_FIXTURE.adaptedProps
    );
    assert.equal(layout.blocked_notice_visible, true);
  });

  test('diagnostic_notice_visible true when DIAGNOSTIC_ONLY regardless of density', () => {
    const layout = resolveExperientialDensityLayout(
      'EXECUTIVE_BALANCED',
      'DIAGNOSTIC_ONLY',
      EXPERIENTIAL_DIAGNOSTIC_FIXTURE.adaptedProps
    );
    assert.equal(layout.diagnostic_notice_visible, true);
  });

  test('q04_absence_notice_visible true for Q-04 regardless of density', () => {
    const layout = resolveExperientialDensityLayout(
      'EXECUTIVE_BALANCED',
      'BLOCKED',
      EXPERIENTIAL_BLOCKED_FIXTURE.adaptedProps
    );
    assert.equal(layout.q04_absence_notice_visible, EXPERIENTIAL_BLOCKED_FIXTURE.expected.q04_absence_notice_visible);
  });
});

// ─── 7. Blocked state — content sections suppressed ──────────────────────────

describe('resolveExperientialDensityLayout — BLOCKED state', () => {
  test('show_executive_summary is false when BLOCKED', () => {
    const layout = resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'BLOCKED', EXPERIENTIAL_BLOCKED_FIXTURE.adaptedProps);
    assert.equal(layout.show_executive_summary, EXPERIENTIAL_BLOCKED_FIXTURE.expected.show_executive_summary);
  });

  test('show_why_statement is false when BLOCKED', () => {
    const layout = resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'BLOCKED', EXPERIENTIAL_BLOCKED_FIXTURE.adaptedProps);
    assert.equal(layout.show_why_statement, EXPERIENTIAL_BLOCKED_FIXTURE.expected.show_why_statement);
  });

  test('show_structural_findings is false when BLOCKED', () => {
    const layout = resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'BLOCKED', EXPERIENTIAL_BLOCKED_FIXTURE.adaptedProps);
    assert.equal(layout.show_structural_findings, EXPERIENTIAL_BLOCKED_FIXTURE.expected.show_structural_findings);
  });

  test('evidence_references_preserved still true when BLOCKED', () => {
    const layout = resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'BLOCKED', EXPERIENTIAL_BLOCKED_FIXTURE.adaptedProps);
    assert.equal(layout.evidence_references_preserved, true);
  });
});

// ─── 8. EXECUTIVE_BALANCED density layout ────────────────────────────────────

describe('resolveExperientialDensityLayout — EXECUTIVE_BALANCED', () => {
  let layout;
  before: layout = resolveExperientialDensityLayout(
    EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.densityClass,
    EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.renderState,
    EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps
  );

  test('show_executive_summary matches fixture', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.renderState, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps);
    assert.equal(l.show_executive_summary, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.expected.show_executive_summary);
  });

  test('show_structural_findings is false in BALANCED', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.renderState, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps);
    assert.equal(l.show_structural_findings, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.expected.show_structural_findings);
  });

  test('show_evidence_posture is false in BALANCED', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.renderState, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps);
    assert.equal(l.show_evidence_posture, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.expected.show_evidence_posture);
  });

  test('collapsed_by_default is true in BALANCED', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.renderState, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps);
    assert.equal(l.collapsed_by_default, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.expected.collapsed_by_default);
  });

  test('max_visible_chains is 2 in BALANCED', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.renderState, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.adaptedProps);
    assert.equal(l.max_visible_chains, EXPERIENTIAL_DENSITY_BALANCED_FIXTURE.expected.max_visible_chains);
  });
});

// ─── 9. EXECUTIVE_DENSE density layout ───────────────────────────────────────

describe('resolveExperientialDensityLayout — EXECUTIVE_DENSE', () => {
  test('all content sections visible in DENSE', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_DENSE_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.renderState, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.adaptedProps);
    assert.equal(l.show_executive_summary, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.expected.show_executive_summary);
    assert.equal(l.show_why_statement, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.expected.show_why_statement);
    assert.equal(l.show_structural_findings, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.expected.show_structural_findings);
    assert.equal(l.show_evidence_posture, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.expected.show_evidence_posture);
  });

  test('max_visible_chains is 3 in DENSE', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_DENSE_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.renderState, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.adaptedProps);
    assert.equal(l.max_visible_chains, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.expected.max_visible_chains);
  });

  test('collapsed_by_default is false in DENSE', () => {
    const l = resolveExperientialDensityLayout(EXPERIENTIAL_DENSITY_DENSE_FIXTURE.densityClass, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.renderState, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.adaptedProps);
    assert.equal(l.collapsed_by_default, EXPERIENTIAL_DENSITY_DENSE_FIXTURE.expected.collapsed_by_default);
  });
});

// ─── 10. Topology safety invariants ──────────────────────────────────────────

describe('Topology safety — MOTION_GOVERNANCE_INVARIANTS', () => {
  test('no_animated_propagation_flow is true in governance invariants', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.no_animated_propagation_flow, EXPERIENTIAL_TOPOLOGY_SAFE_FIXTURE.governance_invariants.no_animated_propagation_flow);
  });

  test('no_ai_thinking_animation is true in governance invariants', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.no_ai_thinking_animation, true);
  });

  test('no_probabilistic_transition is true', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.no_probabilistic_transition, true);
  });

  test('no_chatbot_surface is true', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.no_chatbot_surface, true);
  });

  test('qualifier_emphasis_never_suppressed is true', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.qualifier_emphasis_never_suppressed, true);
  });

  test('blocked_state_always_assertive is true', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.blocked_state_always_assertive, true);
  });

  test('topology_always_read_only is true', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.topology_always_read_only, EXPERIENTIAL_TOPOLOGY_SAFE_FIXTURE.governance_invariants.no_animated_propagation_flow);
  });

  test('topology chains unchanged after density resolution', () => {
    const chains = JSON.parse(JSON.stringify(EXPERIENTIAL_TOPOLOGY_SAFE_FIXTURE.propagation_chains));
    const originalChains = JSON.parse(JSON.stringify(EXPERIENTIAL_TOPOLOGY_SAFE_FIXTURE.propagation_chains));
    resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'EXECUTIVE_READY', { propagation_chains: chains });
    assert.deepEqual(chains, originalChains);
  });
});

// ─── 11. Governance: no AI contamination ─────────────────────────────────────

describe('No AI contamination — phase names and profiles', () => {
  test('no AI-related terms in any phase name', () => {
    const aiTerms = ['ai', 'generate', 'thinking', 'chatbot', 'llm', 'prompt', 'inference'];
    const allPhases = Object.values(REVEAL_SEQUENCE_MAP).flat();
    allPhases.forEach(phase => {
      aiTerms.forEach(term => {
        assert.ok(!phase.toLowerCase().includes(term), `Phase "${phase}" must not contain AI term "${term}"`);
      });
    });
  });

  test('no AI-related terms in any motion profile name', () => {
    const aiTerms = ['ai', 'generate', 'thinking', 'chatbot', 'llm', 'prompt'];
    Object.values(MOTION_PROFILE_MAP).forEach(profile => {
      aiTerms.forEach(term => {
        assert.ok(!profile.profile.toLowerCase().includes(term), `Profile "${profile.profile}" must not contain AI term "${term}"`);
      });
    });
  });

  test('no chatbot surfaces in governance invariants', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.no_chatbot_surface, EXPERIENTIAL_FORBIDDEN_AI_FIXTURE.governance_invariants.no_chatbot_surface);
  });

  test('no AI generation in governance invariants', () => {
    assert.equal(MOTION_GOVERNANCE_INVARIANTS.no_ai_thinking_animation, EXPERIENTIAL_FORBIDDEN_AI_FIXTURE.governance_invariants.no_ai_generation);
  });
});

// ─── 12. Governance: no recommendation/probabilistic language ─────────────────

describe('No forbidden language in motion semantics', () => {
  test('no recommendation terms in phase names', () => {
    const forbidden = ['recommend', 'action item', 'you should', 'address this'];
    const allPhases = Object.values(REVEAL_SEQUENCE_MAP).flat();
    allPhases.forEach(phase => {
      forbidden.forEach(term => {
        assert.ok(!phase.toLowerCase().includes(term.toLowerCase()), `Phase "${phase}" must not contain "${term}"`);
      });
    });
  });

  test('no probabilistic terms in motion profiles', () => {
    const forbidden = ['probability', 'confidence', 'likelihood', '%'];
    Object.values(MOTION_PROFILE_MAP).forEach(profile => {
      forbidden.forEach(term => {
        const profileStr = JSON.stringify(profile);
        assert.ok(!profileStr.toLowerCase().includes(term.toLowerCase()) || term === '%', `Profile must not contain probabilistic term "${term}"`);
      });
    });
  });
});

// ─── 13. Determinism ─────────────────────────────────────────────────────────

describe('Determinism — same input produces same output', () => {
  test('resolveRevealSequence is deterministic', () => {
    const r1 = resolveRevealSequence('EXECUTIVE_READY_WITH_QUALIFIER');
    const r2 = resolveRevealSequence('EXECUTIVE_READY_WITH_QUALIFIER');
    assert.deepEqual(r1, r2);
  });

  test('resolveMotionProfile is deterministic', () => {
    const r1 = resolveMotionProfile('DIAGNOSTIC_ONLY');
    const r2 = resolveMotionProfile('DIAGNOSTIC_ONLY');
    assert.deepEqual(r1, r2);
  });

  test('resolveExperientialDensityLayout is deterministic', () => {
    const props = EXPERIENTIAL_DENSITY_DENSE_FIXTURE.adaptedProps;
    const r1 = resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'EXECUTIVE_READY', props);
    const r2 = resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'EXECUTIVE_READY', props);
    assert.deepEqual(r1, r2);
  });

  test('all four render states produce stable reveal sequences across calls', () => {
    ['EXECUTIVE_READY', 'EXECUTIVE_READY_WITH_QUALIFIER', 'DIAGNOSTIC_ONLY', 'BLOCKED'].forEach(state => {
      const r1 = resolveRevealSequence(state);
      const r2 = resolveRevealSequence(state);
      assert.deepEqual(r1.phases, r2.phases, `${state} reveal sequence must be deterministic`);
    });
  });
});

// ─── 14. Evidence emphasis — expand/collapse ──────────────────────────────────

describe('resolveEvidenceEmphasis — expand/collapse timing', () => {
  test('EXPAND returns evidence-expand token', () => {
    const result = resolveEvidenceEmphasis('EXPAND');
    assert.equal(result.emphasis_token, 'motion-evidence-expand');
  });

  test('COLLAPSE returns evidence-collapse token', () => {
    const result = resolveEvidenceEmphasis('COLLAPSE');
    assert.equal(result.emphasis_token, 'motion-evidence-collapse');
  });

  test('unknown action defaults to EXPAND with MSC-04 error', () => {
    const result = resolveEvidenceEmphasis('UNKNOWN_ACTION');
    assert.equal(result.emphasis_token, 'motion-evidence-expand');
    assert.ok(result.error && result.error.includes('MSC-04'));
  });

  test('EXPAND duration is reasonable (under 500ms)', () => {
    const result = resolveEvidenceEmphasis('EXPAND');
    assert.ok(result.duration_ms > 0 && result.duration_ms < 500);
  });
});

// ─── 15. No mutation of input ─────────────────────────────────────────────────

describe('No mutation of input objects', () => {
  test('resolveRevealSequence does not modify REVEAL_SEQUENCE_MAP', () => {
    const before = JSON.stringify(REVEAL_SEQUENCE_MAP);
    resolveRevealSequence('EXECUTIVE_READY');
    const after = JSON.stringify(REVEAL_SEQUENCE_MAP);
    assert.equal(before, after);
  });

  test('resolveExperientialDensityLayout does not modify adaptedProps', () => {
    const props = { qualifier_class: 'Q-01', executive_summary: 'Original.', why_primary_statement: 'Why.' };
    const propsCopy = { ...props };
    resolveExperientialDensityLayout('EXECUTIVE_DENSE', 'EXECUTIVE_READY_WITH_QUALIFIER', props);
    assert.deepEqual(props, propsCopy);
  });

  test('forbidden topology mutations declared in fixture', () => {
    EXPERIENTIAL_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE.mutation_attempts.forEach(attempt => {
      assert.equal(attempt.forbidden, true, `${attempt.type} must be forbidden`);
    });
  });
});
