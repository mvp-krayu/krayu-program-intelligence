# Dependency Telemetry
run_id: run_01_blueedge
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.3-RUN02-CONTRACT-v3
date: 2026-03-19

---

## Purpose

Attaches extracted telemetry to each canonical dependency from the 40.3 dependency map. Telemetry attaches only to existing dependencies. No new dependencies are created. Dependency IDs are locked from 40.3.

---

## System-Level Dependency Telemetry

### SD-001 — Frontend depends on Backend API

dependency_ref: SD-001 (CE-002 → CE-001, REST HTTP/HTTPS)
telemetry_coverage: PARTIAL

Observable telemetry on this dependency path:
- **Request logging**: each HTTP request across SD-001 is captured by RequestLoggingInterceptor (TS-012) on the CE-001 side
- **Performance middleware**: per-endpoint timing available via TS-011 (PerformanceMiddleware.getMetrics())
- **Rate limiting**: FleetThrottlerGuard enforces rate limits; 429 responses observable via request log
- **JWT validation**: 401 responses from BD-001 guard observable via request log

evidence: CEU-08 :: app.module.ts — APP_INTERCEPTOR: RequestLoggingInterceptor, APP_GUARD: FleetThrottlerGuard
telemetry_dimensions: DIM-RP (per-endpoint performance metrics)

unknown: per-request latency schema (PerformanceMiddleware.getMetrics() schema not read)

---

### SD-002 — Frontend WebSocket depends on Backend Gateway

dependency_ref: SD-002 (CE-002 FE-004 → CE-001 BM-062, WebSocket)
telemetry_coverage: HIGH

Observable telemetry:
- **Connection events**: handleConnection/handleDisconnect log client count (TS-017) — DIM-CS-001
- **Broadcast cycles**: position 2s (TS-002), telemetry 5s (TS-003), alerts 15-30s (TS-013)
- **Subscription messages**: subscribe:fleet, subscribe:vehicle, subscribe:alerts, subscribe:sessions all logged (fleet.gateway.ts Logger)

evidence: CEU-08 :: src/gateways/fleet.gateway.ts — handleConnection(), handleDisconnect(), startBroadcasts()
telemetry_dimensions: DIM-CS-001, DIM-VP-001..006, DIM-VT-001..010, DIM-TK-001..003, DIM-DE-007

---

### SD-003 — Backend API depends on PostgreSQL

dependency_ref: SD-003 (CE-001 → INF-001, TypeORM)
telemetry_coverage: INDIRECT

Observable telemetry:
- **postgres-exporter**: TS-007 scrapes postgres-exporter:9187 at 15s intervals
- Standard postgres-exporter metrics include connections, queries, locks, replication lag (standard — not directly evidenced in extracted source)

direct_evidence: CEU-10 :: prometheus.yml — scrape target postgres-exporter:9187
individual_query_telemetry: NOT evidenced in extracted source

---

### SD-004 — Backend API depends on Redis

dependency_ref: SD-004 (CE-001 → INF-002, ioredis)
telemetry_coverage: HIGH

Observable telemetry:
- **DIM-CP-001** cache_hits_total — via TS-001 Prometheus export
- **DIM-CP-002** cache_misses_total — via TS-001 Prometheus export
- **DIM-CP-003** cache_connected — binary state (1=up, 0=degraded) — via TS-001 and TS-010
- **redis-exporter**: TS-006 scrapes redis-exporter:9121 at 15s intervals

evidence: CEU-08 :: health/health.controller.ts — cacheService.getStats()

---

### SD-005 — HASI Bridge depends on HASI System

dependency_ref: SD-005 (SA-001 → INF-005, SQLite polling)
telemetry_coverage: PARTIAL

Observable telemetry:
- **Poll interval**: 30s (DIM-PC-001) — configuration-level observable
- **Batch size**: 10 (DIM-PC-002) — configuration-level observable
- Actual record counts per poll cycle NOT evidenced (return value of SQLite query not read)

evidence: CEU-10 :: hasi_bridge.py DEFAULT_CONFIG

---

### SD-006 — HASI Bridge depends on MQTT Broker (primary)

dependency_ref: SD-006 (SA-001 → INF-004, MQTT)
telemetry_coverage: PARTIAL

Observable telemetry:
- **Topic prefix**: blueedge/hasi (CEU-10 :: hasi_bridge.py — mqtt_topic_prefix)
- **TLS state**: mutual TLS configured (binary up/down)
- MQTT message payload schema NOT read
- Broker-side acknowledgment telemetry NOT evidenced

evidence: CEU-10 :: hasi_bridge.py — mqtt_enabled, mqtt_broker config
completeness: PARTIAL (US-04 — broker not in extracted source)

---

### SD-007 — HASI Bridge depends on Backend API (fallback)

dependency_ref: SD-007 (SA-001 → CE-001, HTTPS REST fallback)
telemetry_coverage: PARTIAL

Observable telemetry:
- Fallback activation implies MQTT (SD-006) unavailability — binary state observable
- REST responses visible in CE-001 request log (TS-012)
- API key auth: BLUEEDGE_API_KEY (CEU-10 :: hasi_bridge.py)

evidence: CEU-10 :: hasi_bridge.py — cloud_api_url, cloud_api_key

---

### SD-008 — Monitoring depends on Backend API metrics

dependency_ref: SD-008 (INF-003 → CE-001 BM-061, Prometheus pull)
telemetry_coverage: HIGH

Observable telemetry:
- This IS the primary telemetry collection path for CE-001
- Scrape interval: 10s (CEU-10 :: prometheus.yml — blueedge-api job)
- All 7 Prometheus dimensions (DIM-PR-001..003, DIM-CP-001..003, DIM-ET-001) collected via this path
- Labels: service='fleet-api', environment='production'

evidence: CEU-10 :: prometheus.yml — job_name: 'blueedge-api', metrics_path: '/health/prometheus', scrape_interval: 10s

---

### SD-009 — Monitoring depends on infrastructure exporters

dependency_ref: SD-009 (INF-003 → INF-001, INF-002, host exporters)
telemetry_coverage: HIGH

Observable telemetry:
- **node-exporter:9100**: host CPU, memory, disk, network (standard — scrape configured at 15s)
- **redis-exporter:9121**: Redis metrics (scrape configured at 15s)
- **postgres-exporter:9187**: PostgreSQL metrics (scrape configured at 15s)

evidence: CEU-10 :: prometheus.yml — 3 scrape jobs with static_configs targets

---

## Backend Internal Dependency Telemetry

### BD-001 — Domain modules depend on Auth module

dependency_ref: BD-001 (BM-001..060 → BM-064, JWT guard)
telemetry_coverage: INDIRECT

JWT auth results observable via RequestLoggingInterceptor (TS-012):
- 401 Unauthorized = JWT validation failed
- 403 Forbidden = role check failed
No dedicated auth metrics endpoint evidenced

---

### BD-002 — Health module depends on Cache, Events, Prometheus

dependency_ref: BD-002 (BM-061 → INF-002, BM-063, PrometheusService)
telemetry_coverage: HIGH

This dependency IS the primary telemetry aggregation point. Health controller collects:
- DIM-CP-001..003 from CacheService (INF-002 side)
- DIM-ET-001 from FleetEventEmitter (BM-063 side)
- DIM-PR-001..005 from process.*

evidence: CEU-08 :: health/health.controller.ts — constructor dependencies

---

### BD-003 — Domain modules emit events to EventEmitter

dependency_ref: BD-003 (BM-001..060 → BM-063, EventEmitter2)
telemetry_coverage: PARTIAL

Observable telemetry:
- DIM-ET-001 total events emitted — aggregate counter only
- Per-event-type counts NOT evidenced (no per-topic counter in health controller)
- All 65 event schemas evidenced (fleet-events.ts) — payload telemetry on event

evidence: CEU-08 :: events/types/fleet-events.ts, health/health.controller.ts — getEventCount()

---

### BD-004 — Event handlers depend on Gateway (WebSocket broadcast)

dependency_ref: BD-004 (BM-063 handlers → BM-062, WebSocket)
telemetry_coverage: INDIRECT

WebSocket broadcast observable at SD-002 level (TS-017, TS-002, TS-003, TS-013). No direct handler-level telemetry evidenced.

---

### BD-005 — Event handlers depend on Cache (cache invalidation)

dependency_ref: BD-005 (BM-063 handlers → INF-002, cache invalidation)
telemetry_coverage: INDIRECT

Cache state after invalidation observable via DIM-CP-001..003. Per-invalidation-event count NOT evidenced.

---

### BD-006 — Domain modules depend on TypeORM

dependency_ref: BD-006 (BM-001..060 → INF-001, TypeORM)
telemetry_coverage: INDIRECT

PostgreSQL metrics via TS-007 (postgres-exporter). Per-module query telemetry NOT evidenced. TypeORM query logging not confirmed in extracted source beyond TypeORM forRootAsync configuration.

---

### BD-007 — Version middleware depends on all API routes

dependency_ref: BD-007 (BM-065 → all controllers)
telemetry_coverage: INDIRECT

Route traversal observable via TS-012 (RequestLoggingInterceptor). No versioning-specific telemetry surface evidenced.

---

## Frontend Internal Dependency Telemetry

### FD-001 through FD-005

Frontend internal dependencies are browser-side. No server-observable telemetry surfaces evidenced for frontend internal routing, auth context, or component dependencies.

FD-001 (pages → API client): SD-001 request telemetry covers the outbound HTTP calls
FD-002 (API client → Auth context): localStorage token operations — no server telemetry
FD-003 (realtime components → WebSocket): SD-002 WebSocket telemetry covers the socket
FD-004 (pages → Auth context): client-side only
FD-005 (pages → Router): client-side only

---

## Library Dependency Telemetry

### LD-001 — Backend runtime library dependencies

LD-001 library telemetry embedded in CE-001 surfaces. Key library-level telemetry:
- **nest-winston**: log output (TS-012 implicitly) — format/destination not evidenced
- **@nestjs/throttler**: rate limit state (observable as 429 in request log)
- **typeorm**: query execution (observable via postgres-exporter)

### LD-002 — Frontend runtime library dependencies

No server-observable telemetry from CE-002 library dependencies.

---

## Dependency Telemetry Coverage Summary

| Dependency | Coverage | Primary Observation Path |
|-----------|---------|--------------------------|
| SD-001 | PARTIAL | TS-012 (request log on CE-001 side) |
| SD-002 | HIGH | TS-002, TS-003, TS-013, TS-017 |
| SD-003 | INDIRECT | TS-007 (postgres-exporter) |
| SD-004 | HIGH | TS-001 (DIM-CP-001..003), TS-006 |
| SD-005 | PARTIAL | DIM-PC-001, DIM-PC-002 (config) |
| SD-006 | PARTIAL | config-level only; PARTIAL (US-04) |
| SD-007 | PARTIAL | TS-012 on CE-001 side when fallback active |
| SD-008 | HIGH | IS the primary Prometheus collection path |
| SD-009 | HIGH | 3 exporter scrape targets at 15s |
| BD-001 | INDIRECT | TS-012 |
| BD-002 | HIGH | IS the health telemetry aggregation point |
| BD-003 | PARTIAL | DIM-ET-001 aggregate only |
| BD-004..007 | INDIRECT | via shared surfaces |
| FD-001..005 | NONE (server) | client-side only |
| LD-001 | INDIRECT | embedded in CE-001 surfaces |
| LD-002 | NONE (server) | client-side only |

---

## Status

dependency_telemetry_complete: PARTIAL
structure_modified: FALSE
