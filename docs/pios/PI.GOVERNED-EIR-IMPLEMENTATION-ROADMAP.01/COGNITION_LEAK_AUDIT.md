# Cognition-Leak Audit — EIR, BOARDROOM, BALANCED

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture-Consuming)
**Date:** 2026-06-01
**Scope:** Formal audit of domain cognition trapped inside consumer projection functions

---

## 1. Purpose

This audit classifies every field produced by three consumer projection functions — `ExecutiveIntelligenceSynthesis.synthesize()` (EIR), `ConsequenceCompiler.forBoardroom()` (BOARDROOM), and `ConsequenceCompiler.forBalanced()` (BALANCED) — into two categories:

- **DOMAIN COGNITION** — audience-independent, deterministic, reusable computation that belongs in the cognition package (PICP)
- **NARRATIVE PROJECTION** — audience-specific framing that legitimately belongs in the consumer layer

The audit answers: is cognition leaking into consumers that should exist at the package layer?

---

## 2. Critical Architectural Finding

**None of the three functions read PICP.**

| Function | Reads from | PICP in call chain? |
|----------|-----------|---------------------|
| `ExecutiveIntelligenceSynthesis.synthesize()` | `picp.cognition_objects` directly | Reads PICP objects but bypasses PRE |
| `ConsequenceCompiler.forBoardroom()` | `consequenceResult`, `synthesisResult` | No — pre-PICP computation |
| `ConsequenceCompiler.forBalanced()` | `consequenceResult`, `synthesisResult` | No — pre-PICP computation |

EIR reads PICP objects directly (bypassing PRE). BOARDROOM and BALANCED bypass PICP entirely — they tap the same upstream substrate (`compile()` output + raw `synthesisResult.conditions`) that the PICP materializers also consume. These are **sibling taps on the same raw data**, not downstream consumers of PICP.

The PICP materializers produce equivalent cognition objects, but the rendering path and the PICP path are disconnected. This is the structural gap — not missing computation, but disconnected computation.

---

## 3. EIR Synthesis — Classification

**Source:** `app/execlens-demo/lib/lens-v2/consumers/eir/ExecutiveIntelligenceSynthesis.js`

### 3.1 Structural Pattern

Every finding across 9 chapters follows a consistent 4-field structure:

| Field | Classification | Boundary rule |
|-------|---------------|---------------|
| `observed` | DOMAIN COGNITION | Audience-independent structural facts: counts, severities, file names, class keys, ratios |
| `matters` | NARRATIVE PROJECTION | Why this fact matters, framed for an executive reader |
| `operational_implication` | NARRATIVE PROJECTION | What it means for how work is done |
| `leadership_implication` | NARRATIVE PROJECTION | Pattern-matching to what leadership already feels |

### 3.2 Chapter-Level Classification

| Chapter | `observed` fields | `matters` / implication fields | Ratio |
|---------|-------------------|-------------------------------|-------|
| 1. executive_brief | Convergence center count/locations, condition types per center, ceiling present/absent, S-level, Q-class | Multi-class convergence framing, "not minor code quality issues", determinism claim | ~40% DOMAIN |
| 2. program_overview | File count, import edges, class/function counts, domain/cluster count | "Import graph is the structural foundation" — recontextualization | ~50% DOMAIN |
| 3. structural_story | Bridge/articulation counts, constriction points, hotspot files, divergence pairs | Serialization framing, blast radius framing, governance invalidation | ~40% DOMAIN |
| 4. pi_findings | Condition instance count, severity distribution, per-condition structural facts | Per-condition executive narrative (matters/operational/leadership) | ~35% DOMAIN |
| 5. sw_intelligence | Active behavioral classes, class key, risk label, detection rate, suppressed/unmeasured counts | Dominant class interpretation, absence-as-evidence framing | ~50% DOMAIN |
| 6. risk_landscape | Local/regional/systemic consequence types with severity, emergent convergence paths | "Cannot be addressed through localized fixes", amplification framing | ~40% DOMAIN |
| 7. operational_ceiling | Ceiling present/absent, qualification class, drivers, constraint breakdown, blockers | "Structurally reinforced ceiling", remediation shape framing | ~45% DOMAIN |
| 8. detection_boundary | Per-type measurement capability, active detection count | "Invisible to traditional engineering tools" | ~40% DOMAIN |
| 9. executive_verdict | S-level, Q-class, convergence summary, ceiling state | "Not quality defects... structural execution constraints" | ~30% DOMAIN |

### 3.3 Key Domain Cognition Leak

**`identifyDominantPattern()`** — the most significant domain cognition function trapped inside EIR. It computes:

- `class_key` — combined behavioral class string (e.g. "ABCD")
- `active_classes` — list of activated classes
- `risk_label` — from `CLASS_RISK_LABEL` lookup
- `ceiling_flags` — `architecture_sensitive`, `staffing_sensitive`
- `dominant_severity` — highest severity across all conditions
- `total_active_conditions` — count
- `convergence_count` — from tension_map convergence centers
- `systemic_exposure_count` — from exposure_assessment

This function is reused across chapters 1, 4, 5, and 9. It has zero audience-specific language. It is cross-object correlation that no single PICP object contains. This is a **missing cognition object**.

### 3.4 EIR Leak Ratio

**~40% DOMAIN COGNITION / ~60% NARRATIVE PROJECTION**

The 60% narrative projection is genuine consumer-exclusive work: chapter arc, executive framing, leadership pattern-matching. A Consumer Intelligence Module for EIR is justified.

---

## 4. BOARDROOM — Classification

**Source:** `app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js` — `forBoardroom()`

### 4.1 Field-Level Classification

**DOMAIN COGNITION fields:**

| Field | Content |
|-------|---------|
| `posture_severity` | Raw severity enum (NOMINAL → CRITICAL) |
| `posture_scope` | SYSTEMIC / REGIONAL / LOCAL |
| `primary_locus` | Topology location (domain display name) |
| `consequence_count` | Passthrough from compile() |
| `systemic_count` | Passthrough from compile() |
| `overall_confidence` | Raw governance enum (GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY) |
| `domain_concentration[].domain` | Domain name |
| `domain_concentration[].condition_count` | Conditions per domain |
| `domain_concentration[].weight` | Fractional weight |
| `domain_concentration[].consequence_types` | Consequence type IDs per domain |
| `domain_narratives[].risk_shape` | `gravity_well`, `fragile_concentrated`, `pressure_concentration`, `compound` — deterministic from class combination |
| `domain_narratives[].classes` | Class key string (e.g. "AB", "ABC") |
| `domain_narratives[].domain` | Domain name |
| `domain_narratives[].condition_count` | Count |
| `domain_narratives[].weight` | Fractional weight |
| `domain_narratives[].consequence_count` | Count |
| `cognition_slices[].condition_type` | Raw condition enum |
| `cognition_slices[].severity` | Raw severity |
| `cognition_slices[].confidence` | Raw governance enum |
| `cognition_slices[].evidence_refs` | Evidence linkage |
| `cognition_slices[].source_signal_ids` | Signal lineage |
| `consequence_themes[].theme_id` | Consequence type enum |
| `consequence_themes[].severity` | Raw severity |
| `consequence_themes[].scope` | Raw scope |
| `consequence_themes[].source_count` | Source condition count |
| `consequence_themes[].is_combination` | Boolean flag |

**NARRATIVE PROJECTION fields:**

| Field | Content |
|-------|---------|
| `posture_label` | "Systemic Operational Fragility", "Multi-Factor Structural Stress" — executive label |
| `overall_confidence_label` | "Governed", "Advisory-bound" — human-readable string |
| `cognition_slices[].executive_name` | "Pressure Convergence" — executive vocabulary |
| `cognition_slices[].operational_meaning` | Localized sentence per domain from `COGNITION_SLICE_VOCABULARY` |
| `cognition_slices[].confidence_label` | Human-readable confidence string |
| `consequence_themes[].theme_label` | "Coordination Fragility" — executive label |
| `consequence_themes[].description` | Authored operational sentence from `CONSEQUENCE_VOCABULARY` |
| `domain_narratives[].risk_label` | "flow pressure on a concentrated structure..." — authored prose |
| `executive_synthesis` | "Auth is your structural gravity well..." — full executive sentence |
| `combined_synthesis` | Full synthesized posture sentence with confidence caveat |

### 4.2 Key Domain Cognition Leaks

1. **`domain_concentration`** — domain-grouped consequence posture with fractional weights. Pure deterministic computation: group conditions by domain, count, compute weight, collect consequence types. No BOARDROOM-specific dependency. Any consumer (BALANCED, EIR, OPERATOR) would benefit from this grouping.

2. **`risk_shape` via `deriveDomainRiskProfile()`** — structural shape classification from behavioral class set. `gravity_well` when classes A+C present, `fragile_concentrated` when B+C present, etc. Deterministic lookup from class combination. Reusable by every consumer.

3. **`CONDITION_CONSEQUENCE_MAP`** — inline duplication of the same condition→consequence mapping that already governs `compile()`. The mapping is declared twice: once as `mapCondition()` rules in the compiler, once as a static lookup table inside `forBoardroom()`.

### 4.3 BOARDROOM Leak Ratio

**~55% DOMAIN COGNITION / ~45% NARRATIVE PROJECTION**

The 45% narrative projection is genuine consumer-exclusive work: executive synthesis sentences, posture labels, consequence theme descriptions. A Consumer Intelligence Module for BOARDROOM is justified — but more than half of what it currently computes should be upstream in PICP.

---

## 5. BALANCED — Classification

**Source:** `app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js` — `forBalanced()`

### 5.1 Field-Level Classification

**DOMAIN COGNITION fields:**

| Field | Content |
|-------|---------|
| `posture_label` | Same `derivePostureLabel()` as BOARDROOM — shared computation |
| `posture_severity` | Raw severity |
| `posture_scope` | Raw scope |
| `primary_locus` | Topology location |
| `consequence_count` | Passthrough |
| `systemic_count` | Passthrough |
| `overall_confidence` | Raw governance enum |
| `primary_story.consequence_type_id` | Consequence type |
| `primary_story.severity` | Raw severity |
| `primary_story.scope` | Raw scope |
| `primary_story.locus` | Topology location |
| `primary_story.source_conditions` | Resolved condition types |
| `primary_story.evidence_refs` | Evidence linkage |
| `primary_story.source_signal_ids` | Signal lineage |
| `primary_story.is_combination` | Boolean |
| `reinforcement_flow[].consequence_type_id` | Consequence type |
| `reinforcement_flow[].severity` | Raw severity |
| `reinforcement_flow[].evidence_refs` | Evidence linkage |
| `reinforcement_flow[].relationship_verb` | `reinforces` / `amplifies` / `widens` / `concentrates` / `converges with` — structural causal relationship |
| `ontology_groups[].class_id` | A / B / C / D / E classification |
| `ontology_groups[].conditions[].condition_type` | Raw condition type |
| `ontology_groups[].conditions[].domain` | Domain display name |
| `ontology_groups[].conditions[].severity` | Raw severity |
| `ontology_groups[].conditions[].confidence` | Raw governance enum |

**NARRATIVE PROJECTION fields:**

| Field | Content |
|-------|---------|
| `overall_confidence_label` | "Governed", "Advisory-bound" |
| `combined_synthesis` | "[PostureLabel] concentrated in [locus] — [N] structural dynamics converge..." |
| `primary_story.title` | Operator consequence title |
| `primary_story.operational_implication` | Authored operational sentence |
| `primary_story.confidence_label` | Display string |
| `primary_story.combination_explanation` | Explanatory text |
| `reinforcement_flow[].title` | Operator-framed label |
| `reinforcement_flow[].operational_implication` | Authored sentence |
| `reinforcement_flow[].relationship_sentence` | Verbal rendering of domain verb for BALANCED reader |
| `confidence_sentence` | Full explanatory sentence |
| `ontology_groups[].class_name` | "Flow & Propagation" — executive framing |
| `ontology_groups[].class_question` | "Where is operational flow concentrating...?" — authored question |
| `ontology_groups[].conditions[].executive_name` | "Pressure Convergence" — executive vocabulary |
| `ontology_groups[].conditions[].operational_meaning` | Localized narrative sentence |
| `ontology_groups[].conditions[].confidence_label` | Display string |

### 5.2 Key Domain Cognition Leaks

1. **`relationship_verb`** — the most architecturally significant domain cognition trapped in any consumer function. `deriveRelationshipVerb()` computes a causal relationship between two consequences from locus comparison and scope rank: `reinforces` (same locus, same scope), `amplifies` (same locus, higher scope), `widens` (different locus), `concentrates` (same locus, lower scope), `converges with` (default). This encodes real structural causality. EIR, BOARDROOM, OPERATOR, DENSE — all could use this.

2. **`ontology_groups` structure** — grouping conditions by behavioral class (A-E) is pure domain computation. The structure (which conditions belong to which class) is audience-independent. Only the labels (`class_name`, `class_question`) are BALANCED-specific.

3. **Primary consequence selection** — identifying which consequence is "primary" (highest severity, broadest scope) is domain logic, not audience-specific.

### 5.3 BALANCED Leak Ratio

**~55% DOMAIN COGNITION / ~45% NARRATIVE PROJECTION**

The 45% narrative projection is genuine consumer-exclusive work: reinforcement sentences, ontology class questions, operational meaning narratives, combined synthesis. A Consumer Intelligence Module for BALANCED is justified — but the reinforcement graph and ontology structure should be upstream in PICP.

---

## 6. Cross-Consumer Leak Summary

### 6.1 Domain Cognition Trapped in Consumers

| Leaked Domain Cognition | Currently trapped in | Reusable by | Should exist in |
|------------------------|---------------------|-------------|----------------|
| Combined risk profile (class key, risk label, ceiling flags) | EIR `identifyDominantPattern()` | All consumers | PICP — cross-object synthesis object |
| Domain-grouped consequence posture with weights | BOARDROOM `forBoardroom()` | BALANCED, EIR, OPERATOR | PICP — domain concentration object |
| Structural risk shape per domain (`gravity_well`, `fragile_concentrated`...) | BOARDROOM `deriveDomainRiskProfile()` | All consumers | PICP — domain risk profile |
| Causal relationship verbs between consequences | BALANCED `deriveRelationshipVerb()` | All consumers | PICP — reinforcement graph |
| Ontology group structure (conditions → behavioral class A-E) | BALANCED `forBalanced()` | BOARDROOM, EIR, DENSE | PICP — partially in `tension_map.behavioral_class_activation` |
| Primary consequence selection | BALANCED `forBalanced()` | BOARDROOM, EIR | PICP — consequence ranking |
| Condition→consequence mapping (static lookup) | BOARDROOM (duplicated inline) | N/A — already in `compile()` | Remove duplication |

### 6.2 Leak Ratios

| Consumer | DOMAIN COGNITION | NARRATIVE PROJECTION | CIM Justified? |
|----------|-----------------|---------------------|---------------|
| EIR | ~40% | ~60% | YES — narrative arc, chapter structure, leadership framing |
| BOARDROOM | ~55% | ~45% | YES — executive synthesis, posture labels, consequence themes |
| BALANCED | ~55% | ~45% | YES — reinforcement sentences, ontology questions, operational meaning |

### 6.3 Shared Computation Not Shared

| Computation | forBoardroom | forBalanced | EIR | Currently shared? |
|------------|-------------|-------------|-----|------------------|
| `derivePostureLabel()` | YES | YES | NO (own logic) | Partially — shared between BOARDROOM and BALANCED only |
| Domain concentration grouping | YES | NO | NO | Not shared |
| Risk shape classification | YES | NO | NO | Not shared |
| Relationship verb computation | NO | YES | NO | Not shared |
| Ontology class grouping | NO | YES | NO | Not shared |
| Cross-object combined profile | NO | NO | YES | Not shared |

---

## 7. Architectural Implications

### 7.1 The Governing Rule

A computation belongs in **PICP** if:
1. **Audience-independent** — same result regardless of who reads it
2. **Deterministic** — same input produces same output
3. **Reusable** — useful to more than one consumer

A computation belongs in the **Consumer layer** if:
1. **Audience-specific** — framed for a particular reader type
2. **Narrative** — tells a story rather than states a fact
3. **Consumer-exclusive** — has no value to other consumers

**In one sentence:** If you can compute it without knowing who will read it, it belongs in PICP.

### 7.2 What This Means for the Architecture

The current architecture has two disconnected computation paths:

```
                    ┌─ SSE.synthesize() ──→ CC.compile() ──→ forBoardroom() ──→ UI
Evidence ──→ CIP ──┤                                     ──→ forBalanced()  ──→ UI
                    │                                     ──→ forOperator()  ──→ UI
                    │
                    └─ PICRRuntime ──→ PICPProducer ──→ PRECore ──→ [no rendering consumer]
```

Path 1 (top) runs live in the UI. It contains domain cognition trapped in consumer functions.
Path 2 (bottom) produces equivalent cognition objects via materializers. It has no rendering consumer.

The resolution is to converge these paths:

```
Evidence ──→ CIP ──→ PICR + Domain Modules ──→ PICP ──→ PRE ──→ Consumer Synthesis ──→ UI
```

Domain cognition (identified in §6.1) moves upstream into PICP via domain module materializers. Consumer Intelligence Modules (EIR, BOARDROOM, BALANCED) consume PICP through PRE and add only narrative projection.

### 7.3 Candidate New PICP Objects (from leaked domain cognition)

| Candidate Object | Source of leaked cognition | Content |
|-----------------|--------------------------|---------|
| `combined_risk_profile` | EIR `identifyDominantPattern()` | Class key, active classes, risk label, ceiling flags, dominant severity, convergence count, systemic exposure count |
| `domain_concentration` | BOARDROOM `forBoardroom()` | Per-domain condition grouping, weights, consequence types, risk shape, behavioral class key |
| `reinforcement_graph` | BALANCED `deriveRelationshipVerb()` | Causal relationships between consequences: amplifies, reinforces, widens, concentrates, converges with |

These candidates would require 7-gate qualification before promotion to formal cognition objects. This audit identifies them as domain cognition — it does not authorize their promotion.

---

## 8. Audit Verdict

**Cognition leak confirmed across all three consumers.**

- All three compute audience-independent domain cognition inside consumer projection functions
- BOARDROOM and BALANCED bypass PICP entirely (pre-PICP substrate tap)
- EIR reads PICP but bypasses PRE (direct object access)
- ~55% of BOARDROOM and BALANCED output is domain cognition; ~40% of EIR output is domain cognition
- Three specific domain cognition assets are identified as candidates for PICP promotion: combined risk profile, domain concentration, reinforcement graph
- The rendering path and the PICP path are structurally disconnected — convergence is the architectural priority

**Consumer Intelligence Modules remain justified for all three** — the ~45-60% narrative projection content is genuine consumer-exclusive work that adds decision value beyond raw cognition projection.
