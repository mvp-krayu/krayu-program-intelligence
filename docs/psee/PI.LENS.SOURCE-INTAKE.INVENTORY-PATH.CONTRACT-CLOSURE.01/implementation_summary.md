# Implementation Summary
## PI.LENS.SOURCE-INTAKE.INVENTORY-PATH.CONTRACT-CLOSURE.01

**Date:** 2026-05-03
**Branch:** work/psee-runtime
**Baseline commit:** c0b99bdaac9fe31236883bd0a0880ae1b60d160e

---

## Changes Made

**File modified:** `scripts/pios/source_intake.py`

### Change 1 — Removed `"extracted_path"` from `REQUIRED_MANIFEST_FIELDS`

Before:
```python
REQUIRED_MANIFEST_FIELDS = ["archive_path", "sha256", "extracted_path"]
```
After:
```python
REQUIRED_MANIFEST_FIELDS = ["archive_path", "sha256"]
```

`extracted_path` is now optional: resolved via hybrid path fallback in
`resolve_inventory_source_path()`.

### Change 2 — Added `resolve_inventory_source_path()` helper

Added after `classify_path()`:

```python
def resolve_inventory_source_path(client_id: str, run_id: str, manifest: dict) -> dict:
    client_run_path = (
        REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id / "intake" / "canonical_repo"
    )
    manifest_path_str = manifest.get("extracted_path", "")
    manifest_path = (REPO_ROOT / manifest_path_str) if manifest_path_str else None

    candidates = [str(client_run_path.relative_to(REPO_ROOT))]
    if manifest_path:
        candidates.append(str(manifest_path.relative_to(REPO_ROOT)))

    if client_run_path.exists():
        return {"resolution_mode": "CLIENT_RUN", "resolved_path": ..., ...}
    if manifest_path and manifest_path.exists():
        return {"resolution_mode": "EXTRACTED_PATH", "resolved_path": ..., ...}
    return {"resolution_mode": "MISSING", "resolved_path": None, ...}
```

### Change 3 — Updated `step_inventory()` signature and implementation

New signature: `step_inventory(manifest: dict, client_id: str, run_id: str) -> dict`

- Calls `resolve_inventory_source_path()` for hybrid path resolution
- Prints `[PATH-RESOLUTION] mode: ...` and checked paths
- Returns `inventory_result: "MISSING_INPUT_FAIL_CLOSED"` when both paths absent
- Adds `resolution_mode` and `candidate_paths` to return dict

### Change 4 — Updated `build_intake_manifest()` to use `.get()`

```python
"extracted_path": manifest.get("extracted_path", ""),
```

### Change 5 — Updated `main()` call

```python
inventory = step_inventory(manifest, client_id, run_id)
```

---

## Validation Run

```
python3 scripts/pios/source_intake.py \
  --client blueedge \
  --source source_01 \
  --run-id run_blueedge_intake_contract_closure_01 \
  --dry-run
```

**Key output:**
```
[3] Source boundary validation ...
  Computing SHA256 of .../blueedge-platform-v3_23_0-COMPLETE.tar [EXTERNAL_ABSOLUTE] ...
  Boundary result: PASS

[4] Source inventory ...
  [PATH-RESOLUTION] mode: MISSING
    checked: clients/blueedge/psee/runs/run_blueedge_intake_contract_closure_01/intake/canonical_repo
    checked: clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo
  source_root exists: False
  files found: 0
  Inventory result: MISSING_INPUT_FAIL_CLOSED
```

**Exit code:** 1 — expected; source genuinely absent at both candidate paths.
No crash. No `KeyError`. No `ValueError`. Clean `MISSING_INPUT_FAIL_CLOSED` fail.

---

## Files Changed

| File | Change |
|------|--------|
| `scripts/pios/source_intake.py` | `REQUIRED_MANIFEST_FIELDS` updated; `resolve_inventory_source_path()` added; `step_inventory()` updated; `build_intake_manifest()` `.get()` fix; `main()` call updated |

No other files modified.
