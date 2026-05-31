// T1 materializer — assembles exposure_assessment from pressure zones, enrichment, and consequences
const OBJECT_ID = 'exposure_assessment'

function materialize(cip) {
  const fr = cip.fullReport || {}
  const consequenceResult = cip.consequenceResult || {}
  const enrichment = fr.structural_enrichment || {}
  const dpsig = fr.dpsig_signal_summary || {}
  const pressureZones = fr.pressure_zone_state || {}
  const centrality = enrichment.centrality || {}
  const fragility = enrichment.fragility_surface || null
  const divergence = enrichment.boundary_divergence || null
  const consequences = consequenceResult.consequences || []
  const atomics = consequenceResult.atomic_consequences || []

  const concentrationExposure = buildConcentrationExposure(dpsig, centrality)
  const governanceExposure = buildGovernanceExposure(divergence, pressureZones)
  const fragilityExposure = buildFragilityExposure(fragility)

  const EXPOSURE_TYPES = ['RESIL_DEF', 'GOV_GAP', 'PROP_EXP', 'DEL_EXP']
  const exposureConsequences = [
    ...consequences.filter(c => EXPOSURE_TYPES.includes(c.consequence_type_id)),
    ...atomics.filter(c => EXPOSURE_TYPES.includes(c.consequence_type_id)),
  ]
  // Deduplicate by consequence_id
  const seen = new Set()
  const deduped = []
  for (const c of exposureConsequences) {
    if (!seen.has(c.consequence_id)) { seen.add(c.consequence_id); deduped.push(c) }
  }
  const exposureResult = deduped

  const severitySummary = {}
  for (const csq of exposureResult) {
    severitySummary[csq.severity] = (severitySummary[csq.severity] || 0) + 1
  }

  return {
    object_id: OBJECT_ID,
    exposure_surfaces: {
      concentration: concentrationExposure,
      governance: governanceExposure,
      fragility: fragilityExposure,
    },
    consequence_exposure: exposureResult.map(c => ({
      consequence_type: c.consequence_type_id,
      severity: c.severity,
      scope: c.consequence_scope,
      locus: c.primary_locus_display || null,
    })),
    severity_assessment: severitySummary,
    total_exposure_consequences: exposureResult.length,
    has_systemic_exposure: exposureResult.some(c => c.consequence_scope === 'SYSTEMIC'),
  }
}

function buildConcentrationExposure(dpsig, centrality) {
  const clusters = (dpsig.signals || [])
    .filter(s => s.severity && s.severity !== 'NOMINAL')
    .map(s => ({
      signal_id: s.signal_id,
      severity: s.severity,
      cluster: s.cluster_name || s.cluster_id || null,
    }))

  const topSpines = (centrality.centrality_ranking || centrality.top_structural_spines || [])
    .slice(0, 5)
    .map(s => ({
      file: s.file || s.node_id,
      inbound: s.in_degree || s.inbound || 0,
      role: s.structural_role || null,
    }))

  return {
    cluster_signals: clusters,
    structural_spines: topSpines,
    concentration_detected: clusters.length > 0 || topSpines.length > 0,
  }
}

function buildGovernanceExposure(divergence, pressureZones) {
  const divergentPairs = (divergence && divergence.divergent_pairs) || []
  const blindSpots = (pressureZones.blind_spot_entities || [])

  return {
    boundary_divergence_count: divergentPairs.length,
    blind_spot_count: blindSpots.length,
    governance_gap_detected: divergentPairs.length > 0 || blindSpots.length > 0,
  }
}

function buildFragilityExposure(fragility) {
  if (!fragility || !fragility.fragility_hotspots) {
    return { hotspot_count: 0, max_fragility: 0, fragility_detected: false }
  }

  const hotspots = fragility.fragility_hotspots
  const maxScore = hotspots.reduce((max, h) => Math.max(max, h.fragility_score || 0), 0)

  return {
    hotspot_count: hotspots.length,
    max_fragility: maxScore,
    fragility_detected: hotspots.length > 0,
  }
}

module.exports = { materialize, OBJECT_ID }
