# Domain Telemetry
run_id: run_03_blueedge_repeat
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG1E-REPEAT
upstream_contract: PIOS-40.3-RUN02-IG1E-REPEAT
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1E determinism re-run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; repeat of IG.1C for determinism verification

---

## Purpose

Attaches telemetry to the backend module domain layer (BM-001 through BM-060, N-07) organized by category. Telemetry is attributed at the domain category level, not individual module level, except where module-specific telemetry is directly evidenced. No structural modifications are made.

---

## Domain Category Telemetry

The 60 domain modules (BM-001..BM-060) are grouped in categories A through O as established in the entity catalog.

---

### Category A — Core Fleet Operations

modules: BM-001 (vehicles), BM-002 (drivers), BM-003 (routes), BM-004 (trips), BM-005 (alerts), BM-006 (geofencing)
node_ref: N-07
telemetry_primary_surface: TS-008 (domain events), TS-012 (HTTP request log)
key_dimensions:
- BM-001 vehicles: DIM-VP-001..006 (position fields via VehiclePositionEvent)
- BM-005 alerts: DIM-DE-007 (alert severity via AlertEvent / AlertPayload)
- BM-003 routes, BM-004 trips, BM-006 geofencing: telemetry observable via domain events (GeofenceEvent) and TS-012
evidence: CEU-08 :: fleet-events.ts — vehicle.position.updated, alert.*, geofence.*
completeness: PARTIAL — all modules emit via TS-012; subset has typed event payloads

---

### Category B — Fleet Asset Management

modules: BM-007 (fuel), BM-008 (tanker), BM-009 (maintenance), BM-010 (documents)
node_ref: N-07
telemetry_primary_surface: TS-008, TS-012
key_dimensions:
- BM-007 fuel: DIM-DE-010 (fuel volumeL, type: fill/drain/theft_suspected/low_level)
- BM-008 tanker: DIM-TK-001..003 (compartment telemetry via TS-003 and fleet events)
evidence: CEU-08 :: fleet-events.ts — FuelEvent.volumeL; fleet.gateway.ts — tank compartment payload (fleetType='tanker')
completeness: PARTIAL

---

### Category C — Driver Management

modules: BM-011 (driver-documents), BM-012 (driver-training), BM-013 (driver-incidents)
node_ref: N-07
telemetry_primary_surface: TS-008, TS-012
evidence: CEU-08 :: fleet-events.ts — driver.* event namespace
completeness: PARTIAL — event namespace evidenced; typed payload schemas not all read

---

### Category D — Operations and Scheduling

modules: BM-014 (schedules), BM-015 (dispatch), BM-016 (waypoints), BM-017 (stops)
node_ref: N-07
telemetry_primary_surface: TS-012
evidence: CEU-08 :: src/app.module.ts — module registration
completeness: INDIRECT — telemetry observable only via HTTP request log (TS-012)

---

### Category E — Cargo and Delivery

modules: BM-018 (cargo), BM-019 (delivery-orders), BM-020 (shipments)
node_ref: N-07
telemetry_primary_surface: TS-012
evidence: CEU-08 :: src/app.module.ts — module registration
completeness: INDIRECT

---

### Category F — Specialized Fleet Operations

modules: BM-021 (coldchain), BM-022 (ev)
node_ref: N-07
telemetry_primary_surface: TS-008, TS-012
key_dimensions:
- BM-021 coldchain: DIM-DE-009 (temperatureC via ColdChainEvent coldchain.temp.breach)
- BM-022 ev: DIM-DE-008 (stateOfChargePercent via EvEvent — ev.battery.low, ev.battery.critical, ev.charge.started, ev.charge.completed)
evidence: CEU-08 :: fleet-events.ts — ColdChainEvent, EvEvent
completeness: PARTIAL — event payloads evidenced; full module API telemetry not read

---

### Category G — Compliance and Safety

modules: BM-023 (compliance), BM-024 (safety-incidents), BM-025 (hos), BM-026 (inspections)
node_ref: N-07
telemetry_primary_surface: TS-012
evidence: CEU-08 :: src/app.module.ts — module registration
completeness: INDIRECT

---

### Category H — Analytics and Reporting

modules: BM-027 (analytics), BM-028 (reports), BM-029 (kpis), BM-030 (dashboards)
node_ref: N-07
telemetry_primary_surface: TS-012
evidence: CEU-08 :: src/app.module.ts — module registration
completeness: INDIRECT

---

### Category I — Customer and Organization Management

modules: BM-031 (customers), BM-032 (organizations), BM-033 (users), BM-034 (roles), BM-035 (permissions)
node_ref: N-07
telemetry_primary_surface: TS-012
evidence: CEU-08 :: src/app.module.ts — module registration
completeness: INDIRECT

---

### Category J — Notifications and Communications

modules: BM-036 (notifications), BM-037 (webhooks), BM-038 (messaging)
node_ref: N-07
telemetry_primary_surface: TS-008 (notification.handler via domain events), TS-012
evidence: CEU-08 :: fleet-events.ts — notification.handler in BM-063 handlers
completeness: PARTIAL — notification handler triggered by domain events (observable via TS-008 event emission); internal dispatch not read

---

### Category K — Configuration and Settings

modules: BM-039 (settings), BM-040 (configuration), BM-041 (thresholds)
node_ref: N-07
telemetry_primary_surface: TS-012
evidence: CEU-08 :: src/app.module.ts — module registration
completeness: INDIRECT

---

### Category L — Billing and Finance

modules: BM-042 (billing), BM-043 (driver-scoring), BM-044 (invoices), BM-045 (payments), BM-046 (expenses)
node_ref: N-07
telemetry_primary_surface: TS-008, TS-012
key_dimensions:
- BM-043 driver-scoring: DIM-DE-006 (dwvs via DriverSessionEvent.dwvs, event: driver.session.dwvs.computed)
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent.dwvs
completeness: PARTIAL

---

### Category M — External Integrations

modules: BM-047 (api-keys), BM-048 (integrations), BM-049 (third-party)
node_ref: N-07
telemetry_primary_surface: TS-012
evidence: CEU-08 :: src/app.module.ts — module registration
completeness: INDIRECT

---

### Category N — Platform Features

modules: BM-050 (subscriptions), BM-051 (features), BM-052 (audit-log), BM-053 (file-uploads), BM-054 (search), BM-055 (export)
node_ref: N-07
telemetry_primary_surface: TS-008 (audit-log.handler via domain events), TS-012
evidence: CEU-08 :: fleet-events.ts — audit-log.handler in BM-063 handlers writes to DB (BM-052 area)
completeness: PARTIAL — audit log handler observable via TS-007 (DB write); direct BM-052 telemetry not evidenced

---

### Category O — Specialized Modules

modules: BM-056 (telematics), BM-057 (driver-sessions), BM-058 (vehicle-health), BM-059 (predictive-maintenance), BM-060 (insurance)
node_ref: N-07
telemetry_primary_surface: TS-008, TS-012
key_dimensions:
- BM-057 driver-sessions: DIM-DE-001..006 (durationMinutes, distanceKm, fuelConsumedL, wearIndex, healthDelta, dwvs via DriverSessionEvent on event: driver.session.closed)
evidence: CEU-08 :: fleet-events.ts — DriverSessionEvent
note_on_BM-060: BM-060 insurance registration status is US-14
completeness: PARTIAL

---

## Domain Telemetry Coverage Summary

| Category | Modules | Telemetry Coverage | Key Surfaces |
|----------|---------|-------------------|--------------|
| A — Core Fleet Operations | BM-001..006 | PARTIAL (position + alerts evidenced) | TS-008, TS-012 |
| B — Fleet Asset Management | BM-007..010 | PARTIAL (fuel + tanker evidenced) | TS-008, TS-003, TS-012 |
| C — Driver Management | BM-011..013 | PARTIAL | TS-008, TS-012 |
| D — Operations and Scheduling | BM-014..017 | INDIRECT | TS-012 |
| E — Cargo and Delivery | BM-018..020 | INDIRECT | TS-012 |
| F — Specialized Fleet Operations | BM-021..022 | PARTIAL (coldchain + EV evidenced) | TS-008, TS-012 |
| G — Compliance and Safety | BM-023..026 | INDIRECT | TS-012 |
| H — Analytics and Reporting | BM-027..030 | INDIRECT | TS-012 |
| I — Customer and Org Management | BM-031..035 | INDIRECT | TS-012 |
| J — Notifications and Communications | BM-036..038 | PARTIAL | TS-008, TS-012 |
| K — Configuration and Settings | BM-039..041 | INDIRECT | TS-012 |
| L — Billing and Finance | BM-042..046 | PARTIAL (driver scoring evidenced) | TS-008, TS-012 |
| M — External Integrations | BM-047..049 | INDIRECT | TS-012 |
| N — Platform Features | BM-050..055 | PARTIAL (audit log evidenced) | TS-008, TS-007, TS-012 |
| O — Specialized Modules | BM-056..060 | PARTIAL (driver sessions evidenced) | TS-008, TS-012 |

---

## Status

domain_telemetry_complete: PARTIAL
all_domain_telemetry_evidence_backed: TRUE
structure_modified: FALSE
new_entities_created: NONE
