'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');

function resolveSqoArtifactPath(client, run, filename) {
  const rel = path.join('clients', client, 'psee', 'runs', run, 'sqo', filename);
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

function loadPromotionState(client, run) {
  const promotionState = loadJSONSafe(resolveSqoArtifactPath(client, run, 'promotion_state.json'));
  if (!promotionState) {
    return { loaded: false, client, run };
  }

  const qualificationBlockers = loadJSONSafe(resolveSqoArtifactPath(client, run, 'qualification_blockers.json'));
  const reviewObligations = loadJSONSafe(resolveSqoArtifactPath(client, run, 'review_obligations.json'));
  const promotionEventLog = loadJSONLSafe(resolveSqoArtifactPath(client, run, 'promotion_event_log.jsonl'));

  return {
    loaded: true,
    client,
    run,
    promotionState,
    qualificationBlockers: qualificationBlockers || { blockers: [], total_blockers: 0 },
    reviewObligations: reviewObligations || { obligations: [], total_obligations: 0, resolved: 0, unresolved: 0 },
    promotionEventLog: promotionEventLog || [],
  };
}

function writePromotionState(client, run, state) {
  const filePath = resolveSqoArtifactPath(client, run, 'promotion_state.json');
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
}

function writeReviewObligations(client, run, obligations) {
  const filePath = resolveSqoArtifactPath(client, run, 'review_obligations.json');
  fs.writeFileSync(filePath, JSON.stringify(obligations, null, 2), 'utf8');
}

function writeQualificationBlockers(client, run, blockers) {
  const filePath = resolveSqoArtifactPath(client, run, 'qualification_blockers.json');
  fs.writeFileSync(filePath, JSON.stringify(blockers, null, 2), 'utf8');
}

module.exports = {
  loadPromotionState,
  writePromotionState,
  writeReviewObligations,
  writeQualificationBlockers,
  resolveSqoArtifactPath,
  loadJSONSafe,
};
