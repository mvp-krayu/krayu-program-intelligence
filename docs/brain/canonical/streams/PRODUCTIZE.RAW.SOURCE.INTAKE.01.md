---
type: stream-capsule
brain: canonical
layer: L0 → L1
canonical_status: COMPLETE
---

# PRODUCTIZE.RAW.SOURCE.INTAKE.01

## Purpose

Defines the intake boundary where raw source material enters the system. Establishes the evidence boundary artifact — the first governed artifact in the system. No classification or normalization occurs at this layer.

---

## Boundary

Input side: external evidence (L0) — not owned by the system
Output side: evidence boundary artifact — first governed artifact

This stream defines the first governance line in the system.

---

## Inputs

- Raw source material from external environment (L0)
- Ledger Selector output — source selection and mode designation

---

## Outputs

- Evidence boundary artifact
- Source provenance record
- Intake mode designation (full reconstruction / debug / isolation)

---

## Evidence Produced

- Anchored evidence boundary
- Source identity record
- Intake timestamp and mode classification

---

## Upstream Dependencies

- Ledger Selector (pre-system, external)
- Raw source (L0, external)

---

## Downstream Impact

- Required by: [[PRODUCTIZE.IG.FROM.INTAKE.01]]
- Required by: [[PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01]]
- All downstream streams in the ingestion chain depend on this boundary

---

## Canonical Status

COMPLETE

---

## Related Invariants

- [[../04_INVARIANTS]] — INV-01 (Evidence First)
- [[../04_INVARIANTS]] — INV-03 (40.4 Handoff prerequisite)
- [[../04_INVARIANTS]] — INV-04 (Replay Rule)
- [[../04_INVARIANTS]] — INV-09 (CREATE_ONLY)
