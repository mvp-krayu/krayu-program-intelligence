'use strict';

function projectSemanticOperationsForRuntime(substrateArtifact) {
  if (!substrateArtifact) return null;

  return {
    operationalModel: projectOperationalModel(substrateArtifact),
    health: projectHealth(substrateArtifact),
    propagation: projectPropagation(substrateArtifact),
    qualificationSummary: projectQualificationSummary(substrateArtifact),
    ownershipMap: projectOwnershipMap(substrateArtifact),
    orchestration: projectOrchestration(substrateArtifact),
    stabilization: projectStabilization(substrateArtifact),
    provenance: projectProvenance(substrateArtifact),
  };
}

function projectOperationalModel(artifact) {
  const om = artifact.operational_model;
  if (!om) return null;

  return {
    ownership_domains: om.ownership_domain_count,
    propagation_contracts: om.propagation_contract_count,
    orchestration_phases: om.orchestration_phase_count,
    registered_artifacts: om.registered_artifact_count,
    stabilization_rules: om.stabilization_rule_count,
  };
}

function projectHealth(artifact) {
  const h = artifact.operational_health;
  if (!h) return null;

  const unhealthyDomains = Object.entries(h.domains)
    .filter(([, d]) => !d.healthy)
    .map(([id, d]) => ({ id, missing: d.missing_artifacts }));

  return {
    overall_healthy: h.overall_healthy,
    coverage: h.coverage,
    total_artifacts: h.total_artifacts,
    total_present: h.total_present,
    unhealthy_domains: unhealthyDomains,
  };
}

function projectPropagation(artifact) {
  const pi = artifact.propagation_integrity;
  if (!pi) return null;

  const brokenContracts = pi.contracts
    .filter(c => !c.intact)
    .map(c => ({ id: c.id, from: c.from, to: c.to, missing_inputs: c.missing_inputs, missing_outputs: c.missing_outputs }));

  return {
    all_intact: pi.all_intact,
    total_contracts: pi.total_contracts,
    intact_count: pi.intact_count,
    broken_contracts: brokenContracts,
  };
}

function projectQualificationSummary(artifact) {
  const qp = artifact.qualification_projection;
  if (!qp) return null;

  const qual = qp.qualification_posture;
  const recon = qp.reconciliation_posture;
  const debt = qp.semantic_debt_posture;
  const temporal = qp.temporal_analytics_posture;
  const intake = qp.evidence_intake_posture;
  const prop = qp.propagation_readiness;
  const envelope = qp.semantic_envelope;

  return {
    s_state: qual ? qual.s_state : null,
    q_class: qual ? qual.q_class : null,
    maturity: qual && qual.maturity ? qual.maturity.classification : null,
    reconciliation_ratio: recon && recon.summary ? recon.summary.reconciliation_ratio : null,
    weighted_debt: debt && debt.index && debt.index.aggregatePosture
      ? debt.index.aggregatePosture.weighted_debt_score : null,
    trend: temporal && temporal.trend ? temporal.trend.label : null,
    evidence_valid: intake ? intake.all_valid : null,
    propagation_ready: prop ? prop.ready : null,
    envelope_complete: envelope ? envelope.complete : null,
    gates_met: prop ? `${prop.gates_met}/${prop.gate_count}` : null,
  };
}

function projectOwnershipMap(artifact) {
  const boundaries = artifact.ownership_boundaries;
  if (!boundaries) return null;

  return boundaries.map(b => ({
    id: b.id,
    description: b.description,
    artifact_count: b.artifact_count,
    mutation_authority: b.mutation_authority,
  }));
}

function projectOrchestration(artifact) {
  const orch = artifact.orchestration;
  if (!orch) return null;

  return {
    phase_count: orch.phases.length,
    phases: orch.phases.map(p => ({ phase: p.phase, domain: p.domain })),
    replay_safe: orch.replay_semantics.all_compilers_deterministic
      && orch.replay_semantics.all_projections_deterministic,
  };
}

function projectStabilization(artifact) {
  return {
    rule_count: (artifact.stabilization_rules || []).length,
    rules: artifact.stabilization_rules || [],
  };
}

function projectProvenance(artifact) {
  const bd = artifact.boundary_disclosure;
  return {
    generated_at: artifact.generated_at,
    substrate_version: artifact.substrate_version,
    deterministic: bd && bd.governance ? bd.governance.deterministic : true,
    replay_safe: bd && bd.governance ? bd.governance.replay_safe : true,
    stream: bd && bd.provenance ? bd.provenance.stream : null,
  };
}

module.exports = {
  projectSemanticOperationsForRuntime,
  projectOperationalModel,
  projectHealth,
  projectPropagation,
  projectQualificationSummary,
  projectOwnershipMap,
  projectOrchestration,
  projectStabilization,
  projectProvenance,
};
