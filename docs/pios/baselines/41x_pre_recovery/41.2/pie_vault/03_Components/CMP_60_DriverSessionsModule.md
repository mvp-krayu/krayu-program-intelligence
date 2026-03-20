# Component: DriverSessionsModule

**component_id:** COMP-60
**tier:** BACKEND
**semantic_capability:** CAP-13 — Specialty Transport Extensions
**semantic_domain:** DOMAIN-04 — Fleet Vertical Extensions

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 102; migrations/CreateDriverSessionBlocks.ts confirmed

## Description

Driver session block management. Confirmed at app.module.ts line 102 with migration CreateDriverSessionBlocks.ts.

## Relationships

R-013: DriverSessionsModule AUTHENTICATES_VIA AuthModule; R-014: DriverSessionsModule PERSISTS_TO PostgreSQL 15

## Traceability Reference

**semantic_traceability_entry:** COMP-60 in semantic_traceability_map.md

## Parent Capability

[[C_13_Specialty_Transport_Extensions]]

## Navigation

- ↑ Capability: [[C_13_Specialty_Transport_Extensions]]
- ↑ Domain: [[D_04_Fleet_Vertical_Extensions]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
