# Contract Decision
## PI.LENS.SOURCE-INTAKE.INVENTORY-PATH.CONTRACT-CLOSURE.01

**Date:** 2026-05-03
**Branch:** work/psee-runtime
**Baseline commit:** c0b99bdaac9fe31236883bd0a0880ae1b60d160e

---

## BLOCKER-06 — source_intake.py step_inventory() UUID-only path dependency

**Root cause:** `step_inventory()` resolved the inventory source path exclusively via
`REPO_ROOT / manifest["extracted_path"]` (UUID canonical path). When that UUID path
is absent (fresh execution runs without pre-extracted source), inventory fails and
exits 1 regardless of whether boundary is PASS.

Additionally, `REQUIRED_MANIFEST_FIELDS` included `"extracted_path"`, causing
`validate_manifest_fields()` to fail-closed for new-client manifests that don't carry
the UUID field.

---

## Decision

Apply same hybrid path resolution pattern already used in:
- `step_boundary()` + `classify_path()` (BLOCKER-01 fix)
- `run_client_pipeline.py` phases 2+3 (BLOCKER-02 fix)

Resolution order (new `resolve_inventory_source_path()` helper):
1. `clients/<client>/psee/runs/<run>/intake/canonical_repo` — CLIENT_RUN mode
2. `REPO_ROOT / manifest["extracted_path"]` — EXTRACTED_PATH mode (if key present)
3. Neither found → `MISSING` mode → `inventory_result: MISSING_INPUT_FAIL_CLOSED`

`MISSING_INPUT_FAIL_CLOSED` distinguishes genuine missing source content from
a path-contract crash. It is not a regression — it is an explicit, auditable fail.

---

## Scope

| Item | In scope |
|------|----------|
| `source_intake.py` `REQUIRED_MANIFEST_FIELDS` — remove `extracted_path` | YES |
| `source_intake.py` `resolve_inventory_source_path()` helper — add | YES |
| `source_intake.py` `step_inventory()` — update signature + hybrid path | YES |
| `source_intake.py` `build_intake_manifest()` — use `.get("extracted_path", "")` | YES |
| `source_intake.py` `main()` — pass `client_id`/`run_id` to `step_inventory()` | YES |
| `run_client_pipeline.py` | NO |
| Any other producer scripts | NO |
| Pipeline execution | NO |
| Canonical run artifacts | NO |

---

## BLOCKER-06 Closed

This contract closes BLOCKER-06.
Remaining open: BLOCKER-03 (lens_generate.sh co-location), BLOCKER-04 (semantic producer),
BLOCKER-05 (downstream of BLOCKER-03).
