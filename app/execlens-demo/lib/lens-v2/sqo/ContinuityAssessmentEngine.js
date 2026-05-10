'use strict';

const fs = require('fs');
const path = require('path');
const { loadJSON } = require('../SemanticArtifactLoader');
const { loadManifest, isClientRunAllowed } = require('../manifests');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const OPERATION_VERSION = '1.0';

function getTopologyNodeCount(canonicalTopologyData) {
  if (!canonicalTopologyData) return 0;
  if (canonicalTopologyData.counts && typeof canonicalTopologyData.counts.total_nodes === 'number') {
    return canonicalTopologyData.counts.total_nodes;
  }
  if (canonicalTopologyData.clusters) {
    let total = 0;
    for (const cluster of canonicalTopologyData.clusters) {
      if (cluster.node_ids) total += cluster.node_ids.length;
      else if (typeof cluster.node_count === 'number') total += cluster.node_count;
    }
    return total;
  }
  return 0;
}

function computeCoverageMetrics(loadedArtifacts) {
  const crosswalk = loadedArtifacts.semantic_continuity_crosswalk;
  const ct = loadedArtifacts.canonical_topology_40_4;
  const stm = loadedArtifacts.semantic_topology_model;

  if (!crosswalk || !crosswalk.ok || !crosswalk.data) {
    return {
      crosswalk_present: false,
      coverage_ratio: 0,
      label_fidelity_ratio: 0,
      lineage_strength: 0,
      entity_count: 0,
      topology_node_count: ct && ct.ok ? getTopologyNodeCount(ct.data) : 0,
      domain_count: stm && stm.ok ? (stm.data.domains || []).length : 0,
      entities_with_business_label: 0,
      entities_without_business_label: 0,
      domains_grounded: 0,
      domains_ungrounded: 0,
      overall_status: 'NO_ASSESSMENT',
    };
  }

  const entities = crosswalk.data.entities || [];
  const entityCount = entities.length;
  const topologyNodeCount = ct && ct.ok ? getTopologyNodeCount(ct.data) : 0;
  const domains = stm && stm.ok ? (stm.data.domains || []) : [];

  const withBizLabel = entities.filter(e => e.business_label != null && e.business_label !== '');
  const withoutBizLabel = entities.filter(e => e.business_label == null || e.business_label === '');

  const grounded = domains.filter(d => d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG');

  const coverageRatio = topologyNodeCount > 0
    ? Math.round((entityCount / topologyNodeCount) * 1000) / 1000
    : 0;
  const labelFidelityRatio = entityCount > 0
    ? Math.round((withBizLabel.length / entityCount) * 1000) / 1000
    : 0;
  const lineageStrength = domains.length > 0
    ? Math.round((grounded.length / domains.length) * 1000) / 1000
    : 0;

  let overallStatus = 'FULL';
  if (coverageRatio < 1.0 || labelFidelityRatio < 1.0) overallStatus = 'PARTIAL';
  if (coverageRatio === 0) overallStatus = 'NO_ASSESSMENT';

  return {
    crosswalk_present: true,
    coverage_ratio: coverageRatio,
    label_fidelity_ratio: labelFidelityRatio,
    lineage_strength: lineageStrength,
    entity_count: entityCount,
    topology_node_count: topologyNodeCount,
    domain_count: domains.length,
    entities_with_business_label: withBizLabel.length,
    entities_without_business_label: withoutBizLabel.length,
    domains_grounded: grounded.length,
    domains_ungrounded: domains.length - grounded.length,
    overall_status: overallStatus,
  };
}

function identifyContinuityGaps(loadedArtifacts) {
  const crosswalk = loadedArtifacts.semantic_continuity_crosswalk;

  if (!crosswalk || !crosswalk.ok || !crosswalk.data) {
    return [{
      gap_type: 'crosswalk_absent',
      description: 'Semantic continuity crosswalk absent — no continuity assessment possible',
      structural_reference: 'canonical_topology_40_4',
      semantic_reference: 'semantic_continuity_crosswalk',
      severity: 'CRITICAL',
      remediation_pathway: 'R2',
    }];
  }

  const metrics = computeCoverageMetrics(loadedArtifacts);
  const gaps = [];

  if (metrics.entity_count < metrics.topology_node_count) {
    gaps.push({
      gap_type: 'entity_coverage',
      description: `${metrics.topology_node_count - metrics.entity_count} structural topology nodes without semantic crosswalk mapping (${metrics.entity_count}/${metrics.topology_node_count} covered)`,
      structural_reference: 'canonical_topology_40_4',
      semantic_reference: 'semantic_continuity_crosswalk.entities',
      severity: 'MEDIUM',
      remediation_pathway: 'R1',
    });
  }

  if (metrics.entities_without_business_label > 0) {
    gaps.push({
      gap_type: 'label_fidelity',
      description: `${metrics.entities_without_business_label} crosswalk entities without business labels (label fidelity ${Math.round(metrics.label_fidelity_ratio * 100)}%)`,
      structural_reference: 'semantic_continuity_crosswalk.entities',
      semantic_reference: 'entities[].business_label',
      severity: 'MEDIUM',
      remediation_pathway: 'R1',
    });
  }

  if (metrics.lineage_strength < 1.0 && metrics.domain_count > 0) {
    gaps.push({
      gap_type: 'lineage',
      description: `${metrics.domains_ungrounded} domains without structural grounding (lineage strength ${Math.round(metrics.lineage_strength * 100)}%)`,
      structural_reference: 'semantic_topology_model.domains',
      semantic_reference: 'domains[].lineage_status',
      severity: 'HIGH',
      remediation_pathway: 'R4',
    });
  }

  return gaps;
}

function buildContinuityAssessment(client, runId, loadedArtifacts) {
  const metrics = computeCoverageMetrics(loadedArtifacts);
  const gaps = identifyContinuityGaps(loadedArtifacts);

  const body = {
    schema_version: SCHEMA_VERSION,
    client,
    run_id: runId,
    timestamp: new Date().toISOString(),
    overall_status: metrics.overall_status,
    coverage_ratio: metrics.coverage_ratio,
    label_fidelity_ratio: metrics.label_fidelity_ratio,
    lineage_strength: metrics.lineage_strength,
    metrics: {
      entity_count: metrics.entity_count,
      topology_node_count: metrics.topology_node_count,
      domain_count: metrics.domain_count,
      entities_with_business_label: metrics.entities_with_business_label,
      entities_without_business_label: metrics.entities_without_business_label,
      domains_grounded: metrics.domains_grounded,
      domains_ungrounded: metrics.domains_ungrounded,
    },
    gaps,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      no_source_mutation: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'assess_continuity',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitContinuityAssessment(client, runId, loadedArtifacts) {
  const artifact = buildContinuityAssessment(client, runId, loadedArtifacts);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', client, runId);
  const outputPath = path.join(outputDir, 'continuity_assessment.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

function loadArtifactsForInspection(manifest) {
  const required = (manifest.artifacts && manifest.artifacts.required) || {};
  const optional = (manifest.artifacts && manifest.artifacts.optional) || {};
  const loaded = {};
  for (const [key, p] of Object.entries(required)) {
    loaded[key] = loadJSON(p);
  }
  for (const [key, p] of Object.entries(optional)) {
    loaded[key] = loadJSON(p);
  }
  return loaded;
}

module.exports = {
  SCHEMA_VERSION,
  getTopologyNodeCount,
  computeCoverageMetrics,
  identifyContinuityGaps,
  buildContinuityAssessment,
  emitContinuityAssessment,
  loadArtifactsForInspection,
};
