# STEP 2 — Scoped PiOS Validator Parameterization

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 2
**Date:** 2026-04-24
**Branch:** feature/second-client-kill-plan-01

---

## Scope Assessment Reference

Scope determined by READ-ONLY assessment of:
`docs/programs/second-client-kill-plan-01/final_execution_plan.md`

Assessment findings carried into this execution:
- In-scope validators: 40.2, 40.3, 40.4
- Deferred validators: 40.5, 40.6, 40.7, 40.8 (ROOT BLOCKER 4 mentions but STEP 8 invocation and explicit pass criteria do not require)
- Out-of-scope validators: 40.9, 40.10, 40.11 (not named in ROOT BLOCKER 4 or STEP 8)
- Authorized argument: `--expected-run-id` only
- NOT authorized: `--run-dir`, `--contract-id`, `--prior-run-id`, EXECUTION_WORKSPACE path changes

---

## Files Modified

1. `scripts/pios/40.2/validate_evidence_inventory.py`
2. `scripts/pios/40.3/validate_reconstruction.py`
3. `scripts/pios/40.4/validate_structure_immutability.py`
4. `docs/programs/second-client-kill-plan-01/decisions/step2_validator_parameterization.md` (this file)

---

## Exact Change Applied

**All three validators received the same minimal change pattern:**

1. Added `import argparse` to imports.
2. Added argparse block at the top of `main()` parsing `--expected-run-id` with the BlueEdge default:
   - 40.2 default: `run_02_blueedge`
   - 40.3 default: `run_02_blueedge`
   - 40.4 default: `run_02_blueedge` (controls the upstream 40.3 run ID check)
3. Updated the run-ID comparison target global before checks execute:
   - 40.2: `global REQUIRED_BOUNDARY_TERMS` — first element replaced with `args.expected_run_id`
   - 40.3: `global REQUIRED_RUN_TERMS` — first element replaced with `args.expected_run_id`
   - 40.4: `global EXPECTED_40_3_RUN_ID` — replaced with `args.expected_run_id`

**What was NOT changed:**
- Contract ID strings (`PIOS-40.2-RUN02-CONTRACT-v2`, etc.) — not parameterized
- `EXECUTION_WORKSPACE`, `OUTPUT_DIR`, `STRUCTURE_DIR`, `TELEMETRY_DIR` path construction — untouched
- `REQUIRED_PROVENANCE_TERMS` (BlueEdge tar filenames) — untouched (STOP condition)
- `EXPECTED_CEU_IDS` (BlueEdge-specific CEU IDs) — untouched (STOP condition)
- `REQUIRED_ENTITY_TIERS`, `bm_count >= 65`, `LOCKED_*` constants — untouched (STOP conditions)
- `"run_01_blueedge"` in `check_immutability_log_content()` (40.4 own-run identity check) — untouched (STOP condition)
- All check function logic, artifact lists, and validation semantics — unchanged

---

## Confirmation: No 40.5+ Files Modified

Confirmed by `git diff --name-only` output:
```
scripts/pios/40.2/validate_evidence_inventory.py
scripts/pios/40.3/validate_reconstruction.py
scripts/pios/40.4/validate_structure_immutability.py
```
No 40.5, 40.6, 40.7, 40.8, 40.9, 40.10, or 40.11 files appear in the diff.

---

## Confirmation: No Runtime Execution

No validators were executed. No PiOS, PSEE, IG, GAUGE, LENS, report, or test commands were run.

---

## Confirmation: STEP 3 Not Executed

STEP 3 (`lens_report_generator.py` parameterization) was not executed. This record covers STEP 2 only.

---

## Confirmation: Validation Semantics Unchanged

The change is purely a comparison-target substitution. Each validator continues to:
- check all the same artifacts
- enforce all the same structural requirements
- apply all the same forbidden pattern rules
- require all the same IDs (CEU, entity, BM, interface, dependency, PEG nodes/paths)

Default behavior with no CLI argument is identical to the pre-change behavior for BlueEdge.

---

## Default Behavior Preservation

| Validator | Hardcoded before | Default after | Behavior change with no args |
|-----------|-----------------|---------------|------------------------------|
| 40.2 | `REQUIRED_BOUNDARY_TERMS[0] = "run_02_blueedge"` | `default="run_02_blueedge"` | None |
| 40.3 | `REQUIRED_RUN_TERMS[0] = "run_02_blueedge"` | `default="run_02_blueedge"` | None |
| 40.4 | `EXPECTED_40_3_RUN_ID = "run_02_blueedge"` | `default="run_02_blueedge"` | None |

---

## STEP 2 Status

**COMPLETE**
