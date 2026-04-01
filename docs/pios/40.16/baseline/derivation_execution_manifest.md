# Derivation Execution Manifest

**Stream:** 40.16 — PiOS Core Derivation
**Run ID:** run_40_4_primary
**Generated:** 2026-04-01T10:51:23Z
**Spec:** docs/pios/40.16/execution_manifest.md

---

## Section 1 — Run Identity

| Field | Value |
|---|---|
| Run ID | run_40_4_primary |
| Input Source | 40.4 |
| Generated | 2026-04-01T10:51:23Z |
| ESI Script | scripts/pios/40.16/run_esi_derivation.py |
| RAG Script | scripts/pios/40.16/run_rag_derivation.py |
| ESI Spec | docs/pios/40.16/esi_derivation_specification.md |
| RAG Spec | docs/pios/40.16/rag_derivation_specification.md |

---

## Section 2 — Window Definitions

| Window ID | Start | End | Duration (days) |
|---|---|---|---|
| W001_40_4_intake | — | — | 1.0 |

---

## Section 3 — Program Constants

| Constant | Value |
|---|---|
| F_expected | 1.0000 |
| sigma_max | UNDEFINED |
| artifacts_expected | 9 |
| L_target | UNDEFINED |
| L_max | UNDEFINED |
| gates_defined | 8 |
| feedback_expected | 1 |
| _source | 40.4 |
| _derivation | {'artifacts_expected': 'DT-001(4) + DT-003(5)', 'gates_defined': 'AT-005(8)', 'F_expected': 'structural: one push-to-main trigger per interval', 'feedback_expected': 'structural: one feedback delivery edge E-06a'} |

---

## Section 4 — TC Observations

### W001_40_4_intake

| TC Class | Metric(s) | Value | Status |
|---|---|---|---|
| TC-01 | AT-001 | UNDEFINED | UNDEFINED |
| TC-02 | DT-007 | UNDEFINED | UNDEFINED |
| TC-03 | DT-001, DT-003 | 9 | COVERED |
| TC-04 | DT-006 | UNDEFINED | UNDEFINED |
| TC-05 | AT-007 | UNDEFINED | UNDEFINED |
| TC-06 | AT-008 | UNDEFINED | UNDEFINED |
| TC-07 | variance_observed | UNDEFINED | UNDEFINED |
| TC-08 | AT-009, DT-008 | UNDEFINED | UNDEFINED |
| TC-09 | — | UNDEFINED | NOT_DEFINED (CG-01) |

---

## Section 5 — Normalized Values

### W001_40_4_intake

| Function | Value |
|---|---|
| NF-01 | UNDEFINED |
| NF-02 | 0.5000 |
| NF-03 | UNDEFINED |
| NF-04 | 1.0000 |
| NF-05 | UNDEFINED |
| NF-06 | UNDEFINED |
| NF-07 | UNDEFINED |

---

## Section 6 — PES Values

### W001_40_4_intake

| Signal | Value | Status |
|---|---|---|
| PES-ESI-01 | UNDEFINED | UNDEFINED |
| PES-ESI-02 | UNDEFINED | UNDEFINED |
| PES-ESI-03 | UNDEFINED | UNDEFINED |
| PES-ESI-04 | UNDEFINED | UNDEFINED |
| PES-ESI-05 | UNDEFINED | UNDEFINED |

---

## Section 7 — ESI Output

### W001_40_4_intake

| Field | Value |
|---|---|
| ESI Value | UNDEFINED |
| Mode | PARTIAL |
| Warning | CG-01 ACTIVE: TC-09 not defined; PES-ESI-02 UNDEFINED; ESI computed in PARTIAL mode |
| Warning | PES-ESI-01 UNDEFINED; ESI UNDEFINED |

---

## Section 8 — RAG Output

| Field | Value | Status |
|---|---|---|
| RAG_rate | INSUFFICIENT_WINDOWS | INSUFFICIENT_WINDOWS |
| RAG_accel | INSUFFICIENT_WINDOWS | INSUFFICIENT_WINDOWS |
| RAG_cross | INSUFFICIENT_WINDOWS | INSUFFICIENT_WINDOWS |
| RAG (composite) | INSUFFICIENT_WINDOWS | INSUFFICIENT_WINDOWS |

---

## Section 9 — Warnings / Errors Log

- CG-01 ACTIVE: TC-09 not defined; PES-ESI-02 UNDEFINED; ESI computed in PARTIAL mode
- PES-ESI-01 UNDEFINED; ESI UNDEFINED
- RAG_rate: INSUFFICIENT_WINDOWS (requires ≥2 windows)
