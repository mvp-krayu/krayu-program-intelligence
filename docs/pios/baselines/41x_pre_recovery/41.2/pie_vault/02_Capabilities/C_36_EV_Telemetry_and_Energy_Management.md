# Capability: EV Telemetry and Energy Management

**capability_id:** CAP-36
**parent_domain:** DOMAIN-15 — EV and Electrification
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Electric vehicle battery state, range management, vehicle-to-grid bidirectional charging, and public/private charging station network management. Confirmed at app.module.ts lines 56, 58, 79.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-24 | [EvModule](../03_Components/CMP_24_EvModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-26 | [V2gModule](../03_Components/CMP_26_V2gModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-43 | [ChargingStationsModule](../03_Components/CMP_43_ChargingStationsModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — EV modules as domain module targets)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-36

## Navigation

- ↑ Domain: [[D_15_EV_and_Electrification]]
- ↓ Components: [[CMP_24_EvModule]] · [[CMP_26_V2gModule]] · [[CMP_43_ChargingStationsModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
