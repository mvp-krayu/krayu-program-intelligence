# CE.9 — Binding Rule Authority Decision

**Stream:** CE.9 — Tier Derivation Authority & Scope Clarification
**Artifact type:** AUTHORITY DECISION (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.9
**Answers:** Q1 — canonical authority for DEC-012 / DEC-013

---

## QUESTION ADDRESSED

Which artifact(s) are the canonical authority for DEC-012 / DEC-013 binding rules?

---

## AUTHORITY ANALYSIS

### Layer 1 — Schema and requirements authority

**Authoritative artifact:**
`docs/pios/CE.2/traceability/ce2_decision_ledger.md`

This document defines:

- **DEC-012**: The binding surface schema — governed table with deterministic key
  `(condition_id, signal_id, signal_field, binding_rule_id)` and `tier_contribution` field.
  Constraints: deterministic evaluation, signal-local interpretation, no row-order semantics,
  explicit rule reference, alignment with DEC-009 tier hierarchy.

- **DEC-013**: The binding rule class requirements — every `binding_rule_id` MUST resolve to
  a governed, value-reactive rule definition specifying at minimum:
  `binding_rule_id`, `signal_field`, `evaluation_type`, `evaluation_logic`, `output_tier`, `null_handling`.
  Static tier assignment without value evaluation is INVALID.

This is the sole canonical authority for the schema and requirements that any CE.10 implementation
must satisfy. It is an active, non-superseded governance document (Status: ACTIVE — authoritative baseline).

---

### Layer 2 — Instantiated binding surface

**Finding: NO STANDALONE GOVERNED ARTIFACT EXISTS.**

A corpus search of `docs/pios/CE.2/` and all CE.2 run artifacts confirms:

- No file in `docs/pios/CE.2/` contains a populated DEC-012 binding table as a standalone
  governance document.
- No file contains governed binding rule definitions (per DEC-013 minimum specification) as
  standalone authoritative artifacts.

The following artifacts reference binding rule IDs by name but are NOT authoritative:

| Artifact | Binding rule references | Classification |
|---|---|---|
| `docs/pios/CE.2/validation/QA.2_MULTI_SIGNAL_CONFLICT_VALIDATION.md` | BR-DEP-LOAD-RATIO-001, BR-EDGE-DENSITY-001, BR-STRUCTURAL-RATIO-001, BR-COORD-PRESSURE-001, BR-THROUGHPUT-RATE-001, BR-HEALTH-DEP-COMP-001, BR-NULL-SIGNAL-BLOCKED | NON-AUTHORITATIVE (test artifact) — explicitly self-classified |
| `docs/pios/CE.2/validation/QA.3_PROPAGATION_INTEGRITY_VALIDATION.md` | BR-NULL-SIGNAL-BLOCKED | NON-AUTHORITATIVE (test artifact) — explicitly self-classified |
| `docs/pios/CE.2/validation/QA.4_SHARED_SIGNAL_FANOUT_VALIDATION.md` | BR-DEP-LOAD-RATIO-001 | NON-AUTHORITATIVE (test artifact) — explicitly self-classified |
| `docs/pios/CE.4/dependency_propagation_rules.md` | BR-NULL-SIGNAL-BLOCKED (cross-reference only) | CE.4 governance — governs 40.5, not 40.6 binding surface |

The QA artifacts demonstrate binding rule evaluations and confirm system behavior under CE.2 governance.
They are not authoritative sources for the governed binding rule definitions required by DEC-013.
They do not carry the minimum DEC-013 specification fields (`evaluation_type`, `evaluation_logic`,
`output_tier`, `null_handling`) as standalone artifact records.

---

### Layer 3 — Rejected candidates

**CE.2-R01-MIX run artifacts** (`runs/pios/ce2/CE.2-R01-MIX/`): REJECTED.
This run used the v0.1 engine with hardcoded condition states (CE2-FINDING-001 confirmed).
It predates CE.2 binding rule implementation. No binding rule content is present.

**CE.2 scope_definition.md and traceability_requirements.md**: REJECTED.
Both are explicitly header-only with "population pending" status. They carry no binding rule content.

**QA script implementations** (`scripts/qa2_multi_signal_conflict.py`, etc.): REJECTED.
Implementation code is not a governance artifact. DEC-013 requires governed rule definition
artifacts, not script logic.

---

## GOVERNANCE GAP FINDING

**GAP-A-001 (CE.9 finding):** No governed binding rule definition artifacts exist in the CE.2
governance corpus. The binding rules referenced in QA artifacts (BR-DEP-LOAD-RATIO-001,
BR-EDGE-DENSITY-001, BR-STRUCTURAL-RATIO-001, BR-COORD-PRESSURE-001, BR-THROUGHPUT-RATE-001,
BR-HEALTH-DEP-COMP-001, BR-NULL-SIGNAL-BLOCKED) are not formalized as standalone governed
documents satisfying DEC-013 minimum specification.

**GAP-A-002 (CE.9 finding):** No populated DEC-012 binding surface table exists as a standalone
governed artifact. The 8-row baseline binding table and its extensions (11-row QA.2, etc.) are
present only in non-authoritative QA run artifacts.

**Consequence:** CE.10 cannot implement tier derivation by referencing existing artifacts alone.
CE.10 MUST produce:
1. Governed binding rule definition artifacts (one per BR-* rule ID) satisfying DEC-013
2. Instantiated DEC-012 binding surface table as a standalone governed artifact

---

## DECISION

**Q1 ANSWER:**

| Layer | Authoritative artifact | Status |
|---|---|---|
| Schema / requirements (DEC-012, DEC-013) | `docs/pios/CE.2/traceability/ce2_decision_ledger.md` | EXISTS — authoritative |
| Instantiated binding surface (DEC-012 rows) | None | ABSENT — must be produced by CE.10 |
| Governed binding rule definitions (DEC-013) | None | ABSENT — must be produced by CE.10 |

CE.10 may not treat QA validation artifacts as authoritative sources for binding rule implementation.
CE.10 must produce governed binding rule artifacts before implementing tier derivation.
