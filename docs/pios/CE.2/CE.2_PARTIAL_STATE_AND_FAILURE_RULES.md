# CE.2 — Partial State and Failure Rules

**Stream:** CE.2 — PiOS Core Engine Internal Contract
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** canonical-layer-model.md (00.2), CE.2_DETERMINISM_AND_TRACEABILITY.md

---

## 1. Partial State Definition

A PARTIAL state exists when:
- A required input is absent from the 40.4 handoff
- A required input has temporal classification `time-series` and no observation value is present
- A required input has temporal classification `event-based` and no explicit per-run value is declared in 40.4
- A required computation cannot proceed because N < minimum required windows
- A governance gap (CG-xx) explicitly removes a required input class

PARTIAL is a valid, correct, deterministic output state. It is not an error.

---

## 2. Active Gaps in Baseline 0.1

| Gap ID | Description | Affected Layer | Effect |
|---|---|---|---|
| CG-01 | TC-09 (cost/budget telemetry) not defined in 40.4 | 40.5 | PES-ESI-02 permanently UNDEFINED; ESI enters PARTIAL mode |
| CG-02 | TC-01 (AT-001) is time-series; no static value in 40.4 | 40.5 | NF-01 UNDEFINED; PES-ESI-01 UNDEFINED |
| CG-03 | TC-04 (DT-006) is time-series; no static value in 40.4 | 40.5 | NF-05 UNDEFINED; PES-ESI-04 UNDEFINED |
| CG-04 | TC-05 (AT-007) has no explicit per-run value in 40.4 | 40.5 | NF-06 UNDEFINED; PES-ESI-05 UNDEFINED |
| CG-05 | TC-08 (AT-009, DT-008) have no explicit per-run values in 40.4 | 40.5 | NF-07 UNDEFINED; PES-ESI-05 UNDEFINED |
| CG-06 | TC-07 (variance) requires N≥3 windows; baseline N=1 | 40.5 | NF-02 neutral (0.5) |
| CG-07 | RAG requires N≥2 windows; baseline N=1 | 40.5 | RAG=INSUFFICIENT_WINDOWS |

---

## 3. Partial State Propagation Rules

### PSR-01 — UNDEFINED Propagates Forward

If a layer receives an UNDEFINED input for a required field:
- The layer output for that field must also be UNDEFINED
- The layer must not substitute a default, zero, or estimated value
- The UNDEFINED status and its source gap reference must be preserved in output

### PSR-02 — PARTIAL Does Not Block Layer Execution

A layer may proceed with the inputs it has. It produces PARTIAL output for the affected fields and full output for unaffected fields.

Example: NF-04 = 1.0 (from DT-001 + DT-003) is valid and produced even when NF-01, NF-03, NF-05, NF-06, NF-07 are UNDEFINED.

### PSR-03 — PARTIAL Mode Weights Are Fixed

When ESI operates in PARTIAL mode (CG-01 active), the renormalized weights are:

| Signal | PARTIAL Weight |
|---|---|
| PES-ESI-01 | 0.3125 |
| PES-ESI-03 | 0.3125 |
| PES-ESI-04 | 0.2500 |
| PES-ESI-05 | 0.1250 |
| **Sum** | **1.0000** |

These weights are fixed constants, not computed at runtime.

### PSR-04 — ESI UNDEFINED When Any PARTIAL-Mode Signal Is UNDEFINED

In PARTIAL mode, if any of PES-ESI-01, PES-ESI-03, PES-ESI-04, or PES-ESI-05 is UNDEFINED, the ESI composite value is UNDEFINED. The mode remains PARTIAL.

### PSR-05 — INSUFFICIENT_WINDOWS Is a Named Partial State

INSUFFICIENT_WINDOWS is not an error. It is the correct named output when:
- N < 2: RAG_rate cannot be computed
- N < 3: RAG_accel cannot be computed (excluded from composite; weight redistributed to RAG_rate)

### PSR-06 — NF-02 Neutral Is a Named Partial State

When N < 3 windows are available, NF-02 (variance-based stability) returns 0.5 (neutral). This is the correct governed behavior for insufficient window count, not an inference.

---

## 4. Failure Rules

Failure is distinct from PARTIAL. A failure indicates a violated invariant, not a missing observation.

### FR-01 — Input Contract Mismatch → FAIL

If 40.4 artifact SHA-256 hashes do not match `input_contract_lock.json`, the run is INVALID. Execution must stop at 40.11. No output from that run is valid.

### FR-02 — Out-of-Range Value → FAIL

If any NF value falls outside [0.0, 1.0], or any ESI value falls outside [0, 100], execution must halt. The violating computation is logged and the run is marked FAIL.

### FR-03 — Heuristic Substitution → FAIL

If any layer substitutes an estimated or heuristically derived value for an UNDEFINED input, the output is invalid and the run is marked FAIL.

### FR-04 — Layer Sequence Violation → FAIL

If any layer accesses an output from a non-predecessor layer (e.g., 40.6 accessing 40.8 output), the run is marked FAIL.

### FR-05 — Silent PARTIAL → FAIL

If a layer produces a non-UNDEFINED output for a field whose required input was UNDEFINED, without explicit declaration, the run is marked FAIL. All state propagation must be explicit and visible.

---

## 5. Failure Response Protocol

On any failure condition:

1. Halt execution at the detecting layer
2. Record the failure type, layer, and field in the 40.11 integrity record
3. Do not pass invalid outputs to the next layer
4. Produce a partial 40.11 closure record declaring FAIL with cause
5. Do not suppress or hide the failure

Silent failure is forbidden.
