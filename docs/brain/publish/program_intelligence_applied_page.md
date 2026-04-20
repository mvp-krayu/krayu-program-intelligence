---
type: publish-node
brain: publish
path: /program-intelligence-applied
route_class: BRIDGE
origin_stream: WEB.EXECUTION.ROUTE.RESOLUTION.GOVREC.01
---

# program_intelligence_applied_page

## Purpose

BRIDGE page connecting the Program Intelligence authority surface (krayu.be) to the Signäl/LENS product offering. Audience-facing crossover from discipline framing to a concrete product engagement path. This page does not define Program Intelligence — it surfaces how Program Intelligence is delivered in practice.

---

## Route

/program-intelligence-applied

---

## Audience

Technology leadership and informed buyers who have engaged with Program Intelligence as a discipline and are evaluating whether the LENS Assessment addresses their situation.

---

## Entry Point

- Primary CTA: direct to /lens (assessment detail) or /contact (engagement start)
- Secondary: return path to /program-intelligence/ (discipline framing)

---

## Linked Product Nodes

derived_from: [[../product/lens_product]]
derived_from: [[../product/engagement_model]]

---

## Controlled Claims

| Claim | Product Basis | Canonical Basis |
|---|---|---|
| "Program Intelligence delivers a structural view of program health from validated delivery evidence" | [[../product/engagement_model]] | [[../canonical/03_EVIDENCE_LINEAGE]] |
| "Signäl is the execution signal infrastructure through which Program Intelligence is delivered" | [[../product/lens_product]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "LENS Assessment is the bounded engagement that produces this intelligence as a single governed artifact" | [[../product/lens_product]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Delivery evidence is drawn from existing engineering systems without instrumentation" | [[../product/engagement_model]] | [[../canonical/streams/PRODUCTIZE.RAW.SOURCE.INTAKE.01]] |
| "The output is traceable executive intelligence, not descriptive reporting" | [[../product/engagement_model]] | [[../canonical/04_INVARIANTS]] INV-06 |

---

## Prohibited Claims (explicitly excluded)

The following claims present on the pre-governance Base44 page are NOT permitted on this route:

| Prohibited Claim | Reason |
|---|---|
| "KRAYU is a Program Intelligence advisory firm" | Prohibited wording: "advisory firm" (C-01 SEMANTIC DRIFT) |
| "translate engineering execution into executive insight" | Prohibited wording: "translate" (C-01 SEMANTIC DRIFT) |
| "KRAYU introduces Program Intelligence as a new discipline" | Canonical authority violation: PI is governed by PRODUCTIZE.STRUCTURAL.TRUTH.* — KRAYU does not introduce it |
| "converts delivery data" (as simple data transformation framing) | Framing implies unstructured conversion, not governed structural derivation — not permitted on a governed surface |
| "for leadership, boards and investors" | "boards and investors" audience not defined in product brain scope — overclaims the governed audience |

---

## Bridge Governance Note

This page is classified BRIDGE per ROUTE.CLASSIFICATION.MODEL. It may not:
- Define or redefine Program Intelligence or any canonical construct
- Assert its own canonical authority
- Introduce claims not present in this controlled claims table
- Use the LENS Assessment to imply capability beyond what lens_product.md declares

All claims in this table trace through: Product Brain → Canonical Brain.
Claims on the live page must not deviate from this table. Any deviation is a governance violation requiring a new GOVERNANCE RECONCILIATION stream before the page may be corrected.

---

## Lineage

| Stream | Date | Change | Product Basis |
|---|---|---|---|
| WEB.EXECUTION.ROUTE.RESOLUTION.GOVREC.01 | 2026-04-20 | Initial publish node creation. Controlled claims table established. Route class: BRIDGE. Prohibited claims documented. | [[../product/lens_product]], [[../product/engagement_model]] |
