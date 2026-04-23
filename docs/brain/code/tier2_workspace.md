# tier2_workspace — Code Brain: Tier-2 Diagnostic Workspace

**Authority:** brain/code  
**Stream:** TIER2.WORKSPACE.MODEL.01  
**Implementation Status:** PHASE 1 IMPLEMENTED — live query engine operational  
**Updated:** 2026-04-23 (BRAIN.RECONCILE.LENS.TIER2.01)  
**Current state:** Static HTML export + WHY/EVIDENCE live query via /api/query + graph state

---

## What Exists (Implemented)

### Generator (`scripts/pios/lens_report_generator.py`)
- `_derive_tier2_zones()` — deterministic zone set from canonical inputs
- `_build_t2_zone_block()` — HTML per-zone block with sections A–F
- `_build_tier2_diagnostic_narrative()` — full HTML document (internal + publish-safe)
- `generate_tier2_reports()` — writes 2 files to `clients/blueedge/reports/tier2/`
- Zone blocks use native `<details>`/`<summary>` (collapsed by default)

### API (`app/gauge-product/pages/api/`)
- `report.js` — invokes generator `--tier1` (which also calls `generate_tier2_reports()`); returns `{status:"ok", files:[...]}`
- `report-file.js` — serves files from `reports/tier2/` and `reports/tier2/publish/` via `VALID_TIER2` regex
- `query.js` — WHY and EVIDENCE mode endpoint; validates zone_id + mode; calls tier2_query_engine.py

### Graph State
- `scripts/pios/export_graph_state.mjs` — Node.js script; imports d3-force-3d from workspace node_modules; builds topology in JSON insertion order; runs simulation with workspace parameters; persists to graph_state.json with `generated_from: "workspace_runtime_positions"`
- `clients/blueedge/reports/tier2/graph_state.json` — persisted positions; sole source of x/y for report graph

### UI (`app/gauge-product/pages/lens.js`)
- `ReportPanel` renders "Executive Report" + "Diagnostic" buttons after generation
- Buttons open static HTML in new tab — no interactive workspace

---

## What Is NOT Implemented

### Interactive Zone Workspace
- No `/tier2/workspace` page or route
- No zone selection → panel behavior
- No persistent workspace state
- No zone filtering/sorting UI

### WHY / TRACE / EVIDENCE Interaction Modes — PARTIALLY IMPLEMENTED
- **`/api/query` endpoint** — IMPLEMENTED (query.js; WHY + EVIDENCE modes)
- **WHY mode** — IMPLEMENTED (tier2_query_engine.py; classification rationale from canonical fields)
- **EVIDENCE mode** — IMPLEMENTED (tier2_query_engine.py; trace links + missing evidence)
- **TRACE mode** — DEFERRED (returns MODE_NOT_SUPPORTED; traversal engine not yet built)
- Static hook blocks in HTML export now link to live /api/query

### Traversal Engine
- No `tier2_trace_graph.py` or equivalent
- No graph traversal from zone anchor domain
- Propagation paths in static HTML are hardcoded per zone (DOMAIN-10 paths known; DOMAIN-02 labeled INFERRED)

### Navigation Model
- No zone inventory → zone workspace navigation
- No cross-zone linking within a workspace frame
- No deep linking (`/tier2/workspace?zone=ZONE-01`)
- No back navigation within workspace

### Evidence Interaction
- No interactive artifact link resolution
- No EVIDENCE mode result panel
- Missing evidence visible in static HTML only

---

## What Needs to Be Built (Phase 2)

### New files required:
- `app/gauge-product/pages/tier2/workspace.js` — main workspace page with zone inventory sidebar + zone panel
- `app/gauge-product/pages/api/query.js` — WHY/TRACE/EVIDENCE mode API endpoint
- `scripts/pios/tier2_trace_graph.py` — zone-scoped traversal engine (depth ≤ 2)
- `app/gauge-product/components/tier2/ZoneInventory.jsx` — sortable/filterable zone list
- `app/gauge-product/components/tier2/ZoneWorkspace.jsx` — full zone view with A–F sections
- `app/gauge-product/components/tier2/ModePanel.jsx` — WHY/TRACE/EVIDENCE result panel
- `app/gauge-product/components/tier2/TraceView.jsx` — zone-scoped propagation visualization

### API contract:
```
GET /api/query?zone_id=ZONE-01&mode=WHY
GET /api/query?zone_id=ZONE-01&mode=TRACE&direction=DOWNSTREAM&depth=2
GET /api/query?zone_id=ZONE-01&mode=EVIDENCE&scope=FULL
```
Responses: `{status:"ok", zone_id, mode, result: {...}}`

### Data model (`tier2_trace_graph.py`):
- Input: canonical_topology.json + signal_registry.json + zone_id + mode params
- WHY: returns zone_type derivation rationale struct
- TRACE: returns path list `[{path_id, chain, direction, evidence_strength, type}]`
- EVIDENCE: returns `{available:[...], missing:[...], signal_coverage:{...}}`

### Generator changes needed (Phase 2):
- `generate_tier2_reports()` already writes the static snapshot — no change needed for export
- Static HTML zone blocks can remain as-is; workspace is a separate runtime surface

---

## Evidence/Inference Boundary (Code Constraint)

All code in the workspace must enforce:
- `inference_prohibition: ACTIVE` — no generated advisory text
- INFERRED paths declared explicitly, never silently omitted or promoted
- WHY/TRACE/EVIDENCE outputs are constructed from canonical data only (no LLM, no heuristic interpolation)
- Missing evidence is surfaced as structural fact, not as a prompt to the user

---

## Dependencies

- `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/canonical_topology.json`
- `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/signal_registry.json`
- `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json`
- All three must be present — no fallback or synthetic substitute allowed

---

## Branch Note

All workspace implementation must occur on a feature branch scoped to this work.  
The static HTML export on `feature/tier2-diagnostic-narrative-implement-01` is the current baseline.
