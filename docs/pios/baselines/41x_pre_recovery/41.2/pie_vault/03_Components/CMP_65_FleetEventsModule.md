# Component: FleetEventsModule

**component_id:** COMP-65
**tier:** CROSS-CUTTING
**semantic_capability:** CAP-30 — Domain Event Bus
**semantic_domain:** DOMAIN-11 — Event-Driven Architecture

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 14; events/ directory with 4 handler files confirmed

## Description

EventEmitter2-based event routing hub with four confirmed handler types: websocket-broadcast cache-invalidation audit-log and notification delivery. IIM-05 confirms deliberate decoupling design.

## Relationships

R-018: SensorsModule EMITS FleetEventsModule; R-019: HasiModule EMITS FleetEventsModule; R-020: AlertsModule EMITS FleetEventsModule; R-021: FleetEventsModule BROADCASTS_TO GatewaysModule; R-022: FleetEventsModule CALLS RedisCacheModule; R-023: FleetEventsModule CALLS NotificationsModule; R-024: FleetEventsModule CALLS ComplianceModule; R-038: All backend modules DEPENDS_ON FleetEventsModule

## Traceability Reference

**semantic_traceability_entry:** COMP-65 in semantic_traceability_map.md

## Parent Capability

[[C_30_Domain_Event_Bus]]

## Navigation

- ↑ Capability: [[C_30_Domain_Event_Bus]]
- ↑ Domain: [[D_11_Event_Driven_Architecture]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
