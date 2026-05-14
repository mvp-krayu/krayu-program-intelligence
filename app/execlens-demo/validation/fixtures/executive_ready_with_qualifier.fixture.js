'use strict';

/**
 * executive_ready_with_qualifier.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Valid EXECUTIVE_READY_WITH_QUALIFIER report_object fixture.
 * Q-01 qualifier class. governance_verdict PASS. All 7 panels present.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE = {
  ...EXECUTIVE_READY_FIXTURE,
  report_id: 'RPT-EXEC-QUAL-001',
  readiness_state: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifier_class: 'Q-01',
  header_block: {
    ...EXECUTIVE_READY_FIXTURE.header_block,
    readiness_badge: {
      state_label: 'Executive Ready — Partial Grounding',
      qualifier_label: 'Partial Grounding Qualifier',
      color_token: '--intelligence-authority-qualified',
      tooltip_text: 'Analysis is based on partial domain grounding. Some domains had insufficient evidence for full signal derivation.',
    },
    report_metadata: {
      report_id: 'RPT-EXEC-QUAL-001',
      generated_at: '2026-05-09T00:00:00Z',
      baseline_ref: 'governed-baseline-v1',
    },
  },
  rendering_metadata: {
    ...EXECUTIVE_READY_FIXTURE.rendering_metadata,
    qualifier_rules_applied: ['Q-01'],
    surface_mode: 'EXECUTIVE_READY_WITH_QUALIFIER',
  },
  explainability_bundle: {
    ...EXECUTIVE_READY_FIXTURE.explainability_bundle,
    qualifiers_panel: {
      panel_id: 'QUALIFIERS',
      panel_title: 'Qualifiers Panel',
      content_blocks: [
        {
          block_type: 'QUALIFIER_CHIP',
          content: 'Partial Grounding Qualifier — 4 of 5 domains have full signal grounding.',
          qualifier_ref: 'Q-01',
        },
      ],
      audience: 'EXECUTIVE',
      available_in_phase: 2,
    },
  },
  trace_linkage: {
    ...EXECUTIVE_READY_FIXTURE.trace_linkage,
    evidence_object_hash: 'abc123def456abc123def456abc123de',
  },
};

module.exports = { EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE };
