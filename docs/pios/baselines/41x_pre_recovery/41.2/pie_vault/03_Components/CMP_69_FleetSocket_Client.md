# Component: FleetSocket Client

**component_id:** COMP-69
**tier:** FRONTEND
**semantic_capability:** CAP-22 — WebSocket Event Broadcasting
**semantic_domain:** DOMAIN-08 — Real-Time Streaming and Gateway

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** frontend/socket/FleetSocket.ts confirmed in file listing

## Description

Socket.IO client in the frontend receiving real-time fleet events from GatewaysModule. Confirmed via FleetSocket.ts source file and socket.io-client dependency.

## Relationships

R-025: GatewaysModule BROADCASTS_TO FleetSocket Client; R-026: FleetSocket Client DEPENDS_ON Frontend Application

## Traceability Reference

**semantic_traceability_entry:** COMP-69 in semantic_traceability_map.md

## Parent Capability

[[C_22_WebSocket_Event_Broadcasting]]

## Navigation

- ↑ Capability: [[C_22_WebSocket_Event_Broadcasting]]
- ↑ Domain: [[D_08_Real_Time_Streaming_and_Gateway]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
