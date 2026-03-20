# Capability: Fleet Electrification Planning

**capability_id:** CAP-37
**parent_domain:** DOMAIN-15 — EV and Electrification
**capability_type:** SUPPORTING
**grounding_status:** GROUNDED

## Description

Fleet electrification transition planning and depot-level EV charging schedule and capacity management. Confirmed at app.module.ts lines 66–67.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-30 | [ElectrificationModule](../03_Components/CMP_30_ElectrificationModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-31 | [DepotChargingModule](../03_Components/CMP_31_DepotChargingModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — planning modules as domain module targets)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-37

## Navigation

- ↑ Domain: [[D_15_EV_and_Electrification]]
- ↓ Components: [[CMP_30_ElectrificationModule]] · [[CMP_31_DepotChargingModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
