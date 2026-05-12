# Semantic Topology Origins

> **How semantic domain intelligence evolved from PIE vault through ExecLens to LENS v2.**

---

## The PIE Vault (Stream 41.2)

The PIE (Program Intelligence Engine) vault was the system's first formal semantic domain inventory:

| Component | Count | Description |
|---|---|---|
| Domains | 17 (DOM-01 → DOM-17) | Semantic domain classifications |
| Capabilities | 42 (CAP-01 → CAP-42) | Domain capability inventory |
| Components | 89 (COMP-01 → COMP-89) | Component-level detail |
| Grounding | 93.3% | Via DIRECT_EVIDENCE or DERIVED |

### PIE Vault Documents

Located in snapshot at `~/Projects/k-pi-governance/docs/pios/41.2/pie_vault/`:
- pie_index.md — vault entry point
- pie_node_inventory.md — full node inventory
- pie_navigation_map.md — navigation structure
- pie_render_validation_report.md — rendering validation
- pie_demo_walkthrough.md — demo walkthrough

### What PIE Vault Represented

The PIE vault was a **static semantic inventory** — a catalog of what the system knew about, classified by domain, capability, and component. It was evidence-traced (93.3% grounded) but not operationalized as a runtime model.

## Evolution: PIE → ExecLens → LENS v2

```
PIE Vault (41.2)
    17 domains, 42 capabilities, 89 components
    Static inventory. Evidence-traced. Not runtime.
        ↓
ExecLens (42.x-51.x)
    Panel-per-domain rendering
    Persona-gated visibility
    Signal-backed severity
        ↓
DPSIG Signal Family (2026-05-07)
    Deterministic signal derivation
    Executive readiness gates
    Projection weighting
        ↓
LENS v2 Flagship (2026-05-09)
    15-actor semantic model
    SemanticActorHydrator
    Atmospheric semantic fields
    Q-class disclosure rendering
        ↓
SemanticCrosswalkMapper (2026-05-10)
    DOM-XX → business label translation
    semantic_continuity_crosswalk.json
```

## PIE → DOM Lineage

The 17 PIE vault domains became the DOM-01 through DOM-17 model used by SemanticCrosswalkMapper. The transformation:

| PIE Era | LENS v2 Era | Transformation |
|---|---|---|
| 17 domains (static inventory) | 15 actors (runtime semantic model) | Some domains merged; actors = hydrated representations |
| 42 capabilities (catalog) | DPSIG signals (runtime severity) | Capabilities became signal-backed severity assessments |
| 89 components (detail) | Domain detail (crosswalk entries) | Components mapped to crosswalk entity detail |
| 93.3% grounded (evidence-traced) | Q-class qualified (governance-disclosed) | Binary grounding → graduated Q-class with disclosure |

See [[../07_CANONICAL_LINEAGE/PIE_TO_DOM_LINEAGE]] for formal lineage mapping.

## What "Semantic Topology" Means Now

In the current system, "semantic topology" refers to:
1. The **structural shape** of semantic domain relationships (DOM clusters, capability groupings)
2. **Topology reports** that provide observational structural evidence
3. The **signal-backed severity landscape** across domains

It does NOT refer to the PIE vault's static inventory. The PIE vault is the ancestor; the current topology is the operationalized descendant.

## Cross-References

- [[../07_CANONICAL_LINEAGE/PIE_TO_DOM_LINEAGE]] — formal lineage mapping
- [[../03_PATH_SPLIT_EVOLUTION/TOPOLOGY_AND_HYDRATION_SPLIT]] — topology vs hydration split
- [[EXECLENS_RUNTIME_EVOLUTION]] — overall runtime evolution
