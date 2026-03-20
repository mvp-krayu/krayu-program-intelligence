# Signal Computation Specification
run_id: run_01_blueedge
stream: Stream 40.5 — PiOS Signal Computation Engine
contract: PIOS-40.5-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.4-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Specification Rule

This document defines the computation specification for each governed signal in run_01_blueedge. Signals compute from the 40.4 canonical telemetry dimensions produced by Stream 40.4 (PIOS-40.4-RUN01-CONTRACT-v1) for BlueEdge Fleet Management Platform v3.23.0.

Every signal specification declares:
- Signal ID, Name, and entity governance reference (BM- or entity from 40.3 entity_catalog.md)
- Signal class (atomic | composite)
- Input telemetry variables (VAR_) mapped to DIM- dimensions
- Computation definition
- Output type and unit
- Temporal reference
- Computation state (computable | pending runtime)

No computation produces conditions, diagnoses, or intelligence. All signal values are observational state only.

---

## SIG-001 — Backend Process Heap Usage

| Field | Value |
|-------|-------|
| Signal ID | SIG-001 |
| Signal Name | Backend Process Heap Usage |
| Entity Ref | CE-001 / BM-061 (N-10) — Prometheus/Metrics module |
| Signal Class | atomic |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Output Type | gauge |
| Output Unit | bytes |

**Input Variables:**

| Variable | DIM Ref | Value / State |
|----------|---------|---------------|
| VAR_SYS_001 | DIM-PR-001 (blueedge_process_heap_bytes) | runtime — Prometheus gauge reading |

**Computation Definition:**

- Signal value = VAR_SYS_001 (DIM-PR-001 absolute gauge reading at each TMP-004 scrape)
- Output: heap_bytes as observed at scrape time
- No ratio or derivation — raw dimension passthrough

**Computation State:** PENDING — requires live runtime Prometheus scrape (TMP-004, target: blueedge-api:3000/health/prometheus)

---

## SIG-002 — Cache Hit Efficiency

| Field | Value |
|-------|-------|
| Signal ID | SIG-002 |
| Signal Name | Cache Hit Efficiency |
| Entity Ref | CE-001 / BM-061 (N-10) + INF-002 (N-12) — Redis cache |
| Signal Class | atomic |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Output Type | ratio |
| Output Unit | dimensionless (0.0–1.0) |

**Input Variables:**

| Variable | DIM Ref | Value / State |
|----------|---------|---------------|
| VAR_CACHE_001 | DIM-CP-001 (blueedge_cache_hits_total) | runtime — cumulative hits gauge |
| VAR_CACHE_002 | DIM-CP-002 (blueedge_cache_misses_total) | runtime — cumulative misses gauge |

**Computation Definition:**

- cache_hit_ratio = VAR_CACHE_001 / (VAR_CACHE_001 + VAR_CACHE_002)
- Equivalent: DIM-CP-001 / (DIM-CP-001 + DIM-CP-002)
- Boundary: when (DIM-CP-001 + DIM-CP-002) = 0, ratio is UNDEFINED (no cache operations recorded)
- Output: float in range [0.0, 1.0]; 1.0 = all cache hits; 0.0 = all misses

**Computation State:** PENDING — requires live Prometheus scrape with at least one cache operation recorded

---

## SIG-003 — Cache Connectivity State

| Field | Value |
|-------|-------|
| Signal ID | SIG-003 |
| Signal Name | Cache Connectivity State |
| Entity Ref | CE-001 / BM-061 (N-10) + INF-002 (N-12) |
| Signal Class | atomic |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Output Type | binary state |
| Output Unit | 1 = connected / 0 = degraded (in-memory fallback) |

**Input Variables:**

| Variable | DIM Ref | Value / State |
|----------|---------|---------------|
| VAR_CACHE_003 | DIM-CP-003 (blueedge_cache_connected) | runtime — binary gauge |

**Computation Definition:**

- Signal value = VAR_CACHE_003 (DIM-CP-003 absolute gauge reading)
- Output: 1 = Redis connected; 0 = Redis unavailable, in-memory cache active
- No transformation — binary state passthrough

**Computation State:** PENDING — requires live Prometheus scrape

---

## SIG-004 — Domain Event Emission Count

| Field | Value |
|-------|-------|
| Signal ID | SIG-004 |
| Signal Name | Domain Event Emission Count |
| Entity Ref | CE-001 / BM-063 (N-08) — FleetEventEmitter |
| Signal Class | atomic |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Output Type | counter (cumulative) |
| Output Unit | count (events since process start) |

**Input Variables:**

| Variable | DIM Ref | Value / State |
|----------|---------|---------------|
| VAR_EVT_001 | DIM-ET-001 (blueedge_events_total) | runtime — cumulative event counter gauge |

**Computation Definition:**

- Signal value = VAR_EVT_001 (DIM-ET-001 absolute count at scrape time)
- Output: cumulative event count since process start
- Rate derivation (events per second) is not computed in this stream — rate computation is a downstream (40.6+) concern

**Computation State:** PENDING — requires live Prometheus scrape

---

## SIG-005 — Fleet Active Connection Count

| Field | Value |
|-------|-------|
| Signal ID | SIG-005 |
| Signal Name | Fleet Active Connection Count |
| Entity Ref | CE-001 / BM-062 (N-09) — Fleet Gateway WebSocket |
| Signal Class | atomic |
| Temporal Reference | TMP-010 (event-driven — on WebSocket connect/disconnect) |
| Output Type | gauge |
| Output Unit | count (connected WebSocket clients) |

**Input Variables:**

| Variable | DIM Ref | Value / State |
|----------|---------|---------------|
| VAR_WS_001 | DIM-CS-001 (websocket.connectedClients) | runtime — logged on connect/disconnect |

**Computation Definition:**

- Signal value = VAR_WS_001 (DIM-CS-001 absolute count at each connect/disconnect event)
- Output: current WebSocket client count at event time
- No aggregation — event-time state reading

**Computation State:** PENDING — requires live WebSocket connection events (TMP-010)

---

## SIG-006 — Sensor Bridge Batch Throughput Rate

| Field | Value |
|-------|-------|
| Signal ID | SIG-006 |
| Signal Name | Sensor Bridge Batch Throughput Rate |
| Entity Ref | SA-001 (N-16) — HASI Bridge Agent |
| Signal Class | atomic |
| Temporal Reference | TMP-009 (30s config-defined poll cycle) |
| Output Type | ratio |
| Output Unit | records per second (declared throughput capacity) |

**Input Variables:**

| Variable | DIM Ref | Declared Value |
|----------|---------|----------------|
| VAR_HASI_001 | DIM-PC-001 (hasi_bridge.poll_interval_sec) | 30 (seconds) — CEU-10 :: hasi_bridge.py DEFAULT_CONFIG |
| VAR_HASI_002 | DIM-PC-002 (hasi_bridge.batch_size) | 10 (records/push) — CEU-10 :: hasi_bridge.py DEFAULT_CONFIG |

**Computation Definition:**

- batch_throughput_rate = VAR_HASI_002 / VAR_HASI_001
- Equivalent: DIM-PC-002 / DIM-PC-001 = 10 / 30
- Output: declared sensor data ingestion capacity at configured poll rate

**Computation State:** COMPLETE — both inputs are declared static configuration values

**Computed Value:**
- batch_throughput_rate = 10 / 30 = **0.333 records/second** (declared throughput capacity)
- Interpretation boundary: 0.333 rec/sec is the declared capacity at default config. Actual throughput depends on runtime sensor availability (SA-001 unknown-space TUS-01).

---

## SIG-007 — Vehicle Alert Severity State

| Field | Value |
|-------|-------|
| Signal ID | SIG-007 |
| Signal Name | Vehicle Alert Severity State |
| Entity Ref | CE-001 / BM-005 (N-10) — Alerts module |
| Signal Class | atomic |
| Temporal Reference | TMP-003 (15–30s random broadcast) + TMP-010 (event-driven) |
| Output Type | enum state |
| Output Unit | severity classification per alert event |

**Input Variables:**

| Variable | DIM Ref | Value / State |
|----------|---------|---------------|
| VAR_ALT_001 | DIM-DE-007 (alert.severity) | runtime — enum per alert event (critical/high/medium/low/info) |

**Computation Definition:**

- Signal value = VAR_ALT_001 (DIM-DE-007 severity enum per alert event)
- Output: severity classification at event time
- No aggregation or severity scoring — enum state passthrough per event

**Computation State:** PENDING — requires live alert events (TMP-003 WebSocket broadcast + TMP-010 domain events)

---

## SIG-008 — Driver Session Performance (Composite)

| Field | Value |
|-------|-------|
| Signal ID | SIG-008 |
| Signal Name | Driver Session Performance |
| Entity Ref | CE-001 / BM-057 (N-07) + BM-043 (N-07) — Driver Sessions + Driver Scoring |
| Signal Class | composite |
| Temporal Reference | TMP-010 (event-driven — driver.session.closed + driver.session.dwvs.computed) |
| Output Type | multi-field composite |
| Output Unit | {wear_index: dimensionless, health_delta: dimensionless, dwvs_score: dimensionless} |

**Input Variables:**

| Variable | DIM Ref | Value / State | Component |
|----------|---------|---------------|-----------|
| VAR_DS_004 | DIM-DE-004 (driver_session.wearIndex) | runtime — float per session close | wear component |
| VAR_DS_005 | DIM-DE-005 (driver_session.healthDelta) | runtime — float per session close | health component |
| VAR_DS_006 | DIM-DE-006 (driver_session.dwvs) | runtime — float per DWVS computed event | DWVS component |

**Computation Definition:**

- wear_component = VAR_DS_004 (DIM-DE-004 per session close event)
- health_component = VAR_DS_005 (DIM-DE-005 per session close event)
- dwvs_component = VAR_DS_006 (DIM-DE-006 per dwvs.computed event)
- Composite output: {wear_index, health_delta, dwvs_score} per driver session event set
- No scoring formula applied in this stream — compositing is field grouping only; scoring is a downstream concern

**Computation State:** PENDING — requires live driver session events (TMP-010)

---

## Specification Summary

| Signal ID | Name | Entity Ref | Class | Temporal | Computable Now |
|-----------|------|-----------|-------|----------|----------------|
| SIG-001 | Backend Process Heap Usage | CE-001/BM-061 | atomic | TMP-004 (10s) | pending runtime |
| SIG-002 | Cache Hit Efficiency | CE-001/BM-061+INF-002 | atomic | TMP-004 (10s) | pending runtime |
| SIG-003 | Cache Connectivity State | CE-001/BM-061+INF-002 | atomic | TMP-004 (10s) | pending runtime |
| SIG-004 | Domain Event Emission Count | CE-001/BM-063 | atomic | TMP-004 (10s) | pending runtime |
| SIG-005 | Fleet Active Connection Count | CE-001/BM-062 | atomic | TMP-010 (event-driven) | pending runtime |
| SIG-006 | Sensor Bridge Batch Throughput Rate | SA-001 | atomic | TMP-009 (30s config) | **COMPLETE** (0.333 rec/sec) |
| SIG-007 | Vehicle Alert Severity State | CE-001/BM-005 | atomic | TMP-003+TMP-010 | pending runtime |
| SIG-008 | Driver Session Performance | CE-001/BM-057+BM-043 | composite | TMP-010 (event-driven) | pending runtime |

**Signals fully computable from static telemetry: 1 (SIG-006)**
**Signals pending runtime telemetry: 7 (SIG-001..005, SIG-007..008)**
