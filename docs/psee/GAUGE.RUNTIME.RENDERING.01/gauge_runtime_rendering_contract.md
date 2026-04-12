GAUGE / RUNTIME RENDERING CONTRACT
Contract ID: GAUGE.RUNTIME.RENDERING.01
Derivation basis: GAUGE.RUNTIME.BINDING.01 + GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01
Authority: Binding contract governs exposure path and field identity. Consumption boundary governs admissibility and forbidden consumption behavior.

---

## SECTION 1 — RENDERING MODEL

### 1.1 Definition

Rendering is the read-only display of bound data by GAUGE runtime components. Rendering accesses the runtime binding structure defined in GAUGE.RUNTIME.BINDING.01 and presents field values and structural relationships as provided. Rendering introduces no transformation, no derivation, no computation, and no semantic layer. It is a display operation only.

### 1.2 How Bound Data Enters Rendering

Rendering receives bound data through the runtime binding structure. The binding structure is the only lawful entry point for projection data into rendering. Rendering does not access source envelope data directly. Rendering does not access projection payload directly. All data enters rendering through named binding targets as defined in GAUGE.RUNTIME.BINDING.01 Section 2.

### 1.3 How Components Access Bound Data

Each rendering component accesses the binding target(s) relevant to its display responsibility. Access is read-only. A component reads field values from a binding target and presents them. A component does not alter, enrich, filter, or re-derive values before or during display.

Components may access multiple binding targets to render relationships that are explicitly present in the bound data (for example, traversing a node_id from `nodes` into `containmentTree` to display children). This traversal is lawful because the relationship is structurally present in the bound data. Inference of relationships not present in bound data is not lawful.

### 1.4 Rendering Structure

Rendering is organized around bound elements, not around derived views. Each rendering unit corresponds to one or more bound elements in their received form. No rendering unit introduces a structural view that consolidates, merges, or reinterprets bound elements.

### 1.5 Read-Only Boundary

The read-only boundary is the complete separation between rendering and the binding structure. Rendering does not write to, mutate, or invalidate any field in the binding structure. No rendering action propagates back into the binding layer. No rendering action alters the state of bound data for any other rendering component.

---

## SECTION 2 — ELEMENT-LEVEL RENDERING

For each bound element, the following defines the rendering method, display constraints, identity preservation rules, and order preservation rules.

---

### `nodes[]` (binding target: `nodes`)

**Rendering method:** Display per-node field values as received. Each node record is rendered as a structural unit. Field values within each node record are displayed as provided — no transformation, no enrichment.

**Display constraints:**
- All nodes received must be represented in the rendered output; no node may be suppressed, hidden, or omitted
- Per-node fields displayed as values only: node_id, label, type, depth, is_root, is_orphan, is_overlap_endpoint, signal_count, canonical_parent
- Boolean fields (is_root, is_orphan, is_overlap_endpoint) must be represented as the boolean values received; rendering may display these as text or visual indicators only when the indicator represents the boolean value directly without adding semantic meaning
- signals[] and additional_parents[] are displayed as arrays; empty arrays are rendered as empty — they are not suppressed
- overlap_adjacent_node_ids[] is displayed as an array of node_id references; empty is rendered as empty

**Identity preservation:** node_id must be available as a display value or accessible as a reference for any node rendered. Rendering must not substitute a display label, position index, or any other surrogate for node_id as the node's structural identity.

**Order preservation:** Nodes are rendered in received array order. No sorting, ranking, or reordering by any field value is introduced.

---

### `containment_tree{}` (binding target: `containmentTree`)

**Rendering method:** Display the parent-to-children map as a structural relationship. Each parent node_id and its associated child node_id list is displayed as received.

**Display constraints:**
- All parent entries in the map must be accessible in the rendered output; no parent entry may be suppressed
- Child lists are displayed in received order; empty child lists are not suppressed
- The map is not merged with `additionalParentRefs` at rendering; they are distinct structures

**Identity preservation:** Parent and child references are node_id values. Rendering must display or reference these as node_id values. Rendering must not substitute display labels or surrogate references for node_id when representing containment relationships.

**Order preservation:** Child lists are displayed in received order.

---

### `additional_parent_refs{}` (binding target: `additionalParentRefs`)

**Rendering method:** Display the non-canonical parent reference map as received.

**Display constraints:**
- Not merged with `containmentTree` at rendering
- All entries accessible; none suppressed

**Identity preservation:** All node_id references preserved as received.

**Order preservation:** Value lists displayed in received order.

---

### `roots[]` (binding target: `roots`)

**Rendering method:** Display root node_id list as received.

**Display constraints:** All root entries displayed; none suppressed.

**Identity preservation:** node_id values preserved as received.

**Order preservation:** Received array order preserved.

---

### `non_orphan_roots[]` (binding target: `nonOrphanRoots`)

**Rendering method:** Display as received. This is the projection-derived collection identifying roots that are valid layout regions.

**Display constraints:** All entries displayed; rendering does not re-derive this list.

**Identity preservation:** node_id values preserved as received.

**Order preservation:** Received array order preserved.

---

### `orphans[]` (binding target: `orphans`)

**Rendering method:** Display sorted orphan node_id list as received.

**Display constraints:** All entries displayed; none suppressed. Empty list is rendered as empty — not suppressed.

**Identity preservation:** node_id values preserved.

**Order preservation:** Received order preserved; no re-sorting.

---

### `node_depths{}` (binding target: `nodeDepths`)

**Rendering method:** Display depth integer per node_id as received.

**Display constraints:** All entries accessible; depth values displayed as integers as received. Rendering does not recompute depth.

**Identity preservation:** node_id keys preserved as received.

**Order preservation:** Map key order not semantically significant; no ordering introduced.

---

### `multi_parent_nodes{}` (binding target: `multiParentNodes`)

**Rendering method:** Display multi-parent mapping as received.

**Display constraints:** All entries accessible; parent lists displayed in received order. Rendering does not recount parents.

**Identity preservation:** node_id keys and values preserved as received.

**Order preservation:** Parent lists displayed in received order.

---

### `overlap_edges[]` (binding target: `overlapEdges`)

**Rendering method:** Display OVERLAP_STRUCTURAL edge records as received. Each edge record is rendered as a structural unit showing from_node, to_node, and any additional fields present on the record including the PL4-C5 linkage reference when present.

**Display constraints:**
- All edge records displayed; none suppressed
- Edge records are structural pointers only; rendering does not assign overlap semantics from edge structure
- The PL4-C5 linkage reference field, when present on an edge record, is displayed as a structural reference value — not interpreted
- When the PL4-C5 linkage reference field is absent, the absence is rendered as absence; no substitute value is displayed; see Section 3 for conditional rendering rules

**Identity preservation:** from_node and to_node are node_id references. They are displayed or referenced as node_id values. No surrogate substitution.

**Order preservation:** Edge records displayed in received array order.

---

### `unknown_edges[]` (binding target: `unknownEdges`)

**Rendering method:** Display for diagnostic context only. Edge records displayed as received. Not rendered as topology.

**Display constraints:** All records accessible and displayable; none suppressed. Rendering does not classify or interpret unknown edge types.

**Identity preservation:** Node references preserved as received.

**Order preservation:** Received order preserved.

---

### `signals_by_node{}` (binding target: `signalsByNode`)

**Rendering method:** Display node-keyed signal arrays as received. Signal records are displayed as structural units — field values shown as received.

**Display constraints:**
- All node entries accessible; none suppressed
- Signal arrays displayed in received order; empty arrays rendered as empty
- computation_state field values displayed as received string values; rendering does not evaluate or compare computation_state — consuming PL4-C3 or PL4-C4 annotations (when present through the `nodes` binding target) is the governed path for signal equality state; raw computation_state values are structural passthrough

**Identity preservation:** node_id keys and signal field values preserved as received.

**Order preservation:** Signal arrays displayed in received order.

---

### `orphan_signals[]` (binding target: `orphanSignals`)

**Rendering method:** Display for signal integrity accounting or diagnostic context as received.

**Display constraints:** All records accessible; none suppressed. Rendering does not attempt to re-attach orphan signals to nodes.

**Identity preservation:** Signal field values preserved as received.

**Order preservation:** Received order preserved.

---

### `summary{}` (binding target: `summary`)

**Rendering method:** Display integer count values as received.

**Display constraints:**
- Count values displayed as integers as received
- Rendering does not recount independently
- Rendering does not derive additional counts or ratios from summary values
- All count fields accessible; none suppressed

**Identity preservation:** Field names and values as received.

**Order preservation:** Not applicable — map structure; no ordering defined.

---

### `constraint_flags{}` (binding target: `constraintFlags`)

**Rendering method:** Display opaque passthrough content as received. Field values shown as provided — structure and content unchanged.

**Display constraints:**
- Content displayed as received; rendering does not parse, evaluate, or extract sub-fields for independent display as governed projection elements
- Rendering does not perform heuristic matching against constraint_flags content to infer edge-evidence linkage; the governed path is PL4-C5 linkage annotation when present

**Identity preservation:** Structure and values preserved as received.

**Order preservation:** Not applicable — passthrough structure; no ordering defined.

---

### PL4-C1 — Type-Based Node Grouping (binding target: `nodesByType`)

**Rendering method:** Display the type-keyed partition map as received. Each type key and its associated node_id list is displayed as a structural grouping.

**Display constraints:**
- All three governed type keys must be accessible in the rendered output, including those with empty node_id lists; empty groups are not suppressed
- Type key values are displayed as the governed string values they are — rendering may apply display text to type keys as a rendering-layer concern only; this display text must not enter any data structure and must not replace node_id or type values as structural identity
- Node_id lists within groups are displayed in received order; no reordering, ranking, or filtering within groups
- Rendering does not assign group-level significance, condition, or status

**Identity preservation:** node_id values in group lists preserved as received. Type key values preserved as received.

**Order preservation:** node_id lists displayed in received order. No ordering across groups is defined.

---

### PL4-C2 — Type-Based Node Filtering (binding target: `filteredNodesByType`)

**Rendering method:** Display the ordered subset of node_ids for the specified governed type as received.

**Display constraints:**
- List displayed in received order; no additional filtering, reordering, or ranking applied
- Empty list rendered as empty — not suppressed
- Rendering does not treat the list as semantically labeled beyond its type membership

**Identity preservation:** node_id values preserved as received.

**Order preservation:** Received order preserved.

---

### PL4-C3 — Signal Equality Check (per-node annotation on `nodes`)

**Rendering method:** Display per-node boolean annotation as received. The boolean value is a structural fact from projection.

**Display constraints:**
- Boolean value displayed as received (true / false)
- Rendering may use the boolean to conditionally show or not show a visual indicator, provided the indicator represents the boolean value directly and introduces no semantic label at the data structure level
- The boolean must not be relabeled or represented as health, degradation, risk, warning, alert, or equivalent within any data structure or API contract; display text applied as pure rendering-layer concern is outside data structure scope
- Rendering does not re-derive this boolean from raw signals[]

**Identity preservation:** Per-node; the node_id of the node carrying the annotation is preserved.

**Order preservation:** Annotation is per-node; order follows `nodes` array order.

---

### PL4-C4 — Signal Partition by Nominal State (per-node annotation on `nodes`)

**Rendering method:** Display per-node partition counts (nominal count, non-nominal count) as received integers.

**Display constraints:**
- Counts displayed as integers as received
- Rendering does not interpret non-nominal count as error count, failure count, or health indicator within any data structure
- Rendering does not aggregate counts across nodes
- Rendering does not re-derive counts from raw signals[]
- Both count values (nominal and non-nominal) must be accessible for display; neither is suppressed

**Identity preservation:** Per-node; the node_id of the annotated node is preserved.

**Order preservation:** Annotation is per-node; order follows `nodes` array order.

---

### PL4-C5 — Evidence-Linked Overlap Edge Annotation (conditional field on `overlapEdges` records)

**Rendering method:** Conditional. See Section 3 for complete PL4-C5 rendering rules.

**Display constraints:** When present, the linkage reference field value is displayed as a structural reference — not interpreted as evidence meaning or diagnostic content. When absent, absence is rendered as absence.

**Identity preservation:** The linkage reference value is preserved as received. It is a structural pointer — rendering does not normalize or alias it.

**Order preservation:** Follows edge record order within `overlapEdges`.

---

## SECTION 3 — CONDITIONAL RENDERING

### 3.1 How Optional Elements Are Rendered

PL4-C5 is the only conditional element in the combined v1.1 + v2 bound surface. Its presence or absence in the bound data is determined at projection time. Rendering does not determine conditionality — it observes and displays the state as received through the binding structure.

### 3.2 How Absence Is Represented

When the PL4-C5 linkage reference field is absent from an overlap edge record:
- The absence is represented as structural absence — the field is not present
- Rendering does not display a placeholder, sentinel, dash, null indicator, or substitute value in place of the absent field
- Rendering does not display an error state, warning, or diagnostic indicator for the absence
- The edge record is still rendered in full — only the linkage reference field is absent; all other edge record fields are displayed as present

Absence encoding rule: absence is the absence of the field. It is not encoded as a value.

### 3.3 How Presence Is Detected

A rendering component determines whether PL4-C5 linkage annotation is present on an edge record by testing for the presence of the linkage reference field on that record through the `overlapEdges` binding target. This is the only lawful detection mechanism available to rendering.

A rendering component must not:
- Query a synthetic binding-level flag
- Infer presence from constraint_flags content
- Infer presence from the existence of overlap evidence strings in constraint_flags
- Derive presence from any source other than the field's structural presence on the edge record

### 3.4 How PL4-C5 Conditionality Is Preserved

The conditionality of PL4-C5 as defined in PSEE.PROJECTION.LAYER.CONTRACT.V2 (Global Constraint G7), enforced in GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01 (CCR-01), and carried through in GAUGE.RUNTIME.BINDING.01 (Section 3) is preserved unchanged by this rendering contract. Rendering does not soften, harden, or reinterpret that conditionality.

Rendering does not:
- Assume linkage is always present
- Render edge records differently based on whether linkage is expected to be present
- Treat absence as a rendering failure

---

## SECTION 4 — TRACEABILITY IN RENDERING

### 4.1 How node_id Remains Visible

node_id must be accessible as a display value or structural reference at every point where a node is represented in rendering. Rendering may display node_id directly or use it as an accessible structural reference (e.g., as a lookup key). Rendering must not replace node_id with a display label, position index, sequential number, or any other surrogate as the node's sole identity.

Display labels applied to nodes (e.g., formatted label text) are rendering-layer concerns applied alongside node_id — they do not replace node_id as the structural identity.

### 4.2 How Edge References Remain Visible

The from_node and to_node values on edge records in `overlapEdges` and `unknownEdges` are node_id references. These must be accessible as node_id values in any rendering that represents edge records. Rendering does not substitute display labels or positional indices for from_node and to_node.

The PL4-C5 linkage reference value (when present) is a structural pointer to an evidence record identifier. It must be accessible as the value it is — rendering does not alias or normalize this reference.

### 4.3 How Signal Identifiers Remain Visible

Signal field values in `signalsByNode` and in `nodes[].signals[]` are displayed as received. No signal field value is obscured, aliased, or replaced. Signal records are structural units — their field values are the structural identity of each signal in rendering.

### 4.4 How Field Origin Is Preserved

Every value displayed by rendering originates from a named binding target as declared in GAUGE.RUNTIME.BINDING.01 Section 2 and the mapping table in Section 4.4 of that contract. Rendering does not introduce values from sources outside the binding structure. Any value present in a rendered display is traceable back to:
- a specific binding target
- a specific field within that binding target
- the projection field that binding target maps to

### 4.5 How Rendering Avoids Obscuring Source Structure

Rendering avoids obscuring source structure by:
- Not collapsing multiple fields into a single display unit that loses individual field identity
- Not expanding a single field into multiple display units that imply structure not present in the source
- Not presenting aggregated or computed values as if they were source values
- Not replacing array contents with counts when the array is available

### 4.6 Anti-Loss Guarantees in Rendering

The following loss conditions are prohibited at rendering:

- **No field suppression:** No field present in a binding target is withheld from display capability; rendering components must be capable of displaying all fields accessible through their relevant binding targets
- **No value truncation:** String, integer, boolean, array, and map values must not be truncated, capped, or abbreviated in ways that alter their structural meaning
- **No order loss:** Array fields whose order is defined by binding (nodes, roots, orphans, overlap_edges, signals) are displayed in the order received; rendering does not introduce reordering
- **No identity loss:** node_id, edge references, signal values, and linkage reference values must remain accessible as the values they are; no surrogate substitution

---

## SECTION 5 — RENDERING FAILURE MODES

The following violation classes constitute rendering failure. Each represents a breach of rendering contract.

---

**RF-01 — Derived visual state introduced**
Rendering introduces a computed label, badge, indicator, or visual state derived from evaluating the meaning of a field value — including: deriving a health indicator from PL4-C3 boolean, deriving a failure badge from PL4-C4 non-nominal count, deriving importance from depth value, deriving significance from is_overlap_endpoint.
Classification: SEMANTIC AUTHORITY VIOLATION

---

**RF-02 — Filtering or suppression introduced**
Rendering hides, omits, or suppresses any node, edge, signal, field, empty array, empty group, or absent optional element. Includes: hiding nodes with is_orphan == true, suppressing empty type groups in PL4-C1 output, omitting edge records from display, hiding orphan_signals[] when empty.
Classification: DISPLAY INTEGRITY VIOLATION

---

**RF-03 — Ordering altered**
Rendering reorders any array field by value content, sort logic, ranking, or visual preference. Includes: sorting nodes by depth, sorting orphans by type, reordering overlap edges by significance, reordering signals by computation_state.
Classification: ORDER INTEGRITY VIOLATION

---

**RF-04 — Semantic labeling introduced**
Rendering introduces labels, text, or visual indicators that carry health, status, risk, severity, importance, priority, readiness, confidence, diagnosis, or equivalent meaning within a data structure or API contract. Includes: labeling PL4-C3 true as "degraded", labeling PL4-C4 non-nominal count as "errors", labeling a node type group with semantic significance.
Classification: SEMANTIC AUTHORITY VIOLATION

---

**RF-05 — Identity obscured**
Rendering replaces node_id, edge from_node/to_node, signal identifiers, or PL4-C5 linkage reference with a surrogate (positional index, display label, hash, sequential number) such that the original identity value is no longer accessible.
Classification: IDENTITY VIOLATION

---

**RF-06 — Conditional misrepresentation**
Rendering treats PL4-C5 absence as an error state, renders a placeholder or substitute in the absent field, assumes PL4-C5 is always present, or suppresses edge record display because PL4-C5 annotation is absent.
Classification: CONDITIONALITY VIOLATION

---

**RF-07 — Structural relationship inference introduced**
Rendering displays a relationship between elements that is not explicitly present in bound data — inferring it from value similarity, positional proximity, type match, or label similarity. Includes: inferring that two nodes are related because they share a type, inferring evidence correspondence through substring matching.
Classification: INFERENCE VIOLATION

---

**RF-08 — Traceability broken**
A rendered value cannot be traced back to its originating binding target and projection field. Includes: displaying a value derived from combining multiple field values, displaying a count recomputed independently from source data, displaying an aggregated value without sourcing from `summary{}`.
Classification: TRACEABILITY VIOLATION

---

---
GAUGE / RUNTIME RENDERING (MINIMAL)

Contract ID: GAUGE.RUNTIME.RENDERING.01
Basis: GAUGE.RUNTIME.BINDING.01 + GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01
Status: AUTHORITATIVE

RENDERING PRINCIPLES
- Rendering is read-only display of bound data only
- Bound data enters rendering exclusively through the runtime binding structure
- Rendering introduces no transformation, no derivation, no computation, no semantic layer
- Projection Layer and binding are sole structural authorities; rendering is display only

ALLOWED DISPLAY
- Field values displayed as received from binding targets
- Structural relationships displayed when explicitly present in bound data (traversal by field value equality)
- Boolean and integer annotations displayed as received values
- Display-layer text labels (e.g., type display names, formatted labels) applied as rendering-layer concern only — must not enter any data structure, must not replace structural identity values
- PL4-C5 linkage reference displayed as structural reference value when present

FORBIDDEN TRANSFORMATIONS
- No evaluation or comparison of field values to derive visual state
- No filtering, hiding, or suppression of nodes, edges, signals, fields, or structures
- No reordering of any array field
- No semantic labeling (health, status, risk, severity, priority, or equivalent) in any data structure
- No substitution of node_id, edge references, or signal identifiers with surrogates
- No heuristic linkage in place of absent PL4-C5 annotation
- No inference of structural relationships not present in bound data
- No aggregation or recomputation of values available from binding

CONDITIONAL RENDERING RULES
- PL4-C5 presence: display linkage reference field value as received structural reference
- PL4-C5 absence: render edge record without linkage reference field; no placeholder, no sentinel, no error state
- Absence detected by structural field presence on edge record only
- Conditionality carries forward unchanged from projection, consumption boundary, and binding contracts
