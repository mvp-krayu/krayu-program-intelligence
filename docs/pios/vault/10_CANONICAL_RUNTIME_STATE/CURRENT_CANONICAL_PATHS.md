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
| 51 cockpit components | app/execlens-demo/components/sqo-cockpit/ | UI rendering |
| 12 cockpit routes | app/execlens-demo/pages/sqo/client/[client]/run/[run]/ | Section pages |

## Evidence / Data

| Artifact | Path | Role |
|---|---|---|
| evidence_sources.yaml | app/execlens-demo/lib/sqo-cockpit/server/ | Source configuration |
| semantic_continuity_crosswalk.json | app/execlens-demo/lib/ | Crosswalk entity mappings |
| BlueEdge SQO artifacts | artifacts/sqo/blueedge/ | Client qualification data |
| FastAPI SQO artifacts | artifacts/sqo/fastapi/ | Client qualification data |
| BlueEdge evidence files | artifacts/sqo/blueedge/evidence_rebase_01/ | HTML evidence sources |

## Governance

| Document | Path | Role |
|---|---|---|
| CLAUDE.md | / (root) | Execution constitution |
| SKILLS.md | / (root) | Callable execution patterns |
| git_structure_contract.md | docs/governance/runtime/ | Branch-domain authority |
| reference_boundary_contract.md | docs/governance/runtime/ | Cross-layer boundary rules |
| Q02_GOVERNANCE_AMENDMENT.md | docs/governance/ | Q-class governance |

## Cross-References

- [[CURRENT_CANONICAL_OWNERSHIP]] — who owns what
- [[CURRENT_CANONICAL_BOUNDARIES]] — what each layer may do
