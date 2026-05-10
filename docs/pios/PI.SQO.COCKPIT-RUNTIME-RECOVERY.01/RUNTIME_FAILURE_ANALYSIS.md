# Runtime Failure Analysis

PI.SQO.COCKPIT-RUNTIME-RECOVERY.01

---

## Failure 1: LENS Flagship SQO Overlay References

### Reported Symptom
```
SQOQualificationBanner is not defined
SQOMaturityPanel is not defined
SQOGravityStabilityPanel is not defined
SQODebtProgressionPanel is not defined
```

### Investigation
Grep of `pages/lens-v2-flagship.js` for SQO-related tokens returned **zero matches**. The flagship page was successfully reverted to PATH B-only rendering in PI.SQO.RUNTIME-OVERLAY-BOUNDARY-CORRECTION.01 (commit f5e3db4). The `flagshipBinding.js` server module contains no SQO imports.

### Diagnosis
The LENS flagship page is **clean**. The reported SQO overlay component references were fully removed in the boundary correction stream. No residual references exist. This failure may have been observed from a cached build artifact or stale `.next` directory prior to the correction.

### Action Taken
Verified clean state. No changes required.

---

## Failure 2: SQO Cockpit `fs` Module Resolution in Browser Bundle

### Reported Symptom
```
pages/sqo/client/[client]/run/[run]/index.js
→ lib/sqo-cockpit/SQOCockpitStateResolver.js
→ lib/sqo-cockpit/SQOCockpitArtifactLoader.js
→ lib/lens-v2/SemanticArtifactLoader.js
→ require('fs')
→ Module not found: Can't resolve 'fs'
```

### Root Cause
The SQO Cockpit pages (PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01) used `require()` calls at **module scope** (top of the file, outside any function). In Next.js, `getServerSideProps` is tree-shaken from the client bundle, but module-scope `require()` calls are evaluated by webpack for both server and client bundles.

The dependency chain:
```
Page module scope
  → SQOCockpitStateResolver (module scope require)
    → SQOCockpitArtifactLoader
      → path (Node.js built-in)
      → SemanticArtifactLoader
        → fs (Node.js built-in) ← browser bundle fails here
```

### Established Pattern
The existing `pages/lens-v2-flagship.js` correctly handles this by placing `require()` for server-only modules **inside** `getServerSideProps`:
```js
export async function getServerSideProps(context) {
  const { resolveFlagshipBinding } = require('../lib/lens-v2/flagshipBinding')
  // ...
}
```

### Fix Applied
All 9 SQO Cockpit page files refactored to move `require()` calls for server-only modules inside `getServerSideProps`. The overview page additionally moves `COCKPIT_STATES` comparison to server-side, passing `isCritical` as a serialized prop.
