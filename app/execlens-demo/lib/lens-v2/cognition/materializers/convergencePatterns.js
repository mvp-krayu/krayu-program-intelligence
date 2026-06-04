'use strict'

const OBJECT_ID = 'convergence_patterns'

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
  const se = fr.structural_enrichment || {}

  if (sigs.length === 0 && blocks.length === 0) return null

  const domainConditions = {}
  for (const sig of sigs) {
    const concText = (sig.concentration || '').toLowerCase()
    const condType = sig.condition_type || sig.signal_family || sig.signal_id
    if (!condType) continue
    for (const d of registry) {
      const nameMatch = d.domain_name && concText.includes(d.domain_name.toLowerCase())
      const labelMatch = d.business_label && concText.includes(d.business_label.toLowerCase())
      const idMatch = d.domain_id && concText.includes(d.domain_id.toLowerCase())
      if (nameMatch || labelMatch || idMatch) {
        const key = d.domain_id || d.domain_name
        if (!domainConditions[key]) domainConditions[key] = new Set()
        domainConditions[key].add(condType)
      }
    }
    for (const block of blocks) {
      const alias = (block.domain_alias || '').toLowerCase()
      if (alias && concText.includes(alias)) {
        if (!domainConditions[alias]) domainConditions[alias] = new Set()
        domainConditions[alias].add(condType)
      }
    }
  }

  if (se.available) {
    if (se.fragility_surface) {
      for (const h of (se.fragility_surface.fragility_hotspots || [])) {
        const prefix = h.module_prefix || ''
        for (const d of registry) {
          if (d.domain_name && prefix.toLowerCase().includes(d.domain_name.toLowerCase().split(' ')[0])) {
            const key = d.domain_id || d.domain_name
            if (!domainConditions[key]) domainConditions[key] = new Set()
            domainConditions[key].add('EXECUTION_FRAGILITY')
            break
          }
        }
      }
    }
    if (se.boundary_divergence) {
      for (const m of (se.boundary_divergence.divergent_modules || [])) {
        const prefix = m.module_prefix || m.path || ''
        for (const d of registry) {
          if (d.domain_name && prefix.toLowerCase().includes(d.domain_name.toLowerCase().split(' ')[0])) {
            const key = d.domain_id || d.domain_name
            if (!domainConditions[key]) domainConditions[key] = new Set()
            domainConditions[key].add('STRUCTURAL_BOUNDARY_DIVERGENCE')
            break
          }
        }
      }
    }
  }

  const convergenceDomains = Object.entries(domainConditions)
    .filter(([, types]) => types.size >= 2)
    .map(([domain, types]) => {
      const regEntry = registry.find(d => d.domain_id === domain || d.domain_name === domain || d.domain_alias === domain)
      const domainLabel = regEntry ? (regEntry.business_label || regEntry.domain_name || domain) : domain
      const typeLabels = [...types].map(t => CONDITION_TYPE_LABELS[t] || t.replace(/_/g, ' '))
      return { domain: domainLabel, condition_count: types.size, condition_types: typeLabels }
    })
    .sort((a, b) => b.condition_count - a.condition_count)

  if (convergenceDomains.length === 0) return null

  const peakConditionCount = Math.max(...convergenceDomains.map(d => d.condition_count))
  const convergenceCount = convergenceDomains.length

  const severity = peakConditionCount >= 4 ? 'HIGH'
    : peakConditionCount >= 3 ? 'ELEVATED'
    : 'MODERATE'

  return {
    surface_id: 'CONVERGENCE_PATTERNS',
    surface_name: 'Convergence Patterns',
    severity,
    operational_summary: `${convergenceCount} domain${convergenceCount !== 1 ? 's' : ''} exhibit condition convergence — peak ${peakConditionCount} condition types on a single domain${convergenceCount > 1 ? `, ${convergenceCount} domains under multi-condition pressure` : ''}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Multiple independent condition types converge on the same domain — risk at these domains is compound, not additive'
      : 'Condition convergence present but below elevated threshold — domains face limited multi-condition pressure',
    evidence_density: convergenceDomains.reduce((sum, d) => sum + d.condition_count, 0),
    affected_domains: convergenceDomains.map(d => d.domain),
    constituents: {
      convergence_count: convergenceCount,
      peak_condition_count: peakConditionCount,
      convergence_domains: convergenceDomains,
    },
    trace_sources: ['signal_interpretations', 'semantic_domain_registry'],
  }
}

module.exports = { materialize, OBJECT_ID }
