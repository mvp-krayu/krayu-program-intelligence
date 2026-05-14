'use strict';

function projectQualificationForRuntime(projectionArtifact) {
  if (!projectionArtifact) return null;

  return {
    qualification: projectQualificationSummary(projectionArtifact),
    reconciliation: projectReconciliationSummary(projectionArtifact),
    debt: projectDebtSummary(projectionArtifact),
    temporal: projectTemporalSummary(projectionArtifact),
    evidenceIntake: projectEvidenceIntakeSummary(projectionArtifact),
    propagation: projectPropagationSummary(projectionArtifact),
    envelope: projectionArtifact.semantic_envelope || null,
    provenance: projectProvenance(projectionArtifact),
  };
}

function projectQualificationSummary(artifact) {
  const qp = artifact.qualification_posture;
  if (!qp) return null;

  return {
    s_state: qp.s_state,
    state_label: qp.state_label,
    q_class: qp.q_class,
    authorization_tier: qp.authorization_tier,
    grounding_ratio: qp.grounding_ratio,
    maturity_score: qp.maturity ? qp.maturity.score : null,
    maturity_classification: qp.maturity ? qp.maturity.classification : null,
    gravity_score: qp.gravity ? qp.gravity.score : null,
    gravity_classification: qp.gravity ? qp.gravity.classification : null,
    stability_score: qp.stability ? qp.stability.score : null,
    stability_classification: qp.stability ? qp.stability.classification : null,
    progression_readiness: qp.progression ? qp.progression.readiness : null,
    progression_target: qp.progression ? qp.progression.target : null,
  };
}

function projectReconciliationSummary(artifact) {
  const rp = artifact.reconciliation_posture;
  if (!rp) return null;

  return {
    total_domains: rp.summary ? rp.summary.total_semantic_domains : null,
    reconciled: rp.summary ? rp.summary.reconciled_count : null,
    unreconciled: rp.summary ? rp.summary.unreconciled_count : null,
    reconciliation_ratio: rp.summary ? rp.summary.reconciliation_ratio : null,
    weighted_confidence: rp.summary ? rp.summary.weighted_confidence : null,
    trend: rp.lifecycle && rp.lifecycle.trend ? rp.lifecycle.trend.label : null,
    unresolved_domains: rp.lifecycle ? rp.lifecycle.unresolvedDomains : null,
  };
}

function projectDebtSummary(artifact) {
  const dp = artifact.semantic_debt_posture;
  if (!dp) return null;

  return {
    total_items: dp.summary ? dp.summary.total_items : null,
    blocking_count: dp.summary ? dp.summary.blocking_count : null,
    weighted_debt_score: dp.index && dp.index.aggregatePosture
      ? dp.index.aggregatePosture.weighted_debt_score : null,
    operational_exposure: dp.index && dp.index.aggregatePosture
      ? dp.index.aggregatePosture.operational_exposure : null,
    qualification_impact: dp.index && dp.index.aggregatePosture
      ? dp.index.aggregatePosture.qualification_impact : null,
    irreducible_count: dp.index && dp.index.reducibilitySummary
      ? dp.index.reducibilitySummary.irreducible_count : null,
    reducible_count: dp.index && dp.index.reducibilitySummary
      ? dp.index.reducibilitySummary.reducible_count : null,
  };
}

function projectTemporalSummary(artifact) {
  const tp = artifact.temporal_analytics_posture;
  if (!tp) return null;

  return {
    trend: tp.trend ? tp.trend.label : null,
    enrichment_grade: tp.enrichmentEffectiveness ? tp.enrichmentEffectiveness.grade : null,
    enrichment_lift_pct: tp.enrichmentEffectiveness ? tp.enrichmentEffectiveness.weighted_lift_pct : null,
    debt_reduction_ratio: tp.debtReduction ? tp.debtReduction.reduction_ratio : null,
    persistent_unresolved: tp.unresolvedPersistence ? tp.unresolvedPersistence.persistent_count : null,
    degradation_detected: tp.degradation ? tp.degradation.detected : false,
  };
}

function projectEvidenceIntakeSummary(artifact) {
  const ei = artifact.evidence_intake_posture;
  if (!ei) return null;

  return {
    total_items: ei.summary ? ei.summary.total_items : null,
    accepted: ei.accepted_count,
    rejected: ei.rejected_count,
    quarantined: ei.quarantined_count,
    all_valid: ei.all_valid,
    covered_domains: ei.summary ? ei.summary.covered_domain_count : null,
  };
}

function projectPropagationSummary(artifact) {
  const pr = artifact.propagation_readiness;
  if (!pr) return null;

  return {
    ready: pr.ready,
    gates_met: pr.gates_met,
    gate_count: pr.gate_count,
    blocking_gates: pr.blocking_summary,
    s_state_current: pr.s_state_progression ? pr.s_state_progression.current : null,
    s_state_target: pr.s_state_progression ? pr.s_state_progression.target : null,
    s_state_readiness: pr.s_state_progression ? pr.s_state_progression.readiness_score : null,
  };
}

function projectProvenance(artifact) {
  const bd = artifact.boundary_disclosure;
  return {
    generated_at: artifact.generated_at,
    compiler_version: artifact.compiler_version,
    deterministic: bd && bd.governance ? bd.governance.deterministic : true,
    replay_safe: bd && bd.governance ? bd.governance.replay_safe : true,
    source_artifact_count: bd ? bd.source_artifact_count : null,
    source_artifacts: bd ? bd.source_artifacts : null,
  };
}

module.exports = {
  projectQualificationForRuntime,
  projectQualificationSummary,
  projectReconciliationSummary,
  projectDebtSummary,
  projectTemporalSummary,
  projectEvidenceIntakeSummary,
  projectPropagationSummary,
  projectProvenance,
};
