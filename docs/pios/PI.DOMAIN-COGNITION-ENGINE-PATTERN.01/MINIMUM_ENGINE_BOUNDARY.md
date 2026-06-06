# MINIMUM ENGINE BOUNDARY — Strict Separation Analysis

Stream: PI.DOMAIN-COGNITION-ENGINE-PATTERN.01 | Classification: G1 | Branch: main

---

## 0. The Test

If all SW-Intel vocabulary disappeared tomorrow, what remains?

This is not a generalization argument. This is a subtraction exercise. Every function and constant across the three-file triad is classified into exactly one of three categories by proving — not assuming — whether it references domain-specific content.

The classification test for each function:

- **Would this function produce identical output if given PMO inputs?** → ENGINE
- **Would this function need different logic for PMO?** → RULES
- **Is this pure authored content with no computation?** → VOCABULARY

---

## 1. ENGINE CORE — What Survives

### 1.1 PURE ENGINE — Zero Domain References

These functions never reference SW-Intel condition types, consequence types, combination patterns, or vocabulary entries. They operate on structural shapes. They would execute identically for PMO, Security, Architecture, or Transformation modules without any modification.

**Compilation Infrastructure:**

| Function | File | Lines | What It Does | Why It Is Pure |
|---|---|---|---|---|
| `deduplicateConsequences()` | ConsequenceCompiler.js | 336-372 | Groups by `consequence_type_id + _lk`, merges sources, escalates severity | Groups by ID string + locus key. Never interprets what the ID means. |
| `emptyResult()` | ConsequenceCompiler.js | 506-522 | Empty compilation result shape | Defines output schema. No content. |
| `stripInternal()` | ConsequenceCompiler.js | 524-527 | Removes internal tracking fields | Operates on field prefix convention (_src_*). |
| `hasSourceType()` | ConsequenceCompiler.js | 376-378 | Checks source type membership | Array inclusion test. |
| `derivePostureLabel()` | ConsequenceCompiler.js | 762-768 | Classifies overall posture from consequence count and systemic presence | Operates on count thresholds. Only the final fallback reads `operator_consequence_title` — a display string, not domain logic. |

**Severity/Confidence/Scope Machinery:**

| Function | File | Lines | What It Does | Why It Is Pure |
|---|---|---|---|---|
| `sevGte()` | ConsequenceCompiler.js | 87-89 | Severity comparison | Operates on SEVERITY_RANK — domain-generic ordinal. |
| `maxSev()` | ConsequenceCompiler.js | 91-97 | Maximum severity from array | Same. |
| `minConfidence()` | ConsequenceCompiler.js | 99-104 | Minimum confidence from boundary array | Operates on CONFIDENCE_RANK — domain-generic ordinal. |
| `maxSeverity()` | SignalSynthesisEngine.js | 106-112 | Maximum severity (parallel implementation) | Same as maxSev. |
| `SEVERITY_RANK` | SignalSynthesisEngine.js | 104 | Severity ordinal constants | Domain-generic scale: CRITICAL→HIGH→ELEVATED→MODERATE→LOW→NOMINAL. |
| `SEVERITY_ESCALATION` | ConsequenceCompiler.js | 6-9 | Escalation mapping | Domain-generic: each level → next level. |
| `CONFIDENCE_RANK` | ConsequenceCompiler.js | 11 | Confidence ordinal | Domain-generic: GOVERNED→ADVISORY_BOUND→STRUCTURAL_ONLY. |
| `SCOPE_RANK` | ConsequenceCompiler.js | 12 | Scope ordinal | Domain-generic: LOCAL→REGIONAL→SYSTEMIC. |
| `CONFIDENCE_EXECUTIVE` | ConsequenceCompiler.js | 652-656 | Executive display labels for confidence | Domain-generic: maps governance boundaries to human labels. |

**Locus Resolution:**

| Function | File | Lines | What It Does | Why It Is Pure |
|---|---|---|---|---|
| `primaryLocusKey()` | ConsequenceCompiler.js | 106-109 | Extracts primary domain from condition targets | Reads `shared_topology_targets.domains[0]`. Shape access, not domain interpretation. |
| `locusIdPart()` | ConsequenceCompiler.js | 111-113 | Normalizes locus key to ID-safe string | String transformation. |
| `buildDomainResolver()` | SignalSynthesisEngine.js | 243-255 | Builds domain ID resolver from registry | Operates on registry shape (domain_id, dominant_dom_id). Any registry works. |
| `resolveDomainDisplay()` | SignalSynthesisEngine.js | 257-276 | Resolves domain ID to display object | Registry lookup by shape. No domain-specific logic. |

**Relationship Verb Machinery:**

| Function | File | Lines | What It Does | Why It Is Pure |
|---|---|---|---|---|
| `deriveRelationshipVerb()` | ConsequenceCompiler.js | 920-929 | Classifies consequence-to-consequence dynamic | Compares `primary_locus_display` and `consequence_scope`. Checks `combination_pattern` as boolean. Never reads domain-specific IDs. Produces: widens, amplifies, concentrates, converges with, reinforces. |

**Persona Projections (Pure):**

| Function | File | Lines | What It Does | Why It Is Pure |
|---|---|---|---|---|
| `forOperator()` | ConsequenceCompiler.js | 1084-1109 | OPERATOR projection | Pure shape transformation. Selects fields from consequence result. Never references vocabulary. |
| `forInvestigation()` | ConsequenceCompiler.js | 1113-1144 | INVESTIGATION projection | Pure shape transformation. Selects fields from consequence and synthesis results. Never references vocabulary. |
| `resolveSourceConditions()` | ConsequenceCompiler.js | 895-905 | Resolves condition IDs to display objects | Map lookup on condition_id. Uses COGNITION_SLICE_VOCABULARY for display names — but only as a fallback label. The MECHANISM is generic. |

**Ontology Graph Infrastructure:**

| Function | File | Lines | What It Does | Why It Is Pure |
|---|---|---|---|---|
| `resolveNode()` | CognitionOntology.js | 609-648 | Two-layer merge: ontology + runtime | Accepts ANY node from ALL_NODES, overlays runtime state. Node type dispatch (condition/consequence/combination) is ENGINE-level taxonomy, not domain vocabulary. |
| `resolveConnections()` | CognitionOntology.js | 652-672 | Resolves upstream/downstream graph refs | Graph traversal on any ref array. |
| ALL_NODES indexing | CognitionOntology.js | 601-605 | Unified node index | Generic merge of typed node collections. |

**Synthesis Utilities:**

| Function | File | Lines | What It Does | Why It Is Pure |
|---|---|---|---|---|
| `deriveBalancedConfidenceSentence()` | ConsequenceCompiler.js | 948-958 | Confidence explanation sentence | Switch on governance boundary values (domain-generic). |
| `deriveBalancedSynthesis()` | ConsequenceCompiler.js | 961-975 | Balanced synthesis text | Composes from `operator_consequence_title`, `primary_locus_display`, posture label. Reads display strings, not domain logic. |

**PURE ENGINE TOTAL: ~300 lines of domain-independent machinery.**

---

### 1.2 ENGINE WITH VOCABULARY COUPLING — Generic Mechanism, Domain-Specific Reference

These functions implement domain-generic MECHANISMS but currently contain hardcoded references to SW-Intel vocabulary. The mechanism would not change for PMO. Only the vocabulary reference would change — from direct import to parameterized input.

Each coupling point is identified below with the specific line(s) that create the dependency.

**Consequence Factory:**

| Function | Lines | Coupling Point | What Changes for PMO |
|---|---|---|---|
| `makeAtomic()` | 150-207 | Line 153: `const vocab = CONSEQUENCE_VOCABULARY[typeId]` | Vocabulary lookup must be parameterized. Mechanism (shape assembly from vocab entry + condition) is domain-generic. |
| `makeCombination()` | 380-456 | Line 381: `const vocab = CONSEQUENCE_VOCABULARY[patternId]`; Line 387: `patternId === 'SYSTEMIC_OP_FRAG' ? 'SYSTEMIC' : 'REGIONAL'` | Vocabulary lookup must be parameterized. Scope assignment must come from pattern definition, not hardcoded ID check. |

**Combination Detection:**

| Function | Lines | Coupling Point | What Changes for PMO |
|---|---|---|---|
| `detectCombinations()` | 458-501 | Lines 471-498: Three hardcoded pattern definitions — `COORD_FRAG from DPC + DEP_AMP from DCkP`, `DEL_EXP from DPC + RESIL_DEF from SMC`, `3+ atomics with 3+ types` | Pattern definitions must be parameterized. The MECHANISM (group by locus, test co-presence, call makeCombination) is domain-generic. The PATTERNS tested are domain vocabulary. |

**Compilation Pipeline:**

| Function | Lines | Coupling Point | What Changes for PMO |
|---|---|---|---|
| `compile()` | 529-580 | Line 548: `rawAtomics.push(...mapCondition(cond, ctx, registry))` — calls SW-Intel-specific dispatch | Rule dispatch must be parameterized. Pipeline shape (map → dedup → detect → sort) is domain-generic. |

**Risk Profiling:**

| Function | Lines | Coupling Point | What Changes for PMO |
|---|---|---|---|
| `deriveDomainRiskProfile()` | 694-715 | Line 697: `CONDITION_ONTOLOGY_CLASS[ct]`; Line 701: `CLASS_RISK_LABEL[classKey]`; Lines 703-714: hardcoded shape names | Class mapping and risk label table must be parameterized. Classification mechanism (map conditions → classes → shape) is domain-generic. |
| `synthesizeBoardroomNarrative()` | 717-760 | Lines 746-753: narrative template strings (`"is your structural gravity well"`, `"is a structural bottleneck"`, `"concentrates structural risk"`) | Narrative templates must be parameterized. Narrative MECHANISM (compare domain weights, select template, compose synthesis) is domain-generic. |

**Persona Projections (Coupled):**

| Function | Lines | Coupling Point | What Changes for PMO |
|---|---|---|---|
| `forBoardroom()` | 770-891 | Lines 781-782: `COGNITION_SLICE_VOCABULARY[cond.condition_type]`; Lines 824: `CONSEQUENCE_VOCABULARY[tid]`; Lines 846-856: `CONDITION_CONSEQUENCE_MAP` hardcoded; Line 1033: `CONDITION_ONTOLOGY_CLASS[cond.condition_type]` | Four vocabulary lookups must be parameterized. The STRUCTURE (slices, themes, domain concentration, narratives, synthesis) is domain-generic. |
| `forBalanced()` | 977-1080 | Lines 899: `COGNITION_SLICE_VOCABULARY`; Line 1033: `CONDITION_ONTOLOGY_CLASS`; Line 1044: `COGNITION_SLICE_VOCABULARY` | Same parameterization as forBoardroom. |
| `compileRelationshipSentence()` | 931-946 | Lines 937-938: `typeId === 'AMPLIFIED_DEP_FRAG'`, `typeId === 'STRUCT_GRAVITY_WELL'` | Combination-specific sentences must be parameterized. Verb → sentence MECHANISM is domain-generic. |
| `deriveCombinationExplanation()` | 907-918 | Lines 909-915: switch on `'SYSTEMIC_OP_FRAG'`, `'AMPLIFIED_DEP_FRAG'`, `'STRUCT_GRAVITY_WELL'` | Explanation text must be parameterized per combination pattern. |

**Synthesis Orchestration:**

| Function | Lines | Coupling Point | What Changes for PMO |
|---|---|---|---|
| `synthesize()` | SSE 1328-1396 | Calls `extractFeatures()` and all 11 SW-Intel rule engines | Rule set must be parameterized. Orchestration pattern (tag → run rules → merge → sort) is domain-generic. |

**Signal Utility:**

| Function | Lines | Coupling Point | What Changes for PMO |
|---|---|---|---|
| `extractSignalFamilies()` | CC 135-148 | Lines 140-146: hardcoded prefix list (PSIG, DPSIG, ISIG, BSIG, CSIG, ESIG) | Prefix list must be parameterized. Prefix extraction MECHANISM is domain-generic. |

**ENGINE WITH COUPLING TOTAL: ~600 lines of domain-generic mechanism with ~25 coupling points that require parameterization.**

---

### 1.3 ENGINE BOUNDARY SUMMARY

```
PURE ENGINE (no modification):      ~300 lines
ENGINE (parameterization needed):   ~600 lines
────────────────────────────────────────────────
TOTAL ENGINE:                       ~900 lines
```

The engine is real. It is not a thin wrapper. It is a complete cognition processing pipeline:

```
Evidence → Feature Tagging → Condition Synthesis → Consequence Mapping
→ Deduplication → Combination Detection → Compilation
→ Risk Profiling → Narrative Synthesis → Persona Projection (×4)
```

Every stage of this pipeline has a domain-generic mechanism. The domain-specific content enters through vocabulary lookups and rule dispatch — not through mechanism modification.

---

## 2. RULE CONTRACT — What a Domain Module Must Provide

A domain module must provide deterministic transformation functions that convert domain-specific evidence into conditions and conditions into consequences.

### 2.1 Required Rule Functions

| Function Type | Signature Shape | SW-Intel Count | What It Does |
|---|---|---|---|
| **Feature Extraction** | `(signal, pressureState, enrichment) → featureTag[]` | 1 function, ~12 feature types | Maps raw evidence properties to domain-specific feature tags |
| **Condition Synthesis Rules** | `(taggedSignals, domainState, registry) → condition[]` | 10 primitive + 1 composite | Transforms tagged evidence into structured condition objects |
| **Consequence Mapping Functions** | `(condition, context, registry) → atomic[]` | 11 map functions | Maps each condition type to 1-3 consequence types with contextual modifiers |
| **Contextual Modifier Helpers** | `(evidence) → number` | 2 (clusterFanAsymmetry, hubInDegree) | Computes domain-specific metrics used as mapping thresholds |
| **Entity Resolution** | `(entityId, registry, state) → domainId` | 1 (resolveFileToRegistryDomain) | Resolves evidence entities to domain registry entries |

### 2.2 Condition Object Contract

Every condition synthesis rule MUST produce objects conforming to:

```javascript
{
  condition_id:             String,   // unique within this synthesis run
  condition_type:           String,   // matches a VOCABULARY condition type ID
  operator_cognition_title: String,   // from VOCABULARY
  operational_consequence:  String,   // from VOCABULARY (may be parameterized)
  severity:                 String,   // CRITICAL|HIGH|ELEVATED|MODERATE|LOW|NOMINAL
  governance_boundary:      String,   // GOVERNED|ADVISORY_BOUND|STRUCTURAL_ONLY
  supporting_signal_ids:    String[], // evidence trace
  shared_topology_targets:  { domains: String[], clusters: String[], files: String[] },
  evidence_mode:            String,   // TOPOLOGY_DRIVEN|SIGNAL_DRIVEN|STRUCTURAL_ENRICHMENT_DERIVED|MIXED
  topology_overlay:         Object,   // domain-specific visualization hints
  guided_interventions:     Object[], // from VOCABULARY
  derivation_trace:         String,   // human-readable derivation path
}
```

This shape is the ENGINE's input contract. The ENGINE does not care what condition types exist — it processes this shape.

### 2.3 Consequence Mapping Contract

Each mapping function MUST call `makeAtomic(typeId, condition, scope, isDefining, registry)` to produce consequence objects. The mapping function decides:

- WHICH consequence types to emit (from VOCABULARY)
- WHAT scope each consequence has (LOCAL, REGIONAL, SYSTEMIC)
- WHETHER the consequence is defining (primary) or conditional (secondary)
- WHAT contextual modifiers gate conditional emission

### 2.4 Rule Properties (Invariants)

Every rule function must satisfy:

1. **Deterministic** — same inputs → same output
2. **Evidence-traceable** — output carries derivation_trace back to input signals
3. **Vocabulary-bound** — all output text from VOCABULARY, no freeform generation
4. **Severity-preserving** — severity from evidence, never invented
5. **Governance-classified** — every output carries governance_boundary

---

## 3. VOCABULARY CONTRACT — What Authored Ontology Must Provide

A domain module must provide authored, constitutional, static semantic definitions that the ENGINE consumes.

### 3.1 Required Vocabulary Components

| Component | Shape | SW-Intel Count | Used By |
|---|---|---|---|
| **Condition Type Definitions** | `{ id, human_name, what_it_means, why_it_matters, operational_implication, how_detected, what_to_look_for, upstream[], downstream[] }` | 11 | Ontology graph, resolveNode(), persona projections |
| **Consequence Type Definitions** | `{ consequence_type_id, structural_consequence_label, operator_consequence_title, operational_implication }` | 8 atomic + 3 combination = 11 | makeAtomic(), makeCombination(), persona projections |
| **Combination Pattern Definitions** | `{ id, human_name, detection_rule: { required_consequence_types[], required_source_types[], min_count?, escalate? } }` | 3 | detectCombinations() |
| **Ontology Class Definitions** | `{ class_id, class_name, class_question }` | 5 (A-E) | deriveDomainRiskProfile(), forBalanced() ontology groups |
| **Condition-to-Class Mapping** | `{ condition_type → class_id }` | 10 entries | deriveDomainRiskProfile() |
| **Risk Shape Labels** | `{ class_combination_key → narrative_label }` | 31 | deriveDomainRiskProfile(), synthesizeBoardroomNarrative() |
| **Cognition Slice Vocabulary** | `{ condition_type → { executive_name, localize(domain) → sentence } }` | 11 | forBoardroom() slices, forBalanced() display |
| **Guided Interventions** | `{ condition_type → [{ intervention_id, action_type, operator_label, topology_mutation, panel_mutation }] }` | ~30 total | Condition synthesis output |
| **Condition-to-Consequence Map** | `{ condition_type → consequence_type_id[] }` | 11 entries | forBoardroom() domain concentration |
| **Combination Explanations** | `{ pattern_id → explanation_text }` | 3 | forBalanced() combination story |
| **Combination-Specific Sentences** | `{ pattern_id → relationship_sentence }` | 2 (for 'amplifies' verb) | compileRelationshipSentence() |
| **3-Layer Condition Naming** | `{ condition_type → { internal, l2, l3, consequence, topology_effect, governance } }` | 12 | Condition synthesis output |
| **Signal Family Prefixes** | `String[]` | 6 (PSIG, DPSIG, ISIG, BSIG, CSIG, ESIG) | extractSignalFamilies() |
| **Narrative Templates** | `{ shape → verb }` (e.g., gravity_well → "is your structural gravity well") | 3 templates | synthesizeBoardroomNarrative() |

### 3.2 Vocabulary Graph Contract

The vocabulary is not a flat registry. It is a directed graph with typed edges:

```
Condition Nodes ──[defining|conditional]──→ Consequence Nodes
                                                  │
                                            [contributor]
                                                  ↓
                                         Combination Nodes

Rule Nodes ──[governance]──→ Condition Nodes
Rule Nodes ──[governance]──→ Consequence Nodes
```

Edge roles: `defining` (primary derivation), `conditional` (threshold-gated), `contributor` (combination input), `governance` (rule reference).

This graph structure is ENGINE infrastructure. The nodes and edges are domain VOCABULARY.

### 3.3 Vocabulary Properties (Invariants)

1. **Static** — does not change per run, per client, or per specimen
2. **Authored** — human-defined, not computed
3. **Constitutional** — changes only through governed stream
4. **Complete** — every condition type has: consequence mappings, ontology class assignment, cognition slice entry, guided interventions
5. **Internally consistent** — upstream/downstream references resolve within the vocabulary graph

---

## 4. ENGINE API — Conceptual Interface

### 4.1 Input

```
┌─────────────────────────────────────────────────────────────────┐
│ VOCABULARY REGISTRY                                             │
│                                                                 │
│  condition_types:       { id → definition }                     │
│  consequence_types:     { id → definition }                     │
│  combination_patterns:  { id → detection_rule }                 │
│  ontology_classes:      { condition_type → class }              │
│  risk_shape_labels:     { class_key → label }                   │
│  cognition_slices:      { condition_type → executive_entry }    │
│  guided_interventions:  { condition_type → intervention[] }     │
│  condition_consequence_map: { condition_type → csq_type_id[] }  │
│  combination_explanations:  { pattern_id → text }               │
│  signal_family_prefixes:    String[]                             │
│  narrative_templates:       { shape → verb }                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RULE SET                                                        │
│                                                                 │
│  extractFeatures:   (signal, state, enrichment) → tag[]         │
│  synthesisRules:    (taggedSignals, state, registry) → cond[]   │
│  consequenceMaps:   { condition_type → mapFn(cond, ctx) → csq[] }│
│  contextHelpers:    { name → fn(evidence) → metric }            │
│  entityResolver:    (entityId, registry, state) → domainId      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ EVIDENCE                                                        │
│                                                                 │
│  signals:              Signal[]                                 │
│  structural_enrichment: Object                                  │
│  pressure_zone_state:   Object                                  │
│  domain_registry:       DomainEntry[]                           │
│  topology_edges:        Edge[]                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Output

```
┌─────────────────────────────────────────────────────────────────┐
│ CONDITIONS                                                      │
│                                                                 │
│  conditions[]:  Structured condition objects (§2.2 shape)       │
│  condition_count: Number                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CONSEQUENCES                                                    │
│                                                                 │
│  consequences[]:            Top-level (deduped + combined)      │
│  atomic_consequences[]:     Pre-combination inventory           │
│  combination_consequences[]: Combination IDs                    │
│  compilation_trace:         { input_count, suppressed,          │
│                               patterns_matched, escalations }   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RISK PROFILES                                                   │
│                                                                 │
│  Per-domain:  { shape, label, classes }                         │
│  Posture:     { label, severity, scope }                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PERSONA PROJECTIONS                                             │
│                                                                 │
│  BOARDROOM:      { posture, slices[], themes[],                 │
│                    domain_concentration[], narratives[],         │
│                    synthesis }                                   │
│                                                                 │
│  BALANCED:       { posture, primary_story,                      │
│                    reinforcement_flow[] with verbs,              │
│                    ontology_groups[], synthesis }                │
│                                                                 │
│  OPERATOR:       { headline_consequences[],                     │
│                    full_atomic_set[],                            │
│                    compilation_trace }                           │
│                                                                 │
│  INVESTIGATION:  { consequences[] with activation_rules,        │
│                    atomics[], combinations[],                    │
│                    compilation_trace }                           │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 ENGINE Processing Pipeline

```
           DOMAIN MODULE                              ENGINE
    ┌──────────────────────┐              ┌──────────────────────────┐
    │                      │              │                          │
    │  VOCABULARY          │──register──→ │  Vocabulary Registry     │
    │  (static authored    │              │                          │
    │   definitions)       │              │                          │
    │                      │              │                          │
    │  RULES               │──register──→ │  Rule Dispatch Table     │
    │  (deterministic      │              │                          │
    │   transformation     │              │                          │
    │   functions)         │              │                          │
    └──────────────────────┘              │                          │
                                          │                          │
    ┌──────────────────────┐              │  ┌────────────────────┐  │
    │  EVIDENCE            │──────────────│→ │ 1. Feature Tagging │  │
    │  (signals,           │              │  │    (calls RULES)   │  │
    │   enrichment,        │              │  └────────┬───────────┘  │
    │   pressure state,    │              │           ↓              │
    │   domain registry)   │              │  ┌────────────────────┐  │
    └──────────────────────┘              │  │ 2. Condition       │  │
                                          │  │    Synthesis        │  │
                                          │  │    (calls RULES)   │  │
                                          │  └────────┬───────────┘  │
                                          │           ↓              │
                                          │  ┌────────────────────┐  │
                                          │  │ 3. Consequence     │  │
                                          │  │    Mapping          │  │
                                          │  │    (calls RULES)   │  │
                                          │  └────────┬───────────┘  │
                                          │           ↓              │
                                          │  ┌────────────────────┐  │
                                          │  │ 4. Deduplication   │  │
                                          │  │    (PURE ENGINE)   │  │
                                          │  └────────┬───────────┘  │
                                          │           ↓              │
                                          │  ┌────────────────────┐  │
                                          │  │ 5. Combination     │  │
                                          │  │    Detection        │  │
                                          │  │    (ENGINE +       │  │
                                          │  │     VOCABULARY     │  │
                                          │  │     patterns)      │  │
                                          │  └────────┬───────────┘  │
                                          │           ↓              │
                                          │  ┌────────────────────┐  │
                                          │  │ 6. Compilation     │  │
                                          │  │    (PURE ENGINE)   │  │
                                          │  └────────┬───────────┘  │
                                          │           ↓              │
                                          │  ┌────────────────────┐  │
                                          │  │ 7. Risk Profiling  │  │
                                          │  │    (ENGINE +       │  │
                                          │  │     VOCABULARY     │  │
                                          │  │     class table)   │  │
                                          │  └────────┬───────────┘  │
                                          │           ↓              │
                                          │  ┌────────────────────┐  │
                                          │  │ 8. Persona         │  │
                                          │  │    Projection (×4) │  │
                                          │  │    (ENGINE +       │  │
                                          │  │     VOCABULARY     │  │
                                          │  │     display text)  │  │
                                          │  └────────┬───────────┘  │
                                          │           ↓              │
                                          │  ┌────────────────────┐  │
                                          │  │ OUTPUT             │  │
                                          │  │ (conditions,       │  │
                                          │  │  consequences,     │  │
                                          │  │  profiles,         │  │
                                          │  │  projections)      │  │
                                          │  └────────────────────┘  │
                                          └──────────────────────────┘
```

Steps 1-3 call RULES (domain-specific transformation logic).
Step 4 is PURE ENGINE (domain-blind deduplication).
Step 5 is ENGINE mechanism with VOCABULARY pattern definitions.
Step 6 is PURE ENGINE (domain-blind compilation).
Steps 7-8 are ENGINE mechanism with VOCABULARY display content.

---

## 5. PORTABILITY TEST — PMO Execution Trace

Can the engine execute with PMO vocabulary and PMO rules without modifying any engine mechanism?

### 5.1 Trace Through the Pipeline

**Step 1: Feature Tagging**
```
PMO signal (schedule_metric) → PMO extractFeatures()
  → ['velocity_decline', 'schedule_compression']
```
ENGINE role: orchestrates the call. RULES provide: the function. No engine modification needed.

**Step 2: Condition Synthesis**
```
Tagged PMO signals → PMO ruleDeliveryVelocityDecline()
  → { condition_type: 'DELIVERY_VELOCITY_DECLINE', severity: 'HIGH', ... }
```
ENGINE role: orchestrates the call. RULES provide: the function. No engine modification needed. The output conforms to the condition object shape (§2.2).

**Step 3: Consequence Mapping**
```
PMO condition → PMO mapDVD(condition)
  → [makeAtomic('SCHEDULE_EXPOSURE', condition, 'REGIONAL', true, registry)]
```
ENGINE role: `makeAtomic()` assembles the consequence object. It looks up `PMO_CONSEQUENCE_VOCABULARY['SCHEDULE_EXPOSURE']` for display text. **Requires parameterization** — vocabulary lookup must accept the PMO vocabulary registry instead of importing SW-Intel's.

**Step 4: Deduplication**
```
PMO raw atomics → deduplicateConsequences(atomics)
  → Groups by 'SCHEDULE_EXPOSURE::workstream-payments'
  → Merges sources, escalates severity
```
ENGINE role: **zero modification**. Groups by `consequence_type_id + _lk`. It does not know or care that the type is SCHEDULE_EXPOSURE. It processes the string.

**Step 5: Combination Detection**
```
PMO deduplicated → detectCombinations(deduped, registry)
  → Groups by locus: { 'workstream-payments': [SCHEDULE_EXPOSURE, RESOURCE_BOTTLENECK] }
  → Tests PMO combination pattern: VELOCITY_TRAP
    (requires SCHEDULE_EXPOSURE + RESOURCE_BOTTLENECK at same locus)
  → makeCombination('VELOCITY_TRAP', [contributing], lk, false, registry)
```
ENGINE role: the mechanism (group by locus, test co-presence, call makeCombination). **Requires parameterization** — currently the pattern definitions are hardcoded as SW-Intel patterns. Must accept pattern definitions from VOCABULARY. The MECHANISM (co-presence matching) does not change.

**Step 6: Compilation**
```
PMO consequences → compile()
  → Filters: combined loci promoted, uncombined atomics retained
  → Sorts by severity
  → Produces compilation_trace
```
ENGINE role: **zero modification** (after Step 3 and Step 5 parameterization). Pipeline orchestration is domain-blind.

**Step 7: Risk Profiling**
```
PMO conditions → deriveDomainRiskProfile(['DELIVERY_VELOCITY_DECLINE', 'RESOURCE_CONCENTRATION'])
  → Looks up PMO_CONDITION_ONTOLOGY_CLASS: A, B
  → Class key: 'AB'
  → PMO_CLASS_RISK_LABEL['AB']: 'velocity pressure on a resource-constrained workstream'
  → { shape: 'pressure_concentration', label: '...', classes: 'AB' }
```
ENGINE role: **requires parameterization** of class mapping and label table. Mechanism (map → set → key → lookup → classify shape) does not change.

**Step 8: Persona Projection**
```
PMO consequences → forBoardroom(consequenceResult, synthesisResult, fullReport)
  → Produces: posture_label, cognition_slices[], consequence_themes[],
              domain_concentration[], domain_narratives[], synthesis
```
ENGINE role: the STRUCTURE is identical. **Requires parameterization** of vocabulary lookups. The output SHAPE does not change. The output CONTENT is PMO-specific (filled from PMO vocabulary).

```
PMO consequences → forBalanced(...)
  → primary_story: { title: 'Schedule Risk Exposure', ... }
  → reinforcement_flow: [{ relationship_verb: 'amplifies', ... }]
  → ontology_groups: [{ class_name: 'Velocity & Throughput', ... }]
```
Relationship verbs are PURE ENGINE. `deriveRelationshipVerb()` compares locus and scope — no domain references. PMO consequences receive the same 5 verbs.

```
PMO consequences → forOperator(consequenceResult)
  → headline_consequences[], full_atomic_set[], compilation_trace
```
ENGINE role: **zero modification**. Pure shape transformation.

```
PMO consequences → forInvestigation(consequenceResult, synthesisResult)
  → consequences[] with activation_rules, atomics[], combinations[]
```
ENGINE role: **zero modification**. Pure shape transformation.

### 5.2 Portability Verdict

| Pipeline Stage | Engine Modification Required | Parameterization Required |
|---|---|---|
| Feature Tagging | NONE | Accept domain rule function |
| Condition Synthesis | NONE | Accept domain rule set |
| Consequence Mapping | NONE | Accept domain vocabulary registry |
| Deduplication | NONE | NONE |
| Combination Detection | NONE | Accept pattern definitions from vocabulary |
| Compilation | NONE | NONE |
| Risk Profiling | NONE | Accept class mapping + label table |
| Narrative Synthesis | NONE | Accept narrative templates |
| forBoardroom() | NONE | Accept slice + consequence vocabulary |
| forBalanced() | NONE | Accept slice + ontology vocabulary |
| forOperator() | NONE | NONE |
| forInvestigation() | NONE | NONE |

**ENGINE MECHANISM MODIFICATIONS: ZERO.**
**ENGINE PARAMETERIZATIONS: ~25 coupling points where direct imports become function arguments.**

---

## 6. COMPLETE CLASSIFICATION — Function-by-Function

### 6.1 CognitionOntology.js (700 lines)

| Lines | Artifact | Classification | Evidence |
|---|---|---|---|
| 14-260 | CONDITION_NODES (11 entries) | **VOCABULARY** | Pure authored SW-Intel condition definitions |
| 264-458 | CONSEQUENCE_NODES (8 entries) | **VOCABULARY** | Pure authored SW-Intel consequence definitions |
| 462-525 | COMBINATION_NODES (3 entries) | **VOCABULARY** | Pure authored SW-Intel combination definitions |
| 529-597 | RULE_NODES (2 entries) | **VOCABULARY** | References SW-Intel condition/consequence IDs |
| 601-605 | ALL_NODES index | **ENGINE** | Generic merge of typed node collections |
| 609-648 | `resolveNode()` | **ENGINE** | Two-layer merge on any node. Type dispatch (condition/consequence) is engine taxonomy |
| 652-672 | `resolveConnections()` | **ENGINE** | Graph traversal on any ref array |
| 676-687 | CONDITION_ONTOLOGY_CLASS | **VOCABULARY** | SW-Intel condition-to-class mapping with SW-Intel class definitions |

**CognitionOntology.js: ~600 lines VOCABULARY, ~100 lines ENGINE**

### 6.2 SignalSynthesisEngine.js (~1442 lines)

| Lines | Artifact | Classification | Evidence |
|---|---|---|---|
| 4-101 | CONDITION_VOCABULARY | **VOCABULARY** | 3-layer naming per SW-Intel condition type |
| 104 | SEVERITY_RANK | **ENGINE** | Domain-generic severity ordinal |
| 106-112 | `maxSeverity()` | **ENGINE** | Domain-generic max computation |
| 114-166 | CONDITION_INTERVENTIONS | **VOCABULARY** | Per-SW-Intel-condition guided interventions |
| 170-233 | `extractFeatures()` | **RULES** | SW-Intel signal → feature tag mapping |
| 235-238 | `extractPrimaryEntity()` | **RULES** | SW-Intel signal parsing |
| 243-255 | `buildDomainResolver()` | **ENGINE** | Generic registry resolver |
| 257-276 | `resolveDomainDisplay()` | **ENGINE** | Generic display resolution |
| 278-298 | `buildDomainTargets()` | **RULES** | Contains SW-Intel condition-type → role mapping |
| 300-360 | `ruleDeliveryPressureConcentration()` | **RULES** | SW-Intel condition synthesis |
| 362-380 | `resolveFileToRegistryDomain()` | **RULES** | SW-Intel file→domain resolution |
| 382-461 | STRUCTURAL_ROLE_LABELS + `translateCentralityNode()` | **RULES** | SW-Intel code-graph role interpretation |
| 463-543 | `ruleDependencyChokePoint()` | **RULES** | SW-Intel condition synthesis |
| 545-670 | `rulePropagationAsymmetry()` | **RULES** | SW-Intel condition synthesis |
| 670-780 | `ruleStructuralMassConcentration()` | **RULES** | SW-Intel condition synthesis |
| 780-870 | `ruleCrossDomainCouplingPressure()` | **RULES** | SW-Intel condition synthesis |
| 870-960 | `ruleExecutionFragility()` | **RULES** | SW-Intel condition synthesis |
| 960-1070 | `ruleExecutionConstriction()` | **RULES** | SW-Intel condition synthesis |
| 1070-1150 | `ruleStructuralBoundaryDivergence()` | **RULES** | SW-Intel condition synthesis |
| 1150-1258 | `ruleCouplingInertia()` | **RULES** | SW-Intel condition synthesis |
| 1258-1326 | `ruleGovernanceCoverageStatus()` + `ruleCompoundConvergence()` | **RULES** | SW-Intel condition synthesis |
| 1328-1396 | `synthesize()` | **ENGINE** (coupled) | Orchestration pattern is generic; rule calls are SW-Intel specific |
| 1398-1442 | `synthesizeTeaser()` + exports | **RULES** | References SW-Intel module name |

**SignalSynthesisEngine.js: ~150 lines VOCABULARY, ~1200 lines RULES, ~90 lines ENGINE**

### 6.3 ConsequenceCompiler.js (1158 lines)

| Lines | Artifact | Classification | Evidence |
|---|---|---|---|
| 6-12 | Constants (SEVERITY_ESCALATION, CONFIDENCE_RANK, SCOPE_RANK) | **ENGINE** | Domain-generic ordinals |
| 16-83 | CONSEQUENCE_VOCABULARY | **VOCABULARY** | 11 SW-Intel consequence type entries |
| 87-113 | Helpers (sevGte, maxSev, minConfidence, primaryLocusKey, locusIdPart) | **ENGINE** | Operate on domain-generic shapes |
| 115-133 | clusterFanAsymmetry, hubInDegree | **RULES** | SW-Intel structural metric computation |
| 135-148 | extractSignalFamilies | **ENGINE** (coupled) | Mechanism generic, prefix list is vocabulary |
| 150-207 | `makeAtomic()` | **ENGINE** (coupled) | Shape assembly generic, vocab lookup coupled |
| 211-332 | 11 map functions + mapCondition dispatch | **RULES** | SW-Intel condition→consequence mapping logic |
| 336-372 | `deduplicateConsequences()` | **ENGINE** | Pure domain-blind deduplication |
| 376-378 | `hasSourceType()` | **ENGINE** | Array inclusion |
| 380-456 | `makeCombination()` | **ENGINE** (coupled) | Shape assembly generic, vocab lookup + scope coupled |
| 458-501 | `detectCombinations()` | **ENGINE** (coupled) | Mechanism generic, pattern definitions coupled |
| 506-527 | emptyResult, stripInternal | **ENGINE** | Schema/utility |
| 529-580 | `compile()` | **ENGINE** (coupled) | Pipeline generic, rule dispatch coupled |
| 584-598 | `compileTeaser()` | **RULES** | References SW-Intel module name |
| 602-656 | COGNITION_SLICE_VOCABULARY + CONFIDENCE_EXECUTIVE | **VOCABULARY** / **ENGINE** | Slices are vocabulary; confidence labels are engine |
| 660-715 | CLASS_RISK_LABEL + `deriveDomainRiskProfile()` | **VOCABULARY** / **ENGINE** (coupled) | Labels are vocabulary; mechanism is engine |
| 717-768 | `synthesizeBoardroomNarrative()` + `derivePostureLabel()` | **ENGINE** (coupled) | Mechanism generic, narrative templates coupled |
| 770-891 | `forBoardroom()` | **ENGINE** (coupled) | Shape generic, vocabulary lookups coupled |
| 895-918 | resolveSourceConditions, deriveCombinationExplanation | **ENGINE** / **VOCABULARY** | Mechanism is engine; explanation text is vocabulary |
| 920-946 | deriveRelationshipVerb, compileRelationshipSentence | **ENGINE** (coupled) | Verb derivation pure; sentence has combination-specific text |
| 948-975 | deriveBalancedConfidenceSentence, deriveBalancedSynthesis | **ENGINE** | Domain-generic |
| 977-1080 | `forBalanced()` | **ENGINE** (coupled) | Shape generic, vocabulary lookups coupled |
| 1084-1109 | `forOperator()` | **ENGINE** | Pure shape transformation |
| 1113-1144 | `forInvestigation()` | **ENGINE** | Pure shape transformation |

**ConsequenceCompiler.js: ~130 lines VOCABULARY, ~155 lines RULES, ~870 lines ENGINE (of which ~570 need parameterization)**

---

## 7. FINAL BOUNDARY MAP

### 7.1 Aggregate by Concern

| Concern | CognitionOntology | SignalSynthesisEngine | ConsequenceCompiler | TOTAL |
|---|---|---|---|---|
| **VOCABULARY** | ~600 | ~150 | ~130 | **~880 lines** |
| **RULES** | 0 | ~1200 | ~155 | **~1355 lines** |
| **ENGINE** | ~100 | ~90 | ~870 | **~1060 lines** |
| **TOTAL** | ~700 | ~1440 | ~1155 | **~3295 lines** |

### 7.2 Percentage Distribution

| Concern | Lines | Percentage |
|---|---|---|
| VOCABULARY | ~880 | ~27% |
| RULES | ~1355 | ~41% |
| ENGINE | ~1060 | ~32% |

### 7.3 ENGINE Sub-Classification

| ENGINE Type | Lines | Percentage of Engine |
|---|---|---|
| **PURE ENGINE** (zero domain references) | ~300 | ~28% |
| **ENGINE WITH COUPLING** (generic mechanism, domain-specific reference) | ~760 | ~72% |

### 7.4 Coupling Point Count

| Coupling Type | Count |
|---|---|
| Vocabulary constant import | 8 |
| Hardcoded condition/consequence type ID | 7 |
| Hardcoded combination pattern definition | 3 |
| Hardcoded narrative template | 3 |
| Hardcoded signal family prefix | 1 |
| Hardcoded rule function call | 11 (in synthesize()) |
| **Total coupling points** | **~25** (affecting ~15 functions) |

---

## 8. CONSTITUTIONAL FINDING

### The Boundary

```
PI CORE = ENGINE (~1060 lines, 32%)
    ├── Pure Engine:    ~300 lines — zero-modification portability
    └── Coupled Engine: ~760 lines — ~25 parameterization points

DOMAIN COGNITION = VOCABULARY + RULES (~2235 lines, 68%)
    ├── VOCABULARY: ~880 lines — authored definitions
    └── RULES:     ~1355 lines — deterministic transformations
```

### The Discovery

The engine is NOT the three files. The engine is the ~1060 lines of domain-independent machinery INSIDE the three files, currently entangled with ~2235 lines of SW-Intel domain content.

The entanglement is NOT architectural — it is implementational. Every coupling point is a vocabulary import or a hardcoded ID reference that could be replaced with a function parameter without changing the mechanism.

No engine MECHANISM references domain semantics. The engine processes:
- Strings it groups (consequence_type_id)
- Numbers it compares (severity ranks, scope ranks)
- Arrays it merges (source_conditions, evidence_refs)
- Shapes it assembles (consequence objects, projection objects)
- Graphs it traverses (upstream/downstream refs)
- Patterns it matches (co-presence at same locus)
- Verbs it derives (from structural comparison)

The engine does not know what COORD_FRAG means, what a COMPOUND_ZONE is, or why DELIVERY_PRESSURE_CONCENTRATION matters. It knows that two things with the same locus key should be deduplicated, that co-present things with matching pattern IDs should be combined, and that wider scope than the primary means "converges with."

### What This Makes Precise

**PI Core:** The engine is PI Core infrastructure. It is the cognition processing machinery. It governs compilation, deduplication, combination detection, risk profiling, and persona projection. Modifications to the engine are G1 streams that affect ALL domain modules.

**Domain Cognition:** SW-Intel is the first vocabulary/rule package running on this engine. It is not the engine. Removing SW-Intel vocabulary and rules leaves a complete, operational engine waiting for a domain module to register.

**The boundary is real.** It is not a future aspiration. It exists in the current code — obscured by implementational coupling, but architecturally clean. The ~25 coupling points are the cost of extraction. The cost is parameterization, not redesign.
