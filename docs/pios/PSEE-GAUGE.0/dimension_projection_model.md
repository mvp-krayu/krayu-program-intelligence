# PSEE-GAUGE.0 — Dimension Projection Model

**Stream:** PSEE-GAUGE.0
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/psee_decision_contract_v1.md; PSEE.2/implementation_architecture.md;
               PSEE-OPS.0/logging_exposure_model.md; PSEE-OPS.0/unknown_space_interface.md

---

## Purpose

This document defines the gauge dimensions: the observable surfaces that represent distinct aspects of PSEE execution quality. Each dimension maps to one and only one authoritative PSEE artifact or field. Dimensions are the visual components rendered in dimension bars on the gauge surface. They are NOT score inputs — they are projected views of PSEE execution state.

---

## Dimension Definitions

Six dimensions are defined. Each carries a 0–100 projection value, a state label, and an evidence trace.

---

### DIM-01 — COVERAGE

**What it measures:** The percentage of declared Phase B target artifacts covered by PSEE execution.

**Source field:** `PSEEContext.coverage_percent`

**Authority:** PSEE.1/psee_decision_contract_v1.md G-08; PSEE.2/state_transition_table.md §Phase 5 (DP-5-02); PSEE.1/determinism_boundary.md CT-07

**Projection value:** `coverage_percent` (direct, 0.0–100.0%)

**State labels:**
| coverage_percent | State label |
|---|---|
| 90–100% | FULL (S-13 threshold met) |
| 60–89.9% | PARTIAL (coverage gap present) |
| < 60% | LOW (significant coverage gap) |
| Not yet computed | PENDING |

**Unavailable conditions:** DIM-01 displays PENDING if the engine has not reached Phase 5 (S-10) or has been STOPPED before Phase 5.

**Dimension bar:** 0–100 where 100 = full Phase B coverage. Threshold line drawn at 90 (the DP-5-02 gate from CT-07).

---

### DIM-02 — RECONSTRUCTION

**What it measures:** The quality of Phase B artifact reconstruction — the proportion of Phase B artifacts that are EQUIVALENT vs PARTIAL.

**Source field:** `PSEEContext.reconstruction_result` (array of `{artifact, structural_match}`)

**Authority:** PSEE.1/psee_decision_contract_v1.md G-09, O-07; PSEE.2/state_transition_table.md §Phase 6 (DP-6-01)

**Projection value:**
```
reconstruction_value = (EQUIVALENT_count × 100 + PARTIAL_count × 50) / total_count
```

**State labels:**
| reconstruction_value | State label |
|---|---|
| 100 | EQUIVALENT (all artifacts fully reconstructed) |
| 50–99 | PARTIAL (mix of EQUIVALENT and PARTIAL artifacts) |
| < 50 | DEGRADED (majority PARTIAL) |
| Not yet computed | PENDING |

**Unavailable conditions:** DIM-02 displays PENDING if Phase 6 has not been completed (engine has not reached S-12→S-13 transition).

**Dimension bar:** 0–100 where 100 = all Phase B artifacts EQUIVALENT.

---

### DIM-03 — ESCALATION CLEARANCE

**What it measures:** The proportion of escalations in this execution that have been resolved by the operator.

**Source field:** `PSEEContext.escalation_log` (PSEE.2/logging_contract.md §Schema 2; PSEE-OPS.0/escalation_interface_spec.md)

**Authority:** PSEE.1/escalation_and_fallback_spec.md §Part 2 (ESC-01..06); PSEE.2/exception_runtime_spec.md §Part 2

**Projection value:**
```
resolved_escalations = count of escalation_log entries where action = "ESCALATE" AND resolution is not null
total_escalations    = count of escalation_log entries where action = "ESCALATE"

escalation_clearance_value = (resolved_escalations / total_escalations) × 100
                             (if total_escalations = 0: value = 100)
```

**State labels:**
| escalation_clearance_value | State label |
|---|---|
| 100 | CLEAR (all escalations resolved or none occurred) |
| 50–99 | PARTIAL (some escalations pending) |
| < 50 | BLOCKED (majority of escalations unresolved) |
| Engine in S-T2 | SUSPENDED (at least one open escalation) |

**Dimension bar:** 0–100 where 100 = all escalations resolved.

**Note:** STOP events (action = "STOP") are not included in this dimension — STOPs are reflected in the completion component of the gauge score. Unknown-space entries (action = "UNKNOWN-SPACE") are not escalations; they appear in DIM-04.

---

### DIM-04 — UNKNOWN-SPACE

**What it measures:** The volume and type of unknown-space positions in this execution.

**Source field:** `PSEEContext.us_records` (PSEE.2/exception_runtime_spec.md §Part 3; PSEE-OPS.0/unknown_space_interface.md)

**Authority:** PSEE.1/escalation_and_fallback_spec.md §Part 3 (US-CONDITION-01..03); PSEE.1/psee_decision_contract_v1.md G-02, INV-02

**Projection value:** DIM-04 does NOT project a 0-100 value. It projects a COUNT and TYPE breakdown, because unknown-space positions are not ranked or ordered (PSEE-OPS.0/unknown_space_interface.md Rule 2 — no severity ranking).

```
us_count_by_type = {
  US-CONDITION-01: count (overlap parity unknown)
  US-CONDITION-02: count (platform content unknown)
  US-CONDITION-03: count (generic inferrable position)
  TOTAL: sum
}
```

**State labels:**
| us_total | State label |
|---|---|
| 0 | NONE (no unknown positions) |
| 1–3 | LOW |
| 4–9 | MODERATE |
| ≥ 10 | HIGH |

**Dimension presentation:** Counter display (not a bar) showing total US records and breakdown by type. This is by design — US records widen the confidence band, they do not reduce the canonical score (gauge_score_model.md §G.6).

**Non-resolution guarantee:** The US counter reflects the `resolution = null` state of all US records. The gauge never proposes resolutions (PSEE-OPS.0/unknown_space_interface.md §Non-Resolution Guarantee).

---

### DIM-05 — INTAKE COMPLETENESS

**What it measures:** Whether every file in the corpus has exactly one `intake_status` assigned (no PENDING files).

**Source field:** `PSEEContext.filter_table` (PSEE.1/psee_decision_contract_v1.md INV-04, G-05; PSEE.2/state_transition_table.md §Phase 2)

**Authority:** PSEE.1/psee_decision_contract_v1.md INV-04 ("Every file has exactly one intake_status; no file has status PENDING"); PSEE.2/state_transition_table.md Phase 2 completion gate (`VERIFY_NO_PENDING`)

**Projection value:**
```
assigned_files  = count of filter_table entries where intake_status ≠ PENDING
total_files     = count of all filter_table entries

intake_value = (assigned_files / total_files) × 100
```

**State labels:**
| intake_value | State label |
|---|---|
| 100% | COMPLETE (all files assigned; INV-04 satisfied) |
| < 100% | INCOMPLETE (PENDING files remain; engine should not have passed Phase 2) |
| Not yet computed | PENDING |

**Invariant alignment:** INV-04 guarantees that if Phase 2 completes (state ≥ S-05), intake_value = 100. A value < 100 at S-05 or beyond is a GAUGE_ANOMALY that should be reported to the operator.

**Dimension bar:** Binary in practice — either COMPLETE or PENDING/INCOMPLETE.

---

### DIM-06 — HEURISTIC COMPLIANCE

**What it measures:** Whether any blocked heuristic entered the execution decision path.

**Source field:** `PSEEContext.flags` (PSEE.2/logging_contract.md §Schema 3; PSEE.2/heuristic_guard_spec.md)

**Authority:** PSEE.2/heuristic_guard_spec.md §BLOCKED Heuristic Enforcement Rules; PSEE.2/exception_runtime_spec.md §STOP-HEURISTIC

**Projection value:**
```
heuristic_stop_present = any flag matching pattern "STOP: BLOCKED_HEURISTIC[*]"

compliance_state = PASS  (if no heuristic stop flags)
compliance_state = FAIL  (if any heuristic stop flag present)
```

**State labels:**
| compliance_state | Meaning |
|---|---|
| PASS | No blocked heuristic entered the decision path |
| FAIL | H-01, H-02, H-03, or H-07 was detected in a decision path; stream STOPPED |

**Dimension presentation:** Binary (PASS/FAIL indicator). Not a 0-100 bar. A FAIL here indicates an engine implementation defect (not a corpus issue), per PSEE.2/exception_runtime_spec.md §STOP-HEURISTIC.

---

## Dimension Summary Table

| Dim | Name | Source field | Projection type | Authoritative source |
|---|---|---|---|---|
| DIM-01 | Coverage | PSEEContext.coverage_percent | 0–100 bar | DP-5-02; G-08 |
| DIM-02 | Reconstruction | PSEEContext.reconstruction_result | 0–100 bar | DP-6-01; G-09; O-07 |
| DIM-03 | Escalation Clearance | PSEEContext.escalation_log | 0–100 bar | ESC-01..06; escalation_interface_spec.md |
| DIM-04 | Unknown-Space | PSEEContext.us_records | Counter (by type) | US-CONDITION-01..03; unknown_space_interface.md |
| DIM-05 | Intake Completeness | PSEEContext.filter_table | Binary complete/pending | INV-04; G-05 |
| DIM-06 | Heuristic Compliance | PSEEContext.flags | Binary pass/fail | HeuristicGuard; heuristic_guard_spec.md |

---

## Dimension Update Timing

Dimensions update as PSEEContext is flushed to disk. Flush events are defined in PSEE.2/logging_contract.md §Log Persistence:

- DIM-01 becomes available at S-10 (Phase 5 entry)
- DIM-02 becomes available at S-12→S-13 transition
- DIM-03 updates at each ESC event and resolution
- DIM-04 updates at each US record creation
- DIM-05 becomes COMPLETE at S-05 (Phase 2 completion)
- DIM-06 becomes FAIL on any STOP-HEURISTIC event

---

#### STATUS

| Check | Result |
|---|---|
| All 6 dimensions defined | CONFIRMED |
| Every dimension traces to an authoritative PSEE field | CONFIRMED |
| No dimension invented outside PSEE artifacts | CONFIRMED |
| No PSEE.X candidate pattern drives any dimension | CONFIRMED |
| No canonical mutation | CONFIRMED |

**DIMENSION PROJECTION MODEL: COMPLETE — 6 dimensions, all evidence-backed**
