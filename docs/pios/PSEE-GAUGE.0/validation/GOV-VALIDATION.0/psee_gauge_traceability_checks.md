# GOV-VALIDATION.0 — PSEE Gauge Traceability Checks

**Stream:** GOV-VALIDATION.0
**Family:** GOV
**Date:** 2026-04-05
**Branch:** feature/pios-core
**Output namespace:** docs/pios/PSEE-GAUGE.0/validation/GOV-VALIDATION.0/
**Authority:** psee_gauge_validation_contract.md §4 (Domain D3)

---

## Purpose

This document specifies CHECK-009 through CHECK-025 — the 17 traceability checks for Domain D3.

D3 validates that every score component, every dimension, and every projection rule in PSEE-GAUGE.0 traces to an authoritative PSEE artifact. No score driver may be invented; every computed value must be derivable from a PSEEContext field and a named PSEE decision point.

**Source artifacts under validation:**
- `docs/pios/PSEE-GAUGE.0/gauge_score_model.md`
- `docs/pios/PSEE-GAUGE.0/dimension_projection_model.md`
- `docs/pios/PSEE-GAUGE.0/projection_logic_spec.md`
- `docs/pios/PSEE-GAUGE.0/confidence_and_variance_model.md`

**Upstream authority artifacts:**
- `docs/pios/PSEE.1/psee_decision_contract_v1.md`
- `docs/pios/PSEE.1/escalation_and_fallback_spec.md`
- `docs/pios/PSEE.1/decision_state_model.md`
- `docs/pios/PSEE.2/engine_validation_report.md`
- `docs/pios/PSEE.2/variance_resolver_spec.md`
- `docs/pios/PSEE.2/heuristic_guard_spec.md`

---

## Traceability Check Format

Each check verifies one claim: that a specific PSEE-GAUGE.0 formula, threshold, or rule is backed by a specific upstream artifact and field.

---

## Score Component Traceability (CHECK-009..011)

---

### CHECK-009 — Completion Component Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | The completion score (0–40) in `gauge_score_model.md §D1` derives from `PSEEContext.current_state` and traces to the PSEE.1 17-state model |
| **Verification** | Read `gauge_score_model.md §D1 State Score Lookup Table`; confirm: (1) every state in the table (S-00..S-13, S-T1..S-T3) matches the 17-state model in `PSEE.1/decision_state_model.md`; (2) no state appears in the gauge table that does not exist in PSEE.1 |
| **PASS condition** | State lookup table contains exactly 17 rows; every state ID matches PSEE.1/decision_state_model.md |
| **FAIL condition** | Any state in the lookup table is absent from PSEE.1, OR any PSEE.1 terminal state is absent from the lookup table |
| **Upstream authority** | `docs/pios/PSEE.1/decision_state_model.md` |
| **Fail type** | Traceability (completion component) |

---

### CHECK-010 — Coverage Component Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | The coverage score (0–35) in `gauge_score_model.md §D2` derives from `PSEEContext.coverage_percent` and the 90% threshold traces to DP-5-02 in `PSEE.1/psee_decision_contract_v1.md` |
| **Verification** | Read `gauge_score_model.md §D2`; confirm: (1) formula `coverage_points = round(coverage_percent × 0.35)` is present; (2) the 90% coverage threshold is explicitly cited as DP-5-02 |
| **PASS condition** | Formula present; 90% threshold cited as DP-5-02; no alternative source referenced |
| **FAIL condition** | Coverage threshold not linked to DP-5-02, OR formula uses a different field than `coverage_percent` |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §Section 4 (DP-5-02)` |
| **Fail type** | Traceability (coverage component) |

---

### CHECK-011 — Reconstruction Component Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | The reconstruction score (0–25) in `gauge_score_model.md §D3` derives from `PSEEContext.reconstruction_result` and traces to DP-6-01 in `PSEE.1/psee_decision_contract_v1.md` |
| **Verification** | Read `gauge_score_model.md §D3`; confirm: (1) formula `weighted_match = (equivalent_count × 1.0 + partial_count × 0.5) / total_count` is present; (2) DP-6-01 is cited as the authority for reconstruction scoring; (3) the `reconstruction_result` field is used, not an invented reconstruction proxy |
| **PASS condition** | Formula present; DP-6-01 cited; `reconstruction_result` field sourced from PSEEContext |
| **FAIL condition** | Reconstruction formula does not cite DP-6-01, OR uses a PSEEContext field not defined in PSEE.2 |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §Section 5 (DP-6-01)` |
| **Fail type** | Traceability (reconstruction component) |

---

## Dimension Traceability (CHECK-012..017)

---

### CHECK-012 — DIM-01 (Coverage) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `dimension_projection_model.md §DIM-01` derives from `PSEEContext.coverage_percent`; threshold (90%) traces to DP-5-02 |
| **Verification** | Read `dimension_projection_model.md §DIM-01`; confirm source field is `PSEEContext.coverage_percent` and threshold references DP-5-02 |
| **PASS condition** | Source field and threshold authority match |
| **FAIL condition** | Different source field or threshold without DP-5-02 citation |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §DP-5-02` |
| **Fail type** | Traceability (DIM-01) |

---

### CHECK-013 — DIM-02 (Reconstruction) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `dimension_projection_model.md §DIM-02` derives from `PSEEContext.reconstruction_result`; authority traces to DP-6-01 |
| **Verification** | Read `dimension_projection_model.md §DIM-02`; confirm source field is `PSEEContext.reconstruction_result` and DP-6-01 is cited |
| **PASS condition** | Source field and authority match |
| **FAIL condition** | Different source field or no DP-6-01 citation |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §DP-6-01` |
| **Fail type** | Traceability (DIM-02) |

---

### CHECK-014 — DIM-03 (Escalation Clearance) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `dimension_projection_model.md §DIM-03` derives from `PSEEContext.escalation_log` (open entries with resolution = null); authority traces to PSEE.1/escalation_and_fallback_spec.md |
| **Verification** | Read `dimension_projection_model.md §DIM-03`; confirm source field is `escalation_log` and clearance computation counts null-resolution entries; PSEE.1 escalation spec cited |
| **PASS condition** | Source field is `escalation_log`; open-escalation counting logic present; upstream citation present |
| **FAIL condition** | Different source field OR no escalation spec citation |
| **Upstream authority** | `docs/pios/PSEE.1/escalation_and_fallback_spec.md` |
| **Fail type** | Traceability (DIM-03) |

---

### CHECK-015 — DIM-04 (Unknown-Space) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `dimension_projection_model.md §DIM-04` derives from `PSEEContext.us_records`; displayed as a counter (not a bar); type breakdown matches US-CONDITION-01/02/03 |
| **Verification** | Read `dimension_projection_model.md §DIM-04`; confirm: (1) source is `us_records`; (2) dimension is rendered as counter, not 0–100 bar; (3) breakdown uses US-CONDITION-01, US-CONDITION-02, US-CONDITION-03 |
| **PASS condition** | All three conditions confirmed |
| **FAIL condition** | DIM-04 treated as bar dimension, OR breakdown types differ from US-CONDITION-01/02/03 |
| **Upstream authority** | `docs/pios/PSEE-OPS.0/unknown_space_interface.md`; `docs/pios/PSEE.X/unknown_space_inventory.md` |
| **Fail type** | Traceability (DIM-04) |

---

### CHECK-016 — DIM-05 (Intake Completeness) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `dimension_projection_model.md §DIM-05` derives from `PSEEContext.filter_table`; state labels (COMPLETE/PENDING/INCOMPLETE) align with Phase 1 intake states |
| **Verification** | Read `dimension_projection_model.md §DIM-05`; confirm source field is `filter_table`; confirm state label values match PSEE.1/decision_state_model.md Phase 1 outcomes |
| **PASS condition** | Source field and state labels match |
| **FAIL condition** | Different source field OR state labels not traceable to Phase 1 outcomes |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §Section 1 (Phase 1)` |
| **Fail type** | Traceability (DIM-05) |

---

### CHECK-017 — DIM-06 (Heuristic Compliance) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `dimension_projection_model.md §DIM-06` derives from `PSEEContext.flags` (specifically STOP: BLOCKED_HEURISTIC flag); authority traces to PSEE.2/heuristic_guard_spec.md |
| **Verification** | Read `dimension_projection_model.md §DIM-06`; confirm source field is `flags` and flag pattern is `STOP: BLOCKED_HEURISTIC`; heuristic_guard_spec.md cited |
| **PASS condition** | Source field is `flags`; BLOCKED_HEURISTIC flag pattern cited; heuristic guard spec referenced |
| **FAIL condition** | Different source field OR no heuristic guard spec citation |
| **Upstream authority** | `docs/pios/PSEE.2/heuristic_guard_spec.md` |
| **Fail type** | Traceability (DIM-06) |

---

## Projection Rule Traceability (CHECK-018..021)

---

### CHECK-018 — PR-01 (S-T1 STOPPED) Authority

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `projection_logic_spec.md §PR-01` assigns projected_score = 0 for S-T1; this rule traces to `PSEE.2/exception_runtime_spec.md §STOP-01/STOP-02` |
| **Verification** | Read `projection_logic_spec.md §PR-01`; confirm: (1) projected_score = 0 for S-T1; (2) PSEE.2/exception_runtime_spec.md is cited as authority |
| **PASS condition** | Projected score = 0 for S-T1; exception runtime spec cited |
| **FAIL condition** | S-T1 projected score ≠ 0, OR no exception runtime spec citation |
| **Upstream authority** | `docs/pios/PSEE.2/exception_runtime_spec.md §STOP-01/STOP-02` |
| **Fail type** | Traceability (PR-01) |

---

### CHECK-019 — PR-02 (S-T2 ESCALATED) Resume State Authority

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `projection_logic_spec.md §PR-02` simulates escalation resolution using resume states from `PSEE-OPS.0/escalation_interface_spec.md §Resumption Paths` (ESC-01→S-03, ESC-02→S-03, ESC-03→S-04, ESC-04→S-07, ESC-05→S-11, ESC-06→S-02) |
| **Verification** | Read `projection_logic_spec.md §PR-02`; confirm resume state lookup references escalation_interface_spec.md; confirm no resume state is invented outside the 6 ESC class mappings |
| **PASS condition** | Resume state authority cited; zero invented resume paths |
| **FAIL condition** | Resume states not cited to escalation_interface_spec.md, OR a resume state (e.g., ESC-01→S-07) contradicts the spec |
| **Upstream authority** | `docs/pios/PSEE-OPS.0/escalation_interface_spec.md §Resumption Paths` |
| **Fail type** | Traceability (PR-02) |

---

### CHECK-020 — PR-03 (S-T3 PARTIAL) Threshold Authority

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `projection_logic_spec.md §PR-03` projects coverage to 90% minimum; 90% threshold traces to DP-5-02 |
| **Verification** | Read `projection_logic_spec.md §PR-03`; confirm: (1) projected_coverage = 90 is the simulation value; (2) DP-5-02 is cited as the authority for 90%; (3) rule does NOT project beyond 90% |
| **PASS condition** | Threshold = 90%; DP-5-02 cited; no above-threshold projection |
| **FAIL condition** | Threshold differs from 90%, OR DP-5-02 not cited, OR projection simulates coverage above 90% |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §Section 4 (DP-5-02)` |
| **Fail type** | Traceability (PR-03) |

---

### CHECK-021 — PR-04 (S-13 COMPLETE) Identity Rule Authority

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `projection_logic_spec.md §PR-04` sets projected_score = canonical_score for S-13; this traces to `PSEE.1/psee_decision_contract_v1.md §Section 5 (Post-conditions)` |
| **Verification** | Read `projection_logic_spec.md §PR-04`; confirm projected = canonical for S-13; PSEE.1 post-conditions cited |
| **PASS condition** | Identity rule present; PSEE.1 post-conditions cited |
| **FAIL condition** | Projected ≠ canonical for S-13, OR no authority citation |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §Section 5` |
| **Fail type** | Traceability (PR-04) |

---

## Confidence and Variance Model Traceability (CHECK-022..025)

---

### CHECK-022 — CRF-01 (Unknown-Space Reduction) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `confidence_and_variance_model.md §CRF-01` derives from `PSEEContext.us_records`; reduction factor traces to `PSEE-OPS.0/unknown_space_interface.md §Non-Resolution Guarantee` (INV-02) |
| **Verification** | Read `confidence_and_variance_model.md §CRF-01`; confirm source field is `us_records`; INV-02 or unknown_space_interface.md cited as authority for the permanent-null characteristic that motivates the variance |
| **PASS condition** | Source field and authority match |
| **FAIL condition** | CRF-01 uses a different source field OR does not cite the non-resolution guarantee as the reason US records increase variance |
| **Upstream authority** | `docs/pios/PSEE-OPS.0/unknown_space_interface.md §Non-Resolution Guarantee` |
| **Fail type** | Traceability (CRF-01) |

---

### CHECK-023 — CRF-02 (Partial Coverage) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `confidence_and_variance_model.md §CRF-02` derives from `PSEEContext.coverage_percent`; reduction applies only when coverage < 90% threshold (DP-5-02) |
| **Verification** | Read `confidence_and_variance_model.md §CRF-02`; confirm: (1) source field is `coverage_percent`; (2) reduction threshold is 90% with DP-5-02 citation |
| **PASS condition** | Source and threshold authority match |
| **FAIL condition** | CRF-02 does not cite DP-5-02 as threshold authority |
| **Upstream authority** | `docs/pios/PSEE.1/psee_decision_contract_v1.md §DP-5-02` |
| **Fail type** | Traceability (CRF-02) |

---

### CHECK-024 — CRF-03 (Open Escalations) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `confidence_and_variance_model.md §CRF-03` derives from open entries in `PSEEContext.escalation_log`; traces to PSEE.1/escalation_and_fallback_spec.md |
| **Verification** | Read `confidence_and_variance_model.md §CRF-03`; confirm source field is `escalation_log`; escalation spec cited |
| **PASS condition** | Source field and authority match |
| **FAIL condition** | CRF-03 uses a different source OR no escalation spec citation |
| **Upstream authority** | `docs/pios/PSEE.1/escalation_and_fallback_spec.md` |
| **Fail type** | Traceability (CRF-03) |

---

### CHECK-025 — CRF-04 (STOPPED State) Source

| Field | Value |
|---|---|
| **Domain** | D3 |
| **Claim** | `confidence_and_variance_model.md §CRF-04` assigns variance = 0 (full reduction) when `PSEEContext.current_state = S-T1`; traces to PSEE.2/exception_runtime_spec.md |
| **Verification** | Read `confidence_and_variance_model.md §CRF-04`; confirm S-T1 condition present; exception runtime spec cited |
| **PASS condition** | S-T1 causes full confidence collapse (canonical = 0, projected = 0, variance band = 0); exception runtime spec cited |
| **FAIL condition** | S-T1 state produces non-zero variance band, OR no exception runtime spec citation |
| **Upstream authority** | `docs/pios/PSEE.2/exception_runtime_spec.md §STOP-01/STOP-02` |
| **Fail type** | Traceability (CRF-04) |

---

## Traceability Check Summary

| CHECK ID | Claim verified | Source artifact | Upstream authority |
|---|---|---|---|
| CHECK-009 | Completion component → state lookup | gauge_score_model.md §D1 | PSEE.1/decision_state_model.md |
| CHECK-010 | Coverage component → DP-5-02 | gauge_score_model.md §D2 | PSEE.1/psee_decision_contract_v1.md |
| CHECK-011 | Reconstruction component → DP-6-01 | gauge_score_model.md §D3 | PSEE.1/psee_decision_contract_v1.md |
| CHECK-012 | DIM-01 → coverage_percent | dimension_projection_model.md | PSEE.1 DP-5-02 |
| CHECK-013 | DIM-02 → reconstruction_result | dimension_projection_model.md | PSEE.1 DP-6-01 |
| CHECK-014 | DIM-03 → escalation_log | dimension_projection_model.md | PSEE.1/escalation_and_fallback_spec.md |
| CHECK-015 | DIM-04 → us_records (counter, not bar) | dimension_projection_model.md | PSEE-OPS.0/unknown_space_interface.md |
| CHECK-016 | DIM-05 → filter_table | dimension_projection_model.md | PSEE.1 Section 1 |
| CHECK-017 | DIM-06 → flags BLOCKED_HEURISTIC | dimension_projection_model.md | PSEE.2/heuristic_guard_spec.md |
| CHECK-018 | PR-01 → 0 for S-T1 | projection_logic_spec.md | PSEE.2/exception_runtime_spec.md |
| CHECK-019 | PR-02 → ESC resume states | projection_logic_spec.md | PSEE-OPS.0/escalation_interface_spec.md |
| CHECK-020 | PR-03 → 90% from DP-5-02 | projection_logic_spec.md | PSEE.1 DP-5-02 |
| CHECK-021 | PR-04 → canonical for S-13 | projection_logic_spec.md | PSEE.1 Section 5 |
| CHECK-022 | CRF-01 → us_records, INV-02 | confidence_and_variance_model.md | PSEE-OPS.0/unknown_space_interface.md |
| CHECK-023 | CRF-02 → coverage_percent, DP-5-02 | confidence_and_variance_model.md | PSEE.1 DP-5-02 |
| CHECK-024 | CRF-03 → escalation_log | confidence_and_variance_model.md | PSEE.1/escalation_and_fallback_spec.md |
| CHECK-025 | CRF-04 → S-T1, full collapse | confidence_and_variance_model.md | PSEE.2/exception_runtime_spec.md |

**Total D3 checks: 17 (CHECK-009..025)**

---

#### STATUS

| Check | Result |
|---|---|
| Score component traceability checks (CHECK-009..011) defined | CONFIRMED |
| Dimension traceability checks (CHECK-012..017) defined | CONFIRMED |
| Projection rule traceability checks (CHECK-018..021) defined | CONFIRMED |
| Confidence model traceability checks (CHECK-022..025) defined | CONFIRMED |
| All 17 D3 checks have explicit criterion, verification, PASS, FAIL | CONFIRMED |
| All upstream authority citations reference existing PSEE artifacts | CONFIRMED |
| No canonical mutation | CONFIRMED |

**PSEE GAUGE TRACEABILITY CHECKS: COMPLETE**
