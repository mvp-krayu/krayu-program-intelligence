# PMO ENGINE STUB — Hypothetical PMO Vocabulary/Rules Outline

Stream: PI.DOMAIN-COGNITION-ENGINE-PATTERN.01 | Classification: G1 | Branch: main

---

## STATUS: NOT IMPLEMENTED — EVIDENCE PENDING

This document demonstrates that the Domain Cognition Engine pattern can express a PMO Domain Module without building one. Every item below is hypothetical. No code exists. No runtime evidence exists. No signals, no conditions, no consequences. This stub proves PATTERN GENERALITY, not PMO capability.

---

## 1. What PMO Would Provide

A PMO Domain Module would provide VOCABULARY and RULES to the shared ENGINE. It would NOT build a new compiler, a new persona projection system, or a new combination detection mechanism.

| Provided by PMO | Consumed from ENGINE |
|---|---|
| PMO condition types | `makeAtomic()` |
| PMO consequence types | `deduplicateConsequences()` |
| PMO combination patterns | `detectCombinations()` |
| PMO ontology classes | `makeCombination()` |
| PMO risk shape labels | `compile()` |
| PMO feature extraction rules | `deriveRelationshipVerb()` |
| PMO condition synthesis rules | `forBoardroom()` shape |
| PMO consequence mapping rules | `forBalanced()` shape |
| PMO guided interventions | `forOperator()` shape |
| PMO cognition slice names | `forInvestigation()` shape |

---

## 2. Hypothetical PMO VOCABULARY

### 2.1 Condition Types (~6)

| ID | Hypothetical Class | What It Would Describe |
|---|---|---|
| DELIVERY_VELOCITY_DECLINE | A (Flow) | Sustained decrease in delivery throughput across a workstream |
| SCOPE_CREEP_PRESSURE | B (Concentration) | Progressive scope expansion without proportional resource adjustment |
| RESOURCE_CONCENTRATION | B (Concentration) | Disproportionate resource load on a single workstream or team |
| DEPENDENCY_CHAIN_ELONGATION | C (Fragility) | Growing transitive dependency depth between deliverables |
| MILESTONE_DRIFT_PATTERN | D (Accumulation) | Progressive rightward drift of milestone completion dates |
| SCHEDULE_COMPRESSION_EXPOSURE | A (Flow) | Shrinking buffer between dependent deliverables |

### 2.2 Consequence Types (~4)

| ID | Label | What It Would Describe |
|---|---|---|
| SCHEDULE_EXPOSURE | Schedule risk exposure | Delivery timeline carries elevated structural risk |
| RESOURCE_BOTTLENECK | Resource throughput ceiling | Structural ceiling on parallel execution capacity |
| COORDINATION_OVERHEAD | Coordination cost amplification | Cross-workstream coordination cost exceeds proportionality |
| SCOPE_INSTABILITY | Scope boundary instability | Scope boundary does not match delivery reality |

### 2.3 Combination Patterns (~2)

| ID | What It Would Detect |
|---|---|
| VELOCITY_TRAP | Velocity decline + resource concentration at same workstream — adding people does not help |
| SCOPE_PRESSURE_WELL | Scope creep + schedule compression at same deliverable — pressure compounds |

### 2.4 Ontology Classes (~4)

| Class | Name | Class Question |
|---|---|---|
| A | Velocity & Throughput | Where is delivery velocity structurally constrained? |
| B | Capacity & Concentration | Where is resource load creating single points of dependency? |
| C | Schedule & Dependency | Where are delivery dependencies elongating critical path? |
| D | Scope & Change | Where is scope change undermining schedule predictability? |

---

## 3. Hypothetical PMO RULES

### 3.1 Evidence Sources

PMO conditions would derive from different evidence than SW-Intel:

| SW-Intel Evidence | PMO Evidence (Hypothetical) |
|---|---|
| Import graph topology | Workstream dependency graph |
| Signal families (PSIG, DPSIG, ISIG) | Program signals (schedule, resource, scope metrics) |
| Structural enrichment (fragility, constriction) | Program enrichment (velocity trends, milestone history) |
| Pressure zone state | Workstream pressure zones |
| Semantic domain registry | Program domain registry (workstreams, teams, deliverables) |

### 3.2 Rule Shape

Each PMO rule engine would follow the same shape as SW-Intel rules:

```javascript
function ruleDeliveryVelocityDecline(taggedSignals, programState, registry) {
  // Filter signals with velocity_decline feature
  // Resolve workstream domain
  // Produce condition object with:
  //   condition_type: 'DELIVERY_VELOCITY_DECLINE'
  //   severity: from evidence
  //   governance_boundary: from evidence classification
  //   topology_overlay: { emphasis_workstreams, dim_workstreams }
  //   guided_interventions: from PMO_CONDITION_INTERVENTIONS
  //   derivation_trace: signal → condition path
}
```

This is the SAME shape as `ruleDeliveryPressureConcentration` in SignalSynthesisEngine. Different vocabulary. Same structural contract.

---

## 4. What The Engine Would Produce for PMO

### 4.1 forBoardroom() — PMO projection

Same SHAPE as SW-Intel, different CONTENT:

```
{
  posture_label: "Program execution pressure",
  cognition_slices: [
    { executive_name: "Delivery Slowdown", domain: "Payments Workstream", ... },
    { executive_name: "Resource Bottleneck", domain: "Platform Workstream", ... },
  ],
  domain_concentration: [
    { domain: "Payments Workstream", weight: 0.6, consequence_types: ["SCHEDULE_EXPOSURE", "RESOURCE_BOTTLENECK"] },
  ],
  domain_narratives: [...],
  executive_synthesis: "...",
}
```

### 4.2 forBalanced() — PMO projection

Same SHAPE:

```
{
  primary_story: {
    title: "Schedule Risk Exposure",
    source_conditions: [{ condition_type: "DELIVERY_VELOCITY_DECLINE", display_title: "Delivery Slowdown" }],
  },
  reinforcement_flow: [
    { relationship_verb: "amplifies", relationship_sentence: "Resource bottleneck compounds schedule exposure on Payments." },
  ],
  ontology_groups: [
    { class_id: "A", class_name: "Velocity & Throughput", conditions: [...] },
  ],
}
```

### 4.3 Same 5 Relationship Verbs

PMO consequences would receive the same verbs from `deriveRelationshipVerb()`:

- Schedule exposure **widens** to Platform workstream (different locus)
- Resource bottleneck **amplifies** schedule exposure on Payments (same locus, combination)
- Coordination overhead **reinforces** schedule exposure on Payments (same locus, same scope)
- Scope instability **converges with** schedule exposure on Payments (same locus, broader scope)

The verbs describe structural dynamics — not domain semantics.

---

## 5. What This Proves

1. **The ENGINE PATTERN generalizes.** A PMO module would plug into the same `compile()` → `deduplicateConsequences()` → `detectCombinations()` → `forBoardroom()` pipeline with zero engine modification.

2. **The vocabulary shapes are domain-independent.** Condition nodes, consequence nodes, combination patterns, ontology classes — the SHAPE of each vocabulary component is the same across SW-Intel and PMO. Only the CONTENT changes.

3. **The persona projections are reusable.** `forBoardroom()` compresses any domain's cognition into executive objects. `forBalanced()` produces causal narrative for any domain. The shapes are stable — the vocabulary fills them.

4. **No PMO-specific engine code is needed.** The entire PMO module would be: vocabulary definitions + rule functions + signal integration. The compilation, deduplication, combination detection, risk profiling, and persona projection machinery is inherited from the shared engine.

---

## 6. What This Does NOT Prove

- That PMO signal families exist or are defined
- That PMO evidence sources are available
- That PMO conditions are correct or complete
- That the vocabulary sizes are right (6 conditions may be too few or too many)
- That PMO ontology classes map correctly to PMO phenomena
- That the engine handles PMO-specific edge cases

These are implementation questions. This stub proves the PATTERN can express PMO — not that PMO is ready to build.
