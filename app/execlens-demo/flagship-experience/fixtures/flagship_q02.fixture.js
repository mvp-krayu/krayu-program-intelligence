'use strict';

const FLAGSHIP_Q02_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-02',
  densityClass: 'EXECUTIVE_DENSE',
  presentationMode: false,
  boardroomMode: false,
  adaptedProps: {
    executive_summary: 'Operational pressure is elevated across two domains. Cross-domain signal data is partially available.',
    why_primary_statement: 'Signal data covers primary domain fully. Secondary domain coverage is estimated from proxy signals.',
    structural_summary: 'TWO-DOMAIN PROPAGATION: Domain A (ORIGIN, ELEVATED) → Domain B (RECEIVER, MODERATE).',
    propagation_chains: [
      {
        path: ['Domain A', 'Domain B'],
        pressure_tier: 'ELEVATED',
        propagation_role: 'ORIGIN',
        origin_domain: 'Domain A',
      },
    ],
    qualifier_class: 'Q-02',
    qualifier_notice_text: 'Cross-domain signal coverage is limited. Interpretation requires advisory confirmation.',
  },
  expected: {
    renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
    reveal_sequence_includes_qualifier: true,
    motion_profile: 'QUALIFIED_AUTHORITATIVE',
    qualifier_notice_visible: true,
    qualifier_cannot_be_suppressed: true,
    blocked_notice_visible: false,
    topology_read_only: true,
  },
};

module.exports = { FLAGSHIP_Q02_FIXTURE };
