# Component: SVG Main Telemetry Firmware

**component_id:** COMP-76
**tier:** INFRASTRUCTURE
**semantic_capability:** CAP-01 — Vehicle Sensor Collection
**semantic_domain:** DOMAIN-01 — Edge Data Acquisition

## Source Anchor

**evidence_type:** DERIVED
**source_ref:** sensor_collector.py lines 271–278 reads /dev/shm/blueedge_gps written by main telemetry daemon

## Description

Main telemetry firmware daemon providing GPS data to sensor_collector.py via shared memory at /dev/shm/blueedge_gps.

## Relationships

R-003: sensor_collector.py CONSUMES SVG Main Telemetry Firmware

## Traceability Reference

**semantic_traceability_entry:** COMP-76 in semantic_traceability_map.md

## Parent Capability

[[C_01_Vehicle_Sensor_Collection]]

## Navigation

- ↑ Capability: [[C_01_Vehicle_Sensor_Collection]]
- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
