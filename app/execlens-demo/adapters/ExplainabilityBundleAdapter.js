'use strict';

/**
 * ExplainabilityBundleAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts report_object.explainability_bundle into all seven panel display objects.
 * Applies blocked/diagnostic panel states per validation_result.
 * Applies audience tier visibility per EXP-AUD-01.
 *
 * Contract: pure function — no panel content generation, no supplementation of absent panels.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

const REQUIRED_PANEL_KEYS = {
  WHY: 'why_panel',
  EVIDENCE: 'evidence_panel',
  TRACE: 'trace_panel',
  QUALIFIERS: 'qualifiers_panel',
  LINEAGE: 'lineage_panel',
  CONFIDENCE: 'confidence_panel',
  READINESS_STATE: 'readiness_state_panel',
};

// Audience tier ordering for visibility checks (EXP-AUD-01)
const AUDIENCE_LEVEL = { EXECUTIVE: 0, ADVISORY: 1, AUDIT: 2 };

/**
 * adaptExplainabilityBundle(reportObject, validationResult, audienceTier)
 *
 * Transforms all seven panels into panel display objects.
 * If a required panel is absent → panel_state = 'BLOCKED'.
 * If validation_result has diagnosticReasons → panel_state = 'DIAGNOSTIC' for affected panels.
 * Panels visible only at ADVISORY+ are suppressed for EXECUTIVE tier.
 *
 * Returns:
 * {
 *   panels: {
 *     WHY: PanelDisplay,
 *     EVIDENCE: PanelDisplay,
 *     TRACE: PanelDisplay,
 *     QUALIFIERS: PanelDisplay,
 *     LINEAGE: PanelDisplay,
 *     CONFIDENCE: PanelDisplay,
 *     READINESS_STATE: PanelDisplay,
 *   },
 *   errors: AdapterError[],
 * }
 *
 * PanelDisplay: {
 *   panel_id: string,
 *   panel_title: string,
 *   panel_state: 'COLLAPSED' | 'EXPANDED' | 'BLOCKED' | 'DIAGNOSTIC',
 *   content_blocks: ContentBlock[],
 *   audience: string,
 *   visible_for_tier: boolean,
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function adaptExplainabilityBundle(reportObject, validationResult, audienceTier) {
  const errors = [];
  const bundle = reportObject && reportObject.explainability_bundle;
  const audienceLevel = AUDIENCE_LEVEL[audienceTier] !== undefined
    ? AUDIENCE_LEVEL[audienceTier]
    : AUDIENCE_LEVEL.EXECUTIVE;

  // Determine if overall report is blocked or diagnostic from validation result
  const isBlocked = validationResult && validationResult.renderState === 'BLOCKED';
  const isDiagnostic = validationResult && validationResult.renderState === 'DIAGNOSTIC_ONLY';

  const panels = {};

  for (const [panelId, panelKey] of Object.entries(REQUIRED_PANEL_KEYS)) {
    const rawPanel = bundle && bundle[panelKey];

    if (!rawPanel) {
      panels[panelId] = _blockedPanel(panelId, `${panelKey} absent from explainability_bundle`);
      errors.push(makeAdapterError('ADAPT-EXPLAIN-01', `${panelId} panel absent`));
      continue;
    }

    // Audience visibility: LINEAGE panel is ADVISORY+; suppress for EXECUTIVE
    const panelAudience = rawPanel.audience || 'EXECUTIVE';
    const panelAudienceLevel = AUDIENCE_LEVEL[panelAudience] !== undefined
      ? AUDIENCE_LEVEL[panelAudience]
      : AUDIENCE_LEVEL.EXECUTIVE;
    const visible_for_tier = audienceLevel >= panelAudienceLevel;

    // Panel state determination
    let panel_state;
    if (isBlocked) {
      panel_state = 'BLOCKED';
    } else if (isDiagnostic && panelId !== 'READINESS_STATE') {
      panel_state = 'DIAGNOSTIC';
    } else {
      // Default collapsed state per EXP-TRACE-01 (TRACE collapsed for EXECUTIVE)
      panel_state = (panelId === 'TRACE' && audienceTier === 'EXECUTIVE')
        ? 'COLLAPSED'
        : (panelId === 'LINEAGE' || panelId === 'CONFIDENCE')
          ? 'COLLAPSED'
          : 'EXPANDED';
    }

    panels[panelId] = {
      panel_id: rawPanel.panel_id || panelId,
      panel_title: rawPanel.panel_title || panelId,
      panel_state,
      content_blocks: Array.isArray(rawPanel.content_blocks)
        ? rawPanel.content_blocks.slice()   // copy, no mutation
        : [],
      audience: panelAudience,
      visible_for_tier,
    };
  }

  return { panels, errors };
}

function _blockedPanel(panelId, detail) {
  return {
    panel_id: panelId,
    panel_title: panelId,
    panel_state: 'BLOCKED',
    content_blocks: [],
    audience: 'EXECUTIVE',
    visible_for_tier: true,
    _blocked_detail: detail,
  };
}

module.exports = { adaptExplainabilityBundle, REQUIRED_PANEL_KEYS, AUDIENCE_LEVEL };
