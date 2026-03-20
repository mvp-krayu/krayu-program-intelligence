# PIE Demo Walkthrough — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.2-PIE-DEMO
**contract_id:** PIOS-41.2-RUN01-CONTRACT-v1
**mode:** PIE-RENDER-STRICT
**date:** 2026-03-20

---

This is a guided navigation demonstration of the PIE explorer. It demonstrates the navigation structure only — all content referenced below exists in the vault. No meaning is invented.

---

## Demo Path: Sensor Telemetry from Edge to Dashboard

**Objective:** Trace the EP-01 (Sensor Telemetry Ingest) execution path through the PIE vault, starting from the explorer map and navigating down to components and back up.

---

### Step 1: Start at the Explorer Map

**File:** [pie_vault/00_Map/Program_Intelligence_Explorer.md](pie_vault/00_Map/Program_Intelligence_Explorer.md)

The Explorer Map shows the domain index. To trace the sensor telemetry path, we identify the relevant domains:
- DOMAIN-01: Edge Data Acquisition (data origin)
- DOMAIN-02: Telemetry Transport and Messaging (transport layer)
- DOMAIN-07: Sensor and Security Ingestion (cloud-side receipt)
- DOMAIN-11: Event-Driven Architecture (event routing)
- DOMAIN-08: Real-Time Streaming and Gateway (frontend delivery)

---

### Step 2: Navigate to DOMAIN-01

**File:** [pie_vault/01_Domains/D_01_Edge_Data_Acquisition.md](pie_vault/01_Domains/D_01_Edge_Data_Acquisition.md)

The domain file shows 4 capabilities and 7 components. For EP-01, the relevant capability is:
- CAP-01: Vehicle Sensor Collection

The domain file execution path participation section confirms EP-01 (steps 1–4).

---

### Step 3: Navigate to CAP-01

**File:** [pie_vault/02_Capabilities/C_01_Vehicle_Sensor_Collection.md](pie_vault/02_Capabilities/C_01_Vehicle_Sensor_Collection.md)

The capability file shows 3 component members:
- COMP-73: sensor_collector.py
- COMP-76: SVG Main Telemetry Firmware
- COMP-78: SVG Agent Configuration

Execution contribution confirms EP-01 (primary execution steps 1–4).

---

### Step 4: Navigate to COMP-73

**File:** [pie_vault/03_Components/CMP_73_sensor_collector_py.md](pie_vault/03_Components/CMP_73_sensor_collector_py.md)

The component file shows:
- **tier:** BACKEND
- **evidence_type:** DIRECT_EVIDENCE
- **source_ref:** svg-agents/sensor-collector/sensor_collector.py — full file read (479 lines)
- Relationships: R-001 (EMITS MQTT Broker), R-002 (CALLS SensorsModule fallback), R-003 (CONSUMES SVG Main Telemetry Firmware)

The traceability entry confirms: COMP-73 in semantic_traceability_map.md.

---

### Step 5: Follow the transport layer — Navigate to DOMAIN-02

**File:** [pie_vault/01_Domains/D_02_Telemetry_Transport_and_Messaging.md](pie_vault/01_Domains/D_02_Telemetry_Transport_and_Messaging.md)

DOMAIN-02 contains CAP-05 (MQTT Telemetry Transport) which is GROUNDED. CAP-06 (Stream Processing Infrastructure) is WEAKLY GROUNDED and not traversed in EP-01 modelled paths.

---

### Step 6: Navigate to CAP-05 and COMP-83

**Files:**
- [pie_vault/02_Capabilities/C_05_MQTT_Telemetry_Transport.md](pie_vault/02_Capabilities/C_05_MQTT_Telemetry_Transport.md)
- [pie_vault/03_Components/CMP_83_mqtt_broker_emqx.md](pie_vault/03_Components/CMP_83_mqtt_broker_emqx.md)

COMP-83 (MQTT Broker EMQX) shows DIRECT_EVIDENCE from sensor_collector.py lines 42–44 and hasi_bridge.py lines 40–43. R-004 confirms it broadcasts to SensorsModule.

---

### Step 7: Navigate to DOMAIN-07 — Cloud-Side Ingestion

**File:** [pie_vault/01_Domains/D_07_Sensor_and_Security_Ingestion.md](pie_vault/01_Domains/D_07_Sensor_and_Security_Ingestion.md)

CAP-20 (Sensor Telemetry Ingestion) → COMP-62 (SensorsModule). EP-01 step 5 confirmed.

---

### Step 8: Navigate to DOMAIN-11 — Event Routing

**File:** [pie_vault/01_Domains/D_11_Event_Driven_Architecture.md](pie_vault/01_Domains/D_11_Event_Driven_Architecture.md)

Single component: COMP-65 (FleetEventsModule). R-018 shows SensorsModule EMITS FleetEventsModule (EP-01 step 7).

---

### Step 9: Navigate to DOMAIN-08 — Frontend Delivery

**File:** [pie_vault/01_Domains/D_08_Real_Time_Streaming_and_Gateway.md](pie_vault/01_Domains/D_08_Real_Time_Streaming_and_Gateway.md)

CAP-22 (WebSocket Event Broadcasting) → COMP-27 (GatewaysModule) + COMP-69 (FleetSocket Client). EP-01 steps 8–9 confirmed.

---

### Step 10: Return to Explorer Map

**File:** [pie_vault/00_Map/Program_Intelligence_Explorer.md](pie_vault/00_Map/Program_Intelligence_Explorer.md)

Each vault file provides a `[→ Explorer Map]` navigation link at the bottom, enabling return to the entry point at any level.

---

## Traceability Check

After this walkthrough, the traceability index can be consulted:

**File:** [pie_vault/04_Traceability/semantic_traceability_index.md](pie_vault/04_Traceability/semantic_traceability_index.md)

Confirms all components visited (COMP-73, COMP-83, COMP-62, COMP-65, COMP-27, COMP-69) are registered with DIRECT_EVIDENCE or DERIVED basis.

---

## Walkthrough Summary

| Step | File Level | File Visited |
|---|---|---|
| 1 | Entry | Program_Intelligence_Explorer.md |
| 2 | Domain | D_01_Edge_Data_Acquisition.md |
| 3 | Capability | C_01_Vehicle_Sensor_Collection.md |
| 4 | Component | CMP_73_sensor_collector_py.md |
| 5 | Domain | D_02_Telemetry_Transport_and_Messaging.md |
| 6 | Capability + Component | C_05_MQTT_Telemetry_Transport.md + CMP_83_mqtt_broker_emqx.md |
| 7 | Domain | D_07_Sensor_and_Security_Ingestion.md |
| 8 | Domain | D_11_Event_Driven_Architecture.md |
| 9 | Domain | D_08_Real_Time_Streaming_and_Gateway.md |
| 10 | Traceability | semantic_traceability_index.md |

Navigation demonstrated: Explorer → Domain → Capability → Component → Domain → back to Explorer. Bidirectional links confirmed at every level.
