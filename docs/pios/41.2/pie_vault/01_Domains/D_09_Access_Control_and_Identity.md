# Domain: Access Control and Identity

**domain_id:** DOMAIN-09
**domain_type:** CROSS-CUTTING
**grounding_status:** GROUNDED

## Description

Platform-wide authentication, authorisation, and API access management. Evidenced by AuthModule (COMP-02) — app.module.ts line 20 with JWT-based Passport strategy (EVID-APPMOD, EVID-BPKG: passport-jwt, bcryptjs, @nestjs/jwt); V2Module (COMP-67) — app.module.ts line 110 providing API v2 controllers with enhanced responses, cursor-based pagination, and ApiVersionMiddleware (EVID-APPMOD); AuthContext/AuthProvider (COMP-70) — frontend JWT token handling (EVID-FPKG). Intent inference IIM-03a confirms JWT-based stateless auth with RBAC and multi-tier rate limiting as a non-optional, platform-wide enforcement layer. R-013 confirms all 63 backend modules authenticate via AuthModule.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-23 | [JWT Authentication](../02_Capabilities/C_23_JWT_Authentication.md) | CORE | GROUNDED |
| CAP-24 | [Frontend Auth State Management](../02_Capabilities/C_24_Frontend_Auth_State_Management.md) | SUPPORTING | GROUNDED |
| CAP-25 | [API Versioning](../02_Capabilities/C_25_API_Versioning.md) | ENABLING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-02 | [AuthModule](../03_Components/CMP_02_AuthModule.md) | BACKEND | CAP-23 |
| COMP-67 | [V2Module](../03_Components/CMP_67_V2Module.md) | BACKEND | CAP-25 |
| COMP-70 | [AuthContext / AuthProvider](../03_Components/CMP_70_AuthContext_AuthProvider.md) | FRONTEND | CAP-24 |

## Execution Path Participation

- EP-03 (User Authentication and Session Establishment — full path)
- EP-04 (Fleet Data REST Request-Response — step 3 JWT validation)
- EP-08 (Multi-Tenant Onboarding — step 6 JWT provisioning)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-02, COMP-67, COMP-70
- relationship_anchors: R-010, R-011, R-012, R-013, R-027, R-029

## Navigation

- ↓ Capabilities: [[C_23_JWT_Authentication]] · [[C_24_Frontend_Auth_State_Management]] · [[C_25_API_Versioning]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
