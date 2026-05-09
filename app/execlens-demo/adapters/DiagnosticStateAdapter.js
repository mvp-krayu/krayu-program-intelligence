'use strict';

/**
 * DiagnosticStateAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts diagnostic routing reasons into DiagnosticState display props.
 * Diagnostic state is always explicit and visible — never suppressed.
 * Executive intelligence surface is suppressed; structural view available.
 *
 * Contract: pure function — no promotion to executive-ready, no hidden diagnostics.
 */

/**
 * adaptDiagnosticState(validationResult, affectedPanelIds)
 *
 * Returns:
 * {
 *   diagnostic_banner_text: string,
 *   affected_panel_ids: string[],
 *   advisory_notice: string,
 *   error: null,
 * }
 *
 * Pure function. Diagnostic state must never be treated as executive-ready.
 */
function adaptDiagnosticState(validationResult, affectedPanelIds) {
  const reasons = (validationResult && Array.isArray(validationResult.diagnosticReasons))
    ? validationResult.diagnosticReasons
    : [];

  const affected = Array.isArray(affectedPanelIds) ? affectedPanelIds.slice() : [];

  // Executive-visible diagnostic banner — no GEIOS internal codes
  const diagnostic_banner_text = reasons.length > 0
    ? 'This report is in structural diagnostic mode. Executive intelligence is not available for this analysis.'
    : 'This report is under structural review. Full executive intelligence is not available.';

  const advisory_notice =
    'Advisory view: Analysis is incomplete or under review. Consult the grounding summary for details.';

  return {
    diagnostic_banner_text,
    affected_panel_ids: affected,
    advisory_notice,
    error: null,
  };
}

module.exports = { adaptDiagnosticState };
