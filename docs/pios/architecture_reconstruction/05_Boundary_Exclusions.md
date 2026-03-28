---
title: Boundary and Exclusion Register
type: boundary-exclusions
status: OBSERVED
confidence: HIGH
date: 2026-03-28
---

# Boundary and Exclusion Register

## Layer Boundaries

### 40.x Internal Boundaries

**40.3 → 40.4 boundary**
- 40.4 receives: evidence snapshot + reconstructed structure + PEG
- 40.4 does NOT access: any upstream layer directly beyond 40.3 outputs
- Anchor: pios_pipeline_specification.md Stage 3

**40.6 → 40.7 boundary (CRITICAL — State-Diagnosis Separation)**
- 40.7 input boundary: 40.6 condition artifacts ONLY
- 40.7 DOES NOT access: 40.5 signals, 40.4 telemetry, 40.3 reconstruction, 40.2 evidence
- Anchor: diagnosis_boundary_enforcement.md (explicit access declaration: NOT ACCESSED for 40.2-40.5)
- Rule: State-Diagnosis Separation Principle (GC-07)

**40.x → 41.x boundary**
- 41.x receives semantic inputs from 40.5/40.7 outputs
- 41.x DOES NOT recompute signals or modify 40.x artifacts
- 41.x artifacts are read-only from 40.x perspective
- Anchor: 43.1 Section 4: "produced at L3 and shaped at L4"

### 43.x Boundaries

**43.x may NOT:**
- Create new signals (CKR admission required)
- Reintroduce SSZ or SSI (PROVISIONAL — NOT ADMITTED)
- Mutate structural topology
- Interpret signal meaning
- Aggregate signals into synthetic constructs
- Infer narrative
- Repair invalid upstream outputs
- Anchor: 43.1 Section 9 Boundary Enforcement

**43.x receives from 41.x:**
- Governed semantic outputs as IMMUTABLE inputs
- Does not extend outputs or introduce semantic claims

### 44.x Boundaries

**44.x may NOT:**
- Derive signals
- Validate signals (43.3 owns validation)
- Classify node condition
- Assign severity
- Compute composite node state
- Create SSZ, SSI, or equivalent constructs
- Introduce UI-specific fields
- Receive input FROM 42.x (no reverse dependency)
- Anchor: 44.1 Section 9 + Section 11 Canonical Prohibitions

### 42.x (Consumer) Boundaries

**42.x may NOT:**
- Produce bindings (42.x consumes bindings, does not generate them)
- Infer signal-to-node relationships from own knowledge
- Compensate for absent upstream outputs
- Create bindings that 43.x has not produced
- Anchor: 43.1 Section 9: "Consumer-side compensation" prohibition; 42.1 contract

---

## Architecture vs. Demo Surface Exclusion

**51.x (ExecLens Demo Surface) is NOT an architecture layer.**

Evidence:
1. 40.11/stream_50_handover_capsule.md explicitly defines Stream 50 as "Demonstration" — authorized to USE 40.x outputs read-only
2. 51.x streams are numbered under Stream 50 (Demonstrations), not Stream 40 (PiOS Runtime)
3. DEMO_CONTEXT.md: "The system does not summarize. It does not estimate. It does not infer. It traverses, binds, and renders." — consumer of artifacts, not architecture layer
4. 40.11 handover: "Stream 50 MUST NOT modify any artifacts under docs/pios/40.x"

Verdict: 51.x = EXCLUDED from architecture layer model. REJECTED as architecture claim.

---

## Boundary Checks Required by Contract

| Boundary | Check | Verdict |
|---|---|---|
| 40.x vs 41.x | 40.x produces; 41.x consumes and shapes. No reverse write. | CONFIRMED |
| 41.x vs 42.x | 41.x produces locked artifacts; 42.x consumes via governed paths. | CONFIRMED |
| 42.x vs 43.x | 43.x produces bindings; 42.x consumes. No generation in 42.x. | CONFIRMED |
| 43.x vs 44.x | 43.3 produces validated payload; 44.x consumes for projection. | CONFIRMED |
| 51.x vs architecture | 51.x = demo surface. Not an architecture layer. | REJECTED (exclusion confirmed) |
| 43.x + 44.x relationship | 43.x = binding; 44.x = projection. Sequential. 44.x is downstream of 43.3. | CONFIRMED |
| PiOS Core Engine scope | 40.2-40.7 per INT-01; 40.2-40.9 per pios_pipeline_specification.md | AMBIGUOUS (scope definition varies by source) |

---

## Provisionally Excluded Constructs

| Construct | Status | Exclusion Anchor |
|---|---|---|
| SSZ (Structural Stress Zone) | PROVISIONAL — NOT ADMITTED | 43.1 Section 9; 44.1 Section 9, 11 |
| SSI (Structural Stress Index) | PROVISIONAL — NOT ADMITTED | 43.1 Section 9; 44.1 Section 9, 11 |
| 75.x Interpretation Layer | BLOCKED (absent) | 42.23 rewiring_plan.md "remains blocked" |
| Any non-CKR-admitted construct as binding input | PROHIBITED | 43.1 Rule 1: "Signal admission is prerequisite" |
