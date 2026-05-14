'use strict';

const path = require('path');
const { loadJSON } = require('../SemanticArtifactLoader');
const { isClientRunAllowed } = require('../manifests');

const SQO_ARTIFACT_KEYS = [
  'qualification_state',
  'semantic_maturity_profile',
  'semantic_gravity_assessment',
  'qualification_stability',
  'progression_readiness',
  'semantic_debt_inventory',
  'maturity_certification',
  'maturity_dimension_breakdown',
];

function loadSQOArtifact(client, runId, artifactName) {
  const relPath = path.join('artifacts', 'sqo', client, runId, `${artifactName}.v1.json`);
  return loadJSON(relPath);
}

function loadAllSQOArtifacts(client, runId) {
  if (!isClientRunAllowed(client, runId)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED', artifacts: {} };
  }

  const artifacts = {};
  let loadedCount = 0;

  for (const key of SQO_ARTIFACT_KEYS) {
    const result = loadSQOArtifact(client, runId, key);
    artifacts[key] = result;
    if (result && result.ok) loadedCount++;
  }

  return {
    ok: loadedCount > 0,
    client,
    run_id: runId,
    artifacts,
    loaded_count: loadedCount,
    total_count: SQO_ARTIFACT_KEYS.length,
  };
}

module.exports = {
  SQO_ARTIFACT_KEYS,
  loadSQOArtifact,
  loadAllSQOArtifacts,
};
