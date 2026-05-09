'use strict';

/**
 * flagship_real_report.fixture.js
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Authoritative real report_object for flagship integration testing.
 * Represents a multi-domain commercial operations scenario:
 * - PRIMARY_DELIVERY domain experiencing HIGH execution pressure
 * - Propagation into COORDINATION_LAYER and SECONDARY_DELIVERY
 * - Q-01 qualifier active (partial signal grounding)
 * - EXECUTIVE_READY_WITH_QUALIFIER render state
 *
 * This report exercises the FULL LENS v2 stack:
 *   validation → adapters → experiential rendering → flagship composition
 */

const BASE_PANEL = (panelId, audience) => ({
  panel_id: panelId,
  panel_title: `${panelId} Panel`,
  content_blocks: [{ block_type: 'NARRATIVE', content: `${panelId} content — governed.` }],
  audience,
  available_in_phase: 2,
});

const FLAGSHIP_REAL_REPORT = {
  report_id: 'RPT-FLAGSHIP-REAL-001',
  baseline_ref: 'governed-baseline-v2',
  stream_ref: 'PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01',
  generated_at: '2026-05-09T00:00:00Z',
  evidence_object_hash: 'flagship001abc123def456flagship001',
  derivation_hash: 'derivflagship111222333444555666777',
  governance_verdict: 'PASS',
  readiness_state: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifier_class: 'Q-01',

  topology_scope: {
    domain_count: 3,
    cluster_count: 47,
    grounded_domain_count: 2,
    grounding_label: 'Partial Coverage',
  },

  header_block: {
    readiness_badge: {
      state_label: 'Executive Ready — Qualified',
      qualifier_label: 'Partial signal grounding. Advisory confirmation recommended.',
      color_token: '--intelligence-qualified',
      tooltip_text: 'Q-01: One or more domains are partially grounded. Signal intelligence may underrepresent full structural pressure.',
    },
    scope_indicator: {
      domain_label: '3 Domains Analyzed',
      grounding_label: 'Partial Coverage — 2 of 3 domains fully grounded',
      cluster_label: '47 Clusters',
    },
    report_metadata: {
      report_id: 'RPT-FLAGSHIP-REAL-001',
      generated_at: '2026-05-09T00:00:00Z',
      baseline_ref: 'governed-baseline-v2',
    },
  },

  narrative_block: {
    executive_summary: 'Primary Delivery domain is operating under high execution pressure. Pressure has propagated into Coordination Layer with elevated intensity. Secondary Delivery remains within acceptable operating range but is now a downstream pressure receiver.',
    why_section: 'Signal evidence from Primary Delivery shows cluster-level pressure concentration across 23 of 31 monitored clusters. Coordination Layer has absorbed 68% of propagated pressure load. Secondary Delivery grounding is partial — full pressure extent may be underrepresented in this view.',
    structural_summary: 'THREE-DOMAIN PROPAGATION: Primary Delivery (ORIGIN, HIGH) → Coordination Layer (PASS_THROUGH, ELEVATED) → Secondary Delivery (RECEIVER, MODERATE). Advisory confirmation recommended before executive action on Secondary Delivery signal.',
  },

  evidence_blocks: [
    {
      domain_alias: 'Primary Delivery',
      grounding_status: 'Q-00',
      grounding_label: 'Full Grounding',
      signal_cards: [
        {
          signal_label: 'Cluster Execution Pressure',
          pressure_label: 'High Execution Pressure',
          pressure_tier: 'HIGH',
          qualifier_label: '',
          evidence_text: '23 of 31 clusters in Primary Delivery are operating above normal pressure threshold. Cross-cluster pressure is compounding.',
        },
        {
          signal_label: 'Delivery Capacity Signal',
          pressure_label: 'Elevated Capacity Pressure',
          pressure_tier: 'ELEVATED',
          qualifier_label: '',
          evidence_text: 'Delivery capacity signal shows sustained elevated pressure for 12+ consecutive evidence cycles.',
        },
      ],
      evidence_description: 'Primary Delivery domain has full signal grounding across all 31 monitored clusters. High confidence in pressure assessment.',
      propagation_role: 'ORIGIN',
    },
    {
      domain_alias: 'Coordination Layer',
      grounding_status: 'Q-00',
      grounding_label: 'Full Grounding',
      signal_cards: [
        {
          signal_label: 'Coordination Throughput Pressure',
          pressure_label: 'Elevated Throughput Pressure',
          pressure_tier: 'ELEVATED',
          qualifier_label: '',
          evidence_text: 'Coordination Layer has absorbed propagated pressure from Primary Delivery. Throughput signal shows sustained elevated pressure across coordination clusters.',
        },
      ],
      evidence_description: 'Coordination Layer domain shows full signal grounding. Elevated pressure is confirmed as propagation absorption from Primary Delivery.',
      propagation_role: 'PASS_THROUGH',
    },
    {
      domain_alias: 'Secondary Delivery',
      grounding_status: 'Q-01',
      grounding_label: 'Partial Grounding',
      signal_cards: [
        {
          signal_label: 'Secondary Throughput Signal',
          pressure_label: 'Moderate Pressure',
          pressure_tier: 'MODERATE',
          qualifier_label: 'Partial grounding — advisory confirmation recommended',
          evidence_text: 'Secondary Delivery signal is partially grounded. Moderate pressure detected but full extent may be underrepresented.',
        },
      ],
      evidence_description: 'Secondary Delivery domain has partial signal grounding. Moderate pressure is confirmed from available evidence. Advisory confirmation recommended before executive action.',
      propagation_role: 'RECEIVER',
    },
  ],

  trace_block: {
    propagation_path: ['Primary Delivery', 'Coordination Layer', 'Secondary Delivery'],
    propagation_summary: 'HIGH pressure originating in Primary Delivery propagates through Coordination Layer into Secondary Delivery. Advisory qualification applies to Secondary Delivery signal assessment.',
    derivation_lineage_ref: 'STREAM-DERIV-FLAGSHIP-001',
    baseline_ref: 'governed-baseline-v2',
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
        interaction_id: 'INT-FLAGSHIP-001',
        interaction_type: 'EXPAND_COLLAPSE',
        target_module_id: 'MOD-FLAGSHIP-001',
        phase_required: 2,
        active: true,
        governance_gate: 'GATE-2',
      },
    ],
  },

  module_registry: {
    entries: [
      {
        module_id: 'MOD-FLAGSHIP-001',
        module_type: 'EXECUTIVE_SUMMARY_MODULE',
        report_id: 'RPT-FLAGSHIP-REAL-001',
        evidence_ref: 'flagship001abc123def456flagship001',
        active: true,
        phase_gate: 2,
        registered_at: '2026-05-09T00:00:00Z',
      },
    ],
  },

  rendering_metadata: {
    normalization_version: 'NORM-v1.0',
    ali_rules_applied: ['ALI-01', 'ALI-02', 'ALI-03', 'ALI-04'],
    qualifier_rules_applied: ['Q-01'],
    surface_mode: 'EXECUTIVE_READY_WITH_QUALIFIER',
    explainability_panels_rendered: ['WHY', 'EVIDENCE', 'TRACE', 'QUALIFIERS', 'LINEAGE', 'CONFIDENCE', 'READINESS_STATE'],
    topology_scope_verified: true,
    evidence_hash_verified: true,
    rendered_at: '2026-05-09T00:01:00Z',
    lens_version: '2.0.0',
  },

  trace_linkage: {
    evidence_object_hash: 'flagship001abc123def456flagship001',
    derivation_hash: 'derivflagship111222333444555666777',
    baseline_anchor: 'governed-baseline-v2',
    stream_anchor: 'PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01',
    run_id: 'RUN-FLAGSHIP-001',
  },
};

// Propagation chains in experiential format (for visual realization layer)
const FLAGSHIP_PROPAGATION_CHAINS = [
  {
    path: ['Primary Delivery', 'Coordination Layer', 'Secondary Delivery'],
    pressure_tier: 'HIGH',
    propagation_role: 'ORIGIN',
    origin_domain: 'Primary Delivery',
  },
  {
    path: ['Coordination Layer', 'Secondary Delivery'],
    pressure_tier: 'ELEVATED',
    propagation_role: 'PASS_THROUGH',
    origin_domain: 'Primary Delivery',
  },
];

// Expected adapter output
const FLAGSHIP_REAL_REPORT_EXPECTED = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  audienceTier: 'EXECUTIVE',
  qualifier_class: 'Q-01',
  has_narrative: true,
  has_evidence: true,
  has_propagation: true,
  topology_read_only: true,
  domain_count: 3,
};

module.exports = {
  FLAGSHIP_REAL_REPORT,
  FLAGSHIP_PROPAGATION_CHAINS,
  FLAGSHIP_REAL_REPORT_EXPECTED,
};
