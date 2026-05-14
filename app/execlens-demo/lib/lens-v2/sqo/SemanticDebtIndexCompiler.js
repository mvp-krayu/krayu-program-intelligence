'use strict';

const path = require('path');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const COMPILER_VERSION = '1.0';

const REDUCIBILITY = {
  IRREDUCIBLE_STRUCTURAL_ABSENCE: 'IRREDUCIBLE_STRUCTURAL_ABSENCE',
  REDUCIBLE_BY_EVIDENCE: 'REDUCIBLE_BY_EVIDENCE',
  REDUCED_BY_ENRICHMENT: 'REDUCED_BY_ENRICHMENT',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

const ORIGIN_TYPE = {
  STRUCTURAL_ABSENCE: 'STRUCTURAL_ABSENCE',
  ENRICHMENT_RESIDUAL: 'ENRICHMENT_RESIDUAL',
  UNRESOLVED_CORRESPONDENCE: 'UNRESOLVED_CORRESPONDENCE',
  CONTINUITY_DEFICIENCY: 'CONTINUITY_DEFICIENCY',
  NONE: 'NONE',
};

const EXPOSURE_LEVEL = {
  NONE: 'NONE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

const DEBT_STATUS = {
  CLEAR: 'CLEAR',
  ACTIVE: 'ACTIVE',
  PARTIALLY_RESOLVED: 'PARTIALLY_RESOLVED',
};

function classifyReducibility(enrichmentStatus, baselineLevel, enrichedLevel, lineageStatus) {
  if (enrichmentStatus === 'UNMAPPED_RETAINED') {
    return REDUCIBILITY.IRREDUCIBLE_STRUCTURAL_ABSENCE;
  }
  if (enrichmentStatus === 'AI_RECONSTRUCTED') {
    return REDUCIBILITY.REDUCED_BY_ENRICHMENT;
  }
  if (enrichedLevel < 5 && (lineageStatus === 'PARTIAL' || lineageStatus === 'WEAK')) {
    return REDUCIBILITY.REDUCIBLE_BY_EVIDENCE;
  }
  if (enrichedLevel >= 5) {
    return REDUCIBILITY.NOT_APPLICABLE;
  }
  return REDUCIBILITY.REDUCIBLE_BY_EVIDENCE;
}

function classifyOriginType(enrichmentStatus, enrichedLevel) {
  if (enrichmentStatus === 'UNMAPPED_RETAINED') {
    return ORIGIN_TYPE.STRUCTURAL_ABSENCE;
  }
  if (enrichmentStatus === 'AI_RECONSTRUCTED') {
    return ORIGIN_TYPE.ENRICHMENT_RESIDUAL;
  }
  if (enrichedLevel >= 5) {
    return ORIGIN_TYPE.NONE;
  }
  return ORIGIN_TYPE.UNRESOLVED_CORRESPONDENCE;
}

function classifyExposure(enrichedLevel, blocksSState) {
  if (enrichedLevel >= 5) return EXPOSURE_LEVEL.NONE;
  if (enrichedLevel >= 3) return EXPOSURE_LEVEL.LOW;
  if (enrichedLevel >= 2) return EXPOSURE_LEVEL.MEDIUM;
  return EXPOSURE_LEVEL.HIGH;
}

function classifyDebtStatus(enrichedLevel, enrichmentStatus) {
  if (enrichedLevel >= 5) return DEBT_STATUS.CLEAR;
  if (enrichmentStatus === 'AI_RECONSTRUCTED') return DEBT_STATUS.PARTIALLY_RESOLVED;
  return DEBT_STATUS.ACTIVE;
}

function computeWeightedDebtScore(domainPostures) {
  const levelWeights = { 5: 0, 4: 1, 3: 2, 2: 3, 1: 5 };
  let totalWeight = 0;
  let maxPossible = 0;
  for (const dp of domainPostures) {
    totalWeight += levelWeights[dp.enriched_confidence_level] || 0;
    maxPossible += 5;
  }
  if (maxPossible === 0) return 0;
  return +((totalWeight / maxPossible) * 100).toFixed(1);
}

function classifyAggregateExposure(severityDist, sStateBlockingCount) {
  if (severityDist.CRITICAL > 0) return 'CRITICAL';
  if (sStateBlockingCount > 0) return 'HIGH';
  if (severityDist.HIGH > 0) return 'MEDIUM';
  return 'LOW';
}

function classifyEnrichmentImpact(baselineDebtCount, enrichedActiveCount) {
  const reduction = baselineDebtCount - enrichedActiveCount;
  if (reduction === 0) return 'NONE';
  const ratio = reduction / baselineDebtCount;
  if (ratio >= 0.5) return 'SIGNIFICANT';
  if (ratio >= 0.25) return 'MODERATE';
  return 'MARGINAL';
}

function buildDomainPosture(domainId, baselineCorr, enrichedCorr, enrichedTopoDomain, debtItems) {
  const bl = baselineCorr || {};
  const en = enrichedCorr || {};
  const topo = enrichedTopoDomain || {};

  const domainName = bl.semantic_domain_name || en.semantic_domain_name || topo.domain_name || domainId;
  const baselineLevel = bl.confidence_level || 0;
  const enrichedLevel = en.confidence_level || baselineLevel;
  const lineageStatus = topo.lineage_status || bl.crosswalk_lineage_status || 'NONE';
  const enrichmentStatus = topo.enrichment_status || null;
  const enrichmentReason = topo.enrichment_reason || null;

  const matchingDebts = debtItems.filter(d => {
    const fp = d.evidence && d.evidence.field_path;
    return fp && fp.includes(`[${domainId}]`);
  });

  const reducibility = matchingDebts.length > 0
    ? classifyReducibility(enrichmentStatus, baselineLevel, enrichedLevel, lineageStatus)
    : REDUCIBILITY.NOT_APPLICABLE;

  const originType = matchingDebts.length > 0
    ? classifyOriginType(enrichmentStatus, enrichedLevel)
    : ORIGIN_TYPE.NONE;

  const exposure = classifyExposure(enrichedLevel, matchingDebts.some(d => d.blocks_s_state && d.blocks_s_state !== 'none'));
  const debtStatus = classifyDebtStatus(enrichedLevel, enrichmentStatus);

  return {
    domain_id: domainId,
    domain_name: domainName,
    domain_type: topo.domain_type || bl.semantic_domain_type || null,
    cluster_id: topo.cluster_id || bl.cluster_id || null,
    debt_status: debtStatus,
    debt_item_ids: matchingDebts.map(d => d.id),
    debt_item_count: matchingDebts.length,
    baseline_confidence_level: baselineLevel,
    enriched_confidence_level: enrichedLevel,
    confidence_delta: enrichedLevel - baselineLevel,
    lineage_status: lineageStatus,
    reconciliation_status: en.reconciliation_status || bl.reconciliation_status || 'UNKNOWN',
    enrichment_status: enrichmentStatus,
    enrichment_reason: enrichmentReason,
    reducibility: reducibility,
    origin_type: originType,
    operational_exposure: exposure,
  };
}

function compileDebtIndex(inputs) {
  const {
    debtInventory,
    baselineCorrespondence,
    enrichedCorrespondence,
    enrichedTopology,
    client,
    runId,
  } = inputs;

  const debtItems = (debtInventory && debtInventory.debt_items) || [];
  const baselineCorrs = (baselineCorrespondence && baselineCorrespondence.correspondences) || [];
  const enrichedCorrs = (enrichedCorrespondence && enrichedCorrespondence.correspondences) || [];
  const topoDomains = (enrichedTopology && enrichedTopology.domains) || [];

  const baselineMap = {};
  for (const c of baselineCorrs) {
    baselineMap[c.semantic_domain_id] = c;
  }

  const enrichedMap = {};
  for (const c of enrichedCorrs) {
    enrichedMap[c.semantic_domain_id] = c;
  }

  const topoMap = {};
  for (const d of topoDomains) {
    topoMap[d.domain_id] = d;
  }

  const allDomainIds = new Set([
    ...Object.keys(baselineMap),
    ...Object.keys(enrichedMap),
    ...topoDomains.map(d => d.domain_id),
  ]);

  const sortedIds = [...allDomainIds].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const nb = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return na - nb;
  });

  const domainPostures = sortedIds.map(id =>
    buildDomainPosture(id, baselineMap[id], enrichedMap[id], topoMap[id], debtItems)
  );

  const continuityDebt = debtItems.filter(d => d.category === 'continuity_gap');

  const sevDist = { CRITICAL: 0, HIGH: 0, MEDIUM_HIGH: 0, MEDIUM: 0 };
  const redDist = {};
  const origDist = {};
  const expDist = {};
  let sStateBlocking = 0;

  for (const item of debtItems) {
    const sev = (item.severity || '').replace('-', '_').toUpperCase();
    if (sevDist[sev] !== undefined) sevDist[sev]++;
    if (item.blocks_s_state && item.blocks_s_state !== 'none') sStateBlocking++;
  }

  for (const dp of domainPostures) {
    if (dp.debt_item_count > 0) {
      redDist[dp.reducibility] = (redDist[dp.reducibility] || 0) + 1;
      origDist[dp.origin_type] = (origDist[dp.origin_type] || 0) + 1;
      expDist[dp.operational_exposure] = (expDist[dp.operational_exposure] || 0) + 1;
    }
  }
  if (continuityDebt.length > 0) {
    origDist[ORIGIN_TYPE.CONTINUITY_DEFICIENCY] = continuityDebt.length;
  }

  const domainsWithDebt = domainPostures.filter(dp => dp.debt_status !== DEBT_STATUS.CLEAR).length;
  const baselineUnmapped = domainPostures.filter(dp => dp.baseline_confidence_level <= 1).length;
  const enrichedUnmapped = domainPostures.filter(dp => dp.enriched_confidence_level <= 1).length;

  const aggregatePosture = {
    total_domains: domainPostures.length,
    total_debt_items: debtItems.length,
    domains_with_debt: domainsWithDebt,
    domains_clear: domainPostures.length - domainsWithDebt,
    severity_distribution: sevDist,
    reducibility_distribution: redDist,
    origin_distribution: origDist,
    exposure_distribution: expDist,
    s_state_blocking_count: sStateBlocking,
    operational_exposure: classifyAggregateExposure(sevDist, sStateBlocking),
    debt_ratio: +(domainsWithDebt / Math.max(domainPostures.length, 1)).toFixed(4),
    weighted_debt_score: computeWeightedDebtScore(domainPostures),
    qualification_impact: sStateBlocking > 0 ? 'BLOCKS_S3' : 'NONE',
  };

  const lifecycle = {
    baseline_unmapped_count: baselineUnmapped,
    enriched_unmapped_count: enrichedUnmapped,
    debt_reduction_by_enrichment: baselineUnmapped - enrichedUnmapped,
    debt_reduction_ratio: baselineUnmapped > 0
      ? +((baselineUnmapped - enrichedUnmapped) / baselineUnmapped).toFixed(4)
      : 0,
    enrichment_impact: classifyEnrichmentImpact(baselineUnmapped, enrichedUnmapped),
    active_debt_domains: domainPostures.filter(dp => dp.debt_status === DEBT_STATUS.ACTIVE).length,
    partially_resolved_domains: domainPostures.filter(dp => dp.debt_status === DEBT_STATUS.PARTIALLY_RESOLVED).length,
    clear_domains: domainPostures.filter(dp => dp.debt_status === DEBT_STATUS.CLEAR).length,
  };

  const classificationFramework = {
    reducibility_definitions: {
      IRREDUCIBLE_STRUCTURAL_ABSENCE: 'No structural component exists for this semantic domain. Enrichment cannot fabricate structural correspondence.',
      REDUCIBLE_BY_EVIDENCE: 'Debt requires new structural evidence from the client to resolve. Current evidence is insufficient.',
      REDUCED_BY_ENRICHMENT: 'Debt was partially addressed by AI-assisted enrichment. Residual gap remains below STRONG/EXACT threshold.',
      NOT_APPLICABLE: 'Domain is fully grounded — no debt classification applies.',
    },
    origin_type_definitions: {
      STRUCTURAL_ABSENCE: 'No structural component corresponds to this semantic domain in the topology.',
      ENRICHMENT_RESIDUAL: 'AI-assisted enrichment improved confidence but did not achieve full structural grounding.',
      UNRESOLVED_CORRESPONDENCE: 'Partial correspondence exists but at insufficient confidence for grounding.',
      CONTINUITY_DEFICIENCY: 'Semantic continuity crosswalk has coverage or label fidelity gaps.',
      NONE: 'No debt origin — domain is fully resolved.',
    },
    exposure_levels: {
      NONE: 'No operational exposure — domain fully grounded.',
      LOW: 'Minor exposure — domain partially mapped with acceptable confidence (L3+).',
      MEDIUM: 'Moderate exposure — domain mapped but confidence below coherence threshold (L2).',
      HIGH: 'Significant exposure — domain unmapped (L1), blocks qualification progression.',
    },
    debt_status_definitions: {
      CLEAR: 'No active debt — domain at L5 with STRONG/EXACT lineage.',
      ACTIVE: 'Debt is present and unresolved — domain below grounding threshold.',
      PARTIALLY_RESOLVED: 'Enrichment reduced debt but residual gap remains.',
    },
  };

  const body = {
    schema_version: SCHEMA_VERSION,
    artifact_type: 'semantic_debt_index',
    client: client,
    run_id: runId,
    generated_at: new Date().toISOString(),
    compiler_version: COMPILER_VERSION,
    aggregate_posture: aggregatePosture,
    domain_postures: domainPostures,
    continuity_debt: continuityDebt.map(d => ({
      id: d.id,
      category: d.category,
      severity: d.severity,
      description: d.description,
      origin_type: ORIGIN_TYPE.CONTINUITY_DEFICIENCY,
    })),
    lifecycle: lifecycle,
    classification_framework: classificationFramework,
    governance: {
      deterministic: true,
      replay_safe: true,
      no_inference: true,
      no_enrichment: true,
      no_authority_promotion: true,
    },
    provenance: {
      source_artifacts: [
        'semantic_debt_inventory.v1.json',
        'reconciliation_correspondence.v1.json',
        'reconciliation_correspondence.enriched.v1.json',
        'semantic_topology_model.enriched.json',
      ],
      source_commit: getSourceCommit(),
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitDebtIndex(artifact, client, runId) {
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', client, runId);
  const outputPath = path.join(outputDir, 'semantic_debt_index.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  COMPILER_VERSION,
  REDUCIBILITY,
  ORIGIN_TYPE,
  EXPOSURE_LEVEL,
  DEBT_STATUS,
  classifyReducibility,
  classifyOriginType,
  classifyExposure,
  classifyDebtStatus,
  computeWeightedDebtScore,
  buildDomainPosture,
  compileDebtIndex,
  emitDebtIndex,
};
