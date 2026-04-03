# EX.3 — Runtime Integration Map

**Stream:** EX.3 — Runtime Integration & System Bridge (Default Path Binding)
**Artifact type:** RUNTIME INTEGRATION MAP
**Date:** 2026-04-03
**Authority:** EX.3

---

## 1. PURPOSE

This document maps the full runtime integration architecture after EX.3 — all routes,
their execution chains, their data sources, and where live PiOS engine output enters
the default execution path.

---

## 2. ROUTE MAP

### Route R-01: `?query=GQ-NNN` (default query)

```
GET /api/execlens?query=GQ-001
    ↓  execFile('python3', [ADAPTER_42_4])
scripts/pios/42.4/execlens_adapter.py          [EX.3 modified]
    ↓  import pios_bridge → get_live_pios_data()
scripts/pios/EX.3/pios_bridge.py               [EX.3 new]
    ↓  subprocess
pios/core/v0.1/engine/compute_signals.py        [certified, unchanged]
pios/core/v0.1/engine/activate_conditions.py    [certified, unchanged]
    ↓  parallel via 42.2 → 42.1
docs/pios/41.5/query_signal_map.json            [L3 semantic — query resolution]
docs/pios/41.4/signal_registry.json             [L3 semantic — signal metadata]
docs/pios/41.4/evidence_mapping_index.json      [L3 semantic — evidence]
docs/pios/41.5/query_response_templates.md      [L3 semantic — narratives]
docs/pios/41.2/pie_vault/                       [L3 semantic — navigation]
    ↓  JSON stdout
pages/api/execlens.js
    ↓
HTTP response: governed JSON with CE.4/CE.5/CE.2 states per signal
```

**Data sources:**
- L3 semantic content (titles, statements, evidence, templates, navigation): from 41.x static files — CORRECT L3 reads
- CE.4 emission states: from live engine via pios_bridge
- CE.5 consumption states: from live engine via pios_bridge
- CE.2 condition tiers: from live engine via pios_bridge
- CE.2 diagnosis states: from live engine via pios_bridge

---

### Route R-02: `?list=true` (query list)

```
GET /api/execlens?list=true
    ↓
scripts/pios/42.4/execlens_adapter.py (--list path)
    ↓  via 42.2 → 42.1
docs/pios/41.5/query_signal_map.json            [L3 semantic — query metadata only]
```

**Data sources:** query metadata from 41.5 only. No governance states needed for list — list response has no signal-level content.

---

### Route R-03: `?overview=true`

```
GET /api/execlens?overview=true
    ↓
scripts/pios/42.6/execlens_overview_adapter.py  [EX.3 modified]
    ↓  import pios_bridge → get_live_pios_data()
scripts/pios/EX.3/pios_bridge.py
    ↓  subprocess → engine
pios/core/v0.1/engine/compute_signals.py
pios/core/v0.1/engine/activate_conditions.py
    ↓  also reads (for label/context fields)
docs/pios/41.4/signal_registry.json             [L3 semantic — labels and titles only]
    ↓
HTTP response: metric records with live numeric values + CE.4/CE.5/CE.2 states
```

**Data sources:**
- Metric numeric values (dependency_load, structural_density, coordination_pressure): from live engine
- Metric labels and context text: from 41.4 signal registry (L3 semantic)
- visibility_deficit value: from 41.4 signal title (L3 semantic, no engine equivalent)
- CE.4/CE.5/CE.2 states: from live engine

---

### Route R-04: `?topology=true`

```
GET /api/execlens?topology=true
    ↓
scripts/pios/42.7/execlens_topology_adapter.py  [EX.3 modified]
    ↓  import pios_bridge → get_live_pios_data()
scripts/pios/EX.3/pios_bridge.py
    ↓  subprocess → engine
pios/core/v0.1/engine/compute_signals.py
pios/core/v0.1/engine/activate_conditions.py
    ↓  also reads (for topology structure)
docs/pios/41.5/query_signal_map.json            [L3 semantic — query templates]
docs/pios/41.5/query_response_templates.md      [L3 semantic — drill-down sections]
docs/pios/41.2/pie_vault/                       [L3 semantic — entity paths]
    ↓
HTTP response: topology structure + pios_summary with all CE.2 condition/diagnosis states
```

**Data sources:**
- Topology structure (domain → capability → component hierarchy): from 41.x + co-occurrence (L3 structural)
- Emphasis values: from 44.2 projection attachment (L3 governed)
- CE.2 condition tiers (all 8): from live engine in pios_summary
- CE.2 diagnosis states (all 8): from live engine in pios_summary

---

### Route R-05: `?pios_live=true` (EX.1A)

```
GET /api/execlens?pios_live=true
    ↓
scripts/pios/EX.1A/pios_live_adapter.py         [EX.1A — unchanged]
    ↓  subprocess → engine
pios/core/v0.1/engine/...
    ↓
HTTP response: raw CE.4/CE.5/CE.2 governed JSON
```

**Status:** Unchanged from EX.1A. No L3 semantic content — pure engine output.

---

### Routes R-06 to R-08: `?status`, `?enl`, `?persona` (missing adapters)

These routes fail 400 (missing adapters 42.13/42.15/42.16). Not in EX.3 default-path scope.

---

## 3. DATA SOURCE CLASSIFICATION

| Source | Class | Status after EX.3 |
|---|---|---|
| `pios/core/v0.1/engine/compute_signals.py` | L2 Core — CE.4 emission | Default path (via pios_bridge) |
| `pios/core/v0.1/engine/activate_conditions.py` | L2 Core — CE.5/CE.2 | Default path (via pios_bridge) |
| `docs/pios/41.5/query_signal_map.json` | L3 Semantic | Correct L3 read — preserved |
| `docs/pios/41.4/signal_registry.json` | L3 Semantic | Correct L3 read — preserved for labels/metadata |
| `docs/pios/41.4/evidence_mapping_index.json` | L3 Semantic | Correct L3 read — preserved |
| `docs/pios/41.5/query_response_templates.md` | L3 Semantic | Correct L3 read — preserved |
| `docs/pios/41.2/pie_vault/` | L3 Semantic | Correct L3 read — preserved |
| `docs/pios/42.22/sample_runtime_output.json` | L3 — BD-002 | Still static (GC-003 + EX.3 WOW scope) |
| `docs/pios/44.2/projection_attachment.json` | L3 Governed | Read-only by 42.7 — preserved |
