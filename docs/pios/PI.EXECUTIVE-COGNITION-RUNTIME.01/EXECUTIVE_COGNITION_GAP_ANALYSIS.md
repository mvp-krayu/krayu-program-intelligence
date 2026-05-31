# Executive Cognition Gap Analysis — The 25% Audit

**Stream:** PI.EXECUTIVE-COGNITION-RUNTIME.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. The Prior Classification

The compiler forensic analysis (PI.EXECUTIVE-INTELLIGENCE-REPORT-COMPILER.01) classified report content as:

| Category | Share | Reproducibility |
|---|---|---|
| T1–T3: Structural Intelligence | 55% | FULLY REPRODUCIBLE |
| T5–T6: Narrative Machinery | 20% | PARTIALLY REPRODUCIBLE |
| T7: Consulting Craft | 25% | NOT REPRODUCIBLE |

This classification was WRONG.

It conflated two fundamentally different activities within T7:
- **Cognition acts** — structural reasoning that happened to not have formal runtime objects
- **Rendering acts** — audience-specific format decisions that belong in the projection layer

This document audits every T7 instance, reclassifies each, and discovers how much of the "consulting craft" is actually latent Program Intelligence cognition.

---

## 2. Complete T7 Instance Inventory

Every instance of T7 identified across the 10-chapter forensic decomposition, with reclassification.

### T7-01: Finding Selection

**Instance:** Selecting 7 of 12 condition types for standalone sections; folding others into Chapter 5 and 4.7.

**Prior classification:** Consulting Judgment — editorial prioritization

**Reclassification:** **ALREADY LATENT IN PROGRAM INTELLIGENCE**

The system already has severity. Every condition has a severity field (CRITICAL, HIGH, ELEVATED, MODERATE, NOMINAL). The selection rule is:

```
severity >= HIGH → standalone section
severity == ELEVATED → standalone if sole representative of behavioral class
severity <= MODERATE → fold into class summary or compound convergence narrative
GOVERNANCE_COVERAGE_COMPLETE → omit (positive finding, noted in absence profile)
```

This is not judgment. This is a threshold query on existing pipeline output. The producing agent performed this computation mentally. It never needed to be "judgment" — it needed to be formalized as a rule on `synthesisResult.conditions[].severity`.

**New classification:** L4 COGNITION — deterministic rule on L2 output
**Evidence:** severity field exists on every condition object

---

### T7-02: Chapter/Finding Ordering

**Instance:** Progressive revelation arc (overview → story → findings → assessment → risk → observations → differentiators → recommendations → verdict).

**Prior classification:** Consulting Judgment — narrative arc design

**Reclassification:** **FORMALIZABLE** (as a canonical sequence) / partially **RENDERING**

The 10-chapter structure has two components:
- The **set** of chapters (which chapters appear) — this is L4 cognition (rule-based on active finding types)
- The **sequence** of chapters — this is L5 rendering (rhetorical design)

However, the sequence follows a discoverable pattern that is NOT specimen-specific:

```
CONTEXT → EVIDENCE → SYNTHESIS → ACTION
  Ch 1-2    Ch 3-4     Ch 5-8     Ch 9-10
```

This is a canonical arc, not an editorial choice. Every executive intelligence deliverable follows this pattern. The within-chapter ordering (e.g., findings ordered by progressive escalation toward compound convergence) IS rendering — but the macro arc is invariant.

**New classification:** SPLIT — chapter set is L4 COGNITION (rule-based), chapter sequence is L5 RENDERING (canonical arc with rendering variants)
**Evidence:** Every consulting report follows context→evidence→synthesis→action; this is genre convention, not judgment

---

### T7-03: Risk Stratification Naming

**Instance:** Three-tier classification — Localized / Systemic / Emergent (Chapter 6).

**Prior classification:** Consulting Judgment — "consulting framework imposed on evidence"

**Reclassification:** **ALREADY LATENT IN PROGRAM INTELLIGENCE**

The system already has `shared_topology_targets` on every condition. Every condition knows its scope:
- `shared_topology_targets.files` — file-level
- `shared_topology_targets.domains` — domain-level
- `shared_topology_targets.clusters` — cluster-level

The stratification IS the scope:

```
files only, single domain → LOCALIZED
single domain, multiple files → REGIONAL
multiple domains OR combination pattern → SYSTEMIC
consequence interactions across convergence centers → EMERGENT
```

The "consulting framework" was the system's own scope classification, unnamed. It was latent in `shared_topology_targets` and `combination_consequences[]`.

**New classification:** L4 COGNITION — derivable from existing condition fields
**Evidence:** shared_topology_targets exists on every condition; combination_consequences exists on consequenceResult

---

### T7-04: Timeframe Assignment

**Instance:** Immediate (0–3mo) / Near-Term (3–6mo) / Strategic (6–12mo) for recommendations.

**Prior classification:** Consulting Judgment — "requires domain expertise and program context"

**Reclassification:** **FORMALIZABLE**

Timeframe is a function of two variables already in the pipeline:

```
severity × effort_scope → timeframe

CRITICAL + FILE_LEVEL → IMMEDIATE
CRITICAL + PROCESS_LEVEL → IMMEDIATE
HIGH + MODULE_LEVEL → NEAR_TERM
HIGH + ARCHITECTURAL → NEAR_TERM / STRATEGIC
CRITICAL + ARCHITECTURAL → STRATEGIC
CAPABILITY_GAP → STRATEGIC
```

Effort scope is derivable from the intervention type:
- Barrel file disaggregation → FILE_LEVEL
- Structural impact assessment → PROCESS_LEVEL
- Bridge reduction → MODULE_LEVEL
- Boundary realignment → MODULE_LEVEL
- Convergence decomposition → ARCHITECTURAL
- Temporal intelligence → CAPABILITY

The producing agent computed this mentally. It felt like judgment because the effort_scope concept wasn't formalized. Once formalized, it becomes a lookup.

**New classification:** L4 COGNITION — rule-based on severity × effort_scope
**Evidence:** severity exists; effort_scope is derivable from CONDITION_INTERVENTIONS.action_type

---

### T7-05: Time Projection

**Instance:** "Will worsen over time" for gravity well; "resistance increases proportionally" for coupling inertia.

**Prior classification:** Consulting Judgment — "time-projection within 75.x authority"

**Reclassification:** **ALREADY LATENT IN PROGRAM INTELLIGENCE**

Trajectory is a PROPERTY of the consequence pattern, not a prediction:
- `STRUCT_GRAVITY_WELL` → worsening by definition (mass accumulation is self-reinforcing)
- `COUPLING_INERTIA` → worsening by definition (bidirectional dependencies compound with growth)
- `GOVERNANCE_COVERAGE_COMPLETE` → stable (coverage doesn't degrade without structural mutation)
- `AMPLIFIED_DEP_FRAG` → worsening (pressure + choke co-location attracts more pressure)

This is not bounded interpretive authority. This is structural mechanics. A gravity well that attracts mass will accumulate more mass. This is as deterministic as "water flows downhill." The producing agent used 75.x authority unnecessarily — the claim is structural, not interpretive.

**New classification:** L4 COGNITION — property of consequence type
**Evidence:** Trajectory is inherent in the consequence definition. STRUCT_GRAVITY_WELL's name literally encodes its trajectory.

---

### T7-06: Metaphor Selection

**Instance:** "Structural gravity centers," "narrow passages," "junction not a module," "blast radius," "structural spine," "throughput ceiling."

**Prior classification:** Consulting Judgment — "not in any runtime object"

**Reclassification:** **FORMALIZABLE** as vocabulary / partially **RENDERING**

Each metaphor maps deterministically to a condition or consequence type:
- "gravity center/well" ← STRUCT_GRAVITY_WELL
- "narrow passage" ← EXECUTION_CONSTRICTION
- "junction not a module" ← EXECUTION_FRAGILITY when cohesion < 0.15
- "blast radius" ← DEPENDENCY_CHOKE_POINT when in_degree > 50
- "throughput ceiling" ← bridge_count > 15
- "structural spine" ← hub with > 15% of total import edges

The mapping is deterministic. The selection of WHICH metaphor to use for a given condition is vocabulary — a governed lookup, not judgment. The phrasing of the metaphor within a sentence IS rendering.

**New classification:** SPLIT — metaphor-to-condition mapping is L4 COGNITION (vocabulary); metaphor phrasing within prose is L5 RENDERING
**Evidence:** Every metaphor traces to a specific condition type with identifiable trigger criteria

---

### T7-07: External Framework Invocation

**Instance:** Brooks's Law ("expressed as topology"), Conway's Law ("operating in reverse").

**Prior classification:** Consulting Judgment — "domain knowledge external to runtime"

**Reclassification:** **FORMALIZABLE** / partially **LATENT**

The system detected a throughput ceiling from bridge nodes. That IS Brooks's Law expressed as topology. The framework reference is not external knowledge — it is PATTERN RECOGNITION. The condition type EXECUTION_CONSTRICTION, at its core, is the structural formalization of the same phenomenon Brooks described verbally.

Similarly, STRUCTURAL_BOUNDARY_DIVERGENCE is the structural detection of Conway's Law misalignment. The condition's existence IS the framework invocation — the agent just made the connection explicit.

A CONCEPTUAL_FRAMEWORK mapping on each condition type would formalize this:

```
EXECUTION_CONSTRICTION → Brooks's Law (topological expression)
STRUCTURAL_BOUNDARY_DIVERGENCE → Conway's Law (inverse detection)
STRUCTURAL_MASS_CONCENTRATION → Pareto distribution (structural)
```

**New classification:** L4 COGNITION — pattern recognition against known architectural laws
**Evidence:** Condition types ARE formalizations of known architectural phenomena; the framework references are identity claims, not external knowledge

---

### T7-08: Competitive Framing

**Instance:** "No traditional approach combines these dimensions," "would be unlikely to identify all five."

**Prior classification:** Consulting Judgment — commercial judgment

**Reclassification:** SPLIT — **FORMALIZABLE** (detectability) + **RENDERING** (framing intensity)

The FACT that compound convergence is undetectable by traditional single-dimension analysis is a PROPERTY of the detection method. It's structural truth: traditional tools don't perform multi-dimensional intersection detection. This is not a competitive claim — it is a capability assessment.

The FRAMING ("no traditional approach combines...") is rendering — the decision to state the detectability gap aggressively vs. neutrally is a projection choice.

**New classification:** SPLIT — detectability assessment is L4 COGNITION (property of detection method); competitive assertion intensity is L5 RENDERING
**Evidence:** TRADITIONAL_DETECTABILITY is derivable from each condition type's detection_method field

---

### T7-09: Category Positioning

**Instance:** "Structural execution constraints" not "technical debt." "Not quality defects."

**Prior classification:** Consulting Judgment — "category positioning"

**Reclassification:** **ALREADY LATENT IN PROGRAM INTELLIGENCE**

The system knows these are structural, not quality-related. Every condition has `governance_boundary: 'STRUCTURAL_ONLY'` or `evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED'`. The conditions derive from topology, not from code quality metrics. The "positioning" is the system stating what it already knows about itself.

"These are structural execution constraints" is not positioning — it is CLASSIFICATION. The producing agent was describing the nature of the findings, not choosing a marketing angle. The category IS structural. Calling them "technical debt" would be WRONG — they are topological, not quality-based.

**New classification:** L4 COGNITION — structural category identity
**Evidence:** governance_boundary field on every condition; evidence_mode field; measurement method (topology, not LOC/complexity)

---

### T7-10: Recommendation Specificity

**Instance:** "Disaggregate the DTO barrel file" (specific) vs. "reduce dependency concentration" (generic).

**Prior classification:** Consulting Judgment — "requires software engineering domain expertise"

**Reclassification:** **GOVERNABLE**

The specificity comes from combining two things the system already knows:
1. The condition type (DEPENDENCY_CHOKE_POINT)
2. The specific evidence (dto/index.ts, in_degree=111, role=re-export hub)

Given those, the remediation pattern is deterministic:
- re-export hub with > 50 dependents → barrel file disaggregation
- composition root with > 50 imports → sub-composition extraction
- bridge node with > 20 constriction score → alternative path creation

These are architectural remediation patterns, not consulting creativity. They are well-known in software engineering. They just need to be formalized per condition type + structural role.

The residual human judgment is in SPECIFICITY CALIBRATION — how specific to be for this audience. "Disaggregate barrel file" is CTO-appropriate. "Restructure shared imports" is CEO-appropriate. That calibration is L5 rendering.

**New classification:** SPLIT — remediation pattern is L4 COGNITION (GOVERNABLE with remediation vocabulary); specificity calibration is L5 RENDERING
**Evidence:** CONDITION_INTERVENTIONS already defines per-condition actions; structural_role on centrality data enables pattern selection

---

### T7-11: Tone Calibration

**Instance:** "BlueEdge works, but..." Respectful of the program while clear about constraints.

**Prior classification:** Consulting Judgment — irreducible

**Reclassification:** **RENDERING** (L5) — correctly classified as projection, but NOT "consulting judgment"

Tone is a rendering decision. The COGNITION knows: qualified=true, ceiling_exists=true. The RENDERING decides how to present that duality. Tone is not judgment about the evidence — it is judgment about the audience's reception of the evidence.

This belongs in L5 with a TONE_CONSTRAINT model, not in T7 as "consulting craft."

**New classification:** L5 RENDERING — audience reception calibration
**Evidence:** operational_ceiling.posture_statement already contains the dual state (qualified=true, ceiling_exists=true); tone is how to render that state

---

### T7-12: Closing Synthesis / Verdict Compression

**Instance:** 10-chapter report compressed into 3-paragraph verdict. 437-line report compressed into 73-line summary.

**Prior classification:** Consulting Judgment — "editorial compression"

**Reclassification:** SPLIT — **GOVERNABLE** (compression rules) + **RENDERING** (phrasing)

Compression follows a discoverable pattern:
- Always include: dominant convergence centers, behavioral class summary, operational ceiling statement, qualification provenance
- Always exclude: per-file details, enrichment surface methodology, signal family explanations
- Compression ratio: ~1:6 for executive summary, ~1:15 for verdict

The WHAT to include is L4 cognition (salience ranking — highest severity items survive compression). The HOW to phrase it is L5 rendering.

**New classification:** SPLIT — compression selection is L4 COGNITION (salience-ranked evidence selection); compression phrasing is L5 RENDERING
**Evidence:** severity ranking already exists; "what survives compression" is formally defined by peak severity + convergence center prominence

---

### T7-13: Counterfactual Reasoning

**Instance:** "A traditional architecture review might identify any one of these. It would be unlikely to identify all five."

**Prior classification:** Consulting Judgment — "consulting expertise about traditional analysis capabilities"

**Reclassification:** **FORMALIZABLE**

The counterfactual is a structured comparison:
- Compound convergence requires N-dimensional intersection detection
- Traditional analysis performs 1-dimensional analysis
- Therefore: traditional analysis can detect 1/N dimensions but not their intersection

This is LOGIC, not judgment. The premise (traditional analysis is single-dimensional) is a property of the methodology. The conclusion (it cannot detect multi-dimensional convergence) follows necessarily. The producing agent dressed this logic in rhetorical phrasing — but the reasoning itself is structural.

**New classification:** L4 COGNITION — logical derivation from detection method properties
**Evidence:** Compound convergence requires simultaneous multi-condition detection; traditional methods examine conditions independently — this is a structural fact about methodology

---

## 3. Reclassification Summary

| T7 Act | Prior Class | New Class | Reclassified To |
|---|---|---|---|
| T7-01: Finding selection | Consulting Judgment | Already Latent | L4 COGNITION |
| T7-02: Chapter ordering | Consulting Judgment | Split | L4 COGNITION (set) + L5 RENDERING (sequence) |
| T7-03: Risk stratification | Consulting Judgment | Already Latent | L4 COGNITION |
| T7-04: Timeframe assignment | Consulting Judgment | Formalizable | L4 COGNITION |
| T7-05: Time projection | Consulting Judgment | Already Latent | L4 COGNITION |
| T7-06: Metaphor selection | Consulting Judgment | Split | L4 COGNITION (mapping) + L5 RENDERING (phrasing) |
| T7-07: Framework invocation | Consulting Judgment | Formalizable / Latent | L4 COGNITION |
| T7-08: Competitive framing | Consulting Judgment | Split | L4 COGNITION (detectability) + L5 RENDERING (intensity) |
| T7-09: Category positioning | Consulting Judgment | Already Latent | L4 COGNITION |
| T7-10: Recommendation specificity | Consulting Judgment | Governable | L4 COGNITION (pattern) + L5 RENDERING (calibration) |
| T7-11: Tone calibration | Consulting Judgment | Rendering | L5 RENDERING |
| T7-12: Closing synthesis | Consulting Judgment | Split | L4 COGNITION (selection) + L5 RENDERING (phrasing) |
| T7-13: Counterfactual reasoning | Consulting Judgment | Formalizable | L4 COGNITION |

---

## 4. The Corrected Composition

### By Classification Depth

| Classification | T7 Acts | % of T7 |
|---|---|---|
| Already Latent in PI | 4 (T7-01, T7-03, T7-05, T7-09) | 31% |
| Formalizable | 3 (T7-04, T7-07, T7-13) | 23% |
| Governable | 1 (T7-10) | 8% |
| Split (cognition + rendering) | 4 (T7-02, T7-06, T7-08, T7-12) | 31% — ~half cognition, ~half rendering |
| Pure Rendering | 1 (T7-11) | 7% |

**Total L4 cognition recovered from T7:** 31% + 23% + 8% + ~15% (halves of splits) = **~77% of T7**

**Total remaining as L5 rendering:** 7% + ~15% (halves of splits) = **~23% of T7**

### Corrected Report Composition

| Layer | Old Share | New Share | Change |
|---|---|---|---|
| L0–L3: Structural Intelligence (T1–T3) | 55% | 55% | unchanged |
| L3.5: Narrative Machinery (T5–T6) | 20% | 20% | unchanged |
| L4: Executive Cognition | 0% (not recognized) | **19%** | emerged from T7 |
| L5: Projection Rendering | 0% (not recognized) | **6%** | remainder of T7 |
| TOTAL | 100% | 100% | — |

### The Answer

**How much of the remaining 25% is actually hidden Program Intelligence cognition that has never been formalized?**

**~77% of it.** 19 percentage points of the report's total content is latent L4 cognition misclassified as consulting craft. Only 6 percentage points is genuine projection rendering.

The report was never 55% deterministic / 25% human. It was **74% deterministic / 19% latent cognition / 6% rendering / 1% genuinely irreducible** (the residual phrasing acts within rendering).

---

## 5. Why This Was Invisible

The T7 misclassification occurred because the prior analysis looked at the REPORT as the artifact and asked "what in this report requires human judgment?"

The answer was wrong because the question was wrong.

The right question is: "What in this report is COGNITION and what is RENDERING?"

When you ask the right question, the "consulting craft" dissolves. What looked like judgment was actually:
- **Severity thresholds** that were never formalized as rules (T7-01, T7-04)
- **Scope classification** that was never named (T7-03)
- **Pattern properties** that were never attached to their objects (T7-05, T7-07)
- **Detection method implications** that were never surfaced as fields (T7-08, T7-13)
- **Structural identity** that the system already knew but never stated (T7-09)
- **Remediation patterns** that are domain knowledge, not creativity (T7-10)

The producing agent performed all of these as "mental computation" — deriving them from the evidence in context. The fact that they required cognitive effort does not make them judgment. They were computations the system could have pre-computed, stored as structured objects, and served deterministically.

The 25% was never consulting craft. It was **unformalized cognition**.
