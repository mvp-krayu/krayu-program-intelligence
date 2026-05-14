# Pressure Zone Set
## PI.PRESSURE-ZONE.DESIGNATION.75X.04

**Stream:** PI.PRESSURE-ZONE.DESIGNATION.75X.04
**Layer:** 75.x — Pressure Zone Designation
**Contract:** PI.PRESSURE-ZONE.DESIGNATION.75X.04 (CONTROLLED_EXECUTION)
**Run:** run_01_oss_fastapi
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE — 3 pressure zones designated

**Canonical inputs:**
- `75.x/pressure_candidate_set.md` (PI.CONDITION-CORRELATION.ANALYSIS.75X.03)
- `75.x/condition_correlation_map.md` (PI.CONDITION-CORRELATION.ANALYSIS.75X.03)
- `docs/pios/75.x/pressure_zone_and_focus_domain_concept.md`

---

## PART A — ZONE GROUPING RULE APPLIED

**Grouping anchor:** domain_id → DOMAIN_ZONE

**Ordering rule:** alphabetical by anchor_id (deterministic; no ranking)

**Cross-domain merging:** PROHIBITED — applied; no zones merged across domain boundaries

**CEU candidate absorption:** All three CEU-level candidates (NODE-008, NODE-009, NODE-010) share their domain_id with a co-located domain-attribution candidate (DOM-03, DOM-04, DOM-05 respectively). No orphaned CEU_ZONEs result. All candidates absorbed into DOMAIN_ZONEs.

| Candidate | entity_type | domain_id | Absorbed into Zone |
|-----------|-------------|-----------|-------------------|
| NODE-008 (PC-002) | CEU | DOM-03 | PZ-001 |
| DOM-03 (PC-005) | DOMAIN | DOM-03 | PZ-001 |
| NODE-009 (PC-001) | CEU | DOM-04 | PZ-002 |
| DOM-04 (PC-004) | DOMAIN | DOM-04 | PZ-002 |
| NODE-010 (PC-003) | CEU | DOM-05 | PZ-003 |
| DOM-05 (PC-006) | DOMAIN | DOM-05 | PZ-003 |

---

## PART B / C — ZONE RECORDS WITH CLASS ASSIGNMENT

### PZ-001 — DOM-03 (backend_isolated)

| Field | Value |
|-------|-------|
| zone_id | PZ-001 |
| zone_type | DOMAIN_ZONE |
| anchor_id | DOM-03 |
| anchor_name | backend_isolated |
| member_entities | NODE-008 (CEU candidate, PC-002); DOM-03 (domain attribution candidate, PC-005) |
| member_count | 2 |
| aggregated_conditions | PSIG-001, PSIG-002, PSIG-004 |
| condition_count | 3 |
| max_activation_count | 3 (DOM-03 domain attribution) |
| zone_class | **COMPOUND_ZONE** |
| class_rule_applied | ≥3 conditions |
| embedded_pair_rules | COUPLING_ZONE (PSIG-001+PSIG-002); PROPAGATION_ZONE (PSIG-002+PSIG-004); RESPONSIBILITY_ZONE (PSIG-001+PSIG-004) |
| PSIG-006_flag | NOT — entities in connected cluster |
| psig_001_attribution | secondary — NODE-008 fan_in=10, ratio=7.26× |
| psig_002_attribution | direct — DOM-03 fan_out=10, ratio=7.26× |
| psig_004_attribution | secondary — NODE-008 surfaces=10, ratio=3.33× |
| condition_sources | COND-PSIG-001-01 (secondary); COND-PSIG-002-01 (secondary); COND-PSIG-004-01 (secondary) |

#### Evidence Trace — PZ-001

```
PSIG-001:
  ST-030 (MAX_FAN_IN; NODE-008 fan_in=10)
  → PSIG-001 = 9.43 (run-level: max_fan_in/mean = 13/1.378)
  → COND-PSIG-001-01: HIGH (NODE-008 secondary_outlier; fan_in=10 > boundary 2.5; ratio=7.26×)
  → CORRELATION: NODE-008 carries PSIG-001 HIGH (PC-002; combination_signature PSIG-001|PSIG-004)
  → ZONE: NODE-008 domain_id=DOM-03 → PZ-001

PSIG-002:
  ST-031 (MAX_FAN_OUT; DOM-03 fan_out=10)
  → PSIG-002 = 9.43 (run-level: max_fan_out/mean = 13/1.378)
  → COND-PSIG-002-01: HIGH (DOM-03 secondary; fan_out=10 > fallback boundary 6.228; ratio=7.26×)
  → CORRELATION: DOM-03 carries PSIG-002 HIGH (PC-005; combination_signature PSIG-001|PSIG-002|PSIG-004)
  → ZONE: DOM-03 domain_id=DOM-03 → PZ-001

PSIG-004:
  ST-033 (NODE-008 surface_count=10), ST-034 (TOTAL=30)
  → PSIG-004 = 4.33 (run-level: max_surface/mean = 13/3.0)
  → COND-PSIG-004-01: HIGH (NODE-008 secondary_outlier_above_threshold; ratio=3.33×)
  → CORRELATION: NODE-008 carries PSIG-004 HIGH (PC-002; combination_signature PSIG-001|PSIG-004)
  → ZONE: NODE-008 domain_id=DOM-03 → PZ-001

Condition union: {PSIG-001, PSIG-002, PSIG-004}
condition_count = 3 → COMPOUND_ZONE (rule: ≥3 conditions)
```

---

### PZ-002 — DOM-04 (frontend_isolated)

| Field | Value |
|-------|-------|
| zone_id | PZ-002 |
| zone_type | DOMAIN_ZONE |
| anchor_id | DOM-04 |
| anchor_name | frontend_isolated |
| member_entities | NODE-009 (CEU candidate, PC-001); DOM-04 (domain attribution candidate, PC-004) |
| member_count | 2 |
| aggregated_conditions | PSIG-001, PSIG-002, PSIG-004 |
| condition_count | 3 |
| max_activation_count | 3 (DOM-04 domain attribution) |
| zone_class | **COMPOUND_ZONE** |
| class_rule_applied | ≥3 conditions |
| embedded_pair_rules | COUPLING_ZONE (PSIG-001+PSIG-002); PROPAGATION_ZONE (PSIG-002+PSIG-004); RESPONSIBILITY_ZONE (PSIG-001+PSIG-004) |
| PSIG-006_flag | NOT — entities in connected cluster |
| psig_001_attribution | primary — NODE-009 fan_in=13, ratio=9.43× |
| psig_002_attribution | primary — DOM-04 fan_out=13, ratio=9.43× |
| psig_004_attribution | primary — NODE-009 surfaces=13, ratio=4.33× |
| condition_sources | COND-PSIG-001-01 (primary); COND-PSIG-002-01 (primary); COND-PSIG-004-01 (primary) |

#### Evidence Trace — PZ-002

```
PSIG-001:
  ST-030 (MAX_FAN_IN = 13; max_outlier_node = NODE-009)
  → PSIG-001 = 9.43 (13/1.378)
  → COND-PSIG-001-01: HIGH (NODE-009 max_outlier_node; fan_in=13 > boundary 2.5; ratio=9.43×)
  → CORRELATION: NODE-009 carries PSIG-001 HIGH (PC-001; combination_signature PSIG-001|PSIG-004)
  → ZONE: NODE-009 domain_id=DOM-04 → PZ-002

PSIG-002:
  ST-031 (MAX_FAN_OUT = 13; max_outlier_domain = DOM-04)
  → PSIG-002 = 9.43 (13/1.378)
  → COND-PSIG-002-01: HIGH (DOM-04 max_outlier_domain; fan_out=13 > fallback boundary 6.228; ratio=9.43×)
  → CORRELATION: DOM-04 carries PSIG-002 HIGH (PC-004; combination_signature PSIG-001|PSIG-002|PSIG-004)
  → ZONE: DOM-04 domain_id=DOM-04 → PZ-002

PSIG-004:
  ST-033 (MAX_RESPONSIBILITY_SURFACE = 13; max_outlier_node = NODE-009), ST-034 (TOTAL=30)
  → PSIG-004 = 4.33 (13/3.0)
  → COND-PSIG-004-01: HIGH (NODE-009 max_outlier_node; surface_count=13; ratio=4.33×)
  → CORRELATION: NODE-009 carries PSIG-004 HIGH (PC-001; combination_signature PSIG-001|PSIG-004)
  → ZONE: NODE-009 domain_id=DOM-04 → PZ-002

Condition union: {PSIG-001, PSIG-002, PSIG-004}
condition_count = 3 → COMPOUND_ZONE (rule: ≥3 conditions)
```

---

### PZ-003 — DOM-05 (platform_monorepo)

| Field | Value |
|-------|-------|
| zone_id | PZ-003 |
| zone_type | DOMAIN_ZONE |
| anchor_id | DOM-05 |
| anchor_name | platform_monorepo |
| member_entities | NODE-010 (CEU candidate, PC-003); DOM-05 (domain attribution candidate, PC-006) |
| member_count | 2 |
| aggregated_conditions | PSIG-001, PSIG-002, PSIG-004 |
| condition_count | 3 |
| max_activation_count | 3 (DOM-05 domain attribution) |
| zone_class | **COMPOUND_ZONE** |
| class_rule_applied | ≥3 conditions |
| embedded_pair_rules | COUPLING_ZONE (PSIG-001+PSIG-002); PROPAGATION_ZONE (PSIG-002+PSIG-004); RESPONSIBILITY_ZONE (PSIG-001+PSIG-004) |
| PSIG-006_flag | NOT — entities in connected cluster |
| psig_001_attribution | secondary — NODE-010 fan_in=9, ratio=6.53× |
| psig_002_attribution | secondary — DOM-05 fan_out=7, ratio=5.08× |
| psig_004_attribution | secondary — NODE-010 surfaces=7, ratio=2.33× |
| condition_sources | COND-PSIG-001-01 (secondary); COND-PSIG-002-01 (secondary); COND-PSIG-004-01 (secondary) |

#### Evidence Trace — PZ-003

```
PSIG-001:
  ST-030 (NODE-010 fan_in=9; ratio=9/1.378=6.53×)
  → PSIG-001 = 9.43 (run-level)
  → COND-PSIG-001-01: HIGH (NODE-010 secondary_outlier; fan_in=9 > boundary 2.5)
  → CORRELATION: NODE-010 carries PSIG-001 HIGH (PC-003; combination_signature PSIG-001|PSIG-004)
  → ZONE: NODE-010 domain_id=DOM-05 → PZ-003

PSIG-002:
  ST-031 (DOM-05 fan_out=7; ratio=7/1.378=5.08×)
  → PSIG-002 = 9.43 (run-level)
  → COND-PSIG-002-01: HIGH (DOM-05 secondary; fan_out=7 > fallback boundary 6.228)
  → CORRELATION: DOM-05 carries PSIG-002 HIGH (PC-006; combination_signature PSIG-001|PSIG-002|PSIG-004)
  → ZONE: DOM-05 domain_id=DOM-05 → PZ-003

PSIG-004:
  ST-033 (NODE-010 surface_count=7), ST-034 (TOTAL=30)
  → PSIG-004 = 4.33 (run-level)
  → COND-PSIG-004-01: HIGH (NODE-010 secondary_outlier_above_threshold; ratio=2.33×)
  → CORRELATION: NODE-010 carries PSIG-004 HIGH (PC-003; combination_signature PSIG-001|PSIG-004)
  → ZONE: NODE-010 domain_id=DOM-05 → PZ-003

Condition union: {PSIG-001, PSIG-002, PSIG-004}
condition_count = 3 → COMPOUND_ZONE (rule: ≥3 conditions)
```

---

## PART F — VALIDATION

| Check | Result |
|-------|--------|
| Only candidates used (activation_count ≥ 2) | PASS |
| No condition recomputation | PASS |
| No signal recomputation | PASS |
| No thresholds changed | PASS |
| No ranking applied (zone IDs assigned alphabetically by anchor_id) | PASS |
| No focus domain selected | PASS |
| No interpretation introduced | PASS |
| No docs/pios/ files modified | PASS |
| Outputs only under clients/.../75.x/ | PASS |
| Deterministic grouping (domain_id anchor) | PASS |
| No cross-domain merging | PASS |
| All zone evidence traces to 40.6 condition records | PASS |
| No code changes | PASS |

**Validation result: PASS — all checks satisfied**
