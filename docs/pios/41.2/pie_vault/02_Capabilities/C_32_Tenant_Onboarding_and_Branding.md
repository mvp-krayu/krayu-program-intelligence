# Capability: Tenant Onboarding and Branding

**capability_id:** CAP-32
**parent_domain:** DOMAIN-12 — SaaS Platform Layer
**capability_type:** SUPPORTING
**grounding_status:** GROUNDED

## Description

Guided tenant onboarding wizard and multi-brand white-label configuration. OnboardingModule confirmed at app.module.ts line 91. WhiteLabelModule at line 78.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-42 | [WhiteLabelModule](../03_Components/CMP_42_WhiteLabelModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-51 | [OnboardingModule](../03_Components/CMP_51_OnboardingModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-08 (Multi-Tenant Onboarding — step 2 OnboardingModule wizard state management)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-32

## Navigation

- ↑ Domain: [[D_12_SaaS_Platform_Layer]]
- ↓ Components: [[CMP_42_WhiteLabelModule]] · [[CMP_51_OnboardingModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
