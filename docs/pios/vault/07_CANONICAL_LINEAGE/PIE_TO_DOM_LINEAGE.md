# PIE to DOM Lineage

> **How the 17-domain PIE vault became the DOM-01→DOM-17 crosswalk model.**

---

## Lineage Chain

```
Stream 41.2 — PIE Vault (2026-03-20)
    17 domains (DOM-01 → DOM-17)
    42 capabilities (CAP-01 → CAP-42)
    89 components (COMP-01 → COMP-89)
    93.3% grounded via DIRECT_EVIDENCE or DERIVED
        ↓
ExecLens panel rendering (42.x, 51.x)
    PIE domains rendered as intelligence panels
    Domain → panel mapping
        ↓
DPSIG signal family (2026-05-07)
    Domain-based signal derivation
    Projection weighting per domain
        ↓
LENS v2 15-actor model (2026-05-09)
    SemanticActorHydrator: 15 actors from BlueEdge substrate
    Some PIE domains merged into actors
    Actors = hydrated domain representations
        ↓
SemanticCrosswalkMapper (2026-05-10)
    DOM-XX → business label translation
    semantic_continuity_crosswalk.json
    Continuous with PIE vault domain numbering
```

## What Changed

| PIE Vault | LENS v2 / Crosswalk | Transformation |
|---|---|---|
| 17 domains (static catalog) | 15 actors (runtime semantic model) | Some domains merged; actors carry richer semantic payload |
| 42 capabilities (inventory) | DPSIG signals + severity | Capabilities became signal-backed assessments |
| 89 components (detail list) | Crosswalk entity entries | Components mapped to crosswalk detail |
| 93.3% grounded (evidence-traced) | Q-class qualified (governance-disclosed) | Binary grounding → graduated Q-class |
| Static document | Runtime resolver | Catalog became operational code |

## What Was Preserved

- **Domain numbering (DOM-01→DOM-17):** Continuous from PIE vault to crosswalk mapper
- **Capability concept:** CAP registry referenced in crosswalk reconciliation strategy
- **Evidence tracing:** 93.3% PIE grounding → grounding ratio computation in QClassResolver
- **Domain clustering:** Semantic groupings preserved in crosswalk entity structure

## What Was Lost

- **89-component granularity:** Not all components individually surfaced in current rendering
- **Static inventory format:** PIE vault documents are historical reference, not loaded at runtime
- **DIRECT_EVIDENCE/DERIVED classification:** Replaced by Q-class + grounding ratio

## Key Commits

| Commit | Date | Event |
|---|---|---|
| e8fe19f | 2026-03-20 | PiOS baseline: 40.3-40.11 + 41.1 chain |
| 0d55352 | 2026-05-09 | 15-actor semantic representation system |
| 134f224 | 2026-05-09 | LENS v2 flagship bound to BlueEdge |
| 2184188 | 2026-05-10 | Generic semantic payload resolver |
| 30e982e | 2026-05-10 | Q-02 governance resolution |

## Cross-References

- [[../02_EXECLENS_LINEAGE/SEMANTIC_TOPOLOGY_ORIGINS]] — topology evolution
- [[STREAM_EVOLUTION_CHRONOLOGY]] — timeline context
- [[L0_L8_TO_GIT_STRUCTURE_LINEAGE]] — parallel lineage
