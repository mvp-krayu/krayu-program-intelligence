# QA.1-v02 — Rerun Result

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Run ID:** CE.2-R01-MIX-v02
**Date:** 2026-04-02
**Status:** PASS — original boundary resolved under CE.2

---

## PURPOSE

Formal rerun of the QA.1 boundary test against PiOS v0.2.

QA.1 (original) established the CE.2 boundary by proving that signal perturbation
produced no state change in v0.1. QA.1-v02 applies the same question to CE.2
outputs to confirm the boundary is resolved.

---

## QA.1 QUESTION (UNCHANGED)

> Does signal perturbation cause state change in the condition activation layer
> and propagate through feedback and control layers?

---

## ORIGINAL QA.1 RESULT (v0.1 — BOUNDARY-DEFINING FAIL)

**Execution:** CE.2-R01-MIX (v0.1 engine)
**Signal perturbation observed:**
- SIG-002 dependency_load_ratio: 0.682 → 0.773
- SIG-005 throughput_rate: 1.125 → 0.643

**Result:**
- 40.9 feedback: NO_CHANGE=8 / STATE_CHANGE=0
- 40.10 control: NO_ACTION=8 / REVIEW_REQUIRED=0
- Root cause: `activate_cond_*` functions hardcode `condition_coverage_state`;
  signal values not evaluated. Activation assertions 5–8 structurally unreachable.

**Confirmation artifact:** `runs/pios/ce2/qa1_boundary_confirmation_report.md`

---

## QA.1-v02 RESULT (CE.2 — BOUNDARY RESOLVED)

**Execution:** CE.2-R01-MIX-v02 (PiOS v0.2, CE.2 activation model)
**Governing decisions:** DEC-001 through DEC-014
**Signal inputs:** same perturbation as QA.1 (SIG-002=0.773, SIG-005=0.643)

**Condition state results (all 8 conditions re-evaluated):**

| Condition | v0.1 State | CE.2 State | Changed |
|---|---|---|---|
| COND-001 | complete | AT_RISK | YES |
| COND-002 | complete | STABLE | YES |
| COND-003 | partial | STABLE | YES |
| COND-004 | partial | AT_RISK | YES |
| COND-005 | blocked | BLOCKED | YES (vocabulary) |
| COND-006 | blocked | BLOCKED | YES (vocabulary) |
| COND-007 | partial | AT_RISK | YES |
| COND-008 | partial | STABLE | YES |

**40.9 feedback result:**
- NO_CHANGE: 3 / STATE_CHANGE: 5

**40.10 control result:**
- NO_ACTION: 3 / REVIEW_REQUIRED: 5

**Proof trace (COND-004):**
```
SIG-005.throughput_rate = 0.643
→ BR-THROUGHPUT-RATE-001: 0.643 < 1.125 → AT_RISK
→ max-tier: AT_RISK
→ COND-004.condition_coverage_state = AT_RISK (DEC-011)
→ DEC-014: AT_RISK → ACTIVE
→ DIAG-004.diagnosis_activation_state = ACTIVE
→ INTEL-004.synthesis_state = synthesized
→ 40.9: baseline=partial / CE.2=synthesized → STATE_CHANGE
→ 40.10: REVIEW_REQUIRED
```

**Proof run artifact:** `runs/pios/40.6/CE.2-R01-MIX-v02/` through `runs/pios/40.10/CE.2-R01-MIX-v02/`

---

## CONCLUSION

| Check | QA.1 (v0.1) | QA.1-v02 (CE.2) |
|---|---|---|
| Signal variation causes condition state change | NO | YES (8/8 conditions) |
| 40.9 emits STATE_CHANGE | NO | YES (5 of 8) |
| 40.10 emits REVIEW_REQUIRED | NO | YES (5 of 8) |
| Traceability: signal → tier → state → control | NOT APPLICABLE | DEMONSTRATED |

**QA.1-v02 result: PASS**
The original invariance boundary identified by QA.1 is resolved under PiOS v0.2
CE.2 activation model. Signal values now govern condition state via governed
binding rules and a deterministic tier hierarchy (DEC-009).

---

## PRESERVATION NOTE

This document does not replace or overwrite the original QA.1 artifacts.
The original QA.1 finding (`qa1_boundary_confirmation_report.md`) remains
the authoritative record of the v0.1 boundary. This document is a new
validation event.
