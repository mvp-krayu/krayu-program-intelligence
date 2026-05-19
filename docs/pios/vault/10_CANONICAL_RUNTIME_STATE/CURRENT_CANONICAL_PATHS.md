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

## Cross-References

- [[CURRENT_CANONICAL_OWNERSHIP]] — who owns what
- [[CURRENT_CANONICAL_BOUNDARIES]] — what each layer may do
