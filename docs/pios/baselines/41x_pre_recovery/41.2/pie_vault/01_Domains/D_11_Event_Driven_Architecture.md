# Domain: Event-Driven Architecture

**domain_id:** DOMAIN-11
**domain_type:** CROSS-CUTTING
**grounding_status:** GROUNDED

## Description

The internal event routing and fan-out infrastructure that decouples event producers from consumers. Evidenced by FleetEventsModule (COMP-65) — app.module.ts line 14 with comment "Event-Driven Architecture (domain events → WebSocket, cache, audit, notifications)" (EVID-APPMOD), with 4 confirmed handler files in events/handlers/ (websocket-broadcast.handler.ts, cache-invalidation.handler.ts, audit-log.handler.ts, notification.handler.ts). Intent inference IIM-05 confirms the deliberate decoupling design. R-038 confirms FleetEventsModule is imported globally across all backend modules. As a single-component domain, this is justified by FleetEventsModule's unique cross-cutting role as the central event bus — it is not a domain module but the architectural backbone connecting all emitting modules to all consuming handlers.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-30 | [Domain Event Bus](../02_Capabilities/C_30_Domain_Event_Bus.md) | ENABLING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-65 | [FleetEventsModule](../03_Components/CMP_65_FleetEventsModule.md) | CROSS-CUTTING | CAP-30 |

## Execution Path Participation

- EP-05 (Domain Event Fan-Out — full path, all branches)
- EP-01 (step 7 — sensor.alert event emission)
- EP-02 (step 7 — hasi.threat.detected event emission)
- EP-06 (step 6 — maintenance event emission)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-65
- relationship_anchors: R-018, R-019, R-020, R-021, R-022, R-023, R-024, R-038
- single_component_justification: FleetEventsModule is the global event bus with 8 direct relationship anchors and CROSS-CUTTING tier classification in component_model.md

## Navigation

- ↓ Capabilities: [[C_30_Domain_Event_Bus]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
