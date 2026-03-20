# Capability: Object Storage [*]

**capability_id:** CAP-28
**parent_domain:** DOMAIN-10 — Platform Infrastructure and Data
**capability_type:** INFRASTRUCTURE
**grounding_status:** WEAKLY GROUNDED

## Description

Object storage for PCAP captures, OTA firmware packages, report exports, and data lake accumulation. S3/MinIO declared in architecture HTML section s1 layer 5 only. WEAKLY GROUNDED.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-82 | [S3 / MinIO Object Storage](../03_Components/CMP_82_S3_MinIO_Object_Storage.md) [*] | INFRASTRUCTURE | INFERRED |

## Execution Contribution

- EP-07 (OTA Firmware Update — step 3)

## Relationships

- R-040: OtaModule PERSISTS_TO S3/MinIO

## Traceability Reference

Source anchors: capability_map.md CAP-28

## Navigation

- ↑ Domain: [[D_10_Platform_Infrastructure_and_Data]]
- ↓ Components: [[CMP_82_S3_MinIO_Object_Storage]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
