# ENGINE PATTERN — Domain Cognition Engine

Stream: PI.DOMAIN-COGNITION-ENGINE-PATTERN.01 | Classification: G1 | Branch: main

---

## 1. The Pattern

A Domain Cognition Engine is a governed, deterministic cognition machine composed of three separable concerns:

```
DOMAIN MODULE = VOCABULARY × RULES × ENGINE
```

**VOCABULARY** defines what the domain talks about.
**RULES** encode how the domain interprets evidence.
**ENGINE** is the domain-generic machinery that processes vocabulary through rules.

Domain Modules do not create engines. They provide vocabulary and rules to a shared engine.

---

## 2. VOCABULARY

The authored, constitutional, domain-specific semantic inventory. VOCABULARY is static — it does not change per run, per client, or per specimen. It changes only through governed stream.

### 2.1 Vocabulary Components

| Component | Role | Shape | SW-Intel Count |
|---|---|---|---|
| **Condition Types** | Named structural phenomena the domain recognizes | `{ id, human_name, what_it_means, why_it_matters, operational_implication, how_detected, what_to_look_for, upstream[], downstream[] }` | 11 |
| **Consequence Types** | Operational implications derived from conditions | `{ id, structural_consequence_label, operator_consequence_title, operational_implication }` | 8 |
| **Combination Patterns** | Named emergent consequences from co-presence | `{ id, human_name, upstream[], detection_rule }` | 3 |
| **Ontology Classes** | Behavioral classification categories | `{ class_id, class_name, class_question }` | 5 (A-E) |
| **Risk Shape Labels** | Named class-combination profiles | `{ class_combination → narrative_label }` | 31 |
| **Cognition Slice Names** | Executive-facing condition translations | `{ executive_name, localize(domain) → sentence }` | 11 |
| **Guided Interventions** | Operator actions per condition type | `{ intervention_id, action_type, operator_label, topology_mutation, panel_mutation }` | ~30 |
| **Confidence Labels** | Governance boundary translations | `{ governance_boundary → executive_label }` | 3 |
| **Relationship Verbs** | Consequence-to-consequence dynamics | `{ verb → meaning }` | 5 |

### 2.2 Vocabulary Graph

The vocabulary is not a flat list. It is a directed graph:

```
Condition Nodes ──[defining/conditional]──→ Consequence Nodes
                                                 │
                                           [contributor]
                                                 ↓
                                        Combination Nodes

Rule Nodes ──[governance]──→ Condition Nodes
Rule Nodes ──[governance]──→ Consequence Nodes
```

Each edge carries a role: `defining` (primary derivation), `conditional` (fires under threshold), `contributor` (combination input), `governance` (rule reference). The graph is static — it defines derivation PATHS, not runtime state.

### 2.3 Runtime Merge

At runtime, each vocabulary node gains a `runtime` layer:

```
{ ontology: { ...static_node }, runtime: { activated, domain, evidence_count, signal_count, verification_verdict } }
```

The vocabulary node tells you what the condition MEANS. The runtime layer tells you whether it FIRED.

---

## 3. RULES

The deterministic logic that transforms evidence into conditions and conditions into consequences. RULES are domain-specific functions that consume domain-specific vocabulary.

### 3.1 Rule Layers

| Layer | Input | Output | Count in SW-Intel |
|---|---|---|---|
| **Feature Extraction** | Signal properties + structural enrichment | Feature tags (pressure_concentration, dependency_amplification, etc.) | 1 function, ~12 feature types |
| **Condition Synthesis** | Tagged signals + structural enrichment | Structured condition objects | 10 primitive rules + 1 composite |
| **Consequence Mapping** | Conditions + structural context | Atomic consequence objects | 11 map functions |
| **Combination Detection** | Atomic consequences grouped by locus | Combination consequence objects | 3 pattern definitions |

### 3.2 Rule Properties

Every rule must satisfy:

1. **Deterministic** — same inputs → same output
2. **Evidence-traceable** — output carries `derivation_trace` back to input
3. **Vocabulary-bound** — all output text from VOCABULARY, no freeform generation
4. **Severity-preserving** — severity flows from evidence, escalation is explicit and traced
5. **Governance-classified** — every output carries `governance_boundary` and `evidence_mode`

### 3.3 Condition Object Shape

Every condition synthesis rule produces objects conforming to:

```
{
  condition_id,
  condition_type,                    // from VOCABULARY
  operator_cognition_title,          // from VOCABULARY
  operational_consequence,           // from VOCABULARY (parameterized)
  severity,                          // from evidence
  governance_boundary,               // from evidence classification
  supporting_signal_ids,             // evidence trace
  shared_topology_targets,           // { domains[], clusters[], files[] }
  evidence_mode,                     // TOPOLOGY_DRIVEN | SIGNAL_DRIVEN | STRUCTURAL_ENRICHMENT_DERIVED | MIXED
  topology_overlay,                  // { overlay_mode, emphasis_domains[], dim_domains[], ... }
  guided_interventions,              // from VOCABULARY
  derivation_trace,                  // string describing derivation path
}
```

This shape is domain-generic. The CONTENT (condition_type values, intervention definitions) is domain-specific.

### 3.4 Consequence Mapping Rules

Each condition type maps to 1-3 consequence types through a mapping function. Mappings may apply contextual modifiers:

- Severity thresholds (e.g., only emit OP_BOTTLENECK when severity ≥ ELEVATED)
- Structural enrichment flags (e.g., `_has_hub_fragility`)
- Metric thresholds (e.g., `clusterFanAsymmetry() > 40`)

These modifiers are domain-specific. The mapping mechanism (function that takes condition + context, returns consequence[]) is generic.

---

## 4. ENGINE

The domain-generic machinery. ENGINE does not know what conditions or consequences mean — it processes them structurally.

### 4.1 Compilation Pipeline

```
Conditions (from RULES)
    │
    ├──→ mapCondition() ──→ Raw Atomic Consequences
    │        Uses RULES layer consequence mapping functions
    │
    ├──→ deduplicateConsequences() ──→ Deduplicated Atomics
    │        Groups by (consequence_type_id + locus_key)
    │        Merges source arrays, escalates to max severity
    │        DOMAIN-GENERIC — operates on shape, not meaning
    │
    ├──→ detectCombinations() ──→ Combination Consequences
    │        Groups by locus, tests co-presence patterns from VOCABULARY
    │        makeCombination() assembles evidence, derives severity
    │        MECHANISM is generic; PATTERNS are domain-specific
    │
    ├──→ compile() ──→ Consequence Result
    │        Filters: combined loci promoted, uncombined atomics retained
    │        Sorts by severity
    │        Produces compilation_trace (input_count, suppressed, escalations)
    │        DOMAIN-GENERIC
    │
    └──→ Persona Projection Functions
             forBoardroom()    — cognitive compression
             forBalanced()     — causal narrative
             forOperator()     — operational evidence
             forInvestigation() — forensic substrate
             STRUCTURE is generic; VOCABULARY content is domain-specific
```

### 4.2 Domain-Generic Functions

These functions operate on structural shape, not domain meaning:

| Function | What It Does | Why It Is Generic |
|---|---|---|
| `makeAtomic()` | Assembles consequence object from condition + vocabulary entry | Shape assembly — any vocabulary entry works |
| `deduplicateConsequences()` | Groups same-type-same-locus, merges evidence, escalates severity | Operates on `consequence_type_id` + `_lk` — domain-blind |
| `detectCombinations()` | Finds co-presence patterns at same locus | Pattern matching on `consequence_type_id` — patterns are configurable |
| `makeCombination()` | Assembles combination from contributing atomics | Evidence merge — any contributing set works |
| `compile()` | Orchestrates map → dedup → combine → sort | Pipeline orchestration — domain-blind |
| `derivePostureLabel()` | Classifies overall posture from severity distribution | Operates on severity ranks — domain-blind |
| `deriveRelationshipVerb()` | Classifies consequence-to-consequence dynamic | Operates on locus comparison + scope ranks — domain-blind |
| `deriveDomainRiskProfile()` | Maps active ontology classes to risk shape | Operates on class set → label table — table is domain-specific, mechanism is generic |

### 4.3 Persona Projection Shapes

Each persona projection function produces a domain-generic SHAPE filled with domain-specific CONTENT:

**forBoardroom() shape:**
```
{
  posture_label, posture_severity, posture_scope,
  primary_locus, overall_confidence,
  cognition_slices[],          // condition → executive concept
  consequence_themes[],        // grouped by type, severity-ranked
  domain_concentration[],      // weighted by condition count
  domain_narratives[],         // risk-shape-classified
  executive_synthesis,         // cross-domain comparative
  combined_synthesis,          // postural summary with confidence
}
```

**forBalanced() shape:**
```
{
  posture_label, posture_severity, posture_scope,
  primary_story: {             // highest-severity consequence with full chain
    title, operational_implication, source_conditions[],
    is_combination, combination_explanation,
  },
  reinforcement_flow[]: {      // each non-primary consequence
    relationship_verb,         // amplifies|reinforces|widens|concentrates|converges
    relationship_sentence,
  },
  ontology_groups[],           // conditions grouped by ontology class
  combined_synthesis,
}
```

**forOperator() shape:**
```
{
  headline_consequences[],     // full derivation traces, decomposition
  full_atomic_set[],           // complete atomic inventory
  compilation_trace,           // compilation statistics
}
```

**forInvestigation() shape:**
```
{
  consequences[],              // full evidence chain per consequence
  atomic_consequences[],       // complete atomic inventory
  combination_consequences[],  // combination IDs
  compilation_trace,           // compilation statistics
}
```

These shapes are reusable. A PMO module would produce a `forBoardroom()` with the same shape — different `cognition_slices`, different `domain_narratives`, same structural skeleton.

### 4.4 The 5 Relationship Verbs

The ENGINE defines 5 deterministic relationship verbs for consequence-to-consequence dynamics:

| Condition | Verb | Structural Meaning |
|---|---|---|
| Different locus | **widens** | Exposure extends spatially |
| Same locus + combination pattern | **amplifies** | Structural compounding |
| Same locus + narrower scope | **concentrates** | Pressure intensifies locally |
| Same locus + broader scope | **converges with** | Broader dynamic converges |
| Same locus + same scope | **reinforces** | Structural pressure intensifies |

These verbs are domain-independent. They describe structural dynamics between ANY pair of consequences, regardless of domain vocabulary.

---

## 5. Separation Summary

| Concern | Owner | Changes When |
|---|---|---|
| Condition vocabulary | VOCABULARY | New condition type recognized |
| Consequence vocabulary | VOCABULARY | New operational implication identified |
| Combination patterns | VOCABULARY | New co-presence emergence pattern discovered |
| Ontology classes | VOCABULARY | New behavioral classification axis |
| Feature extraction rules | RULES | New signal family or enrichment surface |
| Condition synthesis rules | RULES | New evidence→condition derivation path |
| Consequence mapping rules | RULES | New condition→consequence logic |
| Deduplication | ENGINE | Never (structural operation) |
| Combination detection mechanism | ENGINE | Never (parameterized by VOCABULARY) |
| Compilation pipeline | ENGINE | Never (orchestration) |
| Persona projection shapes | ENGINE | New persona added (rare) |
| Relationship verbs | ENGINE | Never (structural dynamics are domain-independent) |

The ENGINE is shared infrastructure governed at PI Core level. VOCABULARY and RULES are domain-specific, governed at Domain Module level. Adding a new Domain Module provides new VOCABULARY and RULES to the same ENGINE.
