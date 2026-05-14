# Blocked Stage Log
## PI.LENS.REAL-E2E-PIPELINE.EXECUTION-MODE.01

**Date:** 2026-05-03

---

## STAGE 01 — BLOCKED_STAGE_FAILURE

**Producer:** `scripts/pios/source_intake.py`  
**Invocation:** `python3 scripts/pios/source_intake.py --client blueedge --source source_01 --run-id run_blueedge_e2e_execute_01 --validate-only`  
**Exit code:** 1  

**Root cause:**  
`source_intake.py::step_boundary()` calls `archive_path.relative_to(REPO_ROOT)` for a print statement.  
`archive_path` is registered in `source_manifest.json` as an absolute external path:  
`/Users/khorrix/Projects/blueedge-clean-run/source-raw/raw/blueedge-platform-v3_23_0-COMPLETE.tar`

This path is outside `REPO_ROOT` (`/Users/khorrix/Projects/k-pi-core`).  
Python `Path.relative_to()` raises `ValueError` when the target is not a subpath of the base.

```
ValueError: '/Users/khorrix/Projects/blueedge-clean-run/...' is not in the subpath of 
'/Users/khorrix/Projects/k-pi-core' OR one path is relative and the other is absolute.
```

**Why not patched:**  
Stream contract `PI.LENS.REAL-E2E-PIPELINE.EXECUTION-MODE.01` prohibits patching any producer script other than `lens_e2e_assemble.sh`.

**Cascade:**  
Stages 02, 03, 04, 05 → `NOT_ATTEMPTED`

**Resolution path:**  
Requires `PI.LENS.REAL-E2E-PIPELINE.STAGE-CONTRACT-CLOSURE.01` or a dedicated source_intake.py fix stream to handle external archive paths.

---

## STAGE 06 — BLOCKED_STAGE_06

**Producer:** `scripts/pios/run_client_pipeline.py`  
**Invocation:** `python3 scripts/pios/run_client_pipeline.py --client blueedge --source source_01 --run-id run_blueedge_e2e_execute_01`  
**Exit code:** 1  

**Phase 1 result:** PASS — archive present; SHA256 `672a841...` verified  
**Phase 2 result:** FAIL  

**Root cause:**  
`run_client_pipeline.py::phase_02_intake()` reads `source_manifest["extracted_path"]`:  
`clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo`

This UUID-keyed canonical intake path is absent from the repository.  
`run_client_pipeline.py` does not recognize the generic `source_intake.py` output path (`clients/blueedge/psee/runs/<run_id>/intake/`).  
Path contract mismatch: orchestrator expects legacy UUID path; generic pipeline writes to name-keyed run path.

**Cascade:**  
Stage 08 (reports) cannot proceed — vault absent from execution run (stage 06 blocked).

**Resolution path:**  
Requires either:  
1. `PI.BLUEEDGE.CLEAN-INTAKE.01` re-execution to restore canonical_repo at UUID path, OR  
2. A dedicated path contract alignment stream to update `run_client_pipeline.py` to recognize generic run paths.  
Neither is in scope for this stream.

---

## STAGE 08 — BLOCKED_STAGE_FAILURE

**Producer:** `scripts/pios/lens_generate.sh`  
**Not executed** — pre-condition check prevented execution.

**Root cause:**  
`lens_generate.sh` requires both `vault/` and `semantic/` to exist in the same `--run` directory.  
- Execution run (`run_blueedge_e2e_execute_01`): vault absent (stage 06 blocked); semantic absent (locked reference in canonical run only)  
- Canonical run (`run_blueedge_productized_01_fixed`): vault absent (vault is in vault_run `run_blueedge_productized_01`)

**Why not run against canonical run:**  
Running `lens_generate.sh --run run_blueedge_productized_01_fixed` would fail — vault is in `run_blueedge_productized_01`, not `run_blueedge_productized_01_fixed`. Script checks `$BASE_DIR/vault` → absent → exits 1.

**Why semantic not copied to execution run:**  
Stream contract prohibits artifact copying unless explicitly classified `LOCKED_REFERENCE_INPUT`. Semantic bundle is `READY_LOCKED_REFERENCE` with explicit "Do not copy" rule.

**Resolution path:**  
Vault must be produced in same run where semantic exists, OR `lens_generate.sh` must be extended to accept `--vault-dir` and `--semantic-dir` separately. Neither is in scope for this stream.
