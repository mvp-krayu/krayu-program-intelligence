# Capability: API Versioning

**capability_id:** CAP-25
**parent_domain:** DOMAIN-09 — Access Control and Identity
**capability_type:** ENABLING
**grounding_status:** GROUNDED

## Description

API v2 controllers with enhanced responses, cursor-based pagination, and ApiVersionMiddleware. Confirmed at app.module.ts line 110 with common/versioning/ directory confirmed. Grouped under Access Control and Identity as it governs API surface and access patterns across the platform.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-67 | [V2Module](../03_Components/CMP_67_V2Module.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — V2Module governs API versioning layer)

## Relationships

- (global middleware applied across all API endpoints — EVID-APPMOD line 110)

## Traceability Reference

Source anchors: capability_map.md CAP-25

## Navigation

- ↑ Domain: [[D_09_Access_Control_and_Identity]]
- ↓ Components: [[CMP_67_V2Module]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
