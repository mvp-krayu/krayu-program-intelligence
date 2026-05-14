'use strict';

const NARRATIVE_BLOCKED_FIXTURE = {
  renderState: 'BLOCKED',
  qualifierClass: 'Q-04',
  densityClass: 'EXECUTIVE_DENSE',
  narrativeProps: {
    executive_summary: null,
    why_primary_statement: null,
    structural_summary: null,
    qualifier_notice: null,
    diagnosticFields: [],
    error: null,
  },
  expected_mode: 'BLOCKED',
  expected_surface_token: 'narrative-blocked',
  expected_blocked_notice: 'Readiness classification unavailable',
  expected_all_sections_visible: false,
};

module.exports = { NARRATIVE_BLOCKED_FIXTURE };
