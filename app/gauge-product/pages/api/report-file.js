/**
 * pages/api/report-file.js
 * PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01
 *
 * Serves generated lens report HTML files by name.
 *
 * GET /api/report-file?name=lens_report_YYYYMMDD_HHMMSS.html
 *   → 200 text/html (inline — opens in browser)
 *
 * GET /api/report-file?name=lens_report_YYYYMMDD_HHMMSS.html&download=1
 *   → 200 text/html with Content-Disposition: attachment (triggers download)
 *
 * Security:
 *   - Filename validated against strict pattern before any FS access
 *   - path.basename() applied — no path traversal possible
 *   - Served only from approved reports directory
 *   - 400 on invalid filename pattern
 *   - 404 if file not found
 *
 * Authority: PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Repo root: pages/api/ → pages/ → app/gauge-product/ → app/ → k-pi-core/
const REPO_ROOT   = path.resolve(__dirname, '..', '..', '..', '..')
const REPORTS_DIR = path.join(REPO_ROOT, 'clients', 'blueedge', 'reports')

// Only serve files matching this exact pattern — rejects any traversal attempt
const VALID_FILENAME = /^lens_report_\d{8}_\d{6}\.html$/

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  const { name, download } = req.query

  if (!name || typeof name !== 'string' || !VALID_FILENAME.test(name)) {
    return res.status(400).json({ status: 'error', reason: 'INVALID_FILENAME' })
  }

  // path.basename() eliminates any traversal sequences before join
  const filePath = path.join(REPORTS_DIR, path.basename(name))

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
