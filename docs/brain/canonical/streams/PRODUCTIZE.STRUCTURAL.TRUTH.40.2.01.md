---
type: stream-capsule
brain: canonical
layer: L1 (40.2)
canonical_status: COMPLETE
---

# PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01

## Purpose

Scan and classify the Intelligence Graph. Assigns evidence types, domain classifications, and signal candidates across the full IG surface. Produces the classified evidence set required by 40.3.

---

## Boundary

Input: Intelligence Graph from PRODUCTIZE.IG.FROM.INTAKE.01
Output: classified evidence set — all nodes assigned type, domain, and initial signal flag

---

## Inputs

- Intelligence Graph from [[PRODUCTIZE.IG.FROM.INTAKE.01]]

---

## Outputs

- Classified evidence set
- Domain assignment table (all domains identified in the Intelligence Graph)
- Signal candidate flags
- Type distribution summary

---

## Evidence Produced

- Classification artifacts (per node, per relationship)
- Domain map (all domains present in client environment — count varies per engagement)
- Signal candidate index

---

## Upstream Dependencies

- [[PRODUCTIZE.IG.FROM.INTAKE.01]]

---

## Downstream Impact

- Required by: [[PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01]]
- Classification errors at 40.2 propagate to all downstream layers
- Domain map feeds directly into LENS system intelligence overview

---

## Canonical Status

COMPLETE

---

## Related Invariants

- [[../04_INVARIANTS]] — INV-01
- [[../04_INVARIANTS]] — INV-06 (Determinism — same IG produces same classification)
