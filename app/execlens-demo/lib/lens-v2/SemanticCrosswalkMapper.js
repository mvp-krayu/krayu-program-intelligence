/**
 * SemanticCrosswalkMapper
 * PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 *
 * Translate DOM-XX technical labels to business labels using
 * semantic_continuity_crosswalk.json v2.0.
 *
 * Preserves original DOM ids as audit references. Prevents raw technical
 * labels from dominating the executive surface. Exposes unmapped domains
 * explicitly.
 *
 * Governance: pure data translation. No fabrication. No client-name branching.
 */

'use strict';

/**
 * Build a map from DOM-XX to crosswalk entry.
 */
function buildCrosswalkIndex(crosswalkData) {
  const index = {};
  if (!crosswalkData || !Array.isArray(crosswalkData.entities)) {
    return index;
  }
  for (const entity of crosswalkData.entities) {
    if (entity && entity.current_entity_id) {
      index[entity.current_entity_id] = entity;
    }
  }
  return index;
}

/**
 * Resolve a display label for a DOM-XX technical id.
 * Strategy:
 *   1) Use crosswalk business_label if present (and confidence >= threshold)
 *   2) Otherwise expose the DOM technical label as fallback
 *   3) Always preserve dom_id and confidence for audit
 */
function resolveDisplayLabel(domId, crosswalkIndex, opts = {}) {
  const minConfidence = typeof opts.minConfidence === 'number' ? opts.minConfidence : 0.0;
  const entry = crosswalkIndex[domId];
  if (!entry) {
    return {
      dom_id: domId,
      business_label: null,
      technical_label: null,
      confidence: 0.0,
      lineage_status: 'UNMAPPED',
      mapped: false,
      display_label: domId,
    };
  }
  const hasBusinessLabel =
    !!entry.business_label && (entry.confidence_score || 0) >= minConfidence;
  return {
    dom_id: domId,
    business_label: entry.business_label || null,
    technical_label: entry.technical_label || null,
    confidence: entry.confidence_score || 0.0,
    lineage_status: entry.lineage_status || 'UNKNOWN',
    mapped: !!hasBusinessLabel,
    display_label: hasBusinessLabel
      ? entry.business_label
      : (entry.technical_label || domId),
    capability_group: entry.capability_group || null,
    semantic_source_id: entry.semantic_source_id || null,
    fallback_used: !!entry.fallback_used,
    fallback_reason: entry.fallback_reason || null,
  };
}

/**
 * Build the per-DOM display map for the entire run.
 * Returns { byDomId, unmapped: [...] }.
 */
function buildDisplayMap(crosswalkData, allDomIds = []) {
  const index = buildCrosswalkIndex(crosswalkData);
  const byDomId = {};
  const unmapped = [];
  for (const domId of allDomIds) {
    const resolved = resolveDisplayLabel(domId, index);
    byDomId[domId] = resolved;
    if (!resolved.mapped) {
      unmapped.push(domId);
    }
  }
  return { byDomId, unmapped };
}

/**
 * Resolve a domain's display label given the canonical_topology clusters list.
 */
function resolveCanonicalCluster(cluster, crosswalkIndex) {
  if (!cluster || !cluster.cluster_id) {
    return { dom_id: null, business_label: null, technical_label: null, mapped: false };
  }
  const display = resolveDisplayLabel(cluster.cluster_id, crosswalkIndex);
  return {
    ...display,
    technical_label: display.technical_label || cluster.name || null,
    node_count: cluster.node_count || 0,
  };
}

module.exports = {
  buildCrosswalkIndex,
  resolveDisplayLabel,
  buildDisplayMap,
  resolveCanonicalCluster,
};
