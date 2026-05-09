'use strict';

// Fixture containing GEIOS internal identifiers.
// These texts SHOULD trigger scanPropagationText GEIOS violations.
const PROPAGATION_FORBIDDEN_GEIOS_FIXTURE = {
  geios_text: 'The DPSIG signal shows cpi_score exceeds threshold. The GEIOS substrate processed propagation via canonical_topology.json.',
  clean_text: 'Structural pressure concentrates in the primary delivery domain and flows through the coordination layer.',
  expected: {
    geios_text_has_violations: true,
    clean_text_has_violations: false,
    geios_identifiers_in_geios_text: ['DPSIG', 'cpi_score', 'canonical_topology.json'],
  },
};

module.exports = { PROPAGATION_FORBIDDEN_GEIOS_FIXTURE };
