# Interface Telemetry
run_id: run_01_blueedge
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.3-RUN02-CONTRACT-v3
date: 2026-03-19

---

## Purpose

Attaches extracted telemetry to each canonical interface from the 40.3 interface map. Interface IDs are locked from 40.3. Telemetry attaches only to existing interfaces.

---

### INT-001 — REST API v1

interface_ref: INT-001
protocol: HTTP REST
entity_refs: CE-001 (provider), CE-002 (consumer via SD-001)
telemetry_coverage: PARTIAL

**Observable telemetry on INT-001:**

| Telemetry surface | Dimension | Evidence |
|------------------|-----------|---------|
| TS-012 — RequestLoggingInterceptor | Per-request log (method, path, status, duration) | CEU-08 :: app.module.ts APP_INTERCEPTOR |
| TS-011 — PerformanceMiddleware | Per-endpoint metrics; topSlowest(10) | CEU-08 :: health/health.controller.ts |
| Rate limiting | 429 responses from FleetThrottlerGuard | CEU-08 :: app.module.ts APP_GUARD |
| Swagger /docs | Static interface documentation (not runtime telemetry) | CEU-08 :: main.ts |

Per-endpoint telemetry: PerformanceMiddleware.getMetrics() collects per-path timing — accessible via GET /health/metrics. Schema of getMetrics() not fully read.

**API tag surface area**: 44+ API tag groups (Swagger tags) implying comparable route groups. Full endpoint count not evidenced per module (US-09 carried forward).

---

### INT-002 — REST API v2

interface_ref: INT-002
protocol: HTTP REST (URI versioned /api/v2/)
entity_refs: CE-001 (provider), CE-002 (consumer — partial)
telemetry_coverage: PARTIAL

Same telemetry infrastructure as INT-001 (RequestLoggingInterceptor, PerformanceMiddleware) applies globally.
v2-specific route telemetry not separately evidenced.
completeness: PARTIAL (US-10 — V2Module structure not fully read)

---

### INT-003 — WebSocket /fleet

interface_ref: INT-003
protocol: socket.io WebSocket (namespace /fleet)
entity_refs: CE-001 BM-062 (server), CE-002 FE-004 (client)
telemetry_coverage: HIGH

**Observable telemetry on INT-003:**

| Surface | Event | Interval | Dimensions |
|---------|-------|----------|-----------|
| TS-002 | fleet:positions | 2000ms | DIM-VP-001..006 per vehicle |
| TS-003 | vehicle:telemetry | 5000ms | DIM-VT-001..010, DIM-TK-001..003 (tanker) |
| TS-013 | alert:new | 15000-30000ms (random) | DIM-DE-007 |
| TS-017 | connection:ack | on connect | DIM-CS-001 |

**Message telemetry:**

| Client message | Server handler | Observable |
|---------------|----------------|-----------|
| subscribe:fleet | handleSubscribeFleet | room joined, vehicle count |
| subscribe:vehicle | handleSubscribeVehicle | vehicleId subscribed |
| subscribe:alerts | handleSubscribeAlerts | severity filter |
| subscribe:sessions | handleSubscribeSessions | session room |
| unsubscribe | handleUnsubscribe | room left |
| vehicle:command | handleVehicleCommand | command + vehicleId (logged) |
| request:snapshot | handleSnapshot | 10-vehicle position snapshot |

Connection count (DIM-CS-001) logged on each connect/disconnect event.

Evidence: CEU-08 :: src/gateways/fleet.gateway.ts

---

### INT-004 — Domain Event Bus

interface_ref: INT-004
protocol: in-process EventEmitter2 (@nestjs/event-emitter)
entity_refs: CE-001 BM-063 (emitter + handlers)
telemetry_coverage: PARTIAL

**Observable telemetry on INT-004:**

| Dimension | Observable via | Evidence |
|-----------|---------------|---------|
| DIM-ET-001 — total events emitted | /health/prometheus, /health | health.controller.ts — eventEmitter.getEventCount() |
| Event payload schemas | TS-008 per-event | fleet-events.ts — 10 typed interfaces |
| Per-event-type counters | NOT evidenced | getEventCount() returns aggregate only |

**65 event types by category (all observable via TS-008):**

| Category | Count | Representative events |
|----------|-------|----------------------|
| Vehicle lifecycle | 5 | vehicle.created, vehicle.updated, vehicle.position.updated |
| Telemetry | 2 | telemetry.received, telemetry.anomaly |
| Driver | 4 | driver.created, driver.score.changed |
| Driver Sessions | 4 | driver.session.started, driver.session.dwvs.computed |
| Trip | 6 | trip.created, trip.started, trip.completed, trip.delayed |
| Alert | 4 | alert.created, alert.escalated, alert.resolved |
| Safety | 3 | safety.event.detected, safety.score.updated |
| Maintenance | 4 | maintenance.workorder.created, maintenance.due |
| Fuel | 3 | fuel.transaction, fuel.theft.suspected, fuel.level.low |
| Tanker | 6 | tanker.cargo.loaded, tanker.tank.temp.breach, tanker.gas.leak |
| Cold Chain | 3 | coldchain.temp.breach, coldchain.shipment.loaded |
| EV | 4 | ev.charge.started, ev.battery.low, ev.battery.critical |
| V2G | 3 | v2g.session.started, v2g.grid.signal |
| OTA | 4 | ota.update.available, ota.update.completed, ota.update.failed |
| Geofence | 3 | geofence.entered, geofence.exited |
| Compliance | 3 | compliance.violation, compliance.expiring |
| Diagnostics | 3 | diagnostics.dtc.detected, diagnostics.predictive.failure |
| Finance | 3 | finance.transaction.created, finance.budget.exceeded |
| System | 3 | system.health.check, system.device.connected |

**Handler telemetry:**

| Handler | Action | Telemetry impact |
|---------|--------|-----------------|
| audit-log.handler | writes to INF-001 | DB write via BD-006 |
| cache-invalidation.handler | invalidates INF-002 keys | DIM-CP-001/002 affected |
| notification.handler | dispatches via BM-013 | request log via TS-012 if HTTP |
| websocket-broadcast.handler | emits via BM-062 | TS-002/TS-003/TS-013 |

---

### INT-005 — Prometheus Metrics

interface_ref: INT-005
protocol: HTTP OpenMetrics (text/plain; version=0.0.4)
entity_refs: CE-001 BM-061 (provider), INF-003 Prometheus (consumer via SD-008)
telemetry_coverage: HIGH

**This IS the primary Prometheus telemetry interface.**

| Metric | Dimension | Type |
|--------|-----------|------|
| blueedge_process_heap_bytes | DIM-PR-001 | gauge |
| blueedge_process_rss_bytes | DIM-PR-002 | gauge |
| blueedge_process_external_bytes | DIM-PR-003 | gauge |
| blueedge_cache_hits_total | DIM-CP-001 | gauge |
| blueedge_cache_misses_total | DIM-CP-002 | gauge |
| blueedge_cache_connected | DIM-CP-003 | gauge |
| blueedge_events_total | DIM-ET-001 | gauge |

Endpoint: GET /health/prometheus
Content-Type: text/plain; version=0.0.4; charset=utf-8
Consumed by: Prometheus at blueedge-api:3000, scrape_interval=10s
Evidence: CEU-08 :: health/health.controller.ts; CEU-10 :: prometheus.yml

---

### INT-006 — MQTT (SA-001 outbound)

interface_ref: INT-006
protocol: MQTT over TLS (port 8883)
entity_refs: SA-001 (publisher), INF-004 (broker)
telemetry_coverage: PARTIAL

**Observable telemetry on INT-006:**

| Observable | Value | Evidence |
|-----------|-------|---------|
| broker endpoint | mqtt.blueedge.network:8883 | CEU-10 :: hasi_bridge.py |
| topic prefix | blueedge/hasi | CEU-10 :: hasi_bridge.py |
| TLS mode | mutual TLS | CEU-10 :: hasi_bridge.py — mqtt_use_tls |
| publish frequency | every 30s poll cycle (batch ≤10) | DIM-PC-001, DIM-PC-002 |

MQTT payload schema NOT evidenced. Broker-side acknowledgment telemetry NOT evidenced.
completeness: PARTIAL (US-04, US-06)

---

### INT-007 — REST Fallback (SA-001 → CE-001)

interface_ref: INT-007
protocol: HTTPS REST
entity_refs: SA-001 (consumer), CE-001 (provider)
telemetry_coverage: PARTIAL

**Observable telemetry on INT-007:**

- Fallback activation implies MQTT (INT-006) unavailability
- On CE-001 side: requests from SA-001 appear in TS-012 (RequestLoggingInterceptor)
- SA-001 REST calls use X-API-Key header auth (not JWT) — distinguishable in request log

Evidence: CEU-10 :: hasi_bridge.py — cloud_api_url, cloud_api_key; CEU-08 :: main.ts (setGlobalPrefix, CORS config)

---

### INT-008 — Database

interface_ref: INT-008
protocol: TCP (pg driver, port 5432 default)
entity_refs: CE-001 (consumer), INF-001 PostgreSQL (provider)
telemetry_coverage: INDIRECT

**Observable telemetry on INT-008:**

| Observable | Surface | Evidence |
|-----------|---------|---------|
| PostgreSQL-level metrics | TS-007 postgres-exporter:9187 | CEU-10 :: prometheus.yml |
| TypeORM connection pool state | NOT evidenced | not read in extracted source |
| Per-query metrics | NOT evidenced | no query log configuration evidenced |

---

## Interface Telemetry Coverage Summary

| Interface | Coverage | Primary Surfaces |
|-----------|---------|-----------------|
| INT-001 | PARTIAL | TS-011, TS-012 |
| INT-002 | PARTIAL | TS-011, TS-012 (shared) |
| INT-003 | HIGH | TS-002, TS-003, TS-013, TS-017 |
| INT-004 | PARTIAL | TS-008; aggregate DIM-ET-001 |
| INT-005 | HIGH | IS the Prometheus metrics surface (TS-001) |
| INT-006 | PARTIAL | config-level only; broker PARTIAL |
| INT-007 | PARTIAL | TS-012 on CE-001 side |
| INT-008 | INDIRECT | TS-007 (postgres-exporter) |

---

## Status

interface_telemetry_complete: PARTIAL
coverage_high: INT-003, INT-005
coverage_partial: INT-001, INT-002, INT-004, INT-006, INT-007
coverage_indirect: INT-008
structure_modified: FALSE
