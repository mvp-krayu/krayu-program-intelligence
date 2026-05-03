# Graph Context Binding Summary
## PI.LENS.WORKSPACE.GRAPH-CONTEXT-BINDING.01

**Date:** 2026-05-03

---

## Root Cause

`vaultIndex` was always null because:
- `VAULT_INDEX_URL` depended on `NEXT_PUBLIC_VAULT_CLIENT` / `NEXT_PUBLIC_VAULT_RUN_ID` env vars
- Those env vars are not set in the runtime environment
- `VaultGraph.buildGraph` with `vi=null` produces exactly 1 node (zone root only) → single dot

---

## Fix: Dynamic Bundle-Aware vault index from graph_state.json

### Old behavior

```js
const _VAULT_CLIENT   = process.env.NEXT_PUBLIC_VAULT_CLIENT || null
const _VAULT_RUN_ID   = process.env.NEXT_PUBLIC_VAULT_RUN_ID || null
const VAULT_INDEX_URL = (_VAULT_CLIENT && _VAULT_RUN_ID)
  ? `/vault/${_VAULT_CLIENT}/${_VAULT_RUN_ID}/vault_index.json`
  : null
// → VAULT_INDEX_URL = null → vaultIndex never loaded
```

### New behavior

`workspace.js` fetches `graph_state.json` via the existing psee file route:

```
GET /api/report-file?source=psee&client=<effectiveClient>&runId=<effectiveReportRun>&name=graph_state.json
```

Graph state is synthesized into a `vaultIndex` object from the graph_state nodes and links:
- `signals` map: `{ SIG-001: 'CLM-20', SIG-002: 'CLM-21', ... }` (from SIGNAL→CLAIM links)
- `artifacts` map: `{ ART-01: null, ART-02: null, ... }` (from ARTIFACT nodes)
- `claims` map: `{ CLM-20: null, ... }` (from CLAIM nodes)
- `export_status: 'EXPORTED'` — satisfies VaultGraph check
- `base_url: null` — no external vault URLs available; no link navigation generated

---

## graph_state.json Structure (BlueEdge)

| Run | Path |
|-----|------|
| `run_blueedge_productized_01_fixed` | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/graph_state.json` |

Nodes: 18 — ZONE-01, SIG-001..SIG-005, CLM-20..CLM-24, ART-01..ART-07  
Links: 17 — ZONE→SIG (×5), SIG→CLM (×5), ZONE→ART (×7)

---

## Node ID Handling

`graph_state.json` uses ZONE-01/SIG-001 format.  
zones API returns `zone_id = PZ-001`.

`VaultGraph.buildGraph` adds zone root as `zone.zone_id` (PZ-001), then links `PZ-001 → SIG-001..SIG-005`. This is correct: `addLink` only requires both node IDs to exist in the `seen` set. The zone root (PZ-001) is always added first; signals from `vi.signals` are added next. All links are valid.

Result: 18 nodes rendered (1 zone + 5 signals + 5 claims + 7 artifacts), 17 links.

---

## Parameters Added

| Param | Source |
|-------|--------|
| `effectiveReportRun` | `router.query.reportRun \|\| effectiveDisplayRun \|\| null` |

Used as `runId` for the psee file route to locate graph_state.json in the correct run's reports directory.
