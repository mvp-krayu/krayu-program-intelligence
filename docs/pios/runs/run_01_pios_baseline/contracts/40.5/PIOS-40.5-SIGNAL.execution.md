# Execution Receipt — Stream 40.5 Signal Computation

**Contract:** PIOS-40.5-SIGNAL-CONTRACT
**Stream:** 40.5 — PiOS Signal Computation Engine
**Execution date:** 2026-03-18

---

## Input Boundary Result

**Status: COMPLETE — all 6 required inputs present**

| Input Artifact | Path | Status |
|---|---|---|
| telemetry_surface_definition.md | docs/pios/40.4/ | Present |
| telemetry_schema.md | docs/pios/40.4/ | Present |
| structural_telemetry.md | docs/pios/40.4/ | Present |
| activity_telemetry.md | docs/pios/40.4/ | Present |
| delivery_telemetry.md | docs/pios/40.4/ | Present |
| telemetry_traceability_map.md | docs/pios/40.4/ | Present |

---

## Directories Created

| Directory | Action |
|---|---|
| docs/pios/40.5/ | Created (new) |
| scripts/pios/40.5/ | Created (new) |
| docs/pios/contracts/40.5/ | Created (new) |

---

## Helper Scripts Created

| Script | Status |
|---|---|
| scripts/pios/40.5/build_signal_artifacts.py | Created |
| scripts/pios/40.5/validate_signal_artifacts.py | Created |

---

## Generated Artifacts

| Artifact | Path | Status |
|---|---|---|
| signal_input_matrix.md | docs/pios/40.5/ | Final |
| signal_computation_specification.md | docs/pios/40.5/ | Final |
| signal_output_set.md | docs/pios/40.5/ | Final |
| signal_traceability_map.md | docs/pios/40.5/ | Final |
| signal_validation_report.md | docs/pios/40.5/ | Final |
| signal_boundary_enforcement.md | docs/pios/40.5/ | Final |
| build_signal_artifacts.py | scripts/pios/40.5/ | Final |
| validate_signal_artifacts.py | scripts/pios/40.5/ | Final |
| PIOS-40.5-SIGNAL-CONTRACT.md | docs/pios/contracts/40.5/ | Final |
| PIOS-40.5-SIGNAL.execution.md | docs/pios/contracts/40.5/ | Final |

---

## Signal Input Mapping Completion

| Signal | CKR | Telemetry Inputs Mapped | Static Computable |
|---|---|---|---|
| SIG-001 Coordination Pressure | CKR-006 | ST-016, ST-012, AT-005, AT-007 | partial (structural ratio: 0.875) |
| SIG-002 Dependency Load | CKR-007 | ST-007, ST-010, ST-012, ST-013, ST-014, ST-015 | yes (ratio: 0.682; edges: 15) |
| SIG-003 Change Concentration | CKR-008 | AT-001, AT-002, AT-003 | no |
| SIG-004 Structural Volatility | CKR-009 | ST-006, ST-007, ST-009, ST-010, ST-011, ST-022 | yes (ratios: 1.273/0.545/0.364/0.455) |
| SIG-005 Execution Throughput | CKR-010 | AT-005, AT-006, DT-001, DT-003, DT-007 | partial (constants: 8 stages, 9 artifacts/run) |
| SIG-006 Execution Stability | CKR-011 | AT-007, AT-009, DT-007, DT-008 | no |
| SIG-007 ESI | CKR-014 | 14 inputs (via SIG-002, SIG-005, SIG-006) | partial (SIG-002 component) |
| SIG-008 RAG | CKR-015 | 13 inputs (via SIG-001, SIG-003, SIG-004) | partial (SIG-004 + static SIG-001) |

**Total telemetry inputs mapped: 26 distinct metrics (of 40 total)**
**Signal input mapping status: COMPLETE**

---

## Signal Computation Completion

| Signal | Class | Temporal | Computation State |
|---|---|---|---|
| SIG-001 | atomic | static + event-based | partial — structural: 0.875 |
| SIG-002 | atomic | static | complete — ratio: 0.682 |
| SIG-003 | atomic | time-series | pending — requires live telemetry |
| SIG-004 | atomic | static | complete — ratios: 1.273/0.545/0.364/0.455 |
| SIG-005 | atomic | event-based | partial — constants defined |
| SIG-006 | atomic | event-based | pending — requires live telemetry |
| SIG-007 | composite | event-based | partial — SIG-002 component resolved |
| SIG-008 | composite | time-series | partial — SIG-004 + static SIG-001 resolved |

**Signals fully computed from static telemetry: 2 (SIG-002, SIG-004)**
**Signals with partial static output: 4 (SIG-001, SIG-005, SIG-007, SIG-008)**
**Signals pending runtime telemetry: 2 (SIG-003, SIG-006)**

---

## Validation Results

| Check | Result |
|---|---|
| 1. Completeness — all 6 signal artifacts present | PASS |
| 2. Signal traceability coverage — 8/8 signals fully traced | PASS |
| 3. Temporal reference coverage — 8/8 signals carry valid temporal reference | PASS |
| 4. Boundary compliance — all prohibitions satisfied | PASS |
| 5. Deterministic reproducibility — static computations confirmed | PASS |

---

## Boundary Compliance Confirmation

| Constraint | Status |
|---|---|
| No telemetry generated | Confirmed |
| No 40.4 artifacts modified | Confirmed |
| No 40.2 artifacts accessed | Confirmed |
| No 40.3 artifacts accessed | Confirmed |
| No condition activation | Confirmed |
| No diagnosis | Confirmed |
| No intelligence synthesis | Confirmed |
| No narrative | Confirmed |
| No interpretation | Confirmed |
| No heuristic enrichment | Confirmed |

---

## Deterministic Reproducibility Status

All static signal computations are deterministic. Identical 40.4 telemetry inputs yield identical output values. Confirmed computed values:

| Signal | Value | Formula |
|---|---|---|
| SIG-002 dependency edge count | 15 | 7+3+2+3 |
| SIG-002 dependency load ratio | 0.682 | 15÷22 |
| SIG-001 structural coordination ratio | 0.875 | 7÷8 |
| SIG-004 edge-to-node ratio | 1.273 | 28÷22 |
| SIG-004 containment density ratio | 0.545 | 12÷22 |
| SIG-004 responsibility distribution | 0.364 | 8÷22 |
| SIG-004 module surface ratio | 0.455 | 10÷22 |

**Deterministic reproducibility status: CONFIRMED**

---

## Execution Outcome Adjustment

| Field | Value |
|---|---|
| Previous status | COMPLETE |
| Corrected status | PARTIAL |
| Reason | Missing runtime telemetry (GitHub-dependent): AT-001 and AT-002 (push-to-main time-series, not present in static 40.4 artifacts) block SIG-003 (Change Concentration). DT-007 and AT-007 (event-based per pipeline run, not present in static 40.4 artifacts) block SIG-006 (Execution Stability). Evidence-First Principle (GC-06) prohibits fabricating or inferring these values. |
| Blocked signals | SIG-003 (Change Concentration — CKR-008), SIG-006 (Execution Stability — CKR-011) |
| Partial signals | SIG-001, SIG-005, SIG-007, SIG-008 |
| Computed signals | SIG-002 (Dependency Load), SIG-004 (Structural Volatility) |

---

## Final Status: PARTIAL
