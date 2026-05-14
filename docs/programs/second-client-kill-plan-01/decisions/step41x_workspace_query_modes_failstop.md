# Governance Trace — FAIL-STOP Record
## PI.41X.WORKSPACE-QUERY-MODES.01 — FAIL-STOP

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.WORKSPACE-QUERY-MODES.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** FAIL-STOP — UI runtime crash before commit

---

## Declared State at Interruption

Contract PI.41X.WORKSPACE-QUERY-MODES.01 reached Phase D (validation). CLI-level validation of 9 mode combinations (3 zones × 3 modes) returned `status=ok` for all cases. User initiated manual UI validation before commit was made. Runtime crash observed.

**No commit was made.** All changes are uncommitted.

---

## Observed Failure

**Error:**
```
TypeError: undefined is not an object (evaluating 'r.structural_scope.capability_ids.map')
```

**Location:** `app/gauge-product/pages/tier2/workspace.js` — `WhyResult` component, line 161

**Trigger:** User clicked WHY mode on a PZ-XXX projection zone in the browser UI.

---

## Root Cause Analysis

### Crash 1 — WhyResult / structural_scope.capability_ids (CONFIRMED — PRIMARY CRASH)

**Component:** `WhyResult` (workspace.js:161)  
**Code:** `{r.structural_scope.capability_ids.map(c => (...))}`  
**Cause:** Projection WHY response from `handle_projection_why()` returns `structural_scope` with `member_entity_ids` and `candidate_ids`, but does NOT include `capability_ids`. The UI component assumes BlueEdge canonical shape.

| Field | BlueEdge WHY `structural_scope` | Projection WHY `structural_scope` |
|---|---|---|
| `capability_count` | present | ABSENT |
| `capability_ids` | present (array) | ABSENT → `.map()` crash |
| `member_entity_ids` | absent | present |
| `candidate_ids` | absent | present |

### Crash 2 — EvidenceResult / trace_links (IDENTIFIED — NOT YET MANIFESTED)

**Component:** `EvidenceResult` (workspace.js:365)  
**Code:** `{s.trace_links.length > 0 ? ...}`  
**Cause:** Projection EVIDENCE signal_coverage items have no `trace_links` field. BlueEdge signal records always carry `trace_links[]`. Calling `.length` on undefined will crash when EVIDENCE mode is triggered on a PZ-XXX zone.

| Field | BlueEdge EVIDENCE `signal_coverage[n]` | Projection EVIDENCE `signal_coverage[n]` |
|---|---|---|
| `trace_links` | present (array) | ABSENT → crash on `.length` |
| `evidence_confidence` | present | ABSENT (has `activation_state`) |
| `title` | present | ABSENT |
| `condition_id` | absent | present |
| `activation_state` | absent | present |

### Rendering Defects (no crash, but blank/undefined output)

| Location | Field | BlueEdge | Projection | Effect |
|---|---|---|---|---|
| WhyResult:144 | `r.severity` | present | ABSENT | renders empty badge |
| WhyResult:145 | `r.confidence` | present | ABSENT | renders empty badge |
| WhyResult:160 | `r.structural_scope.capability_count` | present | ABSENT | renders "undefined capability nodes" |
| EvidenceResult:344 | `r.signals_total` | present | ABSENT (has `total_conditions`) | renders undefined |
| EvidenceResult:349 | `r.total_trace_links` | present | ABSENT | renders undefined |

---

## Files Inspected

- `scripts/pios/tier2_query_engine.py` — `handle_projection_why()` lines 536–595; `handle_projection_evidence()` lines 598–623
- `app/gauge-product/pages/tier2/workspace.js` — `WhyResult` lines 134–183; `EvidenceResult` lines 332–379; `TraceResult` lines 216–279
- `app/gauge-product/pages/api/query.js` — full file (106 lines)

## TraceResult — Not Affected

TraceResult (workspace.js:216) reads `data.trace || []`, `data.uncertainty.unresolved`, and `data.evidence_basis.missing`. Projection TRACE response populates `trace` via `build_projection_query_response`. `MissingBlock` null-guards `items`. No crash expected.

---

## Remediation Contract

**PI.41X.WORKSPACE-QUERY-SCHEMA-COMPAT.01**

Required fixes:
1. `tier2_query_engine.py` `handle_projection_why()` — add `capability_ids: []` and `capability_count: 0` to `structural_scope`
2. `workspace.js` `WhyResult` — guard `r.severity` and `r.confidence` badges; guard `capability_count` and `capability_ids`
3. `workspace.js` `EvidenceResult` — guard `s.trace_links` with optional chaining; guard `signals_total` and `total_trace_links` with nullish coalescing

All uncommitted changes from PI.41X.WORKSPACE-QUERY-MODES.01 are included in this remediation commit.

---

## Governance Confirmation

- No commit made during PI.41X.WORKSPACE-QUERY-MODES.01
- 41.x artifacts not modified
- No BlueEdge fallback introduced
- No synthetic values
- This document persisted before any fix is applied
