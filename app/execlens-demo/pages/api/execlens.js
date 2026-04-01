/**
 * pages/api/execlens.js
 * PIOS-42.23 + ENL-010 restoration
 *
 * ExecLens API route — delegates to Python adapters.
 * No data synthesized here. All content from governed artifacts.
 *
 * Query params:
 *   ?query=GQ-001
 *   ?list=true
 *   ?overview=true
 *   ?topology=true                    — 42.23 WOW topology (governed)
 *   ?enl=GQ-003                       — ENL chain reveal
 *   ?persona=EXECUTIVE&query=GQ-003   — persona projection
 *   ?status=true                      — semantic path state
 */

import { execFile } from 'child_process'
import fs from 'fs'
import path from 'path'

const REPO_ROOT = process.env.REPO_ROOT
  || path.resolve(__dirname, '..', '..', '..', '..')

// Core adapters
const ADAPTER_42_4  = path.join(REPO_ROOT, 'scripts', 'pios', '42.4',  'execlens_adapter.py')
const ADAPTER_42_6  = path.join(REPO_ROOT, 'scripts', 'pios', '42.6',  'execlens_overview_adapter.py')
const ADAPTER_42_23 = path.join(REPO_ROOT, 'scripts', 'pios', '42.23', 'execlens_wowchain_adapter.py')
const ADAPTER_42_7  = path.join(REPO_ROOT, 'scripts', 'pios', '42.7',  'execlens_topology_adapter.py')

// ENL restoration adapters
const ADAPTER_42_13 = path.join(REPO_ROOT, 'scripts', 'pios', '42.13', 'demo_activate.py')
const ADAPTER_42_15 = path.join(REPO_ROOT, 'scripts', 'pios', '42.15', 'enl_console_adapter.py')
const ADAPTER_42_16 = path.join(REPO_ROOT, 'scripts', 'pios', '42.16', 'persona_view_map.py')

// pios/core adapter-derived signals — verified run, explicit fixed path (binding.yaml v0.2)
// Binding contract: pios/demo/golden/binding.yaml
// Verification run: runs/pios/adapter/run_01_demo_compat_verification/
const ADAPTER_PIOS_SOURCE = path.join(
  REPO_ROOT, 'runs', 'pios', 'adapter',
  'run_01_demo_compat_verification', 'demo_compat_output.json'
)

function runScript(scriptPath, args, res) {
  return new Promise((resolve) => {
    execFile('python3', [scriptPath, ...args], { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        const message = stderr || err.message || 'adapter execution failed'
        res.status(400).json({ error: message.trim() })
      } else {
        try {
          const data = JSON.parse(stdout)
          res.status(200).json(data)
        } catch {
          res.status(500).json({
            error: 'JSON parse error from adapter',
            raw: stdout.slice(0, 500),
          })
        }
      }
      resolve()
    })
  })
}

// ENL: text-return handler (verbatim output)
function runScriptText(scriptPath, args, res) {
  return new Promise((resolve) => {
    execFile('python3', [scriptPath, ...args], { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        const message = stderr || err.message || 'adapter error'
        res.status(400).json({ error: message.trim() })
      } else {
        res.status(200).json({ text: stdout })
      }
      resolve()
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const {
    query: queryId,
    list,
    overview,
    topology,
    highlight,
    enl,
    persona,
    status
  } = req.query

  // ENL: semantic path status
  if (status === 'true') {
    return runScriptText(ADAPTER_42_13, ['--status'], res)
  }

  // ENL: chain reveal
  if (enl) {
    const sanitized = String(enl).toUpperCase().replace(/[^A-Z0-9\-]/g, '')
    if (!sanitized) {
      return res.status(400).json({ error: 'invalid enl parameter' })
    }
    return runScriptText(ADAPTER_42_15, ['--query', sanitized], res)
  }

  // ENL: persona projection
  if (persona) {
    const sanitizedPersona = String(persona).toUpperCase().replace(/[^A-Z]/g, '')
    const sanitizedQuery   = String(queryId || '').toUpperCase().replace(/[^A-Z0-9\-]/g, '')

    const ALLOWED = ['EXECUTIVE', 'CTO', 'ANALYST']

    if (!ALLOWED.includes(sanitizedPersona)) {
      return res.status(400).json({ error: 'invalid persona — must be EXECUTIVE, CTO, or ANALYST' })
    }

    if (!sanitizedQuery) {
      return res.status(400).json({ error: 'query parameter required for persona view' })
    }

    return runScriptText(
      ADAPTER_42_16,
      ['--persona', sanitizedPersona, '--query', sanitizedQuery],
      res
    )
  }

  // 42.6 overview
  if (overview === 'true') {
    return runScript(ADAPTER_42_6, [], res)
  }

  // 42.7 structural topology — query-adapted highlighting (42.25 parity restoration)
  if (topology === 'true') {
    const args = []
    if (highlight) {
      args.push('--query', String(highlight).toUpperCase().replace(/[^A-Z0-9\-]/g, ''))
    }
    return runScript(ADAPTER_42_7, args, res)
  }

  // query list
  if (list === 'true') {
    return runScript(ADAPTER_42_4, ['--list'], res)
  }

  // single query
  if (!queryId) {
    return res.status(400).json({ error: 'query parameter required (e.g. ?query=GQ-001)' })
  }

  const sanitized = String(queryId).toUpperCase().replace(/[^A-Z0-9\-]/g, '')
  if (!sanitized) {
    return res.status(400).json({ error: 'invalid query parameter' })
  }

  // Binding: load adapter-derived signals from verified pre-computed run (ADAPTER_PIOS_SOURCE).
  // Fail-closed — no silent fallback to legacy signal source.
  let adapterSignals
  try {
    const raw = fs.readFileSync(ADAPTER_PIOS_SOURCE, 'utf8')
    const adapterData = JSON.parse(raw)
    adapterSignals = adapterData.signals
    if (!Array.isArray(adapterSignals)) {
      throw new Error('signals field missing or not an array')
    }
  } catch (e) {
    return res.status(500).json({
      error: `ADAPTER SIGNALS UNAVAILABLE — binding source unreadable: ${e.message}`,
      source: ADAPTER_PIOS_SOURCE,
    })
  }

  // Get query context (navigation, template_section, query_id, aggregate_confidence) from
  // 42.4 chain. Inject adapter signals into response — signals are now adapter-derived only.
  await new Promise((resolve) => {
    execFile('python3', [ADAPTER_42_4, sanitized], { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        const message = stderr || err.message || 'adapter execution failed'
        res.status(400).json({ error: message.trim() })
      } else {
        try {
          const queryContext = JSON.parse(stdout)
          // Replace legacy implicit signal source with adapter-derived canonical signal set
          queryContext.signals = adapterSignals
          res.status(200).json(queryContext)
        } catch {
          res.status(500).json({
            error: 'JSON parse error from adapter',
            raw: stdout.slice(0, 500),
          })
        }
      }
      resolve()
    })
  })
}
