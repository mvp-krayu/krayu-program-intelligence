# Telemetry Surface Map
run_id: run_07_source_profiled_ingestion
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Purpose

Identifies all telemetry surfaces observable on the 40.3 canonical structure. A telemetry surface is a point in the system where telemetry is collected, emitted, exposed, or routed. No new structural elements are created; this map attaches only to existing 40.3 entities, dependencies, interfaces, and PEG nodes.

---

## Telemetry Surface Classification

| Class | Code | Description |
|-------|------|-------------|
| Metrics endpoint | TS-ME | A dedicated HTTP endpoint exporting metrics |
| Broadcast emission | TS-BE | A periodic or event-driven push of telemetry data |
| Domain event | TS-DE | A typed event carrying state-change telemetry |
| Scrape target | TS-ST | A Prometheus scrape target (pull-based collection) |
| Health endpoint | TS-HE | A health/readiness endpoint emitting operational state |
| Request log | TS-RL | A middleware layer emitting per-request telemetry |
| Poll cycle | TS-PC | A scheduled polling loop emitting data on each cycle |
| Performance collector | TS-PF | An in-process performance measurement layer |

---

## Telemetry Surfaces

### TS-001 — Prometheus Metrics Endpoint

surface_id: TS-001
class: TS-ME
entity_ref: CE-001 (BM-061 HealthModule, N-10)
interface_ref: INT-005
path: GET /health/prometheus
content_type: text/plain; version=0.0.4 (OpenMetrics)
evidence: CEU-08 :: health/health.controller.ts — prometheusMetrics() @Get('prometheus')
dimensions_exported:
- blueedge_process_heap_bytes
- blueedge_process_rss_bytes
- blueedge_process_external_bytes
- blueedge_cache_hits_total
- blueedge_cache_misses_total
- blueedge_cache_connected
- blueedge_events_total
consumed_by: TS-004 (Prometheus scrape job blueedge-api)

---

### TS-002 — WebSocket Fleet Positions Broadcast

surface_id: TS-002
class: TS-BE
entity_ref: CE-001 (BM-062 FleetGateway, N-09)
interface_ref: INT-003
event_name: fleet:positions
broadcast_interval: 2000ms (fixed setInterval)
rooms: fleet:all, fleet:tanker, fleet:bus, fleet:taxi
evidence: CEU-08 :: src/gateways/fleet.gateway.ts — startBroadcasts() positionInterval = setInterval(..., 2000)
payload_schema: VehiclePosition[] — {vehicleId, lat, lng, speed, heading, altitude, timestamp, status, fleetType}
fleet_vehicles_evidenced: 10 (TK-0847, TK-0923, TK-1105, TK-1250, BUS-201, BUS-305, BUS-412, TX-5501, TX-5622, TX-5789)

---

### TS-003 — WebSocket Vehicle Telemetry Broadcast

surface_id: TS-003
class: TS-BE
entity_ref: CE-001 (BM-062 FleetGateway, N-09)
interface_ref: INT-003
event_name: vehicle:telemetry
broadcast_interval: 5000ms (fixed setInterval)
room: vehicle:{vehicleId}
evidence: CEU-08 :: src/gateways/fleet.gateway.ts — telemetryInterval = setInterval(..., 5000)
payload_schema: TelemetryPayload — engine{rpm, coolantTempC, oilPressureKpa, fuelRateL}, vehicle{speedKmh, odometer, batteryVoltage}, tank{compartments[{id, levelPercent, tempC, pressureMbar}]}, safety{absActive, escActive, rollStabilityWarning}
fleet_type_conditional: tank compartment data emitted for fleetType='tanker' only

---

### TS-004 — Prometheus Scrape — Backend API

surface_id: TS-004
class: TS-ST
entity_ref: INF-003 (N-13)
dependency_ref: SD-008
target: blueedge-api:3000/health/prometheus
scrape_interval: 10s
labels: service='fleet-api', environment='production'
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — job_name: 'blueedge-api'

---

### TS-005 — Prometheus Scrape — Node Exporter (Host)

surface_id: TS-005
class: TS-ST
entity_ref: INF-003 (N-13)
dependency_ref: SD-009
target: node-exporter:9100
scrape_interval: 15s (global default)
labels: service='host-metrics'
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — job_name: 'node-exporter'

---

### TS-006 — Prometheus Scrape — Redis Exporter

surface_id: TS-006
class: TS-ST
entity_ref: INF-003 (N-13)
dependency_ref: SD-009
target: redis-exporter:9121
scrape_interval: 15s (global default)
labels: service='redis'
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — job_name: 'redis-exporter'

---

### TS-007 — Prometheus Scrape — PostgreSQL Exporter

surface_id: TS-007
class: TS-ST
entity_ref: INF-003 (N-13)
dependency_ref: SD-009
target: postgres-exporter:9187
scrape_interval: 15s (global default)
labels: service='postgres'
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — job_name: 'postgres-exporter'

---

### TS-008 — Domain Event Bus Emission

surface_id: TS-008
class: TS-DE
entity_ref: CE-001 (BM-063 FleetEventsModule, N-08)
interface_ref: INT-004
event_count: 65 typed events across 19 categories
base_schema: BaseFleetEvent — {event, timestamp, source, correlationId?, userId?, orgId?}
evidence: CEU-08 :: src/events/types/fleet-events.ts — FleetEvents constant; BaseFleetEvent interface
typed_payloads: VehiclePositionEvent, TelemetryEvent, DriverSessionEvent, AlertEvent, SafetyEventPayload, MaintenanceEvent, FuelEvent, GeofenceEvent, ColdChainEvent, EvEvent (10 typed interfaces evidenced)
handlers: audit-log.handler, cache-invalidation.handler, notification.handler, websocket-broadcast.handler

---

### TS-009 — Health Liveness Endpoint

surface_id: TS-009
class: TS-HE
entity_ref: CE-001 (BM-061 HealthModule, N-10)
path: GET /health
content_type: application/json
evidence: CEU-08 :: health/health.controller.ts — check() @Get()
payload_schema: {status, timestamp, service, version, uptime, memory{rss, heap}, cache, events{totalEmitted}}
consumed_by: kubernetes/docker liveness probe

---

### TS-010 — Health Readiness Endpoint

surface_id: TS-010
class: TS-HE
entity_ref: CE-001 (BM-061 HealthModule, N-10)
path: GET /health/ready
evidence: CEU-08 :: health/health.controller.ts — readiness() @Get('ready')
payload_schema: {status, checks{cache, events, logging}}
status_values: 'ready' | 'degraded'
degradation_trigger: cache not connected (Redis down, in-memory fallback active)

---

### TS-011 — Performance Metrics Endpoint

surface_id: TS-011
class: TS-PF
entity_ref: CE-001 (BM-061 HealthModule, N-10)
path: GET /health/metrics
evidence: CEU-08 :: health/health.controller.ts — metrics() @Get('metrics')
payload_schema: {endpoints: PerformanceMiddleware.getMetrics(), topSlowest: top10, cache, events, process{uptime, memoryMB, cpu}}
collector: PerformanceMiddleware (global middleware — CEU-08 common/logging)

---

### TS-012 — Request Logging Interceptor

surface_id: TS-012
class: TS-RL
entity_ref: CE-001 (global interceptor, N-05)
mechanism: APP_INTERCEPTOR — RequestLoggingInterceptor (global)
evidence: CEU-08 :: src/app.module.ts — APP_INTERCEPTOR: RequestLoggingInterceptor
scope: all HTTP requests to CE-001
dependency_ref: LD-001 (nest-winston, winston)

---

### TS-013 — WebSocket Alert Broadcast

surface_id: TS-013
class: TS-BE
entity_ref: CE-001 (BM-062 FleetGateway, N-09)
interface_ref: INT-003
event_name: alert:new
broadcast_interval: 15000–30000ms (random setInterval)
rooms: alerts:all, alerts:{severity}
evidence: CEU-08 :: src/gateways/fleet.gateway.ts — alertInterval = setInterval(..., random between 15000-30000)
payload_schema: AlertPayload — {id, vehicleId, type, severity, message, timestamp, metadata?}

---

### TS-014 — HASI Bridge Poll Cycle

surface_id: TS-014
class: TS-PC
entity_ref: SA-001 (N-16)
dependency_ref: SD-005
poll_interval: 30s (hasi_bridge.py poll_interval_sec = 30)
batch_size: 10 (hasi_bridge.py batch_size = 10)
source: HASI SQLite DB (/opt/hasi/data/hasi.db)
evidence: CEU-10 :: svg-agents/hasi-bridge/hasi_bridge.py — DEFAULT_CONFIG
output_surface: MQTT (TS-015) or REST fallback (TS-016)

---

### TS-015 — HASI MQTT Push

surface_id: TS-015
class: TS-BE
entity_ref: SA-001 (N-16)
interface_ref: INT-006
dependency_ref: SD-006
broker: mqtt.blueedge.network:8883
topic_prefix: blueedge/hasi
tls: mutual TLS
evidence: CEU-10 :: hasi_bridge.py — mqtt_broker, mqtt_port, mqtt_topic_prefix, mqtt_use_tls
completeness: PARTIAL (US-04 — broker implementation not in extracted source)

---

### TS-016 — HASI REST Fallback Push

surface_id: TS-016
class: TS-BE
entity_ref: SA-001 (N-16)
interface_ref: INT-007
dependency_ref: SD-007
endpoint: https://api.blueedge.network/api/v1
trigger: MQTT unavailable
evidence: CEU-10 :: hasi_bridge.py — cloud_api_url, cloud_api_key

---

### TS-017 — WebSocket Connection State

surface_id: TS-017
class: TS-HE
entity_ref: CE-001 (BM-062 FleetGateway, N-09)
interface_ref: INT-003
observable: connectedClients.size — logged on each connection/disconnection
evidence: CEU-08 :: fleet.gateway.ts — handleConnection() logs `total: ${this.connectedClients.size}`, handleDisconnect() same
events: connection:ack (on connect), implicit on disconnect

---

## Surface Coverage Summary

| Entity | Telemetry surfaces |
|--------|-------------------|
| CE-001 / N-05 | TS-001, TS-002, TS-003, TS-009, TS-010, TS-011, TS-012, TS-013, TS-017 |
| INF-003 / N-13 | TS-004, TS-005, TS-006, TS-007 |
| BM-063 / N-08 | TS-008 |
| SA-001 / N-16 | TS-014, TS-015, TS-016 |
| CE-002 / N-01 | None evidenced (FE-008 PWA offline queue is client-only) |
| INF-001 / N-11 | TS-007 (via postgres-exporter) |
| INF-002 / N-12 | TS-006 (via redis-exporter), TS-001 (cache metrics) |
| INF-004 / N-14 | TS-015 (broker endpoint only — PARTIAL) |
| SA-002 / N-17 | None evidenced (sensor_collector.py not read) |

---

## Unknown-Space — Telemetry Surfaces

| ID | Description |
|----|-------------|
| TUS-01 | SA-002 sensor collector telemetry surfaces unknown — sensor_collector.py not read |
| TUS-02 | MQTT broker internal telemetry unknown — INF-004 implementation not in extracted source |
| TUS-03 | Winston log destinations and structure not confirmed (logger configured but log format/targets not read) |
| TUS-04 | Per-module Prometheus custom metrics (if any) beyond BM-061 HealthModule not confirmed |
| TUS-05 | Frontend telemetry (browser performance, error tracking) not evidenced |

---

## Status

telemetry_surfaces_identified: 17
surfaces_complete: 15
surfaces_partial: 2 (TS-015, TS-014 partial due to US-04)
unknown_space_declared: 5
structure_modified: FALSE
