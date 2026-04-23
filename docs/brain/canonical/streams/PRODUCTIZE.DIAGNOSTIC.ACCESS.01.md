---
type: stream-capsule
brain: canonical
layer: L4 → L5
canonical_status: ACTIVE
---

# PRODUCTIZE.DIAGNOSTIC.ACCESS.01

## Purpose

Define Diagnostic Access as a governed product capability. Diagnostic Access exposes the evidence gap layer — the set of named unknown dimensions, their scope gaps, associated system areas, and consequence classes — derived from governed PiOS Core output structures.

Diagnostic Access does not derive. It exposes.
Diagnostic Access does not interpret. It surfaces.

---

## Boundary

Input: PiOS Core governed outputs (signal_registry, evidence_mapping_index, diagnosis_output_set)
Output: investigation target set — bounded, named, evidence-grounded

---

## What Diagnostic Access Surfaces

For each dimension classified as outside current evidence scope, the output contains:

| Field | Source | Derivation Class |
|---|---|---|
| dimension_name | diagnosis output set (dimension label) | EVIDENCE-DERIVABLE |
| scope_gap | evidence_mapping_index (blocking_point) | EVIDENCE-DERIVABLE |
| system_area | evidence_mapping_index (semantic_anchor — domain/capability label) | EVIDENCE-DERIVABLE |
| consequence_class | signal_registry (risk field) | STRUCTURAL-INFERENCE — governed risk text, conditional framing required |
| resolution_path | evidence_mapping_index (blocking_point inverse) | EVIDENCE-DERIVABLE |

---

## Derivation Classification

EVIDENCE-DERIVABLE:
- Dimension identification
- Scope gap description
- System area mapping
- Resolution path

STRUCTURAL-INFERENCE:
- Consequence class — derived from the governed risk field; represents bounded inference from structural observation, not open interpretation; conditional framing ("if degraded") required in all downstream projections

INTERPRETIVE / ADVISORY:
- None. No outputs at this tier may be advisory, interpretive, or open-ended.

---

## Claim Constraints

All claims derived from Diagnostic Access outputs MUST:
- Name dimensions by functional label only — no DIAG-*, SIG-*, COND-* identifiers
- Describe scope gaps by evidence type description — no internal data source identifiers (INF-*, TMP-*)
- Identify system areas by functional name — no COMP-*, CAP-*, BM-* identifiers
- Frame consequence claims conditionally: "if degraded" — not asserted as current fact
- Not claim inference-free derivation for consequence class outputs

Claims MUST NOT:
- Assert degraded state as fact
- Provide prioritization guidance ("prioritize X over Y")
- Provide advisory direction beyond defined decision states: proceed / investigate / escalate
- Claim uniform traceability to evidence for consequence class outputs

---

## Output Schema

Type: INVESTIGATION_TARGET

Fields:
- dimension_name: string (functional label, no internal IDs)
- investigative_question: string (framed as question, not assertion)
- scope_gap: string (evidence type absent — functional description, no internal IDs)
- system_area: string (functional area name, no component IDs)
- consequence_class: string (governed risk statement — conditional framing required)
- resolution_path: string (evidence type that would move dimension from unknown to confirmed)

---

## Upstream Dependencies

- signal_registry.json — risk field per signal
- evidence_mapping_index.json — blocking_point and semantic_anchor per signal
- diagnosis_output_set.md — dimension labels per blocked diagnosis

---

## Downstream Impact

Consumed by: [[../../product/diagnostic_access_product]]

---

## Related Invariants

- [[../04_INVARIANTS]] — INV-08 (ZONE-2 purity)
- [[../04_INVARIANTS]] — INV-01 (evidence first)
- [[../04_INVARIANTS]] — INV-06 (determinism)

---

## Relationship to Zone-Based Workspace Model

This node defines the capability concept for Tier-2. The structural implementation model is
defined in `tier2_workspace_model.md`. The zone-based workspace is the Phase 1 product
realization of this capability concept.

See `tier2_reconciliation.md` for the authoritative declared relationship between these nodes
and the Phase 1 / Phase 2 scope split.

The INVESTIGATION_TARGET schema defined here maps to zone workspace outputs as follows:
- dimension_name / investigative_question → WHY mode output
- scope_gap / resolution_path → EVIDENCE mode output
- system_area → WHY mode structural_scope
- consequence_class → DEFERRED (Phase 2)

---

## Canonical Status

ACTIVE

---

## Lineage

| Stream | Date | Change |
|---|---|---|
| PRODUCTIZE.LENS.COMMERCIAL.PACKAGE.05 | 2026-04-22 | Initial definition — node created to formalize Diagnostic Access canonical boundary |
| BRAIN.RECONCILE.LENS.TIER2.01 | 2026-04-23 | Added relationship declaration to tier2_workspace_model.md; schema mapping to zone outputs documented |
