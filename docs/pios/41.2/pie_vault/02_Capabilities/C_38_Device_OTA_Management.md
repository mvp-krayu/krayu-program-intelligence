# Capability: Device OTA Management

**capability_id:** CAP-38
**parent_domain:** DOMAIN-15 — EV and Electrification
**capability_type:** ENABLING
**grounding_status:** GROUNDED

## Description

Over-the-air firmware update release and deployment management for SVG 2.0 devices. OtaModule confirmed at app.module.ts line 57. Cross-domain participation in DOMAIN-01 (SVG OTA Agent target).

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-25 | [OtaModule](../03_Components/CMP_25_OtaModule.md) [cross-domain: DOMAIN-01] | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-07 (OTA Firmware Update Deployment — steps 2–5)

## Relationships

- R-039: OtaModule CALLS SVG OTA Agent
- R-040: OtaModule PERSISTS_TO S3/MinIO

## Traceability Reference

Source anchors: capability_map.md CAP-38

## Navigation

- ↑ Domain: [[D_15_EV_and_Electrification]]
- ↓ Components: [[CMP_25_OtaModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
