# STEP 7I — Stage 02 Target Client Forwarding Fix

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 7I
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Confirmed Root Cause

`run_end_to_end.py:491` called `run_script("extract_ceu_lineage.py", [])` with an
empty args list. `extract_ceu_lineage.py` performs argparse at module level (line 67)
and requires `--target-client` as a mandatory argument. With no args supplied, argparse
printed usage and exited with code 2. The script never entered `main()`. Stage 02 halted
with exit code 3.

`extract_ceu_lineage.py` already had the correct `--target-client` parameter added in
STEP 1 (`step1_runtime_isolation.md`). The only missing piece was the orchestrator
forwarding `client_id` to the subscript.

---

## File Modified

- `scripts/psee/run_end_to_end.py`

---

## Exact Change Applied

**Location:** Stage 02 lineage block, `run_end_to_end.py:491`

**Before:**
```python
rc, stdout, stderr = run_script("extract_ceu_lineage.py", [])
```

**After:**
```python
rc, stdout, stderr = run_script("extract_ceu_lineage.py", ["--target-client", client_id])
```

`client_id` is the active client UUID already in scope within `stage_02_lineage(client_id, ...)`.

---

## Confirmation: extract_ceu_lineage.py Unmodified

`git diff scripts/psee/extract_ceu_lineage.py` — empty. File unchanged.

---

## Confirmation: BlueEdge Constants Unchanged

`BLUEEDGE_CLIENT = "blueedge"` and `BLUEEDGE_RUN_ID = "run_01_authoritative"` in
`extract_ceu_lineage.py` are intentional read-only source constants (documented in
`step1_runtime_isolation.md`). They control where the script reads its structural
topology source from (BlueEdge reference package). They were not modified and are
not subject to modification under this program.

The `__source_run_id: BLUEEDGE_RUN_ID` field in the emitted `raw_input.json` is a
provenance metadata declaration (double-underscore prefix), not structural data.

---

## Confirmation: No Runtime Execution

No pipeline commands were run. No scripts were executed. Only `run_end_to_end.py`
was edited.

---

## Confirmation: STEP 7 Retry Not Executed

`run_end_to_end.py` was NOT invoked. STEP 7D/7G remain the last pipeline execution
records. Retry is deferred to STEP 7J under a controlled execution contract.

---

## Validation Results

```
git diff --name-only
  scripts/psee/run_end_to_end.py              ← only file in diff

grep -n "extract_ceu_lineage" run_end_to_end.py
  491: run_script("extract_ceu_lineage.py", ["--target-client", client_id])

git diff scripts/psee/extract_ceu_lineage.py
  (empty)

git status --short
  M scripts/psee/run_end_to_end.py
  ?? clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/
```

---

## STEP 7I Status

**COMPLETE**
