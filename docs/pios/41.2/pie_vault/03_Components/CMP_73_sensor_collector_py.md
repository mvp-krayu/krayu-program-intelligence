# Component: sensor_collector.py

**component_id:** COMP-73
**tier:** BACKEND
**semantic_capability:** CAP-01 — Vehicle Sensor Collection
**semantic_domain:** DOMAIN-01 — Edge Data Acquisition

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** svg-agents/sensor-collector/sensor_collector.py — full file read (479 lines)

## Description

Multi-protocol sensor reading agent: 479 LOC reads CAN FD / J1939 / Modbus RTU / GPIO / I2C / BLE at 100ms polling batches 50 readings every 5s with 10K local buffer. GPS enrichment via /dev/shm/blueedge_gps.

## Relationships

R-001: sensor_collector.py EMITS MQTT Broker EMQX; R-002: sensor_collector.py CALLS SensorsModule (fallback); R-003: sensor_collector.py CONSUMES SVG Main Telemetry Firmware

## Traceability Reference

**semantic_traceability_entry:** COMP-73 in semantic_traceability_map.md

## Parent Capability

[[C_01_Vehicle_Sensor_Collection]]

## Navigation

- ↑ Capability: [[C_01_Vehicle_Sensor_Collection]]
- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
