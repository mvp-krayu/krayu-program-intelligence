'use strict';

const EXPERIENTIAL_BLOCKED_FIXTURE = {
  renderState: 'BLOCKED',
  qualifierClass: 'Q-04',
  densityClass: 'EXECUTIVE_DENSE',
  adaptedProps: {
    qualifier_class: 'Q-04',
    executive_summary: null,
    why_primary_statement: null,
    structural_summary: null,
    propagation_chains: [],
    evidence_links: [],
    blocked_headline: 'Readiness classification unavailable',
  },
  expected: {
    reveal_sequence: ['BLOCKED_ESCALATION'],
    phase_count: 1,
    motion_profile: 'BLOCKED_ASSERTIVE',
    escalates_first: true,
    blocked_notice_visible: true,
    q04_absence_notice_visible: true,
    qualifier_notice_visible: false,
    diagnostic_notice_visible: false,
    show_executive_summary: false,
    show_why_statement: false,
    show_structural_findings: false,
    evidence_references_preserved: true,
    reveal_base_ms: 80,
    stagger_ms: 0,
  },
};

module.exports = { EXPERIENTIAL_BLOCKED_FIXTURE };
