# Capability: Driver Intelligence

**capability_id:** CAP-18
**parent_domain:** DOMAIN-06 — AI/ML Intelligence Layer
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Composite driver behaviour scoring from telemetry and safety events (DriverScoringModule at app.module.ts line 84) and driver fatigue detection with Hours of Service risk assessment (FatigueRiskModule at line 75). Both confirmed as AI/ML modules in IIM-04.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-39 | [FatigueRiskModule](../03_Components/CMP_39_FatigueRiskModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-46 | [DriverScoringModule](../03_Components/CMP_46_DriverScoringModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — these modules as domain module targets)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-18

## Navigation

- ↑ Domain: [[D_06_AI_ML_Intelligence_Layer]]
- ↓ Components: [[CMP_39_FatigueRiskModule]] · [[CMP_46_DriverScoringModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
