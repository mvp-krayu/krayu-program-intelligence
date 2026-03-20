# Domain: Real-Time Streaming and Gateway

**domain_id:** DOMAIN-08
**domain_type:** OPERATIONAL
**grounding_status:** GROUNDED

## Description

The real-time bidirectional communication layer between backend event processing and connected frontend clients. Evidenced by GatewaysModule (COMP-27) — a NestJS WebSocket gateway using Socket.IO (EVID-APPMOD line 61, fleet.gateway.ts source confirmed) — and FleetSocket Client (COMP-69) — the Socket.IO client in the frontend (EVID-FLTSOCK source confirmed). The FleetEventsModule routes domain events to GatewaysModule via websocket-broadcast.handler.ts (R-021). GatewaysModule broadcasts to FleetSocket Client (R-025). This two-component domain is justified by the evidenced-direct connection forming a discrete streaming subsystem anchored in both source files.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-22 | [WebSocket Event Broadcasting](../02_Capabilities/C_22_WebSocket_Event_Broadcasting.md) | CORE | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-27 | [GatewaysModule](../03_Components/CMP_27_GatewaysModule.md) | BACKEND | CAP-22 |
| COMP-69 | [FleetSocket Client](../03_Components/CMP_69_FleetSocket_Client.md) | FRONTEND | CAP-22 |

## Execution Path Participation

- EP-01 (Sensor Telemetry Ingest — steps 8–9)
- EP-02 (HASI Security Pipeline — steps 8–9)
- EP-05 (Domain Event Fan-Out — Branch A)
- EP-06 (Predictive Maintenance AI — step 9)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-27, COMP-69
- relationship_anchors: R-021, R-025, R-026

## Navigation

- ↓ Capabilities: [[C_22_WebSocket_Event_Broadcasting]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
