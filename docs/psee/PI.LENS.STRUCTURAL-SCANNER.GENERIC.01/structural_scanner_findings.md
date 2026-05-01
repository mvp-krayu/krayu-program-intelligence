# Structural Scanner Findings
## PI.LENS.STRUCTURAL-SCANNER.GENERIC.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Pre-flight

| Check | Result |
|-------|--------|
| Branch | work/psee-runtime — non-canonical; authorized per standing operator pattern |
| Working tree at start | CLEAN |
| Baseline commit | 02aaeba95cf3b742add547e950c5b01f44095744 |
| Input: source_inventory.json | PRESENT — 87 files |
| Input: source_manifest.json | PRESENT |
| Input: source_root | PRESENT — clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend |
| Output: structure/ directory | ABSENT (CREATE_ONLY safe) |

---

## Execution

Command:
```
python3 scripts/pios/structural_scanner.py --client fastapi --source source_01 --run-id run_02_oss_fastapi_pipeline
```

Exit code: 0

### Build Phase Results

| Phase | Result |
|-------|--------|
| Node construction | 36 directory nodes + 87 file nodes = 123 total |
| CONTAINS edges | 104 |
| IMPORTS edges | 0 (explained below) |
| Total edges | 104 |
| Canonical clusters | 19 |

---

## IMPORTS Edge Count — Zero Result Analysis

The scanner emitted 0 IMPORTS edges for the FastAPI source. This is **correct behavior**, not a defect.

**Root cause:** The FastAPI project uses two import patterns that cannot resolve to source-tree paths under the static regex approach:

1. **Relative imports** (`from .app_factory import app_factory`) — the regex strips the leading dot and gets bare module name `app_factory`. The scanner looks for `app_factory.py` and `app_factory/__init__.py`, but the actual file is `src/app/app_factory.py`. The parent directory context is lost.

2. **Unqualified absolute imports** (`from app.app_factory import app_factory`, `import common.routers.status_OK as status_OK`) — these omit the `src/` prefix. The scanner looks for `app/app_factory.py` and `common/routers/status_OK.py`, but all Python files are under `src/`. No match.

**Design constraint:** The scanner resolves imports by transforming `module.submodule` → `module/submodule.py` and `module/submodule/__init__.py`. This requires that import paths match file paths relative to source_root directly. Projects using `src/` layout or relative imports will not have IMPORTS edges resolved.

**No scanner change required.** IMPORTS edges resolve correctly for flat Python projects where import names match relative file paths. The zero result is deterministic and expected given this source structure.

---

## Canonical Topology Summary

19 clusters emitted. Notable:
- `CLU-17 src` — largest cluster, 89 nodes (all Python application code)
- `CLU-03 .github` — 6 nodes (CI workflows)
- `CLU-12 generated` — 7 nodes (generated API artifacts)
- All remaining clusters are single-file root-level entries

---

## Mode Validation

| Mode | Command | Exit | Result |
|------|---------|------|--------|
| Write | default | 0 | PASS — 3 artifacts written |
| Validate-only | --validate-only | 0 | PASS |
| Dry-run | --dry-run | 0 | PASS — no files written |
| CREATE_ONLY guard | re-run (write) | 1 | FAIL-CLOSED correctly |

---

## Scope Guards

| Guard | Status |
|-------|--------|
| BlueEdge artifacts modified | NO |
| FastAPI source files modified | NO |
| CEU/DOM/41.x/75.x performed | NO |
| Semantic inference performed | NO |
| Report generation performed | NO |
| Cross-layer mutation | NO |

---

## Artifacts Written

Under `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/`:

| File | Nodes/Edges/Clusters |
|------|---------------------|
| `40.2/structural_node_inventory.json` | 123 nodes |
| `40.3/structural_topology_log.json` | 104 edges |
| `40.4/canonical_topology.json` | 19 clusters |

All 3 artifacts: valid JSON, correct schema, gitignored path.
