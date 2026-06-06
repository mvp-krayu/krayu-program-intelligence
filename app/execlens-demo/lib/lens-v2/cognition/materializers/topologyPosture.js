'use strict'

const OBJECT_ID = 'topology_posture'

function materialize(cip) {
  const fr = cip.fullReport || cip
  const se = fr.structural_enrichment || {}
  const ts = fr.topology_summary || {}
  const rs = fr.reconciliation_summary || {}
  const registry = fr.semantic_domain_registry || []

  const domainCount = ts.semantic_domain_count || registry.length || 0
  if (domainCount === 0) return null

  const groundingRatio = ts.grounding_ratio || (ts.structurally_backed_count && ts.semantic_domain_count
    ? ts.structurally_backed_count / ts.semantic_domain_count : 0)
  const backed = ts.structurally_backed_count || 0
  const semanticOnly = ts.semantic_only_count || 0

  let roleDistribution = 'unknown'
  let totalClassified = 0
  const roleBreakdown = {}
  if (se.available && se.centrality) {
    const roleSummary = se.centrality.role_summary || {}
    totalClassified = Object.values(roleSummary).reduce((a, b) => a + b, 0)
    const hubPct = totalClassified > 0 ? ((roleSummary.hub || 0) + (roleSummary.authority || 0)) / totalClassified : 0
    const leafPct = totalClassified > 0 ? (roleSummary.leaf || 0) / totalClassified : 0
    roleDistribution = hubPct > 0.25 ? 'hub-concentrated'
      : leafPct > 0.7 ? 'leaf-heavy'
      : 'balanced'
    for (const [role, count] of Object.entries(roleSummary)) {
      roleBreakdown[role] = { count, pct: totalClassified > 0 ? Math.round(count / totalClassified * 100) : 0 }
    }
  }

  const reconciled = rs.available ? (rs.reconciled_count || rs.aligned_count || 0) : 0
  const reconciliationRatio = rs.available && domainCount > 0 ? reconciled / domainCount : 0

  const severity = groundingRatio < 0.5 ? 'ELEVATED'
    : groundingRatio < 0.7 ? 'MODERATE'
    : 'LOW'

  const zoneAnchors = registry.filter(d => d.zone_anchor)

  return {
    surface_id: 'OPERATIONAL_TOPOLOGY',
    surface_name: 'Operational Topology Posture',
    severity,
    operational_summary: `${domainCount} domain${domainCount !== 1 ? 's' : ''} — ${backed} structurally grounded (${Math.round(groundingRatio * 100)}%), ${semanticOnly} semantic-only — topology ${roleDistribution}${totalClassified > 0 ? `, ${totalClassified} files classified` : ''}`,
    consequence: groundingRatio < 0.5
      ? 'Low grounding coverage means operational assessments rest on semantic inference — structural confirmation needed before deployment decisions'
      : groundingRatio < 0.7
        ? 'Partial grounding — topology assessments are advisory-qualified for ungrounded domains'
        : 'Topology has strong structural grounding — operational assessments carry structural authority',
    evidence_density: domainCount + totalClassified + (rs.available ? 1 : 0),
    affected_domains: zoneAnchors.map(d => d.domain_name || d.domain_id),
    constituents: {
      domain_count: domainCount,
      backed,
      semantic_only: semanticOnly,
      grounding_pct: Math.round(groundingRatio * 100),
      reconciliation_pct: Math.round(reconciliationRatio * 100),
      role_distribution: roleDistribution,
      role_breakdown: roleBreakdown,
      zone_anchors: zoneAnchors.length,
    },
    trace_sources: ['topology_summary', 'structural_enrichment.centrality', 'reconciliation_summary', 'semantic_domain_registry'],
  }
}

module.exports = { materialize, OBJECT_ID }
