# Component: PostgreSQL 15

**component_id:** COMP-79
**tier:** DATA
**semantic_capability:** CAP-26 — Primary Data Persistence
**semantic_domain:** DOMAIN-10 — Platform Infrastructure and Data

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts lines 136–151 TypeOrmModule config; migrations/ directory confirmed

## Description

Primary operational relational database with 60+ entity tables managed via TypeORM. Confirmed by TypeORM configuration at app.module.ts lines 136–151 and migrations/ directory.

## Relationships

R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15; R-016: HasiModule PERSISTS_TO PostgreSQL 15; R-031: MultiTenantModule DEPENDS_ON PostgreSQL 15

## Traceability Reference

**semantic_traceability_entry:** COMP-79 in semantic_traceability_map.md

## Parent Capability

[[C_26_Primary_Data_Persistence]]

## Navigation

- ↑ Capability: [[C_26_Primary_Data_Persistence]]
- ↑ Domain: [[D_10_Platform_Infrastructure_and_Data]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
