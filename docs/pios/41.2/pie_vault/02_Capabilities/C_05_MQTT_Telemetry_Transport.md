# Capability: MQTT Telemetry Transport

**capability_id:** CAP-05
**parent_domain:** DOMAIN-02 — Telemetry Transport and Messaging
**capability_type:** INFRASTRUCTURE
**grounding_status:** GROUNDED

## Description

EMQX MQTT broker providing mTLS QoS 1 message delivery from SVG edge agents to cloud modules on port 8883. Directly confirmed by mqtt.blueedge.network:8883 references in both sensor_collector.py and hasi_bridge.py source code.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-83 | [MQTT Broker (EMQX)](../03_Components/CMP_83_mqtt_broker_emqx.md) | INFRASTRUCTURE | DIRECT_EVIDENCE |

## Execution Contribution

- EP-01 (Sensor Telemetry Ingest — step 4)
- EP-02 (HASI Security Pipeline — step 4)

## Relationships

- R-001: sensor_collector.py EMITS MQTT Broker EMQX
- R-004: MQTT Broker BROADCASTS_TO SensorsModule
- R-007: hasi_bridge.py EMITS MQTT Broker EMQX
- R-009: MQTT Broker BROADCASTS_TO HasiModule

## Traceability Reference

Source anchors: capability_map.md CAP-05

## Navigation

- ↑ Domain: [[D_02_Telemetry_Transport_and_Messaging]]
- ↓ Components: [[CMP_83_mqtt_broker_emqx]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
