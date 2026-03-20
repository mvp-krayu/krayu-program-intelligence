# Capability: Customer and Ecosystem Services

**capability_id:** CAP-42
**parent_domain:** DOMAIN-17 — Extended Operations and Driver Services
**capability_type:** SUPPORTING
**grounding_status:** GROUNDED

## Description

Self-service customer portal, OEM aftersales service management, cross-border logistics compliance, permit lifecycle management, fleet asset acquisition/disposal lifecycle, and parts procurement marketplace. Confirmed at app.module.ts lines 40, 70–73, 76, 99 with modules/aftersales/ confirmed.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-34 | [CrossBorderModule](../03_Components/CMP_34_CrossBorderModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-35 | [PermitsModule](../03_Components/CMP_35_PermitsModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-36 | [PartsMarketplaceModule](../03_Components/CMP_36_PartsMarketplaceModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-37 | [FleetLifecycleModule](../03_Components/CMP_37_FleetLifecycleModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-40 | [CustomerPortalModule](../03_Components/CMP_40_CustomerPortalModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-57 | [AftersalesModule](../03_Components/CMP_57_AftersalesModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — these modules as domain module targets)

## Relationships

- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-42

## Navigation

- ↑ Domain: [[D_17_Extended_Operations_and_Driver_Services]]
- ↓ Components: [[CMP_34_CrossBorderModule]] · [[CMP_35_PermitsModule]] · [[CMP_36_PartsMarketplaceModule]] · [[CMP_37_FleetLifecycleModule]] · [[CMP_40_CustomerPortalModule]] · [[CMP_57_AftersalesModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
