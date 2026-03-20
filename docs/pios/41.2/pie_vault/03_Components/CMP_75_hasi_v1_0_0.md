# Component: HASI v1.0.0

**component_id:** COMP-75
**tier:** BACKEND
**semantic_capability:** CAP-02 — Network Security Intelligence Collection
**semantic_domain:** DOMAIN-01 — Edge Data Acquisition

## Source Anchor

**evidence_type:** DERIVED
**source_ref:** hasi_bridge.py references hasi_db_path and hasi_captures_dir; architecture HTML section s2

## Description

Network intrusion detection system: 85 files 8951 LOC captures PCAPNG traffic classifies 60+ protocols detects 9 threat types and persists to SQLite. Feeds hasi_bridge.py.

## Relationships

R-005: HASI v1.0.0 PERSISTS_TO HASI SQLite DB; R-006: hasi_bridge.py CONSUMES HASI v1.0.0

## Traceability Reference

**semantic_traceability_entry:** COMP-75 in semantic_traceability_map.md

## Parent Capability

[[C_02_Network_Security_Intelligence_Collection]]

## Navigation

- ↑ Capability: [[C_02_Network_Security_Intelligence_Collection]]
- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
