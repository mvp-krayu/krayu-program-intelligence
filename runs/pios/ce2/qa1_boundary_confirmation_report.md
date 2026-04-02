# CE.2 — QA.1 Boundary Confirmation Report

**Generated:** 2026-04-02
**Branch:** feature/ce2-state-activation-boundary
**Source:** Inspection of preserved CE.2-R01-MIX run artifacts (no rerun)
**Purpose:** Confirm the QA.1 doctrinal finding from preserved artifacts

---

## METHOD

All confirmation performed by inspection of existing run artifacts. No engine was rerun.
Artifacts inspected are preserved and immutable under the CE.2-R01-MIX branch contract.

---

## 1. 40.5 SIGNAL SHIFT — CONFIRMED

**Source:** `runs/pios/40.5/CE.2-R01-MIX/signal_output.json` vs `runs/pios/40.5/run_03_executable/signal_output.json`

| Signal | Field | Baseline | CE.2-R01-MIX | Changed |
|---|---|---|---|---|
| SIG-002 | `dependency_load_ratio` | 0.682 | 0.773 | YES |
| SIG-002 | `dependency_edge_count` | 15 | 17 | YES |
| SIG-005 | `throughput_rate` | 1.125 | 0.643 | YES |

Telemetry perturbation (VAR_ST_013 3→5, VAR_AT_005 8→14) propagated correctly into
signal output values at layer 40.5.

**CONFIRMED: 40.5 changed under CE.2-R01-MIX**

---

## 2. 40.6 VALUE CHANGE / STATE INVARIANCE — CONFIRMED

**Source:** `runs/pios/40.6/CE.2-R01-MIX/condition_output.json` vs `runs/pios/40.6/run_02_executable/condition_output.json`

**Value-reactive fields (changed):**

| Condition | Field | Baseline | CE.2-R01-MIX |
|---|---|---|---|
| COND-001 | `components.dependency_load_ratio` | 0.682 | 0.773 |
| COND-004 | `components.throughput_rate` | 1.125 | 0.643 |

**State-invariant fields (unchanged):**

| Diagnosis | Field | Baseline | CE.2-R01-MIX |
|---|---|---|---|
| DIAG-001 | `diagnosis_activation_state` | "active" | "active" |
| DIAG-002 | `diagnosis_activation_state` | "active" | "active" |
| DIAG-003 | `diagnosis_activation_state` | "partial" | "partial" |
| DIAG-004 | `diagnosis_activation_state` | "partial" | "partial" |
| DIAG-005 | `diagnosis_activation_state` | "blocked" | "blocked" |
| DIAG-006 | `diagnosis_activation_state` | "blocked" | "blocked" |
| DIAG-007 | `diagnosis_activation_state` | "partial" | "partial" |
| DIAG-008 | `diagnosis_activation_state` | "partial" | "partial" |

Component values propagated from 40.5. Diagnosis activation states did not change.

**CONFIRMED: 40.6 values changed but diagnosis/state labels remained invariant**

---

## 3. 40.9 NO_CHANGE ONLY — CONFIRMED

**Source:** `runs/pios/40.9/CE.2-R01-MIX/feedback_signal_registry.json`

```
classification_summary:
  NO_CHANGE:    8
  STATE_CHANGE: 0
  ADDED:        0
  REMOVED:      0
```

All 8 intelligence entities (INTEL-001 through INTEL-008) classified as NO_CHANGE.
The `synthesis_state` field compared by `feedback_registry.py` did not change between
baseline and CE.2 delivery packets, because diagnosis activation states (which determine
synthesis_state) are hardcoded in the v0.1 engine.

**CONFIRMED: 40.9 emitted NO_CHANGE only**

---

## 4. 40.10 NO_ACTION ONLY — CONFIRMED

**Source:** `runs/pios/40.10/CE.2-R01-MIX/control_directive_registry.json`

```
directive_summary:
  NO_ACTION:        8
  REVIEW_REQUIRED:  0
  REGISTER_ENTITY:  0
  DEREGISTER_ENTITY: 0
```

All 8 directives are NO_ACTION, mechanically translated from NO_CHANGE inputs by
`control_surface.py`'s strict classification routing.

**CONFIRMED: 40.10 emitted NO_ACTION only**

---

## 5. SCORECARD STATUS — CONFIRMED

**Source:** `runs/pios/ce2/CE.2-R01-MIX/scorecard_result.txt`

```
SYSTEM RESULT:    FAIL
SCORECARD STATUS: VALID
```

The v0.1-aligned scorecard (`scripts/ce2_scorecard_v01_aligned.sh`) read actual engine
output files with correct field paths. No schema mismatches.

**CONFIRMED: scorecard status is VALID**

---

## 6. SYSTEM RESULT — CONFIRMED

**Source:** `runs/pios/ce2/CE.2-R01-MIX/scorecard_result.txt`

SYSTEM RESULT is FAIL. CE.2-R01-MIX assertions 5 (40.9 STATE_CHANGE) and 6 (40.10 REVIEW_REQUIRED)
cannot be satisfied because synthesis_state is invariant under v0.1 telemetry-only perturbation.

**CONFIRMED: system result is FAIL**

---

## 7. CLOSURE INTERPRETATION — CONFIRMED

**Source:** `runs/pios/ce2/CE.2-R01-MIX/closure_note.md`

The closure note states:

> "v0.1 is doing the job it was built to do, and CE.2 revealed that reactive state activation
> belongs to a next version, not to the invariance baseline."

The CE2-FINDING-001 in `baseline_vs_ce2_delta_report.json` states:

> "root_cause: hardcoded_state_propagation_in_v0.1_engine"

This doctrinal conclusion is consistent with the code-level findings confirmed above.

**CONFIRMED: closure interpretation matches doctrinal conclusion**

---

## QA.1 CONFIRMATION SUMMARY

| Confirmation | Result |
|---|---|
| 40.5 signal shift | CONFIRMED |
| 40.6 value change / state invariance | CONFIRMED |
| 40.9 NO_CHANGE only | CONFIRMED |
| 40.10 NO_ACTION only | CONFIRMED |
| Scorecard status VALID | CONFIRMED |
| System result FAIL | CONFIRMED |
| Closure interpretation correct | CONFIRMED |

**OVERALL: QA.1 BOUNDARY FINDING FULLY CONFIRMED FROM PRESERVED ARTIFACTS**

No rerun was required or performed. All findings are grounded in existing committed artifacts.
