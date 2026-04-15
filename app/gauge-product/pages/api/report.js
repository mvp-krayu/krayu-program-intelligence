/**
 * pages/api/report.js
 * PRODUCTIZE.LENS.REPORT.DELIVERY.01
 *
 * Report generation API wrapper.
 *
 * GET /api/report
 *   Invokes lens_report_generator.py via child_process.
 *   Returns JSON: { status: "ok", report_path: "<path>" }
 *
 * Constraints:
 *   - Generator is the single source of truth — this wrapper adds no payload logic
 *   - No ZONE-1 data; no direct vault access
 *   - Stack traces not exposed to caller
 *   - Generator enforces ZONE-2 and forbidden-identifier validation
 *
 * Authority: PRODUCTIZE.LENS.REPORT.DELIVERY.01
 */

import { execFile } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// __dirname is not available in ES modules — derive from import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Repo root: pages/api/ → pages/ → app/gauge-product/ → app/ → k-pi-core/
const REPO_ROOT   = path.resolve(__dirname, '..', '..', '..', '..')
const SCRIPT_PATH = path.join(REPO_ROOT, 'scripts', 'pios', 'lens_report_generator.py')

// Prefer the explicit system python3; fall back to PATH resolution
const PYTHON = fs.existsSync('/usr/bin/python3') ? '/usr/bin/python3' : 'python3'

const TIMEOUT_MS = 30000 // 30s — generator reads 5 fragment files and renders HTML

// Parse the absolute output path from generator stdout:
// "[LENS REPORT] Generated: /absolute/path/to/file.html"
function parseReportPath(stdout) {
  const match = stdout.match(/\[LENS REPORT\] Generated: (.+)/)
  return match ? match[1].trim() : null
}

// Return first non-empty stderr line, stripped of internal paths
function safeReason(stderr, killed) {
  if (killed) return 'GENERATOR_TIMEOUT'
  if (!stderr) return 'GENERATOR_FAILED'
  const first = stderr.split('\n').find(l => l.trim()) || ''
  // Strip anything that looks like a filesystem path
  const cleaned = first.replace(/\/[^\s]+/g, '[path]').trim()
  return cleaned.slice(0, 120) || 'GENERATOR_FAILED'
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  execFile(
    PYTHON,
    [SCRIPT_PATH],
    { timeout: TIMEOUT_MS, cwd: REPO_ROOT },
    (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          reason: safeReason(stderr, err.killed),
        })
      }

      const report_path = parseReportPath(stdout)
      if (!report_path) {
        return res.status(500).json({ status: 'error', reason: 'OUTPUT_PATH_NOT_FOUND' })
      }

      return res.status(200).json({ status: 'ok', report_path })
    }
  )
}
