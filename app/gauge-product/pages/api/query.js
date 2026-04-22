/**
 * pages/api/query.js
 * TIER2.RUNTIME.QUERY.ENGINE.01
 *
 * Tier-2 zone-scoped query endpoint — WHY, EVIDENCE, and TRACE modes.
 *
 * GET /api/query?zone_id=ZONE-01&mode=WHY
 * GET /api/query?zone_id=ZONE-01&mode=EVIDENCE[&scope=FULL]
 * GET /api/query?zone_id=ZONE-01&mode=TRACE
 *
 * Returns:
 *   WHY/EVIDENCE: { status, zone_id, mode, run_id, inference_prohibition:"ACTIVE",
 *                   result, evidence_basis, uncertainty }
 *   TRACE:        { status, zone_id, mode, run_id, inference_prohibition:"ACTIVE",
 *                   trace, evidence_basis, uncertainty }
 *
 * Constraints:
 *   - zone_id required, format ZONE-NN
 *   - mode required: WHY, EVIDENCE, or TRACE
 *   - zone_id must correspond to a derivable zone from canonical inputs
 *   - inference_prohibition:"ACTIVE" guaranteed in every success response
 *   - No ZONE-1 data; no direct vault access
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
const TIMEOUT_MS = 15000

const VALID_ZONE      = /^ZONE-\d{2}$/
const SUPPORTED_MODES = new Set(['WHY', 'EVIDENCE', 'TRACE'])

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  const { zone_id, mode, scope } = req.query

  if (!zone_id || !VALID_ZONE.test(zone_id)) {
    return res.status(400).json({
      status: 'error',
      reason: 'INVALID_PARAMS',
      detail: 'zone_id required; format: ZONE-NN',
    })
  }

  if (!mode) {
    return res.status(400).json({
      status: 'error',
      reason: 'INVALID_PARAMS',
      detail: 'mode required',
    })
  }

  if (!SUPPORTED_MODES.has(mode)) {
    return res.status(400).json({
      status: 'error',
      reason: 'INVALID_PARAMS',
      detail: 'mode must be WHY, EVIDENCE, or TRACE',
    })
  }

  const args = [SCRIPT_PATH, '--zone', zone_id, '--mode', mode]
  if (mode === 'EVIDENCE' && scope) args.push('--scope', scope)

  execFile(PYTHON, args, { timeout: TIMEOUT_MS, cwd: REPO_ROOT }, (err, stdout) => {
    if (err) {
      if (err.killed) {
        return res.status(500).json({ status: 'error', reason: 'ENGINE_TIMEOUT' })
      }
      // Non-zero exit may carry a structured error payload (e.g. ZONE_NOT_FOUND).
      // Attempt to parse stdout before falling back to ENGINE_FAILURE.
      try {
        const data = JSON.parse(stdout.trim())
        return res.status(200).json(data)
      } catch {
        return res.status(500).json({ status: 'error', reason: 'ENGINE_FAILURE' })
      }
    }
    try {
      const data = JSON.parse(stdout.trim())
      return res.status(200).json(data)
    } catch {
      return res.status(500).json({ status: 'error', reason: 'PARSE_FAILURE' })
    }
  })
}
