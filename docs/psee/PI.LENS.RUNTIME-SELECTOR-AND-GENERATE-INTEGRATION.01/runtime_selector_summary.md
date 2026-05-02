# Runtime Selector Summary
## PI.LENS.RUNTIME-SELECTOR-AND-GENERATE-INTEGRATION.01

**Date:** 2026-05-02
**Branch:** work/psee-runtime

---

## What Was Built

Three components wired together:

### 1. Discovery — `/api/runtime-list`

New file: `app/gauge-product/pages/api/runtime-list.js`

Scans `clients/*/psee/runs/*/` for eligible runtimes (has both `vault/` and `semantic/`).
Returns: `[{client, run, base_path, reports_path, graph_state_path, has_reports}]`

Validated: returns `blueedge / run_blueedge_productized_01_fixed` with `has_reports: true`.

### 2. Generate Action — `/api/generate-report`

New file: `app/gauge-product/pages/api/generate-report.js`

Input: `?client=<client>&run=<run>` (both validated against `[A-Za-z0-9._-]+`)
Invokes: `execFile('bash', [lens_generate.sh, '--client', client, '--run', run], { cwd: REPO_ROOT })`
Returns: `{status, client, run, reports, report_urls}`

The `report_urls` use `source=psee` routing in `report-file.js`.

### 3. File Serving — `/api/report-file?source=psee`

Updated: `app/gauge-product/pages/api/report-file.js`

Added `resolvePseeRunFilePath()` function and `source=psee` branch in handler.
Routes to `clients/<client>/psee/runs/<runId>/reports/<name>` (flat directory).
Supports HTML reports + `graph_state.json`.
Path traversal guarded: `path.basename()` validation + startsWith check.

### 4. UI Selector — `pages/lens.js`

Added: `RuntimeSelector` component.

- Fetches `/api/runtime-list` on mount
- Renders dropdown (client/run pairs)
- Generate button calls `/api/generate-report`
- On success: shows 4 report buttons (Executive Brief, Structural Evidence, Diagnostic, Decision Surface)
- Each button opens report in new tab via `window.open(url)`

Placed in new `lens-band` immediately above existing `ReportPanel`.

---

## Decision Surface

The generated Decision Surface served via `source=psee` route contains:
- WHERE PRESSURE EXISTS (`ds-epb-section-title`)
- Structural Pressure Signals (`ds-epb-card-title`)
- Graph visualization (`canvas id=ds-signal-trace`)
- INVESTIGATE posture
- Score 60 / CONDITIONAL
- INFERENCE_PROHIBITION

Normalized diff vs canonical: 0 lines (run-id volatile metadata only).
