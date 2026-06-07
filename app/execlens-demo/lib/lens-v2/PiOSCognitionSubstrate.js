// ─── PiOS COGNITION SUBSTRATE ───────────────────────────────────
// Five structural cognition objects that form the canonical substrate
// for ALL consumers (THORR, LENS, EIR, SW-INTEL).
//
// These objects sit between raw evidence and consumer projection.
// They condense measurements into structural concerns — each one
// represents a different way of understanding the same topology.
//
// Previously lived in lib/copilot/PIKnowledgeGraphAccess.js as
// THORR-only context preparation. Extracted as PiOS-core because
// all consumers should share the same cognition substrate.
//
// Authority: PIOS.COGNITION-SUBSTRATE-CONVERGENCE.01

function classifyFileRole(filePath) {
  const basename = filePath.split('/').pop()
  if (/^index\.(ts|tsx|js|jsx)$/.test(basename)) return 'INDEX_FILE_UNCLASSIFIED'
  return null
}

// ─── 1. Topology Shape ───
// Clusters with domain names, edges with labels, topology summary.
// The structural shape of the specimen.

function condenseTopology(rawSpecimen) {
  if (!rawSpecimen) return null
  const result = {}

  if (rawSpecimen.semantic_cluster_registry && rawSpecimen.semantic_domain_registry) {
    result.clusters = rawSpecimen.semantic_cluster_registry.map(c => {
      const domains = rawSpecimen.semantic_domain_registry
        .filter(d => d.cluster_id === c.cluster_id)
        .map(d => ({
          name: d.business_label || d.domain_name,
          technical_name: d.domain_name,
          structurally_backed: d.structurally_backed,
          zone_anchor: d.zone_anchor,
          role_classification: d.role_classification || null,
        }))
      return { id: c.cluster_id, label: c.cluster_label, domains }
    })
  }

  if (rawSpecimen.semantic_topology_edges) {
    const nameMap = {}
    if (rawSpecimen.semantic_domain_registry) {
      for (const d of rawSpecimen.semantic_domain_registry) {
        nameMap[d.domain_id] = d.business_label || d.domain_name
      }
    }
    result.edges = rawSpecimen.semantic_topology_edges.map(e => ({
      source: nameMap[e.source_domain] || e.source_domain,
      target: nameMap[e.target_domain] || e.target_domain,
      type: e.relationship_type,
    }))
  }

  if (rawSpecimen.topology_summary) {
    result.summary = rawSpecimen.topology_summary
  }

  return result
}

// ─── 2. Dependency Hub ───
// Structural spines with in/out degree, file role hints, role summary.
// Where structural authority concentrates.

function condenseDependencyHub(rawSpecimen) {
  if (!rawSpecimen?.structural_enrichment?.centrality) return null
  const centrality = rawSpecimen.structural_enrichment.centrality
  const result = {}

  if (centrality.top_structural_spines) {
    result.spines = centrality.top_structural_spines.slice(0, 10).map(s => {
      const entry = {
        path: s.path,
        in_degree: s.in_degree || s.import_in_degree,
        out_degree: s.out_degree || s.import_out_degree,
        centrality_rank: s.centrality_rank || s.centrality,
      }
      const hint = classifyFileRole(s.path)
      if (hint) entry.file_role_hint = hint
      return entry
    })
  }

  if (centrality.project_metrics) result.metrics = centrality.project_metrics
  if (centrality.role_summary) result.role_summary = centrality.role_summary

  return result
}

// ─── 3. Pressure Zones ───
// Zones with condition counts, aggregated conditions, embedded rules.
// Where structural pressure concentrates.

function condensePressureZones(rawSpecimen) {
  if (!rawSpecimen?.pressure_zone_state) return null
  const pz = rawSpecimen.pressure_zone_state
  const result = { total_zones: pz.total_zones }

  if (pz.zones) {
    result.zones = pz.zones.map(z => ({
      zone_id: z.zone_id,
      zone_class: z.zone_class,
      anchor_name: z.anchor_name || z.anchor_business_label,
      condition_count: z.condition_count,
      conditions: z.aggregated_conditions,
      embedded_rules: z.embedded_pair_rules,
    }))
  }

  if (rawSpecimen.propagation_summary?.psig_signals) {
    result.signals = rawSpecimen.propagation_summary.psig_signals.map(s => ({
      id: s.signal_id,
      label: s.signal_label,
      activation: s.activation_state,
      value: s.signal_value,
      primary_domain: s.primary_domain,
      primary_entity: s.primary_entity,
      traceability: s.source_traceability,
    }))
  }

  return result
}

// ─── 4. Constriction Points ───
// Constriction hotspots, fragility hotspots, boundary divergence.
// Where structural stress concentrates at file level.

function condenseConstrictionPoints(rawSpecimen) {
  if (!rawSpecimen?.structural_enrichment) return null
  const se = rawSpecimen.structural_enrichment
  const result = {}

  if (se.constriction_surface?.constriction_hotspots) {
    result.constriction_hotspots = se.constriction_surface.constriction_hotspots.slice(0, 10).map(h => {
      const entry = { path: h.path, constriction_score: h.constriction_score, through_flow: h.through_flow, is_bridge: h.is_bridge }
      const hint = classifyFileRole(h.path)
      if (hint) entry.file_role_hint = hint
      return entry
    })
  }

  if (se.fragility_surface?.fragility_hotspots) {
    result.fragility_hotspots = se.fragility_surface.fragility_hotspots.slice(0, 10).map(h => {
      const entry = { path: h.path, fragility_score: h.fragility_score, coupling: h.coupling, cohesion: h.cohesion }
      const hint = classifyFileRole(h.path)
      if (hint) entry.file_role_hint = hint
      return entry
    })
  }

  if (se.boundary_divergence) {
    const bd = se.boundary_divergence
    result.boundary_divergence = {
      divergent_count: bd.divergent_count,
      orphaned_count: bd.orphaned_count,
      system_divergence_index: bd.system_divergence_index,
      divergent_modules: bd.divergent_modules?.slice(0, 5).map(m => ({
        module: m.module_prefix,
        divergence_score: m.divergence_score,
        file_count: m.file_count,
        is_orphaned: m.is_orphaned,
      })),
    }
  }

  return result
}

// ─── 5. Structural Mass ───
// Code graph stats, cluster mass with domain backing counts.
// Where structural weight sits.

function condenseStructuralMass(rawSpecimen) {
  if (!rawSpecimen) return null
  const result = {}

  if (rawSpecimen.structural_enrichment?.code_graph) {
    result.code_graph = rawSpecimen.structural_enrichment.code_graph
  }

  if (rawSpecimen.semantic_cluster_registry && rawSpecimen.semantic_domain_registry) {
    result.cluster_mass = rawSpecimen.semantic_cluster_registry.map(c => {
      const domains = rawSpecimen.semantic_domain_registry.filter(d => d.cluster_id === c.cluster_id)
      const backed = domains.filter(d => d.structurally_backed).length
      return {
        cluster: c.cluster_label,
        total_domains: domains.length,
        structurally_backed: backed,
        grounding_ratio: domains.length > 0 ? +(backed / domains.length).toFixed(2) : 0,
      }
    })
  }

  return result
}

// ─── Substrate Assembly ───
// Produces the complete cognition substrate from a specimen.
// One call, all five objects.

function assembleSubstrate(rawSpecimen) {
  return {
    topology: condenseTopology(rawSpecimen),
    dependencyHub: condenseDependencyHub(rawSpecimen),
    pressureZones: condensePressureZones(rawSpecimen),
    constrictionPoints: condenseConstrictionPoints(rawSpecimen),
    structuralMass: condenseStructuralMass(rawSpecimen),
  }
}

module.exports = {
  assembleSubstrate,
  condenseTopology,
  condenseDependencyHub,
  condensePressureZones,
  condenseConstrictionPoints,
  condenseStructuralMass,
  classifyFileRole,
}
