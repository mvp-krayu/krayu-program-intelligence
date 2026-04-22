/**
 * pages/api/zones.js
 * TIER2.RUNTIME.QUERY.ENGINE.01
 *
 * Returns the derived zone list for the current canonical run.
 * Used by the Tier-2 workspace page to populate the zone inventory on load.
 *
 * GET /api/zones
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

  execFile(
    PYTHON,
    [SCRIPT_PATH, '--list-zones'],
    { timeout: TIMEOUT_MS, cwd: REPO_ROOT },
    (err, stdout) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          reason: err.killed ? 'ENGINE_TIMEOUT' : 'ENGINE_FAILURE',
        })
      }
      try {
        return res.status(200).json(JSON.parse(stdout.trim()))
      } catch {
        return res.status(500).json({ status: 'error', reason: 'PARSE_FAILURE' })
      }
    }
  )
}
