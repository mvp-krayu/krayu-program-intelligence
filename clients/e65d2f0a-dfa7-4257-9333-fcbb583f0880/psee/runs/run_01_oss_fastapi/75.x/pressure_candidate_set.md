# Pressure Candidate Set
## PI.CONDITION-CORRELATION.ANALYSIS.75X.03

**Stream:** PI.CONDITION-CORRELATION.ANALYSIS.75X.03
**Layer:** 75.x — Condition Correlation
**Contract:** PI.CONDITION-CORRELATION.ANALYSIS.75X.03 (CONTROLLED_EXECUTION)
**Run:** run_01_oss_fastapi
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE

**Definition:** PRESSURE_CANDIDATE = entity where activation_count ≥ 2 (count of HIGH conditions among PSIG-001, PSIG-002, PSIG-004)

---

## SECTION 1 — ENTITY-LEVEL PRESSURE CANDIDATES

Entities with direct activation_count ≥ 2:

| # | entity_id | entity_type | domain_id | active_conditions | activation_count | combination_signature |
|---|-----------|-------------|-----------|-------------------|-----------------|----------------------|
| 1 | NODE-009 | CEU | DOM-04 | PSIG-001, PSIG-004 | 2 | PSIG-001\|PSIG-004 |
| 2 | NODE-008 | CEU | DOM-03 | PSIG-001, PSIG-004 | 2 | PSIG-001\|PSIG-004 |
| 3 | NODE-010 | CEU | DOM-05 | PSIG-001, PSIG-004 | 2 | PSIG-001\|PSIG-004 |

**Entity-level candidate count: 3**

---

## SECTION 2 — DOMAIN ATTRIBUTION PRESSURE CANDIDATES

Domains with attributed condition count ≥ 2 (from condition record zone_domain fields):

| # | entity_id | entity_type | attributed_conditions | attributed_count | combination_signature | attribution_basis |
|---|-----------|-------------|----------------------|-----------------|----------------------|-------------------|
| 1 | DOM-04 | DOMAIN | PSIG-001, PSIG-002, PSIG-004 | 3 | PSIG-001\|PSIG-002\|PSIG-004 | PSIG-001 zone_domain_primary; PSIG-002 direct; PSIG-004 zone_domain_primary |
| 2 | DOM-03 | DOMAIN | PSIG-001, PSIG-002, PSIG-004 | 3 | PSIG-001\|PSIG-002\|PSIG-004 | PSIG-001 zone_domain_secondary; PSIG-002 direct; PSIG-004 zone_domain_secondary |
| 3 | DOM-05 | DOMAIN | PSIG-001, PSIG-002, PSIG-004 | 3 | PSIG-001\|PSIG-002\|PSIG-004 | PSIG-001 zone_domain_secondary; PSIG-002 direct; PSIG-004 zone_domain_secondary |

**Domain attribution candidate count: 3**

---

## SECTION 3 — CANDIDATE DETAIL RECORDS

### PC-001 — NODE-009 (CEU-09 / DOM-04)

| Field | Value |
|-------|-------|
| entity_id | NODE-009 |
| entity_alias | CEU-09 |
| entity_type | CEU |
| domain_id | DOM-04 |
| domain_name | frontend_isolated |
| active_conditions | PSIG-001, PSIG-004 |
| activation_count | 2 |
| combination_signature | PSIG-001\|PSIG-004 |
| PSIG-006_flag | NOT (entity is in connected cluster) |
| condition_attribution | COND-PSIG-001-01: primary max_outlier_node; COND-PSIG-004-01: primary max_outlier_node |
| PSIG-001_value | fan_in = 13 (ratio = 9.43×) |
| PSIG-004_value | surface_count = 13 (ratio = 4.33×) |

### PC-002 — NODE-008 (CEU-08 / DOM-03)

| Field | Value |
|-------|-------|
| entity_id | NODE-008 |
| entity_alias | CEU-08 |
| entity_type | CEU |
| domain_id | DOM-03 |
| domain_name | backend_isolated |
| active_conditions | PSIG-001, PSIG-004 |
| activation_count | 2 |
| combination_signature | PSIG-001\|PSIG-004 |
| PSIG-006_flag | NOT |
| condition_attribution | COND-PSIG-001-01: secondary_outlier; COND-PSIG-004-01: secondary_outlier_above_threshold |
| PSIG-001_value | fan_in = 10 (ratio = 7.26×) |
| PSIG-004_value | surface_count = 10 (ratio = 3.33×) |

### PC-003 — NODE-010 (CEU-10 / DOM-05)

| Field | Value |
|-------|-------|
| entity_id | NODE-010 |
| entity_alias | CEU-10 |
| entity_type | CEU |
| domain_id | DOM-05 |
| domain_name | platform_monorepo |
| active_conditions | PSIG-001, PSIG-004 |
| activation_count | 2 |
| combination_signature | PSIG-001\|PSIG-004 |
| PSIG-006_flag | NOT |
| condition_attribution | COND-PSIG-001-01: secondary_outlier; COND-PSIG-004-01: secondary_outlier_above_threshold |
| PSIG-001_value | fan_in = 9 (ratio = 6.53×) |
| PSIG-004_value | surface_count = 7 (ratio = 2.33×) |

### PC-004 — DOM-04 (domain attribution)

| Field | Value |
|-------|-------|
| entity_id | DOM-04 |
| entity_type | DOMAIN |
| domain_name | frontend_isolated |
| attributed_conditions | PSIG-001, PSIG-002, PSIG-004 |
| attributed_count | 3 |
| combination_signature | PSIG-001\|PSIG-002\|PSIG-004 |
| PSIG-006_flag | NOT |
| PSIG-001_attribution | COND-PSIG-001-01: zone_domain_primary — contains NODE-009 (max fan-in node) |
| PSIG-002_attribution | COND-PSIG-002-01: max_outlier_domain direct — DOM-04 fan_out = 13 |
| PSIG-004_attribution | COND-PSIG-004-01: zone_domain_primary — contains NODE-009 (max responsibility CEU) |

### PC-005 — DOM-03 (domain attribution)

| Field | Value |
|-------|-------|
| entity_id | DOM-03 |
| entity_type | DOMAIN |
| domain_name | backend_isolated |
| attributed_conditions | PSIG-001, PSIG-002, PSIG-004 |
| attributed_count | 3 |
| combination_signature | PSIG-001\|PSIG-002\|PSIG-004 |
| PSIG-006_flag | NOT |
| PSIG-001_attribution | COND-PSIG-001-01: zone_domain_secondary — contains NODE-008 (secondary fan-in outlier) |
| PSIG-002_attribution | COND-PSIG-002-01: secondary — DOM-03 fan_out = 10 |
| PSIG-004_attribution | COND-PSIG-004-01: zone_domain_secondary — contains NODE-008 (secondary responsibility outlier) |

### PC-006 — DOM-05 (domain attribution)

| Field | Value |
|-------|-------|
| entity_id | DOM-05 |
| entity_type | DOMAIN |
| domain_name | platform_monorepo |
| attributed_conditions | PSIG-001, PSIG-002, PSIG-004 |
| attributed_count | 3 |
| combination_signature | PSIG-001\|PSIG-002\|PSIG-004 |
| PSIG-006_flag | NOT |
| PSIG-001_attribution | COND-PSIG-001-01: zone_domain_secondary — contains NODE-010 (secondary fan-in outlier) |
| PSIG-002_attribution | COND-PSIG-002-01: secondary — DOM-05 fan_out = 7 |
| PSIG-004_attribution | COND-PSIG-004-01: zone_domain_secondary — contains NODE-010 (secondary responsibility outlier) |

---

## SECTION 4 — EVIDENCE TRACE (PART G)

Format: ST → PSIG → COND → CORRELATION

### PC-001: NODE-009

```
PSIG-001 trace:
  ST-030 (MAX_FAN_IN = 13)
  → PSIG-001 = 13 / 1.378 = 9.43
  → COND-PSIG-001-01: HIGH (9.43 > 2.0 threshold)
     max_outlier_node = NODE-009; max_outlier_domain = DOM-04
  → CORRELATION: NODE-009 carries PSIG-001 HIGH

PSIG-004 trace:
  ST-033 (MAX_RESPONSIBILITY_SURFACE = 13), ST-034 (TOTAL_INTERFACE_SURFACE = 30)
  → PSIG-004 = 13 / 3.0 = 4.33
  → COND-PSIG-004-01: HIGH (4.33 > 2.0 threshold)
     max_outlier_node = NODE-009; max_outlier_domain = DOM-04
  → CORRELATION: NODE-009 carries PSIG-004 HIGH

CO-LOCATION: NODE-009 holds PSIG-001 HIGH + PSIG-004 HIGH
  → combination_signature: PSIG-001|PSIG-004
  → activation_count: 2
  → structural location: DOM-04 (frontend_isolated)
```

### PC-002: NODE-008

```
PSIG-001 trace:
  ST-030 (fan_in = 10, ratio = 10/1.378 = 7.26×)
  → COND-PSIG-001-01: HIGH (secondary_outlier, fan_in 10 > boundary 2.5)
  → CORRELATION: NODE-008 carries PSIG-001 HIGH (secondary)

PSIG-004 trace:
  ST-033 (surface_count = 10), ST-034 (total = 30)
  → ratio = 10/3.0 = 3.33× (exceeds 2.0 threshold)
  → COND-PSIG-004-01: HIGH (secondary_outlier_above_threshold)
  → CORRELATION: NODE-008 carries PSIG-004 HIGH (secondary)

CO-LOCATION: NODE-008 holds PSIG-001 HIGH + PSIG-004 HIGH
  → combination_signature: PSIG-001|PSIG-004
  → activation_count: 2
  → structural location: DOM-03 (backend_isolated)
```

### PC-003: NODE-010

```
PSIG-001 trace:
  ST-030 (fan_in = 9, ratio = 9/1.378 = 6.53×)
  → COND-PSIG-001-01: HIGH (secondary_outlier, fan_in 9 > boundary 2.5)
  → CORRELATION: NODE-010 carries PSIG-001 HIGH (secondary)

PSIG-004 trace:
  ST-033 (surface_count = 7), ST-034 (total = 30)
  → ratio = 7/3.0 = 2.33× (exceeds 2.0 threshold)
  → COND-PSIG-004-01: HIGH (secondary_outlier_above_threshold)
  → CORRELATION: NODE-010 carries PSIG-004 HIGH (secondary)

CO-LOCATION: NODE-010 holds PSIG-001 HIGH + PSIG-004 HIGH
  → combination_signature: PSIG-001|PSIG-004
  → activation_count: 2
  → structural location: DOM-05 (platform_monorepo)
```

### PC-004: DOM-04 (domain attribution)

```
PSIG-001 trace (attributed):
  ST-030 → PSIG-001 → COND-PSIG-001-01 (zone_domain_primary = DOM-04)
  → DOM-04 attributed for coupling pressure via NODE-009

PSIG-002 trace (direct):
  ST-031 (MAX_FAN_OUT = 13)
  → PSIG-002 = 13 / 1.378 = 9.43
  → COND-PSIG-002-01: HIGH (9.43 > 2.0; IQR degenerate; mean+2SD fallback)
     max_outlier_domain = DOM-04 (fan_out = 13 > boundary 6.228)
  → DOM-04 carries PSIG-002 HIGH directly

PSIG-004 trace (attributed):
  ST-033/ST-034 → PSIG-004 → COND-PSIG-004-01 (zone_domain_primary = DOM-04)
  → DOM-04 attributed for responsibility pressure via NODE-009

CO-LOCATION (domain attribution):
  → attributed_conditions: PSIG-001 + PSIG-002 + PSIG-004
  → attributed_count: 3
  → combination_signature: PSIG-001|PSIG-002|PSIG-004
  → structural location: DOM-04 (frontend_isolated)
```

### PC-005: DOM-03 (domain attribution)

```
PSIG-001 trace (attributed): via NODE-008 secondary → COND-PSIG-001-01 (zone_domain_secondary = DOM-03)
PSIG-002 trace (direct): fan_out = 10 > 6.228 → COND-PSIG-002-01 (secondary)
PSIG-004 trace (attributed): via NODE-008 secondary → COND-PSIG-004-01 (zone_domain_secondary = DOM-03)

CO-LOCATION (domain attribution):
  → attributed_count: 3
  → combination_signature: PSIG-001|PSIG-002|PSIG-004
  → structural location: DOM-03 (backend_isolated)
```

### PC-006: DOM-05 (domain attribution)

```
PSIG-001 trace (attributed): via NODE-010 secondary → COND-PSIG-001-01 (zone_domain_secondary = DOM-05)
PSIG-002 trace (direct): fan_out = 7 > 6.228 → COND-PSIG-002-01 (secondary)
PSIG-004 trace (attributed): via NODE-010 secondary → COND-PSIG-004-01 (zone_domain_secondary = DOM-05)

CO-LOCATION (domain attribution):
  → attributed_count: 3
  → combination_signature: PSIG-001|PSIG-002|PSIG-004
  → structural location: DOM-05 (platform_monorepo)
```

---

## SECTION 5 — CANDIDATE SUMMARY

| PC # | entity_id | entity_type | domain_id | activation_count | combination_signature |
|------|-----------|-------------|-----------|-----------------|----------------------|
| PC-001 | NODE-009 | CEU | DOM-04 | 2 | PSIG-001\|PSIG-004 |
| PC-002 | NODE-008 | CEU | DOM-03 | 2 | PSIG-001\|PSIG-004 |
| PC-003 | NODE-010 | CEU | DOM-05 | 2 | PSIG-001\|PSIG-004 |
| PC-004 | DOM-04 | DOMAIN (attributed) | DOM-04 | 3 (attributed) | PSIG-001\|PSIG-002\|PSIG-004 |
| PC-005 | DOM-03 | DOMAIN (attributed) | DOM-03 | 3 (attributed) | PSIG-001\|PSIG-002\|PSIG-004 |
| PC-006 | DOM-05 | DOMAIN (attributed) | DOM-05 | 3 (attributed) | PSIG-001\|PSIG-002\|PSIG-004 |

**Total pressure candidates: 6**
**Distinct structural domains represented: 3 (DOM-03, DOM-04, DOM-05)**

---

## SECTION 6 — STRUCTURAL BLIND-SPOT RECORD (PSIG-006)

The following entities are structurally isolated (PSIG-006 ACTIVATED). They have activation_count=0 and are NOT pressure candidates. They constitute structural observation gaps.

| entity_id | entity_type | PSIG-006 |
|-----------|-------------|----------|
| DOM-01 | DOMAIN | ACTIVATED |
| DOM-02 | DOMAIN | ACTIVATED |
| NODE-001 | NODE | ACTIVATED |
| NODE-002 | NODE | ACTIVATED |
| NODE-003 | NODE | ACTIVATED |
| NODE-004 | NODE | ACTIVATED |
| NODE-005 | NODE | ACTIVATED |
| NODE-006 | NODE | ACTIVATED |
| NODE-007 | NODE | ACTIVATED |

---

## Governance Confirmation

- Only existing conditions used (COND-PSIG-001-01, COND-PSIG-002-01, COND-PSIG-004-01, COND-PSIG-006-01)
- No signal recomputation performed
- No thresholds changed
- No interpretation introduced
- No pressure zones defined
- No focus domain selected
- No docs/pios/ files modified
- Outputs written only to clients/.../75.x/
- All mappings traceable to 40.6 condition outputs
- No code changes
