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
  'reconciliation_correspondence',
  'reconciliation_lifecycle',
  'semantic_debt_index',
  'reconciliation_temporal_analytics',
  'semantic_evidence_intake',
  'runtime_qualification_projection',
  'runtime_semantic_operations_substrate',
  'reconciliation_loop_state',
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
  'reconciliation_correspondence',
  'reconciliation_lifecycle',
  'semantic_debt_index',
  'runtime_qualification_projection',
  'runtime_semantic_operations_substrate',
  'reconciliation_loop_state',
];

const DEBT_ARTIFACTS = [
  'semantic_debt_inventory',
  'semantic_debt_index',
  'continuity_assessment',
  'progression_readiness',
];

const CONTINUITY_ARTIFACTS = [
  'continuity_assessment',
  'reconciliation_correspondence',
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
  'semantic_evidence_intake',
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

const RECONCILIATION_ARTIFACTS = [
  'reconciliation_correspondence',
  'reconciliation_lifecycle',
  'semantic_debt_index',
  'reconciliation_temporal_analytics',
  'runtime_qualification_projection',
];

const SECTION_ARTIFACT_MAP = {
  overview: OVERVIEW_ARTIFACTS,
  debt: DEBT_ARTIFACTS,
  continuity: CONTINUITY_ARTIFACTS,
  maturity: MATURITY_ARTIFACTS,
  progression: PROGRESSION_ARTIFACTS,
  evidence: EVIDENCE_REPLAY_ARTIFACTS,
  handoff: HANDOFF_ARTIFACTS,
  reconciliation: RECONCILIATION_ARTIFACTS,
};

function loadSQOCockpitArtifact(client, runId, artifactName) {
  const relPath = path.join('artifacts', 'sqo', client, runId, `${artifactName}.v1.json`);
  return loadJSON(relPath);
}

function loadAllCockpitArtifacts(client, runId) {
  if (!isClientRunAllowed(client, runId)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED', client, run_id: runId, artifacts: {}, diagnostics: null };
  }

  const artifacts = {};
  let loadedCount = 0;
  const missingArtifacts = [];
  const presentArtifacts = [];

  for (const key of SQO_COCKPIT_ARTIFACT_KEYS) {
    const result = loadSQOCockpitArtifact(client, runId, key);
    artifacts[key] = result;
    if (result && result.ok) {
      loadedCount++;
      presentArtifacts.push({ key, path: result.path, status: 'PRESENT' });
    } else {
      const expectedPath = path.join('artifacts', 'sqo', client, runId, `${key}.v1.json`);
      const isCritical = CRITICAL_ARTIFACTS.includes(key);
      missingArtifacts.push({
        key,
        path: expectedPath,
        status: isCritical ? 'MISSING_REQUIRED' : 'MISSING_OPTIONAL',
        error: result ? result.error || null : null,
      });
    }
  }

  return {
    ok: loadedCount > 0,
    client,
    run_id: runId,
    artifacts,
    loaded_count: loadedCount,
    total_count: SQO_COCKPIT_ARTIFACT_KEYS.length,
    diagnostics: {
      client,
      run_id: runId,
      artifact_root: path.join('artifacts', 'sqo', client, runId),
      present: presentArtifacts,
      missing: missingArtifacts,
      present_count: presentArtifacts.length,
      missing_count: missingArtifacts.length,
      has_required_missing: missingArtifacts.some(m => m.status === 'MISSING_REQUIRED'),
    },
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
