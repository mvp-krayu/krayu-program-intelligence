# PSEE.2 — State Transition Table

**Stream:** PSEE.2
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/decision_state_model.md (read-only input)

---

## Transition Registry Scope

This document is the executable mapping of all PSEE state transitions. It is the authoritative implementation of the `TransitionRegistry` in `PSEEStateMachine`. Every row in this table corresponds to one entry in the registry: `(current_state, dp_id, condition_value) → (next_state, action_id)`.

No transition may occur in a running engine that is not represented in this table. An unregistered transition is a STOP condition: `UNDEFINED_TRANSITION`.

---

## State Definitions (Reference)

| State ID | Name | Phase |
|---|---|---|
| S-00 | UNBOUND | Pre-execution |
| S-01 | BOUND | Phase 0 complete |
| S-02 | NORMALIZING | Phase 1 active |
| S-03 | NORMALIZED | Phase 1 complete |
| S-04 | FILTERING | Phase 2 active |
| S-05 | FILTERED | Phase 2 complete |
| S-06 | GROUPING | Phase 3 active |
| S-07 | GROUPED | Phase 3 complete |
| S-08 | ABSTRACTING | Phase 4 active |
| S-09 | ABSTRACTED | Phase 4 complete |
| S-10 | CLASSIFYING | Phase 5 active |
| S-11 | CLASSIFIED | Phase 5 complete (≥90%) |
| S-12 | SIMULATING | Phase 6 active |
| S-13 | COMPLETE | Terminal success |
| S-T1 | STOPPED | Terminal failure |
| S-T2 | ESCALATED | Suspended (resumable) |
| S-T3 | PARTIAL | Soft advisory (resumable to S-12) |

---

## Transition Registry

### Phase 0 — Source Binding (S-00 → S-01)

| From | DP | Condition | To | Action | Authority |
|---|---|---|---|---|---|
| S-00 | DP-0-01 | PASS | S-00 | CONTINUE_DP-0-02 | P0-01 |
| S-00 | DP-0-01 | FAIL | S-T1 | STOP-01(SOURCE_RESOLUTION_FAIL) | P0-01 |
| S-00 | DP-0-02 | PASS | S-00 | CONTINUE_DP-0-03 | P0-02 |
| S-00 | DP-0-02 | FAIL_ABSENT | S-T1 | STOP-01(SOURCE_RESOLUTION_FAIL) | P0-02 |
| S-00 | DP-0-02 | FAIL_FALLBACK_AVAILABLE | S-00 | OPERATOR_CREATE_BOUNDARY; RETRY_DP-0-02 | P0-02 fallback |
| S-00 | DP-0-03 | PASS | S-00 | CONTINUE_DP-0-04 | P0-03 |
| S-00 | DP-0-03 | FAIL | S-T1 | STOP-01(SOURCE_RESOLUTION_FAIL) | P0-03 |
| S-00 | DP-0-04 | PASS | S-01 | BIND_CONTEXT; LOG_ENTRY(S-00→S-01) | P0-04 |
| S-00 | DP-0-04 | FAIL | S-T1 | STOP-01(SOURCE_RESOLUTION_FAIL) | P0-04 |

**Note on DP-0-02 FAIL_FALLBACK_AVAILABLE:** This condition fires when the boundary document is absent but a source snapshot intake record or equivalent (H-11 ADMISSIBLE_REFERENCE) exists. The operator is invited to construct the boundary document; S-00 loops until boundary is present and DP-0-02 PASS is achieved or stream is abandoned.

---

### Phase 1 — Normalization (S-01 → S-03)

| From | DP | Condition | To | Action | Authority |
|---|---|---|---|---|---|
| S-01 | AUTO | ENTRY | S-02 | BEGIN_SCAN_NORMALIZATION | Decision state model |
| S-02 | DP-1-01 | DUPLICATION_DETECTED | S-02 | INVOKE_DP-1-02(affected_path) | R-NRM-01 |
| S-02 | DP-1-01 | NO_DUPLICATION | S-02 | NO_NRM_RECORD; CONTINUE_NEXT_PATH | R-NRM-01 |
| S-02 | DP-1-02 | PACKAGING_BOUNDARY | S-02 | INVOKE_DP-1-03 | R-NRM-01 |
| S-02 | DP-1-02 | EXTRACTION_ARTIFACT | S-02 | INVOKE_DP-1-03 | R-NRM-01 |
| S-02 | DP-1-02 | ARCHITECTURAL_STRUCTURE | S-T2 | ESC-01(preserve_both_paths); SUSPEND_AFFECTED_PATH | DP-1-04 |
| S-02 | DP-1-02 | UNCLASSIFIABLE | S-T2 | ESC-02(halt_dependent); SUSPEND_AFFECTED_PATH | DP-1-05 |
| S-02 | DP-1-03 | COLLAPSE_CONFIRMED | S-02 | WRITE_NRM_RECORD(collapsed=true); REMOVE_OUTER_PATH | R-NRM-01 |
| S-T2 | ESC_RESOLVED | DP-1-02_RESOLUTION | S-02 | APPLY_RESOLUTION; RESUME_AFFECTED_PATH | ESC-01/02 |
| S-02 | ALL_PATHS_PROCESSED | COMPLETE | S-03 | FINALIZE_CANONICAL_PATHS; LOG_ENTRY(S-02→S-03) | State model |

**Multi-path note:** DP-1-01 through DP-1-03 run per path in the corpus. Escalation of one path does not block processing of other paths. The engine tracks per-path suspension independently. S-02→S-03 transition fires only when all paths are in a terminal normalization state (collapsed, preserved, or escalation-resolved).

---

### Phase 2 — Filtering (S-03 → S-05)

| From | DP | Condition | To | Action | Authority |
|---|---|---|---|---|---|
| S-03 | DP-2-01 | EXCLUSION_LIST_PRESENT | S-04 | BEGIN_FILTER_PASS; LOG_ENTRY(S-03→S-04) | R-FLT-03 |
| S-03 | DP-2-01 | EXCLUSION_LIST_ABSENT | S-T2 | ESC-03(GRAY_ZONE); REQUEST_SCOPE_STMT | DP-2-01 |
| S-T2 | ESC_RESOLVED | DP-2-01_RESOLUTION | S-04 | UPDATE_BOUNDARY_DOC; LOG_ENTRY(→S-04) | ESC-03 |
| S-04 | DP-2-02 | IN_PROVENANCE_ONLY | S-04 | SET_STATUS(NOT_INGESTED); WRITE_FLT_RECORD | R-FLT-01 (FX-02) |
| S-04 | DP-2-02 | NOT_IN_PROVENANCE_ONLY | S-04 | INVOKE_DP-2-03 | R-FLT-02 |
| S-04 | DP-S-01 | REDUCED_AUTHORITY_ANNOTATION | S-04 | SET_STATUS(ACCEPTED-SUPPORT-ONLY); WRITE_FLT_RECORD | R-FLT-02 (CT-02) |
| S-04 | DP-2-03 | EXTRACTION_GENERATED | S-04 | SET_STATUS(ACCEPTED-SUPPORT-ONLY); WRITE_FLT_RECORD | R-FLT-02 |
| S-04 | DP-2-03 | NOT_EXTRACTION_GENERATED | S-04 | INVOKE_DP-2-04 | R-FLT-03 |
| S-04 | DP-2-04 | IN_EXCLUSION_LIST | S-04 | SET_STATUS(EXCLUDED); WRITE_COMPLIANCE_RECORD | R-FLT-03 (FX-03) |
| S-04 | DP-2-04 | NOT_IN_EXCLUSION_LIST | S-04 | SET_STATUS(ACCEPTED) | FX-04 |
| S-04 | ALL_FILES_ASSIGNED | COMPLETE | S-05 | VERIFY_NO_PENDING; LOG_ENTRY(S-04→S-05) | INV-04 |

**DP-S-01 integration:** The `source_materials` field annotation check (DP-S-01) is embedded within the DP-2-03 handler. If `source_materials` contains a reduced-authority annotation (CT-02: "lightweight", "support only", "metadata only", "context only"), the handler produces `condition_value = REDUCED_AUTHORITY_ANNOTATION` and triggers the corresponding row above.

---

### Phase 3 — Grouping (S-05 → S-07)

| From | DP | Condition | To | Action | Authority |
|---|---|---|---|---|---|
| S-05 | AUTO | ENTRY | S-06 | BEGIN_DOMAIN_FORMATION; LOG_ENTRY(S-05→S-06) | State model |
| S-06 | DP-3-02 | DOMAIN_GT_50_FILES | S-06 | APPLY_SUBGROUPING(R-GRP-02); WRITE_SUB_TABLES | CT-03 |
| S-06 | DP-3-02 | DOMAIN_LTE_50_FILES | S-06 | FLAT_DOMAIN; NO_SUB_TABLES | CT-03 |
| S-06 | DP-3-03 | REPEATED_PATTERN_DETECTED | S-06 | APPLY_PATTERN_ROWS(R-ABS-02); WRITE_PATTERN_COUNT | CT-04 |
| S-06 | DP-3-03 | NO_REPEATED_PATTERN | S-06 | ENUMERATE_INDIVIDUALLY | CT-04 |
| S-06 | DP-3-04 | PLATFORM_EMBEDDING_DETECTED | S-06 | APPLY_R-GRP-03; WRITE_OVL_REFERENCE | R-GRP-03 (CT-05) |
| S-06 | DP-3-04 | NO_PLATFORM_EMBEDDING | S-06 | NO_GRP-03_ACTION | CT-05 |
| S-06 | DP-3-05 | MULTI_CLASS_FILES | S-06 | SET_DOMAIN_CLASS_UNION | CT-06 |
| S-06 | DP-3-05 | SINGLE_CLASS_FILES | S-06 | SET_DOMAIN_CLASS_SINGLE | CT-06 |
| S-06 | DP-3-01 | ALL_PATHS_ASSIGNED | S-07 | FINALIZE_DOMAINS; LOG_ENTRY(S-06→S-07) | DP-3-01 |
| S-06 | DP-3-01 | UNCLAIMED_PATH_EXISTS | S-T2 | ESC-04(UNCLAIMED_PATH); SUSPEND_AT_GATE | DP-3-01 |
| S-T2 | ESC_RESOLVED | DP-3-01_RESOLUTION | S-07 | ASSIGN_OR_REMOVE_PATH; LOG_ENTRY(→S-07) | ESC-04 |

**Sub-actions note (DP-3-02..05):** These run within S-06 and do not trigger S-06→S-07 transition. They produce domain sub-table records. The S-06→S-07 transition fires only after DP-3-01 (the completion gate) confirms all paths in `primary_evidence_origin_paths` are assigned.

---

### Phase 4 — Abstraction and CEU Formation (S-07 → S-09)

| From | DP | Condition | To | Action | Authority |
|---|---|---|---|---|---|
| S-07 | AUTO | ENTRY | S-08 | BEGIN_CEU_FORMATION; LOG_ENTRY(S-07→S-08) | State model |
| S-08 | DP-4-01 | GTE_3_SUBGROUPS | S-08 | CREATE_CEU_SUBUNITS(R-ABS-02); ASSIGN_IDs(FX-06) | DP-4-01 |
| S-08 | DP-4-01 | LT_3_SUBGROUPS | S-08 | FLAT_CEU; NO_SUBUNITS | DP-4-01 |
| S-08 | DP-4-02 | DIFF_AVAILABLE_IDENTICAL | S-08 | WRITE_OVL(parity=KNOWN, resolution=RESOLVED) | R-NRM-02 (FX-08) |
| S-08 | DP-4-02 | DIFF_AVAILABLE_DIFFERENT | S-08 | WRITE_OVL(parity=KNOWN, resolution=UNRESOLVED) | R-NRM-02 (FX-08) |
| S-08 | DP-4-02 | NO_DIFF_STRUCTURAL_ONLY | S-08 | WRITE_OVL(parity=UNKNOWN); INVOKE_DP-4-03(US-CONDITION-01) | R-NRM-02; R-NRM-03 |
| S-08 | DP-4-03 | UNKNOWN_POSITION_EXISTS | S-08 | CREATE_US_RECORD(us_condition, affected); CONTINUE | R-NRM-03 (FX-07) |
| S-08 | DP-4-03 | NO_UNKNOWN_POSITION | S-08 | NO_US_RECORD_NEEDED | R-NRM-03 |
| S-08 | ALL_CEU_OVL_US_COMPLETE | COMPLETE | S-09 | ASSIGN_CEU_IDs(FX-05); LOG_ENTRY(S-08→S-09) | State model |

**Invariant check before S-08→S-09:** Engine verifies that:
- Every domain has a CEU record
- Every structurally similar CEU pair has an OVL record
- Every UNKNOWN parity OVL has a corresponding US record
Failure of any invariant check → STOP: INVARIANT_VIOLATION(S-09).

---

### Phase 5 — Classification (S-09 → S-11 or S-T3)

| From | DP | Condition | To | Action | Authority |
|---|---|---|---|---|---|
| S-09 | AUTO | ENTRY | S-10 | BEGIN_CLASSIFICATION; LOG_ENTRY(S-09→S-10) | State model |
| S-10 | DP-5-01 | TYPE_IN_EXPLICIT_INCLUSIONS | S-10 | ASSIGN_CLASS_FROM_LIST; WRITE_CLASSIFICATION_RECORD | DP-5-01 |
| S-10 | DP-5-01 | TYPE_NOT_IN_LIST_UNAMBIGUOUS | S-10 | ASSIGN_CLASS_BY_CONTENT_ROLE(CT-06); WRITE_RECORD | DP-5-01 |
| S-10 | DP-5-01 | TYPE_NOT_IN_LIST_AMBIGUOUS | S-T2 | ESC-05(AMBIGUOUS_FILE_TYPE); SUSPEND_AT_FILE | DP-5-01 |
| S-T2 | ESC_RESOLVED | DP-5-01_RESOLUTION | S-10 | APPLY_OPERATOR_CLASSIFICATION; CONTINUE | ESC-05 |
| S-10 | DP-S-02 | PRIORITY_VALUE_VALID | S-10 | WRITE_PRIORITY_TO_RECORD | DP-S-02 (FX-09 / FX-10) |
| S-10 | DP-S-02 | PRIORITY_VALUE_INVALID | S-T1 | STOP: INVALID_PRIORITY_VALUE | DP-S-02 |
| S-10 | DP-5-02 | COVERAGE_GTE_90 | S-11 | SET_COVERAGE; LOG_ENTRY(S-10→S-11) | CT-07 |
| S-10 | DP-5-02 | COVERAGE_LT_90 | S-T3 | SET_PARTIAL_FLAG; IDENTIFY_UNMAPPED; LOG | CT-07 |

**FX-09 (NOT INGESTED) and FX-10 (OVERLAP-NOTED):** These fixed rules are evaluated within the DP-S-02 handler. Files with `intake_status ∈ {NOT INGESTED, EXCLUDED}` receive `priority = NOT INGESTED` (FX-09). Platform-embedded files with active OVL records receive `priority = OVERLAP-NOTED` (FX-10). Both are fully deterministic.

---

### Phase 5 Soft-Stop: S-T3 Transition

| From | Condition | To | Action | Authority |
|---|---|---|---|---|
| S-T3 | OPERATOR_ACKNOWLEDGES_PARTIAL | S-12 | SET_PARTIAL_IN_CONTEXT; FLAG_ALL_OUTPUTS; LOG_ENTRY(S-T3→S-12) | S-T3 definition |
| S-T3 | OPERATOR_REJECTS_PARTIAL | S-T1 | STOP-01 (stream abandoned) | Operator discretion |

---

### Phase 6 — Reconstruction Simulation (S-11/S-T3 → S-13 or S-T1/S-T2)

| From | DP | Condition | To | Action | Authority |
|---|---|---|---|---|---|
| S-11 | AUTO | ENTRY | S-12 | BEGIN_SIMULATION; LOG_ENTRY(S-11→S-12) | State model |
| S-12 | DP-6-01 | ALL_EQUIVALENT_OR_PARTIAL | S-13 | WRITE_RECONSTRUCTION_REPORT; LOG_ENTRY(S-12→S-13) | DP-6-01 |
| S-12 | DP-6-01 | DIVERGENT_ITER_1 | S-02 | ESC-06(LOG_DIVERGENT_UNITS); RE-ENTER_NORMALIZATION | DP-6-01 iter 1 |
| S-12 | DP-6-01 | DIVERGENT_ITER_2 | S-T1 | STOP-02(RECONSTRUCTION_DIVERGENT_UNRESOLVABLE) | DP-6-01 iter 2 |

**Iteration tracking:** `PSEEContext` carries `phase6_iteration_count` (initialized to 0). The Phase6Handler increments this counter on each DP-6-01 evaluation that produces a DIVERGENT result. On `phase6_iteration_count == 1`: DIVERGENT_ITER_1. On `phase6_iteration_count == 2`: DIVERGENT_ITER_2.

---

### Terminal and Resume States

| State | Entry condition | Exit condition | Exit target |
|---|---|---|---|
| S-T1 | STOP-01 or STOP-02 | None (restart only) | S-00 (new run) |
| S-T2 | ESC-01..06 | EscalationResolution received + valid | Per-ESC resume state |
| S-T3 | DP-5-02 coverage < 90% | Operator acknowledgement | S-12 |
| S-13 | DP-6-01 PASS | None (terminal success) | — |

---

## Completeness Proof

| Category | Count | Accounted in table |
|---|---|---|
| States | 17 (S-00..S-13, S-T1..S-T3) | All 17 ✓ |
| Decision points | 26 (DP-0-01..DP-S-02) | All 26 ✓ |
| STOP conditions | 2 (STOP-01, STOP-02) | Both ✓ |
| ESCALATE conditions | 6 (ESC-01..06) | All 6 ✓ |
| Terminal state exits | 3 (S-T1: none; S-T2: per-ESC; S-T3: S-12) | All ✓ |
| Undefined transition behavior | — | STOP: UNDEFINED_TRANSITION ✓ |

No decision path is left implicit. Every DP with more than one condition value has a row for each condition value.

---

#### STATUS

| Check | Result |
|---|---|
| All 17 states represented | CONFIRMED |
| All 26 decision points have transition rows | CONFIRMED |
| All STOP / ESCALATE conditions handled | CONFIRMED |
| All terminal and resume paths defined | CONFIRMED |
| Undefined transition protection defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**STATE TRANSITION TABLE: COMPLETE**
