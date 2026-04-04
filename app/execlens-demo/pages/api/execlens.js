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

function runScript(scriptPath, args, res) {
  execFile('python3', [scriptPath, ...args], { timeout: 30000 }, (err, stdout, stderr) => {
    if (err) {
      const message = stderr || err.message || 'adapter execution failed'
      return res.status(400).json({ error: message.trim() })
    }
    try {
      const data = JSON.parse(stdout)
      return res.status(200).json(data)
    } catch {
      return res.status(500).json({
        error: 'JSON parse error from adapter',
        raw: stdout.slice(0, 500),
      })
    }
  })
}

// ENL: text-return handler (verbatim output)
function runScriptText(scriptPath, args, res) {
  execFile('python3', [scriptPath, ...args], { timeout: 30000 }, (err, stdout, stderr) => {
    if (err) {
      const message = stderr || err.message || 'adapter error'
      return res.status(400).json({ error: message.trim() })
    }
    return res.status(200).json({ text: stdout })
  })
}

export default function handler(req, res) {
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

  return runScript(ADAPTER_42_4, [sanitized], res)
}
