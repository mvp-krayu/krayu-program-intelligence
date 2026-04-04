# Dependency Map
run_id: run_06_orchestrated_ingestion
stream: Stream 40.3 — PiOS Reverse Engineering
contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Dependency Classification

Dependency types:
- RUNTIME_DEP: direct runtime dependency (import, module injection, library use)
- DATA_DEP: data dependency (reads/writes to shared store)
- NETWORK_DEP: network-level dependency (API call, socket connection, MQTT)
- BUILD_DEP: build-time or configuration dependency
- INFRA_DEP: infrastructure dependency (requires running service)

Direction notation: A → B means A depends on B

---

## System-Level Dependencies

### SD-001 — Frontend depends on Backend API

dependency_id: SD-001
from: CE-002 (Frontend)
to: CE-001 (Backend API)
type: NETWORK_DEP
protocol: HTTP/HTTPS REST
base_url: VITE_API_URL env (default: http://localhost:3001)
api_prefix: /api/v1/ (primary), /api/v2/ (next)
auth: Bearer JWT
evidence: CEU-09 api/client.ts — API_BASE, API_PREFIX, fetch calls
strength: HARD — frontend is entirely dependent on backend REST API

---

### SD-002 — Frontend WebSocket depends on Backend Gateway

dependency_id: SD-002
from: CE-002 (Frontend — FE-004 WebSocket Client)
to: CE-001 (Backend — BM-062 FleetGateway)
type: NETWORK_DEP
protocol: WebSocket (socket.io)
namespace: /fleet
transport: websocket (with polling fallback)
evidence: CEU-09 socket/FleetSocket.ts; CEU-08 src/gateways/fleet.gateway.ts
strength: SOFT — real-time features degrade gracefully without WebSocket

---

### SD-003 — Backend API depends on PostgreSQL

dependency_id: SD-003
from: CE-001 (Backend API)
to: INF-001 (PostgreSQL)
type: DATA_DEP + INFRA_DEP
driver: TypeORM (pg client)
connection: host/port/database from database.config.ts
evidence: CEU-08 package.json (pg, typeorm, @nestjs/typeorm), src/config/database.config.ts
strength: HARD — all persistent data requires PostgreSQL

---

### SD-004 — Backend API depends on Redis

dependency_id: SD-004
from: CE-001 (Backend API)
to: INF-002 (Redis)
type: DATA_DEP + INFRA_DEP
client: ioredis (via cache-manager-ioredis-yet)
evidence: CEU-08 package.json (ioredis), src/config/redis.config.ts, common/cache/
strength: SOFT — auto-fallback to in-memory cache on Redis unavailability (evidenced in health controller)

---

### SD-005 — HASI Bridge depends on HASI System

dependency_id: SD-005
from: SA-001 (HASI Bridge Agent)
to: INF-005 (HASI Security System)
type: DATA_DEP
method: SQLite polling (reads hasi.db every 30 seconds)
path: /opt/hasi/data/hasi.db
evidence: CEU-10 hasi_bridge.py — hasi_db_path, sqlite3 import
strength: HARD — bridge has no function without HASI data

---

### SD-006 — HASI Bridge depends on MQTT Broker (primary)

dependency_id: SD-006
from: SA-001 (HASI Bridge Agent)
to: INF-004 (MQTT Broker)
type: NETWORK_DEP
protocol: MQTT (TLS, port 8883)
broker: mqtt.blueedge.network
topic: blueedge/hasi/{...}
auth: mutual TLS (client cert required)
evidence: CEU-10 hasi_bridge.py — mqtt_broker, mqtt_port, mqtt_use_tls config
strength: PRIMARY — MQTT is the primary push channel (REST is fallback)

---

### SD-007 — HASI Bridge depends on Backend API (fallback)

dependency_id: SD-007
from: SA-001 (HASI Bridge Agent)
to: CE-001 (Backend API)
type: NETWORK_DEP
protocol: HTTPS REST
endpoint: https://api.blueedge.network/api/v1
auth: API key (BLUEEDGE_API_KEY env)
evidence: CEU-10 hasi_bridge.py — cloud_api_url, cloud_api_key config
strength: FALLBACK — used when MQTT is unavailable

---

### SD-008 — Monitoring depends on Backend API metrics

dependency_id: SD-008
from: INF-003 (Monitoring — Prometheus)
to: CE-001 (Backend API — BM-061 HealthModule)
type: NETWORK_DEP
method: HTTP scrape (Prometheus pull)
endpoint: /health/prometheus
interval: 10 seconds
evidence: CEU-10 prometheus.yml — job_name: 'blueedge-api', metrics_path: '/health/prometheus'
strength: SOFT — monitoring does not affect runtime behavior

---

### SD-009 — Monitoring depends on infrastructure exporters

dependency_id: SD-009
from: INF-003 (Monitoring — Prometheus)
to: INF-001 (PostgreSQL — via postgres-exporter), INF-002 (Redis — via redis-exporter)
type: NETWORK_DEP
method: HTTP scrape via exporters (node-exporter:9100, redis-exporter:9121, postgres-exporter:9187)
evidence: CEU-10 prometheus.yml — all three scrape targets
strength: SOFT — monitoring only

---

## Backend Internal Dependencies

### BD-001 — All domain modules depend on Auth module

dependency_id: BD-001
from: all BM-001 through BM-060 (protected endpoints)
to: BM-064 (auth)
type: RUNTIME_DEP
mechanism: JwtAuthGuard injected globally; RolesGuard applied per-route
evidence: CEU-08 common/guards/jwt-auth.guard.ts, common/guards/roles.guard.ts; app.module.ts (APP_GUARD: FleetThrottlerGuard inherits from ThrottlerGuard with JWT)
note: Auth is not imported per-module; global guard applies to all controllers

---

### BD-002 — Health module depends on Cache, Events, Prometheus

dependency_id: BD-002
from: BM-061 (health)
to: INF-002 (Redis via CacheService), BM-063 (FleetEventEmitter), PrometheusService
type: RUNTIME_DEP
evidence: CEU-08 health/health.controller.ts — constructor(CacheService, PerformanceMiddleware, FleetEventEmitter, PrometheusService)
strength: HARD for monitoring; SOFT for liveness

---

### BD-003 — Domain modules emit events to EventEmitter

dependency_id: BD-003
from: BM-001–BM-060 (all domain modules that produce state changes)
to: BM-063 (FleetEventsModule — FleetEventEmitter)
type: RUNTIME_DEP
mechanism: @nestjs/event-emitter / EventEmitter2
event_types: 65+ event types (see interface_map.md — INT-003)
evidence: CEU-08 events/types/fleet-events.ts — FleetEvents constant with all event names; FleetEventsModule
strength: SOFT — events are fire-and-forget; modules function without handlers consuming events

---

### BD-004 — Event handlers depend on Gateway (WebSocket broadcast)

dependency_id: BD-004
from: BM-063 (event handlers — websocket-broadcast.handler.ts)
to: BM-062 (FleetGateway)
type: RUNTIME_DEP
mechanism: EventHandler → FleetGateway.emitAlert() / emitVehicleUpdate() / emitSessionEvent()
evidence: CEU-08 events/handlers/websocket-broadcast.handler.ts (file present); gateways/fleet.gateway.ts — emitAlert, emitVehicleUpdate, emitSessionEvent methods
strength: SOFT — WebSocket broadcast is asynchronous side-effect

---

### BD-005 — Event handlers depend on Cache (cache invalidation)

dependency_id: BD-005
from: BM-063 (event handlers — cache-invalidation.handler.ts)
to: INF-002 (Redis via CacheService)
type: RUNTIME_DEP
mechanism: EventHandler invalidates cached resources on domain events
evidence: CEU-08 events/handlers/cache-invalidation.handler.ts (file present)
strength: SOFT — cache invalidation is best-effort

---

### BD-006 — Domain modules depend on TypeORM (database access)

dependency_id: BD-006
from: BM-001–BM-060 (all modules with entities)
to: INF-001 (PostgreSQL via TypeORM)
type: DATA_DEP
mechanism: TypeORM Repository pattern (@InjectRepository)
evidence: CEU-08 package.json (@nestjs/typeorm, typeorm); migrations/init.sql (61 entities); app.module.ts (TypeOrmModule.forRootAsync)
strength: HARD — all data persistence requires this path

---

### BD-007 — Version middleware depends on all API routes

dependency_id: BD-007
from: BM-065 (V2Module / ApiVersionMiddleware)
to: all controllers (BM-001 through BM-060)
type: RUNTIME_DEP
mechanism: global middleware consumer.apply(ApiVersionMiddleware).forRoutes('*')
evidence: CEU-08 app.module.ts — configure() method; common/versioning/
strength: SOFT — versioning middleware wraps all routes without affecting core logic

---

## Frontend Internal Dependencies

### FD-001 — All pages depend on API client

dependency_id: FD-001
from: FE-003 (Page Layer)
to: FE-001 (API Client Layer)
type: RUNTIME_DEP
mechanism: import from api/{module}.ts → calls api.get/post/put/patch/delete
evidence: CEU-09 api/index.ts (barrel export); frontend/pages/fleet/VehiclesPage.tsx (pattern)
strength: HARD — pages depend on API for data

---

### FD-002 — API client depends on Auth context (token management)

dependency_id: FD-002
from: FE-001 (API Client — api/client.ts)
to: FE-005 (Auth Context — contexts/AuthContext.tsx)
type: RUNTIME_DEP
mechanism: setTokens(), clearTokens(), setOnUnauthorized() called by AuthProvider; token storage in localStorage
evidence: CEU-09 api/client.ts — setTokens, clearTokens, setOnUnauthorized exports; contexts/AuthProvider.tsx
strength: HARD — JWT lifecycle managed through this path

---

### FD-003 — Real-time components depend on WebSocket client

dependency_id: FD-003
from: FE-002 (components/realtime — ActivityFeed, ConnectionStatus, LiveAlertBanner)
to: FE-004 (WebSocket Client — socket/FleetSocket.ts)
type: RUNTIME_DEP
evidence: CEU-09 components/realtime/ActivityFeed.tsx, ConnectionStatus.tsx, LiveAlertBanner.tsx; socket/FleetSocket.ts
strength: SOFT — real-time components degrade without WebSocket

---

### FD-004 — Page layer depends on Auth context (access control)

dependency_id: FD-004
from: FE-003 (pages — RestrictedScreen, LoginScreen)
to: FE-005 (Auth Context)
type: RUNTIME_DEP
mechanism: useContext(AuthContext) for role checking; RestrictedScreen component for route protection
evidence: CEU-09 components/ui/RestrictedScreen.tsx; pages/people/LoginScreen.tsx; contexts/AuthContext.tsx
strength: HARD — protected routes require auth state

---

### FD-005 — All pages depend on Router

dependency_id: FD-005
from: FE-003 (Page Layer)
to: FE-009 (Router — LazyRoutes.tsx)
type: RUNTIME_DEP
mechanism: React Router v6 lazy loading; React.lazy() for each page
evidence: CEU-09 router/LazyRoutes.tsx
strength: HARD — navigation requires routing

---

## External Library Dependencies

### LD-001 — Backend runtime library dependencies

dependency_id: LD-001
from: CE-001
to: external NPM packages
evidence: CEU-08 package.json
key_dependencies:
- @nestjs/common|core|config v10.3 (framework)
- typeorm v0.3.19 + @nestjs/typeorm (ORM)
- pg v8.11 (PostgreSQL driver)
- ioredis v5.9 + cache-manager-ioredis-yet (cache)
- @nestjs/passport v10 + passport-jwt (auth)
- @nestjs/platform-socket.io v10 + socket.io (WebSocket)
- @nestjs/event-emitter v3 + eventemitter2 (events)
- @nestjs/swagger v7 (API docs)
- @nestjs/throttler v5 (rate limiting)
- nest-winston + winston (logging)
- class-validator + class-transformer (validation)
- bcryptjs (password hashing)

---

### LD-002 — Frontend runtime library dependencies

dependency_id: LD-002
from: CE-002
to: external NPM packages
evidence: CEU-09 package.json
key_dependencies:
- react v18.3 + react-dom (framework)
- react-router-dom v6.22 (routing)
- chart.js v4.4 + react-chartjs-2 (charting)
- leaflet v1.9 + react-leaflet (maps)
- socket.io-client v4.7 (WebSocket)
- lucide-react (icons)
- date-fns v3.3 (date utilities)
- tailwindcss v3.4 (CSS framework)
- vite v5 (bundler)

---

## Dependency Completeness

fully_evidenced_dependencies: SD-001 through SD-009, BD-001 through BD-007, FD-001 through FD-005, LD-001, LD-002

partially_evidenced:
- SD-006: MQTT broker implementation not in source (INF-004 partially evidenced)
- BD-003: specific per-module event emission points inferred from event type definitions; individual module emitter calls not read for all 60 modules

unknown_space:
- US-07: Individual module-to-event-emitter call patterns for BM-025 through BM-060 not directly read
- US-08: Sensor collector (SA-002) dependency chain to cloud not read (sensor_collector.py content not read beyond existence)

---

## Status

dependency_map_complete: PARTIAL (per declared unknown-space)
evidence_boundary_compliance: CONFIRMED
prohibited_paths_accessed: NONE
