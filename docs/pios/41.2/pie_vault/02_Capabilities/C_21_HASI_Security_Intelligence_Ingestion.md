# Capability: HASI Security Intelligence Ingestion

**capability_id:** CAP-21
**parent_domain:** DOMAIN-07 — Sensor and Security Ingestion
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Cloud-side reception of HASI network threat data, GeoIP + ASN enrichment, MITRE ATT&CK mapping, and capture + threat persistence. HasiModule confirmed at app.module.ts line 107 with EVID-ARCH section s7. New in v3.23.0.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-63 | [HasiModule](../03_Components/CMP_63_HasiModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-02 (HASI Security Intelligence Path — step 5)
- EP-05 (Domain Event Fan-Out — HasiModule as emitter)

## Relationships

- R-009: MQTT Broker BROADCASTS_TO HasiModule
- R-016: HasiModule PERSISTS_TO PostgreSQL 15
- R-019: HasiModule EMITS FleetEventsModule

## Traceability Reference

Source anchors: capability_map.md CAP-21

## Navigation

- ↑ Domain: [[D_07_Sensor_and_Security_Ingestion]]
- ↓ Components: [[CMP_63_HasiModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
