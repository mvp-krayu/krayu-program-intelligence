# Prototype Checkpoint — SW-Intel Cognition Surface Extraction Boundary

**Date:** 2026-06-04
**Status:** TIER 1 EXTRACTED — PICP-consumed, validated in LENS
**Prototype lineage:** PI.SOFTWARE-INTELLIGENCE.COGNITION-COMPRESSION.01 (Tier 1 + Tier 2 extensions)

### Extraction Status (updated)

| Surface | Extraction | Source |
|---------|-----------|--------|
| structural_fragility | **COMPLETE** | `cognition/materializers/structuralFragility.js` → PICP → adapter consumes |
| boundary_alignment | **COMPLETE** | `cognition/materializers/boundaryAlignment.js` → PICP → adapter consumes |
| structural_coupling | **COMPLETE** | `cognition/materializers/structuralCoupling.js` → PICP → adapter consumes |
| All other surfaces | PROTOTYPE | Still derived locally in adapter |

**Validation:** LENS renders identical output for all 3 Tier 1 surfaces from PICP payload. Adapter no longer calls `deriveStructuralFragility()`, `deriveBoundaryAlignment()`, `deriveStructuralCoupling()` — calls `getSwIntelSurface(picp, id)` instead. Local functions remain as deprecated dead code.

---

## 1. Prototype Closure Note

The SoftwareIntelligenceProjectionAdapter now contains **12 cognition surfaces** producing compressed operational assessments from PI Core data. These surfaces are **operationally useful and live in LENS** — they derive real cognition from real evidence. They are also **architecturally violated** — the adapter IS the cognition compiler, combining PICR and PRE responsibilities in a single file.

### What exists

| Tier | Surfaces | Status |
|------|----------|--------|
| Original (6) | Delivery Fragility, Coordination Saturation, Integration Exposure, Operational Topology Posture, Qualification Exposure, Propagation Risk | Live, stable |
| Tier 1 (3) | Structural Fragility, Boundary Alignment, Structural Coupling | Live, scale-fix applied |
| Tier 2 (3) | Reinforcement Flows, Convergence Patterns, Absence Profile | Live, domain-matching fixed |

### What works

- 10 of 12 surfaces render with real data from BlueEdge genesis_e2e_03 (Structural Coupling returns null — no coupling data in specimen)
- All 12 have left-rail domain reasoning contracts in IntelligenceField.jsx
- All 12 have topology overlay handlers in deriveTopologyCognitionState()
- Severity ordering is consistent (HIGH → ELEVATED → MODERATE → LOW)
- Evidence density and domain attribution are traceable

### The violation

```
CURRENT:  CIP → resolveSemanticPayload() → Adapter.derive*() → LENS
                                            ↑ PICR + PRE collapsed into one file

TARGET:   CIP → PICR materializers → PICP → PRE → LENS
                                           → THORR
                                           → EIR
                                           → Marketplace consumers
```

The `derive*()` functions ARE cognition materializers — they produce structured cognition objects from raw signals and enrichment data. They should not live in a "projection adapter." The adapter should consume pre-materialized objects, not produce them.

---

## 2. derive* Functions to Extract

### Surface materializers (PICR extraction candidates)

| # | Function | Line | LOC | Input Sources | Output Shape | PICR Target |
|---|----------|------|-----|---------------|--------------|-------------|
| 1 | `deriveDeliveryFragility(fullReport)` | 129 | ~50 | signal_interpretations, evidence_blocks, propagation_summary | surface object with constituents[] | PICR: delivery_pressure |
| 2 | `deriveCoordinationSaturation(fullReport)` | 182 | ~60 | structural_enrichment.centrality, signal_interpretations, evidence_blocks | surface object with hub analysis | PICR: coordination_saturation |
| 3 | `deriveIntegrationExposure(fullReport)` | 241 | ~90 | structural_enrichment.code_graph, signal_interpretations, evidence_blocks | surface object with coupling analysis | PICR: integration_exposure |
| 4 | `deriveOperationalTopologyPosture(fullReport)` | 334 | ~70 | topology_summary, reconciliation_summary, semantic_domain_registry | surface object with domain posture | PICR: topology_posture |
| 5 | `deriveQualificationExposure(fullReport)` | 403 | ~70 | governance_lifecycle, proposition_corpus, revalidation_intelligence, convergence_intelligence | surface object with governance posture | PICR: qualification_exposure |
| 6 | `derivePropagationRisk(fullReport)` | 474 | ~55 | evidence_blocks, signal_interpretations, propagation_summary | surface object with origin/receiver analysis | PICR: propagation_risk |
| 7 | `deriveStructuralFragility(fullReport)` | 530 | ~70 | structural_enrichment.fragility_surface, signal_interpretations, semantic_domain_registry | surface object with hotspot analysis | PICR: structural_fragility |
| 8 | `deriveBoundaryAlignment(fullReport)` | 600 | ~60 | structural_enrichment.boundary_divergence, signal_interpretations, semantic_domain_registry | surface object with divergence analysis | PICR: boundary_alignment |
| 9 | `deriveStructuralCoupling(fullReport)` | 662 | ~55 | structural_enrichment.coupling_inertia, signal_interpretations, semantic_domain_registry | surface object with cluster analysis | PICR: structural_coupling |
| 10 | `deriveReinforcementFlows(fullReport)` | 722 | ~90 | signal_interpretations, evidence_blocks, semantic_domain_registry | surface object with flow/amplification analysis | PICR: reinforcement_flows |
| 11 | `deriveConvergencePatterns(fullReport)` | 811 | ~110 | signal_interpretations, evidence_blocks, semantic_domain_registry, structural_enrichment | surface object with domain convergence | PICR: convergence_patterns |
| 12 | `deriveAbsenceProfile(fullReport)` | 922 | ~100 | signal_interpretations, structural_enrichment | surface object with health profile | PICR: absence_profile |

### Qualification materializers (PICR extraction candidates)

| # | Function | Line | LOC | PICR Target |
|---|----------|------|-----|-------------|
| 13 | `deriveStructuralRichnessAxis(fullReport)` | 1025 | ~25 | PICR: qualification.structural_richness |
| 14 | `deriveGovernanceDepthAxis(fullReport)` | 1048 | ~30 | PICR: qualification.governance_depth |
| 15 | `deriveReconciliationAuthorityAxis(fullReport)` | 1076 | ~25 | PICR: qualification.reconciliation_authority |
| 16 | `deriveQualificationGuidance(fullReport)` | 1098 | ~45 | PICR: qualification.guidance |
| 17 | `deriveQualificationCognition(fullReport)` | 1161 | ~20 | PICR: qualification.cognition |
| 18 | `deriveExecutionCorridors(fullReport)` | 1145 | ~15 | PICR: execution_corridors |

### Projection functions (stay in adapter — these are PRE)

| # | Function | Line | LOC | Role |
|---|----------|------|-----|------|
| 19 | `deriveProjection(fullReport)` | 1178 | ~50 | PRE orchestrator — calls materializers, sorts, packages |
| 20 | `deriveTopologyCognitionState(activeSurfaceId, fullReport, resolvedSurface)` | 1233 | ~350 | PRE — topology overlay projection per surface |
| 21 | `derivePressureZoneCognitionState(zoneId, fullReport)` | 1583 | ~120 | PRE — pressure zone projection |
| 22 | `deriveConditionCognitionState(condition, fullReport)` | 1699 | ~130 | PRE — condition detail projection |
| 23 | `deriveModuleState(fullReport)` | 115 | ~15 | PRE — module availability gate |

---

## 3. Target PICR Materializer Names

Mapping from current adapter functions to the PICR materializer architecture from the EIR Implementation Roadmap (PHASED_EXECUTION_PLAN.md Phase 1):

### Existing roadmap materializers (9 PICP cognition objects)

| PICP Object | Roadmap Materializer | Existing Prototype Function(s) |
|-------------|---------------------|-------------------------------|
| structural_posture | `materializers/structuralPosture.js` | `deriveOperationalTopologyPosture()` (partial) |
| tension_map | `materializers/tensionMap.js` | `deriveDeliveryFragility()` + `deriveReinforcementFlows()` (partial) |
| constraint_inventory | `materializers/constraintInventory.js` | `deriveCoordinationSaturation()` (partial) |
| exposure_assessment | `materializers/exposureAssessment.js` | `deriveIntegrationExposure()` + `derivePropagationRisk()` (partial) |
| trajectory_assessment | `materializers/trajectoryAssessment.js` | No prototype equivalent (Spine temporal data) |
| decision_surface | `materializers/decisionSurface.js` | No prototype equivalent (consequence priorities) |
| absence_profile | `materializers/absenceProfile.js` | `deriveAbsenceProfile()` (direct match) |
| detection_boundary | `materializers/detectionBoundary.js` | No prototype equivalent (measurement frontier) |
| operational_ceiling | `materializers/operationalCeiling.js` | `deriveQualificationExposure()` (partial) |

### Prototype surfaces NOT in the 9-object model

The prototype produces 12 surfaces. The roadmap defines 9 PICP cognition objects. The mapping is not 1:1. These prototype surfaces don't have direct PICP object equivalents:

| Prototype Surface | Closest PICP Object | Resolution |
|-------------------|---------------------|------------|
| Structural Fragility | constraint_inventory OR exposure_assessment | Sub-object or enrichment dimension |
| Boundary Alignment | structural_posture OR constraint_inventory | Sub-object of structural integrity |
| Structural Coupling | constraint_inventory | Sub-object of structural constraints |
| Convergence Patterns | tension_map | Sub-object — multi-condition convergence IS tension |
| Reinforcement Flows | tension_map | Sub-object — reinforcement IS cross-tension dynamics |

**Architectural decision needed:** Are these 5 surfaces sub-objects within the 9 PICP objects, or do they justify extending the PICP schema to 14 objects? The 7-gate qualification test applies.

---

## 4. PICP Object / Sub-Object Mapping

### Option A: 9 Objects, Surfaces as Sub-Objects

```
PICP {
  structural_posture: {
    ...existing schema...
    sub_objects: {
      topology_posture: from deriveOperationalTopologyPosture()
      boundary_alignment: from deriveBoundaryAlignment()
    }
  }
  tension_map: {
    ...existing schema...
    sub_objects: {
      delivery_fragility: from deriveDeliveryFragility()
      reinforcement_flows: from deriveReinforcementFlows()
      convergence_patterns: from deriveConvergencePatterns()
    }
  }
  constraint_inventory: {
    ...existing schema...
    sub_objects: {
      coordination_saturation: from deriveCoordinationSaturation()
      structural_coupling: from deriveStructuralCoupling()
      structural_fragility: from deriveStructuralFragility()
    }
  }
  exposure_assessment: {
    ...existing schema...
    sub_objects: {
      integration_exposure: from deriveIntegrationExposure()
      propagation_risk: from derivePropagationRisk()
    }
  }
  absence_profile: {
    from deriveAbsenceProfile() — direct 1:1
  }
  trajectory_assessment: { ... }     // no prototype equivalent yet
  decision_surface: { ... }          // no prototype equivalent yet
  detection_boundary: { ... }        // no prototype equivalent yet
  operational_ceiling: {
    from deriveQualificationExposure() — partial
  }
}
```

### Option B: Extend PICP to 14+ Objects

Each prototype surface becomes a first-class PICP cognition object. The 9-object model grows to accommodate SW-Intel surfaces as domain-module-contributed cognition objects. This is consistent with the marketplace architecture: Domain Modules contribute cognition objects to PICP.

**Decision deferred to extraction stream.**

---

## 5. Consumer-Only Adapter Contract

After extraction, the SoftwareIntelligenceProjectionAdapter becomes a thin PRE consumer with this contract:

### Input

```javascript
// Receives pre-materialized PICP (or PICP-equivalent)
function projectSWIntelSurfaces(picp) {
  // picp.cognition_objects contains materialized objects
  // picp.metadata contains qualification state
}
```

### Prohibited

- **No `fullReport` access** — adapter does not read raw CIP data
- **No signal_interpretations iteration** — that's PICR's job
- **No structural_enrichment traversal** — that's PICR's job
- **No evidence_blocks aggregation** — that's PICR's job
- **No domain-matching logic** — domains are pre-resolved by PICR
- **No severity computation** — severity is a PICP property

### Permitted

- **Read PICP cognition objects** — consume pre-materialized surfaces
- **Sort/filter by severity** — projection ordering is PRE
- **Map to rendering shape** — surface cards, topology overlays are PRE
- **Apply ProjectionConfig** — persona-specific projection is PRE
- **Topology overlay composition** — mapping surfaces to visual state is PRE

### Function inventory after extraction

```javascript
// STAYS (PRE functions):
deriveModuleState(picp)                                    // availability gate
projectSurfaces(picp)                                      // was deriveProjection — now reads, not derives
deriveTopologyCognitionState(surfaceId, picp, surface)     // topology overlay
derivePressureZoneCognitionState(zoneId, picp)             // pressure zone overlay
deriveConditionCognitionState(condition, picp)             // condition detail

// REMOVED (extracted to PICR):
// deriveDeliveryFragility, deriveCoordinationSaturation,
// deriveIntegrationExposure, deriveOperationalTopologyPosture,
// deriveQualificationExposure, derivePropagationRisk,
// deriveStructuralFragility, deriveBoundaryAlignment,
// deriveStructuralCoupling, deriveReinforcementFlows,
// deriveConvergencePatterns, deriveAbsenceProfile,
// deriveStructuralRichnessAxis, deriveGovernanceDepthAxis,
// deriveReconciliationAuthorityAxis, deriveQualificationGuidance,
// deriveQualificationCognition, deriveExecutionCorridors
```

### Estimated post-extraction adapter size

- Current: 1,828 lines (PICR + PRE collapsed)
- After extraction: ~650 lines (PRE only — topology overlays, pressure zone state, projection orchestration)
- Extracted to PICR: ~1,100 lines across 12 materializer files (~60-100 LOC each)

---

## 6. Relationship to Existing Roadmap

The EIR Implementation Roadmap (PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01) is COMPLETE as a planning artifact. Its Phase 1 (PICR) maps directly to this extraction:

### What the roadmap already specifies

- File structure: `app/execlens-demo/lib/lens-v2/cognition/PICRRuntime.js` + `materializers/*.js`
- 9 materializers with source references and LOC estimates
- PICP container schema (Phase 2)
- Consumer-generic PRE with Zone A/B/C architecture (Phase 3)
- Non-regression matrix for all LENS surfaces (Phase 6)

### What the prototype adds to the roadmap

The prototype provides **executable specifications** that the roadmap didn't have:

1. **12 working derive functions** that prove what each materializer must produce
2. **Data shape evidence** — the `co_presence` string vs array discovery, the `concentration` narrative matching, the enrichment items without domain fields
3. **Domain reasoning contracts** (IntelligenceField.jsx) that prove what consumers need from each cognition object
4. **Topology overlay handlers** that prove the PRE projection layer requirements

### How to reuse the roadmap

The roadmap can be steered, not rewritten:

1. **Phase 1 (PICR):** Extract the 12+6 derive functions into `cognition/materializers/`. The prototype functions ARE the materializer specifications — lift them verbatim, then refine input contracts.

2. **Phase 2 (PICP):** Resolve the 9-vs-14 object question. The prototype surfaces may map as sub-objects (Option A) or extend the schema (Option B). The 7-gate qualification test decides.

3. **Phase 3 (PRE):** The adapter's topology/pressure/condition overlay functions ARE the PRE projection layer. They stay in the adapter. The domain reasoning contracts in IntelligenceField.jsx ARE the consumer-specific projection configs.

4. **Phase 4 (EIR):** Unchanged — EIR consumes PICP through PRE.

5. **Phase 5 (Graphics):** Unchanged — topology capture is independent.

6. **Phase 6 (LENS as Consumer #2):** This is WHERE the extraction proves itself. If LENS can consume PICP through the same PRE without adapter changes, consumer-genericity is proven.

### What the roadmap needs updating on

- The 9-object model may need to accommodate 12 SW-Intel surfaces (either as sub-objects or extended schema)
- The per-materializer source references need updating for the new surfaces (Tier 1 + Tier 2)
- The LOC estimates should be revised upward for materializers that handle domain-matching complexity
- The non-regression matrix should add Tier 1 and Tier 2 surfaces

---

## 7. Files in This Prototype

| File | Role | Lines | Violation |
|------|------|-------|-----------|
| `lib/lens-v2/SoftwareIntelligenceProjectionAdapter.js` | PICR + PRE collapsed | 1,828 | Cognition compilation in projection layer |
| `components/lens-v2/zones/SoftwareIntelligenceField.jsx` | Surface card renderer | ~350 | Clean — consumer-only |
| `components/lens-v2/zones/IntelligenceField.jsx` | Domain reasoning contracts + main canvas | ~9,500+ | Contracts are consumer-side (PRE Zone A) — correct position |
| `pages/lens-v2-flagship.js` | Inline CSS + page orchestration | ~13,000+ | CSS for surfaces — correct position |

---

## 8. Decision Required

The prototype is frozen. Feature work is stopped. Three decisions are needed:

1. **When to extract:** Execute Phase 1 of the roadmap now, or defer?
2. **9 vs 14 objects:** Are SW-Intel surfaces sub-objects within the 9 PICP objects, or do they extend the schema?
3. **Extraction granularity:** Extract all 18 derive functions at once, or phase by tier (original 6, then Tier 1, then Tier 2)?

Until these decisions are made, the adapter remains the de facto PICR — architecturally wrong, operationally correct.
