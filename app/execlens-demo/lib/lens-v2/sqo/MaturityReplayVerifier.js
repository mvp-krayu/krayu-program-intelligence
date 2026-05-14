'use strict';

const path = require('path');
const { computeHash, writeArtifact } = require('./QualificationStateArtifact');
const { runMaturityScoring, OPERATION_VERSION } = require('./MaturityScoringEngine');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';

function verifyMaturityInputHashes(artifact, currentResult) {
  const storedHashes = (artifact.provenance && artifact.provenance.input_hashes) || {};
  const currentHashes = currentResult.input_hashes || {};

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

  return { pass: mismatches.length === 0, mismatches };
}

function verifyMaturityDeterministicRecomputation(artifact, currentResult) {
  const storedScore = artifact.overall_maturity_score;
  const currentScore = currentResult.overall_maturity_score;

  const storedClass = artifact.overall_classification;
  const currentClass = currentResult.overall_classification;

  let dimensionMatch = true;
  const storedDims = artifact.dimensions || {};
  const currentDims = currentResult.dimensions || {};

  for (const id of Object.keys(storedDims)) {
    if (!currentDims[id] || storedDims[id].score !== currentDims[id].score) {
      dimensionMatch = false;
      break;
    }
  }

  const match = storedScore === currentScore && storedClass === currentClass && dimensionMatch;

  return {
    pass: match,
    stored: {
      overall_maturity_score: storedScore,
      overall_classification: storedClass,
    },
    recomputed: {
      overall_maturity_score: currentScore,
      overall_classification: currentClass,
    },
  };
}

function verifyMaturityOutputHash(artifact) {
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

function runMaturityReplayVerification(client, runId, artifact) {
  const currentResult = runMaturityScoring(client, runId);

  const inputCheck = verifyMaturityInputHashes(artifact, currentResult);
  const determinismCheck = verifyMaturityDeterministicRecomputation(artifact, currentResult);
  const outputHashCheck = verifyMaturityOutputHash(artifact);

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
      operation: 'maturity_replay_verification',
      operation_version: OPERATION_VERSION,
    },
  };
}

function emitMaturityReplayVerification(verificationResult) {
  const outputDir = path.join(
    REPO_ROOT, 'artifacts', 'sqo',
    verificationResult.client, verificationResult.run_id
  );
  const outputPath = path.join(outputDir, 'maturity_replay_verification.v1.json');
  writeArtifact(outputPath, verificationResult);
  return { path: outputPath, artifact: verificationResult };
}

module.exports = {
  SCHEMA_VERSION,
  verifyMaturityInputHashes,
  verifyMaturityDeterministicRecomputation,
  verifyMaturityOutputHash,
  runMaturityReplayVerification,
  emitMaturityReplayVerification,
};
