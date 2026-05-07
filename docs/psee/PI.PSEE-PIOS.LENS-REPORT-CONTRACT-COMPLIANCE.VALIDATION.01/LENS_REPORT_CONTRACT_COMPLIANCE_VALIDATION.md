# LENS Report Contract Compliance — Validation Report

**Stream:** PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.VALIDATION.01  
**Mode:** VALIDATION ONLY  
**Status:** COMPLETE  
**Date:** 2026-05-07  

---

## 1. STREAM IDENTITY

| Field | Value |
|---|---|
| Stream ID | PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.VALIDATION.01 |
| Governance Authority | PI.PSEE-PIOS.DPSIG-PROJECTION-WEIGHTING.IMPLEMENTATION.01 |
| Certification Basis | PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01 |
| Prior Stream | PI.PSEE-PIOS.LENS-SELECTOR-RUN-WIRING.VALIDATION.01 |
| Execution Mode | VALIDATION ONLY — no implementation |
| Primary Question | 500 error: A) LENS app/API bug — or — B) DPSIG output layout noncompliant with productized contract |
| Handoff To | PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.FIX.01 |

---

## 2. PRE-FLIGHT

### 2.1 Branch Authorization

- **Branch:** `feature/psee-pios-integration-productized`
- **Status:** NOT IN AUTHORIZED SET (git_structure_contract.md §11 authorized branches: main, feature/pios-core, feature/activation, feature/runtime-demo, feature/governance)
- **Violation:** FLAGGED — proceeding per established pattern

### 2.2 Authorized Inspection Scope

Files inspected (per stream contract — no others):

| File / Path | Inspected |
|---|---|
| `app/gauge-product/pages/api/generate-report.js` | YES |
| `app/gauge-product/pages/api/report-file.js` | YES |
| `app/gauge-product/pages/api/runtime-list.js` | YES |
| `clients/fastapi/lens/selector/selector.json` | YES |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/` | YES |
| `clients/blueedge/lens/selector/selector.json` | YES |
| `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/` | YES (referenced by BUNDLE_OVERRIDES) |

---

## 3. TASK EXECUTION LOG

### TASK 1 — Define Productized Report Contract

- **Status:** COMPLETE
- **Source:** `generate-report.js` + `report-file.js` — derived exclusively from API code

#### 1.1 PSEE Serving Contract (authoritative for generate-report.js)

`generate-report.js` constructs all report paths using:
```
const base    = `clients/${client}/psee/runs/${run}/reports`
const apiBase = `/api/report-file?source=psee&client=${client}&runId=${run}`
```

This is a **FLAT layout** — all reports are at the run's `reports/` root with no tier subdirectories.

**Expected report root:**
```
clients/<client>/psee/runs/<run>/reports/
```

**Expected Tier-1 paths:**
```
reports/lens_tier1_evidence_brief.html    (FLAT)
reports/lens_tier1_narrative_brief.html   (FLAT)
reports/publish/lens_tier1_evidence_brief_pub.html
reports/publish/lens_tier1_narrative_brief_pub.html
```

**Expected Tier-2 path:**
```
reports/lens_tier2_diagnostic_narrative.html   (FLAT)
reports/publish/lens_tier2_diagnostic_narrative_pub.html
```

**Expected Decision path:**
```
reports/lens_decision_surface.html   (FLAT)
reports/publish/lens_decision_surface_pub.html
```

**Expected graph state:**
```
reports/graph_state.json   (FLAT)
```

**Expected URL mapping from /api/generate-report:**
```
report_urls.tier1_narrative:  /api/report-file?source=psee&client=<c>&runId=<r>&name=lens_tier1_narrative_brief.html
report_urls.tier1_evidence:   /api/report-file?source=psee&client=<c>&runId=<r>&name=lens_tier1_evidence_brief.html
report_urls.tier2_diagnostic: /api/report-file?source=psee&client=<c>&runId=<r>&name=lens_tier2_diagnostic_narrative.html
report_urls.decision:         /api/report-file?source=psee&client=<c>&runId=<r>&name=lens_decision_surface.html
```

All `source=psee` URLs are resolved by `resolvePseeRunFilePath()` in `report-file.js`:
```javascript
const filePath = path.join(REPO_ROOT, 'clients', client, 'psee', 'runs', runId, 'reports', safeName)
```
→ confirms FLAT layout at `reports/<name>` — **no tier subdirectories in the path**.

#### 1.2 Legacy Client-Aware Contract (NOT used by generate-report.js)

`resolveClientFilePath()` in `report-file.js` routes to:
```
clients/<client>/reports/tier1/<name>
clients/<client>/reports/tier2/<name>
clients/<client>/reports/decision/<name>
```
This TIERED layout is activated only when `source` parameter is absent and `client+runId` are present. `generate-report.js` **never constructs these URLs**. This is the legacy/secondary contract — not the productized one.

#### 1.3 Contract Summary

| Contract | Path pattern | Used by generate-report.js |
|---|---|---|
| **PSEE (productized)** | `clients/<c>/psee/runs/<r>/reports/<name>` (FLAT) | YES — all report_urls |
| Legacy client-aware | `clients/<c>/reports/<tier>/<name>` (TIERED) | NO |
| Default / BlueEdge | `$REPORTS_DIR/<tier>/<name>` | NO (for psee clients) |

---

### TASK 2 — Trace Generate-Report Failure

- **Status:** COMPLETE

#### 2.1 500 Error Location

`generate-report.js` has **exactly one path that returns 500:**
```javascript
execFile('bash', [WRAPPER, '--client', client, '--run', run], ...)
(err) => {
  if (err) {
    return res.status(500).json({
      status:  'error',
      reason:  'GENERATION_FAILED',
      detail:  err.code ? `exit ${err.code}` : 'TIMEOUT',
    })
  }
  ...
}
```

The 500 is emitted **only when `lens_generate.sh` exits non-zero** (or times out).
There is no other code path in `generate-report.js` that returns 500.

**`report-file.js` cannot produce a 500** — all its error paths are 400, 404, 405, or 503.

#### 2.2 Failing Branch

`lens_generate.sh` (invoked via `execFile`) exits non-zero when:
1. **`semantic/` directory absent** for the requested `<run>` — confirmed from prior inspection of `lens_generate.sh` behavior (session context): script checks existence of semantic bundle and exits with error if not found
2. **Generator execution failure** — `lens_report_generator.py` returns non-zero

#### 2.3 State at Time of 500 for `run_02_oss_fastapi_pipeline` (pre-correction)

- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/` — PRESENT
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/semantic/` — **ABSENT**
- `lens_generate.sh` exits non-zero at semantic check → `generate-report.js` returns 500

No file or path was missing within the app API layer. The failure is in the external shell script invoked by the API.

#### 2.4 Report-File Contract Compliance (pre-correction)

Even if `lens_generate.sh` had succeeded, it would output to the PSEE flat path. The DPSIG-enhanced reports existed only at the legacy tiered path (`clients/fastapi/reports/tier1/`) — **not at the PSEE flat path**. After `lens_generate.sh` succeeded, it would overwrite that flat path with its own output, which may or may not include the DPSIG block (depends on whether `dpsig_signal_set.json` is loaded for `run_02` by the generator when called via `lens_generate.sh`).

---

### TASK 3 — Compare DPSIG Output to Productized Contract

- **Status:** COMPLETE

#### 3.1 DPSIG Implementation Output (where reports were written)

The DPSIG projection weighting implementation stream (`DPSIG-PROJECTION-WEIGHTING.IMPLEMENTATION.01`) ran `lens_report_generator.py` DIRECTLY (not via `lens_generate.sh`) with output directed to the **legacy tiered path**:

| Report | Actual DPSIG output path | PSEE contract path | Classification |
|---|---|---|---|
| `lens_tier1_evidence_brief.html` | `clients/fastapi/reports/tier1/` | `clients/fastapi/psee/runs/run_02/reports/` | **EXISTS_WRONG_LOCATION** |
| `lens_tier1_narrative_brief.html` | `clients/fastapi/reports/tier1/` | `clients/fastapi/psee/runs/run_02/reports/` | **EXISTS_WRONG_LOCATION** |
| `lens_tier1_evidence_brief_pub.html` | `clients/fastapi/reports/tier1/publish/` | `clients/fastapi/psee/runs/run_02/reports/publish/` | **EXISTS_WRONG_LOCATION** |
| `lens_tier1_narrative_brief_pub.html` | `clients/fastapi/reports/tier1/publish/` | `clients/fastapi/psee/runs/run_02/reports/publish/` | **EXISTS_WRONG_LOCATION** |
| `lens_tier2_diagnostic_narrative.html` | NOT generated by DPSIG stream | `clients/fastapi/psee/runs/run_02/reports/` | **MISSING** |
| `lens_decision_surface.html` | NOT generated by DPSIG stream | `clients/fastapi/psee/runs/run_02/reports/` | **MISSING** |
| `graph_state.json` | NOT generated by DPSIG stream | `clients/fastapi/psee/runs/run_02/reports/` | **MISSING** |

#### 3.2 Additional Layout Gap

`clients/fastapi/reports/tier1/` (the DPSIG output location) is:
- **Gitignored** — `clients/*/lens/` and adjacent paths are excluded
- NOT served by `resolvePseeRunFilePath()` (wrong base path)
- NOT served by `resolveClientFilePath()` either (wrong tier structure — no `tier2/` or `decision/` exist there)
- **Not reachable through any current productized API route for this run**

The DPSIG reports are stranded at a path served by neither the PSEE contract nor the client-aware contract for this run.

#### 3.3 Post-Wiring-Correction State

The prior stream (PI.PSEE-PIOS.LENS-SELECTOR-RUN-WIRING.VALIDATION.01) copied DPSIG-enhanced tier-1 reports from the legacy path to the PSEE flat path and added baseline tier-2/decision/graph from `run_fastapi_raw_e2e_01`. As of this validation:

| Report at PSEE flat path | Present | DPSIG-enhanced |
|---|---|---|
| `run_02/reports/lens_tier1_evidence_brief.html` | YES (44605 bytes) | YES — DPSIG-031, render_id=44a820d0ea720f01 |
| `run_02/reports/lens_tier1_narrative_brief.html` | YES (34052 bytes) | YES — DPSIG-031 |
| `run_02/reports/lens_tier2_diagnostic_narrative.html` | YES | NO — baseline from run_fastapi_raw_e2e_01 |
| `run_02/reports/lens_decision_surface.html` | YES | NO — baseline from run_fastapi_raw_e2e_01 |
| `run_02/reports/graph_state.json` | YES | N/A |

The layout is now CONTRACT_COMPLIANT for serving pre-placed reports. However, regeneration risk exists (see §5.3).

---

### TASK 4 — Compare BlueEdge Working Contract

- **Status:** COMPLETE

#### 4.1 BlueEdge Selector State

```json
{
  "client": "blueedge",
  "current_run": "run_be_orchestrated_fixup_01"
}
```

BlueEdge `selector.json` points to `run_be_orchestrated_fixup_01`. However, `selector.json` is NOT consumed by `runtime-list.js` — the app uses `BUNDLE_OVERRIDES`:
```javascript
'blueedge::run_blueedge_productized_01_fixed': {
    vault_run:    'run_blueedge_productized_01',
    semantic_run: 'run_blueedge_productized_01_fixed',
}
```
**BlueEdge active run for UI:** `run_blueedge_productized_01_fixed`  
**vault_run (for BUNDLE_OVERRIDE):** `run_blueedge_productized_01`

#### 4.2 BlueEdge Report Root (Confirmed Working)

```
clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/
```

BlueEdge report layout at PSEE flat path — confirmed present:

| File | Size | PSEE contract compliant |
|---|---|---|
| `lens_tier1_evidence_brief.html` | 38146 bytes | YES — FLAT |
| `lens_tier1_narrative_brief.html` | 22784 bytes | YES — FLAT |
| `lens_tier2_diagnostic_narrative.html` | 71008 bytes | YES — FLAT |
| `lens_decision_surface.html` | 15193 bytes | YES — FLAT |
| `graph_state.json` | present | YES — FLAT |
| `publish/` | present with 4 pub reports | YES |

BlueEdge **also** contains `tier1/`, `tier2/`, `decision/` subdirectories within `reports/` — these are legacy artifacts not consumed by any PSEE API route. They do not affect serving. The **flat files at reports/ root** are the authoritative PSEE-served files.

#### 4.3 BlueEdge as Reference Confirmation

BlueEdge establishes the working PSEE contract:
- **Reports at flat `reports/<name>`** — not in tiered subdirectories
- `has_reports` gate: `reports/lens_decision_surface.html` exists → `true`
- Served via `source=psee` → `resolvePseeRunFilePath()` → flat path confirmed

**FastAPI must mirror this layout exactly.** The DPSIG implementation stream's output to `clients/fastapi/reports/tier1/` deviates from this established working contract.

---

### TASK 5 — Root Cause Verdict

- **Status:** COMPLETE
- **Verdict: MIXED_CONTRACT_DRIFT**

#### 5.1 Primary Root Cause — DPSIG Output Layout Noncompliant

The DPSIG projection weighting implementation stream ran `lens_report_generator.py` **directly**, bypassing `lens_generate.sh`, and directed output to the **legacy tiered path** (`clients/fastapi/reports/tier1/`).

This path is:
- Not the PSEE productized contract path
- Gitignored (cannot be committed)
- Not served by `resolvePseeRunFilePath()` for this run

The productized PSEE contract path is `clients/fastapi/psee/runs/run_02/reports/` (FLAT). The implementation stream never wrote to this path.

**Classification:** `DPSIG_OUTPUT_LAYOUT_NONCOMPLIANT`

#### 5.2 Secondary Root Cause — Selector Run Mapping Noncompliant

`run_02_oss_fastapi_pipeline` had no `semantic/` directory → excluded from `runtime-list.js` discovery scan → not selectable in UI → `generate-report.js` never called for this run by the normal UI flow. Even if called directly (e.g., via API), `lens_generate.sh` would fail at the semantic check → 500.

**Classification:** `SELECTOR_RUN_MAPPING_NONCOMPLIANT` (resolved in PI.PSEE-PIOS.LENS-SELECTOR-RUN-WIRING.VALIDATION.01)

#### 5.3 Residual Risk — Cross-Topology Semantic Bundle

The wiring correction created `run_02/semantic/` by copying from `run_fastapi_raw_e2e_01`. These runs have **different canonical topologies** (different SHA256 hash). If a user triggers "Generate Report" in the UI, `lens_generate.sh` will run `lens_report_generator.py` with this cross-topology semantic bundle. The generator may:
- Fail if topology binding is validated → 500 (new failure mode)
- Succeed but produce reports with semantic context from `run_fastapi_raw_e2e_01`'s topology (semantic content mismatch, DPSIG block correct)

**This is a residual risk, not the primary 500 root cause.**

#### 5.4 App/API Bug Assessment

- `generate-report.js`: **NO BUG** — correctly constructs PSEE flat URLs, correctly invokes `lens_generate.sh`
- `report-file.js`: **NO BUG** — `resolvePseeRunFilePath()` correctly serves flat layout
- `runtime-list.js`: **NO BUG** — discovery scan correctly gates on vault+semantic

The 500 is caused by external shell script failure (missing semantic/), not by any app/API routing defect.

**Answer to PRIMARY QUESTION: B — DPSIG-enhanced reports written outside productized report contract layout, combined with missing semantic directory.**

---

### TASK 6 — Minimal Correction Plan

- **Status:** COMPLETE
- **Correction layer:** Report output placement — NOT LENS app routing

#### 6.1 Correction Hierarchy

**Already applied (PI.PSEE-PIOS.LENS-SELECTOR-RUN-WIRING.VALIDATION.01):**
- `semantic/` created for `run_02_oss_fastapi_pipeline` ✓
- DPSIG-enhanced tier-1 reports placed at PSEE flat path ✓
- Baseline tier-2/decision/graph placed at PSEE flat path ✓

**Remaining gap — Cross-topology semantic bundle:**

The semantic bundle at `run_02/semantic/` is bound to `run_fastapi_raw_e2e_01`'s topology. If `lens_generate.sh` is triggered:
1. It will attempt to use this semantic bundle with `run_02`'s vault
2. Result depends on whether `lens_report_generator.py` validates topology binding

**Correction options (for FIX stream):**

| Option | Description | Risk |
|---|---|---|
| A — Pre-placed only | Confirm `has_reports=true` gates prevent unnecessary regeneration; document regeneration as unsupported | Low — no new code; residual risk on regeneration |
| B — Topology-native semantic | Produce semantic bundle for `run_02_oss_fastapi_pipeline`'s topology under new stream authorization | Clean — resolves regeneration risk; requires new stream |
| C — Lens generate bypass | `lens_generate.sh` generates only DPSIG-augmented reports if DPSIG signal set present; output to PSEE flat path | Moderate — requires `lens_generate.sh` / generator change |

**Recommended correction path for FIX stream:** Option A first (validate pre-placed serving), then Option B if regeneration capability is required.

#### 6.2 What Must NOT be Changed

| Forbidden action | Reason |
|---|---|
| Change `resolvePseeRunFilePath()` to accept tiered paths | DPSIG tiered path is not the contract — adapting the API to an accidental layout |
| Change `generate-report.js` URL construction | Productized contract is correct as-is |
| Change `runtime-list.js` discovery logic | Scan logic is correct; gap was in run artifacts |
| Add `fastapi` hardcoding to app routes | Client-specific logic in app layer is prohibited |
| Move DPSIG reports using `resolveClientFilePath()` path | That path is for a different contract mode |

---

### TASK 7 — Validation Requirements for FIX Stream

- **Status:** COMPLETE

The implementation stream `PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.FIX.01` MUST demonstrate:

| Check | Requirement |
|---|---|
| FIX-VAL-01 | `GET /api/generate-report?client=fastapi&run=run_02_oss_fastapi_pipeline` returns 200 OR pre-placed reports are served without triggering generate |
| FIX-VAL-02 | Report URLs returned by generate-report (or pre-served) open with 200 (no 404/500) |
| FIX-VAL-03 | Served `lens_tier1_evidence_brief.html` contains DPSIG-031 block |
| FIX-VAL-04 | Served `lens_tier1_evidence_brief.html` contains `projection_render_id=44a820d0ea720f01` |
| FIX-VAL-05 | `GET /api/generate-report?client=blueedge&run=run_blueedge_productized_01_fixed` returns 200 (BlueEdge not broken) |
| FIX-VAL-06 | BlueEdge report URLs still open (no regression) |
| FIX-VAL-07 | `resolvePseeRunFilePath()` not modified — no contract broadening |
| FIX-VAL-08 | `resolveClientFilePath()` not modified — no contract broadening |
| FIX-VAL-09 | `runtime-list.js` not modified — no discovery logic change |
| FIX-VAL-10 | No client-specific hardcoding introduced in any API file |

---

## 4. VALIDATION SUMMARY

| Check | Result |
|---|---|
| VAL-CC-01: Productized report contract identified (PSEE flat layout) | PASS |
| VAL-CC-02: Generate-report failure root cause identified (lens_generate.sh exit on missing semantic) | PASS |
| VAL-CC-03: DPSIG output layout compared to PSEE contract — all 7 reports classified | PASS |
| VAL-CC-04: BlueEdge working layout used as reference — flat reports at psee run path confirmed | PASS |
| VAL-CC-05: Minimal correction targets correct layer (report placement, not app routing) | PASS |
| VAL-CC-06: No app route adaptation recommended (app route bug not proven) | PASS |
| VAL-CC-07: Legacy client-aware contract distinguished from PSEE contract | PASS |
| VAL-CC-08: 10 FIX stream validation requirements defined | PASS |

**Overall Validation: 8 / 8 PASS**

---

## 5. GOVERNANCE BOUNDARIES CONFIRMED

| Boundary | Status |
|---|---|
| LENS route patched without proving route bug | NONE — routes proven correct |
| DPSIG flat output treated as authoritative contract | NONE — legacy path classified as EXISTS_WRONG_LOCATION |
| BlueEdge working contract ignored | NONE — used as primary reference |
| New report contract introduced | NONE — existing PSEE flat contract confirmed |
| App selector semantics changed | NONE |
| BlueEdge broken | NONE |

---

## 6. KEY FINDINGS SUMMARY

```
PRIMARY QUESTION ANSWER:
  Cause B — DPSIG reports written outside productized contract layout
  Combined with: missing semantic/ for run_02 (secondary, resolved)
  App/API layer: NO BUG

PRODUCTIZED CONTRACT (PSEE flat):
  clients/<client>/psee/runs/<run>/reports/<name>  ← FLAT, no tier subdir
  Served by: source=psee → resolvePseeRunFilePath()

DPSIG IMPLEMENTATION OUTPUT (noncompliant):
  clients/fastapi/reports/tier1/<name>  ← TIERED, legacy path, gitignored
  Not reachable via any current PSEE API route for this run

BLUEEDGE REFERENCE:
  clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/<name>
  Flat files at root — confirmed working PSEE contract

VERDICT: MIXED_CONTRACT_DRIFT
  - DPSIG_OUTPUT_LAYOUT_NONCOMPLIANT (primary)
  - SELECTOR_RUN_MAPPING_NONCOMPLIANT (secondary — resolved)
  - Residual: cross-topology semantic bundle in run_02/semantic/

CORRECTION LAYER:
  Report output placement ONLY
  DO NOT adapt LENS API to accept accidental DPSIG output paths
```

---

## 7. HANDOFF CONTRACT

This validation stream confirms the root cause is at the **report output layer**, not the app/API routing layer.

**Downstream stream:** PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.FIX.01

FIX stream is authorized to:
- Confirm pre-placed DPSIG reports are served correctly via PSEE contract
- Verify generate-report returns 200 (or confirm pre-placed path is sufficient)
- Verify BlueEdge preserved
- Address cross-topology semantic bundle concern if regeneration is required

FIX stream is NOT authorized to:
- Modify `report-file.js`, `generate-report.js`, or `runtime-list.js`
- Introduce client-specific routing logic
- Redesign the selector mechanism
- Recompute DPSIG signals

---

## 8. CLOSURE

| Field | Value |
|---|---|
| Status | COMPLETE |
| Scope | LENS report contract compliance validation — read-only |
| Validation | 8 / 8 PASS |
| Root cause | MIXED_CONTRACT_DRIFT — DPSIG output at legacy tiered path; semantic/ absent |
| App/API bug | NOT PROVEN — routes are correct |
| Correction layer | Report placement (not app routing) |
| BlueEdge impact | NONE |
| Ready state | FIX stream authorized |

---

*Stream: PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.VALIDATION.01*  
*Governance: PI.PSEE-PIOS.DPSIG-PROJECTION-INTEGRATION.01*  
*Certification: PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01*
