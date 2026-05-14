'use strict';

/**
 * PropagationDensityController.js
 * PI.LENS.NEXTGEN-REPORTS.PROPAGATION-EXPLAINABILITY.01
 *
 * Resolves propagation explainability density layout for a given density class
 * and propagation props. Density manages information hierarchy, not removal.
 *
 * evidence_references_preserved is always true regardless of density class.
 *
 * Pure function. No React. No AI. No external APIs.
 */

const { mapPropagationDensity } = require('./PropagationSemanticMapper');

/**
 * resolvePropagationDensityLayout(densityClass, propagationProps)
 *
 * Parameters:
 *   densityClass      — 'EXECUTIVE_DENSE' | 'EXECUTIVE_BALANCED' | 'INVESTIGATION_DENSE'
 *   propagationProps  — { propagation_summary, propagation_chains[], evidence_links[] }
 *
 * Returns density-resolved layout decisions.
 * evidence_references_preserved is always true.
 */
function resolvePropagationDensityLayout(densityClass, propagationProps) {
  const density = mapPropagationDensity(densityClass);

  const has_propagation_summary = !!(propagationProps && propagationProps.propagation_summary);
  const chain_count = (propagationProps && Array.isArray(propagationProps.propagation_chains))
    ? propagationProps.propagation_chains.length
    : 0;
  const has_propagation_chains = chain_count > 0;
  const has_evidence_links = !!(propagationProps && Array.isArray(propagationProps.evidence_links) && propagationProps.evidence_links.length > 0);

  return {
    density_class: density.density_class,
    show_propagation_summary: density.show_propagation_summary && has_propagation_summary,
    show_propagation_chains: density.show_propagation_chains && has_propagation_chains,
    show_evidence_linkage: density.show_evidence_linkage && has_evidence_links,
    max_visible_chains: density.max_visible_chains,
    chains_collapsed_by_default: density.chains_collapsed_by_default,
    evidence_references_preserved: true,
    has_propagation_summary,
    has_propagation_chains,
    has_evidence_links,
    chain_count,
    error: density.error || null,
  };
}

module.exports = { resolvePropagationDensityLayout };
