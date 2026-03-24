/**
 * pages/api/execlens.js
 * PIOS-42.24-RUN01-CONTRACT-v1
 *
 * ExecLens API route — delegates to Python adapters.
 * Topology route restored to 42.7 structural hierarchy adapter (42.24 parity restoration).
 * No data synthesized here. All content from locked governed artifacts.
 *
 * Query params:
 *   ?query=GQ-001        — retrieve structured data for one query (42.4 adapter)
 *   ?list=true           — retrieve list of all available queries (42.4 adapter)
 *   ?overview=true       — retrieve landing gauge strip metrics (42.6 adapter)
 *   ?topology=true       — retrieve structural topology hierarchy (42.7 adapter)
 *   ?topology=true&highlight=GQ-003  — topology with query-adapted highlighting
 */

import { execFile } from 'child_process'
import path from 'path'

const REPO_ROOT = process.env.REPO_ROOT
  || path.resolve(__dirname, '..', '..', '..', '..')

const ADAPTER_42_4  = path.join(REPO_ROOT, 'scripts', 'pios', '42.4',  'execlens_adapter.py')
const ADAPTER_42_6  = path.join(REPO_ROOT, 'scripts', 'pios', '42.6',  'execlens_overview_adapter.py')
const ADAPTER_42_7  = path.join(REPO_ROOT, 'scripts', 'pios', '42.7',  'execlens_topology_adapter.py')
const ADAPTER_42_23 = path.join(REPO_ROOT, 'scripts', 'pios', '42.23', 'execlens_wowchain_adapter.py')

function runScript(scriptPath, args, res) {
  execFile('python3', [scriptPath, ...args], { timeout: 30000 }, (err, stdout, stderr) => {
    if (err) {
      const message = stderr || err.message || 'adapter execution failed'
      return res.status(400).json({ error: message.trim() })
    }
    try {
      const data = JSON.parse(stdout)
      return res.status(200).json(data)
    } catch (parseErr) {
      return res.status(500).json({
        error: 'JSON parse error from adapter',
        raw: stdout.slice(0, 500),
      })
    }
  })
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const { query: queryId, list, overview, topology, highlight } = req.query

  // Overview metrics for landing gauge strip (42.6)
  if (overview === 'true') {
    return runScript(ADAPTER_42_6, [], res)
  }

  // 42.7 structural topology — query-adapted highlighting (42.24 parity restoration)
  if (topology === 'true') {
    const args = []
    if (highlight) {
      args.push('--query', String(highlight).toUpperCase().replace(/[^A-Z0-9\-]/g, ''))
    }
    return runScript(ADAPTER_42_7, args, res)
  }

  // Query list (42.4)
  if (list === 'true') {
    return runScript(ADAPTER_42_4, ['--list'], res)
  }

  // Single query (42.4)
  if (!queryId) {
    return res.status(400).json({ error: 'query parameter required (e.g. ?query=GQ-001)' })
  }

  const sanitized = String(queryId).toUpperCase().replace(/[^A-Z0-9\-]/g, '')
  if (!sanitized) {
    return res.status(400).json({ error: 'invalid query parameter' })
  }

  return runScript(ADAPTER_42_4, [sanitized], res)
}
