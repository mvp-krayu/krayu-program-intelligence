# EX.2 — Debug Endpoint Specification

**Stream:** EX.2 — Debug / Trace Interface
**Artifact type:** DEBUG ENDPOINT SPEC
**Date:** 2026-04-04
**Authority:** EX.2

---

## 1. ENDPOINT

**Route:** `GET /api/execlens?debug=true`
**Handler file:** `app/execlens-demo/pages/api/execlens.js`
**Adapter:** `scripts/pios/EX.2/pios_debug_adapter.py`

---

## 2. DISPATCH LOGIC

In `pages/api/execlens.js`:

```javascript
if (debug === 'true') {
  return runScript(ADAPTER_EX2, [], res)
}
```

This branch is evaluated **first** — before `pios_live`, `status`, `enl`,
`persona`, `overview`, `topology`, `list`, and `query`. No query parameters
other than `debug=true` are consumed by this handler.

**ADAPTER_EX2** resolves to:
```javascript
const ADAPTER_EX2 = path.join(REPO_ROOT, 'scripts', 'pios', 'EX.2', 'pios_debug_adapter.py')
```

---

## 3. REQUEST / RESPONSE

**Method:** GET only (405 returned for all other methods — enforced by execlens.js)

**Request parameters:**
- `debug=true` — activates this route
- All other parameters ignored

**Response on success (HTTP 200):**
```json
{
  "debug_run_id":           "<run_id>",
  "telemetry_source":       "STATIC_BASELINE | LIVE_TELEMETRY",
  "stream":                 "EX.2",
  "signal_output_path":     "runs/pios/40.5/<run_id>/signal_output.json",
  "condition_output_path":  "runs/pios/40.6/<run_id>/condition_output.json",
  "signals":                { ... },
  "ce5_consumption_records":  { ... },
  "ce5_traceability_records": { ... },
  "conditions":             { ... },
  "diagnoses":              { ... },
  "trace_chains":           [ ... ],
  "signal_summary":         { ... },
  "condition_summary":      { ... },
  "diagnosis_summary":      { ... }
}
```

**Response on engine failure (HTTP 400):**
```json
{ "error": "ENGINE_FAILURE: pios_bridge returned None — engine unavailable or vocabulary violation" }
```

**Response on missing archive (HTTP 400):**
```json
{ "error": "signal_output.json not found: <path>" }
```

**Response on adapter import failure (HTTP 400):**
```json
{ "error": "EX.2 FAILURE — cannot import pios_bridge: <detail>" }
```

**Response on JSON parse error from adapter (HTTP 500):**
```json
{ "error": "JSON parse error from adapter", "raw": "<first 500 chars of stdout>" }
```

---

## 4. ADAPTER INVOCATION

`runScript(ADAPTER_EX2, [], res)` calls:
```
python3 scripts/pios/EX.2/pios_debug_adapter.py
```
No arguments. Timeout: 30 seconds (inherited from `runScript` default).

The adapter outputs JSON to stdout. All errors are reported as JSON on stdout
(adapter exits 0 with `{"error": ...}`) or as stderr (which maps to HTTP 400).

---

## 5. SIDE EFFECTS

- **Engine invoked:** Yes — via `pios_bridge.get_live_pios_data()`. A new run
  archive pair is written to `runs/pios/40.5/<run_id>/` and `runs/pios/40.6/<run_id>/`
  on every request.
- **Read-only surface:** Yes — EX.2 reads the run archives but does not modify
  them or any other file.
- **No UI changes:** EX.2 does not modify any UI component, page, or CSS.
- **No runtime route changes:** Existing routes (`?query`, `?overview`,
  `?topology`, `?pios_live`) are unchanged.

---

## 6. CLASSIFICATION

| Property | Value |
|---|---|
| CE.11 class | GC-002 (new read-only debug surface) |
| Authority | EX.2 |
| Runtime impact | Read-only debug surface; no governance state changes |
| Mutation risk | NONE — no writes to governed artifacts |
| Dispatch priority | 1st (evaluated before all other params) |
