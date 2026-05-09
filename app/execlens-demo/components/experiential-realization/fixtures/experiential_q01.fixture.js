'use strict';

const EXPERIENTIAL_Q01_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-01',
  densityClass: 'EXECUTIVE_DENSE',
  adaptedProps: {
    qualifier_class: 'Q-01',
    executive_summary: 'Structural evidence within grounded domains confirms elevated pressure concentration.',
    why_primary_statement: 'Analysis scope bounded by confirmed structural topology.',
    structural_summary: 'Partial grounding scope applied.',
    propagation_chains: [],
    evidence_links: [],
  },
  expected: {
    reveal_sequence: ['READINESS_BADGE', 'QUALIFIER_NOTICE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE', 'EVIDENCE_POSTURE'],
    motion_profile: 'QUALIFIED_AUTHORITATIVE',
    qualifier_notice_visible: true,
    q04_absence_notice_visible: false,
    blocked_notice_visible: false,
    diagnostic_notice_visible: false,
    evidence_references_preserved: true,
    escalates_first: false,
    qualifier_emphasis_ms: 300,
  },
};

module.exports = { EXPERIENTIAL_Q01_FIXTURE };
