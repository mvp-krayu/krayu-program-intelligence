# Capability: Predictive and Anomaly Intelligence

**capability_id:** CAP-17
**parent_domain:** DOMAIN-06 — AI/ML Intelligence Layer
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

ML-driven predictive maintenance scheduling, statistical and ML-based anomaly detection across telemetry, and vehicle digital twin modelling. Confirmed at app.module.ts lines 82–83, 69, with modules/anomaly-detection/ directory confirmed. IIM-04 confirms these as core commercial differentiators.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-33 | [AnomalyDetectionModule](../03_Components/CMP_33_AnomalyDetectionModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-44 | [PredictiveMaintenanceModule](../03_Components/CMP_44_PredictiveMaintenanceModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-45 | [DigitalTwinModule](../03_Components/CMP_45_DigitalTwinModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-06 (Predictive Maintenance AI Analysis — AnomalyDetectionModule step 3, PredictiveMaintenanceModule steps 1 and 5, DigitalTwinModule step 4)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15
- R-015: SensorsModule PERSISTS_TO TimescaleDB (telemetry source)

## Traceability Reference

Source anchors: capability_map.md CAP-17

## Navigation

- ↑ Domain: [[D_06_AI_ML_Intelligence_Layer]]
- ↓ Components: [[CMP_33_AnomalyDetectionModule]] · [[CMP_44_PredictiveMaintenanceModule]] · [[CMP_45_DigitalTwinModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
