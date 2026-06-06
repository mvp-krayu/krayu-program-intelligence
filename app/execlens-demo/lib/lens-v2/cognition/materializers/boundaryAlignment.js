'use strict'

// PICR Materializer: boundary_alignment
// Sub-object of: structural_posture (PICP cognition object)
// Source: structural_enrichment.boundary_divergence
// Classification: DETERMINISTIC

const OBJECT_ID = 'boundary_alignment'

function materialize(cip) {
  const fr = cip.fullReport || cip
  const se = fr.structural_enrichment || {}
  if (!se.available || !se.boundary_divergence) return null

  const bd = se.boundary_divergence
  const divergent = bd.divergent_modules || []
  const orphaned = bd.orphaned_modules || []
  const systemIndex = bd.system_divergence_index || 0

  if (divergent.length === 0 && orphaned.length === 0) return null

  const registry = fr.semantic_domain_registry || []
  const affectedDomains = []
  for (const dm of divergent) {
    const modName = dm.module || dm.name || ''
    const match = registry.find(d => modName.startsWith(d.domain_name || '') || modName.includes(d.domain_name || ''))
    if (match && !affectedDomains.includes(match.business_label || match.domain_name)) {
      affectedDomains.push(match.business_label || match.domain_name)
    }
  }

  const rawPeakRatio = divergent.length > 0 ? Math.max(...divergent.map(d => d.cross_boundary_ratio || d.ratio || 0)) : 0
  const sysIdxPct = systemIndex > 1 ? Math.round(systemIndex) : Math.round(systemIndex * 100)
  const peakRatioPct = rawPeakRatio > 1 ? Math.round(rawPeakRatio) : Math.round(rawPeakRatio * 100)

  const severity = (divergent.length >= 4 || sysIdxPct > 50) ? 'HIGH'
    : (divergent.length >= 2 || sysIdxPct > 30) ? 'ELEVATED'
    : divergent.length >= 1 ? 'MODERATE'
    : 'LOW'

  return {
    surface_id: 'BOUNDARY_ALIGNMENT',
    surface_name: 'Boundary Alignment',
    severity,
    operational_summary: `${divergent.length} module${divergent.length !== 1 ? 's' : ''} with boundary divergence — system divergence index ${sysIdxPct}%${orphaned.length > 0 ? `, ${orphaned.length} orphaned module${orphaned.length !== 1 ? 's' : ''}` : ''}${peakRatioPct > 0 ? `, peak cross-boundary ratio ${peakRatioPct}%` : ''}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Module boundaries do not reflect actual dependency patterns — organizational structure and code structure have diverged, creating governance blind spots'
      : 'Minor boundary divergence detected — module boundaries approximately align with dependency patterns',
    evidence_density: divergent.length + orphaned.length,
    affected_domains: affectedDomains,
    constituents: {
      divergent_count: divergent.length,
      orphaned_count: orphaned.length,
      system_divergence_index: sysIdxPct,
      peak_cross_boundary_ratio: peakRatioPct,
      top_divergent: divergent.slice(0, 5).map(d => {
        const raw = d.cross_boundary_ratio || d.ratio || 0
        return {
          module: (d.module || d.name || '').split('/').slice(-2).join('/'),
          cross_boundary_ratio: raw > 1 ? Math.round(raw) : Math.round(raw * 100),
          edge_count: d.edge_count || d.edges || 0,
        }
      }),
    },
    trace_sources: ['structural_enrichment.boundary_divergence'],
  }
}

module.exports = { materialize, OBJECT_ID }
