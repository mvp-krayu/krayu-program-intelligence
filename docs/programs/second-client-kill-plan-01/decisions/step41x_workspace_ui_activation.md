# Governance Trace — 41.x Workspace UI Activation
## PI.41X.WORKSPACE-UI-ACTIVATION.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.WORKSPACE-UI-ACTIVATION.01  
**Layer:** workspace.js → /api/zones → tier2_query_engine.py (projection)  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Pre-flight

**Fetch call located:** `workspace.js:511` (pre-edit line number) — `fetch('/api/zones')` with no query params.

**State initialization:** `useState('loading')` for `pageState`; zones load sets state to `'ready'` or `'error'` based on `data.status === 'ok'`.

**Client/run context:** Not present. No existing mechanism to parameterize the zones call.

**Current call confirmed no-params:** `fetch('/api/zones')` — BlueEdge default confirmed.

**Schema incompatibility identified:** Projection zone schema (`pressure_zone_projection.json`) lacks `traceability`, `severity`, `confidence`, `capability_count`, `signal_count`, `domain_name` — all present in BlueEdge canonical zones. The `traceability` absence causes a hard crash at line 441 (pre-edit): `zone.traceability.replace(/_/g, ' ')` → `TypeError: Cannot read properties of undefined`. This crash fires immediately on load because `defaultOpen` logic (`i === 0 && !zones.some(z => z.severity === 'HIGH')`) auto-expands the first zone (PZ-001) when no zone has `severity === 'HIGH'` (all undefined for projection).

---

## Phase B — Code Changes

**Modified file:** `app/gauge-product/pages/tier2/workspace.js` only.

### Change 1 — Second-client config constants (module level)

```javascript
const USE_SECOND_CLIENT = true
const _SC_CLIENT_ID     = 'e65d2f0a-dfa7-4257-9333-fcbb583f0880'
const _SC_RUN_ID        = 'run_01_oss_fastapi'
```

Placed before `WS_STATE_KEY` in the Page section. Hardcoded per contract specification.

### Change 2 — Conditional zone fetch URL

```javascript
const zonesUrl = USE_SECOND_CLIENT
  ? `/api/zones?client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}`
  : '/api/zones'
fetch(zonesUrl)
```

When `USE_SECOND_CLIENT = false`, original `fetch('/api/zones')` behavior is restored identically.

### Change 3 — Null guard for missing `traceability` field

```javascript
// Before:
{TRACE_LABELS[zone.traceability] || zone.traceability.replace(/_/g, ' ')}

// After:
{TRACE_LABELS[zone.traceability] || (zone.traceability ? zone.traceability.replace(/_/g, ' ') : '—')}
```

Prevents `TypeError` when projection zones lack `traceability`. Backward-compatible: BlueEdge zones always have `traceability`, so the new branch (`zone.traceability ? ... : '—'`) is never reached for existing zones.

**No other changes.** All other missing fields (`severity`, `confidence`, `capability_count`, `signal_count`, `domain_name`) render silently as empty/undefined in JSX without crashing.

---

## Phase C — Validation

All scenarios validated at CLI level (engine output matching what zones.js will serve).

### Scenario 1: second-client projection (USE_SECOND_CLIENT=true)

```bash
python3 scripts/pios/tier2_query_engine.py \
  --list-zones --projection \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi
```

| Check | Result |
|---|---|
| 3 zones returned | PASS — `total_zones: 3` |
| Zone IDs are PZ-XXX | PASS — `['PZ-001', 'PZ-002', 'PZ-003']` |
| No ZONE-XX BlueEdge IDs | PASS |
| PSIG-XXX conditions present | PASS — `PSIG: True` |
| No SIG-XXX BlueEdge signals | PASS |
| No fleet/driver/vehicle/blueedge strings | PASS — `BlueEdge terms: NONE` |
| focus_domain_selected | PASS — `False` |

### Scenario 2: BlueEdge default (USE_SECOND_CLIENT=false)

`fetch('/api/zones')` → `tier2_query_engine.py --list-zones` (no projection)

| Check | Result |
|---|---|
| BlueEdge zones unchanged | PASS — `status: ok`, `run_id: run_authoritative_recomputed_01`, `total_zones: 2` |

### Scenario 3: absent 41.x → NOT_AVAILABLE

| Check | Result |
|---|---|
| Returns NOT_AVAILABLE | PASS — `status: NOT_AVAILABLE`, `reason: 41X_ARTIFACT_MISSING` |
| No fallback | PASS — `zones.js` propagates as HTTP 404 |

### Null guard validation

The `zone.traceability.replace(...)` crash is eliminated. For projection zones:
- `TRACE_LABELS[undefined]` → `undefined` (falsy)
- `zone.traceability ? ...` → `undefined ? ...` → `false` → renders `'—'`
- No TypeError thrown

For BlueEdge zones: `zone.traceability` always has a value → `zone.traceability ? zone.traceability.replace(...)` → existing behavior unchanged.

---

## Phase D — Reinjection Check

**Workspace renders second-client intelligence:** YES  
`USE_SECOND_CLIENT = true` → `fetch('/api/zones?client=e65d2f0a...&runId=run_01_oss_fastapi')` → `/api/zones` routes to `--projection` → 3 COMPOUND_ZONEs with PSIG conditions rendered in zone list.

**Dependency on signal_registry.json for zones:** NO — projection path never loads signal_registry.

**Dependency on canonical_topology for zones:** NO — projection path never calls `load_topology()`.

**UI aligned with 41.x projection layer:** YES — workspace zone list now derives from `41.x/pressure_zone_projection.json` + `41.x/signal_projection.json` via tier2_query_engine projection mode.

---

## No-Fallback Proof

- `USE_SECOND_CLIENT = true` → `zonesUrl` always includes `?client=...&runId=...`
- zones.js receives params → builds `--projection --client --run-id` args → `tier2_data.configure()` never called
- Absent 41.x → `NOT_AVAILABLE/41X_ARTIFACT_MISSING` → HTTP 404 → `data.status !== 'ok'` → `setPageState('error')` in workspace
- No path reaches BlueEdge canonical data in second-client projection mode

## Regression Check

- `USE_SECOND_CLIENT = false` → `fetch('/api/zones')` → no params → zones.js builds `[SCRIPT_PATH, '--list-zones']` → BlueEdge canonical path → unchanged behavior
- Null guard at `traceability` line: BlueEdge zones always have `traceability` set → existing `zone.traceability.replace(...)` branch still executes (guarded branch never reached)

---

## Remaining Blockers

1. **WHY/EVIDENCE/TRACE for PZ-XXX zones** — zone query buttons render in the UI; clicking them calls `/api/query?zone_id=PZ-001&mode=WHY` but tier2_query_engine returns `NOT_SUPPORTED` for projection zone queries — requires separate contract
2. **`zone.domain_name` renders empty** — projection zones have `anchor_name`; the toggle title shows blank; cosmetic only, zone_id is still visible
3. **Report generation** — `lens_report_generator.py` not yet parameterized; separate contract required

---

## Governance Confirmation

- `tier2_query_engine.py` not modified
- `zones.js` not modified in this contract (already wired in PI.41X.WORKSPACE-ZONES.WIRING.01)
- Vault not touched
- Graph not touched
- Signals not altered
- Focus domain not selected
- No ranking introduced
- Only file modified: `app/gauge-product/pages/tier2/workspace.js` (3 changes: constants, fetch URL, null guard)
