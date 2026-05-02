# Wrapper Path Alignment Summary
## PI.LENS.GENERATE.WRAPPER-PATH-ALIGNMENT.01

**Date:** 2026-05-02
**Branch:** work/psee-runtime

---

## Problem

`lens_generate.sh` passed `VAULT_DIR` (which may be a symlink) directly as `--package-dir`. The renderer resolves `41.x/` relative to `Path(package_dir).parent`. When the vault path is a symlink, Python's `Path.parent` returns the symlink's containing directory, not the symlink's target's parent.

For `run_blueedge_productized_01_fixed/vault` (symlink → `../run_blueedge_productized_01/vault`):
- `Path.parent` = `run_blueedge_productized_01_fixed` (NO `41.x/`)
- 41.x projection files not found → `pz_proj=None` → EPB block suppressed

---

## Fix

Added 5 lines to `scripts/pios/lens_generate.sh` — after the VAULT_DIR existence check:

```bash
# Resolve symlink so renderer's Path.parent finds sibling 41.x/ correctly
if [[ -L "$VAULT_DIR" ]]; then
  PACKAGE_DIR="$(realpath "$VAULT_DIR")"
else
  PACKAGE_DIR="$VAULT_DIR"
fi
```

Changed `--package-dir "$VAULT_DIR"` → `--package-dir "$PACKAGE_DIR"`.

`realpath` dereferences the symlink to the physical target path. The renderer then has `CANONICAL_PKG_DIR.parent = run_blueedge_productized_01`, which has `41.x/grounded/`, so both projection files are loaded.

---

## Result

| Before | After |
|--------|-------|
| `[LEGACY] pressure_zone_projection.json → 41.x/...` (file missing) | `[GROUNDED] pressure_zone_projection.json → 41.x/grounded/...` |
| `pz_proj=None` | `pz_proj` loaded |
| EPB block absent | EPB block present |
| Normalized diff: FAIL | Normalized diff: 0 |

---

## Paths Used

| Path | Before | After |
|------|--------|-------|
| `--package-dir` | `run_blueedge_productized_01_fixed/vault` (symlink) | `run_blueedge_productized_01/vault` (real) |
| `--semantic-bundle-dir` | `run_blueedge_productized_01_fixed/semantic/` | unchanged |
| `--output-dir` | `run_blueedge_productized_01_fixed/reports` | unchanged |
