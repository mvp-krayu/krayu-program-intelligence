# Component: HasiModule

**component_id:** COMP-63
**tier:** BACKEND
**semantic_capability:** CAP-21 — HASI Security Intelligence Ingestion
**semantic_domain:** DOMAIN-07 — Sensor and Security Ingestion

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 107; EVID-ARCH section s7

## Description

Cloud-side reception of HASI network threat data GeoIP + ASN enrichment MITRE ATT&CK mapping and persistence. New in v3.23.0.

## Relationships

R-009: MQTT Broker BROADCASTS_TO HasiModule; R-016: HasiModule PERSISTS_TO PostgreSQL 15; R-019: HasiModule EMITS FleetEventsModule

## Traceability Reference

**semantic_traceability_entry:** COMP-63 in semantic_traceability_map.md

## Parent Capability

[[C_21_HASI_Security_Intelligence_Ingestion]]

## Navigation

- ↑ Capability: [[C_21_HASI_Security_Intelligence_Ingestion]]
- ↑ Domain: [[D_07_Sensor_and_Security_Ingestion]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
