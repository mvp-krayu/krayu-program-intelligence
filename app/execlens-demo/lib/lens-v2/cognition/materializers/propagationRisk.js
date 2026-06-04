'use strict'

const OBJECT_ID = 'propagation_risk'

function isActivated(sig) {
  return sig.severity !== 'NOMINAL' && sig.activation_state !== 'NOMINAL' && sig.activation_state !== 'CLUSTER_BALANCED'
}

function materialize(cip) {
  const fr = cip.fullReport || cip
  const blocks = fr.evidence_blocks || []
  const sigs = (fr.signal_interpretations || []).filter(isActivated)
  const ps = fr.propagation_summary || {}

  if (blocks.length === 0) return null

  const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
  const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
  const receivers = blocks.filter(b => b.propagation_role === 'RECEIVER')

  const coPresenceSigs = sigs.filter(s => s.co_presence && s.co_presence.length > 0)
  const concentratedSigs = sigs.filter(s => s.concentration)

  const chainLength = origins.length + passThroughs.length + receivers.length
  const severity = (origins.length >= 2 && receivers.length >= 2) ? 'HIGH'
    : (origins.length >= 1 && passThroughs.length >= 1 && receivers.length >= 1) ? 'ELEVATED'
    : chainLength > 2 ? 'MODERATE'
    : 'LOW'

  const chain = [
    ...origins.map(o => ({ domain: o.domain_alias, role: 'ORIGIN', grounding: o.grounding_status })),
    ...passThroughs.map(p => ({ domain: p.domain_alias, role: 'PASS_THROUGH', grounding: p.grounding_status })),
    ...receivers.map(r => ({ domain: r.domain_alias, role: 'RECEIVER', grounding: r.grounding_status })),
  ]

  const concentrationPattern = concentratedSigs.length > sigs.length * 0.5 ? 'concentrated' : 'distributed'

  return {
    surface_id: 'PROPAGATION_RISK',
    surface_name: 'Propagation Risk',
    severity,
    operational_summary: passThroughs.length > 0
      ? `Pressure propagates from ${origins.length} origin${origins.length !== 1 ? 's' : ''} through ${passThroughs.length} corridor${passThroughs.length !== 1 ? 's' : ''} to ${receivers.length} receiver${receivers.length !== 1 ? 's' : ''} — signal concentration ${concentrationPattern}`
      : `Pressure propagates directly from ${origins.length} origin${origins.length !== 1 ? 's' : ''} to ${receivers.length} receiver${receivers.length !== 1 ? 's' : ''} — no intermediate corridors detected, signal concentration ${concentrationPattern}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Multi-domain pressure propagation active — changes at origins amplify through corridors to receivers'
      : 'Pressure propagation paths present but not under elevated structural load',
    evidence_density: chainLength + coPresenceSigs.length,
    affected_domains: chain.map(c => c.domain),
    constituents: {
      chain,
      origins: origins.length,
      pass_throughs: passThroughs.length,
      receivers: receivers.length,
      co_presence_signals: coPresenceSigs.length,
      concentration_pattern: concentrationPattern,
    },
    trace_sources: ['evidence_blocks', 'signal_interpretations', 'propagation_summary'],
  }
}

module.exports = { materialize, OBJECT_ID }
