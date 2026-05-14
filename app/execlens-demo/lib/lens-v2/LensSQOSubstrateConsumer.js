'use strict';

const path = require('path');
const { loadJSON } = require('./SemanticArtifactLoader');
const { projectQualificationForRuntime } = require('../sqo-cockpit/RuntimeQualificationProjection');
const { projectSemanticOperationsForRuntime } = require('../sqo-cockpit/SemanticOperationsProjection');

function loadQualificationProjection(client, runId) {
  const relPath = path.join('artifacts', 'sqo', client, runId, 'runtime_qualification_projection.v1.json');
  const result = loadJSON(relPath);
  if (!result || !result.ok) return null;
  return projectQualificationForRuntime(result.data);
}

function loadSemanticOperationsSubstrate(client, runId) {
  const relPath = path.join('artifacts', 'sqo', client, runId, 'runtime_semantic_operations_substrate.v1.json');
  const result = loadJSON(relPath);
  if (!result || !result.ok) return null;
  return projectSemanticOperationsForRuntime(result.data);
}

const TRUST_POSTURE_TIERS = {
  AUTHORITY: { level: 8, label: 'AUTHORITY', color: '#64ffda' },
  CERTIFIED: { level: 7, label: 'CERTIFIED', color: '#64ffda' },
  EXACT: { level: 6, label: 'EXACT', color: '#64ffda' },
  STRONG: { level: 5, label: 'STRONG', color: '#4a9eff' },
  PARTIAL: { level: 4, label: 'PARTIAL', color: '#ffd700' },
  RECONCILED: { level: 3, label: 'RECONCILED', color: '#ffd700' },
  HYDRATED: { level: 2, label: 'HYDRATED', color: '#ff9e4a' },
  NONE: { level: 1, label: 'NONE', color: '#ff6b6b' },
};

function resolveTrustPosture(qualProjection) {
  if (!qualProjection || !qualProjection.qualification) return null;

  const q = qualProjection.qualification;
  const sState = q.s_state;
  const qClass = q.q_class;
  const maturityScore = q.maturity_score;
  const groundingRatio = q.grounding_ratio;

  let trustLevel;
  if (sState === 'S3') {
    trustLevel = groundingRatio >= 1.0 ? 'AUTHORITY' : 'STRONG';
  } else if (sState === 'S2') {
    if (groundingRatio >= 0.75) trustLevel = 'STRONG';
    else if (groundingRatio >= 0.5) trustLevel = 'PARTIAL';
    else if (maturityScore >= 0.5) trustLevel = 'HYDRATED';
    else trustLevel = 'HYDRATED';
  } else if (sState === 'S1') {
    trustLevel = 'NONE';
  } else {
    trustLevel = 'NONE';
  }

  const tier = TRUST_POSTURE_TIERS[trustLevel] || TRUST_POSTURE_TIERS.NONE;

  return {
    level: trustLevel,
    tier_level: tier.level,
    label: tier.label,
    color: tier.color,
    s_state: sState,
    q_class: qClass,
    grounding_ratio: groundingRatio,
    grounding_pct: groundingRatio != null ? +(groundingRatio * 100).toFixed(1) : null,
    maturity_score: maturityScore,
    maturity_classification: q.maturity_classification,
    gravity_score: q.gravity_score,
    gravity_classification: q.gravity_classification,
    stability_score: q.stability_score,
    stability_classification: q.stability_classification,
    progression_readiness: q.progression_readiness,
    progression_target: q.progression_target,
  };
}

function resolveDebtVisibility(qualProjection) {
  if (!qualProjection || !qualProjection.debt) return null;

  const d = qualProjection.debt;
  return {
    total_items: d.total_items,
    blocking_count: d.blocking_count,
    weighted_debt_score: d.weighted_debt_score,
    operational_exposure: d.operational_exposure,
    qualification_impact: d.qualification_impact,
    irreducible_count: d.irreducible_count,
    reducible_count: d.reducible_count,
    has_blocking_debt: d.blocking_count > 0,
    exposure_color: d.operational_exposure === 'HIGH' ? '#ff6b6b'
      : d.operational_exposure === 'MEDIUM' ? '#ff9e4a'
      : d.operational_exposure === 'LOW' ? '#ffd700'
      : '#64ffda',
  };
}

function resolveTemporalVisibility(qualProjection) {
  if (!qualProjection || !qualProjection.temporal) return null;

  const t = qualProjection.temporal;
  return {
    trend: t.trend,
    trend_color: t.trend === 'IMPROVING' ? '#64ffda'
      : t.trend === 'DEGRADING' ? '#ff6b6b'
      : '#ffd700',
    enrichment_grade: t.enrichment_grade,
    enrichment_lift_pct: t.enrichment_lift_pct,
    debt_reduction_ratio: t.debt_reduction_ratio,
    debt_reduction_pct: t.debt_reduction_ratio != null ? +(t.debt_reduction_ratio * 100).toFixed(1) : null,
    persistent_unresolved: t.persistent_unresolved,
    degradation_detected: t.degradation_detected,
  };
}

function resolveEvidenceVisibility(qualProjection) {
  if (!qualProjection || !qualProjection.evidenceIntake) return null;

  const e = qualProjection.evidenceIntake;
  return {
    total_items: e.total_items,
    accepted: e.accepted,
    rejected: e.rejected,
    quarantined: e.quarantined,
    all_valid: e.all_valid,
    covered_domains: e.covered_domains,
    integrity_color: e.all_valid ? '#64ffda' : '#ff6b6b',
  };
}

function resolvePropagationVisibility(qualProjection) {
  if (!qualProjection || !qualProjection.propagation) return null;

  const p = qualProjection.propagation;
  return {
    ready: p.ready,
    gates_met: p.gates_met,
    gate_count: p.gate_count,
    blocking_gates: p.blocking_gates,
    s_state_current: p.s_state_current,
    s_state_target: p.s_state_target,
    readiness_score: p.s_state_readiness,
    readiness_pct: p.s_state_readiness != null ? +(p.s_state_readiness * 100).toFixed(1) : null,
    gate_color: p.ready ? '#64ffda' : '#ff9e4a',
  };
}

function resolveStructuralBackingVisibility(qualProjection) {
  if (!qualProjection || !qualProjection.reconciliation) return null;

  const r = qualProjection.reconciliation;
  return {
    total_domains: r.total_domains,
    reconciled: r.reconciled,
    unreconciled: r.unreconciled,
    reconciliation_ratio: r.reconciliation_ratio,
    reconciliation_pct: r.reconciliation_ratio != null ? +(r.reconciliation_ratio * 100).toFixed(1) : null,
    weighted_confidence: r.weighted_confidence,
    trend: r.trend,
    unresolved_domains: r.unresolved_domains,
    unresolved_count: r.unresolved_domains ? r.unresolved_domains.length : (r.unreconciled || 0),
  };
}

function buildLensSubstrateBinding(client, runId) {
  const qualProjection = loadQualificationProjection(client, runId);
  const opsProjection = loadSemanticOperationsSubstrate(client, runId);

  if (!qualProjection) {
    return { available: false, reason: 'NO_QUALIFICATION_PROJECTION' };
  }

  return {
    available: true,
    trustPosture: resolveTrustPosture(qualProjection),
    debtVisibility: resolveDebtVisibility(qualProjection),
    temporalVisibility: resolveTemporalVisibility(qualProjection),
    evidenceVisibility: resolveEvidenceVisibility(qualProjection),
    propagationVisibility: resolvePropagationVisibility(qualProjection),
    structuralBacking: resolveStructuralBackingVisibility(qualProjection),
    envelope: qualProjection.envelope || null,
    operationalHealth: opsProjection && opsProjection.health ? opsProjection.health : null,
    provenance: qualProjection.provenance || null,
  };
}

module.exports = {
  TRUST_POSTURE_TIERS,
  loadQualificationProjection,
  loadSemanticOperationsSubstrate,
  resolveTrustPosture,
  resolveDebtVisibility,
  resolveTemporalVisibility,
  resolveEvidenceVisibility,
  resolvePropagationVisibility,
  resolveStructuralBackingVisibility,
  buildLensSubstrateBinding,
};
