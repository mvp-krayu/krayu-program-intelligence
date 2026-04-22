# Brain Node — Product
# TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01
# Tier-2 Diagnostic Narrative Structure

**Authority:** TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01
**Brain:** PRODUCT
**Status:** DEFINED — NOT IMPLEMENTED
**Alignment date:** 2026-04-22
**Canonical link:** docs/brain/canonical/diagnostic_zone_construct.md
**Code link:** docs/brain/code/tier2_diagnostic_narrative.md
**Publish link:** docs/brain/publish/tier2_diagnostic_narrative.md

---

## PRODUCT SURFACE DEFINITION

Tier-2 Diagnostic Narrative is a governed diagnostic artifact produced downstream of the Tier-1 Evidence Brief. It enables controlled interrogation of unresolved structural zones using traceable evidence.

It is NOT advisory. It is NOT a recommendation layer. It is a structural condition exposure surface with explicit uncertainty boundaries.

---

## ALLOWED OUTPUTS

- Structured diagnostic document (HTML, dark theme, 960px, Tier-1 family)
- Zone-indexed sections (one block per zone from Section 2 inventory)
- Query entry hooks per zone: WHY, TRACE, EVIDENCE
- Explicit uncertainty declarations per zone
- Navigation links back to Tier-1 artifacts

## FORBIDDEN OUTPUTS

- Root cause declarations without full evidence closure
- Recommendations
- Advisory reasoning
- Causal certainty claims
- Free-form unstructured prose
- Any output not derivable from canonical data sources

---

## NARRATIVE STRUCTURE

### SECTION 0 — HEADER: CONTEXT LOCK

| Field | Type | Derivation |
|---|---|---|
| `run_id` | string | `canonical_topology.json` → `run_id` |
| `evidence_scope` | enum: `FULL` \| `PARTIAL` \| `BOUNDED` | derived: grounding coverage ratio |
| `structural_coverage_status` | enum: `COMPLETE` \| `INCOMPLETE` | `COMPLETE` only if all domains `GROUNDED` |
| `resolution_boundary` | string | Factual statement of what is and is not determinable. No advisory intent. |

Render: Full-width block. Rendered before Section 1. No omission permitted.

---

### SECTION 1 — DIAGNOSTIC OVERVIEW

| Field | Type | Derivation |
|---|---|---|
| `number_of_zones` | integer | Count of Section 2 zone entries. MUST match exactly. |
| `pressure_distribution` | object | Zone count by type. Sum MUST equal `number_of_zones`. |
| `contradiction_presence` | boolean | `TRUE` if any signal conflict exists. From `signal_registry.json`. |
| `evidence_completeness_summary` | string | Observable signal coverage statement only. No interpretation. |

`pressure_distribution` fields:
```
pressure_concentration:   integer
signal_conflict:          integer
structural_inconsistency: integer
evidence_gap:             integer
```

---

### SECTION 2 — DIAGNOSTIC ZONE INVENTORY

Flat list of all diagnostic zones. Each entry is the sole gateway into its Per-Zone Diagnostic Block.

#### Zone Schema

```
zone_id                    string
  Format: ZONE-{NN}
  HTML anchor: id="zone-{zone_id}"

structural_scope           object
  domains:                 [domain_id]    REQUIRED. canonical_topology domain IDs.
  capabilities:            [cap_id]       Optional.
  components:              [comp_id]      Optional.

zone_type                  enum
  pressure_concentration         — score pressure concentrated in zone
  signal_conflict                — contradictory signal states within scope
  structural_inconsistency       — grounding state inconsistent with domain role
  evidence_gap                   — signal coverage absent or non-resolvable

severity                   enum: HIGH | MODERATE | LOW
  Derived from: signal confidence + scope span.

confidence                 enum: STRONG | PARTIAL | WEAK
  Confidence in zone identification. NOT confidence in resolution.

traceability_status        enum
  FULLY_TRACEABLE                — all contributing nodes and signals identified
  PARTIALLY_TRACEABLE            — some contributing nodes identifiable
  NOT_TRACEABLE                  — evidence insufficient to trace origin
```

Ordering: severity descending, then `zone_id` ascending.
Constraint: Each zone MUST link to at least one domain present in `canonical_topology.json`.

Render: Summary table or card grid. `zone_id` renders as clickable anchor to Per-Zone Block.

---

### SECTION 3 — PER-ZONE DIAGNOSTIC BLOCK

One block per zone. Ordered to match Section 2 inventory. All six sub-sections mandatory.

---

#### A. CONDITION DESCRIPTION

```
observable_condition       string
  Language constraint: observable language only.
  Forbidden: causal language, advisory language.

source_tier1_signals       [signal_id]
  IDs from signal_registry.json bound to this zone.

derived_from               fixed: "Tier-1 Evidence Brief"
  Always present. Immutable.
```

---

#### B. STRUCTURAL DRIVERS

```
contributing_nodes         object
  domains:                 [domain_id]
  capabilities:            [cap_id]
  components:              [comp_id]

contributing_signals       [signal_id]

dependency_structure       object
  type:                    enum: LINEAR | BRANCHING | CYCLIC | UNKNOWN
  description:             string
    Constraint: observable dependency only. MUST NOT imply root cause.
```

Constraint: All contributing nodes MUST resolve against `canonical_topology.json` node IDs.

---

#### C. PROPAGATION PATH

```
paths                      [path_object]
  Minimum: one path required.

PATH OBJECT:
  path_id                  string        Format: {zone_id}-P{N}
  node_chain               [node_id]     Explicit ordered canonical node IDs.
  path_type                enum: FORWARD | BACKWARD | BIDIRECTIONAL | UNKNOWN
  evidence_support         enum: STRONG | PARTIAL | INFERRED
  inferred_declaration     string
    REQUIRED when evidence_support = INFERRED.
    MUST state: "This path is inferred. Evidence does not directly confirm traversal."
```

Constraint: Node chains MUST use canonical node IDs only. No invented nodes.

---

#### D. EVIDENCE STATE

```
evidence_strength          enum: STRONG | PARTIAL | WEAK

available_evidence         [object]
  artifact_ref:            string
  artifact_type:           string
  relevant_fields:         [string]

missing_evidence           [object]
  MANDATORY when evidence_strength = PARTIAL or WEAK.
  Empty list ONLY when evidence_strength = STRONG.

  each entry:
    description:           string    What evidence is absent.
    impact:                string    What cannot be determined without it.
    resolvable:            boolean
```

---

#### E. UNCERTAINTY DECLARATION

```
unresolved_elements        [object]
  MANDATORY. At least one entry required unless evidence_strength = STRONG
  and ALL paths have evidence_support = STRONG.

  each entry:
    element:               string
    reason:                string
    inference_forbidden:   boolean   Always: true. Hard constraint. Non-overridable.

inference_prohibition      fixed: "ACTIVE"
  Immutable. Always present. Machine-readable constraint marker.
  MUST render as visible labeled field in output. Not hidden in data only.
```

---

#### F. INVESTIGATION ENTRY POINTS

```
query_hooks                object
  All three hooks mandatory in every zone block.

WHY:
  hook_id:                 string     Format: {zone_id}-WHY
  query_surface:           string     What the query interrogates.
  expected_return:         string     Form of a valid WHY response.

TRACE:
  hook_id:                 string     Format: {zone_id}-TRACE
  entry_node:              node_id    Starting node for structural traversal.
  traversal_direction:     enum: UPSTREAM | DOWNSTREAM | BOTH
  expected_return:         string

EVIDENCE:
  hook_id:                 string     Format: {zone_id}-EV
  artifact_targets:        [artifact_ref]
  expansion_mode:          enum: FULL | BOUNDED
  expected_return:         string
```

---

## CROSS-LINKING MODEL

```
HTML anchor targets:
  Section 2 zone summary:   id="zone-{zone_id}"
  Section 3 zone block:     id="zone-{zone_id}-block"
  WHY hook:                 id="zone-{zone_id}-why"
  TRACE hook:               id="zone-{zone_id}-trace"
  EVIDENCE hook:            id="zone-{zone_id}-ev"

Navigation strip (mandatory, top of document):
  ← Evidence Brief    /api/report-file?name=lens_tier1_evidence_brief.html
  ← Narrative Brief   /api/report-file?name=lens_tier1_narrative_brief.html
     Diagnostic Narrative   [active]
```

Section 3 zone blocks MUST link back to their Section 2 inventory anchor.

---

## DERIVATION BINDING TABLE

| Narrative field | Source artifact | Source field |
|---|---|---|
| `run_id` | `canonical_topology.json` | `run_id` |
| `structural_coverage_status` | `canonical_topology.json` | derived: grounding_counts vs total domains |
| zone entries | `canonical_topology.json` | domains where `grounding` ≠ `GROUNDED` |
| `zone_type` | `signal_registry.json` | signal states, confidence patterns per domain |
| `contributing_signals` | `signal_registry.json` | signals filtered by `domain_id` |
| `evidence_strength` | `signal_registry.json` | signal confidence values per domain |
| `gauge band` | `gauge_state.json` | `score.band_label`, `confidence.lower`, `confidence.upper` |
| `propagation node_chain` | `canonical_topology.json` | `edges`, `component_ids`, `capability_ids` |

Constraint: No field may originate from inference. Every field derivation MUST be traceable to a row in this table.

---

## RENDER INVARIANTS

1. All six sub-sections (A–F) present in every zone block — no optional sections
2. Empty states render explicitly — e.g. `missing_evidence: []` → "No missing evidence identified" (not silent omission)
3. `inference_prohibition: ACTIVE` renders as a visible labeled field in Section 3E
4. Node references render as internal anchor links where target exists in document
5. Severity and `zone_type` use badge/tag styling consistent with Tier-1 signal confidence badges
6. `max-width: 960px` — matches Tier-1 family
7. Dark theme — same CSS variable set as `_TIER1_EVIDENCE_CSS` / `_TIER1_NARRATIVE_CSS`
8. Publish-safe variant: applies same obfuscation rules as Tier-1 to client identifiers
9. Navigation strip present — links to Tier-1 Evidence Brief and Narrative Brief

---

## GOVERNANCE CONSTRAINTS

- Narrative MUST NOT declare root causes without full evidence closure
- Narrative MUST NOT provide recommendations
- Narrative MUST NOT simulate advisory reasoning
- Narrative MUST NOT infer beyond available evidence
- Narrative MUST expose: structural conditions, drivers, propagation, uncertainty
- Every zone MUST be indexable for WHY, TRACE, EVIDENCE queries
- Narrative IS the required entry point to the Evidence Interrogation Layer (Query + Trace)

---

## IMPLEMENTATION ENTRY POINT

When implementation stream is authorized:

Generator function target:
```
scripts/pios/lens_report_generator.py
  → _build_tier2_diagnostic_narrative(topology, signals, gauge, publish_safe=False)
```

API route target:
```
app/gauge-product/pages/api/report.js
  → extend --tier1 output with tier2 artifact path
```

File-serve target:
```
app/gauge-product/pages/api/report-file.js
  → accept: lens_tier2_diagnostic_narrative.html
  → accept: lens_tier2_diagnostic_narrative_pub.html
  → serve from: reports/tier2/
  → serve from: reports/tier2/publish/
```

UI entry point target:
```
app/gauge-product/pages/lens.js
  → ReportPanel: add Tier-2 link after existing Evidence Brief buttons
  → gating behavior: TBD at implementation stream
```
