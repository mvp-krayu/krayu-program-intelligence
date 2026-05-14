# STEP 8B — Post-Run Validation Scope Reconciliation

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 8B
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## SA-1 — Cross-Client Mutation Restored

**Finding:** `docs/pios/PSEE.BLUEEDGE.BINDING.CONVERGENCE.01/validation_log.json` (a tracked
governance artifact) was overwritten by the OSS FastAPI PSEE pipeline run (Stage 04 or 05).
The pipeline wrote to this shared path, replacing the prior client's run identity, binding
artifact hashes, signal list, and timestamp with OSS FastAPI values.

Specific mutations observed:
- `client_uuid`: `1de0d815-0721-58e9-bc8d-ca83e70fa903` → `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
- `run_id`: `run_08_full_test_07` → `run_01_oss_fastapi`
- All three binding artifact SHA-256 hashes replaced
- Signal list expanded from `['SIG-006']` to 6-signal list
- `emission_timestamp` overwritten

**Action taken:** `git restore docs/pios/PSEE.BLUEEDGE.BINDING.CONVERGENCE.01/validation_log.json`

**Result:** File restored to HEAD state. Worktree clean (only untracked
`clients/e65d2f0a-.../psee/` remains).

**Note for future pipeline work:** `build_binding_package.py` or a downstream Stage 04/05
script writes to `docs/pios/PSEE.BLUEEDGE.BINDING.CONVERGENCE.01/validation_log.json` as
a side effect. This path must be made client-scoped or the write must be suppressed for
non-BlueEdge clients to prevent cross-client governance contamination.

---

## SA-2 — "Five Canonical Package Artifacts" Entry Condition Reframed

**Finding:** The original STEP 8 entry condition required five artifacts in a `package/`
directory (`gauge_state.json`, `coverage_state.json`, `reconstruction_state.json`,
`canonical_topology.json`, `signal_registry.json`). The OSS FastAPI PSEE run does not
produce a `package/` directory — its canonical output is in `binding/` with four artifacts.

The equivalent validated outputs for `run_01_oss_fastapi` are:
- `binding/binding_envelope.json` — `is_canonical_consumption_artifact: true`
- `binding/package_manifest.json` — 15/15 checks PASS
- `binding/validation_log.json`
- `validation/run_validation.json` — all stage statuses PASS; all parity_indicators true
- `run_manifest.json` — `final_status: PASS`

**Action taken:** STEP 8 entry conditions in `final_execution_plan.md` updated to reference
actual PSEE output artifact paths. The stale "five artifacts in package/" language removed.

---

## SA-3 — Second-client PiOS 40.x Validation Reframed as TO BE IMPLEMENTED

**Finding:** The original STEP 8 plan assumed PiOS 40.x methodology work
(`scripts/pios/40.2/`, `40.3/`, `40.4/` validators with `--expected-run-id run_01_oss_fastapi`)
would validate second-client compliance against the krayu-program-intelligence workspace.

Reality: The validators read from `Path.home() / "Projects/krayu-program-intelligence/docs/pios/40.x/"`.
No PiOS 40.x stream work has been executed for the second client in that workspace. The PSEE
pipeline does not execute PiOS 40.x streams — it consumes BlueEdge's proven PiOS artifacts
as source input via `extract_ceu_lineage.py`. The `--expected-run-id` parameterization
(STEP 2) is correct and ready, but the target artifacts do not yet exist.

**Action taken:** STEP 8 restructured into three lanes:
- Lane A: Second-client PSEE run output validation (executable now)
- Lane B: BlueEdge regression validation (executable now)
- Lane C: Second-client PiOS 40.x validation — **TO BE IMPLEMENTED** (deferred with reason)

Lane C will not be claimed as complete until PiOS 40.x methodology work is executed
for the second client in krayu-program-intelligence.

---

## Files Modified

1. `docs/pios/PSEE.BLUEEDGE.BINDING.CONVERGENCE.01/validation_log.json` — restored to HEAD
2. `docs/programs/second-client-kill-plan-01/final_execution_plan.md` — STEP 8 section replaced
3. `docs/programs/second-client-kill-plan-01/decisions/step8b_scope_reconciliation.md` — created (this file)

---

## Confirmation: No Validators Run

No PiOS validators were executed. No pipeline commands were run.

---

## Confirmation: No Pipeline Rerun

`run_end_to_end.py` was NOT executed. STEP 7J remains the last pipeline execution record.

---

## Confirmation: Runtime Artifacts Not Committed

Untracked files under `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/` were NOT staged
or committed.

---

## Confirmation: STEP 8 Execution Not Performed

Lane A, Lane B, and Lane C validations have NOT been executed. This record covers scope
reconciliation only. STEP 8 execution proceeds under a separate contract.

---

## STEP 8B Status

**COMPLETE**
