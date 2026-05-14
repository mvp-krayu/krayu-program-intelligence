# UI Wiring Summary
## PI.LENS.RUNTIME-SELECTOR-AND-GENERATE-INTEGRATION.01

**Date:** 2026-05-02

---

## Component: RuntimeSelector (added to lens.js)

### State

| State | Type | Purpose |
|-------|------|---------|
| `runtimes` | `Array` | List from `/api/runtime-list` |
| `selected` | `string` | `"client||run"` composite key |
| `genState` | `null \| 'loading' \| {urls} \| {error}` | Generation lifecycle |

### Mount behavior

`useEffect` fetches `/api/runtime-list` once on mount.
First runtime auto-selected.

### Generate flow

1. User selects runtime from dropdown
2. User clicks Generate
3. `genState = 'loading'` — button shows "Generating…"
4. `fetch('/api/generate-report?client=...&run=...')`
5. On success: `genState = { urls: data.report_urls }` — 4 report buttons appear
6. Each button: `window.open(url)` where url = `/api/report-file?source=psee&...`

### Page placement

After: `IntelligenceGateCTA` band
Before: existing `ReportPanel` band

Existing page content unchanged.

---

## Data Flow

```
RuntimeSelector
  → GET /api/runtime-list
      → fs.readdir(clients/*/psee/runs/*)
      ← [{client, run, ...}]
  → dropdown populated

[Generate click]
  → GET /api/generate-report?client=blueedge&run=run_blueedge_productized_01_fixed
      → execFile(bash, [lens_generate.sh, --client, blueedge, --run, run_...])
          → realpath(vault symlink) → run_blueedge_productized_01/vault
          → python3 lens_report_generator.py (GROUNDED 41.x resolution)
          → 4 reports written to run_fixed/reports/
      ← {status: success, report_urls: {decision: /api/report-file?source=psee&...}}
  → buttons appear

[Decision Surface button click]
  → window.open(/api/report-file?source=psee&client=blueedge&runId=run_fixed&name=lens_decision_surface.html)
      → resolvePseeRunFilePath → clients/blueedge/psee/runs/run_fixed/reports/lens_decision_surface.html
      ← 200 text/html (full decision surface with EPB block)
```
