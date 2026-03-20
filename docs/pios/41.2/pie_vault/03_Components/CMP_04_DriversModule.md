# Component: DriversModule

**component_id:** COMP-04
**tier:** BACKEND
**semantic_capability:** CAP-08 — Driver Management
**semantic_domain:** DOMAIN-03 — Fleet Core Operations

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 24

## Description

Driver registry and session management for fleet operators and drivers.

## Relationships

R-011: DriversModule AUTHENTICATES_VIA AuthModule; R-014: DriversModule PERSISTS_TO PostgreSQL 15

## Traceability Reference

**semantic_traceability_entry:** COMP-04 in semantic_traceability_map.md

## Parent Capability

[[C_08_Driver_Management]]

## Navigation

- ↑ Capability: [[C_08_Driver_Management]]
- ↑ Domain: [[D_03_Fleet_Core_Operations]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
