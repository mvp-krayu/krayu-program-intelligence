'use strict';

/**
 * ExplainabilityValidator.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Validates the seven-panel explainability bundle from a report_object.
 * Enforces: all panels present, valid panel_ids, valid audience, valid content.
 * Enforces Q-04 explicit absence notice requirement (EXP-QUAL-03, ROM-VAL-17).
 *
 * Contract: pure function — does not mutate input, does not generate content,
 * does not call AI, does not call external APIs.
 */

const {
  makeError,
  REQUIRED_PANEL_IDS,
  VALID_PANEL_IDS,
  VALID_AUDIENCES,
  VALID_QUALIFIER_CLASSES,
} = require('./ValidationErrorTaxonomy');

const QUALIFIER_PANEL_ID = 'QUALIFIERS';
const Q04_ABSENCE_NOTICE_TEXT = 'Signal intelligence withheld from this view';

/**
 * Validates a single ExplainabilityPanel.
 * Returns array of errors.
 */
function validatePanel(panel, panelKey) {
  const errors = [];

  if (!panel || typeof panel !== 'object') {
    errors.push(makeError('VAL-EXPLAIN-02', `${panelKey}: panel is null or not an object`));
    return errors;
  }

  if (!VALID_PANEL_IDS.includes(panel.panel_id)) {
    errors.push(makeError('VAL-EXPLAIN-02', `${panelKey}: panel_id '${panel.panel_id}' is invalid`));
  }

  if (!panel.panel_title || typeof panel.panel_title !== 'string') {
    errors.push(makeError('VAL-EXPLAIN-02', `${panelKey}: panel_title absent`));
  }

  if (!Array.isArray(panel.content_blocks)) {
    errors.push(makeError('VAL-EXPLAIN-02', `${panelKey}: content_blocks is not an array`));
  }

  if (!VALID_AUDIENCES.includes(panel.audience)) {
    errors.push(makeError('VAL-EXPLAIN-02', `${panelKey}: audience '${panel.audience}' is invalid`));
  }

  if (typeof panel.available_in_phase !== 'number' || panel.available_in_phase < 2) {
    errors.push(makeError('VAL-EXPLAIN-02', `${panelKey}: available_in_phase must be integer >= 2`));
  }

  return errors;
}

/**
 * Validates Q-04 absence notice in the QUALIFIERS panel.
 * When qualifier_class = Q-04, the QUALIFIERS panel must contain
 * an explicit absence notice string per ROM-VAL-17.
 *
 * Returns array of errors (empty = requirement satisfied or not applicable).
 */
function validateQ04AbsenceNotice(qualifiersPanel, qualifierClass) {
  const errors = [];

  if (qualifierClass !== 'Q-04') return errors;
  if (!qualifiersPanel || !Array.isArray(qualifiersPanel.content_blocks)) return errors;

  const hasAbsenceNotice = qualifiersPanel.content_blocks.some(block => {
    if (typeof block.content === 'string') {
      return block.content.toLowerCase().includes(Q04_ABSENCE_NOTICE_TEXT.toLowerCase());
    }
    return false;
  });

  if (!hasAbsenceNotice) {
    errors.push(makeError('VAL-EXPLAIN-03',
      `QUALIFIERS panel: Q-04 requires explicit absence notice containing "${Q04_ABSENCE_NOTICE_TEXT}" — silent suppression prohibited`));
  }

  return errors;
}

/**
 * validateExplainabilityBundle(bundle, qualifierClass)
 *
 * Validates the full seven-panel explainability bundle.
 *
 * Parameters:
 *   bundle        — report_object.explainability_bundle
 *   qualifierClass — report_object.qualifier_class (needed for Q-04 check)
 *
 * Returns:
 * {
 *   valid: boolean,
 *   errors: ValidationError[],
 *   panelsFound: string[],
 *   panelsMissing: string[],
 * }
 *
 * Pure function. Does not mutate bundle.
 */
function validateExplainabilityBundle(bundle, qualifierClass) {
  const errors = [];

  if (!bundle || typeof bundle !== 'object') {
    errors.push(makeError('VAL-EXPLAIN-01', 'explainability_bundle is null or not an object'));
    return { valid: false, errors, panelsFound: [], panelsMissing: REQUIRED_PANEL_IDS.slice() };
  }

  const panelKeyMap = {
    WHY: 'why_panel',
    EVIDENCE: 'evidence_panel',
    TRACE: 'trace_panel',
    QUALIFIERS: 'qualifiers_panel',
    LINEAGE: 'lineage_panel',
    CONFIDENCE: 'confidence_panel',
    READINESS_STATE: 'readiness_state_panel',
  };

  const panelsFound = [];
  const panelsMissing = [];

  REQUIRED_PANEL_IDS.forEach(panelId => {
    const key = panelKeyMap[panelId];
    if (!bundle[key]) {
      panelsMissing.push(panelId);
      errors.push(makeError('VAL-EXPLAIN-01', `explainability_bundle.${key} (${panelId}) is absent`));
    } else {
      panelsFound.push(panelId);
      const panelErrors = validatePanel(bundle[key], `${panelId} panel`);
      errors.push(...panelErrors);
    }
  });

  // Q-04 absence notice check
  if (panelsFound.includes('QUALIFIERS')) {
    const q04Errors = validateQ04AbsenceNotice(bundle[panelKeyMap['QUALIFIERS']], qualifierClass);
    errors.push(...q04Errors);
  }

  // Forbid live generation fields — panels must not contain AI-generation markers
  const liveGenerationForbiddenKeys = ['live_generated', 'generated_at_render_time', 'ai_generated', 'dynamic_content'];
  REQUIRED_PANEL_IDS.forEach(panelId => {
    const key = panelKeyMap[panelId];
    const panel = bundle[key];
    if (panel) {
      liveGenerationForbiddenKeys.forEach(forbidden => {
        if (panel[forbidden] === true) {
          errors.push(makeError('VAL-GOV-02', `${panelId} panel: forbidden field '${forbidden}' detected — live generation prohibited`));
        }
      });
    }
  });

  const valid = errors.length === 0;
  return { valid, errors, panelsFound, panelsMissing };
}

/**
 * validatePanelStates(panelStates)
 *
 * Validates that panel state map values are valid display states.
 * panel_states are pure display state (COLLAPSED / EXPANDED) — not evidence states.
 *
 * Returns array of errors.
 */
function validatePanelStates(panelStates) {
  const errors = [];
  if (!panelStates || typeof panelStates !== 'object') return errors;

  const VALID_DISPLAY_STATES = ['COLLAPSED', 'EXPANDED', 'BLOCKED', 'DIAGNOSTIC'];

  Object.entries(panelStates).forEach(([panelId, state]) => {
    if (!VALID_DISPLAY_STATES.includes(state)) {
      errors.push(makeError('VAL-EXPLAIN-02', `panelStates.${panelId}: '${state}' is not a valid display state`));
    }
  });

  return errors;
}

module.exports = {
  validateExplainabilityBundle,
  validatePanel,
  validateQ04AbsenceNotice,
  validatePanelStates,
  REQUIRED_PANEL_IDS,
};
