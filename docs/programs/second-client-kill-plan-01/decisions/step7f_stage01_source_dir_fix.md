# STEP 7F — Stage 01 Source Directory Intake Fix

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 7F
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Confirmed Root Causes Addressed

**RC-1 — Scan depth:** `source_scan()` enumerated only direct file children of
`clients/<uuid>/input/` using `os.listdir()` + `isfile()`. The OSS FastAPI
client's `input/` directory contains one direct child: `intake/` (a
subdirectory). `isfile("intake/")` → False → zero candidates →
`fail("SOURCE_SCAN", "SOURCE_UNAVAILABLE", ...)`.

**RC-2 — No AUTHORITATIVE_INTAKE code path:** `classify_source()` could only
return `TEST_INPUT | RUNTIME_STATE | CONFIG | DERIVED_OUTPUT | DOCUMENTATION |
UNKNOWN`. The admissible filter at line 246 required `AUTHORITATIVE_INTAKE`,
which was never reachable. The script could not pass Stage 01 for any raw
source code input regardless of scan depth.

**RC-3 — Source not forwarded:** `run_end_to_end.py:stage_01_intake()` received
`source` as a parameter but standard mode at line 404 called
`run_script("build_raw_intake_package.py", ["--client", client_id])` — the
`source` value was discarded at the stage boundary.

---

## Files Modified

1. `scripts/psee/build_raw_intake_package.py`
2. `scripts/psee/run_end_to_end.py`

---

## Exact Behavior Added

### `build_raw_intake_package.py`

**Constants added** (after `ALLOWED_SOURCE_CLASS`):
- `EXCLUDED_DIR_NAMES`: `.git`, `__pycache__`, `.venv`, `venv`, `node_modules`, `build`, `dist`
- `EXCLUDED_FILE_EXTENSIONS`: `.pyc`

**Function added: `source_scan_dir(source_dir, client_uuid)`**
- Resolves `source_dir` to an absolute, real path
- D1 checks:
  - Must be an existing directory
  - Resolved path must start with `clients/<client_uuid>/`
  - Path must not contain any `FORBIDDEN_PATH_FRAGMENTS`
- Recursively enumerates all files via `os.walk`, pruning excluded dirs and extensions
- Fails if zero files remain after exclusions
- Returns `(abs_source, [file_paths])`

**Function added: `extract_from_source_dir(abs_source_dir, files)`**
- Creates one root `REPOSITORY` entity (directory basename)
- Scans direct children: each directory containing `__init__.py` → `PACKAGE` entity; each `.py` file (excluding `__init__.py`) → `MODULE` entity
- Returns `(entities, relationships, metrics, events)` where entities is always non-empty
- `metrics["file_count"]` = len(files)

**Function added: `build_manifest_dir(abs_source_dir, files, client_uuid)`**
- SHA-256 per file + aggregate provenance hash (identical algorithm to legacy `build_manifest`)
- `admissibility_metadata` includes: `source_class=AUTHORITATIVE_INTAKE`, `construction_mode=FIRST_RUN_INTAKE`, `source_dir`, `file_count`, `aggregate_hash`, `source_artifacts`, `provenance_hash`

**`main()` modified:**
- Added `--source-dir` optional arg (default `None`)
- When `--source-dir` is provided: calls `source_scan_dir` → `extract_from_source_dir` → `build_manifest_dir`; `metrics["aggregate_hash"]` populated from provenance hash
- When `--source-dir` is absent: calls existing `source_scan` → `source_classification` → `source_validation` → `extract_all` → `build_manifest` (identical to pre-change)

### `run_end_to_end.py`

**Standard mode Stage 01 (line 403–407):**
- Replaced single-line `run_script("build_raw_intake_package.py", ["--client", client_id])`
- With:
  ```python
  intake_args = ["--client", client_id]
  if source:
      intake_args += ["--source-dir", source]
  rc, stdout, stderr = run_script("build_raw_intake_package.py", intake_args)
  ```
- IG mode path (line 320–399): unchanged
- Branch guard: unchanged
- Downstream stages (02–07): unchanged

---

## Backward Compatibility Statement

- **BlueEdge:** Runs PSEE via `--ig-run` → IG mode path (line 320–399) →
  `build_raw_intake_package.py` is never called. Zero impact.
- **Legacy scan mode:** When `--source-dir` is absent (existing callers, no
  `--source` passed to `run_end_to_end.py`), `intake_args` remains
  `["--client", client_id]` unchanged. `build_raw_intake_package.py` takes the
  `else:` branch in `main()` — identical to pre-change behavior for D1/D2 gates.
- `clients/blueedge/` was not modified. Confirmed by `git diff --name-only`.

---

## Unit Validation Result

Command executed:
```
python3 scripts/psee/build_raw_intake_package.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --source-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend
```

Result: `INTAKE_BUILD_COMPLETE`
- SOURCE_SCAN_DIR_PASS (87 files found)
- EXTRACTION_PASS (2 entities: 1 REPOSITORY root, 1 PACKAGE)
- MANIFEST_BUILD_PASS
- OUTPUT_WRITE_PASS (5 files written)
- VALIDATION_PASS

source_manifest.json `admissibility_metadata.source_class` = `AUTHORITATIVE_INTAKE` ✓
entities.json count = 2 (non-empty) ✓

---

## Artifact Paths Created by Unit Validation

```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/raw_intake/source_manifest.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/raw_intake/entities.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/raw_intake/relationships.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/raw_intake/metrics.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/raw_intake/events.json
```

---

## Confirmation: Full Pipeline Not Retried

`run_end_to_end.py` was NOT executed. No pipeline stages were run.
Only `build_raw_intake_package.py` was executed in isolation as the
unit validation command authorized by this contract.

---

## Confirmation: STEP 7D Remains Failed

STEP 7D Command 3 (`run_end_to_end.py`) failed with exit code 2 at Stage 01.
That failure has NOT been retried. STEP 7D status remains FAILED pending a
controlled retry contract (STEP 7G).

---

## Confirmation: clients/blueedge/ Unmodified

`git diff --name-only` output:
```
scripts/psee/build_raw_intake_package.py
scripts/psee/run_end_to_end.py
```

No files under `clients/blueedge/` appear in the diff.

---

## STEP 7F Status

**COMPLETE**
