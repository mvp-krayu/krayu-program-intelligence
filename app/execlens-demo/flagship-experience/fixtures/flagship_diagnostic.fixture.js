'use strict';

const FLAGSHIP_DIAGNOSTIC_FIXTURE = {
  renderState: 'DIAGNOSTIC_ONLY',
  qualifierClass: 'Q-02',
  densityClass: 'EXECUTIVE_BALANCED',
  presentationMode: false,
  boardroomMode: false,
  adaptedProps: {
    qualifier_class: 'Q-02',
    diagnostic_headline: 'Structural assessment is under advisory review.',
    diagnostic_detail: 'Signal evidence requires advisory confirmation before executive presentation.',
  },
  expected: {
    renderState: 'DIAGNOSTIC_ONLY',
    reveal_sequence_first_phase: 'DIAGNOSTIC_ESCALATION',
    motion_profile: 'DIAGNOSTIC_ASSERTIVE',
    diagnostic_notice_visible: true,
    diagnostic_cannot_be_suppressed: true,
    executive_summary_visible: false,
    blocked_notice_visible: false,
    topology_read_only: true,
  },
};

module.exports = { FLAGSHIP_DIAGNOSTIC_FIXTURE };
