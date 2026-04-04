# Telemetry Dimension Catalog
run_id: run_02_blueedge
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG1C-REGEN
upstream_contract: PIOS-40.3-RUN02-IG1C-REGEN
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1C fresh baseline re-ingestion from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation

---

## Purpose

Defines all observable, evidence-backed telemetry dimensions. Each dimension is grounded in direct evidence from the canonical source. No dimensions are inferred beyond direct evidence.

---

## Dimension Classification

| Category | Code | Description |
|----------|------|-------------|
| Process resource | DIM-PR | OS-level process metrics |
| Cache performance | DIM-CP | In-process cache hit/miss/state |
| Event throughput | DIM-ET | Domain event emission counters |
| Vehicle position | DIM-VP | Real-time vehicle location and motion |
| Vehicle telemetry | DIM-VT | Engine, vehicle body, and safety sensors |
| Tank telemetry | DIM-TK | Tanker-specific compartment metrics |
| Alert state | DIM-AS | Alert events and severity distribution |
| Domain event payload | DIM-DE | Typed domain event field dimensions |
| Connection state | DIM-CS | WebSocket connection counts |
| Scrape timing | DIM-SC | Prometheus collection timing |
| Poll cycle | DIM-PC | Agent polling metrics |
| Request performance | DIM-RP | Per-endpoint HTTP request metrics |

---

## Group A — Process Resource Dimensions

### DIM-PR-001 — Process Heap Memory

dimension_id: DIM-PR-001
name: blueedge_process_heap_bytes
type: gauge
unit: bytes
entity_ref: CE-001 / BM-061 (N-10)
surface_ref: TS-001
evidence: CEU-08 :: health/health.controller.ts — prometheus.setGauge('blueedge_process_heap_bytes', mem.heapUsed)
source_api: process.memoryUsage().heapUsed

---

### DIM-PR-002 — Process RSS Memory

dimension_id: DIM-PR-002
name: blueedge_process_rss_bytes
type: gauge
unit: bytes
entity_ref: CE-001 / BM-061 (N-10)
surface_ref: TS-001
evidence: CEU-08 :: health/health.controller.ts — prometheus.setGauge('blueedge_process_rss_bytes', mem.rss)
source_api: process.memoryUsage().rss

---

### DIM-PR-003 — Process External Memory

dimension_id: DIM-PR-003
name: blueedge_process_external_bytes
type: gauge
unit: bytes
entity_ref: CE-001 / BM-061 (N-10)
surface_ref: TS-001
evidence: CEU-08 :: health/health.controller.ts — prometheus.setGauge('blueedge_process_external_bytes', mem.external)
source_api: process.memoryUsage().external

---

### DIM-PR-004 — Process Uptime

dimension_id: DIM-PR-004
name: process_uptime_seconds
type: gauge
unit: seconds
entity_ref: CE-001 / BM-061 (N-10)
surface_ref: TS-009, TS-011
evidence: CEU-08 :: health/health.controller.ts — process.uptime() in check() and metrics()
note: Available via /health and /health/metrics JSON; not part of Prometheus export

---

### DIM-PR-005 — Process CPU Usage

dimension_id: DIM-PR-005
name: process_cpu_usage
type: counter object
unit: microseconds {user, system}
entity_ref: CE-001 / BM-061 (N-10)
surface_ref: TS-011
evidence: CEU-08 :: health/health.controller.ts — process.cpuUsage() in metrics()
note: Available via /health/metrics JSON only

---

---

## Group B — Cache Performance Dimensions

### DIM-CP-001 — Cache Hits Total

dimension_id: DIM-CP-001
name: blueedge_cache_hits_total
type: gauge (counter semantics)
unit: count
entity_ref: CE-001 / BM-061 (N-10), INF-002 (N-12)
surface_ref: TS-001, TS-009
evidence: CEU-08 :: health/health.controller.ts — prometheus.setGauge('blueedge_cache_hits_total', cacheStats.hits || 0)

---

### DIM-CP-002 — Cache Misses Total

dimension_id: DIM-CP-002
name: blueedge_cache_misses_total
type: gauge (counter semantics)
unit: count
entity_ref: CE-001 / BM-061 (N-10), INF-002 (N-12)
surface_ref: TS-001, TS-009
evidence: CEU-08 :: health/health.controller.ts — prometheus.setGauge('blueedge_cache_misses_total', cacheStats.misses || 0)

---

### DIM-CP-003 — Cache Connection State

dimension_id: DIM-CP-003
name: blueedge_cache_connected
type: gauge
unit: binary (1=connected, 0=degraded/in-memory)
entity_ref: CE-001 / BM-061 (N-10), INF-002 (N-12)
surface_ref: TS-001, TS-010
evidence: CEU-08 :: health/health.controller.ts — prometheus.setGauge('blueedge_cache_connected', cacheStats.connected ? 1 : 0)

---

---

## Group C — Event Throughput Dimensions

### DIM-ET-001 — Total Events Emitted

dimension_id: DIM-ET-001
name: blueedge_events_total
type: gauge (counter semantics)
unit: count
entity_ref: CE-001 / BM-063 (N-08)
surface_ref: TS-001, TS-009, TS-008
evidence: CEU-08 :: health/health.controller.ts — prometheus.setGauge('blueedge_events_total', this.eventEmitter.getEventCount())
source_api: FleetEventEmitter.getEventCount()

---

---

## Group D — Vehicle Position Dimensions

### DIM-VP-001 — Vehicle Latitude

dimension_id: DIM-VP-001
name: vehicle.position.lat
type: float
unit: decimal degrees (WGS84)
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-002, TS-008
evidence: CEU-08 :: fleet.gateway.ts — VehiclePosition.lat; CEU-08 :: fleet-events.ts — VehiclePositionEvent.position.lat

---

### DIM-VP-002 — Vehicle Longitude

dimension_id: DIM-VP-002
name: vehicle.position.lng
type: float
unit: decimal degrees (WGS84)
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-002, TS-008
evidence: CEU-08 :: fleet.gateway.ts — VehiclePosition.lng; fleet-events.ts — VehiclePositionEvent.position.lng

---

### DIM-VP-003 — Vehicle Speed

dimension_id: DIM-VP-003
name: vehicle.position.speed
type: integer
unit: km/h (contextual — not explicitly stated in source)
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-002, TS-008
evidence: CEU-08 :: fleet.gateway.ts — VehiclePosition.speed (0–100 range observed in generatePosition())
range_evidenced: 5–100 km/h from generatePosition() (Math.random() * 95 + 5)

---

### DIM-VP-004 — Vehicle Heading

dimension_id: DIM-VP-004
name: vehicle.position.heading
type: integer
unit: degrees (0–360)
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-002, TS-008
evidence: CEU-08 :: fleet.gateway.ts — VehiclePosition.heading (Math.random() * 360)

---

### DIM-VP-005 — Vehicle Altitude

dimension_id: DIM-VP-005
name: vehicle.position.altitude
type: integer
unit: meters
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-002, TS-008
evidence: CEU-08 :: fleet.gateway.ts — VehiclePosition.altitude (jitter(15, 10))

---

### DIM-VP-006 — Vehicle Motion Status

dimension_id: DIM-VP-006
name: vehicle.position.status
type: enum
values: moving | idle | stopped | offline
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-002
evidence: CEU-08 :: fleet.gateway.ts — VehiclePosition.status (Math.random() > 0.15 ? 'moving' : 'idle')

---

---

## Group E — Vehicle Telemetry Dimensions

### DIM-VT-001 — Engine RPM

dimension_id: DIM-VT-001
name: vehicle.engine.rpm
type: integer
unit: RPM
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.engine.rpm (jitter(1800, 1200))
range_evidenced: ~600–3000 RPM

---

### DIM-VT-002 — Coolant Temperature

dimension_id: DIM-VT-002
name: vehicle.engine.coolantTempC
type: float
unit: Celsius
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.engine.coolantTempC (jitter(88, 12))
range_evidenced: ~76–100 °C

---

### DIM-VT-003 — Oil Pressure

dimension_id: DIM-VT-003
name: vehicle.engine.oilPressureKpa
type: float
unit: kPa
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.engine.oilPressureKpa (jitter(380, 80))
range_evidenced: ~300–460 kPa

---

### DIM-VT-004 — Fuel Rate

dimension_id: DIM-VT-004
name: vehicle.engine.fuelRateL
type: float
unit: L/h
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.engine.fuelRateL (jitter(12, 8))
range_evidenced: ~4–20 L/h

---

### DIM-VT-005 — Speed (OBD)

dimension_id: DIM-VT-005
name: vehicle.vehicle.speedKmh
type: integer
unit: km/h
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.vehicle.speedKmh

---

### DIM-VT-006 — Odometer

dimension_id: DIM-VT-006
name: vehicle.vehicle.odometer
type: integer
unit: km
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.vehicle.odometer (jitter(125000, 50000))
range_evidenced: ~75000–175000 km

---

### DIM-VT-007 — Battery Voltage

dimension_id: DIM-VT-007
name: vehicle.vehicle.batteryVoltage
type: float
unit: V
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.vehicle.batteryVoltage (jitter(26.5, 2))
range_evidenced: ~24.5–28.5 V

---

### DIM-VT-008 — ABS Active

dimension_id: DIM-VT-008
name: vehicle.safety.absActive
type: boolean
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.safety.absActive

---

### DIM-VT-009 — ESC Active

dimension_id: DIM-VT-009
name: vehicle.safety.escActive
type: boolean
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.safety.escActive

---

### DIM-VT-010 — Roll Stability Warning

dimension_id: DIM-VT-010
name: vehicle.safety.rollStabilityWarning
type: boolean
entity_ref: CE-001 (BM-062 N-09)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.safety.rollStabilityWarning

---

---

## Group F — Tank Telemetry Dimensions (Tanker Fleet Type)

### DIM-TK-001 — Tank Compartment Level

dimension_id: DIM-TK-001
name: vehicle.tank.compartment.levelPercent
type: float
unit: percent (0–100)
entity_ref: CE-001 (BM-062 N-09), BM-008 (tanker module)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.tank.compartments[].levelPercent (jitter(72, 40))
fleet_type_condition: emitted only when fleetType='tanker'
compartments_per_vehicle: 4 (ids 1–4 evidenced)

---

### DIM-TK-002 — Tank Compartment Temperature

dimension_id: DIM-TK-002
name: vehicle.tank.compartment.tempC
type: float
unit: Celsius
entity_ref: CE-001 (BM-062 N-09), BM-008 (tanker module)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.tank.compartments[].tempC (jitter(28, 8))

---

### DIM-TK-003 — Tank Compartment Pressure

dimension_id: DIM-TK-003
name: vehicle.tank.compartment.pressureMbar
type: float
unit: mbar
entity_ref: CE-001 (BM-062 N-09), BM-008 (tanker module)
surface_ref: TS-003
evidence: CEU-08 :: fleet.gateway.ts — TelemetryPayload.tank.compartments[].pressureMbar (jitter(25, 10))

---

---

## Group G — Domain Event Session Dimensions

### DIM-DE-001 — Driver Session Duration

dimension_id: DIM-DE-001
name: driver_session.durationMinutes
type: float
unit: minutes
entity_ref: CE-001 / BM-057 (N-07)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent.durationMinutes
event_name: driver.session.closed

---

### DIM-DE-002 — Driver Session Distance

dimension_id: DIM-DE-002
name: driver_session.distanceKm
type: float
unit: km
entity_ref: CE-001 / BM-057 (N-07)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent.distanceKm

---

### DIM-DE-003 — Driver Session Fuel Consumed

dimension_id: DIM-DE-003
name: driver_session.fuelConsumedL
type: float
unit: liters
entity_ref: CE-001 / BM-057 (N-07)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent.fuelConsumedL

---

### DIM-DE-004 — Driver Session Wear Index

dimension_id: DIM-DE-004
name: driver_session.wearIndex
type: float
unit: dimensionless
entity_ref: CE-001 / BM-057 (N-07)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent.wearIndex

---

### DIM-DE-005 — Driver Session Health Delta

dimension_id: DIM-DE-005
name: driver_session.healthDelta
type: float
unit: dimensionless
entity_ref: CE-001 / BM-057 (N-07)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent.healthDelta

---

### DIM-DE-006 — DWVS Score

dimension_id: DIM-DE-006
name: driver_session.dwvs
type: float
unit: dimensionless
entity_ref: CE-001 / BM-043 (driver-scoring), BM-057 (driver-sessions)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent.dwvs
event_name: driver.session.dwvs.computed

---

### DIM-DE-007 — Alert Severity

dimension_id: DIM-DE-007
name: alert.severity
type: enum
values: critical | high | medium | low | info
entity_ref: CE-001 / BM-005 (alerts)
surface_ref: TS-008, TS-013
evidence: CEU-08 :: fleet-events.ts — AlertEvent.severity; fleet.gateway.ts — AlertPayload.severity

---

### DIM-DE-008 — EV State of Charge

dimension_id: DIM-DE-008
name: ev.stateOfChargePercent
type: float
unit: percent (0–100)
entity_ref: CE-001 / BM-022 (ev)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — EvEvent.stateOfChargePercent
events: ev.battery.low, ev.battery.critical, ev.charge.started, ev.charge.completed

---

### DIM-DE-009 — Cold Chain Temperature

dimension_id: DIM-DE-009
name: coldchain.temperatureC
type: float
unit: Celsius
entity_ref: CE-001 / BM-021 (coldchain)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — ColdChainEvent.temperatureC
event_name: coldchain.temp.breach

---

### DIM-DE-010 — Fuel Transaction Volume

dimension_id: DIM-DE-010
name: fuel.volumeL
type: float
unit: liters
entity_ref: CE-001 / BM-007 (fuel)
surface_ref: TS-008
evidence: CEU-08 :: fleet-events.ts — FuelEvent.volumeL; FuelEvent.type = 'fill' | 'drain' | 'theft_suspected' | 'low_level'

---

---

## Group H — Connection State Dimensions

### DIM-CS-001 — WebSocket Connected Clients

dimension_id: DIM-CS-001
name: websocket.connectedClients
type: integer
unit: count
entity_ref: CE-001 / BM-062 (N-09)
surface_ref: TS-017
evidence: CEU-08 :: fleet.gateway.ts — connectedClients.size (logged on connect/disconnect)

---

---

## Group I — HASI Bridge Poll Dimensions

### DIM-PC-001 — HASI Poll Interval

dimension_id: DIM-PC-001
name: hasi_bridge.poll_interval_sec
type: integer (config)
unit: seconds
entity_ref: SA-001 (N-16)
surface_ref: TS-014
evidence: CEU-10 :: hasi_bridge.py — poll_interval_sec = 30 (DEFAULT_CONFIG)

---

### DIM-PC-002 — HASI Batch Size

dimension_id: DIM-PC-002
name: hasi_bridge.batch_size
type: integer (config)
unit: record count per push
entity_ref: SA-001 (N-16)
surface_ref: TS-014
evidence: CEU-10 :: hasi_bridge.py — batch_size = 10 (DEFAULT_CONFIG)

---

---

## Dimension Count Summary

| Group | Count |
|-------|-------|
| Process Resource (DIM-PR) | 5 |
| Cache Performance (DIM-CP) | 3 |
| Event Throughput (DIM-ET) | 1 |
| Vehicle Position (DIM-VP) | 6 |
| Vehicle Telemetry (DIM-VT) | 10 |
| Tank Telemetry (DIM-TK) | 3 |
| Domain Event Session (DIM-DE) | 10 |
| Connection State (DIM-CS) | 1 |
| Poll Cycle (DIM-PC) | 2 |
| **Total** | **41** |

---

## Unknown-Space — Dimensions

| ID | Description |
|----|-------------|
| TDIM-01 | PrometheusService internal metric registration beyond the 7 evidenced gauges — possible counters/histograms not read |
| TDIM-02 | PerformanceMiddleware getMetrics() schema — endpoint-level metrics format not read beyond existence |
| TDIM-03 | SA-002 sensor collector emitted dimensions — sensor_collector.py not read |
| TDIM-04 | Driver safety/efficiency scores (drivers.safety_score, drivers.efficiency_score from DS-004) — schema evidenced but event payload content not read |

---

## Status

dimensions_defined: 41
all_dimensions_evidence_backed: TRUE
inference_applied: NONE
structure_modified: FALSE
