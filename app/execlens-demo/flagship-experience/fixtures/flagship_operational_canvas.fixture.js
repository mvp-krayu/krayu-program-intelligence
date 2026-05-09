'use strict';

const FLAGSHIP_OPERATIONAL_CANVAS_FIXTURE = {
  canvas_regions: [
    { region: 'AUTHORITY_HEADER', required: true, position: 'TOP' },
    { region: 'READINESS_COMMAND', required: true, position: 'COMMAND_ZONE' },
    { region: 'INTELLIGENCE_NARRATIVE', required: true, position: 'PRIMARY_CONTENT' },
    { region: 'PROPAGATION_ZONE', required: true, position: 'STRUCTURAL_LAYER' },
    { region: 'EVIDENCE_LAYER', required: true, position: 'FOUNDATION_LAYER' },
  ],
  density_orchestration: {
    EXECUTIVE_BALANCED: {
      visible_regions: ['AUTHORITY_HEADER', 'READINESS_COMMAND', 'INTELLIGENCE_NARRATIVE', 'PROPAGATION_ZONE'],
      collapsed_regions: ['EVIDENCE_LAYER'],
    },
    EXECUTIVE_DENSE: {
      visible_regions: ['AUTHORITY_HEADER', 'READINESS_COMMAND', 'INTELLIGENCE_NARRATIVE', 'PROPAGATION_ZONE', 'EVIDENCE_LAYER'],
      collapsed_regions: [],
    },
  },
  governance_invariants: {
    no_widget_dashboard_feel: true,
    no_fragmented_ui_zones: true,
    governance_critical_always_visible: true,
    all_regions_cohesive: true,
    no_hidden_governance_info: true,
  },
  expected: {
    all_regions_present: true,
    density_orchestration_active: true,
    evidence_accessible: true,
    governance_notices_always_visible: true,
    canvas_is_cinematic: true,
    no_dashboard_feel: true,
  },
};

module.exports = { FLAGSHIP_OPERATIONAL_CANVAS_FIXTURE };
