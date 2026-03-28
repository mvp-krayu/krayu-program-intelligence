# Derivation Ownership and Placement Correction

Stream: 40.12 — Derivation Ownership & Placement Correction
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 00.2 — Canonical Layer Model Restoration
Status: GOVERNANCE CORRECTION

────────────────────────────────────

## 1. Purpose

This artifact restores where derivation lives inside the canonical Program Intelligence layer model.

It does not define how derivation works.

It does not specify formulas, thresholds, or computational methods.

It corrects ownership and placement of derivation constructs to comply with the canonical layer model established in Stream 00.2.

────────────────────────────────────

## 2. Scope

### In Scope

- defining derivation ownership as belonging to L3
- classifying signal-like constructs by ownership and placement
- identifying mis-layering where derivation appears outside L3
- stating correction rules that remove runtime computation assumptions
- defining enforcement and violation conditions
- mapping downstream impact without redefining downstream streams
- leaving derivation specification explicitly open for future work

### Out of Scope

The following are explicitly out of scope for this stream:

- formulas
- thresholds
- signal invention or engineering
- computational methods or algorithmic description
- execution logic
- UI behavior
- demo behavior
- semantic shaping
- contract redesign
- code changes
- implementation proposals

────────────────────────────────────

## 3. Derivation Ownership Definition

### Derivation Defined

Derivation is evidence-bound upstream transformation that produces governed signal constructs from source truth.

Derivation requires:
- evidence-bound inputs with traceable provenance
- governed transformation rules owned by L3
- outputs that are signal constructs, derived metrics, or structural state markers

### Derivation Is Not

Derivation is not:
- representation formatting
- semantic presentation
- narrative synthesis
- UI rendering
- demo simulation
- display-layer convenience computation
- template population
- structural label assignment at runtime

### Ownership Rule

Derivation belongs only to L3.

Derivation must originate upstream of L5.

Derivation cannot be relocated into runtime layers (L6), demo layers (L7), or governance layers (L8).

Derivation cannot be substituted by display logic, template logic, or contract prose.

────────────────────────────────────

## 4. Construct Classification

### SSZ — Structural Stress Zone

Classification: MIS-LAYERED

Canonical owner: L3
Current location: L6 (utils/ssz.js, ExecLens runtime)

SSZ is a structural state marker derived from topology-bound evidence. Its derivation belongs at L3. Its current placement at L6 constitutes a layer ownership violation. The construct itself is valid. The placement is not.

### SSI — Structural Stress Index

Classification: MIS-LAYERED

Canonical owner: L3
Current location: L6 (utils/ssz.js, computed as component count per capability)

SSI is the numerical expression of structural stress. It is a derived metric and belongs at L3. Its current placement at L6 constitutes a layer ownership violation. The construct itself is valid. The placement is not.

### ESI — Execution Signal Index (or equivalent)

Classification: PRESENT BUT UNGOVERNED

Canonical owner: L3 (when formally defined)
Current location: Referenced in stream context and documentation; no formal derivation specification exists at L3

ESI is referenced within current program framing as a signal-like construct. It has not been formally specified at L3. Until a formal derivation specification exists at L3, ESI is ungoverned. No placement correction can be applied to an ungoverned construct. ESI derivation specification remains open.

────────────────────────────────────

## 5. Misplacement Identification

### Pattern 1 — L6 Derivation

SSZ and SSI derivation ownership is currently placed at L6 (ExecLens runtime). L6 is a consumer layer. Derivation ownership placed at L6 constitutes a layer ownership violation regardless of implementation form.

### Pattern 2 — UI Implicit Derivation

When a consumer layer (L5 or L6) holds derivation ownership for a signal-like construct, that derivation is mis-layered even if it is not recognized as computation within that layer's scope. Derivation ownership does not transfer to a consumer layer by virtue of proximity to topology or evidence payloads. The ownership violation exists at the layer boundary, not at the point of execution.

### Pattern 3 — Demo-Inherited Derivation

Stream 51 introduced SSZ visualization through the demo choreography layer (L7). The derivation ownership source for that SSZ reference is the L6 mis-placement identified in Pattern 1. L7 therefore carries a downstream ownership gap. This is not a new L7 violation; it is a dependency on an unresolved L6 placement violation.

### Pattern 4 — Absent L3 Specification

No formal L3 derivation artifact exists for SSZ, SSI, or ESI. Derivation without a formal L3 specification means derivation ownership is ungoverned regardless of where it is placed. Ungoverned derivation in any layer constitutes an ownership violation.

────────────────────────────────────

## 6. Correction Rules

The following rules govern the restoration of correct derivation placement.

**Rule 1 — Derivation Originates in L3**
All signal constructs, structural state markers, and derived metrics must be specified and governed at L3. Any current or future stream that introduces a signal-like construct must anchor it at L3 first.

**Rule 2 — L4 May Not Derive Governed Signals**
L4 (Semantic Shaping Layer) may shape meaning presentation of already-derived outputs. L4 may not produce governed signal constructs. L4 may not perform derivation that was not first completed at L3.

**Rule 3 — L5 and L6 Are Consumer Layers**
L5 (Presentation Assembly) and L6 (Runtime Experience) may consume and present L3-derived outputs. They may not hold derivation ownership. Derivation ownership placed at L5 or L6 constitutes a layer violation regardless of the form it takes.

**Rule 4 — L7 May Not Simulate Derivation**
L7 (Demo / Narrative Packaging) may package and stage L3-derived outputs for demonstration. L7 may not simulate derivation as substitute truth. Demo sequences that visually represent SSZ or SSI must consume pre-derived outputs, not compute them inline.

**Rule 5 — L8 May Not Define Signal Derivation**
L8 (Governance, Contract, and Validation) may constrain behavior and audit compliance. L8 may not define how signals are derived. Contract prose that describes signal computation does not constitute a valid derivation specification.

────────────────────────────────────

## 7. Enforcement Rules

### Violation Definition

A derivation placement violation occurs when any of the following conditions are true:

- A signal construct, structural state marker, or derived metric is computed at L4, L5, L6, L7, or L8
- A signal construct is referenced in a consumer layer without a traceable L3 derivation specification
- A derivation decision is embedded in rendering, templating, or demo choreography logic
- A contract or governance document describes how a signal is computed without a corresponding L3 specification

### Compliant Placement Definition

Derivation placement is compliant when:

- The construct has a formal derivation specification governed at L3
- The construct is produced by a governed L3 artifact or adapter
- Consumer layers (L4–L7) receive the derived output without re-deriving it
- L8 governance artifacts reference the L3 specification without redefining it

### Future Stream Violation Detection

Future streams must assess compliance against the following:

- Does the stream introduce a new signal-like construct? If yes, a formal L3 derivation specification is required.
- Does the stream perform computation at L4 or below that produces a new structural truth? If yes, this is a violation.
- Does the stream reference a construct by name without an L3 specification? If yes, the construct is ungoverned and must not be treated as canonical.

────────────────────────────────────

## 8. Impact Mapping

### Streams 40.2–40.11

Remain valid in lineage intent and system flow. These streams established the evidence ingestion, signal computation, and navigation foundation. No retroactive invalidation of lineage intent is applied by this stream. Where individual stream artifacts allowed or implied runtime-owned derivation, those allowances are superseded by this correction.

### Streams 42.x

42.x streams are consumer streams. ExecLens (the primary 42.x runtime artifact) is classified as L6 under the canonical model. 42.x remains consumer-only. No 42.x stream owns derivation. The SSZ/SSI placement currently within ExecLens is a violation inherited from the gap identified here. Correction of that placement is a future execution task, not within this stream.

### Stream 51

Stream 51 contains no computation logic ownership. Stream 51 is L7 — demo and narrative packaging. Any appearance of derivation-like behavior in Stream 51 artifacts is downstream inheritance of L6 violations, not a new violation originating in L7. Stream 51 classification and placement remain valid as L7.

### Stream 75.x

Stream 75.x is not activated by this stream. No impact assignment is made.

### Stream 00.2

Remains the architectural reference point for canonical layer placement. This artifact applies and is subordinate to Stream 00.2. No provision of this artifact supersedes or modifies Stream 00.2. Where this artifact conflicts with Stream 00.2, Stream 00.2 governs.

────────────────────────────────────

## 9. Open Items

The following are explicitly left open by this stream and require future governed specification:

- Formal derivation specification for SSZ at L3
- Formal derivation specification for SSI at L3
- Formal derivation specification for ESI at L3 (if ESI is to be retained as a canonical construct)
- Formal derivation specification for RAG state at L3 (if RAG state is to be retained as a canonical construct)
- Definition of governing derivation rules, evidence input requirements, and output contracts for each construct above
- Determination of which current adapter or script constitutes the L3 derivation home for each construct

These items are not addressed by this stream. They belong to future derivation specification streams.

────────────────────────────────────

## 10. Final Position

This artifact restores WHERE derivation lives.

It does not define HOW derivation works.

Derivation is L3-owned.
