# Component: Redis 7

**component_id:** COMP-81
**tier:** INFRASTRUCTURE
**semantic_capability:** CAP-27 — Caching Layer
**semantic_domain:** DOMAIN-10 — Platform Infrastructure and Data

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** package.json: ioredis cache-manager-ioredis-yet; redis.config.ts confirmed

## Description

In-memory session and API response cache with pub/sub support. Confirmed via ioredis and cache-manager-ioredis-yet dependencies and redis.config.ts.

## Relationships

R-017: All modules using cache DEPENDS_ON Redis 7

## Traceability Reference

**semantic_traceability_entry:** COMP-81 in semantic_traceability_map.md

## Parent Capability

[[C_27_Caching_Layer]]

## Navigation

- ↑ Capability: [[C_27_Caching_Layer]]
- ↑ Domain: [[D_10_Platform_Infrastructure_and_Data]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
