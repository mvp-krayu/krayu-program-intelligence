# Domain: AI/ML Intelligence Layer

**domain_id:** DOMAIN-06
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED

## Description

The embedded intelligence layer that converts raw telemetry and operational data into actionable recommendations. Evidenced by app.module.ts session comment "Advanced Features" (EVID-APPMOD lines 81–86) grouping PredictiveMaintenanceModule, DigitalTwinModule, DriverScoringModule alongside AnomalyDetectionModule and FatigueRiskModule. AgenticAIModule (line 98) provides autonomous task execution. Intent inference IIM-04 confirms these 6 modules are a core commercial differentiator. RoadIntelligenceModule provides road condition data services supporting AI-driven routing. The SensorsModule cloud-side ingestion is the telemetry source feeding this layer via EP-01 and EP-06.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-17 | [Predictive and Anomaly Intelligence](../02_Capabilities/C_17_Predictive_and_Anomaly_Intelligence.md) | CORE | GROUNDED |
| CAP-18 | [Driver Intelligence](../02_Capabilities/C_18_Driver_Intelligence.md) | CORE | GROUNDED |
| CAP-19 | [Agentic AI and Road Intelligence](../02_Capabilities/C_19_Agentic_AI_and_Road_Intelligence.md) | ENABLING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-33 | [AnomalyDetectionModule](../03_Components/CMP_33_AnomalyDetectionModule.md) | BACKEND | CAP-17 |
| COMP-39 | [FatigueRiskModule](../03_Components/CMP_39_FatigueRiskModule.md) | BACKEND | CAP-18 |
| COMP-44 | [PredictiveMaintenanceModule](../03_Components/CMP_44_PredictiveMaintenanceModule.md) | BACKEND | CAP-17 |
| COMP-45 | [DigitalTwinModule](../03_Components/CMP_45_DigitalTwinModule.md) | BACKEND | CAP-17 |
| COMP-46 | [DriverScoringModule](../03_Components/CMP_46_DriverScoringModule.md) | BACKEND | CAP-18 |
| COMP-56 | [AgenticAIModule](../03_Components/CMP_56_AgenticAIModule.md) | BACKEND | CAP-19 |
| COMP-58 | [RoadIntelligenceModule](../03_Components/CMP_58_RoadIntelligenceModule.md) | BACKEND | CAP-19 |

## Execution Path Participation

- EP-06 (Predictive Maintenance AI Analysis — PredictiveMaintenanceModule, AnomalyDetectionModule, DigitalTwinModule)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-33, COMP-39, COMP-44, COMP-45, COMP-46, COMP-56, COMP-58
- relationship_anchors: R-013, R-014, R-015

## Navigation

- ↓ Capabilities: [[C_17_Predictive_and_Anomaly_Intelligence]] · [[C_18_Driver_Intelligence]] · [[C_19_Agentic_AI_and_Road_Intelligence]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
