'use strict';

const FLAGSHIP_EXECUTIVE_READY_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  qualifierClass: 'Q-00',
  densityClass: 'EXECUTIVE_BALANCED',
  presentationMode: false,
  boardroomMode: false,
  adaptedProps: {
    executive_summary: 'All domains are operating within normal execution parameters. No elevated pressure signals detected.',
    why_primary_statement: 'Signal evidence across all five domains shows stable cluster pressure levels with no critical thresholds breached.',
    structural_summary: 'STABLE: All domains isolated. No active propagation paths.',
    propagation_chains: [],
    qualifier_class: 'Q-00',
  },
  expected: {
    renderState: 'EXECUTIVE_READY',
    reveal_sequence_first_phase: 'READINESS_BADGE',
    motion_profile: 'AUTHORITATIVE',
    qualifier_notice_visible: false,
    blocked_notice_visible: false,
    diagnostic_notice_visible: false,
    content_sections_visible: true,
    topology_read_only: true,
  },
};

module.exports = { FLAGSHIP_EXECUTIVE_READY_FIXTURE };
