'use strict';

const FLAGSHIP_FORBIDDEN_PROMPT_FIXTURE = {
  forbidden_ux_patterns: [
    { pattern: 'prompt_bar', forbidden: true },
    { pattern: 'chat_window', forbidden: true },
    { pattern: 'assistant_avatar', forbidden: true },
    { pattern: 'floating_copilot', forbidden: true },
    { pattern: 'text_input_field', forbidden: true },
    { pattern: 'nlq_surface', forbidden: true },
    { pattern: 'conversational_interface', forbidden: true },
    { pattern: 'suggested_actions', forbidden: true },
    { pattern: 'ai_mediated_navigation', forbidden: true },
  ],
  forbidden_language_patterns: [
    'recommend', 'you should', 'consider', 'action items',
    'address this', 'next steps for you', 'suggested',
  ],
  all_component_names: [
    'LensV2FlagshipExperience',
    'ExecutiveBoardroomMode',
    'OperationalGravitySystem',
    'IntelligenceRevealCinema',
    'StructuralInvestigationFlow',
    'ExecutiveOperationalCanvas',
    'TopologySafeVisualRealization',
    'ExecutiveAttentionDirector',
    'IntelligencePresenceLayer',
  ],
  expected: {
    no_prompt_surfaces: true,
    no_chatbot_ux: true,
    no_text_input_surfaces: true,
    no_recommendation_language: true,
    no_action_items: true,
    no_you_should_phrasing: true,
    no_conversational_ux: true,
  },
};

module.exports = { FLAGSHIP_FORBIDDEN_PROMPT_FIXTURE };
