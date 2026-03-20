# Capability: Compliance, Safety, and Finance Intelligence

**capability_id:** CAP-15
**parent_domain:** DOMAIN-05 — Analytics and Intelligence
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Regulatory compliance tracking, audit evidence management, safety scoring, incident recording, risk management, and financial cost tracking. Confirmed at app.module.ts lines 47–49.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-19 | [ComplianceModule](../03_Components/CMP_19_ComplianceModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-20 | [SafetyModule](../03_Components/CMP_20_SafetyModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-21 | [FinanceModule](../03_Components/CMP_21_FinanceModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-05 (Domain Event Fan-Out — Branch C: audit-log.handler → ComplianceModule)

## Relationships

- R-024: FleetEventsModule CALLS ComplianceModule (audit log)
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-15

## Navigation

- ↑ Domain: [[D_05_Analytics_and_Intelligence]]
- ↓ Components: [[CMP_19_ComplianceModule]] · [[CMP_20_SafetyModule]] · [[CMP_21_FinanceModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
