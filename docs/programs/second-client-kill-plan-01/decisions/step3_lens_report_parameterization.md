# STEP 3 — LENS Report Generator Parameterization

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 3
**Date:** 2026-04-24
**Branch:** feature/next
**Baseline commit:** ef990e2

---

## Scope

Single file modified:

- `scripts/pios/lens_report_generator.py`

Not modified (explicitly deferred):
- `scripts/pios/tier2_data.py` — STEP 4
- `app/gauge-product/scripts/export_graph_state.mjs` — STEP 5
- `app/gauge-product/` — out of scope

---

## Changes Applied

### 1 — `import argparse` promoted to module-level imports

`argparse` was already imported inside `__main__` block. Moved to top-level import section alongside `json`, `math`, etc.

### 2 — Module docstring updated

Output path string changed from `clients/blueedge/reports/lens_report_...html` to `clients/<client>/reports/lens_report_...html`.

### 3 — `_configure_runtime()` function added

New function (after `FORBIDDEN_SUBSTRINGS` constant) that sets module-level path globals from caller-supplied parameters:

```
_configure_runtime(
    client: str = "blueedge",
    run_id: str = "run_authoritative_recomputed_01",
    api_base: str = "http://localhost:3000",
    fragments_dir: Optional[Path] = None,
    package_dir: Optional[Path] = None,
    claims: Optional[List[str]] = None,
) -> None
```

Globals updated: `LENS_CLAIMS`, `API_BASE`, `FRAGMENTS_DIR`, `REPORTS_DIR`, `CANONICAL_PKG_DIR`, `TIER1_REPORTS_DIR`, `TIER2_REPORTS_DIR`.

Module-level defaults at lines 51–55 are preserved as-is (blueedge backward compat). They are overridden by `_configure_runtime()` before any generation runs.

### 4 — `compose_system_intelligence()` rewritten

Removed:
- Hardcoded BlueEdge domain list (17 tuples with `(name, cluster, status)`)
- Hardcoded counts: `"17 functional domains"`, `"42 capability surfaces"`, `"89 components mapped"`

Added:
- `topology` parameter (`Optional[Dict]`)
- Domain list built from `topology["domains"][i]["domain_name"]` with grounding-status logic
- Counts from `topology["counts"].get("domains")`, `topology["counts"].get("capabilities")`, `topology["counts"].get("components")`
- Graceful fallback if topology is None (placeholder text, no crash)

### 5 — `_compose_topology_fallback()` added

New helper for the non-17-domain rendering path. Renders domain names from `topology["domains"][].domain_name` as a plain list. Includes explicit portability notice:

> "Topology visualization currently optimized for reference model. Dynamic topology rendering pending for this client."

No hardcoded coordinates. No hardcoded cluster names.

### 6 — `compose_topology_view()` updated

Added topology load block at function entry (loads `canonical_topology.json` via `load_canonical_topology()` if not passed as argument).

Added domain-count conditional:
- `len(topology["domains"]) != 17` → delegate to `_compose_topology_fallback()`
- `len(topology["domains"]) == 17` → existing BlueEdge SVG rendering path (unchanged logic)

The entire BlueEdge SVG body (clusters, node coordinates, legend, SVG tags) is unmodified.

### 7 — `build_html()` updated

Added topology load at function entry. Passes `_topology` to `compose_system_intelligence()` and `compose_topology_view()`.

### 8 — Tier-2 context lock run_id fixed

Before:
```html
<span class="t2-field-value">run_authoritative_recomputed_01</span>
```

After:
```html
<span class="t2-field-value">{esc(topology.get("emission_run_id", "—"))}</span>
```

Run ID is now topology-derived, not hardcoded.

### 9 — `__main__` argparse block replaced

Old block: single `--tier1` / `--legacy` flags only, no client/run-id/path args.

New block adds:
- `--client` (default: `blueedge`)
- `--run-id` (default: `run_authoritative_recomputed_01`)
- `--api-base` (default: `http://localhost:3000`)
- `--fragments-dir` (optional Path)
- `--package-dir` (optional Path)
- `--claims` (nargs=`*`)
- `--output-dir` (optional Path)
- `--output` (optional Path)
- `--tier1` / `--legacy` (preserved)

`_configure_runtime()` called before `main()` with all resolved args.

---

## What Was NOT Changed

- `TIER1_REPORTS_DIR` / `TIER2_REPORTS_DIR` module-level defaults — preserved (overridden by `_configure_runtime()`)
- BlueEdge SVG body in `compose_topology_view()` — fully preserved, untouched
- `LENS_CLAIMS` module-level default list — preserved (overridden by `_configure_runtime()` if `--claims` supplied)
- `tier2_data.py` — not modified (STEP 4)
- `export_graph_state.mjs` — not modified (STEP 5)
- `app/gauge-product/` — not modified

---

## Validation Results

| Check | Result |
|-------|--------|
| `git diff --name-only` → only `lens_report_generator.py` | PASS |
| `grep "clients/blueedge"` → empty (path constructed via `/`) | PASS |
| `grep '"blueedge"'` → lines 51, 52, 55, 72, 3783 (all intentional defaults) | PASS |
| `grep "run_01_authoritative"` → line 51 only (module-level default) | PASS |
| `grep "run_authoritative_recomputed_01"` → lines 55, 73, 3787, 3788 (defaults/help) | PASS |
| `grep "17 functional domains"` → line 1051 only (inside preserved SVG legend) | PASS |
| `grep "domain_name"` → lines 754, 813, 833 (topology-derived in compose functions) | PASS |
| `grep "Topology visualization currently optimized"` → line 849 | PASS |
| `grep "emission_run_id"` → line 3582 (tier2 context lock, topology-derived) | PASS |
| No runtime execution occurred | CONFIRMED |
| STEP 4 not executed | CONFIRMED |

---

## Assumption Removals

1. `lens_report_generator.py` previously assumed `clients/blueedge/` as the output path
2. Previously assumed `run_01_authoritative` and `run_authoritative_recomputed_01` as the only valid run IDs
3. Previously assumed 17 domains / 42 capabilities / 89 components as static system counts
4. Previously assumed BlueEdge domain names as the only valid domain set for `compose_system_intelligence()`
5. Previously assumed `http://localhost:3000` as non-overridable API base
6. Previously assumed tier2 context lock run_id was the static string `run_authoritative_recomputed_01`

---

## STEP 3 Status

**COMPLETE**
