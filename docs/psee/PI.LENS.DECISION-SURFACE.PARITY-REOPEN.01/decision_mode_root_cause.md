# Decision Mode Root Cause Analysis
## PI.LENS.DECISION-SURFACE.PARITY-REOPEN.01

**Date:** 2026-05-02

---

## Root Cause: 41.x Projection Files Not Resolved — `pz_proj=None`, `psig_proj=None`

### Classification

`WRONG_OUTPUT_PATH` — the `--package-dir` symlink path causes `CANONICAL_PKG_DIR.parent` to resolve to the wrong run directory, making the 41.x projection data unreachable.

---

## Causal Chain

### Step 1 — Vault symlink introduced

PI.LENS.GENERATE.WRAPPER.01 created a symlink:
```
clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault
  → ../run_blueedge_productized_01/vault
```

The wrapper passes this symlink path as `--package-dir`:
```bash
--package-dir clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault
```

### Step 2 — Python `Path.parent` does not follow symlinks

```python
Path("clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault").parent
# → clients/blueedge/psee/runs/run_blueedge_productized_01_fixed
```

`CANONICAL_PKG_DIR.parent` resolves to `run_blueedge_productized_01_fixed`, NOT to `run_blueedge_productized_01`.

### Step 3 — `_resolve_41x_path()` looks in the wrong run directory

```python
def _resolve_41x_path(filename: str) -> Path:
    grounded = CANONICAL_PKG_DIR.parent / "41.x" / "grounded" / filename
    legacy   = CANONICAL_PKG_DIR.parent / "41.x" / filename
```

Both paths are under `run_blueedge_productized_01_fixed/41.x/`, which does NOT exist:

```
clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/
  reports/        ← exists
  semantic/       ← exists
  vault -> ...    ← symlink
  [NO 41.x/]      ← missing
```

The 41.x data lives at:
```
clients/blueedge/psee/runs/run_blueedge_productized_01/41.x/grounded/
  pressure_zone_projection.json   ← required
  signal_projection.json          ← required
```

### Step 4 — Loader functions return None

```python
def _load_pressure_zone_projection() -> Optional[Dict]:
    path = _resolve_41x_path("pressure_zone_projection.json")
    if not path.exists():
        return None  # ← path does not exist
```

Result: `pz_proj = None`, `psig_proj = None`

### Step 5 — EPB block gate fails

In `_build_decision_surface()` at line 6758:
```python
pressure_html = ""
if _use_psig and pz_proj is not None and zone_count > 0:
    # ← never entered; pz_proj is None
```

`zone_count = 0` (derived from `pz_proj.get("zone_projection", [])`, but pz_proj is None → zone_count = 0)

### Step 6 — Cascading absences

| Content | Gate | Result |
|---------|------|--------|
| EPB block (WHERE PRESSURE EXISTS) | `pz_proj is not None` | ABSENT |
| Truth text 3rd sentence | `zone_count >= 1` | ABSENT |
| Gap item "not activated" | `not_activated` (from psig_proj=None decision_model) | ABSENT |
| Gap item "blind_spot" | `blind_spot_active` (from psig_proj=None) | ABSENT |

---

## Why DRIFT-REMEDIATION.01 Achieved Parity

DRIFT-REMEDIATION.01 used:
```bash
--package-dir clients/blueedge/psee/runs/run_blueedge_productized_01/vault
```

Direct path (no symlink) → `CANONICAL_PKG_DIR.parent = run_blueedge_productized_01` → `41.x/grounded/` exists → `pz_proj` and `psig_proj` loaded → EPB rendered → parity PASS.

The wrapper uses the symlink path, which routes resolution through `run_blueedge_productized_01_fixed`, breaking 41.x access.

---

## Mode Check

| Mode | Verdict |
|------|---------|
| Compact decision mode used | NO — full template rendered |
| Wrong template | NO — `_build_decision_surface()` is called correctly |
| Wrong deliverable flag | NO — all 4 reports generated |
| Wrong output path (41.x data) | YES — 41.x unreachable via symlink parent |
| Stale output | NO — freshly generated |

---

## Renderer Code Not at Fault

The renderer `_build_decision_surface()` logic is correct: it gates the EPB block on `pz_proj is not None`. The issue is upstream: `pz_proj` is None because the 41.x files cannot be found relative to the symlink-based vault path. No renderer change is required. The fix is in the data path resolution, not the rendering logic.
