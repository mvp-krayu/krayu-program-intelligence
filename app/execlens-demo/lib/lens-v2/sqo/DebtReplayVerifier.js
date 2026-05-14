'use strict';

const { computeHash } = require('./QualificationStateArtifact');
const { runFullDebtDetection, OPERATION_VERSION } = require('./SemanticDebtEngine');

const SCHEMA_VERSION = '1.0';

function verifyDebtInputHashes(artifact, currentDebtResult) {
  const storedHashes = (artifact.provenance && artifact.provenance.input_hashes) || {};
  const currentHashes = currentDebtResult.input_hashes || {};

  const mismatches = [];
  for (const key of Object.keys(storedHashes)) {
    if (storedHashes[key] !== currentHashes[key]) {
      mismatches.push({
        key,
        expected: storedHashes[key],
        actual: currentHashes[key] || 'not_recorded',
      });
    }
  }
  for (const key of Object.keys(currentHashes)) {
    if (storedHashes[key] === undefined) {
      mismatches.push({
        key,
        expected: 'not_recorded',
        actual: currentHashes[key],
      });
    }
  }

  return {
    pass: mismatches.length === 0,
    mismatches,
  };
}

function verifyDebtDeterministicRecomputation(artifact, currentDebtResult) {
  const storedCount = artifact.total_debt_items;
  const currentCount = currentDebtResult.total_debt_items;

  const storedSummary = artifact.summary || {};
  const currentSummary = currentDebtResult.summary || {};

  const match =
    storedCount === currentCount &&
    storedSummary.critical_count === currentSummary.critical_count &&
    storedSummary.high_count === currentSummary.high_count &&
    storedSummary.medium_high_count === currentSummary.medium_high_count &&
    storedSummary.medium_count === currentSummary.medium_count &&
    storedSummary.s_state_blocking_count === currentSummary.s_state_blocking_count;

  return {
    pass: match,
    stored: {
      total_debt_items: storedCount,
      summary: storedSummary,
    },
    recomputed: {
      total_debt_items: currentCount,
      summary: currentSummary,
    },
  };
}

function verifyDebtOutputHash(artifact) {
  const storedHash = artifact.provenance && artifact.provenance.output_hash;
  if (!storedHash) {
    return { pass: false, reason: 'No output_hash in artifact provenance' };
  }

  const clone = JSON.parse(JSON.stringify(artifact));
  clone.provenance.output_hash = null;
  const recomputed = 'sha256:' + computeHash(clone);

  return {
    pass: storedHash === recomputed,
    stored_hash: storedHash,
    recomputed_hash: recomputed,
  };
}

function runDebtReplayVerification(client, runId, artifact) {
  const currentDebt = runFullDebtDetection(client, runId);

  const inputCheck = verifyDebtInputHashes(artifact, currentDebt);
  const determinismCheck = verifyDebtDeterministicRecomputation(artifact, currentDebt);
  const outputHashCheck = verifyDebtOutputHash(artifact);

  const overall = inputCheck.pass && determinismCheck.pass && outputHashCheck.pass;

  return {
    schema_version: SCHEMA_VERSION,
    client,
    run_id: runId,
    verification_timestamp: new Date().toISOString(),
    checks: {
      input_integrity: {
        pass: inputCheck.pass,
        mismatches: inputCheck.mismatches,
      },
      deterministic_recomputation: {
        pass: determinismCheck.pass,
        stored: determinismCheck.stored,
        recomputed: determinismCheck.recomputed,
      },
      output_hash: {
        pass: outputHashCheck.pass,
        stored_hash: outputHashCheck.stored_hash,
        recomputed_hash: outputHashCheck.recomputed_hash,
      },
    },
    overall_verdict: overall ? 'PASS' : 'FAIL',
    governance: {
      operation: 'debt_replay_verification',
      operation_version: OPERATION_VERSION,
    },
  };
}

module.exports = {
  SCHEMA_VERSION,
  verifyDebtInputHashes,
  verifyDebtDeterministicRecomputation,
  verifyDebtOutputHash,
  runDebtReplayVerification,
};
