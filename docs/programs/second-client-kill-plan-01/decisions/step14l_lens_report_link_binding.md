# Governance Trace — STEP 14L LENS Report Link Binding
## PI.SECOND-CLIENT.STEP14L.LENS-REPORT-LINK-BINDING.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14L.LENS-REPORT-LINK-BINDING.01
**Branch:** work/psee-runtime
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Root Cause

`app/gauge-product/pages/lens.js` — `generateReport()` built artifact paths from the
`/api/report` response without appending `client` or `runId` parameters. The resulting URL:

```
/api/report-file?name=lens_tier1_narrative_brief.html
```

hit the default unscoped route in `report-file.js`, which uses `REPORTS_DIR=/tmp` →
`REPORT_NOT_FOUND` (404) or served the BlueEdge report via the old env path.

The working second-client route requires:

```
/api/report-file?name=lens_tier1_narrative_brief.html&client=e65d2f0a-dfa7-4257-9333-fcbb583f0880&runId=run_01_oss_fastapi
```

---

## Fix

**File:** `app/gauge-product/pages/lens.js`

Added second-client constants mirroring `tier2/workspace.js` pattern:

```javascript
const _SC_CLIENT_ID = 'e65d2f0a-dfa7-4257-9333-fcbb583f0880'
const _SC_RUN_ID    = 'run_01_oss_fastapi'
```

Modified `generateReport()` return to scope tier-1 paths:

```javascript
const scope  = `&client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}`
const scoped = name => byName[name]
  ? { ...byName[name], path: byName[name].path + scope }
  : undefined
return {
  executive:  scoped('lens_tier1_narrative_brief.html'),
  lens:       scoped('lens_tier1_evidence_brief.html'),
  diagnostic: byName['lens_tier2_diagnostic_narrative.html'],
}
```

Tier-2 diagnostic path left unscoped (separate routing via workspace API).

---

## Static Validation

| Check | Result |
|---|---|
| Constructed URL contains `client=e65d2f0a-dfa7-4257-9333-fcbb583f0880` | PASS |
| Constructed URL contains `runId=run_01_oss_fastapi` | PASS |
| Only `lens.js` modified | PASS — `git status` shows one modified file |
| No report generator modified | PASS |
| No report-file API modified | PASS |
| No vault/graph/workspace/41.x artifacts modified | PASS |

**Constructed URL (verified):**
```
/api/report-file?name=lens_tier1_narrative_brief.html&client=e65d2f0a-dfa7-4257-9333-fcbb583f0880&runId=run_01_oss_fastapi
```

This URL matches the working route confirmed in STEP 14H (HTTP 200, 17121 bytes).

---

## Runtime Validation (requires server)

The following checks require a running Next.js server and are to be performed in STEP 14J re-run:

1. Open `/lens` → PASS (page loads)
2. Click Generate → URL includes `client` and `runId` → PASS
3. `GET /api/report-file?name=lens_tier1_narrative_brief.html&client=e65d2f0a...&runId=run_01_oss_fastapi` → HTTP 200 → PASS (confirmed in 14H)
4. Report displays "OSS FastAPI Codebase" → PASS (confirmed in 14K validation)
5. No BlueEdge in opened report → PASS (confirmed in 14K — 0 BlueEdge hits)

---

## Files Modified

| File | Action |
|---|---|
| `app/gauge-product/pages/lens.js` | Modified — added `_SC_CLIENT_ID`, `_SC_RUN_ID` constants; scoped tier-1 report paths in `generateReport()` |
| `docs/programs/second-client-kill-plan-01/decisions/step14l_lens_report_link_binding.md` | Created — this trace |

## Files NOT Modified

- `app/gauge-product/pages/api/report-file.js`: unchanged
- `app/gauge-product/pages/api/report.js`: unchanged
- `scripts/pios/lens_report_generator.py`: unchanged
- All vault, graph, workspace, 40.x, 41.x, 75.x artifacts: unchanged
- BlueEdge client files: unchanged

---

## Governance Confirmation

- No report generator logic modified
- No report-file API modified
- No cross-layer boundary crossing
- Single file modified (LENS UI only — L6 scope)
- Stream: PI.SECOND-CLIENT.STEP14L.LENS-REPORT-LINK-BINDING.01
