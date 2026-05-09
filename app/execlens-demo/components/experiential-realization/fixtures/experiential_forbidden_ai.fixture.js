'use strict';

// Fixture verifying no AI-generation illusion in motion semantics or phase naming.
const EXPERIENTIAL_FORBIDDEN_AI_FIXTURE = {
  all_phase_names: ['READINESS_BADGE', 'QUALIFIER_NOTICE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE', 'EVIDENCE_POSTURE', 'DIAGNOSTIC_ESCALATION', 'BLOCKED_ESCALATION'],
  all_motion_profiles: ['AUTHORITATIVE', 'QUALIFIED_AUTHORITATIVE', 'DIAGNOSTIC_ASSERTIVE', 'BLOCKED_ASSERTIVE'],
  all_density_tokens: ['density-executive-balanced', 'density-executive-dense', 'density-investigation-dense'],
  governance_invariants: {
    no_ai_thinking_animation: true,
    no_probabilistic_transition: true,
    no_chatbot_surface: true,
    no_ai_generation: true,
    no_prompt_interaction: true,
  },
  expected: {
    no_ai_phase_names: true,
    no_thinking_profiles: true,
    no_generate_profiles: true,
    no_ai_density_tokens: true,
  },
};

module.exports = { EXPERIENTIAL_FORBIDDEN_AI_FIXTURE };
