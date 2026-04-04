# Structural Traceability Map
run_id: run_06_orchestrated_ingestion
stream: Stream 40.3 — PiOS Reverse Engineering
contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Traceability Principle

Every structural element in this reconstruction traces to a specific evidence source.

No structure without evidence. No evidence claim without file reference.

Evidence source notation: [CEU-ID :: file_path]

---

## Entity Traceability

### CE-001 — Backend API Application

| Structural claim | Evidence source |
|-----------------|----------------|
| Application name: blue-edge-fleet-api v2.17.0 | [CEU-08 :: backend/package.json] |
| Framework: NestJS v10 | [CEU-08 :: backend/package.json — @nestjs/common ^10.3.0] |
| Language: TypeScript 5.3 | [CEU-08 :: backend/package.json — typescript ^5.3.3] |
| Runtime port: 3001 | [CEU-08 :: backend/src/main.ts — process.env.PORT || 3001] |
| API prefix: /api | [CEU-08 :: backend/src/main.ts — setGlobalPrefix('api')] |
| API versioning: URI-based v1/v2 | [CEU-08 :: backend/src/main.ts — enableVersioning(VersioningType.URI, defaultVersion: '1')] |
| Production servers: api.blueedge.ae, api.blueedge.ch | [CEU-08 :: backend/src/main.ts — Swagger addServer calls] |
| ORM: TypeORM v0.3.19 | [CEU-08 :: backend/package.json] |
| Database driver: pg v8.11 | [CEU-08 :: backend/package.json] |
| Cache: ioredis + cache-manager | [CEU-08 :: backend/package.json] |
| Auth: passport-jwt | [CEU-08 :: backend/package.json] |
| WebSocket: socket.io (platform-socket.io) | [CEU-08 :: backend/package.json] |
| Logging: nest-winston + winston | [CEU-08 :: backend/package.json] |
| 63 domain modules registered | [CEU-08 :: backend/src/app.module.ts — full imports list] |
| Global JWT guard | [CEU-08 :: backend/src/common/guards/jwt-auth.guard.ts] |
| Global rate limiting | [CEU-08 :: backend/src/app.module.ts — APP_GUARD: FleetThrottlerGuard] |
| Global request logging interceptor | [CEU-08 :: backend/src/app.module.ts — APP_INTERCEPTOR: RequestLoggingInterceptor] |
| Global exception filter | [CEU-08 :: backend/src/app.module.ts — APP_FILTER: GlobalExceptionFilter] |
| Swagger UI at /docs | [CEU-08 :: backend/src/main.ts — SwaggerModule.setup('docs')] |
| OpenAPI JSON at /docs-json | [CEU-08 :: backend/src/main.ts — app.getHttpAdapter().get('/docs-json')] |

---

### CE-002 — Frontend Application

| Structural claim | Evidence source |
|-----------------|----------------|
| Application name: blueedge-fleet-frontend v3.15.0 | [CEU-09 :: frontend/package.json] |
| Framework: React 18.3 | [CEU-09 :: frontend/package.json — react ^18.3.1] |
| Language: TypeScript 5.3 | [CEU-09 :: frontend/package.json — typescript ^5.3.3] |
| Bundler: Vite 5 | [CEU-09 :: frontend/package.json — vite ^5.0.12] |
| CSS: Tailwind CSS 3.4 | [CEU-09 :: frontend/package.json — tailwindcss ^3.4.1] |
| Routing: react-router-dom v6 | [CEU-09 :: frontend/package.json — react-router-dom ^6.22.0] |
| Charts: Chart.js 4 + react-chartjs-2 | [CEU-09 :: frontend/package.json] |
| Maps: Leaflet 1.9 + react-leaflet | [CEU-09 :: frontend/package.json] |
| WebSocket client: socket.io-client 4.7 | [CEU-09 :: frontend/package.json] |
| PWA enabled | [CEU-09 :: frontend/public/manifest.json, public/sw.js, public/offline.html, pwa/register.ts] |
| I18n support | [CEU-09 :: frontend/contexts/I18nContext.tsx, frontend/constants/translations.ts] |
| RTL support | [CEU-09 :: frontend/styles/rtl.css] |
| Testing: Vitest + Cypress + Storybook | [CEU-09 :: frontend/package.json — vitest, cypress, storybook] |
| CORS origin: localhost:5173 (default) | [CEU-08 :: backend/src/main.ts — WS_CORS_ORIGIN || 'http://localhost:5173'] |
| API target configured via VITE_API_URL | [CEU-09 :: frontend/api/client.ts — import.meta.env.VITE_API_URL || 'http://localhost:3001'] |

---

### SA-001 — HASI Bridge Agent

| Structural claim | Evidence source |
|-----------------|----------------|
| Language: Python 3 | [CEU-10 :: svg-agents/hasi-bridge/hasi_bridge.py — shebang] |
| Deployment: /opt/blueedge/hasi-bridge/ | [CEU-10 :: hasi_bridge.py — docstring] |
| Systemd service name: blueedge-hasi-bridge | [CEU-10 :: svg-agents/systemd/blueedge-hasi-bridge.service] |
| HASI SQLite poll path: /opt/hasi/data/hasi.db | [CEU-10 :: hasi_bridge.py — DEFAULT_CONFIG hasi_db_path] |
| MQTT broker: mqtt.blueedge.network:8883 | [CEU-10 :: hasi_bridge.py — DEFAULT_CONFIG mqtt_broker, mqtt_port] |
| MQTT TLS: enabled | [CEU-10 :: hasi_bridge.py — mqtt_use_tls = true] |
| MQTT topic prefix: blueedge/hasi | [CEU-10 :: hasi_bridge.py — mqtt_topic_prefix] |
| REST fallback: https://api.blueedge.network/api/v1 | [CEU-10 :: hasi_bridge.py — cloud_api_url] |
| Poll interval: 30 seconds | [CEU-10 :: hasi_bridge.py — poll_interval_sec = 30] |
| Batch size: 10 | [CEU-10 :: hasi_bridge.py — batch_size = 10] |
| Config: /opt/blueedge/config/blueedge.yaml | [CEU-10 :: hasi_bridge.py — docstring + DEFAULT_CONFIG] |

---

### INF-001 — PostgreSQL Database

| Structural claim | Evidence source |
|-----------------|----------------|
| Database type: PostgreSQL | [CEU-08 :: backend/src/config/database.config.ts] |
| Extension: uuid-ossp | [CEU-08 :: backend/migrations/init.sql — CREATE EXTENSION uuid-ossp] |
| Extension: postgis | [CEU-08 :: backend/migrations/init.sql — CREATE EXTENSION postgis] |
| Extension: timescaledb | [CEU-08 :: backend/migrations/init.sql — CREATE EXTENSION timescaledb CASCADE] |
| Default database: fleet_management | [CEU-08 :: backend/src/app.module.ts — database.name default] |
| Default user: blueedge | [CEU-08 :: backend/src/app.module.ts — database.username default] |
| 61 TypeORM entities across 57 modules | [CEU-08 :: backend/migrations/init.sql — comment] |
| Monitoring: postgres-exporter:9187 | [CEU-10 :: monitoring/prometheus/prometheus.yml] |

---

### INF-002 — Redis Cache

| Structural claim | Evidence source |
|-----------------|----------------|
| Client: ioredis v5.9 | [CEU-08 :: backend/package.json — ioredis] |
| Cache manager: cache-manager-ioredis-yet | [CEU-08 :: backend/package.json] |
| Auto-fallback to in-memory | [CEU-08 :: backend/src/health/health.controller.ts — cacheStats.connected ? 'ready' : 'degraded'] |
| Cache module: RedisCacheModule | [CEU-08 :: backend/src/app.module.ts — RedisCacheModule import] |
| HTTP cache interceptor: global | [CEU-08 :: backend/src/app.module.ts — APP_INTERCEPTOR: HttpCacheInterceptor] |
| Monitoring: redis-exporter:9121 | [CEU-10 :: monitoring/prometheus/prometheus.yml] |

---

### INF-003 — Monitoring Stack

| Structural claim | Evidence source |
|-----------------|----------------|
| Prometheus config present | [CEU-10 :: monitoring/prometheus/prometheus.yml] |
| Grafana dashboard: fleet-operations.json | [CEU-10 :: monitoring/grafana/dashboards/fleet-operations.json] |
| Prometheus scrapes backend API at /health/prometheus | [CEU-10 :: monitoring/prometheus/prometheus.yml — job blueedge-api] |
| Scrape interval: 10s (API), 15s (default) | [CEU-10 :: monitoring/prometheus/prometheus.yml] |

---

## Domain Module Traceability

All 63 domain modules (BM-001 through BM-060, BM-064, BM-065) trace to:

| Evidence type | Source reference |
|--------------|-----------------|
| Module existence | [CEU-08 :: backend/src/modules/{name}/ — directory presence confirmed] |
| Module registration | [CEU-08 :: backend/src/app.module.ts — explicit import of each module class] |
| Module structure pattern | [CEU-08 :: backend/src/modules/{name}/{name}.controller.ts, .module.ts, .service.ts, .spec.ts] |

Module-specific traceability (representative samples):

| Module | Trace anchor |
|--------|-------------|
| auth | [CEU-08 :: src/app.module.ts comment: "Auth"], [CEU-08 :: src/modules/auth/auth.module.ts] |
| vehicles | [CEU-08 :: src/app.module.ts comment: "Core domain (7 modules, 66 endpoints)"] |
| drivers | Same as vehicles grouping |
| hasi | [CEU-08 :: src/app.module.ts — "Session 33: External Sensors + HASI Network Security (2 modules, ~25 endpoints)"] |
| sensors | Same as hasi grouping |
| driver-sessions | [CEU-08 :: src/app.module.ts — "Session 32: Vehicle 360° Lifecycle Intelligence (2 modules, ~18 endpoints)"] |
| vehicle-lifecycle | Same as driver-sessions grouping |

---

## Interface Traceability

### INT-001 — REST API v1

| Interface claim | Evidence source |
|----------------|----------------|
| 44+ API tag groups | [CEU-08 :: backend/src/main.ts — all addTag() calls] |
| /docs Swagger UI | [CEU-08 :: backend/src/main.ts — SwaggerModule.setup] |
| /health endpoints (VERSION_NEUTRAL) | [CEU-08 :: backend/src/health/health.controller.ts — @Controller({path: 'health', version: VERSION_NEUTRAL})] |
| Excluded from global prefix: health paths | [CEU-08 :: backend/src/main.ts — setGlobalPrefix exclude list] |

### INT-003 — WebSocket Interface

| Interface claim | Evidence source |
|----------------|----------------|
| Namespace: /fleet | [CEU-08 :: src/gateways/fleet.gateway.ts — @WebSocketGateway namespace: '/fleet'] |
| fleet:positions broadcast every 2s | [CEU-08 :: fleet.gateway.ts — positionInterval setInterval 2000] |
| vehicle:telemetry broadcast every 5s | [CEU-08 :: fleet.gateway.ts — telemetryInterval setInterval 5000] |
| alert:new broadcast 15-30s | [CEU-08 :: fleet.gateway.ts — alertInterval setInterval random] |
| subscribe:fleet, subscribe:vehicle, subscribe:alerts, subscribe:sessions messages | [CEU-08 :: fleet.gateway.ts — @SubscribeMessage handlers] |
| vehicle:command message | [CEU-08 :: fleet.gateway.ts — handleVehicleCommand] |
| request:snapshot message | [CEU-08 :: fleet.gateway.ts — handleSnapshot] |

### INT-004 — Domain Event Bus

| Interface claim | Evidence source |
|----------------|----------------|
| 65 event names defined | [CEU-08 :: src/events/types/fleet-events.ts — FleetEvents constant, all keys enumerated] |
| 4 event handler files | [CEU-08 :: src/events/handlers/ — audit-log.handler.ts, cache-invalidation.handler.ts, notification.handler.ts, websocket-broadcast.handler.ts] |
| BaseFleetEvent structure: event, timestamp, source, correlationId, userId, orgId | [CEU-08 :: src/events/types/fleet-events.ts — BaseFleetEvent interface] |
| DriverSessionEvent includes DWVS fields | [CEU-08 :: src/events/types/fleet-events.ts — DriverSessionEvent interface: dwvs, blockHash, tpmSigned, authMethod] |

### INT-005 — Prometheus Metrics

| Interface claim | Evidence source |
|----------------|----------------|
| Endpoint: /health/prometheus | [CEU-08 :: health/health.controller.ts — @Get('prometheus')] |
| Content-Type: text/plain OpenMetrics format | [CEU-08 :: health/health.controller.ts — @Header('Content-Type', 'text/plain; version=0.0.4')] |
| 7 evidenced metrics (blueedge_process_heap_bytes etc.) | [CEU-08 :: health/health.controller.ts — prometheus.setGauge() calls] |

---

## Database Schema Traceability

| Schema claim | Evidence source |
|-------------|----------------|
| users table structure | [CEU-08 :: backend/migrations/init.sql — CREATE TABLE users(...)] |
| fleets table structure | [CEU-08 :: backend/migrations/init.sql — CREATE TABLE fleets(...)] |
| vehicles table structure | [CEU-08 :: backend/migrations/init.sql — CREATE TABLE vehicles(...)] |
| drivers table structure | [CEU-08 :: backend/migrations/init.sql — CREATE TABLE drivers(...)] |
| trips table structure | [CEU-08 :: backend/migrations/init.sql — CREATE TABLE trips(...)] |
| users.role enum: admin/manager/dispatcher/driver/viewer/customer | [CEU-08 :: backend/migrations/init.sql — CHECK (role IN (...))] |
| vehicles.fleet_type enum: tanker/bus/taxi | [CEU-08 :: backend/migrations/init.sql — CHECK (fleet_type IN (...))] |
| 61 total entities across 57 modules | [CEU-08 :: backend/migrations/init.sql — comment line 3] |
| TimescaleDB hypertables (for time-series) | [CEU-08 :: backend/migrations/init.sql — CREATE EXTENSION timescaledb; existence implies TimescaleDB table usage] |
| TypeORM migration files: 5 evidenced | [CEU-08 :: src/migrations/ — 1707800000000-InitialSchema.ts, 1707800100000-SeedInitialData.ts, 1707800200000-CreateDriverSessionBlocks.ts, 1709000000000-SVGDeviceProvisioningExpansion.ts, 1709100000000-SensorsAndHasiIntegration.ts] |

---

## PEG Traceability

| PEG element | Evidence source |
|-------------|----------------|
| Frontend API client HTTP call pattern | [CEU-09 :: api/client.ts — apiRequest(), fetch()] |
| Token refresh sub-path | [CEU-09 :: api/client.ts — doRefresh(), refreshAccessToken()] |
| Offline mutation queue | [CEU-09 :: api/client.ts — queueOfflineMutation(), flushOfflineQueue()] |
| Event emission from domain module | [CEU-08 :: events/fleet-event-emitter.service.ts (file present)] |
| WebSocket broadcast handler | [CEU-08 :: events/handlers/websocket-broadcast.handler.ts (file present)] |
| HASI bridge poll loop | [CEU-10 :: hasi_bridge.py — HasiBridge class, poll_interval_sec config] |
| MQTT publish (HASI bridge) | [CEU-10 :: hasi_bridge.py — mqtt_enabled, mqtt_broker, mqtt_topic_prefix config] |
| Prometheus scrape loop | [CEU-10 :: monitoring/prometheus/prometheus.yml — scrape_interval: 10s] |

---

## Unknown-Space Traceability

All unknown-space declarations are traceable to the reconstruction boundary:

| Unknown-Space ID | Explanation | Basis |
|-----------------|-------------|-------|
| US-04 | MQTT broker implementation not in extracted source | No file in CEU-10 implements an MQTT broker |
| US-05 | DS-009 through DS-061 database entities partial | init.sql excerpt does not include all 61 table definitions |
| US-06 | MQTT consumer path in CE-001 backend | No MQTT subscription client code found in CEU-08 at 40.3 read depth |
| US-07 | Per-module event emit patterns not read for all 60 modules | Only fleet-event-emitter.service.ts existence confirmed; individual emit calls not read |
| US-08 | SA-002 sensor collector execution path | sensor_collector.py not read at 40.3 depth |
| US-09 | Full REST API endpoint list | Swagger tags enumerated; per-module controller routes not individually read |
| US-10 | REST API v2 full structure | V2Module and v2-controllers.ts present; content not read at 40.3 depth |
| US-11 | Command dispatch → MQTT path | Gateway code contains comment "In production: validate auth, publish to MQTT" — not implemented in source |
| US-12 | MQTT → Backend consumer path | Broker-to-backend connection not in extracted source |
| US-13 | SA-002 sensor collector full execution path | File exists; content not read |

---

## Status

traceability_complete: PARTIAL (per declared unknown-space)
all_produced_entities_traceable: TRUE
all_produced_interfaces_traceable: TRUE
all_produced_peg_nodes_traceable: TRUE
all_produced_peg_edges_traceable: TRUE
unknown_space_explicitly_declared: TRUE
evidence_boundary_compliance: CONFIRMED
prohibited_paths_accessed: NONE
