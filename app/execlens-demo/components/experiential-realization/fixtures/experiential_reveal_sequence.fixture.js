'use strict';

// Fixture verifying deterministic reveal sequence ordering.
// READINESS_BADGE is always first for non-escalation states.
// BLOCKED_ESCALATION is the sole phase for BLOCKED.
// DIAGNOSTIC_ESCALATION always precedes READINESS_BADGE for DIAGNOSTIC_ONLY.
const EXPERIENTIAL_REVEAL_SEQUENCE_FIXTURE = {
  sequences: {
    EXECUTIVE_READY: {
      expected_phases: ['READINESS_BADGE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE', 'EVIDENCE_POSTURE'],
      expected_first_phase: 'READINESS_BADGE',
      expected_count: 4,
      escalates_first: false,
    },
    EXECUTIVE_READY_WITH_QUALIFIER: {
      expected_phases: ['READINESS_BADGE', 'QUALIFIER_NOTICE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE', 'EVIDENCE_POSTURE'],
      expected_first_phase: 'READINESS_BADGE',
      expected_count: 5,
      escalates_first: false,
    },
    DIAGNOSTIC_ONLY: {
      expected_phases: ['DIAGNOSTIC_ESCALATION', 'READINESS_BADGE', 'QUALIFIER_NOTICE', 'EXECUTIVE_NARRATIVE', 'PROPAGATION_POSTURE'],
      expected_first_phase: 'DIAGNOSTIC_ESCALATION',
      expected_count: 5,
      escalates_first: true,
    },
    BLOCKED: {
      expected_phases: ['BLOCKED_ESCALATION'],
      expected_first_phase: 'BLOCKED_ESCALATION',
      expected_count: 1,
      escalates_first: true,
    },
  },
};

module.exports = { EXPERIENTIAL_REVEAL_SEQUENCE_FIXTURE };
