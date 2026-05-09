'use strict';

/**
 * executive_ready.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Valid EXECUTIVE_READY report_object fixture.
 * All 7 panels present. Q-00. governance_verdict PASS. Deterministic.
 */

const BASE_PANEL = (panelId, audience) => ({
  panel_id: panelId,
  panel_title: `${panelId} Panel`,
  content_blocks: [{ block_type: 'NARRATIVE', content: `${panelId} content.` }],
  audience,
  available_in_phase: 2,
});

const EXECUTIVE_READY_FIXTURE = {
  report_id: 'RPT-EXEC-READY-001',
  baseline_ref: 'governed-baseline-v1',
  stream_ref: 'PI.LENS.NEXTGEN-REPORTS.TEST.01',
  generated_at: '2026-05-09T00:00:00Z',
  evidence_object_hash: 'abc123def456abc123def456abc123de',
  derivation_hash: 'derivhash000111222333444555666777',
  governance_verdict: 'PASS',
  readiness_state: 'EXECUTIVE_READY',
  qualifier_class: 'Q-00',
  topology_scope: {
    domain_count: 5,
    cluster_count: 20,
    grounded_domain_count: 5,
    grounding_label: 'Full Coverage',
  },
  header_block: {
    readiness_badge: {
      state_label: 'Executive Ready',
      qualifier_label: '',
      color_token: '--intelligence-authority',
      tooltip_text: '',
    },
    scope_indicator: {
      domain_label: '5 Domains Analyzed',
      grounding_label: 'Full Coverage',
      cluster_label: '20 Clusters',
    },
    report_metadata: {
      report_id: 'RPT-EXEC-READY-001',
      generated_at: '2026-05-09T00:00:00Z',
      baseline_ref: 'governed-baseline-v1',
    },
  },
  narrative_block: {
    executive_summary: 'Organizational pressure is within normal operating range across all domains.',
    why_section: 'Evidence from five domains shows stable cluster pressure levels with no critical signals.',
    structural_summary: 'All domains are grounded. No elevated pressure clusters detected.',
  },
  evidence_blocks: [
    {
      domain_alias: 'Operations',
      grounding_status: 'Q-00',
      grounding_label: 'Full Grounding',
      signal_cards: [
        {
          signal_label: 'Cluster Pressure Level',
          pressure_label: 'Low Cluster Pressure',
          pressure_tier: 'LOW',
          qualifier_label: '',
          evidence_text: 'Cluster pressure remains in the low tier.',
        },
      ],
      evidence_description: 'Operations domain shows stable patterns across all clusters.',
      propagation_role: 'ISOLATED',
    },
  ],
  trace_block: {
    propagation_path: ['Operations'],
    propagation_summary: 'No cross-domain pressure propagation detected.',
    derivation_lineage_ref: 'STREAM-DERIV-001',
    baseline_ref: 'governed-baseline-v1',
  },
  explainability_bundle: {
    why_panel: BASE_PANEL('WHY', 'EXECUTIVE'),
    evidence_panel: BASE_PANEL('EVIDENCE', 'EXECUTIVE'),
    trace_panel: BASE_PANEL('TRACE', 'ADVISORY'),
    qualifiers_panel: BASE_PANEL('QUALIFIERS', 'EXECUTIVE'),
    lineage_panel: BASE_PANEL('LINEAGE', 'ADVISORY'),
    confidence_panel: BASE_PANEL('CONFIDENCE', 'EXECUTIVE'),
    readiness_state_panel: BASE_PANEL('READINESS_STATE', 'EXECUTIVE'),
  },
  interaction_registry: {
    interactions: [
      {
        interaction_id: 'INT-001',
        interaction_type: 'EXPAND_COLLAPSE',
        target_module_id: 'MOD-001',
        phase_required: 2,
        active: true,
        governance_gate: 'GATE-2',
      },
    ],
  },
  module_registry: {
    entries: [
      {
        module_id: 'MOD-001',
        module_type: 'EXECUTIVE_SUMMARY_MODULE',
        report_id: 'RPT-EXEC-READY-001',
        evidence_ref: 'abc123def456abc123def456abc123de',
        active: true,
        phase_gate: 2,
        registered_at: '2026-05-09T00:00:00Z',
      },
    ],
  },
  rendering_metadata: {
    normalization_version: 'NORM-v1.0',
    ali_rules_applied: ['ALI-01', 'ALI-02', 'ALI-03', 'ALI-04'],
    qualifier_rules_applied: ['Q-00'],
    surface_mode: 'EXECUTIVE_READY',
    explainability_panels_rendered: ['WHY', 'EVIDENCE', 'TRACE', 'QUALIFIERS', 'LINEAGE', 'CONFIDENCE', 'READINESS_STATE'],
    topology_scope_verified: true,
    evidence_hash_verified: true,
    rendered_at: '2026-05-09T00:01:00Z',
    lens_version: '2.0.0',
  },
  trace_linkage: {
    evidence_object_hash: 'abc123def456abc123def456abc123de',
    derivation_hash: 'derivhash000111222333444555666777',
    baseline_anchor: 'governed-baseline-v1',
    stream_anchor: 'PI.LENS.NEXTGEN-REPORTS.TEST.01',
    run_id: 'RUN-TEST-001',
  },
};

module.exports = { EXECUTIVE_READY_FIXTURE };
