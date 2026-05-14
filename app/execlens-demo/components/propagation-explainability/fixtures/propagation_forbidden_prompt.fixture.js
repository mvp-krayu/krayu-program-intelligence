'use strict';

// Fixtures containing forbidden vocabulary patterns for scan testing.
// These texts SHOULD trigger scanPropagationText violations.
const PROPAGATION_FORBIDDEN_PROMPT_FIXTURE = {
  recommendation_text: 'We recommend that the team should address this propagation pattern immediately.',
  predictive_text: 'Execution pressure will result in cascading failures across secondary domains.',
  ai_phrasing_text: 'I think the propagation pattern indicates systemic risk. Let me explain the structural flow.',
  speculative_text: 'This possibly indicates a structural bottleneck, but perhaps further review is needed.',
  probabilistic_text: 'Confidence: 87% probability that propagation continues to secondary domain.',
  expected_violations: {
    recommendation_text: ['we recommend', 'the team should', 'address this'],
    predictive_text: ['will result in'],
    ai_phrasing_text: ['I think', 'Let me explain'],
    speculative_text: ['possibly', 'perhaps'],
    probabilistic_text: ['%', 'probability'],
  },
};

module.exports = { PROPAGATION_FORBIDDEN_PROMPT_FIXTURE };
