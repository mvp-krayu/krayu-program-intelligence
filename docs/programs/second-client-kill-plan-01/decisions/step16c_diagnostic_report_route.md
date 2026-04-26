# Governance Trace — STEP 16C Diagnostic Report Route
## PI.SECOND-CLIENT.STEP16C.DIAGNOSTIC-REPORT-ROUTE.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP16C.DIAGNOSTIC-REPORT-ROUTE.01
**Branch:** work/psee-runtime
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Scope

Four targeted changes to wire the Tier-2 Diagnostic Report route for the second-client
(OSS FastAPI Codebase, UUID `e65d2f0a-dfa7-4257-9333-fcbb583f0880`, run `run_01_oss_fastapi`).
Generator contamination fix included (BlueEdge hardcoding in tier2 builder).

---

## Root Cause Classification (from STEP 16A assessment)

| Gap | Root Cause |
|---|---|
| Tier-2 diagnostic report unavailable | `_build_tier2_diagnostic_narrative()` used hardcoded BlueEdge client name and footer |
| `/api/report` produced no tier-2 for second-client | No `--client`/`--run-id`/`--deliverable diagnostic` path in `report.js` |
| `/api/report-file` rejected tier-2 client-scoped requests | `resolveClientFilePath` only accepted `VALID_TIER1` |
| `diagnostic` artifact not client-scoped in lens.js | `byName['lens_tier2_diagnostic_narrative.html']` used raw path, not `withUrl()` |

---

## Changes Applied

### 1 — Generator: BlueEdge Contamination Fix in Tier-2 Builder

**Location:** `_build_tier2_diagnostic_narrative()` — lines 4300–4310

**Before:**
```python
client_name  = "Client Environment" if publish_safe else "BlueEdge Fleet Management Platform"
ev_link      = ("/api/report-file?name=lens_tier1_evidence_brief_pub.html" if publish_safe
                else "/api/report-file?name=lens_tier1_evidence_brief.html")
narr_link    = ("/api/report-file?name=lens_tier1_narrative_brief_pub.html" if publish_safe
                else "/api/report-file?name=lens_tier1_narrative_brief.html")
title_suffix = " (Publish)" if publish_safe else ""
footer_note  = ("SAMPLE — Illustrative client environment. ..."
                if publish_safe else
                "SAMPLE — BlueEdge data used for demonstration purposes.")
```

**After:**
```python
client_name  = _get_client_display_name(publish_safe)
_use_psig    = _ACTIVE_CLIENT != "blueedge"
_ev_name     = "lens_tier1_evidence_brief_pub.html" if publish_safe else "lens_tier1_evidence_brief.html"
_narr_name   = "lens_tier1_narrative_brief_pub.html" if publish_safe else "lens_tier1_narrative_brief.html"
ev_link      = _scoped_report_url(_ev_name) if _use_psig else f"/api/report-file?name={_ev_name}"
narr_link    = _scoped_report_url(_narr_name) if _use_psig else f"/api/report-file?name={_narr_name}"
title_suffix = " (Publish)" if publish_safe else ""
footer_note  = ("SAMPLE — Illustrative client environment. ..."
                if publish_safe else
                f"SAMPLE — {client_name}.")
```

### 2 — Generator: Tier-2 Artifact Produced

Run command:
```
python3 scripts/pios/lens_report_generator.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --deliverable diagnostic
```

Output (gitignored, generated on demand):
- `clients/e65d2f0a.../reports/tier2/lens_tier2_diagnostic_narrative.html`
- `clients/e65d2f0a.../reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html`

Contamination check: 0 BlueEdge refs, 2 OSS FastAPI refs — PASS

### 3 — `report.js`: Client-Scoped Diagnostic Generation Route

Added `?client=&runId=&deliverable=diagnostic` path to `handler()`.

When `deliverable === 'diagnostic'`:
- Requires `client` and `runId`
- Validates both with `path.basename()` (no path traversal)
- Calls generator: `[SCRIPT_PATH, '--client', client, '--run-id', runId, '--deliverable', 'diagnostic']`
- Filters output to TIER2_LABELS filenames only
- Returns scoped file paths: `/api/report-file?name=...&client=...&runId=...`

Existing default path (`/api/report` with no params) unchanged.

### 4 — `report-file.js`: Tier-2 Client-Aware Routing

Extended `resolveClientFilePath()` to accept `VALID_TIER2` filenames:

```javascript
const isTier1 = VALID_TIER1.test(name)
const isTier2 = VALID_TIER2.test(name)
if (!isTier1 && !isTier2) return null
const tier      = isTier1 ? 'tier1' : 'tier2'
const subdir    = isPublish ? path.join(tier, 'publish') : tier
const filePath  = path.join(REPO_ROOT, 'clients', client, 'reports', subdir, path.basename(name))
const allowed   = path.join(REPO_ROOT, 'clients', client, 'reports', tier)
if (!filePath.startsWith(allowed + path.sep)) return null
return filePath
```

Path: `clients/<client>/reports/tier2/<name>` with traversal guard.

### 5 — `lens.js`: Diagnostic Artifact Scoped via `withUrl()`

`generateReport()` now issues two parallel requests:
```javascript
const [res1, res2] = await Promise.all([
  fetch('/api/report'),
  fetch(`/api/report?client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}&deliverable=diagnostic`),
])
```

Merges both `files` arrays into `byName`. Second call overwrites tier2 entry with scoped path (then `withUrl()` applies client-scoped URL regardless).

Diagnostic artifact fixed:
```javascript
diagnostic: withUrl('lens_tier2_diagnostic_narrative.html'),
```

Was: `byName['lens_tier2_diagnostic_narrative.html']` (unscoped raw path)

---

## 4-BRAIN Alignment

| Brain | Status | Basis |
|---|---|---|
| CANONICAL | PASS | Artifact generated from second-client run artifacts; `_get_client_display_name()` uses `_CLIENT_DISPLAY_NAMES` map |
| CODE | PASS | Generator, report.js, report-file.js, lens.js all modified; no hand-edited HTML |
| PRODUCT | PASS | Diagnostic report surface now active for second-client; BlueEdge tier1 unaffected |
| PUBLISH | PASS | Zero BlueEdge contamination in second-client tier2 output; internal links scoped |

---

## Validation Results

### Artifact Generation

| Check | Result |
|---|---|
| `lens_tier2_diagnostic_narrative.html` exists at tier2 path | PASS |
| 0 BlueEdge refs in second-client tier2 | PASS |
| 2 OSS FastAPI refs in second-client tier2 | PASS |

### Route Binding

| Check | Result |
|---|---|
| `GET /api/report?client=...&runId=...&deliverable=diagnostic` → 200 | PASS |
| Response contains `lens_tier2_diagnostic_narrative.html` with scoped path | PASS |
| `GET /api/report-file?name=lens_tier2_diagnostic_narrative.html&client=...&runId=...` → 200 | PASS |
| Path traversal rejected → 400 | PASS |
| Missing client rejected → 400 | PASS |

### BlueEdge Regression

| Check | Result |
|---|---|
| `GET /api/report` (no params) still returns tier1 files | PASS |
| BlueEdge tier2 diagnostic: 0 OSS FastAPI refs | PASS |
| BlueEdge tier2 diagnostic: 2 BlueEdge Fleet refs | PASS |

---

## Files Modified

| File | Action |
|---|---|
| `scripts/pios/lens_report_generator.py` | Modified — `_build_tier2_diagnostic_narrative()`: client name, footer note, internal links |
| `app/gauge-product/pages/api/report.js` | Modified — `?deliverable=diagnostic` route added |
| `app/gauge-product/pages/api/report-file.js` | Modified — `resolveClientFilePath()` extended to VALID_TIER2 |
| `app/gauge-product/pages/lens.js` | Modified — `generateReport()` second fetch + `withUrl()` for diagnostic |
| `clients/e65d2f0a.../reports/tier2/lens_tier2_diagnostic_narrative.html` | Generated (gitignored) |
| `clients/e65d2f0a.../reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html` | Generated (gitignored) |
| `docs/programs/second-client-kill-plan-01/decisions/step16c_diagnostic_report_route.md` | Created — this trace |

## Files NOT Modified

- `clients/blueedge/`: BlueEdge client artifacts unchanged (BlueEdge tier2 regenerated within gitignored path)
- `app/gauge-product/pages/tier2/workspace.js`: No changes
- All vault, graph, evidence layer artifacts: unchanged
- `app/gauge-product/.env.local`: No changes

---

## Governance Confirmation

- No BlueEdge files committed (gitignored)
- No vault, graph, or evidence layer modified
- All second-client values derived from existing run artifacts
- Generator is the sole authority; no hand-edited HTML
- BlueEdge regression PASS — all 3 checks
- `resolveClientFilePath()` traversal guards verified
- Stream: PI.SECOND-CLIENT.STEP16C.DIAGNOSTIC-REPORT-ROUTE.01
