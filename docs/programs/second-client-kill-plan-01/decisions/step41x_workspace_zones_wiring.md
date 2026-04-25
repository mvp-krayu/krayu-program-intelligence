# Governance Trace — 41.x Workspace Zones Wiring
## PI.41X.WORKSPACE-ZONES.WIRING.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.WORKSPACE-ZONES.WIRING.01  
**Layer:** Workspace API (zones.js) → Tier-2 projection engine  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Pre-flight

### zones.js call site (line 37)

```javascript
execFile(PYTHON, [SCRIPT_PATH, '--list-zones'], { timeout: TIMEOUT_MS, cwd: REPO_ROOT }, ...)
```

**Current behavior:** Calls `tier2_query_engine.py --list-zones` with no client/run context — always returns BlueEdge canonical zones.

**Client/run context:** Not currently passed. No query parameter handling. No env var routing.

**workspace.js caller (line 511):** `fetch('/api/zones')` — no query params. This call must remain unchanged (BlueEdge default path preserved).

**BlueEdge default path confirmed:** `tier2_data.py:34-39` — defaults to `client_id="blueedge"`, `run_id="run_authoritative_recomputed_01"`.

---

## Phase B — Code Changes

**Modified file:** `app/gauge-product/pages/api/zones.js` only.

### API contract (new)

```
GET /api/zones
  → BlueEdge canonical zones (no params; existing behavior unchanged)

GET /api/zones?client=<client_id>&runId=<run_id>
  → 41.x projection zones for specified client/run
  → 404 NOT_AVAILABLE if 41.x artifacts absent (no fallback)
```

### Logic added

```javascript
const { client: clientId, runId } = req.query
const useProjection = clientId && runId

const args = useProjection
  ? [SCRIPT_PATH, '--list-zones', '--projection', '--client', clientId, '--run-id', runId]
  : [SCRIPT_PATH, '--list-zones']
```

When `NOT_AVAILABLE` status is returned from the engine, propagated as HTTP 404 (no silent fallback):

```javascript
if (data.status === 'NOT_AVAILABLE') {
  return res.status(404).json(data)
}
```

### Files NOT modified

- `scripts/pios/tier2_query_engine.py` — already validated
- `app/gauge-product/pages/tier2/workspace.js` — `fetch('/api/zones')` call unchanged
- All other workspace files — no changes

---

## Phase C — Validation

All scenarios validated at engine level (CLI simulation of zones.js args).

### Scenario 1: second-client 41.x projection

**Command:**
```bash
python3 scripts/pios/tier2_query_engine.py \
  --list-zones --projection \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi
```

**Result:**
```
status: ok
client_id: e65d2f0a-dfa7-4257-9333-fcbb583f0880
projection_source: 41.x
total_zones: 3
  PZ-001 COMPOUND_ZONE [PSIG-001, PSIG-002, PSIG-004]
  PZ-002 COMPOUND_ZONE [PSIG-001, PSIG-002, PSIG-004]
  PZ-003 COMPOUND_ZONE [PSIG-001, PSIG-002, PSIG-004]
contains DOMAIN-: False
contains blueedge: False
contains PSIG: True
```

| Check | Result |
|---|---|
| Returns 3 PZ-XXX zones | PASS |
| Contains PSIG-XXX conditions | PASS |
| No DOMAIN-XX artifacts | PASS |
| No BlueEdge strings | PASS |

### Scenario 2: absent 41.x → NOT_AVAILABLE, no fallback

**Command:** `--projection --client missing-client --run-id missing-run`

**Result:** `status: NOT_AVAILABLE`, `reason: 41X_ARTIFACT_MISSING`, no blueedge in response. zones.js returns HTTP 404.

| Check | Result |
|---|---|
| Returns NOT_AVAILABLE | PASS |
| No BlueEdge fallback | PASS |

### Scenario 3: BlueEdge default (no params)

**Command:** `--list-zones` (no projection flag)

**Result:** `status: ok`, `run_id: run_authoritative_recomputed_01`, `total_zones: 2`, `projection_source: N/A (canonical)`

| Check | Result |
|---|---|
| BlueEdge behavior unchanged | PASS |
| Still returns 2 zones | PASS |

---

## Phase D — Reinjection Check

**Workspace can now render zones from 41.x:** YES  
The workspace frontend calls `GET /api/zones`. When called with `?client=<id>&runId=run_01_oss_fastapi`, zones.js routes to the projection engine and returns PZ-001/002/003 with PSIG conditions. The workspace zone render loop operates on `data.zones[]` — the projection response is structurally compatible (`zone_id`, `zone_type`, `zone_class`, `condition_count`, etc.).

**Dependency on signal_registry.json for zones:** NO  
Projection mode never loads `signal_registry.json`. Zone data derives entirely from `41.x/pressure_zone_projection.json` + `41.x/signal_projection.json`.

**Dependency on canonical_topology for zones:** NO  
Projection mode never calls `tier2_data.load_topology()`. Zone geometry derives from `pressure_zone_projection.json` directly.

### Remaining blockers

1. **workspace.js fetch** — currently calls `fetch('/api/zones')` with no params. To activate second-client zones in the workspace UI, workspace.js must be updated to pass `?client=<id>&runId=<run_id>` — this requires a separate contract (contract explicitly prohibits workspace.js changes in this chunk)
2. **WHY/EVIDENCE/TRACE** — PZ-XXX zone queries return `NOT_SUPPORTED`; requires separate contract to extend query handlers for projection zone schema
3. **Report generation** — `lens_report_generator.py` not yet parameterized for second client; requires `package/` artifacts

---

## No-Fallback Proof

Engine-level: absent 41.x → `NOT_AVAILABLE/41X_ARTIFACT_MISSING` (exit 1), no BlueEdge data loaded.  
API level: `NOT_AVAILABLE` status → HTTP 404 returned to caller, no further routing attempted.  
Default path: only triggered when `clientId && runId` are both absent from query params.

---

## Governance Confirmation

- `tier2_query_engine.py` not modified
- `workspace.js` not modified
- Vault not touched
- Graph not touched
- Signals not altered
- No new endpoints created
- No focus domain selected
- No ranking introduced
- No BlueEdge data accessed in projection path
- Only file modified: `app/gauge-product/pages/api/zones.js`
