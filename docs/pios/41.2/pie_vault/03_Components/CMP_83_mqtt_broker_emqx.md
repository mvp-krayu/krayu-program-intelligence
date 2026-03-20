# Component: MQTT Broker (EMQX)

**component_id:** COMP-83
**tier:** INFRASTRUCTURE
**semantic_capability:** CAP-05 — MQTT Telemetry Transport
**semantic_domain:** DOMAIN-02 — Telemetry Transport and Messaging

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** sensor_collector.py lines 42–44; hasi_bridge.py lines 40–43 — mqtt.blueedge.network:8883

## Description

EMQX MQTT broker providing mTLS QoS 1 message delivery on port 8883. Directly confirmed by mqtt.blueedge.network:8883 references in both sensor_collector.py and hasi_bridge.py.

## Relationships

R-001: sensor_collector.py EMITS MQTT Broker EMQX; R-004: MQTT Broker BROADCASTS_TO SensorsModule; R-007: hasi_bridge.py EMITS MQTT Broker EMQX; R-009: MQTT Broker BROADCASTS_TO HasiModule

## Traceability Reference

**semantic_traceability_entry:** COMP-83 in semantic_traceability_map.md

## Parent Capability

[[C_05_MQTT_Telemetry_Transport]]

## Navigation

- ↑ Capability: [[C_05_MQTT_Telemetry_Transport]]
- ↑ Domain: [[D_02_Telemetry_Transport_and_Messaging]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
