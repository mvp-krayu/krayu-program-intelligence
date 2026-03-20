# Domain: SaaS Platform Layer

**domain_id:** DOMAIN-12
**domain_type:** OPERATIONAL
**grounding_status:** GROUNDED

## Description

The commercial SaaS packaging layer enabling multi-tenant fleet management service delivery. Evidenced by app.module.ts session comment "Session 23: Multi-Tenant SaaS" (EVID-APPMOD lines 88–91) grouping MultiTenantModule, BillingModule, and OnboardingModule. Intent inference IIM-06 confirms these three modules transform the fleet management technology into a commercially operable SaaS product: MultiTenantModule enforces data isolation, BillingModule enables subscription revenue, and OnboardingModule reduces new tenant activation friction. WhiteLabelModule (COMP-42) is included as the multi-brand reseller configuration layer that is functionally coupled to the multi-tenant SaaS packaging.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-31 | [Multi-Tenant Provisioning](../02_Capabilities/C_31_Multi_Tenant_Provisioning.md) | CORE | GROUNDED |
| CAP-32 | [Tenant Onboarding and Branding](../02_Capabilities/C_32_Tenant_Onboarding_and_Branding.md) | SUPPORTING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-42 | [WhiteLabelModule](../03_Components/CMP_42_WhiteLabelModule.md) | BACKEND | CAP-32 |
| COMP-49 | [MultiTenantModule](../03_Components/CMP_49_MultiTenantModule.md) | BACKEND | CAP-31 |
| COMP-50 | [BillingModule](../03_Components/CMP_50_BillingModule.md) | BACKEND | CAP-31 |
| COMP-51 | [OnboardingModule](../03_Components/CMP_51_OnboardingModule.md) | BACKEND | CAP-32 |

## Execution Path Participation

- EP-08 (Multi-Tenant SaaS Onboarding — full path)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-42, COMP-49, COMP-50, COMP-51
- relationship_anchors: R-031, R-032

## Navigation

- ↓ Capabilities: [[C_31_Multi_Tenant_Provisioning]] · [[C_32_Tenant_Onboarding_and_Branding]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
