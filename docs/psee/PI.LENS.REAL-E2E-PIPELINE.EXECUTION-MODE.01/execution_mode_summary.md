# Execution Mode Summary
## PI.LENS.REAL-E2E-PIPELINE.EXECUTION-MODE.01

**Date:** 2026-05-03  
**Branch:** work/psee-runtime  
**Baseline commit:** f0fcb7a96987f0b909c8a51d3bfff3f1037087d9

---

## What Was Done

`scripts/pios/lens_e2e_assemble.sh` was extended from `--mode validate` to `--mode execute`.

Execute mode:
- Uses execution run `run_blueedge_e2e_execute_01` (isolated; canonical demo run not touched)
- Calls each declared stage producer in sequence
- Captures exit codes; applies cascade on failure
- Classifies blocked stages explicitly
- Does not patch any producer script

---

## Stage Execution Summary

| Stage | Producer | Status | Exit |
|-------|----------|--------|------|
| 01 SOURCE | source_intake.py --validate-only | BLOCKED_STAGE_FAILURE | 1 |
| 02 INTAKE | source_intake.py | NOT_ATTEMPTED | — |
| 03 STRUCTURE | structural_scanner.py | NOT_ATTEMPTED | — |
| 04 CEU | ceu_grounding.py | NOT_ATTEMPTED | — |
| 05 DOM | dom_layer_generator.py | NOT_ATTEMPTED | — |
| 06 PIPELINE | run_client_pipeline.py | BLOCKED_STAGE_06 | 1 |
| 07 SEMANTIC | (validate-only) | READY_LOCKED_REFERENCE | 0 |
| 08 REPORTS | lens_generate.sh | BLOCKED_STAGE_FAILURE | — |
| 09 RUNTIME | (validate-only) | VALIDATED_ONLY | 0 |

**Overall: PARTIAL**

---

## Root Causes of Blockage

### Stage 01 Block
`source_intake.py::step_boundary()` uses `archive_path.relative_to(REPO_ROOT)` for logging.  
`archive_path` is registered as an absolute external path outside the repository.  
`ValueError` on `Path.relative_to()` → exit 1.  
Producer NOT patched per stream rules.

### Stage 06 Block (independent of stage 01 cascade)
`run_client_pipeline.py::phase_02_intake()` checks `source_manifest["extracted_path"]`  
(UUID-keyed canonical intake path) which is absent from the repository.  
Path contract mismatch between legacy orchestrator (UUID paths) and generic pipeline (name-keyed run paths).  
Producer NOT patched per stream rules.

### Stage 08 Block (downstream of stage 06)
`lens_generate.sh` requires vault AND semantic co-located in same `--run`.  
Vault absent from execution run (stage 06 blocked).  
Semantic in canonical run only (READY_LOCKED_REFERENCE; copy not authorized).

---

## What Was NOT Done

- No producer scripts patched or modified
- No canonical client data modified
- No UI changes
- No renderer changes
- No semantic bundle changes
- No report template changes
- No 40.10 / 40.11 directories touched
- No historical stream forensics performed
- No stale artifacts copied

---

## Recommended Next Streams

1. **PI.LENS.REAL-E2E-PIPELINE.STAGE-CONTRACT-CLOSURE.01** — document each blocked stage's exact contract gap; classify resolution paths
2. **PI.LENS.SOURCE-INTAKE.EXTERNAL-PATH-FIX.01** (or similar) — fix `source_intake.py` to handle external absolute archive paths without calling `.relative_to(REPO_ROOT)`
3. **PI.BLUEEDGE.CLEAN-INTAKE.01 re-execution** — restore UUID canonical_repo path; enables stages 01-06 to proceed
