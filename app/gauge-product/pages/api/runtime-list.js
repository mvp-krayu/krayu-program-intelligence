/**
 * pages/api/runtime-list.js
 * PI.LENS.RUNTIME-SELECTOR-AND-GENERATE-INTEGRATION.01
 *
 * GET /api/runtime-list
 *   Scans clients/<client>/psee/runs/<run>/ for eligible runtimes.
 *   Eligible = has vault/ AND semantic/ directories.
 *   Returns list of {client, run, base_path, reports_path, graph_state_path, has_reports}.
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..')

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  const clientsDir = path.join(REPO_ROOT, 'clients')
  if (!fs.existsSync(clientsDir)) {
    return res.status(200).json([])
  }

  const runtimes = []

  let clientDirs
  try {
    clientDirs = fs.readdirSync(clientsDir)
      .filter(name => fs.statSync(path.join(clientsDir, name)).isDirectory())
  } catch {
    return res.status(200).json([])
  }

  for (const client of clientDirs) {
    const runsDir = path.join(clientsDir, client, 'psee', 'runs')
    if (!fs.existsSync(runsDir)) continue

    let runDirs
    try {
      runDirs = fs.readdirSync(runsDir)
        .filter(name => fs.statSync(path.join(runsDir, name)).isDirectory())
    } catch {
      continue
    }

    for (const run of runDirs) {
      const runDir  = path.join(runsDir, run)
      const hasVault    = fs.existsSync(path.join(runDir, 'vault'))
      const hasSemantic = fs.existsSync(path.join(runDir, 'semantic'))
      if (!hasVault || !hasSemantic) continue

      const reportsDir   = path.join(runDir, 'reports')
      const hasReports   = fs.existsSync(path.join(reportsDir, 'lens_decision_surface.html'))
      const basePath     = `clients/${client}/psee/runs/${run}`

      runtimes.push({
        client,
        run,
        base_path:        basePath,
        reports_path:     `${basePath}/reports`,
        graph_state_path: `${basePath}/reports/graph_state.json`,
        has_reports:      hasReports,
      })
    }
  }

  return res.status(200).json(runtimes)
}
