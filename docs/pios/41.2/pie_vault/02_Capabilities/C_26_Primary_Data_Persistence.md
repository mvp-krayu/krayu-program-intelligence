# Capability: Primary Data Persistence

**capability_id:** CAP-26
**parent_domain:** DOMAIN-10 — Platform Infrastructure and Data
**capability_type:** INFRASTRUCTURE
**grounding_status:** GROUNDED

## Description

PostgreSQL 15 relational database as the primary operational data store with 60+ entity tables managed via TypeORM, and TimescaleDB extension for sensor_readings hypertable. Both confirmed within evidence boundary.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-79 | [PostgreSQL 15](../03_Components/CMP_79_PostgreSQL_15.md) | DATA | DIRECT_EVIDENCE |
| COMP-80 | [TimescaleDB](../03_Components/CMP_80_TimescaleDB.md) | DATA | DERIVED |

## Execution Contribution

- EP-03, EP-04, EP-06, EP-08 (PostgreSQL as persistence target across multiple paths)
- EP-01 (TimescaleDB as sensor_readings store)

## Relationships

- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15
- R-015: SensorsModule PERSISTS_TO TimescaleDB
- R-016: HasiModule PERSISTS_TO PostgreSQL 15
- R-031: MultiTenantModule DEPENDS_ON PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-26

## Navigation

- ↑ Domain: [[D_10_Platform_Infrastructure_and_Data]]
- ↓ Components: [[CMP_79_PostgreSQL_15]] · [[CMP_80_TimescaleDB]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
