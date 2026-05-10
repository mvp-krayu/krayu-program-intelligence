'use strict';

const { computeHash } = require('./QualificationStateArtifact');
const { runFullDetection, OPERATION_VERSION } = require('./QualificationStateEngine');

const SCHEMA_VERSION = '1.0';

function verifyInputHashes(artifact, currentDetection) {
  const storedHashes = (artifact.provenance && artifact.provenance.input_hashes) || {};
  const currentEvidence = (currentDetection && currentDetection.evidence) || {};
  const currentPresent = currentEvidence.required_artifacts_present || [];

  const mismatches = [];
  for (const key of Object.keys(storedHashes)) {
    if (storedHashes[key] === 'present' && !currentPresent.includes(key)) {
      mismatches.push({ key, expected: 'present', actual: 'missing' });
    }
  }
  for (const key of currentPresent) {
    if (storedHashes[key] === undefined) {
      mismatches.push({ key, expected: 'not_recorded', actual: 'present' });
    }
  }

  return {
    pass: mismatches.length === 0,
    mismatches,
  };
}

function verifyDeterministicRecomputation(artifact, currentDetection) {
  const storedState = artifact.qualification_state || {};
  const currentQ = (currentDetection && currentDetection.qualification) || {};

  const match =
    storedState.s_state === currentQ.s_state &&
    storedState.state_label === currentQ.state_label &&
    storedState.authorization_tier === currentQ.authorization_tier &&
    storedState.boardroom_readiness === currentQ.boardroom_readiness &&
    storedState.projection_permission === currentQ.projection_permission;

  return {
    pass: match,
    stored: {
      s_state: storedState.s_state,
      authorization_tier: storedState.authorization_tier,
    },
    recomputed: {
      s_state: currentQ.s_state,
      authorization_tier: currentQ.authorization_tier,
    },
  };
}

function verifyOutputHash(artifact) {
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

function runReplayVerification(client, runId, artifact) {
  const currentDetection = runFullDetection(client, runId);

  const inputCheck = verifyInputHashes(artifact, currentDetection);
  const determinismCheck = verifyDeterministicRecomputation(artifact, currentDetection);
  const outputHashCheck = verifyOutputHash(artifact);

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
      operation: 'replay_verification',
      operation_version: OPERATION_VERSION,
    },
  };
}

module.exports = {
  SCHEMA_VERSION,
  verifyInputHashes,
  verifyDeterministicRecomputation,
  verifyOutputHash,
  runReplayVerification,
};
