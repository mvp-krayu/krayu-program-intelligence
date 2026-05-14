'use strict';

/**
 * flagshipOrchestration.js
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Pure CJS orchestration logic for the flagship experience.
 * Wraps the full LENS v2 adapter pipeline and experiential governance layer.
 * Testable without React. Deterministic.
 *
 * Integrates:
 *   - adaptReport() — full adapter pipeline (validation → adapters)
 *   - resolveRevealSequence() — cinematic reveal orchestration
 *   - resolveMotionProfile() — motion governance
 *   - resolveExperientialDensityLayout() — density with governance overrides
 *   - resolveBoardroomConfig() — boardroom presentation config
 *   - resolveCinemaOrchestration() — cinematic orchestration
 *   - resolveAttentionHierarchy() — executive attention flow
 *   - resolveInvestigationStage() — bounded investigation stages
 *   - resolveGravityToken() — operational gravity
 *   - resolvePresenceToken() — intelligence presence
 *   - resolveVisibleRegions() — canvas region visibility
 */

const { adaptReport } = require('../adapters/index');
const { resolveRevealSequence, resolveMotionProfile, isBlockedOrDiagnosticFirst } = require('../components/experiential-realization/MotionSemanticController');
const { resolveExperientialDensityLayout } = require('../components/experiential-realization/IntelligenceDensityOrchestrator');

// Boardroom config resolution (mirrors ExecutiveBoardroomMode)
const BOARDROOM_PACING_MAP = {
  EXECUTIVE_READY: { pacing: 'CONTROLLED', reveal_style: 'STAGED', fullscreen_optimal: true },
  EXECUTIVE_READY_WITH_QUALIFIER: { pacing: 'CONTROLLED', reveal_style: 'STAGED_WITH_QUALIFIER_HOLD', fullscreen_optimal: true },
  DIAGNOSTIC_ONLY: { pacing: 'ADVISORY', reveal_style: 'ESCALATION_FIRST', fullscreen_optimal: false },
  BLOCKED: { pacing: 'HOLD', reveal_style: 'BLOCKED_ASSERTIVE', fullscreen_optimal: false },
};

function resolveBoardroomConfig(renderState, densityClass) {
  const pacing = BOARDROOM_PACING_MAP[renderState] || BOARDROOM_PACING_MAP['BLOCKED'];
  return {
    ...pacing,
    density_class: densityClass,
    presentation_mode: 'EXECUTIVE_BRIEFING',
    no_prompt_surfaces: true,
    no_chatbot_ux: true,
    no_ai_personas: true,
    no_slideware_feel: true,
    no_dashboard_feel: true,
  };
}

// Cinema orchestration (mirrors IntelligenceRevealCinema)
function resolveCinemaOrchestration(renderState) {
  const sequence = resolveRevealSequence(renderState);
  const profile = resolveMotionProfile(renderState);
  const escalatesFirst = isBlockedOrDiagnosticFirst(renderState);

  return {
    phases: sequence.phases,
    phase_count: sequence.phase_count,
    motion_profile: profile.profile,
    reveal_base_ms: profile.reveal_base_ms,
    stagger_ms: profile.stagger_ms,
    escalates_first: escalatesFirst,
    no_animated_propagation: profile.no_animation_on_propagation,
    no_ai_thinking: true,
    no_speculative_transitions: true,
  };
}

// Attention hierarchy (mirrors ExecutiveAttentionDirector)
const ATTENTION_HIERARCHY_MAP = {
  BLOCKED: ['BLOCKED_ESCALATION'],
  DIAGNOSTIC_ONLY: ['DIAGNOSTIC_ESCALATION', 'READINESS_BADGE', 'QUALIFIER_NOTICE', 'NARRATIVE'],
  EXECUTIVE_READY_WITH_QUALIFIER: ['READINESS_BADGE', 'QUALIFIER_NOTICE', 'NARRATIVE', 'PROPAGATION', 'EVIDENCE'],
  EXECUTIVE_READY: ['READINESS_BADGE', 'NARRATIVE', 'PROPAGATION', 'EVIDENCE'],
};

function resolveAttentionHierarchy(renderState) {
  return ATTENTION_HIERARCHY_MAP[renderState] || ATTENTION_HIERARCHY_MAP['BLOCKED'];
}

function resolveUrgencyFrame(renderState) {
  if (renderState === 'BLOCKED') return 'CRITICAL_HOLD';
  if (renderState === 'DIAGNOSTIC_ONLY') return 'ADVISORY_REVIEW';
  if (renderState === 'EXECUTIVE_READY_WITH_QUALIFIER') return 'QUALIFIED_AUTHORITY';
  return 'OPERATIONAL_AUTHORITY';
}

// Investigation stages (mirrors StructuralInvestigationFlow)
const INVESTIGATION_STAGES = ['SUMMARY', 'EVIDENCE', 'PROPAGATION', 'EXPLAINABILITY', 'LINEAGE'];

function resolveInvestigationStage(stage) {
  if (INVESTIGATION_STAGES.includes(stage)) return stage;
  return 'SUMMARY';
}

function resolveNextStage(currentStage) {
  const idx = INVESTIGATION_STAGES.indexOf(currentStage);
  if (idx === -1 || idx === INVESTIGATION_STAGES.length - 1) return null;
  return INVESTIGATION_STAGES[idx + 1];
}

function resolvePreviousStage(currentStage) {
  const idx = INVESTIGATION_STAGES.indexOf(currentStage);
  if (idx <= 0) return null;
  return INVESTIGATION_STAGES[idx - 1];
}

// Gravity tokens (mirrors OperationalGravitySystem)
const GRAVITY_INTENSITY_MAP = {
  EXECUTIVE_READY: 'standard',
  EXECUTIVE_READY_WITH_QUALIFIER: 'qualifier_prominent',
  DIAGNOSTIC_ONLY: 'diagnostic_prominent',
  BLOCKED: 'blocked_dominant',
};

const GRAVITY_TOKEN_MAP = {
  standard: 'gravity-standard',
  qualifier_prominent: 'gravity-qualifier',
  diagnostic_prominent: 'gravity-diagnostic',
  blocked_dominant: 'gravity-blocked',
};

function resolveGravityToken(renderState) {
  const intensity = GRAVITY_INTENSITY_MAP[renderState] || 'blocked_dominant';
  return GRAVITY_TOKEN_MAP[intensity] || GRAVITY_TOKEN_MAP['blocked_dominant'];
}

// Presence tokens (mirrors IntelligencePresenceLayer)
const PRESENCE_TOKENS = {
  EXECUTIVE_READY: 'presence-executive-authority',
  EXECUTIVE_READY_WITH_QUALIFIER: 'presence-qualified-authority',
  DIAGNOSTIC_ONLY: 'presence-diagnostic-alert',
  BLOCKED: 'presence-blocked-hold',
};

function resolvePresenceToken(renderState) {
  return PRESENCE_TOKENS[renderState] || PRESENCE_TOKENS['BLOCKED'];
}

// Canvas visible regions (mirrors ExecutiveOperationalCanvas)
const FULL_REGIONS = ['AUTHORITY_HEADER', 'READINESS_COMMAND', 'INTELLIGENCE_NARRATIVE', 'PROPAGATION_ZONE', 'EVIDENCE_LAYER'];

function resolveVisibleRegions(densityClass, renderState) {
  if (renderState === 'BLOCKED') {
    return ['AUTHORITY_HEADER', 'READINESS_COMMAND'];
  }
  if (renderState === 'DIAGNOSTIC_ONLY') {
    return ['AUTHORITY_HEADER', 'READINESS_COMMAND', 'INTELLIGENCE_NARRATIVE'];
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return ['AUTHORITY_HEADER', 'READINESS_COMMAND', 'INTELLIGENCE_NARRATIVE', 'PROPAGATION_ZONE'];
  }
  return [...FULL_REGIONS];
}

/**
 * orchestrateFlagshipExperience(reportObject, audienceTier, densityClass, boardroomMode, investigationStage)
 *
 * Full flagship experience orchestration.
 * Runs the complete LENS v2 pipeline for a given report_object.
 * Returns the full experiential state for rendering.
 * Deterministic: same input → same output.
 */
function orchestrateFlagshipExperience(reportObject, audienceTier, densityClass, boardroomMode, investigationStage) {
  const tier = audienceTier || 'EXECUTIVE';
  const density = densityClass || 'EXECUTIVE_DENSE';
  const boardroom = !!boardroomMode;
  const stage = resolveInvestigationStage(investigationStage || 'SUMMARY');

  // Full adapter pipeline
  const adapted = adaptReport(reportObject, tier, 2);
  const renderState = adapted.renderState;

  // Experiential orchestration
  const revealSequence = resolveRevealSequence(renderState);
  const motionProfile = resolveMotionProfile(renderState);

  // Build density props: narrative fields + qualifier_class (required for governance overrides)
  const densityAdaptedProps = {
    ...(adapted.narrative || {}),
    qualifier_class: reportObject && reportObject.qualifier_class,
  };
  const densityLayout = resolveExperientialDensityLayout(density, renderState, densityAdaptedProps);
  const cinemaOrchestration = resolveCinemaOrchestration(renderState);
  const boardroomConfig = resolveBoardroomConfig(renderState, density);
  const attentionHierarchy = resolveAttentionHierarchy(renderState);
  const urgencyFrame = resolveUrgencyFrame(renderState);
  const gravityToken = resolveGravityToken(renderState);
  const presenceToken = resolvePresenceToken(renderState);
  const visibleRegions = resolveVisibleRegions(density, renderState);

  return {
    // Adapter output
    renderState,
    audienceTier: tier,
    densityClass: density,
    adapted,

    // Cinematic orchestration
    revealSequence,
    motionProfile,
    densityLayout,
    cinemaOrchestration,
    boardroomConfig,

    // Attention and gravity
    attentionHierarchy,
    urgencyFrame,
    gravityToken,
    presenceToken,
    visibleRegions,

    // Investigation state
    investigationStage: stage,
    nextStage: resolveNextStage(stage),
    previousStage: resolvePreviousStage(stage),

    // Boardroom mode
    boardroomActive: boardroom,

    // Governance invariants
    governance: {
      topology_always_read_only: true,
      qualifier_never_suppressed: true,
      blocked_state_never_softened: true,
      diagnostic_state_never_softened: true,
      evidence_references_always_preserved: true,
      no_ai_calls: true,
      no_prompt_surfaces: true,
      no_chatbot_ux: true,
      no_animated_propagation: true,
      no_topology_mutation: true,
      no_semantic_mutation: true,
    },
  };
}

module.exports = {
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
  GRAVITY_INTENSITY_MAP,
  PRESENCE_TOKENS,
};
