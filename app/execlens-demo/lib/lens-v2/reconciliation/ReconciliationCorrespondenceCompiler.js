/**
 * ReconciliationCorrespondenceCompiler
 * PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01
 *
 * Compiles per-domain correspondence between PATH B semantic domains
 * and PATH A structural registries. Assigns graduated confidence levels.
 * Produces a replayable reconciliation artifact.
 *
 * Inputs (all read-only):
 *   - semantic_topology_model.json   (PATH B: 17 semantic domains)
 *   - canonical_topology.json        (PATH A: 13 structural DOM groups)
 *   - semantic_continuity_crosswalk  (bridge: DOM-XX → DOMAIN-XX mapping)
 *   - signal_registry.json           (PATH A: vault-backed signals)
 *   - evidence_trace.json            (PATH A: traceability chains)
 *
 * Output:
 *   - reconciliation_correspondence artifact (replayable JSON)
 */

'use strict';

const CONFIDENCE_LEVELS = {
  STRUCTURALLY_GROUNDED: { level: 5, label: 'Structurally Grounded', q_impact: 'Q-01' },
  OBSERVATIONALLY_CORROBORATED: { level: 4, label: 'Observationally Corroborated', q_impact: 'Q-01/Q-02' },
  SEMANTICALLY_COHERENT: { level: 3, label: 'Semantically Coherent', q_impact: 'Q-02' },
  UPSTREAM_EVIDENCE_BOUND: { level: 2, label: 'Upstream Evidence Bound', q_impact: 'Q-02/Q-03' },
  UNMAPPED: { level: 1, label: 'Unmapped', q_impact: 'Q-03/Q-04' },
};

/**
 * Build an index of structural DOM groups from canonical_topology.
 * Supports two formats:
 *   - vault format: { domains: [{ domain_id, domain_name, component_ids, ... }] }
 *   - 40.4 format:  { clusters: [{ cluster_id, name, node_ids, node_count }] }
 * Returns { domId: { domain_name, component_count, evidence_refs, grounding, ... } }
 */
function buildStructuralIndex(canonicalTopology) {
  const index = {};
  if (!canonicalTopology) return index;

  // Vault format (domains array)
  if (Array.isArray(canonicalTopology.domains)) {
    for (const dom of canonicalTopology.domains) {
      index[dom.domain_id] = {
        domain_id: dom.domain_id,
        domain_name: dom.domain_name,
        domain_type: dom.domain_type || 'STRUCTURAL',
        component_ids: dom.component_ids || [],
        component_count: (dom.component_ids || []).length,
        evidence_refs: dom.evidence_refs || [],
        grounding: dom.grounding || 'UNKNOWN',
        cross_domain: !!dom.cross_domain,
        pressure_note: dom.pressure_note || null,
      };
    }
    return index;
  }

  // 40.4 format (clusters array)
  if (Array.isArray(canonicalTopology.clusters)) {
    for (const cluster of canonicalTopology.clusters) {
      index[cluster.cluster_id] = {
        domain_id: cluster.cluster_id,
        domain_name: cluster.name,
        domain_type: 'STRUCTURAL',
        component_ids: cluster.node_ids || [],
        component_count: cluster.node_count || (cluster.node_ids || []).length,
        evidence_refs: [],
        grounding: 'GROUNDED',
        cross_domain: false,
        pressure_note: null,
      };
    }
    return index;
  }

  return index;
}

/**
 * Build an index of crosswalk entries by DOM-XX id.
 * Returns { domId: crosswalkEntry }
 */
function buildCrosswalkBridge(crosswalkData) {
  const bridge = {};
  if (!crosswalkData || !Array.isArray(crosswalkData.entities)) return bridge;
  for (const entity of crosswalkData.entities) {
    if (entity && entity.current_entity_id) {
      bridge[entity.current_entity_id] = entity;
    }
  }
  return bridge;
}

/**
 * Build an index of signals by primary_domain.
 */
function buildSignalIndex(signalRegistry) {
  const index = {};
  if (!signalRegistry || !Array.isArray(signalRegistry.signals)) return index;
  for (const sig of signalRegistry.signals) {
    const dom = sig.primary_domain;
    if (dom) {
      if (!index[dom]) index[dom] = [];
      index[dom].push({
        signal_id: sig.signal_id,
        signal_label: sig.signal_label,
        activation_state: sig.activation_state,
        signal_value: sig.signal_value,
        zone_id: sig.zone_id,
      });
    }
  }
  return index;
}

/**
 * Build an index of evidence trace chains by vault_artifact + signal_id.
 */
function buildTraceIndex(evidenceTrace) {
  const index = {};
  if (!evidenceTrace || !Array.isArray(evidenceTrace.traceability_chains)) return index;
  for (const chain of evidenceTrace.traceability_chains) {
    const key = chain.signal_id || chain.vault_artifact || 'unknown';
    index[key] = {
      vault_artifact: chain.vault_artifact,
      chain_length: (chain.chain || []).length,
      has_chain: Array.isArray(chain.chain) && chain.chain.length > 0,
    };
  }
  return index;
}

/**
 * Determine the graduated confidence level for a semantic domain based on
 * available structural evidence.
 *
 * Decision logic (deterministic, no AI):
 *   Level 5 — STRUCTURALLY_GROUNDED:
 *     crosswalk EXACT match + vault signal binding + evidence trace chain
 *   Level 4 — OBSERVATIONALLY_CORROBORATED:
 *     crosswalk STRONG match + structural DOM group exists
 *   Level 3 — SEMANTICALLY_COHERENT:
 *     crosswalk PARTIAL match OR multiple semantic sources agree on the domain
 *   Level 2 — UPSTREAM_EVIDENCE_BOUND:
 *     crosswalk WEAK match (fallback used, below threshold)
 *   Level 1 — UNMAPPED:
 *     no crosswalk entry, no structural correspondence
 */
function assessConfidence(semanticDomain, structuralIndex, crosswalkBridge, signalIndex, traceIndex) {
  const domId = semanticDomain.dominant_dom_id;
  const lineageStatus = semanticDomain.lineage_status;
  const domConfidence = semanticDomain.confidence || 0;

  if (!domId || lineageStatus === 'NONE') {
    if (domConfidence === 0) {
      return {
        confidence_level: CONFIDENCE_LEVELS.UNMAPPED,
        structural_dom_id: null,
        correspondence_basis: 'NO_STRUCTURAL_CORRESPONDENCE',
        evidence_factors: [],
      };
    }
  }

  const structuralEntry = domId ? structuralIndex[domId] : null;
  const crosswalkEntry = domId ? crosswalkBridge[domId] : null;
  const signals = domId ? (signalIndex[domId] || []) : [];
  const hasActiveSignals = signals.some(s => s.activation_state === 'HIGH' || s.activation_state === 'ACTIVATED');
  const hasTraceChain = signals.some(s => traceIndex[s.signal_id] && traceIndex[s.signal_id].has_chain);

  const factors = [];

  if (structuralEntry) factors.push('STRUCTURAL_DOM_EXISTS');
  if (crosswalkEntry && crosswalkEntry.match_classification === 'EXACT') factors.push('CROSSWALK_EXACT');
  if (crosswalkEntry && crosswalkEntry.match_classification === 'STRONG') factors.push('CROSSWALK_STRONG');
  if (crosswalkEntry && crosswalkEntry.match_classification === 'PARTIAL') factors.push('CROSSWALK_PARTIAL');
  if (crosswalkEntry && crosswalkEntry.match_classification === 'WEAK') factors.push('CROSSWALK_WEAK');
  if (hasActiveSignals) factors.push('ACTIVE_SIGNAL_BINDING');
  if (hasTraceChain) factors.push('EVIDENCE_TRACE_CHAIN');

  // Level 5: EXACT crosswalk + signal binding + trace chain
  if (lineageStatus === 'EXACT' && structuralEntry && hasActiveSignals && hasTraceChain) {
    return {
      confidence_level: CONFIDENCE_LEVELS.STRUCTURALLY_GROUNDED,
      structural_dom_id: domId,
      correspondence_basis: 'EXACT_CROSSWALK_WITH_SIGNAL_AND_TRACE',
      evidence_factors: factors,
    };
  }

  // Level 5 (alternate): EXACT crosswalk + structural entry (even without active signals)
  if (lineageStatus === 'EXACT' && structuralEntry && domConfidence >= 0.90) {
    return {
      confidence_level: CONFIDENCE_LEVELS.STRUCTURALLY_GROUNDED,
      structural_dom_id: domId,
      correspondence_basis: 'EXACT_CROSSWALK_HIGH_CONFIDENCE',
      evidence_factors: factors,
    };
  }

  // Level 5 (alternate): STRONG crosswalk + active signals + evidence trace
  if (lineageStatus === 'STRONG' && structuralEntry && hasActiveSignals && hasTraceChain) {
    return {
      confidence_level: CONFIDENCE_LEVELS.STRUCTURALLY_GROUNDED,
      structural_dom_id: domId,
      correspondence_basis: 'STRONG_CROSSWALK_WITH_SIGNAL_AND_TRACE',
      evidence_factors: factors,
    };
  }

  // Level 4: STRONG crosswalk + structural entry
  if (lineageStatus === 'STRONG' && structuralEntry) {
    return {
      confidence_level: CONFIDENCE_LEVELS.OBSERVATIONALLY_CORROBORATED,
      structural_dom_id: domId,
      correspondence_basis: 'STRONG_CROSSWALK_WITH_STRUCTURAL_BACKING',
      evidence_factors: factors,
    };
  }

  // Level 4 (alternate): signal binding on this DOM even without STRONG crosswalk
  if (structuralEntry && hasActiveSignals && domConfidence >= 0.65) {
    return {
      confidence_level: CONFIDENCE_LEVELS.OBSERVATIONALLY_CORROBORATED,
      structural_dom_id: domId,
      correspondence_basis: 'SIGNAL_BINDING_WITH_STRUCTURAL_BACKING',
      evidence_factors: factors,
    };
  }

  // Level 3: PARTIAL crosswalk match
  if (lineageStatus === 'PARTIAL' && structuralEntry) {
    return {
      confidence_level: CONFIDENCE_LEVELS.SEMANTICALLY_COHERENT,
      structural_dom_id: domId,
      correspondence_basis: 'PARTIAL_CROSSWALK_ALIGNMENT',
      evidence_factors: factors,
    };
  }

  // Level 3 (alternate): structural entry exists with moderate confidence
  if (structuralEntry && domConfidence >= 0.50) {
    return {
      confidence_level: CONFIDENCE_LEVELS.SEMANTICALLY_COHERENT,
      structural_dom_id: domId,
      correspondence_basis: 'MODERATE_CONFIDENCE_WITH_STRUCTURE',
      evidence_factors: factors,
    };
  }

  // Level 2: WEAK crosswalk (below threshold, fallback used)
  if (crosswalkEntry && crosswalkEntry.fallback_used && structuralEntry) {
    return {
      confidence_level: CONFIDENCE_LEVELS.UPSTREAM_EVIDENCE_BOUND,
      structural_dom_id: domId,
      correspondence_basis: 'WEAK_CROSSWALK_FALLBACK',
      evidence_factors: factors,
    };
  }

  // Level 2 (alternate): has structural DOM but very low confidence
  if (domId && structuralEntry && domConfidence > 0 && domConfidence < 0.50) {
    return {
      confidence_level: CONFIDENCE_LEVELS.UPSTREAM_EVIDENCE_BOUND,
      structural_dom_id: domId,
      correspondence_basis: 'LOW_CONFIDENCE_STRUCTURAL_LINK',
      evidence_factors: factors,
    };
  }

  // Level 1: no correspondence
  return {
    confidence_level: CONFIDENCE_LEVELS.UNMAPPED,
    structural_dom_id: domId || null,
    correspondence_basis: domId ? 'STRUCTURAL_LINK_WITHOUT_EVIDENCE' : 'NO_STRUCTURAL_CORRESPONDENCE',
    evidence_factors: factors,
  };
}

/**
 * Compile the full reconciliation correspondence for a client run.
 *
 * @param {object} opts
 * @param {object} opts.semanticTopologyModel   — PATH B semantic model
 * @param {object} opts.canonicalTopology        — PATH A structural topology
 * @param {object} opts.semanticCrosswalk        — crosswalk v2.0
 * @param {object} opts.signalRegistry           — vault signal registry (optional)
 * @param {object} opts.evidenceTrace            — vault evidence trace (optional)
 * @returns {object} reconciliation correspondence artifact
 */
function compileCorrespondence(opts) {
  const {
    semanticTopologyModel,
    canonicalTopology,
    semanticCrosswalk,
    signalRegistry,
    evidenceTrace,
  } = opts;

  if (!semanticTopologyModel || !Array.isArray(semanticTopologyModel.domains)) {
    return { ok: false, error: 'SEMANTIC_TOPOLOGY_MISSING', correspondences: [] };
  }
  if (!canonicalTopology || (!Array.isArray(canonicalTopology.domains) && !Array.isArray(canonicalTopology.clusters))) {
    return { ok: false, error: 'CANONICAL_TOPOLOGY_MISSING', correspondences: [] };
  }

  const structuralIndex = buildStructuralIndex(canonicalTopology);
  const crosswalkBridge = buildCrosswalkBridge(semanticCrosswalk);
  const signalIndex = buildSignalIndex(signalRegistry);
  const traceIndex = buildTraceIndex(evidenceTrace);

  const correspondences = [];
  const levelCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  for (const domain of semanticTopologyModel.domains) {
    const assessment = assessConfidence(
      domain, structuralIndex, crosswalkBridge, signalIndex, traceIndex
    );

    const crosswalkEntry = domain.dominant_dom_id ? crosswalkBridge[domain.dominant_dom_id] : null;
    const structuralEntry = assessment.structural_dom_id ? structuralIndex[assessment.structural_dom_id] : null;

    const correspondence = {
      semantic_domain_id: domain.domain_id,
      semantic_domain_name: domain.domain_name,
      semantic_domain_type: domain.domain_type,
      cluster_id: domain.cluster_id,
      structural_dom_id: assessment.structural_dom_id,
      structural_domain_name: structuralEntry ? structuralEntry.domain_name : null,
      confidence_level: assessment.confidence_level.level,
      confidence_label: assessment.confidence_level.label,
      confidence_q_impact: assessment.confidence_level.q_impact,
      correspondence_basis: assessment.correspondence_basis,
      evidence_factors: assessment.evidence_factors,
      crosswalk_confidence: crosswalkEntry ? (crosswalkEntry.confidence_score || 0) : 0,
      crosswalk_lineage_status: crosswalkEntry ? (crosswalkEntry.lineage_status || 'NONE') : 'NONE',
      crosswalk_business_label: crosswalkEntry ? (crosswalkEntry.business_label || null) : null,
      structural_component_count: structuralEntry ? structuralEntry.component_count : 0,
      structural_evidence_refs: structuralEntry ? structuralEntry.evidence_refs : [],
      structural_grounding: structuralEntry ? structuralEntry.grounding : null,
      reconciliation_status: assessment.confidence_level.level >= 4 ? 'RECONCILED' : 'UNRECONCILED',
    };

    correspondences.push(correspondence);
    levelCounts[assessment.confidence_level.level]++;
  }

  // Identify unmatched structural domains (structural evidence with no semantic consumer)
  const mappedStructuralDoms = new Set(
    correspondences.filter(c => c.structural_dom_id).map(c => c.structural_dom_id)
  );
  const unmatchedStructural = Object.keys(structuralIndex)
    .filter(domId => !mappedStructuralDoms.has(domId))
    .map(domId => ({
      structural_dom_id: domId,
      structural_domain_name: structuralIndex[domId].domain_name,
      component_count: structuralIndex[domId].component_count,
      evidence_refs: structuralIndex[domId].evidence_refs,
      status: 'NO_SEMANTIC_CONSUMER',
    }));

  const totalDomains = correspondences.length;
  const reconciledCount = correspondences.filter(c => c.reconciliation_status === 'RECONCILED').length;
  const unreconciledCount = totalDomains - reconciledCount;

  return {
    ok: true,
    schema_version: '1.0',
    artifact_type: 'reconciliation_correspondence',
    generated_at: new Date().toISOString(),
    compiler_version: 'PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01',
    source_authority: {
      semantic_topology: semanticTopologyModel.generated_by || 'unknown',
      canonical_topology: canonicalTopology.emission_stream || 'unknown',
      crosswalk_version: semanticCrosswalk ? (semanticCrosswalk.continuity_model_version || 'unknown') : 'absent',
    },
    summary: {
      total_semantic_domains: totalDomains,
      reconciled_count: reconciledCount,
      unreconciled_count: unreconciledCount,
      reconciliation_ratio: totalDomains > 0 ? +(reconciledCount / totalDomains).toFixed(4) : 0,
      confidence_distribution: {
        level_5_structurally_grounded: levelCounts[5],
        level_4_observationally_corroborated: levelCounts[4],
        level_3_semantically_coherent: levelCounts[3],
        level_2_upstream_evidence_bound: levelCounts[2],
        level_1_unmapped: levelCounts[1],
      },
      weighted_confidence_score: totalDomains > 0
        ? +(correspondences.reduce((sum, c) => sum + c.confidence_level, 0) / (totalDomains * 5) * 100).toFixed(1)
        : 0,
      unmatched_structural_count: unmatchedStructural.length,
    },
    correspondences,
    unmatched_structural: unmatchedStructural,
    governance: {
      path_a_read_only: true,
      path_b_read_only: true,
      no_ai_inference: true,
      deterministic: true,
      replay_safe: true,
    },
  };
}

module.exports = {
  CONFIDENCE_LEVELS,
  compileCorrespondence,
  buildStructuralIndex,
  buildCrosswalkBridge,
  buildSignalIndex,
  buildTraceIndex,
  assessConfidence,
};
