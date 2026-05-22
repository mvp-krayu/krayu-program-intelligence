# LEARNING-TO-CAPABILITY PIPELINE

> **Status:** LOCKED — How repeated learning events become reusable capabilities, then future marketplace modules.

---

## 1. The Pipeline

```
ONBOARDING EXPERIENCE
  → LEARNING EVENT (observed friction, gap, surprise)
  → PROPOSED (captured as governed learning object)
  → REVIEWED (operator validates significance)
  → PROMOTED (accepted as governed learning)
  → CONSUMABLE (activated for pipeline consumption)
  → CAPABILITY CANDIDATE (repeated pattern across specimens)
  → MODULE CANDIDATE (reusable governed capability)
```

This is how the future marketplace grows honestly: by extracting repeated governed learning patterns from real onboarding experience — not by designing modules in abstraction.

---

## 2. Learning Event Sources

Every onboarding is a learning cycle. Sources of governed learning:

| Source | Learning Type | Example |
|--------|-------------|---------|
| Intake ambiguity | EVIDENCE_INTAKE | "Monorepo structure confused source boundary — need multi-root detection" |
| Missing adapters | EVIDENCE_INTAKE | "No Django REST adapter — REST API evidence missed" |
| Failed assumptions | SEMANTIC_DERIVATION | "Assumed Python package = single namespace — StackStorm uses 18 packages" |
| Extraction gaps | CODE_GRAPH_ENRICHMENT | "AST parser missed conditional imports — needs pattern extension" |
| Evidence gaps | EVIDENCE_INTAKE | "README evidence valuable but no extractor existed" |
| Hero Moment candidates | STRUCTURAL_DISCOVERY | "Unexpected bidirectional coupling between DCIM ↔ IPAM" |
| False positives | SEMANTIC_DERIVATION | "Layer label parsing artifacts promoted to capabilities — SDC needs guard" |
| Semantic conflicts | SEMANTIC_PROPOSITION | "Domain ID mismatch between canonical CSR and SDC candidate" |
| Governance friction | GOVERNANCE_WORKFLOW | "Operator rejected propositions revealing pipeline defect" |
| Operator corrections | GOVERNANCE_WORKFLOW | "Operator contested uniform confidence for WEAKLY_GROUNDED domains" |
| Replay anomalies | REPLAY_VALIDATION | "Replay discovered inconsistency in enrichment pre-values" |
| Projection gaps | PROJECTION_QUALITY | "LENS projection missing for domain with PARTIAL grounding" |
| Narrative compression | CHRONICLE_QUALITY | "Chronicle chapter too dense — 8+ descent paths overwhelm" |

---

## 3. Learning Lifecycle States

| State | Authority | Description |
|-------|-----------|-------------|
| **OBSERVED** | AI or Pipeline | Friction, gap, or surprise detected during onboarding. Not yet formalized. |
| **PROPOSED** | AI or Pipeline | Formalized as `LRNE-*` learning event with evidence refs, category, capability class. |
| **REVIEWED** | Operator | Operator examines learning event. Validates significance, accuracy, and relevance. |
| **PROMOTED** | Operator | Accepted as governed learning. Available for consumption declaration. |
| **CONSUMABLE** | Operator | Activated for specific pipeline consumers. Declared governance level (ADVISORY or GOVERNED_MUTATION). |
| **CAPABILITY_CANDIDATE** | Operator | Repeated across 3+ specimens. Pattern emerges. Reusable capability identified. |
| **MODULE_CANDIDATE** | Operator | Capability formalized as potential marketplace module. Specification drafted. |
| **SUPERSEDED** | Operator | Replaced by newer learning or rendered obsolete by architectural evolution. |
| **REJECTED** | Operator | Reviewed and determined not actionable. Preserved in lineage. |

### State Transitions

```
OBSERVED → PROPOSED         (AI/pipeline captures formally)
PROPOSED → REVIEWED         (operator examines)
REVIEWED → PROMOTED         (operator accepts as governed learning)
REVIEWED → REJECTED         (operator determines not actionable)
PROMOTED → CONSUMABLE       (operator activates for consumers)
CONSUMABLE → CAPABILITY_CANDIDATE  (pattern repeated across 3+ specimens)
CAPABILITY_CANDIDATE → MODULE_CANDIDATE  (capability formalized)
Any → SUPERSEDED            (replaced by newer learning)
```

**Critical constraint:** Every transition from PROPOSED onward requires operator decision. AI may propose; AI does not promote.

---

## 4. Capability Emergence Criteria

A learning becomes a CAPABILITY_CANDIDATE when:

1. **Repetition:** The same category of learning event appears in 3+ onboarding specimens
2. **Consistency:** The learning addresses the same structural gap each time
3. **Impact:** Resolving the learning measurably improves onboarding quality (fewer gaps, better confidence, faster progression)
4. **Generalizability:** The solution is not specimen-specific — it applies to the pipeline generically
5. **Governance fit:** The capability can be expressed as a governed, replay-safe, auditable pipeline enhancement

### Capability Classes (Current)

| Capability Class | Learning Source | Pipeline Target | Current State |
|-----------------|----------------|-----------------|---------------|
| SEMANTIC_DERIVATION | Tier classification gaps, SDC defects | Phase 3b | 5 PROPOSED learnings |
| EVIDENCE_INTAKE | Evidence type gaps, adapter gaps | Phase 2 | 2 PROPOSED learnings |
| CODE_GRAPH_ENRICHMENT | Extraction gaps, centrality patterns | Phase 3.6-3.7 | 1 PROPOSED learning |
| SPINE_MANAGEMENT | Consistency gaps, spine schema | Spine accumulation | 1 PROPOSED learning |
| GOVERNANCE_WORKFLOW | Process gaps, governance formalization | SQO workflow | 1 PROPOSED learning |
| SEMANTIC_PROPOSITION | Confidence, coverage, reconciliation | Phase 3c | 3 PROPOSED learnings |
| STRUCTURAL_DISCOVERY | Hero moments, topology patterns | Phase 3-3.7 | *New — from genesis* |
| CHRONICLE_QUALITY | Narrative patterns, density management | Chronicle composition | *New — from genesis* |

---

## 5. Module Emergence Criteria

A capability becomes a MODULE_CANDIDATE when:

1. **Maturity:** The capability has been CONSUMABLE for 5+ onboardings
2. **Stability:** No operator overrides or corrections needed in recent applications
3. **Isolation:** The capability can be packaged independently of the core pipeline
4. **Value:** The capability reduces onboarding time, improves quality, or enables new evidence types
5. **Governance:** The module can operate under governed contracts without requiring pipeline internals
6. **Commercial viability:** The module addresses a recurring customer need

### Module Candidate Types (Future)

| Module Type | Capability Source | Example |
|-------------|------------------|---------|
| Evidence Adapter | EVIDENCE_INTAKE | "Django REST Framework evidence extractor" |
| Language Enricher | CODE_GRAPH_ENRICHMENT | "TypeScript AST code-graph indexer" |
| Governance Template | GOVERNANCE_WORKFLOW | "Regulated industry governance overlay" |
| Industry Signal Pack | SEMANTIC_DERIVATION | "Financial services domain vocabulary" |
| Chronicle Template | CHRONICLE_QUALITY | "Standard onboarding chronicle generator" |

---

## 6. Growth Model

```
PHASE 1 (Clients 1-10):    LEARNING — capture everything
PHASE 2 (Clients 11-30):   PROMOTION — repeated learnings → consumable
PHASE 3 (Clients 31-50):   CAPABILITY — consumable patterns → capability candidates
PHASE 4 (Beyond 50):       MODULE — capabilities → marketplace modules
```

**Modules and marketplace are built while we grow.** They emerge from repeated governed onboarding patterns. They are not designed prematurely in abstraction.

---

## 7. Anti-Drift Rules

1. **No premature module design.** Do not design modules before 3+ specimens exhibit the pattern.
2. **No autonomous promotion.** Every lifecycle transition requires operator decision.
3. **No AI authority escalation.** AI may propose learnings. AI does not promote capabilities.
4. **No marketplace prebuild.** Marketplace infrastructure comes AFTER module candidates exist.
5. **No Cortex before capabilities.** Cortex consumer architecture requires operational capabilities to consume.
6. **No hypothetical modules.** Only document modules that have been observed as capability candidates in real onboarding.

---

## 8. Current State

| Metric | Count |
|--------|-------|
| Total learning events captured | 15 (NetBox) + ongoing (StackStorm) |
| Learning lifecycle states represented | PROPOSED only |
| Operator promotions completed | 0 |
| Consumable learnings activated | 0 |
| Capability candidates identified | 0 (requires 3+ specimens) |
| Module candidates identified | 0 (requires capability maturity) |

**Maturity:** Learning capture OPERATIONAL. Promotion pipeline SPECIFIED_NOT_IMPLEMENTED. Capability emergence FUTURE. Module emergence FUTURE.

The honest state: the system captures learning. It does not yet promote learning to capability. That comes with more specimens and operator governance.
