'use strict'

const OBJECT_ID = 'delivery_fragility'

const SEVERITY_ORDER = { HIGH: 0, ELEVATED: 1, MODERATE: 2, LOW: 3, NOMINAL: 4 }

function maxSeverity(items) {
  let best = 'NOMINAL'
  for (const item of items) {
    const sev = item.severity || item
    if ((SEVERITY_ORDER[sev] ?? 5) < (SEVERITY_ORDER[best] ?? 5)) best = sev
  }
  return best
}

function isActivated(sig) {
  return sig.severity !== 'NOMINAL' && sig.activation_state !== 'NOMINAL' && sig.activation_state !== 'CLUSTER_BALANCED'
}

function materialize(cip) {
  const fr = cip.fullReport || cip
  const sigs = (fr.signal_interpretations || []).filter(isActivated)
  const blocks = fr.evidence_blocks || []
  const ps = fr.propagation_summary || {}

  const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
  if (origins.length === 0 && sigs.length === 0) return null

  const originDomains = origins.map(o => o.domain_alias)
  const highSigs = sigs.filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED')

  const severity = highSigs.length >= 2 ? 'HIGH'
    : highSigs.length >= 1 ? 'ELEVATED'
    : sigs.length > 2 ? 'MODERATE'
    : 'LOW'

  const constituents = []
  for (const origin of origins) {
    const domainSigs = sigs.filter(s =>
      s.concentration && s.concentration.toLowerCase().includes(origin.domain_alias.toLowerCase())
    )
    constituents.push({
      domain: origin.domain_alias,
      role: 'origin',
      grounding: origin.grounding_status,
      signal_count: domainSigs.length,
      peak_severity: domainSigs.length > 0 ? maxSeverity(domainSigs) : null,
    })
  }

  const pressureZone = ps.primary_zone_business_label || null

  return {
    surface_id: 'DELIVERY_FRAGILITY',
    surface_name: 'Delivery Fragility',
    severity,
    operational_summary: origins.length > 0
      ? `${origins.length} domain${origins.length !== 1 ? 's' : ''} ${origins.length !== 1 ? 'originate' : 'originates'} structural pressure with ${highSigs.length} elevated-or-higher signal${highSigs.length !== 1 ? 's' : ''} — delivery paths carry concentrated load${pressureZone ? ` at ${pressureZone}` : ''}`
      : `${sigs.length} active pressure signal${sigs.length !== 1 ? 's' : ''} ${sigs.length !== 1 ? 'indicate' : 'indicates'} structural stress on delivery paths`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Changes touching pressure-origin domains propagate risk through execution corridors — deployment requires structural awareness'
      : 'Delivery paths under moderate structural load — monitor for concentration drift',
    evidence_density: origins.length + highSigs.length,
    affected_domains: originDomains,
    constituents,
    trace_sources: ['signal_interpretations', 'evidence_blocks', 'propagation_summary'],
  }
}

module.exports = { materialize, OBJECT_ID }
