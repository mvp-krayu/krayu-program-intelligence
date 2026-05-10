'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { OPERATION_VERSION } = require('./QualificationStateEngine');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';

function computeHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

function getSourceCommit() {
  try {
    const gitHead = path.join(REPO_ROOT, '.git', 'HEAD');
    const ref = fs.readFileSync(gitHead, 'utf8').trim();
    if (ref.startsWith('ref: ')) {
      const refPath = path.join(REPO_ROOT, '.git', ref.slice(5));
      if (fs.existsSync(refPath)) {
        return fs.readFileSync(refPath, 'utf8').trim().slice(0, 12);
      }
    }
    return ref.slice(0, 12);
  } catch (_) {
    return 'unknown';
  }
}

function collectInputHashes(detectionResult) {
  const hashes = {};
  if (!detectionResult || !detectionResult.ok) return hashes;

  const evidence = detectionResult.evidence || {};
  const present = evidence.required_artifacts_present || [];
  for (const key of present) {
    hashes[key] = 'present';
  }
  return hashes;
}

function buildQualificationStateArtifact(detectionResult) {
  const q = detectionResult.qualification || {};
  const ev = detectionResult.evidence || {};

  const body = {
    schema_version: SCHEMA_VERSION,
    client: detectionResult.client,
    run_id: detectionResult.run_id,
    qualification_state: {
      s_state: q.s_state,
      state_label: q.state_label,
      state_reason: q.state_reason,
      authorization_tier: q.authorization_tier,
      boardroom_readiness: q.boardroom_readiness,
      projection_permission: q.projection_permission,
    },
    evidence: {
      manifest_registered: ev.manifest_registered || false,
      required_artifacts_declared: ev.required_artifacts_declared || [],
      required_artifacts_present: ev.required_artifacts_present || [],
      required_artifacts_missing: ev.required_artifacts_missing || [],
      loader_status: ev.loader_status || 'UNKNOWN',
      binding_status: ev.binding_status || 'UNKNOWN',
      q_class: ev.q_class || 'NOT_AVAILABLE',
      qualifier_summary: ev.qualifier_summary || {},
    },
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      no_source_mutation: true,
      sqo_advisory_only: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      input_hashes: collectInputHashes(detectionResult),
      operation: 'detect_qualification_state',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function writeArtifact(artifactPath, data) {
  const dir = path.dirname(artifactPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(artifactPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function emitQualificationState(detectionResult) {
  const artifact = buildQualificationStateArtifact(detectionResult);
  const outputDir = path.join(
    REPO_ROOT,
    'artifacts', 'sqo',
    detectionResult.client,
    detectionResult.run_id
  );
  const outputPath = path.join(outputDir, 'qualification_state.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  computeHash,
  getSourceCommit,
  buildQualificationStateArtifact,
  writeArtifact,
  emitQualificationState,
};
