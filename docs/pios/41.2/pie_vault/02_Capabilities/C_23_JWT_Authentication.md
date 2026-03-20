# Capability: JWT Authentication

**capability_id:** CAP-23
**parent_domain:** DOMAIN-09 — Access Control and Identity
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

JWT-based stateless authentication with Passport strategy, bcrypt credential validation, RBAC role assignment, and multi-tier rate limiting via FleetThrottlerGuard. Confirmed at app.module.ts lines 20, 251–253 with passport-jwt, bcryptjs, @nestjs/jwt in backend package.json.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-02 | [AuthModule](../03_Components/CMP_02_AuthModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-03 (User Authentication — steps 2, 4 credential validation and JWT signing)
- EP-04 (Fleet Data REST — step 3 JWT validation)
- EP-08 (Multi-Tenant Onboarding — step 6)

## Relationships

- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule
- R-011: DriversModule AUTHENTICATES_VIA AuthModule
- R-012: FleetsModule AUTHENTICATES_VIA AuthModule
- R-013: All 63 backend modules AUTHENTICATES_VIA AuthModule
- R-027: Frontend Application CALLS AuthModule
- R-029: Frontend Application AUTHENTICATES_VIA AuthModule

## Traceability Reference

Source anchors: capability_map.md CAP-23

## Navigation

- ↑ Domain: [[D_09_Access_Control_and_Identity]]
- ↓ Components: [[CMP_02_AuthModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
