'use strict';

const FLAGSHIP_Q01_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-01',
  densityClass: 'EXECUTIVE_DENSE',
  presentationMode: false,
  boardroomMode: false,
  adaptedProps: {
    executive_summary: 'Primary Delivery domain is under high execution pressure. Propagation into Coordination Layer confirmed at elevated intensity.',
    why_primary_statement: 'Evidence shows cluster-level pressure concentration in Primary Delivery. Coordination Layer has absorbed 68% of propagated load.',
    structural_summary: 'THREE-DOMAIN PROPAGATION: Primary Delivery (ORIGIN, HIGH) → Coordination Layer (PASS_THROUGH, ELEVATED) → Secondary Delivery (RECEIVER, MODERATE).',
    propagation_chains: [
      {
        path: ['Primary Delivery', 'Coordination Layer', 'Secondary Delivery'],
        pressure_tier: 'HIGH',
        propagation_role: 'ORIGIN',
        origin_domain: 'Primary Delivery',
      },
    ],
    qualifier_class: 'Q-01',
    qualifier_notice_text: 'Partial signal grounding. Advisory confirmation recommended.',
  },
  expected: {
    renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
    reveal_sequence_includes_qualifier: true,
    motion_profile: 'QUALIFIED_AUTHORITATIVE',
    qualifier_notice_visible: true,
    qualifier_cannot_be_suppressed: true,
    blocked_notice_visible: false,
    diagnostic_notice_visible: false,
    topology_read_only: true,
  },
};

module.exports = { FLAGSHIP_Q01_FIXTURE };
