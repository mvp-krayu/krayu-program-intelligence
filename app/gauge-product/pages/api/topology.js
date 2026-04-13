/**
 * pages/api/topology.js
 * GAUGE.STANDALONE.TOPOLOGY.DATASOURCE.ISOLATION.01
 *
 * Gauge topology API route — reads directly from local governed artifact.
 * NO dependency on ExecLens DEMO or any external service.
 *
 * Source: binding_envelope.json (clients/…/run_335c0575a080/binding/)
 * Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
 */

import fs   from 'fs'
import path from 'path'
import { validateEnvelope, buildRenderModel } from '../../lib/envelope_adapter'

// Canonical path relative to repo root (two levels up from app/gauge-product/)
const REPO_ROOT       = path.resolve(process.cwd(), '..', '..')
const DEFAULT_ENVELOPE = path.join(
  REPO_ROOT,
  'clients',
  '1de0d815-0721-58e9-bc8d-ca83e70fa903',
  'psee',
  'runs',
  'run_335c0575a080',
  'binding',
  'binding_envelope.json'
)

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const envelopePath = process.env.GAUGE_ENVELOPE_PATH || DEFAULT_ENVELOPE

  if (!fs.existsSync(envelopePath)) {
    return res.status(503).json({
      error: 'Topology source unavailable',
      detail: `Local governed artifact not found: ${envelopePath}`,
      source: 'binding_envelope.json'
    })
  }

  let envelope
  try {
    envelope = JSON.parse(fs.readFileSync(envelopePath, 'utf8'))
  } catch (err) {
    return res.status(503).json({
      error: 'Topology source parse error',
      detail: err.message,
      source: envelopePath
    })
  }

  try {
    validateEnvelope(envelope)
  } catch (err) {
    return res.status(503).json({
      error: 'Topology source validation failed',
      detail: err.message,
      source: envelopePath
    })
  }

  try {
    const model = buildRenderModel(envelope, envelopePath)
    return res.status(200).json(model)
  } catch (err) {
    return res.status(503).json({
      error: 'Topology render model derivation failed',
      detail: err.message,
      source: envelopePath
    })
  }
}
