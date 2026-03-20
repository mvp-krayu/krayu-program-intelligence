# Capability: Specialty Transport Extensions

**capability_id:** CAP-13
**parent_domain:** DOMAIN-04 — Fleet Vertical Extensions
**capability_type:** SUPPORTING
**grounding_status:** GROUNDED

## Description

Cold chain temperature monitoring, driver session block management, and end-to-end vehicle lifecycle management for specialty and full-lifecycle fleet operations. Confirmed at app.module.ts lines 55, 102–103.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-23 | [ColdchainModule](../03_Components/CMP_23_ColdchainModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-60 | [DriverSessionsModule](../03_Components/CMP_60_DriverSessionsModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-61 | [VehicleLifecycleModule](../03_Components/CMP_61_VehicleLifecycleModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — specialty modules as domain module targets)

## Relationships

- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-13

## Navigation

- ↑ Domain: [[D_04_Fleet_Vertical_Extensions]]
- ↓ Components: [[CMP_23_ColdchainModule]] · [[CMP_60_DriverSessionsModule]] · [[CMP_61_VehicleLifecycleModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
