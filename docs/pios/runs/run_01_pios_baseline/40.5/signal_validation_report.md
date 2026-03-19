# Signal Validation Report

**Stream:** 40.5 — PiOS Signal Computation Engine
**Input:** docs/pios/40.5/ (full corpus)
**Date:** 2026-03-18

---

## Validation Rule

This report validates the 40.5 signal artifacts against the contract requirements of PIOS-40.5-SIGNAL-CONTRACT. All 5 validation checks must pass for final status to be COMPLETE.

---

## Check 1 — Completeness

All expected 40.5 signal artifacts must exist.

| Artifact | Expected Path | Status |
|---|---|---|
| signal_input_matrix.md | docs/pios/40.5/ | Present |
| signal_computation_specification.md | docs/pios/40.5/ | Present |
| signal_output_set.md | docs/pios/40.5/ | Present |
| signal_traceability_map.md | docs/pios/40.5/ | Present |
| signal_validation_report.md | docs/pios/40.5/ | Present |
| signal_boundary_enforcement.md | docs/pios/40.5/ | Present |

**Result: PASS — 6/6 artifacts present**

---

## Check 2 — Signal Traceability Coverage

Every signal must trace to: (a) a CKR-governed definition, (b) at least one 40.4 telemetry metric, (c) the 40.4 artifact in which that metric is defined.

| Signal | CKR Ref | Min 1 Telemetry Input | 40.4 Artifact Cited | Traced |
|---|---|---|---|---|
| SIG-001 Coordination Pressure | CKR-006 | ST-016, ST-012, AT-005, AT-007 (4 inputs) | structural_telemetry.md, activity_telemetry.md | yes |
| SIG-002 Dependency Load | CKR-007 | ST-007, ST-010, ST-012, ST-013, ST-014, ST-015 (6 inputs) | structural_telemetry.md | yes |
| SIG-003 Change Concentration | CKR-008 | AT-001, AT-002, AT-003 (3 inputs) | activity_telemetry.md | yes |
| SIG-004 Structural Volatility | CKR-009 | ST-006, ST-007, ST-009, ST-010, ST-011, ST-022 (6 inputs) | structural_telemetry.md | yes |
| SIG-005 Execution Throughput | CKR-010 | AT-005, AT-006, DT-001, DT-003, DT-007 (5 inputs) | activity_telemetry.md, delivery_telemetry.md | yes |
| SIG-006 Execution Stability | CKR-011 | AT-007, AT-009, DT-007, DT-008 (4 inputs) | activity_telemetry.md, delivery_telemetry.md | yes |
| SIG-007 ESI | CKR-014 | 14 inputs (via SIG-006, SIG-005, SIG-002) | all three telemetry artifacts | yes |
| SIG-008 RAG | CKR-015 | 13 inputs (via SIG-003, SIG-001, SIG-004) | all three telemetry artifacts | yes |

**Result: PASS — 8/8 signals fully traced**

---

## Check 3 — Temporal Reference Coverage

Every signal must carry a declared temporal reference (static | event-based | time-series).

| Signal | Declared Temporal Reference | Valid Value |
|---|---|---|
| SIG-001 Coordination Pressure | static + event-based | yes |
| SIG-002 Dependency Load | static | yes |
| SIG-003 Change Concentration | time-series | yes |
| SIG-004 Structural Volatility | static | yes |
| SIG-005 Execution Throughput | event-based | yes |
| SIG-006 Execution Stability | event-based | yes |
| SIG-007 ESI | event-based | yes |
| SIG-008 RAG | time-series | yes |

**Result: PASS — 8/8 signals carry valid temporal reference**

---

## Check 4 — Boundary Compliance

All prohibited content must be absent from all 40.5 artifacts.

| Prohibition | Status |
|---|---|
| No telemetry generation | Compliant — no telemetry produced |
| No modification of 40.4 artifacts | Compliant — 40.4 artifacts read-only |
| No direct access to 40.2 artifacts | Compliant — no 40.2 access |
| No direct access to 40.3 artifacts | Compliant — no 40.3 access |
| No condition activation | Compliant — no condition labels produced |
| No diagnosis | Compliant — no diagnosis output produced |
| No intelligence synthesis | Compliant — no intelligence artifacts produced |
| No narrative generation | Compliant — no narrative text in signal outputs |
| No interpretation | Compliant — no interpretive content in any artifact |
| No heuristic enrichment | Compliant — all values derived from telemetry fields only |
| No signal without temporal reference | Compliant — all 8 signals declare temporal reference |
| No signal without evidence linkage | Compliant — all 8 signals trace to 40.4 telemetry metrics |
| No inferred or reconstructed input data | Compliant — all input values sourced from explicit 40.4 metric fields |

**Result: PASS — all boundary constraints satisfied**

---

## Check 5 — Deterministic Reproducibility

Identical 40.4 telemetry inputs must yield identical signal definitions, input mappings, and computable output values.

| Determinism Check | Status |
|---|---|
| Signal input matrix derived by explicit field mapping — no heuristics | yes |
| Computation specification references fixed telemetry field IDs — no variable selection | yes |
| Static signal computations use arithmetic on declared telemetry values — deterministic | yes |
| SIG-002 output (0.682) reproducible: 15÷22 = 0.682 from fixed inputs | confirmed |
| SIG-004 outputs reproducible: 28÷22=1.273, 12÷22=0.545, 8÷22=0.364, 10÷22=0.455 from fixed inputs | confirmed |
| SIG-001 structural ratio reproducible: 7÷8=0.875 from fixed inputs | confirmed |
| Runtime-dependent signals (SIG-003, SIG-006) produce identical schema for identical inputs | yes |
| 40.4 input artifacts are unmodified — same content will always yield same output | confirmed |

**Result: PASS — deterministic reproducibility confirmed**

---

## Validation Summary

| Check | Result |
|---|---|
| 1. Completeness — all 6 artifacts present | PASS |
| 2. Signal traceability coverage — 8/8 signals fully traced | PASS |
| 3. Temporal reference coverage — 8/8 signals have valid temporal reference | PASS |
| 4. Boundary compliance — all prohibitions satisfied | PASS |
| 5. Deterministic reproducibility | PASS |

**Final validation status: PASS — all 5 checks pass**

---

## Signal Coverage Status

### Computed (full output available from static telemetry)

| Signal | CKR | Output |
|---|---|---|
| SIG-002 Dependency Load | CKR-007 | Ratio: 0.682; dependency edge count: 15 |
| SIG-004 Structural Volatility | CKR-009 | Edge/node: 1.273; containment: 0.545; responsibility: 0.364; module: 0.455 |

### Partial (static component resolved; runtime component pending)

| Signal | CKR | Resolved Component | Pending Component |
|---|---|---|---|
| SIG-001 Coordination Pressure | CKR-006 | Structural ratio: 0.875 | Runtime: AT-005, AT-007 (event-based, per pipeline run) |
| SIG-005 Execution Throughput | CKR-010 | Per-run constants: 8 stages, 9 artifacts | Completion factor: DT-007 (event-based, per run) |
| SIG-007 ESI | CKR-014 | SIG-002 component: 0.682 | SIG-005 completion factor, SIG-006 (both event-based) |
| SIG-008 RAG | CKR-015 | SIG-004 ratios; SIG-001 structural: 0.875 | SIG-003 time-series accumulation |

### Blocked (requires runtime telemetry not available from static 40.4 inputs)

| Signal | CKR | Blocking Reason |
|---|---|---|
| SIG-003 Change Concentration | CKR-008 | Requires AT-001 and AT-002 (time-series: push-to-main event counts over successive intervals — GitHub-dependent, not present in static telemetry) |
| SIG-006 Execution Stability | CKR-011 | Requires DT-007 (pipeline run completion status — event-based, requires live pipeline execution) and AT-007 (validation gate count per run — event-based) |

**Computed: 2 | Partial: 4 | Blocked: 2**

**Governance note:** Evidence-First Principle (GC-06) governs this outcome. Missing runtime telemetry blocks full signal computation. No values fabricated or inferred. Final execution status: PARTIAL.
