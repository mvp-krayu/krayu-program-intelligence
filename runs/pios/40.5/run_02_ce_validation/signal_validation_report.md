# Signal Validation Report

**run_id:** run_02_ce_validation
**stream:** Stream 40.5 — PiOS Signal Computation Engine
**contract:** PIOS-40.5-RUN02-CE-VALIDATION-CONTRACT-v1
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Validation Rule

This report validates run_02_ce_validation against:
1. CE.3 I1 interface contract
2. CE.4 guard hook checks (GH-01, GH-02)
3. CE.5 executable validation surface
4. Computational invariance check vs. run_01 baseline
5. Standard completeness, traceability, boundary, and reproducibility checks

---

## Check 1 — Completeness

All expected run_02 artifacts must exist.

| Artifact | Expected Path | Status |
|---|---|---|
| signal_input_matrix.md | runs/pios/40.5/run_02_ce_validation/ | Present |
| signal_computation_specification.md | runs/pios/40.5/run_02_ce_validation/ | Present |
| signal_output_set.md | runs/pios/40.5/run_02_ce_validation/ | Present |
| signal_traceability_map.md | runs/pios/40.5/run_02_ce_validation/ | Present |
| signal_validation_report.md | runs/pios/40.5/run_02_ce_validation/ | Present |
| execution_manifest.md | runs/pios/40.5/run_02_ce_validation/ | Present |

**Result: PASS — 6/6 artifacts present**

---

## Check 2 — CE.3 I1 Interface Validation (GH-01)

| Check ID | Description | Result |
|---|---|---|
| IV1-01 | input_contract_id present | PASS |
| IV1-02 | run_id present, non-empty, no whitespace | PASS — run_02_ce_validation |
| IV1-03 | Input source = docs/pios/40.4/ only | PASS |
| IV1-04 | No ESI/RAG/SSZ/SSI/PES-ESI keys in input observations | PASS |
| IV1-05 | No DRIFT-001 (computeSSZ in pipeline) | PASS |
| IV1-06 | No 40.2 or 40.3 artifacts accessed directly | PASS |
| IV1-07 | No 41.x / 42.x paths referenced | PASS |
| IV1-08 | 40.4 artifacts parseable and present | PASS — 17 artifacts confirmed |

**GH-01 result: PASS**

---

## Check 3 — CE.4 GH-02 Handoff Check (40.5 → 40.6)

| Check ID | Description | Signal | Result |
|---|---|---|---|
| GH-02-C01 | run_id present in output | all | PASS |
| GH-02-C02 | All signal values ∈ valid range or null | SIG-001..008 | PASS |
| GH-02-C03 | PARTIAL flags present where value is UNDEFINED | SIG-001, 003, 005, 006 | PASS |
| GH-02-C04 | COMPLETE signals carry computed float value | SIG-002, SIG-004 | PASS |
| GH-02-C05 | No UNDEFINED value substituted with 0 or empty | SIG-003, SIG-006 | PASS |
| GH-02-C06 | Output is not consumed by 41.x / 42.x directly | — | PASS — run isolated |
| GH-02-C07 | run_id consistent across all output artifacts | — | PASS — run_02_ce_validation |

**GH-02 result: PASS (F2 states declared and flagged; no F1 conditions)**

---

## Check 4 — Signal Traceability Coverage

| Signal | CKR Ref | Min 1 Telemetry Input | 40.4 Artifact Cited | Traced |
|---|---|---|---|---|
| SIG-001 Coordination Pressure | CKR-006 | ST-012, ST-016, AT-005, AT-007 (4 inputs) | structural_telemetry.md, activity_telemetry.md | yes |
| SIG-002 Dependency Load | CKR-007 | ST-007, ST-012, ST-013, ST-014, ST-015 (5 inputs) | structural_telemetry.md | yes |
| SIG-003 Change Concentration | CKR-008 | AT-001, AT-002, AT-003 (3 inputs) | activity_telemetry.md | yes |
| SIG-004 Structural Volatility | CKR-009 | ST-006, ST-007, ST-009, ST-010, ST-011 (5 inputs) | structural_telemetry.md | yes |
| SIG-005 Execution Throughput | CKR-010 | AT-005, DT-001, DT-003, DT-007 (4 inputs) | activity_telemetry.md, delivery_telemetry.md | yes |
| SIG-006 Execution Stability | CKR-011 | AT-007, AT-009, DT-007, DT-008 (4 inputs) | activity_telemetry.md, delivery_telemetry.md | yes |
| SIG-007 ESI | CKR-014 | via SIG-002/005/006 | all three telemetry artifacts | yes |
| SIG-008 RAG | CKR-015 | via SIG-001/003/004 | all three telemetry artifacts | yes |

**Result: PASS — 8/8 signals fully traced**

---

## Check 5 — Computational Invariance (Parity vs. run_01 Baseline)

This check compares run_02 computed values against run_01 baseline values (source: docs/pios/40.5/signal_validation_report.md).

**SAME 40.4 INPUTS → MUST PRODUCE SAME OUTPUTS.**

| Signal | Baseline (run_01) | run_02 Computed | Parity |
|---|---|---|---|
| SIG-001 structural component | 0.875 | 0.875 | INVARIANT ✓ |
| SIG-002 ratio | 0.682 | 0.682 | INVARIANT ✓ |
| SIG-002 dependency edge count | 15 | 15 | INVARIANT ✓ |
| SIG-003 state | BLOCKED | BLOCKED | INVARIANT ✓ |
| SIG-004 total edge density | 1.273 | 1.273 | INVARIANT ✓ |
| SIG-004 containment density | 0.545 | 0.545 | INVARIANT ✓ |
| SIG-004 responsibility density | 0.364 | 0.364 | INVARIANT ✓ |
| SIG-004 module density | 0.455 | 0.455 | INVARIANT ✓ |
| SIG-006 state | BLOCKED | BLOCKED | INVARIANT ✓ |

**Computational invariance result: PASS — all computable values identical to run_01 baseline. No computation drift detected.**

---

## Check 6 — Boundary Compliance

| Prohibition | Status |
|---|---|
| No telemetry generation | PASS |
| No modification of 40.4 artifacts | PASS |
| No direct access to 40.2 or 40.3 artifacts | PASS |
| No condition activation | PASS |
| No diagnosis | PASS |
| No intelligence synthesis | PASS |
| No narrative generation | PASS |
| No interpretation | PASS |
| No heuristic enrichment | PASS |
| No inferred or reconstructed input data | PASS |
| No signal without temporal reference | PASS |
| No signal without evidence linkage | PASS |
| No UNDEFINED value substituted silently | PASS |
| No writes to docs/ | PASS — all output written to runs/pios/40.5/run_02_ce_validation/ |
| No writes to 41.x / 42.x / 51.x paths | PASS |
| No overwrite of run_01 artifacts | PASS |
| Demo paths untouched | PASS |

**Result: PASS — all boundary constraints satisfied**

---

## Check 7 — Contract Signal Naming Drift (INVARIANCE OBSERVATION)

The contract for run_02_ce_validation specifies signal names that do not match the canonical signal schema established in run_01 baseline. Per contract rule: DO NOT FIX — FLAG AND CLASSIFY.

**Drift observations:**

| Contract Label | Contract Signal ID | Canonical Schema ID | Canonical Name | Classification |
|---|---|---|---|---|
| Dependency Load | SIG-003 | SIG-002 | Dependency Load | SIGNAL-ID-DRIFT: contract uses SIG-003 for what canonical schema assigns to SIG-002 |
| Structural Density | SIG-004 | SIG-004 | Structural Volatility | SIGNAL-NAME-DRIFT: contract name "Structural Density" diverges from canonical "Structural Volatility"; density ratios ARE present in SIG-004 output |
| Visibility Deficit | (no ID assigned) | (not in SIG-001..008) | N/A | NEW-SIGNAL-REFERENCE: "Visibility Deficit" appears in contract but is absent from canonical SIG-001..008 schema; no computation rule defined in 40.4→40.5 derivation chain |
| Coordination Pressure | (no ID assigned) | SIG-001 | Coordination Pressure | MATCH — contract name matches canonical SIG-001 |

**Drift severity:**
- SIGNAL-ID-DRIFT (SIG-003 / Dependency Load): contract-to-schema ID offset by 1 position; does not affect computed values; affects signal ID reference integrity
- SIGNAL-NAME-DRIFT (SIG-004 / Structural Density vs. Structural Volatility): name divergence only; computed values (1.273, 0.545, 0.364, 0.455) are identical
- NEW-SIGNAL-REFERENCE (Visibility Deficit): signal referenced in contract does not exist in established schema; no computation rule available; cannot be produced without schema amendment

**Drift disposition:** FLAGGED — not fixed. Computation values are invariant. Schema alignment requires contract amendment or schema extension.

---

## Validation Summary

| Check | Result |
|---|---|
| 1. Completeness — 6/6 artifacts present | PASS |
| 2. CE.3 I1 interface validation (GH-01) | PASS |
| 3. CE.4 GH-02 handoff check | PASS (F2 states declared) |
| 4. Signal traceability coverage — 8/8 signals traced | PASS |
| 5. Computational invariance vs. run_01 baseline | PASS — all values invariant |
| 6. Boundary compliance — all prohibitions satisfied | PASS |
| 7. Contract signal naming drift | FLAGGED — 3 observations; no fix applied |

**Final validation status: PASS — all structural and computational checks pass. Three naming drift observations flagged for governance review.**

---

## Signal Coverage Status

### COMPLETE (full static output available)

| Signal | Output |
|---|---|
| SIG-002 Dependency Load | ratio: 0.682; edge count: 15 |
| SIG-004 Structural Volatility | 1.273 / 0.545 / 0.364 / 0.455 |

### PARTIAL (static component resolved; runtime component pending)

| Signal | Resolved Component | Pending |
|---|---|---|
| SIG-001 Coordination Pressure | 0.875 (structural) | AT-007 runtime |
| SIG-005 Execution Throughput | 1.125 artifacts/stage | DT-007 completion factor |
| SIG-007 ESI | SIG-002 component: 0.682 | SIG-005/SIG-006 |
| SIG-008 RAG | SIG-001: 0.875; SIG-004 ratios | SIG-003 blocked |

### BLOCKED (requires runtime telemetry not available from static 40.4)

| Signal | Blocking Reason |
|---|---|
| SIG-003 Change Concentration | AT-001, AT-002 time-series (push-to-main event counts) absent from static telemetry |
| SIG-006 Execution Stability | AT-007, AT-009, DT-007, DT-008 all event-based; require live pipeline execution |

**COMPLETE: 2 | PARTIAL: 4 | BLOCKED: 2**

Governance note: Evidence-First Principle (GC-06) governs this outcome. PARTIAL is the governed position. This result is parity-invariant with run_01 baseline.
