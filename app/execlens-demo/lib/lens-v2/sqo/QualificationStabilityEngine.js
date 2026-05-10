'use strict';

const path = require('path');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const OPERATION_VERSION = '1.0';

const STABILITY_DIMENSIONS = ['D1', 'D3', 'D4', 'D5'];

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function classifyStability(score) {
  if (score <= 0.24) return 'UNSTABLE';
  if (score <= 0.49) return 'CONDITIONAL';
  if (score <= 0.74) return 'STABLE';
  return 'RESILIENT';
}

function computeQualificationStability(dimensions) {
  let sum = 0;
  for (const id of STABILITY_DIMENSIONS) {
    sum += dimensions[id].score;
  }
  return round3(sum / STABILITY_DIMENSIONS.length);
}

function computeStabilityResult(client, runId, dimensions) {
  const score = computeQualificationStability(dimensions);
  const classification = classifyStability(score);

  const contributing = {};
  for (const id of STABILITY_DIMENSIONS) {
    contributing[id] = {
      label: dimensions[id].label,
      score: dimensions[id].score,
      classification: dimensions[id].classification,
    };
  }

  return {
    client,
    run_id: runId,
    score,
    classification,
    contributing_dimensions: contributing,
  };
}

function buildStabilityArtifact(stabilityResult) {
  const body = {
    schema_version: SCHEMA_VERSION,
    client: stabilityResult.client,
    run_id: stabilityResult.run_id,
    timestamp: new Date().toISOString(),
    qualification_stability_score: stabilityResult.score,
    classification: stabilityResult.classification,
    contributing_dimensions: stabilityResult.contributing_dimensions,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      deterministic: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'compute_qualification_stability',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitStabilityAssessment(stabilityResult) {
  const artifact = buildStabilityArtifact(stabilityResult);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', stabilityResult.client, stabilityResult.run_id);
  const outputPath = path.join(outputDir, 'qualification_stability.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  STABILITY_DIMENSIONS,
  computeQualificationStability,
  classifyStability,
  computeStabilityResult,
  buildStabilityArtifact,
  emitStabilityAssessment,
};
