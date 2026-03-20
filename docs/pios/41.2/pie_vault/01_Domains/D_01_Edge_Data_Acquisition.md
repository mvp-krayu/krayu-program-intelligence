# Domain: Edge Data Acquisition

**domain_id:** DOMAIN-01
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED (1 component WEAKLY GROUNDED)

## Description

The physical and software layer that collects sensor data and network security intelligence at the vehicle edge. Evidenced by: sensor_collector.py reading CAN FD / J1939 / Modbus / GPIO / I2C / BLE sensors and pushing batched telemetry to the cloud (EVID-SC); hasi_bridge.py polling the HASI SQLite database and forwarding network threat data (EVID-HB); the SVG 2.0 hardware platform hosting both agents (EVID-ARCH section s2); and the SVG Main Telemetry Firmware providing GPS data to sensor_collector.py via shared memory (EVID-SC lines 271–278). The HASI v1.0.0 system performs local network traffic capture and analysis, feeding hasi_bridge.py. Configuration assets govern device identity, broker endpoints, sensor thresholds, and calibration. The operational intent (IIM-02) confirms this layer is designed for high-volume, low-latency, resilient data collection with MQTT primary delivery and REST fallback.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-01 | [Vehicle Sensor Collection](../02_Capabilities/C_01_Vehicle_Sensor_Collection.md) | CORE | GROUNDED |
| CAP-02 | [Network Security Intelligence Collection](../02_Capabilities/C_02_Network_Security_Intelligence_Collection.md) | CORE | GROUNDED |
| CAP-03 | [SVG Device Hardware Platform](../02_Capabilities/C_03_SVG_Device_Hardware_Platform.md) | INFRASTRUCTURE | GROUNDED |
| CAP-04 | [SVG Device Firmware Management](../02_Capabilities/C_04_SVG_Device_Firmware_Management.md) [*] | SUPPORTING | WEAKLY GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-72 | [SVG 2.0 Smart Vehicle Gateway](../03_Components/CMP_72_svg_2_0_smart_vehicle_gateway.md) | INFRASTRUCTURE | CAP-03 |
| COMP-73 | [sensor_collector.py](../03_Components/CMP_73_sensor_collector_py.md) | BACKEND | CAP-01 |
| COMP-74 | [hasi_bridge.py](../03_Components/CMP_74_hasi_bridge_py.md) | BACKEND | CAP-02 |
| COMP-75 | [HASI v1.0.0](../03_Components/CMP_75_hasi_v1_0_0.md) | BACKEND | CAP-02 |
| COMP-76 | [SVG Main Telemetry Firmware](../03_Components/CMP_76_svg_main_telemetry_firmware.md) | INFRASTRUCTURE | CAP-01 |
| COMP-77 | [SVG OTA Agent](../03_Components/CMP_77_svg_ota_agent.md) [*] | INFRASTRUCTURE | CAP-04 |
| COMP-78 | [SVG Agent Configuration](../03_Components/CMP_78_svg_agent_configuration.md) | DATA | CAP-01 |

## Execution Path Participation

- EP-01 (Sensor Telemetry Ingest Path — steps 1–4)
- EP-02 (HASI Network Security Intelligence Path — steps 1–4)
- EP-07 (OTA Firmware Update Deployment — step 6)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-72, COMP-73, COMP-74, COMP-75, COMP-76, COMP-77, COMP-78
- relationship_anchors: R-001, R-002, R-003, R-005, R-006, R-007, R-008, R-039

## Navigation

- ↓ Capabilities: [[C_01_Vehicle_Sensor_Collection]] · [[C_02_Network_Security_Intelligence_Collection]] · [[C_03_SVG_Device_Hardware_Platform]] · [[C_04_SVG_Device_Firmware_Management]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
