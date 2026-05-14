# STEP 4 — Tier-2 Data / Query Layer Parameterization

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 4
**Date:** 2026-04-24
**Branch:** feature/second-client-kill-plan-01
**Baseline commit:** 7d6b5e4

---

## Scope

Files modified:

- `scripts/pios/tier2_data.py`
- `scripts/pios/tier2_query_engine.py`

Not modified (deferred):
- `app/gauge-product/scripts/export_graph_state.mjs` — STEP 5
- `app/gauge-product/` — out of scope
- `clients/blueedge/` — not modified

---

## Binding Decision: Module Import Reference (Option A)

Per contract binding decision, `tier2_query_engine.py` changed from:

```python
from tier2_data import (
    FOCUS_DOMAIN, RUN_ID,
    load_topology, load_signals, load_gauge,
    derive_zones, get_zone,
)
```

to:

```python
import tier2_data
```

All subsequent references to `FOCUS_DOMAIN`, `RUN_ID`, and data-access functions use the `tier2_data.<name>` pattern. This ensures that values updated by `tier2_data.configure()` are read at call time, not at import time.

---

## Changes Applied

### 1 — `tier2_data.py`: `configure()` function added

New function inserted after module-level constants (line 28 post-edit):

```python
def configure(
    client_id: Optional[str] = None,
    run_id: Optional[str] = None,
    focus_domain: Optional[str] = None,
) -> None:
    global CANONICAL_PKG_DIR, FOCUS_DOMAIN, RUN_ID
    _client = client_id    if client_id    is not None else "blueedge"
    _run_id = run_id       if run_id       is not None else "run_authoritative_recomputed_01"
    _focus  = focus_domain if focus_domain is not None else "DOMAIN-10"
    CANONICAL_PKG_DIR = REPO_ROOT / "clients" / _client / "psee" / "runs" / _run_id / "package"
    FOCUS_DOMAIN      = _focus
    RUN_ID            = _run_id
```

Module-level defaults preserved at lines 18–25:
- `CANONICAL_PKG_DIR` → `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package`
- `FOCUS_DOMAIN` → `"DOMAIN-10"`
- `RUN_ID` → `"run_authoritative_recomputed_01"`

Default behavior with no `configure()` call: identical to pre-change BlueEdge behavior.

### 2 — `tier2_query_engine.py`: import changed to module import

From `from tier2_data import (...)` to `import tier2_data`.

### 3 — `tier2_query_engine.py`: all FOCUS_DOMAIN / RUN_ID references updated

| Location | Before | After |
|----------|--------|-------|
| `_build_missing()` | `== FOCUS_DOMAIN` | `== tier2_data.FOCUS_DOMAIN` |
| `_build_unresolved()` | `== FOCUS_DOMAIN` | `== tier2_data.FOCUS_DOMAIN` |
| `build_response()` | `"run_id": RUN_ID` | `"run_id": tier2_data.RUN_ID` |
| `handle_why()` | `== FOCUS_DOMAIN` | `== tier2_data.FOCUS_DOMAIN` |
| `build_trace_response()` | `"run_id": RUN_ID` | `"run_id": tier2_data.RUN_ID` |
| `list_zones()` | `"run_id": RUN_ID` | `"run_id": tier2_data.RUN_ID` |

### 4 — `tier2_query_engine.py`: data-access function calls updated

`list_zones()` and `main()` calls updated:
- `load_topology()` → `tier2_data.load_topology()`
- `load_signals()` → `tier2_data.load_signals()`
- `load_gauge()` → `tier2_data.load_gauge()`
- `derive_zones()` → `tier2_data.derive_zones()`
- `get_zone()` → `tier2_data.get_zone()`

### 5 — `tier2_query_engine.py`: CLI args added to `main()`

New args (with BlueEdge defaults for backward compatibility with `app/gauge-product/pages/api/query.js` caller):
- `--client` (default: `"blueedge"`)
- `--run-id` (default: `"run_authoritative_recomputed_01"`)
- `--focus-domain` (default: `"DOMAIN-10"`)

`tier2_data.configure()` called immediately after `args = parser.parse_args()`, before any data access.

---

## What Was NOT Changed

### Unresolved / Missing text blocks — UNTOUCHED

`_UNRESOLVED_FOCUS`, `_UNRESOLVED_NO_SIGNALS`, `_UNRESOLVED_PARTIAL`, `_MISSING_FOCUS`, `_MISSING_NO_SIGNALS` (lines 39–100 of `tier2_query_engine.py`) — not modified. These are content-layer evidence text; per contract "Do NOT rewrite unresolved/missing focus text blocks."

### Query semantics — UNCHANGED

- `handle_why()` logic — unchanged
- `handle_evidence()` logic — unchanged
- `handle_trace()` logic — unchanged
- `derive_zones()` logic in `tier2_data.py` — unchanged
- Zone classification rules, severity, confidence, traceability logic — unchanged
- Response envelope structure — unchanged (only `RUN_ID` literal replaced with `tier2_data.RUN_ID` reference)

---

## Assumptions Removed

1. `CANONICAL_PKG_DIR` hardcoded to `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package`
2. `FOCUS_DOMAIN` hardcoded to `"DOMAIN-10"` (BlueEdge-specific domain ID)
3. `RUN_ID` hardcoded to `"run_authoritative_recomputed_01"` (BlueEdge-specific run ID)
4. `FOCUS_DOMAIN` and `RUN_ID` imported as frozen names — now read at call time via module reference

---

## Validation Results

| Check | Result |
|-------|--------|
| `git diff --name-only` → only `tier2_data.py`, `tier2_query_engine.py` | PASS |
| `grep "clients/blueedge"` in both files → empty | PASS |
| `FOCUS_DOMAIN = "DOMAIN-10"` preserved at tier2_data.py:24 | PASS |
| `RUN_ID = "run_authoritative_recomputed_01"` preserved at tier2_data.py:25 (aligned with spaces) | PASS |
| `import tier2_data` at tier2_query_engine.py:29 | PASS |
| `tier2_data.FOCUS_DOMAIN` references: 3 sites | PASS |
| `tier2_data.RUN_ID` references: 3 sites | PASS |
| No bare `FOCUS_DOMAIN` or `RUN_ID` remain in tier2_query_engine.py | PASS |

---

## STEP 4 Status

**COMPLETE**
