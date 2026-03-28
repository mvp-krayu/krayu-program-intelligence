# A.5B — CONTROL Shadow Mismatch Register

Stream: A.5B | Mismatch Classification | Non-Destructive
Authority: A.5, A.4, A.3, A.2R, A.2G
Runtime target: index.js HEAD a5691c3 | Branch: feature/51-9-runtime-convergence
Execution date: 2026-03-28

---

## Classification Schema

- **UNEXPECTED**: CONTROL.js behavior does not match runtime; was not pre-declared as expected. Blocks A.6.
- **DOCUMENTED**: Pre-declared mismatch in scenario matrix (expectFail). Not unexpected. Does not block on its own.

---

## MM-001 — D1/1 — DEMO_EXIT openPanels reset

| Field | Value |
|-------|-------|
| ID | MM-001 |
| Classification | UNEXPECTED |
| Scenario | D1: DEMO_EXIT from active guided mode |
| Event | D1/1 |
| Field | `openPanels` |
| Runtime value | `["situation","narrative"]` |
| CONTROL value | `["situation"]` |
| Severity | HIGH — CONTROL incorrectly models runtime behavior |

**Root cause:**

CONTROL.js `DEMO_EXIT` handler explicitly sets `openPanels: ['situation']` in the returned state delta. The runtime `handleDemoExit` in `index.js` (a5691c3) does not call `setOpenPanels` — panels remain exactly as they were when the user exited guided mode.

**CONTROL code location:** `Control.js`, `DEMO_EXIT` case, line constructing `nextOpenPanels`.

**Remediation required before A.6:**
Remove the `openPanels: ['situation']` override in CONTROL's `DEMO_EXIT` handler. The correct behavior is to preserve the current `openPanels` unchanged on exit. CONTROL must return `openPanels: currentSnapshot.openPanels` (unchanged) for this intent.

---

## MM-002 — F1a/1 — PERSONA_SELECT mid-demo traversalHistory (documented)

| Field | Value |
|-------|-------|
| ID | MM-002 |
| Classification | DOCUMENTED |
| Scenario | F1a: PERSONA_SELECT during guided mode (pre-declared expectFail) |
| Event | F1a/1 |
| Field | `traversalHistory` |
| Runtime value | `["narrative"]` |
| CONTROL value | `[]` |
| Severity | MEDIUM — expected divergence; CONTROL models desired authority behavior, runtime has not been updated |

**Root cause:**

CONTROL.js `PERSONA_SELECT` handler clears `traversalHistory` when `demoActive=true`. The runtime's `useEffect` for persona changes (`enlPersona` dependency) does NOT clear `traversalHistory` — it only clears `rawStepActive`. `traversalHistory` is only reset via `handleStartDemo`, `handleAutoStart`, or `handleDemoExit`.

**Status:** Pre-declared in scenario matrix (F1a flagged `expectFail: true`). This mismatch documents that CONTROL's model of the desired authority behavior diverges from current runtime. The runtime has not yet been updated to match the CONTROL authority intent. This is a known design gap, not a CONTROL modeling error.

**Remediation note:** Either (a) align runtime to CONTROL's model — add `setTraversalHistory([])` to the persona change effect when `demoActive`, or (b) formally accept the divergence and remove the clear from CONTROL to match runtime truth. Classification determines which remediation applies and must be decided in the next stream.

---

## MM-003 — F1b/1 — PERSONA_SELECT mid-demo traversalHistory (unexpected surface)

| Field | Value |
|-------|-------|
| ID | MM-003 |
| Classification | UNEXPECTED |
| Scenario | F1b: PERSONA_SELECT mid-demo + AUTO_START (net parity test) |
| Event | F1b/1 (step 1 of 2) |
| Field | `traversalHistory` |
| Runtime value | `["narrative"]` |
| CONTROL value | `[]` |
| Severity | MEDIUM — same root cause as MM-002; unexpected because F1b event 1 was not flagged `expectFail` |

**Root cause:**

Identical root cause to MM-002: CONTROL clears `traversalHistory` on `PERSONA_SELECT` when `demoActive=true`; runtime does not. F1b/1 is the persona change step in the F1b scenario without the `expectFail` protection applied to F1a/1. Because the comparison runs unconditionally at F1b/1, the mismatch surfaces as UNEXPECTED.

**Relationship to MM-002:** Same underlying divergence, different test surface. MM-003 is not an additional distinct bug in CONTROL — it is the same divergence exposed by a scenario that does not carry an `expectFail` declaration.

**Remediation required before A.6:**
Either (a) propagate the F1a `expectFail` declaration to F1b/1 and reclassify MM-003 as DOCUMENTED, or (b) fix the root cause (MM-002 decision) which resolves MM-003 as a consequence. A.6 cannot begin while MM-003 remains UNEXPECTED regardless of origin.

---

## Summary

| ID | Scenario | Classification | Field | Blocks A.6 |
|----|----------|----------------|-------|------------|
| MM-001 | D1/1 DEMO_EXIT | UNEXPECTED | openPanels | YES |
| MM-002 | F1a/1 PERSONA_SELECT mid-demo | DOCUMENTED | traversalHistory | NO |
| MM-003 | F1b/1 PERSONA_SELECT mid-demo | UNEXPECTED | traversalHistory | YES |

**A.6 gate status: BLOCKED** — MM-001 and MM-003 remain UNEXPECTED. Both must be resolved (remediated or reclassified with formal authority) before A.6 may proceed.
