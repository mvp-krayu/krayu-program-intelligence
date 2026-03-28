# A.5B — CONTROL Shadow Parity Validation Summary

Stream: A.5B | Validation Summary | Verdict Authority
Authority: A.5, A.4, A.3, A.2R, A.2G, canonical-layer-model.md (00.2)
Runtime target: index.js HEAD a5691c3 | Branch: feature/51-9-runtime-convergence
Execution date: 2026-03-28
Script: scripts/pios/A.5B/run_control_shadow_validation.mjs

---

## Verdict

**FAIL**

Two unexpected mismatches were identified between CONTROL.js and the runtime state machine. These mismatches are not within acceptable tolerance and cannot be waived without formal authority. A.6 is BLOCKED pending remediation.

---

## Validation Scope

| Dimension | Value |
|-----------|-------|
| Scenarios | 30 |
| Validation events | 44 |
| Intents covered | INIT, DEMO_START, AUTO_START, DEMO_NEXT, DEMO_EXIT, PANEL_TOGGLE, PERSONA_SELECT, QUERY_SELECT |
| Parity fields checked per event | 15 |
| Comparison method | Structural deep equality (exact field match) |
| Runtime extraction method | Pure functions extracted verbatim from index.js HEAD a5691c3 |

---

## Results

| Category | Count |
|----------|-------|
| Pass | 41 |
| Fail (unexpected) | 2 |
| Fail (documented) | 1 |
| Incomplete | 0 |
| **Total events** | **44** |

---

## Unexpected Mismatches

### MM-001 — D1/1 — DEMO_EXIT openPanels
- **Field:** `openPanels`
- **Runtime:** `["situation","narrative"]`
- **CONTROL:** `["situation"]`
- **Root cause:** CONTROL's DEMO_EXIT handler resets openPanels to `['situation']`; runtime does not call setOpenPanels on exit
- **Severity:** HIGH

### MM-003 — F1b/1 — PERSONA_SELECT mid-demo traversalHistory
- **Field:** `traversalHistory`
- **Runtime:** `["narrative"]`
- **CONTROL:** `[]`
- **Root cause:** CONTROL clears traversalHistory on PERSONA_SELECT when demoActive; runtime persona effect does not
- **Severity:** MEDIUM (same root as documented MM-002; unexpected because event lacks expectFail declaration)

---

## Documented Mismatch

### MM-002 — F1a/1 — PERSONA_SELECT mid-demo traversalHistory (pre-declared)
- **Field:** `traversalHistory`
- **Runtime:** `["narrative"]`
- **CONTROL:** `[]`
- **Status:** Pre-declared in scenario matrix. Reflects a known design gap — CONTROL models desired authority behavior; runtime not yet updated. Does not block on its own.

---

## Uncovered Paths (INCOMPLETE — documented, not failures)

| Path | Reason |
|------|--------|
| DEMO_NEXT Path B (legacy selectedFlow) | No scenario exercises selectedFlow without associated persona |
| DEMO_NEXT Path C (stage mode) | No scenario reaches demoStage iteration without persona flow |
| QUERY_SELECT null mid-demo | traversalHistory interaction in GUIDED mode not tested; ENTRY-only |
| DEMO_START from mid-demo without prior EXIT | Not a supported user path in current runtime |

---

## Governance Lock

| Gate | Status |
|------|--------|
| A.6 (CONTROL Integration) | **BLOCKED** |
| Reason | MM-001 and MM-003 are UNEXPECTED; must be resolved before A.6 |
| Required remediation | Fix CONTROL.js: (1) DEMO_EXIT must not reset openPanels; (2) PERSONA_SELECT must not clear traversalHistory when demoActive |
| Alternate resolution | MM-003 may be reclassified as DOCUMENTED if MM-002 decision determines CONTROL model is authoritative — then runtime must be updated to match; A.6 still blocked pending that change |

---

## Artifacts

| Artifact | Path |
|----------|------|
| Validation plan | docs/pios/contracts/A.5B/control_shadow_validation_plan.md |
| Trace log (44 events) | docs/pios/contracts/A.5B/control_shadow_trace_log.md |
| Mismatch register (3 entries) | docs/pios/contracts/A.5B/control_shadow_mismatch_register.md |
| Validation summary (this file) | docs/pios/contracts/A.5B/control_shadow_validation_summary.md |
| Execution script | scripts/pios/A.5B/run_control_shadow_validation.mjs |
