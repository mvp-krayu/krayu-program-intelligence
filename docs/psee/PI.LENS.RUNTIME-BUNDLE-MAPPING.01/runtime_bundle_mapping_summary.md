# Runtime Bundle Mapping Summary
## PI.LENS.RUNTIME-BUNDLE-MAPPING.01

**Date:** 2026-05-03
**Branch:** work/psee-runtime

---

## Problem Resolved

One selected run was used for all concerns. For BlueEdge:
- `run_blueedge_productized_01_fixed` contains reports + semantic bundle
- `run_blueedge_productized_01` contains the vault and 41.x zone data

Passing `_fixed` to workspace → zones API → `41X_ARTIFACT_MISSING` (no zone data there)
Passing the vault run to workspace → zones API → `ok 1 zones`

## Bundle Mapping Introduced

Authoritative mapping in `runtime-list.js` under `BUNDLE_OVERRIDES`:

```
Key: "blueedge::run_blueedge_productized_01_fixed"
  vault_run:    run_blueedge_productized_01
  semantic_run: run_blueedge_productized_01_fixed
```

All other clients default to: `vault_run = display_run`

## Runtime Object Shape

`/api/runtime-list` now returns:

| Field | Value (BlueEdge) |
|-------|-----------------|
| `client` | `blueedge` |
| `display_run` | `run_blueedge_productized_01_fixed` |
| `report_run` | `run_blueedge_productized_01_fixed` |
| `vault_run` | `run_blueedge_productized_01` |
| `semantic_run` | `run_blueedge_productized_01_fixed` |
| `run` | `run_blueedge_productized_01_fixed` (backward compat alias) |
| `vault_path` | `clients/blueedge/psee/runs/run_blueedge_productized_01/vault` |
| `semantic_path` | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic` |
| `reports_path` | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports` |

## Generate Response

`/api/generate-report` now also includes:
- `vault_run`
- `workspace_url` with full bundle params: `?client=...&displayRun=...&vaultRun=...&reportRun=...`

## UI (lens.js)

`RuntimeSelector` uses `display_run` for dropdown key/label/generate call.
Workspace button URL derived from full bundle fields (pre-generate) or `workspace_url` from response (post-generate).

## Workspace (workspace.js)

Reads `vaultRun` → all API calls (`/api/zones`, `/api/query`)
Reads `displayRun` → topbar run label
Reads `reportRun` → available for report context (currently unused in queries)
Falls back to `runId` for backward compat.
