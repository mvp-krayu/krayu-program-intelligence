# Capability: Commercial Operations and Dispatch Services

**capability_id:** CAP-41
**parent_domain:** DOMAIN-17 — Extended Operations and Driver Services
**capability_type:** SUPPORTING
**grounding_status:** GROUNDED

## Description

Surge pricing for taxi/rideshare, driver incentive program management, geofence automation, internal operator/driver messaging, and mobile driver companion data services. Confirmed at app.module.ts lines 64–65, 74, 85–86.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-28 | [SurgePricingModule](../03_Components/CMP_28_SurgePricingModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-29 | [DriverIncentivesModule](../03_Components/CMP_29_DriverIncentivesModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-38 | [DriverMobileModule](../03_Components/CMP_38_DriverMobileModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-47 | [GeofenceAutomationModule](../03_Components/CMP_47_GeofenceAutomationModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-48 | [MessagingModule](../03_Components/CMP_48_MessagingModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — these modules as domain module targets)

## Relationships

- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-41

## Navigation

- ↑ Domain: [[D_17_Extended_Operations_and_Driver_Services]]
- ↓ Components: [[CMP_28_SurgePricingModule]] · [[CMP_29_DriverIncentivesModule]] · [[CMP_38_DriverMobileModule]] · [[CMP_47_GeofenceAutomationModule]] · [[CMP_48_MessagingModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
