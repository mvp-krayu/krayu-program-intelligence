# GAUGE Runtime Topology Consumption Contract
# GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01 — Deliverable 1

## Identity

- Contract: GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01
- Date: 2026-04-13
- Branch: wip/gauge-psee-hygiene-snapshot
- Mode: STRICT RUNTIME INTEGRATION — MINIMAL CHANGE

---

## Objective

Replace the topology authority source in `/api/topology` from `binding_envelope.json` to `canonical_topology.json`, while preserving `binding_envelope.json` for all non-topology runtime concerns.

---

## Topology Authority Transition

| item | before | after |
|------|--------|-------|
| Topology source | `binding_envelope.json` (clients/.../run_335c0575a080/binding/) | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |
| Source loading | `validateEnvelope()` + `buildRenderModel()` from `envelope_adapter.js` | Direct JSON read + transparent inline adapter |
| envelope_adapter.js dependency | PRESENT in topology.js | REMOVED from topology.js |
| Envelope path for non-topology routes | Unchanged (`pages/api/gauge.js`, etc.) | Unchanged |

---

## Topology Runtime File Changed

| file | change type | reason |
|------|-------------|--------|
| `app/gauge-product/pages/api/topology.js` | REPLACEMENT | Switch topology authority from envelope to canonical_topology.json |

**No other runtime files changed.** `envelope_adapter.js` and `pages/api/gauge.js` are untouched.

---

## Adapter Contract

The inline adapter in `topology.js` (`buildCanonicalRenderModel`) performs transparent field-shape mapping only.

### Mapping Rules

| canonical field | mapped to render field | transformation |
|----------------|----------------------|----------------|
| `domain.domain_id` | `node.node_id` | direct |
| `domain.domain_name` | `node.label`, `node.display_label`, `node.secondary_label` → `domain_id`, `node.resolved_label` | field-location mapping |
| `domain.grounding` | `node.grounding` | direct passthrough |
| `domain.confidence` | `node.confidence` | direct passthrough (null preserved) |
| `domain.capability_ids[]` | `containment_tree[domain_id]` | direct |
| `capability.capability_id` | `node.node_id` | direct |
| `capability.capability_name` | `node.label`, `node.display_label`, etc. | field-location mapping |
| `capability.component_ids[]` | `containment_tree[capability_id]` | direct |
| `component.component_id` | `node.node_id` | direct |
| `component.cross_domain_ref` | `node.cross_domain_ref` + `node.is_overlap_endpoint` | passthrough; "DOM-01" preserved exactly |
| `component.source_ref` | `node.source_ref` | direct passthrough (null preserved) |
| `relationships.domain_capability[].length` | `summary.edges_count` partial | count only |
| `relationships.capability_component[].length` | `summary.edges_count` partial | count only |
| `relationships.component_component` | not used (empty []) | preserved as metadata |

### Node Type Mapping

| canonical level | GAUGE `type` value |
|----------------|-------------------|
| domain | `binding_context` |
| capability | `capability_surface` |
| component | `component_entity` |

These type values are the existing GAUGE constants defined in `TopologyAddon.js`:
```javascript
const NODE_TYPE_LABELS = {
  binding_context:    'Domain',
  capability_surface: 'Capability Surface',
  component_entity:   'Component Entity',
}
```

### Fields Not Present in Canonical Source (preserved as null/empty)

| field | value | reason |
|-------|-------|--------|
| `confidence` | null | absent from canonical structured source (source limitation L1) |
| `source_ref` | null | absent from canonical structured source (source limitation L2) |
| `overlap_edges` | [] | `cross_domain_ref "DOM-01"` does not match any node_id; no synthetic edge created |
| `signals_by_node` | {} | no signals in canonical topology source |
| `component_component` | [] in relationships | source limitation L3 |

### cross_domain_ref Handling

COMP-25 has `cross_domain_ref: "DOM-01"` — the exact value from source. The adapter:
- Preserves "DOM-01" exactly as encoded (no normalization to "DOMAIN-01")
- Sets `is_overlap_endpoint: true` on COMP-25 to expose the cross-domain annotation in the UI
- Does NOT create a synthetic overlap edge (which would require inventing `edge_id` and `to_node` pointing to a non-matching node_id)

---

## Non-Topology Runtime Preservation

The following are UNCHANGED:

| file | status |
|------|--------|
| `app/gauge-product/lib/envelope_adapter.js` | UNCHANGED |
| `app/gauge-product/pages/api/gauge.js` | UNCHANGED |
| `app/gauge-product/pages/index.js` | UNCHANGED |
| `app/gauge-product/pages/overview.js` | UNCHANGED |
| `app/gauge-product/pages/topology.js` (UI page) | UNCHANGED |
| `binding_envelope.json` consumption by `/api/gauge` | UNCHANGED |

---

## Response Shape Compatibility

The new `buildCanonicalRenderModel` return shape is compatible with all existing GAUGE UI consumers:

| consumer | field consumed | compatible |
|----------|---------------|-----------|
| `TopologySummaryPanel` | `nodes[]`, `summary.*`, `constraint_flags.*` | YES |
| `TopologyAddon/TopologyView` | `nodes[]`, `roots[]`, `containment_tree{}`, `overlap_edges[]`, `summary.*`, `constraint_flags.*` | YES |
| `SignalSet` | `signals_by_node{}` | YES (renders "No signals in this run.") |
| `StructuralMetrics` | `topoData?.summary.*` | YES |

---

## Governing Conclusion

`/api/topology` now consumes `canonical_topology.json` directly. `binding_envelope.json` is not read by `topology.js`. The envelope system remains intact for all other runtime routes. No semantic redesign has occurred.
