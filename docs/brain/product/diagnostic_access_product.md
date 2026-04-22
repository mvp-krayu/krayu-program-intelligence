---
type: product-node
brain: product
---

# diagnostic_access_product

## What Is Being Offered

Diagnostic Access (Tier 2): investigation-ready view of the unknown dimensions identified in the LENS Assessment focus domain. Delivered as an entitlement-gated extension to the LENS Assessment. Produces a governed investigation target set — not additional analysis, not advisory guidance, not consulting output.

---

## Canonical Basis

[[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]]

---

## System Capability Mapping

| Tier 2 Component | Canonical Basis | Code Basis |
|---|---|---|
| Unknown dimension identification | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | PRODUCT-NOT-IMPLEMENTED |
| Scope gap per dimension | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | PRODUCT-NOT-IMPLEMENTED |
| System area mapping per dimension | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | PRODUCT-NOT-IMPLEMENTED |
| Consequence class per dimension | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | PRODUCT-NOT-IMPLEMENTED |
| Evidence resolution path per dimension | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | PRODUCT-NOT-IMPLEMENTED |

Code basis is PRODUCT-NOT-IMPLEMENTED for all components. Underlying data structures exist in governed evidence artifacts (signal_registry, evidence_mapping_index, diagnosis_output_set) but no product surface currently exposes them. The commercial showcase artifact (PACKAGE.04) is ahead of implementation.

---

## Allowed Outputs

- Unknown dimension count (per focus domain — evidence-grounded count)
- Dimension names (functional label only — no DIAG-*, SIG-*, COND-* identifiers)
- Scope gap per dimension (evidence type absent — functional description, no INF-* or TMP-* identifiers)
- System area per dimension (functional area name — no COMP-*, CAP-*, BM-* identifiers)
- Consequence class per dimension (governed risk statement — conditional framing required: "if degraded")
- Resolution path per dimension (evidence category that would move dimension from unknown to confirmed)

---

## Forbidden Outputs

- Internal identifiers of any class
- Advisory prioritization ("prioritize X", "investigate X first")
- Decision guidance beyond defined states: proceed / investigate / escalate
- Claims of inference-free derivation for consequence class outputs
- Certainty claims about system degradation state
- Open-ended investigation direction

---

## Implementation State

PRODUCT-NOT-IMPLEMENTED

The capability is canonically defined and data-grounded. Implementation requires a product surface that:
1. Consumes evidence_mapping_index.json and signal_registry.json
2. Renders the INVESTIGATION_TARGET schema per blocked dimension
3. Applies ZONE-2 purity constraints (INV-08) to all rendered output
4. Gates access by entitlement state

---

## Access Model

Entitlement Required — not included in Tier 1 LENS Assessment.

---

## What Is Measurable

- Unknown dimension count: N per focus domain (from blocked diagnosis set)
- Scope gap specificity: one per dimension (from blocking_point)
- System area resolution: one per dimension (from semantic_anchor)

---

## Justified by

[[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]]

## Implemented by

Not yet — see Implementation State above.

## Expressed as

[[../publish/lens_page]] — Tier 2 section (extended by PACKAGE.05)

---

## Lineage

| Stream | Date | Change |
|---|---|---|
| PRODUCTIZE.LENS.COMMERCIAL.PACKAGE.05 | 2026-04-22 | Initial definition — node created to formalize Diagnostic Access product boundary |
