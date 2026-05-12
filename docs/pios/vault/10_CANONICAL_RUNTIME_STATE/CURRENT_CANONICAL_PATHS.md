# Current Canonical Paths

> **What exists in the runtime right now — file paths, modules, resolvers.**

---

## LENS v2 Runtime

| Module | Path | Role |
|---|---|---|
| SemanticActorHydrator | app/execlens-demo/lib/ | 15-actor semantic model hydration |
| SemanticCrosswalkMapper | app/execlens-demo/lib/ | DOM-XX → business label translation |
| QClassResolver | app/execlens-demo/lib/ | Q-01→Q-04 governance classification |
| DPSIGSignalMapper | app/execlens-demo/lib/ | Signal stack projection |
| GenericSemanticPayloadResolver | app/execlens-demo/lib/ | Manifest-driven payload assembly |
| BlueEdgePayloadResolver | app/execlens-demo/lib/ | Compatibility wrapper |
| LENS v2 flagship page | app/execlens-demo/flagship-experience/ | Executive surface |

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
