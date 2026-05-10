'use strict';

const path = require('path');
const { loadManifest, isClientRunAllowed } = require('../manifests');
const { runFullDetection } = require('./QualificationStateEngine');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');
const { prioritizeDebtItems } = require('./DebtPriorityEngine');
const { enrichDebtItemWithRemediation } = require('./RemediationPathResolver');
const { computeCoverageMetrics, loadArtifactsForInspection } = require('./ContinuityAssessmentEngine');
const { REQUIRED_ARTIFACT_KEYS } = require('../generic/ClientRunManifestSchema');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const OPERATION_VERSION = '1.0';

const DEBT_CATEGORIES = {
  MISSING_ARTIFACT: 'missing_artifact',
  GROUNDING_GAP: 'grounding_gap',
  CONTINUITY_GAP: 'continuity_gap',
  LABEL: 'label',
  VALIDATION: 'validation',
  REPRODUCIBILITY: 'reproducibility',
  RENDERING_METADATA: 'rendering_metadata',
};

const STRUCTURAL_ID_PATTERN = /^(CLU|DOM|DOMAIN)-\d+$/i;

function detectMissingArtifactDebt(loadedArtifacts) {
  const items = [];
  let seq = 0;
  for (const key of REQUIRED_ARTIFACT_KEYS) {
    const artifact = loadedArtifacts[key];
    if (!artifact || !artifact.ok) {
      seq++;
      items.push({
        id: `DEBT-MISSING_ARTIFACT-${String(seq).padStart(2, '0')}`,
        category: DEBT_CATEGORIES.MISSING_ARTIFACT,
        severity: 'CRITICAL',
        description: `Required artifact '${key}' is not present on disk`,
        evidence: {
          artifact_key: key,
          field_path: `artifacts.required.${key}`,
          current_value: 'ABSENT',
          required_value: 'PRESENT',
        },
        blocks_s_state: 'S2',
        has_upstream_dependency: false,
      });
    }
  }
  return items;
}

function detectGroundingGapDebt(loadedArtifacts) {
  const stm = loadedArtifacts.semantic_topology_model;
  if (!stm || !stm.ok || !stm.data) return [];

  const domains = stm.data.domains || [];
  const items = [];
  let seq = 0;

  for (const domain of domains) {
    const status = domain.lineage_status;
    if (status !== 'EXACT' && status !== 'STRONG') {
      seq++;
      const name = domain.domain_name || domain.domain_label || domain.domain_id;
      items.push({
        id: `DEBT-GROUNDING_GAP-${String(seq).padStart(2, '0')}`,
        category: DEBT_CATEGORIES.GROUNDING_GAP,
        severity: 'HIGH',
        description: `Domain '${name}' has lineage_status '${status}' (requires EXACT or STRONG)`,
        evidence: {
          artifact_key: 'semantic_topology_model',
          field_path: `domains[${domain.domain_id}].lineage_status`,
          current_value: status,
          required_value: 'EXACT or STRONG',
        },
        blocks_s_state: 'S3',
        has_upstream_dependency: false,
      });
    }
  }

  return items;
}

function detectContinuityGapDebt(loadedArtifacts) {
  const crosswalk = loadedArtifacts.semantic_continuity_crosswalk;

  if (!crosswalk || !crosswalk.ok || !crosswalk.data) {
    return [{
      id: 'DEBT-CONTINUITY_GAP-01',
      category: DEBT_CATEGORIES.CONTINUITY_GAP,
      severity: 'MEDIUM',
      description: 'Semantic continuity crosswalk absent — no continuity assessment possible',
      evidence: {
        artifact_key: 'semantic_continuity_crosswalk',
        field_path: 'semantic_continuity_crosswalk',
        current_value: 'ABSENT',
        required_value: 'PRESENT',
      },
      blocks_s_state: 'none',
      has_upstream_dependency: true,
    }];
  }

  const metrics = computeCoverageMetrics(loadedArtifacts);
  const items = [];
  let seq = 0;

  if (metrics.entity_count < metrics.topology_node_count) {
    seq++;
    const unmapped = metrics.topology_node_count - metrics.entity_count;
    items.push({
      id: `DEBT-CONTINUITY_GAP-${String(seq).padStart(2, '0')}`,
      category: DEBT_CATEGORIES.CONTINUITY_GAP,
      severity: 'MEDIUM',
      description: `${unmapped} structural topology nodes without semantic crosswalk mapping (${metrics.entity_count}/${metrics.topology_node_count} covered)`,
      evidence: {
        artifact_key: 'semantic_continuity_crosswalk',
        field_path: 'entities.length',
        current_value: String(metrics.entity_count),
        required_value: String(metrics.topology_node_count),
      },
      blocks_s_state: 'none',
      has_upstream_dependency: false,
    });
  }

  if (metrics.entities_without_business_label > 0) {
    seq++;
    items.push({
      id: `DEBT-CONTINUITY_GAP-${String(seq).padStart(2, '0')}`,
      category: DEBT_CATEGORIES.CONTINUITY_GAP,
      severity: 'MEDIUM',
      description: `${metrics.entities_without_business_label} crosswalk entities without business labels (label fidelity ${Math.round(metrics.label_fidelity_ratio * 100)}%)`,
      evidence: {
        artifact_key: 'semantic_continuity_crosswalk',
        field_path: 'entities[].business_label',
        current_value: `${metrics.entities_without_business_label} null`,
        required_value: 'all entities with business labels',
      },
      blocks_s_state: 'none',
      has_upstream_dependency: false,
    });
  }

  return items;
}

function detectLabelDebt(loadedArtifacts) {
  const stm = loadedArtifacts.semantic_topology_model;
  if (!stm || !stm.ok || !stm.data) return [];

  const semanticLevel = stm.data.semantic_level;
  const domains = stm.data.domains || [];
  const items = [];
  let seq = 0;

  for (const domain of domains) {
    const name = domain.domain_name || domain.domain_label || domain.domain_id;
    const isStructuralId = STRUCTURAL_ID_PATTERN.test(name);
    const hasInferenceProhibition = domain.inference_prohibition === true;

    if (isStructuralId && (semanticLevel === 'STRUCTURAL_LABELS_ONLY' || hasInferenceProhibition)) {
      seq++;
      items.push({
        id: `DEBT-LABEL-${String(seq).padStart(2, '0')}`,
        category: DEBT_CATEGORIES.LABEL,
        severity: 'MEDIUM',
        description: `Domain '${name}' carries structural identifier instead of business-meaningful label`,
        evidence: {
          artifact_key: 'semantic_topology_model',
          field_path: `domains[${domain.domain_id}].domain_name`,
          current_value: name,
          required_value: 'business-meaningful label',
        },
        blocks_s_state: 'none',
        has_upstream_dependency: false,
      });
    }
  }

  return items;
}

function detectValidationDebt(loadedArtifacts) {
  const dv = loadedArtifacts.decision_validation;

  if (!dv || !dv.ok || !dv.data) {
    return [{
      id: 'DEBT-VALIDATION-01',
      category: DEBT_CATEGORIES.VALIDATION,
      severity: 'HIGH',
      description: 'Decision validation artifact absent — no quality assurance on semantic derivation',
      evidence: {
        artifact_key: 'decision_validation',
        field_path: 'decision_validation',
        current_value: 'ABSENT',
        required_value: 'PRESENT with ALL_PASS',
      },
      blocks_s_state: 'none',
      has_upstream_dependency: false,
    }];
  }

  const checks = dv.data.checks || [];
  const failed = checks.filter(c => c.result !== 'PASS');
  if (failed.length === 0) return [];

  return failed.map((check, i) => ({
    id: `DEBT-VALIDATION-${String(i + 1).padStart(2, '0')}`,
    category: DEBT_CATEGORIES.VALIDATION,
    severity: 'HIGH',
    description: `Decision validation check '${check.id || check.name}' result: ${check.result}`,
    evidence: {
      artifact_key: 'decision_validation',
      field_path: `checks[${check.id}].result`,
      current_value: check.result,
      required_value: 'PASS',
    },
    blocks_s_state: 'none',
    has_upstream_dependency: false,
  }));
}

function detectReproducibilityDebt(loadedArtifacts) {
  const rv = loadedArtifacts.reproducibility_verdict;

  if (!rv || !rv.ok || !rv.data) {
    return [{
      id: 'DEBT-REPRODUCIBILITY-01',
      category: DEBT_CATEGORIES.REPRODUCIBILITY,
      severity: 'MEDIUM-HIGH',
      description: 'Reproducibility verdict artifact absent — cannot certify semantic derivation is fully reproducible',
      evidence: {
        artifact_key: 'reproducibility_verdict',
        field_path: 'reproducibility_verdict',
        current_value: 'ABSENT',
        required_value: 'PRESENT with FULL_REPRODUCIBILITY',
      },
      blocks_s_state: 'none',
      has_upstream_dependency: false,
    }];
  }

  const verdict = rv.data.verdict;
  if (verdict === 'FULL_REPRODUCIBILITY') return [];

  return [{
    id: 'DEBT-REPRODUCIBILITY-01',
    category: DEBT_CATEGORIES.REPRODUCIBILITY,
    severity: 'MEDIUM-HIGH',
    description: `Reproducibility verdict is '${verdict}', not FULL_REPRODUCIBILITY`,
    evidence: {
      artifact_key: 'reproducibility_verdict',
      field_path: 'verdict',
      current_value: verdict,
      required_value: 'FULL_REPRODUCIBILITY',
    },
    blocks_s_state: 'none',
    has_upstream_dependency: false,
  }];
}

function detectRenderingMetadataDebt(loadedArtifacts) {
  const rm = loadedArtifacts.rendering_metadata;

  if (!rm || !rm.ok || !rm.data) {
    const dv = loadedArtifacts.decision_validation;
    const hasUpstream = !dv || !dv.ok;
    return [{
      id: 'DEBT-RENDERING_METADATA-01',
      category: DEBT_CATEGORIES.RENDERING_METADATA,
      severity: 'MEDIUM',
      description: 'Rendering metadata artifact absent — IP status degraded, no integrity assurance',
      evidence: {
        artifact_key: 'rendering_metadata',
        field_path: 'rendering_metadata',
        current_value: 'ABSENT',
        required_value: 'PRESENT with integrity hash',
      },
      blocks_s_state: 'none',
      has_upstream_dependency: hasUpstream,
    }];
  }

  const hash = rm.data.rendering_metadata_hash;
  if (!hash) {
    return [{
      id: 'DEBT-RENDERING_METADATA-01',
      category: DEBT_CATEGORIES.RENDERING_METADATA,
      severity: 'MEDIUM',
      description: 'Rendering metadata present but missing integrity hash',
      evidence: {
        artifact_key: 'rendering_metadata',
        field_path: 'rendering_metadata_hash',
        current_value: 'null',
        required_value: 'sha256 hash',
      },
      blocks_s_state: 'none',
      has_upstream_dependency: false,
    }];
  }

  return [];
}

function computeDebtSummary(debtItems) {
  const summary = {
    critical_count: 0,
    high_count: 0,
    medium_high_count: 0,
    medium_count: 0,
    s_state_blocking_count: 0,
  };
  for (const item of debtItems) {
    if (item.severity === 'CRITICAL') summary.critical_count++;
    else if (item.severity === 'HIGH') summary.high_count++;
    else if (item.severity === 'MEDIUM-HIGH') summary.medium_high_count++;
    else if (item.severity === 'MEDIUM') summary.medium_count++;
    if (item.blocks_s_state && item.blocks_s_state !== 'none') summary.s_state_blocking_count++;
  }
  return summary;
}

function collectDebtInputHashes(loadedArtifacts) {
  const hashes = {};
  for (const [key, result] of Object.entries(loadedArtifacts)) {
    hashes[key] = result.ok ? 'present' : 'absent';
  }
  return hashes;
}

function runFullDebtDetection(client, runId) {
  if (!isClientRunAllowed(client, runId)) {
    return {
      ok: false,
      error: 'CLIENT_RUN_NOT_REGISTERED',
      client,
      run_id: runId,
    };
  }

  const detection = runFullDetection(client, runId);
  if (!detection.ok) {
    return {
      ok: false,
      error: detection.error,
      client,
      run_id: runId,
    };
  }

  const manifestResult = loadManifest(client, runId);
  if (!manifestResult.ok) {
    return {
      ok: false,
      error: 'MANIFEST_LOAD_FAILED',
      client,
      run_id: runId,
    };
  }

  const loadedArtifacts = loadArtifactsForInspection(manifestResult.manifest);

  const rawItems = [
    ...detectMissingArtifactDebt(loadedArtifacts),
    ...detectGroundingGapDebt(loadedArtifacts),
    ...detectContinuityGapDebt(loadedArtifacts),
    ...detectLabelDebt(loadedArtifacts),
    ...detectValidationDebt(loadedArtifacts),
    ...detectReproducibilityDebt(loadedArtifacts),
    ...detectRenderingMetadataDebt(loadedArtifacts),
  ];

  const enriched = rawItems.map(enrichDebtItemWithRemediation);
  const prioritized = prioritizeDebtItems(enriched);

  return {
    ok: true,
    client,
    run_id: runId,
    s_state: detection.qualification.s_state,
    debt_items: prioritized,
    total_debt_items: prioritized.length,
    summary: computeDebtSummary(prioritized),
    input_hashes: collectDebtInputHashes(loadedArtifacts),
  };
}

function buildDebtInventoryArtifact(debtResult) {
  const body = {
    schema_version: SCHEMA_VERSION,
    client: debtResult.client,
    run_id: debtResult.run_id,
    timestamp: new Date().toISOString(),
    s_state: debtResult.s_state,
    total_debt_items: debtResult.total_debt_items,
    debt_items: debtResult.debt_items,
    summary: debtResult.summary,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      no_source_mutation: true,
      sqo_advisory_only: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      input_hashes: debtResult.input_hashes || {},
      operation: 'detect_semantic_debt',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitDebtInventory(debtResult) {
  const artifact = buildDebtInventoryArtifact(debtResult);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', debtResult.client, debtResult.run_id);
  const outputPath = path.join(outputDir, 'semantic_debt_inventory.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  OPERATION_VERSION,
  DEBT_CATEGORIES,
  STRUCTURAL_ID_PATTERN,
  detectMissingArtifactDebt,
  detectGroundingGapDebt,
  detectContinuityGapDebt,
  detectLabelDebt,
  detectValidationDebt,
  detectReproducibilityDebt,
  detectRenderingMetadataDebt,
  computeDebtSummary,
  collectDebtInputHashes,
  runFullDebtDetection,
  buildDebtInventoryArtifact,
  emitDebtInventory,
};
