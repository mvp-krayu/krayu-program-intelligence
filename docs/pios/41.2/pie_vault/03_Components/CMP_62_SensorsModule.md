# Component: SensorsModule

**component_id:** COMP-62
**tier:** BACKEND
**semantic_capability:** CAP-20 — Sensor Telemetry Ingestion
**semantic_domain:** DOMAIN-07 — Sensor and Security Ingestion

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 106; migration SensorsAndHasiIntegration.ts confirmed

## Description

Cloud-side reception of sensor readings threshold evaluation HAZMAT alert generation and persistence to TimescaleDB. New in v3.23.0.

## Relationships

R-004: MQTT Broker BROADCASTS_TO SensorsModule; R-015: SensorsModule PERSISTS_TO TimescaleDB; R-018: SensorsModule EMITS FleetEventsModule

## Traceability Reference

**semantic_traceability_entry:** COMP-62 in semantic_traceability_map.md

## Parent Capability

[[C_20_Sensor_Telemetry_Ingestion]]

## Navigation

- ↑ Capability: [[C_20_Sensor_Telemetry_Ingestion]]
- ↑ Domain: [[D_07_Sensor_and_Security_Ingestion]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
