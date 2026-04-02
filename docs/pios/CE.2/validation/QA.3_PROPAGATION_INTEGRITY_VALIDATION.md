# QA.3 — PROPAGATION INTEGRITY VALIDATION

**Status:** PASS — TARGETED PROPAGATION VERIFIED
**Baseline:** CE.2 (PiOS v0.2)
**Run ID:** QA.3-v02
**Date:** 2026-04-02
**Governed by:** DEC-001 through DEC-014

---

## 1. INJECTION SPECIFICATION

Single-field override on an exact-boundary signal. No multi-signal conflict.

| Field | Original Value | Injected Value | Rule | Direction | Threshold |
|---|---|---|---|---|---|
| SIG-004.total_edge_density | 1.273 | 1.350 | BR-EDGE-DENSITY-001 | ABOVE_IS_RISK | 1.273 |

**Base signals:** `runs/pios/40.5/CE.2-R01-MIX/signal_output.json` (all 8 signals)
**Override:** SIG-004.total_edge_density only — all other signal values unchanged.

**Isolation:** EXACT — no other binding table row references SIG-004. COND-002 is the only condition affected.

**Rationale:** SIG-004.total_edge_density was at exactly the boundary in the CE.2-R01-MIX baseline (1.273 <= 1.273 → STABLE). Injecting 1.350 crosses the threshold (1.350 > 1.273 → AT_RISK). This is the narrowest existing-rule-compatible injection possible for this scenario.

---

## 2. SELECTED CONDITION

**COND-002** — Structural Volatility State

---

## 3. SIGNAL VALUE USED

```
SIG-004.total_edge_density = 1.350  (injected)
Baseline threshold:           1.273
Evaluation:                   1.350 > 1.273 → AT_RISK
```

---

## 4. BINDING RULE EVALUATION

```
Condition:    COND-002
Signal:       SIG-004.total_edge_density = 1.350
Rule:         BR-EDGE-DENSITY-001
Type:         BASELINE_THRESHOLD
Direction:    ABOVE_IS_RISK
Threshold:    1.273
Evaluation:   1.350 > 1.273 → AT_RISK
Tier:         AT_RISK
```

---

## 5. RESULTING CONDITION STATE

| Condition | CE.2-R01-MIX-v02 Baseline | QA.3 State | Changed |
|---|---|---|---|
| COND-001 | AT_RISK | AT_RISK | NO |
| COND-002 | STABLE | AT_RISK | YES |
| COND-003 | STABLE | STABLE | NO |
| COND-004 | AT_RISK | AT_RISK | NO |
| COND-005 | BLOCKED | BLOCKED | NO |
| COND-006 | BLOCKED | BLOCKED | NO |
| COND-007 | AT_RISK | AT_RISK | NO |
| COND-008 | STABLE | STABLE | NO |

---

## 6. 40.7 DIAGNOSIS RESULT

```
DEC-009:   single contribution → max-tier = AT_RISK
DEC-011:   COND-002.condition_coverage_state = 'AT_RISK'
DEC-014:   AT_RISK → ACTIVE
           DIAG-002.diagnosis_activation_state = 'ACTIVE'
CE.2 synth: ACTIVE → 'synthesized'
           INTEL-002.synthesis_state = 'synthesized'
```

All other INTEL entities unchanged from CE.2-R01-MIX-v02.

---

## 7. 40.8 DELIVERY RESULT

`INTEL-002.synthesis_state = 'synthesized'` carried correctly in delivery packet.
No structural loss between 40.7 and 40.8.

---

## 8. 40.9 COMPARISON RESULT

Baseline for comparison: CE.2-R01-MIX-v02 delivery packet.

| Entity | Baseline synthesis_state | QA.3 synthesis_state | Classification |
|---|---|---|---|
| INTEL-001 | synthesized | synthesized | NO_CHANGE |
| INTEL-002 | stable | synthesized | STATE_CHANGE |
| INTEL-003 | stable | stable | NO_CHANGE |
| INTEL-004 | synthesized | synthesized | NO_CHANGE |
| INTEL-005 | blocked | blocked | NO_CHANGE |
| INTEL-006 | blocked | blocked | NO_CHANGE |
| INTEL-007 | synthesized | synthesized | NO_CHANGE |
| INTEL-008 | stable | stable | NO_CHANGE |

**Summary:** `NO_CHANGE: 7 / STATE_CHANGE: 1 / ADDED: 0 / REMOVED: 0`

---

## 9. 40.10 DIRECTIVE RESULT

| Entity | Source | Directive |
|---|---|---|
| INTEL-001, 003–008 | NO_CHANGE | NO_ACTION |
| INTEL-002 | STATE_CHANGE | REVIEW_REQUIRED |

**Summary:** `NO_ACTION: 7 / REVIEW_REQUIRED: 1`

---

## 10. UNCHANGED-ENTITY CHECK

All 7 unaffected entities confirmed NO_CHANGE at 40.9 and NO_ACTION at 40.10.

```
INTEL-001: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-003: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-004: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-005: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-006: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-007: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-008: 40.9=NO_CHANGE  40.10=NO_ACTION
```

Over-propagation count: **0**

---

## 11. FULL END-TO-END TRACE — COND-002 → INTEL-002 → 40.10

```
40.5 injection:  SIG-004.total_edge_density 1.273 → 1.350
Binding rule:    BR-EDGE-DENSITY-001 (ABOVE_IS_RISK, baseline=1.273)
Evaluation:      1.350 > 1.273 → AT_RISK
Tier:            AT_RISK

DEC-009:         single contribution → max-tier = AT_RISK
                 (no conflict resolution required)
DEC-011 emit:    COND-002.condition_coverage_state = 'AT_RISK'
DEC-014:         AT_RISK → ACTIVE
                 DIAG-002.diagnosis_activation_state = 'ACTIVE'
CE.2 synthesis:  ACTIVE → 'synthesized'
                 INTEL-002.synthesis_state = 'synthesized'

40.8:            delivery_packet carries synthesis_state = 'synthesized'
                 (structural pass-through, no transformation)

40.9 baseline:   INTEL-002.synthesis_state = 'stable'  (CE.2-R01-MIX-v02)
40.9 current:    INTEL-002.synthesis_state = 'synthesized'
40.9 result:     STATE_CHANGE

40.10 result:    REVIEW_REQUIRED

Propagation:     COMPLETE — no break detected at any layer boundary
```

---

## 12. VALIDATION STATEMENT

QA.3 validates downstream propagation integrity under CE.2.

**Verified behaviors:**

- Targeted injection: one signal field change causes exactly one condition state change
- Propagation completeness: change is carried through 40.6 → 40.7 → 40.8 → 40.9 → 40.10 without loss
- Propagation isolation: 7 of 8 entities remain NO_CHANGE / NO_ACTION — no over-broadcast
- Layer fidelity: each layer correctly reflects the upstream change without amplification or suppression

**Observed system behavior:**

- 1 downstream state transition (COND-002 → INTEL-002: stable → synthesized)
- 1 REVIEW_REQUIRED directive at 40.10
- 7 entities fully unchanged across all layers

**Conclusion:**

CE.2 downstream propagation is VALIDATED for targeted single-condition injection.
The activation chain is neither lossy nor over-broadcast under minimal perturbation.

---

## 13. CLASSIFICATION

```
Artifact Type:  VALIDATION EVIDENCE
Authority:      NON-AUTHORITATIVE (test artifact)
Scope:          QA.3 only
Baseline:       CE.2 — PiOS v0.2
Run artifact:   runs/pios/ce2/qa3_v02/
Script:         scripts/qa3_propagation_integrity.py
```
