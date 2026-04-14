/**
 * pages/api/topology.js
 * GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01
 *
 * Topology API route — reads directly from canonical governed artifact.
 * NO dependency on binding_envelope.json for topology.
 *
 * Source: docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json
 * Governed by: GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01
 *
 * Transparent field-shape adapter maps canonical JSON to GAUGE render model shape.
 * Rules:
 *   R1  canonical_topology.json is the only topology source
 *   R2  field locations mapped — no semantic transformation
 *   R3  exact IDs, names, grounding values preserved without normalization
 *   R4  null confidence preserved as null
 *   R5  cross_domain_ref preserved exactly as encoded in source ("DOM-01")
 *   R6  component_component empty array preserved
 */

import fs   from 'fs'
import path from 'path'

// Canonical topology source — repo root is two levels up from app/gauge-product/
const REPO_ROOT          = path.resolve(process.cwd(), '..', '..')
const CANONICAL_TOPOLOGY = path.join(
  REPO_ROOT,
  'docs', 'psee',
  '41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01',
  'canonical_topology.json'
)

// ---------------------------------------------------------------------------
// Transparent field-shape adapter
// Maps canonical_topology.json structure → GAUGE render model shape.
// No semantic transformation. Field locations only.
// ---------------------------------------------------------------------------

function buildCanonicalRenderModel(canonical) {
  const domains       = canonical.domains       || []
  const capabilities  = canonical.capabilities  || []
  const components    = canonical.components    || []
  const relationships = canonical.relationships || {}

  // --- Node construction ---
  // type values match existing GAUGE constants:
  //   binding_context    → domain
  //   capability_surface → capability
  //   component_entity   → component

  const nodes = []

  for (const d of domains) {
    nodes.push({
      node_id:             d.domain_id,
      label:               d.domain_name,
      display_label:       d.domain_name,
      secondary_label:     d.domain_id,
      resolved_label:      d.domain_name,
      type:                'binding_context',
      depth:               0,
      is_root:             true,
      is_orphan:           false,
      is_overlap_endpoint: false,
      signal_count:        0,
      signals:             [],
      // Canonical fields — passthrough, no reinterpretation
      grounding:           d.grounding,
      confidence:          d.confidence,          // null — preserved
      evidence_refs:       d.evidence_refs || [],
    })
  }

  for (const c of capabilities) {
    nodes.push({
      node_id:             c.capability_id,
      label:               c.capability_name,
      display_label:       c.capability_name,
      secondary_label:     c.capability_id,
      resolved_label:      c.capability_name,
      type:                'capability_surface',
      depth:               1,
      is_root:             false,
      is_orphan:           false,
      is_overlap_endpoint: false,
      signal_count:        0,
      signals:             [],
      // Canonical fields — passthrough
      grounding:           c.grounding,
      confidence:          c.confidence,          // null — preserved
      evidence_refs:       c.evidence_refs || [],
    })
  }

  for (const comp of components) {
    // cross_domain_ref preserved exactly as encoded ("DOM-01" for COMP-25)
    const isCrossDomain = !!comp.cross_domain_ref
    nodes.push({
      node_id:             comp.component_id,
      label:               comp.component_name,
      display_label:       comp.component_name,
      secondary_label:     comp.component_id,
      resolved_label:      comp.component_name,
      type:                'component_entity',
      depth:               2,
      is_root:             false,
      is_orphan:           false,
      is_overlap_endpoint: isCrossDomain,
      signal_count:        0,
      signals:             [],
      // Canonical fields — passthrough, no normalization
      grounding:           comp.grounding,
      confidence:          comp.confidence,       // null — preserved
      source_ref:          comp.source_ref,       // null — preserved
      cross_domain_ref:    comp.cross_domain_ref || null,
      evidence_refs:       comp.evidence_refs || [],
    })
  }

  // --- Roots: domain IDs (level-0 nodes) ---
  const roots = domains.map(d => d.domain_id)

  // --- Containment tree: domain→capabilities, capability→components ---
  // Built from capability_ids[] and component_ids[] present in canonical source objects.
  const containmentTree = {}
  for (const d of domains) {
    containmentTree[d.domain_id] = d.capability_ids || []
  }
  for (const c of capabilities) {
    containmentTree[c.capability_id] = c.component_ids || []
  }

  // --- Overlap edges ---
  // cross_domain_ref "DOM-01" (COMP-25) is NOT a node_id in the canonical set.
  // No synthetic overlap edge is created — cross_domain_ref is preserved as node field only.
  // Per source authority note: "DOM-01" encoding is a known source peculiarity (SA-3, L4).
  const overlapEdges = []

  // --- Edge counts from canonical relationships ---
  const dcEdgeCount = (relationships.domain_capability    || []).length  // 42
  const ccEdgeCount = (relationships.capability_component || []).length  // 89

  // --- Summary ---
  const summary = {
    nodes_count:              nodes.length,      // 148
    roots_count:              roots.length,      // 17
    orphans_count:            0,
    edges_count:              dcEdgeCount + ccEdgeCount,  // 131
    contains_edges_count:     dcEdgeCount + ccEdgeCount,
    overlap_edges_count:      0,
    unknown_edges_count:      0,
    signals_count:            0,
    orphan_signals_count:     0,
    multi_parent_nodes_count: 0,
  }

  // --- Constraint flags ---
  const constraintFlags = {
    overlap_present:       false,
    overlap_count:         0,
    unknown_space_present: false,
    unknown_space_count:   0,
  }

  return {
    // Source identification
    canonical:          true,
    source:             'canonical_topology.json',
    contract_id:        'GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01',
    canonical_source:   canonical.source_authority?.script_path || null,
    emission_date:      canonical.emission_date || null,
    counts:             canonical.counts || {},

    // GAUGE render model fields (shape-compatible with envelope render model)
    nodes,
    roots,
    orphans:                [],
    containment_tree:       containmentTree,
    additional_parent_refs: {},
    node_depths:            Object.fromEntries(nodes.map(n => [n.node_id, n.depth])),
    multi_parent_nodes:     {},
    overlap_edges:          overlapEdges,
    unknown_edges:          [],
    signals_by_node:        {},
    orphan_signals:         [],
    constraint_flags:       constraintFlags,
    summary,
    capability_surfaces_index: [],

    // Canonical topology passthrough — raw fields preserved
    domains,
    capabilities,
    components,
    relationships,
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!fs.existsSync(CANONICAL_TOPOLOGY)) {
    return res.status(503).json({
      error: 'Canonical topology source unavailable',
      detail: `Not found: ${CANONICAL_TOPOLOGY}`,
      source: 'canonical_topology.json'
    })
  }

  let canonical
  try {
    canonical = JSON.parse(fs.readFileSync(CANONICAL_TOPOLOGY, 'utf8'))
  } catch (err) {
    return res.status(503).json({
      error: 'Canonical topology parse error',
      detail: err.message,
      source: CANONICAL_TOPOLOGY
    })
  }

  try {
    const model = buildCanonicalRenderModel(canonical)
    return res.status(200).json(model)
  } catch (err) {
    return res.status(503).json({
      error: 'Topology render model derivation failed',
      detail: err.message,
      source: CANONICAL_TOPOLOGY
    })
  }
}
