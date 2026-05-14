# Governance Trace — 41.x Runtime Injection into Tier-2 Synthesis
## PI.41X.RUNTIME-INJECTION.TIER2.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.RUNTIME-INJECTION.TIER2.01  
**Layer:** 41.x → Tier-2 runtime synthesis  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Pre-flight

| Check | Result |
|---|---|
| `41.x/pressure_zone_projection.json` exists | PASS — JSON VALID |
| `41.x/signal_projection.json` exists | PASS — JSON VALID |
| `41.x/projection_manifest.json` exists | PASS — JSON VALID |
| `projection_manifest` references both projection files | PASS — `pressure_zone_projection.json` ✓ `signal_projection.json` ✓ |
| client_id matches run_01_oss_fastapi | PASS — `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| run_id matches run_01_oss_fastapi | PASS — `run_01_oss_fastapi` |

**Phase A result: PASS**

---

## Phase B — Code Changes

**Implementation target:** `scripts/pios/tier2_query_engine.py` (only)

### New functions added

**`_load_projection_artifact(client_id, run_id, filename) → Dict`**
- Constructs path: `clients/<client>/psee/runs/<run_id>/41.x/<filename>`
- Raises `FileNotFoundError` if artifact absent (fail-closed)
- No fallback to BlueEdge or any other client
- Uses `tier2_data.REPO_ROOT` for path anchor

**`list_zones_from_projection(client_id, run_id) → Dict`**
- Loads `pressure_zone_projection.json` + `signal_projection.json` from 41.x
- Joins condition records from signal_projection for full condition detail
- Returns normalized zone list with `inference_prohibition: ACTIVE`, `focus_domain_selected: false`, `ranking_applied: false`
- No derivation from canonical_topology or signal_registry
- No BlueEdge data touched

### CLI argument added

**`--projection`** (store_true)  
When set, routes `--list-zones` to `list_zones_from_projection()` before `tier2_data.configure()` is called.  
No BlueEdge canonical package is ever loaded in projection mode.  
WHY/EVIDENCE/TRACE for projection zones returns `NOT_SUPPORTED` (requires separate contract).

### Execution flow (projection mode)

```
--list-zones --projection --client <id> --run-id <run_id>
  → list_zones_from_projection(client_id, run_id)
    → _load_projection_artifact(..., "pressure_zone_projection.json")
    → _load_projection_artifact(..., "signal_projection.json")
    → build zone list from 41.x projection state
    → return {status, run_id, client_id, projection_source="41.x", zones[], ...}

41.x absent:
  → NOT_AVAILABLE / 41X_ARTIFACT_MISSING (exit 1)
  → no fallback
```

---

## Phase C — Validation

### Command 1: second-client 41.x projection zone listing

```bash
python3 scripts/pios/tier2_query_engine.py \
  --list-zones \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --projection
```

**Result:**
```json
{
  "status": "ok",
  "run_id": "run_01_oss_fastapi",
  "client_id": "e65d2f0a-dfa7-4257-9333-fcbb583f0880",
  "projection_source": "41.x",
  "projection_contract": "PI.41X.PRESSURE-ZONE.PROJECTION.01",
  "inference_prohibition": "ACTIVE",
  "focus_domain_selected": false,
  "ranking_applied": false,
  "combination_signature": {"primary": "PSIG-001|PSIG-002|PSIG-004", "all_active": "PSIG-001|PSIG-002|PSIG-004|PSIG-006"},
  "total_zones": 3,
  "zones": [
    {"zone_id": "PZ-001", "zone_type": "DOMAIN_ZONE", "zone_class": "COMPOUND_ZONE", "anchor_id": "DOM-03", "anchor_name": "backend_isolated", "attribution_profile": "secondary", "condition_count": 3, "conditions": [...]},
    {"zone_id": "PZ-002", "zone_type": "DOMAIN_ZONE", "zone_class": "COMPOUND_ZONE", "anchor_id": "DOM-04", "anchor_name": "frontend_isolated", "attribution_profile": "primary", "condition_count": 3, "conditions": [...]},
    {"zone_id": "PZ-003", "zone_type": "DOMAIN_ZONE", "zone_class": "COMPOUND_ZONE", "anchor_id": "DOM-05", "anchor_name": "platform_monorepo", "attribution_profile": "secondary", "condition_count": 3, "conditions": [...]}
  ]
}
```

**Validation checks:**

| Check | Result |
|---|---|
| zones derive from second-client 41.x package | PASS — `projection_source: "41.x"`, `client_id: e65d2f0a...` |
| signals/conditions derive from second-client 41.x package | PASS — PSIG-001/002/004 from `signal_projection.json`; `combination_signature` from 41.x |
| no BlueEdge fallback | PASS — `tier2_data.configure()` never called in projection mode |
| focus domain not selected | PASS — `focus_domain_selected: false` |
| no ranking introduced | PASS — `ranking_applied: false` |

### Command 2: no-fallback proof (absent 41.x artifacts)

```bash
python3 scripts/pios/tier2_query_engine.py \
  --list-zones --client nonexistent-client --run-id nonexistent-run --projection
```

**Result:**
```json
{"status": "NOT_AVAILABLE", "reason": "41X_ARTIFACT_MISSING", "detail": "41.x artifact not found — expected: clients/nonexistent-client/psee/runs/nonexistent-run/41.x/pressure_zone_projection.json"}
```

**Confirmed:** Fails closed with `NOT_AVAILABLE`, no fallback to BlueEdge or any other client.

### Command 3: BlueEdge regression check

```bash
python3 scripts/pios/tier2_query_engine.py --list-zones
```

**Result:** `status: ok`, `run_id: run_authoritative_recomputed_01`, `zones: 2` — unchanged. ✓

---

## Phase D — Reinjection Decision

### Can report generation resume?

**NO**

`lens_report_generator.py` reads `canonical_topology.json`, `signal_registry.json`, and `gauge_state.json` from `clients/<id>/psee/runs/<run_id>/package/`. The second client has no `package/` artifacts built. The report generator is not parameterized for second client in this contract. Separate contract required.

### Can workspace API wiring resume?

**YES** (engine-ready; API layer wiring is next)

`tier2_query_engine.py` now fully supports `--projection --client <id> --run-id <run_id>`. `zones.js` calls the engine via `execFile`. A separate contract extending `zones.js` to pass `--projection --client --run-id` for second-client requests would complete the wiring. The engine side is production-ready.

### Remaining blockers

1. **`zones.js` wiring** — `app/gauge-product/pages/api/zones.js:25` must be extended to pass `--projection --client <client_id> --run-id <run_id>` when serving second-client zone requests
2. **`lens_report_generator.py` parameterization** — report generator requires second-client `package/` artifacts (canonical_topology, signal_registry, gauge_state) before report generation can resume
3. **WHY/EVIDENCE/TRACE for projection zones** — query modes for PZ-XXX zones require a separate contract; currently return `NOT_SUPPORTED`

---

## Governance Confirmation

- No docs/pios/ files modified
- No 75.x state modified
- No 41.x artifacts modified
- No vault touched
- No graph_state touched
- No focus domain selected
- No ranking introduced
- No new signals created
- No BlueEdge client data accessed in projection mode
- No report generated
- Only file modified: `scripts/pios/tier2_query_engine.py`
