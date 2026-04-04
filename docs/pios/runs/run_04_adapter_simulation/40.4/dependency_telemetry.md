# Dependency Telemetry
run_id: run_04_adapter_simulation
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG2-ADAPTER
upstream_contract: PIOS-40.3-RUN02-IG2-ADAPTER
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.2 adapter simulation run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; GitHub adapter ENABLED (mvp-krayu/krayu-program-intelligence); Jira adapter CAPSULE

---

## Purpose

Attaches telemetry to dependency edges in the 40.3 canonical structure. No dependency edges are added, removed, or modified. Telemetry is attached to existing SD, BD, FD, and LD dependencies only.

---

## System-Level Dependency Telemetry

### SD-001 — Frontend → Backend REST

dependency_id: SD-001
dependency_type: system
from: CE-002 (Frontend Application, N-01)
to: CE-001 (Backend API, N-05)
protocol: REST/HTTPS
telemetry_surfaces: TS-012 (request log on CE-001 side)
observable_dimensions: request method, path, response status, response time
temporal_anchor: TMP-010 (event-driven)
completeness: PARTIAL — FE-001 side not directly observable; CE-001 side observable via TS-012

---

### SD-002 — Frontend → Backend WebSocket

dependency_id: SD-002
dependency_type: system
from: CE-002 / FE-004 (WebSocket Client, N-03)
to: CE-001 / BM-062 (FleetGateway, N-09)
protocol: WebSocket (Socket.IO over INT-003)
telemetry_surfaces: TS-017 (connection count); TS-002 (fleet:positions broadcast); TS-003 (vehicle:telemetry broadcast); TS-013 (alert:new broadcast)
observable_dimensions: DIM-CS-001 (connectedClients), DIM-VP-001..006, DIM-VT-001..010, DIM-TK-001..003, DIM-DE-007
temporal_anchors: TMP-001 (2s), TMP-002 (5s), TMP-003 (15–30s), TMP-010 (event-driven connect/disconnect)
completeness: HIGH

---

### SD-003 — Backend → PostgreSQL

dependency_id: SD-003
dependency_type: system
from: CE-001 (N-05)
to: INF-001 (PostgreSQL, N-11)
protocol: TypeORM (TCP)
telemetry_surfaces: TS-007 (postgres-exporter scrape at INF-003)
observable_dimensions: PostgreSQL native metrics via exporter
temporal_anchor: TMP-007 (15s scrape)
completeness: INDIRECT — observable via postgres-exporter only; direct query telemetry not evidenced

---

### SD-004 — Backend → Redis

dependency_id: SD-004
dependency_type: system
from: CE-001 (N-05)
to: INF-002 (Redis, N-12)
protocol: ioredis (TCP)
telemetry_surfaces: TS-001 (DIM-CP-001..003 via health module); TS-006 (redis-exporter scrape)
observable_dimensions: DIM-CP-001 (cache hits), DIM-CP-002 (cache misses), DIM-CP-003 (cache connected)
temporal_anchors: TMP-004 (10s via TS-001), TMP-006 (15s via redis-exporter)
completeness: DIRECT (cache state) + INDIRECT (redis-native via exporter)

---

### SD-005 — SA-001 → HASI System

dependency_id: SD-005
dependency_type: system
from: SA-001 (HASI Bridge, N-16)
to: INF-005 (HASI Security System, N-15)
protocol: SQLite read (/opt/hasi/data/hasi.db)
telemetry_surfaces: TS-014 (poll cycle)
observable_dimensions: DIM-PC-001 (poll interval 30s), DIM-PC-002 (batch size 10)
temporal_anchor: TMP-009 (30s configurable)
completeness: PARTIAL — poll configuration evidenced; HASI source not in extracted source (US-15)

---

### SD-006 — SA-001 → MQTT Broker

dependency_id: SD-006
dependency_type: system
from: SA-001 (N-16)
to: INF-004 (MQTT Broker, N-14)
protocol: MQTT/TLS (mqtt.blueedge.network:8883)
telemetry_surfaces: TS-015 (MQTT push)
observable_dimensions: topic prefix (blueedge/hasi), TLS state, batch size
temporal_anchor: TMP-009 (30s configurable)
completeness: PARTIAL — topic and connection config evidenced; broker telemetry not in extracted source (US-04)

---

### SD-007 — SA-001 → Backend REST Fallback

dependency_id: SD-007
dependency_type: system
from: SA-001 (N-16)
to: CE-001 (N-05)
protocol: REST/HTTPS (fallback when MQTT unavailable)
telemetry_surfaces: TS-016 (REST fallback push); TS-012 (CE-001 request log)
observable_dimensions: HTTP request to /api/v1 on fallback trigger
temporal_anchor: TMP-009 derived (fallback on MQTT failure)
completeness: PARTIAL — fallback trigger evidenced; MQTT failure detection logic not read

---

### SD-008 — Prometheus → Backend API

dependency_id: SD-008
dependency_type: system
from: INF-003 (Prometheus, N-13)
to: CE-001 / BM-061 (N-10)
protocol: HTTP scrape (pull)
telemetry_surfaces: TS-004 (Prometheus scrape job blueedge-api)
observable_dimensions: DIM-PR-001..003, DIM-CP-001..003, DIM-ET-001
temporal_anchor: TMP-004 (10s)
completeness: COMPLETE

---

### SD-009 — Prometheus → Infrastructure Exporters

dependency_id: SD-009
dependency_type: system
from: INF-003 (N-13)
to: node-exporter, redis-exporter (N-12 side), postgres-exporter (N-11 side)
protocol: HTTP scrape (pull)
telemetry_surfaces: TS-005, TS-006, TS-007
temporal_anchors: TMP-005, TMP-006, TMP-007 (all 15s global default)
completeness: COMPLETE (configuration evidenced)

---

## Backend Internal Dependency Telemetry

### BD-001 through BD-005 — Domain Module Internal Dependencies

dependency_ids: BD-001, BD-002, BD-003, BD-004, BD-005
dependency_type: backend-internal
from: BM-001..060 (domain modules, N-07)
to: INF-001 (TypeORM), INF-002 (Redis cache), BM-063 (event emitter), BM-064 (auth guard), INF-003 (monitoring)
telemetry_surfaces: TS-007 (DB via postgres-exporter), TS-001 (cache via health), TS-008 (domain events via N-08), TS-012 (HTTP via request log)
observable_dimensions: domain-module-specific dimensions (see entity_telemetry.md and domain_telemetry.md)
temporal_anchors: TMP-007, TMP-004, TMP-010
completeness: PARTIAL — telemetry observable at infrastructure and event bus level; per-module internal telemetry not individually surfaced

---

### BD-006 — Auth Module → PostgreSQL

dependency_id: BD-006
dependency_type: backend-internal
from: BM-064 (Auth Module, N-06)
to: INF-001 (PostgreSQL, N-11)
telemetry_surfaces: TS-007 (postgres-exporter), TS-012 (HTTP — 200/401 responses observable)
observable_dimensions: auth request outcomes (HTTP status codes in TS-012)
temporal_anchor: TMP-010 (event-driven)
completeness: PARTIAL

---

### BD-007 — FleetGateway → Domain Event Bus

dependency_id: BD-007
dependency_type: backend-internal
from: BM-062 (FleetGateway, N-09)
to: BM-063 (FleetEventsModule, N-08)
telemetry_surfaces: TS-008 (domain event emission); TS-002, TS-003, TS-013 (WebSocket broadcast from handlers)
observable_dimensions: DIM-ET-001, DIM-VP-001..006, DIM-VT-001..010, DIM-DE-001..010
temporal_anchors: TMP-001, TMP-002, TMP-003, TMP-010
completeness: HIGH

---

## Frontend Internal Dependency Telemetry

### FD-001 through FD-005 — Frontend Internal Dependencies

dependency_ids: FD-001, FD-002, FD-003, FD-004, FD-005
dependency_type: frontend-internal
from: CE-002 subsystems (FE-001..FE-011)
to: CE-002 internal and external endpoints
telemetry_surfaces: TS-012 (observable on CE-001 side for HTTP); TS-017 (observable on CE-001 side for WebSocket)
observable_dimensions: HTTP requests captured at CE-001; WebSocket connection counted at N-09
completeness: INDIRECT — frontend-side telemetry not server-observable except via CE-001 surfaces

---

## Library Dependency Telemetry

### LD-001 — nest-winston / winston (Logging)

dependency_id: LD-001
dependency_type: library
from: CE-001 (global interceptor)
to: winston logger
telemetry_surfaces: TS-012 (RequestLoggingInterceptor captures HTTP request telemetry)
observable_dimensions: HTTP request method, path, response status, timing
completeness: PARTIAL — log format/destination not confirmed (TNRM-03)

---

### LD-002 — Prometheus Client

dependency_id: LD-002
dependency_type: library
from: CE-001 / BM-061
to: PrometheusService (internal)
telemetry_surfaces: TS-001 (Prometheus export endpoint)
observable_dimensions: DIM-PR-001..003, DIM-CP-001..003, DIM-ET-001
temporal_anchor: TMP-004 (10s pull by INF-003)
completeness: COMPLETE (7 gauges evidenced)

---

## Status

dependency_telemetry_complete: PARTIAL
all_dependency_telemetry_evidence_backed: TRUE
structure_modified: FALSE
new_dependencies_created: NONE
