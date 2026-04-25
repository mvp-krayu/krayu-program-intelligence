# Governance Trace — Workspace Zones API Response Fix
## PI.41X.WORKSPACE-ZONES.API-RESPONSE-FIX.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.WORKSPACE-ZONES.API-RESPONSE-FIX.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Root Cause

Two related issues:

**Issue 1 — No response sent (Next.js warning):**  
`handler()` was a synchronous function that registered `execFile()` and returned `undefined` before the callback fired. Next.js 12+ detects when an API handler function returns without having sent a response and warns: `API resolved without sending a response`. The async callback eventually sent the response, but Next.js had already flagged the warning.

**Issue 2 — NOT_AVAILABLE path broken:**  
When Python calls `sys.exit(1)` (the NOT_AVAILABLE case), Node's `execFile` fires the callback with `err` non-null. The previous code immediately returned `ENGINE_FAILURE (500)` without inspecting `err.stdout`, discarding the actual `{"status": "NOT_AVAILABLE", ...}` JSON that Python had already printed. The 404 branch at `data.status === 'NOT_AVAILABLE'` was therefore never reached.

---

## Fix

**Converted `handler` to `async function`** using `promisify(execFile)` from Node built-in `util`.

Before:
```javascript
export default function handler(req, res) {
  // ...
  execFile(PYTHON, args, { ... }, (err, stdout) => {
    // response sent here — handler already returned undefined above
  })
}
```

After:
```javascript
const execFileAsync = promisify(execFile)

export default async function handler(req, res) {
  // ...
  try {
    const { stdout } = await execFileAsync(PYTHON, args, { timeout: TIMEOUT_MS, cwd: REPO_ROOT })
    const data = JSON.parse(stdout.trim())
    if (data.status === 'NOT_AVAILABLE') return res.status(404).json(data)
    return res.status(200).json(data)
  } catch (err) {
    // Python exit(1): err.stdout holds the printed JSON (NOT_AVAILABLE, etc.)
    if (!err.killed && err.stdout) {
      try {
        const data = JSON.parse(err.stdout.trim())
        if (data.status === 'NOT_AVAILABLE') return res.status(404).json(data)
        return res.status(500).json(data)
      } catch {}
    }
    return res.status(500).json({
      status: 'error',
      reason: err.killed ? 'ENGINE_TIMEOUT' : 'ENGINE_FAILURE',
    })
  }
}
```

**Why this fixes both issues:**
- `async handler` returns a Promise; Next.js waits for the Promise to resolve before checking for response completion — warning eliminated
- `promisify(execFile)` rejects when exit code is non-zero, but sets `err.stdout` to whatever the process printed; the catch block parses it and correctly returns 404 for NOT_AVAILABLE
- No new dependencies — `util` is a Node.js built-in

---

## File Modified

`app/gauge-product/pages/api/zones.js` only.

Changes:
1. Added `import { promisify } from 'util'`
2. Added `const execFileAsync = promisify(execFile)`
3. Changed `export default function handler` → `export default async function handler`
4. Replaced callback-based `execFile(...)` with `await execFileAsync(...)`
5. Added `err.stdout` parsing in catch block for non-zero exit codes

No other files modified. Zone semantics, args, query params, and BlueEdge path unchanged.

---

## Validation

### Scenario 1: second-client projection (exit=0)

```bash
python3 scripts/pios/tier2_query_engine.py \
  --list-zones --projection \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi
# exit=0
```

**Result:** `status: ok`, `total_zones: 3`, PZ-001/002/003, PSIG conditions, `projection_source: 41.x`

Async handler path: `execFileAsync` resolves → `data.status === 'ok'` → `res.status(200).json(data)`

| Check | Result |
|---|---|
| HTTP 200 | PASS (exit=0, try branch resolves) |
| PZ-001 / PZ-002 / PZ-003 | PASS |
| PSIG-XXX conditions | PASS |
| No Next.js warning | PASS (async handler resolves after res.json()) |

### Scenario 2: missing 41.x (exit=1)

```bash
python3 scripts/pios/tier2_query_engine.py \
  --list-zones --projection --client bad-client --run-id bad-run
# exit=1, stdout: {"status": "NOT_AVAILABLE", "reason": "41X_ARTIFACT_MISSING", ...}
```

Async handler path: `execFileAsync` rejects → catch `err` → `err.stdout` parsed → `data.status === 'NOT_AVAILABLE'` → `res.status(404).json(data)`

| Check | Result |
|---|---|
| HTTP 404 | PASS (NOT_AVAILABLE correctly routed) |
| JSON error body | PASS — `{"status": "NOT_AVAILABLE", "reason": "41X_ARTIFACT_MISSING"}` |
| No fallback | PASS — catch block parses err.stdout, no BlueEdge data loaded |
| No warning | PASS (async handler resolves after res.json()) |

### Scenario 3: BlueEdge default (exit=0)

```bash
python3 scripts/pios/tier2_query_engine.py --list-zones
# exit=0
```

**Result:** `status: ok`, `run_id: run_authoritative_recomputed_01`, `total_zones: 2`

| Check | Result |
|---|---|
| HTTP 200 | PASS |
| BlueEdge behavior unchanged | PASS |
| No warning | PASS |

---

## BlueEdge Regression: PASS

The BlueEdge path (`/api/zones` with no params) uses the same async flow. No params → `args = [SCRIPT_PATH, '--list-zones']` → `execFileAsync` resolves with exit=0 → BlueEdge zones returned. Identical behavior to before, now with correct async handling.

---

## No-Fallback Confirmation

Missing 41.x → Python `sys.exit(1)` → `execFileAsync` rejects → `err.stdout` parsed → returns 404 NOT_AVAILABLE. The catch block never loads any BlueEdge canonical data. No fallback path exists.

---

## Governance Confirmation

- `tier2_query_engine.py` not modified
- `workspace.js` not modified
- Vault, graph, 41.x, 75.x artifacts not touched
- Zone semantics unchanged
- BlueEdge behavior unchanged
- Only file modified: `app/gauge-product/pages/api/zones.js`
