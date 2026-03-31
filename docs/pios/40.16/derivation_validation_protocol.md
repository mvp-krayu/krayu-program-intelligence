# Derivation Validation Protocol

Stream: 40.16 — Derivation Specification (ESI / RAG)
Artifact: 6 of 7
Date: 2026-03-31
Authority: docs/pios/40.16/esi_derivation_specification.md | docs/pios/40.16/rag_derivation_specification.md | docs/governance/architecture/
Layer: L3 — Derivation

---

## Purpose

This artifact defines the validation protocol for the ESI and RAG derivation layer. It specifies how implementations of the 40.16 derivation specification are to be tested, verified, and audited for compliance with the three core derivation guarantees: determinism, traceability, and source agnosticism.

The protocol applies to:
- Initial implementation of the L3 derivation layer
- Any subsequent modification of derivation logic
- Audit of existing L6 computation (DRIFT-001 remediation)

---

## Core Validation Guarantees

### G1 — Determinism

**Claim:** Given identical TC inputs, program constants, and window sequences, the derivation MUST produce identical ESI and RAG scores on every execution.

**Validation method:**

*Test DVT-01 (Determinism — Static)*
- Construct a complete TC input set with all constants defined
- Execute derivation twice with identical inputs
- Assert: ESI score is identical to 6 decimal places
- Assert: RAG score is identical to 6 decimal places
- Assert: All intermediate values (PES-ESI-01..05, RAG_rate, RAG_accel, RAG_cross) are identical

*Test DVT-02 (Determinism — Temporal)*
- Execute derivation with the same 3-window historical sequence at two different calendar times
- Assert: Output scores are identical
- Validates that no system clock or runtime state enters the computation

**Pass criteria:** Both DVT-01 and DVT-02 must pass. Any floating point non-determinism constitutes a FAIL.

---

### G2 — Traceability

**Claim:** Every ESI and RAG score must be fully reconstructable from the recorded manifest. An independent reviewer with access to the manifest and this specification must be able to reproduce the score without access to the original computation environment.

**Validation method:**

*Test DVT-03 (Traceability — Forward)*
- Take a recorded derivation manifest from a completed run
- Using the TC values, constants, and window boundaries recorded in the manifest, manually execute each normalization function (NF-01..NF-07) and PES computation
- Assert: Manually computed PES-ESI-01..05 values match manifest-recorded intermediate values (tolerance: ±0.001)
- Assert: Manually computed ESI score matches manifest-recorded ESI score (tolerance: ±0.1)
- Assert: Manually computed RAG components and RAG score match manifest-recorded values (tolerance: ±0.1)

*Test DVT-04 (Traceability — Completeness)*
- Inspect any recorded manifest
- Assert: All required manifest fields are present (see execution_manifest.md for field list)
- Assert: No required intermediate value is absent
- Assert: Coverage mode is recorded
- Assert: All undefined signals are named

**Pass criteria:** DVT-03 must achieve full numerical reproduction within stated tolerances. DVT-04 must find no missing required fields.

---

### G3 — Source Agnosticism

**Claim:** The derivation layer must not contain any dependency on named source systems (GitHub, Jira, Jenkins, Linear, or any named CI, issue tracking, or telemetry platform).

**Validation method:**

*Test DVT-05 (Source Agnosticism — Static Analysis)*
- Inspect the implementation of the derivation layer
- Assert: No string literals naming external source systems appear in derivation functions
- Assert: No import, dependency, or SDK reference to a named source system exists in derivation-layer code
- Assert: All inputs enter the derivation layer as TC-class values only

*Test DVT-06 (Source Agnosticism — Substitution)*
- Construct two complete TC input sets with identical computed values but sourced from different hypothetical systems (e.g., one set labeled as sourced from a CI system, one labeled as sourced from a manual reporting pipeline)
- Execute derivation with both sets
- Assert: Outputs are identical
- Validates that the derivation layer is indifferent to the origin of TC values

**Pass criteria:** DVT-05 must find zero source system references in derivation logic. DVT-06 must show identical outputs.

---

## PARTIAL Mode Validation

*Test DVT-07 (PARTIAL Mode — Correct Activation)*
- Construct a TC input set where TC-09 (Cost Pressure) is explicitly absent (UNDEFINED)
- Execute derivation
- Assert: ESI is computed using PARTIAL mode weights (0.3125, 0.3125, 0.2500, 0.1250)
- Assert: Manifest records `coverage_mode: PARTIAL`
- Assert: Manifest records `undefined_signals: [PES-ESI-02]`
- Assert: RAG is also computed in PARTIAL mode (4 signals)

*Test DVT-08 (PARTIAL Mode — Non-simulation)*
- Construct a TC input set where TC-09 is UNDEFINED
- Inspect derivation output
- Assert: No default value, estimated value, or historical average appears in place of PES-ESI-02
- Assert: PES-ESI-02 is absent from manifest intermediate values (not set to 0.0 or any proxy)

**Pass criteria:** Both DVT-07 and DVT-08 must pass. Substituting any value for an undefined signal constitutes a FAIL.

---

## Boundary Condition Validation

*Test DVT-09 (Boundary — Zero Cadence)*
- Construct TC-01 = 0 (no execution triggers in window)
- Assert: frequency_component = 0.0
- Assert: PES-ESI-01 computes correctly (stability_component is used, frequency_component = 0)
- Assert: ESI score is not undefined (partial computation continues)

*Test DVT-10 (Boundary — Perfect Execution)*
- Construct all TC values at their maximum (F_observed = F_expected, all artifacts delivered, latency = L_target, all gates enforced, all feedback delivered)
- Assert: ESI = 100 (or 100 × PARTIAL renormalization in PARTIAL mode)
- Assert: No clamping warnings logged

*Test DVT-11 (Boundary — Total Failure)*
- Construct all TC values at their minimum (F_observed = 0, no runs completed, no artifacts, latency = L_max, no gates enforced, no feedback)
- Assert: ESI = 0
- Assert: No undefined signals triggered (all TCs are present, just at minimum values)

*Test DVT-12 (Boundary — Insufficient Windows for RAG)*
- Provide only 1 window of PES values
- Assert: RAG output is UNDEFINED
- Assert: Manifest records `rag_status: INSUFFICIENT_WINDOWS`
- Assert: ESI score is still computed normally

*Test DVT-13 (Boundary — Insufficient Windows for Acceleration)*
- Provide exactly 2 windows of PES values
- Assert: RAG_rate is computed normally
- Assert: RAG_accel = 0.0 with WARN logged
- Assert: RAG composite is computed using neutral acceleration

**Pass criteria:** All boundary tests must pass without exceptions or undefined score outputs (except DVT-12 where UNDEFINED RAG is the correct output).

---

## DRIFT-001 Remediation Audit Protocol

DRIFT-001 identifies that the SSI/SSZ computation currently executes at L6 (utils/ssz.js) when the canonical home is L3. This protocol defines how to audit the existing L6 implementation against the 40.16 specification.

*Audit step DA-01:*
- Read the current L6 implementation (utils/ssz.js or equivalent)
- For each computation in the L6 code, map it to either:
  (a) a defined derivation function in this specification (matches)
  (b) a computation not present in this specification (deviation)
  (c) a computation in this specification not present in L6 (gap)

*Audit step DA-02:*
- For each deviation identified in DA-01, classify:
  - Acceptable simplification (e.g., placeholder weights, provisional formulas)
  - Unauthorized extension (computation not justified by any authority source)
  - Architectural violation (reads raw source data, not normalized TC values)

*Audit step DA-03:*
- For each gap identified in DA-01, determine:
  - Whether the gap is covered by another L6 mechanism (document if so)
  - Whether the gap represents missing implementation (requires remediation)

*Audit output:* A deviation register listing all deviations and gaps with their classification. This register is the input to the DRIFT-001 remediation plan.

---

## Validation Register

| Test ID | Title | Category | Status |
|---------|-------|----------|--------|
| DVT-01 | Determinism — Static | G1 | DEFINED — not yet executed |
| DVT-02 | Determinism — Temporal | G1 | DEFINED — not yet executed |
| DVT-03 | Traceability — Forward | G2 | DEFINED — not yet executed |
| DVT-04 | Traceability — Completeness | G2 | DEFINED — not yet executed |
| DVT-05 | Source Agnosticism — Static Analysis | G3 | DEFINED — not yet executed |
| DVT-06 | Source Agnosticism — Substitution | G3 | DEFINED — not yet executed |
| DVT-07 | PARTIAL Mode — Correct Activation | PARTIAL | DEFINED — not yet executed |
| DVT-08 | PARTIAL Mode — Non-simulation | PARTIAL | DEFINED — not yet executed |
| DVT-09 | Boundary — Zero Cadence | Boundary | DEFINED — not yet executed |
| DVT-10 | Boundary — Perfect Execution | Boundary | DEFINED — not yet executed |
| DVT-11 | Boundary — Total Failure | Boundary | DEFINED — not yet executed |
| DVT-12 | Boundary — Insufficient Windows (RAG) | Boundary | DEFINED — not yet executed |
| DVT-13 | Boundary — Insufficient Windows (Accel) | Boundary | DEFINED — not yet executed |
| DA-01 | DRIFT-001 Audit — Mapping | Remediation | DEFINED — not yet executed |
| DA-02 | DRIFT-001 Audit — Deviation Classification | Remediation | DEFINED — not yet executed |
| DA-03 | DRIFT-001 Audit — Gap Classification | Remediation | DEFINED — not yet executed |

---

## Validation Sign-Off Requirement

A derivation implementation is not considered compliant with Stream 40.16 until:

1. DVT-01 through DVT-13 have all been executed and all have achieved PASS status
2. DA-01 through DA-03 have been executed against the current L6 implementation
3. All deviations classified in DA-02 as "Unauthorized extension" or "Architectural violation" have been resolved
4. The validation register above has been updated with PASS/FAIL status for each test

Until sign-off is achieved, the derivation layer is classified as SPECIFIED but not IMPLEMENTED. ESI and RAG scores produced by the existing L6 implementation remain under the DRIFT-001 classification.
