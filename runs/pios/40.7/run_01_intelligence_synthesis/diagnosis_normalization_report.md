# Diagnosis Normalization Report

**run_id:** run_01_intelligence_synthesis
**stream:** Stream 40.7 — PiOS Intelligence Synthesis Layer
**contract:** PIOS-40.7-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_01_condition_activation (Stream 40.6)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Normalization Rule

This report documents the normalization of 40.6 diagnosis outputs for 40.7 consumption. Normalization means: standardize field structure, verify identifier format, and confirm state enumeration — without modifying any identifier, value, state, or lineage. No reinterpretation. No recomputation. No semantic modification.

---

## Field Structure Verification

Each diagnosis entry from diagnosis_output_set.md is verified for required field completeness prior to intelligence synthesis.

Required fields per diagnosis entry:
- `diagnosis_id` — format DIAG-NNN
- `canonical_name` — string, no modification
- `originating_condition` — format COND-NNN
- `supporting_signals` — one or more SIG-NNN references
- `condition_coverage_state` — one of: complete | partial | blocked
- `diagnosis_activation_state` — one of: active | partial | blocked (with qualification)

| Diagnosis | diagnosis_id | canonical_name | originating_condition | supporting_signals | condition_coverage_state | diagnosis_activation_state | Complete |
|---|---|---|---|---|---|---|---|
| DIAG-001 | DIAG-001 | Dependency Load Elevation | COND-001 | SIG-002 | complete | active | yes |
| DIAG-002 | DIAG-002 | Structural Volatility State | COND-002 | SIG-004 | complete | active | yes |
| DIAG-003 | DIAG-003 | Coordination Pressure Active | COND-003 | SIG-001 | partial | partial | yes |
| DIAG-004 | DIAG-004 | Throughput Degradation Risk | COND-004 | SIG-005 | partial | partial | yes |
| DIAG-005 | DIAG-005 | Change Concentration Accumulation | COND-005 | SIG-003 | blocked | blocked | yes |
| DIAG-006 | DIAG-006 | Execution Instability | COND-006 | SIG-006 | blocked | blocked | yes |
| DIAG-007 | DIAG-007 | Execution Health Deficit | COND-007 | SIG-007 (SIG-002 active) | partial | partial | yes |
| DIAG-008 | DIAG-008 | Risk Acceleration State | COND-008 | SIG-008 (SIG-001, SIG-004 active; SIG-003 UNDEFINED) | partial | partial | yes |

**Field completeness: 8/8 PASS**

---

## Identifier Format Check

| Identifier Class | Expected Pattern | Check | Result |
|---|---|---|---|
| Diagnosis IDs | DIAG-NNN (3-digit) | DIAG-001 through DIAG-008 | PASS |
| Condition IDs | COND-NNN (3-digit) | COND-001 through COND-008, 1:1 with diagnoses | PASS |
| Signal IDs | SIG-NNN (3-digit) | SIG-001 through SIG-008 referenced correctly | PASS |
| DVAR IDs | DVAR_NNN | DVAR_001 through DVAR_008 in diagnosis_input_matrix.md | PASS |

**Identifier format: PASS**

---

## State Enumeration Check

| State Type | Valid Values | States Present in 40.6 Outputs | Invalid States | Result |
|---|---|---|---|---|
| condition_coverage_state | complete, partial, blocked | complete (×2), partial (×4), blocked (×2) | none | PASS |
| diagnosis_activation_state | active, partial, blocked | active (×2), partial (×4), blocked (×2) | none | PASS |

**State enumeration: PASS**

---

## Normalized Diagnosis Registry (for 40.7 consumption)

This registry is the authoritative normalized form of 40.6 diagnosis outputs for use in WP3–WP6. No values modified.

| DIAG ID | Canonical Name | Activation State | Active Components | UNDEFINED Components | Originating COND | Supporting SIGs |
|---|---|---|---|---|---|---|
| DIAG-001 | Dependency Load Elevation | active | ratio: 0.682; edge count: 15 | — | COND-001 | SIG-002 |
| DIAG-002 | Structural Volatility State | active | total: 1.273; contain: 0.545; resp: 0.364; module: 0.455 | — | COND-002 | SIG-004 |
| DIAG-003 | Coordination Pressure Active | partial | struct ratio: 0.875 | runtime (AT-007) | COND-003 | SIG-001 |
| DIAG-004 | Throughput Degradation Risk | partial | throughput rate: 1.125 | completion factor (DT-007) | COND-004 | SIG-005 |
| DIAG-005 | Change Concentration Accumulation | blocked | — | all (AT-001, AT-002) | COND-005 | SIG-003 |
| DIAG-006 | Execution Instability | blocked | — | all (AT-007, AT-009, DT-007, DT-008) | COND-006 | SIG-006 |
| DIAG-007 | Execution Health Deficit | partial | SIG-002 component: 0.682 | SIG-005 completion; SIG-006 | COND-007 | SIG-007 |
| DIAG-008 | Risk Acceleration State | partial | SIG-001: 0.875; SIG-004 ×4 | SIG-003 component | COND-008 | SIG-008 |

---

## Normalization Summary

| Check | Result |
|---|---|
| Field completeness (8/8) | PASS |
| Identifier format | PASS |
| State enumeration | PASS |
| Value preservation (no reinterpretation) | PASS |
| Lineage preservation (COND → DIAG references intact) | PASS |

**Normalization result: PASS — 40.6 diagnosis outputs normalized for 40.7 consumption without modification**
