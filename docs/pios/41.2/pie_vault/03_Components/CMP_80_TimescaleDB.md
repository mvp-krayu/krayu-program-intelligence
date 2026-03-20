# Component: TimescaleDB

**component_id:** COMP-80
**tier:** DATA
**semantic_capability:** CAP-26 — Primary Data Persistence
**semantic_domain:** DOMAIN-10 — Platform Infrastructure and Data

## Source Anchor

**evidence_type:** DERIVED
**source_ref:** Architecture HTML section s1 layer 5; migration 1709100000000-SensorsAndHasiIntegration.ts named

## Description

TimescaleDB extension providing sensor_readings hypertable for high-volume time-series sensor data storage.

## Relationships

R-015: SensorsModule PERSISTS_TO TimescaleDB

## Traceability Reference

**semantic_traceability_entry:** COMP-80 in semantic_traceability_map.md

## Parent Capability

[[C_26_Primary_Data_Persistence]]

## Navigation

- ↑ Capability: [[C_26_Primary_Data_Persistence]]
- ↑ Domain: [[D_10_Platform_Infrastructure_and_Data]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
