'use strict';

// Fixture representing a propagation surface with no evidence linkage.
// Missing evidence must be rendered explicitly — never silent.
const PROPAGATION_MISSING_EVIDENCE_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  densityClass: 'EXECUTIVE_DENSE',
  propagationProps: {
    propagation_summary: 'Structural pressure concentration confirmed in primary delivery domain.',
    propagation_chains: [
      { path: ['Primary Delivery'], pressure_tier: 'HIGH', propagation_role: 'ORIGIN', origin_domain: 'Primary Delivery' },
    ],
    evidence_links: [],
  },
  expected: {
    missing_evidence_explicit: true,
    missing_evidence_silent: false,
    propagation_summary_still_shown: true,
    propagation_chains_still_shown: true,
  },
};

module.exports = { PROPAGATION_MISSING_EVIDENCE_FIXTURE };
