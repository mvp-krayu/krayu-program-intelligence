# Interface Telemetry
run_id: run_02_blueedge
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG1C-REGEN
upstream_contract: PIOS-40.3-RUN02-IG1C-REGEN
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1C fresh baseline re-ingestion from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation

---

## Purpose

Attaches telemetry to interface definitions in the 40.3 canonical interface map (INT-001 through INT-008). No interfaces are created, renamed, or removed. Telemetry is attached to existing interface elements only.

---

## Interface Telemetry Attachments

### INT-001 — REST API v1

interface_id: INT-001
protocol: REST/HTTPS
from: CE-002 (FE-001 API Client)
to: CE-001 (Backend API)
telemetry_surfaces: TS-012 (RequestLoggingInterceptor — all inbound HTTP)
observable_dimensions: HTTP method, endpoint path, response status, response time (via TS-011 PerformanceMiddleware)
temporal_anchor: TMP-010 (event-driven — per request)
completeness: PARTIAL — request/response observable; full endpoint list not evidenced (US-09)

---

### INT-002 — REST API v2

interface_id: INT-002
protocol: REST/HTTPS
from: CE-002 (FE-001 API Client)
to: CE-001 (Backend API)
telemetry_surfaces: TS-012
observable_dimensions: HTTP method, endpoint path, response status
temporal_anchor: TMP-010 (event-driven — per request)
completeness: PARTIAL — v2 structure not fully read (US-10); telemetry observable at TS-012 level

---

### INT-003 — WebSocket /fleet

interface_id: INT-003
protocol: WebSocket (Socket.IO)
from: CE-002 / FE-004 (WebSocket Client, N-03)
to: CE-001 / BM-062 (FleetGateway, N-09)
telemetry_surfaces: TS-002 (fleet:positions), TS-003 (vehicle:telemetry), TS-013 (alert:new), TS-017 (connection state)
observable_dimensions:
- DIM-VP-001..006 (position: lat, lng, speed, heading, altitude, status)
- DIM-VT-001..010, DIM-TK-001..003 (engine, vehicle, safety, tank telemetry)
- DIM-DE-007 (alert severity)
- DIM-CS-001 (connectedClients)
temporal_anchors: TMP-001 (2s), TMP-002 (5s), TMP-003 (15–30s), TMP-010 (event-driven connect/disconnect)
completeness: HIGH

---

### INT-004 — Domain Event Bus

interface_id: INT-004
protocol: Internal (NestJS EventEmitter2)
from: BM-001..BM-060 domain modules (N-07)
to: BM-063 (FleetEventsModule, N-08)
telemetry_surfaces: TS-008 (domain event emission)
observable_dimensions: 65 typed events; 10 typed payload schemas; DIM-ET-001 (total event count)
temporal_anchor: TMP-010 (event-driven — on domain state mutation)
completeness: HIGH — 65 event types evidenced; all typed payload schemas documented in dimension catalog

---

### INT-005 — Prometheus Metrics

interface_id: INT-005
protocol: HTTP (GET /health/prometheus)
from: INF-003 (Prometheus, N-13)
to: CE-001 / BM-061 (HealthModule, N-10)
telemetry_surfaces: TS-001 (Prometheus metrics endpoint), TS-004 (scrape job configuration)
observable_dimensions: DIM-PR-001..003, DIM-CP-001..003, DIM-ET-001 (7 Prometheus gauges)
temporal_anchor: TMP-004 (10s scrape interval)
content_type: text/plain; version=0.0.4 (OpenMetrics)
completeness: COMPLETE

---

### INT-006 — MQTT (SA-001 outbound)

interface_id: INT-006
protocol: MQTT/TLS
from: SA-001 (HASI Bridge, N-16)
to: INF-004 (MQTT Broker, N-14)
telemetry_surfaces: TS-015 (HASI MQTT push)
observable_dimensions: topic prefix (blueedge/hasi), TLS state, batch size (DIM-PC-002)
temporal_anchor: TMP-009 (30s poll cycle derived)
completeness: PARTIAL — SA-001 config evidenced; INF-004 broker telemetry not in extracted source (US-04)

---

### INT-007 — REST Fallback (SA-001→CE-001)

interface_id: INT-007
protocol: REST/HTTPS
from: SA-001 (N-16)
to: CE-001 (N-05)
trigger: MQTT unavailable
telemetry_surfaces: TS-016 (REST fallback push surface), TS-012 (CE-001 inbound request log)
observable_dimensions: HTTP request to /api/v1 on fallback trigger; observable at CE-001 TS-012
temporal_anchor: TMP-009 derived (fallback on MQTT failure)
completeness: PARTIAL — fallback trigger evidenced; MQTT failure detection logic not read

---

### INT-008 — Database

interface_id: INT-008
protocol: TypeORM (TCP to PostgreSQL)
from: CE-001 / BM-001..BM-065 (N-05, N-06, N-07, N-08, N-10)
to: INF-001 (PostgreSQL, N-11)
telemetry_surfaces: TS-007 (postgres-exporter scrape)
observable_dimensions: PostgreSQL native metrics via exporter
temporal_anchor: TMP-007 (15s scrape)
completeness: INDIRECT — observable via postgres-exporter; direct TypeORM query telemetry not evidenced

---

## Interface Telemetry Coverage Summary

| Interface | Protocol | Coverage | Primary Surfaces |
|-----------|---------|---------|-----------------|
| INT-001 | REST API v1 | PARTIAL | TS-012 |
| INT-002 | REST API v2 | PARTIAL | TS-012 |
| INT-003 | WebSocket /fleet | HIGH | TS-002, TS-003, TS-013, TS-017 |
| INT-004 | Domain Event Bus | HIGH | TS-008 |
| INT-005 | Prometheus Metrics | COMPLETE | TS-001, TS-004 |
| INT-006 | MQTT (SA-001) | PARTIAL | TS-015 |
| INT-007 | REST Fallback | PARTIAL | TS-016, TS-012 |
| INT-008 | Database | INDIRECT | TS-007 |

---

## Status

interface_telemetry_complete: PARTIAL
all_interface_telemetry_evidence_backed: TRUE
structure_modified: FALSE
new_interfaces_created: NONE
