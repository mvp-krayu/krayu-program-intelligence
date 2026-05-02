/**
 * pages/api/generate-report.js
 * PI.LENS.RUNTIME-SELECTOR-AND-GENERATE-INTEGRATION.01
 *
 * GET /api/generate-report?client=<client>&run=<run>
 *   Invokes scripts/pios/lens_generate.sh for the selected client/run.
 *   Returns JSON with status and report API URLs.
 *
 * Security:
 *   - client and run validated against [A-Za-z0-9._-]+ before any execution
 *   - Shell invoked via execFile(bash, [...]) — no string interpolation into shell
 *   - Stack traces not exposed to caller
 */

import { execFile } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT  = path.resolve(__dirname, '..', '..', '..', '..')
const WRAPPER    = path.join(REPO_ROOT, 'scripts', 'pios', 'lens_generate.sh')
const TIMEOUT_MS = 120000
const SAFE_ID    = /^[A-Za-z0-9._-]+$/

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ status: 'error', reason: 'METHOD_NOT_ALLOWED' })
  }

  const client = req.query.client || req.body?.client
  const run    = req.query.run    || req.body?.run

  if (!client || !run) {
    return res.status(400).json({ status: 'error', reason: 'CLIENT_AND_RUN_REQUIRED' })
  }
  if (!SAFE_ID.test(client) || !SAFE_ID.test(run)) {
    return res.status(400).json({ status: 'error', reason: 'INVALID_IDENTIFIER' })
  }

  execFile(
    'bash',
    [WRAPPER, '--client', client, '--run', run],
    { cwd: REPO_ROOT, timeout: TIMEOUT_MS },
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          reason: 'GENERATION_FAILED',
          detail: err.code ? `exit ${err.code}` : 'TIMEOUT',
        })
      }

      const base    = `clients/${client}/psee/runs/${run}/reports`
      const apiBase = `/api/report-file?source=psee&client=${client}&runId=${run}`

      return res.status(200).json({
        status: 'success',
        client,
        run,
        reports: {
          tier1_narrative: `${base}/lens_tier1_narrative_brief.html`,
          tier1_evidence:  `${base}/lens_tier1_evidence_brief.html`,
          tier2_diagnostic:`${base}/lens_tier2_diagnostic_narrative.html`,
          decision:        `${base}/lens_decision_surface.html`,
          graph_state:     `${base}/graph_state.json`,
        },
        report_urls: {
          tier1_narrative: `${apiBase}&name=lens_tier1_narrative_brief.html`,
          tier1_evidence:  `${apiBase}&name=lens_tier1_evidence_brief.html`,
          tier2_diagnostic:`${apiBase}&name=lens_tier2_diagnostic_narrative.html`,
          decision:        `${apiBase}&name=lens_decision_surface.html`,
        },
      })
    }
  )
}
