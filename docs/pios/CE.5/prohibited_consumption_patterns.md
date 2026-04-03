# CE.5 — Prohibited Consumption Patterns

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** PROHIBITION CATALOG (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.5 consumption rules SC-001..SC-006, CI-001..CI-007, PR-001..PR-007,
  CE.4 violation patterns from `signal_emission_surface_assessment.md`,
  CE.2 DEC-001..DEC-014
**Authority:** CE.5

---

## 1. PURPOSE

This document catalogs consumption behaviors that are explicitly prohibited in PiOS v0.3.
Each prohibition is stated precisely — what the pattern is, why it is prohibited, and
what the correct behavior is.

A consumption pattern is prohibited if it:
- Violates a CE.5 consumption rule (SC-001..SC-006)
- Violates a CE.5 consumption invariant (CI-001..CI-007)
- Violates a CE.5 propagation rule (PR-001..PR-007)
- Would silently corrupt condition state, causal traceability, or downstream governance

---

## 2. PROHIBITED PATTERNS CATALOG

---

### PC-001 — Evaluating a null field against a BASELINE_THRESHOLD binding rule

**Pattern:**
```
value = signal.output["some_field"]   // returns null (PARTIAL or BLOCKED signal)
tier  = binding_rule.evaluate(value)  // null passed to threshold comparator
// often results in: 0.0 <= threshold → STABLE (silent zero substitution)
```

**Prohibited because:**
- Null is not a numeric value. A threshold comparison against null is not governed.
- Silent null-to-zero substitution produces a STABLE tier that masks a real blockage.
- Violates CI-001 (must not evaluate against null except via BR-NULL-SIGNAL-BLOCKED).
- Violates PR-003 (no suppression of BLOCKED tier).

**Correct behavior:** SC-003 or SC-004 — detect null, apply BR-NULL-SIGNAL-BLOCKED, emit BLOCKED.

---

### PC-002 — Defaulting a missing signal to STABLE

**Pattern:**
```
if signal_id NOT IN packet:
    tier = STABLE   // "absent signal = no risk"
```

**Prohibited because:**
- A missing signal is a CS-004 STRUCTURAL_GAP, not a governed zero-signal-risk state.
- Defaulting to STABLE suppresses detection of a governance error.
- Violates SC-006 (missing signal → CS-004, not a tier contribution).
- Violates PR-003 (suppression prohibited) — STABLE here is worse than BLOCKED; it erases even the error.

**Correct behavior:** SC-006 — classify as CS-004, surface governance error, do not produce tier.

---

### PC-003 — Defaulting a missing signal to BLOCKED

**Pattern:**
```
if signal_id NOT IN packet:
    tier = BLOCKED  // "absent signal = maximum risk"
```

**Prohibited because:**
- A missing signal is a binding table error, not a BLOCKED emission from a governed signal.
- Treating CS-004 as CS-003 conflates governance error with governed signal blockage.
- Masks the structural gap behind a valid tier contribution, preventing governance resolution.
- Violates SC-006 and CI-007.

**Correct behavior:** SC-006 — CS-004, surface governance error. Do not produce any tier.

---

### PC-004 — Using CE.4 `blocking_class` to route binding rules

**Pattern:**
```
if signal.blocking_class == "F-2":
    tier = BLOCKED
elif signal.blocking_class == "F-1a":
    tier = AT_RISK   // "might resolve in live context"
```

**Prohibited because:**
- `blocking_class` is a CE.4 traceability field. It identifies the cause of blockage for 40.5 governance.
- 40.6 MUST NOT use CE.4 metadata as a routing input for tier assignment.
- A BLOCKED signal produces CS-003 → tier=BLOCKED regardless of `blocking_class`.
- Violates CI-002 (must not consume partiality_reasons, blocking_class, etc.).
- Violates DI-004 (CE.4 metadata not a downstream input).

**Correct behavior:** SC-004 — BLOCKED signal → BR-NULL-SIGNAL-BLOCKED → tier=BLOCKED.

---

### PC-005 — Using CE.4 `partiality_reasons` to determine tier

**Pattern:**
```
if null_field.partiality_reasons["failure_class"] == "F-3":
    tier = BLOCKED
elif null_field.partiality_reasons["failure_class"] == "F-1b":
    tier = AT_RISK  // "contextually pending, not hard-blocked"
```

**Prohibited because:**
- `partiality_reasons` explains why a field is null. It does not determine what 40.6 should do.
- 40.6 behavior for null fields is fully determined by SC-003: apply BR-NULL-SIGNAL-BLOCKED.
- Distinguishing F-3 from F-1b at the tier-assignment level is a CE.5-SCOPE-VIOLATION —
  it would require 40.6 to reinterpret emission semantics, which is CE.4's domain.
- Violates CI-002, DI-004, PR-005.

**Correct behavior:** SC-003 — null field in PARTIAL signal → BR-NULL-SIGNAL-BLOCKED → tier=BLOCKED.

---

### PC-006 — Aggregating tiers by count rather than max-tier

**Pattern:**
```
# "majority rule" or "count-based" aggregation
at_risk_count  = count(tier == "AT_RISK")
blocked_count  = count(tier == "BLOCKED")
if at_risk_count > blocked_count:
    condition_state = "AT_RISK"
```

**Prohibited because:**
- CE.2 DEC-009 defines max-tier as the only governed resolution mechanism.
- Count-based aggregation allows a single BLOCKED to be overridden by multiple AT_RISK contributions.
- This would permit a multi-signal condition with 1 BLOCKED + 3 AT_RISK to resolve to AT_RISK,
  suppressing a BLOCKED signal.
- Violates AG-003 (DEC-009 max-tier sole aggregation mechanism), PR-003 (no suppression), PR-006.

**Correct behavior:** AG-003 — max-tier(TIER_ORDER). BLOCKED(3) > AT_RISK(1) → BLOCKED wins.

---

### PC-007 — Propagating signal emission state as condition attribute

**Pattern:**
```
# "signal is PARTIAL, so condition is AT_RISK"
if signal.state == "PARTIAL":
    condition_coverage_state = "AT_RISK"
```

**Prohibited because:**
- Condition state is derived from binding rule evaluation of field values, not from signal-level state.
- A PARTIAL signal with a resolved field that evaluates to STABLE under its binding rule
  should produce condition_tier=STABLE, not AT_RISK.
- Violates CE.2 DEC-001 (condition state from signal outputs only), DI-005.

**Correct behavior:** SC-002 — if field is resolved, evaluate binding rule. Tier from rule evaluation.

---

### PC-008 — Treating the same binding row twice for shared-signal fan-out

**Pattern:**
```
# Optimizing shared signal evaluation: evaluate signal once, assign result to all conditions
shared_tier = evaluate(SIG-002, "dependency_load_ratio")
for condition in [COND-001, COND-007]:
    condition.tier_from_SIG002 = shared_tier
```

**Prohibited because:**
- This is identical in behavior to SC-001 applied independently to each row — and it may appear
  equivalent. However, if this optimization shares intermediate state, it risks coupling evaluation
  across conditions.
- QA.4 validated that COND-001 and COND-007 evaluate SIG-002 independently with no shared state.
- Any optimization that pools intermediate state across conditions violates CE.2 DEC-006 and AG-002.

**Correct behavior:** AG-001 — each binding table row evaluated independently. Fan-out isolation is mandatory.

**Note:** If the optimization is purely read-only (extract once, use in separate evaluations with
no shared mutable state), it may be permissible as an implementation detail. The prohibition is
on shared mutable intermediate state, not on caching read values.

---

### PC-009 — Introducing a new tier value from CE.4 metadata

**Pattern:**
```
if signal.state == "PARTIAL":
    tier = "PARTIALLY_BLOCKED"   // new synthesized tier
elif signal.state == "BLOCKED" and signal.blocking_class == "F-2":
    tier = "PERMANENTLY_BLOCKED"
```

**Prohibited because:**
- The governed CE.2 tier vocabulary is closed: BLOCKED, DEGRADED, AT_RISK, STABLE.
- Introducing new tier values from CE.4 state or metadata creates ungoverned condition states.
- These would propagate to 40.7 DEC-014 mapping which has no mapping for new tier values.
- Violates PR-006 (no synthetic states), CI-006 (tier from governed vocabulary only), CE.2 DEC-011.

**Correct behavior:** All consumption outcomes resolve to one of {BLOCKED, DEGRADED, AT_RISK, STABLE}.

---

### PC-010 — Silent degradation of BLOCKED to STABLE between 40.5 and 40.6

**Pattern:**
```
# Engineering workaround: "don't penalize conditions for missing signals"
if signal.output is None:
    tier = "STABLE"   # avoid blocking conditions while signals are being developed
```

**Prohibited because:**
- A BLOCKED signal must produce tier=BLOCKED in all binding rows that reference it.
- Substituting STABLE for BLOCKED is causal inversion — it asserts low risk where the
  governed contract asserts unresolvability.
- Violates PR-003 (no suppression), PR-004 (no causal inversion), DI-001.
- This is the most consequential violation category: it produces false-STABLE conditions
  that propagate as INACTIVE diagnoses and NO_ACTION directives, masking real blockages.

**Correct behavior:** SC-004 — BLOCKED signal → BR-NULL-SIGNAL-BLOCKED → tier=BLOCKED.

---

### PC-011 — Consuming `note` field as a governed partiality reason

**Pattern:**
```
# Reading legacy SIG-007 / SIG-008 note fields as if they were partiality_reasons
reason = signal.get("note", "")
if "BLOCKED" in reason:
    tier = BLOCKED
```

**Prohibited because:**
- The `note` field is a prohibited CE.4 field (see CE.4 emission contract Section 3.3).
- In PiOS v0.3, `note` must not appear in compliant signal payloads.
- Consuming `note` as a routing input is doubly prohibited: it reads a prohibited field
  AND uses CE.4 metadata for tier routing.
- Violates CE.4 prohibition on `note` field, CI-002, PC-005 logic.

**Correct behavior:** In a CE.4-compliant packet, `note` does not exist. Use signal.state
and field-level null detection per SC-001..SC-004.

---

## 3. SUMMARY TABLE

| Code | Pattern | Violation | Correct rule |
|---|---|---|---|
| PC-001 | Null field passed to BASELINE_THRESHOLD rule | CI-001, PR-003 | SC-003/SC-004 |
| PC-002 | Missing signal → STABLE default | SC-006, CI-007 | SC-006 → CS-004 |
| PC-003 | Missing signal → BLOCKED default | SC-006, CI-007 | SC-006 → CS-004 |
| PC-004 | blocking_class used for tier routing | CI-002, DI-004 | SC-004 |
| PC-005 | partiality_reasons failure_class used for tier | CI-002, DI-004 | SC-003 |
| PC-006 | Count-based tier aggregation | AG-003, PR-003 | DEC-009 max-tier |
| PC-007 | Signal emission state as condition attribute | DEC-001, DI-005 | SC-002 |
| PC-008 | Shared mutable state across fan-out rows | DEC-006, AG-002 | AG-001 independent |
| PC-009 | New tier from CE.4 metadata | PR-006, DEC-011 | Governed vocab only |
| PC-010 | BLOCKED → STABLE silent degradation | PR-003, PR-004 | SC-004 → BLOCKED |
| PC-011 | `note` field consumed as routing input | CE.4, CI-002 | SC-001..SC-004 |

---

## 4. CONCLUSION

Eleven prohibited consumption patterns are cataloged (PC-001..PC-011).

The highest-severity prohibition is PC-010 (silent BLOCKED→STABLE degradation), which
produces false-negative governance directives at 40.10.

The second-highest severity is PC-004 and PC-005 (CE.4 metadata used for tier routing),
which introduces CE.5-SCOPE-VIOLATIONS by importing emission semantics into consumption logic.

All other prohibitions (PC-001..PC-003, PC-006..PC-009, PC-011) prevent correctness
violations, governance errors, or legacy-pattern persistence.
