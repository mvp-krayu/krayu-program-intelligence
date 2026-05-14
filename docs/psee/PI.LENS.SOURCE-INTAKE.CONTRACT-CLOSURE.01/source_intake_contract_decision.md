# Source Intake Contract Decision
## PI.LENS.SOURCE-INTAKE.CONTRACT-CLOSURE.01

**Date:** 2026-05-03  
**Blocker reference:** BLOCKER-01 from PI.LENS.REAL-E2E-PIPELINE.STAGE-CONTRACT-CLOSURE.01

---

## Decision

**Selected option:** Option B — support external `archive_path` safely without `.relative_to()` assumption.

Source archives are legitimately external binary artifacts (large tarballs, etc.). The repository is not an archive store. Requiring archives to be within REPO_ROOT (Option A) would impose an unjustified structural constraint on all clients.

---

## Failure Being Fixed

`source_intake.py::step_boundary()` called `archive_path.relative_to(REPO_ROOT)` in a print statement:

```python
print(f"  Computing SHA256 of {archive_path.relative_to(REPO_ROOT)} ...")
```

When `archive_path` is an absolute external path (e.g., `/Users/khorrix/Projects/blueedge-clean-run/...`), Python `Path.relative_to()` raises `ValueError` if the path is not a subpath of the base. This caused `exit 1` before any validation logic ran.

---

## Fix Applied

Added `classify_path(path, repo_root) -> dict` helper:

```python
def classify_path(path: Path, repo_root: Path) -> dict:
    """Classify a path as REPO_RELATIVE or EXTERNAL_ABSOLUTE without assuming containment."""
    try:
        rel = path.relative_to(repo_root)
        return {"path": str(rel), "path_type": "REPO_RELATIVE", "inside_repo": True}
    except ValueError:
        return {"path": str(path), "path_type": "EXTERNAL_ABSOLUTE", "inside_repo": False}
```

Updated `step_boundary()`:
- Computes `archive_path_class = classify_path(archive_path, REPO_ROOT)` once
- Uses `archive_path_class["path"]` in the print statement (no `.relative_to()`)
- Adds `archive_path_type` and `archive_path_inside_repo` to the returned boundary dict

---

## What Is Unchanged

- Archive existence check — unchanged
- SHA256 computation — unchanged
- `boundary_result` PASS/FAIL logic — unchanged
- `step_inventory` — unchanged
- `step_checksum` — unchanged
- `build_intake_manifest` — unchanged
- Output file schema (except two new fields added to boundary dict)
- CREATE_ONLY behavior — unchanged
- `sys.exit(1)` on `intake_result != "PASS"` — unchanged

---

## Scope Boundary

Only `step_boundary()` in `scripts/pios/source_intake.py` was modified.

The `inventory_result: FAIL` behavior when `extracted_path` is absent is unchanged and correct — the extracted source is not present at the UUID path. That is a separate blocker (BLOCKER-02) and is not in scope for this stream.
