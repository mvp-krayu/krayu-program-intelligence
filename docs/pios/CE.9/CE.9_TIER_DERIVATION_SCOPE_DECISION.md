# CE.9 — Tier Derivation Scope Decision

**Stream:** CE.9 — Tier Derivation Authority & Scope Clarification
**Artifact type:** SCOPE DECISION (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.9
**Answers:** Q2 — evaluation unit for DEC-009

---

## QUESTION ADDRESSED

Is DEC-009 tier derivation governed as:
- per-condition-instance evaluation
- aggregate max-tier across conditions
- another formally provable unit?

---

## GOVERNING RULES

The following CE.2 decisions are directly relevant, in dependency order:

**DEC-006:** "Condition state resolution is condition-local and may only use declared relevant signals."
Implication: No cross-condition input. No cross-condition aggregation.

**DEC-010:** "Each signal relevant to condition activation must bind through an explicit, deterministic,
signal-local rule to exactly one governed tier contribution, which is then used by the ordered
precedence model to resolve the final condition state."
Implication: Tier contributions are per-condition. The precedence model resolves within a single
condition's contribution set, not across conditions.

**DEC-009:** "State resolution across tiers is determined by selecting the highest severity tier
present among the evaluated signal contributions."
The phrase "evaluated signal contributions" refers to the contributions declared for a specific
condition (per DEC-006 and DEC-010 — condition-local scope). "Among" means within the set
belonging to that condition.

---

## VALIDATION EVIDENCE (NON-AUTHORITATIVE, CONFIRMATORY)

QA.2 (Multi-Signal Conflict Validation) — Section 4: "TIER CONTRIBUTIONS (PER CONDITION)"

The table lists each condition with its own contributions column, evaluated independently:
```
COND-001: SIG-002 → AT_RISK, SIG-004 → STABLE  → max-tier = AT_RISK
COND-007: SIG-007 → AT_RISK, SIG-003 → BLOCKED  → max-tier = BLOCKED
```

QA.2 Section 5 resolution logic: `max(contributions, key=TIER_ORDER)` — applied per-condition,
not across conditions. COND-001 resolves to AT_RISK independently of COND-007 resolving to BLOCKED.

QA.4 (Shared-Signal Fan-Out Validation) — Section 12 full trace:
"COND-001 and COND-007 resolved independently under the same rule. No shared state. No cross-condition propagation."

Both COND-001 and COND-007 are governed by the same rule (BR-DEP-LOAD-RATIO-001) applied to the same
signal field (SIG-002.dependency_load_ratio). They resolve to the same tier (STABLE) independently.
No shared intermediate state. No aggregation across conditions.

---

## REJECTION OF ALTERNATIVE INTERPRETATIONS

### Alternative A: Aggregate max-tier across all conditions

**INVALID.** DEC-006 explicitly prohibits cross-condition state input: "Cross-condition state
contamination is forbidden." An aggregate max-tier across conditions would require each condition
to observe the tier contributions of other conditions — a direct violation of DEC-006.

### Alternative B: Per-signal evaluation (signal as the resolution unit)

**INVALID.** DEC-005 requires "each condition must resolve to exactly one state for any valid
relevant signal set." DEC-010 requires the ordered precedence model to operate on tier contributions
associated with a specific condition. A signal-level resolution unit would produce tier outputs
detached from condition context, violating the condition-local guarantee of DEC-006.

### Alternative C: Per-condition-class evaluation (all instances of same condition type share state)

**INVALID.** No DEC supports this. DEC-003 (replay invariance) requires that the same signal
set always produces the same state for the same condition. This is a per-condition-instance
guarantee. DEC-006 is condition-local — each condition evaluates its own declared signals.

---

## DECISION

**Q2 ANSWER: DEC-009 tier derivation is governed as per-condition-instance evaluation.**

**Formal definition of evaluation unit:**

For each condition instance C:
1. Collect all binding rows where `condition_id = C.condition_id` from the DEC-012 binding surface
2. For each row, evaluate the binding rule (DEC-013) against the declared `signal_field` value
3. Each row produces exactly one tier contribution ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE}
4. Apply DEC-009: `condition_tier = max(tier_contributions, key=TIER_ORDER)`
   where `TIER_ORDER = {BLOCKED: 3, DEGRADED: 2, AT_RISK: 1, STABLE: 0}`
5. C.condition_coverage_state = condition_tier (per DEC-011)

**Evaluation scope constraint:**
- Tier contribution collection is bounded by `condition_id` — no contribution from another condition
  may enter the max-tier computation for C
- No condition state at any tier may influence the tier derivation of another condition
- Each condition instance resolves to exactly one tier independently of all other conditions

**Implication for CE.10:**
`activate_diag()` receives a condition object whose `condition_coverage_state` was resolved
by per-condition-instance DEC-009 evaluation. No cross-condition aggregation logic is required
or permitted in `activate_diag()` or its callers.
