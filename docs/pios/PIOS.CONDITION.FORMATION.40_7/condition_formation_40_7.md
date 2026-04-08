# PIOS.CONDITION.FORMATION.40_7 — CANONICAL DEFINITION

---

## 1. POSITION AND AUTHORITY

40.7 is the first lawful condition formation layer.

40.7 is subordinate to:
- ≤40.4 structural truth
- PSEE.PROMOTION.GATE.01 promotion admissibility
- 40.5 governed consumption envelope
- 40.6 signal extraction definition
- 40.6R deterministic extraction rule authority

40.7 does not supersede, reinterpret, or extend any upstream definition.

---

## 2. CONDITION NATURE

A condition at 40.7 is:

→ a governed formation over one or more lawful 40.6 signal objects

A condition at 40.7 is NOT:

→ a reconstructed truth
→ a semantic interpretation
→ a diagnostic unit
→ an intelligence object
→ a prioritization marker
→ a narrative claim
→ an architectural judgment

The condition object is the minimal record that a lawful formation occurred.
It carries no meaning beyond what its constituent signals declare.

---

## 3. FORMATION ADMISSIBILITY RULES

A condition formation is lawful IF AND ONLY IF:

1. All constituent signal objects are lawful 40.6 emissions
2. All constituent signals reference the same upstream 40.5 consumption lineage
3. The formation is governed by a declared formation rule
4. The formation is deterministic: identical signal inputs under identical rule yield identical condition
5. No semantic fields are introduced that are absent from constituent signals
6. No signal identity is mutated in the formation
7. Constraint flags from constituent signals are propagated to the condition object
8. No overlap is resolved in the formation
9. No unknown-space is resolved in the formation
10. Full lineage to constituent signals is preserved
11. No ≥40.8 behavior is present
12. No cross-layer contamination exists

A formation that fails any condition is unlawful and must not exist.

---

## 4. CANONICAL CONDITION OBJECT SCHEMA

Minimal schema only. No fields beyond what is strictly required.

```
condition_object_40_7:
  condition_id          — unique identifier (deterministic derivation from formation_rule_id + signal_refs)
  formation_rule_id     — identifier of the governing formation rule
  signal_refs           — ordered list of constituent signal_object_40_6 IDs
  source_origin_refs    — union of source_origin values from constituent signals (no deduplication inference)
  constraint_flags:
    overlap_present     — true if any constituent signal carries overlap_present = true
    unknown_space_present — true if any constituent signal carries unknown_space_present = true
  lineage_ref           — 40.5 consumption lineage inherited from constituent signals
  formation_status      — lawful_formation | blocked | fail_closed
```

No additional fields are lawful at 40.7.

---

## 5. ALLOWED FORMATION INPUTS

Condition formation at 40.7 operates ONLY on:

- lawful `signal_object_40_6` emissions from 40.6

The following are NOT direct formation inputs and may only be referenced through constituent signals:

- ceu_registry
- domain_structure
- structural_topology
- html_influence_map
- overlap_registry
- unknown_space_registry

Formation rules may not reach back to raw upstream artifacts.
Formation rules operate on the signal layer only.

---

## 6. LAWFUL FORMATION PATTERNS

Three formation patterns are lawful at 40.7. No other patterns are lawful.

---

### FP-01 — Single-Signal Condition

**Basis:** One lawful signal object becomes one condition object.

**When lawful:** When a formation rule declares that a single signal's presence constitutes a governed condition.

**Constraint propagation:** Condition inherits all constraint flags from the signal directly.

**Lineage:** Condition references the single signal's lineage_ref.

**Determinism basis:** `signal_presence` — signal exists or does not.

**Forbidden extensions:**
- No inference about why the signal exists
- No assignment of priority or severity
- No semantic label beyond signal identity

---

### FP-02 — Co-Presence Condition

**Basis:** Two or more lawful signal objects, when structurally co-present under a declared rule, form one condition object.

**When lawful:** When a formation rule declares a specific set of signal types (by source_type and source_ref pattern) must all be present for the condition to form.

**Co-presence basis:** structural co-presence only — same domain_id, same ceu_id, or same containment path as declared in the rule. NOT semantic similarity. NOT label proximity.

**Constraint propagation:** Condition inherits the union of constraint flags from all constituent signals. Any `overlap_present = true` or `unknown_space_present = true` in any constituent signal sets the corresponding flag on the condition.

**Lineage:** Condition references all constituent signal lineage_refs as a list.

**Determinism basis:** `containment_match` — all required signals co-present under declared structural predicate.

**Forbidden extensions:**
- No grouping by inferred meaning
- No cross-domain aggregation not declared in the rule
- No partial co-presence inference (all required signals must be present or condition does not form)

---

### FP-03 — Constraint-Presence Condition

**Basis:** One or more lawful constraint-marker signals (RF-05 emissions, `emission_status = constraint_marker`) produce a condition recording that an unresolved state is present at a specified structural position.

**When lawful:** When a formation rule declares that the presence of an OVL-* or USP-* constraint signal at a structural position constitutes a governed condition.

**Formation output:** condition_object_40_7 with `formation_status = lawful_formation` and both constraint flags set as applicable.

**Determinism basis:** `signal_presence` — constraint marker signal exists or does not.

**Forbidden extensions:**
- No resolution of the underlying overlap or unknown-space
- No inference about what the constraint means
- No scoring or severity assignment

---

## 7. UNRESOLVED-STATE CONSTRAINT RULES

1. A condition formed from signals that carry `overlap_present = true` MUST propagate `overlap_present = true` to the condition object
2. A condition formed from signals that carry `unknown_space_present = true` MUST propagate `unknown_space_present = true` to the condition object
3. A condition with `overlap_present = true` is valid but constrained — it cannot be used as proof of structural completeness
4. A condition with `unknown_space_present = true` is valid but constrained — it cannot be used to assert closed-world truth
5. Constraint flags must be preserved in all downstream references to the condition
6. No formation rule may suppress or clear constraint flags

---

## 8. SIGNAL LINEAGE PRESERVATION

All of the following must be preserved across the formation boundary:

- `signal_id` references in `signal_refs`
- `source_origin_refs` (union, not collapsed)
- `lineage_ref` (inherited from constituent signals; list form for FP-02)
- `constraint_flags` (propagated per §7)
- `extraction_rule_id` (reachable via signal_refs — not duplicated in condition object)

Loss of any lineage element from a constituent signal renders the formation unlawful.

---

## 9. DETERMINISM REQUIREMENTS

1. Formation MUST be idempotent: executing the same formation rule against the same signal inputs any number of times produces the same condition object
2. Formation order across FP-01/FP-02/FP-03 patterns MUST NOT affect individual condition outputs
3. No formation rule may consult state outside its declared signal inputs
4. No formation rule may write to its signal inputs
5. Formation must not produce different outputs based on execution sequence or timing
6. Non-deterministic variance in condition formation is unlawful — trigger fail-closed immediately

---

## 10. FORMATION RULES DEFINITION REQUIREMENT

No condition may be formed unless a governing formation rule is declared prior to formation.

A formation rule must specify:
- `formation_rule_id`
- `pattern` (FP-01, FP-02, or FP-03)
- `required_signal_types` (by source_type and source_ref predicate)
- `structural_predicate` (containment scope for FP-02)
- `constraint_binding` (OVL-* and USP-* IDs applicable)
- `lineage_authority` (reference to 40.6 and 40.6R)

Formation rules must be declared in a governed artifact prior to execution.
No ad-hoc formation is lawful.

---

## 11. FAIL-CLOSED CONDITIONS

A condition formation MUST fail closed if:

| Condition | Trigger |
|-----------|---------|
| Constituent signal not a lawful 40.6 emission | signal_id does not resolve to a lawful signal object |
| Lineage mismatch across constituent signals | signals reference different 40.5 consumption lineage IDs |
| Formation rule not declared | no governing formation_rule_id exists prior to formation |
| Pattern constraint not satisfied | FP-02 requires co-presence not achieved |
| Constraint flag suppression detected | overlap_present or unknown_space_present not propagated when required |
| Condition object does not conform to schema | any required field missing or invalid |
| Non-deterministic variance detected | same inputs produce different condition across executions |
| Semantic field introduced | any field not derivable from constituent signals appears in output |
| Lineage element lost | any signal lineage reference absent from condition object |

On fail-closed: do not emit condition object. Emit `fail_closed_record` only.

---

## 12. BASELINE-PRESERVATION RULE

40.7 is valid only while the following conditions hold:

1. All upstream stream artifacts remain at their committed HEAD state
2. The 40.6 signal object schema has not changed
3. The 40.6R rule families and admissibility conditions have not changed
4. The 40.5 consumption envelope schema has not changed
5. The PSEE.PROMOTION.GATE.01 admissibility rules have not changed

If any upstream state changes, 40.7 must be re-evaluated for continued validity before any formation proceeds.

40.7 does not itself trigger re-validation of upstream streams.
40.7 inherits the upstream authority it operates under and cannot exceed it.

---

## FINAL RULE

40.7 forms governed conditions over lawful signals.

It does not assign meaning to those conditions.
It does not prescribe action.
It does not synthesize intelligence.

A condition at 40.7 is the minimal structural record that a lawful formation occurred — nothing more.
