'use strict';

const NARRATIVE_DENSITY_DENSE_FIXTURE = {
  densityClass: 'EXECUTIVE_DENSE',
  narrativeProps: {
    executive_summary: 'Execution topology shows concentrated pressure in the primary delivery domain.',
    why_primary_statement: 'Structural pressure concentrates in the primary delivery domain.',
    structural_summary: 'Secondary domains show stable pressure patterns.',
    qualifier_notice: null,
    diagnosticFields: [],
    error: null,
  },
  expected: {
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: true,
    max_primary_findings: 3,
    evidence_references_preserved: true,
  },
};

module.exports = { NARRATIVE_DENSITY_DENSE_FIXTURE };
