# Signal Output Set
run_id: run_01_blueedge
stream: Stream 40.5 — PiOS Signal Computation Engine
contract: PIOS-40.5-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.4-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Output Rule

This document records the computed output for each governed signal in run_01_blueedge. Where computation is fully deterministic from static telemetry, the computed value is provided. Where computation requires runtime (event-based or Prometheus-scraped) telemetry, the output schema and state are declared and the value is marked as pending live telemetry.

No signal value is fabricated, inferred, or estimated. No interpretation, condition label, or diagnosis is attached to any output.

---

## SIG-001 — Backend Process Heap Usage

| Field | Value |
|-------|-------|
| Signal ID | SIG-001 |
| Signal Name | Backend Process Heap Usage |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Computation State | PENDING |

**Output Schema:**

| Output Field | Type | Unit | Required Input |
|-------------|------|------|---------------|
| heap_bytes | gauge | bytes | VAR_SYS_001 (DIM-PR-001) — live Prometheus scrape |

**Full Signal Output:** pending — requires live Prometheus scrape at blueedge-api:3000/health/prometheus (TMP-004, every 10s).

---

## SIG-002 — Cache Hit Efficiency

| Field | Value |
|-------|-------|
| Signal ID | SIG-002 |
| Signal Name | Cache Hit Efficiency |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Computation State | PENDING |

**Output Schema:**

| Output Field | Formula | Type | Unit | Required Inputs |
|-------------|---------|------|------|-----------------|
| cache_hit_ratio | DIM-CP-001 / (DIM-CP-001 + DIM-CP-002) | ratio | dimensionless (0.0–1.0) | VAR_CACHE_001, VAR_CACHE_002 |
| undefined_case | DIM-CP-001 + DIM-CP-002 = 0 | state | — | no cache ops recorded |

**Full Signal Output:** pending — requires live Prometheus scrape with cache operations recorded.

---

## SIG-003 — Cache Connectivity State

| Field | Value |
|-------|-------|
| Signal ID | SIG-003 |
| Signal Name | Cache Connectivity State |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Computation State | PENDING |

**Output Schema:**

| Output Field | Type | Unit | Required Input |
|-------------|------|------|---------------|
| cache_connected | binary | 1=connected / 0=degraded | VAR_CACHE_003 (DIM-CP-003) |

**Full Signal Output:** pending — requires live Prometheus scrape.

---

## SIG-004 — Domain Event Emission Count

| Field | Value |
|-------|-------|
| Signal ID | SIG-004 |
| Signal Name | Domain Event Emission Count |
| Temporal Reference | TMP-004 (10s Prometheus scrape) |
| Computation State | PENDING |

**Output Schema:**

| Output Field | Type | Unit | Required Input |
|-------------|------|------|---------------|
| events_total | counter | count (since process start) | VAR_EVT_001 (DIM-ET-001) |

**Full Signal Output:** pending — requires live Prometheus scrape.

---

## SIG-005 — Fleet Active Connection Count

| Field | Value |
|-------|-------|
| Signal ID | SIG-005 |
| Signal Name | Fleet Active Connection Count |
| Temporal Reference | TMP-010 (event-driven) |
| Computation State | PENDING |

**Output Schema:**

| Output Field | Type | Unit | Required Input |
|-------------|------|------|---------------|
| connected_clients | gauge | count | VAR_WS_001 (DIM-CS-001) — live WebSocket events |

**Full Signal Output:** pending — requires live WebSocket connect/disconnect events.

---

## SIG-006 — Sensor Bridge Batch Throughput Rate

| Field | Value |
|-------|-------|
| Signal ID | SIG-006 |
| Signal Name | Sensor Bridge Batch Throughput Rate |
| Temporal Reference | TMP-009 (30s config-defined) |
| Computation State | COMPLETE |

**Computed Output:**

| Sub-computation | Formula | Telemetry Inputs | Result |
|----------------|---------|-----------------|--------|
| Batch throughput rate | DIM-PC-002 / DIM-PC-001 | VAR_HASI_002=10, VAR_HASI_001=30 | **0.333 records/second** |

**Full Signal Output:**
- Sensor batch throughput rate: **0.333 records/second** (declared throughput capacity at default config)
- Basis: 10 records/push ÷ 30-second poll cycle = 0.333 rec/sec
- Evidence: CEU-10 :: hasi_bridge.py DEFAULT_CONFIG — poll_interval_sec=30, batch_size=10
- Temporal reference: TMP-009 (30s, config-defined, configurable via /opt/blueedge/config/blueedge.yaml)
- Runtime note: actual throughput depends on SA-001 sensor data availability (TUS-01 unknown-space applies)

---

## SIG-007 — Vehicle Alert Severity State

| Field | Value |
|-------|-------|
| Signal ID | SIG-007 |
| Signal Name | Vehicle Alert Severity State |
| Temporal Reference | TMP-003 (15–30s random) + TMP-010 (event-driven) |
| Computation State | PENDING |

**Output Schema:**

| Output Field | Type | Unit | Required Input |
|-------------|------|------|---------------|
| alert_severity | enum | critical/high/medium/low/info | VAR_ALT_001 (DIM-DE-007) — per alert event |

**Full Signal Output:** pending — requires live alert events (WebSocket broadcast TMP-003 or domain event TMP-010).

---

## SIG-008 — Driver Session Performance

| Field | Value |
|-------|-------|
| Signal ID | SIG-008 |
| Signal Name | Driver Session Performance |
| Temporal Reference | TMP-010 (event-driven) |
| Computation State | PENDING |

**Output Schema:**

| Output Field | Type | Unit | Event Source | Required Input |
|-------------|------|------|-------------|---------------|
| wear_index | float | dimensionless | driver.session.closed | VAR_DS_004 (DIM-DE-004) |
| health_delta | float | dimensionless | driver.session.closed | VAR_DS_005 (DIM-DE-005) |
| dwvs_score | float | dimensionless | driver.session.dwvs.computed | VAR_DS_006 (DIM-DE-006) |

**Full Signal Output:** pending — requires live driver session close and DWVS computed events (TMP-010).

---

## Signal Output Summary

| Signal ID | Name | Entity | Temporal | State | Output Available |
|-----------|------|--------|----------|-------|-----------------|
| SIG-001 | Backend Process Heap Usage | CE-001/BM-061 | TMP-004 (10s) | pending | — |
| SIG-002 | Cache Hit Efficiency | CE-001/BM-061+INF-002 | TMP-004 (10s) | pending | — |
| SIG-003 | Cache Connectivity State | CE-001/BM-061+INF-002 | TMP-004 (10s) | pending | — |
| SIG-004 | Domain Event Emission Count | CE-001/BM-063 | TMP-004 (10s) | pending | — |
| SIG-005 | Fleet Active Connection Count | CE-001/BM-062 | TMP-010 (event-driven) | pending | — |
| SIG-006 | Sensor Bridge Batch Throughput Rate | SA-001 | TMP-009 (30s) | **complete** | **0.333 rec/sec** |
| SIG-007 | Vehicle Alert Severity State | CE-001/BM-005 | TMP-003+TMP-010 | pending | — |
| SIG-008 | Driver Session Performance | CE-001/BM-057+BM-043 | TMP-010 (event-driven) | pending | — |

**Signals with complete output: 1 (SIG-006)**
**Signals pending runtime telemetry: 7 (SIG-001..005, SIG-007..008)**
**All outputs: no interpretation, no condition label, no diagnosis attached**

---

## Blocking Dependencies

| Signal | Blocking Input | Blocking Reason |
|--------|---------------|-----------------|
| SIG-001 | VAR_SYS_001 (DIM-PR-001) | Prometheus scrape requires running backend container (TMP-004) |
| SIG-002 | VAR_CACHE_001, VAR_CACHE_002 | Cache operations required; Prometheus scrape (TMP-004) |
| SIG-003 | VAR_CACHE_003 (DIM-CP-003) | Prometheus scrape (TMP-004) |
| SIG-004 | VAR_EVT_001 (DIM-ET-001) | Event counter requires running EventEmitter; Prometheus scrape (TMP-004) |
| SIG-005 | VAR_WS_001 (DIM-CS-001) | Requires WebSocket clients to connect (TMP-010) |
| SIG-007 | VAR_ALT_001 (DIM-DE-007) | Requires alert events to fire (TMP-003 + TMP-010) |
| SIG-008 | VAR_DS_004..006 (DIM-DE-004..006) | Requires driver session close + DWVS computed events (TMP-010) |

---

## Completeness Declaration

signal_output_completeness: PARTIAL

PARTIAL is the governed position. COMPLETE is not achievable because:
- SIG-001..005 require live Prometheus scrape data (backend must be running and scraped by INF-003)
- SIG-007 requires live alert event flow
- SIG-008 requires live driver session lifecycle events
- Evidence-First Principle (GC-06) prevents fabrication of runtime values

SIG-006 is fully computable because both DIM-PC-001 and DIM-PC-002 are declared static configuration constants in CEU-10 :: hasi_bridge.py.
