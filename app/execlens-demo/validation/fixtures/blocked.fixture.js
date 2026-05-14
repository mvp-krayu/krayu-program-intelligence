'use strict';

/**
 * blocked.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Valid BLOCKED report_object fixture.
 * governance_verdict FAIL. readiness_state BLOCKED_PENDING_DOMAIN_GROUNDING.
 * Validates that BLOCKED routing is enforced correctly.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const BLOCKED_FIXTURE = {
  ...EXECUTIVE_READY_FIXTURE,
  report_id: 'RPT-BLOCKED-001',
  governance_verdict: 'FAIL',
  readiness_state: 'BLOCKED_PENDING_DOMAIN_GROUNDING',
  qualifier_class: 'Q-04',
  header_block: {
    ...EXECUTIVE_READY_FIXTURE.header_block,
    readiness_badge: {
      state_label: 'Analysis Blocked',
      qualifier_label: 'Intelligence Withheld',
      color_token: '--blocked-state',
      tooltip_text: 'Analysis blocked pending domain grounding. Signal intelligence is withheld from this view.',
    },
    report_metadata: {
      report_id: 'RPT-BLOCKED-001',
      generated_at: '2026-05-09T00:00:00Z',
      baseline_ref: 'governed-baseline-v1',
    },
  },
  narrative_block: {
    executive_summary: 'Analysis is blocked. Governance verdict is FAIL.',
    why_section: 'Domain grounding requirements have not been satisfied.',
    structural_summary: 'No structural intelligence available.',
  },
  explainability_bundle: {
    ...EXECUTIVE_READY_FIXTURE.explainability_bundle,
    qualifiers_panel: {
      panel_id: 'QUALIFIERS',
      panel_title: 'Qualifiers Panel',
      content_blocks: [
        {
          block_type: 'NARRATIVE',
          content: 'Signal intelligence withheld from this view.',
          qualifier_ref: 'Q-04',
        },
      ],
      audience: 'EXECUTIVE',
      available_in_phase: 2,
    },
  },
  rendering_metadata: {
    ...EXECUTIVE_READY_FIXTURE.rendering_metadata,
    qualifier_rules_applied: ['Q-04'],
    surface_mode: 'BLOCKED',
  },
  trace_linkage: {
    ...EXECUTIVE_READY_FIXTURE.trace_linkage,
    evidence_object_hash: 'abc123def456abc123def456abc123de',
  },
};

module.exports = { BLOCKED_FIXTURE };
