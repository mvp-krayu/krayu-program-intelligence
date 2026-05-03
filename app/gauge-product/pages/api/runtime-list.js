/**
 * pages/api/runtime-list.js
 * PI.LENS.RUNTIME-SELECTOR-AND-GENERATE-INTEGRATION.01
 * PI.LENS.RUNTIME-BUNDLE-MAPPING.01
 *
 * GET /api/runtime-list
 *   Scans clients/<client>/psee/runs/<run>/ for eligible runtimes.
 *   Eligible = has vault/ AND semantic/ directories.
 *   Returns full bundle mapping:
 *     { client, display_run, report_run, vault_run, semantic_run,
 *       run (alias), base_path, reports_path, vault_path, semantic_path,
 *       graph_state_path, has_reports, has_vault, has_semantic }
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..')

// Known bundle overrides where vault_run differs from display_run.
// Isolated here for future discovery-based replacement.
// Key: "<client>::<display_run>"
const BUNDLE_OVERRIDES = {
  'blueedge::run_blueedge_productized_01_fixed': {
    vault_run:    'run_blueedge_productized_01',
    semantic_run: 'run_blueedge_productized_01_fixed',
  },
}

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
      const runDir      = path.join(runsDir, run)
      const hasVault    = fs.existsSync(path.join(runDir, 'vault'))
      const hasSemantic = fs.existsSync(path.join(runDir, 'semantic'))
      if (!hasVault || !hasSemantic) continue

      const override    = BUNDLE_OVERRIDES[`${client}::${run}`] || {}
      const vaultRun    = override.vault_run    || run
      const semanticRun = override.semantic_run || run

      const basePath   = `clients/${client}/psee/runs/${run}`
      const reportsDir = path.join(runDir, 'reports')
      const hasReports = fs.existsSync(path.join(reportsDir, 'lens_decision_surface.html'))

      runtimes.push({
        client,
        display_run:      run,
        report_run:       run,
        vault_run:        vaultRun,
        semantic_run:     semanticRun,
        run,                               // backward compat alias = display_run
        base_path:        basePath,
        reports_path:     `${basePath}/reports`,
        vault_path:       `clients/${client}/psee/runs/${vaultRun}/vault`,
        semantic_path:    `${basePath}/semantic`,
        graph_state_path: `${basePath}/reports/graph_state.json`,
        has_reports:      hasReports,
        has_vault:        hasVault,
        has_semantic:     hasSemantic,
      })
    }
  }

  return res.status(200).json(runtimes)
}
