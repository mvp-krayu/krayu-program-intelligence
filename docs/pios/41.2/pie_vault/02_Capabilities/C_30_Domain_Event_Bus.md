# Capability: Domain Event Bus

**capability_id:** CAP-30
**parent_domain:** DOMAIN-11 — Event-Driven Architecture
**capability_type:** ENABLING
**grounding_status:** GROUNDED

## Description

EventEmitter2-based event routing hub with four confirmed handler types (WebSocket broadcast, cache invalidation, audit log, notification delivery). FleetEventsModule confirmed at app.module.ts line 14 with 4 handler files in events/handlers/. IIM-05 confirms the deliberate decoupling design.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-65 | [FleetEventsModule](../03_Components/CMP_65_FleetEventsModule.md) | CROSS-CUTTING | DIRECT_EVIDENCE |

## Execution Contribution

- EP-05 (Domain Event Fan-Out — full path)
- EP-01 (step 7)
- EP-02 (step 7)
- EP-06 (step 6)

## Relationships

- R-018: SensorsModule EMITS FleetEventsModule
- R-019: HasiModule EMITS FleetEventsModule
- R-020: AlertsModule EMITS FleetEventsModule
- R-021: FleetEventsModule BROADCASTS_TO GatewaysModule
- R-022: FleetEventsModule CALLS RedisCacheModule
- R-023: FleetEventsModule CALLS NotificationsModule
- R-024: FleetEventsModule CALLS ComplianceModule
- R-038: All backend modules DEPENDS_ON FleetEventsModule

## Traceability Reference

Source anchors: capability_map.md CAP-30

## Navigation

- ↑ Domain: [[D_11_Event_Driven_Architecture]]
- ↓ Components: [[CMP_65_FleetEventsModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
