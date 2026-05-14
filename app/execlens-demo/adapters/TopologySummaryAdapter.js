'use strict';

/**
 * TopologySummaryAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Phase 2: converts topology_scope into a static read-only placeholder.
 * Phase 3+: full topology display (not implemented in Phase 2).
 *
 * Contract: pure function — no topology mutation, no edge inference, no raw cluster keys.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

/**
 * adaptTopologySummary(reportObject, phase)
 *
 * Phase 2: returns placeholder with display metadata from topology_scope.
 * Phase 3+: (slot reserved; not active in this contract).
 *
 * Returns:
 * {
 *   phase_2_placeholder: boolean,
 *   domain_count: number,
 *   cluster_count: number,
 *   grounding_label: string,
 *   read_only: true,           — always true; topology cannot be edited at LENS layer
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate reportObject. Does not expose raw cluster keys.
 */
function adaptTopologySummary(reportObject, phase) {
  const currentPhase = phase || 2;

  if (!reportObject || typeof reportObject !== 'object') {
    return _topoPlaceholder(0, 0, '', makeAdapterError('ADAPT-TOPO-01', 'reportObject is null'));
  }

  const ts = reportObject.topology_scope;
  if (!ts || typeof ts !== 'object') {
    return _topoPlaceholder(0, 0, '', makeAdapterError('ADAPT-TOPO-01', 'topology_scope absent'));
  }

  const domain_count = typeof ts.domain_count === 'number' ? ts.domain_count : 0;
  const cluster_count = typeof ts.cluster_count === 'number' ? ts.cluster_count : 0;
  const grounding_label = typeof ts.grounding_label === 'string' ? ts.grounding_label : '';

  if (currentPhase === 2) {
    return {
      phase_2_placeholder: true,
      domain_count,
      cluster_count,
      grounding_label,
      read_only: true,
      error: null,
    };
  }

  // Phase 3+ slot — returns placeholder until Phase 3 contract is issued
  return {
    phase_2_placeholder: true,
    domain_count,
    cluster_count,
    grounding_label,
    read_only: true,
    error: makeAdapterError('ADAPT-TOPO-01', 'Phase 3+ topology display not yet implemented'),
  };
}

function _topoPlaceholder(domain_count, cluster_count, grounding_label, error) {
  return {
    phase_2_placeholder: true,
    domain_count,
    cluster_count,
    grounding_label,
    read_only: true,
    error,
  };
}

module.exports = { adaptTopologySummary };
