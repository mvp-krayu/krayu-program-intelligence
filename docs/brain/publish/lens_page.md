---
type: publish-node
brain: publish
path: /lens
---

# lens_page

## Message

Presents LENS Assessment as a specific, bounded engagement product. Describes what the report contains, what the engagement looks like, and what the buyer receives.

Core message anchor: "Decision-ready. Not descriptive."

---

## Audience

Decision-ready buyers who have recognized a trigger and are evaluating whether to engage.

---

## Entry Point

- Primary CTA: "Request an Assessment"
- Secondary: "View a sample report section"
- Tertiary: plans tier comparison (links to /plans)

---

## Linked Product Node

derived_from: [[../product/lens_product]]
derived_from: [[../product/lens_report]]

---

## Controlled Claims

| Claim | Product Basis | Canonical Basis |
|---|---|---|
| "Full-domain system overview" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Structural topology view" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Focus domain spotlight" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Print-ready executive artifact" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Guided review session included" | [[../product/engagement_model]] | [[../canonical/05_DECISIONS]] — DEC-07 |
| "No instrumentation required" | [[../product/engagement_model]] | [[../canonical/streams/PRODUCTIZE.RAW.SOURCE.INTAKE.01]] |

## Controlled Claims — Tier 2 (Diagnostic Access)

Language boundary: claims MUST frame consequence statements conditionally ("if degraded"). Claims MUST NOT state advisory direction, prioritization, or inference-free derivation for consequence class outputs.

| Claim | Product Basis | Canonical Basis | Derivation Class |
|---|---|---|---|
| "Each unknown dimension identified individually" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE |
| "Scope gap described for each unknown dimension" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE |
| "System area responsible for each dimension identified" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE |
| "Consequence if each dimension is in a degraded state" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | STRUCTURAL-INFERENCE — conditional framing required |
| "What evidence would move each dimension from unknown to confirmed" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE |

### Forbidden Publish Claims (Tier 2)

The following claims are forbidden in any publish surface for Diagnostic Access:

- "All findings traceable to specific evidence — not inferred" — FALSE: consequence class is STRUCTURAL-INFERENCE. This claim must not appear.
- "interrogate it, prioritize it, and act on it" — "prioritize" and "act on" are advisory verbs implying authority beyond governed output. Replace with: "investigate and understand".
- Any claim asserting certainty about current system degradation state.
- Any claim implying open-ended advisory guidance or consulting output.

---

## Lineage

| Stream | Date | Change | Product basis |
|---|---|---|---|
| PRODUCTIZE.LENS.COMMERCIAL.PACKAGE.05 | 2026-04-22 | Extended with Tier 2 Controlled Claims section; forbidden claims documented | [[../product/diagnostic_access_product]] |
