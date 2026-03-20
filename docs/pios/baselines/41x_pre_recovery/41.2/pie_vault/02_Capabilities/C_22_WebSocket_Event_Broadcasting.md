# Capability: WebSocket Event Broadcasting

**capability_id:** CAP-22
**parent_domain:** DOMAIN-08 — Real-Time Streaming and Gateway
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Real-time fleet event streaming from backend to connected frontend clients via Socket.IO WebSocket. GatewaysModule confirmed at app.module.ts line 61 with fleet.gateway.ts source confirmed. FleetSocket Client confirmed via FleetSocket.ts source file and socket.io-client dependency in frontend package.json.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-27 | [GatewaysModule](../03_Components/CMP_27_GatewaysModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-69 | [FleetSocket Client](../03_Components/CMP_69_FleetSocket_Client.md) | FRONTEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-01 (Sensor Telemetry Ingest — steps 8–9)
- EP-02 (HASI Security Pipeline — steps 8–9)
- EP-05 (Domain Event Fan-Out — Branch A)
- EP-06 (Predictive Maintenance AI — step 9)

## Relationships

- R-021: FleetEventsModule BROADCASTS_TO GatewaysModule
- R-025: GatewaysModule BROADCASTS_TO FleetSocket Client
- R-026: FleetSocket Client DEPENDS_ON Frontend Application

## Traceability Reference

Source anchors: capability_map.md CAP-22

## Navigation

- ↑ Domain: [[D_08_Real_Time_Streaming_and_Gateway]]
- ↓ Components: [[CMP_27_GatewaysModule]] · [[CMP_69_FleetSocket_Client]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
