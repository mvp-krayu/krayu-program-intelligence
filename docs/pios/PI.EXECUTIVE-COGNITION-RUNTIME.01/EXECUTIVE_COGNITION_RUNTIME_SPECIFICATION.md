# Executive Cognition Runtime Specification

**Stream:** PI.EXECUTIVE-COGNITION-RUNTIME.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. System Identity

The **Executive Cognition Runtime** (ECR) is the L4 layer of the Program Intelligence pipeline. It consumes governed structural evidence (L0–L3) and produces the **Executive Cognition Package** (ECP) — the canonical runtime artifact that represents everything Program Intelligence understands about a specimen at executive altitude.

The ECR is not a report generator, not a document compiler, not a narrative engine. It is a **cognition materializer** — it transforms structural intelligence into structured executive cognition objects.

Reports, slides, memos, and assessments are projections of the ECP. They are L5 concerns. The ECR does not know or care about projection formats.

---

## 2. Pipeline Position

```
L0: Structure (40.x artifacts)
 ↓
L1: Signals + Enrichment (GenericSemanticPayloadResolver)
 ↓
L2: Conditions (SignalSynthesisEngine)
 ↓
L3: Consequences (ConsequenceCompiler)
 ↓
L4: EXECUTIVE COGNITION (ECR) ← THIS SPECIFICATION
 ↓
L5: Projection Rendering (report, slides, memo, assessment, workshop, ...)
```

The ECR replaces the "EIC" concept from PI.EXECUTIVE-INTELLIGENCE-REPORT-COMPILER.01. The EIC was correctly positioned as L4 but incorrectly scoped — it included L5 rendering concerns (chapter sequencing, metaphor phrasing, audience vocabulary). The ECR is the cognition-only subset.

---

## 3. Input Contract

### 3.1 Required Inputs: Compiled Intelligence Package (CIP)

| Input | Source | Layer |
|---|---|---|
| `fullReport` | GenericSemanticPayloadResolver.resolveSemanticPayload() | L0–L1 |
| `synthesisResult` | SignalSynthesisEngine.synthesize() | L2 |
| `consequenceResult` | ConsequenceCompiler.compile() | L3 |
| `cognitionOntology` | CognitionOntology.CONDITION_ONTOLOGY_CLASS, ALL_NODES | L2 static |
| `classRiskLabels` | ConsequenceCompiler.CLASS_RISK_LABEL | L3 static |
| `qualificationPackage` | SQO artifacts (promotion, revalidation, anchor, certification, propositions) | L2 |

### 3.2 Input Validation

1. All required inputs present and non-null
2. `synthesisResult.conditions.length > 0`
3. `consequenceResult` consistent with `synthesisResult`
4. `qualificationPackage` in terminal state
5. CIP provenance traceable to governed run

Validation failure → `COGNITION_BLOCKED`

---

## 4. Output Contract: Executive Cognition Package (ECP)

The ECP is a single structured JSON-serializable object containing nine cognition objects (defined in EXECUTIVE_COGNITION_OBJECT_MODEL.md):

```
ExecutiveCognitionPackage: {
  metadata: {
    package_id: string,
    specimen: string,
    run_id: string,
    baseline_commit: string,
    generated_at: ISO8601,
    s_level: string,
    pipeline_version: string,
  },
  
  structural_posture: { ... },        // §2.1 — scale, architecture, qualification, signals
  tension_map: { ... },               // §2.2 — convergence centers, class activation, cross-coupling
  constraint_inventory: { ... },      // §2.3 — throughput ceilings, blast radii, misalignments, fragility
  exposure_assessment: { ... },       // §2.4 — concentration, governance, fragility exposure
  trajectory_assessment: { ... },     // §2.5 — worsening, stable, unmeasured patterns
  decision_surface: { ... },          // §2.6 — leverage points with urgency classification
  absence_profile: { ... },           // §2.7 — inactive, unmeasured, non-activated
  competitive_intelligence: { ... },  // §2.8 — detection advantages, detectability gaps
  operational_ceiling: { ... },       // §2.9 — ceiling drivers, properties, likely symptoms
  
  provenance: {
    cip_hash: string,
    source_artifacts: [{ path, hash, layer }],
    derivation_log: [{ object, source_fields, derivation_type }],
  },
}
```

### 4.1 Output Properties

| Property | Guarantee |
|---|---|
| Deterministic | Same CIP → same ECP. No stochastic elements. |
| Complete | All 9 objects populated (empty arrays are valid; missing objects are not) |
| Evidence-bound | Every value in every object traces to a source artifact field |
| Self-validating | provenance.derivation_log enables replay verification |
| Projection-independent | No audience, format, or rendering information in the ECP |
| Diffable | Two ECPs from different snapshots/runs can be structurally compared |

---

## 5. Materialization Pipeline

The ECR materializes each cognition object through a defined pipeline. Each materializer is a pure function: deterministic, side-effect-free, evidence-bound.

### 5.1 Materializer Inventory

| Materializer | Input | Output Object | Derivation |
|---|---|---|---|
| `materializePosture` | fullReport, qualificationPackage | structural_posture | L0 extraction + L2 qualification digest |
| `materializeTensions` | synthesisResult, consequenceResult, cognitionOntology, classRiskLabels, fullReport | tension_map | L2 composite conditions + L3 risk labels + class mapping |
| `materializeConstraints` | fullReport.structural_enrichment, synthesisResult | constraint_inventory | L1 enrichment surfaces + L2 condition scoping |
| `materializeExposure` | fullReport, synthesisResult | exposure_assessment | L0 centrality + L1 fragility + L2 governance |
| `materializeTrajectory` | consequenceResult, synthesisResult | trajectory_assessment | L3 consequence properties + L2 condition vocabulary |
| `materializeDecisionSurface` | synthesisResult, fullReport.structural_enrichment | decision_surface | L2 conditions + L2 static interventions + urgency rules |
| `materializeAbsence` | synthesisResult, cognitionOntology | absence_profile | Set comparison: possible conditions minus active |
| `materializeCompetitiveIntelligence` | synthesisResult | competitive_intelligence | Condition type → detectability property mapping |
| `materializeOperationalCeiling` | tension_map, constraint_inventory, structural_posture | operational_ceiling | Cross-object synthesis of prior materializer outputs |

### 5.2 Materializer Dependency Graph

```
fullReport + qualificationPackage
     ↓                    ↓
materializePosture    materializeTensions
     ↓                    ↓
     ↓           materializeConstraints
     ↓                    ↓
     ↓           materializeExposure
     ↓                    ↓
     ↓           materializeTrajectory
     ↓                    ↓
     ↓           materializeDecisionSurface
     ↓                    ↓
     ↓           materializeAbsence
     ↓                    ↓
     ↓           materializeCompetitiveIntelligence
     ↓                    ↓
     └──────────→ materializeOperationalCeiling ←──────┘
```

**Parallelization:** materializePosture and materializeTensions through materializeCompetitiveIntelligence can run in parallel. Only materializeOperationalCeiling depends on prior materializer outputs (it synthesizes posture + tensions + constraints into the ceiling assessment).

### 5.3 Vocabulary Dependencies

Each materializer consumes one or more vocabulary systems:

| Vocabulary | Materializer(s) | Status |
|---|---|---|
| CONDITION_VOCABULARY | Tensions, Constraints, Absence | EXISTS (SignalSynthesisEngine) |
| CONDITION_ONTOLOGY_CLASS | Tensions | EXISTS (CognitionOntology) |
| CLASS_RISK_LABEL | Tensions | EXISTS (ConsequenceCompiler) |
| CONDITION_INTERVENTIONS | DecisionSurface | EXISTS (SignalSynthesisEngine) |
| CONSEQUENCE_VOCABULARY | Trajectory | EXISTS (ConsequenceCompiler) |
| REMEDIATION_PATTERNS | DecisionSurface | NEW — per-condition-type remediation patterns |
| TRAJECTORY_PROPERTIES | Trajectory | NEW — per-consequence-type trajectory direction |
| DETECTABILITY_INDEX | CompetitiveIntelligence | NEW — per-condition-type traditional detectability |
| FRAMEWORK_ANCHORS | CompetitiveIntelligence | NEW — per-condition-type architectural framework mapping |
| CEILING_PROPERTIES | OperationalCeiling | NEW — structural ceiling type properties |
| URGENCY_RULES | DecisionSurface | NEW — severity × effort_scope → timeframe mapping |

6 existing vocabularies. 5 new vocabularies needed.

---

## 6. Lifecycle

### 6.1 Production

```
1. CIP assembled from governed run artifacts
2. CIP validated (input contract check)
3. Materializers execute (parallel where possible)
4. ECP assembled from materializer outputs
5. ECP validated (output contract check)
6. ECP stored as runtime artifact
```

### 6.2 Storage

The ECP is stored alongside specimen artifacts:

```
clients/{client}/psee/runs/{run_id}/
  executive_cognition/
    executive_cognition_package.json    ← the canonical ECP
    ecp_provenance.json                 ← full derivation log
    ecp_validation.json                 ← validation results
```

### 6.3 Versioning

Each governed run produces one ECP. If the pipeline is re-run on the same specimen (e.g., after enrichment or revalidation), a new ECP is produced. ECPs are immutable — a new run produces a new ECP, never modifies an existing one.

### 6.4 Delta Analysis

Two ECPs from different snapshots (same specimen, different times) can be structurally compared:

```
delta = diff(ECP_t1, ECP_t2)

delta: {
  posture_changes: { s_level_change, new_signals, resolved_signals },
  tension_changes: { new_convergence_centers, resolved_convergence_centers, severity_changes },
  constraint_changes: { new_constraints, resolved_constraints, severity_changes },
  trajectory_changes: { predictions_confirmed, predictions_invalidated, new_measurements },
  decision_surface_changes: { interventions_completed, new_interventions, urgency_changes },
}
```

Delta analysis is deterministic — two ECPs are structured objects; diffing is mechanical.

---

## 7. Validation

### 7.1 Internal Validation

Each materializer validates its output:
1. **Completeness** — all required fields populated
2. **Traceability** — every value traces to a source artifact
3. **Consistency** — cross-references between objects are valid (e.g., convergence center domain IDs exist in posture.scale)
4. **Non-emptiness** — at least one convergence center OR at least one constraint (a specimen with zero findings produces a CLEAN posture, not an empty ECP)

### 7.2 Cross-Object Validation

After all materializers complete:
1. **Tension-Constraint consistency** — every convergence center has at least one corresponding constraint
2. **Trajectory-Consequence consistency** — every trajectory entry cites a valid consequence type
3. **Decision-Condition consistency** — every leverage point traces to an active condition
4. **Absence-Active exclusion** — no condition appears in both active set and absence profile
5. **Ceiling-Posture consistency** — operational_ceiling.qualified matches structural_posture.qualification.s_level

### 7.3 Pipeline Validation

The ECP is consistent with upstream outputs:
1. All conditions referenced in ECP exist in `synthesisResult.conditions`
2. All consequences referenced exist in `consequenceResult.consequences`
3. All evidence values match source artifact values (metric accuracy)
4. ECP severity assessments are consistent with pipeline severities

Validation failure → `ECP_INVALID` — ECP is not stored.

---

## 8. Governance

### 8.1 Interpretive Authority

The ECR operates at **ZERO interpretive authority**. Every value in the ECP is:
- Extracted from a governed artifact (T1)
- Computed from artifact values (T2)
- Produced by a pipeline stage (T3)
- Correlated across artifacts by rules (T4)
- Looked up in a governed vocabulary (T5)

No ECP field requires 75.x bounded interpretive authority. The entire "interpretation" budget moves to L5 (Projection Rendering), where it belongs.

This is the critical architectural discovery: **the cognition layer does not require interpretation.** Interpretation is a rendering concern — how to present cognition to humans. The cognition itself is structural.

### 8.2 Evidence Discipline

Every ECP field has a `derivation_type`:
- `EXTRACTED` — direct value from artifact
- `COMPUTED` — arithmetic from extracted values
- `SYNTHESIZED` — pipeline stage output
- `CORRELATED` — cross-artifact rule application
- `VOCABULARY` — governed vocabulary lookup
- `RULE` — deterministic rule application

No field has derivation_type `INTERPRETED` or `JUDGED`.

### 8.3 Prohibition Enforcement

The 13 absolute prohibitions (§3.4.1) do not apply to the ECR because the ECR does not produce narrative, interpretation, or audience-facing language. Prohibitions apply to L5 projection rendering.

However, the ECR enforces a structural equivalent:
1. No team inference in any ECP field
2. No organizational intent in any ECP field
3. No human attribution in any ECP field
4. No temporal prediction beyond pattern properties
5. No prioritization — decision_surface.leverage_points are urgency-classified, not priority-ranked
6. No imperative language — leverage_points describe interventions, not commands

---

## 9. Relationship to Existing Pipeline

### 9.1 Consumer of Existing Outputs

The ECR consumes but does not modify:

| Component | Consumed By | Relationship |
|---|---|---|
| GenericSemanticPayloadResolver | materializePosture, materializeConstraints, materializeExposure | Reads fullReport |
| SignalSynthesisEngine | materializeTensions, materializeConstraints, materializeAbsence | Reads synthesisResult |
| ConsequenceCompiler | materializeTensions, materializeTrajectory | Reads consequenceResult |
| CognitionOntology | materializeTensions, materializeAbsence | Reads CONDITION_ONTOLOGY_CLASS |
| SQO artifacts | materializePosture | Reads qualification package |

### 9.2 Relationship to forBoardroom() / forBalanced()

The existing persona projection functions (forBoardroom, forBalanced, forOperator, forInvestigation) currently derive from consequenceResult directly. In the corrected architecture, they become L5 projection renderers that consume the ECP:

**Current:**
```
consequenceResult → forBoardroom() → BOARDROOM panel content
consequenceResult → forBalanced() → BALANCED panel content
```

**Corrected:**
```
consequenceResult → ECR → ECP → forBoardroom() → BOARDROOM panel content
                                → forBalanced()  → BALANCED panel content
                                → forReport()    → Executive report
                                → forSlides()    → Presentation
```

The persona functions remain unchanged in behavior. They gain a structured intermediate (the ECP) that they can consume selectively. forBoardroom() doesn't need all 9 ECP objects — it primarily needs tension_map, operational_ceiling, and decision_surface.

### 9.3 Relationship to LENS Visual Pipeline

LENS and the ECR are parallel consumers of the same L2/L3 outputs:

```
SignalSynthesisEngine + ConsequenceCompiler
           ↓                      ↓
    ECR (L4)              SoftwareIntelligenceProjectionAdapter
           ↓                      ↓
    ECP (structured         6 cognition surfaces
     cognition)             topology overlays
           ↓                      ↓
    Projection (L5)         LENS visual rendering
    (reports, etc.)         (SVG, panels, zones)
```

Both pipelines are evidence-bound. Both are deterministic. Both trace to the same governed artifacts. They differ in output modality:
- ECR → structured executive cognition → projected into documents
- LENS → compressed operational surfaces → projected into visual interface

Cross-enrichment: LENS topology screenshots can embed in L5 report projections. ECP decision_surface entries can appear in LENS guided actions. The two pipelines share cognition but render independently.

### 9.4 Relationship to Chronicle

The Chronicle is the narrated cognition map of a specimen's lifecycle. The ECP is a point-in-time cognition snapshot. Their relationship:

- Chronicle records HOW the system arrived at its current state (governance lifecycle)
- ECP records WHAT the system currently knows (executive cognition)
- A series of ECPs over time = structural trajectory (delta analysis)
- The Chronicle could incorporate ECP snapshots as chapters (each ECP = "what PI understood at this point")

### 9.5 Relationship to SQO

SQO governs the qualification lifecycle. The ECP's `structural_posture.qualification` is a read-only view of the SQO state. The ECP does not advance, modify, or evaluate SQO state. It consumes the terminal qualification result as provenance.

---

## 10. Extension Architecture

### 10.1 New Condition Types

When a new condition type is added to SignalSynthesisEngine (e.g., DEPENDENCY_DEBT_ACCUMULATION from temporal analysis), the ECR extends naturally:
1. The new condition appears in `synthesisResult.conditions`
2. Existing materializers pick it up (tension_map counts it, constraint_inventory classifies its scope, absence_profile removes it from unmeasured)
3. New vocabulary entries added: REMEDIATION_PATTERNS, TRAJECTORY_PROPERTIES, DETECTABILITY_INDEX
4. No materializer code changes — the materializers operate on condition types generically

### 10.2 New Enrichment Surfaces

When a new enrichment surface is added to GenericSemanticPayloadResolver (e.g., temporal drift surface):
1. The enrichment appears in `fullReport.structural_enrichment`
2. materializeConstraints checks for new surface types
3. materializeExposure adds surface-specific exposure entries
4. New vocabulary entries if the surface drives new constraint types

### 10.3 Multi-Client Operation

The ECP is specimen-independent. The same ECR produces ECPs for BlueEdge, NetBox, and future specimens. Structural_posture.scale will vary (50 files vs. 50,000 files), tension_map.convergence_centers will vary, but the object model is invariant.

---

## 11. What Survives If Reports Disappear

If every projection format vanished — reports, slides, PDFs, memos — the ECP would still exist as a governed runtime artifact containing:

1. **What the program IS** — structural_posture
2. **Where the tensions ARE** — tension_map
3. **What constrains execution** — constraint_inventory
4. **Where the exposures ARE** — exposure_assessment
5. **Where things are HEADING** — trajectory_assessment
6. **What can be DONE** — decision_surface
7. **What was NOT found** — absence_profile
8. **What ONLY PI sees** — competitive_intelligence
9. **What the ceiling IS** — operational_ceiling

This is the answer to the stream's primary question.

Executive Intelligence is not a projection. It is a runtime layer. The ECP is the canonical artifact. Projections are downstream rendering surfaces.

The system was always producing cognition. It was just rendering it immediately into prose before anyone could see the structured object underneath.
