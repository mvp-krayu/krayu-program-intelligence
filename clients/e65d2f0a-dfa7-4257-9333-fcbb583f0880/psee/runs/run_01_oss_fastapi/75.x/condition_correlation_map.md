# Condition Correlation Map
## PI.CONDITION-CORRELATION.ANALYSIS.75X.03

**Stream:** PI.CONDITION-CORRELATION.ANALYSIS.75X.03
**Layer:** 75.x — Condition Correlation
**Contract:** PI.CONDITION-CORRELATION.ANALYSIS.75X.03 (CONTROLLED_EXECUTION)
**Run:** run_01_oss_fastapi
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE

---

## PART A — ENTITY_CONDITION_MAP

Condition state for each entity. Sourced from `40.6/condition_output_set_run_relative.md`.

Activation count = number of HIGH conditions (PSIG-001, PSIG-002, PSIG-004).
PSIG-006 is a binary flag, not included in activation count.

### CEU / NODE Entities

| entity_id | entity_type | PSIG-001 | PSIG-002 | PSIG-004 | PSIG-006 | activation_count | combination_signature |
|-----------|-------------|----------|----------|----------|----------|-----------------|----------------------|
| NODE-009 | CEU | HIGH | NORMAL | HIGH | NOT | 2 | PSIG-001\|PSIG-004 |
| NODE-008 | CEU | HIGH | NORMAL | HIGH | NOT | 2 | PSIG-001\|PSIG-004 |
| NODE-010 | CEU | HIGH | NORMAL | HIGH | NOT | 2 | PSIG-001\|PSIG-004 |
| NODE-001 | NODE | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |
| NODE-002 | NODE | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |
| NODE-003 | NODE | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |
| NODE-004 | NODE | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |
| NODE-005 | NODE | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |
| NODE-006 | NODE | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |
| NODE-007 | NODE | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |

**Notes:**
- NODE-008 = CEU-08; NODE-009 = CEU-09; NODE-010 = CEU-10 (aliases from condition records)
- NODE-001..007: isolated CEUs — no CONTAINS or OVERLAP edges; PSIG-001/002/004 cannot be HIGH (no signal inputs)
- PSIG-004 population is CEU entities only; capability_surface nodes are excluded from PSIG-004 computation

### DOMAIN Entities

| entity_id | entity_type | PSIG-001 | PSIG-002 | PSIG-004 | PSIG-006 | activation_count | combination_signature |
|-----------|-------------|----------|----------|----------|----------|-----------------|----------------------|
| DOM-04 | DOMAIN | NORMAL | HIGH | NORMAL | NOT | 1 | PSIG-002 |
| DOM-03 | DOMAIN | NORMAL | HIGH | NORMAL | NOT | 1 | PSIG-002 |
| DOM-05 | DOMAIN | NORMAL | HIGH | NORMAL | NOT | 1 | PSIG-002 |
| DOM-01 | DOMAIN | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |
| DOM-02 | DOMAIN | NORMAL | NORMAL | NORMAL | ACTIVATED | 0 | ∅ |

**Notes:**
- PSIG-001 and PSIG-004 are measured on NODE/CEU entities, not domain nodes directly
- PSIG-002 fan-out outliers are domain nodes (DOM-03, DOM-04, DOM-05 hold CONTAINS edges to capability surfaces)
- DOM-01, DOM-02: isolated domains; PSIG-006 ACTIVATED as isolated singletons

### Capability_Surface Entities (30 nodes)

All capability_surface entities hold NORMAL for all three active conditions and NOT for PSIG-006 (they are part of the connected cluster). Not enumerated individually.

| entity_type | Count | PSIG-001 | PSIG-002 | PSIG-004 | PSIG-006 | activation_count |
|-------------|-------|----------|----------|----------|----------|-----------------|
| capability_surface | 30 | NORMAL | NORMAL | NORMAL | NOT | 0 |

---

## PART B — ENTITY_CORRELATION_RECORDS

Full correlation record per active entity (activation_count > 0 or PSIG-006 ACTIVATED):

### CEU Entities — activation_count = 2

| Field | NODE-009 | NODE-008 | NODE-010 |
|-------|----------|----------|----------|
| entity_id | NODE-009 | NODE-008 | NODE-010 |
| entity_type | CEU | CEU | CEU |
| domain_id | DOM-04 | DOM-03 | DOM-05 |
| domain_name | frontend_isolated | backend_isolated | platform_monorepo |
| active_conditions | PSIG-001, PSIG-004 | PSIG-001, PSIG-004 | PSIG-001, PSIG-004 |
| activation_count | 2 | 2 | 2 |
| combination_signature | PSIG-001\|PSIG-004 | PSIG-001\|PSIG-004 | PSIG-001\|PSIG-004 |
| PSIG-006_flag | NOT | NOT | NOT |
| source_condition_ids | COND-PSIG-001-01, COND-PSIG-004-01 | COND-PSIG-001-01, COND-PSIG-004-01 | COND-PSIG-001-01, COND-PSIG-004-01 |
| attribution_type | primary (NODE-009), secondary (NODE-008, NODE-010) | secondary | secondary |

### DOMAIN Entities — activation_count = 1

| Field | DOM-04 | DOM-03 | DOM-05 |
|-------|--------|--------|--------|
| entity_id | DOM-04 | DOM-03 | DOM-05 |
| entity_type | DOMAIN | DOMAIN | DOMAIN |
| active_conditions | PSIG-002 | PSIG-002 | PSIG-002 |
| activation_count | 1 | 1 | 1 |
| combination_signature | PSIG-002 | PSIG-002 | PSIG-002 |
| PSIG-006_flag | NOT | NOT | NOT |
| source_condition_ids | COND-PSIG-002-01 | COND-PSIG-002-01 | COND-PSIG-002-01 |
| attribution_type | primary | secondary | secondary |

### Isolated Entities — activation_count = 0, PSIG-006 ACTIVATED

| entity_id | entity_type | active_conditions | activation_count | PSIG-006_flag | source_condition |
|-----------|-------------|-------------------|-----------------|---------------|-----------------|
| DOM-01 | DOMAIN | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| DOM-02 | DOMAIN | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| NODE-001 | NODE | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| NODE-002 | NODE | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| NODE-003 | NODE | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| NODE-004 | NODE | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| NODE-005 | NODE | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| NODE-006 | NODE | none | 0 | ACTIVATED | COND-PSIG-006-01 |
| NODE-007 | NODE | none | 0 | ACTIVATED | COND-PSIG-006-01 |

---

## PART C — COMBINATION_DISTRIBUTION

### Entity-Level

| combination_signature | entity_count | entity_ids |
|----------------------|--------------|------------|
| PSIG-001\|PSIG-004 | 3 | NODE-008, NODE-009, NODE-010 |
| PSIG-002 | 3 | DOM-03, DOM-04, DOM-05 |
| ∅+PSIG-006 | 9 | DOM-01, DOM-02, NODE-001..NODE-007 |
| ∅ | 30 | capability_surface nodes |

### Domain Attribution Level

| combination_signature | domain_count | domain_ids |
|----------------------|--------------|------------|
| PSIG-001\|PSIG-002\|PSIG-004 | 3 | DOM-03, DOM-04, DOM-05 |
| ∅+PSIG-006 | 2 | DOM-01, DOM-02 |

---

## PART D — DOMAIN_CORRELATION_MAP

### DOM-04 (frontend_isolated)

| Entity | entity_type | active_conditions | activation_count | attribution |
|--------|-------------|-------------------|-----------------|-------------|
| NODE-009 | CEU | PSIG-001, PSIG-004 | 2 | COND-PSIG-001-01 (primary); COND-PSIG-004-01 (primary) |
| DOM-04 | DOMAIN | PSIG-002 | 1 | COND-PSIG-002-01 (primary) |

Domain attribution total: 3 HIGH conditions (PSIG-001 via NODE-009 + PSIG-002 direct + PSIG-004 via NODE-009)
Domain attribution signature: PSIG-001|PSIG-002|PSIG-004

---

### DOM-03 (backend_isolated)

| Entity | entity_type | active_conditions | activation_count | attribution |
|--------|-------------|-------------------|-----------------|-------------|
| NODE-008 | CEU | PSIG-001, PSIG-004 | 2 | COND-PSIG-001-01 (secondary); COND-PSIG-004-01 (secondary) |
| DOM-03 | DOMAIN | PSIG-002 | 1 | COND-PSIG-002-01 (secondary) |

Domain attribution total: 3 HIGH conditions
Domain attribution signature: PSIG-001|PSIG-002|PSIG-004

---

### DOM-05 (platform_monorepo)

| Entity | entity_type | active_conditions | activation_count | attribution |
|--------|-------------|-------------------|-----------------|-------------|
| NODE-010 | CEU | PSIG-001, PSIG-004 | 2 | COND-PSIG-001-01 (secondary); COND-PSIG-004-01 (secondary) |
| DOM-05 | DOMAIN | PSIG-002 | 1 | COND-PSIG-002-01 (secondary) |

Domain attribution total: 3 HIGH conditions
Domain attribution signature: PSIG-001|PSIG-002|PSIG-004

---

### DOM-01 (isolated)

| Entity | entity_type | active_conditions | activation_count | attribution |
|--------|-------------|-------------------|-----------------|-------------|
| DOM-01 | DOMAIN | none | 0 | COND-PSIG-006-01 (isolated_singleton) |

Domain attribution total: 0 HIGH conditions; PSIG-006 ACTIVATED

---

### DOM-02 (isolated)

| Entity | entity_type | active_conditions | activation_count | attribution |
|--------|-------------|-------------------|-----------------|-------------|
| DOM-02 | DOMAIN | none | 0 | COND-PSIG-006-01 (isolated_singleton) |

Domain attribution total: 0 HIGH conditions; PSIG-006 ACTIVATED

---

### NODE-001..NODE-007 (isolated CEUs)

Domain attribution for NODE-001..007 is not stated in condition records. These entities have activation_count=0 and PSIG-006=ACTIVATED. They do not appear in the DOMAIN_CORRELATION_MAP active entries. Binding_envelope.json would resolve their domain_id assignments; not required for correlation analysis.

---

## Domain Activation Density (CEU Level)

| Domain | Active CEU Count | CEU activation_count | Highest CEU |
|--------|-----------------|---------------------|-------------|
| DOM-04 | 1 of 1 active CEUs | 2 | NODE-009 |
| DOM-03 | 1 of 1 active CEUs | 2 | NODE-008 |
| DOM-05 | 1 of 1 active CEUs | 2 | NODE-010 |
| DOM-01 | 0 | 0 | — |
| DOM-02 | 0 | 0 | — |

---

## Governance Confirmation

- No conditions recomputed
- No new signals defined
- No thresholds changed
- No pressure zones defined
- No focus domain selected
- All entity mappings traceable to 40.6 condition records
- No docs/pios/ files modified
