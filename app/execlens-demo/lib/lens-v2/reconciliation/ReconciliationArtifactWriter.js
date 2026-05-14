/**
 * ReconciliationArtifactWriter
 * PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01
 *
 * Writes the replayable reconciliation correspondence artifact to the
 * client run's artifact directory. The artifact is deterministic and
 * replay-safe: same inputs always produce the same correspondence table.
 *
 * Output path:
 *   artifacts/sqo/<client>/<run>/reconciliation_correspondence.v1.json
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');

function resolveArtifactPath(client, runId) {
  return path.join(
    REPO_ROOT,
    'artifacts', 'sqo', client, runId,
    'reconciliation_correspondence.v1.json'
  );
}

function writeReconciliationArtifact(client, runId, correspondenceResult) {
  if (!correspondenceResult || !correspondenceResult.ok) {
    return { ok: false, error: 'CORRESPONDENCE_RESULT_INVALID' };
  }

  const artifact = {
    ...correspondenceResult,
    client,
    run_id: runId,
    artifact_path: `artifacts/sqo/${client}/${runId}/reconciliation_correspondence.v1.json`,
  };

  const absPath = resolveArtifactPath(client, runId);
  const dir = path.dirname(absPath);

  if (!fs.existsSync(dir)) {
    return { ok: false, error: 'ARTIFACT_DIRECTORY_MISSING', path: dir };
  }

  fs.writeFileSync(absPath, JSON.stringify(artifact, null, 2), 'utf8');

  return {
    ok: true,
    path: artifact.artifact_path,
    absolute_path: absPath,
    reconciled_count: correspondenceResult.summary.reconciled_count,
    total_domains: correspondenceResult.summary.total_semantic_domains,
  };
}

function readReconciliationArtifact(client, runId) {
  const absPath = resolveArtifactPath(client, runId);
  if (!fs.existsSync(absPath)) {
    return { ok: false, missing: true, path: `artifacts/sqo/${client}/${runId}/reconciliation_correspondence.v1.json` };
  }
  try {
    const raw = fs.readFileSync(absPath, 'utf8');
    return { ok: true, data: JSON.parse(raw) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = {
  writeReconciliationArtifact,
  readReconciliationArtifact,
  resolveArtifactPath,
};
