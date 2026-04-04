# Interface Map
run_id: run_03_blueedge_repeat
stream: Stream 40.3 — PiOS Reverse Engineering
contract: PIOS-40.3-RUN02-IG1E-REPEAT
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1E determinism re-run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; repeat of IG.1C for determinism verification

---

## Interface Classification

Interface types:
- REST: HTTP/HTTPS REST API endpoint group
- WS: WebSocket channel
- EVENT: Internal domain event bus
- METRICS: Observability/telemetry metrics endpoint
- MQTT: MQTT publish/subscribe channel
- DB: Database interface

---

## INT-001 — REST API v1

interface_id: INT-001
name: Blue Edge Fleet API v1
type: REST
protocol: HTTP/HTTPS
base_path: /api/v1/
default_version: 1 (URI-based versioning)
auth: Bearer JWT (Authorization header)
auth_mechanism: JwtAuthGuard (global)
content_type: application/json
evidence: CEU-08 src/main.ts — setGlobalPrefix('api'), enableVersioning(URI, defaultVersion: '1')

### API Tag Groups (evidenced from main.ts Swagger tags)

| Tag | Module | Notes |
|-----|--------|-------|
| auth | BM-064 | Authentication and authorization |
| vehicles | BM-001 | Vehicle management |
| drivers | BM-002 | Driver management |
| fleets | BM-003 | Fleet management |
| trips | BM-004 | Trip tracking |
| alerts | BM-005 | Alert management |
| tanker | BM-008 | Oil & gas tanker operations |
| bus | BM-009 | Bus transit operations |
| taxi | BM-010 | Taxi/ride-hail operations |
| operations | BM-011 | Fleet operations and dispatch |
| compliance | BM-017 | Regulatory compliance |
| finance | BM-019 | Finance and billing |
| safety | BM-018 | Safety and incidents |
| maintenance | BM-006 | Maintenance and work orders |
| fuel | BM-007 | Fuel management |
| devices | BM-012 | IoT device management |
| diagnostics | BM-016 | Vehicle diagnostics |
| coldchain | BM-021 | Cold chain monitoring |
| ota | BM-023 | OTA firmware updates |
| v2g | BM-024 | V2X communication |
| ev | BM-022 | EV fleet management |
| reports | BM-015 | Reports and exports |
| notifications | BM-013 | Notifications and webhooks |
| analytics | BM-014 | Analytics and dashboards |
| users | BM-020 | User management |
| health | BM-061 | Health checks and metrics |
| surge-pricing | BM-025 | Dynamic surge pricing |
| driver-incentives | BM-026 | Driver incentive programs |
| electrification | BM-027 | Fleet electrification planning |
| depot-charging | BM-028 | Depot charging infrastructure |
| executive | BM-029 | Executive dashboards |
| anomaly-detection | BM-030 | ML anomaly detection |
| cross-border | BM-031 | Cross-border compliance |
| permits | BM-032 | Permit and license management |
| parts-marketplace | BM-033 | Parts procurement |
| fleet-lifecycle | BM-034 | Fleet lifecycle management |
| driver-mobile | BM-035 | Driver mobile experience |
| fatigue-risk | BM-036 | Fatigue risk assessment |
| customer-portal | BM-037 | Customer self-service |
| blockchain | BM-038 | Blockchain verification |
| white-label | BM-039 | White-label theming |
| charging-stations | BM-040 | Charging station network |

Note: Remaining modules (BM-041 through BM-060) also expose REST endpoints. Full tag list not enumerated in main.ts Swagger builder but controllers are present in source.

### Special REST Paths (not versioned)

| Path | Handler | Evidence |
|------|---------|---------|
| /docs | Swagger UI | main.ts SwaggerModule.setup |
| /docs-json | OpenAPI JSON spec | main.ts app.getHttpAdapter().get('/docs-json') |
| /health | Liveness probe | health.controller.ts (VERSION_NEUTRAL) |
| /health/ready | Readiness probe | health.controller.ts |
| /health/metrics | Performance metrics | health.controller.ts |
| /health/cache/stats | Cache statistics | health.controller.ts |
| /health/cache/flush | Cache flush | health.controller.ts |
| /health/prometheus | Prometheus metrics export | health.controller.ts |

### Auth Interface

| Endpoint | Path | Function |
|---------|------|---------|
| Login | POST /api/v1/auth/login | Returns access_token + refresh_token |
| Refresh | POST /api/v1/auth/refresh | Token refresh with refresh_token body |

evidence: CEU-09 api/client.ts — /auth/refresh path; CEU-08 modules/auth/auth.controller.ts

---

## INT-002 — REST API v2

interface_id: INT-002
name: Blue Edge Fleet API v2
type: REST
protocol: HTTP/HTTPS
base_path: /api/v2/
evidence: CEU-08 src/main.ts (V2Module import); common/versioning/v2-controllers.ts
difference_from_v1: Enhanced response envelope (V2ResponseInterceptor); cursor-based pagination
deprecation: v1 deprecated 2027-06-30 (evidenced in main.ts startup log)
status: PARTIALLY EVIDENCED — V2Module present but full controller mapping requires deeper read

---

## INT-003 — WebSocket Interface (Fleet Namespace)

interface_id: INT-003
name: Blue Edge Fleet WebSocket
type: WS
protocol: WebSocket (socket.io)
namespace: /fleet
transport: websocket (polling fallback)
cors: origin=* (all origins in dev)
evidence: CEU-08 src/gateways/fleet.gateway.ts

### Server → Client Events (broadcasts)

| Event | Channel | Frequency | Payload |
|-------|---------|-----------|---------|
| fleet:positions | fleet:all, fleet:{type} | 2 seconds | {positions: VehiclePosition[], timestamp} |
| vehicle:position | vehicle:{vehicleId} | 2 seconds | VehiclePosition |
| vehicle:telemetry | vehicle:{vehicleId} | 5 seconds | TelemetryPayload |
| alert:new | alerts:all, alerts:{severity}, vehicle:{vehicleId} | 15-30 seconds (random) | AlertPayload |
| fleet:snapshot | (response) | on request | {positions, timestamp, count} |
| connection:ack | (direct to client) | on connect | {clientId, serverTime, vehicles} |
| command:ack | (response) | on command | {vehicleId, command, status, queuedAt} |
| subscribed | (response) | on subscribe | {room, count} |
| unsubscribed | (response) | on unsubscribe | {room} |

### Client → Server Messages (subscriptions/commands)

| Message | Payload | Function |
|---------|---------|---------|
| subscribe:fleet | {fleetType?: string} | Join fleet:all or fleet:{type} room |
| subscribe:vehicle | {vehicleId: string} | Join vehicle:{vehicleId} room |
| subscribe:alerts | {severity?: string} | Join alerts:all or alerts:{severity} room |
| subscribe:sessions | {vehicleId?: string} | Join sessions:vehicle:{vehicleId} or sessions:all |
| unsubscribe | {room: string} | Leave named room |
| vehicle:command | {vehicleId, command, params} | Queue vehicle command (→ MQTT/SVG device in production) |
| request:snapshot | (none) | Request immediate position snapshot |

### WebSocket Payload Types (from evidence)

VehiclePosition fields: vehicleId, lat, lng, speed, heading, altitude, timestamp, status (moving/idle/stopped/offline), fleetType (tanker/bus/taxi)

TelemetryPayload fields: vehicleId, timestamp, engine {rpm, coolantTempC, oilPressureKpa, fuelRateL}, vehicle {speedKmh, odometer, batteryVoltage}, tank? {compartments[]}, safety {absActive, escActive, rollStabilityWarning}

AlertPayload fields: id, vehicleId, type, severity (critical/high/medium/low), message, timestamp, metadata

---

## INT-004 — Domain Event Bus

interface_id: INT-004
name: Blue Edge Fleet Domain Event Bus
type: EVENT
mechanism: @nestjs/event-emitter (EventEmitter2)
evidence: CEU-08 events/types/fleet-events.ts — FleetEvents constant; events/fleet-event-emitter.service.ts

### Event Categories and Names (65 defined events)

| Category | Event names |
|----------|------------|
| Vehicle lifecycle | vehicle.created, vehicle.updated, vehicle.decommissioned, vehicle.position.updated, vehicle.status.changed |
| Telemetry | telemetry.received, telemetry.anomaly |
| Driver | driver.created, driver.updated, driver.assigned, driver.unassigned, driver.score.changed |
| Driver Sessions (DWVS) | driver.session.started, driver.session.closed, driver.session.interrupted, driver.session.dwvs.computed |
| Trip | trip.created, trip.started, trip.completed, trip.cancelled, trip.delayed, trip.waypoint.reached |
| Alert | alert.created, alert.acknowledged, alert.resolved, alert.escalated |
| Safety | safety.event.detected, safety.event.reviewed, safety.score.updated |
| Maintenance | maintenance.workorder.created, maintenance.workorder.completed, maintenance.due, maintenance.overdue |
| Fuel | fuel.transaction, fuel.theft.suspected, fuel.level.low |
| Tanker | tanker.cargo.loaded, tanker.cargo.delivered, tanker.custody.transfer, tanker.tank.temp.breach, tanker.tank.pressure.alarm, tanker.gas.leak |
| Cold chain | coldchain.temp.breach, coldchain.shipment.loaded, coldchain.shipment.delivered |
| EV | ev.charge.started, ev.charge.completed, ev.battery.low, ev.battery.critical |
| V2G | v2g.session.started, v2g.session.completed, v2g.grid.signal |
| OTA | ota.update.available, ota.update.started, ota.update.completed, ota.update.failed |
| Geofence | geofence.entered, geofence.exited, geofence.dwell |
| Compliance | compliance.violation, compliance.expiring, compliance.renewed |
| Diagnostics | diagnostics.dtc.detected, diagnostics.dtc.cleared, diagnostics.predictive.failure |
| Finance | finance.transaction.created, finance.transaction.approved, finance.budget.exceeded |
| System | system.health.check, system.device.connected, system.device.disconnected |

### Event Consumers (evidenced handlers)

| Handler | Function |
|---------|---------|
| audit-log.handler.ts | Writes audit log entries for domain events |
| cache-invalidation.handler.ts | Invalidates Redis cache on domain events |
| notification.handler.ts | Dispatches notifications on relevant events |
| websocket-broadcast.handler.ts | Broadcasts events to WebSocket subscribers via FleetGateway |

---

## INT-005 — Prometheus Metrics Endpoint

interface_id: INT-005
name: Prometheus OpenMetrics Export
type: METRICS
path: /health/prometheus
content_type: text/plain; version=0.0.4
scrape_interval: 10 seconds (Prometheus pull)
evidence: CEU-08 health/health.controller.ts; CEU-10 monitoring/prometheus/prometheus.yml

### Exported Metrics (from evidence)

| Metric | Type | Description |
|--------|------|-------------|
| blueedge_process_heap_bytes | gauge | Node.js heap memory used |
| blueedge_process_rss_bytes | gauge | Node.js RSS memory |
| blueedge_process_external_bytes | gauge | Node.js external memory |
| blueedge_cache_hits_total | gauge | Redis cache hits |
| blueedge_cache_misses_total | gauge | Redis cache misses |
| blueedge_cache_connected | gauge | Redis connection status (0/1) |
| blueedge_events_total | gauge | Total domain events emitted |

Additional custom metrics: PARTIAL — PrometheusService.ts present (src/health/prometheus.service.ts) but full metric list requires deeper read

---

## INT-006 — MQTT Interface (SVG Agent → Cloud)

interface_id: INT-006
name: HASI Bridge MQTT Channel
type: MQTT
broker: mqtt.blueedge.network:8883
tls: mutual TLS (client cert + CA cert)
topic_prefix: blueedge/hasi/{...}
direction: SA-001 (HASI Bridge) → INF-004 (MQTT Broker)
evidence: CEU-10 hasi_bridge.py — mqtt_broker, mqtt_port, mqtt_topic_prefix, mqtt_client_cert, mqtt_ca_cert

payload_content: HASI analysis results (captures, threats, recommendations from HASI SQLite DB)
batch_size: 10 items per push (default)

receiver_of_mqtt_messages: PARTIALLY EVIDENCED — CE-001 backend is inferred consumer but MQTT subscription path in backend source not directly read at this depth

---

## INT-007 — REST Fallback Interface (SVG Agent → Cloud API)

interface_id: INT-007
name: HASI Bridge REST Fallback
type: REST
protocol: HTTPS
endpoint: https://api.blueedge.network/api/v1
auth: API key (BLUEEDGE_API_KEY env)
direction: SA-001 (HASI Bridge) → CE-001 (Backend API)
usage: fallback when MQTT is unavailable
evidence: CEU-10 hasi_bridge.py — cloud_api_url, cloud_api_key config

---

## INT-008 — Database Interface

interface_id: INT-008
name: Backend-to-PostgreSQL Data Interface
type: DB
driver: TypeORM (pg)
connection: host, port, username, password, database from DatabaseConfig
migrations: TypeORM migration files (src/migrations/*.ts) + raw SQL (migrations/init.sql)
entities: 61 TypeORM entities across 57 modules
access_pattern: Repository pattern (@InjectRepository in each module service)
evidence: CEU-08 src/config/database.config.ts, src/config/data-source.ts, migrations/init.sql

---

## Interface Summary

| Interface ID | Name | Type | Status |
|-------------|------|------|--------|
| INT-001 | REST API v1 | REST | COMPLETE |
| INT-002 | REST API v2 | REST | PARTIAL |
| INT-003 | WebSocket /fleet | WS | COMPLETE |
| INT-004 | Domain Event Bus | EVENT | COMPLETE |
| INT-005 | Prometheus Metrics | METRICS | PARTIAL |
| INT-006 | MQTT (SVG → Cloud) | MQTT | PARTIAL (receiver not read) |
| INT-007 | REST Fallback (SVG → Cloud) | REST | COMPLETE |
| INT-008 | Database (Backend → PostgreSQL) | DB | COMPLETE |

---

## Unknown-Space at Interface Level

- US-09: Full REST API endpoint list beyond Swagger tags (exact path/method for all 63 modules not enumerated)
- US-10: INT-002 (v2) full controller structure not read
- US-05 (from entity catalog): Full Prometheus metric list (PrometheusService.ts not read)
- US-06 (carried): MQTT subscription path in CE-001 backend not directly evidenced

---

## Status

interface_map_complete: PARTIAL (per declared unknown-space)
evidence_boundary_compliance: CONFIRMED
prohibited_paths_accessed: NONE
