'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');

function readJSON(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  if (relPath.includes('..')) return null;
  try {
    return JSON.parse(fs.readFileSync(full, 'utf-8'));
  } catch (_e) {
    return null;
  }
}

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.85,
  MODERATE: 0.75,
  LOW: 0.65,
};

function resolvePropositionDebt(client, runId) {
  const spineRoot = path.join('clients', client, 'psee', 'runs', runId, 'spine');
  const sqoRoot = path.join('clients', client, 'psee', 'runs', runId, 'sqo');
  const speRoot = path.join('clients', client, 'psee', 'runs', runId, 'semantic', 'spe');

  const spineObjects = readJSON(path.join(spineRoot, 'spine_objects.json'));
  const reviewObligations = readJSON(path.join(sqoRoot, 'review_obligations.json'));
  const speReport = readJSON(path.join(speRoot, 'spe_derivation_report.json'));

  if (!spineObjects || !spineObjects.objects?.semantic_propositions) {
    return null;
  }

  const propositions = spineObjects.objects.semantic_propositions;
  if (propositions.length === 0) return null;

  const obligations = reviewObligations?.obligations || [];
  const debtItems = [];
  let nextId = 1;

  const byClass = {};
  const byCeu = {};
  let totalDerived = 0;
  let totalDirect = 0;
  let novelCount = 0;

  for (const p of propositions) {
    const cls = p.proposition_class || 'UNKNOWN';
    if (!byClass[cls]) byClass[cls] = { count: 0, confidences: [], tiers: {}, ceus: new Set() };
    byClass[cls].count += 1;
    byClass[cls].confidences.push(p.confidence || 0);
    const tier = p.derivation_tier || 'UNKNOWN';
    byClass[cls].tiers[tier] = (byClass[cls].tiers[tier] || 0) + 1;
    for (const ceu of (p.ceu_refs || [])) {
      byClass[cls].ceus.add(ceu);
      byCeu[ceu] = (byCeu[ceu] || 0) + 1;
    }
    if (tier === 'DIRECT_EVIDENCE') totalDirect++;
    else totalDerived++;
    if (p.reconciliation_state === 'NOVEL') novelCount++;
  }

  for (const [cls, info] of Object.entries(byClass)) {
    const meanConf = info.confidences.reduce((a, b) => a + b, 0) / info.confidences.length;
    const minConf = Math.min(...info.confidences);
    const maxConf = Math.max(...info.confidences);
    const derivedCount = info.tiers['DERIVED'] || 0;
    const directCount = info.tiers['DIRECT_EVIDENCE'] || 0;
    const allDerived = derivedCount === info.count && info.count > 0;
    const className = cls.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    if (meanConf < CONFIDENCE_THRESHOLDS.LOW) {
      debtItems.push({
        id: `PD-${String(nextId++).padStart(3, '0')}`,
        category: 'CONFIDENCE_GAP',
        severity: 'HIGH',
        blocks_s_state: 'S2',
        description: `${className}: ${info.count} proposition${info.count !== 1 ? 's' : ''} at ${(meanConf * 100).toFixed(0)}% mean confidence — below operational threshold (65%).`,
        remediation_pathway: 'EVIDENCE_STRENGTHENING',
        remediation_action: 'Strengthen structural evidence anchoring or re-derive with additional source data.',
        evidence: {
          artifact_key: 'spine_objects.semantic_propositions',
          field_path: `by_class.${cls}.mean_confidence`,
          current_value: `${(meanConf * 100).toFixed(1)}%`,
          required_value: `≥${(CONFIDENCE_THRESHOLDS.LOW * 100).toFixed(0)}%`,
        },
      });
    } else if (meanConf < CONFIDENCE_THRESHOLDS.MODERATE) {
      debtItems.push({
        id: `PD-${String(nextId++).padStart(3, '0')}`,
        category: 'CONFIDENCE_GAP',
        severity: 'MEDIUM',
        blocks_s_state: 'S3',
        description: `${className}: ${info.count} proposition${info.count !== 1 ? 's' : ''} at ${(meanConf * 100).toFixed(0)}% mean confidence — below high-confidence threshold (85%).`,
        remediation_pathway: 'EVIDENCE_STRENGTHENING',
        remediation_action: 'Improve structural evidence depth or expand derivation inputs.',
        evidence: {
          artifact_key: 'spine_objects.semantic_propositions',
          field_path: `by_class.${cls}.mean_confidence`,
          current_value: `${(meanConf * 100).toFixed(1)}%`,
          required_value: `≥${(CONFIDENCE_THRESHOLDS.MODERATE * 100).toFixed(0)}%`,
        },
      });
    }

    if (info.count === 1) {
      debtItems.push({
        id: `PD-${String(nextId++).padStart(3, '0')}`,
        category: 'COVERAGE_GAP',
        severity: 'MEDIUM',
        blocks_s_state: 'S2',
        description: `${className}: singleton proposition — insufficient structural coverage for this classification dimension.`,
        remediation_pathway: 'COVERAGE_EXPANSION',
        remediation_action: 'Expand structural analysis to derive additional propositions in this class.',
        evidence: {
          artifact_key: 'spine_objects.semantic_propositions',
          field_path: `by_class.${cls}.count`,
          current_value: '1',
          required_value: '≥3',
        },
      });
    }

    if (allDerived && info.count > 0) {
      debtItems.push({
        id: `PD-${String(nextId++).padStart(3, '0')}`,
        category: 'TIER_IMBALANCE',
        severity: info.count >= 5 ? 'MEDIUM' : 'LOW',
        blocks_s_state: 'S3',
        description: `${className}: ${derivedCount}/${info.count} propositions are DERIVED — no direct structural evidence anchor.`,
        remediation_pathway: 'DIRECT_EVIDENCE_DERIVATION',
        remediation_action: 'Derive direct-evidence propositions from structural topology to anchor this classification.',
        evidence: {
          artifact_key: 'spine_objects.semantic_propositions',
          field_path: `by_class.${cls}.tiers.DIRECT_EVIDENCE`,
          current_value: '0',
          required_value: '≥1',
        },
      });
    }
  }

  const unresolvedObligations = obligations.filter(o => !['RESOLVED', 'REJECTED', 'UNRESOLVABLE'].includes(o.status));
  if (unresolvedObligations.length > 0) {
    const totalObl = obligations.length;
    debtItems.push({
      id: `PD-${String(nextId++).padStart(3, '0')}`,
      category: 'REVIEW_DEBT',
      severity: 'HIGH',
      blocks_s_state: 'S2',
      description: `${unresolvedObligations.length} of ${totalObl} proposition class obligations unresolved — blocks qualification progression.`,
      remediation_pathway: 'OPERATOR_REVIEW',
      remediation_action: 'Complete semantic posture review for all outstanding proposition class obligations.',
      evidence: {
        artifact_key: 'review_obligations.json',
        field_path: 'unresolved',
        current_value: String(unresolvedObligations.length),
        required_value: '0',
      },
    });
  }

  if (novelCount > 0) {
    debtItems.push({
      id: `PD-${String(nextId++).padStart(3, '0')}`,
      category: 'RECONCILIATION_NOVELTY',
      severity: 'LOW',
      blocks_s_state: 'S3',
      description: `${novelCount} proposition${novelCount !== 1 ? 's' : ''} in NOVEL reconciliation state — structural observations not yet aligned with prior evidence.`,
      remediation_pathway: 'RECONCILIATION_ALIGNMENT',
      remediation_action: 'Reconcile novel propositions against existing evidence base during next reconciliation cycle.',
      evidence: {
        artifact_key: 'spine_objects.semantic_propositions',
        field_path: 'reconciliation_state.NOVEL',
        current_value: String(novelCount),
        required_value: '0',
      },
    });
  }

  const bySeverity = {};
  const byCategory = {};
  let blockingCount = 0;
  for (const item of debtItems) {
    if (!bySeverity[item.severity]) bySeverity[item.severity] = [];
    bySeverity[item.severity].push(item);
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
    if (item.blocks_s_state) blockingCount++;
  }

  return {
    available: true,
    derivation_path: 'SPE',
    total_items: debtItems.length,
    blocking_count: blockingCount,
    by_severity: bySeverity,
    by_category: byCategory,
    aggregate: {
      total_propositions: propositions.length,
      total_classes: Object.keys(byClass).length,
      total_ceus: Object.keys(byCeu).length,
      direct_evidence_count: totalDirect,
      derived_count: totalDerived,
      direct_evidence_ratio: totalDirect / propositions.length,
      novel_count: novelCount,
      review_unresolved: unresolvedObligations.length,
      review_total: obligations.length,
    },
  };
}

module.exports = { resolvePropositionDebt };
