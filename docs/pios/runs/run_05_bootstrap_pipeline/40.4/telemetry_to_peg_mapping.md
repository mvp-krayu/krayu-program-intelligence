# Telemetry to PEG Mapping
run_id: run_05_bootstrap_pipeline
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Purpose

Maps each telemetry surface and dimension to the canonical 40.3 PEG nodes and execution paths. The PEG is not modified; telemetry is attached to existing nodes and paths only.

---

## PEG Node Telemetry Attachment

### N-01 — CE-002 (Frontend Application)

node_ref: N-01
entity_ref: CE-002
telemetry_attached: NONE
note: CE-002 is browser-side; no server-observable telemetry surfaces

---

### N-02 — FE-001 (API Client Layer)

node_ref: N-02
entity_ref: FE-001
telemetry_attached: INDIRECT
observable_at: N-05 side of SD-001 (TS-012 request log captures inbound requests)
temporal_refs: TMP-011 (token refresh — event-driven), TMP-012 (offline flush — event-driven)

---

### N-03 — FE-004 (WebSocket Client)

node_ref: N-03
entity_ref: FE-004
telemetry_attached: INDIRECT
observable_at: N-09 side of SD-002 (TS-017 connection count, TS-002/003/013 received broadcasts)

---

### N-04 — FE-005 (Auth Context)

node_ref: N-04
entity_ref: FE-005
telemetry_attached: NONE
note: localStorage token storage — no server-observable surface

---

### N-05 — CE-001 (Backend API Application)

node_ref: N-05
entity_ref: CE-001
telemetry_attached: HIGH

| Surface | Dimensions | Temporal |
|---------|-----------|---------|
| TS-001 (Prometheus export) | DIM-PR-001..003, DIM-CP-001..003, DIM-ET-001 | TMP-004 (10s pull) |
| TS-012 (Request log) | All HTTP requests | TMP-010 (event-driven) |
| TS-009 (Health) | DIM-PR-001..004, DIM-CP-001..003, DIM-ET-001 | on-demand |
| TS-010 (Readiness) | DIM-CP-003 (cache state) | on-demand |
| TS-011 (Metrics) | DIM-PR-001..005, DIM-RP | on-demand |

---

### N-06 — BM-064 (Auth Module)

node_ref: N-06
entity_ref: BM-064
telemetry_attached: INDIRECT
observable: 401/403 HTTP responses in TS-012 (request log)
no dedicated auth metrics surface evidenced

---

### N-07 — BM-001..BM-060 (Domain Module Layer)

node_ref: N-07
entity_ref: BM-001..BM-060
telemetry_attached: PARTIAL

| Surface | Coverage | Temporal |
|---------|---------|---------|
| TS-012 (Request log) | All domain endpoints | event-driven |
| TS-008 (Domain events via N-08) | State-change telemetry (65 event types) | TMP-010 |

Module-specific dimensions (sampled):
| Module(s) | Dimensions |
|-----------|-----------|
| BM-001 vehicles | DIM-VP-001..006 via vehicle.position.updated |
| BM-005 alerts | DIM-DE-007 severity |
| BM-007 fuel | DIM-DE-010 fuelVolumeL |
| BM-008 tanker | DIM-TK-001..003 |
| BM-021 coldchain | DIM-DE-009 temperatureC |
| BM-022 ev | DIM-DE-008 stateOfChargePercent |
| BM-043 driver-scoring | DIM-DE-006 dwvs |
| BM-057 driver-sessions | DIM-DE-001..006 |

---

### N-08 — BM-063 (FleetEventsModule)

node_ref: N-08
entity_ref: BM-063
telemetry_attached: HIGH

| Surface | Coverage | Temporal |
|---------|---------|---------|
| TS-008 (Domain event bus) | 65 event types; 10 typed payload schemas | TMP-010 (event-driven) |
| DIM-ET-001 | total event count | via N-10 health metrics |

Handler telemetry effects:
| Handler | Telemetry impact |
|---------|----------------|
| audit-log.handler | DB write → N-11 observable |
| cache-invalidation.handler | DIM-CP-001/002 change → N-12 |
| notification.handler | HTTP request → TS-012 |
| websocket-broadcast.handler | broadcast → N-09 surfaces |

---

### N-09 — BM-062 (FleetGateway WebSocket)

node_ref: N-09
entity_ref: BM-062
telemetry_attached: HIGH

| Surface | Dimensions | Temporal |
|---------|-----------|---------|
| TS-002 fleet:positions | DIM-VP-001..006 × 10 vehicles | TMP-001 (2s) |
| TS-003 vehicle:telemetry | DIM-VT-001..010, DIM-TK-001..003 | TMP-002 (5s) |
| TS-013 alert:new | DIM-DE-007 severity | TMP-003 (15-30s) |
| TS-017 connection state | DIM-CS-001 connectedClients | TMP-010 (event-driven) |

---

### N-10 — BM-061 (HealthModule)

node_ref: N-10
entity_ref: BM-061
telemetry_attached: HIGH

This node IS the primary telemetry aggregation and export point.

| Surface | Function | Temporal |
|---------|---------|---------|
| TS-001 — GET /health/prometheus | Exports 7 Prometheus gauges | pulled by N-13 TMP-004 |
| TS-009 — GET /health | Liveness + summary JSON | on-demand |
| TS-010 — GET /health/ready | Readiness probe | on-demand |
| TS-011 — GET /health/metrics | Per-endpoint performance metrics | on-demand |

---

### N-11 — INF-001 (PostgreSQL)

node_ref: N-11
entity_ref: INF-001
telemetry_attached: INDIRECT
observable: via TS-007 (postgres-exporter:9187 scrape at TMP-007 15s)
direct_query_telemetry: not evidenced

---

### N-12 — INF-002 (Redis)

node_ref: N-12
entity_ref: INF-002
telemetry_attached: DIRECT + INDIRECT

| Surface | Dimensions | Temporal |
|---------|-----------|---------|
| via N-10 (TS-001) | DIM-CP-001..003 | TMP-004 (10s) |
| TS-006 (redis-exporter) | Redis-native metrics | TMP-006 (15s) |

---

### N-13 — INF-003 (Monitoring)

node_ref: N-13
entity_ref: INF-003
telemetry_attached: INFRASTRUCTURE

N-13 IS the monitoring infrastructure. Collects telemetry from N-05, N-11, N-12, and host.

| Collection surface | Target | Temporal |
|-------------------|--------|---------|
| TS-004 (scrape API) | N-10 /health/prometheus | TMP-004 (10s) |
| TS-005 (node-exporter) | host | TMP-005 (15s) |
| TS-006 (redis-exporter) | N-12 | TMP-006 (15s) |
| TS-007 (postgres-exporter) | N-11 | TMP-007 (15s) |

Grafana visualization: fleet-operations.json dashboard reads from Prometheus.

---

### N-14 — INF-004 (MQTT Broker)

node_ref: N-14
entity_ref: INF-004
telemetry_attached: NONE_EVIDENCED
note: MQTT broker implementation not in extracted source (US-04)

---

### N-15 — INF-005 (HASI Security System)

node_ref: N-15
entity_ref: INF-005
telemetry_attached: NONE_EVIDENCED
note: HASI system not in extracted source

---

### N-16 — SA-001 (HASI Bridge Agent)

node_ref: N-16
entity_ref: SA-001
telemetry_attached: PARTIAL

| Surface | Dimensions | Temporal |
|---------|-----------|---------|
| TS-014 (poll cycle) | DIM-PC-001 (30s), DIM-PC-002 (batch=10) | TMP-009 (30s) |
| TS-015 (MQTT push) | topic: blueedge/hasi; TLS state | TMP-009 derived |
| TS-016 (REST fallback) | HTTP to CE-001 — observable at N-05 TS-012 | TMP-009 derived |

---

### N-17 — SA-002 (Sensor Collector)

node_ref: N-17
entity_ref: SA-002
telemetry_attached: NONE_EVIDENCED
note: sensor_collector.py not read (US-08, US-13)

---

## Execution Path Telemetry Mapping

### EP-01 — REST API Request (Authenticated CRUD)

Path: N-01 → N-02 → N-05 → N-06 → N-07 → N-11

| Path segment | Telemetry observable | Surface |
|-------------|---------------------|---------|
| N-02 → N-05 | HTTP request captured | TS-012 |
| N-05 (inbound) | JWT validation result (200/401/403) | TS-012 |
| N-05 → N-07 | per-endpoint timing | TS-011 |
| N-07 → N-11 | query execution (via postgres-exporter) | TS-007 |
| N-11 | DB metrics | TS-007 TMP-007 |

Temporal anchors: TMP-010 (event-driven), TMP-007 (15s postgres scrape)

---

### EP-01a — Token Refresh Sub-Path

Path: N-02 → N-05 → N-06

| Path segment | Telemetry observable | Surface |
|-------------|---------------------|---------|
| N-02 → N-05 | POST /auth/refresh request | TS-012 |
| N-05 → N-06 | token generation (200 or 401) | TS-012 |

Temporal anchor: TMP-011 (event-driven — triggered by 401)

---

### EP-02 — Domain State Change → Event Propagation

Path: N-07 → N-08 → {audit, cache, notification, websocket} handlers

| Path segment | Telemetry observable | Surface |
|-------------|---------------------|---------|
| N-07 (emit) | event increments DIM-ET-001 | TS-001, TS-009 |
| N-08 (emit) | TS-008 — typed event with full payload | TS-008 |
| N-08 → N-11 (audit) | DB write (postgres-exporter) | TS-007 |
| N-08 → N-12 (cache) | DIM-CP-001/002 change | TS-001 |
| N-08 → N-09 (WS broadcast) | alert/vehicle/session broadcast | TS-002/003/013 |

Temporal anchor: TMP-010 (event-driven)

---

### EP-03 — Real-Time Fleet Tracking

Path: N-01 → N-03 → N-09 (subscription + broadcast loop)

| Path segment | Telemetry observable | Surface | Temporal |
|-------------|---------------------|---------|---------|
| N-03 → N-09 (connect) | DIM-CS-001 increment | TS-017 | on connect |
| N-09 → N-03 (positions) | DIM-VP-001..006 × 10 vehicles | TS-002 | TMP-001 (2s) |
| N-09 → N-03 (telemetry) | DIM-VT-001..010, DIM-TK-001..003 | TS-003 | TMP-002 (5s) |
| N-09 → N-03 (alerts) | DIM-DE-007 severity | TS-013 | TMP-003 (15-30s) |

---

### EP-04 — Vehicle Command Dispatch (PARTIAL)

Path: N-01 → N-03 → N-09 → [PARTIAL] → N-14

| Path segment | Telemetry observable | Surface |
|-------------|---------------------|---------|
| N-03 → N-09 (vehicle:command) | command + vehicleId logged | TS-017 (logger) |
| N-09 → N-14 | NOT evidenced (US-11) | — |
| Response | command:ack {vehicleId, command, status='queued', queuedAt} | TS-003 |

Temporal anchor: TMP-010 (event-driven)
completeness: PARTIAL (US-11)

---

### EP-05 — HASI Security Data Pipeline (PARTIAL)

Path: N-16 → N-15 → N-14 → [PARTIAL] → N-05 → N-07 → N-11

| Path segment | Telemetry observable | Surface | Temporal |
|-------------|---------------------|---------|---------|
| N-16 poll | DIM-PC-001 (30s), DIM-PC-002 (batch=10) | TS-014 | TMP-009 |
| N-16 → N-14 (MQTT) | topic prefix evidenced | TS-015 | derived |
| N-14 → N-05 | NOT evidenced (US-06, US-12) | — | — |
| N-16 → N-05 (REST fallback) | TS-012 request log on CE-001 | TS-016 | fallback |

Temporal anchor: TMP-009 (30s configurable)
completeness: PARTIAL (US-06, US-12)

---

### EP-06 — Monitoring Data Collection

Path: N-13 → N-10 (primary), N-13 → N-11/N-12/host (infra)

| Path segment | Surface | Temporal | Dimensions |
|-------------|---------|---------|-----------|
| N-13 → N-10 scrape | TS-004 | TMP-004 (10s) | DIM-PR-001..003, DIM-CP-001..003, DIM-ET-001 |
| N-13 → host | TS-005 | TMP-005 (15s) | host CPU/mem/disk |
| N-13 → N-12 exporter | TS-006 | TMP-006 (15s) | Redis metrics |
| N-13 → N-11 exporter | TS-007 | TMP-007 (15s) | PostgreSQL metrics |
| N-13 (Grafana) | fleet-operations.json | Grafana query | all collected metrics |

This is the primary telemetry collection path in the system.

---

### EP-07 — User Authentication Flow

Path: N-01 → N-02 → N-05 → N-06 → N-11 → N-04

| Path segment | Telemetry observable | Surface |
|-------------|---------------------|---------|
| N-02 → N-05 POST /auth/login | login request | TS-012 |
| N-05 → N-11 (credential check) | query via BD-006 → postgres-exporter | TS-007 |
| Response | 200 with tokens or 401 | TS-012 |

Temporal anchor: TMP-010 (event-driven)

---

### EP-08 — Offline Mutation Queue

Path: N-02 (queue) → N-02 (flush) → N-05

| Path segment | Telemetry observable | Surface |
|-------------|---------------------|---------|
| Queue accumulation | localStorage writes (no server surface) | — |
| Queue flush | batch HTTP requests to N-05 | TS-012 |
| >24h items | discarded — no server surface | — |

Temporal anchor: TMP-012 (event-driven — network reconnect)

---

## Telemetry Coverage by PEG Path

| Path | Coverage | Surfaces |
|------|---------|---------|
| EP-01 | PARTIAL | TS-012, TS-011, TS-007 |
| EP-01a | PARTIAL | TS-012 |
| EP-02 | HIGH | TS-008, TS-001, TS-002/003/013 |
| EP-03 | HIGH | TS-002, TS-003, TS-013, TS-017 |
| EP-04 | PARTIAL | TS-017 (command log); remainder PARTIAL (US-11) |
| EP-05 | PARTIAL | TS-014, TS-015/016; cloud path PARTIAL (US-06/12) |
| EP-06 | HIGH | TS-004..007, TS-001, TS-009..011 |
| EP-07 | PARTIAL | TS-012, TS-007 |
| EP-08 | PARTIAL | TS-012 (flush only; queue itself client-side) |

---

## Status

telemetry_to_peg_mapping_complete: PARTIAL
peg_structure_modified: FALSE
all_mappings_reference_40_3_elements: TRUE
new_peg_nodes_created: NONE
new_peg_edges_created: NONE
