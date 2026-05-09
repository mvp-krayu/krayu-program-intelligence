'use strict';

/**
 * diagnostic_only.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Valid DIAGNOSTIC_ONLY report_object fixture.
 * Q-03 qualifier class. governance_verdict PASS.
 * Renders in DIAGNOSTIC_ONLY mode — no executive intelligence surface.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const DIAGNOSTIC_ONLY_FIXTURE = {
  ...EXECUTIVE_READY_FIXTURE,
  report_id: 'RPT-DIAG-001',
  readiness_state: 'DIAGNOSTIC_ONLY',
  qualifier_class: 'Q-03',
  header_block: {
    ...EXECUTIVE_READY_FIXTURE.header_block,
    readiness_badge: {
      state_label: 'Diagnostic Mode',
      qualifier_label: 'Structural Diagnostic Qualifier',
      color_token: '--diagnostic-mode',
      tooltip_text: 'Insufficient grounding for executive intelligence rendering. Structural diagnostic view only.',
    },
    report_metadata: {
      report_id: 'RPT-DIAG-001',
      generated_at: '2026-05-09T00:00:00Z',
      baseline_ref: 'governed-baseline-v1',
    },
  },
  narrative_block: {
    executive_summary: 'Insufficient domain grounding prevents executive intelligence rendering.',
    why_section: 'Evidence coverage is below the threshold required for full signal derivation.',
    structural_summary: 'Diagnostic structural view only — evidence is incomplete.',
  },
  rendering_metadata: {
    ...EXECUTIVE_READY_FIXTURE.rendering_metadata,
    qualifier_rules_applied: ['Q-03'],
    surface_mode: 'DIAGNOSTIC_ONLY',
  },
  trace_linkage: {
    ...EXECUTIVE_READY_FIXTURE.trace_linkage,
    evidence_object_hash: 'abc123def456abc123def456abc123de',
  },
};

module.exports = { DIAGNOSTIC_ONLY_FIXTURE };
