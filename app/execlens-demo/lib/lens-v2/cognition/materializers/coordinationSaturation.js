'use strict'

const OBJECT_ID = 'coordination_saturation'

function isActivated(sig) {
  return sig.severity !== 'NOMINAL' && sig.activation_state !== 'NOMINAL' && sig.activation_state !== 'CLUSTER_BALANCED'
}

function materialize(cip) {
  const fr = cip.fullReport || cip
  const se = fr.structural_enrichment || {}
  const sigs = (fr.signal_interpretations || []).filter(isActivated)

  if (!se.available || !se.centrality) return null

  const spines = se.centrality.top_structural_spines || []
  const roleSummary = se.centrality.role_summary || {}
  const hubCount = (roleSummary.hub || 0) + (roleSummary.authority || 0)
  const totalClassified = Object.values(roleSummary).reduce((a, b) => a + b, 0)

  const coordinationNodes = spines.filter(s =>
    s.structural_role === 'hub' || s.structural_role === 'authority'
  )

  const concentrationSigs = sigs.filter(s =>
    (s.signal_name && (s.signal_name.includes('Absorption') || s.signal_name.includes('Cluster Pressure'))) ||
    s.severity === 'HIGH'
  )

  if (coordinationNodes.length === 0) return null

  const meanInDegree = coordinationNodes.reduce((sum, n) => sum + (n.in_degree || 0), 0) / coordinationNodes.length
  const maxInDegree = Math.max(...coordinationNodes.map(n => n.in_degree || 0))
  const hubRatio = totalClassified > 0 ? hubCount / totalClassified : 0

  const severity = concentrationSigs.length >= 2 && hubRatio > 0.15 ? 'HIGH'
    : concentrationSigs.length >= 1 || hubRatio > 0.2 ? 'ELEVATED'
    : hubRatio > 0.1 ? 'MODERATE'
    : 'LOW'

  const constituents = coordinationNodes.slice(0, 5).map(n => ({
    path: n.path,
    role: n.structural_role,
    in_degree: n.in_degree,
    out_degree: n.out_degree,
    centrality_rank: n.centrality_rank,
  }))

  return {
    surface_id: 'COORDINATION_SATURATION',
    surface_name: 'Coordination Saturation',
    severity,
    operational_summary: `${hubCount} coordination hub${hubCount !== 1 ? 's' : ''} absorb structural load — peak inbound dependency ${maxInDegree}, mean ${Math.round(meanInDegree * 10) / 10}${concentrationSigs.length > 0 ? ` with ${concentrationSigs.length} concentration signal${concentrationSigs.length !== 1 ? 's' : ''} active` : ''}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Coordination hubs carry disproportionate coupling — changes to these files amplify across the dependency graph'
      : 'Coordination load is distributed — no immediate concentration risk',
    evidence_density: coordinationNodes.length + concentrationSigs.length,
    affected_domains: coordinationNodes.slice(0, 5).map(n => n.path.split('/').slice(-2).join('/')),
    constituents,
    hub_ratio: Math.round(hubRatio * 100),
    trace_sources: ['structural_enrichment.centrality'],
  }
}

module.exports = { materialize, OBJECT_ID }
