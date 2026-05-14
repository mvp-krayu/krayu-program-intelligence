'use strict';

/**
 * MotionSemanticController.js
 * PI.LENS.EXPERIENTIAL-REALIZATION.EXECUTIVE-SURFACE.01
 *
 * Governance-safe motion semantics for cinematic executive intelligence rendering.
 *
 * Authority: experiential_realization_authorization.md (AUTHORIZED)
 *            Gate-1 constraint: motion must reinforce meaning, never simulate intelligence.
 *
 * Motion rules:
 *   - Motion reinforces structural meaning
 *   - Motion never simulates intelligence
 *   - Motion never implies live AI reasoning
 *   - Motion never implies autonomous analysis
 *   - Blocked state entrance: assertive (fast, dominant — impossible to ignore)
 *   - Diagnostic state entrance: prominent escalation before content
 *   - Qualifier emphasis: synchronized with readiness badge reveal
 *   - No animated propagation flow (VIS-PROP-02)
 *   - No "thinking" animations
 *
 * Pure functions. No React. No AI. No external APIs. Deterministic.
 */

// Reveal phase ordering per render state.
// READINESS_BADGE is always first — it is the highest-priority visual element (VIS-READY-02).
// BLOCKED_ESCALATION has no subsequent phases — blocked notice replaces all content.
const REVEAL_SEQUENCE_MAP = {
  EXECUTIVE_READY: [
    'READINESS_BADGE',
    'EXECUTIVE_NARRATIVE',
    'PROPAGATION_POSTURE',
    'EVIDENCE_POSTURE',
  ],
  EXECUTIVE_READY_WITH_QUALIFIER: [
    'READINESS_BADGE',
    'QUALIFIER_NOTICE',
    'EXECUTIVE_NARRATIVE',
    'PROPAGATION_POSTURE',
    'EVIDENCE_POSTURE',
  ],
  DIAGNOSTIC_ONLY: [
    'DIAGNOSTIC_ESCALATION',
    'READINESS_BADGE',
    'QUALIFIER_NOTICE',
    'EXECUTIVE_NARRATIVE',
    'PROPAGATION_POSTURE',
  ],
  BLOCKED: [
    'BLOCKED_ESCALATION',
  ],
};

// Motion profiles per render state.
// Timing is in milliseconds — treated as governance data, not CSS values.
// blocked and diagnostic profiles are faster/more assertive to ensure they cannot be missed.
const MOTION_PROFILE_MAP = {
  EXECUTIVE_READY: {
    profile: 'AUTHORITATIVE',
    reveal_base_ms: 200,
    stagger_ms: 80,
    evidence_emphasis_ms: 150,
    qualifier_emphasis_ms: 0,
    escalation_ms: 0,
    emphasis_intensity: 'standard',
    no_animation_on_propagation: true,
  },
  EXECUTIVE_READY_WITH_QUALIFIER: {
    profile: 'QUALIFIED_AUTHORITATIVE',
    reveal_base_ms: 200,
    stagger_ms: 80,
    evidence_emphasis_ms: 150,
    qualifier_emphasis_ms: 300,
    escalation_ms: 0,
    emphasis_intensity: 'qualifier_prominent',
    no_animation_on_propagation: true,
  },
  DIAGNOSTIC_ONLY: {
    profile: 'DIAGNOSTIC_ASSERTIVE',
    reveal_base_ms: 100,
    stagger_ms: 60,
    evidence_emphasis_ms: 120,
    qualifier_emphasis_ms: 200,
    escalation_ms: 150,
    emphasis_intensity: 'diagnostic_prominent',
    no_animation_on_propagation: true,
  },
  BLOCKED: {
    profile: 'BLOCKED_ASSERTIVE',
    reveal_base_ms: 80,
    stagger_ms: 0,
    evidence_emphasis_ms: 0,
    qualifier_emphasis_ms: 0,
    escalation_ms: 80,
    emphasis_intensity: 'blocked_dominant',
    no_animation_on_propagation: true,
  },
};

// Density transition profiles — timing for section appearance/disappearance during density switching.
const DENSITY_TRANSITION_MAP = {
  EXECUTIVE_BALANCED: {
    transition_ms: 250,
    collapse_section_ms: 200,
    expand_section_ms: 250,
    density_token: 'motion-density-balanced',
  },
  EXECUTIVE_DENSE: {
    transition_ms: 300,
    collapse_section_ms: 220,
    expand_section_ms: 300,
    density_token: 'motion-density-dense',
  },
  INVESTIGATION_DENSE: {
    transition_ms: 200,
    collapse_section_ms: 180,
    expand_section_ms: 200,
    density_token: 'motion-density-investigation',
  },
};

// Evidence emphasis profiles — choreography for evidence drawer interactions.
const EVIDENCE_EMPHASIS_MAP = {
  EXPAND: {
    duration_ms: 250,
    easing: 'structural-expand',
    emphasis_token: 'motion-evidence-expand',
  },
  COLLAPSE: {
    duration_ms: 200,
    easing: 'structural-collapse',
    emphasis_token: 'motion-evidence-collapse',
  },
};

// Governance invariants embedded in motion semantics.
// These are immutable — no contract may override them.
const MOTION_GOVERNANCE_INVARIANTS = {
  no_animated_propagation_flow: true,
  no_ai_thinking_animation: true,
  no_probabilistic_transition: true,
  no_chatbot_surface: true,
  qualifier_emphasis_never_suppressed: true,
  blocked_state_always_assertive: true,
  diagnostic_state_always_prominent: true,
  topology_always_read_only: true,
};

/**
 * resolveRevealSequence(renderState)
 *
 * Returns the ordered reveal phase sequence for a given render state.
 * Unknown states fail closed to BLOCKED (single BLOCKED_ESCALATION phase).
 */
function resolveRevealSequence(renderState) {
  const sequence = REVEAL_SEQUENCE_MAP[renderState];
  if (!sequence) {
    return {
      phases: ['BLOCKED_ESCALATION'],
      phase_count: 1,
      error: `MSC-01: unknown renderState — ${String(renderState)}; failing closed to BLOCKED_ESCALATION`,
    };
  }
  return {
    phases: [...sequence],
    phase_count: sequence.length,
    error: null,
  };
}

/**
 * resolveMotionProfile(renderState)
 *
 * Returns the motion timing profile for a given render state.
 * Unknown states fail closed to BLOCKED_ASSERTIVE profile.
 */
function resolveMotionProfile(renderState) {
  const profile = MOTION_PROFILE_MAP[renderState];
  if (!profile) {
    return {
      ...MOTION_PROFILE_MAP['BLOCKED'],
      error: `MSC-02: unknown renderState — ${String(renderState)}; failing closed to BLOCKED_ASSERTIVE`,
    };
  }
  return { ...profile, error: null };
}

/**
 * resolveDensityTransition(densityClass)
 *
 * Returns the density transition timing profile.
 * Unknown density classes fall back to EXECUTIVE_DENSE.
 */
function resolveDensityTransition(densityClass) {
  const transition = DENSITY_TRANSITION_MAP[densityClass];
  if (!transition) {
    return {
      ...DENSITY_TRANSITION_MAP['EXECUTIVE_DENSE'],
      error: `MSC-03: unknown densityClass — ${String(densityClass)}; defaulting to EXECUTIVE_DENSE`,
    };
  }
  return { ...transition, error: null };
}

/**
 * resolveEvidenceEmphasis(action)
 *
 * Returns the evidence drawer emphasis timing for EXPAND or COLLAPSE.
 */
function resolveEvidenceEmphasis(action) {
  const emphasis = EVIDENCE_EMPHASIS_MAP[action];
  if (!emphasis) {
    return {
      ...EVIDENCE_EMPHASIS_MAP['EXPAND'],
      error: `MSC-04: unknown action — ${String(action)}; defaulting to EXPAND`,
    };
  }
  return { ...emphasis, error: null };
}

/**
 * getPhaseIndex(renderState, phase)
 *
 * Returns the 0-based index of a phase in the reveal sequence for a given render state.
 * Returns -1 if the phase is not in the sequence.
 */
function getPhaseIndex(renderState, phase) {
  const sequence = REVEAL_SEQUENCE_MAP[renderState] || REVEAL_SEQUENCE_MAP['BLOCKED'];
  return sequence.indexOf(phase);
}

/**
 * isBlockedOrDiagnosticFirst(renderState)
 *
 * Returns true if the render state requires an escalation phase before content reveal.
 * Blocked and diagnostic states must always escalate before content.
 */
function isBlockedOrDiagnosticFirst(renderState) {
  const sequence = REVEAL_SEQUENCE_MAP[renderState];
  if (!sequence) return true;
  return sequence[0] === 'BLOCKED_ESCALATION' || sequence[0] === 'DIAGNOSTIC_ESCALATION';
}

module.exports = {
  resolveRevealSequence,
  resolveMotionProfile,
  resolveDensityTransition,
  resolveEvidenceEmphasis,
  getPhaseIndex,
  isBlockedOrDiagnosticFirst,
  REVEAL_SEQUENCE_MAP,
  MOTION_PROFILE_MAP,
  DENSITY_TRANSITION_MAP,
  EVIDENCE_EMPHASIS_MAP,
  MOTION_GOVERNANCE_INVARIANTS,
};
