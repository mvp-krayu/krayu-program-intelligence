'use strict';

// Fixture verifying forbidden prompt/recommendation patterns are absent from motion semantics.
const EXPERIENTIAL_FORBIDDEN_PROMPT_FIXTURE = {
  motion_profile_text: 'AUTHORITATIVE QUALIFIED_AUTHORITATIVE DIAGNOSTIC_ASSERTIVE BLOCKED_ASSERTIVE',
  phase_names: ['READINESS_BADGE', 'QUALIFIER_NOTICE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE', 'EVIDENCE_POSTURE', 'DIAGNOSTIC_ESCALATION', 'BLOCKED_ESCALATION'],
  density_tokens: ['density-executive-balanced', 'density-executive-dense', 'density-investigation-dense'],
  expected: {
    no_recommendation_language: true,
    no_action_items: true,
    no_you_should_phrasing: true,
    no_address_this_phrasing: true,
    no_prompt_surfaces: true,
    no_chatbot_labels: true,
  },
};

module.exports = { EXPERIENTIAL_FORBIDDEN_PROMPT_FIXTURE };
