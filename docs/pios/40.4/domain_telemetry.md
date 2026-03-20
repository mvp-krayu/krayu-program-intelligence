# Domain Telemetry
run_id: run_01_blueedge
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.3-RUN02-CONTRACT-v3
date: 2026-03-19

---

## Purpose

Attaches extracted telemetry organized by functional domain. Domain boundaries are the 15 backend module category groups from entity_catalog.md (Categories A–O). No new groupings are created; the category structure is locked from 40.3.

---

## Domain Classification Reference

From 40.3 entity_catalog.md — backend module categories:

| Category | Modules | BM IDs |
|----------|---------|--------|
| A — Core Domain | 7 | BM-001..007 |
| B — Fleet Type Specialization | 3 | BM-008..010 |
| C — Operations & Infrastructure | 3 | BM-011..013 |
| D — Analytics & Reporting | 3 | BM-014..016 |
| E — Domain-Specific Compliance | 3 | BM-017..019 |
| F — Users | 1 | BM-020 |
| G — EV & Energy | 4 | BM-021..024 |
| H — World-Class Expansion | 16 | BM-025..040 |
| I — Advanced Features | 5 | BM-041..045 |
| J — Multi-Tenant SaaS | 3 | BM-046..048 |
| K — Integration Layer | 8 | BM-049..056 |
| L — Vehicle Lifecycle Intelligence | 2 | BM-057..058 |
| M — External Sensors & Security | 2 | BM-059..060 |
| N — Infrastructure Modules | 3 | BM-061..063 |
| O — Auth & Versioning | 2 | BM-064..065 |

---

## Domain A — Core Domain (BM-001 through BM-007)

modules: vehicles, drivers, fleets, trips, alerts, maintenance, fuel
telemetry_coverage: PARTIAL

**vehicles (BM-001)**

| Telemetry type | Observable | Surface | Evidence |
|---------------|-----------|---------|---------|
| Position telemetry | vehicle.position.updated event | TS-008 | fleet-events.ts VehiclePositionEvent |
| State changes | vehicle.created, vehicle.updated, vehicle.status.changed | TS-008 | fleet-events.ts FleetEvents |
| Real-time position | fleet:positions broadcast | TS-002 | fleet.gateway.ts |
| Real-time telemetry | vehicle:telemetry broadcast | TS-003 | fleet.gateway.ts |

Dimensions: DIM-VP-001..006, DIM-VT-001..010

**drivers (BM-002)**

| Telemetry type | Observable | Surface | Evidence |
|---------------|-----------|---------|---------|
| Score changes | driver.score.changed | TS-008 | fleet-events.ts |
| Assignment changes | driver.assigned, driver.unassigned | TS-008 | fleet-events.ts |
| Driver session events | driver.session.started/closed/interrupted | TS-008 | fleet-events.ts |

Dimensions: DIM-DE-006 (DWVS score — via driver-sessions domain)

**fleets (BM-003)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Fleet lifecycle events | via BaseFleetEvent.orgId on domain events | fleet-events.ts |

No fleet-specific event type in FleetEvents constant. Domain events carry orgId for fleet scoping.

**trips (BM-004)**

| Telemetry type | Observable | Surface | Evidence |
|---------------|-----------|---------|---------|
| Trip lifecycle | trip.created, trip.started, trip.completed, trip.cancelled, trip.delayed, trip.waypoint.reached | TS-008 | fleet-events.ts TripEvent |
| Payload: | tripId, vehicleId, driverId, status | | fleet-events.ts TripEvent |

**alerts (BM-005)**

| Telemetry type | Observable | Surface | Evidence |
|---------------|-----------|---------|---------|
| Alert events | alert.created, alert.acknowledged, alert.resolved, alert.escalated | TS-008 | fleet-events.ts AlertEvent |
| Real-time alerts | alert:new broadcast | TS-013 | fleet.gateway.ts |
| Alert severity | DIM-DE-007 — critical/high/medium/low/info | TS-008, TS-013 | |

**maintenance (BM-006)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Work order events | maintenance.workorder.created, maintenance.workorder.completed | fleet-events.ts MaintenanceEvent |
| Due/overdue alerts | maintenance.due, maintenance.overdue | fleet-events.ts |

**fuel (BM-007)**

| Telemetry type | Observable | Surface | Evidence |
|---------------|-----------|---------|---------|
| Fuel transactions | fuel.transaction | TS-008 | fleet-events.ts FuelEvent |
| Theft detection | fuel.theft.suspected | TS-008 | fleet-events.ts |
| Level alerts | fuel.level.low | TS-008 | fleet-events.ts |
| Volume dimension | DIM-DE-010 fuelVolumeL | TS-008 | fleet-events.ts FuelEvent.volumeL |

---

## Domain B — Fleet Type Specialization (BM-008 through BM-010)

modules: tanker, bus, taxi

**tanker (BM-008)**

| Telemetry type | Observable | Surface | Evidence |
|---------------|-----------|---------|---------|
| Compartment level | DIM-TK-001 | TS-003 | fleet.gateway.ts TelemetryPayload.tank |
| Compartment temp | DIM-TK-002 | TS-003 | fleet.gateway.ts |
| Compartment pressure | DIM-TK-003 | TS-003 | fleet.gateway.ts |
| Cargo events | tanker.cargo.loaded, tanker.cargo.delivered, tanker.custody.transfer | TS-008 | fleet-events.ts |
| Safety events | tanker.tank.temp.breach, tanker.tank.pressure.alarm, tanker.gas.leak | TS-008 | fleet-events.ts |
| Fleet type filter | fleet:positions and vehicle:telemetry for fleetType='tanker' | TS-002, TS-003 | fleet.gateway.ts |

**bus (BM-009)**, **taxi (BM-010)**

No bus/taxi-specific telemetry event types in FleetEvents constant.
Observable via: fleet:positions with fleetType='bus'/'taxi' (TS-002 — DIM-VP-001..006)
Route/fare telemetry not evidenced in extracted source.

---

## Domain C — Operations & Infrastructure (BM-011 through BM-013)

modules: operations, devices, notifications

**devices (BM-012)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Device connection | system.device.connected, system.device.disconnected | fleet-events.ts FleetEvents |
| Device IDs | carried in event payload source field | fleet-events.ts BaseFleetEvent.source |

**notifications (BM-013)**

Notifications module is a handler target for the notification.handler event handler.
Request-level telemetry via TS-012 if outbound HTTP calls are made.
No dedicated notification telemetry surface evidenced.

**operations (BM-011)**

No operations-specific event types evidenced in FleetEvents constant.

---

## Domain D — Analytics & Reporting (BM-014 through BM-016)

modules: analytics, reports, diagnostics

**diagnostics (BM-016)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| DTC events | diagnostics.dtc.detected, diagnostics.dtc.cleared | fleet-events.ts |
| Predictive failure | diagnostics.predictive.failure | fleet-events.ts |

analytics (BM-014), reports (BM-015): No dedicated event types in FleetEvents. Observable via request log (TS-012) for report generation requests.

---

## Domain E — Domain-Specific Compliance (BM-017 through BM-019)

modules: compliance, safety, finance

**compliance (BM-017)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Violation | compliance.violation | fleet-events.ts |
| Expiry | compliance.expiring | fleet-events.ts |
| Renewal | compliance.renewed | fleet-events.ts |

**safety (BM-018)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Safety event | safety.event.detected, safety.event.reviewed | fleet-events.ts SafetyEventPayload |
| Score update | safety.score.updated | fleet-events.ts |
| Severity | DIM-DE-007 equivalent — critical/high/medium/low | fleet-events.ts |
| Location | position at time of safety event | fleet-events.ts SafetyEventPayload.location |

**finance (BM-019)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Transactions | finance.transaction.created, finance.transaction.approved | fleet-events.ts |
| Budget alerts | finance.budget.exceeded | fleet-events.ts |

---

## Domain G — EV & Energy (BM-021 through BM-024)

modules: coldchain, ev, ota, v2g

**coldchain (BM-021)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Temperature breach | coldchain.temp.breach | fleet-events.ts ColdChainEvent |
| Shipment events | coldchain.shipment.loaded, coldchain.shipment.delivered | fleet-events.ts |
| Temperature dimension | DIM-DE-009 temperatureC | fleet-events.ts ColdChainEvent.temperatureC |

**ev (BM-022)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Charge events | ev.charge.started, ev.charge.completed | fleet-events.ts EvEvent |
| Battery events | ev.battery.low, ev.battery.critical | fleet-events.ts EvEvent |
| State of charge | DIM-DE-008 stateOfChargePercent | fleet-events.ts EvEvent.stateOfChargePercent |

**ota (BM-023)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Update lifecycle | ota.update.available, ota.update.started, ota.update.completed, ota.update.failed | fleet-events.ts |

**v2g (BM-024)**

| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| V2G session | v2g.session.started, v2g.session.completed | fleet-events.ts |
| Grid signal | v2g.grid.signal | fleet-events.ts |

---

## Domain H–K — Advanced, SaaS, Integration (BM-025 through BM-056)

modules: surge-pricing through data-monetization (32 modules)

No dedicated event types in FleetEvents constant for these 32 modules.

Observable telemetry:
- Request log (TS-012): all HTTP requests to these module endpoints
- Event emission (TS-008): if these modules emit events, they appear in DIM-ET-001 aggregate
- Per-module specific event types NOT evidenced in fleet-events.ts at 40.3/40.4 depth

Note: BM-038 (blockchain), BM-053 (agentic-ai), BM-041 (predictive-maintenance), BM-042 (digital-twin) likely have domain-specific telemetry surfaces not read.
Unknown-space: TUS-04 (per prior declaration) — domain-specific metrics not evidenced beyond TS-012

---

## Domain L — Vehicle Lifecycle Intelligence (BM-057 through BM-058)

modules: driver-sessions, vehicle-lifecycle

**driver-sessions (BM-057)**

This is the highest-telemetry domain in terms of event payload richness.

| Telemetry type | Observable | Surface | Evidence |
|---------------|-----------|---------|---------|
| Session start | driver.session.started | TS-008 | fleet-events.ts DriverSessionEvent |
| Session close | driver.session.closed | TS-008 | fleet-events.ts — full session payload |
| Session interrupt | driver.session.interrupted | TS-008 | fleet-events.ts |
| DWVS computed | driver.session.dwvs.computed | TS-008 | fleet-events.ts |
| Duration | DIM-DE-001 durationMinutes | TS-008 | DriverSessionEvent.durationMinutes |
| Distance | DIM-DE-002 distanceKm | TS-008 | DriverSessionEvent.distanceKm |
| Fuel consumed | DIM-DE-003 fuelConsumedL | TS-008 | DriverSessionEvent.fuelConsumedL |
| Wear index | DIM-DE-004 wearIndex | TS-008 | DriverSessionEvent.wearIndex |
| Health delta | DIM-DE-005 healthDelta | TS-008 | DriverSessionEvent.healthDelta |
| DWVS score | DIM-DE-006 dwvs | TS-008 | DriverSessionEvent.dwvs |
| Auth method | authMethod — faceid_nfc/pin_rfid/biometric/manual | TS-008 | DriverSessionEvent.authMethod |
| TPM signed | tpmSigned boolean | TS-008 | DriverSessionEvent.tpmSigned |
| Block hash | blockHash — blockchain audit trail | TS-008 | DriverSessionEvent.blockHash |

**vehicle-lifecycle (BM-058)**

No dedicated event types in FleetEvents. Observable via vehicle.* events from BM-001 and maintenance.* from BM-006.

---

## Domain M — External Sensors & Security (BM-059 through BM-060)

modules: sensors, hasi

**sensors (BM-059)**

telemetry.received event in FleetEvents implies sensor data ingestion:
| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| Telemetry received | telemetry.received | fleet-events.ts — TelemetryEvent |
| Telemetry anomaly | telemetry.anomaly | fleet-events.ts |
| Payload | vehicleId, deviceId, readings{} | fleet-events.ts TelemetryEvent |

Note: SA-002 sensor collector feeds this domain. SA-002 execution path not read (US-08, US-13).

**hasi (BM-060)**

HASI security data flows from SA-001 via MQTT or REST into BM-060:
| Telemetry type | Observable | Evidence |
|---------------|-----------|---------|
| HASI data ingestion | via SD-006/SD-007 → BM-060 | hasi_bridge.py + BM-060 module registered |
| Security events | stored in INF-001 via BD-006 | DB schema not read for HASI tables |

---

## Domain N — Infrastructure Modules (BM-061 through BM-063)

This domain IS the primary telemetry infrastructure.

| Module | Telemetry role |
|--------|---------------|
| BM-061 (health) | Prometheus metrics export, health/readiness/metrics endpoints |
| BM-062 (gateways) | Real-time WebSocket broadcast surfaces |
| BM-063 (events) | Event bus — all 65 domain event types; 4 handler telemetry effects |

See entity_telemetry.md for full BM-061/062/063 coverage.

---

## Domain O — Auth & Versioning (BM-064 through BM-065)

**auth (BM-064)**

Auth events observable indirectly:
- 401 Unauthorized responses in TS-012 (JWT validation failed)
- 403 Forbidden responses in TS-012 (role check failed)
- system.device.connected/disconnected in FleetEvents — device auth observable

**versioning (BM-065)**

Route pass-through. No dedicated telemetry. Observable via TS-012 route logs showing /api/v1/ or /api/v2/ path prefix.

---

## Domain Telemetry Coverage Summary

| Domain | Coverage | Primary surface |
|--------|---------|----------------|
| A — Core Domain | PARTIAL | TS-008 (events), TS-002/003 (realtime) |
| B — Fleet Type Specialization | PARTIAL | TS-003 (tanker compartments), TS-002 |
| C — Operations | PARTIAL | TS-008 (device events), TS-012 |
| D — Analytics | PARTIAL | TS-012, diagnostics TS-008 |
| E — Compliance | PARTIAL | TS-008 (compliance/safety/finance events) |
| F — Users | INDIRECT | TS-012 request log |
| G — EV & Energy | PARTIAL | TS-008 (EV/coldchain/OTA/V2G events) |
| H — World-Class | INDIRECT | TS-012 only |
| I — Advanced | INDIRECT | TS-012 only |
| J — SaaS | INDIRECT | TS-012 only |
| K — Integration | INDIRECT | TS-012 only |
| L — Vehicle Lifecycle | HIGH | TS-008 (DriverSessionEvent — richest payload) |
| M — External Sensors | PARTIAL | TS-008 (telemetry.received), SA-001 poll |
| N — Infrastructure | HIGH | TS-001, TS-002, TS-003, TS-008, TS-009..012 |
| O — Auth & Versioning | INDIRECT | TS-012 |

---

## Status

domain_telemetry_complete: PARTIAL
highest_coverage_domains: N (Infrastructure), L (Vehicle Lifecycle)
lowest_coverage_domains: H, I, J, K (indirect request log only)
structure_modified: FALSE
