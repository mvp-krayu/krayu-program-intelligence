# QA.4 — SHARED-SIGNAL FAN-OUT VALIDATION

**Status:** PASS — SHARED-SIGNAL FAN-OUT VERIFIED
**Baseline:** CE.2 (PiOS v0.2)
**Run ID:** QA.4-v02
**Date:** 2026-04-02
**Governed by:** DEC-001 through DEC-014

---

## 1. INJECTION SPECIFICATION

No native shared-signal fan-out exists in baseline binding.
QA.4 executed as structural verification of independence under identical rule evaluation, not as natural fan-out.

The QA.4 binding table applies BR-DEP-LOAD-RATIO-001 to both COND-001 and COND-007 against the same
SIG-002.dependency_load_ratio field. Each condition has exactly one binding row. No multi-signal conflict
at any condition. The execution confirms that two conditions governed by the same rule and signal evaluate
independently with no cross-condition coupling.

| Field | Original Value | Injected Value | Rule | Direction | Threshold |
|---|---|---|---|---|---|
| SIG-002.dependency_load_ratio | 0.773 | 0.500 | BR-DEP-LOAD-RATIO-001 | ABOVE_IS_RISK | 0.682 |

**Base signals:** `runs/pios/40.5/CE.2-R01-MIX/signal_output.json` (all 8 signals)
**Override:** SIG-002.dependency_load_ratio only — all other signal values unchanged.

**Evaluation scope:** COND-001 + COND-007 — both governed by BR-DEP-LOAD-RATIO-001 against SIG-002.
**Isolation:** SIG-002 not referenced by COND-002, COND-003, COND-004, COND-005, COND-006, COND-008.

---

## 2. SELECTED SHARED SIGNAL

**SIG-002** — dependency_load_ratio

---

## 3. AFFECTED CONDITIONS

**COND-001** — Dependency Load Elevation
**COND-007** — Execution Health Deficit

---

## 4. SIGNAL VALUE USED

```
SIG-002.dependency_load_ratio = 0.500  (injected)
Baseline threshold:              0.682
Evaluation:                      0.500 <= 0.682 → STABLE
```

---

## 5. BINDING RULE EVALUATIONS

### Affected conditions

```
COND-001 / SIG-002.dependency_load_ratio = 0.500
  Rule:   BR-DEP-LOAD-RATIO-001
  Type:   BASELINE_THRESHOLD / ABOVE_IS_RISK
  Eval:   0.500 <= 0.682 → STABLE
  Tier:   STABLE

COND-007 / SIG-002.dependency_load_ratio = 0.500
  Rule:   BR-DEP-LOAD-RATIO-001
  Type:   BASELINE_THRESHOLD / ABOVE_IS_RISK
  Eval:   0.500 <= 0.682 → STABLE  (independent evaluation)
  Tier:   STABLE
```

### Unaffected conditions

```
COND-002 / SIG-004.total_edge_density              = 1.273  → STABLE
COND-003 / SIG-001.static_structural_ratio         = 0.875  → STABLE
COND-004 / SIG-005.throughput_rate                 = 0.643  → AT_RISK
COND-005 / SIG-003.output                          = null   → BLOCKED
COND-006 / SIG-006.output                          = null   → BLOCKED
COND-008 / SIG-008.coord_pressure_component        = 0.875  → STABLE
```

---

## 6. RESULTING CONDITION STATES

| Condition | CE.2-R01-MIX-v02 Baseline | QA.4 State | Changed |
|---|---|---|---|
| COND-001 | AT_RISK | STABLE | YES |
| COND-002 | STABLE | STABLE | NO |
| COND-003 | STABLE | STABLE | NO |
| COND-004 | AT_RISK | AT_RISK | NO |
| COND-005 | BLOCKED | BLOCKED | NO |
| COND-006 | BLOCKED | BLOCKED | NO |
| COND-007 | AT_RISK | STABLE | YES |
| COND-008 | STABLE | STABLE | NO |

---

## 7. 40.7 DIAGNOSIS RESULTS

```
── COND-001 ──
DEC-009:   single contribution → max-tier = STABLE
DEC-011:   COND-001.condition_coverage_state = 'STABLE'
DEC-014:   STABLE → INACTIVE
           DIAG-001.diagnosis_activation_state = 'INACTIVE'
CE.2 synth: INACTIVE → 'stable'
           INTEL-001.synthesis_state = 'stable'

── COND-007 ──
DEC-009:   single contribution → max-tier = STABLE
DEC-011:   COND-007.condition_coverage_state = 'STABLE'
DEC-014:   STABLE → INACTIVE
           DIAG-007.diagnosis_activation_state = 'INACTIVE'
CE.2 synth: INACTIVE → 'stable'
           INTEL-007.synthesis_state = 'stable'
```

All other INTEL entities unchanged from CE.2-R01-MIX-v02.

---

## 8. 40.8 DELIVERY RESULTS

```
INTEL-001.synthesis_state in packet: 'stable'  (was 'synthesized')
INTEL-007.synthesis_state in packet: 'stable'  (was 'synthesized')
```

No structural loss between 40.7 and 40.8.

---

## 9. 40.9 COMPARISON RESULTS

Baseline for comparison: CE.2-R01-MIX-v02 delivery packet.

| Entity | Baseline synthesis_state | QA.4 synthesis_state | Classification |
|---|---|---|---|
| INTEL-001 | synthesized | stable | STATE_CHANGE |
| INTEL-002 | stable | stable | NO_CHANGE |
| INTEL-003 | stable | stable | NO_CHANGE |
| INTEL-004 | synthesized | synthesized | NO_CHANGE |
| INTEL-005 | blocked | blocked | NO_CHANGE |
| INTEL-006 | blocked | blocked | NO_CHANGE |
| INTEL-007 | synthesized | stable | STATE_CHANGE |
| INTEL-008 | stable | stable | NO_CHANGE |

**Summary:** `NO_CHANGE: 6 / STATE_CHANGE: 2 / ADDED: 0 / REMOVED: 0`

---

## 10. 40.10 DIRECTIVE RESULTS

| Entity | Source | Directive |
|---|---|---|
| INTEL-001 | STATE_CHANGE | REVIEW_REQUIRED |
| INTEL-002, 003, 004, 005, 006, 008 | NO_CHANGE | NO_ACTION |
| INTEL-007 | STATE_CHANGE | REVIEW_REQUIRED |

**Summary:** `NO_ACTION: 6 / REVIEW_REQUIRED: 2`

---

## 11. UNCHANGED-ENTITY CHECK

All 6 unaffected entities confirmed NO_CHANGE at 40.9 and NO_ACTION at 40.10.

```
INTEL-002: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-003: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-004: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-005: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-006: 40.9=NO_CHANGE  40.10=NO_ACTION
INTEL-008: 40.9=NO_CHANGE  40.10=NO_ACTION
```

Over-propagation count: **0**

---

## 12. FULL TRACE — SIG-002 → COND-001 + COND-007 → 40.10

```
Signal:   SIG-002.dependency_load_ratio = 0.500  (original: 0.773)

── COND-001 ──
Binding:      COND-001 / SIG-002 / dependency_load_ratio / BR-DEP-LOAD-RATIO-001
Evaluation:   0.500 <= 0.682 → STABLE
Tier:         STABLE
DEC-009:      single contribution → max-tier = STABLE
DEC-011 emit: COND-001.condition_coverage_state = 'STABLE'
DEC-014:      STABLE → INACTIVE
40.7:         DIAG-001.diagnosis_activation_state = 'INACTIVE'
              INTEL-001.synthesis_state = 'stable'
40.8:         delivery carries 'stable'
40.9 base:    INTEL-001 = 'synthesized'  (CE.2-R01-MIX-v02)
40.9 result:  STATE_CHANGE
40.10 result: REVIEW_REQUIRED

── COND-007 ──
Binding:      COND-007 / SIG-002 / dependency_load_ratio / BR-DEP-LOAD-RATIO-001
Evaluation:   0.500 <= 0.682 → STABLE  (independent — no shared state with COND-001)
Tier:         STABLE
DEC-009:      single contribution → max-tier = STABLE
DEC-011 emit: COND-007.condition_coverage_state = 'STABLE'
DEC-014:      STABLE → INACTIVE
40.7:         DIAG-007.diagnosis_activation_state = 'INACTIVE'
              INTEL-007.synthesis_state = 'stable'
40.8:         delivery carries 'stable'
40.9 base:    INTEL-007 = 'synthesized'  (CE.2-R01-MIX-v02)
40.9 result:  STATE_CHANGE
40.10 result: REVIEW_REQUIRED

── No coupling ──
COND-001 and COND-007 resolved independently under the same rule.
No shared state. No cross-condition propagation.
6 unaffected entities: all NO_CHANGE / NO_ACTION.
```

---

## 13. VALIDATION STATEMENT

QA.4 validates structural independence under identical rule evaluation in CE.2.

No native shared-signal fan-out exists in the baseline binding table. QA.4 executed as
structural verification that two conditions governed by the same rule and signal evaluate
independently, with no cross-condition coupling, no leakage, and correct downstream scoping.

**Verified behaviors:**

- Independent resolution: COND-001 and COND-007, both governed by BR-DEP-LOAD-RATIO-001 against SIG-002, evaluate independently with no cross-condition coupling or shared intermediate state
- Propagation scope: exactly 2 STATE_CHANGEs and 2 REVIEW_REQUIREDs — one per affected condition, no leakage beyond declared scope
- Isolation: 6 unaffected entities remain fully stable across all layers

**Observed system behavior:**

- 2 downstream state transitions (COND-001 → INTEL-001: synthesized → stable; COND-007 → INTEL-007: synthesized → stable)
- 2 REVIEW_REQUIRED directives at 40.10
- 6 entities fully unchanged across all layers
- No hidden coupling detected between the two evaluated conditions

**Conclusion:**

CE.2 structural independence under parallel rule evaluation is VALIDATED. Two conditions
governed by identical binding rules evaluate independently, propagate correctly, and produce
no unintended cross-condition effects.

---

## 14. CLASSIFICATION

```
Artifact Type:  VALIDATION EVIDENCE
Authority:      NON-AUTHORITATIVE (test artifact)
Scope:          QA.4 only
Baseline:       CE.2 — PiOS v0.2
Run artifact:   runs/pios/ce2/qa4_v02/
Script:         scripts/qa4_shared_signal_fanout.py
```
