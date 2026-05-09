/**
 * /api/lens-payload
 * PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 *
 * GET /api/lens-payload?client=blueedge&run=run_blueedge_productized_01_fixed
 *
 * Returns the live LENS V2 semantic payload assembled from the
 * BlueEdgePayloadResolver. Rejects unknown client/run, missing required
 * artifacts, and any path traversal.
 */

'use strict';

const { resolveBlueEdgePayload } = require('../../lib/lens-v2/BlueEdgePayloadResolver');

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

  if (!isValidParam(client)) {
    res.status(400).json({ error: 'INVALID_CLIENT_PARAM' });
    return;
  }
  if (!isValidParam(run)) {
    res.status(400).json({ error: 'INVALID_RUN_PARAM' });
    return;
  }

  let payload;
  try {
    payload = resolveBlueEdgePayload(client, run);
  } catch (e) {
    res.status(500).json({ error: 'RESOLVER_INTERNAL', detail: e && e.message });
    return;
  }

  if (!payload || !payload.ok) {
    if (payload && payload.error === 'CLIENT_NOT_ALLOWED') {
      res.status(404).json({ error: 'CLIENT_NOT_ALLOWED', client });
      return;
    }
    if (payload && payload.error === 'RUN_NOT_ALLOWED') {
      res.status(404).json({ error: 'RUN_NOT_ALLOWED', client, run });
      return;
    }
    if (payload && payload.error === 'REQUIRED_ARTIFACT_MISSING') {
      res.status(424).json({ error: 'REQUIRED_ARTIFACT_MISSING', detail: payload.missing });
      return;
    }
    res.status(500).json({ error: 'PAYLOAD_NOT_OK', detail: payload && payload.error });
    return;
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(payload);
}
