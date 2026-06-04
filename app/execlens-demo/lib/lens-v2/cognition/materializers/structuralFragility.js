'use strict'

// PICR Materializer: structural_fragility
// Sub-object of: constraint_inventory (PICP cognition object)
// Source: structural_enrichment.fragility_surface
// Classification: DETERMINISTIC

const OBJECT_ID = 'structural_fragility'

function materialize(cip) {
  const fr = cip.fullReport || cip
  const se = fr.structural_enrichment || {}
  if (!se.available || !se.fragility_surface) return null

  const fs = se.fragility_surface
  const hotspots = fs.fragility_hotspots || []
  const absorptive = fs.absorptive_modules || []
  const cohesion = fs.module_cohesion || []
  const mode = fs.analysis_mode || 'UNKNOWN'

  if (hotspots.length === 0) return null

  const registry = fr.semantic_domain_registry || []
  const affectedDomains = []
  for (const hs of hotspots) {
    const filePath = hs.file || hs.path || ''
    const match = registry.find(d => filePath.startsWith(d.domain_name || '') || filePath.includes(d.domain_name || ''))
    if (match && !affectedDomains.includes(match.business_label || match.domain_name)) {
      affectedDomains.push(match.business_label || match.domain_name)
    }
  }

  const rawPeak = hotspots.length > 0 ? Math.max(...hotspots.map(h => h.fragility_score || h.score || 0)) : 0
  const rawMean = hotspots.length > 0 ? hotspots.reduce((sum, h) => sum + (h.fragility_score || h.score || 0), 0) / hotspots.length : 0
  const isPercentScale = rawPeak > 1
  const peakPct = isPercentScale ? Math.round(rawPeak) : Math.round(rawPeak * 100)
  const meanPct = isPercentScale ? Math.round(rawMean) : Math.round(rawMean * 100)

  const severity = hotspots.length >= 5 || peakPct > 80 ? 'HIGH'
    : hotspots.length >= 3 || peakPct > 60 ? 'ELEVATED'
    : hotspots.length >= 1 ? 'MODERATE'
    : 'LOW'

  const lowCohesion = cohesion.filter(m => (m.cohesion || m.cohesion_score || 1) < 0.4)

  return {
    surface_id: 'STRUCTURAL_FRAGILITY',
    surface_name: 'Structural Fragility',
    severity,
    operational_summary: `${hotspots.length} fragility hotspot${hotspots.length !== 1 ? 's' : ''} detected — peak fragility ${peakPct}%, mean ${meanPct}%${lowCohesion.length > 0 ? `, ${lowCohesion.length} low-cohesion module${lowCohesion.length !== 1 ? 's' : ''}` : ''}${absorptive.length > 0 ? `, ${absorptive.length} absorptive module${absorptive.length !== 1 ? 's' : ''}` : ''}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Files with high coupling and low cohesion concentrate change risk — modifications propagate unpredictably through fragile structural joints'
      : 'Fragility hotspots present but below elevated threshold — monitor for accumulation',
    evidence_density: hotspots.length + lowCohesion.length + absorptive.length,
    affected_domains: affectedDomains,
    constituents: {
      hotspot_count: hotspots.length,
      peak_fragility: peakPct,
      mean_fragility: meanPct,
      low_cohesion_modules: lowCohesion.length,
      absorptive_modules: absorptive.length,
      analysis_mode: mode,
      top_hotspots: hotspots.slice(0, 5).map(h => {
        const raw = h.fragility_score || h.score || 0
        return {
          file: (h.file || h.path || '').split('/').slice(-2).join('/'),
          score: raw > 1 ? Math.round(raw) : Math.round(raw * 100),
          coupling: h.coupling,
          cohesion: h.cohesion,
        }
      }),
    },
    trace_sources: ['structural_enrichment.fragility_surface'],
  }
}

module.exports = { materialize, OBJECT_ID }
