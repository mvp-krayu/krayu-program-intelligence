# Execution Manifest

Stream: 40.16 — Derivation Specification (ESI / RAG)
Artifact: 7 of 7
Date: 2026-03-31
Authority: docs/pios/40.16/esi_derivation_specification.md | docs/pios/40.16/rag_derivation_specification.md | docs/pios/40.16/derivation_traceability_map.md
Layer: L3 — Derivation

---

## Purpose

This artifact defines the canonical format for the derivation run manifest — the record that must be produced each time the ESI and RAG derivation executes. The manifest is the primary traceability artifact. Without a complete manifest, a derivation output cannot be audited, reproduced, or validated.

This document defines the manifest schema and the mandatory field set. It also records the Stream 40.16 execution result — the production of this specification.

---

## Manifest Schema

Every derivation run must produce one manifest file conforming to this schema. The manifest is a structured record, not a log file. It is the authoritative record of one derivation execution.

### Section 1 — Run Identity

```
run_id:            [string — unique identifier for this derivation run]
run_timestamp:     [ISO 8601 — UTC timestamp of derivation execution start]
stream_version:    [string — version of the 40.16 specification used; e.g., "40.16.0"]
coverage_mode:     [FULL | PARTIAL]
undefined_signals: [list — signal IDs undefined in this run; empty list if FULL mode]
rag_status:        [COMPUTED | INSUFFICIENT_WINDOWS | UNDEFINED]
```

**Mandatory:** All fields required. No field may be absent or null.

---

### Section 2 — Window Definitions

```
windows:
  - window_id:    [string — unique identifier for this window; e.g., "W001"]
    window_start: [ISO 8601 UTC]
    window_end:   [ISO 8601 UTC]
    window_duration_days: [float]
  [repeat for each window used in this run]
```

**Mandatory:** At minimum 1 window (for ESI); at minimum 2 windows if RAG is computed. Window sequence must be chronologically ordered.

---

### Section 3 — Program Constants

```
constants:
  F_expected:           [float — expected trigger frequency per window]
  sigma_max:            [float — maximum acceptable cadence variance]
  artifacts_expected:   [int — expected artifact count per run; default 9]
  L_target:             [float — target delivery latency, minutes]
  L_max:                [float — maximum acceptable delivery latency, minutes]
  gates_defined:        [int — count of pipeline validation gates]
  feedback_expected:    [int — expected feedback events per run]
```

**Mandatory:** All fields required. Zero or undefined constants must be flagged as errors prior to manifest finalization.

---

### Section 4 — Telemetry Class Observations

One entry per TC per window:

```
tc_observations:
  - window_id:   [string — reference to window in Section 2]
    tc_code:     [string — e.g., "TC-01"]
    raw_value:   [float | int | UNDEFINED]
    source_metric: [string — 40.4 metric code; e.g., "AT-001"]
    status:      [OBSERVED | UNDEFINED]
    notes:       [string — optional; include reason if UNDEFINED]
  [repeat for each TC × window combination]
```

**Mandatory:** One entry for every TC in scope for every window. UNDEFINED entries must include a reason note.

---

### Section 5 — Normalized Values

One entry per normalization function output per window:

```
normalized_values:
  - window_id:        [string]
    nf_code:          [string — e.g., "NF-01"]
    output_name:      [string — e.g., "frequency_component"]
    value:            [float | UNDEFINED]
    clamped:          [true | false]
    warnings:         [list of strings]
  [repeat for each NF × window combination]
```

**Mandatory:** One entry for every normalization function in scope for every window. Clamped values must be flagged.

---

### Section 6 — Primary Execution Signal Values

```
pes_values:
  - window_id: [string]
    signal_id: [string — e.g., "PES-ESI-01"]
    value:     [float | UNDEFINED]
    inputs:    [list of NF output names used]
  [repeat for each PES × window combination]
```

**Mandatory:** One entry for every defined PES signal for every window. UNDEFINED signals (CG-01 / PES-ESI-02) must be explicitly listed with value: UNDEFINED.

---

### Section 7 — ESI Output

```
esi:
  score:         [float 0–100 | UNDEFINED]
  coverage_mode: [FULL | PARTIAL]
  window_id:     [string — window this ESI score represents]
  weights_used:
    PES-ESI-01:  [float]
    PES-ESI-02:  [float | N/A]
    PES-ESI-03:  [float]
    PES-ESI-04:  [float]
    PES-ESI-05:  [float]
  score_band:    [string — Stable | Degrading | Under Pressure | High Risk | Critical]
```

**Mandatory:** All fields required. weights_used must reflect the actual weights applied (renormalized if PARTIAL mode).

---

### Section 8 — RAG Output

```
rag:
  status:      [COMPUTED | INSUFFICIENT_WINDOWS | UNDEFINED]
  score:       [float -100 to +100 | UNDEFINED]
  coverage_mode: [FULL | PARTIAL | N/A]
  windows_used: [list of window_id strings]
  components:
    RAG_rate:  [float -1.0 to +1.0 | UNDEFINED]
    RAG_accel: [float -1.0 to +1.0 | UNDEFINED | NEUTRAL_INSUFFICIENT_WINDOWS]
    RAG_cross: [float -1.0 to +1.0 | UNDEFINED]
  weights_applied:
    RAG_rate:  0.50
    RAG_accel: 0.30
    RAG_cross: 0.20
  direction:   [Strongly Improving | Improving | Neutral | Degrading | Strongly Degrading | N/A]
```

**Mandatory:** All fields required. If status = INSUFFICIENT_WINDOWS, score and components may be UNDEFINED.

---

### Section 9 — Warnings and Errors Log

```
log:
  - level:    [WARN | ERROR]
    code:     [string — e.g., "NF-WARN-01"]
    message:  [string]
    field:    [string — which TC, NF, or PES triggered this entry]
  [repeat for each warning or error]
```

**Mandatory:** All warnings and errors generated during derivation must be recorded here. An empty log is a valid entry (no issues encountered).

---

## Stream 40.16 Execution Manifest

This section records the execution of Stream 40.16 itself — the production of the derivation specification.

```
run_id:         40.16-spec-execution-2026-03-31
run_timestamp:  2026-03-31T00:00:00Z
stream_version: 40.16.0
execution_type: SPECIFICATION_PRODUCTION (not a derivation run — no ESI/RAG scores produced)
status:         COMPLETE
```

### Artifacts Produced

| Artifact | File | Status |
|----------|------|--------|
| 1 | docs/pios/40.16/derivation_input_matrix.md | COMPLETE |
| 2 | docs/pios/40.16/esi_derivation_specification.md | COMPLETE |
| 3 | docs/pios/40.16/rag_derivation_specification.md | COMPLETE |
| 4 | docs/pios/40.16/derivation_normalization_rules.md | COMPLETE |
| 5 | docs/pios/40.16/derivation_traceability_map.md | COMPLETE |
| 6 | docs/pios/40.16/derivation_validation_protocol.md | COMPLETE |
| 7 | docs/pios/40.16/execution_manifest.md | COMPLETE |

### Input Sources Used

| Source | Path | Role |
|--------|------|------|
| Activity Telemetry | docs/pios/40.4/activity_telemetry.md | TC-01, TC-05, TC-06, TC-07, TC-08 grounding |
| Delivery Telemetry | docs/pios/40.4/delivery_telemetry.md | TC-02, TC-03, TC-04 grounding |
| Structural Telemetry | docs/pios/40.4/structural_telemetry.md | Structural reference (no direct TC mapping) |
| Signal Computation Spec | docs/pios/40.5/signal_computation_specification.md | Gap identification (SIG-001..008 confirmed as non-ESI signals) |
| Entity Catalog | docs/pios/40.3/entity_catalog.md | Program subject identification |
| ESI Narrative | docs/governance/derivatives/narratives/execution_stability_index.md | Authority binding verification |
| RAG Narrative | docs/governance/derivatives/narratives/risk_acceleration_gradient.md | Authority binding verification; DRIFT-001 |
| Architecture Whitepaper | docs/governance/architecture/pios_architecture_whitepaper.md | SSI/SSZ analogues; DRIFT-001 source |
| SCI-00 | ~/Projects/krayu-knowledge/SCI/SCI-00.md | Scientific validation domain constraints |

### Gap Register (this run)

| Gap ID | Description | Impact |
|--------|-------------|--------|
| CG-01 | No cost/budget telemetry in 40.4 | ESI enters PARTIAL mode; PES-ESI-02 undefined |

### Validation Checklist (specification-level)

| Check | Result |
|-------|--------|
| Determinism principle enforced throughout specifications | PASS |
| Source agnosticism maintained — no named source systems in derivation specs | PASS |
| PARTIAL mode defined and consistently applied | PASS |
| All TC inputs mapped to 40.4 telemetry only (not 40.5 operational signals) | PASS |
| DRIFT-001 acknowledged; this specification constitutes canonical L3 authority | PASS |
| Cross-classification of RAG (standalone L1 + dimension_of ESI) preserved | PASS |
| All derivation constants externalized (not hardcoded) | PASS |
| No simulation of missing data | PASS |
| Traceability chain complete (raw metric → TC → PES → ESI/RAG) | PASS |

### Coverage Assessment

| Signal | Coverage |
|--------|----------|
| PES-ESI-01 (Schedule Regularity) | COVERED — AT-001 |
| PES-ESI-02 (Cost Pressure) | NOT COVERED — CG-01 |
| PES-ESI-03 (Delivery Completeness) | COVERED — DT-007, DT-001, DT-003 |
| PES-ESI-04 (Flow Compression) | COVERED — DT-006 |
| PES-ESI-05 (Governance Integrity) | COVERED — AT-007, AT-009, DT-008 |

Overall coverage: 4 of 5 signals defined. ESI operates in PARTIAL mode for the current 40.4 telemetry scope.

### Execution Notes

1. The 40.5 signal layer (SIG-001..008) was confirmed as BlueEdge fleet operational telemetry (heap usage, WebSocket connections, cache metrics). None of SIG-001..008 constitute ESI or RAG derivation inputs. The program-level derivation gap (F6 VIOLATION, DRIFT-001) was complete prior to this stream — 40.5 contained no ESI/RAG foundation.

2. The correct telemetry class for ESI/RAG derivation is the 40.4 ST/AT/DT program-execution telemetry layer (structural, activity, delivery), not the 40.4 DIM-PR/DIM-VP operational telemetry dimensions used by 40.5. These are two distinct telemetry layers within the 40.4 catalog.

3. RAG is fully specified as a standalone derivation output. Its cross-classification as the fifth named dimension of ESI (structural fact XL-04) is preserved — the same computation serves both graph positions.

4. Validation tests DVT-01 through DVT-13 and DRIFT-001 audit steps DA-01 through DA-03 are defined in derivation_validation_protocol.md but have not yet been executed. Implementation and validation execution remain pending.
