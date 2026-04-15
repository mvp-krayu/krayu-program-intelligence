/**
 * pages/api/projection.js
 * PRODUCTIZE.LENS.PROJECTION.RUNTIME.01
 *
 * Projection API route — the ONLY served interface to vault claim content.
 *
 * Serves pre-generated static fragment files produced by:
 *   python3 scripts/pios/projection_runtime.py export-fragments \
 *     --output-dir clients/blueedge/vaults/run_01_authoritative/claims/fragments
 *
 * Query parameters:
 *   claim_id  — required, e.g. "CLM-09"
 *   zone      — required, "ZONE-1" | "ZONE-2"
 *   depth     — optional, default "L1" (only L1 fragments are available in V1)
 *
 * Zone enforcement:
 *   Zone is validated against the request's x-projection-zone header or
 *   query parameter. In V1, zone is caller-supplied with no session auth —
 *   session-level zone enforcement is deferred to the authentication stream.
 *
 * Fail-closed:
 *   Missing fragment → 404 ProjectionError
 *   Malformed fragment → 500 ProjectionError
 *   No partial content returned under any condition
 *
 * Governed by: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
 */

import fs   from 'fs'
import path from 'path'

const REPO_ROOT      = path.resolve(process.cwd(), '..', '..')
const FRAGMENTS_DIR  = process.env.PROJECTION_FRAGMENTS_DIR || path.join(
  REPO_ROOT,
  'clients', 'blueedge', 'vaults', 'run_01_authoritative', 'claims', 'fragments'
)

const VALID_ZONES  = new Set(['ZONE-1', 'ZONE-2', 'ZONE-3'])
const VALID_DEPTHS = new Set(['L1', 'L2', 'L3'])

function projectionError(reason, zone, depth, claimId, status) {
  return {
    statusCode: status,
    body: {
      error_type:   'PROJECTION_API_ERROR',
      reason,
      zone:         zone  || 'UNKNOWN',
      depth:        depth || 'UNKNOWN',
      ...(claimId ? { claim_id: claimId } : {}),
      generated_at: new Date().toISOString(),
    }
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error_type: 'METHOD_NOT_ALLOWED', reason: 'GET only' })
    return
  }

  const { claim_id, zone, depth = 'L1' } = req.query

  // Input validation (mirrors projection_runtime Stage 1)
  if (!claim_id) {
    const { statusCode, body } = projectionError('MISSING_REQUIRED_PARAMETER', zone, depth, null, 400)
    return res.status(statusCode).json(body)
  }

  if (!zone || !VALID_ZONES.has(zone)) {
    const { statusCode, body } = projectionError('INVALID_ZONE', zone, depth, claim_id, 400)
    return res.status(statusCode).json(body)
  }

  if (!VALID_DEPTHS.has(depth)) {
    const { statusCode, body } = projectionError('INVALID_DEPTH', zone, depth, claim_id, 400)
    return res.status(statusCode).json(body)
  }

  // V1: only L1 static fragments are available
  if (depth !== 'L1') {
    const { statusCode, body } = projectionError('DEPTH_NOT_AVAILABLE_V1', zone, depth, claim_id, 400)
    return res.status(statusCode).json(body)
  }

  // Locate fragment file
  const filename    = `${claim_id}-${zone}-L1.json`
  const fragmentPath = path.join(FRAGMENTS_DIR, filename)

  if (!fs.existsSync(fragmentPath)) {
    const { statusCode, body } = projectionError('CLAIM_NOT_IN_VAULT', zone, depth, claim_id, 404)
    return res.status(statusCode).json(body)
  }

  let payload
  try {
    payload = JSON.parse(fs.readFileSync(fragmentPath, 'utf8'))
  } catch (_) {
    const { statusCode, body } = projectionError('FRAGMENT_UNREADABLE', zone, depth, claim_id, 500)
    return res.status(statusCode).json(body)
  }

  // Serve error payloads with appropriate HTTP status (fail-closed, no partial content)
  if (payload.error_type) {
    return res.status(422).json(payload)
  }

  res.status(200).json(payload)
}
