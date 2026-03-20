# Capability: Alert and Notification Management

**capability_id:** CAP-09
**parent_domain:** DOMAIN-03 — Fleet Core Operations
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Alert generation, escalation, and in-platform notification delivery. AlertsModule confirmed at app.module.ts line 27 with modules/alerts/ directory. NotificationsModule at line 39. FleetEventsModule routes events to NotificationsModule via notification.handler.ts (R-023).

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-07 | [AlertsModule](../03_Components/CMP_07_AlertsModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-15 | [NotificationsModule](../03_Components/CMP_15_NotificationsModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-05 (Domain Event Fan-Out — AlertsModule as emitter; NotificationsModule as Branch D target)
- EP-08 (Multi-Tenant Onboarding — step 7 welcome notification)

## Relationships

- R-020: AlertsModule EMITS FleetEventsModule
- R-023: FleetEventsModule CALLS NotificationsModule

## Traceability Reference

Source anchors: capability_map.md CAP-09

## Navigation

- ↑ Domain: [[D_03_Fleet_Core_Operations]]
- ↓ Components: [[CMP_07_AlertsModule]] · [[CMP_15_NotificationsModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
