/**
 * pages/api/gauge.js
 * GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01
 *
 * Gauge intelligence API route — reads from local governed artifacts.
 * Returns dimensions, score, and confidence from gauge_state.json.
 *
 * Source: clients/blueedge/psee/runs/run_01_authoritative/package/
 * Governed by: PSEE-GAUGE.0 / PSEE-RUNTIME.5
 */

import fs   from 'fs'
import path from 'path'

const REPO_ROOT  = path.resolve(process.cwd(), '..', '..')
const PACKAGE_DIR = process.env.GAUGE_PACKAGE_DIR || path.join(
  REPO_ROOT,
  'clients', 'blueedge', 'psee', 'runs', 'run_01_authoritative', 'package'
)

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (_) {
    return null
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const gaugeState      = readJson(path.join(PACKAGE_DIR, 'gauge_state.json'))
  const coverageState   = readJson(path.join(PACKAGE_DIR, 'coverage_state.json'))
  const recontruction   = readJson(path.join(PACKAGE_DIR, 'reconstruction_state.json'))

  if (!gaugeState) {
    return res.status(503).json({
      error: 'Gauge state unavailable',
      detail: `Local governed artifact not found: ${path.join(PACKAGE_DIR, 'gauge_state.json')}`
    })
  }

  return res.status(200).json({
    run_id:           gaugeState.run_id,
    execution_status: gaugeState.state?.execution_status,
    dimensions:       gaugeState.dimensions || {},
    score:            gaugeState.score      || {},
    projection:       gaugeState.projection || {},
    confidence:       gaugeState.confidence || {},
    coverage:         coverageState         || null,
    reconstruction:   recontruction         || null,
    source:           'gauge_state.json / coverage_state.json / reconstruction_state.json',
  })
}
