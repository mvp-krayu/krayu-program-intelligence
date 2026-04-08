# PIOS.SIGNAL.EXTRACTION.RULES.40_6R — CANONICAL DEFINITION

---

## 1. POSITION AND AUTHORITY

40.6R is the deterministic rule-definition authority for lawful 40.6 signal derivation.

40.6R does not construct signals.
40.6R defines the rules under which signals may be constructed.

40.6R is subordinate to:
- ≤40.4 structural truth
- PSEE.PROMOTION.GATE.01 promotion admissibility
- 40.5 governed consumption envelope
- 40.6 signal extraction definition

40.6R does not supersede, reinterpret, or extend any upstream definition.

---

## 2. RULE ADMISSIBILITY CONDITIONS

A 40.6R rule is admissible IF AND ONLY IF:

1. It is bound to a frozen lawful 40.5 input class
2. It is bound to a declared field within that class
3. It produces output conforming exactly to the 40.6 signal object schema
4. It is deterministic: identical input under identical rule yields identical output
5. It introduces no semantic fields not present in the input
6. It introduces no identifier mutations
7. It does not aggregate multiple extraction outputs into a higher-order construct
8. It does not infer from absent fields
9. It does not resolve overlap
10. It does not resolve unknown-space
11. It preserves lineage to the 40.5 consumption payload from which it operates
12. It carries constraint flags when operating on fields touched by OVL-* or USP-*

A rule that fails any condition is unlawful and must not be executed.

---

## 3. CANONICAL RULE OBJECT SCHEMA

```
rule_object_40_6R:
  rule_id                     — unique identifier for this rule
  rule_family                 — declared family (see §4)
  input_class                 — one of: ceu_registry | domain_structure |
                                structural_topology | html_influence_map
  input_field                 — specific field within input_class
  output_schema               — signal_object_40_6 (ref: 40.6 §4)
  determinism_basis           — field_presence | field_value | containment_match
  constraint_binding:
    overlap_ids               — OVL-* IDs that constrain this rule's output, if any
    unknown_space_ids         — USP-* IDs that constrain this rule's output, if any
  lineage_ref                 — reference to 40.5 consumption lineage
  admissibility_status        — lawful | unlawful | blocked_by_constraint
  fail_closed_trigger         — condition under which rule must fail closed
```

---

## 4. LAWFUL RULE FAMILIES

Five families are defined. No other families are lawful at 40.6R.

---

### RF-01 — CEU Presence Signal

**Operates on:** `ceu_registry`

**Eligible fields:**
- `ceu_id`
- `intake_status`
- `source_origin`
- `structural_topology_source`
- `documented_taxonomy_source`

**Derivation basis:** For each CEU entry where `intake_status = ACCEPTED`, emit one signal object recording CEU presence, its source_origin, and its structural/taxonomy provenance split.

**Constraint binding:**
- If CEU carries `overlap_id`: set `constraint_flags.overlap_present = true`
- If CEU carries `unknown_space_id`: set `constraint_flags.unknown_space_present = true`

**Output:** one `signal_object_40_6` per accepted CEU

**Determinism basis:** `field_presence` — CEU exists or does not

**Forbidden extensions:**
- No grouping of CEUs by label meaning
- No inference about CEU relationships not declared in source

---

### RF-02 — Domain Membership Signal

**Operates on:** `domain_structure`

**Eligible fields:**
- `domain_id`
- `ceu_members` (list)
- `source_origin`
- `structural_topology_source`
- `documented_taxonomy_source`
- `label_provenance`

**Derivation basis:** For each domain, emit one signal per CEU listed in `ceu_members`, recording the containment relationship. Each signal carries the domain's `source_origin` and provenance split.

**Constraint binding:**
- If domain carries `overlap_id` or a member CEU carries `overlap_id`: set `constraint_flags.overlap_present = true`
- If domain or member carries `unknown_space_id`: set `constraint_flags.unknown_space_present = true`

**Output:** one `signal_object_40_6` per domain × CEU membership pair

**Determinism basis:** `containment_match` — membership is declared or not

**Forbidden extensions:**
- No inference about domain function or purpose
- No grouping of domains by label meaning
- No sub-domain aggregation into domain-level signals

---

### RF-03 — Structural Path Signal

**Operates on:** `structural_topology`

**Eligible fields:**
- `domain_id`
- `ceus` (list)
- `source_origin`
- `structural_topology_source`
- `documented_taxonomy_source`
- `sub_domains` (if present — iterate only, no interpretation)

**Derivation basis:** For each domain in structural_topology, emit one signal per CEU in `ceus`, recording the topology-layer path assignment. If sub_domains are present, emit one additional signal per sub_domain entry (not per sub_domain's contents — positional record only).

**Constraint binding:**
- If domain or referenced CEU carries overlap or unknown-space references: set corresponding constraint flags

**Output:** one `signal_object_40_6` per topology domain × CEU entry; one per sub_domain entry if present

**Determinism basis:** `field_presence` — topology entry exists or does not

**Forbidden extensions:**
- No interpretation of what a domain or sub-domain means
- No path merging or aggregation
- No structural inference beyond declared containment

---

### RF-04 — HTML Influence Signal

**Operates on:** `html_influence_map`

**Eligible fields:**
- `element_id`
- `html_influence` (DIRECT | INDIRECT | NONE)
- `html_source_ceus` (list)
- `domain_id` (reference, where declared)
- `sub_domain_ids` (reference, where declared)

**Derivation basis:** For each entry in html_influence_map, emit one signal recording the influence classification for that element. If `html_source_ceus` is non-empty, record each referenced CEU as a participating provenance reference. If `html_influence = NONE`, emit the signal with empty provenance_ref.

**Constraint binding:**
- This rule family operates on classification only — no overlap or unknown-space constraint binding applies unless the referenced domain carries OVL-* or USP-* references

**Output:** one `signal_object_40_6` per html_influence_map entry

**Determinism basis:** `field_value` — influence value is DIRECT, INDIRECT, or NONE

**Forbidden extensions:**
- No inference about what HTML influence means for system behavior
- No semantic elevation of DIRECT influence into architectural truth
- No aggregation of HTML influence signals into taxonomy claims

---

### RF-05 — Unresolved-State Constraint Signal

**Operates on:** `overlap_registry` + `unknown_space_registry` (constraint source only — not signal sources)

**Eligible fields:**
- `overlap_id`, `file_level_parity`, `resolution_status`, `must_remain_unresolved` (from overlap_registry)
- `usp_id`, `resolution_status`, `inference_applied` (from unknown_space_registry)

**Derivation basis:** For each OVL-* entry, emit one constraint signal recording the unresolved overlap state. For each USP-* entry, emit one constraint signal recording the permanently unresolved unknown-space state. These are NOT positive signals about structure — they are negative-space markers that constrain all RF-01 through RF-04 outputs touching the same identifiers.

**Output:** one `signal_object_40_6` per OVL-* entry; one per USP-* entry
- `emission_status` for these signals MUST be `constraint_marker` (not `positive_extraction`)

**Determinism basis:** `field_presence` — entry exists or does not

**Forbidden extensions:**
- No resolution of any entry
- No inference about what parity or resolution would mean
- No conversion of constraint signals into positive structural claims

---

## 5. ELIGIBLE EVALUATION INPUTS BY FAMILY

| Rule Family | Input Class | Constraint Source |
|-------------|-------------|-------------------|
| RF-01 | ceu_registry | overlap_registry, unknown_space_registry |
| RF-02 | domain_structure | overlap_registry, unknown_space_registry |
| RF-03 | structural_topology | overlap_registry, unknown_space_registry |
| RF-04 | html_influence_map | overlap_registry (conditional) |
| RF-05 | overlap_registry, unknown_space_registry | (self-constraining) |

---

## 6. LAWFUL PARTICIPATING FIELDS

Only the following fields from each input class may participate in rule evaluation:

**ceu_registry:**
`ceu_id`, `intake_status`, `source_origin`, `structural_topology_source`, `documented_taxonomy_source`

**domain_structure:**
`domain_id`, `ceu_members`, `source_origin`, `structural_topology_source`, `documented_taxonomy_source`, `label_provenance`

**structural_topology:**
`domain_id`, `ceus`, `source_origin`, `structural_topology_source`, `documented_taxonomy_source`, `sub_domains` (positional only)

**html_influence_map:**
`element_id`, `html_influence`, `html_source_ceus`, `domain_id`, `sub_domain_ids`

**overlap_registry:**
`overlap_id`, `file_level_parity`, `resolution_status`, `must_remain_unresolved`

**unknown_space_registry:**
`usp_id`, `resolution_status`, `inference_applied`

All other fields in any input class are non-participating. Rules may not reference non-participating fields.

---

## 7. UNRESOLVED-STATE CONSTRAINT RULES

Rule behavior in the presence of OVL-* or USP-*:

1. A rule operating on a CEU or domain that carries an overlap reference MUST set `constraint_flags.overlap_present = true` on its output signal
2. A rule operating on a CEU or domain that carries an unknown-space reference MUST set `constraint_flags.unknown_space_present = true` on its output signal
3. A signal with `overlap_present = true` is valid but constrained — it cannot be used as proof of structural identity with its overlapping counterpart
4. A signal with `unknown_space_present = true` is valid but constrained — it cannot be used to assert completeness or closed-world truth about its domain
5. Constraint flags must be preserved in all downstream references to the signal
6. No rule may suppress or clear constraint flags

---

## 8. RULE-TO-SIGNAL BINDING

Each rule execution produces exactly one `signal_object_40_6` per unit of input evaluated (per CEU, per membership pair, per topology entry, per influence entry, per constraint entry). Binding rules:

| signal_object field | Bound from |
|--------------------|------------|
| `signal_id` | rule_id + input unit identifier (deterministic concatenation) |
| `source_ref` | input unit identifier (e.g. ceu_id, domain_id, element_id) |
| `source_type` | input_class of the rule |
| `structural_ref` | structural path or containment reference from input |
| `extraction_rule_id` | rule_id |
| `lineage_ref` | 40.5 consumption lineage reference |
| `provenance_ref` | source_origin value from input element |
| `constraint_flags` | derived per §7 |
| `emission_status` | positive_extraction (RF-01–04) or constraint_marker (RF-05) |

No field may be populated by inference.
No field may be left null where a binding exists.

---

## 9. EXECUTION DETERMINISM REQUIREMENTS

1. Rule execution MUST be idempotent: executing the same rule against the same input any number of times produces the same output
2. Rule execution order within a family MUST NOT affect output
3. Rule execution across families MUST NOT affect output
4. No rule may consult state outside its declared input class
5. No rule may write to its input class
6. No rule may produce different output based on execution sequence or timing
7. Non-deterministic output from any rule is an unlawful execution — trigger fail-closed immediately

---

## 10. FAIL-CLOSED CONDITIONS

A rule execution MUST fail closed if:

| Condition | Trigger |
|-----------|---------|
| Input class not present | Input file absent or empty |
| Required participating field absent | Field not present in input element |
| Input schema deviates from 40.5 envelope schema | Field names or types do not match |
| Constraint flag suppression detected | overlap_present or unknown_space_present not set when required |
| Output does not conform to signal_object_40_6 schema | Any required output field missing or invalid |
| Non-deterministic variance detected | Same input produces different output across executions |
| Rule references non-participating field | Field not in eligible list for its family |
| Rule aggregates across multiple input units | Multi-unit aggregation attempted |
| Rule introduces a field not in the binding table | Non-traceable field appears in output |
| Lineage reference absent | lineage_ref not populated |

On fail-closed: halt rule execution, emit `fail_closed_record`, do not emit partial signal output.

---

## 11. BASELINE-PRESERVATION RULE

40.6R is valid only while the following conditions hold:

1. All upstream stream artifacts remain at their committed HEAD state
2. No upstream artifact has been modified since the HEAD at which 40.6R was defined
3. The 40.6 signal object schema has not changed
4. The 40.5 consumption envelope schema has not changed
5. The PSEE.PROMOTION.GATE.01 admissibility rules have not changed

If any upstream state changes, 40.6R must be re-evaluated for continued validity before any rule execution proceeds.

40.6R does not itself trigger re-validation of upstream streams.
40.6R inherits the upstream authority it operates under and cannot exceed it.

---

## FINAL RULE

40.6R defines the deterministic boundary of what can be extracted from admitted structural truth.

It is not a constructor of meaning.
It is not a generator of intelligence.
It is the governed rule-definition authority that keeps 40.6 signal extraction deterministic, traceable, and bounded.
