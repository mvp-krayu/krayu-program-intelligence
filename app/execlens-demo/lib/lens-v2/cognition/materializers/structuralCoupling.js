'use strict'

// PICR Materializer: structural_coupling
// Sub-object of: constraint_inventory (PICP cognition object)
// Source: structural_enrichment.coupling_inertia
// Classification: DETERMINISTIC

const OBJECT_ID = 'structural_coupling'

function materialize(cip) {
  const fr = cip.fullReport || cip
  const se = fr.structural_enrichment || {}
  if (!se.available || !se.coupling_inertia) return null

  const ci = se.coupling_inertia
  const clusters = ci.inertia_clusters || []
  const systemIndex = ci.system_coupling_index || 0
  const biPairs = ci.bidirectional_pair_count || 0

  if (clusters.length === 0 && biPairs === 0) return null

  const registry = fr.semantic_domain_registry || []
  const affectedDomains = []
  for (const cl of clusters) {
    const modules = cl.modules || cl.members || []
    for (const mod of modules) {
      const match = registry.find(d => (typeof mod === 'string' ? mod : '').includes(d.domain_name || ''))
      if (match && !affectedDomains.includes(match.business_label || match.domain_name)) {
        affectedDomains.push(match.business_label || match.domain_name)
      }
    }
  }

  const totalModulesInClusters = clusters.reduce((sum, cl) => sum + (cl.modules || cl.members || []).length, 0)
  const sysIdxPct = systemIndex > 1 ? Math.round(systemIndex) : Math.round(systemIndex * 100)

  const severity = (clusters.length >= 3 || sysIdxPct > 40) ? 'HIGH'
    : (clusters.length >= 2 || sysIdxPct > 25) ? 'ELEVATED'
    : clusters.length >= 1 ? 'MODERATE'
    : 'LOW'

  return {
    surface_id: 'STRUCTURAL_COUPLING',
    surface_name: 'Structural Coupling',
    severity,
    operational_summary: `${clusters.length} coupling cluster${clusters.length !== 1 ? 's' : ''} binding ${totalModulesInClusters} module${totalModulesInClusters !== 1 ? 's' : ''} — ${biPairs} bidirectional pair${biPairs !== 1 ? 's' : ''}, system coupling index ${sysIdxPct}%`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Dense mutual dependencies create structural rigidity — modules in coupling clusters cannot evolve independently, changes require coordinated release'
      : 'Coupling clusters present but not at elevated structural risk — monitor for growth',
    evidence_density: clusters.length + biPairs,
    affected_domains: affectedDomains,
    constituents: {
      cluster_count: clusters.length,
      total_modules_in_clusters: totalModulesInClusters,
      bidirectional_pairs: biPairs,
      system_coupling_index: sysIdxPct,
      clusters: clusters.slice(0, 5).map(cl => ({
        size: (cl.modules || cl.members || []).length,
        modules: (cl.modules || cl.members || []).slice(0, 4).map(m => typeof m === 'string' ? m.split('/').slice(-2).join('/') : ''),
      })),
    },
    trace_sources: ['structural_enrichment.coupling_inertia'],
  }
}

module.exports = { materialize, OBJECT_ID }
