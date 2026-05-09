'use strict';

// Fixtures containing forbidden vocabulary patterns for scan testing.
// These texts SHOULD trigger scanNarrativeText violations.
const NARRATIVE_FORBIDDEN_PROMPT_FIXTURE = {
  recommendation_text: 'We recommend that the team should address this immediately.',
  predictive_text: 'Execution pressure will result in cascading failures across secondary domains.',
  ai_phrasing_text: 'I think the structural pattern indicates an issue. Let me explain the analysis.',
  speculative_text: 'This possibly indicates a structural bottleneck, but perhaps further review is needed.',
  expected_violations: {
    recommendation_text: ['we recommend', 'the team should', 'address this'],
    predictive_text: ['will result in'],
    ai_phrasing_text: ['I think', 'Let me explain'],
    speculative_text: ['possibly', 'perhaps'],
  },
};

module.exports = { NARRATIVE_FORBIDDEN_PROMPT_FIXTURE };
