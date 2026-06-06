# Architecture Preservation Matrix

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture Consuming)
**Date:** 2026-05-31

---

## 1. PURPOSE

This matrix maps ALL architectural concepts — not just the operational chain — to their treatment across all 6 phases. It distinguishes operational position from architectural role, maps PRE's three zones to the architectural concepts they serve, and verifies consumer-genericity.

---

## 2. CONCEPT-TO-PHASE MATRIX

### Operational Chain Concepts

| Concept | Architectural Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|---------|-------------------|---------|---------|---------|---------|---------|---------|
| **CIP** | L0-L3 compiled intelligence assembly | CONSUMED (input to PICR) | Unchanged | Unchanged | Unchanged | Unchanged | Unchanged |
| **PICR** | L4 cognition formation runtime | INSTANTIATED | Unchanged | Unchanged | Unchanged | Unchanged | Unchanged |
| **Cognition Object** | Formal L4 artifact (9 defined) | PRODUCED (by materializers) | PACKAGED (into PICP) | PROJECTED (by PRE) | RENDERED (for EIR) | Unchanged | RE-ROUTED (LENS consumes through PICP) |
| **PICP** | Cognition package (portable snapshot) | — | INSTANTIATED | CONSUMED (by PRE) | Unchanged | Unchanged | Unchanged |
| **PRE** | Projection rendering engine | — | — | INSTANTIATED | CONSUMED (by EIR) | EXTENDED (asset inclusion) | VALIDATED (consumer-genericity) |
| **ProjectionConfig** | L5 parameterization schema | — | — | INSTANTIATED | EIR config created | Asset refs added | 5 persona configs created |
| **EIR** | Governed consumer / proof artifact | — | — | — | INSTANTIATED | ENHANCED (graphics) | Unchanged |

### Constitutional Architecture Concepts

| Concept | Architectural Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|---------|-------------------|---------|---------|---------|---------|---------|---------|
| **Governed Cognition** | Center of gravity (22 functions × 5 strata) | SERVED (materializers formalize its output) | SERVED (PICP packages it) | SERVED (PRE projects it) | PROVED (EIR consumes it) | SERVED (visual assets project it) | VALIDATED (consumer-genericity proves its reach) |
| **22 Cognitive Functions** | What the system DOES | NOT MODIFIED (PICR reads their output) | Unchanged | NOT MODIFIED (PRE projects, not replaces) | Unchanged | Unchanged | Unchanged |
| **5 Cognition Strata** | Classification model | RESPECTED (materializers classified per strata) | Unchanged | RESPECTED (Zone B operates within boundaries) | Unchanged | Unchanged | Unchanged |
| **5 Runtime Strata** | Constitutional framework (A-E) | RESPECTED | Unchanged | RESPECTED | Unchanged | Unchanged | Unchanged |
| **SQO** | Qualification overlay | CONSUMED (qualification_state feeds materializers) | CARRIED (qualification_state in PICP metadata) | ENFORCED (Zone C) | APPLIED (EIR gated by authority ceiling) | Unchanged | APPLIED (all personas gated) |
| **L4/L5 Separation** | Pipeline layer boundary | INSTANTIATED (L4 = PICR) | CRYSTALLIZED (PICP is the L4 output artifact) | INSTANTIATED (L5 = PRE) | PROVED (EIR demonstrates clean separation) | Unchanged | VALIDATED |
| **7-Gate Qualification Test** | Constitutional gate for PICP membership | RESPECTED (materializers produce qualified objects) | VERIFIED (PICP contains only qualified objects) | Unchanged | Unchanged | Unchanged | Unchanged |

### Temporal Continuity Concepts

| Concept | Architectural Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|---------|-------------------|---------|---------|---------|---------|---------|---------|
| **Spine** | Continuity mechanism — cognition survives evolution, replay, reuse, cross-run accumulation | CONSUMED (spine data feeds trajectory_assessment via CIP) | ENABLED (PICP versioning enables temporal comparison via Spine) | RESPECTED (PRE does not bypass Spine's temporal role) | Unchanged | Unchanged | Unchanged |
| **Chronicle** | Governed replay mechanism — cognition explained, certified, trusted through time | CONSUMED (certification state feeds structural_posture via CIP) | CARRIED (chronicle_certification in PICP metadata) | CONSUMED (Zone C uses certification state for authority ceiling) | Unchanged | Unchanged | Unchanged |
| **DNA** | Propagation / inheritance logic — execution structure carries consequences forward | DEFERRED | DEFERRED | DEFERRED | DEFERRED | DEFERRED | DEFERRED |
| **Neuron** | Cognitive primitive — candidate unit for cognition object composition | DEFERRED | DEFERRED | DEFERRED | DEFERRED | DEFERRED | DEFERRED |

### Projection Concepts

| Concept | Architectural Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|---------|-------------------|---------|---------|---------|---------|---------|---------|
| **Projection Family** | Named rendering configuration (8 defined) | — | — | INSTANTIATED (as ProjectionConfig types) | EIR = Report family | Unchanged | LENS personas as projection families |
| **Persona Projection** | Cognitive depth selection (5 personas) | Unchanged | Unchanged | FORMALIZED (ProjectionConfig per persona) | Unchanged | Unchanged | RE-ROUTED through PRE |
| **Three-Zone PRE** | Zone A/B/C constitutional architecture | — | — | INSTANTIATED | EXERCISED (all zones) | Zone A extended | VALIDATED (consumer-generic) |

---

## 3. ARCHITECTURAL ROLE PRESERVATION RULES

### Concepts That MUST NOT Be Reduced to Implementation State

| Concept | Correct Architectural Role | WRONG Reduction | Why Wrong |
|---------|--------------------------|-----------------|-----------|
| Spine | Continuity mechanism | "85 semantic_propositions" or "7/8 classes empty" | Current population is implementation state; Spine's role is constitutional continuity |
| Chronicle | Governed replay mechanism | "Feeds certification status to structural_posture" | Chronicle's role is governed replay/certification, not a data feed |
| DNA | Propagation / inheritance logic | "Metaphor" or "Not constitutionalized" | DNA may be deferred but its architectural role is propagation, not a dismissible concept |
| Neuron | Cognitive primitive | "Does not exist" | Neuron may be deferred but its candidacy as an architectural concept is preserved |
| PICP | Cognition package | "The architecture" or "The center of gravity" | PICP is a packaging layer, one of four satellites serving Governed Cognition |
| 9 Cognition Objects | Formal L4 artifacts | "The full cognition system" | 9 objects are the L4 packaging, not the 22 cognitive functions that produce them |
| PRE | Projection rendering engine | "The report generator" | PRE is consumer-generic projection, not report generation |

### Deferred Concepts

| Concept | Deferred Because | Preserved How | When to Revisit |
|---------|-----------------|---------------|-----------------|
| DNA | No current operational instantiation | Architectural role (propagation/inheritance) preserved in matrix | When cross-run consequence propagation is addressed |
| Neuron | No current operational instantiation | Architectural role (cognitive primitive) preserved in matrix | When cognition object decomposition is explored |
| Spine object materialization (7/8 classes) | Requires upstream G1 stream | PICP versioning (Phase 2) enables future Spine-based temporal comparison | After PICR/PICP formalization proves the consumption pattern |
| Agentic orchestration (Stratum B) | Current orchestration is rule-based | Stratum B identified as future AI participation zone in PRE Zone B boundary | When orchestration OF cognition (not cognition itself) is explored |

---

## 4. PRE THREE-ZONE → ARCHITECTURAL CONCEPT MAPPING

| Zone | Architectural Concepts Served | How |
|------|------------------------------|-----|
| **Zone A (Deterministic Projection)** | Cognition Objects (L4 → consumer structures), Projection Family (rendering template), ProjectionConfig (parameterization), 22 Cognitive Functions (projects their output) | Zone A transforms PICP cognition objects into consumer-ready structures without interpretation. The transformation is deterministic and consumer-parameterized. |
| **Zone B (Governed Narrative)** | Interpretive Authority (75.x bounded), Persona Projection (audience-specific narrative), 5 Cognition Strata (operates within boundaries) | Zone B is the single bounded region where governed AI operates. It projects cognition for a specific audience under 75.x authority, disclosure-wrapped, evidence-traceable. |
| **Zone C (Qualification Gate)** | SQO (authority ceiling enforcement), Chronicle (certification state consumed), Non-Automatable Boundary (human governance preserved), 13 Absolute Prohibitions | Zone C enforces what Zone B MAY project. It is consumer-INDEPENDENT — the same SQO S-level applies to all consumers. |

---

## 5. CONSUMER-GENERICITY VERIFICATION

### The Invariant

> **PRE core must not change when adding a new consumer. Only ProjectionConfig and consumer-specific rendering adapters may change.**

### Per-Consumer Verification

| Consumer | ProjectionConfig Required | Rendering Adapter Required | PRE Core Change Required | Verdict |
|----------|--------------------------|---------------------------|-------------------------|---------|
| EIR (Consumer #1) | `configs/eir.js` — chapter mapping, executive audience, multi-format | `consumers/eir/EIRAdapter.js` — chapter rendering, PDF/HTML/PPTX | NO — PRE dispatches via config | PASS |
| BOARDROOM (Consumer #2a) | `configs/boardroom.js` — posture cards, executive audience, interactive web | Existing LENS zone components | NO — same Zone A/B/C dispatch | PASS |
| BALANCED (Consumer #2b) | `configs/balanced.js` — briefing corridor, senior leadership, interactive web | Existing LENS zone components | NO — same Zone A/B/C dispatch | PASS |
| DENSE (Consumer #2c) | `configs/dense.js` — zone navigation, technical leadership, interactive web | Existing LENS zone components | NO — same Zone A/B/C dispatch | PASS |
| OPERATOR (Consumer #2d) | `configs/operator.js` — evidence sections, engineering, interactive web | Existing LENS zone components | NO — same Zone A/B/C dispatch | PASS |
| INVESTIGATION (Consumer #2e) | `configs/investigation.js` — verification sequence, audit, interactive web | Future: INVESTIGATION renderer | NO — same Zone A/B/C dispatch | PASS |
| M&A (Consumer #3) | New config — transformation risk, M&A audience, report format | New: M&A rendering adapter | NO — only config + adapter | PASS |
| Portfolio (Consumer #3) | New config — cross-program, portfolio audience, report format | New: Portfolio rendering adapter | NO — only config + adapter | PASS |

**All consumers PASS.** Adding Consumer #3+ requires:
1. One new ProjectionConfig file (~40 LOC, data declaration)
2. One new rendering adapter (consumer-specific format rendering)
3. ZERO changes to PRECore.js, ZoneA.js, ZoneB.js, ZoneC.js, or ProjectionConfig.js

---

## 6. VALUE ACCUMULATION ("IF WE STOP AFTER PHASE X")

| Phase | Accumulated Value | Architectural Standing |
|-------|------------------|----------------------|
| After Phase 1 | Cognition FORMED into 9 named objects. Diffability possible. Future consumers can read structured cognition regardless of downstream architecture choices. | PICR exists. L4 layer is real, not theoretical. |
| After Phase 2 | Portable, versioned cognition artifact exists. Can be serialized, stored, compared across runs. Consumer-independent packaging. Spine temporal comparison enabled. | PICP exists. L4/L5 boundary is a concrete artifact. |
| After Phase 3 | Consumer-generic projection formalized. Three-zone architecture defined once, reusable by all consumers. AI boundary explicit in code. | PRE exists. Full CIP → PICR → PICP → PRE chain operational. |
| After Phase 4 | **First consumer proof.** End-to-end demonstrated through full chain. Architecture is proven by delivery, not definition. | EIR proves the architecture produces governed output. |
| After Phase 5 | Visual cognition assets are PRE-consumable. Topology and pressure zones available to any consumer. | Asset pipeline extends PRE without modifying PRE core. |
| After Phase 6 | **Consumer-generic architecture proven.** 5 + 1 consumers served through same PRE. Marketplace model enabled. | Architecture validation complete. Domain Modules × Projection Families × N Consumers. |

**At every phase boundary, the accumulated value is non-vacuous.** Even if work stops after Phase 1, the codebase has gained explicit cognition formation that any future approach can build upon.
