# Component: VehiclesModule

**component_id:** COMP-03
**tier:** BACKEND
**semantic_capability:** CAP-07 — Core Fleet Asset Management
**semantic_domain:** DOMAIN-03 — Fleet Core Operations

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 23

## Description

Vehicle CRUD operations, state tracking, and fleet asset data management. Foundational asset data layer confirmed at app.module.ts line 23.

## Relationships

- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule\n- R-014: VehiclesModule PERSISTS_TO PostgreSQL 15\n- R-028: Frontend Application CALLS VehiclesModule

## Traceability Reference

**semantic_traceability_entry:** COMP-03 in semantic_traceability_map.md

## Parent Capability

[[C_07_Core_Fleet_Asset_Management]]

## Navigation

- ↑ Capability: [[C_07_Core_Fleet_Asset_Management]]
- ↑ Domain: [[D_03_Fleet_Core_Operations]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
