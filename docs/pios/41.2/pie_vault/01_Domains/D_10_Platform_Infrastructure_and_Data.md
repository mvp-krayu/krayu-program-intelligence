# Domain: Platform Infrastructure and Data

**domain_id:** DOMAIN-10
**domain_type:** INFRASTRUCTURE
**grounding_status:** WEAKLY GROUNDED

## Description

The persistence, caching, and platform data layer underpinning all backend modules. PostgreSQL 15 (COMP-79) is the primary operational database — confirmed by TypeORM configuration in app.module.ts (EVID-APPMOD lines 136–151). TimescaleDB (COMP-80) is the sensor_readings hypertable — confirmed via migration filename and architecture HTML. Redis 7 (COMP-81) is the session and API cache — confirmed via package.json (ioredis dependency) and redis.config.ts. RedisCacheModule (COMP-64) — confirmed in app.module.ts line 9 — provides the HttpCacheInterceptor globally. S3/MinIO (COMP-82) is architecture-declared only (EVID-ARCH section s1 layer 5), making this domain WEAKLY GROUNDED overall. The monorepo container component (COMP-01) is included as the platform structural anchor.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-26 | [Primary Data Persistence](../02_Capabilities/C_26_Primary_Data_Persistence.md) | INFRASTRUCTURE | GROUNDED |
| CAP-27 | [Caching Layer](../02_Capabilities/C_27_Caching_Layer.md) | INFRASTRUCTURE | GROUNDED |
| CAP-28 | [Object Storage](../02_Capabilities/C_28_Object_Storage.md) [*] | INFRASTRUCTURE | WEAKLY GROUNDED |
| CAP-29 | [Platform Monorepo Container](../02_Capabilities/C_29_Platform_Monorepo_Container.md) | INFRASTRUCTURE | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-01 | [blueedge-platform (Monorepo)](../03_Components/CMP_01_blueedge_platform.md) | INFRASTRUCTURE | CAP-29 |
| COMP-64 | [RedisCacheModule](../03_Components/CMP_64_RedisCacheModule.md) | BACKEND | CAP-27 |
| COMP-79 | [PostgreSQL 15](../03_Components/CMP_79_PostgreSQL_15.md) | DATA | CAP-26 |
| COMP-80 | [TimescaleDB](../03_Components/CMP_80_TimescaleDB.md) | DATA | CAP-26 |
| COMP-81 | [Redis 7](../03_Components/CMP_81_Redis_7.md) | INFRASTRUCTURE | CAP-27 |
| COMP-82 | [S3 / MinIO Object Storage](../03_Components/CMP_82_S3_MinIO_Object_Storage.md) [*] | INFRASTRUCTURE | CAP-28 |

## Execution Path Participation

- EP-03 (User Authentication — step 3 PostgreSQL user lookup)
- EP-04 (Fleet Data REST — steps 4, 6, 7 Redis cache and PostgreSQL)
- EP-06 (Predictive Maintenance AI — steps 2, 8 TimescaleDB and PostgreSQL)
- EP-07 (OTA Firmware Update — step 3 S3/MinIO)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-01, COMP-64, COMP-79, COMP-80, COMP-81, COMP-82 [WEAKLY GROUNDED]
- relationship_anchors: R-014, R-015, R-016, R-017, R-022, R-031, R-040

## Navigation

- ↓ Capabilities: [[C_26_Primary_Data_Persistence]] · [[C_27_Caching_Layer]] · [[C_28_Object_Storage]] · [[C_29_Platform_Monorepo_Container]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
