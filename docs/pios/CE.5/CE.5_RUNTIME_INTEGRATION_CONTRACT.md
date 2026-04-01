# CE.5 — Runtime Integration Contract

**Stream:** CE.5 — Enforcement Operationalization
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.2_CORE_EXECUTION_MODEL.md, CE.4_GUARDRAIL_RUNTIME.md, CE.3_INTERFACE_CONTRACTS.md

---

## 1. Purpose

This document defines how CE.5 enforcement components integrate with the Core execution chain (40.5–40.11). It specifies: what each layer must call before passing output, what enforcement state is required to proceed, and how enforcement results are recorded in 40.11.

---

## 2. Integration Points

### 2.1 Layer-by-Layer Integration

Each Core layer is responsible for triggering the CE.5 guard hook that gates its output before passing to the next layer.

| Layer | Outbound Hook | Enforcement Script Call | Required Result |
|---|---|---|---|
| 40.5 | GH-02 | run_guard_checks.py --hook GH-02 --artifact esi_manifest.json | PASS or PARTIAL |
| 40.6 | GH-03 | run_guard_checks.py --hook GH-03 --artifact condition_activation_record | PASS or PARTIAL |
| 40.7 | GH-04 | run_guard_checks.py --hook GH-04 --artifact diagnosis_structure | PASS or PARTIAL |
| 40.8 | GH-05 | run_guard_checks.py --hook GH-05 --artifact delivery_package | PASS or PARTIAL |
| 40.9 | GH-06 | run_guard_checks.py --hook GH-06 --artifact feedback_registration | PASS or PARTIAL |
| 40.10 | GH-07 | run_guard_checks.py --hook GH-07 --artifact orchestration_directives | PASS or PARTIAL |
| 40.11 | GH-08 | validate_interfaces.py --interface I2 | PASS or PARTIAL |

If the hook call returns F1 (exit code 1), the layer must not write its output to the next layer's input path. It must instead write the enforcement record and terminate.

### 2.2 Pre-Core Integration (GH-01)

The pre-Core entry gate fires before 40.5 executes:

```
run_guard_checks.py --hook GH-01
```

40.5 must not execute if this call returns F1. The calling orchestrator (40.4 intake or equivalent) is responsible for invoking GH-01 and checking the result.

### 2.3 Post-Core / Pre-Downstream Integration (GH-09, GH-10)

After 40.11 completes:
- GH-09 fires before 41.x begins. The 41.x orchestrator must call `run_guard_checks.py --hook GH-09` and verify PASS or PARTIAL before proceeding.
- GH-10 fires before 42.x begins. The 42.x entry must call `validate_interfaces.py --interface I3` and verify PASS or PARTIAL before rendering.

---

## 3. 40.11 Enforcement Integration

40.11 (loop closure) is the primary enforcement record recipient. At 40.11 execution:

1. Collect all F1/F2 enforcement records accumulated during the run.
2. Collect all F3 log entries accumulated during the run.
3. Write consolidated enforcement log: `docs/pios/40.11/enforcement_log_<run_id>.json`.
4. Write consolidated validation log: `docs/pios/40.11/validation_log_<run_id>.json`.
5. Evaluate loop closure:
   - If any F1 records exist → loop closure = FAIL.
   - If only F2 records exist → loop closure = PARTIAL.
   - If only F3 or no records → loop closure = COMPLETE.
6. Write loop closure assertion with closure_status and summary of enforcement findings.

40.11 is the authoritative enforcement record store for each run. Pre-Core F1 records (from GH-01 failures before 40.5) must be merged into the 40.11 log at the end of the run, even if the run was halted early.

---

## 4. Enforcement State Propagation

Guard hooks communicate state to the next layer through enforcement record files, not through in-process state. This ensures:
- Each layer can independently verify its input state.
- A layer re-run starts fresh from the enforcement record, not from memory.
- Records persist across process restarts.

**State propagation contract:**

| From | To | Mechanism |
|---|---|---|
| GH-0x enforcement output | Next layer's input check | enforcement_log read by next hook |
| F2 PARTIAL flags | Next layer's input artifact | Explicit PARTIAL field in artifact JSON/MD |
| F3 warnings | Next layer's context | Appended to validation_log |

---

## 5. Enforcement Artifact Paths

All CE.5 enforcement artifacts are written to a single run-scoped subdirectory under 40.11. Paths are not configurable.

| Artifact | Path |
|---|---|
| Enforcement log | docs/pios/40.11/enforcement_log_<run_id>.json |
| Validation log | docs/pios/40.11/validation_log_<run_id>.json |
| Validation record (per interface) | docs/pios/40.11/validation_record_<run_id>.json |
| Pre-Core enforcement (early F1) | docs/pios/CE.5/enforcement_pre_core_<run_id>.json |

Artifacts must not be deleted between runs. They are governance artifacts (L8).

---

## 6. Layer Contract with Enforcement System

Each Core layer (40.5–40.11) has the following obligations under CE.5:

| Obligation | Detail |
|---|---|
| Gate before output | Must invoke the outbound hook before writing output to the next layer's input path |
| Honor HARD STOP | Must not write output if outbound hook returns F1 |
| Propagate PARTIAL flags | Must carry all PARTIAL/UNDEFINED flags from input artifact to output artifact |
| Write run_id | All output artifacts must contain the same run_id as the initiating run |
| No prose fields | All output fields must be typed (float/null/enum/bool/count/string-id) |
| No reverse writes | Must not write to paths owned by 41.x, 42.x, or L6/L7 |

Violation of any obligation → detected by the next inbound hook as an F1 condition.

---

## 7. Integration with Existing Validation Scripts

The following 40.16 scripts are components of the CE.5 enforcement surface:

| Script | Role in CE.5 |
|---|---|
| validate_input_contract.py | Called at GH-01 (GH-01-C08) |
| validate_manifest.py | Called post-40.5 as part of I2 surface (DVT checks) |
| validate_identity_lock.py | Called at GH-08 (baseline integrity check) |
| validate_baseline.py | Optional — used for stability regression testing, not in runtime hot path |

These scripts are invoked as subprocesses by run_guard_checks.py and validate_interfaces.py. Their exit codes and output are consumed by the parent CE.5 scripts and translated into enforcement records.
