# QA.4-v02 — Shared-Signal Fan-Out Validation Result

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Run ID:** QA.4-v02
**Date:** 2026-04-02
**Result:** PASS

---

## INJECTION

- Shared signal: SIG-002.dependency_load_ratio
- Value: 0.773 → 0.5
- Rule: BR-DEP-LOAD-RATIO-001 (ABOVE_IS_RISK, baseline=0.682)
- Fan-out: COND-001 + COND-007 (each with one binding row)

## CONDITION STATES

| Condition | Baseline | QA.4 | Changed |
|---|---|---|---|
| COND-001 | AT_RISK | STABLE | YES |
| COND-002 | STABLE | STABLE | NO |
| COND-003 | STABLE | STABLE | NO |
| COND-004 | AT_RISK | AT_RISK | NO |
| COND-005 | BLOCKED | BLOCKED | NO |
| COND-006 | BLOCKED | BLOCKED | NO |
| COND-007 | AT_RISK | STABLE | YES |
| COND-008 | STABLE | STABLE | NO |

## VALIDATION ASSERTIONS

| # | Assertion | Result |
|---|---|---|
| 1 | SIG-002 fans out → COND-001=STABLE | PASS |
| 2 | SIG-002 fans out → COND-007=STABLE | PASS |
| 3 | INTEL-001.synthesis_state=stable | PASS |
| 4 | INTEL-007.synthesis_state=stable | PASS |
| 5 | 40.9 STATE_CHANGE for INTEL-001 | PASS |
| 6 | 40.9 STATE_CHANGE for INTEL-007 | PASS |
| 7 | 40.10 REVIEW_REQUIRED for INTEL-001 | PASS |
| 8 | 40.10 REVIEW_REQUIRED for INTEL-007 | PASS |
| 9 | Exactly 2 STATE_CHANGEs (count=2) | PASS |
| 10 | Exactly 2 REVIEW_REQUIREDs (count=2) | PASS |
| 11 | No unintended entity changes | PASS |
| 12 | Independent resolution — no cross-condition coupling | PASS |
| 13 | Deterministic — TIER_ORDER total order | PASS |

## 40.9 SUMMARY

```
{
  "NO_CHANGE": 6,
  "STATE_CHANGE": 2,
  "ADDED": 0,
  "REMOVED": 0
}
```

## 40.10 SUMMARY

```
{
  "NO_ACTION": 6,
  "REVIEW_REQUIRED": 2,
  "REGISTER_ENTITY": 0,
  "DEREGISTER_ENTITY": 0
}
```
