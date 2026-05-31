# Executive Intelligence Compiler — Specification

**Stream:** PI.EXECUTIVE-INTELLIGENCE-REPORT-COMPILER.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. System Identity

The **Executive Intelligence Compiler** (EIC) is the transformation system that converts governed structural evidence, synthesized conditions, compiled consequences, and cognition ontology into multi-format executive intelligence deliverables.

The EIC is NOT a document generator. It is a **cognition-to-intelligence transformer** — the final stage in the Program Intelligence pipeline that bridges the gap between operational cognition (what the system knows) and executive intelligence (what leadership can act on).

---

## 2. Position in the PI Pipeline

```
L0: Structure (40.x)
 ↓
L1: Signals + Enrichment (GenericSemanticPayloadResolver)
 ↓
L2: Conditions (SignalSynthesisEngine)
 ↓
L3: Consequences (ConsequenceCompiler)
 ↓
L3.5: Cognition Projection (forBoardroom / forBalanced / forOperator)
 ↓
L4: Executive Intelligence (EIC) ← THIS SPECIFICATION
 ↓
L4.5: Multi-Format Projection (report / summary / slides / appendix)
```

The EIC operates at **L4** — consuming L0–L3.5 outputs and producing intelligence artifacts. It is the first pipeline stage that operates under **75.x bounded interpretive authority** as a primary mode (not additive).

---

## 3. Input Contract

The EIC requires a **Compiled Intelligence Package** (CIP) as input. The CIP is assembled from existing pipeline outputs:

### 3.1 Required Inputs

| Input | Source | Layer | Required Fields |
|---|---|---|---|
| `fullReport` | GenericSemanticPayloadResolver | L0–L1 | signal_interpretations, structural_enrichment, semantic_domain_registry, pressure_zone_state, topology_summary, propagation_summary |
| `synthesisResult` | SignalSynthesisEngine.synthesize() | L2 | conditions[], active[], composites[], primary, summary |
| `consequenceResult` | ConsequenceCompiler.compile() | L3 | consequences[], atomic_consequences[], combination_consequences[], compilation_trace |
| `boardroomProjection` | ConsequenceCompiler.forBoardroom() | L3.5 | posture_label, cognition_slices[], consequence_themes[], domain_narratives[], executive_synthesis, combined_synthesis |
| `balancedProjection` | ConsequenceCompiler.forBalanced() | L3.5 | ontology_groups[], reinforcement_flow[], combined_synthesis |
| `cognitionOntology` | CognitionOntology | L2 (static) | CONDITION_ONTOLOGY_CLASS, ALL_NODES |
| `classRiskLabels` | ConsequenceCompiler.CLASS_RISK_LABEL | L3 (static) | 31 composite labels |
| `qualificationPackage` | SQO artifacts | L2 | promotion_state, revalidation_result, constitutional_anchor, chronicle_certification, proposition_review_state |

### 3.2 Optional Inputs

| Input | Purpose |
|---|---|
| `priorReport` | For delta analysis across time periods |
| `clientContext` | Industry, size, team topology (enriches audience calibration) |
| `reportConfig` | Chapter selection, audience tier, depth controls |

### 3.3 Input Validation

Before compilation begins:
1. All required inputs must be present and non-null
2. synthesisResult.conditions.length > 0 (at least one condition active)
3. consequenceResult must be consistent with synthesisResult (consequence source_conditions reference valid condition_ids)
4. qualificationPackage must be in terminal state (S-level assigned, revalidation complete)
5. boardroomProjection and balancedProjection must derive from the same consequenceResult

Validation failure → COMPILATION_BLOCKED

---

## 4. Compilation Stages

### Stage 1: Evidence Assembly

**Purpose:** Flatten all inputs into an indexed evidence repository that subsequent stages can query.

**Substeps:**
1. **Metric extraction** — harvest all numeric values from L0/L1 artifacts into a flat metric registry: `{ metric_id, value, source_artifact, source_field, unit, context }`
2. **Condition index** — build a queryable index of all active conditions: `{ condition_type, severity, domain_target, evidence_sources[], behavioral_class }`
3. **Consequence index** — build a consequence lookup: `{ consequence_type, severity, locus, source_conditions[], is_combination }`
4. **Qualification digest** — compress qualification artifacts into a provenance block: `{ s_level, revalidation_score, anchor_score, certification_score, proposition_counts }`
5. **Enrichment surface index** — index all enrichment surfaces with their top hotspots

**Output:** `EvidenceAssembly` — a structured index of all evidence available for compilation

**Reproducibility:** DETERMINISTIC

### Stage 2: Intelligence Compilation

**Purpose:** Derive second-order intelligence from the evidence assembly — findings that require cross-artifact reasoning.

**Substeps:**
1. **Convergence center identification** — identify domains where 3+ conditions co-locate (already done by COMPOUND_CONVERGENCE, but EIC adds the cross-center coupling analysis)
2. **Behavioral class activation** — map conditions to CONDITION_ONTOLOGY_CLASS, count per class, identify dominant classes
3. **Risk stratification** — classify risks as LOCALIZED (single file/module), REGIONAL (single domain), or SYSTEMIC (cross-domain or compound)
4. **Absence analysis** — compare active condition types against the full CONDITION_VOCABULARY to identify what did NOT activate and classify the absence: EXPECTED (requires temporal data), POSITIVE (no evidence of problem), or DEFERRED (measurement not yet available)
5. **Differentiator extraction** — for each active condition type, look up whether the detection method has a traditional analysis equivalent (stored as `traditional_detectability` on each CONDITION_VOCABULARY entry — this field does not yet exist and needs to be added)
6. **Cross-convergence coupling** — detect structural connections between convergence centers via propagation_summary
7. **Consequence interaction detection** — identify where consequences from independent conditions amplify each other at shared loci (already done by combination detection, but EIC adds the narrative interaction description)

**Output:** `IntelligenceCompilation` — second-order intelligence objects

**Reproducibility:** DETERMINISTIC (all logic is formalizable as rules)

### Stage 3: Narrative Synthesis

**Purpose:** Transform evidence and intelligence into human-readable narrative using bounded interpretive authority.

This is the stage where the EIC operates under **75.x authority** and where the distinction between "report compiler" and "document generator" matters most.

**Substeps:**
1. **Chapter plan generation** — determine which chapters to include based on active findings and report configuration. Default 10-chapter structure (per BlueEdge specimen):
   - Ch 1: Executive Brief (always)
   - Ch 2: Program Overview (always)
   - Ch 3: Structural Execution Story (when constriction or propagation findings exist)
   - Ch 4: Findings (one subsection per finding type that meets inclusion threshold)
   - Ch 5: SW-INTEL Assessment (when behavioral class data available)
   - Ch 6: Risk Landscape (when 2+ convergence centers exist)
   - Ch 7: CTO/Architect Observations (when audience includes technical leadership)
   - Ch 8: Traditional Differentiators (when competitive positioning is requested)
   - Ch 9: Recommendations (always)
   - Ch 10: Executive Verdict (always)

2. **Finding narrative generation** — for each included finding, produce 4-part narrative:
   - **Observed:** Evidence-anchored observation (T1+T3 dominated — automatable)
   - **Matters:** Operational consequence (T4+T5 — partially automatable with CONDITION_VOCABULARY.consequence and COGNITION_SLICE_VOCABULARY.localize())
   - **Operational Implication:** Technical audience translation (T6 — requires pre-defined vocabulary per condition type)
   - **Leadership Implication:** Executive audience translation (T6+T7 — requires bounded interpretive authority)

3. **Metaphor injection** — select appropriate metaphors from a governed metaphor vocabulary:
   - `GRAVITY_WELL` — when STRUCT_GRAVITY_WELL combination detected
   - `NARROW_PASSAGE` — when EXECUTION_CONSTRICTION detected
   - `BLAST_RADIUS` — when DEPENDENCY_CHOKE_POINT with in_degree > 50
   - `JUNCTION_NOT_MODULE` — when EXECUTION_FRAGILITY with cohesion < 0.15
   - `THROUGHPUT_CEILING` — when bridge_count > 15
   - `STRUCTURAL_SPINE` — when single hub > 15% of total import edges

4. **Recommendation synthesis** — generate recommendations from active conditions:
   - Each recommendation must cite evidence_basis (condition + evidence values)
   - Timeframe assignment: IMMEDIATE (condition severity CRITICAL or individual file addressable), NEAR_TERM (regional scope, requires cross-module coordination), STRATEGIC (systemic scope, requires architectural investment)
   - Recommendation text templates per condition type (extensible vocabulary)

5. **Executive synthesis generation** — compress full narrative into verdict and summary:
   - Verdict: qualification posture + structural findings + operational ceiling assessment
   - Summary: 3-page compression preserving key evidence values and findings

**Output:** `NarrativeSynthesis` — chapter-structured narrative content

**Reproducibility:** PARTIAL
- Chapter selection: DETERMINISTIC (rule-based on finding types)
- Finding narrative (Observed section): DETERMINISTIC
- Finding narrative (Matters/Operational): HIGH (vocabulary-driven)
- Finding narrative (Leadership): LOW (interpretive)
- Metaphor selection: DETERMINISTIC (vocabulary lookup)
- Recommendation generation: PARTIAL (evidence citation deterministic, timeframe partially rule-based, text varies)
- Executive synthesis: LOW (compression requires editorial judgment)

### Stage 4: Multi-Format Projection

**Purpose:** Project the narrative synthesis into multiple delivery formats.

**Substeps:**
1. **Full report assembly** — assemble chapters into single document with consistent formatting
2. **Executive summary compression** — 3-page version preserving: headline finding, key evidence values, behavioral profile, recommendations, verdict
3. **Presentation projection** — convert chapters to slide outline: ~1 slide per chapter + title + closing. Speaking notes derived from narrative content.
4. **Evidence appendix assembly** — tabulate all evidence sources, runtime configuration, active modules, verification status. This is almost entirely T1 — fully automatable.
5. **Governance artifact generation** — execution_report.md, validation_log.json, file_changes.json, CLOSURE.md (standard PI governance)

**Output:** `DeliveryPackage` — 4+ formatted documents

**Reproducibility:**
- Evidence appendix: DETERMINISTIC (tabulation)
- Presentation outline: MEDIUM (slide selection is rule-based, speaking notes vary)
- Executive summary: LOW (compression requires editorial judgment)
- Governance artifacts: DETERMINISTIC

---

## 5. Vocabulary Systems

The EIC depends on multiple vocabulary systems, some of which already exist and some of which need to be created:

### 5.1 Existing Vocabularies (consumed as-is)

| Vocabulary | Source | Purpose |
|---|---|---|
| CONDITION_VOCABULARY | SignalSynthesisEngine.js | Condition type definitions, L2/L3 labels, consequence text |
| CONDITION_INTERVENTIONS | SignalSynthesisEngine.js | Guided actions per condition type |
| COGNITION_SLICE_VOCABULARY | ConsequenceCompiler.js | Executive-level condition names + localize() functions |
| CLASS_RISK_LABEL | ConsequenceCompiler.js | 31 composite risk labels for A–E class combinations |
| CONDITION_ONTOLOGY_CLASS | CognitionOntology.js | Condition→Class mapping with class questions |
| ALL_NODES | CognitionOntology.js | Full ontology graph for verification |

### 5.2 New Vocabularies Required

| Vocabulary | Purpose | Content Shape |
|---|---|---|
| METAPHOR_VOCABULARY | Governed metaphor selection | `{ metaphor_id, trigger_condition, narrative_phrase, audience_tier }` |
| LEADERSHIP_IMPLICATION_TEMPLATES | Per-condition-type leadership translation | `{ condition_type, template_text, variable_slots[] }` |
| RECOMMENDATION_TEMPLATES | Per-condition-type recommendation stubs | `{ condition_type, timeframe_default, action_template, evidence_citation_pattern }` |
| TRADITIONAL_DETECTABILITY | Per-condition differentiator classification | `{ condition_type, traditional_equivalent, detection_gap, competitive_claim }` |
| CHAPTER_INCLUSION_RULES | Chapter selection logic | `{ chapter_id, inclusion_condition, required_findings[], optional_enrichments[] }` |
| AUDIENCE_VOCABULARY | Audience-specific term mappings | `{ term_id, ceo_version, cto_version, architect_version }` |

---

## 6. Governance Model

### 6.1 Interpretive Authority

The EIC operates under 75.x bounded interpretive authority. All 13 absolute prohibitions apply:

1. No team behavior inference
2. No organizational intent
3. No human motive attribution
4. No cultural diagnosis
5. No leadership quality assessment
6. No management effectiveness assessment
7. No personnel attribution
8. No behavioral prediction
9. No organizational sentiment
10. No causal attribution to humans
11. No remediation prioritization
12. No "you should" language
13. No ranked next actions

Recommendations are categorized by timeframe, not priority. Findings are presented as observations, not prescriptions.

### 6.2 Evidence Discipline

Every statement in the compiled output must trace to one of:
- A specific runtime artifact value (T1)
- A computation from artifact values (T2)
- A pipeline stage output (T3)
- A correlation between artifacts (T4)
- A governed vocabulary entry (T5/T6)
- An explicit 75.x interpretive act (T7) — which must be disclosure-wrapped

### 6.3 Disclosure Requirements

Sections that contain interpretive content (T7) must carry disclosure:
- Narrative sections: opening or closing note indicating evidence-bound interpretation
- Recommendations: each cites evidence_basis explicitly
- Report footer: standard PI method signature

### 6.4 Quality Gates

Before a compiled report is released:
1. **Evidence traceability check** — every major finding must cite specific artifacts
2. **Prohibition check** — scan for violations of 13 absolute prohibitions
3. **Vocabulary consistency check** — all condition names match CONDITION_VOCABULARY
4. **Metric accuracy check** — all numeric values match source artifacts
5. **Audience appropriateness check** — terminology matches configured audience tier

---

## 7. Extension Architecture

### 7.1 Multi-Client Generalization

The BlueEdge report is a single-specimen instance. The EIC must handle:
- Different structural scales (50 files to 50,000 files)
- Different technology stacks (TypeScript, Python, Go, mixed)
- Different condition activation profiles (not all conditions active for every specimen)
- Different qualification levels (S1, S2, S3)
- Different audience configurations (CEO-only, technical-only, mixed)

**Generalization principle:** The EIC's vocabulary systems (metaphors, templates, implications) are parameterized by condition type, not by specimen identity. A DEPENDENCY_CHOKE_POINT in BlueEdge and a DEPENDENCY_CHOKE_POINT in a Python monolith produce structurally equivalent findings with specimen-specific evidence values.

### 7.2 Temporal Extension

The current EIC operates on a single structural snapshot. Temporal extension adds:
- Delta compilation: comparing two snapshots to produce trend analysis
- Trajectory projection: identifying improving/worsening/stable findings
- Temporal condition activation: detecting DEPENDENCY_DEBT_ACCUMULATION and other temporal slices

### 7.3 Engagement Model Extension

The BlueEdge report is a one-time assessment. Engagement models include:
- **Initial Assessment** — full 10-chapter report (current BlueEdge pattern)
- **Quarterly Review** — delta report focusing on what changed, what's new, what resolved
- **Continuous Monitoring** — abbreviated automated reports with human-edited executive summary
- **Due Diligence** — expanded technical depth for M&A or investment context

Each engagement model is a configuration of the EIC — different chapter selection, depth controls, audience calibration, and vocabulary emphasis.

---

## 8. Automation Boundary

### What the EIC CAN automate:
- Evidence assembly (Stage 1) — 100%
- Intelligence compilation (Stage 2) — 100%
- Finding narrative: Observed section — 100%
- Finding narrative: Matters section — 80% (vocabulary-driven)
- Chapter selection and sequencing — 100% (rule-based)
- Metaphor selection — 100% (vocabulary lookup)
- Evidence appendix — 100%
- Governance artifacts — 100%
- Recommendation evidence citations — 100%

### What the EIC CANNOT automate without quality loss:
- Finding narrative: Leadership Implication section
- Executive Brief (Chapter 1) — synthesis and framing
- Structural Execution Story (Chapter 3) — narrative arc
- Risk Landscape (Chapter 6) — risk stratification narrative
- CTO/Architect Observations (Chapter 7) — audience-specific reframing
- Traditional Differentiators (Chapter 8) — competitive framing
- Recommendation specificity and timeframe assignment
- Executive Verdict (Chapter 10) — closing synthesis
- Executive Summary compression
- Presentation speaking notes
- Tone calibration across the full document

### The Operational Model

The EIC produces a **draft intelligence package** at ~75% completeness. A human intelligence analyst reviews, calibrates, and completes the remaining ~25%. This is not a limitation — it is the design. The 25% human contribution is the difference between a generated report and a consulting deliverable.

The human role is NOT editing — it is **intelligence completion**: adding the consulting judgment that transforms structural observations into actionable executive intelligence.

---

## 9. Relationship to Existing Pipeline

The EIC does NOT duplicate or replace any existing pipeline component:

| Component | Role | Unchanged |
|---|---|---|
| GenericSemanticPayloadResolver | Evidence assembly from artifacts | YES |
| SignalSynthesisEngine | Condition synthesis from signals + enrichment | YES |
| ConsequenceCompiler | Consequence compilation from conditions | YES |
| CognitionOntology | Static cognition graph | YES |
| InvestigationVerifier | Verification protocol | YES |
| SoftwareIntelligenceProjectionAdapter | Visual projection | YES |

The EIC is a **new consumer** of these existing outputs. It sits alongside the visual projection pipeline (LENS) as a parallel output channel:

```
ConsequenceCompiler
     ↓           ↓
   LENS      ←  EIC
 (visual)    (document)
```

Both consume the same governed objects. Both operate under the same evidence discipline. They differ in output modality: LENS produces interactive visual cognition; EIC produces static intelligence documents.
