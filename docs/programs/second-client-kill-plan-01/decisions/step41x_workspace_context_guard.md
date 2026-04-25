# Governance Trace — Workspace Context Guard
## PI.41X.WORKSPACE-CONTEXT-GUARD.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.WORKSPACE-CONTEXT-GUARD.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Root Cause

`zonesData.context` is `undefined` in 41.x projection responses. The projection engine returns:
```json
{ "status": "ok", "run_id": "...", "client_id": "...", "projection_source": "41.x", "zones": [...], ... }
```

BlueEdge canonical responses include a `context` block:
```json
{ "context": { "score": 49, "band": "MODERATE RISK", "confidence": "52%–60%" }, ... }
```

The workspace rendered `zonesData.context.score`, `zonesData.context.band`, and `zonesData.context.confidence` without null-guarding. When `zonesData.context` is absent, all three throw `TypeError: undefined is not an object`.

---

## Fields Guarded

| Line | Before | After |
|---|---|---|
| 620 | `{zonesData.context.score}` | `{zonesData.context?.score ?? '—'}` |
| 621 | `{zonesData.context.band}` | `{zonesData.context?.band ?? 'Not available'}` |
| 626 | `{zonesData.context.confidence}` | `{zonesData.context?.confidence ?? '—'}` |

Optional chaining (`?.`) prevents the TypeError; nullish coalescing (`??`) renders the neutral placeholder when the field is absent.

**Backward compatible:** BlueEdge canonical responses always include `context` with all three fields — optional chaining short-circuits normally, `??` fallbacks are never reached.

---

## Validation

### Second-client (projection zones)

`USE_SECOND_CLIENT = true` → `zonesData.context` is `undefined`

| Check | Result |
|---|---|
| Page loads without crash | PASS — optional chaining prevents TypeError |
| PZ-001 / PZ-002 / PZ-003 visible | PASS — zone list renders from `zonesData.zones` |
| Score field renders | PASS — displays `'—'` |
| Band field renders | PASS — displays `'Not available'` |
| Confidence field renders | PASS — displays `'—'` |
| No BlueEdge strings | PASS — no synthetic values injected |

### BlueEdge regression

`USE_SECOND_CLIENT = false` → `zonesData.context` present with `score`, `band`, `confidence`

| Check | Result |
|---|---|
| `context?.score` | PASS — `?.` resolves to `context.score`; `??` not triggered |
| `context?.band` | PASS — same |
| `context?.confidence` | PASS — same |
| Existing context values render | PASS — unchanged behavior |

### Failure mode (missing 41.x)

`zones.js` returns HTTP 404 → `fetch` resolves with `data.status === 'NOT_AVAILABLE'` → `data.status !== 'ok'` → `setPageState('error')` → workspace renders error state, not zone list. Context block never rendered. No crash.

---

## Governance Confirmation

- `/api/zones` not modified
- `tier2_query_engine.py` not modified
- 41.x artifacts not modified
- No score values synthesized or computed
- No BlueEdge context fallback introduced
- Only file modified: `app/gauge-product/pages/tier2/workspace.js` (3 lines)
