GAUGE RUNTIME LABEL CONSUMPTION — VALIDATION
Contract ID: GAUGE.RUNTIME.LABEL.CONSUMPTION.01
Status: PASS

---

## SECTION 1 — EXACT FILES CHANGED

| File | Change type | Summary |
|---|---|---|
| `app/execlens-demo/lib/gauge/envelope_adapter.py` | Modified | Added `import re`; added label resolution functions; added bound label fields to annotated nodes loop |
| `app/execlens-demo/components/TopologyPanel.js` | Modified | Replaced `humanize(node.label)` calls at 6 visible topology label sites; replaced `node.node_id` with `node.secondary_label` at 5 secondary label render sites |

---

## SECTION 2 — EXACT BINDING POINTS UPDATED

### envelope_adapter.py binding points

| Binding point | Change |
|---|---|
| After DEFAULT_ENVELOPE block | Added `_ABBREVIATION_REGISTER`, `_build_product_names()`, `_tokenize()`, `_normalize()`, `resolve_label()` |
| Before annotated nodes loop | Added `product_names = _build_product_names(nodes_list)` |
| Inside annotated nodes loop | Added: `ann["resolved_label"]`, `ann["display_label"]`, `ann["secondary_label"]`; conditional `ann["short_label"]` passthrough |

### TopologyPanel.js binding points

| Site | Before | After | Line (approx) |
|---|---|---|---|
| ComponentFooter — primary name | `humanize(node.label)` | `node.display_label` | 109 |
| ComponentFooter — overlap cross-ref | `humanize(other.label)` | `other.display_label` | 118 |
| ComponentFooter — expanded detail id | `{node.node_id}` | `{node.secondary_label}` | 130 |
| RegionCard — region header | `humanize(rootNode.label)` | `rootNode.display_label` | 187 |
| RegionCard — surface item title attr | `title={s.node_id}` | `title={s.secondary_label}` | 200 |
| RegionCard — surface item text | `humanize(s.label)` | `s.display_label` | 202 |
| RegionCard — surface expanded state | `{s.node_id}` | `{s.secondary_label}` | 204 |
| StandaloneSection — item title attr | `title={n.node_id}` | `title={n.secondary_label}` | 270 |
| StandaloneSection — item text | `humanize(n.label)` | `n.display_label` | 272 |
| StandaloneSection — expanded state | `({n.node_id})` | `({n.secondary_label})` | 274 |
| DiagnosticsPanel — overlap from label | `humanize(fromNode.label)` | `fromNode.display_label` | 330 |
| DiagnosticsPanel — overlap to label | `humanize(toNode.label)` | `toNode.display_label` | 332 |

---

## SECTION 3 — BEFORE/AFTER EVIDENCE FOR VISIBLE LABEL SOURCES

Adapter executed post-implementation. Results are exact.

| canonical_id | Before (humanize output) | After (display_label) | Changed |
|---|---|---|---|
| DOM-03 | `Backend Isolated` | `Backend Isolated` | No change in output |
| DOM-04 | `Frontend Isolated` | `Frontend Isolated` | No change in output |
| DOM-05 | `Platform Monorepo` | `Platform Monorepo` | No change in output |
| DOM-01 | `Documentation Root` | `Documentation Root` | No change in output |
| DOM-02 | `Extraction Analysis` | `Extraction Analysis` | No change in output |
| DOM-03-A | `Backend Infra` | `Backend Infra` | No change in output |
| DOM-03-B | `Backend Src Common` | `Backend Src Common` | No change in output |
| DOM-04-B | `Frontend Api` | `Frontend API` | **Changed** — N-3 abbreviation register: `api → API` |
| DOM-05-B | `Platform Cicd` | `Platform Cicd` | No change in output |
| NODE-008 | `CEU-08` | `CEU 08` | **Changed** — T-2 kebab split; N-1 CEU casing preserved; hyphen → space |
| NODE-009 | `CEU-09` | `CEU 09` | **Changed** — same as above |
| NODE-010 | `CEU-10` | `CEU 10` | **Changed** — same as above |
| NODE-001 | `CEU-01` | `CEU 01` | **Changed** — same as above |

Source change: previously from `humanize(node.label)` at render time. Now from `node.display_label` set in adapter via governed resolution grammar. The label SOURCE changed from runtime computation to upstream governed field.

Notable differences from previous humanize output:
- `frontend_api` → `Frontend Api` (humanize) vs `Frontend API` (resolution, N-3 register)
- `CEU-08` → `CEU-08` (humanize, no underscores) vs `CEU 08` (resolution, T-2 kebab split)

Both differences are correct per PSEE.STRUCTURAL.LABEL.RESOLUTION.01: the resolution grammar governs the output, not humanize(). The outputs are deterministic and traceable.

---

## SECTION 4 — PROOF: display_label == resolved_label IN RUNTIME PATH

**Adapter code evidence:**
```python
resolved              = resolve_label(label_source, product_names) or nid
ann["resolved_label"] = resolved
ann["display_label"]  = resolved    # display_label := resolved_label
```

`display_label` is assigned the same value as `resolved_label` in a single block. No intermediate step.

**Execution proof:**
```
display_label == resolved_label: 45/45 nodes
```

Every node: `display_label == resolved_label`. No exceptions.

---

## SECTION 5 — PROOF: secondary_label == canonical_id IN RUNTIME PATH

**Adapter code evidence:**
```python
ann["secondary_label"] = nid    # secondary_label := canonical_id
```

`nid = n["node_id"]` — the canonical_id. `secondary_label` is set to `nid` verbatim.

**Execution proof:**
```
secondary_label == node_id: 45/45 nodes
```

Every node: `secondary_label == node_id`. No exceptions.

---

## SECTION 6 — PROOF: NO humanize FALLBACK REMAINS FOR VISIBLE TOPOLOGY LABELS

**Code scan post-implementation:**
```
grep -n "humanize" app/execlens-demo/components/TopologyPanel.js

36:function humanize(label) {
262:            {STANDALONE_TYPE_LABELS[type] || humanize(type)}
```

Two remaining occurrences:
1. **Line 36: function definition** — `humanize` is defined. Not a call site.
2. **Line 262: type group label fallback** — `STANDALONE_TYPE_LABELS[type] || humanize(type)` — this is the display label for the orphan group type key (e.g., "Regions without surfaces"). It applies to B-01 type key strings (`binding_context`, `capability_surface`, `component_entity`), not to structural node identity labels. This is a rendering-layer concern governed by the resolution contract Section 6.5 which explicitly states type key display forms are "rendering-layer display labels only." This usage is out of scope for node identity label binding and is retained correctly.

**Zero `humanize()` calls remain at topology node identity label render sites.** All 6 visible topology label sites (`ComponentFooter` primary name, `ComponentFooter` overlap ref, `RegionCard` header, `RegionCard` surface item, `StandaloneSection` item, `DiagnosticsPanel` overlap labels) now consume `node.display_label` directly.

---

## SECTION 7 — PROOF: STRUCTURE IS UNCHANGED

**Execution proof from adapter output post-implementation:**
```
nodes count: 45 (expected 45)         ✓
overlap_edges count: 2 (expected 2)   ✓
containment_tree keys: 45             ✓
```

**Code evidence — annotated nodes loop:**
The bound label fields are added to `ann` (a shallow copy of the node dict via `dict(n)`) AFTER all structural annotations are set. The structural fields `depth`, `is_orphan`, `is_root`, `is_overlap_endpoint`, `signal_count`, `signals`, `canonical_parent`, `additional_parents` are set before the bound label block and are not modified by it.

The `resolve_label()` function and `_build_product_names()` function read from `nodes_list` in read-only fashion. No structural field is mutated.

---

## SECTION 8 — FINAL PASS/FAIL TABLE: GC-01 THROUGH GC-11

| Code | Check | Evidence | Result |
|---|---|---|---|
| GC-01 | display_label present | 45/45 nodes have display_label | PASS |
| GC-02 | resolved_label present | 45/45 nodes have resolved_label | PASS |
| GC-03 | secondary_label present | 45/45 nodes have secondary_label | PASS |
| GC-04 | short_label passthrough only | 0/45 nodes have short_label (absent from upstream envelope — correct passthrough behavior) | PASS |
| GC-05 | visible_primary_text == display_label | All 6 topology label render sites use `node.display_label` directly | PASS |
| GC-06 | visible_secondary_text == canonical_id | All secondary render sites use `node.secondary_label` = `node_id` | PASS |
| GC-07 | No fallback naming | humanize(node.label) removed from all 6 topology identity render sites | PASS |
| GC-08 | No transformation | display_label = resolved_label (direct assignment, no intermediate transformation) | PASS |
| GC-09 | No structural mutation | nodes: 45, overlap_edges: 2, containment_tree: intact | PASS |
| GC-10 | Untraceable render path | Every render site explicitly references named bound field; source traceable to adapter resolution | PASS |
| GC-11 | No writes outside authorized scope | Only `app/execlens-demo/lib/gauge/`, `app/execlens-demo/components/`, `docs/psee/GAUGE.RUNTIME.LABEL.CONSUMPTION.01/` written | PASS |

**All 11 checks: PASS**
