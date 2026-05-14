# Navigation Fix Summary
## PI.LENS.RUNTIME-SELECTOR-CLEANUP-AND-WORKSPACE-BINDING.01

**Date:** 2026-05-03

---

## Problem

Generated PSEE reports contain internal navigation links in the form:

```html
href="/api/report-file?name=lens_tier1_narrative_brief.html&client=blueedge&runId=run_blueedge_productized_01_fixed"
```

These use `resolveClientFilePath()` routing (clients/<client>/reports/tier1/) — NOT the psee run directory.
When served via `source=psee`, cross-navigation would leave the psee routing context.

## Solution

Added `rewritePseeLinks(html, client, runId)` to `app/gauge-product/pages/api/report-file.js`.

Applied only in the `source=psee` branch, before HTML is sent to the client.
Stored files are NOT modified.

### Two patterns handled:

**Pattern 1 — Relative links:**
```
href="lens_*.html"  →  href="/api/report-file?source=psee&client=X&runId=Y&name=lens_*.html"
```

**Pattern 2 — Full API URLs without source=psee:**
```
href="/api/report-file?name=lens_*.html&..."  →  href="/api/report-file?source=psee&client=X&runId=Y&name=lens_*.html"
```

Workspace and other non-lens links (e.g. `/tier2/workspace?client=...&runId=...`) are preserved unchanged.

## Validation

Curl of served Decision Surface — all internal links rewritten:

```
href="/api/report-file?source=psee&client=blueedge&runId=run_blueedge_productized_01_fixed&name=lens_tier1_narrative_brief.html"
href="/api/report-file?source=psee&client=blueedge&runId=run_blueedge_productized_01_fixed&name=lens_tier1_evidence_brief.html"
href="/api/report-file?source=psee&client=blueedge&runId=run_blueedge_productized_01_fixed&name=lens_tier2_diagnostic_narrative.html"
href="/tier2/workspace?client=blueedge&runId=run_blueedge_productized_01_fixed"
```

Cross-navigation: GET rewritten Executive Brief link → HTTP 200.
