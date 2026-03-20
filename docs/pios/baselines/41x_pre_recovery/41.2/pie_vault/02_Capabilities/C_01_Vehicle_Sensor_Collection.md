# Capability: Vehicle Sensor Collection

**capability_id:** CAP-01
**parent_domain:** DOMAIN-01 — Edge Data Acquisition
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Multi-protocol physical sensor reading, calibration, buffering, and batched cloud delivery from the SVG 2.0 hardware. Evidenced by sensor_collector.py (479 LOC, reads CAN FD / J1939 / Modbus RTU / GPIO / I2C / BLE, 100ms polling, 50-reading batches every 5s, 10K local buffer), GPS enrichment from SVG Main Telemetry Firmware via /dev/shm/blueedge_gps, and configuration via sensors.yaml (per-sensor protocol, thresholds, calibration).

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-73 | [sensor_collector.py](../03_Components/CMP_73_sensor_collector_py.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-76 | [SVG Main Telemetry Firmware](../03_Components/CMP_76_svg_main_telemetry_firmware.md) | INFRASTRUCTURE | DERIVED |
| COMP-78 | [SVG Agent Configuration](../03_Components/CMP_78_svg_agent_configuration.md) | DATA | DIRECT_EVIDENCE |

## Execution Contribution

- EP-01 (Sensor Telemetry Ingest — primary execution steps 1–4)

## Relationships

- R-001: sensor_collector.py EMITS MQTT Broker EMQX
- R-002: sensor_collector.py CALLS SensorsModule (fallback)
- R-003: sensor_collector.py CONSUMES SVG Main Telemetry Firmware

## Traceability Reference

Source anchors: capability_map.md CAP-01

## Navigation

- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ↓ Components: [[CMP_73_sensor_collector_py]] · [[CMP_76_svg_main_telemetry_firmware]] · [[CMP_78_svg_agent_configuration]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
