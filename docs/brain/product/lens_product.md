---
type: product-node
brain: product
---

# lens_product

## What Is Being Offered

LENS Assessment: a structured executive intelligence view of a client's delivery environment. Produced as a single, time-bounded engagement. Delivered as an HTML executive report plus a guided review session.

---

## System Capability Mapping

| LENS Component | Canonical Basis | Code Basis |
|---|---|---|
| Full-domain system overview | [[../canonical/streams/PRODUCTIZE.LENS]] | [[../code/scripts_pios_py]] |
| Structural topology view | [[../canonical/streams/PRODUCTIZE.LENS]] | [[../code/scripts_pios_py]] |
| Focus domain spotlight | [[../canonical/streams/PRODUCTIZE.LENS]] | [[../code/scripts_pios_py]] |
| Score with confidence band | [[../canonical/streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]] | [[../code/runtime_surface]] |
| Executive report artifact | [[../canonical/streams/PRODUCTIZE.LENS]] | [[../code/runtime_surface]] |
| Commercial access gating | [[../canonical/05_DECISIONS]] — DEC-05 | [[../code/runtime_surface]] |

---

## Evidence Supporting This Offer

- 40.4 validated handoff artifact (upstream ingestion chain)
- Governed curated graph data (client-specific; BlueEdge reference case used 17 nodes)
- ZONE-2 projection layer (client-safe, no internal identifiers)

---

## Domain Model Authority

All domain-related claims in this product node are owned by [[../canonical/streams/PRODUCTIZE.LENS]] exclusively. 40.2 classifies into the domain model — it does not define it. No domain claim in this node derives from 40.2 canonical authority.

---

## Constraints

- LENS consumes ZONE-2 only — [[../canonical/04_INVARIANTS]] INV-08
- Access gating is UI-only, no backend validation — [[../canonical/05_DECISIONS]] DEC-05
- Report filename validated before serving — [[../canonical/05_DECISIONS]] DEC-06
- No internal identifiers (SIG-, DOMAIN-, CAP-, COMP-) in any rendered output

---

## What Is Measurable

- Score: 0–100 confidence band per claim
- Domain coverage: complete — all domains identified in the client environment
- Focus domain: 1 per assessment (highest-leverage)
- Report artifact: HTML, version-stamped by timestamp (YYYYMMDD_HHMMSS)

---

## Justified by

[[../canonical/streams/PRODUCTIZE.LENS]]
[[../canonical/streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]

## Implemented by

[[../code/runtime_surface]]
[[../code/scripts_pios_py]]

## Expressed as

[[../publish/lens_page]]
