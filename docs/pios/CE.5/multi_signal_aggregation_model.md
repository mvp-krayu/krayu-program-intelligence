# CE.5 — Multi-Signal Aggregation Model

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** GOVERNANCE MODEL (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.2 DEC-008, DEC-009, QA.2 multi-signal conflict validation,
  QA.4 shared-signal fan-out validation, `single_signal_consumption_rules.md`
**Authority:** CE.5

---

## 1. PURPOSE

This document defines the governed model for aggregating tier contributions from
multiple binding table rows into a single condition state.

CE.5 does not redefine DEC-009 (max-tier resolution). CE.2 DEC-009 is the authoritative
definition. CE.5 states the CE.5-layer obligations:
- How SC-001..SC-006 tier outputs feed into DEC-009
- What the aggregation boundary is (per-condition)
- What multi-signal scenarios are governed
- What aggregation behaviors are explicitly prohibited

---

## 2. AGGREGATION BOUNDARY

**Unit of aggregation:** One condition.

For each condition in the binding table, all binding rows for that condition are consumed
independently per SC-001..SC-006. Each row produces one tier contribution (or CS-004).
All tier contributions for the condition are then passed to DEC-009 for resolution.

**Aggregation is condition-local (CE.2 DEC-006):** Tier contributions from one condition's
binding rows do not influence aggregation for any other condition. There is no cross-condition
aggregation, global tier pooling, or shared precedence computation.

---

## 3. AGGREGATION PROCEDURE

For a given condition C with binding rows R₁, R₂, ..., Rₙ:

```
Step 1 — Consume each row independently:
  for each row Rᵢ in condition C's binding rows:
      tier_i = consume(Rᵢ)   // per SC-001..SC-005; CS-004 is a pre-filter error

Step 2 — Collect tier contributions:
  contributions = { tier_1, tier_2, ..., tier_n }
  (all must be from governed vocabulary: BLOCKED | DEGRADED | AT_RISK | STABLE)

Step 3 — Apply DEC-009 max-tier resolution:
  condition_tier = max(contributions, key=TIER_ORDER)
  where TIER_ORDER: BLOCKED=3 > DEGRADED=2 > AT_RISK=1 > STABLE=0

Step 4 — Emit:
  condition_coverage_state = condition_tier
  (per CE.2 DEC-011 — tier emitted directly as condition state)
```

**CS-004 pre-filter:** Rows classified as CS-004 (STRUCTURAL_GAP) do not participate
in aggregation. They must be surfaced as governance errors before row evaluation proceeds.
If any row for a condition is CS-004, the aggregation for that condition cannot be
treated as fully governed — the structural gap must be resolved.

---

## 4. AGGREGATION PATTERNS (GOVERNED)

### Pattern A — Single row

One binding table row for a condition. No aggregation required.
The single tier contribution is the condition tier.

```
contributions = { tier_1 }
condition_tier = tier_1
```

**CE.2-R01-MIX baseline:** All 8 conditions have one binding row. Pattern A applies
to all 8 conditions in the baseline.

---

### Pattern B — Severity dominance (AT_RISK > STABLE)

Two or more binding rows. One contributes AT_RISK, others contribute STABLE.
DEC-009 max-tier: AT_RISK wins.

```
contributions = { AT_RISK, STABLE }
condition_tier = AT_RISK   // max-tier selection
```

**Validated:** QA.2 Pattern A (COND-001: SIG-002→AT_RISK, SIG-004→STABLE → AT_RISK).

---

### Pattern C — Hard dominance (BLOCKED > AT_RISK)

Two or more binding rows. One contributes BLOCKED, others contribute non-BLOCKED.
DEC-009 max-tier: BLOCKED wins.

```
contributions = { BLOCKED, AT_RISK }
condition_tier = BLOCKED   // max-tier selection
```

**Validated:** QA.2 Pattern B (COND-007: SIG-007→AT_RISK, SIG-003→BLOCKED → BLOCKED).

---

### Pattern D — No escalation (STABLE + STABLE)

Two or more binding rows, all contributing STABLE.
DEC-009 max-tier: STABLE (no escalation from identical contributions).

```
contributions = { STABLE, STABLE }
condition_tier = STABLE   // max-tier — no escalation
```

**Validated:** QA.2 Pattern C (COND-003: SIG-001→STABLE, SIG-008→STABLE → STABLE).

---

### Pattern E — Shared signal, multiple conditions (fan-out)

One signal appears in binding rows for multiple conditions. Each condition evaluates
the shared signal independently. There is no shared state between conditions evaluating
the same signal.

```
condition_A:  consume SIG-002.dependency_load_ratio → tier_A
condition_B:  consume SIG-002.dependency_load_ratio → tier_B   // independent of tier_A
```

**Validated:** QA.4 (COND-001 and COND-007 both evaluate SIG-002 independently).
No cross-condition coupling. No shared intermediate state. Each condition's aggregation
is fully isolated.

---

## 5. CE.5 AGGREGATION RULES

### Rule AG-001 — Independent row evaluation

Each binding table row is evaluated independently per SC-001..SC-006.
No row may observe or reference the tier contribution of another row
before DEC-009 aggregation. Row evaluation order has no semantic meaning.

### Rule AG-002 — Per-condition aggregation scope

Tier contributions are pooled per condition only. A tier contribution produced
by a binding row for condition A cannot participate in aggregation for condition B.

### Rule AG-003 — DEC-009 as the sole aggregation mechanism

DEC-009 max-tier resolution (BLOCKED > DEGRADED > AT_RISK > STABLE) is the only
governed aggregation mechanism. The following are prohibited:
- Averaging tier ranks
- Weighted tier combination
- Counting BLOCKED vs AT_RISK for escalation
- Any aggregation method not equivalent to max-tier selection from the ordered hierarchy

### Rule AG-004 — Single winner, no ties

The DEC-009 tier hierarchy is strict. Equal tiers do not escalate (Pattern D).
There is no tie-breaking beyond the hierarchy — if two rows produce AT_RISK,
the result is AT_RISK, not BLOCKED.

### Rule AG-005 — COMPLETE tier vocabulary

Only the four governed CE.2 tiers participate in aggregation:
`BLOCKED | DEGRADED | AT_RISK | STABLE`

CS-004 STRUCTURAL_GAP rows do not contribute a tier. They are pre-filtered governance
errors. They do not resolve to BLOCKED or any other tier.

### Rule AG-006 — Condition state emission

After DEC-009 aggregation, the resulting tier is emitted directly as
`condition_coverage_state` per CE.2 DEC-011. No intermediate mapping layer.
No transformation from tier vocabulary to a different state vocabulary.

---

## 6. MULTI-SIGNAL SCOPE STATEMENT

CE.5 governs the consumption side of multi-signal scenarios:
- How binding rows feed tier contributions into DEC-009
- What aggregation behaviors are prohibited
- How fan-out across conditions is isolated

CE.5 does not redefine DEC-009's resolution algorithm. CE.2 DEC-009 is authoritative.
CE.5 is the upstream boundary statement for that algorithm.

---

## 7. CONCLUSION

Multi-signal aggregation under CE.5 is:
- Per-condition scoped (DEC-006)
- Independently evaluated per row (DEC-010)
- Resolved by DEC-009 max-tier only
- Isolated across conditions sharing the same signal (QA.4 validated)

Six aggregation rules are defined (AG-001..AG-006). Four patterns are governed and
validated (A through E). The aggregation model is complete and deterministic.
