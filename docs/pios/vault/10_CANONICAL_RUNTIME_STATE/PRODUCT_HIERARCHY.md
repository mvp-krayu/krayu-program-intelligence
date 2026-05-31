# Canonical Product Hierarchy

> **Where each component sits in the governed architecture.**

---

## Hierarchy

```
Program Intelligence (category/discipline)
  └── GEIOS (operating architecture — governed substrate, never exposed)
        ├── PiOS (computational substrate)
        │     ├── Ingestion (L1: 40.x)
        │     ├── Core Derivation (L2-L3: 40.x, 41.x)
        │     ├── Cognition Assembly (L4: PICR → PICP — 9 cognition objects, ZERO interpretive authority)
        │     ├── Projection Rendering (L5: PRE → surfaces — 8 projection families, 75.x bounded authority)
        │     └── Activation (43.x, 44.x)
        ├── LENS (projection surface — visible executive shell)
        │     ├── Cognitive Projection (5-persona — BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION)
        │     ├── Guided Investigation (5A/5B)
        │     ├── Evidence Record Export
        │     └── Conversational Intelligence (future)
        ├── SQO (qualification overlay)
        │     ├── State Machine (S0-S3)
        │     ├── Cockpit V1 (15 sections, including Authority)
        │     ├── Cockpit V2 (workflow-driven, resolveOperatorWorkflow center of gravity)
        │     ├── Qualification Posture Model (8 states)
        │     ├── Client-Scoped Section Resolution (runtime isolation)
        │     ├── Operator Authority Workflow (12 actions, 5 RBAC roles)
        │     ├── CEU Reconciliation Workflow (10 actions, review_mode governance)
        │     └── Reconciliation Loop
        ├── Marketplace (domain cognition module ecosystem)
        │     ├── Software Intelligence (first module — OPERATIONAL)
        │     └── Module Registration (constitutionally specified, not yet implemented)
        └── Domain Cognition Modules (interpretation layers attached to PI Spine)
```

## Cognition Anatomy

**Source:** PI.COGNITION-ANATOMY.RECONCILIATION.01

The center of gravity of Program Intelligence is **Governed Cognition** (22 cognitive functions × 5 cognition strata). Everything else serves it.

Four satellite systems orbit the center:
- **Temporal Continuity** — Spine (8 object classes), Chronicle, Certification — gives cognition memory
- **Packaged Cognition** — PICP (9 objects) — gives cognition portability
- **Qualified Cognition** — SQO (S0→S3), Certification, Revalidation — gives cognition authority
- **Projected Cognition** — PRE × 5 Personas × 8 Projection Families — gives cognition audience reach

PICP is a cognition packaging satellite, not the center of architecture. See [[../08_EXECUTION_RUNTIME/COGNITION_ANATOMY]] for the full canonical anatomy.

## Layer Definitions

### Program Intelligence

The overarching discipline. Not a product, not a brand — the practice of applying governed structural intelligence to program execution assessment. All Krayu products and capabilities exist within this category.

### GEIOS — Governed Executive Intelligence Operating System

The governing architecture. Unifies all governed structural intelligence capabilities. Defined by 11 foundation streams + 1 capstone (183 safety rules, 9-layer stack). GEIOS is permanently hidden — it powers the product but is never the product.

**GEIOS emerged through Path B and ecosystem maturation.** PiOS was the original Program Intelligence Operating System. As the system grew to encompass LENS, SQO, and marketplace concepts, GEIOS became the name for the broader governing frame. GEIOS codified an emergent operational reality — the runtime achieved many GEIOS outcomes before the framework was formally specified.

**Implementation reality:** GEIOS L1-L3 (topology, evidence derivation, semantic shaping) are functionally achieved through code paths that predate the GEIOS specification. The implementation delivers the outcomes without following the GEIOS pipeline. GEIOS L4-L9 (narrative generation, prompt governance, RAG, replay-safe memory, executive copilot, governance enforcement) are spec-complete but not yet implemented as runtime code.

**Reference:** `docs/psee/PI.AGENTIC.GOVERNED-EXECUTIVE-INTELLIGENCE.OS.01/GOVERNED_EXECUTIVE_INTELLIGENCE_OPERATING_SYSTEM.md`

### PiOS — Program Intelligence Operating System

The computational substrate. Deterministic derivation engine: evidence input → governed output. Owns ingestion (40.x), core derivation (40.x, 41.x), cognition assembly (L4), projection rendering (L5), and activation (43.x, 44.x). Layer model L0-L8 locked via `git_structure_contract.md`.

**Current state:** L1 ingestion operational (BlueEdge complete, FastAPI S1). L2-L3 derivation operational (DPSIG, QClass, readiness). L4 cognition assembly: 9 cognition objects defined, PICR/PICP canonical (formalization, not construction — 8/9 objects already sourced from LENS). L5 projection rendering: PRE defined (8 projection families), 75.x bounded authority, three-zone model (Zone A deterministic, Zone B governed narrative, Zone C qualification gate).

### LENS — Executive Projection Surface

The visible executive shell. Cognitive operational intelligence surface with persona-based projection, topology exploration, evidence traversal, and governed investigation flows.

**Current state:** Strategic Phase 4 substantially complete. 5-persona projection (BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION — OPERATOR recognized 2026-05-29), interactive SVG topology, 36-query guided lattice, structural depth escalation (PI Runtime Layer), BALANCED narrative synthesis, evidence record export.

**Bridge state:** LENS consumes governed artifacts via GenericSemanticPayloadResolver and zone derive functions. The 6 bridge rendering adapters specified in the original productization bridge have been superseded by the cognitive zone architecture. The bridge *principle* (substrate never exposed to executive surface) is preserved; the adapter *mechanism* is retired.

### SQO — Semantic Qualification Operations

The qualification overlay. Assesses operational maturity of client semantic data via deterministic state machine (S0-S3), 18 qualification engines, reconciliation loop, semantic debt index, and evidence intake loop.

**Current state:** Operational. S0-S2 implemented. S3 AUTHORITY_READY not yet implemented. 12 cockpit sections, 51 UI components, runtime corridor with replay/rollback.

### Marketplace

The governed ecosystem of domain cognition modules. Enables domain-specific operational interpretation through replaceable interpretation layers attached to the PI Spine.

**Current state:** CONSTITUTIONALLY_DEFINED. Software Intelligence is the first operational domain cognition module (SignalSynthesisEngine + 9-slice behavioral cognition + commercial module gating). Module registration architecture constitutionally specified, not yet implemented. Two-axis marketplace model: Domain Modules × Projection Families.

**Constitutional definition:** PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01 — domain cognition module pattern PROVEN via PR #16.

## PMO Bundle Functional Modules

The first commercial Program Intelligence package maps to the hierarchy as follows:

| Module | Hierarchy Position | Implementation State |
|---|---|---|
| 1. Topology Intelligence | LENS (StructuralTopologyZone) | SUBSTANTIALLY COMPLETE |
| 2. Execution Qualification | SQO (state machine, cockpit) | SUBSTANTIALLY COMPLETE |
| 3. Propagation Intelligence | LENS (IntelligenceField, DPSIG) | SUBSTANTIALLY COMPLETE |
| 4. Executive Cognitive Projection | LENS (persona projection, evidence record) | SUBSTANTIALLY COMPLETE |
| 5. Governance Integrity | Cross-cutting (LensDisclosureShell, prohibitions) | COMPLETE |
| 6. Operational Investigation Workspace | LENS (guided queries, PI runtime) | PARTIALLY COMPLETE |

## Strategic Phase → Implementation Mapping

| Strategic Phase | LENS Implementation | Status |
|---|---|---|
| Phase 1: Generated Reports | Pre-LENS v2 HTML artifacts | SURPASSED |
| Phase 2: Interactive Reports | LENS v2 interactive surface, topology | COMPLETE |
| Phase 3: Workspace Shell | LensDisclosureShell, persona, isolated route | COMPLETE |
| Phase 4: Guided Investigations | 5A.1-5A.8, 5B.0-5B.3, evidence record export | SUBSTANTIALLY COMPLETE |
| Phase 5: Conversational Intelligence | Not started | NOT STARTED |
| Phase 6: Operational Ecosystem | Not started | NOT STARTED |

LENS Phases 5A/5B are the implementation decomposition of Strategic Phase 4.

## Cross-References

- [[CURRENT_CANONICAL_PATHS]] — runtime file inventory
- [[CURRENT_CANONICAL_OWNERSHIP]] — layer ownership
- [[CURRENT_CANONICAL_BOUNDARIES]] — layer boundaries
