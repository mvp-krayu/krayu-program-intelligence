# Topology and Hydration Split

> **How structural observation (topology) and semantic enrichment (hydration) separated into distinct concerns.**

---

## The Confusion

Before the PATH A/B split, "topology" and "semantic hydration" were partially conflated:
- Topology reports showed structural observations
- Semantic models enriched those observations with business labels
- It was unclear which one was the "truth"

## The Split

| Concern | PATH | What It Does | What It Proves |
|---|---|---|---|
| Topology | PATH A | Observes structural relationships | Structure exists |
| Hydration | PATH B | Enriches with semantic meaning | Meaning is coherent |

**Key insight:** Topology proves that a structural relationship exists. Hydration proves that the semantic label is internally consistent. Neither proves the other — a domain can be structurally present but semantically misinterpreted, or semantically coherent but structurally absent.

## How They Work Together

```
Topology (PATH A)           Hydration (PATH B)
    │                           │
    │   structural              │   semantic
    │   observations            │   reconstruction
    │                           │
    └───────────┐   ┌───────────┘
                │   │
                ▼   ▼
        Crosswalk Reconciliation
                │
                ▼
        Correspondence Evidence
        (RECONCILED state)
```

The crosswalk reconciliation compiler (Phase 3 of the strategic roadmap) will be the bridge that connects structural topology to semantic hydration.

## Current Implementation

| Component | Concern | Layer |
|---|---|---|
| Topology reports | Structural observation | L2-L3 |
| SemanticActorHydrator | Semantic enrichment | L3-L4 |
| SemanticCrosswalkMapper | Translation bridge (display) | L4 |
| QClassResolver | Grounding assessment | L4 |
| Grounding ratio | Topology-hydration intersection | L4 |

## Cross-References

- [[PATH_A_EMERGENCE]] — structural grounding path
- [[PATH_B_EMERGENCE]] — semantic reconstruction path
- [[CROSSWALK_AND_RECONCILIATION]] — the bridge between them
- [[../02_EXECLENS_LINEAGE/SEMANTIC_TOPOLOGY_ORIGINS]] — topology origins
