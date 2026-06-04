# CONSTITUTIONAL IMPLICATIONS — Domain Cognition Engine Pattern

Stream: PI.DOMAIN-COGNITION-ENGINE-PATTERN.01 | Classification: G1 | Branch: main

---

## 1. Domain Modules Do Not Create Engines

The Domain Cognition Engine is shared PI Core infrastructure. Each Domain Module provides VOCABULARY (what the domain talks about) and RULES (how the domain interprets evidence) to a single governed engine. No module builds its own compilation pipeline, its own deduplication logic, its own combination detection, or its own persona projection shapes.

**Constitutional constraint:** If a proposed Domain Module requires modifying the ENGINE to function, either the engine has a gap that must be resolved for ALL modules, or the proposed module is not a valid Domain Module.

**Enforcement:** New Domain Modules are tested against the engine pattern before implementation. The test: can the module express its full vocabulary and rules using existing ENGINE interfaces?

---

## 2. Domain Modules Provide Vocabulary and Rules

A Domain Module is defined by exactly two contributions:

**VOCABULARY** — The authored, constitutional, static semantic inventory:
- Condition types (what structural phenomena the domain recognizes)
- Consequence types (what operational implications follow)
- Combination patterns (what emergent consequences arise from co-presence)
- Ontology classes (how conditions are behaviorally classified)
- Risk shape labels (how class combinations are named)
- Cognition slice names (how conditions translate to executive language)
- Guided interventions (what operator actions each condition enables)

**RULES** — The deterministic transformation logic:
- Feature extraction (signal properties → feature tags)
- Condition synthesis (tagged signals → structured conditions)
- Consequence mapping (conditions → consequence objects)

Everything else — the compilation pipeline, deduplication, combination detection, relationship verb derivation, persona projection shapes — comes from the ENGINE.

**Constitutional constraint:** If a Domain Module's VOCABULARY requires vocabulary shapes that do not match the existing pattern (a condition type without upstream/downstream graph, a consequence type without scope, a combination pattern without co-presence detection), the VOCABULARY SHAPE must be assessed for generalization before the module is accepted. Domain-specific shapes are a pattern violation — they fragment the engine.

---

## 3. The Shared Engine Is Governed Infrastructure

The ENGINE operates at PI Core level. It is not owned by any Domain Module. Modifications to ENGINE are G1 streams that affect all modules.

### 3.1 ENGINE Governance

| ENGINE Component | Modification Authority | Impact Scope |
|---|---|---|
| `deduplicateConsequences()` | G1 — PI Core only | All Domain Modules |
| `detectCombinations()` | G1 — PI Core only | All Domain Modules |
| `compile()` | G1 — PI Core only | All Domain Modules |
| `deriveRelationshipVerb()` | G1 — PI Core only | All Domain Modules |
| Persona projection shapes | G1 — PI Core only | All Domain Modules |
| `makeAtomic()` / `makeCombination()` | G1 — PI Core only | All Domain Modules |

### 3.2 VOCABULARY/RULES Governance

| Concern | Modification Authority | Impact Scope |
|---|---|---|
| Domain condition types | G2 — Domain Module stream | Single module only |
| Domain consequence types | G2 — Domain Module stream | Single module only |
| Domain combination patterns | G2 — Domain Module stream | Single module only |
| Domain ontology classes | G2 — Domain Module stream | Single module only |
| Domain feature extraction rules | G2 — Domain Module stream | Single module only |
| Domain condition synthesis rules | G2 — Domain Module stream | Single module only |
| Domain consequence mapping rules | G2 — Domain Module stream | Single module only |

This separation ensures that changes to SW-Intel vocabulary cannot break PMO, and changes to PMO vocabulary cannot break SW-Intel. Only ENGINE changes require cross-module assessment.

---

## 4. Persona Projections Are Reusable Compression Patterns

The 4 persona projection functions are not SW-Intel-specific rendering utilities. They are domain-generic cognitive compression patterns:

### 4.1 BOARDROOM — Executive Cognitive Compression

**Pattern:** Reduce the full consequence set into the minimum structure an executive needs to assess posture.

**Reusable components:**
- Cognition slices (condition → executive concept, domain-localized)
- Consequence themes (grouped by type, severity-ranked)
- Domain concentration (weighted distribution of conditions across domains)
- Domain narratives (risk-shape-classified per domain, comparative across domains)
- Combined synthesis (postural summary with confidence boundary)

**Why this generalizes:** Every domain module produces conditions that concentrate in domains (or workstreams, or portfolios). The compression pattern — group, weight, classify shape, compare, synthesize — is domain-independent.

### 4.2 BALANCED — Governed Causal Narrative

**Pattern:** Explain WHY the posture exists through a primary story with reinforcing dynamics.

**Reusable components:**
- Primary story (highest-severity consequence with full evidence chain)
- Reinforcement flow (each secondary consequence receives a relationship verb)
- Ontology groups (conditions classified by behavioral category with class questions)
- Combined synthesis (spatial widening detection)

**Why this generalizes:** The 5 relationship verbs (amplifies, reinforces, widens, concentrates, converges) describe structural dynamics between ANY consequence pair. They operate on locus comparison and scope ranking — not domain semantics.

### 4.3 OPERATOR — Operational Evidence Exposure

**Pattern:** Expose all evidence needed to act operationally.

**Reusable components:**
- Headline consequences (full derivation traces)
- Full atomic set (complete pre-dedup inventory)
- Compilation trace (statistics: inputs, suppressed, escalations)

**Why this generalizes:** Every domain module produces consequences from conditions from signals. The evidence chain shape is the same. The operator needs to see the chain — not domain-specific rendering.

### 4.4 INVESTIGATION — Forensic Evidence Substrate

**Pattern:** Expose everything needed to verify correctness.

**Reusable components:**
- Complete consequences with activation rules
- Atomic and combination inventories
- Full derivation traces from consequence → condition → signal
- Source signal IDs and evidence summaries

**Why this generalizes:** Verification is domain-independent. Checking that a consequence correctly derives from its conditions uses the same logic regardless of what the conditions describe.

---

## 5. Relationship to Existing Architecture

### 5.1 CIP/PICR/PICP/PRE Pipeline

The Domain Cognition Engine pattern maps precisely to the canonical pipeline:

| Pipeline Layer | Engine Concern |
|---|---|
| **CIP** (L0-L3) | Signal families, structural enrichment — the raw evidence |
| **PICR** (L4) | ENGINE + RULES — condition synthesis, consequence compilation, combination detection |
| **PICP** (L4 output) | Compilation result — the packaged cognition objects |
| **PRE** (L5) | Persona projection functions — `forBoardroom()`, `forBalanced()`, etc. |
| **Consumer** | LENS, EIR, Marketplace consumers |

The engine pattern does not add a new pipeline layer. It reveals internal structure within PICR: the ENGINE is the PICR machinery, VOCABULARY is the PICR's configuration, and RULES are the PICR's domain-specific transformation logic.

### 5.2 Marketplace Architecture

The marketplace model is: **Domain Modules × Projection Families × Consumers**.

The engine pattern makes this concrete:

- **Domain Modules** = VOCABULARY × RULES (per module)
- **Projection Families** = Persona projection functions parameterized by ProjectionConfig
- **Consumers** = LENS, EIR, Assessment Package, etc.

Adding a new Domain Module means providing new VOCABULARY and RULES. The ENGINE, the persona projections, and the consumer rendering remain unchanged. This is the consumer-genericity invariant proven operationally.

### 5.3 Three-Layer Architecture

The Three-Layer Architecture (PI Core / Orchestration-Agentic Runtime / Domain Cognition) maps to:

| Three-Layer | Engine Pattern |
|---|---|
| PI Core (~90%+) | ENGINE (shared infrastructure) |
| Orchestration-Agentic Runtime (~9%) | Not part of the cognition engine — sits above it |
| Domain Cognition (~1%) | VOCABULARY + RULES (per module) |

The engine pattern makes the "~1%" precise: a Domain Module is its VOCABULARY definitions + its RULES functions. The remaining 99% is shared.

---

## 6. Implications for Future Work

### 6.1 ENGINE Extraction

The current implementation has ENGINE, VOCABULARY, and RULES mixed across 3 files. The engine pattern identifies which functions are domain-generic and could be extracted into shared infrastructure. This extraction is NOT required for correctness — the current code works — but it would make the second Domain Module cheaper to build.

### 6.2 Vocabulary Registration

A formal vocabulary registration mechanism would allow Domain Modules to declare their VOCABULARY through a schema rather than through code. This is an optimization, not a prerequisite — SW-Intel proves the pattern works with code-defined vocabulary.

### 6.3 Engine Parameterization

The combination detection mechanism (`detectCombinations()`) currently has SW-Intel patterns hardcoded. Parameterizing it to accept pattern definitions from VOCABULARY would make it domain-generic WITHOUT changing the detection algorithm. The mechanism (co-presence at same locus) is already generic — only the pattern definitions are domain-specific.

### 6.4 What NOT To Build

- Do NOT build a PMO module to prove the pattern. The stub (PMO_ENGINE_STUB.md) proves pattern generality. Implementation requires PMO signal families and evidence sources that do not yet exist.
- Do NOT extract the engine before the second module is needed. Premature extraction optimizes for a future that may have different requirements.
- Do NOT generalize the vocabulary shapes beyond what SW-Intel requires. Generalization should be driven by the SECOND module's vocabulary needs, not by speculation.
