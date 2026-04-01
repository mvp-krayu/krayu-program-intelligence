# ESI Output Set

**Stream:** 40.16 — ESI Derivation
**Run ID:** run_40_4_primary
**Generated:** 2026-04-01T10:51:23Z
**Script:** scripts/pios/40.16/run_esi_derivation.py
**Spec:** docs/pios/40.16/esi_derivation_specification.md

---

## Window: W001_40_4_intake

### TC Observation Status

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

### Normalization Values

| Function | Value | Note |
|---|---|---|
| NF-01 | UNDEFINED | TC-01 (AT-001) |
| NF-02 | 0.5000 | N<3 → neutral 0.5 |
| NF-03 | UNDEFINED | TC-02 (DT-007) |
| NF-04 | 1.0000 | TC-03 (DT-001+DT-003) |
| NF-05 | UNDEFINED | TC-04 (DT-006) |
| NF-06 | UNDEFINED | TC-05 (AT-007) |
| NF-07 | UNDEFINED | TC-08 (AT-009+DT-008) |

### PES Signal Values

| Signal | Value | Status |
|---|---|---|
| PES-ESI-01 | UNDEFINED | UNDEFINED |
| PES-ESI-02 | UNDEFINED | UNDEFINED — CG-01 ACTIVE |
| PES-ESI-03 | UNDEFINED | UNDEFINED |
| PES-ESI-04 | UNDEFINED | UNDEFINED |
| PES-ESI-05 | UNDEFINED | UNDEFINED |

### ESI Output

| Field | Value |
|---|---|
| ESI Value | UNDEFINED |
| Mode | PARTIAL |
| Warning | CG-01 ACTIVE: TC-09 not defined; PES-ESI-02 UNDEFINED; ESI computed in PARTIAL mode |
| Warning | PES-ESI-01 UNDEFINED; ESI UNDEFINED |

---
