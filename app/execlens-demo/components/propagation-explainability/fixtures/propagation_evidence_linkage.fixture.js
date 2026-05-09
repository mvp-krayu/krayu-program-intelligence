'use strict';

const PROPAGATION_EVIDENCE_LINKAGE_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  evidence_links: [
    {
      domain_alias: 'Primary Delivery',
      propagation_role: 'ORIGIN',
      evidence_summary: 'Structural load concentration confirmed across primary delivery topology.',
    },
    {
      domain_alias: 'Coordination Layer',
      propagation_role: 'PASS_THROUGH',
      evidence_summary: 'Pressure flow confirmed through coordination topology.',
    },
    {
      domain_alias: 'Secondary Delivery',
      propagation_role: 'RECEIVER',
      evidence_summary: 'Pressure absorption confirmed at secondary domain boundary.',
    },
  ],
  expected: {
    link_count: 3,
    all_domains_present: true,
    all_roles_rendered_with_display_labels: true,
    evidence_summaries_preserved: true,
  },
};

module.exports = { PROPAGATION_EVIDENCE_LINKAGE_FIXTURE };
