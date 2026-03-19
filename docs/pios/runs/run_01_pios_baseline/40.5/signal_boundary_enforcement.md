# Signal Boundary Enforcement

**Stream:** 40.5 — PiOS Signal Computation Engine
**Input:** docs/pios/40.4/ (full corpus), docs/pios/40.5/ (this execution)
**Date:** 2026-03-18

---

## Enforcement Rule

This document declares the strict layer separation maintained by Stream 40.5. The separation is not advisory — it is a governing constraint of the PiOS execution pipeline and the Program Intelligence discipline. Every boundary listed below is enforced by both this execution and the validate_signal_artifacts.py script.

---

## Layer Separation Declaration

### Layer 1 — Telemetry (Stream 40.4 — upstream)

| Boundary | Status |
|---|---|
| Telemetry is the sole authorized input to signal computation | Enforced |
| No 40.2 or 40.3 artifacts accessed directly in this stream | Enforced |
| No telemetry generated in this stream | Enforced — all telemetry sourced from docs/pios/40.4/ |
| No telemetry artifacts modified by this stream | Enforced |

**Telemetry artifacts consumed (read-only):**
- docs/pios/40.4/telemetry_surface_definition.md
- docs/pios/40.4/telemetry_schema.md
- docs/pios/40.4/structural_telemetry.md
- docs/pios/40.4/activity_telemetry.md
- docs/pios/40.4/delivery_telemetry.md
- docs/pios/40.4/telemetry_traceability_map.md

---

### Layer 2 — Signal (Stream 40.5 — this stream)

| Boundary | Status |
|---|---|
| Signals derived only from governed 40.4 telemetry inputs | Enforced |
| Only governed signal definitions used (CKR-006 through CKR-011, CKR-014, CKR-015) | Enforced |
| Every signal carries explicit temporal reference | Enforced — all 8 signals declare temporal reference |
| Every signal carries full telemetry traceability | Enforced — signal_traceability_map.md covers all 8 signals |
| No signal introduced without CKR governance authority | Enforced |
| No heuristic enrichment applied to signal computation | Enforced |
| No inferred or reconstructed input data used | Enforced |

**Forbidden content confirmed absent from all 40.5 artifacts:**

| Forbidden Type | Present in 40.5 Artifacts |
|---|---|
| Condition labels | No |
| Diagnosis output | No |
| Intelligence synthesis | No |
| Narrative generation | No |
| Interpretation text | No |
| Heuristic enrichment | No |
| Non-traceable signal values | No |
| Signals without temporal reference | No |

---

### Layer 3 — Condition (Stream 40.6 — downstream, not activated here)

| Boundary | Status |
|---|---|
| No condition activation performed in this stream | Enforced |
| No Stream 75.1 (Program Condition Model) activation | Not activated |
| Signal outputs are defined as inputs to Stream 40.6 — not consumed by this stream | Declared |

**State–Diagnosis Separation Principle (GC-07):** Not applicable in this stream. GC-07 governs Stream 40.6 (M-07). This stream (M-06) produces signals only — it does not activate conditions or diagnoses.

---

### Layer 4 — Diagnosis (Stream 40.6 — downstream, not activated here)

| Boundary | Status |
|---|---|
| No diagnosis activation performed in this stream | Enforced |
| No Stream 75.2 (Program Diagnosis Model) activation | Not activated |

---

### Layer 5 — Intelligence (Stream 40.7 — downstream, not activated here)

| Boundary | Status |
|---|---|
| No intelligence synthesis performed in this stream | Enforced |
| No intelligence output artifacts produced in this stream | Enforced |

---

## Input Access Audit

| Artifact Accessed | Access Type | Authorized |
|---|---|---|
| docs/pios/40.4/telemetry_surface_definition.md | read | yes — declared input |
| docs/pios/40.4/telemetry_schema.md | read | yes — declared input |
| docs/pios/40.4/structural_telemetry.md | read | yes — declared input |
| docs/pios/40.4/activity_telemetry.md | read | yes — declared input |
| docs/pios/40.4/delivery_telemetry.md | read | yes — declared input |
| docs/pios/40.4/telemetry_traceability_map.md | read | yes — declared input |
| docs/pios/40.2/ (any artifact) | direct access | not accessed — prohibited |
| docs/pios/40.3/ (any artifact) | direct access | not accessed — prohibited |

---

## Output Scope Audit

| Output Artifact | Scope Compliant | Notes |
|---|---|---|
| signal_input_matrix.md | yes | Maps telemetry to signal inputs only |
| signal_computation_specification.md | yes | Defines computation; no conditions, no diagnosis |
| signal_output_set.md | yes | Signal values and schema only; no interpretation |
| signal_traceability_map.md | yes | Traceability chain only |
| signal_validation_report.md | yes | Validation results only |
| signal_boundary_enforcement.md | yes | This document |

---

## Downstream Handoff Declaration

Signal outputs from this stream (SIG-001 through SIG-008) are produced as inputs to Stream 40.6 — PiOS Condition and Diagnosis Activation Layer (M-07). Stream 40.6 is the only authorized consumer of these signal outputs. No signal value produced here is to be used for condition activation, diagnosis, or intelligence synthesis within this stream.

**Signal outputs declared for downstream consumption:**

| Signal ID | Name | CKR | Downstream Consumer |
|---|---|---|---|
| SIG-001 | Coordination Pressure | CKR-006 | Stream 40.6 — M-07 |
| SIG-002 | Dependency Load | CKR-007 | Stream 40.6 — M-07 |
| SIG-003 | Change Concentration | CKR-008 | Stream 40.6 — M-07 |
| SIG-004 | Structural Volatility | CKR-009 | Stream 40.6 — M-07 |
| SIG-005 | Execution Throughput | CKR-010 | Stream 40.6 — M-07 |
| SIG-006 | Execution Stability | CKR-011 | Stream 40.6 — M-07 |
| SIG-007 | ESI | CKR-014 | Stream 40.6 — M-07 |
| SIG-008 | RAG | CKR-015 | Stream 40.6 — M-07 |
