GAUGE / RUNTIME CONSUMPTION BOUNDARY
Contract ID: GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01
Derivation basis: PSEE.PROJECTION.LAYER.CONTRACT.V1.1 + PSEE.PROJECTION.LAYER.CONTRACT.V2
Authority: Projection Layer is sole structural authority. Runtime is consumer only.

---

## SECTION 1 — CONSUMABLE SURFACE

The following projection elements are lawfully consumable by GAUGE / runtime. For each element: consumable status, lawful consumption capacity, authority limit.

---

### A. PROJECTION LAYER V1.1 SURFACE

---

**A-01 — `nodes[]` (annotated node list)**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read per-node annotations; traverse by node_id; present field values as received |
| Authority limit | Runtime must not add, remove, or reorder nodes; must not modify any annotation; must not re-derive depth, is_orphan, is_overlap_endpoint, or any other per-node annotation from source data |

Per-node fields lawfully consumable:
- `node_id` — passthrough read; display or reference permitted
- `label` — passthrough read; display permitted; runtime may apply display formatting (humanize) as rendering-layer concern only — the raw label value must remain unchanged in projection scope
- `type` — passthrough read; display permitted; runtime must not map type to semantic display labels within projection scope; mapping is a rendering-layer concern
- `depth` — integer read; layout use permitted
- `is_root` — boolean read; conditional rendering permitted
- `is_orphan` — boolean read; conditional rendering permitted
- `is_overlap_endpoint` — boolean read; conditional rendering permitted
- `signal_count` — integer read; display permitted
- `signals[]` — array read; field value access permitted; runtime must not evaluate computation_state beyond consuming PL4-C3/C4 annotations if present
- `canonical_parent` — string read; display or traversal permitted
- `additional_parents[]` — array read; display or traversal permitted
- `overlap_adjacent_node_ids[]` — array read; layout or traversal permitted

---

**A-02 — `containment_tree{}`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read parent → children mapping; traverse for tree layout; enumerate children per parent |
| Authority limit | Runtime must not alter the mapping; must not add synthetic parent-child relationships; must not infer additional containment from non-CONTAINS edge types |

---

**A-03 — `additional_parent_refs{}`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read non-canonical parent references; use for multi-parent display |
| Authority limit | Runtime must not merge with `containment_tree{}`; must not promote any additional parent to canonical status |

---

**A-04 — `roots[]`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read ordered root list; use as base collection for layout |
| Authority limit | Runtime must not reorder; must not derive roots independently from source envelope |

---

**A-05 — `non_orphan_roots[]`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read as direct input for layout region rendering; identifies which roots are valid grid regions |
| Authority limit | Runtime must not re-derive by applying orphan filtering; this derivation is owned by projection |

---

**A-06 — `orphans[]`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read sorted orphan list; use as section input for standalone display |
| Authority limit | Runtime must not re-derive orphan membership; must not group orphans by type unless PL4-C1 or PL4-C2 grouping is present in projection output |

---

**A-07 — `node_depths{}`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read depth integer per node_id; use for depth-ordered layout |
| Authority limit | Runtime must not re-derive BFS depth independently |

---

**A-08 — `multi_parent_nodes{}`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read multi-parent mapping; use for display of shared nodes |
| Authority limit | Runtime must not recount parents; must not derive sharing counts beyond what projection provides |

---

**A-09 — `overlap_edges[]`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read OVERLAP_STRUCTURAL edge records; use for cross-boundary reference rendering |
| Authority limit | Runtime must not re-classify edges; must not infer overlap semantics from edge structure; edge records are structural pointers only |

---

**A-10 — `unknown_edges[]`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read for diagnostic display only; must not be rendered as topology |
| Authority limit | Runtime must not attempt to classify or re-classify unknown edges; must not silently suppress them |

---

**A-11 — `signals_by_node{}`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read node-keyed signal arrays; use for per-node signal display |
| Authority limit | Runtime must not evaluate computation_state beyond consuming PL4-C3/C4 annotations if present; raw signal values are passthrough |

---

**A-12 — `orphan_signals[]`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read for signal integrity accounting; display in diagnostic context |
| Authority limit | Runtime must not attempt to re-attach orphan signals to nodes |

---

**A-13 — `summary{}`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional |
| Lawful consumption capacity | Read integer counts; use for panel header display and integrity verification |
| Authority limit | Runtime must not recount independently; summary counts are authoritative outputs of projection |

---

**A-14 — `constraint_flags{}`**

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — unconditional (opaque passthrough) |
| Lawful consumption capacity | Read verbatim for diagnostic display and pill construction; field values may be displayed as received |
| Authority limit | Runtime must not interpret, evaluate, or derive structural meaning from constraint_flags content; must not perform heuristic matching against constraint_flags to infer edge-evidence linkage unless PL4-C5 annotation is present |

---

### B. PROJECTION LAYER V2 — PL4-C1 (Type-Based Node Grouping)

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — when present in projection output |
| Lawful consumption capacity | Read the type-keyed partition map; display each group by its type key; enumerate node_ids per group |
| Authority limit | Runtime must not assign semantic display labels to group keys within projection scope; label mapping (`binding_context` → display text, etc.) is a rendering-layer concern; runtime must not alter key set, reorder groups, or filter out empty groups; runtime must not use group membership to derive condition, health, or priority |

---

### C. PROJECTION LAYER V2 — PL4-C2 (Type-Based Node Filtering)

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — when present in projection output |
| Lawful consumption capacity | Read the ordered subset of node_ids for the specified governed type; use as input collection for type-specific rendering paths |
| Authority limit | Runtime must not apply additional predicates to the output; must not re-filter the result; must not treat the output list as semantically labeled; must not derive type-based ordering or ranking from this output |

---

### D. PROJECTION LAYER V2 — PL4-C3 (Signal Equality Check)

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — when present in projection output |
| Lawful consumption capacity | Read per-node boolean; use for conditional rendering (e.g., signal accent indicator) |
| Authority limit | Runtime must not label the boolean as health, degradation, risk, warning, or any equivalent descriptor; the boolean is a structural fact — true means at least one signal carries a computation_state value other than AVAILABLE; it carries no further meaning at projection scope; runtime must not re-derive this boolean from raw signals[] |

---

### E. PROJECTION LAYER V2 — PL4-C4 (Signal Partition by Nominal State)

| Attribute | Value |
|---|---|
| Consumable status | CONSUMABLE — when present in projection output |
| Lawful consumption capacity | Read per-node partition counts (nominal count, non-nominal count); use for display of signal distribution per node |
| Authority limit | Runtime must not interpret the non-nominal count as an error count, failure rate, or health indicator; must not further subdivide the non-nominal set; must not aggregate counts across nodes; must not re-derive counts from raw signals[] |

---

### F. PROJECTION LAYER V2 — PL4-C5 (Evidence-Linked Overlap Edge Annotation)

| Attribute | Value |
|---|---|
| Consumable status | CONDITIONAL — consumable only when present; absence is not an error |
| Lawful consumption capacity | Read linkage reference on overlap edge records or evidence records; traverse from edge to evidence record (or evidence to edge) using field value equality only |
| Authority limit | See Section 3 — Conditional Consumption Rules for full PL4-C5 handling |

---

## SECTION 2 — NON-CONSUMABLE / OUT-OF-BOUNDARY LOGIC

The following logic classes must never be performed by GAUGE / runtime. Performance of any item below constitutes unlawful consumption.

---

**NC-01 — Independent structural re-derivation**

Runtime must not re-derive any projection output from source envelope data. Specifically prohibited:
- Re-computing roots[] from binding_envelope.nodes[] and binding_envelope.edges[]
- Re-computing orphans[] from containment edge membership
- Re-computing depth assignments via BFS
- Re-computing overlap_edges[] from edge type partition
- Re-computing orphan_signals[] from signal node_id membership
- Re-computing non_orphan_roots[] by filtering roots against orphans
- Re-computing overlap_adjacent_node_ids[] from overlap edge endpoints

Projection is sole structural authority. Runtime consumes, not computes.

---

**NC-02 — Semantic upgrade of structural facts**

Runtime must not assign meaning to structural projection outputs. Prohibited specifically:
- Mapping PL4-C3 boolean true/false to health, degradation, warning, or risk labels
- Mapping PL4-C4 non-nominal count to error rate, failure count, or equivalent
- Mapping PL4-C1/C2 type keys to semantic type display labels within projection scope
- Interpreting is_orphan as a quality or status indicator
- Interpreting is_overlap_endpoint as a significance or priority indicator
- Interpreting depth as hierarchy level or importance

---

**NC-03 — Heuristic linkage**

Runtime must not perform heuristic matching to link projection outputs to each other or to source envelope content. Prohibited specifically:
- Substring matching against constraint_flags content to infer evidence-edge linkage
- Positional inference (nth edge corresponds to nth evidence record)
- Narrative-based correspondence (display text similarity)
- Any form of approximate matching across projection output fields

Linkage is only lawful when PL4-C5 annotation is present and the source envelope satisfies B-03.

---

**NC-04 — Conditional element assumption**

Runtime must not assume PL4-C5 output is present. Absence of PL4-C5 annotation in projection output is a valid state, not an error. Runtime must not substitute heuristic linkage when PL4-C5 is absent. See Section 3.

---

**NC-05 — Out-of-contract value interpretation**

Runtime must not attempt to process:
- Nodes whose node.type is absent or outside the B-01 canonical set as if they belong to a governed group
- Signals lacking computation_state as if they belong to a PL4-C4 partition set
- Edges in unknown_edges[] as topology entries

---

**NC-06 — Projection output mutation**

Runtime must not modify projection output in any way that would alter the structural record. Prohibited:
- Filtering nodes from nodes[] before rendering
- Reordering roots[] or orphans[]
- Merging containment_tree{} with additional_parent_refs{}
- Removing edge records from overlap_edges[] or unknown_edges[]

---

## SECTION 3 — CONDITIONAL CONSUMPTION RULES

---

**CCR-01 — PL4-C5: Evidence-Linked Overlap Edge Annotation (conditional)**

PL4-C5 is the only conditional element in the v2 surface. Its conditionality is non-negotiable and must be carried forward by runtime unchanged.

**Condition for applicability:**
PL4-C5 output is present in the projection output only when the source envelope carried B-03-compliant linkage structure at projection time. Runtime has no authority to assess source envelope compliance — compliance determination belongs to projection.

**Runtime obligation when PL4-C5 is present:**
- Read linkage reference on overlap edge records (or evidence records, per annotation direction present)
- Traverse edge-to-evidence (or evidence-to-edge) using field value equality only
- Do not perform any additional lookup, matching, or derivation beyond the traversal the reference enables
- Do not interpret evidence record content

**Runtime obligation when PL4-C5 is absent:**
- Treat absence as a valid state
- Do not display an error or indicate broken linkage
- Do not substitute any heuristic for the absent linkage
- Do not attempt to infer which evidence record corresponds to which edge by any other means

**Forbidden regardless of PL4-C5 presence:**
- Substring matching against constraint_flags content
- Positional correspondence
- Narrative similarity matching
- Any form of linkage not derived from a discrete field value present in the projection output

---

**CCR-02 — Absent v2 elements**

Each of PL4-C1, PL4-C2, PL4-C3, PL4-C4 is unconditional with respect to source envelope compliance (they require B-01 and B-02 acceptance, which are preconditions of the projection contract, not runtime responsibilities). Their outputs may be absent from a given projection run only if the projection layer explicitly excludes them for a governed reason. Runtime must not re-derive them if absent — absence is to be treated as a governed absence, not a gap to fill.

---

## SECTION 4 — TRACEABILITY REQUIREMENTS

Runtime must preserve the following traceability properties when consuming projection output:

---

**TR-01 — Node identity**
Any runtime artifact that represents a node must carry or be derivable to the node_id originating in nodes[]. node_id is the projection-layer identity; runtime-internal representations must not substitute surrogate keys that break traceability.

---

**TR-02 — Field value passthrough**
Field values consumed from projection output (label, type, depth, is_root, is_orphan, is_overlap_endpoint, signal_count, canonical_parent, computation_state values in signals[]) must not be normalized, transformed, or truncated before use. Display formatting (humanize, type label mapping) is permitted as a rendering-layer concern only and must not alter the underlying field value in any data structure.

---

**TR-03 — Annotation passthrough**
PL4-C3 boolean and PL4-C4 counts must be carried as received. Runtime display representations of these annotations are rendering-layer concerns, but the underlying annotation values must remain as projection produced them.

---

**TR-04 — PL4-C5 linkage reference**
When PL4-C5 linkage annotation is present, the reference value must be passed through as received. The reference is a structural pointer — runtime must not normalize or transform it. Traversal using the reference must use field value equality on the reference value as provided.

---

**TR-05 — Conditional element state**
Runtime must be capable of recording whether PL4-C5 was present or absent in a given projection output. A diagnostic or logging context that claims to show projection state must reflect PL4-C5 conditionality accurately — it must not represent PL4-C5 as always-present or always-absent.

---

## SECTION 5 — FAILURE BOUNDARY

The following states constitute unlawful consumption. Each represents a boundary violation.

---

**FB-01 — Structural re-derivation**
Runtime independently computes any field listed in SECTION 1 from source envelope data, bypassing projection output.
Classification: AUTHORITY VIOLATION — runtime acted as structural authority

---

**FB-02 — Semantic labeling of structural annotation**
Runtime assigns health, degradation, risk, warning, error, or equivalent descriptors to PL4-C3 boolean or PL4-C4 counts within any data structure or API contract (not display text).
Classification: INTERPRETATION VIOLATION — runtime performed semantic upgrade

---

**FB-03 — Heuristic linkage substitution**
Runtime performs substring, positional, or narrative matching to link overlap edges to evidence records in the absence of PL4-C5 annotation.
Classification: GOVERNANCE VIOLATION — runtime introduced ungoverned derivation

---

**FB-04 — PL4-C5 assumption**
Runtime assumes PL4-C5 linkage annotation is present and produces output that is invalid or broken when the annotation is absent.
Classification: CONDITIONALITY VIOLATION — runtime consumed conditional element as unconditional

---

**FB-05 — Out-of-contract type handling**
Runtime silently places nodes with absent or ungoverned node.type values into type-keyed outputs (PL4-C1 / PL4-C2) as if they were governed.
Classification: VOCABULARY VIOLATION — runtime consumed out-of-contract value as governed

---

**FB-06 — Projection output mutation**
Runtime modifies projection output fields (reorders, filters, merges, or removes items) before or during consumption such that the structural record is no longer intact.
Classification: INTEGRITY VIOLATION — runtime corrupted projection output

---

**FB-07 — Absent element gap-fill**
Runtime substitutes its own derivation for a projection element absent from the output, treating absence as a deficiency rather than a governed state.
Classification: AUTHORITY VIOLATION — runtime acted as structural authority for absent element

---

---
GAUGE / RUNTIME CONSUMPTION BOUNDARY (MINIMAL)

Contract ID: GAUGE.RUNTIME.CONSUMPTION.BOUNDARY.01
Basis: PSEE.PROJECTION.LAYER.CONTRACT.V1.1 + PSEE.PROJECTION.LAYER.CONTRACT.V2
Status: AUTHORITATIVE

┌────────────────────────────────────────────────────────────────────────────────────┐
│ Projection Layer is sole structural authority.                                     │
│ GAUGE / runtime is consumer only.                                                  │
│                                                                                    │
│ Lawful consumption:                                                                │
│   — Read projection outputs as defined in SECTION 1 (A through F)                 │
│   — Apply display formatting in rendering layer only                               │
│   — Traverse PL4-C5 linkage by field value equality when annotation is present    │
│   — Treat PL4-C5 absence as valid state                                            │
│                                                                                    │
│ Forbidden:                                                                         │
│   — Re-derive any structural fact from source envelope                             │
│   — Semantically upgrade structural annotations                                    │
│   — Heuristic linkage (substring, positional, narrative)                           │
│   — Assume PL4-C5 present without verification                                     │
│   — Mutate projection output                                                       │
│   — Gap-fill absent elements                                                       │
│                                                                                    │
│ Conditional element: PL4-C5 only                                                   │
│   — Applicable only when projection output carries B-03-compliant linkage          │
│   — Absence is not an error; no substitution permitted                             │
│                                                                                    │
│ Failure boundary: FB-01 through FB-07 (SECTION 5)                                 │
│                                                                                    │
│ This boundary is the authoritative handoff definition for runtime consumption      │
│ governance of Projection Layer v1.1 + v2 outputs.                                 │
└────────────────────────────────────────────────────────────────────────────────────┘
