# Capability: Operator Web Application

**capability_id:** CAP-35
**parent_domain:** DOMAIN-14 — Frontend Application
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Progressive Web App with 61 pages, PWA + offline capability, RTL Arabic support, RBAC navigation, and dark/light theme. Includes v3.23 additions: NetworkSecurityPage and SensorsPage. Frontend Application confirmed via package.json v3.15.0. Page modules confirmed via directory listing of frontend/pages/ subfolders.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-68 | [Frontend Application](../03_Components/CMP_68_Frontend_Application.md) | FRONTEND | DIRECT_EVIDENCE |
| COMP-71 | [Frontend Page Modules (61 pages)](../03_Components/CMP_71_Frontend_Page_Modules.md) | FRONTEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-01 (step 10 SensorsPage display)
- EP-02 (step 9 NetworkSecurityPage display)
- EP-03 (steps 1, 5, 6)
- EP-04 (steps 1, 8)
- EP-07 (step 1 OtaPage)
- EP-08 (step 1 OnboardingWizardPage)

## Relationships

- R-027: Frontend Application CALLS AuthModule
- R-028: Frontend Application CALLS domain modules
- R-029: Frontend Application AUTHENTICATES_VIA AuthModule
- R-030: Frontend Application SERVED_BY nginx

## Traceability Reference

Source anchors: capability_map.md CAP-35

## Navigation

- ↑ Domain: [[D_14_Frontend_Application]]
- ↓ Components: [[CMP_68_Frontend_Application]] · [[CMP_71_Frontend_Page_Modules]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
