/**
 * pages/api/report-file.js
 * PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
 * PI.SECOND-CLIENT.STEP14H.REPORT-API-BINDING.01
 *
 * Serves generated lens report HTML files by name.
 *
 * GET /api/report-file?name=<filename>
 *   → 200 text/html (inline — opens in browser)
 *
 * GET /api/report-file?name=<filename>&download=1
 *   → 200 text/html with Content-Disposition: attachment (triggers download)
 *
 * GET /api/report-file?name=<filename>&client=<client>&runId=<run_id>
 *   → client-aware routing: clients/<client>/reports/tier1/<name> (tier1)
 *   →                       clients/<client>/reports/tier2/<name> (tier2)
 *   → no fallback to BlueEdge when client/runId provided
 *
 * Accepted filename patterns:
 *   - lens_tier1_evidence_brief.html          → reports/tier1/
 *   - lens_tier1_evidence_brief_pub.html       → reports/tier1/publish/
 *   - lens_tier1_narrative_brief.html          → reports/tier1/
 *   - lens_tier1_narrative_brief_pub.html      → reports/tier1/publish/
 *   - lens_tier2_diagnostic_narrative.html     → reports/tier2/
 *   - lens_tier2_diagnostic_narrative_pub.html → reports/tier2/publish/
 *   - lens_decision_surface.html               → reports/decision/
 *   - lens_decision_surface_pub.html           → reports/decision/publish/
 *   - lens_report_YYYYMMDD_HHMMSS.html        → reports/ (legacy)
 *
 * Security:
 *   - Filename validated against whitelist before any FS access
 *   - path.basename() applied — no path traversal possible
 *   - Client/runId validated against path.basename() — no traversal
 *   - Served only from approved reports subdirectories
 *   - Client-aware path confirmed within clients/<client>/reports/tier1/, tier2/, or decision/
 *
 * Authority: PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
 *            PI.SECOND-CLIENT.STEP14H.REPORT-API-BINDING.01
 *            PI.SECOND-CLIENT.STEP16K.DECISION-SURFACE-ROUTE-FIX.01
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Repo root: pages/api → pages → app → gauge-product → repo root
const REPO_ROOT   = path.join(__dirname, '..', '..', '..', '..')
const REPORTS_DIR = process.env.REPORTS_DIR || null

const VALID_LEGACY    = /^lens_report_\d{8}_\d{6}\.html$/
const VALID_TIER1     = /^lens_tier1_(evidence_brief|narrative_brief)(_pub)?\.html$/
const VALID_TIER2     = /^lens_tier2_diagnostic_narrative(_pub)?\.html$/
const VALID_DECISION  = /^lens_decision_surface(_pub)?\.html$/

// Resolve the filesystem path for a validated filename (BlueEdge / default routing)
function resolveFilePath(name) {
  if (VALID_LEGACY.test(name)) {
    return path.join(REPORTS_DIR, path.basename(name))
  }
  if (VALID_TIER1.test(name)) {
    const isPublish = name.endsWith('_pub.html')
    const subdir    = isPublish ? path.join('tier1', 'publish') : 'tier1'
    return path.join(REPORTS_DIR, subdir, path.basename(name))
  }
  if (VALID_TIER2.test(name)) {
    const isPublish = name.endsWith('_pub.html')
    const subdir    = isPublish ? path.join('tier2', 'publish') : 'tier2'
    return path.join(REPORTS_DIR, subdir, path.basename(name))
  }
  if (VALID_DECISION.test(name)) {
    const isPublish = name.endsWith('_pub.html')
    const subdir    = isPublish ? path.join('decision', 'publish') : 'decision'
    return path.join(REPORTS_DIR, subdir, path.basename(name))
  }
  return null
}

// Resolve the filesystem path for a client-aware request.
// Returns null if any parameter fails validation.
// Supports tier1 and tier2 filenames.
function resolveClientFilePath(client, runId, name) {
  // Reject path traversal in client/runId — no slashes allowed
  if (path.basename(client) !== client || path.basename(runId) !== runId) {
    return null
  }
  const isTier1    = VALID_TIER1.test(name)
  const isTier2    = VALID_TIER2.test(name)
  const isDecision = VALID_DECISION.test(name)
  if (!isTier1 && !isTier2 && !isDecision) {
    return null
  }
  const tier      = isTier1 ? 'tier1' : isTier2 ? 'tier2' : 'decision'
  const isPublish = name.endsWith('_pub.html')
  const subdir    = isPublish ? path.join(tier, 'publish') : tier
  const filePath  = path.join(REPO_ROOT, 'clients', client, 'reports', subdir, path.basename(name))
  // Guard: resolved path must be under clients/<client>/reports/<tier>/
  const allowed   = path.join(REPO_ROOT, 'clients', client, 'reports', tier)
  if (!filePath.startsWith(allowed + path.sep)) {
    return null
  }
  return filePath
}

function serveHtml(res, filePath, name, download) {
  const html = fs.readFileSync(filePath, 'utf-8')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  if (download === '1') {
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
  } else {
    res.setHeader('Content-Disposition', `inline; filename="${name}"`)
  }
  return res.status(200).send(html)
}

// Resolve path for a psee run flat reports directory.
// source=psee routes to clients/<client>/psee/runs/<runId>/reports/<name> (no tier subdirs).
// Supports HTML reports and graph_state.json.
function resolvePseeRunFilePath(client, runId, name) {
  if (path.basename(client) !== client || path.basename(runId) !== runId) return null
  const safeName  = path.basename(name)
  const isHtml    = VALID_TIER1.test(safeName) || VALID_TIER2.test(safeName) || VALID_DECISION.test(safeName)
  const isJson    = safeName === 'graph_state.json'
  if (!isHtml && !isJson) return null
  const filePath = path.join(REPO_ROOT, 'clients', client, 'psee', 'runs', runId, 'reports', safeName)
  const allowed  = path.join(REPO_ROOT, 'clients', client, 'psee', 'runs', runId, 'reports')
  if (!filePath.startsWith(allowed + path.sep) && filePath !== path.join(allowed, safeName)) return null
  return { filePath, isJson }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  const { name, download, client, runId, source } = req.query

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ status: 'error', reason: 'INVALID_FILENAME' })
  }

  // ── PSEE run routing (source=psee) ────────────────────────────────────────
  if (source === 'psee') {
    if (!client || !runId) {
      return res.status(400).json({ status: 'error', reason: 'CLIENT_AND_RUN_ID_REQUIRED' })
    }
    const resolved = resolvePseeRunFilePath(client, runId, name)
    if (!resolved) {
      return res.status(400).json({ status: 'error', reason: 'INVALID_FILENAME' })
    }
    if (!fs.existsSync(resolved.filePath)) {
      return res.status(404).json({ status: 'error', reason: 'REPORT_NOT_FOUND' })
    }
    const content = fs.readFileSync(resolved.filePath, 'utf-8')
    if (resolved.isJson) {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).send(content)
    }
    return serveHtml(res, resolved.filePath, path.basename(name), download)
  }

  // ── Client-aware routing ──────────────────────────────────────────────────
  // Activated when client or runId is present — no fallback to BlueEdge.
  if (client || runId) {
    if (!client || !runId) {
      return res.status(400).json({ status: 'error', reason: 'CLIENT_AND_RUN_ID_REQUIRED' })
    }
    const filePath = resolveClientFilePath(client, runId, name)
    if (!filePath) {
      return res.status(400).json({ status: 'error', reason: 'INVALID_FILENAME' })
    }
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ status: 'error', reason: 'REPORT_NOT_FOUND' })
    }
    return serveHtml(res, filePath, name, download)
  }

  // ── BlueEdge / default routing (existing behavior — unchanged) ────────────
  if (!REPORTS_DIR) {
    return res.status(503).json({ status: 'error', reason: 'REPORTS_DIR_NOT_CONFIGURED' })
  }

  const filePath = resolveFilePath(name)
  if (!filePath) {
    return res.status(400).json({ status: 'error', reason: 'INVALID_FILENAME' })
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: 'error', reason: 'REPORT_NOT_FOUND' })
  }

  return serveHtml(res, filePath, name, download)
}
