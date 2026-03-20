# Capability: Driver Management

**capability_id:** CAP-08
**parent_domain:** DOMAIN-03 — Fleet Core Operations
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Driver registry, session management, and user account administration for fleet operators and drivers. Confirmed at app.module.ts lines 24, 52.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-04 | [DriversModule](../03_Components/CMP_04_DriversModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-22 | [UsersModule](../03_Components/CMP_22_UsersModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-03 (User Authentication — step 3 user record lookup via UsersModule)
- EP-08 (Multi-Tenant Onboarding — step 5 UsersModule admin user creation)

## Relationships

- R-011: DriversModule AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-08

## Navigation

- ↑ Domain: [[D_03_Fleet_Core_Operations]]
- ↓ Components: [[CMP_04_DriversModule]] · [[CMP_22_UsersModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
