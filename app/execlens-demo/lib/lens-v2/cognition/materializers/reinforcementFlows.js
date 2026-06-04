'use strict'

const OBJECT_ID = 'reinforcement_flows'

const CONDITION_TYPE_LABELS = {
  DELIVERY_PRESSURE_CONCENTRATION: 'DELIVERY PRESSURE',
  DEPENDENCY_CHOKE_POINT: 'DEPENDENCY CHOKE POINT',
  PROPAGATION_ASYMMETRY: 'PROPAGATION ASYMMETRY',
  STRUCTURAL_MASS_CONCENTRATION: 'STRUCTURAL MASS',
  CROSS_DOMAIN_COUPLING_PRESSURE: 'COUPLING PRESSURE',
  GOVERNANCE_COVERAGE_STATUS: 'GOVERNANCE COVERAGE',
  COMPOUND_CONVERGENCE: 'COMPOUND CONVERGENCE',
  EXECUTION_FRAGILITY: 'EXECUTION FRAGILITY',
  EXECUTION_CONSTRICTION: 'EXECUTION CONSTRICTION',
  STRUCTURAL_BOUNDARY_DIVERGENCE: 'BOUNDARY DIVERGENCE',
  COUPLING_INERTIA: 'COUPLING INERTIA',
}

function isActivated(sig) {
  return sig.severity !== 'NOMINAL' && sig.activation_state !== 'NOMINAL' && sig.activation_state !== 'CLUSTER_BALANCED'
}

function materialize(cip) {
  const fr = cip.fullReport || cip
  const sigs = (fr.signal_interpretations || []).filter(isActivated)
  const blocks = fr.evidence_blocks || []
  const registry = fr.semantic_domain_registry || []

  if (sigs.length === 0) return null

  const coPresenceSigs = sigs.filter(s => typeof s.co_presence === 'string' && s.co_presence.length > 0)

  const domainSignalTypes = {}
  for (const sig of sigs) {
    const concText = (sig.concentration || '').toLowerCase()
    const sigType = sig.signal_family || sig.condition_type || sig.signal_id
    if (!sigType || !concText) continue
    for (const d of registry) {
      const nameMatch = d.domain_name && concText.includes(d.domain_name.toLowerCase())
      const labelMatch = d.business_label && concText.includes(d.business_label.toLowerCase())
      if (nameMatch || labelMatch) {
        const key = d.domain_id || d.domain_name
        if (!domainSignalTypes[key]) domainSignalTypes[key] = new Set()
        domainSignalTypes[key].add(sigType)
      }
    }
  }
  const amplificationDomains = Object.entries(domainSignalTypes)
    .filter(([, types]) => types.size >= 2)
    .map(([domain, types]) => ({ domain, type_count: types.size, types: [...types] }))

  const topFlows = []
  for (const [domain, types] of Object.entries(domainSignalTypes)) {
    const typeArr = [...types]
    if (typeArr.length < 2) continue
    const domainLabel = registry.find(d => d.domain_id === domain || d.domain_name === domain)?.business_label || domain
    for (let i = 0; i < typeArr.length; i++) {
      for (let j = i + 1; j < typeArr.length; j++) {
        topFlows.push({
          from_type: typeArr[i], from_type_label: CONDITION_TYPE_LABELS[typeArr[i]] || typeArr[i],
          to_type: typeArr[j], to_type_label: CONDITION_TYPE_LABELS[typeArr[j]] || typeArr[j],
          verb: 'reinforces', domain: domainLabel,
        })
      }
    }
  }

  const originDomains = blocks.filter(b => b.propagation_role === 'ORIGIN').map(b => b.domain_alias)

  const reinforcementCount = coPresenceSigs.length + amplificationDomains.length
  if (reinforcementCount === 0) return null

  const severity = reinforcementCount >= 5 ? 'HIGH'
    : reinforcementCount >= 3 ? 'ELEVATED'
    : 'MODERATE'

  const consequenceTypeSet = new Set(sigs.map(s => s.signal_family || s.condition_type || s.signal_id))
  const consequenceCount = consequenceTypeSet.size

  const affectedDomains = [...new Set([
    ...amplificationDomains.map(d => d.domain),
    ...originDomains,
  ])]

  return {
    surface_id: 'REINFORCEMENT_FLOWS',
    surface_name: 'Reinforcement Flows',
    severity,
    operational_summary: `${reinforcementCount} reinforcement relationship${reinforcementCount !== 1 ? 's' : ''} across ${consequenceCount} consequence type${consequenceCount !== 1 ? 's' : ''} — ${coPresenceSigs.length > 0 ? `${coPresenceSigs.length} co-presence signal${coPresenceSigs.length !== 1 ? 's' : ''}` : ''}${coPresenceSigs.length > 0 && amplificationDomains.length > 0 ? ', ' : ''}${amplificationDomains.length > 0 ? `${amplificationDomains.length} amplification domain${amplificationDomains.length !== 1 ? 's' : ''}` : ''}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Multiple consequence types reinforce each other — risks compound rather than exist independently, requiring systemic rather than isolated response'
      : 'Some reinforcement present between consequence types — monitor for compounding dynamics',
    evidence_density: reinforcementCount,
    affected_domains: affectedDomains,
    constituents: {
      reinforcement_count: reinforcementCount,
      co_presence_signals: coPresenceSigs.length,
      amplification_domains: amplificationDomains,
      top_flows: topFlows.slice(0, 5),
    },
    trace_sources: ['signal_interpretations', 'evidence_blocks'],
  }
}

module.exports = { materialize, OBJECT_ID }
