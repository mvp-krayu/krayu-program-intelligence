# CE.8 — Emission Compliance Report

**Stream:** CE.8 — Engine Implementation & Compliance Execution
**Artifact type:** COMPLIANCE REPORT (POST-REMEDIATION)
**Date:** 2026-04-03
**Authority:** CE.8
**Engine evaluated:** `pios/core/v0.1/engine/compute_signals.py` (post-remediation)

---

## SIGNAL-BY-SIGNAL ASSESSMENT

### SIG-001 — PARTIAL

- INV-002: PASS — output non-null, ≥1 resolved, ≥1 null
- INV-005: PASS — `partiality_reasons` present; `runtime_component` entry with `failure_class: F-1b` ✓
- §3.3: PASS — no `note` field
- Traceability: `traceability` covers resolved field only (`static_structural_ratio`) ✓

**Verdict: COMPLIANT**

---

### SIG-002 — COMPLETE

- INV-001: PASS — output non-null, no null fields
- INV-006: PASS — `traceability` present for all output fields
- §3.3: PASS

**Verdict: COMPLIANT** (unchanged)

---

### SIG-003 — BLOCKED

- INV-003: PASS — output = null
- INV-004: PASS — `blocking_class: "F-1a"` ✓, `blocking_inputs` ✓, `blocking_reason` ✓
- §3.3: PASS

**Verdict: COMPLIANT**

---

### SIG-004 — COMPLETE

- INV-001: PASS
- INV-006: PASS
- §3.3: PASS

**Verdict: COMPLIANT** (unchanged)

---

### SIG-005 — PARTIAL

- INV-002: PASS
- INV-005: PASS — `partiality_reasons` present; `completion_factor` entry with `failure_class: F-1b` ✓
- §3.3: PASS

**Verdict: COMPLIANT**

---

### SIG-006 — BLOCKED

- INV-003: PASS — output = null
- INV-004: PASS — `blocking_class: "F-1a"` ✓, `blocking_inputs` ✓, `blocking_reason` ✓
- §3.3: PASS

**Verdict: COMPLIANT**

---

### SIG-007 — PARTIAL (derived)

- INV-002: PASS
- INV-005: PASS — `partiality_reasons` present; `sig_005_completion_factor_component` (F-4) ✓; `sig_006_stability_component` (F-3) ✓
- §3.3: PASS — `note` field removed ✓
- Traceability: N/A — derived PARTIAL signals do not carry `traceability` (CE.4 §4.3) ✓

**Verdict: COMPLIANT**

---

### SIG-008 — PARTIAL (derived)

- INV-002: PASS
- INV-005: PASS — `partiality_reasons` present; `sig_003_change_concentration_component` (F-3) ✓
- §3.3: PASS — `note` field removed ✓

**Verdict: COMPLIANT**

---

## SUMMARY TABLE

| Signal | State | INV-004 | INV-005 | §3.3 | Verdict |
|---|---|---|---|---|---|
| SIG-001 | PARTIAL | N/A | PASS | PASS | **COMPLIANT** |
| SIG-002 | COMPLETE | N/A | N/A | PASS | **COMPLIANT** |
| SIG-003 | BLOCKED | PASS | N/A | PASS | **COMPLIANT** |
| SIG-004 | COMPLETE | N/A | N/A | PASS | **COMPLIANT** |
| SIG-005 | PARTIAL | N/A | PASS | PASS | **COMPLIANT** |
| SIG-006 | BLOCKED | PASS | N/A | PASS | **COMPLIANT** |
| SIG-007 | PARTIAL | N/A | PASS | PASS | **COMPLIANT** |
| SIG-008 | PARTIAL | N/A | PASS | PASS | **COMPLIANT** |

**Compliant signals: 8 of 8**
**Emission compliance status: PASS**
