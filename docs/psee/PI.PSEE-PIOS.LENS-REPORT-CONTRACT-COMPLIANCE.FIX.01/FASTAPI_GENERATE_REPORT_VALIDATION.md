# FastAPI Generate-Report Validation

**Stream:** PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.FIX.01 — STEP 4  
**Date:** 2026-05-07  

---

## Endpoint Under Validation

```
GET /api/generate-report?client=fastapi&run=run_02_oss_fastapi_pipeline
```

## Validation Method

`generate-report.js` is a thin wrapper around `lens_generate.sh` followed by a static JSON response construction. Validated by:
1. Confirming `lens_generate.sh` exits 0 (direct execution)
2. Constructing the exact JSON response from code (deterministic)
3. Confirming all returned file paths exist on disk

## Input Validation (generate-report.js lines 44–46)

| Check | Value | Result |
|---|---|---|
| `client` present | `"fastapi"` | PASS |
| `run` present | `"run_02_oss_fastapi_pipeline"` | PASS |
| `SAFE_ID.test(client)` — `/^[A-Za-z0-9._-]+$/` | `"fastapi"` | PASS |
| `SAFE_ID.test(run)` — `/^[A-Za-z0-9._-]+$/` | `"run_02_oss_fastapi_pipeline"` | PASS |

## BUNDLE_OVERRIDES Resolution

`BUNDLE_OVERRIDES['fastapi::run_02_oss_fastapi_pipeline']` → not present → `vaultRun = run_02_oss_fastapi_pipeline`

## Shell Invocation

```
bash scripts/pios/lens_generate.sh --client fastapi --run run_02_oss_fastapi_pipeline
EXIT: 0 ✓
```

Output (key lines):
```
[export_graph_state] wrote 5 nodes, 4 links (458 ticks) → .../reports/graph_state.json
[DPSIG] Loaded dpsig_signal_set.json (severity_band=CRITICAL)
[LENS REPORT] Generated: .../reports/lens_tier1_evidence_brief.html
[LENS REPORT] Generated: .../reports/publish/lens_tier1_evidence_brief_pub.html
[LENS REPORT] Generated: .../reports/lens_tier1_narrative_brief.html
[LENS REPORT] Generated: .../reports/publish/lens_tier1_narrative_brief_pub.html
[LENS REPORT] Generated: .../reports/graph_state.json
[LENS REPORT] Generated: .../reports/lens_tier2_diagnostic_narrative.html
[LENS REPORT] Generated: .../reports/publish/lens_tier2_diagnostic_narrative_pub.html
[LENS REPORT] Generated: .../reports/lens_decision_surface.html
[LENS REPORT] Generated: .../reports/publish/lens_decision_surface_pub.html
```

No error. No warning. All 9 outputs written. EXIT: 0.

## HTTP Response (Constructed from Code)

HTTP status: **200** (execFile callback, no error branch taken)

```json
{
  "status": "success",
  "client": "fastapi",
  "display_run": "run_02_oss_fastapi_pipeline",
  "report_run": "run_02_oss_fastapi_pipeline",
  "vault_run": "run_02_oss_fastapi_pipeline",
  "semantic_run": "run_02_oss_fastapi_pipeline",
  "reports": {
    "tier1_narrative": "clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier1_narrative_brief.html",
    "tier1_evidence": "clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier1_evidence_brief.html",
    "tier2_diagnostic": "clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier2_diagnostic_narrative.html",
    "decision": "clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_decision_surface.html",
    "graph_state": "clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/graph_state.json"
  },
  "report_urls": {
    "tier1_narrative": "/api/report-file?source=psee&client=fastapi&runId=run_02_oss_fastapi_pipeline&name=lens_tier1_narrative_brief.html",
    "tier1_evidence": "/api/report-file?source=psee&client=fastapi&runId=run_02_oss_fastapi_pipeline&name=lens_tier1_evidence_brief.html",
    "tier2_diagnostic": "/api/report-file?source=psee&client=fastapi&runId=run_02_oss_fastapi_pipeline&name=lens_tier2_diagnostic_narrative.html",
    "decision": "/api/report-file?source=psee&client=fastapi&runId=run_02_oss_fastapi_pipeline&name=lens_decision_surface.html"
  },
  "workspace_url": "/tier2/workspace?client=fastapi&displayRun=run_02_oss_fastapi_pipeline&vaultRun=run_02_oss_fastapi_pipeline&reportRun=run_02_oss_fastapi_pipeline"
}
```

## Report URL Resolution (report-file.js resolvePseeRunFilePath)

All 4 report_urls use `source=psee` → routed via `resolvePseeRunFilePath()`:
```
clients/<client>/psee/runs/<runId>/reports/<name>
```

| URL name | File at PSEE flat path | `report-file.js` response |
|---|---|---|
| `lens_tier1_evidence_brief.html` | EXISTS (44605 bytes) | 200 text/html |
| `lens_tier1_narrative_brief.html` | EXISTS (34052 bytes) | 200 text/html |
| `lens_tier2_diagnostic_narrative.html` | EXISTS (90147 bytes) | 200 text/html |
| `lens_decision_surface.html` | EXISTS (12742 bytes) | 200 text/html |

All 4 report URLs: **would open successfully (200)**

## Missing Response Branch Check

`generate-report.js` has exactly one async response path: `execFile` callback sends either 500 (error) or 200 (success). No synchronous return-without-response path exists. Next.js async handler pattern — correct.

No "API resolved without sending a response" condition: callback always completes.

## Validation Checks

| Check | Result |
|---|---|
| FIX-VAL-01: generate-report returns 200 | PASS — lens_generate.sh EXIT 0 confirmed |
| FIX-VAL-02: JSON response emitted | PASS — constructed from code, deterministic |
| FIX-VAL-03: No missing response branch | PASS — callback always sends response |
| FIX-VAL-04: All 4 report_urls resolve to existing files | PASS |
| FIX-VAL-05: DPSIG signal loaded during generation | PASS — `[DPSIG] Loaded dpsig_signal_set.json (severity_band=CRITICAL)` |

**STEP 4: PASS — 5/5 checks PASS**
