# EX.2 — Trace Chain Definition

**Stream:** EX.2 — Debug / Trace Interface
**Artifact type:** TRACE CHAIN DEFINITION
**Date:** 2026-04-04
**Authority:** EX.2

---

## 1. PURPOSE

This document defines the signal→condition→diagnosis trace chain structure
used by EX.2. It specifies the linking mechanism, traversal algorithm, and
guarantees about what is and is not computed.

---

## 2. CHAIN STRUCTURE

A trace chain is a triple spanning three CE layers:

```
SIG-NNN  ──(CE.4)──►  COND-NNN  ──(CE.5/CE.2)──►  DIAG-NNN
(engine signal)        (condition)                  (diagnosis)
```

### Link 1: Signal → Condition

**Mechanism:** `conditions[COND-NNN].governing_signal == SIG-NNN`
**Direction:** Each condition names its governing signal.
**Index:** Built as `sig_to_cond = {cond["governing_signal"]: cond_id for cond_id, cond in conditions.items()}`
**Cardinality:** One signal → at most one condition (per run archive)
**If absent:** `condition_id = null` — signal has no condition in this run's output

### Link 2: Condition → Diagnosis

**Mechanism:** `diagnoses[DIAG-NNN].originating_condition == COND-NNN`
**Direction:** Each diagnosis names its originating condition.
**Index:** Built as `cond_to_diag = {diag["originating_condition"]: diag_id for diag_id, diag in diagnoses.items()}`
**Cardinality:** One condition → at most one diagnosis (per run archive)
**If absent:** `diagnosis_id = null` — condition has no diagnosis in this run's output

---

## 3. TRAVERSAL ALGORITHM

```
for each signal SIG-NNN (sorted by signal_id):
    1. Look up condition_id via sig_to_cond[SIG-NNN]
    2. If found: look up condition record from conditions[condition_id]
    3. Look up diagnosis_id via cond_to_diag[condition_id] (if condition found)
    4. If found: look up diagnosis record from diagnoses[diagnosis_id]
    5. Look up CE.5 consumption record via ce5_consumption[SIG-NNN]
    6. Emit chain dict with all fields from signal + condition + diagnosis + consumption
```

**No recomputation is performed at any step.** All values are read from run archives.

---

## 4. CHAIN STATES

A chain entry carries one of the following state patterns:

| CE.4 state | CE.2 condition tier | CE.2 diagnosis state | Pattern |
|---|---|---|---|
| COMPLETE | STABLE | INACTIVE | Healthy chain — signal resolved, condition stable, diagnosis not triggered |
| PARTIAL | STABLE | INACTIVE | Partial chain — signal partial but condition still stable |
| PARTIAL | STABLE | INACTIVE | Same as above (depends on which components are missing) |
| BLOCKED | BLOCKED | BLOCKED | Full blockage — signal blocked propagates to condition and diagnosis |
| BLOCKED | — | — | Signal blocked with no condition link (should not occur in certified engine) |
| COMPLETE | BLOCKED | BLOCKED | Condition independently blocked (CE.2 data issue independent of signal) |

---

## 5. COVERAGE IN STATIC BASELINE

All 8 engine signals have a chain entry. All 8 chains have a condition link.

| Signal | Condition | Diagnosis | CE.4 | CE.2 cond | CE.2 diag |
|---|---|---|---|---|---|
| SIG-001 | COND-003 | DIAG-003 | PARTIAL | STABLE | INACTIVE |
| SIG-002 | COND-001 | DIAG-001 | COMPLETE | STABLE | INACTIVE |
| SIG-003 | COND-004 | DIAG-004 | BLOCKED | BLOCKED | BLOCKED |
| SIG-004 | COND-002 | DIAG-002 | COMPLETE | STABLE | INACTIVE |
| SIG-005 | COND-005 | DIAG-005 | PARTIAL | BLOCKED | BLOCKED |
| SIG-006 | COND-006 | DIAG-006 | BLOCKED | BLOCKED | BLOCKED |
| SIG-007 | COND-007 | DIAG-007 | PARTIAL | STABLE | INACTIVE |
| SIG-008 | COND-008 | DIAG-008 | PARTIAL | STABLE | INACTIVE |

*Derived from EX.2 verification run 2026-04-04 (run_id: EX3_live_20260403_211622).*

---

## 6. NO-RECOMPUTATION GUARANTEE

The trace chain builder (`build_trace_chains()` in `scripts/pios/EX.2/pios_debug_adapter.py`):

- Reads `conditions` and `diagnoses` dicts from run archive — read-only
- Builds in-memory index dicts (`sig_to_cond`, `cond_to_diag`) — no writes
- Reads `ce5_consumption` dict for CE.5 consumption state — read-only
- Assembles chain dicts by field selection — no arithmetic, no inference

**No field in any chain entry is derived from any formula. Every value is a direct
read from a run archive field.**
