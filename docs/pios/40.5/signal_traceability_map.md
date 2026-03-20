# Signal Traceability Map
run_id: run_01_blueedge
stream: Stream 40.5 — PiOS Signal Computation Engine
contract: PIOS-40.5-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.4-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Traceability Rule

Every signal in this stream must trace to:
1. A governed entity reference (BM- or entity from docs/pios/40.3/entity_catalog.md)
2. One or more VAR_ input variables explicitly declared in signal_input_matrix.md
3. The DIM- dimension each variable maps to (docs/pios/40.4/telemetry_dimension_catalog.md)
4. The 40.4 artifact in which that dimension is defined
5. A temporal reference (from docs/pios/40.4/temporal_telemetry_series.md)

No signal is valid without complete traceability. No traceability entry may reference 40.2 or 40.3 artifacts directly.

---

## SIG-001 — Backend Process Heap Usage Traceability

| Signal ID | Entity Ref | Variable | DIM Ref | 40.4 Artifact | Temporal |
|-----------|-----------|---------|---------|--------------|---------|
| SIG-001 | CE-001/BM-061 (N-10) | VAR_SYS_001 | DIM-PR-001 | telemetry_dimension_catalog.md | TMP-004 (10s scrape) |

**Entity governance chain:** SIG-001 → CE-001/BM-061 → N-10 (40.3 entity_catalog.md via entity_telemetry.md)

---

## SIG-002 — Cache Hit Efficiency Traceability

| Signal ID | Entity Ref | Variable | DIM Ref | 40.4 Artifact | Temporal |
|-----------|-----------|---------|---------|--------------|---------|
| SIG-002 | CE-001/BM-061+INF-002 | VAR_CACHE_001 | DIM-CP-001 | telemetry_dimension_catalog.md | TMP-004 (10s scrape) |
| SIG-002 | CE-001/BM-061+INF-002 | VAR_CACHE_002 | DIM-CP-002 | telemetry_dimension_catalog.md | TMP-004 (10s scrape) |

**Entity governance chain:** SIG-002 → CE-001/BM-061 (N-10) + INF-002 (N-12) → entity_catalog.md via entity_telemetry.md

---

## SIG-003 — Cache Connectivity State Traceability

| Signal ID | Entity Ref | Variable | DIM Ref | 40.4 Artifact | Temporal |
|-----------|-----------|---------|---------|--------------|---------|
| SIG-003 | CE-001/BM-061+INF-002 | VAR_CACHE_003 | DIM-CP-003 | telemetry_dimension_catalog.md | TMP-004 (10s scrape) |

**Entity governance chain:** SIG-003 → CE-001/BM-061 (N-10) + INF-002 (N-12) → entity_catalog.md via entity_telemetry.md

---

## SIG-004 — Domain Event Emission Count Traceability

| Signal ID | Entity Ref | Variable | DIM Ref | 40.4 Artifact | Temporal |
|-----------|-----------|---------|---------|--------------|---------|
| SIG-004 | CE-001/BM-063 (N-08) | VAR_EVT_001 | DIM-ET-001 | telemetry_dimension_catalog.md | TMP-004 (10s scrape) |

**Entity governance chain:** SIG-004 → CE-001/BM-063 (N-08) FleetEventEmitter → entity_catalog.md via entity_telemetry.md

---

## SIG-005 — Fleet Active Connection Count Traceability

| Signal ID | Entity Ref | Variable | DIM Ref | 40.4 Artifact | Temporal |
|-----------|-----------|---------|---------|--------------|---------|
| SIG-005 | CE-001/BM-062 (N-09) | VAR_WS_001 | DIM-CS-001 | telemetry_dimension_catalog.md | TMP-010 (event-driven) |

**Entity governance chain:** SIG-005 → CE-001/BM-062 (N-09) Fleet Gateway → entity_catalog.md via entity_telemetry.md

---

## SIG-006 — Sensor Bridge Batch Throughput Rate Traceability

| Signal ID | Entity Ref | Variable | DIM Ref | 40.4 Artifact | Temporal | Declared Value |
|-----------|-----------|---------|---------|--------------|---------|----------------|
| SIG-006 | SA-001 (N-16) | VAR_HASI_001 | DIM-PC-001 | telemetry_dimension_catalog.md | TMP-009 (30s config) | 30 sec |
| SIG-006 | SA-001 (N-16) | VAR_HASI_002 | DIM-PC-002 | telemetry_dimension_catalog.md | TMP-009 (30s config) | 10 records |

**Entity governance chain:** SIG-006 → SA-001 (N-16) HASI Bridge → entity_catalog.md via entity_telemetry.md

**Computation traceability:**
- DIM-PC-001 = 30 (CEU-10 :: hasi_bridge.py DEFAULT_CONFIG poll_interval_sec)
- DIM-PC-002 = 10 (CEU-10 :: hasi_bridge.py DEFAULT_CONFIG batch_size)
- SIG-006 = DIM-PC-002 / DIM-PC-001 = 10 / 30 = 0.333 rec/sec

---

## SIG-007 — Vehicle Alert Severity State Traceability

| Signal ID | Entity Ref | Variable | DIM Ref | 40.4 Artifact | Temporal |
|-----------|-----------|---------|---------|--------------|---------|
| SIG-007 | CE-001/BM-005 (N-10) | VAR_ALT_001 | DIM-DE-007 | telemetry_dimension_catalog.md | TMP-003+TMP-010 |

**Temporal traceability:**
- TMP-003: alert broadcast via WebSocket (15–30s random, fleet.gateway.ts — temporal_telemetry_series.md)
- TMP-010: alert domain event (event-driven, fleet-events.ts — temporal_telemetry_series.md)

**Entity governance chain:** SIG-007 → CE-001/BM-005 (N-10) Alerts module → entity_catalog.md via entity_telemetry.md

---

## SIG-008 — Driver Session Performance Traceability (Composite)

| Signal ID | Entity Ref | Via Component | Variable | DIM Ref | 40.4 Artifact | Temporal |
|-----------|-----------|---------------|---------|---------|--------------|---------|
| SIG-008 | CE-001/BM-057 (N-07) | wear component | VAR_DS_004 | DIM-DE-004 | telemetry_dimension_catalog.md | TMP-010 |
| SIG-008 | CE-001/BM-057 (N-07) | health component | VAR_DS_005 | DIM-DE-005 | telemetry_dimension_catalog.md | TMP-010 |
| SIG-008 | CE-001/BM-043 (N-07) | dwvs component | VAR_DS_006 | DIM-DE-006 | telemetry_dimension_catalog.md | TMP-010 |

**Entity governance chain:** SIG-008 → CE-001/BM-057 (N-07) Driver Sessions + BM-043 (N-07) Driver Scoring → entity_catalog.md via entity_telemetry.md

---

## 40.4 Artifact Coverage

| 40.4 Artifact | Dimensions Providing Signal Inputs | Signals Fed |
|--------------|-----------------------------------|-------------|
| telemetry_dimension_catalog.md | DIM-PR-001, DIM-CP-001..003, DIM-ET-001, DIM-CS-001, DIM-PC-001..002, DIM-DE-004..007 | SIG-001..008 (all) |
| temporal_telemetry_series.md | TMP-001..012 (temporal anchor definitions) | SIG-001..008 (temporal ref chain) |
| entity_telemetry.md | CE-001, CE-002, SA-001, INF-001..005 (entity coverage context) | SIG-001..008 (entity ref chain) |

---

## Traceability Completeness Declaration

| Signal | Entity Ref | Variable Traced | DIM Ref Traced | 40.4 Artifact Cited | Temporal Ref | Complete |
|--------|-----------|----------------|----------------|--------------------|--------------|---------|
| SIG-001 | yes | yes (1 input) | yes | yes | yes | yes |
| SIG-002 | yes | yes (2 inputs) | yes | yes | yes | yes |
| SIG-003 | yes | yes (1 input) | yes | yes | yes | yes |
| SIG-004 | yes | yes (1 input) | yes | yes | yes | yes |
| SIG-005 | yes | yes (1 input) | yes | yes | yes | yes |
| SIG-006 | yes | yes (2 inputs) | yes | yes | yes | yes |
| SIG-007 | yes | yes (1 input) | yes | yes | yes | yes |
| SIG-008 | yes | yes (3 inputs) | yes | yes | yes | yes |

**Total signals traced: 8 / 8**
**Total variable-to-signal mappings traced: 12 (including composite inputs)**
**Signals with missing traceability: 0**
