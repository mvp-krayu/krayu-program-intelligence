'use strict';

const NARRATIVE_DIAGNOSTIC_FIXTURE = {
  renderState: 'DIAGNOSTIC_ONLY',
  qualifierClass: 'Q-03',
  densityClass: 'EXECUTIVE_DENSE',
  narrativeProps: {
    executive_summary: 'This analysis is under structural review. Advisory confirmation recommended before executive action.',
    why_primary_statement: 'Structural indicators show patterns requiring advisory review before executive classification.',
    structural_summary: 'Structural review scope applies to all findings in this report.',
    qualifier_notice: 'Advisory confirmation recommended before executive action.',
    diagnosticFields: [],
    error: null,
  },
  expected_mode: 'DIAGNOSTIC_FRAME',
  expected_surface_token: 'narrative-diagnostic',
  expected_diagnostic_notice: 'This report contains content under advisory review. Advisory confirmation recommended.',
};

module.exports = { NARRATIVE_DIAGNOSTIC_FIXTURE };
