# Entity Catalog
run_id: run_07_source_profiled_ingestion
stream: Stream 40.3 — PiOS Reverse Engineering
contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Input Reference

Consumed from 40.2:
- evidence_surface_inventory.md (CEU-01 through CEU-13)
- normalized_evidence_map.md (overlap declarations OVL-01, OVL-02; unknown-space US-01, US-02, US-03)

Overlap declarations carried forward:
- OVL-01: extracted/backend ↔ platform/backend — canonical selection: CEU-08 for isolated module evidence
- OVL-02: extracted/frontend ↔ platform/frontend — canonical selection: CEU-09 for isolated module evidence

---

## Entity Classification Scheme

| Tier | Prefix | Description |
|------|--------|-------------|
| System Component | CE- | Top-level deployed components |
| Backend Module | BM- | NestJS domain modules |
| Frontend Subsystem | FE- | Frontend architectural units |
| Database Schema | DS- | PostgreSQL schema entities |
| SVG Agent | SA- | On-device agent components |
| Infrastructure | INF- | Supporting services |

---

## Tier 1 — System Components

### CE-001 — Backend API Application

entity_id: CE-001
entity_name: Blue Edge Fleet Management API
entity_type: system component
evidence_origin: CEU-08 (extracted/backend/backend/)
evidence_files:
- package.json: name="blue-edge-fleet-api", version="2.17.0"
- src/main.ts: bootstrap() — NestJS application factory
- src/app.module.ts: root module with 63+ domain modules imported
technology_stack:
- runtime: Node.js
- framework: NestJS v10
- language: TypeScript 5.3
- orm: TypeORM 0.3.19
- database_client: pg (PostgreSQL)
- cache: ioredis (Redis), cache-manager
- auth: @nestjs/passport + passport-jwt
- websocket: @nestjs/websockets + socket.io
- logging: nest-winston (Winston)
- validation: class-validator + class-transformer
- docs: @nestjs/swagger (Swagger/OpenAPI)
- rate_limiting: @nestjs/throttler
- events: @nestjs/event-emitter + eventemitter2
api_prefix: /api
api_versions: v1 (stable, default), v2 (next)
port: 3001
servers_evidenced:
- localhost:3001 (development)
- api.blueedge.ae (production UAE)
- api.blueedge.ch (production Switzerland)
swagger_ui: /docs
openapi_json: /docs-json

---

### CE-002 — Frontend Application

entity_id: CE-002
entity_name: Blue Edge Fleet Frontend
entity_type: system component
evidence_origin: CEU-09 (extracted/frontend/frontend/)
evidence_files:
- package.json: name="blueedge-fleet-frontend", version="3.15.0"
- main.tsx: React application entry
- App.tsx: root component
- router/LazyRoutes.tsx: lazy-loaded routing
technology_stack:
- framework: React 18.3
- language: TypeScript 5.3
- bundler: Vite 5
- css: Tailwind CSS 3.4
- routing: react-router-dom v6
- charts: Chart.js 4 + react-chartjs-2
- maps: Leaflet 1.9 + react-leaflet
- icons: lucide-react
- realtime: socket.io-client 4.7
- pwa: custom service worker (public/sw.js)
- testing: Vitest + Cypress + Storybook
api_target: CE-001 (via api/client.ts — VITE_API_URL env)
websocket_target: CE-001 (/fleet namespace)
build_output: nginx (nginx.conf evidenced)
pwa_enabled: true (manifest.json, sw.js, offline.html)
i18n: yes (contexts/I18nContext.tsx, constants/translations.ts)
rtl_support: yes (styles/rtl.css evidenced)

---

### CE-003 — Integrated Platform Monorepo

entity_id: CE-003
entity_name: Blue Edge Platform Monorepo
entity_type: system component (integrated)
evidence_origin: CEU-10 (extracted/platform/blueedge-platform/)
evidence_files:
- README.md
- .env.example
- .github/workflows/ci.yml
- .github/workflows/deploy.yml
structure:
- backend/: embedded backend (OVL-01)
- frontend/: embedded frontend (OVL-02)
- svg-agents/: platform-unique (see SA- entities)
- monitoring/: platform-unique (see INF- entities)
- load-tests/: k6 performance test suite
platform_unique_additions:
- svg-agents layer (SA-001, SA-002)
- Grafana + Prometheus monitoring (INF-003)
- k6 load tests (3 files)
- GitHub Actions CI/CD (2 workflow files)
overlap_positions: OVL-01, OVL-02

---

## Tier 2 — SVG Agent Components

### SA-001 — HASI Bridge Agent

entity_id: SA-001
entity_name: BluEdge HASI Bridge Agent
entity_type: SVG agent component
evidence_origin: CEU-10
evidence_files:
- svg-agents/hasi-bridge/hasi_bridge.py
- svg-agents/config/blueedge.yaml
- svg-agents/systemd/blueedge-hasi-bridge.service
deployment: SVG 2.0 Yocto Linux device (/opt/blueedge/hasi-bridge/)
language: Python 3
function: Polls HASI SQLite database for security captures, threats, and recommendations; pushes results to Blue Edge cloud via MQTT (primary) or REST fallback
interfaces:
- reads: HASI SQLite DB (/opt/hasi/data/hasi.db)
- reads: HASI captures directory (/opt/hasi/data/captures)
- writes: MQTT broker (mqtt.blueedge.network:8883, TLS, topic prefix blueedge/hasi)
- writes: REST API fallback (https://api.blueedge.network/api/v1)
poll_interval: 30 seconds (configurable)
tls: mutual TLS for MQTT (client cert + CA cert required)

---

### SA-002 — Sensor Collector Agent

entity_id: SA-002
entity_name: BluEdge Sensor Collector Agent
entity_type: SVG agent component
evidence_origin: CEU-10
evidence_files:
- svg-agents/sensor-collector/sensor_collector.py
- svg-agents/config/sensors.yaml
- svg-agents/systemd/blueedge-sensor-collector.service
deployment: SVG 2.0 Yocto Linux device (/opt/blueedge/)
language: Python 3
function: Collects sensor data from vehicle hardware; forwards to Blue Edge cloud

---

## Tier 3 — Infrastructure Services

### INF-001 — PostgreSQL Database

entity_id: INF-001
entity_name: PostgreSQL + TimescaleDB + PostGIS
entity_type: infrastructure service
evidence_origin: CEU-08
evidence_files:
- package.json: pg dependency
- src/config/database.config.ts
- src/config/data-source.ts
- migrations/init.sql
database_name: fleet_management (default)
extensions: uuid-ossp, postgis, timescaledb
default_host: localhost:5432
default_user: blueedge
monitoring: postgres-exporter:9187 (Prometheus scrape target)
schema_entities: See DS- entities below

---

### INF-002 — Redis Cache

entity_id: INF-002
entity_name: Redis (ioredis)
entity_type: infrastructure service
evidence_origin: CEU-08
evidence_files:
- package.json: ioredis, cache-manager-ioredis-yet dependencies
- src/config/redis.config.ts
- src/common/cache/cache.module.ts
- src/common/cache/cache.service.ts
fallback: in-memory cache (auto-fallback evidenced in health controller)
monitoring: redis-exporter:9121 (Prometheus scrape target)
usage: HTTP response cache, session cache; invalidated by domain events

---

### INF-003 — Monitoring Stack

entity_id: INF-003
entity_name: Prometheus + Grafana Monitoring
entity_type: infrastructure service
evidence_origin: CEU-10
evidence_files:
- monitoring/prometheus/prometheus.yml
- monitoring/grafana/dashboards/fleet-operations.json
- monitoring/grafana/provisioning/dashboards/default.yml
- monitoring/grafana/provisioning/datasources/prometheus.yml
scrape_targets:
- blueedge-api:3000 (/health/prometheus, 10s interval)
- node-exporter:9100 (host metrics)
- redis-exporter:9121
- postgres-exporter:9187
grafana_dashboard: fleet-operations.json

---

### INF-004 — MQTT Broker

entity_id: INF-004
entity_name: MQTT Broker
entity_type: infrastructure service (partially evidenced)
evidence_origin: CEU-10 (hasi_bridge.py config references)
evidence_status: PARTIALLY EVIDENCED — broker endpoint referenced (mqtt.blueedge.network:8883) but broker implementation not present in extracted source
mqtt_endpoint: mqtt.blueedge.network:8883
tls: yes (mutual TLS)
topic_prefix: blueedge/hasi
consumers: SA-001 (publisher), CE-001 (inferred consumer — NOT directly evidenced)
unknown_space: US-04 — MQTT broker implementation and CE-001 MQTT consumer not in extracted source

---

### INF-005 — HASI Security System

entity_id: INF-005
entity_name: HASI Network Security System
entity_type: infrastructure service (referenced — not in extracted source)
evidence_origin: CEU-10 (hasi_bridge.py references), CEU-08 (modules/hasi/)
evidence_status: PARTIALLY EVIDENCED — hasi module in backend + bridge agent reference HASI; HASI system itself is not in extracted source
hasi_db_path: /opt/hasi/data/hasi.db (on device)
hasi_captures_dir: /opt/hasi/data/captures (on device)
deployment: co-located on SVG 2.0 device with SA-001
function: network security monitoring, threat capture, recommendation generation

---

## Tier 4 — Backend Domain Modules

All 63 backend modules are confirmed in extracted/backend/backend/src/modules/ and registered in app.module.ts.

Each module follows the standard NestJS pattern:
- {name}.controller.ts — REST API controller
- {name}.module.ts — module definition
- {name}.service.ts — business logic service
- {name}.spec.ts — unit test
- entities/{name}.entity.ts — TypeORM entity (where applicable)

### Category A — Core Domain (7 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-001 | vehicles | Vehicle registry and lifecycle |
| BM-002 | drivers | Driver registry and compliance |
| BM-003 | fleets | Fleet grouping and configuration |
| BM-004 | trips | Trip planning, tracking, and completion |
| BM-005 | alerts | Alert creation, escalation, and resolution |
| BM-006 | maintenance | Maintenance scheduling and work orders |
| BM-007 | fuel | Fuel transactions and level monitoring |

### Category B — Fleet Type Specialization (3 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-008 | tanker | Oil & gas tanker operations, compartment management, custody transfer |
| BM-009 | bus | Bus transit route management |
| BM-010 | taxi | Taxi/ride-hail fare and trip management |

### Category C — Operations & Infrastructure (3 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-011 | operations | Fleet dispatch and operations |
| BM-012 | devices | IoT device registry and management |
| BM-013 | notifications | Notification delivery and webhook management |

### Category D — Analytics & Reporting (3 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-014 | analytics | Analytics data aggregation and dashboards |
| BM-015 | reports | Report generation and export |
| BM-016 | diagnostics | Vehicle diagnostics and DTC management |

### Category E — Domain-Specific Compliance (3 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-017 | compliance | Regulatory compliance tracking |
| BM-018 | safety | Safety incident tracking and scoring |
| BM-019 | finance | Financial transactions and billing |

### Category F — Users (1 module)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-020 | users | User account management (roles: admin, manager, dispatcher, driver, viewer, customer) |

### Category G — EV & Energy (4 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-021 | coldchain | Cold chain temperature monitoring |
| BM-022 | ev | EV fleet management and battery |
| BM-023 | ota | OTA firmware update management |
| BM-024 | v2g | V2X/V2G grid interaction |

### Category H — World-Class Expansion (16 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-025 | surge-pricing | Dynamic surge pricing and demand zones |
| BM-026 | driver-incentives | Driver reward and incentive programs |
| BM-027 | electrification | Fleet electrification planning |
| BM-028 | depot-charging | Depot charging infrastructure management |
| BM-029 | executive | Executive dashboards and KPI views |
| BM-030 | anomaly-detection | ML anomaly detection |
| BM-031 | cross-border | Cross-border regulatory compliance |
| BM-032 | permits | Permit and license management |
| BM-033 | parts-marketplace | Parts procurement marketplace |
| BM-034 | fleet-lifecycle | Fleet lifecycle and asset management |
| BM-035 | driver-mobile | Driver mobile experience |
| BM-036 | fatigue-risk | Fatigue risk assessment |
| BM-037 | customer-portal | Customer self-service portal |
| BM-038 | blockchain | Blockchain verification and audit trail |
| BM-039 | white-label | White-label and multi-tenant theming |
| BM-040 | charging-stations | Public charging station network |

### Category I — Advanced Features (5 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-041 | predictive-maintenance | ML predictive maintenance |
| BM-042 | digital-twin | Digital twin computation |
| BM-043 | driver-scoring | Driver scoring (DWVS) |
| BM-044 | geofence-automation | Automated geofence rule execution |
| BM-045 | messaging | In-app and inter-fleet messaging |

### Category J — Multi-Tenant SaaS (3 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-046 | multi-tenant | Tenant isolation and configuration |
| BM-047 | billing | SaaS billing and subscription management |
| BM-048 | onboarding | Fleet onboarding wizard |

### Category K — Integration Layer (8 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-049 | integration-notifications | Third-party notification provider integration |
| BM-050 | erp-connectors | ERP system connectors |
| BM-051 | api-marketplace | API marketplace and developer access |
| BM-052 | integration-hub | Central integration orchestration |
| BM-053 | agentic-ai | Agentic AI task management |
| BM-054 | aftersales | OEM aftersales work order management |
| BM-055 | road-intelligence | Road condition and intelligence |
| BM-056 | data-monetization | Fleet data monetization |

### Category L — Vehicle Lifecycle Intelligence (2 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-057 | driver-sessions | Driver session-block architecture (DWVS computation) |
| BM-058 | vehicle-lifecycle | 360° vehicle lifecycle tracking |

### Category M — External Sensors & Security (2 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-059 | sensors | External sensor data ingestion |
| BM-060 | hasi | HASI network security data processing |

### Category N — Infrastructure Modules (3 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-061 | health | Health check endpoints and Prometheus metrics export |
| BM-062 | gateways | WebSocket gateway (FleetGateway) |
| BM-063 | events | Event-driven architecture (FleetEventsModule, FleetEventEmitter) |

### Category O — Auth & Versioning (2 modules)

| Entity ID | Module | Function |
|-----------|--------|----------|
| BM-064 | auth | JWT authentication, token refresh, role-based authorization |
| BM-065 | versioning (V2Module) | API v1/v2 versioning and ApiVersionMiddleware |

### Additional Evidenced Source Modules (not registered in app.module.ts v2.17.0)

The following module directories are present in extracted/backend/backend/src/modules/ but are not imported in app.module.ts:

| Module | Evidence | Status |
|--------|---------|--------|
| insurance | Directory confirmed in CEU-08; frontend api/insurance.ts present in CEU-09 | EVIDENCED — not registered in app.module.ts v2.17.0; registration status UNKNOWN |
| errors | Directory confirmed in CEU-08 | EVIDENCED — likely shared error types/classes; not a domain module registered in app.module.ts |

Evidence basis: CEU-08 (extracted/backend/backend/src/modules/ directory enumeration); CEU-09 (extracted/frontend/frontend/api/insurance.ts)
Note: These modules are declared here to maintain source alignment. They are not assigned BM- IDs because their registration and domain function at v3.23.0 is not fully evidenced.
Unknown-space: US-14 — insurance module registration status and domain function not confirmed from app.module.ts

---

## Tier 5 — Frontend Subsystems

| Entity ID | Subsystem | Path | Function |
|-----------|-----------|------|----------|
| FE-001 | API Client Layer | api/ | ~70 TypeScript API client modules; JWT lifecycle management; offline queue; retry logic |
| FE-002 | Component Library | components/ | charts, data, layout, map, realtime, ui groups |
| FE-003 | Page Layer | pages/ | fleet, assets, energy, safety, intelligence, people, platform sections (60+ page components) |
| FE-004 | WebSocket Client | socket/ | socket.io-client; connects to CE-001 /fleet namespace |
| FE-005 | Auth Context | contexts/AuthContext.tsx | JWT token storage, refresh, session management |
| FE-006 | I18n Context | contexts/I18nContext.tsx | Internationalization; translations.ts |
| FE-007 | Theme Context | contexts/ThemeContext.tsx | Dark/light theme; RTL support |
| FE-008 | PWA Layer | pwa/, public/sw.js, public/manifest.json | Service worker registration; offline support; offline.html |
| FE-009 | Router | router/LazyRoutes.tsx | Lazy-loaded client-side routing (React Router v6) |
| FE-010 | Test Suite | test/, cypress/ | Vitest unit tests; Cypress e2e tests |
| FE-011 | Storybook | stories/ | Component documentation and visual testing |

---

## Tier 6 — Core Database Schema Entities

Evidenced from: migrations/init.sql (CEU-08)
Database: PostgreSQL + TimescaleDB + PostGIS

| Entity ID | Table | Core fields |
|-----------|-------|-------------|
| DS-001 | users | id, email, role (admin/manager/dispatcher/driver/viewer/customer), is_active |
| DS-002 | fleets | id, org_id, name, fleet_type (tanker/bus/taxi/mixed), region |
| DS-003 | vehicles | id, vin, plate_number, fleet_id→fleets, vehicle_type, status, specs JSONB, tank_config JSONB |
| DS-004 | drivers | id, employee_id, assigned_vehicle_id→vehicles, safety_score, efficiency_score |
| DS-005 | trips | id, vehicle_id→vehicles, fleet_id→fleets, driver_id→drivers, status, trip_type |
| DS-006 | alerts | confirmed present (modules/alerts/entities/) — full schema PARTIAL from init.sql excerpt |
| DS-007 | maintenance | confirmed present (modules/maintenance/entities/) — schema PARTIAL |
| DS-008 | fuel_transactions | confirmed present (modules/fuel/entities/) — schema PARTIAL |
| DS-009–DS-061 | remaining entities | PARTIAL — init.sql comment states "61 TypeORM entities across 57 modules"; full schema beyond first excerpt is UNKNOWN at this evidence depth |

completeness_note: DS-009 through DS-061 exist per init.sql comment but full schema for each is PARTIAL at 40.3 reconstruction depth. This unknown-space is preserved.

---

## Entity Count Summary

| Tier | Count | Status |
|------|-------|--------|
| System Components (CE-) | 3 | COMPLETE |
| SVG Agent Components (SA-) | 2 | COMPLETE |
| Infrastructure Services (INF-) | 5 (INF-001–005) | COMPLETE (INF-004, INF-005 PARTIAL) |
| Backend Domain Modules (BM-) | 65 (63 domain + 2 infra) | COMPLETE |
| Frontend Subsystems (FE-) | 11 | COMPLETE |
| Database Schema Entities (DS-) | 8 FULL + 53 PARTIAL | PARTIAL (US-05) |
| **Total** | **94 entities** | **PARTIAL** |

---

## Carry-Forward Unknown-Space

From 40.2:
- OVL-01: backend standalone vs platform backend — NOT RESOLVED (maintained)
- OVL-02: frontend standalone vs platform frontend — NOT RESOLVED (maintained)
- US-01, US-02, US-03: file-level parity — NOT RESOLVED (maintained)

New at 40.3:
- US-04: MQTT broker implementation and CE-001 MQTT consumer path not in extracted source
- US-05: Database entity schemas DS-009 through DS-061 — only partial from init.sql excerpt
- US-06: Full content of BlueEdge HTML docs (CEU-01, CEU-02, CEU-03) not read — additional entities may be evidenced there

---

## Status

entity_catalog_complete: PARTIAL (per declared unknown-space)
entities_fully_evidenced: 85+
entities_partially_evidenced: INF-004, INF-005, DS-009 through DS-061
evidence_boundary_compliance: CONFIRMED
prohibited_paths_accessed: NONE
