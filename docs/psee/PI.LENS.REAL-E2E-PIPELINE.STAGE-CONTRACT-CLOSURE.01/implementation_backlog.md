# Implementation Backlog
## PI.LENS.REAL-E2E-PIPELINE.STAGE-CONTRACT-CLOSURE.01

**Date:** 2026-05-03

This backlog defines the exact work required to close each blocker. Items are ordered by dependency.

---

## BACKLOG-01 — Fix source_intake.py external archive path

**Priority:** 1 (gates all of stages 01–05)  
**Blocker:** BLOCKER-01  
**Owning stream:** PI.LENS.SOURCE-INTAKE.CONTRACT-CLOSURE.01  
**Owning script:** `scripts/pios/source_intake.py`

**Work required:**

1. In `step_boundary()`, replace:
   ```python
   print(f"  Computing SHA256 of {archive_path.relative_to(REPO_ROOT)} ...")
   ```
   With safe display that does not assume archive is within REPO_ROOT (e.g., display the full path or use a try/except for display only).

2. Verify that no other location in `source_intake.py` calls `.relative_to(REPO_ROOT)` on `archive_path`.

3. Re-run `source_intake.py --validate-only` for blueedge/source_01 → must exit 0.

4. Verify that `step_inventory()` proceeds and correctly reports `inventory_result: FAIL` when `extracted_path` is absent (this is an expected state; the script should not exit 1 on inventory FAIL unless configured to fail closed on missing inventory — that is a separate contract decision outside this blocker).

**Scope constraint:**  
Single-function change. No output schema changes. No other logic changes.

---

## BACKLOG-02 — Align run_client_pipeline.py phase 2 and 3 to name-keyed paths

**Priority:** 2 (gates stage 06 independently)  
**Blocker:** BLOCKER-02  
**Owning stream:** PI.LENS.RUNTIME-BUNDLE-MAPPING.CONTRACT.01  
**Owning script:** `scripts/pios/run_client_pipeline.py`

**Work required:**

1. In `phase_02_intake()`, add primary check for `<run_dir>/intake/` path (same pattern as `phase_04_ceu_grounding()` which already uses hybrid logic). Retain UUID `extracted_path` as fallback.

2. In `phase_03_40x_structural()`, add primary check for `<run_dir>/structure/40.2/`, `40.3/`, `40.4/`. Retain UUID `structure_path` as fallback.

3. Verify that `run_client_pipeline.py` accepts `run_dir` correctly (it is derived from `--run-id` and `--client`).

4. Re-run `run_client_pipeline.py --client blueedge --source source_01 --run-id run_blueedge_e2e_execute_01` after BACKLOG-01 completes → phases 2 and 3 must pass.

**Scope constraint:**  
Only `phase_02_intake()` and `phase_03_40x_structural()`. No changes to phases 1, 4–9. No output schema changes.

---

## BACKLOG-03 — Extend lens_generate.sh with --vault-run and --semantic-run

**Priority:** 3 (gates stage 08)  
**Blocker:** BLOCKER-03  
**Owning stream:** PI.LENS.RUNTIME-BUNDLE-MAPPING.CONTRACT.01  
**Owning script:** `scripts/pios/lens_generate.sh`

**Work required:**

1. Add optional `--vault-run` parameter. When provided, `VAULT_DIR = clients/<client>/psee/runs/<vault_run>/vault`. Default: same as `--run`.

2. Add optional `--semantic-run` parameter. When provided, `SEMANTIC_DIR = clients/<client>/psee/runs/<semantic_run>/semantic`. Default: same as `--run`.

3. Update `lens_e2e_assemble.sh --mode execute` stage 08 to pass:
   ```bash
   bash scripts/pios/lens_generate.sh \
     --client blueedge \
     --run run_blueedge_e2e_execute_01 \
     --vault-run run_blueedge_productized_01 \
     --semantic-run run_blueedge_productized_01_fixed
   ```

4. Verify reports generate for BlueEdge with the split run mapping.

**Scope constraint:**  
`lens_generate.sh` parameter parsing and variable derivation only. `lens_report_generator.py` must NOT be modified. Report templates must NOT change. Output file names must NOT change.

---

## BACKLOG-04 — Declare LOCKED_REFERENCE_INPUT for stage 07 (BlueEdge)

**Priority:** 4 (gates generalization; BlueEdge demo already closed)  
**Blocker:** BLOCKER-04  
**Owning stream:** PI.LENS.SEMANTIC-BUNDLE.PRODUCER.01  
**Owning script:** `scripts/pios/lens_e2e_assemble.sh` (wrapper classification only)

**Work required:**

1. In `lens_e2e_assemble.sh --mode execute`, update stage 07 logic to:
   - Check if `semantic_bundle_manifest.json` is present → classify `LOCKED_REFERENCE_INPUT`
   - If absent → classify `BLOCKED_STAGE_FAILURE`
   - Add attestation note: "BlueEdge semantic bundle is a governed locked reference; no generic producer; authorized as LOCKED_REFERENCE_INPUT per PI.LENS.REAL-E2E-PIPELINE.STAGE-CONTRACT-CLOSURE.01"

2. Create a formal contract for `semantic_bundle_generator.py` for future clients. This is a separate stream (PI.LENS.SEMANTIC-BUNDLE.PRODUCER.01) and is NOT part of BACKLOG-04 scope.

**Scope constraint:**  
Wrapper classification only. No semantic bundle content changes. No new producer implementation (separate stream).

---

## BACKLOG-05 — No independent work required

**Priority:** 5 (resolves automatically with BACKLOG-03)  
**Blocker:** BLOCKER-05  
**Resolution:** Implementing BACKLOG-03 (`--vault-run` / `--semantic-run`) resolves stage 08 co-location issue. No additional backlog item needed.

---

## Completion Criteria for Real E2E Pipeline

The pipeline is considered `real_e2e_pipeline_ready` when:

1. `BACKLOG-01` complete: `source_intake.py --validate-only` exits 0 for blueedge/source_01
2. `BACKLOG-02` complete: `run_client_pipeline.py` phases 2 and 3 pass for name-keyed run path
3. `BACKLOG-03` complete: `lens_generate.sh` accepts `--vault-run` and `--semantic-run`
4. `BACKLOG-04` complete: stage 07 formally declares `LOCKED_REFERENCE_INPUT` in wrapper
5. `BACKLOG-05` resolved: implicit with BACKLOG-03

All stages must reach `EXECUTED`, `VALIDATED_ONLY`, `READY_LOCKED_REFERENCE`, or `LOCKED_REFERENCE_INPUT` — no `BLOCKED_*` or `NOT_ATTEMPTED`.
