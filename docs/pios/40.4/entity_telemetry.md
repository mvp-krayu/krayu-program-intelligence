# Entity Telemetry
run_id: run_01_blueedge
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.3-RUN02-CONTRACT-v3
date: 2026-03-19

---

## Purpose

Attaches extracted telemetry to each canonical entity from the 40.3 entity catalog. Telemetry attaches only to existing entities. No new entities are created. Entity IDs are locked from 40.3.

---

## Tier 1 — System Component Telemetry

### CE-001 — Backend API Application

entity_ref: CE-001 (N-05)
telemetry_coverage: HIGH

**Prometheus Metrics (surface: TS-001, INT-005)**

| Metric | Dimension ID | Type |
|--------|-------------|------|
| blueedge_process_heap_bytes | DIM-PR-001 | gauge |
| blueedge_process_rss_bytes | DIM-PR-002 | gauge |
| blueedge_process_external_bytes | DIM-PR-003 | gauge |
| blueedge_cache_hits_total | DIM-CP-001 | gauge |
| blueedge_cache_misses_total | DIM-CP-002 | gauge |
| blueedge_cache_connected | DIM-CP-003 | gauge |
| blueedge_events_total | DIM-ET-001 | gauge |

Evidence: CEU-08 :: health/health.controller.ts — prometheusMetrics()

**Health JSON (surface: TS-009)**

| Field | Dimension | Evidence |
|-------|-----------|---------|
| status | ok | health.controller.ts check() |
| uptime | DIM-PR-004 | process.uptime() |
| memory.rss | DIM-PR-002 (MB rounded) | process.memoryUsage().rss |
| memory.heap | DIM-PR-001 (MB rounded) | process.memoryUsage().heapUsed |
| cache.* | DIM-CP-001, DIM-CP-002, DIM-CP-003 | cacheService.getStats() |
| events.totalEmitted | DIM-ET-001 | eventEmitter.getEventCount() |

**Performance Metrics (surface: TS-011)**

| Field | Dimension | Evidence |
|-------|-----------|---------|
| endpoints | DIM-RP per endpoint | PerformanceMiddleware.getMetrics() |
| topSlowest | DIM-RP top 10 | PerformanceMiddleware.getTopSlowest(10) |
| process.uptime | DIM-PR-004 | process.uptime() |
| process.memoryMB | DIM-PR-001 (MB) | process.memoryUsage().heapUsed |
| process.cpu | DIM-PR-005 | process.cpuUsage() |

**Readiness (surface: TS-010)**

| Field | Value |
|-------|-------|
| status | 'ready' or 'degraded' |
| checks.cache | 'up' or 'down (fallback to memory)' |
| checks.events | 'up' |
| checks.logging | 'up' |

**Request Logging (surface: TS-012)**

Covers: all HTTP requests, global — RequestLoggingInterceptor
Evidence: CEU-08 :: app.module.ts — APP_INTERCEPTOR: RequestLoggingInterceptor

---

### CE-002 — Frontend Application

entity_ref: CE-002 (N-01)
telemetry_coverage: NONE_EVIDENCED

No server-side telemetry surface evidenced for CE-002. Frontend is a browser-side React SPA; any telemetry it emits (browser errors, performance) is not in extracted source scope.

Unknown-space: TUS-05 — Frontend browser telemetry not in extracted source

---

### CE-003 — Integrated Platform Monorepo

entity_ref: CE-003
telemetry_coverage: INDIRECT

CE-003 contains CE-001 (OVL-01), CE-002 (OVL-02), SA-001, SA-002, INF-003. Telemetry is on the embedded components. No CE-003-specific additional surfaces evidenced beyond overlap components.

---

## Tier 2 — SVG Agent Telemetry

### SA-001 — HASI Bridge Agent

entity_ref: SA-001 (N-16)
telemetry_coverage: PARTIAL

**Poll Cycle (surface: TS-014)**

| Dimension | Value | Evidence |
|-----------|-------|---------|
| DIM-PC-001 poll_interval_sec | 30 | CEU-10 :: hasi_bridge.py DEFAULT_CONFIG |
| DIM-PC-002 batch_size | 10 | CEU-10 :: hasi_bridge.py DEFAULT_CONFIG |

**Output Surface (surface: TS-015 — MQTT)**

MQTT topic prefix: blueedge/hasi (CEU-10 :: hasi_bridge.py)
TLS: mutual TLS (client cert) (CEU-10 :: hasi_bridge.py)
Completeness: PARTIAL — topic payload schema not read from hasi_bridge.py beyond existence of mqtt_enabled, mqtt_broker config

**Output Surface (surface: TS-016 — REST fallback)**

REST endpoint: https://api.blueedge.network/api/v1 (CEU-10 :: hasi_bridge.py — cloud_api_url)
Auth: API key (BLUEEDGE_API_KEY) (CEU-10 :: hasi_bridge.py — cloud_api_key)

---

### SA-002 — Sensor Collector Agent

entity_ref: SA-002 (N-17)
telemetry_coverage: NONE_EVIDENCED

No telemetry surfaces evidenced — sensor_collector.py not read at 40.3/40.4 depth.
Unknown-space: TUS-01 carried forward from telemetry_surface_map.md

---

## Tier 3 — Infrastructure Telemetry

### INF-001 — PostgreSQL

entity_ref: INF-001 (N-11)
telemetry_coverage: INDIRECT (via exporter)

| Surface | Source | Evidence |
|---------|--------|---------|
| TS-007 | postgres-exporter:9187 | CEU-10 :: prometheus.yml — scrape target |

PostgreSQL-native metrics are exported via postgres-exporter. Internal metric schema is not in extracted source (standard postgres-exporter metrics inferred — NOT evidenced here).

---

### INF-002 — Redis Cache

entity_ref: INF-002 (N-12)
telemetry_coverage: DIRECT + INDIRECT

**Via CE-001 Health (direct)**

| Dimension | Source |
|-----------|--------|
| DIM-CP-001 cache_hits_total | health.controller.ts cacheService.getStats().hits |
| DIM-CP-002 cache_misses_total | health.controller.ts cacheService.getStats().misses |
| DIM-CP-003 cache_connected | health.controller.ts cacheService.getStats().connected |

**Via Exporter (indirect)**

| Surface | Source | Evidence |
|---------|--------|---------|
| TS-006 | redis-exporter:9121 | CEU-10 :: prometheus.yml — scrape target |

---

### INF-003 — Monitoring Stack

entity_ref: INF-003 (N-13)
telemetry_coverage: INFRASTRUCTURE_ONLY

INF-003 IS the telemetry collection layer. It does not itself emit telemetry in the evidenced source. Its observable state:
- Grafana dashboard: fleet-operations.json (CEU-10)
- Scrape configuration: 4 jobs (TS-004 through TS-007)
- Global eval_interval: 15s (CEU-10 :: prometheus.yml)

---

### INF-004 — MQTT Broker

entity_ref: INF-004 (N-14)
telemetry_coverage: NONE_EVIDENCED

MQTT broker implementation not in extracted source (US-04). No telemetry surfaces available.

---

### INF-005 — HASI Security System

entity_ref: INF-005 (N-15)
telemetry_coverage: NONE_EVIDENCED

HASI system not in extracted source. No telemetry surfaces available. SA-001 reads from it but its internal metrics are unknown.

---

## Tier 4 — Backend Module Telemetry

Backend module telemetry surfaces are shared infrastructure on CE-001. Telemetry attaches at the functional module level where evidence is specific.

### BM-061 — Health Module (N-10)

entity_ref: BM-061 (N-10)
telemetry_coverage: HIGH
surfaces: TS-001, TS-009, TS-010, TS-011
dimensions: DIM-PR-001 through DIM-PR-005, DIM-CP-001 through DIM-CP-003, DIM-ET-001

### BM-062 — FleetGateway (N-09)

entity_ref: BM-062 (N-09)
telemetry_coverage: HIGH
surfaces: TS-002, TS-003, TS-013, TS-017
dimensions: DIM-VP-001 through DIM-VP-006, DIM-VT-001 through DIM-VT-010, DIM-TK-001 through DIM-TK-003, DIM-DE-007, DIM-CS-001

### BM-063 — FleetEventsModule (N-08)

entity_ref: BM-063 (N-08)
telemetry_coverage: HIGH
surfaces: TS-008
dimensions: DIM-ET-001, DIM-DE-001 through DIM-DE-010
handlers: audit-log, cache-invalidation, notification, websocket-broadcast

### BM-064 — Auth Module (N-06)

entity_ref: BM-064 (N-06)
telemetry_coverage: INDIRECT
auth events are logged via RequestLoggingInterceptor (TS-012) on all routes
No dedicated auth telemetry surface evidenced beyond JWT guard validation results

### BM-057 — Driver Sessions

entity_ref: BM-057 (N-07 group)
telemetry_coverage: PARTIAL (via events)
Event-carried dimensions: DIM-DE-001 through DIM-DE-006
Event names: driver.session.started, driver.session.closed, driver.session.interrupted, driver.session.dwvs.computed

### BM-001 through BM-060 — Domain Modules (N-07)

entity_ref: BM-001..BM-060 (N-07)
telemetry_coverage: PARTIAL (via shared surfaces)
All domain modules:
- Request telemetry via TS-012 (RequestLoggingInterceptor)
- Event emission via TS-008 (FleetEventEmitter) — 65 event types total
- Database access via BD-006 — individual query metrics not evidenced

Modules with specific event dimensions evidenced:
| Module | BM ID | Event dimension |
|--------|-------|----------------|
| vehicles | BM-001 | DIM-VP-001..006 via vehicle.position.updated |
| drivers | BM-002 | DIM-DE-006 via driver.score.changed |
| alerts | BM-005 | DIM-DE-007 severity |
| fuel | BM-007 | DIM-DE-010 fuelVolumeL |
| tanker | BM-008 | DIM-TK-001..003 |
| coldchain | BM-021 | DIM-DE-009 temperatureC |
| ev | BM-022 | DIM-DE-008 stateOfChargePercent |
| driver-sessions | BM-057 | DIM-DE-001..006 |

---

## Tier 5 — Frontend Subsystem Telemetry

No server-side telemetry evidenced for FE-001 through FE-011. See CE-002 entry.

### FE-008 — PWA Layer

entity_ref: FE-008
offline_queue: localStorage OFFLINE_QUEUE_KEY (CEU-09 :: api/client.ts)
observable: queue depth not emitted as telemetry; queue flush events trigger EP-01 path
note: this is local state, not telemetry surface

---

## Tier 6 — Database Schema Telemetry

DS-001 through DS-008 are PostgreSQL table schemas. Telemetry about the database comes via:
- TS-007: postgres-exporter:9187 (INF-001 level, not per-table)
- BD-006: TypeORM repository operations (queries not individually instrumented in evidenced source)

No per-table telemetry surfaces evidenced within CE-001 source.

---

## Entity Telemetry Coverage Summary

| Entity | Coverage | Primary Surfaces |
|--------|---------|-----------------|
| CE-001 | HIGH | TS-001, TS-009, TS-010, TS-011, TS-012 |
| CE-002 | NONE | — |
| CE-003 | INDIRECT | via embedded components |
| SA-001 | PARTIAL | TS-014, TS-015, TS-016 |
| SA-002 | NONE | — |
| INF-001 | INDIRECT | TS-007 |
| INF-002 | DIRECT+INDIRECT | TS-001, TS-006 |
| INF-003 | INFRASTRUCTURE | TS-004..007 (collector, not emitter) |
| INF-004 | NONE | US-04 |
| INF-005 | NONE | not in source |
| BM-061 | HIGH | TS-001, TS-009..011 |
| BM-062 | HIGH | TS-002, TS-003, TS-013, TS-017 |
| BM-063 | HIGH | TS-008 |
| BM-001..060 | PARTIAL | TS-008, TS-012 |
| FE-001..011 | NONE | — |
| DS-001..008 | INDIRECT | TS-007 |

---

## Status

entity_telemetry_complete: PARTIAL
coverage_high: CE-001, BM-061, BM-062, BM-063
coverage_none: CE-002, SA-002, INF-004, INF-005, FE-001..011
structure_modified: FALSE
