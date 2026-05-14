'use strict';

const NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-01',
  densityClass: 'EXECUTIVE_DENSE',
  narrativeProps: {
    executive_summary: 'Execution topology shows elevated pressure in the primary delivery domain. Analysis covers confirmed structural evidence within grounded domains.',
    why_primary_statement: 'Structural pressure concentrates in the primary delivery domain. Analysis scope bounded by confirmed structural topology.',
    structural_summary: 'Partial grounding scope applied. Findings reflect confirmed structural topology within the analyzed scope.',
    qualifier_notice: 'Analysis based on confirmed structural evidence within grounded domains.',
    diagnosticFields: [],
    error: null,
  },
  expected_mode: 'QUALIFIED_EXECUTIVE',
  expected_banner_token: 'token-qualifier-amber',
  expected_banner_renders: true,
};

module.exports = { NARRATIVE_EXECUTIVE_READY_Q01_FIXTURE };
