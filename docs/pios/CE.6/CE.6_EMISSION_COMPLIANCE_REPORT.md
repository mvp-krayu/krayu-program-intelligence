# CE.6 — Emission Compliance Report

**Stream:** CE.6 — Engine Compliance & Executable Validation
**Artifact type:** COMPLIANCE REPORT (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.6
**Contract under evaluation:** CE.4 Signal Emission Contract Specification
**Engine under evaluation:** `pios/core/v0.1/engine/compute_signals.py`

---

## 1. PURPOSE

This report evaluates whether the PiOS v0.1 engine implementation at `compute_signals.py`
complies with the CE.4 signal emission contract as defined in
`docs/pios/CE.4/signal_emission_contract_specification.md`.

Compliance is assessed per signal per CE.4 emission invariant (INV-001 through INV-007).

---

## 2. EVALUATION METHOD

For each signal, the following CE.4 requirements are checked:

| Requirement | Source |
|---|---|
| INV-001: COMPLETE → output non-null, no null fields | CE.4 §5 |
| INV-002: PARTIAL → output non-null, ≥1 resolved, ≥1 null | CE.4 §5 |
| INV-003: BLOCKED → output = null | CE.4 §5 |
| INV-004: BLOCKED → blocking_class + blocking_inputs + blocking_reason required | CE.4 §5 |
| INV-005: PARTIAL → partiality_reasons required per null field | CE.4 §5 |
| INV-006: COMPLETE → traceability required per output field | CE.4 §5 |
| INV-007: state must be COMPLETE / PARTIAL / BLOCKED / COMPUTABLE_PENDING | CE.4 §5 |
| §3.3: note field is prohibited | CE.4 §3.3 |

---

## 3. SIGNAL-BY-SIGNAL COMPLIANCE ASSESSMENT

### SIG-001 — Coordination Pressure Index

**Engine-emitted state:** PARTIAL
**Output fields:** `static_structural_ratio` (resolved), `runtime_component` (null)
**INV-002:** PASS — output present, ≥1 resolved, ≥1 null
**INV-005:** FAIL — `partiality_reasons` not present; null `runtime_component` has no failure_class entry
**INV-006:** N/A (PARTIAL, not COMPLETE)
**§3.3:** PASS — no prohibited `note` field

**Verdict: NON-COMPLIANT**
**Violation:** INV-005 — missing `partiality_reasons` for null field `runtime_component`

---

### SIG-002 — Dependency Load Index

**Engine-emitted state:** COMPLETE
**Output fields:** all resolved (non-null)
**INV-001:** PASS — output non-null, no null fields
**INV-006:** PASS — `traceability` present per output field
**§3.3:** PASS

**Verdict: COMPLIANT**

---

### SIG-003 — Change Concentration

**Engine-emitted state:** BLOCKED
**Output:** null
**INV-003:** PASS — output = null
**INV-004:** FAIL — `blocking_class` absent; `blocking_inputs` present; `blocking_reason` present (Branch 1). Branch 2 path: all three fields absent.
**§3.3:** PASS

**Verdict: NON-COMPLIANT**
**Violation:** INV-004 — `blocking_class` missing in both emission branches

---

### SIG-004 — Dependency Edge Density

**Engine-emitted state:** COMPLETE
**Output fields:** all resolved (non-null)
**INV-001:** PASS
**INV-006:** PASS — `traceability` present
**§3.3:** PASS

**Verdict: COMPLIANT**

---

### SIG-005 — Completion Rate Factor

**Engine-emitted state:** PARTIAL
**Output fields:** one or more null (e.g., `completion_factor`)
**INV-002:** PASS
**INV-005:** FAIL — `partiality_reasons` not present; null `completion_factor` has no failure_class entry
**§3.3:** PASS

**Verdict: NON-COMPLIANT**
**Violation:** INV-005 — missing `partiality_reasons` for null field `completion_factor`

---

### SIG-006 — Volatility Stability Index

**Engine-emitted state:** BLOCKED
**Output:** null
**INV-003:** PASS — output = null
**INV-004:** FAIL — `blocking_class` absent; `blocking_inputs` present; `blocking_reason` present
**§3.3:** PASS

**Verdict: NON-COMPLIANT**
**Violation:** INV-004 — `blocking_class` missing

---

### SIG-007 — Execution Stress Index (ESI)

**Engine-emitted state:** PARTIAL
**Output fields:** `sig_002_dependency_load_component` resolved; `sig_005_completion_factor_component` null; `sig_006_stability_component` null
**INV-002:** PASS
**INV-005:** FAIL — `partiality_reasons` absent; `note` field present in its place
**§3.3:** FAIL — prohibited `note` field is present; replaces (but does not satisfy) `partiality_reasons`

**Verdict: NON-COMPLIANT**
**Violations:**
- INV-005 — `partiality_reasons` absent for 2 null fields
- §3.3 — prohibited `note` field used

---

### SIG-008 — Risk Acceleration Grade (RAG)

**Engine-emitted state:** PARTIAL
**Output fields:** 5 resolved, `sig_003_change_concentration_component` null
**INV-002:** PASS
**INV-005:** FAIL — `partiality_reasons` absent; `note` field present in its place
**§3.3:** FAIL — prohibited `note` field is present

**Verdict: NON-COMPLIANT**
**Violations:**
- INV-005 — `partiality_reasons` absent for 1 null field
- §3.3 — prohibited `note` field used

---

## 4. COMPLIANCE SUMMARY TABLE

| Signal | State | INV-001 | INV-002 | INV-003 | INV-004 | INV-005 | INV-006 | §3.3 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| SIG-001 | PARTIAL | N/A | PASS | N/A | N/A | **FAIL** | N/A | PASS | **NON-COMPLIANT** |
| SIG-002 | COMPLETE | PASS | N/A | N/A | N/A | N/A | PASS | PASS | COMPLIANT |
| SIG-003 | BLOCKED | N/A | N/A | PASS | **FAIL** | N/A | N/A | PASS | **NON-COMPLIANT** |
| SIG-004 | COMPLETE | PASS | N/A | N/A | N/A | N/A | PASS | PASS | COMPLIANT |
| SIG-005 | PARTIAL | N/A | PASS | N/A | N/A | **FAIL** | N/A | PASS | **NON-COMPLIANT** |
| SIG-006 | BLOCKED | N/A | N/A | PASS | **FAIL** | N/A | N/A | PASS | **NON-COMPLIANT** |
| SIG-007 | PARTIAL | N/A | PASS | N/A | N/A | **FAIL** | N/A | **FAIL** | **NON-COMPLIANT** |
| SIG-008 | PARTIAL | N/A | PASS | N/A | N/A | **FAIL** | N/A | **FAIL** | **NON-COMPLIANT** |

**Compliant signals:** SIG-002, SIG-004 (2 of 8)
**Non-compliant signals:** SIG-001, SIG-003, SIG-005, SIG-006, SIG-007, SIG-008 (6 of 8)

---

## 5. VIOLATION CATALOG

| ID | Signal | Invariant | Description |
|---|---|---|---|
| V-E-001 | SIG-001 | INV-005 | `partiality_reasons` absent for null field `runtime_component` |
| V-E-002 | SIG-003 | INV-004 | `blocking_class` absent from BLOCKED payload |
| V-E-003 | SIG-005 | INV-005 | `partiality_reasons` absent for null field `completion_factor` |
| V-E-004 | SIG-006 | INV-004 | `blocking_class` absent from BLOCKED payload |
| V-E-005 | SIG-007 | INV-005 | `partiality_reasons` absent for null fields `sig_005_completion_factor_component`, `sig_006_stability_component` |
| V-E-006 | SIG-007 | §3.3 | Prohibited `note` field present in payload |
| V-E-007 | SIG-008 | INV-005 | `partiality_reasons` absent for null field `sig_003_change_concentration_component` |
| V-E-008 | SIG-008 | §3.3 | Prohibited `note` field present in payload |

---

## 6. EMISSION COMPLIANCE VERDICT

The PiOS v0.1 engine at `compute_signals.py` does NOT comply with the CE.4 emission contract.

6 of 8 signals violate one or more CE.4 invariants.
8 distinct violations are recorded (V-E-001 through V-E-008).

The compliant signals (SIG-002, SIG-004) are both COMPLETE-state signals. All PARTIAL and
BLOCKED signals are non-compliant.

**CE.4 emission compliance status: FAIL**
