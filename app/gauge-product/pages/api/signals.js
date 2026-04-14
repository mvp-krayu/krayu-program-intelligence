/**
 * pages/api/signals.js
 * GAUGE.RUNTIME.SIGNAL.VISIBILITY.01
 *
 * Signal availability API route — reads from governed signal_registry.json.
 * Returns signal list and evidence_confidence distribution.
 * Does NOT derive, transform, or infer signals.
 *
 * Source: docs/pios/41.4/signal_registry.json
 * Governed by: GAUGE.RUNTIME.SIGNAL.VISIBILITY.01
 */

import fs   from 'fs'
import path from 'path'

const REPO_ROOT       = path.resolve(process.cwd(), '..', '..')
const SIGNAL_REGISTRY = path.join(
  REPO_ROOT, 'docs', 'pios', '41.4', 'signal_registry.json'
)

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (_) {
    return null
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const registry = readJson(SIGNAL_REGISTRY)

  if (!registry) {
    return res.status(200).json({
      signals:        [],
      total:          0,
      by_confidence:  {},
      mounted:        false,
      source:         'signal_registry.json — not found',
    })
  }

  const signals = registry.signals || []

  // Aggregate by evidence_confidence — count only, no semantic transformation
  const by_confidence = {}
  for (const s of signals) {
    const conf = s.evidence_confidence || 'UNKNOWN'
    by_confidence[conf] = (by_confidence[conf] || 0) + 1
  }

  return res.status(200).json({
    signals,
    total:          signals.length,
    by_confidence,
    mounted:        signals.length > 0,
    registry_id:    registry.registry_id   || null,
    run_reference:  registry.run_reference || null,
    contract_id:    registry.contract_id   || null,
    source:         'docs/pios/41.4/signal_registry.json',
  })
}
