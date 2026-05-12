# SSR Serialization and Fail-Closed Validation

**Stream:** PI.SQO.COCKPIT.BLUEEDGE-ARTIFACT-ROUTE-BINDING-FIX.01

---

## 1. Purpose

Validates that all SSR (Server-Side Rendering) props returned from `getServerSideProps` are JSON-serializable and that the cockpit fails closed with explicit diagnostics when artifacts are missing.

## 2. SSR Serialization

### 2.1 Problem

Next.js `getServerSideProps` requires all props to be JSON-serializable. `undefined` values cause SSR serialization errors because `JSON.stringify(undefined)` produces `undefined` (not a valid JSON value).

### 2.2 Solution

`normalizeSSRProps()` recursively traverses the props object and converts:

- `undefined` → `null`
- Arrays → recursively normalized
- Objects → recursively normalized
- Primitives (string, number, boolean, null) → unchanged

Applied to all `resolveWorkspaceData()` return values.

### 2.3 Coverage

| Property | Type | Normalization |
|----------|------|--------------|
| error | null or string | Already safe |
| cockpitState | object | Normalized |
| navigation | array of objects | Normalized |
| clientRuns | array | Normalized |
| degradation | object or null | Normalized |
| degradedNotice | object or null | Normalized |
| isCritical | boolean | Already safe |
| journey | object or null | Normalized |
| visualState | object or null | Normalized |
| attentionHierarchy | object or null | Normalized |
| workflowDominance | object or null | Normalized |
| deferredVisibility | object or null | Normalized |
| sectionData | object or null | Normalized |
| initialSection | string | Already safe |

## 3. Fail-Closed Diagnostics

### 3.1 Artifact Binding Diagnostics

When artifacts are missing, `loadAllCockpitArtifacts` now returns structured diagnostics:

```
diagnostics: {
  client: "blueedge",
  run_id: "run_blueedge_productized_01_fixed",
  artifact_root: "artifacts/sqo/blueedge/run_blueedge_productized_01_fixed",
  present: [...],
  missing: [
    { key: "qualification_state", path: "...", status: "MISSING_REQUIRED" },
    { key: "qualification_history", path: "...", status: "MISSING_OPTIONAL" },
  ],
  present_count: 13,
  missing_count: 2,
  has_required_missing: true,
}
```

### 3.2 Display Behavior

| Condition | Display |
|-----------|---------|
| All artifacts present | Normal cockpit operation |
| Some optional missing | Normal operation + diagnostics available |
| Critical artifacts missing | "Cockpit Unavailable" + full diagnostics panel |
| No artifacts at all | "Cockpit Unavailable" + diagnostics showing all missing |
| Client not registered | "Cockpit Unavailable" + "not registered" message |

### 3.3 No Silent Fallback

- No fallback to FastAPI client data
- No fallback to mock/demo data
- No broad filesystem search for alternative artifacts
- Missing state is always explicitly displayed
