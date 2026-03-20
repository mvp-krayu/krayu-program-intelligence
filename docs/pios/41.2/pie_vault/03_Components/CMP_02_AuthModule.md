# Component: AuthModule

**component_id:** COMP-02
**tier:** BACKEND
**semantic_capability:** CAP-23 — JWT Authentication
**semantic_domain:** DOMAIN-09 — Access Control and Identity

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 20; modules/auth/ directory confirmed

## Description

JWT-based stateless authentication with Passport strategy, bcrypt credential validation, RBAC role assignment, and multi-tier rate limiting via FleetThrottlerGuard.

## Relationships

- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule\n- R-011: DriversModule AUTHENTICATES_VIA AuthModule\n- R-012: FleetsModule AUTHENTICATES_VIA AuthModule\n- R-013: All 63 backend modules AUTHENTICATES_VIA AuthModule\n- R-027: Frontend Application CALLS AuthModule\n- R-029: Frontend Application AUTHENTICATES_VIA AuthModule

## Traceability Reference

**semantic_traceability_entry:** COMP-02 in semantic_traceability_map.md

## Parent Capability

[[C_23_JWT_Authentication]]

## Navigation

- ↑ Capability: [[C_23_JWT_Authentication]]
- ↑ Domain: [[D_09_Access_Control_and_Identity]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
