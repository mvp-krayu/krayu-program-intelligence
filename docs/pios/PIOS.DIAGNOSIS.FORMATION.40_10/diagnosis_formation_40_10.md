# PIOS.DIAGNOSIS.FORMATION.40_10 — CANONICAL DEFINITION

---

## 1. POSITION AND AUTHORITY

40.10 is the first lawful diagnosis formation layer.

40.10 is subordinate to:
- ≤40.4 structural truth
- PSEE.PROMOTION.GATE.01 promotion admissibility
- 40.5 governed consumption envelope
- 40.6 signal extraction definition
- 40.6R deterministic extraction rule authority
- 40.7 governed condition formation
- 40.8 governed interpretation boundary
- 40.9 governed intelligence formation

40.10 does not supersede, reinterpret, or extend any upstream definition.

40.10 operates exclusively on lawful 40.9 intelligence outputs.
40.10 may not reach back to interpretation objects, condition objects, signal objects, or structural artifacts.
40.10 does not elevate intelligence into decision.
40.10 does not elevate diagnosis into action.

---

## 2. PURPOSE OF 40.10

40.10 defines the first lawful boundary at which governed diagnosis may be formed.

The purpose of 40.10 is:

- to permit governed characterization of structural system state derived from intelligence outputs
- to define what constitutes a lawful, lineage-backed diagnosis
- to enforce a hard boundary between diagnosis and prioritization, decision, or action
- to preserve constraint propagation across the intelligence-to-diagnosis transition

40.10 does NOT:

- transform diagnosis into recommendation
- transform diagnosis into priority
- transform diagnosis into decision
- transform diagnosis into action
- introduce certainty not present in intelligence inputs
- resolve constraints not resolvable at 40.9

A diagnosis at 40.10 is a governed characterization of system state.
It is not a declaration of what must be done.

---

## 3. WHAT CONSTITUTES LAWFUL DIAGNOSIS

A diagnosis at 40.10 is lawful if and only if:

1. It is derived exclusively from one or more lawful `intelligence_object_40_9` emissions with `intelligence_status = lawful_formation`
2. Its characterization of system state is fully derivable from the intelligence object's declared fields
3. It introduces no semantic content not present in the intelligence object's schema
4. It carries full lineage traceability to the intelligence object and through it to upstream layers
5. All constraint flags from the intelligence object are propagated intact
6. The certainty_status of the diagnosis does not exceed the certainty_status of the intelligence input
7. Any causal framing is strictly bounded to lineage-derivable relationships
8. It is governed by a declared diagnosis rule prior to formation
9. It is deterministic: identical intelligence inputs under identical diagnosis rule yield identical diagnosis output
10. It contains no forbidden fields

A diagnosis that fails any of these conditions is unlawful and must not exist.

---

## 4. MINIMUM LAWFUL DIAGNOSIS

The minimum lawful diagnosis at 40.10 is:

A governed record that a lawful diagnosis formation occurred over a lawful intelligence object.

Minimum required content:
- `diagnosis_id` — deterministically derived
- `intelligence_id` — reference to source intelligence object
- `diagnosis_rule_id` — governing rule, declared prior to formation
- `diagnosis_type` — rule-bound classification
- `diagnosis_statement` — minimal characterization of system state, non-narrative
- `causal_basis_refs` — lineage-backed only
- `constraint_flags` — propagated unchanged
- `certainty_status` — propagated, not elevated
- `admissibility_status` — lawful_formation | fail_closed
- `determinism_hash` — supports identical-input/identical-output governance

No additional fields are required for a minimum lawful diagnosis.
Optional fields (`severity_level`, `risk_indicator`) are lawful only if rule-bound and derivable.

---

## 5. DIAGNOSIS ADMISSIBILITY BOUNDARY

A diagnosis formation output is admissible IF AND ONLY IF:

1. The source `intelligence_object_40_9` has `intelligence_status = lawful_formation`
2. The governing `diagnosis_rule_id` is declared prior to formation
3. The `diagnosis_statement` is fully derivable from intelligence object fields
4. All `constraint_flags` from the intelligence object propagate unchanged to the diagnosis
5. `certainty_status` in the diagnosis does not exceed `certainty_status` in the intelligence input
6. `causal_basis_refs` reference only lineage elements present in the intelligence object
7. No forbidden field is present
8. The diagnosis is deterministic: identical input under identical rule → identical output
9. No upstream object is accessed directly, bypassing 40.9

If any condition fails → FAIL CLOSED. No diagnosis object may be formed.

---

## 6. FORBIDDEN DIAGNOSIS

The following are explicitly forbidden at 40.10:

**Semantic content forbidden:**
- recommendations
- actions
- prescriptions
- remediations
- routing instructions
- ownership assignments
- accountability assignments
- escalation commands
- execution instructions

**Structural reasoning forbidden:**
- causal speculation beyond lineage-bounded derivation
- severity inferred without explicit rule binding
- risk inferred without explicit rule binding
- prioritization of any kind
- comparative ranking across diagnosis objects unless explicitly rule-defined
- certainty elevation above intelligence certainty_status

**Constraint handling forbidden:**
- overlap resolution
- unknown-space resolution
- suppression of constraint flags
- downgrading of constraint flags
- masking of constraint flags
- asserting structural completeness when `unknown_space_present = true`
- asserting structural identity when `overlap_present = true`

**Escalation forbidden:**
- any behavior that anticipates, enables, or pre-computes 40.11+ behavior
- converting diagnosis into priority automatically
- converting diagnosis into decision automatically

Any diagnosis output that contains forbidden content — regardless of label or framing — is unlawful.

---

## 7. RELATIONSHIP TO INTELLIGENCE LINEAGE

A diagnosis at 40.10 is derived from intelligence objects, not from raw upstream artifacts.

The relationship is:

```
intelligence_object_40_9
  ↓ governed by diagnosis_rule
diagnosis_object_40_10
```

40.10 does NOT have a direct relationship to:
- interpretation_ref_40_8 (accessed only through intelligence_object fields)
- condition_object_40_7 (not accessible at 40.10)
- signal_object_40_6 (not accessible at 40.10)
- ≤40.4 artifacts (not accessible at 40.10)

The `causal_basis_refs` field in the diagnosis object references elements of the intelligence object's `lineage_refs` — it does not reach back to upstream objects directly.

Lineage traceback (for audit purposes only) follows:
`diagnosis_id → intelligence_id → interpretation_refs → condition_ref → signal_refs → lineage_ref`

This traceback path is for lineage audit only. No upstream object may be accessed at formation time.

---

## 8. CONSTRAINT PROPAGATION RULES

Constraint flags propagate from intelligence input to diagnosis output without alteration.

Rules:

1. `overlap_present = true` in intelligence input → `overlap_present = true` in diagnosis output
2. `unknown_space_present = true` in intelligence input → `unknown_space_present = true` in diagnosis output
3. `certainty_status = constrained` in intelligence input → `certainty_status = constrained` in diagnosis output

Diagnosis MUST NOT:
- resolve overlap
- resolve unknown-space
- mask any constraint flag
- downgrade any constraint flag
- suppress any constraint flag
- assert completeness when `unknown_space_present = true`
- assert identity when `overlap_present = true`

A diagnosis with `overlap_present = true` cannot assert structural identity.
A diagnosis with `unknown_space_present = true` cannot assert completeness.
A diagnosis with `certainty_status = constrained` cannot assert certainty.

Constraint propagation failure → FAIL CLOSED immediately.

---

## 9. CERTAINTY GOVERNANCE

The certainty of a diagnosis may not exceed the certainty of its source intelligence object.

Rules:

1. `certainty_status` is propagated from the intelligence object — it is not re-derived at 40.10
2. A diagnosis formed from `certainty_status = constrained` intelligence must carry `certainty_status = constrained`
3. No diagnosis rule may elevate `certainty_status` from `constrained` to `unconstrained`
4. No diagnosis rule may assert certainty where constraint flags are present
5. Diagnosis statements must not use language that implies certainty beyond what certainty_status permits

A constrained diagnosis acknowledges explicitly that its characterization is bounded by the unresolved state propagated from upstream.

Certainty elevation is unlawful and triggers fail-closed.

---

## 10. CONTROLLED CAUSALITY RULES

A diagnosis may express causal framing only under these conditions:

1. The causal relationship is fully derivable from `lineage_refs` in the intelligence object
2. The diagnosis rule explicitly declares the causal basis
3. The causal claim does not exceed what the intelligence `pattern_basis` and `relation_type` declare
4. The causal claim does not introduce speculative root cause not present in lineage
5. The causal claim is recorded in `causal_basis_refs` as a reference to lineage elements, not as a freeform assertion

Forbidden causal framing:
- "X caused Y" when X is not in lineage_refs
- "the root cause is..." when root cause is not derivable from declared intelligence fields
- hypothetical causation
- inferred causation beyond lineage
- probabilistic causation (unless explicitly encoded in diagnosis rule and derivable from intelligence fields)

A diagnosis that requires causal framing not supported by lineage → FAIL CLOSED.

---

## 11. SEVERITY EXPRESSION RULES

Severity at 40.10 is OPTIONAL. If expressed, the following rules apply without exception:

**Lawful severity expression requires:**
1. An explicit `diagnosis_rule_id` that declares the severity classification scheme
2. `severity_level` derivable from intelligence object fields under that rule
3. Non-comparative severity expression, unless the rule explicitly defines comparison basis
4. No implication of priority ordering from severity
5. No escalation command embedded in severity assignment
6. Propagated constraint flags apply — a `constrained` certainty_status limits severity assertion

**Forbidden in severity expression:**
- comparative ranking without explicit rule basis
- priority assignment derived from severity
- action prescription derived from severity
- certainty assertion that exceeds intelligence certainty

If severity cannot be proven lawful under these rules → omit `severity_level`. Do not emit an unlawful value.

---

## 12. RISK EXPRESSION RULES

Risk at 40.10 is OPTIONAL. If expressed, the following rules apply without exception:

**Lawful risk expression requires:**
1. An explicit `diagnosis_rule_id` that declares the risk classification scheme
2. `risk_indicator` derivable from intelligence object fields under that rule
3. Non-actionable risk expression — risk is a characterization, not a trigger
4. No routing decision embedded in risk expression
5. No recommendation derived from risk expression
6. No decision pressure created by risk expression
7. Propagated constraint flags apply — a `constrained` certainty_status limits risk assertion

**Forbidden in risk expression:**
- actionable risk (risk that prescribes response)
- risk that becomes routing
- risk that becomes decision pressure
- risk that becomes recommendation
- risk comparative ranking without explicit rule basis

If risk cannot be proven lawful under these rules → omit `risk_indicator`. Do not emit an unlawful value.

---

## 13. FAIL-CLOSED RULES

If diagnosis admissibility cannot be proven, no diagnosis object exists.

FAIL CLOSED if:

| Condition | Trigger |
|-----------|---------|
| Source not a lawful 40.9 emission | intelligence_id does not resolve to lawful intelligence_object_40_9 |
| intelligence_status ≠ lawful_formation | source intelligence object is fail_closed or absent |
| Diagnosis rule not declared | no governing diagnosis_rule_id declared prior to formation |
| Lineage incomplete | causal_basis_refs reference elements not in intelligence lineage_refs |
| Constraint flag not propagated | overlap_present or unknown_space_present absent when required |
| Certainty elevated | certainty_status in diagnosis exceeds certainty_status of intelligence input |
| Forbidden field present | any field from forbidden list appears in diagnosis object |
| diagnosis_statement not derivable | statement contains content not derivable from intelligence fields |
| Non-deterministic variance | identical inputs produce different diagnosis output |
| Upstream artifact accessed directly | formation bypasses 40.9 intelligence layer |
| Schema non-conformance | required field absent or invalid |
| Severity rule violation | severity_level emitted without explicit rule binding |
| Risk rule violation | risk_indicator emitted without explicit rule binding |

On fail-closed: do not emit diagnosis object. Emit `fail_closed_record` only.

---

## 14. DETERMINISM REQUIREMENTS

1. Identical lawful intelligence inputs under identical diagnosis rules produce identical diagnosis outputs
2. No stochastic behavior
3. No hidden reasoning
4. No context injection beyond declared intelligence object fields
5. No external semantic dependency
6. Diagnosis rule execution is idempotent: executing the same rule against the same intelligence input any number of times produces the same diagnosis object
7. `determinism_hash` must be derivable from intelligence_id + diagnosis_rule_id alone
8. Non-deterministic variance in diagnosis output is unlawful — trigger fail-closed immediately

---

## 15. BOUNDARY TO PRIORITIZATION

40.10 is not a prioritization layer and cannot become one.

Explicit prohibitions at the 40.10/prioritization boundary:

- 40.10 MUST NOT rank diagnosis objects against one another as a default behavior
- 40.10 MUST NOT emit priority scores
- 40.10 MUST NOT emit urgency markers
- 40.10 MUST NOT create ordering semantics across diagnosis outputs
- 40.10 MUST NOT convert severity into priority automatically
- 40.10 MUST NOT convert risk_indicator into work prioritization

A diagnosis is a characterization of state — not an ordering of response.

The prioritization boundary is hard:

40.10 = governed diagnosis formation
40.11 = future prioritization (out of scope at 40.10)

---

## 16. BOUNDARY TO DECISION

40.10 is not a decision layer and cannot become one.

Explicit prohibitions at the 40.10/decision boundary:

- 40.10 MUST NOT produce action recommendations
- 40.10 MUST NOT produce remediation prescriptions
- 40.10 MUST NOT produce routing decisions
- 40.10 MUST NOT produce ownership assignments
- 40.10 MUST NOT produce escalation commands
- 40.10 MUST NOT convert diagnosis into a trigger for downstream execution

A governed diagnosis object is not actionable by definition.
It is a governed record of what is characterizable at this layer — not of what must be done about it.

The decision boundary is hard:

40.10 = governed diagnosis formation
Decision = future layer (out of scope at 40.10)

---

## 17. NON-ACTION GUARANTEE

40.10 guarantees non-actionability.

A diagnosis object at 40.10:
- describes system state only
- does not prescribe what to do
- does not imply what must be done
- does not create obligation
- does not create urgency beyond what certainty_status and constraint_flags express
- does not create routing
- does not create ownership

Any diagnosis object that functions as a call to action — regardless of how it is labeled — is unlawful.

This guarantee is absolute and non-negotiable at this layer.

---

## 18. DIAGNOSIS OBJECT SCHEMA

Minimal schema. No fields beyond what is strictly defined here.

```
diagnosis_object_40_10:
  diagnosis_id          — deterministic derivation from diagnosis_rule_id + intelligence_id
  intelligence_id       — reference to source intelligence_object_40_9
  diagnosis_rule_id     — identifier of the governing diagnosis rule (declared prior to formation)
  diagnosis_type        — rule-bound classification of diagnosis category
  diagnosis_statement   — minimal characterization of system state (non-narrative, lineage-backed)
  causal_basis_refs     — subset of lineage_refs from source intelligence object (lineage-backed only)
  constraint_flags:
    overlap_present     — propagated unchanged from intelligence input
    unknown_space_present — propagated unchanged from intelligence input
  certainty_status      — propagated from intelligence input (not elevated)
  severity_level        — OPTIONAL; rule-bound only; omit if rule cannot be proven
  risk_indicator        — OPTIONAL; rule-bound only; omit if rule cannot be proven
  admissibility_status  — lawful_formation | fail_closed
  determinism_hash      — deterministic derivation from intelligence_id + diagnosis_rule_id
```

**FORBIDDEN FIELDS — inclusion of any triggers HARD FAIL:**

- recommendation
- action
- priority
- owner
- accountability
- remediation
- routing
- decision_flag
- escalation_command
- urgency_marker
- work_item_ref

---

## 19. VALIDATION CONDITIONS

A diagnosis object passes validation if and only if:

**Schema validation:**
- All required fields are present and non-null
- No forbidden fields are present
- `admissibility_status` is a lawful value (lawful_formation | fail_closed)
- `certainty_status` is a lawful value (constrained | unconstrained)
- `determinism_hash` is present and derivable

**Boundary validation:**
- `intelligence_id` resolves to a lawful `intelligence_object_40_9` with `intelligence_status = lawful_formation`
- `diagnosis_rule_id` is declared in a governed artifact prior to formation
- `causal_basis_refs` are a strict subset of `lineage_refs` from the source intelligence object
- `constraint_flags` match those of the source intelligence object (no suppression, no elevation)
- `certainty_status` does not exceed source intelligence `certainty_status`

**Governance validation:**
- `diagnosis_statement` contains no forbidden semantics (no recommendation, no action, no priority)
- `severity_level` if present: rule-bound, non-comparative unless rule-declared, no priority embedding
- `risk_indicator` if present: rule-bound, non-actionable, no decision pressure

Any validation failure → diagnosis object is invalid. Do not emit.

---

## 20. INVARIANTS

The following invariants hold at 40.10 at all times:

1. **Subordination invariant** — A diagnosis object never has higher authority than its source intelligence object
2. **Constraint invariant** — No constraint flag from upstream is ever removed, suppressed, or downgraded at this layer
3. **Certainty invariant** — No diagnosis object asserts more certainty than its source intelligence object
4. **Lineage invariant** — Every diagnosis object is fully traceable to its source intelligence object
5. **Non-action invariant** — No diagnosis object contains, implies, or enables action
6. **Determinism invariant** — Identical intelligence input + identical diagnosis rule = identical diagnosis output
7. **Fail-closed invariant** — No diagnosis object exists for which admissibility cannot be proven
8. **Schema invariant** — No diagnosis object contains a forbidden field
9. **Causality invariant** — No causal claim exists in a diagnosis that is not bounded to intelligence lineage
10. **Non-escalation invariant** — No diagnosis object anticipates, enables, or pre-computes 40.11+ behavior

---

## 21. LAWFUL EXAMPLES

**Example A — Single-intelligence single-diagnosis (no severity)**

```
intelligence_object_40_9:
  intelligence_id: INT-001
  relation_type: co_present_signals
  pattern_basis: "DOM-02 and DOM-04 share structural containment path with overlap_present"
  certainty_status: constrained
  constraint_flags: { overlap_present: true, unknown_space_present: false }

→ diagnosis_object_40_10:
  diagnosis_id: DX-001
  intelligence_id: INT-001
  diagnosis_rule_id: DR-CO-01
  diagnosis_type: structural_overlap_condition
  diagnosis_statement: "co-present structural overlap condition present at containment boundary"
  causal_basis_refs: [INT-001.lineage_refs[0]]
  constraint_flags: { overlap_present: true, unknown_space_present: false }
  certainty_status: constrained
  admissibility_status: lawful_formation
  determinism_hash: hash(INT-001 + DR-CO-01)
```

This is lawful because:
- source intelligence is a lawful 40.9 emission
- diagnosis_statement is minimal and derivable
- constraint flags propagate unchanged
- certainty_status propagates unchanged
- no forbidden fields present
- no severity or risk emitted (not rule-bound in this example)

---

**Example B — Single-intelligence diagnosis with rule-bound severity**

```
intelligence_object_40_9:
  intelligence_id: INT-002
  relation_type: unknown_space_pattern
  pattern_basis: "DOM-05 containment path references unknown-space USP-03"
  certainty_status: constrained
  constraint_flags: { overlap_present: false, unknown_space_present: true }

→ diagnosis_object_40_10:
  diagnosis_id: DX-002
  intelligence_id: INT-002
  diagnosis_rule_id: DR-USP-01
  diagnosis_type: unknown_space_condition
  diagnosis_statement: "unknown-space condition present at DOM-05 containment boundary"
  causal_basis_refs: [INT-002.lineage_refs[1]]
  constraint_flags: { overlap_present: false, unknown_space_present: true }
  certainty_status: constrained
  severity_level: PARTIAL_OBSERVABLE   ← rule-bound per DR-USP-01
  admissibility_status: lawful_formation
  determinism_hash: hash(INT-002 + DR-USP-01)
```

This is lawful because:
- severity_level is rule-bound to DR-USP-01
- severity is derivable from intelligence fields
- severity does not imply priority
- certainty_status is not elevated despite severity assignment

---

## 22. FORBIDDEN EXAMPLES

**Forbidden Example A — Action embedding**

```
diagnosis_object_40_10:
  diagnosis_id: DX-ERR-001
  ...
  diagnosis_statement: "overlap condition at DOM-02 boundary — engineering team should review"
  recommendation: "schedule overlap resolution sprint"    ← FORBIDDEN FIELD
  action: "open ticket in backlog"                        ← FORBIDDEN FIELD
```

This is unlawful because:
- diagnosis_statement contains action prescription ("should review")
- forbidden fields `recommendation` and `action` are present
- HARD FAIL

---

**Forbidden Example B — Certainty elevation**

```
diagnosis_object_40_10:
  intelligence_id: INT-003   ← intelligence has certainty_status: constrained
  certainty_status: unconstrained   ← FORBIDDEN elevation
  diagnosis_statement: "confirmed overlap condition at boundary"   ← "confirmed" asserts certainty
```

This is unlawful because:
- `certainty_status` was elevated from `constrained` to `unconstrained`
- diagnosis_statement uses "confirmed" — a certainty assertion exceeding intelligence certainty
- HARD FAIL

---

**Forbidden Example C — Speculative causality**

```
diagnosis_object_40_10:
  causal_basis_refs: ["DOM-02 overlap was caused by incorrect file routing during ingestion"]
```

This is unlawful because:
- causal_basis_refs must be lineage element references, not freeform causal assertions
- "caused by incorrect file routing during ingestion" is speculative root cause beyond lineage
- HARD FAIL

---

**Forbidden Example D — Priority embedding**

```
diagnosis_object_40_10:
  severity_level: CRITICAL
  priority: P1                  ← FORBIDDEN FIELD
  diagnosis_statement: "this condition must be resolved before next release"   ← prescriptive
```

This is unlawful because:
- `priority` is a forbidden field
- diagnosis_statement contains execution prescription
- HARD FAIL

---

## ARCHITECTURAL SEQUENCE

```
≤40.4  — validated structural truth formation
40.5   — governed consumption envelope
40.6   — governed signal extraction
40.6R  — deterministic extraction rule authority
40.7   — governed condition formation
40.8   — governed interpretation boundary
40.9   — governed intelligence formation
40.10  — governed diagnosis formation          ← THIS LAYER
40.11+ — future prioritization / decision / action (out of scope)
```

---

## FINAL RULE

Diagnosis may begin at 40.10.

Priority may not exist at 40.10.
Decision may not exist at 40.10.
Action may not exist at 40.10.
Certainty may not be elevated at 40.10.

40.10 is the boundary at which governed intelligence outputs become characterizable as diagnosed system state — not the boundary at which they become actionable, prioritized, or authoritative beyond what their upstream chain permits.

A governed diagnosis object at 40.10 is the minimal record that a lawful diagnosis formation occurred over a lawful intelligence object.

It carries no authority beyond what its source intelligence object declares.
It carries no action semantics.
It carries no decision semantics.

Diagnosis formed at 40.10 is the record of a governed characterization — nothing more.
