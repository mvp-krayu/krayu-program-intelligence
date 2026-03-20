# Domain: Analytics and Intelligence

**domain_id:** DOMAIN-05
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED

## Description

Fleet and operational analytics aggregation, diagnostics, reporting, and compliance intelligence. Evidenced by app.module.ts session grouping AnalyticsModule, ReportsModule, and DiagnosticsModule as an analytics cluster (EVID-APPMOD lines 42–44) and ComplianceModule, SafetyModule, FinanceModule as domain-specific intelligence modules (EVID-APPMOD lines 47–49). ExecutiveModule (COMP-32) provides C-suite KPI aggregation (EVID-APPMOD line 68). BlockchainModule provides data provenance and audit trail capability (IIM-10). DataMonetizationModule provides anonymised fleet data product management. This domain represents the structured data consumption and reporting surface of the platform.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-14 | [Fleet Analytics and Reporting](../02_Capabilities/C_14_Fleet_Analytics_and_Reporting.md) | CORE | GROUNDED |
| CAP-15 | [Compliance, Safety, and Finance Intelligence](../02_Capabilities/C_15_Compliance_Safety_and_Finance_Intelligence.md) | CORE | GROUNDED |
| CAP-16 | [Executive Intelligence and Data Monetization](../02_Capabilities/C_16_Executive_Intelligence_and_Data_Monetization.md) | SUPPORTING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-16 | [AnalyticsModule](../03_Components/CMP_16_AnalyticsModule.md) | BACKEND | CAP-14 |
| COMP-17 | [ReportsModule](../03_Components/CMP_17_ReportsModule.md) | BACKEND | CAP-14 |
| COMP-18 | [DiagnosticsModule](../03_Components/CMP_18_DiagnosticsModule.md) | BACKEND | CAP-14 |
| COMP-19 | [ComplianceModule](../03_Components/CMP_19_ComplianceModule.md) | BACKEND | CAP-15 |
| COMP-20 | [SafetyModule](../03_Components/CMP_20_SafetyModule.md) | BACKEND | CAP-15 |
| COMP-21 | [FinanceModule](../03_Components/CMP_21_FinanceModule.md) | BACKEND | CAP-15 |
| COMP-32 | [ExecutiveModule](../03_Components/CMP_32_ExecutiveModule.md) | BACKEND | CAP-16 |
| COMP-41 | [BlockchainModule](../03_Components/CMP_41_BlockchainModule.md) | BACKEND | CAP-16 |
| COMP-59 | [DataMonetizationModule](../03_Components/CMP_59_DataMonetizationModule.md) | BACKEND | CAP-16 |

## Execution Path Participation

- EP-04 (Fleet Data REST Request-Response — analytics modules as domain module targets)
- EP-05 (Domain Event Fan-Out — Branch C: audit-log.handler → ComplianceModule)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-16, COMP-17, COMP-18, COMP-19, COMP-20, COMP-21, COMP-32, COMP-41, COMP-59
- relationship_anchors: R-014, R-024, R-013

## Navigation

- ↓ Capabilities: [[C_14_Fleet_Analytics_and_Reporting]] · [[C_15_Compliance_Safety_and_Finance_Intelligence]] · [[C_16_Executive_Intelligence_and_Data_Monetization]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
