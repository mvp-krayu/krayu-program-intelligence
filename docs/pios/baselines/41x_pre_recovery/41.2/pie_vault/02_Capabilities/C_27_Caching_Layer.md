# Capability: Caching Layer

**capability_id:** CAP-27
**parent_domain:** DOMAIN-10 — Platform Infrastructure and Data
**capability_type:** INFRASTRUCTURE
**grounding_status:** GROUNDED

## Description

Redis-backed API response caching with in-memory auto-fallback and pub/sub support. RedisCacheModule (COMP-64) confirmed at app.module.ts line 9 with common/cache/ directory. Redis 7 (COMP-81) confirmed via ioredis dependency and redis.config.ts.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-64 | [RedisCacheModule](../03_Components/CMP_64_RedisCacheModule.md) | BACKEND | DIRECT_EVIDENCE |
| COMP-81 | [Redis 7](../03_Components/CMP_81_Redis_7.md) | INFRASTRUCTURE | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — steps 4 and 7 cache hit check and write)
- EP-05 (Domain Event Fan-Out — Branch B cache invalidation)

## Relationships

- R-017: All modules using cache DEPENDS_ON Redis 7
- R-022: FleetEventsModule CALLS RedisCacheModule

## Traceability Reference

Source anchors: capability_map.md CAP-27

## Navigation

- ↑ Domain: [[D_10_Platform_Infrastructure_and_Data]]
- ↓ Components: [[CMP_64_RedisCacheModule]] · [[CMP_81_Redis_7]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
