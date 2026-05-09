'use strict';

const NARRATIVE_EXECUTIVE_READY_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  qualifierClass: 'Q-00',
  densityClass: 'EXECUTIVE_DENSE',
  narrativeProps: {
    executive_summary: 'Execution topology shows concentrated pressure in the primary delivery domain. Structural evidence confirms elevated load distribution asymmetry.',
    why_primary_statement: 'Structural pressure concentrates in the primary delivery domain, where cluster load exceeds normal distribution boundaries.',
    structural_summary: 'Secondary domains show stable pressure patterns with no cross-domain propagation detected.',
    qualifier_notice: null,
    diagnosticFields: [],
    error: null,
  },
  expected_mode: 'FULL_EXECUTIVE',
  expected_surface_token: 'narrative-executive-ready',
};

module.exports = { NARRATIVE_EXECUTIVE_READY_FIXTURE };
