# Artifact Route Binding Fix Report

**Stream:** PI.SQO.COCKPIT.BLUEEDGE-ARTIFACT-ROUTE-BINDING-FIX.01

---

## 1. Problem

The SQO Cockpit for BlueEdge displayed:

> Cockpit Unavailable — No SQO artifacts found for this client/run.

for the route family `/sqo/client/blueedge/run/run_blueedge_productized_01_fixed`.

## 2. Root Cause

BlueEdge SQO artifact files under `artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/*.v1.json` were deleted from the working tree (present in git HEAD but absent on disk). The artifact loader (`SQOCockpitArtifactLoader.js`) loads from explicit filesystem paths — when 0 of 15 artifacts were found, `loadAllCockpitArtifacts` returned `ok: false`, triggering `NO_SQO_DATA` degradation state → `CLIENT_REGISTERED_NO_SQO` cockpit state → "Cockpit Unavailable" display.

This was a file-level binding defect, not a governance, evidence, or extraction failure.

## 3. Fix

### 3.1 Artifact Restoration

Restored all deleted artifact files from git HEAD:

- `artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/` — 15 SQO v1.json artifacts + sandbox directories
- `artifacts/sqo/fastapi/run_02_oss_fastapi_pipeline/` — 15 FastAPI SQO v1.json artifacts

No artifacts were regenerated or mutated. Files were restored to their committed state.

### 3.2 Artifact Binding Diagnostics

Added diagnostic reporting to `SQOCockpitArtifactLoader.loadAllCockpitArtifacts()`:

- `diagnostics.client` — which client was queried
- `diagnostics.run_id` — which run was queried
- `diagnostics.artifact_root` — expected artifact directory path
- `diagnostics.present` — list of found artifacts with paths
- `diagnostics.missing` — list of missing artifacts with expected paths and MISSING_REQUIRED/MISSING_OPTIONAL classification
- `diagnostics.has_required_missing` — boolean flag for critical artifact absence

### 3.3 Degraded State Diagnostics Display

Updated `SQODegradedState.jsx` to show binding diagnostics when available:

- Client, run, expected path
- Present/missing artifact counts
- Individual missing artifact paths with required/optional status badges

### 3.4 SSR Prop Normalization

Added `normalizeSSRProps()` to `SQOWorkspaceDataResolver.js`:

- Recursively converts all `undefined` values to `null`
- Ensures JSON-serializable SSR props
- Applied to all `resolveWorkspaceData` return paths

## 4. Artifacts Not Mutated

| Check | Verified |
|-------|----------|
| No evidence re-ingestion | YES |
| No candidate extraction re-run | YES |
| No Dynamic CEU re-run | YES |
| No overlay generation | YES |
| No grounding mutation | YES |
| No qualification mutation | YES |
| No authority assertion | YES |
| No LENS mutation | YES |
| No broad repo search | YES |
| No FastAPI fallback | YES |
| No mock/demo fallback | YES |
