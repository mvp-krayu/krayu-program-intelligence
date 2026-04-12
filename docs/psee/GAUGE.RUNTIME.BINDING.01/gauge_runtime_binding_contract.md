GAUGE / RUNTIME BINDING CONTRACT
Contract ID: GAUGE.RUNTIME.BINDING.01
Derivation basis: GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01 + PSEE.PROJECTION.LAYER.CONTRACT.V1.1 + PSEE.PROJECTION.LAYER.CONTRACT.V2
Authority: Consumption boundary governs admissibility. Projection contracts govern field identity and conditionality.

---

## SECTION 1 — BINDING MODEL

### 1.1 Definition

Runtime binding is the structural pass-through mechanism by which projection payload is received by the GAUGE runtime and made available to runtime components. Binding introduces no transformation, no derivation, no computation, and no semantic layer. It is a structural mapping only.

### 1.2 Projection Payload Reception Boundary

The projection payload is the complete output produced by the Projection Layer (v1.1 + v2) for a given source envelope. The runtime receives the payload as a single structured unit at a defined intake point. The intake point is the boundary between the Projection Layer authority domain and the GAUGE runtime authority domain.

Rules at the reception boundary:
- The payload is received in full; no field is selectively discarded at intake
- The payload is received as-is; no normalization or transformation is applied at intake
- The payload carries its conditionality intact; the presence or absence of conditional elements (PL4-C5) is observable at intake and must be preserved downstream
- The intake point does not validate payload content against envelope state — that validation belongs to projection

### 1.3 Projection-to-Binding Exposure Path

After reception, the projection payload is exposed to runtime components through the runtime binding structure. The binding structure is a named-field container that holds references to projection payload fields. The binding structure does not copy or transform field values — it exposes them by reference.

Exposure path:
```
Projection payload (received at intake)
    → Runtime binding structure (named-field container, reference-based)
        → Runtime components (read from binding structure)
```

Each named field in the binding structure maps one-to-one to exactly one projection field. No field in the binding structure is derived from multiple projection fields. No projection field is split across multiple binding structure fields.

### 1.4 Binding Authority Limits

The runtime binding structure:
- does not own the data it exposes
- does not compute or produce values
- does not gate or filter based on value content
- does not transform field names in ways that break traceability
- does not introduce intermediate representations

---

## SECTION 2 — FIELD-LEVEL BINDING

For each projection element, the following defines the binding target name, binding method, and constraints applicable at binding scope. Method is direct reference or pass-through only for all elements.

Binding method definitions:
- **DIRECT REFERENCE** — the binding target holds a reference to the exact projection field value; no copy, no transformation
- **PASS-THROUGH** — the binding target exposes the field value as received without any structural change

---

### PROJECTION LAYER V1.1 ELEMENTS

---

**A-01 — `nodes[]`**

| Attribute | Value |
|---|---|
| Binding target | `nodes` |
| Binding method | DIRECT REFERENCE |
| Constraints | Array must be exposed in full, in received order; no node may be filtered, reordered, or removed at binding; all per-node annotation fields (node_id, label, type, depth, is_root, is_orphan, is_overlap_endpoint, signal_count, signals[], canonical_parent, additional_parents[], overlap_adjacent_node_ids[]) must be accessible through the binding target without transformation |

---

**A-02 — `containment_tree{}`**

| Attribute | Value |
|---|---|
| Binding target | `containmentTree` |
| Binding method | DIRECT REFERENCE |
| Constraints | Map structure exposed as received; no parent entry may be filtered or reordered; no child list may be altered; binding does not merge this structure with additional_parent_refs{} |

---

**A-03 — `additional_parent_refs{}`**

| Attribute | Value |
|---|---|
| Binding target | `additionalParentRefs` |
| Binding method | DIRECT REFERENCE |
| Constraints | Map structure exposed as received; not merged with containmentTree at binding; each key and value list preserved intact |

---

**A-04 — `roots[]`**

| Attribute | Value |
|---|---|
| Binding target | `roots` |
| Binding method | DIRECT REFERENCE |
| Constraints | Array exposed in received order; no re-derivation from source envelope; binding does not filter this array |

---

**A-05 — `non_orphan_roots[]`**

| Attribute | Value |
|---|---|
| Binding target | `nonOrphanRoots` |
| Binding method | DIRECT REFERENCE |
| Constraints | Array exposed as received; binding does not re-derive by filtering roots against orphans; this derivation is owned by projection |

---

**A-06 — `orphans[]`**

| Attribute | Value |
|---|---|
| Binding target | `orphans` |
| Binding method | DIRECT REFERENCE |
| Constraints | Sorted array exposed as received; binding does not re-derive orphan membership; binding does not group orphans by type unless PL4-C1 binding target is present |

---

**A-07 — `node_depths{}`**

| Attribute | Value |
|---|---|
| Binding target | `nodeDepths` |
| Binding method | DIRECT REFERENCE |
| Constraints | Map exposed as received; binding does not recompute depth values |

---

**A-08 — `multi_parent_nodes{}`**

| Attribute | Value |
|---|---|
| Binding target | `multiParentNodes` |
| Binding method | DIRECT REFERENCE |
| Constraints | Map exposed as received; binding does not recount parents or derive sharing counts |

---

**A-09 — `overlap_edges[]`**

| Attribute | Value |
|---|---|
| Binding target | `overlapEdges` |
| Binding method | DIRECT REFERENCE |
| Constraints | Array of OVERLAP_STRUCTURAL edge records exposed in full, in received order; binding does not re-classify edges; binding does not perform heuristic matching against constraint_flags; PL4-C5 linkage annotation, if present on edge records, is accessible through this binding target without transformation |

---

**A-10 — `unknown_edges[]`**

| Attribute | Value |
|---|---|
| Binding target | `unknownEdges` |
| Binding method | DIRECT REFERENCE |
| Constraints | Array exposed as received; binding does not suppress or reclassify unknown edges |

---

**A-11 — `signals_by_node{}`**

| Attribute | Value |
|---|---|
| Binding target | `signalsByNode` |
| Binding method | DIRECT REFERENCE |
| Constraints | Node-keyed map of signal arrays exposed as received; binding does not evaluate computation_state; binding does not derive signal counts or health state |

---

**A-12 — `orphan_signals[]`**

| Attribute | Value |
|---|---|
| Binding target | `orphanSignals` |
| Binding method | DIRECT REFERENCE |
| Constraints | Array exposed as received; binding does not attempt to re-attach orphan signals to nodes |

---

**A-13 — `summary{}`**

| Attribute | Value |
|---|---|
| Binding target | `summary` |
| Binding method | DIRECT REFERENCE |
| Constraints | Integer count map exposed as received; binding does not recount independently; binding does not derive additional counts from other binding targets |

---

**A-14 — `constraint_flags{}`**

| Attribute | Value |
|---|---|
| Binding target | `constraintFlags` |
| Binding method | PASS-THROUGH |
| Constraints | Opaque passthrough; exposed as received without interpretation; binding does not parse, evaluate, or extract sub-fields from constraint_flags for independent binding targets; PL4-C5 linkage annotation (when present on overlap edge records) is the governed linkage mechanism — binding does not substitute heuristic matching |

---

### PROJECTION LAYER V2 ELEMENTS

---

**PL4-C1 — Type-Based Node Grouping**

| Attribute | Value |
|---|---|
| Binding target | `nodesByType` |
| Binding method | DIRECT REFERENCE |
| Constraints | Type-keyed partition map exposed as received; all three governed type keys (binding_context, capability_surface, component_entity) must be accessible regardless of whether their value list is empty; binding does not add, remove, or rename keys; binding does not apply semantic labels to keys; binding does not filter or reorder node_id lists within groups |

---

**PL4-C2 — Type-Based Node Filtering**

| Attribute | Value |
|---|---|
| Binding target | `filteredNodesByType` |
| Binding method | DIRECT REFERENCE |
| Constraints | Ordered subset list exposed as received for the specified governed type; binding does not re-filter; binding does not apply additional predicates; binding does not treat the list as semantically labeled |

---

**PL4-C3 — Signal Equality Check**

| Attribute | Value |
|---|---|
| Binding target | per-node annotation on `nodes` — accessible as field on each node record |
| Binding method | DIRECT REFERENCE |
| Constraints | Per-node boolean exposed as received; binding does not relabel true/false as health, degradation, risk, or equivalent; binding does not re-derive the boolean from raw signals[]; the boolean value is a structural fact — binding must expose it as such |

---

**PL4-C4 — Signal Partition by Nominal State**

| Attribute | Value |
|---|---|
| Binding target | per-node annotation on `nodes` — accessible as field on each node record |
| Binding method | DIRECT REFERENCE |
| Constraints | Per-node partition counts (nominal count, non-nominal count) exposed as received; binding does not interpret counts as error rates, failure rates, or health indicators; binding does not aggregate counts across nodes; binding does not re-derive counts from signals[] |

---

**PL4-C5 — Evidence-Linked Overlap Edge Annotation**

| Attribute | Value |
|---|---|
| Binding target | accessible through `overlapEdges` binding target — linkage reference field on edge records, when present |
| Binding method | DIRECT REFERENCE (conditional) |
| Constraints | See Section 3 — Conditional Binding for complete PL4-C5 binding rules |

---

## SECTION 3 — CONDITIONAL BINDING

### 3.1 Representation of Optional Elements

PL4-C5 is the only conditional element in the combined v1.1 + v2 projection surface. Its conditionality is structural — whether the linkage annotation is present on overlap edge records depends on whether the source envelope carried B-03-compliant linkage structure at projection time. This determination belongs to projection, not to runtime binding.

The runtime binding structure must represent the PL4-C5 state as follows:
- **When PL4-C5 annotation is present:** the linkage reference field on overlap edge records is accessible through the `overlapEdges` binding target; its value is the linkage reference as provided by projection
- **When PL4-C5 annotation is absent:** the linkage reference field is absent from overlap edge records; this absence is observable through the binding target; no substitution is introduced

### 3.2 Absence Encoding

PL4-C5 absence is encoded as field absence on the edge records within the `overlapEdges` binding target. The binding structure itself is always present — `overlapEdges` is always bound when overlap edges exist. Only the linkage reference field on individual edge records is conditionally present.

Rules:
- Binding must not encode PL4-C5 absence as null, empty string, placeholder, or sentinel value — absent means structurally absent
- Binding must not introduce a separate boolean flag (`linkagePresent`, `hasEvidence`, or equivalent) to signal PL4-C5 state — the structural presence or absence of the field is the signal
- Binding must not fill the absent field with content derived from constraint_flags or any other source

### 3.3 Lawful Presence/Absence Detection

A runtime component may determine whether PL4-C5 linkage annotation is present by testing for the presence of the linkage reference field on an individual overlap edge record through the `overlapEdges` binding target. This is the only lawful detection mechanism.

Unlawful detection attempts:
- Querying a synthetic binding-level flag
- Attempting to infer presence from constraint_flags content
- Attempting to infer presence from the existence of overlap evidence strings

### 3.4 Conditionality Preservation

PL4-C5 conditionality as defined in PSEE.PROJECTION.LAYER.CONTRACT.V2 (Global Constraint G7) and as enforced in GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01 (CCR-01) is preserved unchanged by this binding contract. No rule in this contract softens, hardens, or reinterprets that conditionality.

---

## SECTION 4 — TRACEABILITY GUARANTEES

### 4.1 Propagation of node_id

Every node record accessible through the `nodes` binding target carries its original node_id value unchanged. Components consuming nodes through the binding structure must be able to identify any node by its projection-assigned node_id without ambiguity. No surrogate, display, or positional identifier substitutes for node_id in the binding layer.

Cross-binding traceability: node_ids appearing as values in `containmentTree`, `additionalParentRefs`, `nodeDepths`, `multiParentNodes`, and the type-keyed outputs of PL4-C1 and PL4-C2 are the same node_id values present in `nodes`. No translation occurs at binding.

### 4.2 Propagation of Edge References

Each edge record accessible through `overlapEdges` and `unknownEdges` carries its from_node and to_node references as provided by projection. These references are node_id values traceable to records in `nodes`. Binding does not substitute positional indices, display labels, or any other form of reference.

### 4.3 Propagation of Signal Identifiers

Signal records accessible through `nodes[].signals[]` and `signalsByNode` carry their original field values as received from projection (passthrough from source envelope). Binding does not normalize, hash, or otherwise alter signal identifiers or signal field values.

### 4.4 Preservation of Original Field and Value Identity

Binding target names may use camelCase conventions (e.g., `containmentTree` for `containment_tree{}`) as a structural accommodation for runtime field naming. This is the only permitted deviation from projection field names. The mapping between binding target name and projection field name is declared explicitly in Section 2. No binding target name introduces a new semantic meaning or loses identity with its projection source.

Mapping table (binding target → projection field):

| Binding Target | Projection Field |
|---|---|
| `nodes` | `nodes[]` |
| `containmentTree` | `containment_tree{}` |
| `additionalParentRefs` | `additional_parent_refs{}` |
| `roots` | `roots[]` |
| `nonOrphanRoots` | `non_orphan_roots[]` |
| `orphans` | `orphans[]` |
| `nodeDepths` | `node_depths{}` |
| `multiParentNodes` | `multi_parent_nodes{}` |
| `overlapEdges` | `overlap_edges[]` |
| `unknownEdges` | `unknown_edges[]` |
| `signalsByNode` | `signals_by_node{}` |
| `orphanSignals` | `orphan_signals[]` |
| `summary` | `summary{}` |
| `constraintFlags` | `constraint_flags{}` |
| `nodesByType` | PL4-C1 type-keyed partition map |
| `filteredNodesByType` | PL4-C2 type-filtered subset |
| per-node annotation | PL4-C3 per-node boolean |
| per-node annotation | PL4-C4 per-node partition counts |
| field on `overlapEdges` records | PL4-C5 linkage reference (conditional) |

### 4.5 Anti-Loss Guarantees

The following loss conditions are prohibited at binding:

- **No field suppression:** No projection field listed in Section 2 may be absent from the binding structure when the projection payload contains it
- **No value truncation:** No string, array, or map value may be truncated, capped, or filtered at binding
- **No silent omission:** A binding target may not silently omit items from an array or map without explicit governed reason; no governed reason for omission exists at binding scope
- **No order alteration:** Array fields whose order is defined by projection (roots[], orphans[], nodes[], overlap_edges[]) must be exposed in the same order as received

---

## SECTION 5 — BINDING FAILURE MODES

The following violation classes constitute binding failure. Each is defined by its nature and its classification.

---

**BF-01 — Transformation introduced**
Binding applies any transformation to a projection field value — including normalization, parsing, re-encoding, filtering, or reformatting — outside of the camelCase naming accommodation declared in Section 4.4.
Classification: BINDING INTEGRITY VIOLATION

---

**BF-02 — Derived state introduced**
Binding computes any count, flag, grouping, partition, relationship, summary, or classification from projection field values. Any value in the binding structure not directly sourced from a projection field is derived state.
Classification: STRUCTURAL AUTHORITY VIOLATION — binding acted as projection

---

**BF-03 — Aggregation introduced**
Binding computes any total, sum, ratio, percentage, distribution, or rollup across projection values.
Classification: STRUCTURAL AUTHORITY VIOLATION — binding acted as projection

---

**BF-04 — Conditional element assumed**
Binding treats PL4-C5 linkage annotation as always-present, or fills the absent linkage reference with any substitute value, or exposes a synthetic flag representing PL4-C5 state rather than the structural presence/absence of the field.
Classification: CONDITIONALITY VIOLATION

---

**BF-05 — Traceability broken**
Any binding target value cannot be traced back to its originating projection field by field name or by the declared mapping in Section 4.4. Includes: surrogate key substitution for node_id, reference replacement in edge records, signal value alteration.
Classification: TRACEABILITY VIOLATION

---

**BF-06 — Semantic layer introduced**
Binding introduces a field, label, or value that carries health, status, severity, importance, risk, priority, readiness, confidence, or equivalent meaning. Includes: renaming PL4-C3 boolean output as `hasAlert`, `isDegraded`, or equivalent; renaming PL4-C4 counts as `errorCount`, `failureCount`, or equivalent.
Classification: SEMANTIC AUTHORITY VIOLATION

---

**BF-07 — Identity substitution**
Binding substitutes a node_id, edge reference, or signal identifier with a positional index, display label, hash, or any other surrogate that breaks traceability to the projection-assigned identity value.
Classification: IDENTITY VIOLATION

---

---
GAUGE / RUNTIME BINDING (MINIMAL)

Contract ID: GAUGE.RUNTIME.BINDING.01
Basis: GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01 + PSEE.PROJECTION.LAYER.CONTRACT.V1.1 + PSEE.PROJECTION.LAYER.CONTRACT.V2
Status: AUTHORITATIVE

BINDING PRINCIPLES
- Binding is structural pass-through only
- Projection Layer is sole structural authority; binding is exposure mechanism only
- Every bound field maps one-to-one to exactly one projection field
- No value in the binding structure is computed, derived, or aggregated

ALLOWED MAPPING
- Direct reference to projection field values
- Pass-through of opaque structures (constraint_flags{})
- camelCase naming convention as structural accommodation (declared mapping in Section 4.4)
- Conditional exposure of PL4-C5 linkage reference as field presence/absence on edge records

FORBIDDEN TRANSFORMATIONS
- No normalization, reformatting, or re-encoding of values
- No derivation of counts, flags, groupings, or partitions
- No aggregation of any kind
- No semantic labeling (health, status, severity, risk, priority, or equivalent)
- No identity substitution (surrogate keys for node_id, edge references, signal identifiers)
- No heuristic substitution for absent PL4-C5 linkage
- No merging of projection fields into combined binding targets

CONDITIONAL HANDLING
- PL4-C5 linkage annotation: present as field on edge records when annotation is present; structurally absent when annotation is absent
- Absence is valid state — no substitution, no sentinel, no synthetic flag
- Presence detected by field presence on edge record only
- Conditionality carries forward unchanged from projection contract and consumption boundary
