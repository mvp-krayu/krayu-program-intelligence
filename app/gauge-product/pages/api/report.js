/**
 * pages/api/report.js
 * PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
 * PI.SECOND-CLIENT.STEP16C.DIAGNOSTIC-REPORT-ROUTE.01
 *
 * Report generation API wrapper.
 *
 * GET /api/report
 *   Invokes lens_report_generator.py --deliverable tier1 (BlueEdge default).
 *   Returns JSON: { status: "ok", files: [{name, label, path}] }
 *
 * GET /api/report?client=<client>&runId=<runId>&deliverable=diagnostic
 *   Invokes generator with --client --run-id --deliverable diagnostic.
 *   Returns tier-2 diagnostic artifact for the named client/run.
 *
 * Constraints:
 *   - Generator is the single source of truth — this wrapper adds no payload logic
 *   - No ZONE-1 data; no direct vault access
 *   - Stack traces not exposed to caller
 *   - Generator enforces ZONE-2 and forbidden-identifier validation
 *   - client/runId validated against path.basename() — no path traversal
 *
 * Authority: PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
 *            PI.SECOND-CLIENT.STEP16C.DIAGNOSTIC-REPORT-ROUTE.01
 */

import { execFile } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const REPO_ROOT   = path.resolve(__dirname, '..', '..', '..', '..')
const SCRIPT_PATH = path.join(REPO_ROOT, 'scripts', 'pios', 'lens_report_generator.py')

const PYTHON = fs.existsSync('/usr/bin/python3') ? '/usr/bin/python3' : 'python3'

const TIMEOUT_MS = 90000 // 90s — tier-1 (4 artifacts) + tier-2 (2 artifacts)

const TIER1_LABELS = {
  'lens_tier1_evidence_brief.html':     'Evidence Brief (Internal)',
  'lens_tier1_evidence_brief_pub.html': 'Evidence Brief (Publish)',
  'lens_tier1_narrative_brief.html':    'Narrative Brief (Internal)',
  'lens_tier1_narrative_brief_pub.html':'Narrative Brief (Publish)',
}

const TIER2_LABELS = {
  'lens_tier2_diagnostic_narrative.html':     'Diagnostic Narrative (Internal)',
  'lens_tier2_diagnostic_narrative_pub.html': 'Diagnostic Narrative (Publish)',
}

const ALL_LABELS = { ...TIER1_LABELS, ...TIER2_LABELS }

// Parse all "[LENS REPORT] Generated: /path/to/file.html" lines from stdout
function parseAllReportPaths(stdout) {
  const results = []
  const re = /\[LENS REPORT\] Generated: (.+)/g
  let m
  while ((m = re.exec(stdout)) !== null) {
    results.push(m[1].trim())
  }
  return results
}

function safeReason(stderr, killed) {
  if (killed) return 'GENERATOR_TIMEOUT'
  if (!stderr) return 'GENERATOR_FAILED'
  const first = stderr.split('\n').find(l => l.trim()) || ''
  const cleaned = first.replace(/\/[^\s]+/g, '[path]').trim()
  return cleaned.slice(0, 120) || 'GENERATOR_FAILED'
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  const { client, runId, deliverable } = req.query

  // ── Client-scoped diagnostic (tier-2) generation ─────────────────────────
  if (deliverable === 'diagnostic') {
    if (!client || !runId) {
      return res.status(400).json({ status: 'error', reason: 'CLIENT_AND_RUN_ID_REQUIRED' })
    }
    // Path-traversal guard — no slashes or dots allowed in client/runId
    if (path.basename(client) !== client || path.basename(runId) !== runId) {
      return res.status(400).json({ status: 'error', reason: 'INVALID_CLIENT_OR_RUN_ID' })
    }
    execFile(
      PYTHON,
      [SCRIPT_PATH, '--client', client, '--run-id', runId, '--deliverable', 'diagnostic'],
      { timeout: TIMEOUT_MS, cwd: REPO_ROOT },
      (err, stdout, stderr) => {
        if (err) {
          return res.status(500).json({ status: 'error', reason: safeReason(stderr, err.killed) })
        }
        const absPaths = parseAllReportPaths(stdout).filter(p =>
          path.basename(p) in TIER2_LABELS
        )
        if (absPaths.length === 0) {
          return res.status(500).json({ status: 'error', reason: 'OUTPUT_PATH_NOT_FOUND' })
        }
        const files = absPaths.map(absPath => {
          const name  = path.basename(absPath)
          const label = TIER2_LABELS[name] || name
          const filePath = `/api/report-file?name=${encodeURIComponent(name)}&client=${encodeURIComponent(client)}&runId=${encodeURIComponent(runId)}`
          return { name, label, path: filePath }
        })
        return res.status(200).json({ status: 'ok', files })
      }
    )
    return
  }

  // ── Default: Tier-1 BlueEdge generation (existing behavior — unchanged) ───
  execFile(
    PYTHON,
    [SCRIPT_PATH, '--tier1'],
    { timeout: TIMEOUT_MS, cwd: REPO_ROOT },
    (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          reason: safeReason(stderr, err.killed),
        })
      }

      const absPaths = parseAllReportPaths(stdout)
      if (absPaths.length === 0) {
        return res.status(500).json({ status: 'error', reason: 'OUTPUT_PATH_NOT_FOUND' })
      }

      const files = absPaths.map(absPath => {
        const name  = path.basename(absPath)
        const label = ALL_LABELS[name] || name
        const filePath = `/api/report-file?name=${encodeURIComponent(name)}`
        return { name, label, path: filePath }
      })

      return res.status(200).json({ status: 'ok', files })
    }
  )
}
