# Feedback Signal Registry

**Stream:** 40.9 — PiOS Feedback & Continuous Improvement Layer
**Source:** docs/pios/40.8/delivery_output_packet.md, docs/pios/40.9/unknown_space_registry.md, docs/pios/40.9/recurrence_detection_report.md, docs/pios/40.9/coverage_pressure_map.md
**Date:** 2026-03-18
**Amendment:** 2026-03-18 — Hardening pass; REC-004 and REC-005 references replaced with OBS-A and OBS-B per recurrence definition compliance

---

## Registry Rule

Each feedback signal is a structured observation derived from the 40.8 delivery packet. Signals identify coverage gaps, unknown-space dimensions, and recurrence patterns. No scoring. No prioritization. No recommendation. No prediction. All signals are traceable to delivery elements.

---

## FSR-001 — Change Concentration Unknown Space

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-001 |
| Signal type | unknown_space |
| Source references | INTEL-005, DIAG-005 |
| Coverage state | blocked |
| Recurrence status | yes — see REC-003 |
| Temporal classification | time-series |

**Dependency chain (from 40.8 delivery):**
`INTEL-005` → `DIAG-005` → `COND-005` → `SIG-003` (CKR-008) → `AT-001` (automation trigger frequency) + `AT-002` (auto-commit event frequency)

**Dependency type:** time-series accumulation — requires push-to-main event counts across successive intervals from live GitHub repository activity

**Recurrence link:** AT-001/AT-002 absence also affects DIAG-008 (RAG component) and INTEL-004 (risk profile change dimension). Observed in REC-003 (4 independently traceable occurrences). Note: this FSR was previously linked to REC-004 (event-based temporal class distribution); that pattern was downgraded to structural observation OBS-A per hardening pass — recurrence link updated accordingly.

**Signal state: REGISTERED — unresolved**

---

## FSR-002 — Execution Stability Unknown Space

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-002 |
| Signal type | unknown_space |
| Source references | INTEL-005, DIAG-006 |
| Coverage state | blocked |
| Recurrence status | yes — see REC-001, REC-002 |
| Temporal classification | event-based |

**Dependency chain (from 40.8 delivery):**
`INTEL-005` → `DIAG-006` → `COND-006` → `SIG-006` (CKR-011) → `DT-007` (pipeline run completion status) + `AT-007` (validation gate enforcement per run)

**Dependency type:** event-based — requires live pipeline execution records; no pipeline runs recorded in current input set

**Recurrence link:** DT-007 absence also affects DIAG-004, DIAG-007, INTEL-002, INTEL-003 (REC-002, 5 occurrences). AT-007 absence also affects DIAG-003, DIAG-007, INTEL-002, INTEL-003 (REC-001, 5 occurrences). Note: this FSR was previously linked to REC-005 (pipeline execution absence characterization); that pattern was downgraded to structural observation OBS-B per hardening pass — recurrence link updated accordingly.

**Signal state: REGISTERED — unresolved**

---

## FSR-003 — Runtime Coordination Dimension Gap

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-003 |
| Signal type | partial_coverage |
| Source references | DIAG-003, INTEL-002 |
| Coverage state | partial |
| Recurrence status | yes — AT-007 appears in 5 elements (REC-001) |
| Temporal classification | event-based |

**Dependency chain (from 40.8 delivery):**
`DIAG-003` → `COND-003` → `SIG-001` (CKR-006) → `AT-005` (pipeline module execution count per run) + `AT-007` (validation gate enforcement per run)

**Resolved component:** Structural coordination ratio 0.875 (7 of 8 stages) — static, fully present
**Unresolved component:** Runtime coordination events per run — event-based, requires live pipeline execution

**Recurrence link:** AT-007 is a recurring dependency (REC-001, 5 occurrences). Note: this FSR was previously linked to REC-004 (event-based temporal class distribution); that pattern was downgraded to structural observation OBS-A per hardening pass — recurrence link updated accordingly. AT-005 recurrence is not separately governed (appears in fewer than 2 elements in the delivery scope as a primary dependency).

**Signal state: REGISTERED — static component resolved; event-based component pending**

---

## FSR-004 — Throughput Completion Factor Gap

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-004 |
| Signal type | partial_coverage |
| Source references | DIAG-004, INTEL-002 |
| Coverage state | partial |
| Recurrence status | yes — DT-007 appears in 5 elements (REC-002) |
| Temporal classification | event-based |

**Dependency chain (from 40.8 delivery):**
`DIAG-004` → `COND-004` → `SIG-005` (CKR-010) → `DT-007` (pipeline run completion status) + `AT-006` (pipeline execution mode at runtime)

**Resolved component:** Baseline throughput constants (8 stages/run, 9 artifacts/run) — declared constants, fully present
**Unresolved component:** Completion-conditioned throughput rate — event-based, requires live pipeline execution (DT-007); execution mode context (AT-006)

**Recurrence link:** DT-007 is a recurring dependency (REC-002, 5 occurrences).

**Signal state: REGISTERED — constants resolved; completion-conditioned rate pending**

---

## FSR-005 — ESI Execution Stability Component Gap

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-005 |
| Signal type | partial_coverage |
| Source references | DIAG-007, INTEL-003 |
| Coverage state | partial |
| Recurrence status | yes — SIG-006 blocking propagates to both ESI composite and INTEL-003; see REC-001, REC-002 |
| Temporal classification | event-based |

**Dependency chain (from 40.8 delivery):**
`DIAG-007` → `COND-007` → `SIG-007` (CKR-014) → `SIG-006` (CKR-011, blocked) → `DT-007` + `AT-007`

**Resolved component:** Dependency load component of ESI (SIG-002: 0.682); throughput constants (SIG-005: 8 stages, 9 artifacts/run)
**Unresolved component:** Execution stability component of ESI — blocked via SIG-006

**Recurrence link:** SIG-006 blocking is the same root as FSR-002. DT-007 and AT-007 are recurring dependencies (REC-001: 5 occurrences, REC-002: 5 occurrences). Note: this FSR was previously linked to REC-005 (pipeline execution absence characterization); that pattern was downgraded to structural observation OBS-B per hardening pass — recurrence link updated accordingly.

**Signal state: REGISTERED — static components resolved; stability component blocked**

---

## FSR-006 — RAG Change Concentration Component Gap

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-006 |
| Signal type | partial_coverage |
| Source references | DIAG-008, INTEL-004 |
| Coverage state | partial |
| Recurrence status | yes — AT-001/AT-002 absence appears in 4 elements (REC-003) |
| Temporal classification | time-series |

**Dependency chain (from 40.8 delivery):**
`DIAG-008` → `COND-008` → `SIG-008` (CKR-015) → `SIG-003` (CKR-008, blocked) → `AT-001` + `AT-002`

**Resolved component:** Structural volatility component (SIG-004: 1.273/0.545/0.364/0.455); structural coordination component (SIG-001 structural: 0.875)
**Unresolved component:** Change concentration time-series component of RAG — blocked via SIG-003

**Recurrence link:** SIG-003 blocking is the same root as FSR-001. AT-001/AT-002 are recurring time-series dependencies (REC-003, 4 occurrences). Note: this FSR was previously linked to REC-004 (event-based temporal class distribution); that pattern was downgraded to structural observation OBS-A per hardening pass — recurrence link updated accordingly.

**Signal state: REGISTERED — structural components resolved; time-series component blocked**

---

## FSR-007 — AT-007 Recurring Event-Based Dependency

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-007 |
| Signal type | recurrent_dependency |
| Source references | DIAG-003, DIAG-006, DIAG-007, INTEL-002, INTEL-003 |
| Coverage state | partial/blocked (mixed — appears in both) |
| Recurrence status | yes — 5 delivery elements (REC-001) |
| Temporal classification | event-based |

**Recurring dependency:** AT-007 — Validation Gate Enforcement Count Per Run

**Occurrence map:**

| Occurrence | Delivery Element | Role | Coverage Impact |
|---|---|---|---|
| 1 | DIAG-003 | Pending runtime component (SIG-001) | partial |
| 2 | DIAG-006 | Blocking telemetry (SIG-006) | blocked |
| 3 | DIAG-007 | Blocking component via SIG-006 | partial |
| 4 | INTEL-002 | Unknown dimension (runtime coordination) | unknown |
| 5 | INTEL-003 | Unknown dimension (ESI stability via SIG-006) | unknown |

**Dependency characterization:** Single event-based metric appearing as a dependency gap across 3 analytical dimensions (coordination, stability, composite health) and 2 intelligence outputs. Occurrence count: 5 (confirmed per REC-001).

**Signal state: REGISTERED — 5-element recurrence confirmed**

---

## FSR-008 — DT-007 Recurring Event-Based Dependency

| Field | Value |
|---|---|
| Feedback Signal ID | FSR-008 |
| Signal type | recurrent_dependency |
| Source references | DIAG-004, DIAG-006, DIAG-007, INTEL-002, INTEL-003 |
| Coverage state | partial/blocked (mixed) |
| Recurrence status | yes — 5 delivery elements (REC-002) |
| Temporal classification | event-based |

**Recurring dependency:** DT-007 — Pipeline Run Completion Status

**Occurrence map:**

| Occurrence | Delivery Element | Role | Coverage Impact |
|---|---|---|---|
| 1 | DIAG-004 | Pending completion factor (SIG-005) | partial |
| 2 | DIAG-006 | Blocking telemetry (SIG-006) | blocked |
| 3 | DIAG-007 | Blocking component via SIG-006 | partial |
| 4 | INTEL-002 | Unknown dimension (completion-conditioned rate) | unknown |
| 5 | INTEL-003 | Unknown dimension (ESI stability via SIG-006) | unknown |

**Dependency characterization:** Single event-based metric appearing as a dependency gap across 3 analytical dimensions (throughput, stability, composite health) and 2 intelligence outputs. Occurrence count: 5 (confirmed per REC-002).

**Signal state: REGISTERED — 5-element recurrence confirmed**

---

## Feedback Signal Summary

| FSR ID | Signal Type | Source Elements | Coverage State | Recurrent | Temporal |
|---|---|---|---|---|---|
| FSR-001 | unknown_space | INTEL-005, DIAG-005 | blocked | yes (REC-003) | time-series |
| FSR-002 | unknown_space | INTEL-005, DIAG-006 | blocked | yes (REC-001, REC-002) | event-based |
| FSR-003 | partial_coverage | DIAG-003, INTEL-002 | partial | yes (REC-001) | event-based |
| FSR-004 | partial_coverage | DIAG-004, INTEL-002 | partial | yes (REC-002) | event-based |
| FSR-005 | partial_coverage | DIAG-007, INTEL-003 | partial | yes (REC-001, REC-002) | event-based |
| FSR-006 | partial_coverage | DIAG-008, INTEL-004 | partial | yes (REC-003) | time-series |
| FSR-007 | recurrent_dependency | DIAG-003, DIAG-006, DIAG-007, INTEL-002, INTEL-003 | partial/blocked | yes (REC-001) | event-based |
| FSR-008 | recurrent_dependency | DIAG-004, DIAG-006, DIAG-007, INTEL-002, INTEL-003 | partial/blocked | yes (REC-002) | event-based |

**Total feedback signals registered: 8**
**Unknown space signals: 2 (FSR-001, FSR-002)**
**Partial coverage signals: 4 (FSR-003 through FSR-006)**
**Recurrent dependency signals: 2 (FSR-007, FSR-008)**
**All signals: no scoring, no prioritization, no recommendation, no prediction**
