# Execution Manifest

**run_id:** run_02_ce_validation
**stream:** Stream 40.5 — PiOS Signal Computation Engine
**contract:** PIOS-40.5-RUN02-CE-VALIDATION-CONTRACT-v1
**date:** 2026-04-01
**branch:** feature/pios-core

---

## Execution Identity

| Field | Value |
|---|---|
| Stream | 40.5 |
| Run ID | run_02_ce_validation |
| Contract type | Core Execution — CE-Aligned Validation Run |
| Execution mode | Claude Code — EXECUTION ONLY |
| Pre-flight result | PASS (untracked paths noted, no tracked dirty state) |
| Pre-flight timestamp | 2026-04-01T13:25:12Z |
| CWD | /Users/khorrix/Projects/k-pi-core |
| Branch | feature/pios-core |
| Output root | runs/pios/40.5/run_02_ce_validation/ |

---

## Input Boundary

| Input | Path | Access Type | Authorized |
|---|---|---|---|
| Activity Telemetry | docs/pios/40.4/activity_telemetry.md | read | yes |
| Delivery Telemetry | docs/pios/40.4/delivery_telemetry.md | read | yes |
| Structural Telemetry | docs/pios/40.4/structural_telemetry.md | read | yes |
| Dependency Telemetry | docs/pios/40.4/dependency_telemetry.md | read | yes |
| Telemetry Dimension Catalog | docs/pios/40.4/telemetry_dimension_catalog.md | read | yes |
| Telemetry To PEG Mapping | docs/pios/40.4/telemetry_to_peg_mapping.md | read | yes |
| All other 40.4 artifacts | docs/pios/40.4/*.md | read (reference) | yes |
| Any 40.2 / 40.3 artifact | docs/pios/40.2/, 40.3/ | not accessed | — |
| Any 41.x / 42.x / 51.x artifact | docs/pios/41.x–51.x/ | not accessed | — |

---

## Enforcement Applied

| CE Rule | Applied |
|---|---|
| CE.3 I1 interface validation | APPLIED — GH-01 validated; all I1 checks PASS |
| CE.4 GH-01 (pre-execution gate) | PASS |
| CE.4 GH-02 (40.5 → 40.6 handoff gate) | PASS (F2 states declared) |
| CE.5 executable validation surface | APPLIED — validation report produced |
| CE.5 failure handling (F2 for PARTIAL) | APPLIED — PARTIAL signals carry UNDEFINED flags |
| Global Execution Safety contract | COMPLIANT — demo untouched, docs untouched, run isolated |

---

## Work Packages Executed

| WP | Title | Status |
|---|---|---|
| WP1 | Signal Input Matrix | COMPLETE |
| WP2 | Signal Computation Specification | COMPLETE |
| WP3 | Signal Output Set | COMPLETE |
| WP4 | Signal Traceability Map | COMPLETE |
| WP5 | Validation Report | COMPLETE |
| WP6 | Execution Manifest | COMPLETE |

---

## Artifacts Produced

| Artifact | Path |
|---|---|
| Signal Input Matrix | runs/pios/40.5/run_02_ce_validation/signal_input_matrix.md |
| Signal Computation Specification | runs/pios/40.5/run_02_ce_validation/signal_computation_specification.md |
| Signal Output Set | runs/pios/40.5/run_02_ce_validation/signal_output_set.md |
| Signal Traceability Map | runs/pios/40.5/run_02_ce_validation/signal_traceability_map.md |
| Signal Validation Report | runs/pios/40.5/run_02_ce_validation/signal_validation_report.md |
| Execution Manifest | runs/pios/40.5/run_02_ce_validation/execution_manifest.md |

---

## Computational Invariance Summary

| Signal | run_01 baseline | run_02 computed | Invariant |
|---|---|---|---|
| SIG-001 structural ratio | 0.875 | 0.875 | YES |
| SIG-002 ratio | 0.682 | 0.682 | YES |
| SIG-002 edge count | 15 | 15 | YES |
| SIG-003 state | BLOCKED | BLOCKED | YES |
| SIG-004 total edge density | 1.273 | 1.273 | YES |
| SIG-004 containment density | 0.545 | 0.545 | YES |
| SIG-004 responsibility density | 0.364 | 0.364 | YES |
| SIG-004 module density | 0.455 | 0.455 | YES |
| SIG-006 state | BLOCKED | BLOCKED | YES |

**Parity verdict: INVARIANT — no computation drift detected across any static signal component.**

---

## Contract Signal Drift (Flagged, Not Fixed)

| Observation | Type | Disposition |
|---|---|---|
| Contract SIG-003 = "Dependency Load" — canonical schema has Dependency Load at SIG-002 | SIGNAL-ID-DRIFT | FLAGGED — no fix applied |
| Contract SIG-004 = "Structural Density" — canonical schema names SIG-004 "Structural Volatility" | SIGNAL-NAME-DRIFT | FLAGGED — computed values identical |
| Contract references "Visibility Deficit" — absent from canonical SIG-001..008 schema | NEW-SIGNAL-REFERENCE | FLAGGED — no computation rule available |

---

## Scope Adherence

| Check | Result |
|---|---|
| All output written to runs/pios/40.5/run_02_ce_validation/ | PASS |
| docs/ not written | PASS |
| run_01 artifacts not overwritten | PASS |
| Demo (41.x / 42.x / 51.9) untouched | PASS |
| 40.4 inputs not modified | PASS |
| CE artifacts not modified | PASS |
| No other files created | PASS |

---

## Final Execution Status

| Dimension | Status |
|---|---|
| Pre-flight | PASS |
| I1 validation (GH-01) | PASS |
| GH-02 handoff gate | PASS |
| Signal computation | PARTIAL (governed) |
| Computational invariance | INVARIANT ✓ |
| Boundary compliance | PASS |
| Demo safety | PASS |
| Contract drift | FLAGGED (3 observations, no fix) |

**EXECUTION STATUS: PASS**
