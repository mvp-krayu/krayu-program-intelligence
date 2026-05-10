'use strict';

const path = require('path');
const { loadJSON } = require('../lens-v2/SemanticArtifactLoader');
const { isClientRunAllowed } = require('../lens-v2/manifests');

const SQO_COCKPIT_ARTIFACT_KEYS = [
  'qualification_state',
  'semantic_maturity_profile',
  'semantic_gravity_assessment',
  'qualification_stability',
  'progression_readiness',
  'semantic_debt_inventory',
  'maturity_certification',
  'maturity_dimension_breakdown',
  'continuity_assessment',
  'qualification_history',
  'qualification_state_certification',
  'qualification_state_replay_verification',
  'debt_certification',
  'debt_replay_verification',
  'maturity_replay_verification',
];

const CRITICAL_ARTIFACTS = [
  'qualification_state',
  'semantic_maturity_profile',
];

const OVERVIEW_ARTIFACTS = [
  'qualification_state',
  'semantic_maturity_profile',
  'semantic_gravity_assessment',
  'qualification_stability',
  'progression_readiness',
  'semantic_debt_inventory',
];

const DEBT_ARTIFACTS = [
  'semantic_debt_inventory',
  'continuity_assessment',
  'progression_readiness',
];

const CONTINUITY_ARTIFACTS = [
  'continuity_assessment',
];

const MATURITY_ARTIFACTS = [
  'semantic_maturity_profile',
  'maturity_dimension_breakdown',
  'semantic_gravity_assessment',
  'qualification_stability',
];

const PROGRESSION_ARTIFACTS = [
  'progression_readiness',
  'semantic_debt_inventory',
  'qualification_state',
];

const EVIDENCE_REPLAY_ARTIFACTS = [
  'maturity_replay_verification',
  'qualification_state_replay_verification',
  'debt_replay_verification',
  'maturity_certification',
  'qualification_state_certification',
  'debt_certification',
  'maturity_dimension_breakdown',
];

const HANDOFF_ARTIFACTS = [
  'qualification_state',
  'semantic_maturity_profile',
  'semantic_gravity_assessment',
  'qualification_stability',
  'progression_readiness',
  'maturity_certification',
  'qualification_state_certification',
  'maturity_replay_verification',
  'qualification_state_replay_verification',
];

const SECTION_ARTIFACT_MAP = {
  overview: OVERVIEW_ARTIFACTS,
  debt: DEBT_ARTIFACTS,
  continuity: CONTINUITY_ARTIFACTS,
  maturity: MATURITY_ARTIFACTS,
  progression: PROGRESSION_ARTIFACTS,
  evidence: EVIDENCE_REPLAY_ARTIFACTS,
  handoff: HANDOFF_ARTIFACTS,
};

function loadSQOCockpitArtifact(client, runId, artifactName) {
  const relPath = path.join('artifacts', 'sqo', client, runId, `${artifactName}.v1.json`);
  return loadJSON(relPath);
}

function loadAllCockpitArtifacts(client, runId) {
  if (!isClientRunAllowed(client, runId)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED', client, run_id: runId, artifacts: {} };
  }

  const artifacts = {};
  let loadedCount = 0;

  for (const key of SQO_COCKPIT_ARTIFACT_KEYS) {
    const result = loadSQOCockpitArtifact(client, runId, key);
    artifacts[key] = result;
    if (result && result.ok) loadedCount++;
  }

  return {
    ok: loadedCount > 0,
    client,
    run_id: runId,
    artifacts,
    loaded_count: loadedCount,
    total_count: SQO_COCKPIT_ARTIFACT_KEYS.length,
  };
}

function loadSectionArtifacts(client, runId, section) {
  const keys = SECTION_ARTIFACT_MAP[section];
  if (!keys) {
    return { ok: false, error: 'UNKNOWN_SECTION', section };
  }

  if (!isClientRunAllowed(client, runId)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED', client, run_id: runId, artifacts: {} };
  }

  const artifacts = {};
  let loadedCount = 0;

  for (const key of keys) {
    const result = loadSQOCockpitArtifact(client, runId, key);
    artifacts[key] = result;
    if (result && result.ok) loadedCount++;
  }

  return {
    ok: loadedCount > 0,
    client,
    run_id: runId,
    section,
    artifacts,
    loaded_count: loadedCount,
    total_count: keys.length,
  };
}

function isArtifactAvailable(loadResult, key) {
  return !!(loadResult && loadResult.artifacts && loadResult.artifacts[key] && loadResult.artifacts[key].ok);
}

function getArtifactData(loadResult, key) {
  if (!isArtifactAvailable(loadResult, key)) return null;
  return loadResult.artifacts[key].data;
}

function areCriticalArtifactsPresent(loadResult) {
  return CRITICAL_ARTIFACTS.every(key => isArtifactAvailable(loadResult, key));
}

module.exports = {
  SQO_COCKPIT_ARTIFACT_KEYS,
  CRITICAL_ARTIFACTS,
  SECTION_ARTIFACT_MAP,
  loadSQOCockpitArtifact,
  loadAllCockpitArtifacts,
  loadSectionArtifacts,
  isArtifactAvailable,
  getArtifactData,
  areCriticalArtifactsPresent,
};
