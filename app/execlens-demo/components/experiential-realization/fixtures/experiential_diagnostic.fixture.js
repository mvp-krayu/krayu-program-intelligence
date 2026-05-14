'use strict';

const EXPERIENTIAL_DIAGNOSTIC_FIXTURE = {
  renderState: 'DIAGNOSTIC_ONLY',
  qualifierClass: 'Q-03',
  densityClass: 'EXECUTIVE_DENSE',
  adaptedProps: {
    qualifier_class: 'Q-03',
    executive_summary: 'Structural patterns are under advisory review.',
    why_primary_statement: 'Advisory confirmation recommended before executive action.',
    structural_summary: null,
    propagation_chains: [],
    evidence_links: [],
  },
  expected: {
    reveal_sequence: ['DIAGNOSTIC_ESCALATION', 'READINESS_BADGE', 'QUALIFIER_NOTICE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE'],
    motion_profile: 'DIAGNOSTIC_ASSERTIVE',
    escalates_first: true,
    diagnostic_notice_visible: true,
    qualifier_notice_visible: true,
    blocked_notice_visible: false,
    evidence_references_preserved: true,
    diagnostic_notice_text: 'This report contains content under advisory review. Advisory confirmation recommended.',
  },
};

module.exports = { EXPERIENTIAL_DIAGNOSTIC_FIXTURE };
