# Temporal Telemetry Series
run_id: run_03_blueedge_repeat
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG1E-REPEAT
upstream_contract: PIOS-40.3-RUN02-IG1E-REPEAT
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1E determinism re-run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; repeat of IG.1C for determinism verification

---

## Purpose

Attaches raw temporal anchors to the 40.3 canonical structure. Each temporal series is grounded in direct evidence from the source. No trend derivation, forecasting, or statistical inference is applied. Temporal anchors are stated exactly as evidenced.

---

## Temporal Anchor Classification

| Class | Code | Description |
|-------|------|-------------|
| Fixed interval | TMP-FI | Periodic emission at a fixed interval |
| Random interval | TMP-RI | Periodic emission at a random-bounded interval |
| Poll cycle | TMP-PC | Scheduled polling loop |
| Scrape interval | TMP-SI | Prometheus pull-based collection interval |
| Event-driven | TMP-ED | Emission triggered by state change (no fixed interval) |
| Config-defined | TMP-CD | Interval defined in configuration, not hardcoded |

---

## TMP-001 — Fleet Position Broadcast

temporal_id: TMP-001
class: TMP-FI
entity_ref: CE-001 / BM-062 (N-09)
interface_ref: INT-003
surface_ref: TS-002
interval: 2000ms
interval_unit: milliseconds
evidence: CEU-08 :: src/gateways/fleet.gateway.ts — positionInterval = setInterval(..., 2000)
scope: emits to fleet:all, fleet:tanker, fleet:bus, fleet:taxi rooms
condition: only emits if connectedClients.size > 0 (cost optimization evidenced)
peg_path: EP-03

---

## TMP-002 — Vehicle Telemetry Broadcast

temporal_id: TMP-002
class: TMP-FI
entity_ref: CE-001 / BM-062 (N-09)
interface_ref: INT-003
surface_ref: TS-003
interval: 5000ms
interval_unit: milliseconds
evidence: CEU-08 :: src/gateways/fleet.gateway.ts — telemetryInterval = setInterval(..., 5000)
scope: emits to vehicle:{vehicleId} rooms
peg_path: EP-03

---

## TMP-003 — Alert Broadcast

temporal_id: TMP-003
class: TMP-RI
entity_ref: CE-001 / BM-062 (N-09)
interface_ref: INT-003
surface_ref: TS-013
interval_min: 15000ms
interval_max: 30000ms
interval_unit: milliseconds
evidence: CEU-08 :: src/gateways/fleet.gateway.ts — alertInterval = setInterval(..., Math.random() * 15000 + 15000)
scope: emits to alerts:all, alerts:{severity} rooms
peg_path: EP-03 (alert variant)

---

## TMP-004 — Prometheus Scrape — Backend API

temporal_id: TMP-004
class: TMP-SI
entity_ref: INF-003 / CE-001 (N-13 → N-10)
dependency_ref: SD-008
surface_ref: TS-004
interval: 10s
interval_unit: seconds
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — scrape_interval: 10s under job_name: 'blueedge-api'
metrics_path: /health/prometheus
target: blueedge-api:3000
peg_path: EP-06

---

## TMP-005 — Prometheus Scrape — Node Exporter

temporal_id: TMP-005
class: TMP-SI
entity_ref: INF-003 (N-13)
dependency_ref: SD-009
surface_ref: TS-005
interval: 15s (global default)
interval_unit: seconds
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — global.scrape_interval: 15s; job_name: 'node-exporter'
target: node-exporter:9100
peg_path: EP-06

---

## TMP-006 — Prometheus Scrape — Redis Exporter

temporal_id: TMP-006
class: TMP-SI
entity_ref: INF-003 (N-13)
dependency_ref: SD-009
surface_ref: TS-006
interval: 15s (global default)
interval_unit: seconds
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — global.scrape_interval: 15s; job_name: 'redis-exporter'
target: redis-exporter:9121
peg_path: EP-06

---

## TMP-007 — Prometheus Scrape — PostgreSQL Exporter

temporal_id: TMP-007
class: TMP-SI
entity_ref: INF-003 (N-13)
dependency_ref: SD-009
surface_ref: TS-007
interval: 15s (global default)
interval_unit: seconds
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — global.scrape_interval: 15s; job_name: 'postgres-exporter'
target: postgres-exporter:9187
peg_path: EP-06

---

## TMP-008 — Prometheus Global Evaluation

temporal_id: TMP-008
class: TMP-FI
entity_ref: INF-003 (N-13)
interval: 15s
interval_unit: seconds
evidence: CEU-10 :: monitoring/prometheus/prometheus.yml — global.evaluation_interval: 15s
note: governs when Prometheus evaluates alerting rules (no alerting rules read — existence only)

---

## TMP-009 — HASI Bridge Poll Cycle

temporal_id: TMP-009
class: TMP-CD
entity_ref: SA-001 (N-16)
dependency_ref: SD-005
surface_ref: TS-014
interval: 30s (default — configurable via /opt/blueedge/config/blueedge.yaml)
interval_unit: seconds
evidence: CEU-10 :: hasi_bridge.py — poll_interval_sec = 30 in DEFAULT_CONFIG
config_path: /opt/blueedge/config/blueedge.yaml (CEU-10 :: hasi_bridge.py docstring)
peg_path: EP-05

---

## TMP-010 — Domain Events (Event-Driven)

temporal_id: TMP-010
class: TMP-ED
entity_ref: CE-001 / BM-063 (N-08)
interface_ref: INT-004
surface_ref: TS-008
trigger: domain state mutation (CREATE/UPDATE/DELETE in any BM-001..060)
interval: no fixed interval — triggered by user request or system process
evidence: CEU-08 :: events/types/fleet-events.ts — FleetEvents constant (65 types); BaseFleetEvent.timestamp
timestamp_format: ISO 8601 string (BaseFleetEvent.timestamp — new Date().toISOString() pattern)
peg_path: EP-02

---

## TMP-011 — JWT Token Refresh (Event-Driven)

temporal_id: TMP-011
class: TMP-ED
entity_ref: CE-002 / FE-001 (N-02), CE-001 / BM-064 (N-06)
surface_ref: TS-012 (observable on CE-001 side)
trigger: 401 Unauthorized response on CE-001
evidence: CEU-09 :: api/client.ts — doRefresh(), retryWithNewToken() on 401
timestamp: not emitted directly; observable as HTTP request pair in TS-012 log
peg_path: EP-01a

---

## TMP-012 — Offline Queue Flush (Event-Driven)

temporal_id: TMP-012
class: TMP-ED
entity_ref: CE-002 / FE-001 (N-02)
trigger: network reconnection after offline period
evidence: CEU-09 :: api/client.ts — flushOfflineQueue()
retention: failed items < 24h retained; items > 24h discarded
peg_path: EP-08

---

## Temporal Series Summary

| ID | Interval | Class | Entity | Path |
|----|----------|-------|--------|------|
| TMP-001 | 2s | FI | CE-001/BM-062 | EP-03 |
| TMP-002 | 5s | FI | CE-001/BM-062 | EP-03 |
| TMP-003 | 15–30s (random) | RI | CE-001/BM-062 | EP-03 |
| TMP-004 | 10s | SI | INF-003→CE-001 | EP-06 |
| TMP-005 | 15s | SI | INF-003 | EP-06 |
| TMP-006 | 15s | SI | INF-003 | EP-06 |
| TMP-007 | 15s | SI | INF-003 | EP-06 |
| TMP-008 | 15s (eval) | FI | INF-003 | EP-06 |
| TMP-009 | 30s (configurable) | CD | SA-001 | EP-05 |
| TMP-010 | event-driven | ED | CE-001/BM-063 | EP-02 |
| TMP-011 | event-driven | ED | CE-002/CE-001 | EP-01a |
| TMP-012 | event-driven | ED | CE-002 | EP-08 |

---

## Temporal Hierarchy

Ordered by emission frequency (fastest to slowest):

1. **2s** — TMP-001 fleet:positions (fastest server push)
2. **5s** — TMP-002 vehicle:telemetry
3. **10s** — TMP-004 Prometheus scrape (API metrics)
4. **15s** — TMP-005, TMP-006, TMP-007, TMP-008 (Prometheus global)
5. **15–30s** — TMP-003 alert broadcast (random)
6. **30s** — TMP-009 HASI bridge poll
7. **event-driven** — TMP-010, TMP-011, TMP-012 (no fixed interval)

---

## No-Trend Boundary Declaration

No trend derivation is applied to any temporal anchor in this artifact.
No frequency rates, throughput calculations, or event rate estimates are produced.
Each temporal anchor is stated exactly as evidenced from the source.
Temporal inference beyond raw anchoring is a 40.5+ concern.

---

## Unknown-Space — Temporal

| ID | Description |
|----|-------------|
| TTMP-01 | SA-002 sensor collector poll interval — sensor_collector.py not read |
| TTMP-02 | TypeORM connection pool heartbeat interval — not evidenced |
| TTMP-03 | JWT access token expiry interval — not read from config/auth.service.ts |
| TTMP-04 | Grafana dashboard refresh interval — fleet-operations.json not read |

---

## Status

temporal_series_defined: 12
all_temporal_anchors_evidence_backed: TRUE
trend_derivation_applied: NONE
forecasting_applied: NONE
structure_modified: FALSE
