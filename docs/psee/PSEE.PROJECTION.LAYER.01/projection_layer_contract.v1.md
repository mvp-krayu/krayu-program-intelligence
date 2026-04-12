#STATUS: BASELINE — PROJECTION LAYER V1 (EXTRACTED FROM DEMO)
## PSEE Projection Layer — Formal Contract v1
**Contract ID:** PSEE.PROJECTION.LAYER.CONTRACT.V1  
**Extraction basis:** PSEE.PROJECTION.LAYER.01 forensic and boundary maps  
**Type:** Formal extraction only — no redesign, no implementation proposal  
**Date:** 2026-04-12  
**Authoritative inputs:**
- `/tmp/psee_projection_forensic_map.md`
- `/tmp/psee_projection_boundary_map.md`

---

## SECTION 1 — PROJECTION LAYER V1: ADMISSIBLE SCOPE

The following criteria govern admissibility into Projection Layer v1. An item is admissible if and only if it satisfies all five conditions:

1. Deterministic derivation (same `binding_envelope.json` → same output)
2. Proven by forensic evidence (T-01 through T-08, G-01 through G-07)
3. Structural — consumable by any renderer without React-specific logic
4. Not blocked by B-01 through B-04
5. Not rendering-only, not heuristic, not dead

**Applying these criteria:**

| Item | Source Finding | Admissible | Reason If Excluded |
|---|---|---|---|
| Containment tree | T-02, Section 3A | YES | — |
| Roots list | T-02, Section 3A | YES | — |
| Non-orphan root set | T-02 MIXED, Section 3A | YES | Structural filter; not blocked |
| Orphan detection | T-03, Section 3A | YES | — |
| Orphan grouping by type | T-03 MIXED, Section 3A | NO | Blocked B-01: node type vocabulary not governed |
| BFS depth assignment | T-02, Section 3A | YES | — |
| Multi-parent detection | T-02, Section 3A | YES | — |
| Edge type partition | T-05, Section 3A | YES | — |
| Overlap endpoint annotation | T-04, Section 3A | YES | — |
| Per-node overlap adjacency | T-04 MIXED, Section 3A | YES | Structural; not blocked |
| Signal grouping by node | T-06, Section 3A | YES | — |
| Signal counts per node | T-06, Section 3A | YES | — |
| Signal health state | T-06 MIXED, Section 3A | NO | Blocked B-02: computation_state sentinel not governed |
| Summary counts | T-08, Section 3A | YES | — |
| Constraint flags passthrough | T-07, Section 3A | YES | — |
| Overlap evidence linkage | T-07 MIXED, G-04 | NO | Blocked B-03: broken heuristic, no linkable structure |
| Label humanization | T-01, Section 3B | NO | RENDERING_ONLY |
| Standalone type display labels | G-03, Section 3C | NO | Blocked B-01 + RENDERING_ONLY |
| Fold threshold | G-02, Section 3B | NO | UNGOVERNED_PRESENTATION |
| Interaction state | Section 3B | NO | RENDERING_ONLY |
| Pill wording/order | T-07, Section 3B | NO | UNGOVERNED_PRESENTATION |
| capability_surfaces_index | G-06, Section 3C | NO | DEAD_FIELD |
| sharedCount label | G-07, Section 3C | NO | UNGOVERNED_PRESENTATION |

**Projection Layer v1 admissible scope — final list:**

1. Containment tree (canonical children per parent)
2. Additional parent refs (non-canonical parent references)
3. Roots list (stable input order)
4. Non-orphan root set (roots minus orphans)
5. Orphan list (sorted)
6. Node depth map (BFS from roots)
7. Multi-parent node map
8. Per-node annotations: `depth`, `is_root`, `is_orphan`, `is_overlap_endpoint`, `canonical_parent`, `additional_parents`, `signal_count`, `signals[]`, `overlap_adjacent_node_ids[]`
9. Edge partition: `overlap_edges[]`, `unknown_edges[]`
10. Signal grouping: `signals_by_node{}`, `orphan_signals[]`
11. Summary counts
12. Constraint flags (verbatim passthrough)

---

## SECTION 2 — PROJECTION LAYER V1: MINIMAL CONTRACT

Each field or group is defined by its derivation rule, source, and downstream use. Only fields proven by forensic evidence are included. Two new field names are introduced where necessary to formalize currently-mixed structural derivations; all others use names already proven in the DEMO code.

---

### FIELD/GROUP: `nodes[]` (annotated)

**SOURCE:** `envelope_adapter.py` → `build_render_model()`, annotated_nodes loop

**DERIVATION RULE:**
For each node in `envelope.nodes[]` (stable input order preserved), produce an annotated copy with all sub-fields listed below. No node is added or removed.

**WHY ADMISSIBLE:** Direct derivation from `binding_envelope.nodes[]`; all annotations are deterministic; proven by T-02, T-03, T-04, T-06.

**DOWNSTREAM USE:** Primary node lookup for all rendering paths.

Sub-fields per node:

**`node_id`** — passthrough from envelope  
**`label`** — passthrough from envelope (raw, unformatted)  
**`type`** — passthrough from envelope (`node.type` field)  
**`depth`** — integer; BFS distance from nearest root over CONTAINS edges; 0 for roots and unreachable nodes  
**`is_root`** — boolean; true if node has no inbound CONTAINS edges  
**`is_orphan`** — boolean; true if node has no inbound AND no outbound CONTAINS edges  
**`is_overlap_endpoint`** — boolean; true if node appears as `from_node` or `to_node` in any OVERLAP_STRUCTURAL edge  
**`signal_count`** — integer; count of signals in `signals[]` where `signal.node_id == node_id`  
**`signals[]`** — list; all signal objects from `envelope.signals[]` where `signal.node_id == node_id`; empty list if none  
**`canonical_parent`** — string or absent; the `from_node` of the first CONTAINS edge in `envelope.edges[]` where `to_node == node_id`; absent if node has no CONTAINS parents  
**`additional_parents[]`** — list; all other parent node_ids beyond `canonical_parent`; empty list if node has zero or one parent  
**`overlap_adjacent_node_ids[]`** — *(new field — minimal formalization of T-04 MIXED derivation)* list; all node_ids connected to this node by an OVERLAP_STRUCTURAL edge; empty list if node is not an overlap endpoint. Derivation: `[e.to_node for e in overlap_edges if e.from_node == node_id] + [e.from_node for e in overlap_edges if e.to_node == node_id]`

---

### FIELD/GROUP: `containment_tree{}`

**SOURCE:** `envelope_adapter.py` → `containment_tree` dict (lines 154–169)

**DERIVATION RULE:**
For each parent node appearing in CONTAINS edges: collect all child node_ids where `canonical_parent[child] == parent`. Deduplicate; preserve `edges[]` input order. Result: `{parent_id: [child_id, ...]}` containing only canonical children.

**WHY ADMISSIBLE:** Deterministic; proven by T-02; field name already in DEMO render model.

**DOWNSTREAM USE:** `RegionCard` surface list, component list; any renderer building a tree view.

---

### FIELD/GROUP: `additional_parent_refs{}`

**SOURCE:** `envelope_adapter.py` → `additional_parent_refs` dict

**DERIVATION RULE:**
For each parent node, collect all child node_ids appearing in its CONTAINS edges where `canonical_parent[child] != parent`. Result: `{parent_id: [child_id, ...]}`.

**WHY ADMISSIBLE:** Deterministic; proven by T-02; field name already in DEMO render model.

**DOWNSTREAM USE:** Rendering non-canonical containment relationships; multi-parent node display.

---

### FIELD/GROUP: `roots[]`

**SOURCE:** `envelope_adapter.py` → `roots` list (line 111)

**DERIVATION RULE:**
All node_ids in `envelope.nodes[]` where node_id does not appear as `to_node` in any CONTAINS edge. Stable: preserves `envelope.nodes[]` input order.

**WHY ADMISSIBLE:** Deterministic; proven by T-02; field name already in DEMO render model.

**DOWNSTREAM USE:** Source list for BFS depth assignment; base set for `non_orphan_roots`.

---

### FIELD/GROUP: `non_orphan_roots[]`

**SOURCE:** `TopologyPanel.js` → `EnvelopeTopology` line 412 — `roots.filter(r => !orphanSet.has(r))` *(currently in rendering — admissible structural derivation)*

**DERIVATION RULE:**
`[r for r in roots if r not in orphan_ids]` — all root node_ids that have at least one outbound CONTAINS edge (i.e., are not orphans). Stable: preserves `roots[]` order.

**WHY ADMISSIBLE:** Deterministic; purely structural (which roots are valid grid regions); not blocked; proven by T-02 MIXED finding. New field name introduced because this derivation has no current adapter-level field name.

**DOWNSTREAM USE:** Determines which roots are rendered as layout regions. Any renderer building a grid of non-trivial regions uses this list directly.

---

### FIELD/GROUP: `orphans[]`

**SOURCE:** `envelope_adapter.py` → `orphan_ids` set, returned as sorted list

**DERIVATION RULE:**
All node_ids in `envelope.nodes[]` where node_id does not appear in `has_inbound` (no inbound CONTAINS) AND does not appear in `has_outbound` (no outbound CONTAINS). Returned as `sorted(orphan_ids)`.

**WHY ADMISSIBLE:** Deterministic; proven by T-03; field name already in DEMO render model.

**DOWNSTREAM USE:** `StandaloneSection` input; excluded from `non_orphan_roots`.

---

### FIELD/GROUP: `node_depths{}`

**SOURCE:** `envelope_adapter.py` → `node_depths` dict (lines 120–135)

**DERIVATION RULE:**
BFS from each root (depth 0); each child node reached via CONTAINS edge receives `parent_depth + 1`. Nodes not reachable from roots (but appearing in CONTAINS edges) assigned depth 0.

**WHY ADMISSIBLE:** Deterministic; proven by T-02; field name already in DEMO render model.

**DOWNSTREAM USE:** Layout depth ordering; available for any renderer requiring depth-ordered display.

---

### FIELD/GROUP: `multi_parent_nodes{}`

**SOURCE:** `envelope_adapter.py` → `multi_parent` dict

**DERIVATION RULE:**
`{child_id: [parent_id, ...]}` for all child node_ids appearing in more than one CONTAINS edge. Parent list preserves `edges[]` input order.

**WHY ADMISSIBLE:** Deterministic; proven by T-02; field name already in DEMO render model.

**DOWNSTREAM USE:** Multi-parent node identification; `additional_parents[]` annotation source.

---

### FIELD/GROUP: `overlap_edges[]`

**SOURCE:** `envelope_adapter.py` → `overlap_edges` partition (line 93)

**DERIVATION RULE:**
All edges from `envelope.edges[]` where `edge_type == "OVERLAP_STRUCTURAL"`. Verbatim passthrough; stable input order.

**WHY ADMISSIBLE:** Deterministic; proven by T-05; field name already in DEMO render model.

**DOWNSTREAM USE:** Cross-boundary reference rendering; source for `is_overlap_endpoint` and `overlap_adjacent_node_ids[]`.

---

### FIELD/GROUP: `unknown_edges[]`

**SOURCE:** `envelope_adapter.py` → `unknown_edges` partition (lines 94–97)

**DERIVATION RULE:**
All edges from `envelope.edges[]` where `edge_type` is neither `"CONTAINS"` nor `"OVERLAP_STRUCTURAL"`. Verbatim passthrough; stable input order.

**WHY ADMISSIBLE:** Deterministic; fail-open classification (unknown types flagged, not silently ignored); proven by T-05; field name already in DEMO render model.

**DOWNSTREAM USE:** Diagnostic display only; never rendered as topology.

---

### FIELD/GROUP: `signals_by_node{}`

**SOURCE:** `envelope_adapter.py` → `signals_by_node` dict (lines 177–185)

**DERIVATION RULE:**
`{node_id: [signal, ...]}` for all signals in `envelope.signals[]` where `signal.node_id` exists in `node_index`. Stable: signal append order preserves `envelope.signals[]` input order.

**WHY ADMISSIBLE:** Deterministic; proven by T-06; field name already in DEMO render model.

**DOWNSTREAM USE:** Node-level signal access; basis for `signal_count` and `signals[]` node annotations.

---

### FIELD/GROUP: `orphan_signals[]`

**SOURCE:** `envelope_adapter.py` → `orphan_signals` list (lines 177–185)

**DERIVATION RULE:**
All signal objects from `envelope.signals[]` where `signal.node_id` is absent or does not appear in `node_index`. Stable input order.

**WHY ADMISSIBLE:** Deterministic; preserves all evidence; proven by T-06; field name already in DEMO render model.

**DOWNSTREAM USE:** Signal integrity accounting; not rendered in primary topology.

---

### FIELD/GROUP: `summary{}`

**SOURCE:** `envelope_adapter.py` → `summary` dict (lines 206–217)

**DERIVATION RULE:**
Integer counts derived from `len()` of stable collections:
- `nodes_count`, `roots_count`, `orphans_count`
- `edges_count`, `contains_edges_count`, `overlap_edges_count`, `unknown_edges_count`
- `signals_count`, `orphan_signals_count`, `multi_parent_nodes_count`

**WHY ADMISSIBLE:** Deterministic; proven by T-08; field names already in DEMO render model.

**DOWNSTREAM USE:** Panel header display; integrity verification.

---

### FIELD/GROUP: `constraint_flags{}`

**SOURCE:** `envelope_adapter.py` → verbatim passthrough from `envelope.constraint_flags`

**DERIVATION RULE:**
Direct assignment: `constraint_flags = envelope["constraint_flags"]`. No transformation applied.

**WHY ADMISSIBLE:** Passthrough; structural truth from canonical source; proven by T-07; field name already in DEMO render model.

**DOWNSTREAM USE:** `DiagnosticsPanel` input; pill construction; evidence display (evidence linkage excluded — see Exclusion Register).

---

## SECTION 3 — EXCLUSION REGISTER

---

**ITEM:** Label humanization (`humanize()` function)  
**REASON EXCLUDED:** Purely visual formatting — underscore-to-space conversion and title-casing carry no structural meaning. The raw `label` field is the projection-correct value.  
**CLASS:** RENDERING_ONLY  
**RETURN CONDITION:** Never — label formatting is a rendering concern by definition and must not enter projection.

---

**ITEM:** Standalone type display labels (`STANDALONE_TYPE_LABELS` mapping)  
**REASON EXCLUDED:** Encodes semantic interpretation of node type vocabulary (`binding_context` → "Regions without surfaces", etc.) that is not stated in any governing contract. Depends on B-01 (node type vocabulary) being resolved first.  
**CLASS:** BLOCKED_BY_SEMANTICS  
**RETURN CONDITION:** When the node type vocabulary (`binding_context`, `capability_surface`, `component_entity`) is formally stated in a governing contract, and type semantics in the unbound/orphan state are explicitly defined.

---

**ITEM:** Orphan grouping by type (`orphans_by_type{}`)  
**REASON EXCLUDED:** The grouping logic is a structural derivation from `node.type` but cannot be formalized without a governed node type list. Blocked by B-01.  
**CLASS:** BLOCKED_BY_SEMANTICS  
**RETURN CONDITION:** Same as standalone type labels — when node type vocabulary is formally governed.

---

**ITEM:** Signal health state (`has_degraded_signal` / `computation_state !== 'AVAILABLE'`)  
**REASON EXCLUDED:** The field name `computation_state` and its sentinel value `AVAILABLE` are not stated in any contract. A projection pre-computation would embed ungoverned implicit semantics. Blocked by B-02.  
**CLASS:** BLOCKED_BY_SEMANTICS  
**RETURN CONDITION:** When `computation_state` is formally stated as a governed signal field and its nominal/healthy value is explicitly specified in a contract.

---

**ITEM:** Overlap evidence–to–edge linkage (evidence heuristic in `DiagnosticsPanel`)  
**REASON EXCLUDED:** Broken heuristic — the substring match against `cf.overlap_evidence[]` currently resolves to `undefined` for all overlap edges because evidence strings use internal identifiers not present in `node.label` or `node.node_id`. A projection layer cannot formally specify a broken derivation.  
**CLASS:** BROKEN_HEURISTIC  
**RETURN CONDITION:** When `envelope.edges[]` overlap entries carry a direct `evidence_id` (or equivalent) that matches a keyed entry in `constraint_flags.overlap_evidence`, making linkage deterministic without substring search.

---

**ITEM:** `capability_surfaces_index` field  
**REASON EXCLUDED:** Dead field — present in the render model, consumed by no rendering component. `capability_surfaces` nodes are already reachable through `nodes[]` and `containment_tree`. No rendering use case is defined for the dedicated index.  
**CLASS:** DEAD_FIELD  
**RETURN CONDITION:** When a specific rendering use case for `capability_surfaces[]` as a separate indexed collection is formally defined — distinct from the standard `nodes[]` rendering path.

---

**ITEM:** Surface fold threshold (`SURFACE_PREVIEW = 5`)  
**REASON EXCLUDED:** Ungoverned hardcoded presentation constant with no origin in any contract or envelope field. Controls information density in the UI; not a structural determination.  
**CLASS:** UNGOVERNED_PRESENTATION  
**RETURN CONDITION:** Never enters projection. If governance is needed, it belongs in a rendering spec, not in the projection layer.

---

**ITEM:** DiagnosticsPanel pill wording and ordering  
**REASON EXCLUDED:** The text strings ("N overlap", "N unknown space", "parity recovery") and their ordering in the pill list are presentation choices, not structural derivations.  
**CLASS:** UNGOVERNED_PRESENTATION  
**RETURN CONDITION:** Never enters projection. Rendering concern only.

---

**ITEM:** Interaction state (`expandedNodes` Set, `onToggle`)  
**REASON EXCLUDED:** React UI state — not a structural derivation, not consumable by a non-interactive renderer.  
**CLASS:** RENDERING_ONLY  
**RETURN CONDITION:** Never — interaction state is a rendering concern by definition.

---

**ITEM:** sharedCount "across N surfaces" label  
**REASON EXCLUDED:** The count computation mixes `canonical_parent` (always 1) with `additional_parents.length`. The label "surfaces" implies a semantic mapping of parent node type to "surface" that is not formally stated. The display threshold (`> 1`) is ungoverned.  
**CLASS:** UNGOVERNED_PRESENTATION  
**RETURN CONDITION:** The underlying multi-parent data (`canonical_parent`, `additional_parents`) is already in projection. The label may return only when the mapping of parent count to "surface count" is formally stated and the threshold is governed in a rendering spec.

---

## SECTION 4 — BLOCKER REGISTER

---

**BLOCKER:** B-01 — Node type vocabulary not governed  
**AFFECTED ITEM(S):** Orphan grouping by type; standalone type display labels  
**WHY IT BLOCKS:** The node type strings appearing in `envelope.nodes[].type` — `binding_context`, `capability_surface`, `component_entity` — are used as grouping keys for orphaned nodes and as display label lookup keys. Their semantic meaning in the context of unbound/orphan state is implied by the type names but not stated in any governing artifact. A projection contract specifying type-based grouping cannot be written without a governed type list because the grouping logic would embed an ungoverned vocabulary assumption.  
**MINIMUM GOVERNANCE NEEDED:** A formal statement (in a governing artifact) of the complete node type vocabulary for `binding_envelope.json` and the semantic meaning of each type in the orphan/unbound state.

---

**BLOCKER:** B-02 — `computation_state` / `AVAILABLE` sentinel not governed  
**AFFECTED ITEM(S):** Signal health state pre-computation (`has_degraded_signal`)  
**WHY IT BLOCKS:** The signal accent condition in `SignalDot` depends on two facts embedded as code: (1) the field name is `computation_state`, (2) the healthy value is the string `AVAILABLE`. Neither is stated in any contract. Moving this derivation into the projection layer would carry the ungoverned assumption forward — a projection contract must not embed undocumented field semantics.  
**MINIMUM GOVERNANCE NEEDED:** A formal statement that `computation_state` is a governed signal field, and that `AVAILABLE` is its specified nominal/healthy value. This must appear in a governing artifact for the signal schema.

---

**BLOCKER:** B-03 — Overlap evidence has no linkable structure  
**AFFECTED ITEM(S):** Overlap evidence–to–edge linkage  
**WHY IT BLOCKS:** `constraint_flags.overlap_evidence[]` contains strings of the form `"OVL-01 (DOM-03↔DOM-05-C)"` using internal identifiers that do not appear in `node.node_id` or `node.label` for the actual overlap endpoint nodes (NODE-008, NODE-009, NODE-010). There is no deterministic way to link an overlap edge to its evidence record without structural support from the envelope. The current substring heuristic is a no-op against real data.  
**MINIMUM GOVERNANCE NEEDED:** The envelope must carry a direct reference between overlap edges and evidence records — either an `evidence_id` field on OVERLAP_STRUCTURAL edges, or a keyed lookup structure in `constraint_flags` that maps evidence identifiers to `node_id` pairs.

---

**BLOCKER:** B-04 — `capability_surfaces_index` has no defined use case  
**AFFECTED ITEM(S):** `capability_surfaces_index` field; any rendering path specific to the `capability_surfaces[]` collection  
**WHY IT BLOCKS:** The `capability_surfaces[]` collection from the envelope is re-exposed as `capability_surfaces_index` in the render model. No rendering component in the DEMO reads this field. The nodes it references are rendered through the standard `nodes[]` path. Without a defined use case that requires the indexed form to be distinct from the standard path, a projection contract cannot specify what a renderer should do with it or why the field exists as a separate top-level key.  
**MINIMUM GOVERNANCE NEEDED:** A formal definition of what rendering behavior `capability_surfaces_index` enables that is not achievable through `nodes[]` and `containment_tree` alone.

---

## SECTION 5 — FINAL VERDICT

---

### 1. What Projection Layer v1 lawfully contains now

Projection Layer v1 contains exactly the structural derivations that are (a) already computed in `envelope_adapter.py`, (b) deterministic, (c) not blocked, and (d) proven by forensic evidence to be structural rather than presentational:

- Annotated node list with: `depth`, `is_root`, `is_orphan`, `is_overlap_endpoint`, `signal_count`, `signals[]`, `canonical_parent`, `additional_parents[]`, and the newly formalized `overlap_adjacent_node_ids[]`
- `containment_tree{}` and `additional_parent_refs{}`
- `roots[]` and the newly formalized `non_orphan_roots[]`
- `orphans[]`
- `node_depths{}`
- `multi_parent_nodes{}`
- `overlap_edges[]` and `unknown_edges[]`
- `signals_by_node{}` and `orphan_signals[]`
- `summary{}` counts
- `constraint_flags{}` verbatim passthrough

Two field names are introduced for the first time at this contract level — `non_orphan_roots[]` and `overlap_adjacent_node_ids[]` — both formalizing structural derivations already proven to exist in DEMO code as mixed-layer computations.

---

### 2. What remains in rendering

The following are confirmed rendering concerns and must not enter projection:

- Label normalization (`humanize()`) — display formatting only
- Standalone type display labels (`STANDALONE_TYPE_LABELS`) — display text for node type groups
- Surface fold threshold (`SURFACE_PREVIEW = 5`) — presentation density policy
- Diagnostic pill wording and ordering — display text over projection-supplied flags
- Interaction state (`expandedNodes`, `onToggle`) — UI state not present in any renderer
- sharedCount "across N surfaces" label — ungoverned threshold over governed multi-parent data
- CSS class selection — rendering by definition
- Header count string formatting — display formatting over `summary{}` values

---

### 3. What is deferred pending governance

The following structural derivations are admissible in principle but cannot be included in v1 because their semantic preconditions are not yet governed:

| Deferred Item | Blocker |
|---|---|
| Signal health state (`has_degraded_signal`) | B-02: `computation_state` / `AVAILABLE` not governed |
| Orphan grouping by type (`orphans_by_type{}`) | B-01: node type vocabulary not governed |
| Overlap evidence–to–edge linkage | B-03: no linkable structure in envelope |
| `capability_surfaces_index` rendering path | B-04: no defined use case |

Each deferred item has a stated return condition in the Exclusion Register. None may enter projection until its stated condition is met.

---

### 4. Why this is an extraction and not a redesign

Every field in Projection Layer v1 already exists in the DEMO system — either as a field in `envelope_adapter.py`'s render model output, or as a derivation proven by the forensic map to be executing in the rendering layer using only projection-level inputs.

The two new field names (`non_orphan_roots[]`, `overlap_adjacent_node_ids[]`) do not invent new data. They name, for the first time in a formal contract, derivations whose logic already exists:
- `non_orphan_roots` = `roots.filter(r => !orphanSet.has(r))` — line 412 of `TopologyPanel.js`
- `overlap_adjacent_node_ids` = the node filter in `ComponentFooter` lines 90–96

No structural behavior is added. No rendering behavior is moved into projection. No new computation is proposed. The contract records what the DEMO already computes, separates what it computes in the wrong layer, and withholds what it cannot yet compute correctly. The boundary is drawn where the forensic evidence places it.
