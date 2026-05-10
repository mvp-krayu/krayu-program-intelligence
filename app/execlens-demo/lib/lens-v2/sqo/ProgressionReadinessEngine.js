'use strict';

const path = require('path');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const OPERATION_VERSION = '1.0';

const S_STATE_NEXT = {
  S0: 'S1',
  S1: 'S2',
  S2: 'S3',
  S3: 'S4_PLUS',
};

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function computeProgressionReadiness(debtSummary, totalDebtItems) {
  if (totalDebtItems === 0) return 1.0;
  return round3(1 - (debtSummary.s_state_blocking_count / totalDebtItems));
}

function identifyBlockingDebts(debtItems) {
  return debtItems.filter(item => item.blocks_s_state && item.blocks_s_state !== 'none');
}

function computeNextSStateTarget(currentSState) {
  return S_STATE_NEXT[currentSState] || null;
}

function computeProgressionResult(client, runId, sState, debtResult) {
  const readiness = computeProgressionReadiness(debtResult.summary, debtResult.total_debt_items);
  const blockingDebts = identifyBlockingDebts(debtResult.debt_items);
  const nextTarget = computeNextSStateTarget(sState);

  return {
    client,
    run_id: runId,
    current_s_state: sState,
    next_s_state_target: nextTarget,
    progression_readiness: readiness,
    blocking_debt_count: blockingDebts.length,
    total_debt_items: debtResult.total_debt_items,
    blocking_debts: blockingDebts.map(d => ({
      id: d.id,
      category: d.category,
      severity: d.severity,
      blocks_s_state: d.blocks_s_state,
      remediation_pathway: d.remediation ? d.remediation.enrichment_pathway : null,
    })),
  };
}

function buildProgressionArtifact(progressionResult) {
  const body = {
    schema_version: SCHEMA_VERSION,
    client: progressionResult.client,
    run_id: progressionResult.run_id,
    timestamp: new Date().toISOString(),
    current_s_state: progressionResult.current_s_state,
    next_s_state_target: progressionResult.next_s_state_target,
    progression_readiness: progressionResult.progression_readiness,
    blocking_debt_count: progressionResult.blocking_debt_count,
    total_debt_items: progressionResult.total_debt_items,
    blocking_debts: progressionResult.blocking_debts,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      deterministic: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'compute_progression_readiness',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitProgressionReadiness(progressionResult) {
  const artifact = buildProgressionArtifact(progressionResult);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', progressionResult.client, progressionResult.run_id);
  const outputPath = path.join(outputDir, 'progression_readiness.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  S_STATE_NEXT,
  round3,
  computeProgressionReadiness,
  identifyBlockingDebts,
  computeNextSStateTarget,
  computeProgressionResult,
  buildProgressionArtifact,
  emitProgressionReadiness,
};
