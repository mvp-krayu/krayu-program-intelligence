'use strict';

const FLAGSHIP_BLOCKED_FIXTURE = {
  renderState: 'BLOCKED',
  qualifierClass: 'Q-04',
  densityClass: 'EXECUTIVE_BALANCED',
  presentationMode: false,
  boardroomMode: false,
  adaptedProps: {
    qualifier_class: 'Q-04',
    blocked_headline: 'Readiness classification unavailable. Domain grounding is insufficient for executive presentation.',
    blocked_reason: 'INSUFFICIENT_DOMAIN_GROUNDING',
  },
  expected: {
    renderState: 'BLOCKED',
    reveal_sequence_sole_phase: 'BLOCKED_ESCALATION',
    motion_profile: 'BLOCKED_ASSERTIVE',
    blocked_notice_visible: true,
    blocked_cannot_be_suppressed: true,
    blocked_cannot_be_softened: true,
    executive_summary_visible: false,
    why_statement_visible: false,
    structural_findings_visible: false,
    evidence_references_preserved: true,
    topology_read_only: true,
  },
};

module.exports = { FLAGSHIP_BLOCKED_FIXTURE };
