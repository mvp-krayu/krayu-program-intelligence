# EX.1A — Executable Traceability & Propagation Surface

**Stream:** EX.1A — Live Runtime Binding Remediation
**Artifact type:** EXECUTABLE TRACEABILITY & PROPAGATION SURFACE
**Date:** 2026-04-03
**Authority:** EX.1A

---

## 1. PURPOSE

This document records the governed traceability and propagation surface now exposed
by the EX.1A live adapter, confirmed against the EX.1 baseline verification run.
This is the authoritative record of what EX.H1 SB-007 mandatory inspection
requirements are satisfied by the EX.1A live binding path.

---

## 2. LIVE ENGINE VERIFICATION RUN

**Run ID:** `EX1A_verification_20260403`
**Date:** 2026-04-03
**Adapter:** `scripts/pios/EX.1A/pios_live_adapter.py`
**Route:** `GET /api/execlens?pios_live=true`
**Engine commit:** `ed95c81` (PiOS v0.4 EXECUTABLE-PROVEN baseline)
**Telemetry source:** STATIC_BASELINE (40.4 STATIC_VARIABLES)

---

## 3. CE.4 EMISSION SURFACE

All 8 governed signals emitted with CE.4 vocabulary states:

| Signal | CE.4 State | Output Present | Traceability Present |
|---|---|---|---|
| SIG-001 | PARTIAL | YES | YES |
| SIG-002 | COMPLETE | YES | YES |
| SIG-003 | BLOCKED | null | null |
| SIG-004 | COMPLETE | YES | YES |
| SIG-005 | PARTIAL | YES | YES |
| SIG-006 | BLOCKED | null | null |
| SIG-007 | PARTIAL | YES | null (PARTIAL upstream cascade) |
| SIG-008 | PARTIAL | YES | null (PARTIAL upstream cascade) |

**CE.4 vocabulary validation:** PASS — all 8 states ∈ {COMPLETE, PARTIAL, BLOCKED}

---

## 4. CE.5 CONSUMPTION SURFACE

All 8 CE.5 consumption records present in live adapter output:

| Signal | CE.5 Consumption State | output_ref |
|---|---|---|
| SIG-001 | PARTIAL | non-null (structural_ratio present; runtime_component null) |
| SIG-002 | AVAILABLE | non-null (complete output) |
| SIG-003 | BLOCKED | null |
| SIG-004 | AVAILABLE | non-null (complete output) |
| SIG-005 | PARTIAL | non-null (throughput present; completion_factor null) |
| SIG-006 | BLOCKED | null |
| SIG-007 | PARTIAL | non-null (SIG-002 component; SIG-005/SIG-006 null) |
| SIG-008 | PARTIAL | non-null (SIG-001/SIG-004 components; SIG-003 null) |

**CE.5 consumption vocabulary validation:** PASS — all 8 states ∈ {AVAILABLE, PARTIAL, BLOCKED}
**PBE-1/PBE-2 compliance:** PASS — BLOCKED records have output_ref = null
**Count:** 8 consumption records (equals governed signal count) ✓

---

## 5. CE.5 TRACEABILITY SURFACE

All 8 CE.5 traceability records present in live adapter output:

| Signal | Origin | Consumption State | Record Type |
|---|---|---|---|
| SIG-001 | CE.4 | PARTIAL | Type 1 |
| SIG-002 | CE.4 | AVAILABLE | Type 1 |
| SIG-003 | CE.4 | BLOCKED | Type 1 |
| SIG-004 | CE.4 | AVAILABLE | Type 1 |
| SIG-005 | CE.4 | PARTIAL | Type 1 |
| SIG-006 | CE.4 | BLOCKED | Type 1 |
| SIG-007 | CE.4 | PARTIAL | Type 1 |
| SIG-008 | CE.4 | PARTIAL | Type 1 |

**CE.5 T-001/T-002 compliance:** PASS — 8 traceability records, all origin = CE.4 ✓
**Count:** 8 traceability records (equals governed signal count) ✓

---

## 6. CE.2 PROPAGATION SURFACE

All 8 conditions with CE.2 tier states:

| Condition | condition_coverage_state | Governing Signal |
|---|---|---|
| COND-001 | STABLE | SIG-002 |
| COND-002 | STABLE | SIG-004 |
| COND-003 | STABLE | SIG-001 |
| COND-004 | STABLE | SIG-005 |
| COND-005 | BLOCKED | SIG-003 |
| COND-006 | BLOCKED | SIG-006 |
| COND-007 | STABLE | SIG-007 |
| COND-008 | STABLE | SIG-008 |

**CE.2 tier vocabulary validation:** PASS — all 8 ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE} ✓

---

## 7. CE.2 DIAGNOSIS SURFACE

All 8 diagnoses with CE.2 activation states:

| Diagnosis | diagnosis_activation_state | CE.2 DEC-014 Mapping |
|---|---|---|
| DIAG-001 | INACTIVE | STABLE → INACTIVE ✓ |
| DIAG-002 | INACTIVE | STABLE → INACTIVE ✓ |
| DIAG-003 | INACTIVE | STABLE → INACTIVE ✓ |
| DIAG-004 | INACTIVE | STABLE → INACTIVE ✓ |
| DIAG-005 | BLOCKED | BLOCKED → BLOCKED ✓ |
| DIAG-006 | BLOCKED | BLOCKED → BLOCKED ✓ |
| DIAG-007 | INACTIVE | STABLE → INACTIVE ✓ |
| DIAG-008 | INACTIVE | STABLE → INACTIVE ✓ |

**CE.2 diagnosis vocabulary validation:** PASS — all 8 ∈ {BLOCKED, ACTIVE, INACTIVE} ✓
**DEC-014 mapping validation:** PASS — all 8 mappings correct ✓

---

## 8. EX.H1 SB-007 MANDATORY INSPECTION SURFACE COMPLIANCE

| SB-007 Required Surface | EX.1A Status |
|---|---|
| CE.4 signal emission states (all signals) | SATISFIED — 8/8 signals in response |
| CE.5 consumption records | SATISFIED — 8/8 records in response |
| CE.5 traceability records | SATISFIED — 8/8 records in response |
| CE.2 propagation states (condition tiers) | SATISFIED — 8/8 conditions in response |
| CE.2 diagnosis activation states | SATISFIED — 8/8 diagnoses in response |
| Run ID linkage | SATISFIED — run_id in response body |
| Telemetry source declaration | SATISFIED — telemetry_source in response body |

**SB-007 compliance verdict: COMPLIANT via ?pios_live=true route**

---

## 9. REGRESSION AGAINST EX.1 BASELINE

EX.1 baseline (`EX1_baseline_20260403`) certified values:

| Check | Baseline | EX.1A Live Run | Match |
|---|---|---|---|
| COND-001 tier | STABLE | STABLE | ✓ |
| COND-002 tier | STABLE | STABLE | ✓ |
| COND-003 tier | STABLE | STABLE | ✓ |
| COND-004 tier | STABLE | STABLE | ✓ |
| COND-005 tier | BLOCKED | BLOCKED | ✓ |
| COND-006 tier | BLOCKED | BLOCKED | ✓ |
| COND-007 tier | STABLE | STABLE | ✓ |
| COND-008 tier | STABLE | STABLE | ✓ |
| DIAG-001..004,007..008 state | INACTIVE | INACTIVE | ✓ |
| DIAG-005..006 state | BLOCKED | BLOCKED | ✓ |
| CE.5 consumption count | 8 | 8 | ✓ |
| CE.5 traceability count | 8 | 8 | ✓ |

**Regression verdict: PASS — no deviation from EX.1 certified baseline**
