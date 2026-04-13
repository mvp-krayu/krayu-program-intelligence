GAUGE RUNTIME LABEL CONSUMPTION CONTRACT
Contract ID: GAUGE.RUNTIME.LABEL.CONSUMPTION.01
Layer: Runtime Exposure (42.x) — GAUGE Label Consumption
Status: IMPLEMENTED

---

## SECTION 1 — OBJECTIVE

Implement the missing runtime label consumption path so that GAUGE renders bound structural labels from governed fields (`display_label`, `secondary_label`) rather than computing labels via transformation at render time.

Before this implementation:
- Visible topology labels were produced by `humanize(node.label)` — a transformation applied at render sites
- No `display_label`, `resolved_label`, `secondary_label`, or `short_label` fields existed in the runtime data flow
- GAUGE.RUNTIME.LABEL.BINDING.01 and PSEE.STRUCTURAL.LABEL.RESOLUTION.01 were not implemented

After this implementation:
- `resolved_label`, `display_label`, `secondary_label` are present on every annotated node in the adapter output
- All visible topology label render sites consume `node.display_label` and `node.secondary_label` directly
- `humanize(node.label)` is no longer called for any visible topology node label

---

## SECTION 2 — AUTHORITATIVE INPUTS

| # | Input | Role in this implementation |
|---|---|---|
| 1 | GAUGE.RUNTIME.LABEL.BINDING.01 | Binding field mapping: `display_label := resolved_label`, `secondary_label := canonical_id`, `short_label` passthrough |
| 2 | PSEE.STRUCTURAL.LABEL.RESOLUTION.01 | Transformation grammar for producing `resolved_label` from label source |
| 3 | GAUGE.RUNTIME.RENDERING.VALIDATION.01 | Failure proof identifying exact render sites and failure codes to remediate |
| 4 | `app/execlens-demo/lib/gauge/envelope_adapter.py` | Adapter — where bound label fields are injected |
| 5 | `app/execlens-demo/components/TopologyPanel.js` | Rendering surface — where fallback label consumption is replaced |

---

## SECTION 3 — NARROW IMPLEMENTATION SCOPE

Two files modified. No other files written outside authorized output.

**`app/execlens-demo/lib/gauge/envelope_adapter.py`**
- Added `import re`
- Added structural label resolution functions implementing PSEE.STRUCTURAL.LABEL.RESOLUTION.01 grammar: `_build_product_names()`, `_tokenize()`, `_normalize()`, `resolve_label()`
- Added `_ABBREVIATION_REGISTER` (closed set from Section 5.3 of resolution contract)
- In `build_render_model()`: added product names corpus build before annotated nodes loop
- In annotated nodes loop: added `resolved_label`, `display_label`, `secondary_label` fields; `short_label` passthrough when present upstream
- No structural derivation logic changed; no existing field modified

**`app/execlens-demo/components/TopologyPanel.js`**
- Replaced `humanize(node.label)` → `node.display_label` at ComponentFooter primary label (line 109)
- Replaced `humanize(other.label)` → `other.display_label` at ComponentFooter overlap ref (line 118)
- Replaced `{node.node_id}` → `{node.secondary_label}` at ComponentFooter expanded detail (line 130)
- Replaced `humanize(rootNode.label)` → `rootNode.display_label` at RegionCard header (line 187)
- Replaced `title={s.node_id}` → `title={s.secondary_label}` at RegionCard surface item title attr (line 200)
- Replaced `humanize(s.label)` → `s.display_label` at RegionCard surface item text (line 202)
- Replaced `{s.node_id}` → `{s.secondary_label}` at RegionCard surface item expanded state (line 204)
- Replaced `title={n.node_id}` → `title={n.secondary_label}` at StandaloneSection item title attr (line 270)
- Replaced `humanize(n.label)` → `n.display_label` at StandaloneSection item text (line 272)
- Replaced `{n.node_id}` → `{n.secondary_label}` at StandaloneSection item expanded state (line 274)
- Replaced `humanize(fromNode.label)` → `fromNode.display_label` at DiagnosticsPanel overlap (line 330)
- Replaced `humanize(toNode.label)` → `toNode.display_label` at DiagnosticsPanel overlap (line 332)
- `humanize()` function retained: still used at line 262 for type group display label fallback in StandaloneSection (`STANDALONE_TYPE_LABELS[type] || humanize(type)`) — rendering-layer concern for B-01 type key display text, not a structural node identity label

---

## SECTION 4 — BOUND FIELD CONSUMPTION RULES

| Rule | Implementation |
|---|---|
| `display_label := resolved_label` | Adapter: `ann["display_label"] = resolved` where `resolved = resolve_label(label_source, product_names)` |
| `secondary_label := canonical_id` | Adapter: `ann["secondary_label"] = nid` where `nid = n["node_id"]` |
| `short_label` passthrough only | Adapter: `if "short_label" in n: ann["short_label"] = n["short_label"]` — key absent when not in upstream |
| visible primary label consumes `display_label` | TopologyPanel.js: all 6 visible topology label render sites use `node.display_label` |
| visible secondary label consumes `secondary_label` | TopologyPanel.js: all secondary label render sites use `node.secondary_label` |
| No label derived from `node.label` through transformation | TopologyPanel.js: `humanize(node.label)` removed from all topology node identity render sites |

---

## SECTION 5 — PROHIBITION SET

All prohibitions from GAUGE.RUNTIME.LABEL.CONSUMPTION.01 contract are enforced:
- No use of `humanize(node.label)` for visible GAUGE topology text — REMOVED from all 6 render sites
- No recomputation of `short_label` — `short_label` is passthrough only; key absent when not in upstream
- No beautification of `canonical_id` — `secondary_label = node_id` verbatim
- No mutation of structural topology data — annotated nodes loop adds new fields only; all existing fields unchanged
- No change to structural grouping logic — `containment_tree`, `roots`, `orphans` derivation unchanged
- No redesign of layout — RegionCard, StandaloneSection, ComponentFooter structure unchanged
- No writes outside authorized output — only `app/execlens-demo/lib/gauge/`, `app/execlens-demo/components/`, `docs/psee/GAUGE.RUNTIME.LABEL.CONSUMPTION.01/`

---

## SECTION 6 — FAILURE MODES

| Code | Name | Status after implementation |
|---|---|---|
| GC-01 | display_label absent | RESOLVED — present on all 45 nodes |
| GC-02 | resolved_label absent | RESOLVED — present on all 45 nodes |
| GC-03 | secondary_label absent | RESOLVED — present on all 45 nodes |
| GC-04 | short_label recomputed | NOT TRIGGERED — short_label passthrough only; absent from all nodes (not in upstream envelope) |
| GC-05 | visible_primary_text ≠ display_label | RESOLVED — all render sites use `node.display_label` directly |
| GC-06 | visible_secondary_text ≠ canonical_id | RESOLVED — all secondary render sites use `node.secondary_label = node_id` |
| GC-07 | fallback naming still present | RESOLVED — `humanize(node.label)` removed from all topology node identity render sites |
| GC-08 | transformation still present | RESOLVED — no transformation applied between `resolved_label` and `display_label` |
| GC-09 | structural mutation introduced | NOT TRIGGERED — all structural fields unchanged; only additive fields added |
| GC-10 | untraceable render path | NOT TRIGGERED — every render site explicitly references a named bound field |
| GC-11 | writes outside authorized scope | NOT TRIGGERED — only authorized paths modified |

---

## SECTION 7 — SUCCESS CONDITION

All success conditions are met:
- Bound label fields present in runtime data flow: YES (45/45 nodes)
- Runtime visibly consumes bound labels: YES (display_label at all 6 topology render sites)
- canonical_id preserved as secondary text: YES (secondary_label = node_id at all secondary render sites)
- No fallback naming exists: YES (humanize(node.label) removed from all topology identity render sites)
- No transformation exists at binding or rendering layer: YES
- Structure unchanged: YES (nodes: 45, overlap_edges: 2, containment_tree: intact)
- All visible labels traceable to governed fields: YES
