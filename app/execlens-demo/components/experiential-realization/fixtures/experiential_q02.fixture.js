'use strict';

const EXPERIENTIAL_Q02_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-02',
  densityClass: 'EXECUTIVE_DENSE',
  adaptedProps: {
    qualifier_class: 'Q-02',
    executive_summary: 'Structural topology confirmed. Pressure distribution reflects available grounding within confirmed topology scope.',
    why_primary_statement: 'Structural view applies to this analysis.',
    structural_summary: null,
    propagation_chains: [],
    evidence_links: [],
  },
  expected: {
    reveal_sequence: ['READINESS_BADGE', 'QUALIFIER_NOTICE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE', 'EVIDENCE_POSTURE'],
    motion_profile: 'QUALIFIED_AUTHORITATIVE',
    qualifier_notice_visible: true,
    q04_absence_notice_visible: false,
    blocked_notice_visible: false,
    evidence_references_preserved: true,
  },
};

module.exports = { EXPERIENTIAL_Q02_FIXTURE };
