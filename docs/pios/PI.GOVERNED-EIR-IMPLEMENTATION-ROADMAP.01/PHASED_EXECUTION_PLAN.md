# Phased Execution Plan

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture Consuming)
**Date:** 2026-05-31

---

## Phase 1 — PICR (Cognition Formation Runtime)

### Files to Create

| File | Classification | Purpose | LOC Estimate |
|------|---------------|---------|-------------|
| `app/execlens-demo/lib/lens-v2/cognition/PICRRuntime.js` | DETERMINISTIC | PICR orchestrator — calls all 9 materializers, produces PICP | ~120 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/structuralPosture.js` | DETERMINISTIC | T1 materializer — assembles structural_posture from fullReport posture fields | ~40 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/tensionMap.js` | DETERMINISTIC | T1 materializer — assembles tension_map from synthesisResult tensions | ~50 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/constraintInventory.js` | DETERMINISTIC | T1 materializer — assembles constraint_inventory from consequence conditions | ~40 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/exposureAssessment.js` | DETERMINISTIC | T1 materializer — assembles exposure_assessment from pressure zones | ~50 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/trajectoryAssessment.js` | DETERMINISTIC | T2 materializer — assembly + lookup from temporal spine data | ~60 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/decisionSurface.js` | DETERMINISTIC | T2 materializer — assembly + lookup from consequence priorities | ~70 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/absenceProfile.js` | DETERMINISTIC | T3 materializer — vocabulary authoring for capability gaps | ~80 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/detectionBoundary.js` | DETERMINISTIC | T4 materializer — rule formalization for measurement frontier | ~60 |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/operationalCeiling.js` | DETERMINISTIC | T2 materializer — assembly + lookup from qualification constraints | ~50 |

### Files to Modify

| File | Modification | Classification |
|------|-------------|---------------|
| None | Phase 1 is entirely additive | — |

### Data Flow

```
resolveSemanticPayload() → fullReport (CIP equivalent)
                              │
                              ▼
                    PICRRuntime.materialize(cip)
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         T1 materializers  T2 materializers  T3/T4 materializers
         (4 objects)       (3 objects)       (2 objects)
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
                    { cognitionObjects: { ... } }
```

### CIP Input Contract

The CIP (Compiled Intelligence Package) consumed by PICR is the aggregate of these resolver outputs:

| CIP Component | Source | Fields Consumed |
|--------------|--------|-----------------|
| fullReport | `resolveSemanticPayload()` | ~180 fields — domain registry, signal families, pressure zones, topology, qualification |
| synthesisResult | `SignalSynthesisEngine.synthesize()` | conditions, combination patterns, topology overlays |
| consequenceResult | `ConsequenceCompiler.compile()` | consequence types, combination patterns, severity, scope |
| cognitionOntology | `CognitionOntology` static definition | slice taxonomy, evidence classification |
| classRiskLabels | Resolver classification | risk labels per domain/capability |
| qualificationPackage | SQO state artifacts | promotion_state, proposition_review_state, qualification_blockers |

### Dependency Graph

```
Phase 1 has NO upstream phase dependencies.
It depends only on existing runtime code (resolver, SignalSynthesisEngine, ConsequenceCompiler).
```

### Per-Materializer Source Reference (from Consumption Baseline Map §3)

| Materializer | Primary LENS Source | Key Fields |
|-------------|--------------------|-----------| 
| structuralPosture | fullReport.posture_label, fullReport.readiness_state, fullReport.confidence_envelope | posture_label, posture_drivers, confidence_envelope, structural_coverage |
| tensionMap | synthesisResult.conditions, consequenceResult.consequences | active_tensions, severity_distribution, cross_domain_tensions |
| constraintInventory | consequenceResult.consequences (filtered by constraint types) | binding_constraints, governance_constraints, structural_constraints |
| exposureAssessment | fullReport.pressure_zones, synthesisResult.conditions (exposure-class) | exposure_surfaces, severity_assessment, blast_radius_estimates |
| trajectoryAssessment | fullReport.spine_data (executive_projection_snapshots) | movement_vectors, posture_trajectory, temporal_comparison |
| decisionSurface | consequenceResult.consequences (decision-relevant), synthesisResult.conditions | pending_decisions, decision_drivers, decision_urgency |
| absenceProfile | fullReport (gap analysis — what is NOT measured) | absent_capabilities, measurement_gaps, coverage_holes |
| detectionBoundary | synthesisResult.conditions (detection-class), fullReport.signal_families | measurement_frontier, prior_art_comparison, detection_novelty |
| operationalCeiling | qualificationPackage, fullReport.qualification_posture | ceiling_factors, qualification_constraints, advancement_blockers |

---

## Phase 2 — PICP (Cognition Package)

### Files to Create

| File | Classification | Purpose | LOC Estimate |
|------|---------------|---------|-------------|
| `app/execlens-demo/lib/lens-v2/cognition/PICPSchema.js` | DETERMINISTIC | PICP container schema — 9 objects + metadata envelope | ~80 |
| `app/execlens-demo/lib/lens-v2/cognition/PICPProducer.js` | DETERMINISTIC | Wraps PICR output in PICP container with metadata | ~60 |

### Files to Modify

| File | Modification | Classification |
|------|-------------|---------------|
| `PICRRuntime.js` (Phase 1) | Wire PICR output into PICPProducer | DETERMINISTIC |

### PICP Schema Structure

```javascript
// PICPSchema.js — DETERMINISTIC
{
  metadata: {
    schema_version: "1.0.0",
    pipeline_run_id: String,     // links to specific run
    client_id: String,
    specimen_id: String,
    timestamp: ISO8601,
    qualification_state: {       // from SQO
      s_level: "S0" | "S1" | "S2" | "S3",
      q_class: "Q-01" | "Q-02" | "Q-03" | "Q-04",
      authority_ceiling: String
    },
    chronicle_certification: {   // from Chronicle
      status: "CERTIFIED" | "UNCERTIFIED",
      check_count: Number,
      pass_count: Number
    }
  },
  cognition_objects: {
    structural_posture: { ... },
    tension_map: { ... },
    constraint_inventory: { ... },
    exposure_assessment: { ... },
    trajectory_assessment: { ... },
    decision_surface: { ... },
    absence_profile: { ... },
    detection_boundary: { ... },
    operational_ceiling: { ... }
  }
}
```

### Dependency Graph

```
Phase 2 depends on Phase 1 (PICR output is the input to PICP wrapping).
```

---

## Phase 3 — PRE (Consumer Projection Engine)

### Files to Create

| File | Classification | Purpose | LOC Estimate |
|------|---------------|---------|-------------|
| `app/execlens-demo/lib/lens-v2/projection/PRECore.js` | DETERMINISTIC | PRE orchestrator — Zone A → Zone B → Zone C dispatch | ~150 |
| `app/execlens-demo/lib/lens-v2/projection/ProjectionConfig.js` | DETERMINISTIC | ProjectionConfig schema and loader | ~80 |
| `app/execlens-demo/lib/lens-v2/projection/ZoneA.js` | DETERMINISTIC | Zone A — deterministic projection (PICP → consumer structures) | ~200 |
| `app/execlens-demo/lib/lens-v2/projection/ZoneB.js` | GOVERNED_AI | Zone B — governed narrative interface (75.x bounded) | ~150 |
| `app/execlens-demo/lib/lens-v2/projection/ZoneC.js` | QUALIFICATION | Zone C — qualification gate (SQO authority ceiling) | ~120 |
| `app/execlens-demo/lib/lens-v2/projection/configs/eir.js` | DETERMINISTIC | EIR ProjectionConfig instance | ~40 |
| `app/execlens-demo/lib/lens-v2/projection/configs/boardroom.js` | DETERMINISTIC | BOARDROOM ProjectionConfig instance | ~40 |
| `app/execlens-demo/lib/lens-v2/projection/configs/balanced.js` | DETERMINISTIC | BALANCED ProjectionConfig instance | ~40 |
| `app/execlens-demo/lib/lens-v2/projection/configs/dense.js` | DETERMINISTIC | DENSE ProjectionConfig instance | ~40 |
| `app/execlens-demo/lib/lens-v2/projection/configs/operator.js` | DETERMINISTIC | OPERATOR ProjectionConfig instance | ~40 |
| `app/execlens-demo/lib/lens-v2/projection/configs/investigation.js` | DETERMINISTIC | INVESTIGATION ProjectionConfig instance | ~40 |

### PRE Core Architecture

```
PRECore.project(picp, projectionConfig)
    │
    ├── Zone A: ZoneA.project(picp, projectionConfig)
    │     └── Selects cognition objects per config
    │     └── Applies structural template
    │     └── Assembles consumer-ready data structure
    │     └── Returns: { sections: [...], assets: [...] }
    │
    ├── Zone B: ZoneB.narrate(zoneAOutput, projectionConfig.audience)
    │     └── Invokes governed narrative under 75.x
    │     └── Applies audience model (executive/operational/structural/forensic)
    │     └── Wraps output with disclosure metadata
    │     └── Traces every claim to evidence source
    │     └── Returns: { narratives: [...], disclosures: [...] }
    │
    └── Zone C: ZoneC.qualify(zoneBOutput, picp.metadata.qualification_state)
          └── Enforces SQO S-level authority ceiling
          └── Applies 13 absolute prohibitions
          └── Wraps with governance metadata
          └── Suppresses projections exceeding ceiling
          └── Returns: { qualified_output: {...}, governance: {...} }
```

### Consumer-Genericity Contract

PRE core files (PRECore.js, ZoneA.js, ZoneB.js, ZoneC.js, ProjectionConfig.js) are consumer-INDEPENDENT. They accept any valid ProjectionConfig and produce consumer-appropriate output.

Consumer-specific files are ONLY in `projection/configs/` and consumer-specific rendering adapters. Adding a new consumer = adding a config file + adapter. ZERO PRE core changes.

### Dependency Graph

```
Phase 3 depends on Phase 2 (PICP is the input to PRE).
Phase 3 config files reference Phase 1 cognition object names.
```

---

## Phase 4 — First Consumer Proof (EIR)

### Files to Create

| File | Classification | Purpose | LOC Estimate |
|------|---------------|---------|-------------|
| `app/execlens-demo/lib/lens-v2/consumers/eir/EIRAdapter.js` | DETERMINISTIC | EIR rendering adapter — chapters from cognition objects | ~200 |
| `app/execlens-demo/lib/lens-v2/consumers/eir/EIRRenderer.js` | DETERMINISTIC | Multi-format rendering (HTML/PDF/PPTX mechanics) | ~250 |
| `app/execlens-demo/lib/lens-v2/consumers/eir/templates/chapter.html` | DETERMINISTIC | Chapter HTML template (4-part finding structure) | ~80 |
| `app/execlens-demo/lib/lens-v2/consumers/eir/templates/report.html` | DETERMINISTIC | Report wrapper template (TOC, metadata, footer) | ~60 |

### EIR Chapter → Cognition Object Mapping

Based on EIR forensic analysis (PI.EXECUTIVE-INTELLIGENCE-REPORT-COMPILER.01):

| EIR Chapter | Primary Cognition Object | Secondary Objects |
|-------------|------------------------|-------------------|
| Ch 1: Executive Posture | structural_posture | operational_ceiling |
| Ch 2: Structural Tensions | tension_map | constraint_inventory |
| Ch 3: Exposure Profile | exposure_assessment | detection_boundary |
| Ch 4: Decision Landscape | decision_surface | tension_map |
| Ch 5: Trajectory | trajectory_assessment | structural_posture |
| Ch 6: Operational Constraints | constraint_inventory | operational_ceiling |
| Ch 7: Absence Analysis | absence_profile | detection_boundary |
| Ch 8: Risk Stratification | exposure_assessment | constraint_inventory |
| Ch 9: Recommendations | decision_surface | trajectory_assessment |
| Ch 10: Appendices | All objects | — (evidence assembly) |

### Dependency Graph

```
Phase 4 depends on Phase 3 (PRE is the engine, EIR is the first consumer).
Phase 4 validates the consumer-genericity invariant (PRE core must not change).
```

---

## Phase 5 — Graphics and Topology as PRE-Consumable Assets

### Files to Create

| File | Classification | Purpose | LOC Estimate |
|------|---------------|---------|-------------|
| `app/execlens-demo/lib/lens-v2/projection/assets/TopologyAssetRenderer.js` | DETERMINISTIC | Static SVG rendering for report embedding | ~120 |
| `app/execlens-demo/lib/lens-v2/projection/assets/PressureZoneAsset.js` | DETERMINISTIC | Pressure zone summary graphic generation | ~80 |

### Files to Modify

| File | Modification | Classification |
|------|-------------|---------------|
| `ZoneA.js` (Phase 3) | Add asset inclusion in deterministic projection | DETERMINISTIC |
| `ProjectionConfig.js` (Phase 3) | Add asset_references field to config schema | DETERMINISTIC |

### Asset Pipeline

```
StructuralTopologyZone.jsx (interactive) ──→ TopologyAssetRenderer.js (static SVG)
IntelligenceField.jsx (interactive) ──→ PressureZoneAsset.js (static graphic)
                                              │
                                              ▼
                                    PRE Zone A includes assets
                                    per ProjectionConfig.asset_references
```

### Dependency Graph

```
Phase 5 depends on Phase 3 (assets are consumed by PRE Zone A).
Phase 5 does not depend on Phase 4 (can proceed in parallel after Phase 3).
```

---

## Phase 6 — LENS as Reference Consumer #2

### Files to Create

| File | Classification | Purpose | LOC Estimate |
|------|---------------|---------|-------------|
| `app/execlens-demo/lib/lens-v2/consumers/lens/LENSPICPAdapter.js` | DETERMINISTIC | Adapter routing PICP through PRE for LENS personas | ~100 |

### Files to Modify

| File | Modification | Classification |
|------|-------------|---------------|
| `ConsequenceCompiler.js` | Re-route forBoardroom(), forBalanced(), forOperator(), forInvestigation() to consume PICP through PRE | DETERMINISTIC |
| LENS persona zone components | Consume PRE output instead of direct fullReport fields | DETERMINISTIC |

### Regression Test Strategy

For each persona mode (BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION):

1. **Capture BEFORE:** Snapshot current rendering output with current consumption path
2. **Re-route:** Wire persona to consume PICP through PRE with persona-specific ProjectionConfig
3. **Capture AFTER:** Snapshot rendering output through new consumption path
4. **Diff:** BEFORE and AFTER must be identical
5. **If diff ≠ 0:** Investigate. Either the re-routing introduced a regression, or the formalization exposed an existing inconsistency.

### Consumer-Genericity Validation

| Validation Check | Method | Expected Result |
|-----------------|--------|-----------------|
| PRE core files modified? | `git diff` on PRECore.js, ZoneA.js, ZoneB.js, ZoneC.js | No changes |
| Zone boundaries changed? | Code review of Zone A/B/C interfaces | No changes |
| Qualification gate modified? | Code review of ZoneC.js | No changes |
| Only ProjectionConfig + adapters added? | `git diff --stat` | Only configs/ and consumers/ |
| LENS rendering identical? | Before/after visual diff | Identical |

### Dependency Graph

```
Phase 6 depends on Phase 3 (PRE must exist before LENS can consume through it).
Phase 6 depends on Phase 4 (EIR as first proof — validates PRE works before LENS re-routing).
Phase 6 is the architecture validation phase.
```

---

## Full Dependency Graph

```
Phase 1 (PICR) ──→ Phase 2 (PICP) ──→ Phase 3 (PRE) ──→ Phase 4 (EIR)
                                            │                    │
                                            │                    ▼
                                            ├──→ Phase 5 (Graphics)
                                            │
                                            └──→ Phase 6 (LENS)
```

Phase 5 and Phase 6 can proceed in parallel after Phase 3, though Phase 6 benefits from Phase 4 validation.

---

## Classification Summary

| Classification | File Count | Total LOC |
|---------------|-----------|-----------|
| DETERMINISTIC | 23 | ~2,100 |
| GOVERNED_AI | 1 (ZoneB.js) | ~150 |
| QUALIFICATION | 1 (ZoneC.js) | ~120 |
| **Total** | **25** | **~2,370** |

**~93% DETERMINISTIC. ~6% GOVERNED_AI. ~5% QUALIFICATION.**

The governed AI surface is a single file (ZoneB.js) operating under 75.x bounded interpretive authority. Everything else is deterministic or qualification enforcement.
