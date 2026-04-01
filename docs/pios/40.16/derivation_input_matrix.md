# Derivation Input Matrix

Stream: 40.16 — Derivation Specification (ESI / RAG)
Artifact: 1 of 7
Date: 2026-03-31
Authority: docs/pios/40.4/ | docs/pios/40.5/ | docs/pios/40.3/
Layer: L3 — Derivation

---

## Purpose

This artifact defines all inputs required to derive ESI and RAG at the L3 canonical derivation layer. Inputs are expressed as source-agnostic Telemetry Requirement Classes (TC-XX). Each TC maps to concrete telemetry metrics from the 40.4 program-execution telemetry catalog (ST/AT/DT class), but the derivation specification in 40.16 does not depend on named source systems.

Primary architectural rule: derivation must function from telemetry classes, not from named data sources (no GitHub, Jira, CI system, or named tool references at the derivation layer).

---

## Telemetry Class Registry

### TC-01 — Execution Cadence

**Class description:** Measure of how frequently the program's primary execution trigger fires within a defined time window.

**Derivation role:** Input to PES-ESI-01 (Schedule Regularity Signal). Provides observed frequency F(t) for comparison against expected frequency F_expected.

**Required measurement type:** Time-series. At minimum two observations separated by a consistent time window.

**Concrete mapping (40.4):**
- AT-001: Automation Trigger Frequency — frequency of CI/CD automation trigger events per time window (time-series)

**Coverage status:** COVERED

---

### TC-02 — Pipeline Completion Rate

**Class description:** Rate at which program pipeline runs complete successfully within a defined time window.

**Derivation role:** Input to PES-ESI-03 (Delivery Completeness Signal). Provides completion_rate as a proportion of successful runs.

**Required measurement type:** Event-based. Binary per-run completion status, accumulated over window.

**Concrete mapping (40.4):**
- DT-007: Pipeline Run Completion Status — binary success/failure event per pipeline run

**Coverage status:** COVERED

---

### TC-03 — Artifact Delivery Completeness

**Class description:** Count of expected artifact types delivered in a single program run, expressed as a proportion of the complete expected set.

**Derivation role:** Input to PES-ESI-03 (Delivery Completeness Signal). Provides artifact_ratio.

**Required measurement type:** Event-based. Count of artifact types delivered per run.

**Concrete mapping (40.4):**
- DT-001: Intelligence Output Artifact Count — count of intelligence output artifacts per run (expected: 4)
- DT-003: Reconstruction Artifact Count — count of reconstruction artifacts per run (expected: 5)

**Coverage status:** COVERED

**Notes:** Expected artifact counts (4 for DT-001, 5 for DT-003) are fixed reference values from the 40.4 catalog. Derivation uses these as F_expected denominators.

---

### TC-04 — Delivery Velocity

**Class description:** Time elapsed between program execution trigger and delivery of primary output artifact. Measures end-to-end execution latency as a proxy for pipeline flow health.

**Derivation role:** Input to PES-ESI-04 (Flow Compression Signal). Provides latency_observed for normalization.

**Required measurement type:** Time-series. Duration in minutes per run.

**Concrete mapping (40.4):**
- DT-006: Push-to-Delivery Latency — time between push event and artifact delivery (time-series, minutes)

**Coverage status:** COVERED

---

### TC-05 — Validation Gate Rate

**Class description:** Count of validation gates enforced per run as a proportion of total gates defined in the program pipeline architecture.

**Derivation role:** Input to PES-ESI-05 (Governance Integrity Signal). Provides gate_rate.

**Required measurement type:** Event-based. Count of gate enforcement events per run.

**Concrete mapping (40.4):**
- AT-007: Validation Gate Enforcement Count — count of gates enforced per pipeline run

**Coverage status:** COVERED

**Notes:** Gate denominator (total gates defined) is a structural reference from AT-007 metadata in the 40.4 catalog. Derivation treats this as a fixed program constant.

---

### TC-06 — Evidence Source Coverage

**Class description:** Count of active evidence sources connected to the program's evidence normalization layer per run.

**Derivation role:** Structural context input. Validates that TC-01 through TC-05 observations are grounded in a sufficient evidence footprint.

**Required measurement type:** Event-based. Count of active sources per run.

**Concrete mapping (40.4):**
- AT-008: Evidence Source Activation Count — count of evidence sources active per run

**Coverage status:** COVERED

**Notes:** TC-06 is a coverage validator, not a primary derivation input. ESI and RAG computations proceed regardless of TC-06 value; TC-06 value is recorded in the derivation manifest for traceability.

---

### TC-07 — Activity Regularity

**Class description:** Statistical variance of TC-01 (Execution Cadence) observations across N consecutive time windows. Measures consistency of program execution cadence over time.

**Derivation role:** Input to PES-ESI-01 (Schedule Regularity Signal). Provides the stability_component via variance analysis.

**Required measurement type:** Time-series variance. Requires minimum 3 observations (N ≥ 3) to produce a meaningful variance estimate.

**Concrete mapping (40.4):**
- AT-001: Automation Trigger Frequency — derived variance over N windows

**Coverage status:** COVERED (derived from AT-001; no additional metric required)

**Notes:** TC-07 is a derived metric from TC-01 observations, not a separate raw telemetry metric. The derivation specification treats it as a distinct class to enable independent substitution of variance algorithms without touching cadence measurement.

---

### TC-08 — Feedback Loop Activation

**Class description:** Count of feedback routing and feedback delivery events per run. Measures whether the program's feedback mechanisms are active.

**Derivation role:** Input to PES-ESI-05 (Governance Integrity Signal). Provides feedback_rate.

**Required measurement type:** Event-based. Count of feedback events per run.

**Concrete mapping (40.4):**
- AT-009: Feedback Routing Event Count — count of feedback routing events per run
- DT-008: Feedback Loop Delivery Confirmation — count of confirmed feedback delivery events per run

**Coverage status:** COVERED

---

## Coverage Gap Register

### CG-01 — Cost Pressure Signal

**Missing class:** No telemetry requirement class can be defined for cost or budget tracking from 40.4 telemetry.

**Impact:** PES-ESI-02 (Cost Pressure Signal) cannot be derived. ESI composite enters PARTIAL mode.

**Affected signals:** PES-ESI-02

**Resolution path:** A future telemetry class (TC-09: Budget Execution Rate or equivalent) requires introduction of budget/spend tracking metrics into the program-execution telemetry catalog. This is a gap in the 40.4 telemetry definition, not in the derivation specification.

**Status:** OPEN — no 40.4 metric maps to cost or budget execution tracking

---

## Coverage Summary

| TC Code | Class Name | Coverage Status | Primary Signal |
|---------|------------|-----------------|----------------|
| TC-01 | Execution Cadence | COVERED | PES-ESI-01 |
| TC-02 | Pipeline Completion Rate | COVERED | PES-ESI-03 |
| TC-03 | Artifact Delivery Completeness | COVERED | PES-ESI-03 |
| TC-04 | Delivery Velocity | COVERED | PES-ESI-04 |
| TC-05 | Validation Gate Rate | COVERED | PES-ESI-05 |
| TC-06 | Evidence Source Coverage | COVERED | Validator only |
| TC-07 | Activity Regularity | COVERED (derived) | PES-ESI-01 |
| TC-08 | Feedback Loop Activation | COVERED | PES-ESI-05 |
| TC-09 | [Cost/Budget Execution] | NOT DEFINED — CG-01 | PES-ESI-02 |

**Overall coverage:** 8 of 9 required classes covered. ESI will operate in PARTIAL mode due to CG-01.

---

## Source Boundary Confirmation

All TC definitions in this artifact are expressed as abstract telemetry classes. No TC definition names a source system (CI platform, issue tracker, version control host, or named tool). Concrete mappings to AT-001, AT-007, DT-006, etc. reference the 40.4 program-execution telemetry catalog only — a source-agnostic normalized layer. This satisfies the primary architectural rule of Stream 40.16.
