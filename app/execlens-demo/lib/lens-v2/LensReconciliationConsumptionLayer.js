'use strict';

/**
 * LensReconciliationConsumptionLayer
 * PI.LENS.V2.RECONCILIATION-RUNTIME-CONSUMPTION.01
 * PI.LENS.V2.UNMAPPED-DOMAIN-TRACEABILITY-AND-RECONCILIATION-DRILLDOWN.01
 *
 * Transforms SQO reconciliation and lifecycle artifacts into
 * LENS-consumable runtime intelligence shapes.
 *
 * Pure deterministic consumer — no inference, no enrichment, no mutation.
 * Reads governed SQO outputs and reshapes for executive projection.
 */

const path = require('path');
const { loadJSON } = require('./SemanticArtifactLoader');
const { projectLifecycleForRuntime } = require('../sqo-cockpit/ReconciliationLifecycleProjection');

/**
 * Load and project reconciliation lifecycle for a given client/run.
 * Returns null if lifecycle artifact is unavailable.
 */
function loadReconciliationLifecycle(client, runId) {
  const relPath = path.join('artifacts', 'sqo', client, runId, 'reconciliation_lifecycle.v1.json');
  const result = loadJSON(relPath);
  if (!result || !result.ok) return null;
  return projectLifecycleForRuntime(result.data);
}

/**
 * Build LENS reconciliation awareness from payload + lifecycle.
 *
 * Consumes:
 *   - reconciliation_summary from the live payload (compiled at payload time)
 *   - lifecycle projection from the lifecycle artifact (compiled separately)
 *
 * Returns a unified reconciliation awareness shape for LENS rendering.
 */
function buildReconciliationAwareness(payload, lifecycleProjection) {
  const reconSummary = payload && payload.reconciliation_summary;

  if (!reconSummary || !reconSummary.available) {
    return { available: false, reason: 'NO_RECONCILIATION_SUMMARY' };
  }

  const posture = resolveReconciliationPosture(reconSummary);
  const debtPosture = resolveDebtPosture(reconSummary, lifecycleProjection);
  const qualificationFrame = resolveQualificationFrame(reconSummary, lifecycleProjection);

  return {
    available: true,
    posture,
    debtPosture,
    qualificationFrame,
    lifecycle: lifecycleProjection,
    correspondence: {
      reconciliation_ratio: reconSummary.reconciliation_ratio,
      reconciled_count: reconSummary.reconciled_count,
      unreconciled_count: reconSummary.unreconciled_count,
      total_domains: reconSummary.total_semantic_domains,
      weighted_confidence: reconSummary.weighted_confidence_score,
      confidence_distribution: reconSummary.confidence_distribution,
      unmatched_structural: reconSummary.unmatched_structural_count,
    },
    per_domain: reconSummary.per_domain || [],
  };
}

function resolveReconciliationPosture(summary) {
  const ratio = summary.reconciliation_ratio;
  const weighted = summary.weighted_confidence_score;
  const dist = summary.confidence_distribution || {};
  const l5 = dist.level_5_structurally_grounded || 0;
  const l1 = dist.level_1_unmapped || 0;
  const total = summary.total_semantic_domains || 1;

  let label, tier;
  if (ratio >= 0.75 && weighted >= 80) {
    label = 'STRUCTURALLY GROUNDED';
    tier = 'STRONG';
  } else if (ratio >= 0.50 && weighted >= 60) {
    label = 'PARTIAL STRUCTURAL BACKING';
    tier = 'MODERATE';
  } else if (weighted >= 40) {
    label = 'SEMANTIC COVERAGE WITH GAPS';
    tier = 'WEAK';
  } else {
    label = 'STRUCTURAL BACKING INSUFFICIENT';
    tier = 'INSUFFICIENT';
  }

  return {
    label,
    tier,
    ratio_pct: +(ratio * 100).toFixed(1),
    weighted_confidence: weighted,
    grounded_count: l5,
    unmapped_count: l1,
    total_domains: total,
    coverage_pct: +((1 - l1 / total) * 100).toFixed(1),
  };
}

function resolveDebtPosture(summary, lifecycle) {
  const dist = summary.confidence_distribution || {};
  const l1 = dist.level_1_unmapped || 0;
  const total = summary.total_semantic_domains || 1;

  const result = {
    unresolved_count: l1,
    total_domains: total,
    resolution_pct: +((1 - l1 / total) * 100).toFixed(1),
  };

  if (lifecycle && lifecycle.semanticDebt) {
    result.resolution_rate = lifecycle.semanticDebt.resolution_rate;
    result.unresolved_domain_ids = lifecycle.semanticDebt.unresolved_domain_ids;
  }

  if (lifecycle && lifecycle.unresolvedDomains) {
    result.unresolved_domains = lifecycle.unresolvedDomains;
  }

  return result;
}

function resolveQualificationFrame(summary, lifecycle) {
  const frame = {
    reconciliation_ratio: summary.reconciliation_ratio,
    weighted_confidence: summary.weighted_confidence_score,
  };

  if (lifecycle) {
    frame.trend = lifecycle.trend;
    frame.trajectory = lifecycle.trajectory;
    frame.latest_delta = lifecycle.latestDelta;
    frame.epoch_count = lifecycle.epochSummary ? lifecycle.epochSummary.length : 0;
    frame.provenance = lifecycle.provenance;
  }

  return frame;
}

/**
 * Load enrichment rationale for all domains from the enriched topology model.
 * Returns a map of domain_id → rationale object, or null if unavailable.
 */
function loadDomainEnrichmentRationale(client, runId) {
  const relPath = path.join(
    'clients', client, 'psee', 'runs', runId,
    'semantic', 'topology', 'semantic_topology_model.enriched.json'
  );
  const result = loadJSON(relPath);
  if (!result || !result.ok || !result.data || !result.data.domains) return null;

  const rationaleMap = {};
  for (const domain of result.data.domains) {
    if (!domain.enrichment_status) continue;
    rationaleMap[domain.domain_id] = {
      domain_id: domain.domain_id,
      domain_name: domain.domain_name,
      domain_type: domain.domain_type,
      cluster_id: domain.cluster_id,
      enrichment_status: domain.enrichment_status,
      enrichment_reason: domain.enrichment_reason || null,
      dominant_dom_id: domain.dominant_dom_id || null,
      confidence: domain.confidence || 0,
      lineage_status: domain.lineage_status,
      pre_enrichment: domain.pre_enrichment || null,
    };
  }
  return rationaleMap;
}

/**
 * Build domain traceability entries by merging per-domain correspondence
 * with enrichment rationale. Each entry has the correspondence data plus
 * the WHY — why mapped or why unmapped.
 */
function buildDomainTraceability(perDomain, rationaleMap) {
  if (!perDomain || perDomain.length === 0) return [];

  return perDomain.map(d => {
    const rationale = rationaleMap ? rationaleMap[d.domain_id] : null;
    return {
      domain_id: d.domain_id,
      domain_name: d.domain_name,
      confidence_level: d.confidence_level,
      confidence_label: d.confidence_label,
      reconciliation_status: d.reconciliation_status,
      structural_dom_id: d.structural_dom_id,
      correspondence_basis: d.correspondence_basis,
      enrichment_status: rationale ? rationale.enrichment_status : null,
      enrichment_reason: rationale ? rationale.enrichment_reason : null,
      domain_type: rationale ? rationale.domain_type : null,
      cluster_id: rationale ? rationale.cluster_id : null,
      enrichment_confidence: rationale ? rationale.confidence : null,
      lineage_status: rationale ? rationale.lineage_status : null,
      pre_enrichment: rationale ? rationale.pre_enrichment : null,
    };
  });
}

const UNMAPPED_RESOLUTION_HINTS = {
  'DOMAIN-02': 'A dedicated messaging/queue service (MQTT broker, Kafka, RabbitMQ) visible as a distinct structural component.',
  'DOMAIN-08': 'A dedicated WebSocket server, API gateway service, or streaming microservice visible as a distinct structural component.',
  'DOMAIN-13': 'A dedicated integration module or adapter layer visible as a distinct directory with external service connectors.',
  'DOMAIN-15': 'EV-specific modules, charging API integrations, or battery management code visible in the structural topology.',
};

const UNMAPPED_CLASSIFICATIONS = {
  'DOMAIN-02': 'CONCEPTUAL_INFRASTRUCTURE',
  'DOMAIN-08': 'CONCEPTUAL_INFRASTRUCTURE',
  'DOMAIN-13': 'DISTRIBUTED_CONCERN',
  'DOMAIN-15': 'BUSINESS_VERTICAL',
};

/**
 * Build drilldown data for a specific domain.
 */
function buildDomainDrilldown(domainId, traceabilityEntries) {
  const entry = traceabilityEntries.find(e => e.domain_id === domainId);
  if (!entry) return null;

  return {
    ...entry,
    resolution_hint: UNMAPPED_RESOLUTION_HINTS[domainId] || null,
    unmapped_classification: UNMAPPED_CLASSIFICATIONS[domainId] || null,
    is_unmapped: entry.confidence_level === 1,
    is_enriched: entry.enrichment_status === 'AI_RECONSTRUCTED',
    was_previously_unmapped: entry.pre_enrichment && entry.pre_enrichment.lineage_status === 'NONE',
  };
}

module.exports = {
  loadReconciliationLifecycle,
  buildReconciliationAwareness,
  resolveReconciliationPosture,
  resolveDebtPosture,
  resolveQualificationFrame,
  loadDomainEnrichmentRationale,
  buildDomainTraceability,
  buildDomainDrilldown,
  UNMAPPED_RESOLUTION_HINTS,
  UNMAPPED_CLASSIFICATIONS,
};
