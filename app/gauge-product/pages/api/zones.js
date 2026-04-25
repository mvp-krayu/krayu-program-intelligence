/**
 * pages/api/zones.js
 * TIER2.RUNTIME.QUERY.ENGINE.01
 *
 * Returns the derived zone list for the current canonical run.
 * Used by the Tier-2 workspace page to populate the zone inventory on load.
 *
 * GET /api/zones
 *   → BlueEdge canonical zones (default, no params required)
 *
 * GET /api/zones?client=<client_id>&runId=<run_id>
 *   → 41.x projection zones for the specified client/run
 *   → 404 NOT_AVAILABLE if 41.x artifacts are absent (no BlueEdge fallback)
 *
 * Returns:
 *   { status, run_id, inference_prohibition:"ACTIVE", context, zones:[...], total_zones }
 *
 * Zone list is deterministic — same canonical inputs produce the same zone set.
 */

import { execFile } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const REPO_ROOT   = path.resolve(__dirname, '..', '..', '..', '..')
const SCRIPT_PATH = path.join(REPO_ROOT, 'scripts', 'pios', 'tier2_query_engine.py')

const PYTHON     = fs.existsSync('/usr/bin/python3') ? '/usr/bin/python3' : 'python3'
const TIMEOUT_MS = 10000

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  const { client: clientId, runId } = req.query
  const useProjection = clientId && runId

  const args = useProjection
    ? [SCRIPT_PATH, '--list-zones', '--projection', '--client', clientId, '--run-id', runId]
    : [SCRIPT_PATH, '--list-zones']

  execFile(
    PYTHON,
    args,
    { timeout: TIMEOUT_MS, cwd: REPO_ROOT },
    (err, stdout) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          reason: err.killed ? 'ENGINE_TIMEOUT' : 'ENGINE_FAILURE',
        })
      }
      try {
        const data = JSON.parse(stdout.trim())
        if (data.status === 'NOT_AVAILABLE') {
          return res.status(404).json(data)
        }
        return res.status(200).json(data)
      } catch {
        return res.status(500).json({ status: 'error', reason: 'PARSE_FAILURE' })
      }
    }
  )
}
