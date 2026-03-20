# Signal Input Matrix
run_id: run_01_blueedge
stream: Stream 40.5 — PiOS Signal Computation Engine
contract: PIOS-40.5-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.4-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Matrix Rule

This matrix declares all 41 telemetry input variables for Stream 40.5, drawn exclusively from the run_01_blueedge 40.4 canonical artifacts. Each variable maps one-to-one to a DIM- dimension defined in docs/pios/40.4/telemetry_dimension_catalog.md. Variables explicitly used in signal computation are annotated with the relevant SIG- identifier. Variables declared but not used in the current signal set are annotated SIG-NONE.

No variables are fabricated or inferred. All DIM- references are grounded in docs/pios/40.4/telemetry_dimension_catalog.md.

---

## Group VAR_SYS — Process Resource Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_SYS_001 | DIM-PR-001 | blueedge_process_heap_bytes | gauge | bytes | TS-001 | TMP-004 (10s) | SIG-001 |
| VAR_SYS_002 | DIM-PR-002 | blueedge_process_rss_bytes | gauge | bytes | TS-001 | TMP-004 (10s) | SIG-NONE |
| VAR_SYS_003 | DIM-PR-003 | blueedge_process_external_bytes | gauge | bytes | TS-001 | TMP-004 (10s) | SIG-NONE |
| VAR_SYS_004 | DIM-PR-004 | process_uptime_seconds | gauge | seconds | TS-009, TS-011 | on-demand | SIG-NONE |
| VAR_SYS_005 | DIM-PR-005 | process_cpu_usage | counter object | microseconds | TS-011 | on-demand | SIG-NONE |

---

## Group VAR_CACHE — Cache Performance Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_CACHE_001 | DIM-CP-001 | blueedge_cache_hits_total | gauge | count | TS-001, TS-009 | TMP-004 (10s) | SIG-002 |
| VAR_CACHE_002 | DIM-CP-002 | blueedge_cache_misses_total | gauge | count | TS-001, TS-009 | TMP-004 (10s) | SIG-002 |
| VAR_CACHE_003 | DIM-CP-003 | blueedge_cache_connected | gauge | binary (1/0) | TS-001, TS-010 | TMP-004 (10s) | SIG-003 |

---

## Group VAR_EVT — Event Throughput Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_EVT_001 | DIM-ET-001 | blueedge_events_total | gauge | count | TS-001, TS-008, TS-009 | TMP-004 (10s) | SIG-004 |

---

## Group VAR_WS — Connection State Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_WS_001 | DIM-CS-001 | websocket.connectedClients | integer | count | TS-017 | TMP-010 (event-driven) | SIG-005 |

---

## Group VAR_POS — Vehicle Position Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_POS_001 | DIM-VP-001 | vehicle.position.lat | float | decimal degrees | TS-002, TS-008 | TMP-001 (2s) | SIG-NONE |
| VAR_POS_002 | DIM-VP-002 | vehicle.position.lng | float | decimal degrees | TS-002, TS-008 | TMP-001 (2s) | SIG-NONE |
| VAR_POS_003 | DIM-VP-003 | vehicle.position.speed | integer | km/h | TS-002, TS-008 | TMP-001 (2s) | SIG-NONE |
| VAR_POS_004 | DIM-VP-004 | vehicle.position.heading | integer | degrees | TS-002, TS-008 | TMP-001 (2s) | SIG-NONE |
| VAR_POS_005 | DIM-VP-005 | vehicle.position.altitude | integer | meters | TS-002, TS-008 | TMP-001 (2s) | SIG-NONE |
| VAR_POS_006 | DIM-VP-006 | vehicle.position.status | enum | moving/idle/stopped/offline | TS-002 | TMP-001 (2s) | SIG-NONE |

---

## Group VAR_ENG — Vehicle Engine Telemetry Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_ENG_001 | DIM-VT-001 | vehicle.engine.rpm | integer | RPM | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_ENG_002 | DIM-VT-002 | vehicle.engine.coolantTempC | float | °C | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_ENG_003 | DIM-VT-003 | vehicle.engine.oilPressureKpa | float | kPa | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_ENG_004 | DIM-VT-004 | vehicle.engine.fuelRateL | float | L/h | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_ENG_005 | DIM-VT-005 | vehicle.vehicle.speedKmh | integer | km/h | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_ENG_006 | DIM-VT-006 | vehicle.vehicle.odometer | integer | km | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_ENG_007 | DIM-VT-007 | vehicle.vehicle.batteryVoltage | float | V | TS-003 | TMP-002 (5s) | SIG-NONE |

---

## Group VAR_SAF — Vehicle Safety Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_SAF_001 | DIM-VT-008 | vehicle.safety.absActive | boolean | — | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_SAF_002 | DIM-VT-009 | vehicle.safety.escActive | boolean | — | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_SAF_003 | DIM-VT-010 | vehicle.safety.rollStabilityWarning | boolean | — | TS-003 | TMP-002 (5s) | SIG-NONE |

---

## Group VAR_TK — Tank Telemetry Variables (Tanker Fleet Type)

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_TK_001 | DIM-TK-001 | vehicle.tank.compartment.levelPercent | float | % | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_TK_002 | DIM-TK-002 | vehicle.tank.compartment.tempC | float | °C | TS-003 | TMP-002 (5s) | SIG-NONE |
| VAR_TK_003 | DIM-TK-003 | vehicle.tank.compartment.pressureMbar | float | mbar | TS-003 | TMP-002 (5s) | SIG-NONE |

---

## Group VAR_DS — Driver Session Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_DS_001 | DIM-DE-001 | driver_session.durationMinutes | float | minutes | TS-008 | TMP-010 (event-driven) | SIG-NONE |
| VAR_DS_002 | DIM-DE-002 | driver_session.distanceKm | float | km | TS-008 | TMP-010 (event-driven) | SIG-NONE |
| VAR_DS_003 | DIM-DE-003 | driver_session.fuelConsumedL | float | liters | TS-008 | TMP-010 (event-driven) | SIG-NONE |
| VAR_DS_004 | DIM-DE-004 | driver_session.wearIndex | float | dimensionless | TS-008 | TMP-010 (event-driven) | SIG-008 |
| VAR_DS_005 | DIM-DE-005 | driver_session.healthDelta | float | dimensionless | TS-008 | TMP-010 (event-driven) | SIG-008 |
| VAR_DS_006 | DIM-DE-006 | driver_session.dwvs | float | dimensionless | TS-008 | TMP-010 (event-driven) | SIG-008 |

---

## Group VAR_ALT — Alert State Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_ALT_001 | DIM-DE-007 | alert.severity | enum | critical/high/medium/low/info | TS-008, TS-013 | TMP-003 + TMP-010 | SIG-007 |

---

## Group VAR_EV — EV Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_EV_001 | DIM-DE-008 | ev.stateOfChargePercent | float | % | TS-008 | TMP-010 (event-driven) | SIG-NONE |

---

## Group VAR_CC — Cold Chain Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_CC_001 | DIM-DE-009 | coldchain.temperatureC | float | °C | TS-008 | TMP-010 (event-driven) | SIG-NONE |

---

## Group VAR_FUEL — Fuel Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_FUEL_001 | DIM-DE-010 | fuel.volumeL | float | liters | TS-008 | TMP-010 (event-driven) | SIG-NONE |

---

## Group VAR_HASI — HASI Bridge Poll Variables

| Variable | DIM Ref | Dimension Name | Type | Unit | Surface | Temporal | Signal Use |
|----------|---------|----------------|------|------|---------|----------|------------|
| VAR_HASI_001 | DIM-PC-001 | hasi_bridge.poll_interval_sec | integer (config) | seconds | TS-014 | TMP-009 (30s config) | SIG-006 |
| VAR_HASI_002 | DIM-PC-002 | hasi_bridge.batch_size | integer (config) | records/push | TS-014 | TMP-009 (30s config) | SIG-006 |

---

## Matrix Summary

| Group | Variables | Dimensions | Signals Fed |
|-------|-----------|-----------|-------------|
| VAR_SYS | 5 | DIM-PR-001..005 | SIG-001 (DIM-PR-001 only) |
| VAR_CACHE | 3 | DIM-CP-001..003 | SIG-002, SIG-003 |
| VAR_EVT | 1 | DIM-ET-001 | SIG-004 |
| VAR_WS | 1 | DIM-CS-001 | SIG-005 |
| VAR_POS | 6 | DIM-VP-001..006 | SIG-NONE |
| VAR_ENG | 7 | DIM-VT-001..007 | SIG-NONE |
| VAR_SAF | 3 | DIM-VT-008..010 | SIG-NONE |
| VAR_TK | 3 | DIM-TK-001..003 | SIG-NONE |
| VAR_DS | 6 | DIM-DE-001..006 | SIG-008 (DIM-DE-004..006) |
| VAR_ALT | 1 | DIM-DE-007 | SIG-007 |
| VAR_EV | 1 | DIM-DE-008 | SIG-NONE |
| VAR_CC | 1 | DIM-DE-009 | SIG-NONE |
| VAR_FUEL | 1 | DIM-DE-010 | SIG-NONE |
| VAR_HASI | 2 | DIM-PC-001..002 | SIG-006 |
| **Total** | **41** | **41** | |

**Dimensions used in signal computation: 11** (DIM-PR-001, DIM-CP-001..003, DIM-ET-001, DIM-CS-001, DIM-PC-001..002, DIM-DE-004..007)
**Dimensions declared but not used in current signal set: 30**
**Reason for unused dimensions:** vehicle position/telemetry/tank/EV/coldchain/fuel dimensions require per-vehicle signal definitions and fleet-level aggregation — reserved for downstream streams

---

## Status

input_variables_declared: 41
signal_input_mappings: 11 active / 30 declared-only
all_dimensions_grounded: TRUE
evidence_source: docs/pios/40.4/telemetry_dimension_catalog.md
inference_applied: NONE
structure_modified: FALSE
