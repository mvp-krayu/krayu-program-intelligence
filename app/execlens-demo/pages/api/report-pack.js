/**
 * /api/report-pack
 * PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 *
 * GET /api/report-pack?client=blueedge&run=run_blueedge_productized_01_fixed&artifact=<id>
 *
 * Streams the requested static HTML report from the canonical BlueEdge
 * productized run. Rejects unknown client/run, unknown artifact id, and
 * any path traversal.
 */

'use strict';

const { buildPaths, validateClientRun } = require('../../lib/lens-v2/BlueEdgePayloadResolver');
const { loadText } = require('../../lib/lens-v2/SemanticArtifactLoader');

const ALLOWED_ARTIFACTS = new Set([
  'decision-surface',
  'tier1-narrative',
  'tier1-evidence',
  'tier2-diagnostic',
]);

function isValidParam(value) {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (value.length > 200) return false;
  if (!/^[A-Za-z0-9_\-]+$/.test(value)) return false;
  if (value.includes('..')) return false;
  return true;
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  const client = req.query && req.query.client;
  const run = req.query && req.query.run;
  const artifact = req.query && req.query.artifact;

  if (!isValidParam(client)) {
    res.status(400).json({ error: 'INVALID_CLIENT_PARAM' });
    return;
  }
  if (!isValidParam(run)) {
    res.status(400).json({ error: 'INVALID_RUN_PARAM' });
    return;
  }
  if (!isValidParam(artifact) || !ALLOWED_ARTIFACTS.has(artifact)) {
    res.status(400).json({ error: 'INVALID_ARTIFACT_PARAM', artifact });
    return;
  }

  const validation = validateClientRun(client, run);
  if (!validation.ok) {
    res.status(404).json({ error: validation.error, client, run });
    return;
  }

  const paths = buildPaths(client, run);
  const filePath = paths.reports[artifact];
  if (!filePath) {
    res.status(404).json({ error: 'ARTIFACT_PATH_UNRESOLVED', artifact });
    return;
  }

  const result = loadText(filePath);
  if (!result.ok) {
    if (result.missing) {
      res.status(404).json({ error: 'ARTIFACT_NOT_GENERATED', artifact, path: filePath });
      return;
    }
    res.status(500).json({ error: 'ARTIFACT_READ_FAILED', detail: result.error });
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(result.text);
}
