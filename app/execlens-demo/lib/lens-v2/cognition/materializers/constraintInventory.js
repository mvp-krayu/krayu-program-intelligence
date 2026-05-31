// T1 materializer — assembles constraint_inventory from structural enrichment surfaces
const OBJECT_ID = 'constraint_inventory'

function materialize(cip) {
  const fr = cip.fullReport || {}
  const enrichment = fr.structural_enrichment || {}
  const signals = fr.signal_interpretations || []

  const constriction = enrichment.constriction_surface || null
  const fragility = enrichment.fragility_surface || null
  const divergence = enrichment.boundary_divergence || null
  const coupling = enrichment.coupling_inertia || null
  const centrality = enrichment.centrality || null

  const throughputCeilings = []
  if (constriction && constriction.articulation_points) {
    for (const point of constriction.articulation_points) {
      throughputCeilings.push({
        constraint_type: 'THROUGHPUT_CEILING',
        target: point.file || point.node_id || 'unknown',
        through_flow: point.through_flow || 0,
        components_if_removed: point.components_if_removed || 0,
        severity: point.through_flow > 10 ? 'HIGH' : point.through_flow > 5 ? 'ELEVATED' : 'MODERATE',
      })
    }
  }

  const structuralFragility = []
  if (fragility && fragility.fragility_hotspots) {
    for (const hotspot of fragility.fragility_hotspots) {
      structuralFragility.push({
        constraint_type: 'STRUCTURAL_FRAGILITY',
        target: hotspot.file || hotspot.node_id || 'unknown',
        fragility_score: hotspot.fragility_score || 0,
        inbound_count: hotspot.inbound_count || 0,
        outbound_count: hotspot.outbound_count || 0,
        severity: hotspot.fragility_score > 0.7 ? 'HIGH' : hotspot.fragility_score > 0.4 ? 'ELEVATED' : 'MODERATE',
      })
    }
  }

  const governanceMisalignments = []
  if (divergence && divergence.divergent_pairs) {
    for (const pair of divergence.divergent_pairs) {
      governanceMisalignments.push({
        constraint_type: 'GOVERNANCE_MISALIGNMENT',
        source: pair.source_domain || pair.source || 'unknown',
        target: pair.target_domain || pair.target || 'unknown',
        cross_boundary_ratio: pair.cross_boundary_ratio || pair.ratio || 0,
        import_count: pair.cross_boundary_imports || pair.import_count || 0,
        severity: (pair.cross_boundary_ratio || pair.ratio || 0) > 0.5 ? 'HIGH' : 'ELEVATED',
      })
    }
  }

  const couplingRigidity = []
  if (coupling && coupling.clusters) {
    for (const cluster of coupling.clusters) {
      couplingRigidity.push({
        constraint_type: 'COUPLING_RIGIDITY',
        members: cluster.members || [],
        member_count: (cluster.members || []).length,
        density: cluster.density || 0,
        bidirectional_edges: cluster.bidirectional_edge_count || 0,
        severity: (cluster.members || []).length > 5 ? 'HIGH' : (cluster.members || []).length > 3 ? 'ELEVATED' : 'MODERATE',
      })
    }
  }

  const blastRadiusExposures = []
  if (centrality && centrality.centrality_ranking) {
    const topHubs = centrality.centrality_ranking.slice(0, 5)
    for (const hub of topHubs) {
      blastRadiusExposures.push({
        constraint_type: 'BLAST_RADIUS',
        target: hub.file || hub.node_id || 'unknown',
        inbound_degree: hub.in_degree || hub.inbound || 0,
        structural_role: hub.structural_role || null,
        severity: (hub.in_degree || hub.inbound || 0) > 10 ? 'HIGH' : 'ELEVATED',
      })
    }
  }

  const allConstraints = [
    ...throughputCeilings,
    ...structuralFragility,
    ...governanceMisalignments,
    ...couplingRigidity,
    ...blastRadiusExposures,
  ]

  return {
    object_id: OBJECT_ID,
    binding_constraints: throughputCeilings,
    governance_constraints: governanceMisalignments,
    structural_constraints: structuralFragility,
    coupling_constraints: couplingRigidity,
    blast_radius_constraints: blastRadiusExposures,
    total_count: allConstraints.length,
    by_type: {
      THROUGHPUT_CEILING: throughputCeilings.length,
      STRUCTURAL_FRAGILITY: structuralFragility.length,
      GOVERNANCE_MISALIGNMENT: governanceMisalignments.length,
      COUPLING_RIGIDITY: couplingRigidity.length,
      BLAST_RADIUS: blastRadiusExposures.length,
    },
    enrichment_available: enrichment.available !== false,
  }
}

module.exports = { materialize, OBJECT_ID }
