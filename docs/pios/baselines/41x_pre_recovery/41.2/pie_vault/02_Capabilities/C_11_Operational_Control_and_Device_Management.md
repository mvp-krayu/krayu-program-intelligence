# Capability: Operational Control and Device Management

**capability_id:** CAP-11
**parent_domain:** DOMAIN-03 — Fleet Core Operations
**capability_type:** SUPPORTING
**grounding_status:** GROUNDED

## Description

Dispatch coordination, SVG device provisioning and lifecycle management. OperationsModule confirmed at line 37, DevicesModule at line 38 (SVG 2.0 device registration and lifecycle).

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-13 | [OperationsModule](../03_Components/CMP_13_OperationsModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-14 | [DevicesModule](../03_Components/CMP_14_DevicesModule.md) | BACKEND | DIRECT_EVIDENCE |

## Execution Contribution

- EP-07 (OTA Firmware Update — step 4 DevicesModule device targeting and status tracking)

## Relationships

- R-014: All backend modules PERSISTS_TO PostgreSQL 15

## Traceability Reference

Source anchors: capability_map.md CAP-11

## Navigation

- ↑ Domain: [[D_03_Fleet_Core_Operations]]
- ↓ Components: [[CMP_13_OperationsModule]] · [[CMP_14_DevicesModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
