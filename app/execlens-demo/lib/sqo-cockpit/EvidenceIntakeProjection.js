'use strict';

/**
 * EvidenceIntakeProjection
 * PI.SQO.BLUEEDGE.SEMANTIC-EVIDENCE-INTAKE-LOOP.01
 *
 * Transforms the semantic_evidence_intake artifact into
 * runtime-consumable projection shapes for SQO cockpit.
 *
 * Pure deterministic consumer — no inference, no enrichment, no mutation.
 */

function projectEvidenceIntakeForRuntime(intakeArtifact) {
  if (!intakeArtifact) return null;

  return {
    summary: projectIntakeSummary(intakeArtifact),
    accepted: projectAccepted(intakeArtifact),
    rejected: projectRejected(intakeArtifact),
    quarantined: projectQuarantined(intakeArtifact),
    eligibility: projectEligibility(intakeArtifact),
    provenance: projectProvenance(intakeArtifact),
  };
}

function projectIntakeSummary(artifact) {
  const s = artifact.intake_summary;
  if (!s) return null;

  return {
    total_items: s.total_items,
    accepted_count: s.accepted_count,
    rejected_count: s.rejected_count,
    quarantined_count: s.quarantined_count,
    all_valid: s.all_valid,
    source_class_distribution: s.source_class_distribution,
    covered_domain_count: s.covered_domain_count,
    registry_items: s.registry_items_count,
    rebase_items: s.rebase_items_count,
  };
}

function projectAccepted(artifact) {
  return (artifact.accepted || []).map(a => ({
    evidence_id: a.evidence_id,
    source_class: a.source_class,
    eligible_operations: a.eligible_operations,
    candidate_domain_count: a.candidate_domain_count,
  }));
}

function projectRejected(artifact) {
  return (artifact.rejected || []).map(r => ({
    evidence_id: r.evidence_id,
    source_class: r.source_class,
    rejection_reason: r.rejection_reason,
  }));
}

function projectQuarantined(artifact) {
  return (artifact.quarantined || []).map(q => ({
    evidence_id: q.evidence_id,
    source_class: q.source_class,
    rejection_reason: q.rejection_reason,
  }));
}

function projectEligibility(artifact) {
  const e = artifact.eligibility;
  if (!e) return null;

  return {
    semantic_reconstruction_count: (e.semantic_reconstruction || []).length,
    enrichment_count: (e.enrichment || []).length,
    reconciliation_count: (e.reconciliation || []).length,
    lifecycle_progression_count: (e.lifecycle_progression || []).length,
    semantic_reconstruction_ids: e.semantic_reconstruction || [],
    enrichment_ids: e.enrichment || [],
    reconciliation_ids: e.reconciliation || [],
    lifecycle_progression_ids: e.lifecycle_progression || [],
  };
}

function projectProvenance(artifact) {
  return {
    generated_at: artifact.generated_at,
    compiler_version: artifact.compiler_version,
    deterministic: artifact.governance && artifact.governance.deterministic,
    replay_safe: artifact.governance && artifact.governance.replay_safe,
    ingestion_boundary: artifact.governance && artifact.governance.ingestion_boundary,
  };
}

module.exports = {
  projectEvidenceIntakeForRuntime,
  projectIntakeSummary,
  projectAccepted,
  projectRejected,
  projectQuarantined,
  projectEligibility,
  projectProvenance,
};
