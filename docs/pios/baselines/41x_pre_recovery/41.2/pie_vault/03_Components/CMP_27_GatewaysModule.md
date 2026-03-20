# Component: GatewaysModule

**component_id:** COMP-27
**tier:** BACKEND
**semantic_capability:** CAP-22 — WebSocket Event Broadcasting
**semantic_domain:** DOMAIN-08 — Real-Time Streaming and Gateway

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 61; gateways/fleet.gateway.ts confirmed

## Description

NestJS WebSocket gateway using Socket.IO. Confirmed at app.module.ts line 61 with fleet.gateway.ts source confirmed.

## Relationships

R-021: FleetEventsModule BROADCASTS_TO GatewaysModule; R-025: GatewaysModule BROADCASTS_TO FleetSocket Client

## Traceability Reference

**semantic_traceability_entry:** COMP-27 in semantic_traceability_map.md

## Parent Capability

[[C_22_WebSocket_Event_Broadcasting]]

## Navigation

- ↑ Capability: [[C_22_WebSocket_Event_Broadcasting]]
- ↑ Domain: [[D_08_Real_Time_Streaming_and_Gateway]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
