'use strict';

const path = require('path');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const OPERATION_VERSION = '1.0';

const GRAVITY_DIMENSIONS = ['D1', 'D2', 'D3', 'D5', 'D7'];

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function classifyGravity(score) {
  if (score <= 0.24) return 'FRAGMENTED';
  if (score <= 0.49) return 'EMERGING';
  if (score <= 0.74) return 'STABILIZING';
  return 'GRAVITATIONAL';
}

function computeSemanticGravity(dimensions) {
  let sum = 0;
  for (const id of GRAVITY_DIMENSIONS) {
    sum += dimensions[id].score;
  }
  return round3(sum / GRAVITY_DIMENSIONS.length);
}

function computeGravityResult(client, runId, dimensions) {
  const score = computeSemanticGravity(dimensions);
  const classification = classifyGravity(score);

  const contributing = {};
  for (const id of GRAVITY_DIMENSIONS) {
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

function buildGravityAssessmentArtifact(gravityResult) {
  const body = {
    schema_version: SCHEMA_VERSION,
    client: gravityResult.client,
    run_id: gravityResult.run_id,
    timestamp: new Date().toISOString(),
    semantic_gravity_score: gravityResult.score,
    classification: gravityResult.classification,
    contributing_dimensions: gravityResult.contributing_dimensions,
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
      deterministic: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'compute_semantic_gravity',
      operation_version: OPERATION_VERSION,
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitGravityAssessment(gravityResult) {
  const artifact = buildGravityAssessmentArtifact(gravityResult);
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', gravityResult.client, gravityResult.run_id);
  const outputPath = path.join(outputDir, 'semantic_gravity_assessment.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  GRAVITY_DIMENSIONS,
  computeSemanticGravity,
  classifyGravity,
  computeGravityResult,
  buildGravityAssessmentArtifact,
  emitGravityAssessment,
};
