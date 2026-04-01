# Derivation Traceability Map

Stream: 40.16 — Derivation Specification (ESI / RAG)
Artifact: 5 of 7
Date: 2026-03-31
Authority: docs/pios/40.4/ | docs/pios/40.16/esi_derivation_specification.md | docs/pios/40.16/rag_derivation_specification.md
Layer: L3 — Derivation

---

## Purpose

This artifact defines the traceability chain from raw telemetry metrics through Telemetry Requirement Classes, Primary Execution Signals, and final ESI/RAG scores. Every output of the derivation layer must be traceable to its inputs. This map is the canonical reference for that traceability.

---

## Traceability Chain Overview

```
Raw Telemetry (40.4 catalog)
    ↓
Telemetry Requirement Classes (TC-01..TC-08)
    [L2 → L3 boundary — normalization functions NF-01..NF-07]
    ↓
Normalized TC Values
    ↓
Primary Execution Signals (PES-ESI-01..05)
    [Intermediate computation within L3]
    ↓
ESI Composite Score
    ↓
RAG Components (RAG_rate, RAG_accel, RAG_cross)
    [Derived from PES signals across temporal windows]
    ↓
RAG Composite Score
```

---

## Forward Traceability: Raw Metric → Output Score

### AT-001 (Automation Trigger Frequency)

**Flows to:** TC-01 (Execution Cadence), TC-07 (Activity Regularity)

**Via:**
- NF-01 → frequency_component → PES-ESI-01 (weight: 0.6 of PES-ESI-01)
- NF-02 (variance of AT-001 across N windows) → stability_component → PES-ESI-01 (weight: 0.4 of PES-ESI-01)

**Contributes to ESI via:** PES-ESI-01 (weight: 0.25 of ESI full, 0.3125 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-01), accel_i(PES-ESI-01), propagation assessment

---

### AT-007 (Validation Gate Enforcement Count)

**Flows to:** TC-05 (Validation Gate Rate)

**Via:** NF-06 → gate_rate → PES-ESI-05 (weight: 0.5 of PES-ESI-05)

**Contributes to ESI via:** PES-ESI-05 (weight: 0.10 of ESI full, 0.1250 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-05), accel_i(PES-ESI-05), propagation assessment

---

### AT-008 (Evidence Source Activation Count)

**Flows to:** TC-06 (Evidence Source Coverage)

**Via:** No normalization function (TC-06 is a validator, not a derivation input)

**Contributes to ESI:** NOT DIRECTLY — recorded in manifest only

**Contributes to RAG:** NOT DIRECTLY

---

### AT-009 (Feedback Routing Event Count)

**Flows to:** TC-08 (Feedback Loop Activation) — additive input

**Via:** NF-07 → feedback_rate → PES-ESI-05 (weight: 0.5 of PES-ESI-05)

**Contributes to ESI via:** PES-ESI-05 (weight: 0.10 of ESI full, 0.1250 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-05), accel_i(PES-ESI-05), propagation assessment

---

### DT-001 (Intelligence Output Artifact Count)

**Flows to:** TC-03 (Artifact Delivery Completeness) — additive input (combined with DT-003)

**Via:** NF-04 → artifact_ratio → PES-ESI-03 (weight: 0.5 of PES-ESI-03)

**Contributes to ESI via:** PES-ESI-03 (weight: 0.25 of ESI full, 0.3125 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-03), accel_i(PES-ESI-03), propagation assessment

---

### DT-003 (Reconstruction Artifact Count)

**Flows to:** TC-03 (Artifact Delivery Completeness) — additive input (combined with DT-001)

**Via:** NF-04 → artifact_ratio → PES-ESI-03 (weight: 0.5 of PES-ESI-03)

**Contributes to ESI via:** PES-ESI-03 (weight: 0.25 of ESI full, 0.3125 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-03), accel_i(PES-ESI-03), propagation assessment

---

### DT-006 (Push-to-Delivery Latency)

**Flows to:** TC-04 (Delivery Velocity)

**Via:** NF-05 → latency_normalized → PES-ESI-04 (sole input to PES-ESI-04)

**Contributes to ESI via:** PES-ESI-04 (weight: 0.20 of ESI full, 0.2500 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-04), accel_i(PES-ESI-04), propagation assessment

---

### DT-007 (Pipeline Run Completion Status)

**Flows to:** TC-02 (Pipeline Completion Rate)

**Via:** NF-03 → completion_rate → PES-ESI-03 (weight: 0.5 of PES-ESI-03)

**Contributes to ESI via:** PES-ESI-03 (weight: 0.25 of ESI full, 0.3125 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-03), accel_i(PES-ESI-03), propagation assessment

---

### DT-008 (Feedback Loop Delivery Confirmation)

**Flows to:** TC-08 (Feedback Loop Activation) — additive input

**Via:** NF-07 → feedback_rate → PES-ESI-05 (weight: 0.5 of PES-ESI-05)

**Contributes to ESI via:** PES-ESI-05 (weight: 0.10 of ESI full, 0.1250 PARTIAL)

**Contributes to RAG via:** rate_i(PES-ESI-05), accel_i(PES-ESI-05), propagation assessment

---

## Reverse Traceability: ESI Score → Source Metrics

| ESI Component | Weight (Full) | Weight (PARTIAL) | Source PES | Source TCs | Source Raw Metrics |
|---------------|--------------|-----------------|------------|------------|-------------------|
| PES-ESI-01 | 0.25 | 0.3125 | Schedule Regularity | TC-01, TC-07 | AT-001 |
| PES-ESI-02 | 0.20 | UNDEFINED (CG-01) | Cost Pressure | TC-09 (undefined) | None in 40.4 |
| PES-ESI-03 | 0.25 | 0.3125 | Delivery Completeness | TC-02, TC-03 | DT-007, DT-001, DT-003 |
| PES-ESI-04 | 0.20 | 0.2500 | Flow Compression | TC-04 | DT-006 |
| PES-ESI-05 | 0.10 | 0.1250 | Governance Integrity | TC-05, TC-08 | AT-007, AT-009, DT-008 |

---

## Reverse Traceability: RAG Score → Source Data

| RAG Component | Weight | Source | Minimum Window Requirement |
|---------------|--------|--------|---------------------------|
| RAG_rate | 0.50 | PES-ESI signals across 2 windows | W ≥ 2 |
| RAG_accel | 0.30 | Rate-of-change deltas across 3 windows | W ≥ 3 (else 0.0 neutral) |
| RAG_cross | 0.20 | Count of co-degrading PES signals in current window | W ≥ 1 (but RAG requires W ≥ 2) |

---

## Traceability Requirements for Each Derivation Run

Every derivation run must record the following in its manifest (see execution_manifest.md for format):

**Input traceability:**
- Run identifier
- Window boundaries (start and end timestamps for each window used)
- TC values observed for each metric in each window
- Program constant values used
- Any TC values marked UNDEFINED and reason

**Intermediate traceability:**
- Normalized value for each NF function (frequency_component, stability_component, etc.)
- PES value for each PES-ESI-01..05

**Output traceability:**
- ESI score
- ESI coverage_mode (FULL or PARTIAL)
- List of undefined signals (if PARTIAL)
- RAG_rate, RAG_accel, RAG_cross (intermediate values before composite)
- RAG score
- RAG rag_status (COMPUTED or INSUFFICIENT_WINDOWS)
- Any warnings or errors logged during derivation

Without this recorded intermediate state, a derivation output cannot be audited or reproduced. Traceability is a hard requirement, not a recommendation.

---

## Coverage Gap Traceability

### CG-01 Traceability

**Gap:** PES-ESI-02 (Cost Pressure Signal) has no 40.4 telemetry input.

**Trace forward impact:**
- ESI: coverage_mode = PARTIAL; weight redistribution applied (see esi_derivation_specification.md §PARTIAL Mode)
- RAG: inherits PARTIAL mode; RAG_rate, RAG_accel, RAG_cross computed from 4 signals instead of 5

**Trace backward:** No 40.4 raw metric traces to PES-ESI-02. No TC maps to cost/budget execution. The gap originates in the 40.4 telemetry catalog definition.

**Resolution path:** Introduction of a cost/budget execution telemetry metric in a future version of the 40.4 catalog would close CG-01. Upon closure, PES-ESI-02 computation must be added to this traceability map, and the ESI/RAG derivation specifications must be updated to include the full-mode formula.

---

## Source Agnosticism Verification

This traceability map references only:
- 40.4 telemetry metrics (AT-xxx, DT-xxx) — source-agnostic normalized layer
- Telemetry Requirement Classes (TC-xx) — source-agnostic abstraction
- Primary Execution Signals (PES-ESI-xx) — derivation-layer intermediates

No source system name (GitHub, Jira, Jenkins, Linear, Prometheus, etc.) appears in this traceability map. Source agnosticism is maintained at the derivation layer. The 40.4 telemetry catalog (structural, activity, delivery metrics) is the boundary at which source-specific data is normalized before entering the derivation chain.
