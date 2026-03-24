# ENL-008: Narrative Coupling Model

**Contract:** ENL-008-CONTRACT-v1
**Layer:** Narrative Coupling
**Depends On:** ENL-004 (Lens Binding), ENL-005 (Persona Projection), ENL-006 (Drill-Down)
**Status:** Active

---

## 1. Purpose

The Narrative Coupling Layer bridges ENL evidence chains and human-readable narrative output. Every element of the generated narrative is directly grounded in ENL node data — no inference, synthesis, summarization, or data transformation is applied.

The narrative layer is a **read-only projection** of the ENL evidence graph, not an interpretation of it.

---

## 2. Compliance with Evidence First Doctrine

The Evidence First doctrine requires that all narrative claims be traceable to source evidence without ambiguity. ENL-008 enforces this by:

1. Producing all statement text from verbatim node field values
2. Attaching a `node_id` to every generated statement
3. Separating headline, support, and evidence tiers by ENL layer
4. Explicitly flagging incomplete evidence chains rather than presenting partial chains as resolved
5. Prohibiting any enrichment, inference, or aggregation that alters factual content

---

## 3. Narrative Structure

A narrative output has the following structure:

```
{
  "view_type":         str,           — Lens view type that produced this narrative
  "headline":          str | None,    — verbatim title of the first INTEL node
  "headline_node_id":  str | None,    — node_id of the headline source node
  "statements":        [ statement ], — INTEL + SIG-41 + SIG-40 in chain order
  "evidence":          [ statement ], — EVID nodes in chain order
  "evidence_trace":    [ node_id ],   — all node_ids in chain order
  "status":            str,           — complete | incomplete
  "node_count":        int,
  "incomplete_reason": str | None,    — present when status == incomplete
}
```

A **statement** has the following structure:

```
{
  "node_id":    str,  — ENL node identifier (always present)
  "node_type":  str,  — ENL layer type
  "role":       str,  — headline | support | evidence
  "text":       str,  — verbatim node title (no transformation)
  "source_ref": str,  — node source reference
  "status":     str,  — node lifecycle status
  "run_id":     str,  — run identifier
}
```

---

## 4. Layer Mapping Rules

| ENL Layer | Narrative Role | Placement |
|---|---|---|
| INTEL | `headline` | First INTEL node → headline + statements[0]; additional INTEL → statements |
| SIG-41 | `support` | statements list |
| SIG-40 | `support` | statements list |
| EVID | `evidence` | evidence list |

The first INTEL node in the chain is designated the headline. Its title becomes the `headline` field and its `node_id` becomes `headline_node_id`. It also appears in `statements` with `role = "headline"` so that every node in the chain is represented exactly once across `statements` and `evidence`.

EVID nodes are placed exclusively in the `evidence` list, not in `statements`. They represent terminal evidence references, not narrative claims.

---

## 5. Evidence Trace

The `evidence_trace` field is the ordered list of `node_id` values for every node in the chain. It provides a compact traceability reference linking the narrative output back to the ENL graph.

`attach_evidence_trace(narrative, chain)` replaces the compact `evidence_trace` with a detailed list of scalar node snapshots:

```
{
  "node_id":    str,
  "node_type":  str,
  "title":      str,
  "source_ref": str,
  "status":     str,
  "run_id":     str,
}
```

Snapshots are scalar copies — they do not reference the original ENL node dicts.

---

## 6. Narrative Status

| Status | Condition |
|---|---|
| `complete` | Chain contains at least one EVID node |
| `incomplete` | Chain ends before EVID (no EVID node present) |

When status is `incomplete`, the `incomplete_reason` field provides a human-readable explanation including the present layer types. Incomplete status must not be presented as a resolved evidence conclusion.

---

## 7. Persona Influence (Display-Only)

When a persona-projected view is passed to `generate_narrative`, the persona's `node_display` labels are **not used** as statement text. The `text` field in every statement always contains the verbatim node title from the ENL node dict.

Persona projection (ENL-005) is display-only. It does not alter the factual content of narrative statements. The `node_display` dict from a persona-projected view is available to the consuming UI layer for visual rendering (label prefixes, highlight, confidence flags) but is not written into the narrative structure.

---

## 8. View Type Compatibility

`generate_narrative` accepts any Lens view structure or drill-down session:

| View Type | Source | Chain Extraction |
|---|---|---|
| `upstream` | `bind_get_upstream_view` | `view['chain']` |
| `drilldown_session` | `create_drilldown_session` | `view['chain']` (full, not current position) |
| `query` | `bind_get_query_view` | `view['subgraph']`, sorted by layer order |
| `full_graph` | `bind_get_full_graph` | `view['nodes']`, sorted by layer order |
| `node` | `bind_get_node` | `[view['node']]` |

For upstream and drill-down views, chain order is preserved exactly. For unordered views (query, full graph), nodes are sorted by `(LAYER_ORDER, node_id)` to produce deterministic narrative ordering.

For drill-down sessions, `generate_narrative` uses the full chain regardless of the session's current navigation position. Navigation state is a UI concern; narrative generation operates on the complete evidence chain.

---

## 9. Immutability

The narrative layer never modifies:

- ENL node dicts
- Input view structures
- Input chain lists
- Input narrative dicts (in `attach_evidence_trace`)

All functions produce new dicts. No in-place mutation occurs at any level.

---

## 10. Determinism

Identical inputs always produce identical outputs. Sources of non-determinism are excluded:

- No random ordering
- No timestamp-based fields in output
- Sorting by `(LAYER_ORDER, node_id)` is stable and reproducible
- No caching or stateful computation
