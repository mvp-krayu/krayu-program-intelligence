# Boundary and Exclusion Report

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Date: 2026-03-28

---

## Critical Boundary: 40.7 Input Restriction

OBSERVED — diagnosis_boundary_enforcement.md

Stream 40.7 enforces a strict input boundary:
- ONLY 40.6 condition artifacts are permitted inputs
- 40.2, 40.3, 40.4, 40.5 are explicitly NOT ACCESSED
- Mechanism: "Upstream Layer Access Declaration" with "not accessed" for each upstream layer

This enforces the State-Diagnosis Separation Principle (GC-07) at the execution layer, not just in specification.

---

## Critical Exclusion: 51.x Is Not an Architecture Layer

OBSERVED — 40.11/stream_50_handover_capsule.md, DEMO_CONTEXT.md

Exclusion basis:
1. Stream 50 (Demonstrations) is explicitly downstream of Stream 40 (PiOS Runtime)
2. Handover capsule authorizes Stream 50 to USE 40.x outputs as read-only only
3. Stream 50 MUST NOT modify, recompute, or reinterpret 40.x artifacts
4. 51.x streams are demo surface streams — consumer, not architecture

Verdict: 51.x EXCLUDED from architecture. Any claim that 51.x constitutes an architecture layer is REJECTED.

---

## Consumer Boundary: 42.x Cannot Produce Bindings

OBSERVED — 43.1 Section 9

"Consumer-side compensation" is explicitly prohibited:
> "42.x must not produce bindings that 43.x has not produced. 42.x must not infer signal-to-node relationships from its own knowledge of topology and signals."

42.x receives governed binding outputs. It does not generate them.

---

## Projection Boundary: No Reverse Dependency from 42.x to 44.x

OBSERVED — 44.1 Section 10

> "No requirement originating in 42.x may alter the definition of 44.x. No back-propagation from the consumer layer to the projection layer is permitted."

44.x output is complete without consumer interpretation.

---

## Binding Boundary: SSZ and SSI Explicitly Prohibited

OBSERVED — 43.1 Section 9; 44.1 Section 9, Section 11

SSZ (Structural Stress Zone) and SSI (Structural Stress Index) are classified PROVISIONAL — NOT ADMITTED.
They may not appear in:
- 43.x binding inputs, node designations, projection values
- 44.x overlay elements, projections, emphasis assignments
- Any capacity until completing full canonical admission workflow

---

## 75.x Interpretation Layer: Blocked

OBSERVED — 42.23/rewiring_plan.md "75.x interpretation layer: remains blocked"

A defined interpretation layer (Stream 75 — Program Diagnosis and Intelligence Models) is architecturally referenced but absent from execution. The demo surface routes around it explicitly. Its absence is a known gap, not an architectural exclusion.

---

## Boundary Check Summary

| Boundary Check | Result | Evidence |
|---|---|---|
| 40.x vs 41.x | CONFIRMED | 43.1: signals "produced at L3, shaped at L4" |
| 41.x vs 42.x | CONFIRMED | 42.1 contract: 41.x inputs are read-only locked |
| 42.x vs 43.x (42.x cannot produce bindings) | CONFIRMED | 43.1 Section 9 |
| 43.x vs 44.x (sequential, 44.x downstream) | CONFIRMED | 44.1 Section 2 data flow |
| 51.x vs architecture (exclusion) | CONFIRMED | 40.11 handover capsule |
| PiOS Core Engine scope | AMBIGUOUS | INT-01 says 40.2-40.7; spec says 40.2-40.9 |
| 43.x + 44.x relationship | CONFIRMED — sequential | 44.1 Section 2, 43.3 → 44.1 |
