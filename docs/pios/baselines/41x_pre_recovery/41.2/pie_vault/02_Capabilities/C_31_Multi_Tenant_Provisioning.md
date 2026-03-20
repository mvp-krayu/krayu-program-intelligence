# Capability: Multi-Tenant Provisioning

**capability_id:** CAP-31
**parent_domain:** DOMAIN-12 — SaaS Platform Layer
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Tenant record creation, data isolation enforcement, and subscription billing. MultiTenantModule and BillingModule confirmed at app.module.ts lines 89–90 with modules/billing/ directory confirmed. IIM-06 confirms the SaaS commercial packaging intent.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-49 | [MultiTenantModule](../03_Components/CMP_49_MultiTenantModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-50 | [BillingModule](../03_Components/CMP_50_BillingModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-08 (Multi-Tenant Onboarding — steps 3–4)

## Relationships

- R-031: MultiTenantModule DEPENDS_ON PostgreSQL 15
- R-032: BillingModule DEPENDS_ON MultiTenantModule

## Traceability Reference

Source anchors: capability_map.md CAP-31

## Navigation

- ↑ Domain: [[D_12_SaaS_Platform_Layer]]
- ↓ Components: [[CMP_49_MultiTenantModule]] · [[CMP_50_BillingModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
