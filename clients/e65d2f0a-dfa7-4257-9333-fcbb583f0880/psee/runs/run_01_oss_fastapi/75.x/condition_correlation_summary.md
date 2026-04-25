# Condition Correlation Summary
## PI.CONDITION-CORRELATION.ANALYSIS.75X.03

**Stream:** PI.CONDITION-CORRELATION.ANALYSIS.75X.03
**Layer:** 75.x — Condition Correlation
**Contract:** PI.CONDITION-CORRELATION.ANALYSIS.75X.03 (CONTROLLED_EXECUTION)
**Run:** run_01_oss_fastapi
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE

**Canonical inputs:**
- `40.6/condition_output_set_run_relative.md` (PI.RUN-RELATIVE.ACTIVATION.75X.02)
- `40.6/run_relative_activation_summary.md` (PI.RUN-RELATIVE.ACTIVATION.75X.02)

---

## 1. Scope

| Metric | Value |
|--------|-------|
| Total topology entities | 45 |
| Entities with ≥1 HIGH or ACTIVATED condition | 15 |
| Entities with all NORMAL / NOT | 30 (capability_surface nodes — not enumerated individually) |
| Conditions in scope | COND-PSIG-001-01, COND-PSIG-002-01, COND-PSIG-004-01, COND-PSIG-006-01 |

---

## 2. Entity-Level Activation Count Distribution

Activation count = number of HIGH conditions among PSIG-001, PSIG-002, PSIG-004.
PSIG-006 recorded as a separate binary flag; not included in activation count.

| Activation Count | Entity Count | Entity IDs |
|-----------------|--------------|------------|
| 2 | 3 | NODE-008, NODE-009, NODE-010 |
| 1 | 3 | DOM-03, DOM-04, DOM-05 |
| 0 + PSIG-006 ACTIVATED | 9 | DOM-01, DOM-02, NODE-001, NODE-002, NODE-003, NODE-004, NODE-005, NODE-006, NODE-007 |
| 0 (all NORMAL / NOT) | 30 | all capability_surface entities |
| **Total** | **45** | |

- **Max activation_count (entity level): 2**
- Entities with ≥2 active conditions: **3**
- Entities with ≥3 active conditions: **0**

---

## 3. Domain Attribution Level Distribution

Domain attribution sourced from `zone_domain_primary` and `zone_domain_secondary` fields in condition records. Each HIGH condition attributed to the domain containing its outlier entity.

| Domain | Attributed HIGH Conditions | Condition IDs |
|--------|---------------------------|---------------|
| DOM-04 | 3 (PSIG-001, PSIG-002, PSIG-004) | COND-PSIG-001-01 (primary); COND-PSIG-002-01 (primary); COND-PSIG-004-01 (primary) |
| DOM-03 | 3 (PSIG-001, PSIG-002, PSIG-004) | COND-PSIG-001-01 (secondary); COND-PSIG-002-01 (secondary); COND-PSIG-004-01 (secondary) |
| DOM-05 | 3 (PSIG-001, PSIG-002, PSIG-004) | COND-PSIG-001-01 (secondary); COND-PSIG-002-01 (secondary); COND-PSIG-004-01 (secondary) |
| DOM-01 | 0 HIGH (PSIG-006 ACTIVATED) | COND-PSIG-006-01 |
| DOM-02 | 0 HIGH (PSIG-006 ACTIVATED) | COND-PSIG-006-01 |

- **Max attributed activation_count (domain level): 3**
- Domains with ≥2 attributed conditions: **3**
- Domains with ≥3 attributed conditions: **3**

---

## 4. Combination Distribution

### 4a — Entity-Level Combinations

| Combination Signature | Entity Count | Entity IDs |
|----------------------|--------------|------------|
| PSIG-001\|PSIG-004 | 3 | NODE-008, NODE-009, NODE-010 |
| PSIG-002 | 3 | DOM-03, DOM-04, DOM-05 |
| ∅+PSIG-006 | 9 | DOM-01, DOM-02, NODE-001..NODE-007 |
| ∅ | 30 | capability_surface nodes |

- Most frequent active combination: **PSIG-001|PSIG-004** (3 entities) and **PSIG-002** (3 entities) — equal frequency
- No entity has combination {PSIG-001, PSIG-002}, {PSIG-002, PSIG-004}, or {PSIG-001, PSIG-002, PSIG-004} at the direct entity level

### 4b — Domain Attribution Combinations

| Combination Signature | Domain Count | Domain IDs |
|----------------------|--------------|------------|
| PSIG-001\|PSIG-002\|PSIG-004 | 3 | DOM-03, DOM-04, DOM-05 |
| ∅+PSIG-006 | 2 | DOM-01, DOM-02 |

- At domain attribution level, all three connected domains share the same combination signature: **PSIG-001|PSIG-002|PSIG-004**

---

## 5. Structural Patterns

### High-Density Co-Location (entity level)

| Pattern | Count | Description |
|---------|-------|-------------|
| {PSIG-001, PSIG-004} at single CEU entity | 3 | NODE-008, NODE-009, NODE-010 all carry both coupling pressure and responsibility pressure |
| {PSIG-002} at domain entity | 3 | DOM-03, DOM-04, DOM-05 all carry propagation pressure |

### Rare High-Density Combination

| Pattern | Count |
|---------|-------|
| activation_count = 2 at entity level | 3 |
| activation_count = 3 at domain attribution level | 3 |
| activation_count ≥ 3 at entity level | 0 |

No entity simultaneously holds HIGH states across all three measurable pressure families (PSIG-001, PSIG-002, PSIG-004) at the direct entity level. PSIG-001 and PSIG-004 are co-located at CEU entities; PSIG-002 co-locates with the same domains at the domain entity level.

---

## 6. Pressure Candidate Count

| Analysis Level | Threshold | Candidate Count |
|----------------|-----------|-----------------|
| Entity-level (HIGH count) | ≥2 | 3 |
| Domain attribution level | ≥2 attributed | 3 |

Total distinct structural locations with ≥2 condition activations: **6** (3 CEU entities + 3 domain entities under attribution).

When CEU entities are mapped to their parent domains (NODE-009→DOM-04, NODE-008→DOM-03, NODE-010→DOM-05), all entity-level candidates map to the same 3 domains as the domain-attribution candidates.

---

## 7. Governance Confirmation

- No conditions recomputed
- No thresholds changed
- No pressure zones defined
- No focus domain selected
- No interpretation introduced
- No ranking applied
- No docs/pios/ files modified
- All data derived from condition_output_set_run_relative.md and run_relative_activation_summary.md
