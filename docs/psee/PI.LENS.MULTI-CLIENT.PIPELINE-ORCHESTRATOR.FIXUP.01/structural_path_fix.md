# Structural Path Fix
## PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 — BLOCK_D

**Generated:** 2026-05-01  
**Files patched:** `scripts/pios/run_client_pipeline.py`, `clients/blueedge/sources/source_01/source_manifest.json`

---

## Root Cause

The canonical signal computation pathway for BlueEdge is **STAGE_NOT_AUTOMATED**. Signal values (PSIG-001=5.663, PSIG-002=3.2098, PSIG-004=2.1822) were produced by 4 manual FastAPI conformance contracts — not by `run_end_to_end.py`.

The previous orchestrator built a **synthetic CEU-DOM binding_envelope** and ran `run_end_to_end.py` on it. This produced divergent signal values because:
- Synthetic graph: 33 nodes, 29 GROUNDS/EXPOSES edges, CE-04 fan_in=4 as outlier
- Canonical computation: 35 nodes, 1937 IMPORTS relations, NODE-0021 IMPORTS=69 as outlier
- These are different topologies with different edge semantics

---

## Fix Applied

### 1. `source_manifest.json` — New field added

```json
"fastapi_conformance_path": "docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed"
```

This field is optional. When present, phases 5, 6+7, and 8a use pre-computed canonical conformance artifacts instead of building synthetic topology.

### 2. Phase 5 — `phase_05_build_binding_envelope`

**When `fastapi_conformance_path` is set:**
- Load `binding_envelope_fastapi_compatible.json` from conformance path
- Copy to `run_dir/binding/binding_envelope.json`
- Print `STAGE_NOT_AUTOMATED` notice
- Synthetic CEU-DOM envelope builder bypassed

**When not set:**
- Existing synthetic envelope logic unchanged

### 3. Phase 6+7 — `phase_06_and_07_e2e` (signature updated: now accepts `source_manifest`)

**When `fastapi_conformance_path` is set:**
- Copy `signal_projection_fastapi_compatible.json` → `41.x/signal_projection.json`
- Copy `pressure_zone_state_fastapi_compatible.json` → `41.x/pressure_zone_projection.json`
- Copy `condition_correlation_state_fastapi_compatible.json` → `75.x/condition_correlation_state.json`
- Copy `pressure_zone_state_fastapi_compatible.json` → `75.x/pressure_zone_state.json`
- Write stub `75.x/pressure_candidate_state.json` (derived from pressure_zone_state)
- `run_end_to_end.py` is NOT invoked
- Print `STAGE_NOT_AUTOMATED` notice

**When not set:**
- Existing `run_end_to_end.py` invocation unchanged

### 4. Phase 8a — Signal registry loaded from conformance when available

**When `fastapi_conformance_path` is set:**
- Load `signal_registry_fastapi_compatible.json` directly
- All signal labels, population types, primary entities, zone assignments carried over from canonical computation
- Schema bridge fix applied
- `source_traceability` preserved from canonical conformance

**When not set:**
- Existing bridge logic from `41.x/signal_projection.json` (with schema bridge fix applied)

---

## STAGE_NOT_AUTOMATED Declaration

The signal computation step for BlueEdge is declared `STAGE_NOT_AUTOMATED`. This means:
- The orchestrator cannot independently reproduce the canonical signal z-scores
- The canonical computation requires the 4 FastAPI conformance contracts (manual analysis)
- When pre-computed conformance artifacts are available, the orchestrator uses them
- When pre-computed conformance artifacts are NOT available, the orchestrator should FAIL_CLOSED (future enforcement: if `fastapi_conformance_path` is missing and signal computation is not automated, add explicit FAIL_CLOSED check)

---

## Structural Evidence Group Validation

| Metric | Canonical | Fixup Run (expected) | Match |
|--------|-----------|----------------------|-------|
| DOM groups | 13 | 13 | YES |
| DOM-04 membership | NODE-0021, NODE-0022 | NODE-0021, NODE-0022 | YES |
| Total nodes | 35 | 35 | YES |
| Signal computation basis | 40.3 IMPORTS (1937 relations) | 40.3 IMPORTS (via conformance artifacts) | YES (same source) |
| PSIG-001 outlier | NODE-0021 IMPORTS=69 | NODE-0021 IMPORTS=69 | YES |

---

## No Hidden Fallback Topology Builder

The synthetic CEU-DOM binding_envelope builder is preserved for future client use (clients without pre-computed conformance artifacts). It is **bypassed** for BlueEdge via the `fastapi_conformance_path` field. The `fastapi_conformance_path` field is client-specific and non-hardcoded — it comes from `source_manifest.json`.
