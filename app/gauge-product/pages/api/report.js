/**
 * pages/api/report.js
 * PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
 *
 * Report generation API wrapper — Tier-1 mode.
 *
 * GET /api/report
 *   Invokes lens_report_generator.py --tier1 via child_process.
 *   Returns JSON: { status: "ok", files: [{name, label, path}] }
 *
 * Constraints:
 *   - Generator is the single source of truth — this wrapper adds no payload logic
 *   - No ZONE-1 data; no direct vault access
 *   - Stack traces not exposed to caller
 *   - Generator enforces ZONE-2 and forbidden-identifier validation
 *
 * Authority: PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
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
