# Canonical Layer Model Restoration

Stream: 00.2 — Canonical Layer Model Restoration
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Status: Governance Restoration Artifact
Primary Path: docs/architecture/canonical-layer-model.md

────────────────────────────────────

## 1. Purpose

This artifact restores the canonical layer model for the Program Intelligence system.

It is the authoritative architectural reference governing:

- canonical layer naming
- strict layer ordering
- ownership of computation
- allowed transformations
- forbidden behaviors
- cross-layer flow constraints
- placement of contracts, validation, demo, and runtime constructs

This artifact does NOT:
- redefine PiOS execution behavior
- introduce new feature logic
- authorize predictive or interpretive invention
- allow contracts to become architecture carriers

────────────────────────────────────

## 2. Governing Principles

### 2.1 Evidence First
No layer may emit a truth claim, value, signal, semantic claim, narrative claim, or visual implication unless traceable to evidence or to a formally governed transformation of evidence-bound artifacts.

### 2.2 Separation of Concerns
Each layer owns a distinct responsibility.
No downstream layer may absorb upstream computation.
No upstream layer may absorb downstream presentation behavior.

### 2.3 No Silent Semantic Mutation
Representation may change only where explicitly allowed.
Truth claims, evidence bindings, provenance, and derivation lineage may not be altered without governed rules.

### 2.4 Contracts Are Control Surfaces, Not Architecture
Contracts may constrain execution, validate behavior, and enforce scope.
They do not define canonical architecture.
Canonical architecture is defined here.

### 2.5 UI Is a Consumer, Not a Semantic Authority
Runtime surfaces such as ExecLens may render, navigate, and stage outputs, but may not originate canonical signals, evidence truth, semantic ownership, or executive interpretation logic.

────────────────────────────────────

## 3. Canonical Layer Inventory

The canonical Program Intelligence layer model is:

L0 — Evidence Source Layer
L1 — Evidence Normalization Layer
L2 — Evidence Navigation Layer (ENL)
L3 — Derivation Layer
L4 — Semantic Shaping Layer
L5 — Presentation Assembly Layer
L6 — Runtime Experience Layer
L7 — Demo / Narrative Packaging Layer
L8 — Governance, Contract, and Validation Layer

This ordering is strict and authoritative.

────────────────────────────────────

## 4. Layer Definitions

## L0 — Evidence Source Layer

Purpose
Own raw evidence origins.

Ownership
External systems and primary source repositories.

Allowed Inputs
- raw source system state
- source records
- logs
- exports
- snapshots
- linked records

Allowed Outputs
- raw evidence objects
- immutable source references
- timestamps
- IDs
- hashes
- source metadata
- extracts

Must Never
- compute signals
- infer meaning
- summarize for executives
- shape runtime behavior
- introduce synthetic narrative

────────────────────────────────────

## L1 — Evidence Normalization Layer

Purpose
Convert heterogeneous evidence into controlled, machine-usable structural form without changing truth claims.

Ownership
Ingestion, parsing, schema mapping, evidence preparation.

Allowed Inputs
- L0 raw evidence

Allowed Outputs
- normalized records
- canonical field mappings
- typed entities
- provenance-preserving structured evidence objects

Must Never
- derive executive signals
- interpret business intent
- rank business meaning
- produce narrative conclusions
- hide provenance

────────────────────────────────────

## L2 — Evidence Navigation Layer (ENL)

Purpose
Provide evidence-addressable navigation and retrieval structure across normalized evidence.

Ownership
Traversal, evidence pathing, evidence adjacency, governed retrieval structure.

Allowed Inputs
- L1 normalized evidence

Allowed Outputs
- evidence navigation structures
- evidence paths
- retrieval references
- contextual evidence adjacency
- governed evidence selection surfaces

Must Never
- introduce interpretation
- create business conclusions
- emit executive insight
- behave as a scoring layer
- invent semantic claims beyond evidence navigation

Note
ENL is canonical.
ENL is not a presentation layer.
ENL is not an interpretation layer.

────────────────────────────────────

## L3 — Derivation Layer

Purpose
Perform governed computation and signal derivation from evidence-bound inputs.

Ownership
All formally defined computation that transforms evidence-bound structures into measurable derived outputs.

Allowed Inputs
- L1 normalized evidence
- L2 navigation outputs where retrieval or adjacency is required
- governed derivation rules

Allowed Outputs
- evidence-bound derived metrics
- evidence-bound computed structures
- signal primitives
- topology states
- formal derivation artifacts

Must Never
- produce freeform executive interpretation
- generate investor storytelling
- perform cosmetic UI packaging as logic substitution
- obscure derivation lineage
- claim certainty beyond evidence and rules

Placement Rule
Signal derivation belongs here.

This includes any construct equivalent to:
- signal state zones
- signal state indices
- acceleration or stability computations
- topology-derived structural state markers

If SSZ / SSI are real governed system constructs, their canonical home is L3.

They do NOT belong in:
- UI/runtime
- contract prose
- demo scripting

────────────────────────────────────

## L4 — Semantic Shaping Layer

Purpose
Transform derived outputs into controlled semantic representations without altering evidence truth claims.

Ownership
Representation shaping, semantic framing, structured explanatory forms, controlled summarization of derived outputs.

Allowed Inputs
- L3 derived outputs
- direct evidence anchors from L1/L2 where needed for binding preservation

Allowed Outputs
- semantic representations
- structured explanatory forms
- controlled language mappings
- executive-readable but evidence-bound meaning structures

Must Never
- alter derivation truth
- fabricate evidence bindings
- introduce speculative executive interpretation
- overwrite upstream signal ownership
- become a freeform narrative engine

Precision Rule
This layer may transform representation and structure, but must never alter:
- ENL truth claims
- evidence bindings
- governed derivation results

Placement Rule
Controlled executive-readable meaning may begin here only in evidence-bound form.
Investor persuasion or killer-shot packaging does not belong here.

────────────────────────────────────

## L5 — Presentation Assembly Layer

Purpose
Assemble evidence-bound semantic and derived outputs into presentation-ready payloads.

Ownership
View models, panel payloads, module assembly, ordered output bundles, deep-link wiring.

Allowed Inputs
- L2 evidence paths
- L3 derived outputs
- L4 semantic structures

Allowed Outputs
- presentation payloads
- modules for dashboards or panels
- evidence deep-link bundles
- topology highlight payloads
- traceable structured display objects

Must Never
- recompute signals ad hoc
- reinterpret results because UI wants a different story
- introduce investor persuasion logic
- create new business meaning without governed upstream support

Placement Rule
Evidence deep links belong here as assembled presentation constructs backed by L2 references.

Topology highlighting belongs here if it is a display treatment of already-derived structural states from L3.

────────────────────────────────────

## L6 — Runtime Experience Layer

Purpose
Render and interact with assembled outputs.

Ownership
Runtime UI behavior, user interaction, rendering, filters, navigation controls, visualization mechanics.

Allowed Inputs
- L5 presentation payloads

Allowed Outputs
- rendered views
- interactive navigation states
- user-visible panels
- charts
- cards
- drilldowns
- runtime interaction states

Must Never
- compute canonical signals
- redefine semantics
- absorb derivation logic
- become the place where architecture is decided
- silently fill missing upstream outputs with implied logic

Placement Rule
ExecLens belongs here as a runtime consumer layer.

ExecLens is NOT the owner of:
- signal derivation
- semantic truth
- architectural contracts

────────────────────────────────────

## L7 — Demo / Narrative Packaging Layer

Purpose
Package the system for guided demonstrations, investor sequencing, and curated walkthroughs.

Ownership
Sequencing, cueing, framing order, reveal choreography, scenario packaging.

Allowed Inputs
- L5 assembled payloads
- L6 runtime surfaces
- governed references to evidence-backed outputs

Allowed Outputs
- demo sequences
- guided flows
- curated spotlight order
- killer-shot packaging
- investor-facing walkthrough structures

Must Never
- mutate canonical logic
- invent signals for dramatic effect
- backfill missing architecture with storytelling
- masquerade demo shorthand as canonical layer ownership

Placement Rule
Demo sequencing, killer shots, and investor narrative packaging belong here.

These are downstream packaging constructs, not canonical computational layers.

────────────────────────────────────

## L8 — Governance, Contract, and Validation Layer

Purpose
Constrain, validate, document, and audit the system.

Ownership
Contracts, validation logs, architecture governance, stream controls, compliance assertions, restoration artifacts.

Allowed Inputs
- outputs and artifacts from all governed layers
- architectural rules
- validation results
- stream mandates

Allowed Outputs
- contracts
- validation logs
- governance artifacts
- architectural references
- drift findings
- compliance statements

Must Never
- serve as the hidden owner of runtime logic
- replace missing system architecture
- become a proxy derivation engine
- silently redefine layer ownership inside contract prose

Placement Rule
docs/pios/contracts belongs here.

Validation logs belong here as governance/validation artifacts, even where they reference evidence or run outputs stored elsewhere.

────────────────────────────────────

## 5. Cross-Layer Control Rules

### 5.1 Allowed Forward Flow

Canonical forward flow is:

L0 → L1 → L2 → L3 → L4 → L5 → L6 → L7

L8 governs and validates all layers but is not a runtime business-logic hop.

### 5.2 Allowed Supporting Bindings

The following are allowed where provenance must be preserved:
- L3 may bind back to L1/L2 evidence references
- L4 may preserve direct evidence anchors from L1/L2 alongside L3 meaning
- L5 may assemble deep links from L2 and semantic/derived outputs from L3/L4
- L7 may package outputs from L5/L6 without changing them
- L8 may validate artifacts from any layer

### 5.3 Forbidden Flows

The following are forbidden:
- L6 → L3 derivation by UI convenience
- L7 → L3 invention of signals for demo effect
- L8 → architecture ownership by contract drift
- L2 → L4 direct interpretation where governed derivation is required
- L4 → L3 mutation of computed truth
- L6 → L4 semantic rewriting during runtime
- any downstream layer bypassing evidence lineage

### 5.4 Invariants

The system invariants are:
- no evidence → no output
- no derived claim without derivation lineage
- no semantic claim without evidence binding
- no UI convenience logic replacing governed computation
- no contract prose redefining architecture
- no demo packaging masquerading as canonical system behavior

────────────────────────────────────

## 6. Artifact Placement Rules

### 6.1 Contracts

Canonical placement
docs/pios/contracts/

Layer classification
L8

Rule
Contracts are governance control surfaces.
They may instruct, constrain, and validate.
They are not the canonical source of architectural truth.

### 6.2 Validation Logs

Canonical placement
Governance / validation documentation or controlled validation directories

Layer classification
L8

Rule
Validation results must have durable structured memory.
They must not remain only inside transient stream discussion.

### 6.3 Evidence Artifacts

Canonical placement
Evidence stores, run evidence directories, source-linked evidence artifacts

Layer classification
L0–L3 depending on artifact type

Rule
Evidence itself is not a governance artifact unless wrapped for audit or validation.

### 6.4 Demo Constructs

Canonical placement
Demo-specific documentation and assets

Layer classification
L7

Rule
Demo constructs must never be mistaken for canonical computational architecture.

### 6.5 Investor Materials

Canonical placement
Commercial / investor / demo packaging areas

Layer classification
Primarily L7, optionally governed by L8

Rule
Investor materials are downstream packaging artifacts, not architectural authorities.

### 6.6 Architecture Artifacts

Canonical placement
docs/architecture/

Layer classification
L8

Rule
This artifact belongs there and overrides shorthand drift from other streams.

────────────────────────────────────

## 7. Classification of Current Constructs

### SSZ / SSI
Classification
Canonical if formally defined as evidence-bound derived signal constructs; otherwise provisional shorthand

Canonical Layer
L3

Not Allowed In
- L6 as native runtime logic
- L7 as invented demo logic
- L8 as architecture-by-contract shortcut

### Executive Interpretation
Classification
Non-canonical as a free-standing autonomous layer in the current model

Permitted Form
- controlled semantic shaping in L4
- curated narrative packaging in L7

Reason
Unrestricted interpretation risks violating Evidence First and introducing speculative meaning.

### Demo Sequencing
Classification
Demo-only

Canonical Layer
L7

### Topology Highlighting
Classification
Canonical presentation construct if based on L3-derived structural states; mis-layered if used as hidden logic

Canonical Layer
- L5 for assembly
- L6 for rendering

### Evidence Deep Links
Classification
Canonical presentation/navigation construct

Canonical Layer
L5 assembled from L2 evidence navigation references

### Killer Shots
Classification
Demo-only

Canonical Layer
L7

────────────────────────────────────

## 8. Drift Identification

### 8.1 Shorthand Became Architecture
Terms such as SSZ / SSI and other signal-like references began circulating without a restored canonical layer anchor.

Why this happened
Execution moved faster than architectural restoration.
Shorthand substituted for formal governance.

### 8.2 UI Absorption Drift
ExecLens began to risk absorbing responsibilities that belong upstream, especially around signal ownership and semantic authority.

Why this happened
Runtime surfaces are visible and therefore tempting as containers for unresolved upstream logic.

### 8.3 Contract Overload Drift
Contracts began to function as de facto architecture carriers.

Why this happened
Missing single-source architectural restoration caused contract prose to carry governance, logic boundaries, and operational assumptions at once.

### 8.4 Validation Memory Drift
Validation outcomes were produced but not always parked in durable, structured governance memory.

Why this happened
Stream execution emphasized immediate validation over canonical archival placement.

### 8.5 Demo Bleed
Demo constructs and guided reveal logic risked leaking into product and runtime assumptions.

Why this happened
Successful demonstration alignment made packaging constructs feel system-native.

────────────────────────────────────

## 9. Correction Statement

### 9.1 What Remains Valid
The following remain valid:
- Evidence First as governing doctrine
- ENL as canonical evidence navigation layer
- derivation as a governed upstream responsibility
- semantic shaping as distinct from derivation
- ExecLens as downstream runtime consumer
- demo packaging as a separate concern
- contracts as governance artifacts

### 9.2 What Is Provisional
The following are provisional until explicitly formalized in derivation specifications:
- SSZ / SSI naming and exact computational definitions
- shorthand signal vocabulary not yet anchored to formal derivation rules
- “executive interpretation” wording where it implies a new autonomous layer

### 9.3 What Must Be Relocated or Removed
The following must be corrected:
- signal derivation logic must not live in UI/runtime assumptions
- topology logic must not be introduced as a visual trick without upstream derivation grounding
- demo sequencing must not be treated as product architecture
- contracts must not define layer ownership beyond referencing this artifact
- validation outcomes must be durably parked under governed validation memory

────────────────────────────────────

## 10. Governance Lock

This artifact is hereby declared the authoritative reference for the canonical Program Intelligence layer model.

Effective immediately:
- all future streams must align to this model
- no contract may redefine layer ownership
- no runtime surface may absorb upstream computation by convenience
- no demo construct may be promoted to canonical architecture without formal governance revision
- any ambiguity must be resolved against this artifact

Where later streams conflict with this artifact, this artifact governs unless explicitly superseded by a formal governance restoration of equal or higher authority placed under docs/architecture/.

────────────────────────────────────

## 11. Final Lock Statement

The Program Intelligence system is governed by a layered architecture in which:
- evidence is sourced first
- evidence is normalized second
- evidence is navigated third
- signals are derived fourth
- meaning is shaped fifth
- presentation is assembled sixth
- runtime is rendered seventh
- demo narrative is packaged downstream
- governance, contracts, and validation constrain the whole system without becoming its hidden logic engine

This restoration closes the current ambiguity and re-establishes the architectural baseline for Streams 40.x, 41.x, 42.x, 51, 30.x, and future Program Intelligence evolution.
