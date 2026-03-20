# Coverage Pressure Map
run_id: run_01_blueedge
stream: Stream 40.9 — PiOS Feedback and Continuous Improvement Layer
contract: PIOS-40.9-RUN01-CONTRACT-v1
comparison_run_set: run_00_baseline, run_01_blueedge
date: 2026-03-19

---

## Mapping Rule

This map describes the distribution of computed, partial, and blocked coverage states across delivered elements for each declared run. Output is descriptive only. No scoring, prioritization, or ranking is performed. Coverage counts are structural observations derived from the 40.8 delivery packet for each run.

---

## Section 1 — Coverage State Distribution Per Run

### run_00_baseline Coverage Distribution

Source: docs/pios/runs/run_01_pios_baseline/40.8/delivery_output_packet.md

| Element ID | Type | Coverage State |
|-----------|------|----------------|
| DIAG-001 | diagnosis | computed |
| DIAG-002 | diagnosis | computed |
| DIAG-003 | diagnosis | partial |
| DIAG-004 | diagnosis | partial |
| DIAG-005 | diagnosis | blocked |
| DIAG-006 | diagnosis | blocked |
| DIAG-007 | diagnosis | partial |
| DIAG-008 | diagnosis | partial |
| INTEL-001 | intelligence | computed |
| INTEL-002 | intelligence | partial |
| INTEL-003 | intelligence | partial |
| INTEL-004 | intelligence | partial |
| INTEL-005 | intelligence | blocked |

**run_00_baseline totals:**

| State | Count | Elements |
|-------|-------|---------|
| Computed | 3 | DIAG-001, DIAG-002, INTEL-001 |
| Partial | 7 | DIAG-003, DIAG-004, DIAG-007, DIAG-008, INTEL-002, INTEL-003, INTEL-004 |
| Blocked | 3 | DIAG-005, DIAG-006, INTEL-005 |
| **Total** | **13** | |

**Delivery packet coverage state: PARTIAL**

---

### run_01_blueedge Coverage Distribution

Source: docs/pios/40.8/delivery_output_packet.md

| Element ID | Type | Coverage State |
|-----------|------|----------------|
| DIAG-001 | diagnosis | blocked |
| DIAG-002 | diagnosis | blocked |
| DIAG-003 | diagnosis | blocked |
| DIAG-004 | diagnosis | blocked |
| DIAG-005 | diagnosis | blocked |
| DIAG-006 | diagnosis | computed |
| DIAG-007 | diagnosis | blocked |
| DIAG-008 | diagnosis | blocked |
| INTEL-001 | intelligence | computed |
| INTEL-002 | intelligence | blocked |

**run_01_blueedge totals:**

| State | Count | Elements |
|-------|-------|---------|
| Computed | 2 | DIAG-006, INTEL-001 |
| Partial | 0 | — |
| Blocked | 8 | DIAG-001..005/007/008, INTEL-002 |
| **Total** | **10** | |

**Delivery packet coverage state: PARTIAL**

---

## Section 2 — Coverage Pressure by Dimension (run_00_baseline)

### Structural Dimension (run_00)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| Dependency load characterization | DIAG-001, INTEL-001 | computed |
| Structural volatility characterization | DIAG-002, INTEL-001 | computed |
| Module surface / ARZ distribution | DIAG-002, INTEL-001 | computed |

**Structural dimension: FULLY RESOLVED — 0 partial, 0 blocked**

---

### Execution Dimension (run_00)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| Coordination pressure — structural | DIAG-003, INTEL-002 | partial |
| Coordination pressure — runtime | DIAG-003, INTEL-002 | pending (AT-005, AT-007) |
| Throughput — baseline constants | DIAG-004, INTEL-002 | partial |
| Throughput — completion-conditioned rate | DIAG-004, INTEL-002 | pending (DT-007, AT-006) |
| Execution stability | DIAG-006, INTEL-005 | blocked (DT-007, AT-007) |

**Execution dimension: PARTIAL with 1 blocked zone — 2 partial, 1 blocked**

---

### Activity / Change Dimension (run_00)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| Change concentration (time-series) | DIAG-005, INTEL-005 | blocked (AT-001, AT-002) |

**Activity dimension: FULLY BLOCKED — 0 partial, 1 blocked**

---

### Composite Intelligence Dimension (run_00)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| ESI — dependency load component | DIAG-007, INTEL-003 | partial |
| ESI — throughput component | DIAG-007, INTEL-003 | partial |
| ESI — execution stability component | DIAG-007, INTEL-003 | blocked via SIG-006 |
| RAG — structural volatility component | DIAG-008, INTEL-004 | partial |
| RAG — coordination pressure component | DIAG-008, INTEL-004 | partial |
| RAG — change concentration component | DIAG-008, INTEL-004 | blocked via SIG-003 |

**Composite dimension: PARTIAL with 2 blocked components — 4 partial, 0 fully blocked elements**

---

## Section 3 — Coverage Pressure by Dimension (run_01_blueedge)

### Sensor Integration Configuration Dimension (run_01)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| hasi_bridge.py sensor bridge state | DIAG-006, INTEL-001 | computed |

**Sensor configuration dimension: FULLY RESOLVED — 1 computed, 0 blocked**

---

### Backend Runtime Dimension (run_01)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| Backend service memory state | DIAG-001, INTEL-002 | blocked (INF-003 Prometheus, TMP-004) |
| Cache efficiency state | DIAG-002, INTEL-002 | blocked (INF-003 Prometheus, TMP-004) |
| Cache availability state | DIAG-003, INTEL-002 | blocked (INF-003 Prometheus, TMP-004) |
| Event pipeline activity state | DIAG-004, INTEL-002 | blocked (INF-003 Prometheus, TMP-004) |

**Backend runtime dimension: FULLY BLOCKED — 0 partial, 4 blocked diagnoses (4 dimensions of INTEL-002)**

---

### Fleet Activity Dimension (run_01)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| Fleet connection activity state | DIAG-005, INTEL-002 | blocked (fleet:* WebSocket) |

**Fleet dimension: FULLY BLOCKED — 0 partial, 1 blocked**

---

### Alert and Session Activity Dimension (run_01)

| Coverage Zone | Elements | Coverage State |
|--------------|---------|----------------|
| Alert activity state | DIAG-007, INTEL-002 | blocked (TMP-003 + TMP-010) |
| Driver session activity state | DIAG-008, INTEL-002 | blocked (TMP-010) |

**Alert/session dimension: FULLY BLOCKED — 0 partial, 2 blocked**

---

## Section 4 — Coverage Pressure Concentration Summary

### run_00_baseline

| Dimension | Computed | Partial | Blocked | Concentration |
|-----------|---------|---------|---------|---------------|
| Structural | 2 (DIAG-001, DIAG-002) | 0 | 0 | none |
| Execution | 0 | 2 (DIAG-003, DIAG-004) | 1 (DIAG-006) | HIGH |
| Activity/Change | 0 | 0 | 1 (DIAG-005) | HIGH — fully blocked |
| Composite ESI | 0 | 1 (DIAG-007) | — | MODERATE (1 blocked component) |
| Composite RAG | 0 | 1 (DIAG-008) | — | MODERATE (1 blocked component) |
| Intelligence structural | 1 (INTEL-001) | 0 | 0 | none |
| Intelligence execution | 0 | 1 (INTEL-002) | 0 | MODERATE |
| Intelligence composite | 0 | 2 (INTEL-003, INTEL-004) | 0 | MODERATE |
| Unknown space | 0 | 0 | 1 (INTEL-005) | HIGH — 2 dimensions |

**Note:** Concentration is a structural observation (count of unresolved elements per dimension). No scoring or ranking is implied.

---

### run_01_blueedge

| Dimension | Computed | Partial | Blocked | Concentration |
|-----------|---------|---------|---------|---------------|
| Sensor configuration | 2 (DIAG-006, INTEL-001) | 0 | 0 | none |
| Backend runtime | 0 | 0 | 4 (DIAG-001..004) | HIGH — fully blocked |
| Fleet activity | 0 | 0 | 1 (DIAG-005) | HIGH — fully blocked |
| Alert/session activity | 0 | 0 | 2 (DIAG-007, DIAG-008) | HIGH — fully blocked |
| Platform unknown space | 0 | 0 | 1 (INTEL-002) | HIGH — 7 dimensions |

**Note:** Concentration is a structural observation. No scoring or ranking is implied.

---

## Section 5 — Coverage by Temporal Classification

### run_00_baseline

| Temporal Class | Delivery Elements | Coverage State | Concentration |
|---------------|------------------|----------------|---------------|
| static | DIAG-001, DIAG-002, INTEL-001 | computed | none |
| event-based | DIAG-003, DIAG-004, DIAG-006, DIAG-007, INTEL-002, INTEL-003, INTEL-005 | partial or blocked | HIGH |
| time-series | DIAG-005, DIAG-008, INTEL-004, INTEL-005 | blocked or partially blocked | HIGH |
| static + event-based (mixed) | DIAG-003, INTEL-002 | partial | MODERATE |

### run_01_blueedge

| Temporal Class | Delivery Elements | Coverage State | Concentration |
|---------------|------------------|----------------|---------------|
| static (TMP-009) | DIAG-006, INTEL-001 | computed | none |
| runtime monitoring (INF-003) | DIAG-001..004, INTEL-002 | blocked | HIGH |
| runtime event (WebSocket/alerts/sessions) | DIAG-005, DIAG-007, DIAG-008, INTEL-002 | blocked | HIGH |

---

## Section 6 — Cross-Run Coverage Concentration Comparison

| Element ID | run_00_baseline state | run_01_blueedge state | Coverage state change |
|-----------|----------------------|----------------------|-----------------------|
| DIAG-001 | computed | blocked | downward |
| DIAG-002 | computed | blocked | downward |
| DIAG-003 | partial | blocked | downward |
| DIAG-004 | partial | blocked | downward |
| DIAG-005 | blocked | blocked | no change |
| DIAG-006 | blocked | computed | upward |
| DIAG-007 | partial | blocked | downward |
| DIAG-008 | partial | blocked | downward |
| INTEL-001 | computed | computed | no change |
| INTEL-002 | partial | blocked | downward |
| INTEL-003 | partial | absent | absent in run_01 |
| INTEL-004 | partial | absent | absent in run_01 |
| INTEL-005 | blocked | absent | absent in run_01 |

**Elements with no coverage state change across runs: 2 (DIAG-005 same state, INTEL-001 same state)**
**Elements with coverage state change across runs: 8 (CDR-001 through CDR-008 per cross_run_difference_register.md)**
**Elements absent in run_01: 3 (INTEL-003, INTEL-004, INTEL-005)**

**Note:** Coverage state changes are structural observations. No directional judgment, ranking, or interpretation is applied.
