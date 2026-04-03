# CE.4 — Signal Computability Governance

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** GOVERNANCE MODEL
**Date:** 2026-04-03
**Evidence base:** `signal_failure_classification_model.md`, `pios/core/v0.1/engine/compute_signals.py`
**Authority:** CE.4

---

## 1. PURPOSE

This document defines the formal model for classifying a signal as COMPUTABLE or
NON_COMPUTABLE. It governs the relationship between computability classification,
formula presence, input availability, and the resulting emission state contract.

Computability is a property of the signal's specification, not its data. A signal
may be COMPUTABLE but currently unable to produce a resolved output (due to missing inputs).
A signal may be NON_COMPUTABLE regardless of what inputs are supplied.

This distinction is essential for directing resolution: COMPUTABLE signals require
data supply; NON_COMPUTABLE signals require specification authorship.

---

## 2. COMPUTABILITY CLASSES

### CC-001 — COMPUTABLE_STATIC

**Definition:** A signal is COMPUTABLE_STATIC if and only if all of the following hold:
1. A computation formula is explicitly specified and implemented
2. All required inputs belong to the STRUCTURAL temporal class (VAR_ST_*)
3. All required inputs are available in the static 40.4 telemetry context

**Emission expectation:** COMPLETE on every invocation regardless of execution context.

**Current instances:** SIG-002, SIG-004

---

### CC-002 — COMPUTABLE_EVENT

**Definition:** A signal is COMPUTABLE_EVENT if and only if all of the following hold:
1. A computation formula is explicitly specified and implemented
2. At least one required input belongs to the EVENT_BASED temporal class (VAR_AT_* event, VAR_DT_*)
3. The formula is complete — if all inputs were supplied, the formula would produce a
   fully resolved output with no null fields

**Emission expectation:** COMPLETE when all event-based inputs are available (live execution
context); PARTIAL or BLOCKED in static context depending on how many static components
are resolvable independently.

**Current instances:** SIG-005 (partially — throughput_rate computable statically;
completion_factor requires VAR_DT_007), SIG-001 (partially — static_structural_ratio
computable statically; runtime_component requires VAR_AT_007)

---

### CC-003 — COMPUTABLE_TIMESERIES

**Definition:** A signal is COMPUTABLE_TIMESERIES if and only if all of the following hold:
1. A computation formula is explicitly specified and implemented
2. At least one required input belongs to the TIME_SERIES temporal class (VAR_AT_* time-series)
3. The formula is complete — if accumulated time-series data were supplied, the formula
   would produce a fully resolved output

**Emission expectation:** COMPLETE when accumulated time-series data is available across
the required number of push-to-main intervals. BLOCKED in static single-invocation context.

**Current instances:** NONE. SIG-003 is NOT CC-003 because condition 3 is not satisfied —
the computation formula for the time-series case (branch 2 / else) does not exist.

---

### CC-004 — COMPUTABLE_DERIVED

**Definition:** A signal is COMPUTABLE_DERIVED if and only if all of the following hold:
1. A computation formula is explicitly specified and implemented
2. All inputs are outputs from other governed signals (not directly from telemetry variables)
3. The formula is complete — if all upstream signals were COMPLETE, this signal would
   produce a fully resolved output with no null fields

**Emission expectation:** COMPLETE when all upstream signal dependencies are COMPLETE.
PARTIAL when upstream signals are PARTIAL or BLOCKED (for the dependent components only).

**Current instances:** SIG-007, SIG-008

---

### CC-005 — NON_COMPUTABLE

**Definition:** A signal is NON_COMPUTABLE if and only if at least one of the following holds:
1. No computation formula exists for the signal's primary output in any execution context
2. The computation function has no code path that produces a non-null `output` value
3. The function is an unconditional BLOCKED return with no formula

**Emission expectation:** BLOCKED on every invocation regardless of input supply.

**Current instances:**
- SIG-003 (class F-2 / formula absent in branch 2): NON_COMPUTABLE in the time-series
  branch. Even if VAR_AT_001 and VAR_AT_002 were supplied, branch 2 returns BLOCKED
  with no output. This is F-2 (FORMULA_ABSENCE).
- SIG-006: NON_COMPUTABLE. `compute_sig_006` is an unconditional BLOCKED return.
  No formula is present. This is F-2 (FORMULA_ABSENCE).

**Note:** NON_COMPUTABLE is not the same as "currently unable to compute." A NON_COMPUTABLE
signal cannot be repaired by data supply alone. Repair requires specification authorship —
a new formula must be defined and implemented.

---

## 3. COMPUTABILITY DETERMINATION RULES

A signal's computability class MUST be determined by inspecting the following, in order:

**Rule CG-001 — Formula presence check:**
If the signal computation function has no code path that produces `output` as a non-null
object with at least one resolved numeric field, classify as CC-005 (NON_COMPUTABLE).

**Rule CG-002 — Input class identification:**
If CG-001 does not classify as CC-005, identify the temporal classes of all required inputs:
- All STRUCTURAL → candidate for CC-001
- At least one EVENT_BASED → candidate for CC-002
- At least one TIME_SERIES → candidate for CC-003
- All inputs are upstream signals → candidate for CC-004

**Rule CG-003 — Temporal context evaluation:**
Apply the class from CG-002. Verify:
- CC-001: All VAR_ST_* inputs present in STATIC_VARIABLES → classify as CC-001
- CC-002: EVENT_BASED inputs PENDING → emit PARTIAL for static components; COMPUTABLE_EVENT overall
- CC-003: TIME_SERIES inputs PENDING and formula complete → classify as CC-003
- CC-004: Upstream signals in scope → classify as CC-004

**Rule CG-004 — Dual-failure check (SIG-003 pattern):**
If a signal has both F-1a (input absent) AND F-2 (formula absent in the live branch),
classify as CC-005 (NON_COMPUTABLE) because the F-2 condition takes precedence —
even resolving the data absence would not produce a computable output.

---

## 4. COMPUTABILITY CLASSIFICATION — CURRENT SIGNAL SET

| Signal | Computability Class | Formula Present | Blocking Factor |
|---|---|---|---|
| SIG-001 | CC-002 (COMPUTABLE_EVENT) | YES | VAR_AT_007 (EVENT_BASED, PENDING) |
| SIG-002 | CC-001 (COMPUTABLE_STATIC) | YES | None — COMPLETE |
| SIG-003 | CC-005 (NON_COMPUTABLE) | ABSENT in branch 2 | F-2 (FORMULA_ABSENCE) |
| SIG-004 | CC-001 (COMPUTABLE_STATIC) | YES | None — COMPLETE |
| SIG-005 | CC-002 (COMPUTABLE_EVENT) | YES | VAR_DT_007 (EVENT_BASED, PENDING) |
| SIG-006 | CC-005 (NON_COMPUTABLE) | ABSENT (unconditional) | F-2 (FORMULA_ABSENCE) |
| SIG-007 | CC-004 (COMPUTABLE_DERIVED) | YES | SIG-006 BLOCKED (F-3) |
| SIG-008 | CC-004 (COMPUTABLE_DERIVED) | YES | SIG-003 BLOCKED (F-3) |

---

## 5. COMPUTABILITY AND EMISSION STATE RELATIONSHIP

| Computability Class | Possible emission states | Notes |
|---|---|---|
| CC-001 | COMPLETE only | All inputs static; no valid reason to emit PARTIAL or BLOCKED |
| CC-002 | COMPLETE (live), PARTIAL (static) | Static components resolved; event components null in static context |
| CC-003 | COMPLETE (time-series context), BLOCKED (static) | Entire output requires time-series data |
| CC-004 | COMPLETE (all upstream COMPLETE), PARTIAL (any upstream BLOCKED/PARTIAL) | Inherits upstream state |
| CC-005 | BLOCKED only | No execution context produces a resolved output |

---

## 6. FORMULA PRESENCE REQUIREMENT

**Rule FP-001:** Every signal with computability class CC-001, CC-002, CC-003, or CC-004
MUST have a complete, specified formula for all output fields in its non-blocked execution path.

**Rule FP-002:** A signal computation function that contains any code path where
`output=UNDEFINED` is returned without execution of a formula violates this rule.

**Rule FP-003:** The formula must be derivable from a governed specification document
(not inferred from implementation alone). See `documentation_alignment_rule.md`.

**Rule FP-004:** A signal that has a defined formula in its input-absent branch but
lacks a formula in its input-present branch is classified as CC-005 (NON_COMPUTABLE)
regardless of what the input-absent branch does. The formula must be present in the
branch that executes when inputs are available.

---

## 7. BOUNDARY STATEMENT

This model governs computability classification at the signal level. It does not:
- Define how blocked signals are handled at 40.6 (governed by CE.2 DEC-013)
- Define what formula a NON_COMPUTABLE signal should implement (outside CE.4 scope)
- Define how time-series data is supplied to the engine (outside CE.4 scope)

---

## 8. CONCLUSION

Five computability classes are defined (CC-001 through CC-005). Two signals in the current
PiOS v0.1 engine are NON_COMPUTABLE (SIG-003 due to F-2 in branch 2; SIG-006 due to
unconditional BLOCKED return). Both are CC-005 regardless of input state. The remaining
six signals are COMPUTABLE under appropriate execution contexts. Computability classification
is the required precondition for determining repair eligibility — a NON_COMPUTABLE signal
cannot be repaired by data supply alone.
