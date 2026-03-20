# Capability: Sensor Telemetry Ingestion

**capability_id:** CAP-20
**parent_domain:** DOMAIN-07 — Sensor and Security Ingestion
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Cloud-side reception of sensor readings, threshold evaluation, HAZMAT alert generation, and persistence to TimescaleDB sensor_readings hypertable. SensorsModule confirmed at app.module.ts line 106 with migration SensorsAndHasiIntegration.ts. New in v3.23.0.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-62 | [SensorsModule](../03_Components/CMP_62_SensorsModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-01 (Sensor Telemetry Ingest — step 5)
- EP-05 (Domain Event Fan-Out — SensorsModule as emitter)

## Relationships

- R-004: MQTT Broker BROADCASTS_TO SensorsModule
- R-015: SensorsModule PERSISTS_TO TimescaleDB
- R-018: SensorsModule EMITS FleetEventsModule

## Traceability Reference

Source anchors: capability_map.md CAP-20

## Navigation

- ↑ Domain: [[D_07_Sensor_and_Security_Ingestion]]
- ↓ Components: [[CMP_62_SensorsModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
