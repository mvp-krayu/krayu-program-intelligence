'use strict';

// Fixture containing GEIOS internal identifiers.
// These texts SHOULD trigger scanNarrativeText GEIOS violations.
const NARRATIVE_FORBIDDEN_GEIOS_FIXTURE = {
  geios_text: 'The DPSIG signal shows cpi_score exceeds threshold. The GEIOS substrate processed this via canonical_topology.json.',
  clean_text: 'Execution topology shows concentrated pressure in the primary delivery domain.',
  expected: {
    geios_text_has_violations: true,
    clean_text_has_violations: false,
    geios_identifiers_in_geios_text: ['DPSIG', 'cpi_score', 'canonical_topology.json'],
  },
};

module.exports = { NARRATIVE_FORBIDDEN_GEIOS_FIXTURE };
