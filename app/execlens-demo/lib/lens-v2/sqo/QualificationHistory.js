'use strict';

const fs = require('fs');
const path = require('path');
const { computeHash, getSourceCommit } = require('./QualificationStateArtifact');
const { OPERATION_VERSION } = require('./QualificationStateEngine');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';

function classifyTransition(priorState, currentState) {
  if (!priorState) return 'INITIAL';

  const ORDER = { S0: 0, S1: 1, S2: 2, S3: 3, S4_PLUS: 4 };
  const priorOrd = ORDER[priorState] != null ? ORDER[priorState] : -1;
  const currentOrd = ORDER[currentState] != null ? ORDER[currentState] : -1;

  if (currentOrd > priorOrd) return 'FORWARD';
  if (currentOrd < priorOrd) return 'DOWNGRADE';
  return 'STABLE';
}

function loadExistingHistory(historyPath) {
  if (!fs.existsSync(historyPath)) return null;
  try {
    const raw = fs.readFileSync(historyPath, 'utf8');
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function buildHistoryEntry(detectionResult, priorState) {
  const q = detectionResult.qualification || {};
  const ev = detectionResult.evidence || {};
  const currentState = q.s_state;

  return {
    timestamp: new Date().toISOString(),
    s_state: currentState,
    state_label: q.state_label,
    prior_state: priorState || null,
    transition_type: classifyTransition(priorState, currentState),
    transition_cause: q.state_reason,
    evidence_snapshot: {
      loader_status: ev.loader_status || 'UNKNOWN',
      binding_status: ev.binding_status || 'UNKNOWN',
      q_class: ev.q_class || 'NOT_AVAILABLE',
      required_artifacts_present_count: (ev.required_artifacts_present || []).length,
      required_artifacts_missing_count: (ev.required_artifacts_missing || []).length,
    },
    governance: {
      fail_closed: true,
      client_agnostic: true,
      no_semantic_fabrication: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'record_qualification_history',
      operation_version: OPERATION_VERSION,
    },
  };
}

function emitQualificationHistory(detectionResult) {
  const client = detectionResult.client;
  const runId = detectionResult.run_id;
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', client, runId);
  const historyPath = path.join(outputDir, 'qualification_history.v1.json');

  const existing = loadExistingHistory(historyPath);
  const priorState = existing
    ? (existing.history_entries && existing.history_entries.length > 0
        ? existing.history_entries[existing.history_entries.length - 1].s_state
        : null)
    : null;

  const entry = buildHistoryEntry(detectionResult, priorState);
  const q = detectionResult.qualification || {};

  const history = {
    schema_version: SCHEMA_VERSION,
    client,
    run_id: runId,
    current_state: q.s_state,
    prior_state: priorState,
    history_entries: existing ? [...(existing.history_entries || []), entry] : [entry],
    governance: {
      append_only: true,
      no_rewrite: true,
      fail_closed: true,
    },
    provenance: {
      source_commit: getSourceCommit(),
      operation: 'emit_qualification_history',
      operation_version: OPERATION_VERSION,
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n', 'utf8');

  return {
    path: historyPath,
    history,
    transition_type: entry.transition_type,
  };
}

module.exports = {
  SCHEMA_VERSION,
  classifyTransition,
  loadExistingHistory,
  buildHistoryEntry,
  emitQualificationHistory,
};
