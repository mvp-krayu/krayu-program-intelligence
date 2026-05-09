'use strict';

const FLAGSHIP_FORBIDDEN_AI_FIXTURE = {
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
  all_orchestration_tokens: [
    'EXECUTIVE_BRIEFING',
    'CONTROLLED_REVEAL',
    'STAGED_REVEAL',
    'INVESTIGATION_GUIDED',
    'BOARDROOM_PRESENT',
    'ATTENTION_DIRECTED',
    'PRESENCE_CONTINUOUS',
  ],
  forbidden_ai_patterns: [
    'thinking', 'generating', 'ai_call', 'llm', 'language_model',
    'chatbot', 'copilot', 'assistant', 'autonomous', 'predict',
    'inference', 'probabilistic', 'confidence_score', 'ai_generation',
  ],
  governance_invariants: {
    no_ai_thinking_animation: true,
    no_probabilistic_transition: true,
    no_chatbot_surface: true,
    no_ai_generation: true,
    no_prompt_interaction: true,
    no_live_inference: true,
    no_ai_personality: true,
    no_assistant_persona: true,
  },
  expected: {
    no_ai_component_names: true,
    no_thinking_orchestration_tokens: true,
    no_generating_orchestration_tokens: true,
    no_ai_governance_invariants: true,
  },
};

module.exports = { FLAGSHIP_FORBIDDEN_AI_FIXTURE };
