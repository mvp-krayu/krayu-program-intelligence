'use strict';

/**
 * EvidencePanelAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts evidence_blocks[] into EvidencePanel display props.
 * Orders domains by propagation_role: ORIGIN → RECEIVER → PASS_THROUGH → ISOLATED.
 * Delegates each block to EvidenceDrawerAdapter.
 *
 * Contract: pure function — no mutation, no evidence generation, no filtering by pressure.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');
const { adaptEvidenceDrawer } = require('./EvidenceDrawerAdapter');

const PROPAGATION_ORDER = { ORIGIN: 0, RECEIVER: 1, PASS_THROUGH: 2, ISOLATED: 3 };

/**
 * adaptEvidencePanel(reportObject, audienceTier)
 *
 * Converts all evidence_blocks into EvidencePanelDisplay.
 * Domain ordering: ORIGIN → RECEIVER → PASS_THROUGH → ISOLATED.
 * Total domain count and grounding summary derived from adapted drawers.
 *
 * Returns:
 * {
 *   domains: EvidenceDrawerDisplay[],
 *   domain_count: number,
 *   grounding_summary: string,       — display string, not computed percentage
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function adaptEvidencePanel(reportObject, audienceTier) {
  if (!reportObject || !Array.isArray(reportObject.evidence_blocks) ||
      reportObject.evidence_blocks.length === 0) {
    return {
      domains: [],
      domain_count: 0,
      grounding_summary: '',
      error: makeAdapterError('ADAPT-EVID-01', 'evidence_blocks absent or empty'),
    };
  }

  // Order by propagation_role (stable sort — order of equal roles preserved)
  const sorted = reportObject.evidence_blocks.slice().sort((a, b) => {
    const aOrder = PROPAGATION_ORDER[a.propagation_role] !== undefined
      ? PROPAGATION_ORDER[a.propagation_role] : 99;
    const bOrder = PROPAGATION_ORDER[b.propagation_role] !== undefined
      ? PROPAGATION_ORDER[b.propagation_role] : 99;
    return aOrder - bOrder;
  });

  const domains = sorted.map((block, i) => adaptEvidenceDrawer(block, audienceTier, i));
  const domain_count = domains.length;

  // Grounding summary: sourced from topology_scope.grounding_label (already normalized)
  // Never computed as a percentage here.
  const grounding_summary =
    (reportObject.topology_scope && typeof reportObject.topology_scope.grounding_label === 'string')
      ? reportObject.topology_scope.grounding_label
      : `${domain_count} domain${domain_count !== 1 ? 's' : ''} analyzed`;

  return { domains, domain_count, grounding_summary, error: null };
}

module.exports = { adaptEvidencePanel, PROPAGATION_ORDER };
