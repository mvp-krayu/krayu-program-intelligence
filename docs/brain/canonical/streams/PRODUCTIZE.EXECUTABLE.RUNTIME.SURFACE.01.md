---
type: stream-capsule
brain: canonical
layer: L6
canonical_status: COMPLETE
---

# PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01

## Purpose

Establish the executable runtime surface for the GAUGE/LENS system. Consumes prepared ZONE-2 payloads from the activation layer and renders an interactive intelligence view. Owns report generation and delivery infrastructure.

---

## Boundary

Input: prepared L5 payloads — ZONE-2 projections, claim sets, confidence scores
Output: runtime execution surface — functional, interactive, governed

---

## Inputs

- ZONE-2 projection payloads from L5 activation
- Claim set (CLM-09, CLM-20, CLM-25, CLM-12, CLM-10 in scope slice)
- Confidence scores with range bands
- Domain summary outputs

---

## Outputs

- GAUGE execution surface (/gauge-product runtime)
- LENS intelligence view (/lens route)
- Report generation endpoint (/api/report)
- Report serving endpoint (/api/report-file)

---

## Evidence Produced

- Runtime configuration artifacts
- Report generation logs (STREAM_ID embedded in every generated report)
- Filename-validated report artifacts (lens_report_YYYYMMDD_HHMMSS.html)

---

## PiOS Core Contract Boundary

PiOS Core is treated as a governed black box with explicit input/output contract. It is not omitted; it is bounded.

**Inputs to PiOS Core:**
- 40.4 validated handoff artifact (from [[PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01]])

**Outputs from PiOS Core (to L5 Activation):**
- CLM-* claim set (with confidence bands)
- Signal-derived metrics
- Domain-level scoring inputs

**Constraints:**
- Core is deterministic — same 40.4 input produces same Core output ([[../04_INVARIANTS]] INV-06)
- Core does not mutate 40.4 artifacts ([[../04_INVARIANTS]] INV-05)
- Core outputs must be fully traceable to 40.4 inputs ([[../04_INVARIANTS]] INV-01)

This boundary contract eliminates the implicit dependency. PiOS Core (L2–L4) is referenced by this node as a bounded upstream stage with a defined input/output contract, not as an undefined dependency.

---

## Upstream Dependencies

- PiOS Core (L2–L4) — all derivation — see PiOS Core Contract Boundary above
- Activation layer (L5) — binding and projection
- [[PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01]] — indirectly, via Core

---

## Downstream Impact

- Consumed by: [[PRODUCTIZE.LENS]]
- Runtime surface is the delivery mechanism for the LENS product

---

## Canonical Status

COMPLETE

---

## Related Invariants

- [[../04_INVARIANTS]] — INV-08 (ZONE-2 purity)
- [[../04_INVARIANTS]] — INV-05 (no cross-layer mutation)
- [[../04_INVARIANTS]] — INV-06 (Determinism)

---

## Code Surface

implements: [[../../code/runtime_surface]]
