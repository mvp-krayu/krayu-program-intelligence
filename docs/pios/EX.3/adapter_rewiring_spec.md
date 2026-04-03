# EX.3 — Adapter Rewiring Specification

**Stream:** EX.3 — Runtime Integration & System Bridge (Default Path Binding)
**Artifact type:** ADAPTER REWIRING SPECIFICATION
**Date:** 2026-04-03
**Authority:** EX.3

---

## 1. PURPOSE

This document specifies every code change applied to existing adapters and the bridge
module created in EX.3. It is the authoritative record for CE.11 GC-002 traceability.

---

## 2. NEW ARTIFACT: pios_bridge.py

**File:** `scripts/pios/EX.3/pios_bridge.py`
**Type:** New shared module (importable)
**CE.11 class:** GC-002

**Exports:**
- `get_live_pios_data(run_id=None)` → dict | None
  Invokes compute_signals.py → activate_conditions.py. Returns governed dict or None.
- `get_l3_signal_pios_context(live_data, l3_signal_id)` → dict
  Returns `{pios_emission_state, pios_ce5_consumption_state, pios_condition_tier, pios_diagnosis_state, pios_run_id}` for an L3 signal ID.
- `get_live_metric_value(live_data, l3_signal_id)` → float | None
  Returns the live engine numeric value for an overview metric's L3 signal.
- `get_pios_condition_summary(live_data)` → dict
  Returns flat summary of all CE.2 condition tiers and diagnosis states.

**Key constants:**
- `L3_TO_ENGINE` — mapping from L3 signal_registry IDs to engine signal/condition/diagnosis IDs
- `L3_METRIC_LIVE_FIELDS` — mapping from L3 signal ID to (engine signal ID, output field name)

---

## 3. MODIFIED ARTIFACT: execlens_adapter.py (42.4)

**File:** `scripts/pios/42.4/execlens_adapter.py`
**CE.11 class:** GC-002

**Changes:**

**Block 1 — Bridge import (added after imports):**
```python
_EX3_PATH = Path(__file__).resolve().parents[1] / "EX.3"
if str(_EX3_PATH) not in sys.path:
    sys.path.insert(0, str(_EX3_PATH))
try:
    import pios_bridge as _bridge
    _BRIDGE_AVAILABLE = True
except ImportError:
    _BRIDGE_AVAILABLE = False
```

**Block 2 — Engine invocation in get_query_data() (before signal loop):**
```python
_live_data = _bridge.get_live_pios_data() if _BRIDGE_AVAILABLE else None
```

**Block 3 — pios_ctx per signal (inside signal loop):**
```python
pios_ctx = _bridge.get_l3_signal_pios_context(_live_data, reg["signal_id"]) if _BRIDGE_AVAILABLE else {...null dict...}
```

**Block 4 — New fields in signal_entry dict:**
```python
"pios_emission_state":        pios_ctx["pios_emission_state"],
"pios_ce5_consumption_state": pios_ctx["pios_ce5_consumption_state"],
"pios_condition_tier":        pios_ctx["pios_condition_tier"],
"pios_diagnosis_state":       pios_ctx["pios_diagnosis_state"],
"pios_run_id":                pios_ctx["pios_run_id"],
```

**No existing fields modified. No existing logic changed.**

---

## 4. MODIFIED ARTIFACT: execlens_overview_adapter.py (42.6)

**File:** `scripts/pios/42.6/execlens_overview_adapter.py`
**CE.11 class:** GC-002

**Changes:**

**Block 1 — Bridge import (same pattern as 42.4):**
Path: `Path(__file__).resolve().parents[2] / "pios" / "EX.3"`

**Block 2 — Engine invocation in get_overview_metrics() (before metric loop):**
```python
_live_data = _bridge.get_live_pios_data() if _BRIDGE_AVAILABLE else None
```

**Block 3 — Live value preference per metric (inside metric loop):**
```python
live_value = _bridge.get_live_metric_value(_live_data, defn["signal_id"]) if _BRIDGE_AVAILABLE else None
static_value = defn["extract"](sig)
value = live_value if live_value is not None else static_value
value_source = ("live_engine" if live_value is not None
                else ("static_extraction" if static_value is not None else "none"))
```

**Block 4 — pios_ctx per metric:**
Same pattern as 42.4 — `get_l3_signal_pios_context()`

**Block 5 — New fields in metric record:**
```python
"value_source":               value_source,
"pios_emission_state":        pios_ctx["pios_emission_state"],
"pios_ce5_consumption_state": pios_ctx["pios_ce5_consumption_state"],
"pios_condition_tier":        pios_ctx["pios_condition_tier"],
"pios_diagnosis_state":       pios_ctx["pios_diagnosis_state"],
"pios_run_id":                pios_ctx["pios_run_id"],
```

**No existing extraction logic removed. Fallback preserved for visibility_deficit and bridge-unavailable cases.**

---

## 5. MODIFIED ARTIFACT: execlens_topology_adapter.py (42.7)

**File:** `scripts/pios/42.7/execlens_topology_adapter.py`
**CE.11 class:** GC-002

**Changes:**

**Block 1 — Bridge import:**
Path: `Path(__file__).resolve().parents[2] / "pios" / "EX.3"`

**Block 2 — Engine invocation + pios_summary (end of get_topology()):**
```python
_live_data = _bridge.get_live_pios_data() if _BRIDGE_AVAILABLE else None
pios_summary = _bridge.get_pios_condition_summary(_live_data) if _BRIDGE_AVAILABLE else {...null dict...}
```

**Block 3 — pios_summary field added to return dict:**
```python
"pios_summary": pios_summary,
```

**No existing fields modified. No existing hierarchy logic changed.**

---

## 6. REWIRING INVARIANTS

All changes satisfy:
- R3 (no synthetic data): null on bridge failure, not invented values
- R4 (fail closed): existing fail-closed behavior unchanged; bridge failure → null pios_* fields
- No interposition of engine outputs (RB-002)
- No modification to existing adapter return contracts (backward compatible)
- No modification to any engine file
- No modification to any 41.x static artifact
