# Stage Contract Closure Matrix
## PI.LENS.REAL-E2E-PIPELINE.STAGE-CONTRACT-CLOSURE.01

**Date:** 2026-05-03  
**Source:** PI.LENS.REAL-E2E-PIPELINE.EXECUTION-MODE.01 blocked stage log  
**Branch:** work/psee-runtime

---

## Purpose

This matrix converts the execution-mode blocked stage results into a precise set of contract decisions required before `lens_e2e_assemble.sh --mode execute` can become a real repeatable E2E pipeline.

No code is changed here. No pipeline is executed. No forensics performed.

---

## Stage Status Summary (from execution-mode run)

| Stage | Name | Execution Status | Blocker |
|-------|------|-----------------|---------|
| 01 | Source Registration | BLOCKED_STAGE_FAILURE | BLOCKER-01 |
| 02 | Intake | NOT_ATTEMPTED | BLOCKER-01 cascade |
| 03 | Structure (40.x) | NOT_ATTEMPTED | BLOCKER-01 cascade |
| 04 | CEU Grounding | NOT_ATTEMPTED | BLOCKER-01 cascade |
| 05 | DOM Layer | NOT_ATTEMPTED | BLOCKER-01 cascade |
| 06 | Pipeline / Vault / 41.x | BLOCKED_STAGE_06 | BLOCKER-02 |
| 07 | Semantic Bundle | READY_LOCKED_REFERENCE | BLOCKER-04 (generalization only) |
| 08 | Report Render | BLOCKED_STAGE_FAILURE | BLOCKER-03 (downstream of 01+02) |
| 09 | Runtime Package | VALIDATED_ONLY | — CLOSED — |

---

## BLOCKER-01 — Source / Intake Contract

**Stage affected:** 01 (cascades to 02–05)  
**Owning script:** `scripts/pios/source_intake.py`

**Failure observed:**  
`step_boundary()` calls `archive_path.relative_to(REPO_ROOT)` in a logging print statement.  
`archive_path` in `source_manifest.json` is an absolute external path:  
`/Users/khorrix/Projects/blueedge-clean-run/...`  
This path is outside REPO_ROOT. `Path.relative_to()` raises `ValueError` → exit 1.

**Contract decision required:**

| Option | Description |
|--------|-------------|
| A | Require archive to be within REPO_ROOT at all times |
| B | Support external `archive_path` safely; do not assume `.relative_to(REPO_ROOT)` |

**Recommended decision:** Option B  
Source archives are legitimately external (large binary tarballs; not repo artifacts). The fix scope is narrow: guard or remove the single `.relative_to()` call in the print statement. Business logic is unaffected.

**Allowed fix boundary:**  
Modify only the path rendering call in `source_intake.py::step_boundary()`. Use `archive_path` directly for display when it is external. No change to output schema. No change to SHA256 logic. No change to inventory steps.

**Forbidden workaround:**  
- Moving or copying the archive into the repo  
- Symlinking an in-repo path to the external archive  
- Changing `source_manifest.json["archive_path"]` to a relative path  
- Wrapping the call in `try/except` without fixing the design intent

**Next stream:** PI.LENS.SOURCE-INTAKE.CONTRACT-CLOSURE.01

---

## BLOCKER-02 — Run Path Identity Contract

**Stage affected:** 06 (independently of BLOCKER-01 cascade)  
**Owning script:** `scripts/pios/run_client_pipeline.py`

**Failure observed:**  
`phase_02_intake()` checks `source_manifest["extracted_path"]`:  
`clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo` (UUID-keyed).  
`source_intake.py` writes to `clients/<client_id>/psee/runs/<run_id>/intake/` (name-keyed).  
These paths do not match. The orchestrator does not recognize generic pipeline output.

`phase_03_40x_structural()` uses `source_manifest["structure_path"]` (also UUID-keyed).  
`structural_scanner.py` writes to `clients/<client_id>/psee/runs/<run_id>/structure/40.x/`.  
Same mismatch.

`phase_04_ceu_grounding()` already has hybrid logic (run-dir path checked first, UUID fallback). Phase 4 is RESOLVED; phases 2 and 3 are NOT.

**Contract decision required:**

| Option | Description |
|--------|-------------|
| A | Canonicalize all stages by client slug (name-keyed paths everywhere) |
| B | Canonicalize all stages by UUID |
| C | Introduce explicit runtime_bundle_mapping: a manifest that declares resolved paths per stage |

**Recommended decision:** Option A  
The system has already committed to name-keyed client paths (`clients/blueedge/`) for all LENS runtime surfaces. UUID paths are legacy from the original BlueEdge integration run. The generic producers (`source_intake.py`, `structural_scanner.py`) all write to name-keyed paths. Aligning `run_client_pipeline.py` phases 2 and 3 to read from the run-dir based path — with UUID as fallback — is the correct direction. Phase 4 already demonstrates this pattern.

**Allowed fix boundary:**  
Update `run_client_pipeline.py::phase_02_intake()` to check `<run_dir>/intake/` as primary, `source_manifest["extracted_path"]` as fallback.  
Update `run_client_pipeline.py::phase_03_40x_structural()` similarly: check `<run_dir>/structure/40.x/` as primary, `source_manifest["structure_path"]` as fallback.  
No change to phases 1, 4, 5, 6, 7, 8, 9. No change to output schema. No change to any other producer.

**Forbidden workaround:**  
- Restoring UUID canonical_repo by re-running PI.BLUEEDGE.CLEAN-INTAKE.01 (perpetuates broken design)  
- Symlinking UUID path to name-keyed run path  
- Changing `source_manifest.json["extracted_path"]` or `["structure_path"]` to name-keyed values  
- Bypassing phase 2 or 3 verification in the orchestrator

**Next stream:** PI.LENS.RUNTIME-BUNDLE-MAPPING.CONTRACT.01

---

## BLOCKER-03 — Vault / Semantic / Report Co-location Contract

**Stages affected:** 08 (downstream of BLOCKER-01 and BLOCKER-02)  
**Owning script:** `scripts/pios/lens_generate.sh`

**Current state:**  
`lens_generate.sh` derives both `VAULT_DIR` and `SEMANTIC_DIR` from `BASE_DIR = clients/<client>/psee/runs/<run>`.  
For BlueEdge:  
- vault is in `run_blueedge_productized_01` (vault_run)  
- semantic is in `run_blueedge_productized_01_fixed` (display_run / semantic_run)  
- reports target `run_blueedge_productized_01_fixed/reports/`  

No single `--run` value can satisfy all three. The split is already handled in the LENS workspace runtime (BUNDLE_OVERRIDES), but `lens_generate.sh` has no equivalent.

**Required contract:**  
`lens_generate.sh` must accept explicit run-role parameters:

| Parameter | Role | Example |
|-----------|------|---------|
| `--run` | `report_run` (output target) | run_blueedge_productized_01_fixed |
| `--vault-run` | `vault_run` (vault source) | run_blueedge_productized_01 |
| `--semantic-run` | `semantic_run` (semantic bundle source) | run_blueedge_productized_01_fixed |

When `--vault-run` and `--semantic-run` are not provided, they default to `--run` (preserving current behavior for simple/single-run clients).

**Allowed fix boundary:**  
Add `--vault-run` and `--semantic-run` optional parameters to `lens_generate.sh`.  
Update `VAULT_DIR` and `SEMANTIC_DIR` derivation to use these when provided.  
Pass resolved paths through to `lens_report_generator.py` via `--package-dir` and `--semantic-bundle-dir`.  
No changes to `lens_report_generator.py`. No changes to report templates. No semantic content changes.

**Forbidden workaround:**  
- Copying semantic bundle from display_run to vault_run or execution run  
- Symlinking vault into display_run  
- Assuming single-run co-location will hold across clients  
- Adding co-location enforcement at the wrapper level (wrapper must instead pass resolved paths)

**Next stream:** PI.LENS.RUNTIME-BUNDLE-MAPPING.CONTRACT.01

---

## BLOCKER-04 — Semantic Bundle Producer Contract

**Stage affected:** 07  
**Current state:**  
BlueEdge semantic bundle exists as `READY_LOCKED_REFERENCE`. It was produced through a complex multi-stream process (41.x grounding, semantic shaping, crosswalk, signal projection). No generic `semantic_bundle_generator.py` or equivalent producer exists.

**For BlueEdge:**  
Declare stage 07 as `LOCKED_REFERENCE_INPUT` with formal contract attestation. The locked bundle at `run_blueedge_productized_01_fixed/semantic/` is the authoritative semantic surface for BlueEdge. No re-computation is required or permitted without a new dedicated stream.

**For future clients:**  
A `semantic_bundle_generator.py` producer must be defined in a new stream. Required contract inputs: vault output (from stage 06), 41.x grounded signals, CEU grounding state. Required output: `semantic_bundle_manifest.json` + `semantic/` subtree conforming to the LENS semantic bundle schema. Only after this stream is complete can stage 07 become executable for new clients.

**Required contract declaration:**  
`lens_e2e_assemble.sh --mode execute` must, for stage 07:  
- Check if a semantic bundle producer exists for the client/run  
- If absent: classify `LOCKED_REFERENCE_INPUT` and validate bundle is present  
- If present: execute producer and validate output  

**Forbidden workaround:**  
- Treating READY_LOCKED_REFERENCE as a permanent valid classification for new clients  
- Generating semantic bundles from partial or unvalidated stage outputs  
- Copying BlueEdge semantic bundle to new client runs

**Next stream:** PI.LENS.SEMANTIC-BUNDLE.PRODUCER.01

---

## BLOCKER-05 — Report Runtime Contract

**Stage affected:** 08  
**Current state:**  
`lens_generate.sh` executes correctly when vault and semantic bundle are co-located in `--run`.  
This was validated in the BlueEdge demo context (`PI.LENS.PRODUCT-DEMO-PACKAGE.01` — runtime validated, all 4 HTML reports present).  
The renderer (`lens_report_generator.py`) is correct and must not be reopened.

**What is already closed:**  
- `lens_generate.sh` CLI and invocation pattern  
- `lens_report_generator.py` rendering logic  
- Output contract: 4 HTML reports + `graph_state.json` in reports/  
- Idempotent re-generation (confirmed in demo)  
- Report content quality (confirmed in decision surface + tier1/tier2)  

**Required contract:**  
`lens_generate.sh` must accept resolved vault and semantic paths (see BLOCKER-03).  
Once BLOCKER-03 is resolved, stage 08 becomes executable without further changes to renderer or report templates.

**What must NOT be reopened:**  
- `lens_report_generator.py` rendering logic  
- Report template structure  
- Semantic bundle content schema  
- Output report file names  
- graph_state.json synthesis logic

**Resolution dependency:**  
BLOCKER-05 resolves automatically once BLOCKER-03 is implemented. No independent stream required for BLOCKER-05.

---

## Closure Priority Order

| Priority | Blocker | Blocks | Recommended Stream |
|----------|---------|--------|-------------------|
| 1 | BLOCKER-01 | Stages 01–05 entry | PI.LENS.SOURCE-INTAKE.CONTRACT-CLOSURE.01 |
| 2 | BLOCKER-02 | Stage 06 (independent) | PI.LENS.RUNTIME-BUNDLE-MAPPING.CONTRACT.01 |
| 3 | BLOCKER-03 | Stage 08 co-location | PI.LENS.RUNTIME-BUNDLE-MAPPING.CONTRACT.01 |
| 4 | BLOCKER-04 | Stage 07 generalization | PI.LENS.SEMANTIC-BUNDLE.PRODUCER.01 |
| 5 | BLOCKER-05 | Stage 08 downstream | Resolves with BLOCKER-03; no new stream |
