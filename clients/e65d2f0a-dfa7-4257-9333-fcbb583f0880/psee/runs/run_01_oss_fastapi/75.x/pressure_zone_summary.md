# Pressure Zone Summary
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

## 1. Total Zones

**Total pressure zones designated: 3**

| Zone ID | Anchor | Zone Type | Zone Class | Condition Count | Max Activation Density |
|---------|--------|-----------|-----------|----------------|------------------------|
| PZ-001 | DOM-03 | DOMAIN_ZONE | COMPOUND_ZONE | 3 | 3 |
| PZ-002 | DOM-04 | DOMAIN_ZONE | COMPOUND_ZONE | 3 | 3 |
| PZ-003 | DOM-05 | DOMAIN_ZONE | COMPOUND_ZONE | 3 | 3 |

---

## 2. Zones by Type

| Zone Type | Count | Zone IDs |
|-----------|-------|----------|
| DOMAIN_ZONE | 3 | PZ-001, PZ-002, PZ-003 |
| CEU_ZONE | 0 | — (all CEU candidates absorbed into DOMAIN_ZONEs) |
| NODE_ZONE | 0 | — |

All CEU candidates (NODE-008, NODE-009, NODE-010) co-locate with domain-level candidates (DOM-03, DOM-04, DOM-05) under the same domain_id anchor. No orphaned CEU_ZONEs.

---

## 3. Zones by Class

| Zone Class | Count | Zone IDs |
|-----------|-------|----------|
| COMPOUND_ZONE | 3 | PZ-001, PZ-002, PZ-003 |
| COUPLING_ZONE (standalone) | 0 | — |
| PROPAGATION_ZONE (standalone) | 0 | — |
| RESPONSIBILITY_ZONE (standalone) | 0 | — |
| FRAGMENTATION_ZONE | 0 | — (PSIG-006 isolated entities have activation_count=0; not candidates) |

**All designated zones are COMPOUND_ZONE.** Each zone carries 3 aggregated conditions ({PSIG-001, PSIG-002, PSIG-004}), triggering the ≥3 class rule. All three pair rules (COUPLING, PROPAGATION, RESPONSIBILITY) are embedded within each COMPOUND_ZONE.

---

## 4. Max Zone Density

| Metric | Value |
|--------|-------|
| Max condition_count per zone | 3 (all zones) |
| Max activation_count per zone | 3 (all zones, domain attribution level) |
| Max member_entities per zone | 2 (all zones: 1 CEU + 1 DOMAIN per zone) |
| Max zone density (uniform) | 3 conditions / 3 max activation / 2 members |

---

## 5. Condition Coverage Across Zones

| Condition | Zones Containing It | Attribution |
|-----------|-------------------|-------------|
| PSIG-001 | PZ-001, PZ-002, PZ-003 | PZ-002 primary; PZ-001, PZ-003 secondary |
| PSIG-002 | PZ-001, PZ-002, PZ-003 | PZ-002 primary; PZ-001, PZ-003 secondary |
| PSIG-004 | PZ-001, PZ-002, PZ-003 | PZ-002 primary; PZ-001, PZ-003 secondary |
| PSIG-006 | none | Not a pressure zone condition (structural blind-spot) |

All three active HIGH conditions appear in all three zones. The zones are structurally symmetric in their condition composition. They differ in which condition attributions are primary vs. secondary.

---

## 6. Candidate → Zone Coverage

| Candidate ID | entity_id | Mapped to Zone |
|-------------|-----------|---------------|
| PC-001 | NODE-009 | PZ-002 |
| PC-002 | NODE-008 | PZ-001 |
| PC-003 | NODE-010 | PZ-003 |
| PC-004 | DOM-04 | PZ-002 |
| PC-005 | DOM-03 | PZ-001 |
| PC-006 | DOM-05 | PZ-003 |

**Candidate coverage: 6 of 6 (100%) — all candidates absorbed into zones**

---

## 7. Structural Isolation Note

The following 9 entities carry PSIG-006 ACTIVATED but have activation_count=0 and therefore do not qualify as pressure candidates and are not assigned to any pressure zone:

| Entities | PSIG-006 | Reason |
|----------|----------|--------|
| DOM-01, DOM-02, NODE-001..NODE-007 | ACTIVATED | Isolated singletons — no structural coupling signals; not candidates |

These entities represent structural observation gaps, not structural pressure locations.

---

## 8. Governance Confirmation

- No conditions recomputed
- No signals recomputed
- No thresholds changed
- No ranking applied
- No focus domain selected
- No interpretation introduced
- No docs/pios/ files modified
- All zone designations deterministic from candidate set
