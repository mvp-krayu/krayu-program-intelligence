# Capability: Maintenance and Fuel Operations

**capability_id:** CAP-10
**parent_domain:** DOMAIN-03 — Fleet Core Operations
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Scheduled and reactive maintenance work order management and fuel consumption tracking. Confirmed at app.module.ts lines 28–29.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-08 | [MaintenanceModule](../03_Components/CMP_08_MaintenanceModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-09 | [FuelModule](../03_Components/CMP_09_FuelModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-06 (Predictive Maintenance AI — step 7 MaintenanceModule work order creation)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-10

## Navigation

- ↑ Domain: [[D_03_Fleet_Core_Operations]]
- ↓ Components: [[CMP_08_MaintenanceModule]] · [[CMP_09_FuelModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
