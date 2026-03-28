# A.5B — CONTROL Shadow Parity Validation Summary

Stream: A.5B | Validation Summary | Verdict Authority
Authority: A.5, A.5C, A.4, A.3, A.2R, A.2G, canonical-layer-model.md (00.2)
Runtime target: index.js HEAD a5691c3 | Branch: feature/51-9-runtime-convergence
Initial execution date: 2026-03-28 | Rerun date: 2026-03-28 (post A.5C remediation commit 49e4c32)
Script: scripts/pios/A.5B/run_control_shadow_validation.mjs

---

## Verdict

**PASS**

Zero unexpected mismatches. Zero documented mismatches. 44/44 validation events pass.
All previously identified mismatches (MM-001, MM-002, MM-003) resolved by A.5C.
A.6 is eligible to proceed subject to path coverage governance review (see uncovered paths below).

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

## Results (Rerun — Post A.5C)

| Category | Count |
|----------|-------|
| Pass | 44 |
| Fail (unexpected) | 0 |
| Fail (documented) | 0 |
| Incomplete | 0 |
| **Total events** | **44** |

---

## Prior Mismatches — Resolved

| ID | Field | Initial result | Post-A.5C |
|----|-------|---------------|-----------|
| MM-001 | D1/1 `openPanels` | UNEXPECTED FAIL | PASS |
| MM-002 | F1a/1 `traversalHistory` | DOCUMENTED | PASS |
| MM-003 | F1b/1 `traversalHistory` | UNEXPECTED FAIL | PASS |

---

## Uncovered Paths (INCOMPLETE — documented, not failures)

These paths remain uncovered under A.5B. They were uncovered in the initial run and remain uncovered in the rerun. Coverage governance for A.6 must address these explicitly.

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
| A.6 (CONTROL Integration) | **ELIGIBLE** — subject to uncovered path governance |
| Condition | A.6 stream must explicitly acknowledge the 4 uncovered paths and declare acceptable coverage governance before proceeding |

---

## Artifacts

| Artifact | Path |
|----------|------|
| Validation plan | docs/pios/contracts/A.5B/control_shadow_validation_plan.md |
| Trace log (44 events) | docs/pios/contracts/A.5B/control_shadow_trace_log.md |
| Mismatch register (3 resolved) | docs/pios/contracts/A.5B/control_shadow_mismatch_register.md |
| Validation summary (this file) | docs/pios/contracts/A.5B/control_shadow_validation_summary.md |
| Execution script | scripts/pios/A.5B/run_control_shadow_validation.mjs |
| Remediation record | docs/pios/contracts/A.5C/control_shadow_remediation_record.md |
