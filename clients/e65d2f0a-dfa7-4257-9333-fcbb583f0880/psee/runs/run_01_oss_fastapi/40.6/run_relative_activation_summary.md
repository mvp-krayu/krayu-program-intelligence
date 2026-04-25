# Run-Relative Activation Summary
## PI.RUN-RELATIVE.ACTIVATION.75X.02 — First Deterministic Condition Activation Pass

**Stream:** PI.RUN-RELATIVE.ACTIVATION.75X.02
**Layer:** 75.x — Condition Activation Authority
**Contract:** PI.RUN-RELATIVE.ACTIVATION.75X.02 (DESIGN_AND_CONTROLLED_EXECUTION)
**Run:** run_01_oss_fastapi
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE — 4 conditions activated (provisional THRESHOLD_CANDIDATE thresholds)

---

## Scope

This document records the distribution extraction, threshold application, and condition activation outputs for the RUN_RELATIVE_OUTLIER-eligible signals in the second-client run. Only signals classified as THRESHOLD_CANDIDATE or THEORETICAL_BASELINE (binary) by PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01 are processed in this pass.

**Evidence source:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/binding/binding_envelope.json`

**Topology confirmed:** 45 nodes (5 binding_context, 10 CEU, 30 capability_surface); 62 edges (60 CONTAINS, 2 OVERLAP_STRUCTURAL)

---

## Eligible Signal Set

| Signal | Activation Strategy | In-Scope | Exclusion Reason |
|--------|---------------------|----------|-----------------|
| PSIG-001 | RUN_RELATIVE_OUTLIER | YES | — |
| PSIG-002 | RUN_RELATIVE_OUTLIER | YES | — |
| PSIG-003 | REQUIRES_CORPUS_BASELINE | NO | THRESHOLD_PENDING — corpus required |
| PSIG-004 | RUN_RELATIVE_OUTLIER | YES | — |
| PSIG-005 | COMPOSITE_ONLY | NO | BLOCKED — per-domain companion not defined |
| PSIG-006 | THEORETICAL_BASELINE (binary) | YES | — |
| SIG-002 | REQUIRES_CORPUS_BASELINE | NO | THRESHOLD_PENDING — corpus required |
| SIG-004 | COMPOSITE_ONLY | NO | BLOCKED — aggregation rule not defined |

---

## Distribution Analysis — PSIG-001 (Fan-In Concentration)

**Telemetry source:** ST-030 (MAX_FAN_IN), derived from CONTAINS + OVERLAP_STRUCTURAL edge in-degrees across all 45 nodes
**Signal formula:** PSIG-001 = max_fan_in / mean_fan_in

### Fan-In Distribution (all 45 nodes)

| Statistic | Value |
|-----------|-------|
| n | 45 |
| mean | 1.378 |
| SD | 2.559 |
| P50 (median) | 1.0 |
| Q1 (P25) | 0.0 |
| Q3 (P75) | 1.0 |
| IQR | 1.0 |
| P90 | 1.0 |
| P95 | 7.4 |
| P99 | 11.7 |
| max | 13 |

**IQR outlier boundary:** Q3 + 1.5 × IQR = 1.0 + 1.5 × 1.0 = **2.5** (not degenerate)

### Outlier Nodes (fan_in > 2.5)

| Node | fan_in | Domain Attribution | Ratio (node/mean) |
|------|--------|--------------------|-------------------|
| NODE-009 (CEU-09) | 13 | DOM-04 (frontend_isolated) | 9.43× |
| NODE-008 (CEU-08) | 10 | DOM-03 (backend_isolated) | 7.26× |
| NODE-010 (CEU-10) | 9 | DOM-05 (platform_monorepo) | 6.53× |

### Threshold Application

| Parameter | Value |
|-----------|-------|
| PSIG-001 signal value | 13 / 1.378 = **9.43** |
| Threshold basis | THRESHOLD_CANDIDATE: ratio > 2.0 (PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01) |
| Threshold met | YES — 9.43 > 2.0 |
| State | **HIGH** |
| Primary attribution | NODE-009 / DOM-04 (frontend_isolated) |

---

## Distribution Analysis — PSIG-002 (Fan-Out Propagation)

**Telemetry source:** ST-031 (MAX_FAN_OUT), derived from CONTAINS + OVERLAP_STRUCTURAL edge out-degrees across all 45 nodes
**Signal formula:** PSIG-002 = max_fan_out / mean_fan_out

### Fan-Out Distribution (all 45 nodes)

| Statistic | Value |
|-----------|-------|
| n | 45 |
| mean | 1.378 |
| SD | 2.425 |
| P50 (median) | 1.0 |
| Q1 (P25) | 1.0 |
| Q3 (P75) | 1.0 |
| IQR | 0.0 |
| max | 13 |

### IQR Degenerate Case — Fallback Method Applied

**IQR = 0 (Q1 = Q3 = 1.0).** Standard Tukey upper fence Q3 + 1.5 × IQR collapses to 1.0, which would flag every node with fan_out > 1 as an outlier — including all 30 capability_surface nodes that each have exactly fan_out = 1 via their MEMBER_OF edge. This is structurally meaningless.

**Cause:** 30 of 45 nodes (66.7%) are capability_surface nodes, each with exactly 1 outgoing edge. This structural floor compresses Q1, Q3, and IQR to 1.0.

**Fallback method applied:** mean + 2 × SD = 1.378 + 2 × 2.425 = **6.228**

This boundary identifies nodes with fan-out more than 2 standard deviations above the run mean — a statistically defensible outlier criterion that is not distorted by the capability-surface floor.

### Outlier Nodes (fan_out > 6.228)

| Node | fan_out | Domain Attribution | Ratio (node/mean) |
|------|---------|-------------------|-------------------|
| DOM-04 (frontend_isolated) | 13 | DOM-04 (self) | 9.43× |
| DOM-03 (backend_isolated) | 10 | DOM-03 (self) | 7.26× |
| DOM-05 (platform_monorepo) | 7 | DOM-05 (self) | 5.08× |

All three outlier nodes are domain-level (binding_context) nodes. Fan-out concentration is a domain-level phenomenon in this topology — domain nodes have disproportionately high out-degree from their CONTAINS edges to capability surfaces.

### Threshold Application

| Parameter | Value |
|-----------|-------|
| PSIG-002 signal value | 13 / 1.378 = **9.43** |
| Threshold basis | THRESHOLD_CANDIDATE: ratio > 2.0 (PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01) |
| Threshold met | YES — 9.43 > 2.0 |
| State | **HIGH** |
| Primary attribution | DOM-04 (frontend_isolated) |
| IQR method | DEGENERATE — mean+2SD fallback applied |

---

## Distribution Analysis — PSIG-004 (Responsibility Concentration)

**Telemetry source:** ST-033 (MAX_RESPONSIBILITY_SURFACE), ST-034 (TOTAL_INTERFACE_SURFACE)
**Signal formula:** PSIG-004 = max_surface_count_per_ceu / mean_surface_count_per_ceu
**Population:** 10 CEU nodes only (NODE-001..NODE-010)

### Responsibility Distribution (10 CEU nodes)

| Node | Surfaces | Note |
|------|----------|------|
| NODE-001 | 0 | isolated CEU |
| NODE-002 | 0 | isolated CEU |
| NODE-003 | 0 | isolated CEU |
| NODE-004 | 0 | isolated CEU |
| NODE-005 | 0 | isolated CEU |
| NODE-006 | 0 | isolated CEU |
| NODE-007 | 0 | isolated CEU |
| NODE-008 (CEU-08) | 10 | DOM-03 (backend_isolated) |
| NODE-009 (CEU-09) | 13 | DOM-04 (frontend_isolated) |
| NODE-010 (CEU-10) | 7 | DOM-05 (platform_monorepo) |

| Statistic | Value |
|-----------|-------|
| n | 10 |
| total surfaces (ST-034) | 30 |
| mean | 3.0 |
| IQR upper fence | ~21.25 (Q1=0, Q3=8.5, IQR=8.5) |
| IQR outliers | 0 — no node exceeds 21.25 |

IQR produces no outliers. The 7 CEUs with 0 surfaces suppress the IQR fence well above all observed values. Concentration ratio method is the primary activation path for PSIG-004.

### Concentration Ratio Method

**PSIG-004 = max_surface / mean_surface = 13 / 3.0 = 4.33**

| CEU | Surfaces | Ratio | Exceeds 2.0× threshold |
|-----|----------|-------|------------------------|
| NODE-009 (CEU-09) | 13 | 4.33× | YES |
| NODE-008 (CEU-08) | 10 | 3.33× | YES |
| NODE-010 (CEU-10) | 7 | 2.33× | YES |
| NODE-001..007 | 0 each | 0× | NO |

### Threshold Application

| Parameter | Value |
|-----------|-------|
| PSIG-004 signal value | 13 / 3.0 = **4.33** |
| Threshold basis | THRESHOLD_CANDIDATE: ratio > 2.0 (PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01) |
| Threshold met | YES — 4.33 > 2.0 |
| State | **HIGH** |
| Primary attribution | NODE-009 (CEU-09) / DOM-04 (frontend_isolated) |

---

## Distribution Analysis — PSIG-006 (Structural Fragmentation)

**Telemetry source:** ST-035 (STRUCTURAL_CLUSTER_COUNT), ST-007 (total node count)
**Signal formula:** PSIG-006 = (ST-035 − 1) / ST-007
**Activation method:** THEORETICAL_BASELINE (binary: ST-035 > 1)

| Field | Value |
|-------|-------|
| ST-035 (cluster count) | 10 |
| ST-007 (total nodes) | 45 |
| fragmentation_index | (10 − 1) / 45 = **0.20** |
| Binary rule | ST-035 > 1 |
| Result | 10 > 1 → **ACTIVATED** |

**Cluster composition:**
- 1 large connected component (36 nodes): DOM-03, DOM-04, DOM-05, NODE-008, NODE-009, NODE-010, all 30 capability surfaces
- 9 isolated singletons: DOM-01, DOM-02, NODE-001, NODE-002, NODE-003, NODE-004, NODE-005, NODE-006, NODE-007

**Pressure designation note:** PSIG-006 activation produces a **structural blind-spot map**, not a pressure zone. Isolated nodes have no coupling signals — they are observation gaps, not structural concentration zones. Per PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01: fragmentation_index > 0 is a structural observation; pressure-zone designation from PSIG-006 alone is prohibited.

---

## Activation Results Summary

| Condition | Signal | Signal Value | Threshold | State | Primary Domain Attribution |
|-----------|--------|--------------|-----------|-------|---------------------------|
| COND-PSIG-001-01 | PSIG-001 | 9.43 | > 2.0 (provisional) | **HIGH** | DOM-04 (frontend_isolated) via NODE-009 |
| COND-PSIG-002-01 | PSIG-002 | 9.43 | > 2.0 (provisional) | **HIGH** | DOM-04 (frontend_isolated) |
| COND-PSIG-004-01 | PSIG-004 | 4.33 | > 2.0 (provisional) | **HIGH** | DOM-04 (frontend_isolated) via NODE-009 |
| COND-PSIG-006-01 | PSIG-006 | 0.20 | > 0 (binary) | **ACTIVATED** | run-level — 9 isolated nodes (blind-spot) |

**Activated: 4 of 4 eligible signals**

---

## Compound Pressure Pre-Condition Analysis

No pressure zones are formally designated by this pass. Zone designation requires an authorized 75.x zone designation rule. The following pre-condition analysis records which domains satisfy compound zone pre-conditions based on activated conditions.

**DOM-04 (frontend_isolated):**
Receives primary attribution from COND-PSIG-001-01 (coupling pressure family), COND-PSIG-002-01 (propagation pressure family), and COND-PSIG-004-01 (responsibility pressure family). Three distinct pressure families activated on the same domain. Pre-conditioned for **Class 6 — Compound Structural Pressure Zone**.

**DOM-03 (backend_isolated):**
Receives secondary attribution from COND-PSIG-001-01 (NODE-008, fan_in=10, ratio=7.26×) and COND-PSIG-004-01 (NODE-008, surfaces=10, ratio=3.33×). Two distinct pressure families (coupling + responsibility). Pre-conditioned for **Class 6** (secondary; 2 pressure families).

**DOM-05 (platform_monorepo):**
Receives secondary attribution from COND-PSIG-001-01 (NODE-010, fan_in=9, ratio=6.53×), COND-PSIG-002-01 (fan_out=7, ratio=5.08×), and COND-PSIG-004-01 (NODE-010, surfaces=7, ratio=2.33×). Three pressure families present in secondary attribution. Pre-conditioned for **Class 6** (tertiary).

**Class 5 (Coordination Hub) — DOM-05 indicative only:**
PSIG-003 was not activated in this pass (THRESHOLD_PENDING). Class 5 formal designation cannot be raised. However, DOM-05 receives both OVERLAP_STRUCTURAL edges in this topology (from NODE-008/CEU-08 and NODE-009/CEU-09). DOM-05 is the expected Class 5 candidate once PSIG-003 threshold is authorized.

---

## Governance Confirmation

- No threshold was invented. All applied thresholds (ratio > 2.0; binary ST-035 > 1) are sourced from PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01 THRESHOLD_CANDIDATE and THEORETICAL_BASELINE classifications.
- No pressure zone was formally designated. This pass produces conditions only.
- No focus domain was selected. Focus domain selection requires zone designation upstream.
- IQR degenerate case (PSIG-002) was resolved by mean+2SD statistical fallback — not LLM judgment.
- All outputs derive exclusively from `binding/binding_envelope.json`.
- No docs/pios/ artifacts were modified.
- Evidence-First Principle maintained. No conditions were fabricated.
