# Capability: Network Security Intelligence Collection

**capability_id:** CAP-02
**parent_domain:** DOMAIN-01 — Edge Data Acquisition
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description

Edge-side network traffic capture, protocol classification, threat detection, and cloud forwarding. HASI v1.0.0 (85 files, 8,951 LOC) captures PCAPNG traffic, classifies 60+ protocols, detects 9 threat types, and persists to SQLite. hasi_bridge.py polls every 30 seconds, applies SHA-256 deduplication, and forwards via MQTT mTLS or REST fallback.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-74 | [hasi_bridge.py](../03_Components/CMP_74_hasi_bridge_py.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-75 | [HASI v1.0.0](../03_Components/CMP_75_hasi_v1_0_0.md) | BACKEND | DERIVED |

## Execution Contribution

- EP-02 (HASI Network Security Intelligence Path — steps 2–4)

## Relationships

- R-005: HASI v1.0.0 PERSISTS_TO SQLite DB
- R-006: hasi_bridge.py CONSUMES HASI v1.0.0
- R-007: hasi_bridge.py EMITS MQTT Broker EMQX
- R-008: hasi_bridge.py CALLS HasiModule (fallback)

## Traceability Reference

Source anchors: capability_map.md CAP-02

## Navigation

- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ↓ Components: [[CMP_74_hasi_bridge_py]] · [[CMP_75_hasi_v1_0_0]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
