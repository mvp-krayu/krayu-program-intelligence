# CE.4 — Signal Failure Classification Model

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** CLASSIFICATION MODEL
**Date:** 2026-04-03
**Evidence source:** `signal_emission_surface_assessment.md`, `CE.3/signal_failure_classification.md`, `pios/core/v0.1/engine/compute_signals.py`
**Status:** NORMATIVE — this model classifies all observed failure and anomalous emission modes

---

## 1. PURPOSE

This document establishes the formal classification taxonomy for all signal-level
failure and anomalous emission conditions observed in the 40.5 surface.

This model is the required precondition for defining the emission contract (artifact 3).
Each class defined here corresponds to at least one observed signal or emission pattern.
No class is introduced speculatively.

---

## 2. CLASSIFICATION TAXONOMY

### Class F-1 — INPUT_ABSENCE

**Definition:** A signal's required input variables exist in the variable schema but carry
UNDEFINED (null) values because the required data is not available in the current execution
context. A computation formula for the signal exists and is correctly specified. The signal
cannot produce a resolved output until the required inputs are available.

**Distinguishing characteristic:** The computation function contains a complete formula.
The formula is not executed because the guard condition (input availability check) is not
satisfied. If inputs were supplied, the formula would execute and produce a non-null output.

**Observed instances:**
- SIG-003 (compute_sig_003 branch 1): VAR_AT_001 and VAR_AT_002 are TIME_SERIES variables
  not present in static 40.4 telemetry context. Formula does not execute.
- SIG-001 (partial): VAR_AT_007 is EVENT_BASED, PENDING — runtime_component null.
- SIG-005 (partial): VAR_DT_007 is EVENT_BASED, PENDING — completion_factor null.

**Subclass F-1a — STRUCTURAL_ABSENCE:** The input's temporal class (TIME_SERIES or
EVENT_BASED) is incompatible with the current execution context. The absence is not
transient — it is a function of the execution context type, not a gap in data collection.
SIG-003 is F-1a (time-series required; static context cannot produce it).

**Subclass F-1b — CONTEXTUAL_ABSENCE:** The input is available in the current execution
context class (event-based) but has not yet been observed in this invocation. The absence
may be transient — a future invocation with live event data could supply the value.
SIG-001 runtime_component and SIG-005 completion_factor are F-1b.

**Current emission consequence:** Signal emits state=PARTIAL (primitive PARTIAL variant)
or state=BLOCKED (when no output fields can be resolved).

---

### Class F-2 — FORMULA_ABSENCE

**Definition:** A signal's computation function does not contain a formula capable of
producing a non-null output when all declared inputs are available. The function will
return a BLOCKED or null state regardless of input supply. This is a specification gap,
not a data gap.

**Distinguishing characteristic:** Supplying all required input variables does not cause
the function to produce a resolved numeric output. The function code has no formula path
that maps inputs to output values.

**Observed instances:**
- SIG-003 (compute_sig_003 branch 2, else): If VAR_AT_001 and VAR_AT_002 were both
  non-null, execution would pass to the else branch, which returns:
  `{"state": "BLOCKED", "output": UNDEFINED}` — no formula.
- SIG-006 (compute_sig_006): Unconditional BLOCKED return. No formula present.
  The function body is a single return statement with no computation.

**Note:** SIG-003 carries both F-1 and F-2. F-1 (branch 1) executes first; F-2 (branch 2)
would execute if F-1 did not intercept. Both must be resolved for SIG-003 to become computable.
SIG-006 carries only F-2 (no guard condition at all — the function is unconditionally non-computable).

**Current emission consequence:** Signal emits state=BLOCKED.

---

### Class F-3 — UPSTREAM_BLOCKAGE

**Definition:** A derived signal cannot compute one or more of its output components
because an upstream signal it depends on is in state BLOCKED. The derived signal's own
formula is present and correct. The computation failure originates in the upstream signal,
not in the derived signal.

**Distinguishing characteristic:** The derived signal's function code is correct and
complete. If the upstream signal were to emit a resolved value, the derived signal would
compute successfully for the affected component.

**Observed instances:**
- SIG-007 (`sig_006_stability_component` = null): SIG-006 is BLOCKED → component null.
- SIG-008 (`sig_003_change_concentration_component` = null): SIG-003 is BLOCKED → component null.

**Current emission consequence:** Signal emits state=PARTIAL (derived PARTIAL variant).
Affected output fields are null. Unaffected output fields carry resolved values.

---

### Class F-4 — UPSTREAM_PARTIALITY

**Definition:** A derived signal receives a PARTIAL upstream signal. Some components
of the upstream signal are resolved; others are null. The derived signal uses the resolved
upstream components and propagates null for the unresolved ones.

**Distinguishing characteristic:** The upstream signal is not BLOCKED — it is PARTIAL.
The derived signal may be able to compute some of its outputs using the resolved upstream
components.

**Observed instances:**
- SIG-007 uses SIG-005 (`sig_005_completion_factor_component` = null because SIG-005's
  completion_factor is null). SIG-005 is PARTIAL (F-1b), not BLOCKED.
- SIG-008 uses SIG-001 static component (resolved at 0.875); runtime component is null
  but SIG-008 does not use SIG-001's runtime component directly.

**Note:** F-4 is currently conflated with F-3 in the PARTIAL state label. Both result
in null output fields in a PARTIAL signal. The cause differs: F-3 originates in upstream
BLOCKED; F-4 originates in upstream PARTIAL.

**Current emission consequence:** Signal emits state=PARTIAL. The affected output fields
are null. This is indistinguishable from F-3 in the current serialized payload.

---

### Class F-5 — METADATA_ABSENCE

**Definition:** A signal in state BLOCKED or PARTIAL does not carry the metadata fields
required to identify why the failure occurred or which inputs are responsible. The signal
state is correct but the payload is informationally incomplete.

**Distinguishing characteristic:** The signal state (BLOCKED or PARTIAL) is accurate.
The problem is not the state itself but the absence of blockage metadata fields that
would allow consumers to understand and trace the cause.

**Observed instances:**
- SIG-003 in CE.2-R01-MIX run artifact: state=BLOCKED, output=null, no `blocking_inputs`,
  no `blocking_reason`. SIG-006 in the same run carries both fields. The inconsistency
  is the observed evidence of F-5 at SIG-003.
- SIG-007 and SIG-008 PARTIAL: carry a `note` (prose) instead of structured blockage
  metadata fields. The note communicates the cause informally but is not machine-parseable.

**Current emission consequence:** BLOCKED or PARTIAL payload with no structured blockage
attribution. The field `note` is used informally as a substitute; no governed field exists.

---

### Class F-6 — STRUCTURAL_HETEROGENEITY

**Definition:** Two signals in the same emission state carry different payload structures.
The payload schema is inconsistent across signals at the same state level. This is not a
failure of a single signal — it is a failure of the emission surface to enforce a uniform
contract.

**Distinguishing characteristic:** BLOCKED signals should have consistent field sets.
PARTIAL signals should have consistent field sets. The current surface does not enforce this.

**Observed instances:**
- BLOCKED: SIG-006 carries `blocking_inputs` + `blocking_reason`; SIG-003 carries neither.
- PARTIAL: SIG-001/SIG-005 carry `traceability` object; SIG-007/SIG-008 carry `note` string.
- Both BLOCKED signals lack `traceability`; both PARTIAL primitive signals carry it;
  both PARTIAL derived signals do not.

**Current emission consequence:** Downstream consumers cannot rely on field presence
for any state except COMPLETE. There is no governed payload schema for PARTIAL or BLOCKED.

---

## 3. CLASSIFICATION MATRIX

| Class | Name | Root | Signals affected |
|---|---|---|---|
| F-1a | INPUT_ABSENCE / STRUCTURAL | Temporal class mismatch — static context incompatible with required variable class | SIG-003 (branch 1) |
| F-1b | INPUT_ABSENCE / CONTEXTUAL | Event-based input not yet observed in current invocation | SIG-001 (runtime_component), SIG-005 (completion_factor) |
| F-2 | FORMULA_ABSENCE | No formula in computation function for non-blocked path | SIG-003 (branch 2), SIG-006 |
| F-3 | UPSTREAM_BLOCKAGE | Upstream signal is BLOCKED → dependent component null | SIG-007 (from SIG-006), SIG-008 (from SIG-003) |
| F-4 | UPSTREAM_PARTIALITY | Upstream signal is PARTIAL → partial component propagation | SIG-007 (from SIG-005) |
| F-5 | METADATA_ABSENCE | BLOCKED/PARTIAL payload missing structured failure attribution | SIG-003 (no blocking_inputs), SIG-007, SIG-008 (note only) |
| F-6 | STRUCTURAL_HETEROGENEITY | Inconsistent payload schema across signals at same state | BLOCKED: SIG-003 vs SIG-006; PARTIAL: primitive vs derived |

---

## 4. RELATIONSHIP TO EMISSION STATES

| Emission state | Associated classes | Notes |
|---|---|---|
| COMPLETE | None | No failure classes apply |
| PARTIAL (primitive) | F-1b, F-5, F-6 | Formula present; some inputs pending |
| PARTIAL (derived) | F-3, F-4, F-5, F-6 | Formula present; upstream null/blocked |
| BLOCKED | F-1a, F-2, F-5, F-6 | No resolved output; cause varies |

F-5 and F-6 are cross-cutting — they describe payload completeness failures that apply
regardless of what caused the underlying BLOCKED or PARTIAL state.

---

## 5. CONCLUSION

Six failure classes are formally identified, grounded in observed runtime behavior and
engine source code. Each class is distinct in root cause and resolution path.

The most consequential finding: F-2 (FORMULA_ABSENCE) and F-1a (STRUCTURAL_ABSENCE)
both produce BLOCKED states but are not distinguishable from the current payload.
F-2 requires a specification change (formula must be authored); F-1a requires a context
change (time-series data must be supplied). Treating them as the same class would direct
resolution effort incorrectly.

CE.4 emission contract must define distinct governed treatment for each class.
