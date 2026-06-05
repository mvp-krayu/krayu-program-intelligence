# COGNITION INVENTORY — ConsequenceCompiler Forensic Analysis

Stream: PI.CONSEQUENCE-COMPILER-COGNITION-FORENSICS.01 | Classification: G1 | Branch: feature/runtime-demo

---

## Finding

The ConsequenceCompiler performs **7 distinct cognitive functions** across **3 cognition stages** spanning Strata A through D. None were designed as cognitive functions — they emerged from implementation. This is why the runtime experiment (PI.SURFACE-RELATIONSHIP-TRAVERSAL.01) elevated the compiler from "projection utility" to "candidate core cognition mechanism": it is already doing what the Surface Relationship Graph proposed to do, but at the correct abstraction layer (conditions, not surfaces).

---

## 1. Stage 1 — Consequence Derivation

### Function 1: Condition→Consequence Mapping

Source: `ConsequenceCompiler.js` lines 211-332 (`mapDPC`, `mapDCkP`, `mapPA`, `mapSMC`, `mapCDCP`, `mapEF`, `mapEC`, `mapSBD`, `mapCI`, `mapGCS`, `mapCC`)

11 condition types route through deterministic rules to produce 8 primitive consequence types. Each mapping function applies contextual modifiers:
- `clusterFanAsymmetry()` thresholds (lines 115-122)
- `hubInDegree()` checks (lines 124-133)
- Structural enrichment flags (`_has_hub_fragility`, `_has_boundary_leak`)

This is **classification with structural context**. Same conditions + same structural context → same consequences every time. ZERO interpretive authority.

### Function 2: Evidence Deduplication with Severity Escalation

Source: `ConsequenceCompiler.js` lines 336-372 (`deduplicateConsequences`)

Groups consequences by `consequence_type_id + locus_key`. Merges source evidence arrays. Escalates severity to the maximum of contributing sources. Preserves all evidence references and derivation traces through merge.

This is **governed evidence fusion** — not summarization but deterministic merge with traceable escalation. Every merged consequence retains the full provenance of its contributing sources.

### Function 3: Combination Pattern Detection

Source: `ConsequenceCompiler.js` lines 458-501 (`detectCombinations`)

Three named patterns detected by same-locus co-presence:

| Pattern | Detection Rule | Severity |
|---|---|---|
| `AMPLIFIED_DEP_FRAG` | COORD_FRAG from DPC + DEP_AMP from DCkP at same locus | Base MAX |
| `STRUCT_GRAVITY_WELL` | DEL_EXP from DPC + RESIL_DEF from SMC at same locus | Base MAX |
| `SYSTEMIC_OP_FRAG` | 3+ atomics with 3+ primitive types at same locus | Escalated one level above MAX (§6.1) |

This is the **emergence mechanism** the Surface Relationship Graph hypothesis was trying to build. The compiler already detects structural emergence through co-presence analysis at condition granularity — exactly where the runtime experiment proved emergence lives.

The combination patterns are the first objects in the system that consume OTHER cognition outputs (atomic consequences), not evidence directly. This is Tier 2 materialization (per TIERED_MATERIALIZATION_FINDING.md) — but at the condition level, not the surface level.

---

## 2. Stage 2 — Domain Risk Profiling

### Function 4: Ontology Classification

Source: `ConsequenceCompiler.js` lines 652-700 (`CONDITION_ONTOLOGY_CLASS`, `CLASS_RISK_LABEL`, `deriveDomainRiskProfile`)

Maps each condition type to one of 5 ontology classes:

| Class | Name | Question |
|---|---|---|
| A | Flow / Delivery | Where does work flow break? |
| B | Concentration / Dependency | Where does dependency concentrate? |
| C | Coupling / Propagation | Where does change propagate? |
| D | Mass / Gravity | Where does structural weight accumulate? |
| E | Boundary / Governance | Where do boundaries diverge? |

Then computes a domain's **risk shape** from the set of active classes. 31 pre-defined class combinations map to named risk labels:

- A alone = "delivery pressure without structural amplification"
- AB = "flow and concentration compounding"
- ABD = "flow, concentration, and coupling converging — everything flows through a rigidly locked region"
- ABCDE = "full-spectrum structural stress"

This is **structural taxonomy** — it classifies what KIND of risk a domain carries, not just how severe it is. The 31-entry CLASS_RISK_LABEL table is a governed ontology of risk shapes.

### Function 5: Cross-Domain Narrative Synthesis

Source: `ConsequenceCompiler.js` lines 717-760 (`synthesizeBoardroomNarrative`)

Compares domain risk profiles and produces structural narrative:
- 1 domain → "gravity well" narrative with risk shape classification
- 2 domains → comparative: "distinct operational risks" when risk shapes differ
- 3+ domains → primary domain + count, with risk profile for primary

This is **deterministic comparative cognition** — it knows that two domains with different risk shapes require different narrative structure than two with the same shape. The comparison is structural, not interpretive.

---

## 3. Stage 3 — Persona Projection

### Function 6: Cognitive Compression for Audience

Source: `ConsequenceCompiler.js` forBoardroom (lines 770-891), forBalanced (lines 977-1080)

**forBoardroom produces:**
- Cognition slices: condition→executive concept with domain-localized operational meaning
- Consequence themes: grouped by type, severity-ranked, with source counts
- Domain concentration: weighted by condition count, producing structural weight distribution
- Domain narratives: risk-shape-classified per domain, comparative across domains
- Combined synthesis: postural summary with confidence boundary sentence

This is **cognitive compression** — reduces the full consequence set into executive-consumable structural objects while preserving evidence traceability through `evidence_refs` and `source_signal_ids`.

**forBalanced produces:**
- Primary story: highest-severity consequence with full evidence chain, combination explanation
- Reinforcement flow: each non-primary consequence receives a **relationship verb** (amplifies / reinforces / widens / concentrates / converges with) relative to the primary
- Ontology groups: conditions grouped by the 5 ontology classes, each with its class question
- Combined synthesis: postural summary with spatial widening detection

The reinforcement flow with relationship verbs (lines 920-946, `deriveRelationshipVerb`) is the **exact mechanism** the Surface Relationship Graph proposed — but operating at consequence granularity instead of surface granularity. The verb selection is deterministic:

| Condition | Verb | Meaning |
|---|---|---|
| Different locus | `widens` | Exposure extends spatially |
| Same locus, combination | `amplifies` | Structural compounding |
| Same locus, narrower scope | `concentrates` | Pressure intensifies locally |
| Same locus, broader scope | `converges with` | Broader dynamic converges |
| Same locus, same scope | `reinforces` | Structural pressure intensifies |

### Function 7: Evidence Exposure for Verification

Source: `ConsequenceCompiler.js` forOperator (lines 1084-1109), forInvestigation (lines 1113-1144)

**forOperator exposes:**
- Headline consequences with full derivation traces
- Decomposition availability and escalation reasons
- Full atomic set and compilation trace

This is **operational evidence exposure** — gives operators everything needed to act.

**forInvestigation exposes:**
- Complete atomic and combination consequence sets
- Activation rules (§4, §5.2, §6.1 references)
- Full derivation traces from consequence back to condition to signal
- Source signal IDs and evidence summaries with signal family classification

This is **forensic evidence substrate** — everything needed to verify that any consequence is traceable back through conditions to signals to evidence. Zero information loss from compile() through forInvestigation().

---

## 4. Stage Coverage

The ConsequenceCompiler performs cognition across **all three stages** that the Surface Relationship Graph proposed:

| Proposed Stage | Graph Hypothesis | ConsequenceCompiler Reality |
|---|---|---|
| **Observe** | Read surface outputs | Reads conditions (correct granularity) |
| **Relate** | Surface-to-surface edges | Condition co-presence + combination detection + reinforcement verbs |
| **Explain** | Graph traversal | Risk profiling + domain narrative synthesis + persona compression |

---

## 5. 22-Function Taxonomy Mapping

The 7 cognitive functions map to the 22-function taxonomy as candidate instances:

| Cognitive Function in Compiler | Candidate 22-Function Category | Stratum |
|---|---|---|
| Condition→Consequence mapping | Signal Transformation | A (Computational) |
| Evidence deduplication + escalation | Evidence Fusion | A (Computational) |
| Combination pattern detection | Emergence Detection | B (Orchestration) |
| Ontology classification (31 risk shapes) | Structural Classification | A (Computational) |
| Cross-domain narrative synthesis | Comparative Cognition | C (Synthesis) |
| Cognitive compression (BOARDROOM/BALANCED) | Audience Projection | D (Projection) |
| Evidence exposure (OPERATOR/INVESTIGATION) | Verification Substrate | D (Projection) |

The compiler spans Strata A through D in a single module. This is why it outperformed the graph: it is not a projection utility — it is a **multi-stratum cognition engine** that happens to be packaged as a single JavaScript module.

---

## 6. Architectural Significance

### 6.1 The Compiler Is Already Multi-Tier

The compiler's internal pipeline mirrors the tiered materialization finding:

```
Conditions (CIP-derived)
    ↓
Tier 1: Atomic consequences (mapCondition → makeAtomic)
    ↓
Tier 1b: Deduplicated atomics (deduplicateConsequences)
    ↓
Tier 2: Combination patterns (detectCombinations — consumes Tier 1 outputs)
    ↓
Tier 3: Domain risk profiles (deriveDomainRiskProfile — consumes conditions + ontology)
    ↓
Tier 4: Persona projections (forBoardroom/forBalanced — consumes all prior tiers)
```

This is staged cognition formation WITHIN a single module. Each tier consumes the prior tier's outputs, not the raw CIP.

### 6.2 The Relationship Vocabulary Already Exists

`deriveRelationshipVerb()` (lines 920-929) produces the exact edge vocabulary the graph hypothesis proposed:

- **amplifies** — structural compounding at same locus
- **reinforces** — pressure intensification at same locus
- **widens** — spatial extension to different locus
- **concentrates** — local intensification within narrower scope
- **converges with** — broader dynamic converging on same locus

These verbs are deterministic: same consequence pair → same verb. Same input → same relationship vocabulary → same causal narrative. The constitutional claim "traversal explains" holds — but the traversal is over consequences, not surfaces.

### 6.3 The 31-Entry Risk Shape Ontology Is Unrecognized

CLASS_RISK_LABEL (lines 660-692) contains 31 entries mapping ontology class combinations to named risk narratives. This is a **governed structural taxonomy of risk shapes** — a closed vocabulary that classifies what kind of structural risk exists, not just that risk exists. It was never recognized as an architectural contribution because it lives inside a function assumed to be a narrative formatter.

### 6.4 What This Changes for PICR/PICP Architecture

The ConsequenceCompiler currently lives at the boundary between PICR and PRE:
- Functions 1-5 (derivation, profiling, classification) are **PICR cognition formation** — deterministic, same input → same output
- Functions 6-7 (persona projection) are **PRE Zone A** — audience-appropriate rendering of deterministic cognition

The compiler is architecturally split but packaged as one module. Any PICR/PICP formalization must recognize this split:
- `compile()` + `deriveDomainRiskProfile()` + `synthesizeBoardroomNarrative()` → PICR
- `forBoardroom()` + `forBalanced()` + `forOperator()` + `forInvestigation()` → PRE Zone A

---

## 7. Evidence

All line references verified against: `app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js` (~1158 lines)

Runtime validation: PI.SURFACE-RELATIONSHIP-TRAVERSAL.01/RUNTIME_VALIDATION.md (ConsequenceCompiler vs Surface Relationship Graph experiment on BlueEdge genesis_e2e_03)

Prior stream establishing elevation: PI.SURFACE-RELATIONSHIP-TRAVERSAL.01/CLOSURE.md §10 — "ConsequenceCompiler elevated to candidate core cognition mechanism: VALIDATED by runtime experiment"
