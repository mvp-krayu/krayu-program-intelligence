// EIR Grounding Context — extracts specimen-level grounding data for the EIR consumer.
// The PICP carries cognition objects. The grounding context carries specimen identity:
// domain names, structural scale, per-condition file references, enrichment surfaces.
// Deterministic: same source data → same context.

function build(fullReport, synthesisResult) {
  const sdr = fullReport.semantic_domain_registry || {}
  const domainLabels = {}
  for (const k of Object.keys(sdr)) {
    const d = sdr[k]
    if (d.domain_id && d.domain_name) domainLabels[d.domain_id] = d.domain_name
  }

  const cg = (fullReport.structural_enrichment || {}).code_graph || {}
  const ts = fullReport.topology_summary || {}
  const constriction = (fullReport.structural_enrichment || {}).constriction_surface || {}
  const fragility = (fullReport.structural_enrichment || {}).fragility_surface || {}
  const divergence = (fullReport.structural_enrichment || {}).boundary_divergence || {}

  const conditions = (synthesisResult.conditions || [])
    .filter(c => c.severity !== 'NOMINAL')
    .map(c => {
      const topo = c.shared_topology_targets || {}
      return {
        condition_type: c.condition_type,
        condition_id: c.condition_id,
        severity: c.severity,
        domains: topo.domains || [],
        files: topo.files || [],
        clusters: topo.clusters || [],
      }
    })

  return {
    domainLabels,
    scale: {
      file_count: cg.file_count || 0,
      total_import_edges: cg.total_import_edges || 0,
      total_classes: cg.total_classes || 0,
      total_functions: cg.total_functions || 0,
      semantic_domain_count: ts.semantic_domain_count || 0,
      cluster_count: ts.cluster_count || ts.structural_dom_count || 0,
    },
    conditions,
    constriction: {
      bridge_count: (constriction.bridge_nodes || []).length,
      articulation_count: (constriction.articulation_points || []).length,
      top_points: (constriction.articulation_points || []).slice(0, 5).map(p => ({
        file: p.file || p.node_id || 'unknown',
        through_flow: p.through_flow || 0,
        components_if_removed: p.components_if_removed || 0,
      })),
    },
    fragility: {
      hotspot_count: (fragility.fragility_hotspots || []).length,
      top_hotspots: (fragility.fragility_hotspots || []).slice(0, 5).map(h => ({
        file: h.file || h.node_id || null,
        score: h.fragility_score || 0,
        inbound: h.inbound_count || 0,
        outbound: h.outbound_count || 0,
      })),
    },
    divergence: {
      pair_count: (divergence.divergent_pairs || []).length,
      top_pairs: (divergence.divergent_pairs || []).slice(0, 5).map(p => ({
        source: p.source_domain || p.source || 'unknown',
        target: p.target_domain || p.target || 'unknown',
        ratio: p.cross_boundary_ratio || p.ratio || 0,
        imports: p.cross_boundary_imports || p.import_count || 0,
      })),
    },
    client_name: resolveClientName(fullReport.client_name || fullReport.client || ''),
    baseline_commit: fullReport.baseline_commit || '',
  }
}

const CLIENT_DISPLAY_NAMES = {
  blueedge: 'BlueEdge',
  netbox: 'NetBox',
  stackstorm: 'StackStorm',
}

function resolveClientName(raw) {
  if (!raw) return ''
  const key = raw.toLowerCase().replace(/[^a-z0-9]/g, '')
  return CLIENT_DISPLAY_NAMES[key] || titleCase(raw)
}

function titleCase(str) {
  if (!str) return ''
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

module.exports = { build }
