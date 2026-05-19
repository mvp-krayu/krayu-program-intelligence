'use strict';

const fs = require('fs');
const path = require('path');

function resolveRepoRoot() {
  if (process.env.REPO_ROOT && fs.existsSync(process.env.REPO_ROOT)) {
    return path.resolve(process.env.REPO_ROOT);
  }
  let cur = __dirname;
  for (let i = 0; i < 10; i += 1) {
    if (fs.existsSync(path.join(cur, '.git'))) return cur;
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return path.resolve(__dirname, '..', '..', '..', '..', '..');
}

const REPO_ROOT = resolveRepoRoot();

const RUNTIME_CLASS = {
  STATIC_QUALIFICATION: 'STATIC_QUALIFICATION',
  LIVE_OPERATIONAL: 'LIVE_OPERATIONAL',
};

function probeFile(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  if (relPath.includes('..')) return false;
  try { return fs.existsSync(full); } catch (_e) { return false; }
}

function resolveRuntimeSubstrates(client, runId) {
  const staticRoot = path.join('artifacts', 'sqo', client, runId);
  const operationalRoot = path.join('clients', client, 'psee', 'runs', runId, 'sqo');

  const staticProbes = {
    qualification_state: probeFile(path.join(staticRoot, 'qualification_state.v1.json')),
    semantic_maturity_profile: probeFile(path.join(staticRoot, 'semantic_maturity_profile.v1.json')),
    semantic_debt_inventory: probeFile(path.join(staticRoot, 'semantic_debt_inventory.v1.json')),
    continuity_assessment: probeFile(path.join(staticRoot, 'continuity_assessment.v1.json')),
    progression_readiness: probeFile(path.join(staticRoot, 'progression_readiness.v1.json')),
    reconciliation_correspondence: probeFile(path.join(staticRoot, 'reconciliation_correspondence.v1.json')),
    reconciliation_loop_state: probeFile(path.join(staticRoot, 'reconciliation_loop_state.v1.json')),
    maturity_replay_verification: probeFile(path.join(staticRoot, 'maturity_replay_verification.v1.json')),
    qualification_state_replay_verification: probeFile(path.join(staticRoot, 'qualification_state_replay_verification.v1.json')),
    debt_replay_verification: probeFile(path.join(staticRoot, 'debt_replay_verification.v1.json')),
    semantic_evidence_intake: probeFile(path.join(staticRoot, 'semantic_evidence_intake.v1.json')),
  };

  const operationalProbes = {
    promotion_state: probeFile(path.join(operationalRoot, 'promotion_state.json')),
    qualification_blockers: probeFile(path.join(operationalRoot, 'qualification_blockers.json')),
    review_obligations: probeFile(path.join(operationalRoot, 'review_obligations.json')),
    promotion_event_log: probeFile(path.join(operationalRoot, 'promotion_event_log.jsonl')),
  };

  const semanticProbes = {
    candidate_csr: probeFile(path.join('clients', client, 'psee', 'runs', runId, 'semantic', 'compiler', 'candidate_csr.json')),
    semantic_topology: probeFile(path.join('clients', client, 'psee', 'runs', runId, 'semantic', 'topology', 'semantic_topology_model.json')),
    canonical_topology: probeFile(path.join('clients', client, 'psee', 'runs', runId, 'structure', '40.4', 'canonical_topology.json')),
    vault_readiness: probeFile(path.join('clients', client, 'psee', 'runs', runId, 'vault', 'vault_readiness.json')),
  };

  const staticAvailable = Object.values(staticProbes).some(v => v);
  const operationalAvailable = Object.values(operationalProbes).some(v => v);

  const capabilities = {
    static_qualification: staticProbes.qualification_state && staticProbes.semantic_maturity_profile,
    static_debt: staticProbes.semantic_debt_inventory,
    static_continuity: staticProbes.continuity_assessment,
    static_progression: staticProbes.progression_readiness,
    static_reconciliation: staticProbes.reconciliation_correspondence,
    static_reconciliation_loop: staticProbes.reconciliation_loop_state,
    static_replay: staticProbes.maturity_replay_verification || staticProbes.qualification_state_replay_verification || staticProbes.debt_replay_verification,
    static_evidence_intake: staticProbes.semantic_evidence_intake,

    authority_runtime: operationalProbes.promotion_state,
    review_obligations: operationalProbes.review_obligations,
    event_lineage: operationalProbes.promotion_event_log,
    qualification_blockers: operationalProbes.qualification_blockers,

    semantic_candidates: semanticProbes.candidate_csr,
    structural_topology: semanticProbes.canonical_topology,
    semantic_topology: semanticProbes.semantic_topology,
    vault_readiness: semanticProbes.vault_readiness,
  };

  const sectionAvailability = {
    overview: capabilities.static_qualification,
    debt: capabilities.static_debt,
    continuity: capabilities.static_continuity,
    maturity: capabilities.static_qualification,
    progression: capabilities.static_progression,
    evidence: capabilities.static_replay,
    handoff: capabilities.static_qualification,
    reconciliation: capabilities.static_reconciliation,
    'reconciliation-loop': capabilities.static_reconciliation_loop,
    'evidence-ingestion': capabilities.static_evidence_intake,
    'semantic-candidates': capabilities.semantic_candidates,
    authority: capabilities.authority_runtime,
  };

  const runtimeClasses = [];
  if (staticAvailable) runtimeClasses.push(RUNTIME_CLASS.STATIC_QUALIFICATION);
  if (operationalAvailable) runtimeClasses.push(RUNTIME_CLASS.LIVE_OPERATIONAL);

  return {
    client,
    runId,
    staticRoot,
    operationalRoot,
    staticAvailable,
    operationalAvailable,
    runtimeClasses,
    capabilities,
    sectionAvailability,
    probes: {
      static: staticProbes,
      operational: operationalProbes,
      semantic: semanticProbes,
    },
    anyCapabilityAvailable: staticAvailable || operationalAvailable,
  };
}

module.exports = {
  RUNTIME_CLASS,
  resolveRuntimeSubstrates,
};
