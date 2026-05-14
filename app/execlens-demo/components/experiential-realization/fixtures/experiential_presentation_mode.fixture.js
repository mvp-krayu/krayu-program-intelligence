'use strict';

const EXPERIENTIAL_PRESENTATION_MODE_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  densityClass: 'EXECUTIVE_BALANCED',
  presentationMode: true,
  expected: {
    presentation_compatible: true,
    collapsed_by_default: true,
    density_token: 'density-executive-balanced',
    transition_ms: 250,
    show_evidence_posture: false,
    show_structural_findings: false,
    evidence_references_preserved: true,
  },
};

module.exports = { EXPERIENTIAL_PRESENTATION_MODE_FIXTURE };
