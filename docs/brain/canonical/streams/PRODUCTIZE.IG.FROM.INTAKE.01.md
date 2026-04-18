---
type: stream-capsule
brain: canonical
layer: L1
canonical_status: COMPLETE
---

# PRODUCTIZE.IG.FROM.INTAKE.01

## Purpose

Transforms the raw evidence boundary into a typed, structured Intelligence Graph (IG). The IG is the internal representation of the client environment as a set of typed nodes, classifications, and relationships. It is the first structured artifact — not yet normalized.

---

## Boundary

Input: evidence boundary artifact from INTAKE
Output: Intelligence Graph (IG) — typed, structured, relationship-bearing, not yet normalized

---

## Inputs

- Evidence boundary artifact from [[PRODUCTIZE.RAW.SOURCE.INTAKE.01]]

---

## Outputs

- Intelligence Graph (IG)
  - Typed nodes
  - Classified relationships
  - Initial structural representation

---

## Evidence Produced

- IG artifact (versioned, immutable at creation)
- Node classification record
- Relationship type map

---

## Upstream Dependencies

- [[PRODUCTIZE.RAW.SOURCE.INTAKE.01]] — evidence boundary required

---

## Downstream Impact

- Required by: [[PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01]]
- IG is the input substrate for the full 40.x scan/normalize/handoff chain

---

## Canonical Status

COMPLETE

---

## Related Invariants

- [[../04_INVARIANTS]] — INV-01
- [[../04_INVARIANTS]] — INV-09
