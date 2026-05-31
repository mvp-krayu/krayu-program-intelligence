# BlueEdge — Evidence Appendix

**Krayu Program Intelligence** | May 2026

---

## A. Evidence Sources Used

### Primary Structural Artifacts

| Artifact | Path | Content |
|---|---|---|
| Structural Node Inventory (40.2) | `structure/40.2/structural_node_inventory.json` | 944 nodes (741 files + 203 directories) |
| Canonical Topology (40.4) | `structure/40.4/canonical_topology.json` | 10 clusters, parent-child relationships |
| Code Graph (40.3s) | `structure/40.3s/code_graph.json` | 3,332 relationships (2,139 IMPORTS, 555 DEFINES_CLASS, 638 DEFINES_FUNCTION) |
| Structural Centrality (40.3c) | `structure/40.3c/structural_centrality.json` | 680 files ranked, 7-role classification |
| Binding Envelope | `vault/binding_envelope.json` | 13 DOM, 10 CEU, 10 CS, 23 binding edges |
| Semantic Topology | `semantic/topology/semantic_topology_model.json` | 17 domains, 5 semantic clusters |

### Signal Artifacts

| Signal Family | Source | Signals |
|---|---|---|
| PSIG (Level 2) | `vault/signal_registry.json` | PSIG-001 (5.663 HIGH), PSIG-002 (3.210 HIGH), PSIG-004 (2.182 HIGH), PSIG-006 (0 ACTIVATED) |
| ISIG (Level 1) | `artifacts/isig/.../isig_signal_set.json` | ISIG-001 (35.288 HIGH), ISIG-002 (22.253 HIGH) |
| DPSIG (Topology) | `artifacts/dpsig/.../dpsig_signal_set.json` | DPSIG-031 (3.453 ELEVATED), DPSIG-032 (0.573 ELEVATED) |

### Pressure Zone Artifacts

| Artifact | Path | Content |
|---|---|---|
| Pressure Zone State | `75.x/pressure_zone_state.json` | 1 compound zone (PZ-001), 3 conditions, DOM-04 anchor |
| Pressure Zone Projection | `41.x/pressure_zone_projection.json` | Zone narrative and structural blind spots |

### Qualification Artifacts

| Artifact | Path | Content |
|---|---|---|
| Promotion State | `sqo/promotion_state.json` | S2, GOVERNED_LIFECYCLE, 0 active blockers |
| Revalidation Result | `sqo/revalidation_result.json` | 25/25 PASS |
| Constitutional Replay Anchor | `sqo/constitutional_replay_anchor.json` | 8/8 PASS, CONSTITUTIONAL_DISTANCE_ACCEPTABLE |
| Proposition Review State | `semantic/spe/proposition_review_state.json` | 85 propositions, 81 accepted, 3 rejected, 1 arbitrated |
| Chronicle Certification | `chronicle/chronicle_certification.json` | 62/62 PASS, REPLAY-CERTIFIED |

All paths relative to: `clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/`

---

## B. Runtime Used

| Parameter | Value |
|---|---|
| Specimen | BlueEdge |
| Run ID | `run_blueedge_genesis_e2e_03` |
| Baseline commit | `9f181a9` |
| Baseline tag | `PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE.RC-09` |
| Client UUID | `6a6fcdbc-41b6-4e0e-99b9-37394f6c870d` |
| Governing contract | `PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.E2E.01` |
| Indexer | `typescript-compiler-api v5.9.3` |
| S-Level | S2 (GOVERNED_LIFECYCLE) |
| Q-Class | Q-03 (Semantic Continuity Only) |
| Grounding ratio | 0.235 (4/17 domains structurally backed) |
| Authority ceiling | L5 (at S2) |

---

## C. SW-INTEL Modules Active

### SignalSynthesisEngine

11 primitive rules + 1 composite rule producing 12 condition types:

| Rule | Condition Type | Evidence Source | Behavioral Class |
|---|---|---|---|
| ruleDeliveryPressureConcentration | DELIVERY_PRESSURE_CONCENTRATION | PSIG + pressure_zone_state | B |
| ruleDependencyChokePoint | DEPENDENCY_CHOKE_POINT | ISIG import graph | B |
| rulePropagationAsymmetry | PROPAGATION_ASYMMETRY | ISIG fan asymmetry | A |
| ruleStructuralMassConcentration | STRUCTURAL_MASS_CONCENTRATION | DPSIG cluster metrics | B |
| ruleCrossDomainCouplingPressure | CROSS_DOMAIN_COUPLING_PRESSURE | Structural centrality | D |
| ruleExecutionFragility | EXECUTION_FRAGILITY | Import edge cohesion analysis | C |
| ruleExecutionConstriction | EXECUTION_CONSTRICTION | Tarjan articulation points + through-flow | A |
| ruleStructuralBoundaryDivergence | STRUCTURAL_BOUNDARY_DIVERGENCE | Cross-boundary import ratio | E |
| ruleCouplingInertia | COUPLING_INERTIA | Union-find bidirectional clusters | D |
| ruleGovernanceCoverageStatus | GOVERNANCE_COVERAGE_STATUS | Domain coverage analysis | — |
| ruleCompoundConvergence | COMPOUND_CONVERGENCE | Multi-condition co-location | Composite |

### ConsequenceCompiler

8 atomic consequence classes + 3 combination patterns:

| Consequence | Type | Description |
|---|---|---|
| COORD_FRAG | Atomic | Coordination brittleness |
| DEP_AMP | Atomic | Dependency amplification |
| DEL_EXP | Atomic | Delivery risk exposure |
| OP_BOTTLENECK | Atomic | Operational throughput constraint |
| RESIL_DEF | Atomic | Resilience deficit |
| GOV_GAP | Atomic | Governance surface incompleteness |
| PROP_EXP | Atomic | Asymmetric propagation |
| STAB_RISK | Atomic | Multi-factor instability |
| AMPLIFIED_DEP_FRAG | Combination | Pressure + choke point co-location |
| STRUCT_GRAVITY_WELL | Combination | Mass + pressure co-location |
| SYSTEMIC_OP_FRAG | Combination | 3+ independent conditions converging |

### CognitionOntology

Static cognition graph: 10 condition nodes, 8 consequence nodes, 3 combination nodes, 2 rule nodes. A–E behavioral class mapping.

### InvestigationVerifier

5-step verification protocol: evidence anchor → derivation trace → consequence rules → combination patterns → compilation integrity. Optional replay contract.

### Structural Enrichment Surfaces

4 enrichment surfaces computed from raw import edges:

| Surface | Algorithm | Key Metric |
|---|---|---|
| fragility_surface | Cohesion from import edge classification | fragility = coupling × (1 − cohesion) |
| constriction_surface | Tarjan articulation points + through-flow | constriction_score = through_flow × bridge_multiplier |
| boundary_divergence | Cross-boundary import ratio per module | divergence_score = weighted cross ratio × log₂(edges) |
| coupling_inertia | Union-find bidirectional cluster detection | inertia_score = density × modules × log₂(intra_edges) |

---

## D. Verification Status

| Check | Status | Detail |
|---|---|---|
| SQO Qualification | S2 GOVERNED | Full governed lifecycle |
| Revalidation | 25/25 PASS | 85 propositions validated |
| Constitutional Anchor | 8/8 PASS | CONSTITUTIONAL_DISTANCE_ACCEPTABLE |
| Chronicle Certification | 62/62 PASS | REPLAY-CERTIFIED |
| Governance Coverage | COMPLETE | All nodes domain-anchored |
| Signal Activation | 7/8 ACTIVE | PSIG-003, PSIG-005 not activated |
| SW-INTEL Conditions | 11 ACTIVE | 2 CRITICAL, 8 HIGH, 1 ELEVATED |
| SW-INTEL Behavioral Classes | 5/5 ACTIVE | All ontology classes represented |
| Evidence Classification | ALL TAGGED | Every overlay carries provenance |
| Governance Assertions | ALL PASS | 11 governance assertions verified |

### Governance Assertions Verified

- topology_always_read_only
- qualifier_never_suppressed
- blocked_state_never_softened
- diagnostic_state_never_softened
- evidence_references_always_preserved
- no_ai_calls
- no_prompt_surfaces
- no_chatbot_ux
- no_animated_propagation
- no_topology_mutation
- no_semantic_mutation

---

## E. BlueEdge Structural Evidence Summary

### Top 10 Dependency Hubs (by import in-degree)

| Rank | File | In-Degree | Out-Degree | Role |
|---|---|---|---|---|
| 1 | `backend/src/common/dto/index.ts` | 111 | 2 | Re-export hub |
| 2 | `frontend/hooks/index.tsx` | 74 | 10 | Hook aggregator |
| 3 | `frontend/api/client.ts` | 68 | 0 | API client |
| 4 | `backend/src/common/guards/roles.guard.ts` | 63 | 0 | Auth guard |
| 5 | `backend/src/common/guards/jwt-auth.guard.ts` | 62 | 0 | Auth guard |
| 6 | `backend/src/common/cache/index.ts` | 61 | 4 | Cache layer |
| 7 | `frontend/socket/index.tsx` | 59 | 1 | WebSocket |
| 8 | `frontend/components/layout/PageHeader.tsx` | 57 | 1 | Layout |
| 9 | `frontend/utils/index.ts` | 54 | 0 | Utilities |
| 10 | `frontend/components/ui/Badge.tsx` | 52 | 0 | UI component |

### Top 5 Fan-Out Sources (by import out-degree)

| Rank | File | Out-Degree | In-Degree | Role |
|---|---|---|---|---|
| 1 | `frontend/App.tsx` | 70 | 0 | App entry |
| 2 | `backend/src/app.module.ts` | 69 | 0 | Module root |
| 3 | `frontend/api/index.ts` | 61 | 0 | API barrel |
| 4 | `frontend/router/LazyRoutes.tsx` | 56 | 0 | Route config |

### Cluster Mass Distribution

| Cluster | Primary Content | Nodes | % of Total |
|---|---|---|---|
| CLU-04 | backend | 541 | 57.3% |
| CLU-05* | frontend | ~368 | ~39.0% |
| CLU-01 | .env.example | 1 | 0.1% |
| CLU-02 | .github | 4 | 0.4% |
| CLU-03 | README.md | 1 | 0.1% |
| Others | infrastructure | ~29 | ~3.1% |

### Active SW-INTEL Conditions on BlueEdge

| Condition | Severity | Target Domain | Behavioral Class |
|---|---|---|---|
| Compound Convergence | CRITICAL | Platform Infrastructure (DOMAIN-10) | Composite (A+B+D) |
| Compound Convergence | CRITICAL | Frontend Application (DOMAIN-14) | Composite (A+C+E) |
| Delivery Pressure Concentration | HIGH | Platform Infrastructure | B |
| Dependency Choke Point | HIGH | Platform Infrastructure | B |
| Change Propagation Exposure | HIGH | Frontend Application | A |
| Cross-Domain Coupling | HIGH | Platform Infrastructure | D |
| Execution Fragility | HIGH | Frontend Application | C |
| Execution Constriction | HIGH | Frontend Application | A |
| Execution Constriction | HIGH | Platform Infrastructure | A |
| Structural Boundary Divergence | HIGH | Frontend Application | E |
| Structural Load Imbalance | ELEVATED | Platform Infrastructure | B |

---

*All evidence sourced from governed structural artifacts. No inference. Deterministically reproducible from the same structural inputs.*
