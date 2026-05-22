'use strict';

const fs = require('fs');
const path = require('path');
const { resolveQualificationPosture } = require('../QualificationPostureResolver');

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

function readJSON(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  if (relPath.includes('..')) return null;
  try {
    return JSON.parse(fs.readFileSync(full, 'utf-8'));
  } catch (_e) {
    return null;
  }
}

function resolveSemanticQualificationIntake(client, runId) {
  const compilerRoot = path.join('clients', client, 'psee', 'runs', runId, 'semantic', 'compiler');
  const candidateCsr = readJSON(path.join(compilerRoot, 'candidate_csr.json'));

  if (candidateCsr) {
    return resolveCsrIntake(client, runId, candidateCsr, compilerRoot);
  }

  const speRoot = path.join('clients', client, 'psee', 'runs', runId, 'semantic', 'spe');
  const speReport = readJSON(path.join(speRoot, 'spe_derivation_report.json'));

  if (speReport) {
    return resolveSpeIntake(client, runId, speReport, speRoot);
  }

  return { available: false, failReason: 'NO_SEMANTIC_EVIDENCE' };
}

function resolveSpeIntake(client, runId, speReport, speRoot) {
  const sqoRoot = path.join('clients', client, 'psee', 'runs', runId, 'sqo');
  const spineRoot = path.join('clients', client, 'psee', 'runs', runId, 'spine');

  const reviewQueue = readJSON(path.join(speRoot, 'proposition_review_queue.json'));
  const promotionState = readJSON(path.join(sqoRoot, 'promotion_state.json'));
  const qualificationBlockers = readJSON(path.join(sqoRoot, 'qualification_blockers.json'));
  const spineObjects = readJSON(path.join(spineRoot, 'spine_objects.json'));

  const confidenceReport = speReport.confidence_report || {};
  const classDistribution = confidenceReport.class_distribution || {};
  const tierDistribution = confidenceReport.tier_distribution || {};

  const propositions = spineObjects && spineObjects.objects ? spineObjects.objects.semantic_propositions || [] : [];
  const ceuSet = new Set();
  for (const p of propositions) {
    for (const ref of (p.ceu_refs || [])) {
      ceuSet.add(ref);
    }
  }

  const blockers = qualificationBlockers ? qualificationBlockers.blockers || [] : [];
  const unresolvedBlockers = blockers.filter(b => !b.resolved);
  const blockingLanes = [...new Set(unresolvedBlockers.map(b => b.lane))];

  const laneStates = promotionState && promotionState.lanes ? Object.entries(promotionState.lanes).map(([lane, state]) => ({
    lane,
    state: state.state || 'UNKNOWN',
    blocked: unresolvedBlockers.some(b => b.lane === lane),
  })) : [];

  const reviewItems = reviewQueue ? reviewQueue.items || [] : [];
  const postureResult = resolveQualificationPosture(
    promotionState,
    qualificationBlockers,
    { semantic_candidates: true, semantic_propositions: true, review_obligations: reviewItems.length > 0 }
  );

  const nextSteps = [];
  if (reviewItems.length > 0) {
    nextSteps.push(`Review ${reviewItems.length} proposition${reviewItems.length !== 1 ? 's' : ''} requiring operator assessment`);
  }
  const candidateCount = propositions.filter(p => p.status === 'CANDIDATE').length;
  if (candidateCount > 0 && reviewItems.length === 0) {
    nextSteps.push(`${candidateCount} CANDIDATE proposition${candidateCount !== 1 ? 's' : ''} awaiting operator review for qualification progression`);
  }
  if (unresolvedBlockers.length > 0 && nextSteps.length === 0) {
    nextSteps.push(`Resolve ${unresolvedBlockers.length} qualification blocker${unresolvedBlockers.length !== 1 ? 's' : ''} to advance`);
  }
  if (nextSteps.length === 0) {
    nextSteps.push('All immediate obligations resolved');
  }

  return {
    available: true,
    layer: 'B',
    derivation_path: 'SPE',
    posture: {
      s_level: promotionState ? promotionState.s_level : 'S0',
      posture_state: postureResult.posture,
      posture_label: postureResult.postureLabel,
      posture_summary: postureResult.summary,
      insufficiency_acknowledged: promotionState ? !!promotionState.insufficiency_acknowledged : false,
      insufficiency_permanent: promotionState ? !!promotionState.insufficiency_permanent : false,
    },
    intake_summary: {
      derivation_path: 'SPE',
      total_propositions: speReport.proposition_count || 0,
      by_class: classDistribution,
      by_tier: tierDistribution,
      mean_confidence: confidenceReport.mean_confidence || 0,
      min_confidence: confidenceReport.min_confidence || 0,
      max_confidence: confidenceReport.max_confidence || 0,
      ceu_coverage: ceuSet.size,
      review_required: reviewItems.length > 0,
      review_item_count: reviewItems.length,
      derivation_hash: speReport.derivation_hash || null,
    },
    derivation_provenance: {
      engine: 'SPE',
      contract_id: speReport.contract_id || null,
      input_hash: speReport.input_hash || null,
      generated_at: speReport.generated_at || null,
      learning_events_emitted: speReport.learning_events_emitted || 0,
    },
    qualification_blockers: {
      total: unresolvedBlockers.length,
      resolved: blockers.length - unresolvedBlockers.length,
      blocking_lanes: blockingLanes,
      items: blockers.map(b => ({
        blocker_id: b.blocker_id,
        lane: b.lane,
        gap: b.gap,
        authority_domain: b.authority_domain,
        resolution: b.resolution,
        resolved: !!b.resolved,
        resolution_note: b.resolution_note || null,
      })),
    },
    lane_summary: laneStates,
    operational_guidance: {
      headline: postureResult.summary,
      next_steps: nextSteps,
    },
    governance: {
      no_grounding_mutation: true,
      deterministic: true,
      fail_closed: true,
      disclaimer: 'Semantic propositions are CANDIDATE (L3 ceiling). Not canonical semantic authority. Operator review required.',
    },
  };
}

function resolveCsrIntake(client, runId, candidateCsr, compilerRoot) {
  const sqoRoot = path.join('clients', client, 'psee', 'runs', runId, 'sqo');

  const derivationReport = readJSON(path.join(compilerRoot, 'derivation_report.json'));
  const reviewQueue = readJSON(path.join(compilerRoot, 'review_queue.json'));
  const promotionState = readJSON(path.join(sqoRoot, 'promotion_state.json'));
  const qualificationBlockers = readJSON(path.join(sqoRoot, 'qualification_blockers.json'));

  const capabilities = candidateCsr.capabilities || [];
  const components = candidateCsr.components || [];
  const domains = candidateCsr.domains || [];

  const confidenceDist = derivationReport ? derivationReport.confidence_distribution : null;
  const derivationLog = derivationReport ? derivationReport.derivation_log : [];

  const capabilityGroups = {};
  for (const cap of capabilities) {
    const type = cap.type || 'UNKNOWN';
    capabilityGroups[type] = (capabilityGroups[type] || 0) + 1;
  }

  const blockers = qualificationBlockers ? qualificationBlockers.blockers || [] : [];
  const blockingLanes = [...new Set(blockers.map(b => b.lane))];

  const laneStates = promotionState && promotionState.lanes ? Object.entries(promotionState.lanes).map(([lane, state]) => ({
    lane,
    state: state.state || 'UNKNOWN',
    blocked: blockers.some(b => b.lane === lane),
  })) : [];

  const postureResult = resolveQualificationPosture(
    promotionState,
    qualificationBlockers,
    { semantic_candidates: true, review_obligations: !!reviewQueue && reviewQueue.item_count > 0 }
  );

  const nextSteps = [];
  if (reviewQueue && reviewQueue.review_required) {
    nextSteps.push(`Review ${reviewQueue.item_count} candidate items requiring operator assessment`);
  }
  if (blockingLanes.includes('crosswalk')) {
    nextSteps.push('Crosswalk construction requires reviewed CSR');
  }
  if (blockingLanes.includes('reconciliation')) {
    nextSteps.push('Reconciliation requires crosswalk completion');
  }
  if (blockers.length > 0 && nextSteps.length === 0) {
    nextSteps.push(`Resolve ${blockers.length} qualification blockers to advance`);
  }
  if (nextSteps.length === 0) {
    nextSteps.push('All immediate obligations resolved');
  }

  return {
    available: true,
    layer: 'B',
    derivation_path: 'CSR',
    posture: {
      s_level: promotionState ? promotionState.s_level : 'S0',
      posture_state: postureResult.posture,
      posture_label: postureResult.postureLabel,
      posture_summary: postureResult.summary,
      insufficiency_acknowledged: promotionState ? !!promotionState.insufficiency_acknowledged : false,
      insufficiency_permanent: promotionState ? !!promotionState.insufficiency_permanent : false,
    },
    intake_summary: {
      derivation_path: 'CSR',
      total_capabilities: capabilities.length,
      total_components: components.length,
      total_domains: domains.length,
      capability_groups: capabilityGroups,
      direct_evidence_count: confidenceDist ? confidenceDist.direct_evidence : capabilities.length,
      derived_count: confidenceDist ? confidenceDist.derived : 0,
      inferred_count: confidenceDist ? confidenceDist.inferred : 0,
      direct_evidence_ratio: confidenceDist ? confidenceDist.direct_evidence_ratio : 1.0,
      review_required: reviewQueue ? !!reviewQueue.review_required : false,
      review_item_count: reviewQueue ? reviewQueue.item_count : 0,
    },
    derivation_provenance: {
      engine: 'SDC',
      phases: derivationLog.map(p => ({ phase: p.phase, count: p.components_extracted || p.capabilities_created || 0 })),
      compiler_version: derivationReport ? derivationReport.compiler_version : null,
      generated_at: derivationReport ? derivationReport.generated_at : null,
    },
    qualification_blockers: {
      total: blockers.length,
      blocking_lanes: blockingLanes,
      items: blockers.map(b => ({
        blocker_id: b.blocker_id,
        lane: b.lane,
        gap: b.gap,
        authority_domain: b.authority_domain,
        resolution: b.resolution,
      })),
    },
    lane_summary: laneStates,
    operational_guidance: {
      headline: postureResult.summary,
      next_steps: nextSteps,
    },
    governance: {
      no_grounding_mutation: true,
      deterministic: true,
      fail_closed: true,
      disclaimer: 'Candidate CSR is advisory (L3 ceiling). Not canonical semantic authority.',
    },
  };
}

module.exports = { resolveSemanticQualificationIntake };
