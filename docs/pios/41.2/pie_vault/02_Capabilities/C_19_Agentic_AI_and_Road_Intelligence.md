# Capability: Agentic AI and Road Intelligence

**capability_id:** CAP-19
**parent_domain:** DOMAIN-06 — AI/ML Intelligence Layer
**capability_type:** ENABLING
**grounding_status:** GROUNDED

## Description

Autonomous AI agent task execution for fleet operations optimisation (AgenticAIModule at app.module.ts line 98 with modules/agentic-ai/ confirmed) and road condition intelligence, hazard detection, and route optimisation (RoadIntelligenceModule at line 100).

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-56 | [AgenticAIModule](../03_Components/CMP_56_AgenticAIModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-58 | [RoadIntelligenceModule](../03_Components/CMP_58_RoadIntelligenceModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — these modules as domain module targets)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-19

## Navigation

- ↑ Domain: [[D_06_AI_ML_Intelligence_Layer]]
- ↓ Components: [[CMP_56_AgenticAIModule]] · [[CMP_58_RoadIntelligenceModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
