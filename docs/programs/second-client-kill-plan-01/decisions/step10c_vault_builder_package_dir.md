# STEP 10C — Vault Builder package-dir Parameterization Decision Trace

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10C
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Context

STEP 10C objective: implement Strategy C from STEP 10B — add explicit `--package-dir`
support to `build_evidence_vault.py` without changing default behavior.

---

## 4-Brain Summary

### CANONICAL

`clients/<uuid>/psee/runs/<run_id>/package/` remains the authoritative contract surface.
`--package-dir` is an explicit override, not a new default. When absent, the vault builder
derives the package path from `--client` + `--run` exactly as before. The canonical path
convention is preserved and unchanged.

### CODE

Two targeted changes applied to `scripts/psee/build_evidence_vault.py`:

**Change 1 — argparse block (line 2640):**
Added `--package-dir` optional argument:
```
--package-dir    Override package artifact directory
                 (default: clients/<id>/psee/runs/<run>/package)
```

**Change 2 — "Locate run package" block (lines 2663–2670):**
Replaced unconditional path derivation with conditional:
```python
if args.package_dir:
    package_dir = Path(args.package_dir)
    if not package_dir.is_absolute():
        package_dir = repo_root / package_dir
    run_dir = package_dir.parent
else:
    run_dir = repo_root / "clients" / client_id / "psee" / "runs" / run_id
    package_dir = run_dir / "package"
```

All downstream logic (fail-closed `run_dir.exists()` check, `package_dir.exists()` check,
`REQUIRED_PACKAGE_ARTIFACTS` loop in `build_vault_model()`) is unchanged and operates
against the resolved `package_dir` regardless of how it was derived.

### PRODUCT

Vault builder can now consume the governed package location explicitly. The second-client
vault build invocation will pass:
```
--package-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/package
```
once GAUGE artifacts are produced at that path (STEP 10D). No vault was built in this chunk.

### PUBLISH

No external output. No BlueEdge artifacts copied or referenced. No contaminated
`runs/package/gauge_state.json` usage — the `--package-dir` caller controls the explicit
path, and the correct invocation will point to the clean `psee/runs/` location.
`clients/blueedge/` was not modified.

---

## Files Changed

| File | Change |
|------|--------|
| `scripts/psee/build_evidence_vault.py` | Added `--package-dir` arg + conditional path derivation in `main()` |

---

## Behavior Added

| Condition | Behavior |
|-----------|----------|
| `--package-dir` absent | Unchanged: `run_dir = clients/<id>/psee/runs/<run>`, `package_dir = run_dir/package` |
| `--package-dir` provided | `package_dir = resolved arg`, `run_dir = package_dir.parent` |
| Either path | Fail-closed on missing `run_dir` or `package_dir` (unchanged) |
| Either path | `REQUIRED_PACKAGE_ARTIFACTS` loop enforces 5 required files (unchanged) |

---

## Backward Compatibility Confirmation

- BlueEdge invocation (`--client blueedge --run run_authoritative_recomputed_01`) behavior
  is identical to pre-change — `--package-dir` absent → default derivation path unchanged
- `REQUIRED_PACKAGE_ARTIFACTS` unchanged (line 33)
- Fail-closed behavior on missing artifacts unchanged (`build_vault_model()` lines 209–212)
- No other logic modified

---

## Validation Results

```
git diff --name-only          → scripts/psee/build_evidence_vault.py only
grep "package-dir"            → line 2640: arg declaration
grep "package_dir" (logic)    → lines 2663-2670: conditional block
grep "REQUIRED_PACKAGE_ARTIFACTS" → line 33 (unchanged), line 209 (unchanged)
git status --short            → M scripts/psee/build_evidence_vault.py
                                 ?? clients/e65d2f0a-.../psee/ (untracked, not staged)
```

---

## Runtime Execution

No scripts were executed. `build_evidence_vault.py` was NOT run. No vault was built.

---

## Remaining Blockers

1. **GAUGE artifacts not produced** — `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/`
   is empty. Five required artifacts (`gauge_state.json`, `coverage_state.json`,
   `reconstruction_state.json`, `canonical_topology.json`, `signal_registry.json`) absent.
   GAUGE must execute (STEP 10D).

2. **`projection_runtime.py:_find_signal_registry()` not fixed** — hardcoded BlueEdge run IDs
   remain. Signal claims CLM-20..24 will project with null signal fields until patched.
   Fix contract (originally STEP 10B signal registry task) is pending.

---

## Next Step Recommendation (10D)

STEP 10D contract requirements:
1. Execute GAUGE for `run_01_oss_fastapi` producing five package artifacts at
   `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/`
2. Apply `_find_signal_registry()` fix to `projection_runtime.py` (signal registry blocker)
3. Issue vault build contract once both blockers are resolved

---

## STEP 10C Status

**COMPLETE** (Strategy C implemented; vault build path unblocked at code level; vault
construction remains BLOCKED pending GAUGE execution)
