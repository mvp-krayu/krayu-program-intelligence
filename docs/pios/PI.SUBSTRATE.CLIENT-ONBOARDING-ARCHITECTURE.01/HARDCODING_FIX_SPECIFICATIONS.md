# Hardcoding Fix Specifications

**Stream:** PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01
**Purpose:** Specification for removing three BlueEdge-specific hardcoding points. Implementation deferred to future stream.

---

## Fix 1: DOM-04 Passthrough Hardcoding

**Location:** `app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js:283`

**Current code:**
```javascript
const passthroughDom = canonicalTopology.clusters &&
  canonicalTopology.clusters.find((c) => c.cluster_id === 'DOM-04');
```

**Problem:** `DOM-04` (backend_app_root) is hardcoded as the passthrough DOM for evidence block construction. This is BlueEdge-specific — another client's passthrough DOM may have a different ID or may not exist.

**Fix approach:** Add a `passthrough_dom` field to the client-run manifest schema.

**Manifest addition:**
```json
{
  "passthrough_dom": "DOM-04"
}
```

**Code change:**
```javascript
const passthroughDomId = manifest.passthrough_dom || null;
const passthroughDom = passthroughDomId &&
  canonicalTopology.clusters &&
  canonicalTopology.clusters.find((c) => c.cluster_id === passthroughDomId);
```

**Fallback behavior:** If `passthrough_dom` is null or not in manifest, evidence block construction uses the two-block pattern (ORIGIN + RECEIVER only, no PASS_THROUGH). This degrades gracefully.

**Schema change:** Add optional `passthrough_dom` field to `ClientRunManifestSchema.js`.

**Effort:** LOW — 1 manifest schema addition, 3 lines of code change, 1 manifest update for BlueEdge.

**Maturity:** SPECIFIED_NOT_IMPLEMENTED

---

## Fix 2: flagshipBinding.js Default Client/Run

**Location:** `app/execlens-demo/lib/lens-v2/flagshipBinding.js:31-32`

**Current code:**
```javascript
const DEFAULT_BINDING_CLIENT = 'blueedge';
const DEFAULT_BINDING_RUN = 'run_blueedge_productized_01_fixed';
```

**Problem:** Default client and run are hardcoded to BlueEdge. In a multi-client deployment, the default should be configurable without code changes.

**Fix approach:** Environment variable with BlueEdge fallback.

**Code change:**
```javascript
const DEFAULT_BINDING_CLIENT = process.env.LENS_DEFAULT_CLIENT || 'blueedge';
const DEFAULT_BINDING_RUN = process.env.LENS_DEFAULT_RUN || 'run_blueedge_productized_01_fixed';
```

**Behavior:** BlueEdge remains the default if environment variables are not set. No breaking change.

**Effort:** TRIVIAL — 2-line change. No schema changes. No architectural impact.

**Maturity:** SPECIFIED_NOT_IMPLEMENTED

---

## Fix 3: compile_blueedge_correspondence.js Parameterization

**Location:** `scripts/reconciliation/compile_blueedge_correspondence.js:23-32`

**Current code:**
```javascript
const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';
// ... path construction from these constants
```

**Problem:** Orchestration script is BlueEdge-only. The compiler it calls (`ReconciliationCorrespondenceCompiler.js`) is already client-agnostic — only the orchestration wrapper is hardcoded. (D-01, D-02 from prior art.)

**Fix approach:** Parameterized CLI with arguments.

**Target interface:**
```bash
node scripts/reconciliation/compile_correspondence.js \
  --client <client_id> \
  --run <run_id> \
  [--output-dir <path>]
```

**Changes required:**

1. **Rename:** `compile_blueedge_correspondence.js` → `compile_correspondence.js`

2. **Arguments:** Replace hardcoded CLIENT/RUN_ID with parsed CLI arguments:
```javascript
const args = parseArgs(process.argv.slice(2));
const CLIENT = args.client;
const RUN_ID = args.run;
```

3. **Path templates:** Replace hardcoded path construction:
```javascript
// Before:
const SEMANTIC_DIR = `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic`;
// After:
const SEMANTIC_DIR = `clients/${CLIENT}/psee/runs/${RUN_ID}/semantic`;
```

4. **Compiler version metadata:** Replace BlueEdge-specific version string (D-03):
```javascript
// Before:
compiler_version: 'PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01'
// After:
compiler_version: `PI.SQO.${CLIENT.toUpperCase()}.RECONCILIATION-CORRESPONDENCE-COMPILER.01`
```

5. **Confidence thresholds:** Retain current thresholds as defaults. Add optional CLI overrides:
```bash
--l5-threshold 0.90 --l4-threshold 0.65 --l3-threshold 0.50
```

**Backward compatibility:** The BlueEdge compile script can be preserved as a wrapper:
```bash
node scripts/reconciliation/compile_correspondence.js --client blueedge --run run_blueedge_productized_01_fixed
```

**Effort:** MEDIUM — primarily mechanical refactoring. The compiler engine requires zero changes. The orchestration wrapper requires CLI argument parsing + path template substitution.

**Maturity:** SPECIFIED_NOT_IMPLEMENTED

---

## Summary

| Fix | Location | Effort | Impact |
|---|---|---|---|
| DOM-04 passthrough | GenericSemanticPayloadResolver.js:283 | LOW | Removes last hardcoded DOM reference from generic resolver |
| Default client/run | flagshipBinding.js:31-32 | TRIVIAL | Environment-configurable defaults |
| Compile script | compile_blueedge_correspondence.js | MEDIUM | Multi-client reconciliation orchestration |

**Total effort for all 3 fixes:** ~1-2 days of implementation + testing. No architectural changes required. All fixes are mechanical parameterization of existing working code.

---

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01 |
| Derived from | GAP_ASSESSMENT.md (hardcoding points), PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01 D-01/D-02/D-03 |
| Verification date | 2026-05-18 |
| Maturity | SPECIFIED_NOT_IMPLEMENTED |
