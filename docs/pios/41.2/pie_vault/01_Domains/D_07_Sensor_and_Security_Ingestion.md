# Domain: Sensor and Security Ingestion

**domain_id:** DOMAIN-07
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED

## Description

Cloud-side reception, processing, and storage of sensor telemetry and network security intelligence from SVG 2.0 edge devices. Evidenced by: SensorsModule (COMP-62) — app.module.ts line 106, migration SensorsAndHasiIntegration.ts; HasiModule (COMP-63) — app.module.ts line 107, EVID-ARCH section s7. SensorsModule performs threshold evaluation, HAZMAT alert generation, and persists to TimescaleDB (R-015). HasiModule performs GeoIP + ASN enrichment, MITRE ATT&CK mapping, and persists to PostgreSQL 15 (R-016). Both modules emit events to FleetEventsModule (R-018, R-019). This domain is the cloud-side terminus of EP-01 and EP-02.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-20 | [Sensor Telemetry Ingestion](../02_Capabilities/C_20_Sensor_Telemetry_Ingestion.md) | CORE | GROUNDED |
| CAP-21 | [HASI Security Intelligence Ingestion](../02_Capabilities/C_21_HASI_Security_Intelligence_Ingestion.md) | CORE | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-62 | [SensorsModule](../03_Components/CMP_62_SensorsModule.md) | BACKEND | CAP-20 |
| COMP-63 | [HasiModule](../03_Components/CMP_63_HasiModule.md) | BACKEND | CAP-21 |

## Execution Path Participation

- EP-01 (Sensor Telemetry Ingest Path — step 5)
- EP-02 (HASI Network Security Intelligence Path — step 5)
- EP-05 (Domain Event Fan-Out — SensorsModule and HasiModule as emitters)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-62, COMP-63
- relationship_anchors: R-004, R-009, R-015, R-016, R-018, R-019, R-002, R-008

## Navigation

- ↓ Capabilities: [[C_20_Sensor_Telemetry_Ingestion]] · [[C_21_HASI_Security_Intelligence_Ingestion]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
