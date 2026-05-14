'use strict';

const NARRATIVE_EXECUTIVE_READY_Q02_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-02',
  densityClass: 'EXECUTIVE_DENSE',
  narrativeProps: {
    executive_summary: 'Structural topology confirms elevated pressure distribution in the primary domain. Structural view applies.',
    why_primary_statement: 'Structural topology is confirmed. Semantic depth reflects available grounding within confirmed topology.',
    structural_summary: 'Structural view scope applied to this analysis.',
    qualifier_notice: 'Structural topology confirmed. Semantic depth reflects available grounding.',
    diagnosticFields: [],
    error: null,
  },
  expected_mode: 'QUALIFIED_EXECUTIVE',
  expected_banner_token: 'token-qualifier-blue',
  expected_banner_renders: true,
};

module.exports = { NARRATIVE_EXECUTIVE_READY_Q02_FIXTURE };
