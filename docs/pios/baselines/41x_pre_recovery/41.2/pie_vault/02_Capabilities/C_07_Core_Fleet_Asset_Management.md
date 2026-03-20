# Capability: Core Fleet Asset Management

**capability_id:** CAP-07
**parent_domain:** DOMAIN-03 — Fleet Core Operations
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Vehicle CRUD and state tracking, fleet grouping and organisation, and trip lifecycle management. These three modules are the foundational asset data layer of the platform confirmed at app.module.ts lines 23–26.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-03 | [VehiclesModule](../03_Components/CMP_03_VehiclesModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-05 | [FleetsModule](../03_Components/CMP_05_FleetsModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-06 | [TripsModule](../03_Components/CMP_06_TripsModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — VehiclesModule as primary domain module target)

## Relationships

- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule
- R-012: FleetsModule AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15
- R-028: Frontend Application CALLS VehiclesModule

## Traceability Reference

Source anchors: capability_map.md CAP-07

## Navigation

- ↑ Domain: [[D_03_Fleet_Core_Operations]]
- ↓ Components: [[CMP_03_VehiclesModule]] · [[CMP_05_FleetsModule]] · [[CMP_06_TripsModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
