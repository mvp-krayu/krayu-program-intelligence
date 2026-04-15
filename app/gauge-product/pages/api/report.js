/**
 * pages/api/report.js
 * PRODUCTIZE.LENS.REPORT.DELIVERY.01
 *
 * Report generation API wrapper.
 *
 * GET /api/report
 *   Invokes lens_report_generator.py via child_process.
 *   Returns JSON: { status: "ok", report_path: "<absolute path>" }
 *
 * Constraints:
 *   - Generator is the single source of truth — this wrapper adds no payload logic
 *   - No ZONE-1 data; no direct vault access
 *   - Stack traces and internal paths not exposed to caller
 *   - Generator enforces ZONE-2 and forbidden-identifier validation
 *
 * Authority: PRODUCTIZE.LENS.REPORT.DELIVERY.01
 */

const { execFile } = require('child_process')
const path = require('path')

// Repo root is 4 levels up from pages/api/
const REPO_ROOT   = path.join(__dirname, '..', '..', '..', '..')
const SCRIPT_PATH = path.join(REPO_ROOT, 'scripts', 'pios', 'lens_report_generator.py')

const TIMEOUT_MS = 30_000 // 30s — generator reads 5 fragment files and renders HTML

// Parse the output path from generator stdout line:
// "[LENS REPORT] Generated: /absolute/path/to/file.html"
function parseReportPath(stdout) {
  const match = stdout.match(/\[LENS REPORT\] Generated: (.+)/)
  return match ? match[1].trim() : null
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  execFile(
    'python3',
    [SCRIPT_PATH],
    { timeout: TIMEOUT_MS, cwd: REPO_ROOT },
    (err, stdout, stderr) => {
      if (err) {
        // Do not expose stack traces or internal paths
        const reason = err.killed
          ? 'GENERATOR_TIMEOUT'
          : 'GENERATOR_FAILED'
        return res.status(500).json({ status: 'error', reason })
      }

      const report_path = parseReportPath(stdout)
      if (!report_path) {
        return res.status(500).json({ status: 'error', reason: 'OUTPUT_PATH_NOT_FOUND' })
      }

      return res.status(200).json({ status: 'ok', report_path })
    }
  )
}
