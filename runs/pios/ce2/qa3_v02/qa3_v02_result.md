# QA.3-v02 — Propagation Integrity Validation Result

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Run ID:** QA.3-v02
**Date:** 2026-04-02
**Result:** PASS

---

## INJECTION

- Signal: SIG-004.total_edge_density
- Value: 1.273 → 1.35
- Rule: BR-EDGE-DENSITY-001 (ABOVE_IS_RISK, baseline=1.273)
- Affected: COND-002 only

## VALIDATION ASSERTIONS

| # | Assertion | Result |
|---|---|---|
| 1 | COND-002 → AT_RISK | PASS |
| 2 | INTEL-002.synthesis_state = synthesized | PASS |
| 3 | 40.8 carries change correctly | PASS |
| 4 | 40.9 STATE_CHANGE for INTEL-002 | PASS |
| 5 | 40.10 REVIEW_REQUIRED for INTEL-002 | PASS |
| 6 | Exactly 1 STATE_CHANGE | PASS |
| 7 | Exactly 1 REVIEW_REQUIRED | PASS |
| 8 | No unintended entity changes | PASS |

## 40.9 SUMMARY

```
{
  "NO_CHANGE": 7,
  "STATE_CHANGE": 1,
  "ADDED": 0,
  "REMOVED": 0
}
```

## 40.10 SUMMARY

```
{
  "NO_ACTION": 7,
  "REVIEW_REQUIRED": 1,
  "REGISTER_ENTITY": 0,
  "DEREGISTER_ENTITY": 0
}
```
