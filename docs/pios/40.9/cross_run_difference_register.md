# Cross-Run Difference Register
run_id: run_01_blueedge
stream: Stream 40.9 — PiOS Feedback and Continuous Improvement Layer
contract: PIOS-40.9-RUN01-CONTRACT-v1
comparison_run_set: run_00_baseline, run_01_blueedge
date: 2026-03-19

---

## Register Rule

This register records observed differences between declared runs in the comparison run set. Differences are registered descriptively only. No explanation, normalization, causal analysis, prioritization, or judgment is applied. Per-run raw representation is preserved and not collapsed into synthesized or normalized form. Identity matching is established exclusively by delivery element ID as declared in the 40.8 delivery boundary.

---

## Identity Matching Basis

| Identity Anchor | Source |
|----------------|--------|
| DIAG-001 through DIAG-008 | Delivery element IDs as declared in 40.8 delivery_output_packet.md for each run |
| INTEL-001 through INTEL-002 | Intelligence element IDs as declared in 40.8 delivery_output_packet.md for each run |
| INTEL-003, INTEL-004, INTEL-005 | Present in run_00_baseline delivery only — no matching element ID in run_01_blueedge 40.8 delivery |

---

## Section 1 — Coverage State Differences

Elements where the coverage_state classification differs between declared runs.

---

### CDR-001 — DIAG-001 Coverage State Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-001 | DIAG-001 |
| Coverage state | computed | blocked |
| Temporal type | static | runtime monitoring |
| run_00 delivered value | ELEVATED_DEPENDENCY_LOAD; dependency load ratio: 0.682; edge count: 15; node count: 22 | — |
| run_01 blocking declaration | — | blocked (INF-003 Prometheus scrape absent; TMP-004) |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §DIAG-001 | docs/pios/40.8/delivery_output_packet.md §DIAG-001 |

---

### CDR-002 — DIAG-002 Coverage State Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-002 | DIAG-002 |
| Coverage state | computed | blocked |
| Temporal type | static | runtime monitoring |
| run_00 delivered value | ELEVATED_STRUCTURAL_COUPLING; edge-to-node: 1.273; containment: 0.545; responsibility: 0.364; module surface: 0.455 | — |
| run_01 blocking declaration | — | blocked (INF-003 Prometheus scrape absent; TMP-004) |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §DIAG-002 | docs/pios/40.8/delivery_output_packet.md §DIAG-002 |

---

### CDR-003 — DIAG-003 Coverage State Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-003 | DIAG-003 |
| Coverage state | partial | blocked |
| Temporal type | static + event-based | runtime monitoring |
| run_00 delivered value | NEAR_MAXIMAL coordination structural; structural coordination ratio: 0.875 (7 of 8 stages); runtime events pending (AT-005, AT-007) | — |
| run_01 blocking declaration | — | blocked (INF-003 Prometheus scrape absent; TMP-004) |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §DIAG-003 | docs/pios/40.8/delivery_output_packet.md §DIAG-003 |

---

### CDR-004 — DIAG-004 Coverage State Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-004 | DIAG-004 |
| Coverage state | partial | blocked |
| Temporal type | event-based | runtime monitoring |
| run_00 delivered value | BASELINE_THROUGHPUT_PROFILE; 8 stages/run; 9 artifacts/run; completion factor pending (DT-007, AT-006) | — |
| run_01 blocking declaration | — | blocked (INF-003 Prometheus scrape absent; TMP-004) |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §DIAG-004 | docs/pios/40.8/delivery_output_packet.md §DIAG-004 |

---

### CDR-005 — DIAG-006 Coverage State Difference (State Reversal)

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-006 | DIAG-006 |
| Coverage state | blocked | computed |
| Temporal type | event-based | static (TMP-009) |
| run_00 blocking declaration | blocked; SIG-006 unavailable; DT-007, AT-007 absent (requires live pipeline execution) | — |
| run_01 delivered value | — | SENSOR_BRIDGE_CONFIGURED; SA-001 (hasi_bridge.py); 0.333 rec/sec; source TMP-009 |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §DIAG-006 | docs/pios/40.8/delivery_output_packet.md §DIAG-006 |

---

### CDR-006 — DIAG-007 Coverage State Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-007 | DIAG-007 |
| Coverage state | partial | blocked |
| Temporal type | event-based | runtime event |
| run_00 delivered value | PARTIAL_EXECUTION_HEALTH_PROFILE; dependency component: 0.682; throughput constants: 8 stages, 9 artifacts/run; stability component blocked via SIG-006 | — |
| run_01 blocking declaration | — | blocked; TMP-003 alert events + TMP-010 domain events absent |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §DIAG-007 | docs/pios/40.8/delivery_output_packet.md §DIAG-007 |

---

### CDR-007 — DIAG-008 Coverage State Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-008 | DIAG-008 |
| Coverage state | partial | blocked |
| Temporal type | time-series | runtime event |
| run_00 delivered value | PARTIAL_RISK_PROFILE; structural volatility: 1.273/0.545/0.364/0.455; structural coordination: 0.875; change concentration component blocked via SIG-003 | — |
| run_01 blocking declaration | — | blocked; TMP-010 driver session lifecycle events absent |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §DIAG-008 | docs/pios/40.8/delivery_output_packet.md §DIAG-008 |

---

### CDR-008 — INTEL-002 Coverage State Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | INTEL-002 | INTEL-002 |
| Coverage state | partial | blocked |
| Temporal type | static + event-based | runtime (multiple dependency types) |
| run_00 delivered value | Execution Pipeline Readiness Profile; 2 confirmed claims; 2 unknown dimensions; coordination ratio: 0.875; throughput constants: 8 stages, 9 artifacts/run | — |
| run_01 blocking declaration | — | Platform Runtime Unknown Space Declaration; 7 unknown dimensions; INF-003 Prometheus + fleet:* + TMP-003/010 dependencies absent |
| Source | docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md §INTEL-002 | docs/pios/40.8/delivery_output_packet.md §INTEL-002 |

---

## Section 2 — Elements With No Coverage State Difference

| Element ID | run_00_baseline | run_01_blueedge | Observation |
|-----------|----------------|----------------|-------------|
| DIAG-005 | blocked | blocked | Same coverage state; blocking chains differ (see Section 3) |
| INTEL-001 | computed | computed | Same coverage state; dependency chains differ (see Section 3) |

---

## Section 3 — Blocking Chain and Dependency Chain Differences

Elements where coverage state is the same across declared runs but blocking chain or dependency chain representation differs.

---

### CDR-009 — DIAG-005 Blocking Chain Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | DIAG-005 | DIAG-005 |
| Coverage state | blocked | blocked |
| run_00 blocking chain | SIG-003 (CKR-008) → AT-001 + AT-002 (GitHub push-to-main time-series; absent from static 40.4 inputs) | — |
| run_01 blocking chain | — | fleet:* WebSocket rooms (BM-062) — no active client connections |
| Blocking chain match | NOT ESTABLISHED | |

---

### CDR-010 — INTEL-001 Dependency Chain Difference

| Field | run_00_baseline | run_01_blueedge |
|-------|----------------|----------------|
| Element ID | INTEL-001 | INTEL-001 |
| Coverage state | computed | computed |
| run_00 dependency chain | INTEL-001 → DIAG-001+002 → COND-001+002 → SIG-002+004 → structural_telemetry.md (static graph analysis) | — |
| run_01 dependency chain | — | INTEL-001 → DIAG-006 → COND-006 → SIG-006 → TMP-009 (CEU-10 :: hasi_bridge.py DEFAULT_CONFIG) |
| Dependency chain match | NOT ESTABLISHED | |

---

## Section 4 — Delivery Element Count Difference

| Element ID | run_00_baseline | run_01_blueedge | Difference |
|-----------|----------------|----------------|------------|
| INTEL-003 | present (partial — Composite Execution Health State) | absent | Element present in run_00 only |
| INTEL-004 | present (partial — Risk Profile State) | absent | Element present in run_00 only |
| INTEL-005 | present (blocked — Unknown Space Declaration, 2 dims) | absent | Element present in run_00 only |

**Element count:** run_00_baseline: 13 delivery elements (8 DIAG + 5 INTEL) | run_01_blueedge: 10 delivery elements (8 DIAG + 2 INTEL)
**Element count difference: 3** (INTEL-003, INTEL-004, INTEL-005 absent from run_01_blueedge delivery boundary)

**Cross-run comparison declaration for absent elements:** Cross-run comparison not established for INTEL-003, INTEL-004, INTEL-005 — these elements have no matching identity in the run_01_blueedge 40.8 delivery boundary.

---

## Section 5 — Traceability Structure Differences

| Aspect | run_00_baseline | run_01_blueedge |
|--------|----------------|----------------|
| Delivery element count | 13 (8 DIAG + 5 INTEL) | 10 (8 DIAG + 2 INTEL) |
| Intelligence count | 5 | 2 |
| Unknown space carrier | INTEL-005 (2 dimensions) | INTEL-002 (7 dimensions) |
| Computed diagnosis count | 2 (DIAG-001, DIAG-002) | 1 (DIAG-006) |
| Blocked diagnosis count | 2 (DIAG-005, DIAG-006) | 7 (DIAG-001..005/007/008) |
| Partial diagnosis count | 4 (DIAG-003/004/007/008) | 0 |
| Computed intelligence count | 1 (INTEL-001) | 1 (INTEL-001) |
| Partial intelligence count | 3 (INTEL-002/003/004) | 0 |
| Blocked intelligence count | 1 (INTEL-005) | 1 (INTEL-002) |
| delivery_structure_definition.md present | no (contract: PIOS-40.8-DELIVERY-CONTRACT) | yes (contract: PIOS-40.8-RUN01-CONTRACT-v1) |

---

## Cross-Run Difference Summary

| Register ID | Type | Elements | Runs Compared |
|-------------|------|----------|---------------|
| CDR-001 | coverage state: computed → blocked | DIAG-001 | run_00 vs run_01 |
| CDR-002 | coverage state: computed → blocked | DIAG-002 | run_00 vs run_01 |
| CDR-003 | coverage state: partial → blocked | DIAG-003 | run_00 vs run_01 |
| CDR-004 | coverage state: partial → blocked | DIAG-004 | run_00 vs run_01 |
| CDR-005 | coverage state: blocked → computed (reversal) | DIAG-006 | run_00 vs run_01 |
| CDR-006 | coverage state: partial → blocked | DIAG-007 | run_00 vs run_01 |
| CDR-007 | coverage state: partial → blocked | DIAG-008 | run_00 vs run_01 |
| CDR-008 | coverage state: partial → blocked | INTEL-002 | run_00 vs run_01 |
| CDR-009 | blocking chain difference (same state: blocked) | DIAG-005 | run_00 vs run_01 |
| CDR-010 | dependency chain difference (same state: computed) | INTEL-001 | run_00 vs run_01 |
| — | element count: INTEL-003 absent in run_01 | INTEL-003 | run_00 only |
| — | element count: INTEL-004 absent in run_01 | INTEL-004 | run_00 only |
| — | element count: INTEL-005 absent in run_01 | INTEL-005 | run_00 only |

**Total coverage state differences (CDR-001 through CDR-008): 8**
**Total chain representation differences (CDR-009, CDR-010): 2**
**Total element count differences: 3 (INTEL-003, INTEL-004, INTEL-005)**
**No differences explained causally. No differences interpreted as defects. No differences normalized. Per-run raw representation preserved.**
