# Capability: Fleet Analytics and Reporting

**capability_id:** CAP-14
**parent_domain:** DOMAIN-05 — Analytics and Intelligence
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Fleet and operational analytics aggregation, scheduled and ad-hoc report generation, and vehicle diagnostic event processing. Confirmed at app.module.ts lines 42–44 with modules/analytics/ directory confirmed.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-16 | [AnalyticsModule](../03_Components/CMP_16_AnalyticsModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-17 | [ReportsModule](../03_Components/CMP_17_ReportsModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-18 | [DiagnosticsModule](../03_Components/CMP_18_DiagnosticsModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — analytics modules as domain module targets)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-14

## Navigation

- ↑ Domain: [[D_05_Analytics_and_Intelligence]]
- ↓ Components: [[CMP_16_AnalyticsModule]] · [[CMP_17_ReportsModule]] · [[CMP_18_DiagnosticsModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
