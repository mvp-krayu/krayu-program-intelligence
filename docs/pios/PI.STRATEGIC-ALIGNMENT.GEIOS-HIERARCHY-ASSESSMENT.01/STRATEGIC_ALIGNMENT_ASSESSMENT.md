# Strategic Alignment Assessment — GEIOS Canonical Hierarchy

**Stream:** PI.STRATEGIC-ALIGNMENT.GEIOS-HIERARCHY-ASSESSMENT.01
**Classification:** G1 — Architecture-Mutating (vault canonical state alignment)
**Date:** 2026-05-16
**Branch:** work/lens-v2-productization
**Purpose:** Align AMOps vault with canonical KRAYU strategic hierarchy, map to as-is implementation state, plan strategic closure

---

## 1. Canonical Strategic Hierarchy

The authoritative product architecture hierarchy, per the KRAYU PMO Bundle → Marketplace Evolution Strategy Package and GEIOS Positioning Addendum:

```
Program Intelligence (category/discipline)
  └── GEIOS (operating architecture — governed substrate, never exposed)
        ├── PiOS (computational substrate)
        │     ├── Ingestion (L1: 40.x)
        │     ├── Core Derivation (L2-L4: 40.x, 41.x)
        │     └── Activation (L5: 43.x, 44.x)
        ├── LENS (projection surface — visible executive shell)
        │     ├── Cognitive Projection (4-persona)
        │     ├── Guided Investigation (5A/5B)
        │     ├── Evidence Record Export
        │     └── Conversational Intelligence (future)
        ├── SQO (qualification overlay)
        │     ├── State Machine (S0-S3)
        │     ├── Cockpit (12 sections)
        │     └── Reconciliation Loop
        └── Marketplace (extension ecosystem — future)
              ├── Semantic Signal Packs
              ├── Industry Overlays
              ├── Governance Templates
              └── Integration Adapters
```

### Hierarchy Invariants

| Principle | Rule |
|-----------|------|
| GEIOS is hidden | Never exposed as product surface. Reason the product works, never the product itself |
| LENS is the shell | Executive interaction surface. Renders governed outputs, does not compute |
| SQO is overlay | Qualification assessment on top of LENS-visible data |
| PiOS is substrate | Deterministic derivation engine. Input → governed output |
| Marketplace is extension | Third-party and first-party extension ecosystem on governed rails |

---

## 2. Vault State Assessment

### 2.1 What the Vault Currently Knows

The AMOps vault (`docs/pios/vault/`) describes the system through **evolutionary strata** (S1-S6), not through the **product hierarchy**. The vault's world model:

| Stratum | Vault Understanding | Hierarchy Position |
|---------|--------------------|--------------------|
| S1 Foundational Governance | L0-L8 model, execution constitution | Cross-cutting (governance) |
| S2 ExecLens Lineage | SUPERSEDED — replaced by LENS v2 + SQO | Historical |
| S3 Path Split | PATH A/B structural/semantic grounding | PiOS layer concern |
| S4 SQO Qualification | Unified semantic operations substrate | SQO |
| S5 Runtime Corridor | Evidence/runtime corridors | PiOS → LENS boundary |
| S6 Operational Cognition | LENS v2 cognitive operational intelligence | LENS |

**Critical gap:** The vault describes WHAT evolved but not WHERE it sits in the product hierarchy. There is no overarching structural frame connecting these strata to the canonical hierarchy.

### 2.2 What the Vault Does NOT Know

| Concept | Vault State | Required State |
|---------|-------------|----------------|
| **GEIOS** | ABSENT — zero mentions, zero definitions | Must be defined as overarching operating architecture |
| **Program Intelligence (as category)** | Implied by repo name, never formally declared | Must be locked term — the discipline/category name |
| **Canonical Product Hierarchy** | Not represented | Must be documented — PI → GEIOS → PiOS → LENS → SQO → Marketplace |
| **Marketplace** | ABSENT | Must be defined as future extension ecosystem |
| **PMO Bundle** | ABSENT | Must be mapped as first commercial package |
| **6-Phase Maturity Model** | Not in vault (exists in docs/psee/) | Must be reconciled with LENS 5A/5B phase tracking |
| **Bridge Adapters** | Not in vault (exist in docs/psee/) | Must acknowledge existence and bypass state |
| **GEIOS 9-Layer Stack** | Not in vault (exists in docs/psee/) | Must be referenced as substrate architecture |

### 2.3 Vault Drift Conditions Detected

| Drift | Severity | Detail |
|-------|----------|--------|
| S6 stale link | MEDIUM | Canonical state references `07_LENS_V2_OPERATIONAL_IDENTITY/OPERATIONAL_COGNITION_TRANSITION` — directory does not exist. Actual directory is `07_CANONICAL_LINEAGE` |
| Phase model disconnection | HIGH | Vault tracks "Phase 5A/5B" (LENS internal roadmap). Strategy defines "Phases 1-6" (GEIOS productization). No reconciliation document |
| GEIOS absent from terminology | HIGH | TERMINOLOGY_LOCK.md has no GEIOS entry. GEIOS is the overarching operating architecture — its absence means the hierarchy has no canonical anchor |
| Bridge adapters superseded | MEDIUM | LENS v2 evolved into cognitive zone architecture that superseded the 6 bridge rendering adapters. GenericSemanticPayloadResolver + zone derive functions are the canonical bridge implementation. This supersession is not documented in any canonical document |
| Normalization layer inversion | LOW | GEIOS spec says normalization happens at generation time (substrate-side). LENS v2 does normalization at rendering time (STRUCTURAL_LANGUAGE map, humanize()). Works correctly but inverts the authority model |

---

## 3. As-Is Implementation State

### 3.1 By Canonical Hierarchy Layer

#### Program Intelligence (Category)
**Status:** OPERATIONAL as practice, not formalized as canonical term.
The repository is `krayu-program-intelligence`. The handbook exists at `docs/handbook/`. Commercialization docs exist at `docs/program-intelligence-commercialization/`. But "Program Intelligence" as the canonical category name is not locked in TERMINOLOGY_LOCK.md.

#### GEIOS (Operating Architecture)
**Status:** ARCHITECTURALLY COMPLETE as specification. 11 foundation streams + 1 capstone. 183 safety rules. 9-layer stack. All streams VIABLE.
**Implementation:** ZERO. GEIOS exists entirely as governed specification in `docs/psee/PI.AGENTIC.*`. No runtime code implements the GEIOS stack directly. LENS v2 achieves similar outcomes through different code paths (deterministic derive functions, not GEIOS pipeline stages).
**Bridge:** 6 rendering adapters specified (ReadinessBadge, SignalCard, DomainEvidence, Narrative, Propagation, Explainability). ZERO consumed by live surfaces. LENS v2 flagship bypasses bridge entirely.

#### PiOS (Computational Substrate)
**Status:** PARTIALLY OPERATIONAL.

| Layer | State | Evidence |
|-------|-------|----------|
| L1 Ingestion | OPERATIONAL | 40.2→40.4 pipeline. BlueEdge complete. FastAPI S1 |
| L2 Evidence Navigation | OPERATIONAL | SemanticActorHydrator, SemanticCrosswalkMapper |
| L3 Derivation | OPERATIONAL | DPSIGSignalMapper, QClassResolver, readiness classification |
| L4 Semantic Shaping | PARTIAL | BlueEdge 5/17 domains grounded. Q-02 classification |
| L5 Activation | PARTIAL | Signal-to-structure binding. No 43.x/44.x runtime on current branch |

#### LENS (Projection Surface)
**Status:** SUBSTANTIALLY OPERATIONAL — Phase 4 substantially complete.

| Capability | State | Phase |
|-----------|-------|-------|
| Static report rendering | SURPASSED | Phase 1 ✓ |
| Interactive intelligence surface | OPERATIONAL | Phase 2 ✓ |
| 4-persona cognitive projection | OPERATIONAL | Phase 3 ✓ |
| Interactive SVG topology | OPERATIONAL | Phase 3 ✓ |
| LensDisclosureShell | OPERATIONAL | Phase 3 ✓ |
| Isolated LENS v2 route | OPERATIONAL | Phase 3 ✓ |
| Condition-driven layout | OPERATIONAL | Phase 3 ✓ |
| 36-query guided lattice | OPERATIONAL | Phase 4 ✓ |
| Structural depth escalation (PI Runtime) | OPERATIONAL | Phase 4 ✓ |
| BALANCED narrative synthesis | OPERATIONAL | Phase 4 (interpretive) ✓ |
| Evidence Record Export | OPERATIONAL | Phase 4 ✓ |
| Cross-surface navigation | NOT IMPLEMENTED | Phase 3 gap |
| RAG-backed investigation | NOT STARTED | Phase 4 (bridge-dependent) |
| Conversational intelligence | NOT STARTED | Phase 5 |
| Operational ecosystem | NOT STARTED | Phase 6 |

#### SQO (Qualification Overlay)
**Status:** OPERATIONAL.

| Component | State |
|-----------|-------|
| S-state machine (S0-S3) | OPERATIONAL (S3 not yet implemented) |
| Cockpit (12 sections) | OPERATIONAL |
| 18 qualification engines | OPERATIONAL |
| Runtime corridor | OPERATIONAL |
| Reconciliation loop | OPERATIONAL |
| Semantic debt index | OPERATIONAL |
| Evidence intake loop | OPERATIONAL |

#### Marketplace (Extension Ecosystem)
**Status:** NOT STARTED. Zero infrastructure. No marketplace concept in any runtime code.

### 3.2 By PMO Bundle Functional Module

| Module | Implementation State | Key Components | Gap |
|--------|---------------------|----------------|-----|
| **1. Topology Intelligence** | SUBSTANTIALLY COMPLETE | Interactive SVG topology, cluster layout, zone anchors, cross-highlighting, domain registry, edge visualization, grounding status, confidence values | SVG capture for export operational. No RAG-backed topology query |
| **2. Execution Qualification** | SUBSTANTIALLY COMPLETE | SQO state machine, Q-class resolver, readiness gate, debt classification, 18 engines, reconciliation loop | S3 AUTHORITY_READY not implemented. No governed trail ID |
| **3. Propagation Intelligence** | SUBSTANTIALLY COMPLETE | Propagation chains, DPSIG signals, pressure zone focus, primary zone identification, signal convergence | No temporal drift comparison. No cross-run propagation delta |
| **4. Executive Cognitive Projection** | SUBSTANTIALLY COMPLETE | 4-persona projection, BALANCED narrative, evidence record export, stability assessment, confidence envelope | No PDF/signed package export. No comparative trails |
| **5. Governance Integrity** | COMPLETE | Evidence boundaries, disclosure shell, 13 prohibitions, authority tiers, Q-class governance, structural language normalization | None identified |
| **6. Operational Investigation Workspace** | PARTIALLY COMPLETE | 36-query lattice, structural depth escalation, PI runtime layer, zone-aware cognition, click-to-understand | No RAG. No copilot. No multi-agent. No resumable sessions |

### 3.3 By GEIOS 9-Layer Stack

| GEIOS Layer | Spec Status | Implementation Status | Notes |
|-------------|-------------|----------------------|-------|
| L1 Deterministic Topology | SPEC COMPLETE | IMPLEMENTED (different path) | Topology via GenericSemanticPayloadResolver, not GEIOS L1 pipeline |
| L2 Evidence Derivation | SPEC COMPLETE | IMPLEMENTED (different path) | DPSIG derivation via existing scripts, not GEIOS L2 pipeline |
| L3 Semantic Shaping | SPEC COMPLETE | PARTIALLY IMPLEMENTED | Q-class, crosswalk operational. Cognitive normalization spec'd but not applied via GEIOS pipeline |
| L4 Narrative Generation | SPEC COMPLETE | PARTIALLY IMPLEMENTED | BALANCED narrative exists but uses ad-hoc derive functions, not GEIOS 9-stage pipeline |
| L5 Prompt Governance | SPEC COMPLETE | NOT IMPLEMENTED | No governed prompt orchestration in runtime |
| L6 Topology-Aware RAG | SPEC COMPLETE | NOT IMPLEMENTED | No retrieval infrastructure |
| L7 Replay-Safe Memory | SPEC COMPLETE | NOT IMPLEMENTED | No session persistence or replay |
| L8 Executive Copilot | SPEC COMPLETE | NOT IMPLEMENTED | No copilot interaction surface |
| L9 Governance Enforcement | SPEC COMPLETE | PARTIALLY IMPLEMENTED | Evidence boundaries, disclosure, prohibitions operational. No GEIOS-native enforcement layer |

**Key insight:** Layers 1-3 are functionally achieved through alternative code paths that predate the GEIOS specification. The implementation delivers the *outcomes* without following the GEIOS *pipeline*. This is not a bug — the GEIOS spec was written after the runtime was already partially built. But it means GEIOS convergence requires either (a) refactoring runtime to use GEIOS pipeline, or (b) formalizing the current path as the canonical implementation of those GEIOS layers.

---

## 4. Strategic Gap Analysis

### 4.1 Category 1 — Vault Alignment Gaps (Documentation)

These require vault document updates. No code changes.

| ID | Gap | Vault Impact | Priority |
|----|-----|-------------|----------|
| VA-1 | GEIOS absent from canonical state | PIOS_CURRENT_CANONICAL_STATE.md needs GEIOS hierarchy section | CRITICAL |
| VA-2 | GEIOS absent from terminology lock | TERMINOLOGY_LOCK.md needs GEIOS, Program Intelligence, Marketplace definitions | CRITICAL |
| VA-3 | Product hierarchy undocumented | New vault page needed: product hierarchy mapping | HIGH |
| VA-4 | Phase model disconnection | Reconciliation between LENS 5A/5B and strategic Phases 1-6 | HIGH |
| VA-5 | S6 stale vault link | Canonical state references non-existent vault page | MEDIUM |
| VA-6 | Bridge adapter supersession undocumented | 6 rendering adapters retired; zone architecture as canonical bridge not reflected in canonical state | MEDIUM |
| VA-7 | Evidence Record Export not in canonical paths | CURRENT_CANONICAL_PATHS.md missing InterrogationTrailBuilder | LOW |

### 4.2 Category 2 — Architectural Convergence Gaps

These require decisions about whether to converge runtime with GEIOS spec.

| ID | Gap | Decision Required | Impact |
|----|-----|-------------------|--------|
| AC-1 | 6 bridge rendering adapters | RESOLVED — retired as superseded pre-implementation design. Zone architecture is the canonical bridge implementation | Bridge principle preserved; adapter mechanism retired |
| AC-2 | Normalization layer position | Accept rendering-layer normalization OR move to substrate | Affects narrative generation architecture |
| AC-3 | GEIOS L1-L3 parallel paths | Declare current code as canonical GEIOS implementation OR plan refactor | Determines GEIOS convergence scope |
| AC-4 | RAG infrastructure absence | Plan RAG implementation OR defer to Phase 5 | Blocks full Phase 4 completion |

### 4.3 Category 3 — Commercial Readiness Gaps

These block PMO Bundle commercial deployment.

| ID | Gap | Blocks | Effort Estimate |
|----|-----|--------|-----------------|
| CR-1 | No PDF/signed export | PMO Bundle Module 4 (evidence capsule) | MEDIUM — extend InterrogationTrailBuilder |
| CR-2 | No comparative trails | PMO Bundle Module 3 (temporal delta) | HIGH — requires run-over-run infrastructure |
| CR-3 | S3 AUTHORITY_READY not implemented | PMO Bundle Module 2 (full qualification arc) | MEDIUM — extends SQO state machine |
| CR-4 | No cross-surface navigation | SQO Cockpit ↔ LENS integration | LOW — WS-4 from Phase 3 baseline |
| CR-5 | No resumable sessions | Investigation continuity | HIGH — requires persistence infrastructure |
| CR-6 | No marketplace infrastructure | PMO Bundle extension model | HIGH — greenfield |

---

## 5. Vault Alignment Plan

### Stream 1: Vault Canonical Hierarchy Alignment (G1)

**Scope:** Update vault documents to formally recognize the canonical GEIOS hierarchy.

**Mutations:**

1. **PIOS_CURRENT_CANONICAL_STATE.md** — Add new section "Canonical Product Hierarchy" establishing the PI → GEIOS → PiOS → LENS → SQO → Marketplace hierarchy. Position GEIOS as the overarching operating architecture that the current S1-S6 strata collectively constitute. Fix S6 stale link.

2. **TERMINOLOGY_LOCK.md** — Add locked definitions for:
   - **Program Intelligence** — The discipline/category. Not a product name. The overarching practice of applying governed structural intelligence to program execution assessment.
   - **GEIOS** — Governed Executive Intelligence Operating System. The operating architecture that unifies all governed structural intelligence capabilities. Hidden substrate — never directly exposed as a product capability.
   - **Marketplace** — The extension ecosystem that enables third-party and first-party capability extension on governed rails. Future capability.
   - **PMO Bundle** — The first commercial Program Intelligence package targeting Enterprise PMOs, Transformation Offices, and CTO Organizations.
   - **Productization Bridge** — The formal architectural contract defining what crosses the GEIOS substrate → LENS surface boundary.

3. **New vault page: `07_LENS_V2_OPERATIONAL_IDENTITY/PRODUCT_HIERARCHY_MAPPING.md`** — Create the vault section that S6 references. Map each hierarchy layer to its implementation state, canonical paths, and governance authority.

4. **CURRENT_CANONICAL_PATHS.md** — Add InterrogationTrailBuilder.js and evidence record export components.

### Stream 2: Phase Model Reconciliation (G1)

**Scope:** Reconcile the two phase numbering systems.

**The problem:** Two phase models exist independently:
- **Strategic Phases 1-6** (GEIOS productization evolution): Generated Reports → Interactive Reports → Workspace Shell → Guided Investigations → Conversational Intelligence → Operational Ecosystem
- **LENS Phases 5A/5B** (implementation roadmap): Guided Structural Investigation sub-phases

**Reconciliation:**

| Strategic Phase | LENS Implementation | Status |
|----------------|--------------------|---------| 
| Phase 1: Generated Reports | Pre-LENS v2 HTML artifacts | SURPASSED |
| Phase 2: Interactive Reports | LENS v2 interactive surface, topology, evidence traversal | COMPLETE |
| Phase 3: Workspace Shell | LensDisclosureShell, persona projection, isolated route, condition-driven layout | COMPLETE |
| Phase 4: Guided Investigations | 5A.1-5A.8 (investigative), 5B.0-5B.3 (interpretive), evidence record export | SUBSTANTIALLY COMPLETE |
| Phase 5: Conversational Intelligence | Not started | NOT STARTED |
| Phase 6: Operational Ecosystem | Not started | NOT STARTED |

**LENS 5A/5B is the implementation decomposition of Strategic Phase 4.** This must be stated explicitly in the canonical state.

### Stream 3: Bridge Adapter Retirement (G1)

**Scope:** Formally retire the 6 bridge rendering adapters as superseded pre-implementation design.

**History:** The GEIOS–LENS Productization Bridge (§7.4) defined 6 rendering adapters — ReadinessBadge, SignalCard, DomainEvidence, Narrative, Propagation, Explainability — as the interface between substrate and surface. These were designed for a **report module architecture** where GEIOS produces report objects, adapters transform them, and LENS renders modules.

**What actually happened:** LENS v2 evolved into a **cognitive zone architecture** — 10 zone components, 36 derive functions, interactive topology, structural depth escalation, persona-driven layout resolution. This architecture consumes `fullReport` directly at a much finer granularity than 6 coarse adapters could provide. The zones are the bridge.

**Why adapters are the wrong abstraction now:**
- They assume a "report object model" intermediary that doesn't match zone architecture
- They'd add indirection between zones and the data they need, making derive functions harder to write and debug
- They were designed for Phase 2 scope — the system is at Phase 4 with fundamentally different data consumption patterns
- `IntelligenceField` alone does more transformation work than all 6 adapters combined would

**What preserves the bridge principle instead:**
- `GenericSemanticPayloadResolver` — normalizes payload shape before zones see it (the right architectural seam for multi-client)
- Zone derive functions (`GUIDED_QUERY_ANSWERS`, `INTERROGATION_EXPANSION_REGISTRY`) — transform raw payload into governed rendered output
- `LensDisclosureShell` — enforces governance boundary at the rendering surface
- The bridge *principle* (GEIOS substrate never exposed directly to executive surface) is preserved — enforced by the payload resolver and zone architecture, not by 6 adapter functions

**Disposition:** SUPERSEDED. The 6 bridge rendering adapters are retired as a pre-implementation design that was overtaken by the cognitive zone architecture. The bridge contract's boundary principle remains in force; its adapter mechanism does not. If multi-client payload normalization is needed in the future, it belongs at the `GenericSemanticPayloadResolver` level, not at per-component adapters.

---

## 6. Strategic Execution Sequence

### Phase I — Vault Alignment (Immediate, 1-2 sessions)

| Priority | Action | Classification |
|----------|--------|----------------|
| 1 | Update TERMINOLOGY_LOCK.md with GEIOS, Program Intelligence, Marketplace | G1 |
| 2 | Update PIOS_CURRENT_CANONICAL_STATE.md with hierarchy section | G1 |
| 3 | Create product hierarchy vault page | G1 |
| 4 | Reconcile phase models in canonical state | G1 |
| 5 | Update CURRENT_CANONICAL_PATHS.md | G1 |

### Phase II — Commercial Hardening (Near-term, PMO Bundle readiness)

| Priority | Action | Classification |
|----------|--------|----------------|
| 1 | Evidence capsule: PDF export from InterrogationTrailBuilder | G2 |
| 2 | Cross-surface navigation (LENS ↔ SQO Cockpit links) | G2 |
| 3 | S3 AUTHORITY_READY state machine extension | G1 |
| 4 | Comparative trail infrastructure (run-over-run delta) | G1 |

### Phase III — Platform Evolution (Medium-term, Phase 5 readiness)

| Priority | Action | Classification |
|----------|--------|----------------|
| 1 | Session persistence infrastructure | G1 |
| 2 | RAG foundation (topology-aware retrieval) | G1 |
| ~~3~~ | ~~Bridge adapter convergence assessment~~ | RETIRED — adapters superseded by zone architecture |
| 4 | Conversational intelligence surface | G1 |

### Phase IV — Ecosystem Foundation (Long-term, Marketplace)

| Priority | Action | Classification |
|----------|--------|----------------|
| 1 | Multi-client abstraction (beyond BlueEdge) | G1 |
| 2 | Extension model architecture | G1 |
| 3 | Marketplace governance contract | G1 |
| 4 | Semantic signal pack specification | G1 |

---

## 7. Canonical Position Summary

### What we have built (as-is)

LENS v2 is a **Phase 4 substantially-complete** cognitive operational intelligence surface. It delivers 5 of 6 PMO Bundle functional modules at commercially demonstrable depth. It operates under governed structural intelligence principles with evidence-first determinism, bounded interpretive authority, and 13 absolute prohibitions.

The implementation achieves the *outcomes* defined by the GEIOS specification through code paths that predate the specification. This is architecturally sound — the specification was written to capture and formalize what the system should do, and the implementation delivers those capabilities.

### What the vault must know

The vault must be updated to:
1. **Name the hierarchy** — Program Intelligence → GEIOS → PiOS → LENS → SQO → Marketplace
2. **Lock the terms** — GEIOS, Program Intelligence, Marketplace, PMO Bundle, Productization Bridge
3. **Reconcile the phases** — LENS 5A/5B is the implementation decomposition of Strategic Phase 4
4. **Retire the bridge adapters** — 6 rendering adapters superseded by cognitive zone architecture; bridge principle preserved through GenericSemanticPayloadResolver + zone derive functions
5. **Map the modules** — 6 PMO Bundle modules against implementation reality

### What must NOT change

- GEIOS remains hidden substrate. This is permanent.
- LENS remains the visible shell. This is permanent.
- Evidence-first governance. This is permanent.
- 13 absolute prohibitions. These are permanent.
- Deterministic sovereignty. This is permanent.

---

## 8. Decision Points for Operator

| Decision | Options | Impact |
|----------|---------|--------|
| Execute vault alignment now? | YES → proceed with G1 stream / NO → defer | Determines when canonical hierarchy becomes vault truth |
| ~~Bridge adapter disposition?~~ | RESOLVED — retired as superseded | Bridge principle preserved; adapter mechanism retired |
| PMO Bundle commercial sequence? | Module 1-5 first (complete) / Module 6 first (workspace) | Determines commercial packaging priority |
| Marketplace timeline? | Post-PMO Bundle / Parallel | Determines platform evolution pace |
