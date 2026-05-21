'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');

function resolveCeuArtifactPath(client, run, filename) {
  const rel = path.join('clients', client, 'psee', 'runs', run, 'ceu', filename);
  if (rel.includes('..')) throw new Error('PATH_TRAVERSAL_REJECTED');
  return path.resolve(REPO_ROOT, rel);
}

function loadJSONSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (_e) {
    return null;
  }
}

function loadJSONLSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return [];
    return raw.split('\n').map(line => JSON.parse(line));
  } catch (_e) {
    return null;
  }
}

function loadReconciliationState(client, run) {
  const reconciliationState = loadJSONSafe(resolveCeuArtifactPath(client, run, 'reconciliation_state.json'));
  if (!reconciliationState) {
    return { loaded: false, client, run };
  }

  const candidateRegistry = loadJSONSafe(resolveCeuArtifactPath(client, run, 'candidate_registry.json'));
  const evidenceAnchors = loadJSONSafe(resolveCeuArtifactPath(client, run, 'evidence_anchors.json'));
  const reconciliationObligations = loadJSONSafe(resolveCeuArtifactPath(client, run, 'reconciliation_obligations.json'));
  const reconciliationEventLog = loadJSONLSafe(resolveCeuArtifactPath(client, run, 'reconciliation_event_log.jsonl'));

  return {
    loaded: true,
    client,
    run,
    reconciliationState,
    candidateRegistry: candidateRegistry || { candidates: [], candidate_count: 0 },
    evidenceAnchors: evidenceAnchors || { anchors: [], total_anchors: 0 },
    reconciliationObligations: reconciliationObligations || { obligations: [], total_obligations: 0, resolved: 0, unresolved: 0 },
    reconciliationEventLog: reconciliationEventLog || [],
  };
}

function writeReconciliationState(client, run, state) {
  const filePath = resolveCeuArtifactPath(client, run, 'reconciliation_state.json');
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
}

function writeReconciliationObligations(client, run, obligations) {
  const filePath = resolveCeuArtifactPath(client, run, 'reconciliation_obligations.json');
  fs.writeFileSync(filePath, JSON.stringify(obligations, null, 2), 'utf8');
}

module.exports = {
  loadReconciliationState,
  writeReconciliationState,
  writeReconciliationObligations,
  resolveCeuArtifactPath,
  loadJSONSafe,
};
