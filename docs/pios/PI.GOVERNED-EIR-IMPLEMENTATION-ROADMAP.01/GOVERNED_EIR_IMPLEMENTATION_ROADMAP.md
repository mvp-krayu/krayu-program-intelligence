# Governed EIR Implementation Roadmap

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture Consuming)
**Date:** 2026-05-31

---

## Mission

Build a governed cognition consumption architecture that serves multiple consumers — with the Executive Intelligence Report as the first proof consumer.

The EIR is not the destination. The destination is governed cognition reaching multiple consumers through a single architecture.

---

## 6-Phase Roadmap

### Phase 1 — PICR (Cognition Formation Runtime)

| Field | Detail |
|-------|--------|
| **Objective** | Create the L4 runtime that transforms CIP into 9 named cognition objects |
| **Layer** | L4 — Pipeline Cognition Layer |
| **AI Participation** | NONE. Pure function materializers. Deterministic: same CIP → same cognition objects. |
| **Consumers Served** | None directly — PICR produces PICP, which serves all consumers downstream |
| **PRE Zones Exercised** | None — PRE does not exist yet |

**Deliverables:**
- 9 materializer functions — pure functions, each producing one cognition object from CIP
- PICR orchestrator — calls all 9 materializers, assembles the output
- Unit tests — deterministic verification (same CIP → same objects)

**Existing Assets:**
- `forBoardroom()` (ConsequenceCompiler.js:770) — proto-L4 assembly producing cognition_slices, consequence_themes, posture_label, executive_synthesis
- `resolveSemanticPayload()` (GenericSemanticPayloadResolver) — produces fullReport (~180 fields), the CIP equivalent
- All 9 cognition object schemas locked (PI.EXECUTIVE-COGNITION-RUNTIME.01/EXECUTIVE_COGNITION_OBJECT_MODEL.md)
- Source-of-truth per object with line-level LENS source references (PI.PICP-CONSUMPTION-BASELINE-MAP.01 §3)

**New Work:**
- 9 materializer functions (30-80 LOC each per consumption baseline map §5.3)
- PICR orchestrator (thin — calls materializers, collects results)
- CIP input contract (which resolver fields map to which materializer inputs)

**Key Insight:** T1 materializers (4 objects: structural_posture, tension_map, constraint_inventory, exposure_assessment) are pure assembly — zero new computation. These are the starting point.

**Formalization Tiers (from consumption baseline):**
- T1 — Assembly Only (4 objects): structural_posture, tension_map, constraint_inventory, exposure_assessment
- T2 — Assembly + Lookup (3 objects): trajectory_assessment, decision_surface, operational_ceiling
- T3 — Vocabulary Authoring (1 object): absence_profile
- T4 — Rule Formalization (1 object): detection_boundary

**Success Criteria:**
- All 9 materializers produce deterministic output from a CIP fixture
- Materializer output matches EXECUTIVE_COGNITION_OBJECT_MODEL.md schemas
- Zero interpretive authority in any materializer

**Regression Risk:** NONE — additive. No existing surface changes.

**Architectural Value:** Cognition is FORMED from CIP into named objects. Any future consumer can read structured cognition. Diffability becomes possible.

**Why Not Skippable:** Without PICR, there are no named cognition objects. PICP cannot exist. PRE has nothing to project. Every downstream phase depends on this.

**Architectural Role Preservation:**
- Instantiates: PICR (cognition formation runtime), Cognition Object (9 formal L4 artifacts)
- Defers: Spine materialization (7/8 spine object classes), DNA, Neuron
- Must not violate: CIP integrity (L0-L3 are upstream, PICR reads but does not modify), Deterministic principle (same input → same output)

---

### Phase 2 — PICP (Cognition Package)

| Field | Detail |
|-------|--------|
| **Objective** | Define the PICP container schema and wire PICR output into it |
| **Layer** | L4 output — Cognition Packaging |
| **AI Participation** | NONE. Container definition. Artifact: immutable once produced. |
| **Consumers Served** | None directly — PICP is consumed by PRE |
| **PRE Zones Exercised** | None — PRE does not exist yet |

**Deliverables:**
- PICP schema definition (9 objects + metadata envelope)
- Serialization format (JSON)
- Versioning mechanism (pipeline_run_id, timestamp, schema_version)
- PICP producer (PICR → PICP wrapper)

**Existing Assets:**
- Object schemas locked (Phase 1 output)
- `file_changes.json` and `validation_log.json` patterns model structured portable artifacts
- `buildTrailHTML()` (InterrogationTrailBuilder.js:1019) — demonstrates self-contained governed export

**New Work:**
- PICP metadata envelope (version, timestamp, pipeline_run_id, qualification_state, schema_version)
- Serialization contract (JSON schema for the complete PICP)
- Immutability enforcement (PICP is frozen once produced)

**Success Criteria:**
- PICP serializes to JSON and deserializes without loss
- PICP carries pipeline_run_id for temporal tracking
- Two PICP instances from different runs are diffable

**Regression Risk:** NONE — additive.

**Architectural Value:** PICP is a portable, versioned artifact. Can be serialized, stored, compared across runs. Consumer-independent packaging exists. Spine temporal comparison becomes possible.

**Why Not Skippable:** Without PICP, there is no portable cognition artifact. PRE cannot consume a standardized input. Temporal comparison is impossible. The marketplace model requires a standardized interface.

**Architectural Role Preservation:**
- Instantiates: PICP (cognition package), L4/L5 boundary (PICP IS the boundary artifact)
- Preserves: Spine continuity role (PICP carries temporal metadata enabling Spine-based comparison), Chronicle certification state (qualification_state in PICP metadata)
- Defers: Temporal PICP diffing (requires Spine materialization), DNA propagation
- Must not violate: PICP is the package, NOT the architecture. Phase 2 must not collapse Governed Cognition into "the 9 objects in PICP."

---

### Phase 3 — PRE (Consumer Projection Engine)

| Field | Detail |
|-------|--------|
| **Objective** | Build the L5 consumer-generic projection engine with three-zone architecture |
| **Layer** | L5 — Pipeline Projection Layer |
| **AI Participation** | Zone B ONLY. Consumer-generic governed narrative under 75.x. Zones A and C are deterministic/qualification. Same zones for ALL consumers. |
| **Consumers Served** | Architecture serves ALL consumers. No consumer-specific code in PRE core. |
| **PRE Zones Exercised** | All three defined. Zone A/B/C boundary is constitutional. |

**Deliverables:**
- PRE core orchestrator (Zone A → Zone B → Zone C dispatch)
- ProjectionConfig schema (projection_type, audience, format, rendering_overrides)
- Zone A: deterministic projection engine (PICP → consumer-ready structures)
- Zone B: governed narrative interface (75.x bounded, disclosure-wrapped, evidence-traceable)
- Zone C: qualification gate (SQO authority ceiling, 13 prohibitions, governance wrapping)

**Existing Assets:**
- `forBoardroom()` (ConsequenceCompiler.js:770) — proto-PRE for BOARDROOM
- `forBalanced()` (ConsequenceCompiler.js:977) — proto-PRE for BALANCED
- `forOperator()` (ConsequenceCompiler.js:1084) — proto-PRE for OPERATOR
- `forInvestigation()` (ConsequenceCompiler.js:1113) — proto-PRE for INVESTIGATION
- `buildTrailHTML()` (InterrogationTrailBuilder.js:1019) — proto-PRE for evidence records
- `composeGoverningNarrative()` (GoverningNarrativeComposer.js:194) — spine-grounded narrative
- `deterministicBoundedProvider()` (GoverningNarrativeComposer.js:66) — template-based composition

**New Work:**
- PRE core architecture (zone dispatch, ProjectionConfig loading, PICP validation)
- ProjectionConfig instances (one per consumer/projection family — data declarations)
- Zone A rendering template system (consumer-parameterized structure generation)
- Zone B narrative interface contract (how governed AI is invoked, bounded, and disclosed)
- Zone C qualification enforcement (SQO gate as code)

**Critical Constraint — Consumer-Genericity Invariant:**

> **PRE core must not change when adding a new consumer. Only ProjectionConfig and consumer-specific rendering adapters may change.**

Phase 3 must architect PRE so that adding Consumer #3 (marketplace) requires ZERO modifications to PRE's zone boundaries, orchestration logic, or qualification gate.

**Success Criteria:**
- PRE accepts any ProjectionConfig and produces consumer-appropriate output
- Zone A/B/C boundaries are explicit in code
- Zone B operates under 75.x with disclosure wrapping
- Zone C enforces SQO authority ceiling
- Adding a hypothetical Consumer #3 requires only ProjectionConfig + rendering adapter

**Regression Risk:** NONE — additive. Existing proto-PRE functions remain operational.

**Architectural Value:** PRE exists. Consumer-generic projection is formalized. Three-zone architecture (A/B/C) defined once, reusable by all consumers.

**Why Not Skippable:** Without PRE, there is no governed projection. Each consumer would build its own ad-hoc projection from the PICP, defeating consumer-genericity. The marketplace model requires a single PRE.

**Architectural Role Preservation:**
- Instantiates: PRE (projection rendering engine), L5 (pipeline projection layer), ProjectionConfig, Projection Family
- Preserves: 22 cognitive functions (PRE projects their output, does not replace them), 5 cognition strata (Zone B operates within strata boundaries), Chronicle (Zone C consumes certification state)
- Defers: Agentic orchestration (Stratum B — future AI participation in orchestration OF cognition, not cognition itself)
- Must not violate: AI boundary (Zone B only), consumer-genericity invariant, 13 absolute prohibitions

---

### Phase 4 — First Consumer Proof (EIR as Reference Consumer #1)

| Field | Detail |
|-------|--------|
| **Objective** | Produce the first governed consumer output end-to-end: CIP → PICR → PICP → PRE → EIR |
| **Layer** | L5 output — Consumer Rendering |
| **AI Participation** | Consumed from PRE Zone B. No additional AI. First proof consumer inherits PRE governance. |
| **Consumers Served** | EIR (Reference Consumer #1) |
| **PRE Zones Exercised** | All three at maximum depth |

**Deliverables:**
- EIR ProjectionConfig (chapter→object mapping, executive narrative audience model, authority ceiling)
- EIR rendering adapter (chapters mapped from cognition objects, multi-format mechanics)
- End-to-end pipeline test (CIP fixture → PICR → PICP → PRE → EIR output)

**Existing Assets:**
- `buildTrailHTML()` (InterrogationTrailBuilder.js:1019) — structural template for self-contained governed HTML output
- EIR forensic analysis (PI.EXECUTIVE-INTELLIGENCE-REPORT-COMPILER.01) — chapter structure, finding templates, T1-T7 decomposition
- Original EIR chapters 1-10 (specimen data for chapter→object mapping)

**New Work:**
- EIR ProjectionConfig: which cognition objects feed which chapters, section inclusion rules, finding template (4-part)
- EIR rendering adapter: chapter rendering, evidence citation assembly, multi-format output (HTML/PDF/PPTX)
- Executive narrative integration: Zone B narrative for executive audience

**Key Insight:** The EIR is the first PROOF that the consumer-generic architecture works. It is not the destination. The test: can a SECOND consumer be added without changing PRE's core architecture?

**Success Criteria:**
- EIR is produced end-to-end from CIP through the formalized chain
- All EIR content traces to PICP cognition objects
- Zone B narrative is disclosure-wrapped and evidence-traceable
- Zone C governance wrapping is present in output
- PRE core was not modified for EIR-specific logic

**Regression Risk:** NONE — additive. EIR is a new consumer.

**Architectural Value:** Architecture is proven, not just defined. First consumer demonstrates end-to-end: governed cognition → deterministic formation → portable packaging → consumer-generic projection → governed output.

**Why Not Skippable:** Without a first consumer proof, the architecture remains theoretical. The EIR exercises all three PRE zones at maximum depth — it is the most demanding test of the consumer-generic architecture.

**Architectural Role Preservation:**
- Instantiates: EIR (governed consumer / proof artifact), first projection family rendering
- Validates: PRE consumer-genericity (EIR consumed through PRE, not bypassing it)
- Must not violate: Consumer-genericity invariant (PRE core unchanged for EIR), AI boundary (no AI outside Zone B)

---

### Phase 5 — Graphics and Topology as PRE-Consumable Assets

| Field | Detail |
|-------|--------|
| **Objective** | Topology visualization and structural graphics become PRE-consumable assets for any consumer |
| **Layer** | Asset generation — consumer-independent |
| **AI Participation** | NONE. Topology capture, static rendering. Deterministic: same topology → same SVG. |
| **Consumers Served** | All consumers that embed visual assets (EIR, BOARDROOM, DENSE, marketplace) |
| **PRE Zones Exercised** | Zone A only (deterministic asset inclusion) |

**Deliverables:**
- Static topology rendering path (SVG/PNG for report embedding)
- Pressure zone summary graphics
- Asset pipeline integration with PRE (assets as PRE-consumable sections)

**Existing Assets:**
- `StructuralTopologyZone.jsx` — interactive topology rendering
- `IntelligenceField.jsx` — pressure zone glyph rendering
- Authoritative SVG topology capture (commit 3cf76de) — already produces governed SVG export
- 9-slice topology cognition language — all slices rendering with evidence-bound overlays

**New Work:**
- Static rendering path for topology (SVG export for non-interactive consumers)
- Pressure zone summary graphics (static rendering of IntelligenceField state)
- Asset registration in PRE (how ProjectionConfig references visual assets)

**Success Criteria:**
- Topology SVG renders identically in static format as in interactive LENS
- Assets are consumer-independent (same SVG for EIR, BOARDROOM, marketplace)
- Asset pipeline integrates with PRE Zone A (deterministic inclusion by ProjectionConfig)

**Regression Risk:** NONE — additive. Interactive topology remains unchanged.

**Architectural Value:** Visual cognition assets (topology, pressure zones) are PRE-consumable. Any consumer can embed governed structural graphics.

**Why Not Skippable:** Without visual assets, the EIR and marketplace consumers are text-only. The topology is the primary cognition substrate — excluding it from consumer output loses structural cognition.

**Architectural Role Preservation:**
- Instantiates: Visual asset pipeline as PRE-consumable resources
- Preserves: Topology as primary cognition substrate (visual assets project topology, not replace it)
- Must not violate: Evidence-bound cognition doctrine (all visual assets carry evidence classification)

---

### Phase 6 — LENS as Reference Consumer #2 (Architecture Validation)

| Field | Detail |
|-------|--------|
| **Objective** | LENS v2 persona modes consume PICP through the same PRE, proving consumer-genericity |
| **Layer** | Consumption path — architecture validation |
| **AI Participation** | NONE. Same PRE, different ProjectionConfig. Architecture validation: if LENS requires PRE redesign, consumer-genericity has failed. |
| **Consumers Served** | LENS BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION (5 persona projections) |
| **PRE Zones Exercised** | All three through 5 different ProjectionConfigs |

**Deliverables:**
- 5 ProjectionConfig instances (one per persona)
- 5 rendering adapter updates (re-route persona consumption to PICP through PRE)
- Regression test suite (diff before/after for all 5 persona modes)
- Consumer-genericity validation report

**Existing Assets:**
- `forBoardroom()`, `forBalanced()`, `forOperator()`, `forInvestigation()` — existing proto-PRE functions
- `IntelligenceField.jsx`, `StructuralTopologyZone.jsx` — existing rendering components
- `InvestigationVerifier.js` — existing evidence verification
- `SoftwareIntelligenceProjectionAdapter.js` — existing SW-Intel projection

**New Work:**
- Re-route proto-PRE functions to consume PICP objects through formalized PRE
- Create ProjectionConfig per persona (data declarations)
- Regression testing: LENS output must be identical before and after re-routing

**Key Insight — This is the ARCHITECTURE VALIDATION phase:**

If LENS consumers can be served through the same PRE that serves the EIR — consumer-generic architecture is proven. If PRE must be redesigned for LENS — the architecture was EIR-specific and the marketplace model fails.

**Consumer-Genericity Invariant Test:**

| Check | Expected | If Fails |
|-------|----------|----------|
| PRE core modified? | NO | Architecture is EIR-specific |
| Zone A/B/C boundaries changed? | NO | Zone model is consumer-specific |
| Qualification gate modified? | NO | Governance is consumer-specific |
| Only ProjectionConfig + adapters added? | YES | Consumer-genericity proven |

**Success Criteria:**
- All 5 LENS persona modes render identically after re-routing through PICP/PRE
- ZERO PRE core modifications (only ProjectionConfig + rendering adapters)
- Consumer-genericity invariant holds
- Regression test: diff before/after shows zero rendering change

**Regression Risk:** MEDIUM — Phase 6 re-routes existing consumption paths. Output must be identical. Regression test (diff before/after) is mandatory.

**Architectural Value:** Consumer-generic architecture proven. LENS (Reference Consumer #2, 5 persona projections) consumes through same PRE as EIR. Marketplace model enabled: Domain Modules × Projection Families × N Consumers.

**Why Not Skippable:** Without Phase 6, consumer-genericity is claimed but unproven. The marketplace model depends on this validation. If skipped, every future consumer risks requiring PRE core changes.

**Architectural Role Preservation:**
- Validates: Consumer-genericity invariant (the defining test), PRE as consumer-generic engine, marketplace model
- Preserves: All existing LENS surfaces (regression-tested), persona projection doctrine (same truth, different depths)
- Must not violate: Any existing LENS rendering (output must be identical), consumer-genericity invariant

---

## Value Accumulation

| Stop After | What Exists | Architectural Value |
|-----------|-------------|---------------------|
| Phase 1 | PICR | Cognition is FORMED into named objects. Diffability possible. Future consumers can read structured cognition. |
| Phase 2 | PICP | Portable, versioned cognition artifact. Serializable, storable, comparable across runs. Consumer-independent packaging. |
| Phase 3 | PRE | Consumer-generic projection formalized. Three-zone architecture defined once, reusable by all. |
| Phase 4 | EIR | **First consumer proof.** End-to-end demonstrated: CIP → PICR → PICP → PRE → governed output. Architecture proven. |
| Phase 5 | Graphics | Visual cognition assets are PRE-consumable. Any consumer can embed governed structural graphics. |
| Phase 6 | LENS | **Consumer-generic architecture proven.** 5 persona projections through same PRE as EIR. Marketplace model enabled. |

---

## Executive Cognition Runtime Boundary Map

See CONSUMER_PROJECTION_BOUNDARY.md §4 for the full AI boundary diagram.

**Per-phase summary:**

| Phase | Layer | AI Participation | Constitutional Constraint |
|-------|-------|-----------------|--------------------------|
| Phase 1 — PICR | L4 | **None.** | Deterministic: same CIP → same cognition objects |
| Phase 2 — PICP | L4 output | **None.** | Artifact: immutable once produced |
| Phase 3 — PRE | L5 | **Zone B only.** | 13 prohibitions. Disclosure wrapping. Authority ceiling. Consumer-independent. |
| Phase 4 — EIR | L5 output | **Consumed from PRE Zone B.** | First proof consumer inherits PRE governance |
| Phase 5 — Graphics | Asset | **None.** | Deterministic: same topology → same SVG |
| Phase 6 — LENS | Consumption | **None.** | If LENS requires PRE redesign → architecture has failed |
