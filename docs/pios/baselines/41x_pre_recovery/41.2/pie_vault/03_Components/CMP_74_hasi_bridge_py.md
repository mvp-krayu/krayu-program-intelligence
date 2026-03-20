# Component: hasi_bridge.py

**component_id:** COMP-74
**tier:** BACKEND
**semantic_capability:** CAP-02 — Network Security Intelligence Collection
**semantic_domain:** DOMAIN-01 — Edge Data Acquisition

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** svg-agents/hasi-bridge/hasi_bridge.py — first 80 lines read

## Description

HASI bridge agent: polls HASI SQLite DB every 30 seconds applies SHA-256 deduplication and forwards network threat data via MQTT mTLS or REST fallback.

## Relationships

R-006: hasi_bridge.py CONSUMES HASI v1.0.0; R-007: hasi_bridge.py EMITS MQTT Broker EMQX; R-008: hasi_bridge.py CALLS HasiModule (fallback)

## Traceability Reference

**semantic_traceability_entry:** COMP-74 in semantic_traceability_map.md

## Parent Capability

[[C_02_Network_Security_Intelligence_Collection]]

## Navigation

- ↑ Capability: [[C_02_Network_Security_Intelligence_Collection]]
- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
