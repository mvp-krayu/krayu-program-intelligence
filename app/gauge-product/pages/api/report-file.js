/**
 * pages/api/report-file.js
 * PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
 *
 * Serves generated lens report HTML files by name.
 *
 * GET /api/report-file?name=<filename>
 *   → 200 text/html (inline — opens in browser)
 *
 * GET /api/report-file?name=<filename>&download=1
 *   → 200 text/html with Content-Disposition: attachment (triggers download)
 *
 * Accepted filename patterns:
 *   - lens_tier1_evidence_brief.html          → reports/tier1/
 *   - lens_tier1_evidence_brief_pub.html       → reports/tier1/publish/
 *   - lens_tier1_narrative_brief.html          → reports/tier1/
 *   - lens_tier1_narrative_brief_pub.html      → reports/tier1/publish/
 *   - lens_tier2_diagnostic_narrative.html     → reports/tier2/
 *   - lens_tier2_diagnostic_narrative_pub.html → reports/tier2/publish/
 *   - lens_report_YYYYMMDD_HHMMSS.html        → reports/ (legacy)
 *
 * Security:
 *   - Filename validated against whitelist before any FS access
 *   - path.basename() applied — no path traversal possible
 *   - Served only from approved reports subdirectories
 *
 * Authority: PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const REPORTS_DIR = process.env.REPORTS_DIR || null

const VALID_LEGACY   = /^lens_report_\d{8}_\d{6}\.html$/
const VALID_TIER1    = /^lens_tier1_(evidence_brief|narrative_brief)(_pub)?\.html$/
const VALID_TIER2    = /^lens_tier2_diagnostic_narrative(_pub)?\.html$/

// Resolve the filesystem path for a validated filename
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
  return null
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  if (!REPORTS_DIR) {
    return res.status(503).json({ status: 'error', reason: 'REPORTS_DIR_NOT_CONFIGURED' })
  }

  const { name, download } = req.query

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ status: 'error', reason: 'INVALID_FILENAME' })
  }

  const filePath = resolveFilePath(name)
  if (!filePath) {
    return res.status(400).json({ status: 'error', reason: 'INVALID_FILENAME' })
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: 'error', reason: 'REPORT_NOT_FOUND' })
  }

  const html = fs.readFileSync(filePath, 'utf-8')

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  if (download === '1') {
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
  } else {
    res.setHeader('Content-Disposition', `inline; filename="${name}"`)
  }

  res.status(200).send(html)
}
