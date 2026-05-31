# Current Canonical Paths

> **What exists in the runtime right now — file paths, modules, resolvers.**

---

## LENS v2 Runtime

### Core Resolvers

| Module | Path | Role |
|---|---|---|
| SemanticActorHydrator | app/execlens-demo/lib/lens-v2/ | 15-actor semantic model hydration |
| SemanticCrosswalkMapper | app/execlens-demo/lib/lens-v2/ | DOM-XX → business label translation |
| QClassResolver | app/execlens-demo/lib/lens-v2/ | Q-01→Q-04 governance classification |
| DPSIGSignalMapper | app/execlens-demo/lib/lens-v2/ | Signal stack projection |
| GenericSemanticPayloadResolver | app/execlens-demo/lib/lens-v2/ | Manifest-driven payload assembly |
| BlueEdgePayloadResolver | app/execlens-demo/lib/lens-v2/ | Compatibility wrapper |
| flagshipBinding | app/execlens-demo/lib/lens-v2/flagshipBinding.js | Payload resolution → persona → zone assembly |
| ConditionDrivenLayoutResolver | app/execlens-demo/lib/lens-v2/ | Persona → zone composition mapping |
| DisclosureSequencingContract | app/execlens-demo/lib/lens-v2/ | Q-class disclosure governance |
| ProjectionDepthContract | app/execlens-demo/lib/lens-v2/ | Persona depth projection rules |
| SeverityHierarchyResolver | app/execlens-demo/lib/lens-v2/ | Signal severity classification |
| SemanticArtifactLoader | app/execlens-demo/lib/lens-v2/ | Artifact file loading |
| LensReconciliationConsumptionLayer | app/execlens-demo/lib/lens-v2/ | Reconciliation data binding |
| LensSQOSubstrateConsumer | app/execlens-demo/lib/lens-v2/ | SQO substrate data binding |
| RenderingMetadataSchema | app/execlens-demo/lib/lens-v2/ | Rendering metadata contract |

### Zone Components

| Component | Path | Role |
|---|---|---|
| IntelligenceField | app/execlens-demo/components/lens-v2/zones/ | Primary intelligence rendering zone (persona-aware) |
| StructuralTopologyZone | app/execlens-demo/components/lens-v2/zones/ | Interactive SVG topology graph |
| DeclarationZone | app/execlens-demo/components/lens-v2/zones/ | Declaration and posture display |
| GovernanceRibbon | app/execlens-demo/components/lens-v2/zones/ | Governance status ribbon |
| ReconciliationAwarenessZone | app/execlens-demo/components/lens-v2/zones/ | Reconciliation state awareness |
| SQOIntelligenceZone | app/execlens-demo/components/lens-v2/zones/ | SQO qualification intelligence |
| SemanticTrustPostureZone | app/execlens-demo/components/lens-v2/zones/ | Trust posture display |
| EvidenceDepthLayer | app/execlens-demo/components/lens-v2/zones/ | Evidence depth rendering |
| QualifierMandate | app/execlens-demo/components/lens-v2/zones/ | Qualifier governance display |
| InvestigationReadingGuide | app/execlens-demo/components/lens-v2/zones/ | Investigation flow guidance |

### Software Intelligence Modules

| Module | Path | Role |
|---|---|---|
| SignalSynthesisEngine | app/execlens-demo/lib/lens-v2/SignalSynthesisEngine.js | Deterministic cognition compiler — 11 primitive rules + 1 composite. 12 condition types (11 internal). Transforms signal families + structural enrichment into operational conditions with topology overlays |
| ConsequenceCompiler | app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js | Consequence compilation — compile() + forBoardroom() + forBalanced(). 8 consequence types + 3 combination patterns. COGNITION_SLICE_VOCABULARY for BOARDROOM dynamics graph |
| CognitionOntology | app/execlens-demo/lib/lens-v2/software-intelligence/CognitionOntology.js | Static cognition ontology — CONDITION_NODES + CONSEQUENCE_NODES + RULE_NODES with upstream/downstream refs |
| InvestigationVerifier | app/execlens-demo/lib/lens-v2/software-intelligence/InvestigationVerifier.js | 5-step compilation chain verification — SECTION_4_RULES condition→consequence derivation validation |
| SoftwareIntelligenceProjectionAdapter | app/execlens-demo/lib/lens-v2/SoftwareIntelligenceProjectionAdapter.js | Condition → LENS cognition state derivation (legend, overlay, teaser/full). `translateSignal()` for L3 signal titles. `deriveConditionCognitionState()` for topology overlay semantics. `synthesize()` / `synthesizeTeaser()` for module gating |
| SoftwareIntelligenceField | app/execlens-demo/components/lens-v2/zones/SoftwareIntelligenceField.jsx | SW-Intel condition rendering zone (full activation mode) |
| OrchestrationGuidanceRuntime | app/execlens-demo/components/lens-v2/zones/OrchestrationGuidanceRuntime.jsx | Guided action orchestration (Layer 2 — Orchestration-Agentic Runtime) |

### Export Primitives

| Module | Path | Role |
|---|---|---|
| InterrogationTrailBuilder | app/execlens-demo/lib/lens-v2/InterrogationTrailBuilder.js | Governed evidence record generation (buildTrailHTML) |

### Route Pages

| Page | Path | Role |
|---|---|---|
| LENS v2 flagship (CSS + layout) | app/execlens-demo/pages/lens-v2-flagship.js | Executive surface page + styles |
| LENS v2 isolated route | app/execlens-demo/pages/lens/[client]/[run].js | Standalone LENS v2 at /lens/[client]/[run] |
| LENS v2 API | app/execlens-demo/pages/api/lens-payload.js | Payload serving endpoint |

## SQO Runtime

| Module | Path | Role |
|---|---|---|
| SQOCockpitStateResolver | app/execlens-demo/lib/sqo-cockpit/server/ | S-state machine |
| 18 SQO engines | app/execlens-demo/lib/sqo-cockpit/server/ | Qualification engines |
| QualificationVisualStateResolver | app/execlens-demo/lib/sqo-cockpit/server/ | Severity classification |
| BlueEdgeRuntimeCorridorLoader | app/execlens-demo/lib/sqo-cockpit/server/ | Overlay/replay/rollback |
| ExplicitEvidenceRebaseExtractor | app/execlens-demo/lib/sqo-cockpit/server/ | Evidence extraction + admissibility |
| ClientScopedSectionResolver | app/execlens-demo/lib/sqo-cockpit/server/ClientScopedSectionResolver.server.js | Client-scoped section dispatch gate with runtime isolation |
| QualificationPostureResolver | app/execlens-demo/lib/sqo-cockpit/QualificationPostureResolver.js | 8-state qualification posture derivation from operational data |
| SemanticQualificationIntakeResolver | app/execlens-demo/lib/sqo-cockpit/server/SemanticQualificationIntakeResolver.server.js | Layer B semantic intake from compiler output |
| 60 cockpit components (51 + 6 authority + 3 projection) | app/execlens-demo/components/sqo-cockpit/ | UI rendering |
| 15 cockpit routes | app/execlens-demo/pages/sqo/client/[client]/run/[run]/ | Section pages (all client-scoped via SQOWorkspaceShell) |

### Authority Workflow Modules

| Module | Path | Role |
|---|---|---|
| PromotionStateLoader | app/execlens-demo/lib/sqo-cockpit/server/PromotionStateLoader.server.js | Load/write promotion state artifacts from disk |
| SQOAuthorityValidator | app/execlens-demo/lib/sqo-cockpit/server/SQOAuthorityValidator.server.js | 12-action authority validation with 5 RBAC roles and 7 non-automatable boundaries |
| PromotionEventWriter | app/execlens-demo/lib/sqo-cockpit/server/PromotionEventWriter.server.js | Append-only JSONL event writer with semantic_disposition |
| SQOActionEngine | app/execlens-demo/lib/sqo-cockpit/server/SQOActionEngine.server.js | 12-action orchestrator: validate → snapshot → mutate → event → replay validate |
| OperatorWorkflowResolver | app/execlens-demo/lib/sqo-cockpit/server/OperatorWorkflowResolver.server.js | SSR data resolver for authority page |
| SQORuntimeResolver | app/execlens-demo/lib/sqo-cockpit/server/SQORuntimeResolver.server.js | Canonical runtime substrate discovery — probes static and operational paths, resolves capabilities and section availability |

### CEU Reconciliation Workflow Modules

| Module | Path | Role |
|---|---|---|
| CEUStateLoader | app/execlens-demo/lib/sqo-cockpit/server/CEUStateLoader.server.js | Load/write CEU reconciliation artifacts from disk |
| CEUAuthorityValidator | app/execlens-demo/lib/sqo-cockpit/server/CEUAuthorityValidator.server.js | 10-action CEU validation with 5 RBAC roles and non-automatable boundary |
| CEUEventWriter | app/execlens-demo/lib/sqo-cockpit/server/CEUEventWriter.server.js | Append-only RCEU event log writer |
| CEUActionEngine | app/execlens-demo/lib/sqo-cockpit/server/CEUActionEngine.server.js | 10-action orchestrator with review_mode-aware promotion gate |
| CEUReconciliationResolver | app/execlens-demo/lib/sqo-cockpit/server/CEUReconciliationResolver.server.js | SSR workspace data resolver for CEU reconciliation page |

### V2 Cockpit Modules

| Module | Path | Role |
|---|---|---|
| resolveOperatorWorkflow | app/execlens-demo/lib/sqo-cockpit/server/OperatorWorkflowResolver.server.js | V2 brain — full workflow state computation (posture, guidance, blockers, actions, progression, role projection) |
| resolveOperatorWorkflowFromRaw | app/execlens-demo/lib/sqo-cockpit/server/OperatorWorkflowResolver.server.js | Convenience wrapper — loads raw state then delegates |
| V2CockpitRouteResolver | app/execlens-demo/lib/sqo-cockpit/V2CockpitRouteResolver.js | Tier-aware V2 route resolver (TIER1/TIER2/TIER3 classification, path building) |
| WorkflowRoleProjection | app/execlens-demo/lib/sqo-cockpit/client/WorkflowRoleProjection.js | Client-side role recomputation (pure function, no server imports) |

### V2 Cockpit Components

| Component | Path | Role |
|---|---|---|
| OperationalCockpitShell | app/execlens-demo/components/sqo-cockpit/v2/ | V2 top-level shell — role state management, content routing |
| OperationalOverviewShell | app/execlens-demo/components/sqo-cockpit/v2/ | V2 posture-first composed overview layout |
| WorkflowNavigationRail | app/execlens-demo/components/sqo-cockpit/v2/ | 3-tier grouped navigation |
| RoleDeclarationGate | app/execlens-demo/components/sqo-cockpit/v2/ | Session role selector — 5 role cards |
| PrimaryGuidanceStrip | app/execlens-demo/components/sqo-cockpit/v2/ | "What do I do next?" with urgency accent |
| BlockerSummaryPanel | app/execlens-demo/components/sqo-cockpit/v2/ | Lane-grouped blocker summary with resolvability |
| ActionAvailabilityGrid | app/execlens-demo/components/sqo-cockpit/v2/ | 12 governed actions in category-grouped grid |
| ProgressionPathVisualization | app/execlens-demo/components/sqo-cockpit/v2/ | 6-step horizontal progression path |

### V2 Cockpit Routes

| Page | Path | Role |
|---|---|---|
| V2 overview | app/execlens-demo/pages/sqo/client/[client]/run/[run]/v2/index.js | V2 entry surface at /v2/ |
| V2 authority | app/execlens-demo/pages/sqo/client/[client]/run/[run]/v2/authority.js | V2 authority page at /v2/authority |
| V2 detail | app/execlens-demo/pages/sqo/client/[client]/run/[run]/v2/detail/[section].js | Tier 2 detail pages at /v2/detail/{section} |
| V2 forensic | app/execlens-demo/pages/sqo/client/[client]/run/[run]/v2/forensic/[section].js | Tier 3 forensic pages at /v2/forensic/{section} |

### Authority Workflow API

| Route | Path | Role |
|---|---|---|
| POST /api/sqo/authority-action | app/execlens-demo/pages/api/sqo/authority-action.js | System's first mutation endpoint — governed authority action processing |

### Authority Workflow Page

| Page | Path | Role |
|---|---|---|
| Authority page | app/execlens-demo/pages/sqo/client/[client]/run/[run]/authority.js | Operator authority workflow surface |

### Authority Workflow Components

| Component | Path | Role |
|---|---|---|
| OperatorAuthorityWorkflowPanel | app/execlens-demo/components/sqo-cockpit/authority/ | Layout shell with disclaimer footer |
| AuthorityPostureBanner | app/execlens-demo/components/sqo-cockpit/authority/ | S-level, authority ceiling, lane summary |
| ReviewQueueActionPanel | app/execlens-demo/components/sqo-cockpit/authority/ | Review obligations with per-item affordances |
| PromotionControlPanel | app/execlens-demo/components/sqo-cockpit/authority/ | Qualification advancement and insufficiency acknowledge |
| QualificationBlockerActionList | app/execlens-demo/components/sqo-cockpit/authority/ | Blocker list with resolution paths |
| PromotionEventTimeline | app/execlens-demo/components/sqo-cockpit/authority/ | Immutable event timeline display |

## Pipeline Scripts

| Script | Path | Role |
|---|---|---|
| run_client_pipeline.py | scripts/pios/ | Multi-client E2E pipeline orchestrator (9+ phases) |
| structural_scanner.py | scripts/pios/ | Generic structural scanner (40.2/40.3/40.4) |
| structural_relevance_classifier.py | scripts/pios/ | Structural relevance classification (40.2r/40.3r — Phase 3.5) |
| dom_layer_generator.py | scripts/pios/ | DOM layer derivation (A.5 path-prefix, 40.2r-aware) |
| ceu_grounding.py | scripts/pios/ | CEU grounding engine (consumes full 40.2) |
| source_intake.py | scripts/pios/ | Source intake processor |
| semantic_derivation_compiler.py | scripts/pios/ | AI-assisted semantic derivation (Phase 3b) |
| code_graph_feasibility.py | scripts/pios/ | ast-based code-graph structural enrichment prototype (40.3s) |
| structural_centrality.py | scripts/pios/ | Structural centrality derivation from 40.3s (40.3c — Phase 3.7) |
| chronicle_builder_rc08.py | scripts/pios/sdc/ | Parameterized chronicle HTML builder (--client, --run-id). 8-chapter Z1-Z5 cognitive traversal, data-derived from run artifacts |
| chronicle_certification_rc09.py | scripts/pios/sdc/ | 10-phase/62-check deterministic chronicle certification engine (--client, --run-id) |

## Evidence / Data

| Artifact | Path | Role |
|---|---|---|
| evidence_sources.yaml | app/execlens-demo/lib/sqo-cockpit/server/ | Source configuration |
| semantic_continuity_crosswalk.json | app/execlens-demo/lib/ | Crosswalk entity mappings |
| BlueEdge SQO artifacts | artifacts/sqo/blueedge/ | Client qualification data |
| FastAPI SQO artifacts | artifacts/sqo/fastapi/ | Client qualification data |
| BlueEdge evidence files | artifacts/sqo/blueedge/evidence_rebase_01/ | HTML evidence sources |
| BlueEdge SQO operational artifacts | clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/sqo/ | SQO-native promotion state, qualification blockers, review obligations, event log (governance projection from legacy qualification) |
| pallets-flask SQO artifacts | clients/pallets-flask/psee/runs/run_github_flask_20260517_163222/sqo/ | Promotion state, blockers, obligations, event log (gitignored, runtime-mutated) |
| pallets-flask manifest | app/execlens-demo/lib/lens-v2/manifests/pallets-flask.run_github_flask_20260517_163222.json | Client REGISTRY entry |
| pallets-flask client.yaml | clients/pallets-flask/client.yaml | Client registration (pipeline prerequisite) |
| pallets-flask source manifest | clients/pallets-flask/sources/source_01/source_manifest.json | Source registration (pipeline prerequisite) |
| NetBox client.yaml | clients/netbox/client.yaml | Client registration (first live S2 candidate) |
| NetBox source manifest | clients/netbox/sources/source_01/source_manifest.json | Source registration |
| NetBox manifest | app/execlens-demo/lib/lens-v2/manifests/netbox.run_github_netbox_20260520_134600.json | LENS REGISTRY entry (S1 structural-only) |
| NetBox structural artifacts | clients/netbox/psee/runs/run_github_netbox_20260520_134600/structure/ | 40.2, 40.3, 40.4, 40.2r, 40.3s, 40.3c (gitignored) |
| BlueEdge chronicle vault | clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/chronicle/ | REPLAY_CHRONICLE.html + chronicle_certification.json (REPLAY-CERTIFIED) |
| BlueEdge convergence observations | clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/convergence/ | 9 cross-specimen convergence observations (DESCRIPTIVE) |
| BlueEdge semantic propositions | clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/semantic/spe/ | 85 propositions, review state, enrichment log |
| BlueEdge SQO governance | clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/sqo/ | promotion_state, revalidation_result, constitutional_replay_anchor |

## Governance

| Document | Path | Role |
|---|---|---|
| CLAUDE.md | / (root) | Execution constitution |
| SKILLS.md | / (root) | Callable execution patterns |
| git_structure_contract.md | docs/governance/runtime/ | Branch-domain authority |
| reference_boundary_contract.md | docs/governance/runtime/ | Cross-layer boundary rules |
| Q02_GOVERNANCE_AMENDMENT.md | docs/governance/ | Q-class governance |
| MARKETPLACE_IMPLEMENTATION_LANE_DISCIPLINE.md | docs/governance/ | Three-lane execution discipline for marketplace development |
| GITHUB_FIRST_OPERATIONALIZATION_CORRECTION.md | docs/governance/ | GitHub-first implementation sequencing correction (Phase 0A/0B) |
| PROGRAM_INTELLIGENCE_EVOLUTION_MODEL.md | docs/governance/ | Permanent operational meta-model — spine object contracts, accumulation model, governance boundaries |
| CANONICAL_OPERATIONAL_ROADMAP.md | docs/governance/ | Spine-native operational roadmap — activation state, accumulation, continuity architecture, remaining phases |
| SIGNAL_SYNTHESIS_RULEBOOK.md | docs/pios/PI.SOFTWARE-INTELLIGENCE.DOMAIN-REASONING-MVP-DEFINITION.01/ | Deterministic condition synthesis rules — rule specifications, condition vocabulary, severity escalation, topology overlay contracts |
| SW_INTEL_MODULE_DEFINITION.md | docs/pios/PI.SOFTWARE-INTELLIGENCE.DOMAIN-REASONING-MVP-DEFINITION.01/ | SW-Intel module definition — 9 capabilities, 3 tiers, 10 CFs covered, three-layer architecture vocabulary |

## Governance Streams (Active)

| Stream | Path | Classification | Status |
|---|---|---|---|
| PI.STRATEGIC-DIRECTION.MARKETPLACE-COMMERCIALIZATION-STRATEGY.01 | docs/pios/PI.STRATEGIC-DIRECTION.MARKETPLACE-COMMERCIALIZATION-STRATEGY.01/ | G1 | COMPLETE |
| PI.IMPLEMENTATION-LANE.MARKETPLACE-EXECUTION-DISCIPLINE.01 | docs/pios/PI.IMPLEMENTATION-LANE.MARKETPLACE-EXECUTION-DISCIPLINE.01/ | G1 | COMPLETE |
| PI.IMPLEMENTATION-SEQUENCING.GITHUB-FIRST-OPERATIONALIZATION.CORRECTION.01 | docs/pios/PI.IMPLEMENTATION-SEQUENCING.GITHUB-FIRST-OPERATIONALIZATION.CORRECTION.01/ | G1 | COMPLETE |
| PI.SQO.OPERATOR-WORKFLOW-OPERATIONALIZATION.01 | docs/pios/PI.SQO.OPERATOR-WORKFLOW-OPERATIONALIZATION.01/ | G1 | COMPLETE |
| PI.SQO.RUNTIME-QUALIFICATION-PROJECTION-CORRECTION.01 | docs/pios/PI.SQO.RUNTIME-QUALIFICATION-PROJECTION-CORRECTION.01/ | G1 | COMPLETE |
| PI.SQO.COCKPIT-WORKFLOW-REFOUNDATION.01 | docs/pios/PI.SQO.COCKPIT-WORKFLOW-REFOUNDATION.01/ | G1 | COMPLETE |
| PI.SQO.LEGACY-QUALIFICATION-BRIDGE.01 | docs/pios/PI.SQO.LEGACY-QUALIFICATION-BRIDGE.01/ | G1 | COMPLETE |
| PI.SQO.BLUEEDGE-S2-WORKFLOW-PROJECTION-CORRECTION.01 | docs/pios/PI.SQO.BLUEEDGE-S2-WORKFLOW-PROJECTION-CORRECTION.01/ | G1 | COMPLETE |
| PI.IMPLEMENTATION-SEQUENCING.PORTABLE-SUBSTRATE-OPERATIONALIZATION.01 | docs/pios/PI.IMPLEMENTATION-SEQUENCING.PORTABLE-SUBSTRATE-OPERATIONALIZATION.01/ | G1 | COMPLETE |
| PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01 | docs/pios/PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01/ | G1 | COMPLETE |
| PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01 | docs/pios/PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01/ | G1 | COMPLETE |
| PI.PATHA.CODE-GRAPH-PIPELINE-INTEGRATION.01 | docs/pios/PI.PATHA.CODE-GRAPH-PIPELINE-INTEGRATION.01/ | G1 | COMPLETE |
| PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01 | docs/pios/PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01/ | G1 | COMPLETE |
| PI.PATHA.LIVE-S2-CANDIDATE-SELECTION.01 | docs/pios/PI.PATHA.LIVE-S2-CANDIDATE-SELECTION.01/ | G1 | COMPLETE |
| PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01 | docs/pios/PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.DOMAIN-REASONING-MVP-DEFINITION.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.DOMAIN-REASONING-MVP-DEFINITION.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.TOPOLOGY-COGNITION-COMPLETION.01 | (runtime branch — no stream directory) | G2 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-COMPILER-IMPLEMENTATION.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-COMPILER-IMPLEMENTATION.01/ | G2 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.INVESTIGATION-PERSONA-ASSESSMENT.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.INVESTIGATION-PERSONA-ASSESSMENT.01/ | G2 | COMPLETE |
| PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01 | docs/pios/PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01/ | G1 | COMPLETE |
| PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01 | docs/pios/PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.BEHAVIORAL-SLICE-RECONCILIATION.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.BEHAVIORAL-SLICE-RECONCILIATION.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.EXECUTION-FRAGILITY-SLICE.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTION-FRAGILITY-SLICE.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-UNIFICATION.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-UNIFICATION.01/ | G2 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.PROJECTION-DISPOSITION-CONTRACT-DECISION.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.PROJECTION-DISPOSITION-CONTRACT-DECISION.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.EXECUTION-CONSTRICTION-SLICE.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTION-CONSTRICTION-SLICE.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.STRUCTURAL-BOUNDARY-DIVERGENCE-SLICE.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.STRUCTURAL-BOUNDARY-DIVERGENCE-SLICE.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.SLICE-CLASSIFICATION-AND-VAULT-PROPAGATION-HYGIENE.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.SLICE-CLASSIFICATION-AND-VAULT-PROPAGATION-HYGIENE.01/ | G1 | COMPLETE |
| PI.SOFTWARE-INTELLIGENCE.COUPLING-INERTIA-SLICE.01 | docs/pios/PI.SOFTWARE-INTELLIGENCE.COUPLING-INERTIA-SLICE.01/ | G1 | COMPLETE |

## Cross-References

- [[CURRENT_CANONICAL_OWNERSHIP]] — who owns what
- [[CURRENT_CANONICAL_BOUNDARIES]] — what each layer may do
