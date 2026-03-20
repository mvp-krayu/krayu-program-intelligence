# Capability: Fleet Type Verticals

**capability_id:** CAP-12
**parent_domain:** DOMAIN-04 — Fleet Vertical Extensions
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Industry-specific modules for tanker (HAZMAT safety), bus (PIS integration), and taxi (dispatch and metering) fleet types. Confirmed at app.module.ts lines 32–34 with session comment "Fleet-type specific (3 modules, 32 endpoints)".

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-10 | [TankerModule](../03_Components/CMP_10_TankerModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-11 | [BusModule](../03_Components/CMP_11_BusModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-12 | [TaxiModule](../03_Components/CMP_12_TaxiModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — vertical modules as domain module targets)

## Relationships

- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-12

## Navigation

- ↑ Domain: [[D_04_Fleet_Vertical_Extensions]]
- ↓ Components: [[CMP_10_TankerModule]] · [[CMP_11_BusModule]] · [[CMP_12_TaxiModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
