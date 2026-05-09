'use strict';

/**
 * BlockedStateAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts validation/governance failure into BlockedState display props.
 * Blocked state is always explicit — never silent, never degraded.
 * No intelligence content is provided as fallback.
 *
 * Contract: pure function — no partial report rendering, no estimation.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

/**
 * adaptBlockedState(validationResult, audienceTier)
 *
 * Returns:
 * {
 *   blocked_headline: string,
 *   blocked_reason: string,
 *   audit_access_available: boolean,
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Never provides fallback intelligence.
 */
function adaptBlockedState(validationResult, audienceTier) {
  const audit_access_available =
    audienceTier === 'ADVISORY' || audienceTier === 'AUDIT';

  // blocked_reason from validation result — never expose GEIOS-internal codes to executive surface
  const raw_reason = (validationResult && validationResult.blockedReason)
    ? validationResult.blockedReason
    : 'Validation did not complete';

  // Map internal blocked reason to executive-visible headline per VIS-BLOCK-01
  const blocked_headline = 'Readiness classification unavailable';

  // For advisory/audit: include the reason reference; for executive: generic message
  const blocked_reason = audit_access_available
    ? `Analysis blocked. Reference: ${_sanitizeReason(raw_reason)}`
    : 'This report could not be rendered. Contact your program intelligence administrator.';

  return {
    blocked_headline,
    blocked_reason,
    audit_access_available,
    error: null,
  };
}

// Strip any GEIOS-internal codes from the reason string for display
function _sanitizeReason(reason) {
  if (typeof reason !== 'string') return 'Unknown reason';
  // Replace GEIOS internal identifiers before surface display
  return reason.replace(/TAXONOMY-01|GEIOS|canonical_topology\.json|governed-dpsig-baseline-v1/g,
    '[internal reference]');
}

module.exports = { adaptBlockedState };
