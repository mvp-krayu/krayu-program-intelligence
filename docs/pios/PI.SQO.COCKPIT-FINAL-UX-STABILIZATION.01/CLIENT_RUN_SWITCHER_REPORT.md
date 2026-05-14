# Client/Run Switcher Report

## Design

Simple toggle-able panel in the left navigation rail, below the identity header.

## Data Flow

1. `SQOWorkspaceDataResolver.resolveWorkspaceData()` calls `resolveClientList()`
2. `clientRuns` array included in page props (both success and error paths)
3. `SQOWorkspaceShell` passes `clientRuns` to `SQONavigation`
4. `SQONavigation` filters out current client/run, renders switcher for others

## Available Targets

| Client | Run ID |
|--------|--------|
| fastapi | run_02_oss_fastapi_pipeline |
| blueedge | run_blueedge_productized_01_fixed |

## Switcher Behavior

- Toggle button: "Switch client/run ▾" / "Switch client/run ▴"
- Collapsed by default (no visual clutter)
- Each target is a Next.js Link to `/sqo/client/{client}/run/{run}`
- Full page navigation (not shallow) — correct since different client loads different data
- Run IDs truncated with ellipsis at 170px

## Not Implemented

- Autocomplete
- Search
- New data model
- Complex UX
