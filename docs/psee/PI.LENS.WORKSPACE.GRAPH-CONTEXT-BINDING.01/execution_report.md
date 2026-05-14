# Execution Report
## PI.LENS.WORKSPACE.GRAPH-CONTEXT-BINDING.01

**Date:** 2026-05-03  
**Branch:** work/psee-runtime  
**Baseline commit:** bc6cdeceb42eac215c532be21bfada9ff471bb14

---

## Pre-Flight

| Check | Result |
|-------|--------|
| Branch | work/psee-runtime — AUTHORIZED for runtime/UI work |
| Baseline commit | bc6cdeceb42eac215c532be21bfada9ff471bb14 |
| Working tree | CLEAN at pre-flight |
| Contract inputs present | YES |
| graph_state.json accessible | YES — clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/graph_state.json |
| VaultGraph interface confirmed | YES — buildGraph(zone, vi, qs, isOverview) reads vi.signals, vi.artifacts, vi.claims |

---

## Investigation Findings

### Root cause: vaultIndex always null

`workspace.js` resolved vault index via:
```js
const VAULT_INDEX_URL = (_VAULT_CLIENT && _VAULT_RUN_ID)
  ? `/vault/${_VAULT_CLIENT}/${_VAULT_RUN_ID}/vault_index.json`
  : null
```

`NEXT_PUBLIC_VAULT_CLIENT` and `NEXT_PUBLIC_VAULT_RUN_ID` are not set in the running environment.  
Result: `VAULT_INDEX_URL = null` → fetch never runs → `vaultIndex = null`.

### VaultGraph with vi=null

`buildGraph(zone, null, qs, isOverview)`:
- Iterates `Object.entries(vi?.signals ?? {})` → empty → no signal/claim nodes
- Iterates `Object.keys(vi?.artifacts ?? {})` → empty → no artifact nodes
- Only node added: zone root via `addNode(zone.zone_id, 'ZONE', ...)`
- Result: 1 node, 0 links → single dot rendered

### graph_state.json (18 nodes, 17 links)

Located at: `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/graph_state.json`

- 1 ZONE (ZONE-01)
- 5 SIGNAL (SIG-001..SIG-005), each linked to a CLAIM
- 5 CLAIM (CLM-20..CLM-24)
- 7 ARTIFACT (ART-01..ART-07)

Accessible via: `/api/report-file?source=psee&client=blueedge&runId=run_blueedge_productized_01_fixed&name=graph_state.json`  
`report-file.js` line 143 explicitly allows `graph_state.json` in the psee route.

### Node ID mismatch

`graph_state.json` ZONE node ID: `ZONE-01`  
zones API zone_id: `PZ-001`

`VaultGraph` always adds zone root as `zone.zone_id` — not from `vi`. Signal nodes from `vi.signals` (SIG-001..SIG-005) are added and linked from `zone.zone_id = PZ-001`. Both are in `seen` set; `addLink` validates both exist. No collision.

---

## Implementation

### workspace.js changes

1. **Removed** static vault index env var block (`_VAULT_CLIENT`, `_VAULT_RUN_ID`, `VAULT_INDEX_URL`)
2. **Added** `effectiveReportRun = router.query.reportRun || effectiveDisplayRun || null`
3. **Replaced** static vault index useEffect with dynamic graph_state.json loader:
   - Fetches `graph_state.json` via psee route using `effectiveClient` + `effectiveReportRun`
   - Builds `signals` map from SIGNAL→CLAIM links
   - Builds `artifacts` map from ARTIFACT nodes
   - Builds `claims` map from CLAIM nodes
   - Sets `vaultIndex = { export_status: 'EXPORTED', base_url: null, signals, artifacts, claims }`

### Expected outcome

VaultGraph renders 18 nodes (PZ-001 + SIG-001..SIG-005 + CLM-20..CLM-24 + ART-01..ART-07) with 17 links.  
No external vault link navigation (base_url null).  
EVIDENCE / TRACE / WHY query modes continue to function via vault_targets and node_chain IDs.

---

## No Pipeline Attestation

- No pipeline executed
- No renderer modified (`scripts/pios/lens_report_generator.py` unchanged)
- No canonical data modified
- No semantic bundle modified
- No FastAPI involved
