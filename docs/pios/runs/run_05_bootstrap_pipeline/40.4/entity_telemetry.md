# Entity Telemetry
run_id: run_05_bootstrap_pipeline
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Purpose

Attaches telemetry to entities in the 40.3 canonical entity catalog. No entity is created, renamed, or removed. Telemetry is attached to CE, SA, INF, BM, FE, and DS entities only where direct evidence exists.

---

## System Component Telemetry

### CE-001 — Backend API Application

entity_id: CE-001
node_ref: N-05
telemetry_coverage: HIGH

| Surface | Type | Dimensions | Temporal |
|---------|------|-----------|---------|
| TS-001 (GET /health/prometheus) | Metrics endpoint | DIM-PR-001..003, DIM-CP-001..003, DIM-ET-001 (7 gauges) | TMP-004 (10s scrape) |
| TS-009 (GET /health) | Health liveness | DIM-PR-001..004, DIM-CP-001..003, DIM-ET-001 | on-demand |
| TS-010 (GET /health/ready) | Health readiness | DIM-CP-003 (cache state) | on-demand |
| TS-011 (GET /health/metrics) | Performance metrics | DIM-PR-001..005, per-endpoint timing | on-demand |
| TS-012 (RequestLoggingInterceptor) | Request log | all inbound HTTP requests | TMP-010 (event-driven) |
| TS-002 (fleet:positions) | WebSocket broadcast | DIM-VP-001..006 × 10 vehicles | TMP-001 (2s) |
| TS-003 (vehicle:telemetry) | WebSocket broadcast | DIM-VT-001..010, DIM-TK-001..003 | TMP-002 (5s) |
| TS-013 (alert:new) | WebSocket broadcast | DIM-DE-007 (severity) | TMP-003 (15–30s) |
| TS-017 (connection state) | Connection log | DIM-CS-001 (connectedClients) | TMP-010 (event-driven) |
| TS-008 (domain events) | Event bus | 65 event types; 10 typed payloads | TMP-010 (event-driven) |

---

### CE-002 — Frontend Application

entity_id: CE-002
node_ref: N-01
telemetry_coverage: NONE_DIRECT

Browser-side; no server-observable telemetry surfaces. Telemetry observable only at CE-001 endpoints when CE-002 generates requests:
- HTTP requests observable at TS-012
- WebSocket connections observable at TS-017
- Offline queue flush observable at TS-012 on flush (TMP-012)

---

### CE-003 — Integrated Platform Monorepo

entity_ref: CE-003
telemetry_coverage: INDIRECT

CE-003 contains CE-001 (OVL-01), CE-002 (OVL-02), SA-001, SA-002, INF-003. Telemetry is on the embedded components. No CE-003-specific additional surfaces evidenced beyond overlap components.

---

## SVG Agent Telemetry

### SA-001 — HASI Bridge Agent

entity_id: SA-001
node_ref: N-16
telemetry_coverage: PARTIAL

| Surface | Type | Dimensions | Temporal |
|---------|------|-----------|---------|
| TS-014 (poll cycle) | Poll cycle | DIM-PC-001 (30s interval), DIM-PC-002 (batch=10) | TMP-009 (30s) |
| TS-015 (MQTT push) | MQTT emission | topic: blueedge/hasi, TLS state | TMP-009 derived |
| TS-016 (REST fallback) | HTTP fallback | HTTP to CE-001 /api/v1 | fallback on MQTT failure |

completeness_note: MQTT broker implementation not in extracted source (US-04)

---

### SA-002 — Sensor Collector

entity_id: SA-002
node_ref: N-17
telemetry_coverage: NONE_EVIDENCED

sensor_collector.py not read. Telemetry surfaces unknown. US-08, US-13 apply.

---

## Infrastructure Telemetry

### INF-001 — PostgreSQL

entity_id: INF-001
node_ref: N-11
telemetry_coverage: INDIRECT

| Surface | Type | Dimensions | Temporal |
|---------|------|-----------|---------|
| TS-007 (postgres-exporter:9187) | Prometheus scrape | PostgreSQL native metrics | TMP-007 (15s) |

direct_query_telemetry: not evidenced

---

### INF-002 — Redis

entity_id: INF-002
node_ref: N-12
telemetry_coverage: DIRECT + INDIRECT

| Surface | Type | Dimensions | Temporal |
|---------|------|-----------|---------|
| via TS-001 (CE-001 health) | Prometheus gauge | DIM-CP-001 (hits), DIM-CP-002 (misses), DIM-CP-003 (connected) | TMP-004 (10s) |
| TS-006 (redis-exporter:9121) | Prometheus scrape | Redis-native metrics | TMP-006 (15s) |

---

### INF-003 — Monitoring Stack (Prometheus + Grafana)

entity_id: INF-003
node_ref: N-13
telemetry_coverage: INFRASTRUCTURE

INF-003 IS the monitoring collection layer. It is the collector, not a target.

| Collection action | Target | Surface | Temporal |
|-------------------|--------|---------|---------|
| Scrape blueedge-api | CE-001 /health/prometheus | TS-004 | TMP-004 (10s) |
| Scrape node-exporter | host metrics | TS-005 | TMP-005 (15s) |
| Scrape redis-exporter | INF-002 | TS-006 | TMP-006 (15s) |
| Scrape postgres-exporter | INF-001 | TS-007 | TMP-007 (15s) |

Grafana: reads from Prometheus; fleet-operations.json dashboard evidenced.

---

### INF-004 — MQTT Broker

entity_id: INF-004
node_ref: N-14
telemetry_coverage: NONE_EVIDENCED

MQTT broker implementation not in extracted source (US-04). SA-001 outbound connection evidenced at TS-015 (topic prefix, TLS config) but broker-side telemetry not observable.

---

### INF-005 — HASI Security System

entity_id: INF-005
node_ref: N-15
telemetry_coverage: NONE_EVIDENCED

HASI system not in extracted source. SA-001 reads from HASI SQLite DB (SD-005) but HASI system telemetry not accessible.

---

## Backend Module Telemetry (Selected)

For complete domain coverage see domain_telemetry.md.

### BM-061 — HealthModule

entity_id: BM-061
node_ref: N-10
telemetry_coverage: HIGH (primary telemetry aggregation point)

This module IS the telemetry export point for CE-001. See CE-001 surfaces TS-001, TS-009, TS-010, TS-011.

---

### BM-062 — FleetGateway

entity_id: BM-062
node_ref: N-09
telemetry_coverage: HIGH

See CE-001 surfaces TS-002, TS-003, TS-013, TS-017.

---

### BM-063 — FleetEventsModule

entity_id: BM-063
node_ref: N-08
telemetry_coverage: HIGH

| Surface | Type | Dimensions | Temporal |
|---------|------|-----------|---------|
| TS-008 (domain event bus) | Event bus emission | 65 event types; BaseFleetEvent + 10 typed payloads | TMP-010 (event-driven) |

event_count_observable: DIM-ET-001 (blueedge_events_total via BM-061 TS-001)

---

### BM-064 — Auth Module

entity_id: BM-064
node_ref: N-06
telemetry_coverage: INDIRECT

Observable only via HTTP status codes in TS-012 (401/403 on auth failure). No dedicated auth metrics surface evidenced.

---

## Frontend Subsystem Telemetry

### FE-001 — API Client Layer

entity_id: FE-001
node_ref: N-02
telemetry_coverage: INDIRECT

Observable at CE-001 side of SD-001:
- HTTP requests observable via TS-012
- Token refresh trigger (TMP-011) observable as POST /auth/refresh in TS-012
- Offline queue flush (TMP-012) observable as batch HTTP in TS-012

---

### FE-004 — WebSocket Client

entity_id: FE-004
node_ref: N-03
telemetry_coverage: INDIRECT

Observable at CE-001 side of SD-002:
- Connection count via TS-017 (DIM-CS-001)
- Receives broadcasts via TS-002, TS-003, TS-013

---

### FE-005 — Auth Context

entity_id: FE-005
node_ref: N-04
telemetry_coverage: NONE

localStorage token storage — no server-observable surface.

---

## Database Schema Telemetry

### DS-001 through DS-008 (Full Schema)

entity_ids: DS-001..DS-008
telemetry_coverage: INDIRECT

Observable via TS-007 (postgres-exporter metrics). Individual table-level metrics depend on postgres-exporter configuration — table-specific metrics not evidenced beyond exporter presence.

### DS-009 through DS-061 (Partial Schema)

entity_ids: DS-009..DS-061
telemetry_coverage: NONE_EVIDENCED

Partial schema (US-05). No telemetry surfaces evidenced for these entities.

---

## Unknown-Space — Entity Telemetry

| ID | Description |
|----|-------------|
| TUS-01 | SA-002 sensor collector telemetry surfaces unknown |
| TUS-02 | MQTT broker (INF-004) internal telemetry unknown |
| TUS-03 | Winston log destinations and structure not confirmed |
| TUS-04 | Per-module Prometheus custom metrics beyond BM-061 not confirmed |
| TUS-05 | Frontend telemetry (browser performance, error tracking) not evidenced |

---

## Status

entity_telemetry_complete: PARTIAL
all_entity_telemetry_evidence_backed: TRUE
structure_modified: FALSE
new_entities_created: NONE
