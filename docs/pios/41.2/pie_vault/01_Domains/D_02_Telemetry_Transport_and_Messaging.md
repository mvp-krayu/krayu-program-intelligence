# Domain: Telemetry Transport and Messaging

**domain_id:** DOMAIN-02
**domain_type:** INFRASTRUCTURE
**grounding_status:** WEAKLY GROUNDED

## Description

The messaging infrastructure layer responsible for transporting telemetry and security event data from the edge to cloud-side processing modules. Anchored by the MQTT Broker (EMQX), which is confirmed by direct source code references in both sensor_collector.py and hasi_bridge.py (mqtt.blueedge.network:8883 with mTLS QoS 1). Apache Kafka and Apache Flink are declared in architecture HTML (EVID-ARCH section s1 layer 3) as a 15-broker / 500-partition stream processing backbone, but are not corroborated by extracted source package.json or configuration files read within the evidence boundary. Accordingly, those two components carry WEAKLY_GROUNDED status. The domain as a whole is marked WEAKLY GROUNDED due to partial evidence for Kafka and Flink.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-05 | [MQTT Telemetry Transport](../02_Capabilities/C_05_MQTT_Telemetry_Transport.md) | INFRASTRUCTURE | GROUNDED |
| CAP-06 | [Stream Processing Infrastructure](../02_Capabilities/C_06_Stream_Processing_Infrastructure.md) [*] | INFRASTRUCTURE | WEAKLY GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-83 | [MQTT Broker (EMQX)](../03_Components/CMP_83_mqtt_broker_emqx.md) | INFRASTRUCTURE | CAP-05 |
| COMP-84 | [Apache Kafka](../03_Components/CMP_84_apache_kafka.md) [*] | INFRASTRUCTURE | CAP-06 |
| COMP-85 | [Apache Flink](../03_Components/CMP_85_apache_flink.md) [*] | INFRASTRUCTURE | CAP-06 |

## Execution Path Participation

- EP-01 (step 4 — MQTT transport of sensor readings)
- EP-02 (step 4 — MQTT transport of HASI data)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-83, COMP-84 [WEAKLY GROUNDED], COMP-85 [WEAKLY GROUNDED]
- relationship_anchors: R-001, R-004, R-007, R-009

## Navigation

- ↓ Capabilities: [[C_05_MQTT_Telemetry_Transport]] · [[C_06_Stream_Processing_Infrastructure]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
