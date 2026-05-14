# Condition Output Set — Run-Relative Activation
## PI.RUN-RELATIVE.ACTIVATION.75X.02

**Stream:** PI.RUN-RELATIVE.ACTIVATION.75X.02
**Layer:** 75.x — Condition Activation Authority
**Contract:** PI.RUN-RELATIVE.ACTIVATION.75X.02 (DESIGN_AND_CONTROLLED_EXECUTION)
**Run:** run_01_oss_fastapi
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE — 4 conditions produced

---

## Governing Principle

Conditions produced by this stream are PROVISIONAL. All signal IDs (PSIG-XXX) are PROVISIONAL_CKR_CANDIDATE — not yet CKR-registered. All applied thresholds are THRESHOLD_CANDIDATE per PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01. No condition produced here may be used as a final authority until CKR registration and formal threshold authorization are completed.

This file does not modify or supersede the existing `condition_output_set.md` (stream PI.SECOND-CLIENT.SIGNAL-DERIVATION.40X.01). Both condition sets coexist. The prior set contains 3 BLOCKED conditions from canonical SIG signals; this set contains 4 activated conditions from provisional PSIG signals.

---

## Upstream Signal Pre-Flight

| Signal | Telemetry Source | Input Status | Extracted Value |
|--------|-----------------|--------------|-----------------|
| PSIG-001 | ST-030 (MAX_FAN_IN) | INPUT_DEFINED | max_fan_in = 13 (NODE-009) |
| PSIG-002 | ST-031 (MAX_FAN_OUT) | INPUT_DEFINED | max_fan_out = 13 (DOM-04) |
| PSIG-004 | ST-033 (MAX_RESPONSIBILITY_SURFACE) / ST-034 (TOTAL_INTERFACE_SURFACE) | INPUT_DEFINED | max_surface = 13; total_surface = 30 |
| PSIG-006 | ST-035 (STRUCTURAL_CLUSTER_COUNT) | INPUT_DEFINED | cluster_count = 10 |

All four inputs derived from `binding/binding_envelope.json`. Extraction executed in-stream; no external computation required.

---

## COND-PSIG-001-01 — Fan-In Concentration Pressure

| Field | Value |
|-------|-------|
| condition_id | COND-PSIG-001-01 |
| signal_id | PSIG-001 (PROVISIONAL_CKR_CANDIDATE) |
| pressure_family | Coupling pressure — fan-in / intake bottleneck |
| activation_method | RUN_RELATIVE_OUTLIER — IQR outlier detection + concentration ratio |
| signal_value | **9.43** (max_fan_in / mean_fan_in = 13 / 1.378) |
| threshold_authority | PI.RUN-RELATIVE.ACTIVATION.75X.02 (provisional) |
| threshold_basis | THRESHOLD_CANDIDATE: ratio > 2.0 (PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01) |
| threshold_applied | ratio > 2.0 |
| threshold_met | YES — 9.43 > 2.0 |
| state | **HIGH** |
| max_outlier_node | NODE-009 (CEU-09) — fan_in = 13 |
| max_outlier_domain | DOM-04 (frontend_isolated) |
| distribution_boundary | IQR upper fence = 2.5 (Q1=0, Q3=1, IQR=1) |
| nodes_exceeding_boundary | 3 |
| secondary_outliers | NODE-008 (fan_in=10, ratio=7.26×, DOM-03 backend_isolated); NODE-010 (fan_in=9, ratio=6.53×, DOM-05 platform_monorepo) |
| evidence_source | binding/binding_envelope.json — CONTAINS + OVERLAP_STRUCTURAL edge in-degree computation |
| pressure_zone_class_eligible | Class 1 — Coupling Pressure Zone |
| zone_domain_primary | DOM-04 (frontend_isolated) |
| zone_domain_secondary | DOM-03 (backend_isolated); DOM-05 (platform_monorepo) |

---

## COND-PSIG-002-01 — Fan-Out Propagation Pressure

| Field | Value |
|-------|-------|
| condition_id | COND-PSIG-002-01 |
| signal_id | PSIG-002 (PROVISIONAL_CKR_CANDIDATE) |
| pressure_family | Propagation pressure — fan-out / blast-radius |
| activation_method | RUN_RELATIVE_OUTLIER — mean+2SD fallback (IQR degenerate) + concentration ratio |
| signal_value | **9.43** (max_fan_out / mean_fan_out = 13 / 1.378) |
| threshold_authority | PI.RUN-RELATIVE.ACTIVATION.75X.02 (provisional) |
| threshold_basis | THRESHOLD_CANDIDATE: ratio > 2.0 (PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01) |
| threshold_applied | ratio > 2.0 |
| threshold_met | YES — 9.43 > 2.0 |
| state | **HIGH** |
| max_outlier_node | DOM-04 (frontend_isolated) — fan_out = 13 |
| max_outlier_domain | DOM-04 (frontend_isolated) — domain IS the outlier node |
| iqr_status | DEGENERATE — Q1=Q3=1.0, IQR=0; Tukey fence collapses to 1.0 |
| fallback_method | mean + 2×SD = 1.378 + 2×2.425 = 6.228 |
| fallback_rationale | 30 of 45 nodes are capability_surface nodes each with fan_out=1; IQR fence is distorted by this structural floor; mean+2SD is not affected by distribution shape |
| nodes_exceeding_fallback | 3 |
| secondary_outliers | DOM-03 (fan_out=10, ratio=7.26×); DOM-05 (fan_out=7, ratio=5.08×) |
| evidence_source | binding/binding_envelope.json — CONTAINS + OVERLAP_STRUCTURAL edge out-degree computation |
| pressure_zone_class_eligible | Class 2 — Propagation Pressure Zone |
| zone_domain_primary | DOM-04 (frontend_isolated) |
| zone_domain_secondary | DOM-03 (backend_isolated); DOM-05 (platform_monorepo) |

---

## COND-PSIG-004-01 — Responsibility Concentration Pressure

| Field | Value |
|-------|-------|
| condition_id | COND-PSIG-004-01 |
| signal_id | PSIG-004 (PROVISIONAL_CKR_CANDIDATE) |
| pressure_family | Responsibility concentration — surface ownership overload |
| activation_method | RUN_RELATIVE_OUTLIER — concentration ratio (IQR method produces no outliers) |
| signal_value | **4.33** (max_surface_count / mean_surface_count = 13 / 3.0) |
| threshold_authority | PI.RUN-RELATIVE.ACTIVATION.75X.02 (provisional) |
| threshold_basis | THRESHOLD_CANDIDATE: ratio > 2.0 (PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01) |
| threshold_applied | ratio > 2.0 |
| threshold_met | YES — 4.33 > 2.0 |
| state | **HIGH** |
| max_outlier_node | NODE-009 (CEU-09) — surface_count = 13, ratio = 4.33× |
| max_outlier_domain | DOM-04 (frontend_isolated) |
| population | 10 CEU nodes (NODE-001..NODE-010) |
| total_surfaces_st034 | 30 |
| mean_surface_count | 3.0 |
| iqr_status | IQR upper fence ≈ 21.25 — no nodes exceed; IQR not used for activation |
| secondary_outliers_above_threshold | NODE-008 (CEU-08, surfaces=10, ratio=3.33×, DOM-03 backend_isolated); NODE-010 (CEU-10, surfaces=7, ratio=2.33×, DOM-05 platform_monorepo) |
| ceu_breakdown | NODE-001..007: 0 surfaces each (isolated CEUs); NODE-008: 10; NODE-009: 13; NODE-010: 7 |
| evidence_source | binding/binding_envelope.json — capability_surface provenance.parent_node attribution |
| pressure_zone_class_eligible | Class 3 — Responsibility Pressure Zone |
| zone_domain_primary | DOM-04 (frontend_isolated) via NODE-009 |
| zone_domain_secondary | DOM-03 (backend_isolated) via NODE-008; DOM-05 (platform_monorepo) via NODE-010 |

---

## COND-PSIG-006-01 — Structural Fragmentation Indicator

| Field | Value |
|-------|-------|
| condition_id | COND-PSIG-006-01 |
| signal_id | PSIG-006 (PROVISIONAL_CKR_CANDIDATE) |
| pressure_family | Structural fragmentation — graph connectivity |
| activation_method | THEORETICAL_BASELINE — binary (ST-035 > 1) |
| signal_value | **0.20** (fragmentation_index = (ST-035 − 1) / ST-007 = 9 / 45) |
| threshold_authority | PI.RUN-RELATIVE.ACTIVATION.75X.02 (provisional) |
| threshold_basis | THEORETICAL_BASELINE: graph theory — connected components > 1 indicates fragmentation |
| threshold_applied | ST-035 > 1 |
| threshold_met | YES — 10 > 1 |
| state | **ACTIVATED** |
| st_035_value | 10 (STRUCTURAL_CLUSTER_COUNT) |
| st_007_value | 45 (total nodes) |
| large_cluster_nodes | 36 — DOM-03, DOM-04, DOM-05, NODE-008, NODE-009, NODE-010, all 30 capability surfaces |
| isolated_singletons | 9 — DOM-01, DOM-02, NODE-001, NODE-002, NODE-003, NODE-004, NODE-005, NODE-006, NODE-007 |
| pressure_zone_designation | NONE |
| observation_type | STRUCTURAL_BLIND_SPOT — isolated nodes have no coupling signals; they represent observation gaps, not concentration zones |
| evidence_source | binding/binding_envelope.json — BFS connected component analysis |

---

## Condition Output Summary

| Condition | Signal | Pressure Family | Signal Value | Threshold | State | Primary Domain |
|-----------|--------|-----------------|--------------|-----------|-------|---------------|
| COND-PSIG-001-01 | PSIG-001 | Coupling | 9.43 | > 2.0 (provisional) | **HIGH** | DOM-04 (frontend_isolated) |
| COND-PSIG-002-01 | PSIG-002 | Propagation | 9.43 | > 2.0 (provisional) | **HIGH** | DOM-04 (frontend_isolated) |
| COND-PSIG-004-01 | PSIG-004 | Responsibility | 4.33 | > 2.0 (provisional) | **HIGH** | DOM-04 (frontend_isolated) |
| COND-PSIG-006-01 | PSIG-006 | Fragmentation | 0.20 | > 0 (binary) | **ACTIVATED** | run-level blind-spot |

**HIGH: 3 | ACTIVATED: 1 | Not in scope / BLOCKED: 4**

---

## Pressure Zone Pre-Condition Status

Zone designation is NOT made by this stream. The following records which pressure zone classes have their required activation conditions satisfied. Formal zone designation requires an authorized 75.x zone designation contract.

| Zone Class | Required Activation | Pre-Condition Status | Domain Candidates |
|------------|---------------------|---------------------|-------------------|
| Class 1 — Coupling Pressure | COND-PSIG-001-01 HIGH | **SATISFIED** | DOM-04 (primary); DOM-03, DOM-05 (secondary) |
| Class 2 — Propagation Pressure | COND-PSIG-002-01 HIGH | **SATISFIED** | DOM-04 (primary); DOM-03, DOM-05 (secondary) |
| Class 3 — Responsibility Pressure | COND-PSIG-004-01 HIGH | **SATISFIED** | DOM-04 (primary); DOM-03, DOM-05 (secondary) |
| Class 4 — Surface Exposure | PSIG-005 + PSIG-003 (same domain) | **NOT MET** — neither signal activated in this pass |
| Class 5 — Coordination Hub | PSIG-003 HIGH | **NOT MET** — PSIG-003 THRESHOLD_PENDING (corpus required) |
| Class 6 — Compound Structural | ≥2 conditions from different families | **SATISFIED** — DOM-04: Class 1+2+3 (3 families); DOM-03: Class 1+3 (2 families); DOM-05: Class 1+2+3 secondary |

**Class 5 indicative note:** DOM-05 receives both OVERLAP_STRUCTURAL edges in this topology (from NODE-008/CEU-08 and NODE-009/CEU-09). Once PSIG-003 threshold authorization is issued, DOM-05 is the expected Class 5 designation target.

---

## Focus Domain Pre-Condition Status

Focus domain selection is NOT made by this stream. It requires zone designation upstream.

**Strongest candidate by activated conditions:** DOM-04 (frontend_isolated)
- Pre-conditioned for Class 1, Class 2, Class 3, and Class 6
- Holds both max fan-in (via NODE-009) and max fan-out
- Holds max responsibility CEU (NODE-009, 13 surfaces)
- Under all five focus-domain strategies defined in PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01, DOM-04 is the leading candidate given current evidence

---

## Governance Lock

- No conditions from `condition_output_set.md` (PI.SECOND-CLIENT.SIGNAL-DERIVATION.40X.01) are modified or superseded.
- No threshold was invented. Applied thresholds sourced exclusively from PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01.
- No pressure zone was designated. Pre-condition status only.
- No focus domain was selected.
- All PSIG signals remain PROVISIONAL_CKR_CANDIDATE.
- All outputs derive exclusively from `binding/binding_envelope.json`.
- No docs/pios/ artifacts were modified.
- IQR degenerate case (PSIG-002) resolved by mean+2SD statistical fallback — not LLM judgment, not hardcoded override.
- Evidence-First Principle maintained. No conditions fabricated.
