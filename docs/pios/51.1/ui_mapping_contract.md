# Stream 51.1 — UI Mapping Contract

Stream: 51.1 — Governed Structural Emphasis Rendering (WOW Layer)
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Branch: feature/51-1-governed-structural-rendering
Contract version: 51.1-v1
Normalization version: 51.1R-v1

---

## Scope

This contract defines the static mapping from runtime-exposed emphasis attribute to visual node state. It governs the demo layer rendering behavior. It is consumed by downstream script-alignment work (51.2). It does not govern runtime behavior, semantic definitions, or upstream artifact structure.

---

## Authoritative Input

Source: docs/pios/42.22/attribute_lineage.json (SHA-256: b94e0cae...)

Runtime-exposed fields consumed by rendering layer:

| Field | Source Path | Required |
|---|---|---|
| node_id | exposure_record.node_id | YES |
| emphasis | exposure_record.emphasis | YES |
| attachment_id | exposure_record.attachment_id | YES |
| projection_reference | exposure_record.projection_reference | YES |
| binding_id | exposure_record.binding_id | YES |
| signal_id | exposure_record.signal_id | YES |

No other input fields are permitted. No fields from 43.x or 44.x artifacts may be directly consumed.

---

## Governed Closed Set

Carried verbatim from docs/pios/42.22/attribute_lineage.json:

  closed_set: ["high", "medium", "low", "none"]

NONE is a governed member of this closed set, defined at layer origin 44.3.
NONE is not a rendering default. NONE is not a fallback. NONE is an upstream-assigned attribute value.

---

## Static Mapping Table

| Input (emphasis) | Output (node visual state) | Mapping Token |
|---|---|---|
| high | red node | RENDER_RED |
| medium | amber node | RENDER_AMBER |
| low | neutral node | RENDER_NEUTRAL |
| none | no emphasis marker | RENDER_NONE |

This table is complete. Every governed closed-set value is mapped. No value is unmapped.
RENDER_NONE is a governed mapping outcome, not a fallback state.

---

## Mapping Constraints

1. One emphasis value → exactly one visual state
2. One visual state ← exactly one emphasis value
3. No two emphasis values may produce the same visual state
4. No visual state may be produced by more than one emphasis value
5. No additional emphasis values may be introduced at render time
6. No partial mapping is permitted

---

## Rendering Layer Constraints

1. Rendering layer applies static mapping table only
2. No computation logic in rendering layer
3. No transformation of emphasis value before applying mapping
4. No caching of prior run state to influence current render
5. No state persistence across rendering runs
6. No UI-level aggregation or grouping based on emphasis

---

## Determinism Contract

| Condition | Requirement |
|---|---|
| Same emphasis value → same visual state | ALWAYS |
| Same input record set → same rendered output | ALWAYS |
| Mapping independent of record ordering | YES |
| Mapping independent of session state | YES |
| Mapping independent of other node values | YES |

---

## Traceability Contract

Each rendered node must carry traceable provenance to:

1. attachment_id — identifies the specific runtime projection record
2. projection_reference — carries projection-layer provenance ({binding_id}:VALID:43.31-v1)
3. binding_id — carries binding-layer provenance
4. signal_id — carries signal-layer provenance

Provenance must be available for inspection. Rendering must not discard provenance.

---

## Fail-Closed Contract

Rendering layer MUST NOT produce output if:

| Condition | Action |
|---|---|
| emphasis field absent | TERMINATE — NO OUTPUT |
| emphasis value = null | TERMINATE — NO OUTPUT |
| emphasis value not in {high, medium, low, none} | TERMINATE — NO OUTPUT |
| node_id absent | TERMINATE — NO OUTPUT |
| attachment_id absent | TERMINATE — NO OUTPUT |
| projection_reference absent | TERMINATE — NO OUTPUT |
| mapping ambiguity detected | TERMINATE — NO OUTPUT |

---

## What This Contract Does NOT Govern

- runtime behavior of 42.x
- emphasis assignment logic (governed by 44.3)
- binding logic (governed by 43.x)
- topology layout algorithm
- demo narrative or script flow (governed by 51.2)
- interpretation layer (governed by 75.x — currently blocked)
