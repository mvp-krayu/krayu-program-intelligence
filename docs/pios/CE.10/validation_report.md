# CE.10 — Validation Report

**Stream:** CE.10 — Tier Derivation Implementation & Propagation Closure
**Artifact type:** VALIDATION REPORT (POST-IMPLEMENTATION)
**Date:** 2026-04-03
**Authority:** CE.10
**Validation run:** ce10_validation
**Signal output:** `runs/pios/40.5/ce10_validation/signal_output.json`
**Condition output:** `runs/pios/40.6/ce10_validation/condition_output.json`

---

## PROGRAMMATIC VALIDATION RESULTS

```
EMISSION COMPLIANCE:     PASS — 0 violations
CONSUMPTION COMPLIANCE:  PASS — 0 violations
PROPAGATION COMPLIANCE:  PASS — 0 violations
TRACEABILITY COMPLIANCE: PASS — 0 violations

Condition tiers:
  COND-001: STABLE
  COND-002: STABLE
  COND-003: STABLE
  COND-004: STABLE
  COND-005: BLOCKED
  COND-006: BLOCKED
  COND-007: STABLE
  COND-008: STABLE

Diagnosis states:
  DIAG-001: INACTIVE
  DIAG-002: INACTIVE
  DIAG-003: INACTIVE
  DIAG-004: INACTIVE
  DIAG-005: BLOCKED
  DIAG-006: BLOCKED
  DIAG-007: INACTIVE
  DIAG-008: INACTIVE

CE5 traceability: 8 records (Type 1: 8, Type 2: 0)
```

---

## VALIDATION DOMAIN ASSERTIONS

### Domain 1 — Emission

Scope: CE.4 INV-001..INV-006, §3.3 across all 8 signals.
`compute_signals.py` not modified in CE.10. All CE.8 emission fixes preserved.

| Signal | State | INV-004 | INV-005 | §3.3 | Verdict |
|---|---|---|---|---|---|
| SIG-001 | PARTIAL | N/A | PASS | PASS | COMPLIANT |
| SIG-002 | COMPLETE | N/A | N/A | PASS | COMPLIANT |
| SIG-003 | BLOCKED | PASS | N/A | PASS | COMPLIANT |
| SIG-004 | COMPLETE | N/A | N/A | PASS | COMPLIANT |
| SIG-005 | PARTIAL | N/A | PASS | PASS | COMPLIANT |
| SIG-006 | BLOCKED | PASS | N/A | PASS | COMPLIANT |
| SIG-007 | PARTIAL | N/A | PASS | PASS | COMPLIANT |
| SIG-008 | PARTIAL | N/A | PASS | PASS | COMPLIANT |

**Emission compliance: PASS — 8/8 signals COMPLIANT — 0 violations**

---

### Domain 2 — Consumption

Scope: CE.5 CSM-1, C-001..C-003, PBE-1, PBE-2.
CE.5 consumption layer not modified in CE.10.

| Signal | CE.4 State | CE.5 consumption_state | Correct |
|---|---|---|---|
| SIG-001 | PARTIAL | PARTIAL | ✓ |
| SIG-002 | COMPLETE | AVAILABLE | ✓ |
| SIG-003 | BLOCKED | BLOCKED | ✓ |
| SIG-004 | COMPLETE | AVAILABLE | ✓ |
| SIG-005 | PARTIAL | PARTIAL | ✓ |
| SIG-006 | BLOCKED | BLOCKED | ✓ |
| SIG-007 | PARTIAL | PARTIAL | ✓ |
| SIG-008 | PARTIAL | PARTIAL | ✓ |

**Consumption compliance: PASS — 0 violations**

---

### Domain 3 — Propagation

Scope: CE.2 DEC-009, DEC-011, DEC-014.

Tier validation: all 8 `condition_coverage_state` values ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE} ✓
DEC-014 validation: all 8 `diagnosis_activation_state` values match DEC-014 lookup ✓
No KeyError in CONDITION_TO_DIAGNOSIS_STATE ✓
CE.8 interim shim entries absent ✓

**Propagation compliance: PASS — 0 violations**

---

### Domain 4 — Traceability

Scope: CE.4 INV-006, CE.5 T-001/T-002.
Traceability layer not modified in CE.10.

Type 1 records: 8 (all 8 governed signals present) ✓
Type 2 records: 0 (no absent signals) ✓
Total record count = governed signal count (8) ✓

**Traceability compliance: PASS — 0 violations**

---

## REGRESSION CHECK

| Component | Modified in CE.10 | Regression |
|---|---|---|
| compute_signals.py | NO | NONE |
| CE.5 consumption logic | NO | NONE |
| produce_ce5_consumption_record() | NO | NONE |
| produce_ce5_traceability_records() | NO | NONE |
| activate_cond_*() functions | NO | NONE |
| activate_diag() | NO | NONE |
| CONDITION_TO_DIAGNOSIS_STATE DEC-014 entries | NO (only shim removed) | NONE |

Zero regressions confirmed. ✓

---

## GAP CLOSURE VALIDATION

| Gap ID | Closed in | Validated |
|---|---|---|
| GAP-P-003 | CE.10 | YES — all conditions carry DEC-009 tier values |
| GAP-P-004 | CE.10 | YES — all diagnoses match DEC-014 lookup |

---

## FINAL COMPLIANCE SUMMARY

| Domain | Status |
|---|---|
| Emission | **PASS** |
| Consumption | **PASS** |
| Propagation | **PASS** |
| Traceability | **PASS** |

**Total gaps resolved: 18 / 18**
**Blocking remaining: 0**
**Major remaining: 0**

**Final Verdict: PiOS v0.4 = EXECUTABLE-COMPLIANT**
