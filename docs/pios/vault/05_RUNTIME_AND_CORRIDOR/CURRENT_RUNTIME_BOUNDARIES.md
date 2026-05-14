# Current Runtime Boundaries

> **What runs where and what each surface is allowed to do.**

---

## Runtime Surfaces

| Surface | Route | Layer | Responsibility |
|---|---|---|---|
| LENS v2 Flagship | `/sqo/client/[client]/run/[run]` | L6 | Executive semantic intelligence rendering |
| SQO Cockpit Overview | `/sqo/client/[client]/run/[run]` (embedded) | L6 | S-state, blockers, workflow |
| SQO Debt | `.../debt` | L6 | Semantic debt inventory |
| SQO Continuity | `.../continuity` | L6 | Continuity chain assessment |
| SQO Maturity | `.../maturity` | L6 | 8-dimension maturity scoring |
| SQO Progression | `.../progression` | L6 | S-state transition readiness |
| SQO Evidence | `.../evidence` | L6 | Evidence registry display |
| SQO Evidence Ingestion | `.../evidence-ingestion` | L6 | Ingestion status display |
| SQO Semantic Candidates | `.../semantic-candidates` | L6 | Extraction output display |
| SQO CEU Admissibility | `.../ceu-admissibility` | L6 | Admissibility evaluation display |
| SQO Evidence Rebase | `.../evidence-rebase` | L6 | Rebase status display |
| SQO Corridor | `.../corridor` | L6 | Runtime corridor display |
| SQO Handoff | `.../handoff` | L6 | Qualification handoff |

## Boundary Rules

### What Runtime Surfaces May Do

- Render prepared semantic payloads
- Display qualification state
- Show evidence status
- Present debt and maturity assessments
- Navigate between sections

### What Runtime Surfaces May NOT Do

- Compute signals (L3 responsibility)
- Derive semantic claims (L3-L4 responsibility)
- Modify evidence (L1 responsibility)
- Promote authority (L8 responsibility)
- Fabricate grounding (forbidden at all layers)

## Data Flow

```
Evidence Files (L0-L1)
    ↓
ExplicitEvidenceRebaseExtractor (L1-L2)
    ↓
SemanticActorHydrator (L3-L4)
    ↓
SemanticCrosswalkMapper + QClassResolver + DPSIGSignalMapper (L4)
    ↓
GenericSemanticPayloadResolver (L5)
    ↓
LENS v2 / SQO Cockpit (L6)
```

## Cross-References

- [[EVIDENCE_CORRIDOR_EVOLUTION]] — evidence entry pathway
- [[RUNTIME_CORRIDOR_EVOLUTION]] — runtime governance
- [[REPLAY_AND_ROLLBACK_EVOLUTION]] — state safety
- [[../01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL]] — layer authority
