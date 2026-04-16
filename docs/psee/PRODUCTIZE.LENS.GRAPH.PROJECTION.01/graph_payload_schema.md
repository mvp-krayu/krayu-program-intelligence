# Graph Payload Schema
# PRODUCTIZE.LENS.GRAPH.PROJECTION.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.GRAPH.PROJECTION.01
- Date: 2026-04-16
- Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01

---

## SECTION 1 — PURPOSE

This document defines the schema for the client-safe graph payload that LENS will consume. The payload is:
- a ZONE-2 projection artifact
- produced from the canonical topology and governed evidence claims
- client-safe by construction (not by filtering)
- non-reconstructive (a consumer cannot rebuild the internal topology from this payload)
- static for a given run_id (deterministic per projection contract)

This schema is the target shape for a future `graph_projection` API endpoint or static payload generator. It does not replace existing claim projection endpoints — it is additive.

---

## SECTION 2 — TOP-LEVEL PAYLOAD SHAPE

```
GraphProjectionPayload {
  graph_id:         string      // Unique projection run reference — no internal path structure
  zone:             string      // Always "ZONE-2"
  run_id:           string      // Assessment run basis reference
  generated_at:     string      // ISO 8601 timestamp
  rendered_scope:   string      // Human-readable description of what is shown
  available_depth:  string[]    // ["L2", "L3"] — deeper access available; no detail
  safe_legend:      LegendItem[] // Renderable legend entries
  focus_domain:     string | null // Label of the focus domain if set; null if full-map mode
  nodes:            GraphNode[]
  edges:            GraphEdge[]
  clusters:         GraphCluster[]
  trace_available:  boolean     // Same semantics as claim payload trace_available
}
```

**Total top-level fields: 12.** This payload is intentionally minimal.

**Forbidden top-level keys (in addition to zone2_safe_payload_profile §3.1):**
- Any key containing `_path`, `_file`, `_graph` (per zone2 profile §3.2)
- `source_topology` — must not expose reference to canonical_topology.json
- `binding_envelope` — must not reference binding envelope
- `node_inventory` — full inventory is ZONE-1; counts only in rendered_scope
- `edge_list_raw` — raw edge list enables reconstruction
- `claim_set` — claim references are internal; not in graph payload

---

## SECTION 3 — NODE SCHEMA

```
GraphNode {
  id:       string    // Client-safe opaque identifier — NOT DOMAIN-XX, CAP-XX, COMP-XX
                      // Format: "gn-{sequential}" or derived safe hash — never an internal ID
  label:    string    // Visible text — business-grade label; no internal IDs
  class:    string    // "domain" | "capability" | "focus_area"
                      // "component" is explicitly forbidden
  cluster:  string | null  // cluster.id this node belongs to; null if top-level
  status:   string    // "verified" | "conditional" | "partial" | "pending" | "unknown"
                      // Maps to evidence_class vocabulary
  emphasis: boolean   // true if this is the focus node (max 1 per payload in focus mode)
}
```

### Node field governance

| field | governance rule |
|-------|----------------|
| `id` | Must be a generated safe identifier. Never `DOMAIN-01`, `CAP-07`, `COMP-03` or any internal ID pattern. |
| `label` | Domain names: direct (17 canonical names). Capability labels: conditional (business-interpretable names only). Focus area: abstracted label. Never includes CLM-XX, SIG-XX, COND-XX, INTEL-XX, DIAG-XX, ART-XX, COMP-XX, CAP-XX, DOMAIN-XX. |
| `class` | Bounded to three values. Any other value is a schema violation. |
| `cluster` | References `cluster.id`, not an internal group code. Null if the node is a top-level domain node in non-clustered mode. |
| `status` | Derived from the evidence_class of the most relevant claim grounding the domain. Maps: VERIFIED→"verified", CONDITIONAL→"conditional", PARTIAL→"partial", BLOCKED→"pending". |
| `emphasis` | At most one node has `emphasis: true` per payload. This is the focus-domain hub node. |

---

## SECTION 4 — EDGE SCHEMA

```
GraphEdge {
  source:         string    // GraphNode.id — must reference a node in nodes[]
  target:         string    // GraphNode.id — must reference a node in nodes[]
  relation:       string    // "supports" | "connects_to" | "depends_on" | "informs" | "part_of"
  strength:       string | null  // "strong" | "moderate" | null
                                 // Present only when safely bounded — never a numeric value
  visible_reason: string | null  // Optional short plain-English basis for this edge
                                 // Example: "Security intelligence pathway spans these two domains"
                                 // Never an internal ID, chain step, or signal reference
}
```

### Edge field governance

| field | governance rule |
|-------|----------------|
| `source` / `target` | Must be valid `GraphNode.id` values from the same payload. Never an internal ID. |
| `relation` | Bounded to five allowed values. Any other value is a schema violation. |
| `strength` | Optional. If present, only "strong" or "moderate". Never numeric (0.7, 0.85 etc.) as this enables density reconstruction. |
| `visible_reason` | Optional and bounded. Must not contain: claim IDs, signal IDs, internal references, chain notation. Maximum 120 characters. |

**Forbidden edge fields:**
- `weight` (numeric) — enables density inference
- `evidence_id` — exposes internal evidence reference
- `signal_id` — forbidden at any level
- `chain_step` — exposes derivation chain
- `source_ref` — exposes vault reference
- `trace_id` — enables trace reconstruction

---

## SECTION 5 — CLUSTER SCHEMA

```
GraphCluster {
  id:      string    // Safe cluster identifier — "gc-{sequential}"
  label:   string    // Business-grade cluster label
  kind:    string    // "domain_group" | "focus_area" | "cross_cutting"
  summary: string    // One-sentence plain-English description of what this cluster represents
                     // Maximum 180 characters. No internal IDs.
}
```

### Cluster field governance

| field | governance rule |
|-------|----------------|
| `id` | Generated safe identifier. Never an internal group code or topology ID. |
| `label` | Business-grade. May use domain-group framing: "Operational Systems", "Intelligence Layer", "Infrastructure". |
| `kind` | Bounded to three values. |
| `summary` | Plain English. No CLM-XX, SIG-XX, DOMAIN-XX, or internal vocabulary. |

---

## SECTION 6 — LEGEND SCHEMA

```
LegendItem {
  key:   string    // "verified" | "conditional" | "partial" | "pending" | "focus"
  label: string    // Plain English: "Verified", "In Progress", "Partial", "Pending Assessment", "Focus Domain"
  color: string    // CSS hex color — consistent with LENS design system
}
```

The legend is fully static and safe to render without any payload inspection.

---

## SECTION 7 — RENDERED SCOPE AND FOCUS DOMAIN

### `rendered_scope`

A human-readable description of what the payload represents. Examples:
- "17 functional domains — full platform map (domain level only)"
- "Security Intelligence focus — 2 domains, 3 capabilities, governed relationships"
- "3 of 17 domains shown — operational readiness cluster"

Must not expose node counts that reveal internal topology granularity beyond what is in the scope description.

### `focus_domain`

When non-null, the payload represents a focus-domain subgraph. The value is the business label of the focus domain (e.g., "Security Intelligence"). Null means the payload is a full-map or cluster-map view.

In focus mode:
- One node has `emphasis: true`
- Capability-class nodes from that domain may appear
- Edge count is bounded to the focus domain's immediate relationships

---

## SECTION 8 — PAYLOAD SIZE GOVERNANCE

| dimension | limit | reason |
|-----------|-------|--------|
| Top-level nodes | ≤ 17 | Domain count is the natural ceiling; all-domain view |
| Focus-subgraph nodes | ≤ 8 | Domain hub + capabilities + direct connections |
| Edges | ≤ 25 | Density control; see graph_leakage_prevention.md |
| Focus-subgraph edges | ≤ 10 | Tighter control in focus mode |
| visible_reason length | ≤ 120 chars | Prevents narrative leakage through this field |
| cluster summary length | ≤ 180 chars | Same |
| rendered_scope length | ≤ 200 chars | Same |

---

## SECTION 9 — EXAMPLE PAYLOAD (CONCEPTUAL SHAPE)

```json
{
  "graph_id": "gproj-20260416-001",
  "zone": "ZONE-2",
  "run_id": "run_authoritative_recomputed_01",
  "generated_at": "2026-04-16T09:00:00Z",
  "rendered_scope": "Security Intelligence focus — 2 domains, selected relationships",
  "available_depth": ["L2", "L3"],
  "focus_domain": "Security Intelligence",
  "trace_available": true,
  "safe_legend": [
    { "key": "verified",    "label": "Verified",          "color": "#3fb950" },
    { "key": "conditional", "label": "In Progress",        "color": "#d29922" },
    { "key": "partial",     "label": "Partial",            "color": "#e07a30" },
    { "key": "pending",     "label": "Pending Assessment", "color": "#8b949e" },
    { "key": "focus",       "label": "Focus Domain",       "color": "#58a6ff" }
  ],
  "clusters": [],
  "nodes": [
    {
      "id": "gn-01",
      "label": "Security Intelligence",
      "class": "focus_area",
      "cluster": null,
      "status": "conditional",
      "emphasis": true
    },
    {
      "id": "gn-02",
      "label": "Edge Data Acquisition",
      "class": "domain",
      "cluster": null,
      "status": "verified",
      "emphasis": false
    },
    {
      "id": "gn-03",
      "label": "Sensor and Security Ingestion",
      "class": "domain",
      "cluster": null,
      "status": "verified",
      "emphasis": false
    },
    {
      "id": "gn-04",
      "label": "Operational Readiness",
      "class": "focus_area",
      "cluster": null,
      "status": "conditional",
      "emphasis": false
    }
  ],
  "edges": [
    {
      "source": "gn-02",
      "target": "gn-01",
      "relation": "supports",
      "strength": "strong",
      "visible_reason": "Primary source of the security intelligence pathway"
    },
    {
      "source": "gn-03",
      "target": "gn-01",
      "relation": "supports",
      "strength": "moderate",
      "visible_reason": "Security ingestion contributes to intelligence throughput"
    },
    {
      "source": "gn-01",
      "target": "gn-04",
      "relation": "informs",
      "strength": "strong",
      "visible_reason": "Security intelligence pathway informs overall readiness verdict"
    }
  ]
}
```

This example is illustrative. It demonstrates safe payload shape without exposing internal IDs, derivation chains, or reconstruction-enabling structure.

**Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01**
