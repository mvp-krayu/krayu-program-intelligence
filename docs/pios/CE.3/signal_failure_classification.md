# CE.3 — Signal Failure Classification

**Stream:** CE.3 — Signal Repair Boundary Definition
**Artifact type:** CLASSIFICATION
**Date:** 2026-04-02
**Engine source:** `pios/core/v0.1/engine/compute_signals.py`

---

## 1. CLASSIFICATION FRAMEWORK

Three failure classes are applicable to signal blockage in the PiOS v0.1 engine:

| Class | Definition |
|---|---|
| DATA ABSENCE | Required input variables are present in the variable schema but carry UNDEFINED values due to temporal context constraints (time-series or event-based data not available in static invocation). The computation formula exists and is correct. Resolution requires data supply. |
| STRUCTURAL IMPOSSIBILITY | The computation function has no formula capable of producing a non-UNDEFINED output for the target signal, regardless of input state. Resolution requires specification and implementation of the formula. |
| UNCONDITIONAL BLOCK | The function returns BLOCKED on every invocation without evaluating inputs. No formula is present. All inputs are structurally absent in the current execution context. |

---

## 2. SIG-003 CLASSIFICATION — DUAL FAILURE

SIG-003 (Change Concentration, CKR-008) carries two concurrent failure modes.

### 2.1 Branch 1 — DATA ABSENCE

**Class:** DATA ABSENCE
**Trigger:** `v.get("VAR_AT_001") is UNDEFINED or v.get("VAR_AT_002") is UNDEFINED`
**Condition:** Both VAR_AT_001 (Automation Trigger Frequency) and VAR_AT_002 (Auto-Commit
Event Frequency) are time-series variables requiring accumulated data across successive
push-to-main intervals. In the static 40.4 telemetry context, neither is populated.

**Nature of absence:** Structural — not a missing measurement from a live source, but a
temporal class mismatch. Static invocation cannot produce time-series accumulations.

**Classified as:** DATA ABSENCE — structural temporal constraint, not a transient gap.

### 2.2 Branch 2 — STRUCTURAL IMPOSSIBILITY

**Class:** STRUCTURAL IMPOSSIBILITY
**Trigger:** else branch (VAR_AT_001 and VAR_AT_002 are both defined and non-UNDEFINED)
**Condition:** The else branch contains no computation formula. It returns:
```python
return {
    "signal_id": "SIG-003",
    "canonical_name": "Change Concentration",
    "ckr": "CKR-008",
    "state": "BLOCKED",
    "output": UNDEFINED,
}
```
No formula is present. Even if VAR_AT_001 and VAR_AT_002 were supplied with valid values,
SIG-003 would still return BLOCKED with UNDEFINED output.

**Classified as:** STRUCTURAL IMPOSSIBILITY — the function cannot produce a computable
output in any execution context with the current implementation.

### 2.3 Compound classification

SIG-003 carries both DATA ABSENCE (branch 1) and STRUCTURAL IMPOSSIBILITY (branch 2)
concurrently. These are not redundant — they address different resolution paths:

- DATA ABSENCE resolution: supply VAR_AT_001 and VAR_AT_002 with time-series data.
  This removes the branch 1 trigger. Control passes to branch 2.
- STRUCTURAL IMPOSSIBILITY resolution: implement a formula in branch 2 that maps
  VAR_AT_001 and VAR_AT_002 to a numeric output for Change Concentration.
  Both resolutions are required for SIG-003 to reach state=COMPLETE.

---

## 3. SIG-006 CLASSIFICATION — UNCONDITIONAL BLOCK

SIG-006 (Execution Stability, CKR-011) has a single failure mode.

**Class:** UNCONDITIONAL BLOCK
**Trigger:** None — the function has no conditional branch.
**Condition:** The function returns BLOCKED on every invocation:
```python
def compute_sig_006(v):
    return {
        "signal_id": "SIG-006",
        "state": "BLOCKED",
        "output": UNDEFINED,
        "blocking_inputs": ["VAR_AT_007", "VAR_AT_009", "VAR_DT_007", "VAR_DT_008"],
        "blocking_reason": "All inputs event-based; require live pipeline execution",
    }
```
All four inputs (VAR_AT_007, VAR_AT_009, VAR_DT_007, VAR_DT_008) are event-based and
require live pipeline execution. No formula is present for SIG-006.

**Distinction from DATA ABSENCE:** DATA ABSENCE implies a formula exists that would
execute if inputs were provided. SIG-006 has no formula — it is unconditionally blocked
regardless of input state. If live event data were injected, the function would still
return BLOCKED.

**Classified as:** UNCONDITIONAL BLOCK — structurally identical to STRUCTURAL IMPOSSIBILITY
in that no formula is present, but the blocking_reason is data-class mismatch, not
specification incompleteness. SIG-006 is an acknowledged execution-phase signal with no
formula defined for the static context.

---

## 4. DOWNSTREAM SIGNAL CLASSIFICATION

| Signal | State | Classification |
|---|---|---|
| SIG-007 | PARTIAL | DEPENDENCY PROPAGATION — SIG-006 BLOCKED causes sig_006_stability_component=UNDEFINED; no formula failure in SIG-007 itself |
| SIG-008 | PARTIAL | DEPENDENCY PROPAGATION — SIG-003 BLOCKED causes sig_003_change_concentration_component=UNDEFINED; no formula failure in SIG-008 itself |

SIG-007 and SIG-008 have correct formula implementations. Their PARTIAL state is fully
attributable to upstream blockage. They are not independently classified as failure modes.

---

## 5. CLASSIFICATION SUMMARY

| Signal | Primary Class | Secondary Class | Resolution Path |
|---|---|---|---|
| SIG-003 | DATA ABSENCE (branch 1) | STRUCTURAL IMPOSSIBILITY (branch 2) | (1) supply time-series inputs; (2) implement formula in else branch — both required |
| SIG-006 | UNCONDITIONAL BLOCK | — | define execution context in which event-based inputs are available OR implement static approximation with formula |
| SIG-007 | DEPENDENCY PROPAGATION | — | resolves when SIG-006 resolves |
| SIG-008 | DEPENDENCY PROPAGATION | — | resolves when SIG-003 resolves |

---

## 6. SCOPE VERDICT

The failure pattern is multi-signal and involves two independent root causes (SIG-003 and
SIG-006) with different failure classes. This is not a single-signal defect. Both root
causes require changes outside the activation model governed by CE.2.

CE.2 governance (DEC-001 through DEC-014) addresses 40.6 condition activation — the tier
assignment, conflict resolution, and downstream propagation of signal outputs. It does not
govern what happens when a signal cannot produce an output at 40.5.

The failure class inventory (DATA ABSENCE + STRUCTURAL IMPOSSIBILITY + UNCONDITIONAL BLOCK)
defines a distinct governance boundary. See `signal_boundary_assessment.md`.
