# Workflow Dominance Model

## Stage Prominence

| Prominence | Weight | Visual | Expanded |
|-----------|--------|--------|----------|
| ACTIVE | dominant | active | true |
| NEXT | standard | pending | false |
| FUTURE | muted | future | false |
| COMPLETE | muted | complete | false |

## Spine Nodes

The workflow spine renders as a vertical navigation rail:

```
S1 (current)
 ↓
R2 SEMANTIC QUALIFICATION BLOCKERS (active, dominant)
 ↓
R1 CONTINUITY RESTORATION
 ↓
R1 BUSINESS SEMANTIC ENRICHMENT
 ↓
R2/R3 GOVERNANCE INTEGRITY
 ↓
R4 GROUNDING EXPANSION
 ↓
S2 (target)
```

Active stage is visually dominant. Future stages are muted.
Spine provides persistent spatial orientation.

## Resolution

`resolveWorkflowDominance(remediationStages, currentStage)` returns:
- stages: each with prominence, visual_state, expanded
- activeStageId: current workflow stage
- spineNodes: compact node list for spine rendering
