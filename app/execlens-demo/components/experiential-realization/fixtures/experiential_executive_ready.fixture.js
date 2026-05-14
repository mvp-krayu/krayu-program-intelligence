'use strict';

const EXPERIENTIAL_EXECUTIVE_READY_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  qualifierClass: 'Q-00',
  densityClass: 'EXECUTIVE_DENSE',
  adaptedProps: {
    qualifier_class: 'Q-00',
    executive_summary: 'Execution topology shows concentrated pressure in the primary delivery domain. Structural evidence confirms elevated load distribution asymmetry.',
    why_primary_statement: 'Structural pressure concentrates in the primary delivery domain, where cluster load exceeds normal distribution boundaries.',
    structural_summary: 'Secondary domains show stable pressure patterns with no cross-domain propagation detected.',
    propagation_chains: [
      { path: ['Primary Delivery', 'Coordination Layer'], pressure_tier: 'HIGH', propagation_role: 'ORIGIN', origin_domain: 'Primary Delivery' },
    ],
    evidence_links: [
      { domain_alias: 'Primary Delivery', propagation_role: 'ORIGIN', evidence_summary: 'Structural load concentration confirmed.' },
    ],
  },
  expected: {
    reveal_sequence: ['READINESS_BADGE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE', 'EVIDENCE_POSTURE'],
    motion_profile: 'AUTHORITATIVE',
    qualifier_notice_visible: false,
    blocked_notice_visible: false,
    diagnostic_notice_visible: false,
    evidence_references_preserved: true,
    escalates_first: false,
  },
};

module.exports = { EXPERIENTIAL_EXECUTIVE_READY_FIXTURE };
