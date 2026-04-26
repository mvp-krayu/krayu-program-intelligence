# Governance Trace — STEP 14L Report Link Scoping
## PI.SECOND-CLIENT.STEP14L.REPORT-LINK-SCOPING.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14L.REPORT-LINK-SCOPING.01
**Branch:** work/psee-runtime
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Files Inspected

| File | Report-file references found |
|---|---|
| `app/gauge-product/pages/lens.js` | `scoped('lens_tier1_narrative_brief.html')`, `scoped('lens_tier1_evidence_brief.html')` — both already locally scoped from prior STEP 14L commit |
| `app/gauge-product/components/lens/*.js` (11 files) | 0 report-file references |
| `app/gauge-product/components/*.js` | 0 report-file references |

No publish variant links (`_pub.html`) are present in the LENS UI — they are not linked from any button or href. No separate download buttons reference `report-file` directly.

---

## Report Links Found (Pre-Fix State)

| Location | Link | Scoped? |
|---|---|---|
| `lens.js:313` | `scoped('lens_tier1_narrative_brief.html')` — path: `/api/report-file?name=lens_tier1_narrative_brief.html` + appended scope | YES (local closure) |
| `lens.js:314` | `scoped('lens_tier1_evidence_brief.html')` — path: `/api/report-file?name=lens_tier1_evidence_brief.html` + appended scope | YES (local closure) |

Both were scoped by the prior STEP 14L commit using a local `scoped()` closure. The current contract upgrades the helper to a named module-level function.

---

## Helper Added

**Location:** `app/gauge-product/pages/lens.js`, after `_SC_RUN_ID` constants

```javascript
function reportUrl(name) {
  return `/api/report-file?name=${encodeURIComponent(name)}&client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}`
}
```

Replaces the local `scoped()` closure inside `generateReport()`. Helper is now callable from any scope within the module.

---

## Links Updated

| Before | After |
|---|---|
| `const scope = ...` + `const scoped = name => ...` local closure | `reportUrl(name)` — module-level named helper |
| `scoped('lens_tier1_narrative_brief.html')` | `withUrl('lens_tier1_narrative_brief.html')` → `path: reportUrl(name)` |
| `scoped('lens_tier1_evidence_brief.html')` | `withUrl('lens_tier1_evidence_brief.html')` → `path: reportUrl(name)` |

`withUrl()` remains a local convenience wrapper that preserves the full `{ name, label, path }` object shape from the API response, overriding only `path` with `reportUrl(name)`.

---

## Validation URLs

| Report | Scoped URL | HTTP Status (STEP 14H confirmed) |
|---|---|---|
| `lens_tier1_narrative_brief.html` | `/api/report-file?name=lens_tier1_narrative_brief.html&client=e65d2f0a-dfa7-4257-9333-fcbb583f0880&runId=run_01_oss_fastapi` | 200 (17121 bytes) |
| `lens_tier1_evidence_brief.html` | `/api/report-file?name=lens_tier1_evidence_brief.html&client=e65d2f0a-dfa7-4257-9333-fcbb583f0880&runId=run_01_oss_fastapi` | 200 (28437 bytes) |

URL construction validated via `node -e` — both URLs contain correct `client` and `runId` params.

---

## Unscoped Calls Remaining

```
grep -rn "report-file" app/gauge-product/pages/lens.js app/gauge-product/components/
→ 1 result: reportUrl() helper definition (always includes client/runId — not an unscoped call)
```

Zero unscoped `report-file` calls remain in LENS UI.

---

## Files Modified

| File | Action |
|---|---|
| `app/gauge-product/pages/lens.js` | Modified — promoted `scoped()` closure to named `reportUrl(name)` helper; replaced local closure with `withUrl()` pattern |
| `docs/programs/second-client-kill-plan-01/decisions/step14l_report_link_scoping.md` | Created — this trace |

## Files NOT Modified

- `app/gauge-product/pages/api/report-file.js`: unchanged
- `app/gauge-product/pages/api/report.js`: unchanged
- `scripts/pios/lens_report_generator.py`: unchanged
- All vault, graph, workspace, 40.x, 41.x, 75.x artifacts: unchanged
- BlueEdge client files: unchanged

---

## Governance Confirmation

- No report generator modified
- No report-file API modified
- No cross-layer boundary crossing
- Single UI file modified (LENS page only — L6 scope)
- Stream: PI.SECOND-CLIENT.STEP14L.REPORT-LINK-SCOPING.01
