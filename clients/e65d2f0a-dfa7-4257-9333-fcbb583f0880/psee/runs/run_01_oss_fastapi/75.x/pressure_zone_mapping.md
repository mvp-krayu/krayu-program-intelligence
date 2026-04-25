# Pressure Zone Mapping
## PI.PRESSURE-ZONE.DESIGNATION.75X.04

**Stream:** PI.PRESSURE-ZONE.DESIGNATION.75X.04
**Layer:** 75.x — Pressure Zone Designation
**Contract:** PI.PRESSURE-ZONE.DESIGNATION.75X.04 (CONTROLLED_EXECUTION)
**Run:** run_01_oss_fastapi
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE

---

## 1. Entity → Zone Mapping

| entity_id | entity_type | domain_id | candidate_id | zone_id | zone_class |
|-----------|-------------|-----------|-------------|---------|-----------|
| NODE-009 | CEU | DOM-04 | PC-001 | PZ-002 | COMPOUND_ZONE |
| NODE-008 | CEU | DOM-03 | PC-002 | PZ-001 | COMPOUND_ZONE |
| NODE-010 | CEU | DOM-05 | PC-003 | PZ-003 | COMPOUND_ZONE |
| DOM-04 | DOMAIN | DOM-04 | PC-004 | PZ-002 | COMPOUND_ZONE |
| DOM-03 | DOMAIN | DOM-03 | PC-005 | PZ-001 | COMPOUND_ZONE |
| DOM-05 | DOMAIN | DOM-05 | PC-006 | PZ-003 | COMPOUND_ZONE |

**Entities with no zone assignment:** 39 (30 capability_surface + 9 isolated entities — all have activation_count=0)

---

## 2. Domain → Zones Mapping

| domain_id | domain_name | zone_id | zone_class | members_in_zone | condition_attribution_type |
|-----------|-------------|---------|-----------|-----------------|---------------------------|
| DOM-03 | backend_isolated | PZ-001 | COMPOUND_ZONE | NODE-008 (CEU), DOM-03 (domain) | PSIG-001 secondary; PSIG-002 direct; PSIG-004 secondary |
| DOM-04 | frontend_isolated | PZ-002 | COMPOUND_ZONE | NODE-009 (CEU), DOM-04 (domain) | PSIG-001 primary; PSIG-002 primary; PSIG-004 primary |
| DOM-05 | platform_monorepo | PZ-003 | COMPOUND_ZONE | NODE-010 (CEU), DOM-05 (domain) | PSIG-001 secondary; PSIG-002 secondary; PSIG-004 secondary |
| DOM-01 | — | none | — | — | PSIG-006 ACTIVATED (isolated; not a pressure zone) |
| DOM-02 | — | none | — | — | PSIG-006 ACTIVATED (isolated; not a pressure zone) |

---

## 3. Zone → Conditions Mapping

| zone_id | anchor_id | PSIG-001 | PSIG-002 | PSIG-004 | PSIG-006 | zone_class |
|---------|-----------|----------|----------|----------|----------|-----------|
| PZ-001 | DOM-03 | via NODE-008 (secondary) | DOM-03 direct (secondary) | via NODE-008 (secondary) | NOT | COMPOUND_ZONE |
| PZ-002 | DOM-04 | via NODE-009 (primary) | DOM-04 direct (primary) | via NODE-009 (primary) | NOT | COMPOUND_ZONE |
| PZ-003 | DOM-05 | via NODE-010 (secondary) | DOM-05 direct (secondary) | via NODE-010 (secondary) | NOT | COMPOUND_ZONE |

---

## 4. Zone → Condition Source Records

| zone_id | condition_id | signal_id | attribution_role | entity_in_zone |
|---------|-------------|-----------|-----------------|----------------|
| PZ-001 | COND-PSIG-001-01 | PSIG-001 | secondary_outlier | NODE-008 |
| PZ-001 | COND-PSIG-002-01 | PSIG-002 | secondary | DOM-03 |
| PZ-001 | COND-PSIG-004-01 | PSIG-004 | secondary_outlier_above_threshold | NODE-008 |
| PZ-002 | COND-PSIG-001-01 | PSIG-001 | primary (max_outlier_node) | NODE-009 |
| PZ-002 | COND-PSIG-002-01 | PSIG-002 | primary (max_outlier_domain) | DOM-04 |
| PZ-002 | COND-PSIG-004-01 | PSIG-004 | primary (max_outlier_node) | NODE-009 |
| PZ-003 | COND-PSIG-001-01 | PSIG-001 | secondary_outlier | NODE-010 |
| PZ-003 | COND-PSIG-002-01 | PSIG-002 | secondary | DOM-05 |
| PZ-003 | COND-PSIG-004-01 | PSIG-004 | secondary_outlier_above_threshold | NODE-010 |

---

## 5. CEU → Zone Mapping

| CEU entity | CEU alias | domain_id | zone_id | active_conditions_in_zone | ceu_activation_count |
|------------|-----------|-----------|---------|--------------------------|----------------------|
| NODE-008 | CEU-08 | DOM-03 | PZ-001 | PSIG-001, PSIG-004 | 2 |
| NODE-009 | CEU-09 | DOM-04 | PZ-002 | PSIG-001, PSIG-004 | 2 |
| NODE-010 | CEU-10 | DOM-05 | PZ-003 | PSIG-001, PSIG-004 | 2 |

---

## 6. Structural Blind-Spot Entities (PSIG-006 — Not Zones)

| entity_id | entity_type | PSIG-006_state | Zone Assignment |
|-----------|-------------|---------------|-----------------|
| DOM-01 | DOMAIN | ACTIVATED | none — not a candidate |
| DOM-02 | DOMAIN | ACTIVATED | none — not a candidate |
| NODE-001 | NODE | ACTIVATED | none — not a candidate |
| NODE-002 | NODE | ACTIVATED | none — not a candidate |
| NODE-003 | NODE | ACTIVATED | none — not a candidate |
| NODE-004 | NODE | ACTIVATED | none — not a candidate |
| NODE-005 | NODE | ACTIVATED | none — not a candidate |
| NODE-006 | NODE | ACTIVATED | none — not a candidate |
| NODE-007 | NODE | ACTIVATED | none — not a candidate |

---

## 7. Governance Confirmation

- All entity → zone assignments sourced from pressure_candidate_set.md (PI.CONDITION-CORRELATION.ANALYSIS.75X.03)
- No conditions recomputed
- No signals recomputed
- No ranking applied
- No focus domain selected
- No interpretation introduced
- No docs/pios/ files modified
- All zone assignments deterministic from domain_id grouping rule
