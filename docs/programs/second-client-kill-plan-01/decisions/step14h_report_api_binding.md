# Governance Trace — STEP 14H Report API Binding
## PI.SECOND-CLIENT.STEP14H.REPORT-API-BINDING.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14H.REPORT-API-BINDING.01
**Branch:** work/psee-runtime
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Root Cause Identified

`app/gauge-product/pages/api/report-file.js` resolved report paths exclusively via
`process.env.REPORTS_DIR`. No client-aware routing existed. When `REPORTS_DIR` pointed
to a non-second-client path (current env: `REPORTS_DIR=/tmp`), all second-client report
requests returned `REPORT_NOT_FOUND` or `REPORTS_DIR_NOT_CONFIGURED`.

Second-client tier1 reports are on disk at:
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/
  lens_tier1_evidence_brief.html
  lens_tier1_narrative_brief.html
  publish/
    lens_tier1_evidence_brief_pub.html
    lens_tier1_narrative_brief_pub.html
```

The API had no path to reach these files via HTTP.

---

## Path Resolution Logic

### Client-aware routing (new — activated when `client` + `runId` params present)

```
REPO_ROOT = path.join(__dirname, '..', '..', '..', '..')
            → /Users/khorrix/Projects/k-pi-core

filePath  = REPO_ROOT / clients / <client> / reports / tier1 / <name>
           (tier1/publish/ for _pub variants)
```

`runId` is required by API contract but not incorporated into path — tier1 reports
are per-client, not per-run.

Security guards:
- `path.basename(client) !== client` → rejects any traversal characters in client/runId
- `VALID_TIER1` whitelist regex on filename
- `filePath.startsWith(allowed + path.sep)` confirms resolved path is under `clients/<client>/reports/tier1/`

### BlueEdge / default routing (existing — no changes)

Activated when neither `client` nor `runId` is present. Uses `process.env.REPORTS_DIR`.
No code path modification.

### Activation boundary

If either `client` or `runId` is present → client-aware path is entered. If only one
is provided → `CLIENT_AND_RUN_ID_REQUIRED` (400). No silent fallback to BlueEdge.

---

## Validation Results

| Check | Request | Response | Result |
|---|---|---|---|
| V1: second-client narrative_brief | `?name=lens_tier1_narrative_brief.html&client=e65d2f0a...&runId=run_01_oss_fastapi` | HTTP 200 · 17121 bytes HTML | PASS |
| V2: second-client evidence_brief | `?name=lens_tier1_evidence_brief.html&client=e65d2f0a...&runId=run_01_oss_fastapi` | HTTP 200 · 28437 bytes HTML | PASS |
| V3: invalid filename, no fallback | `?name=does_not_exist.html&client=e65d2f0a...&runId=run_01_oss_fastapi` | HTTP 400 `INVALID_FILENAME` | PASS† |
| V3b: valid filename, missing file | `?name=lens_tier1_narrative_brief.html&client=00000000-0000-0000-0000-000000000000&runId=run_01` | HTTP 404 `REPORT_NOT_FOUND` | PASS |
| V4: BlueEdge regression | `?name=lens_tier1_narrative_brief.html` (no client param) | HTTP 404 `REPORT_NOT_FOUND` (unchanged) | PASS |
| V5: path traversal rejection | `?name=lens_tier1_narrative_brief.html&client=../../etc&runId=run_01` | HTTP 400 `INVALID_FILENAME` | PASS |
| V6: partial params | `?name=lens_tier1_narrative_brief.html&client=e65d2f0a...` (no runId) | HTTP 400 `CLIENT_AND_RUN_ID_REQUIRED` | PASS |
| **Total checks: 7** | | | **PASS: 7 / FAIL: 0** |

† V3 note: `does_not_exist.html` fails the `VALID_TIER1` whitelist before any filesystem
  access — returns 400 `INVALID_FILENAME`. This is correct security behavior (no
  filesystem probing on invalid names). V3b confirms that valid-format missing files
  return 404 `REPORT_NOT_FOUND`. Neither case falls back to BlueEdge.

---

## BlueEdge Regression

`REPORTS_DIR=/tmp` in `.env.local`. BlueEdge tier1 reports exist at
`clients/blueedge/reports/tier1/` — outside the env-configured path. BlueEdge requests
returned `REPORT_NOT_FOUND` (404) before this change; they return the same after.
The default routing code block is structurally identical to the pre-change state.

---

## Client Isolation Confirmation

- Client-aware path is constructed exclusively from `REPO_ROOT + clients/<client> + …`
- No cross-client path construction possible — client is validated against
  `path.basename(client) === client` (no slashes) and confined by `startsWith(allowed)` guard
- BlueEdge `REPORTS_DIR` is never consulted when client param is present
- No BlueEdge files modified

---

## Files Modified

| File | Action |
|---|---|
| `app/gauge-product/pages/api/report-file.js` | Modified — added `resolveClientFilePath()`, `serveHtml()` helper, client-aware routing branch |
| `docs/programs/second-client-kill-plan-01/decisions/step14h_report_api_binding.md` | Created — this governance trace |

## Files NOT Modified

- `scripts/pios/lens_report_generator.py`: unchanged
- `scripts/pios/vault_export.py`: unchanged
- `app/gauge-product/public/vault/`: unchanged
- All 40.x / 41.x / 75.x layer artifacts: unchanged
- BlueEdge client files: unchanged

---

## Governance Confirmation

- No interpretation created, inferred, or synthesized
- No report generator logic modified
- No vault, graph, or evidence layer modified
- API change is additive — existing BlueEdge routing branch structurally unchanged
- Stream: PI.SECOND-CLIENT.STEP14H.REPORT-API-BINDING.01
