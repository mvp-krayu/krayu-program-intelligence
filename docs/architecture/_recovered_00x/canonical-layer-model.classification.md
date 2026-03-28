# Canonical Layer Model — Construct Classification

Stream: 00.2 — Canonical Layer Model Restoration
Artifact: canonical-layer-model.classification.md
Date: 2026-03-22
Status: PROVISIONAL

────────────────────────────────────

## 1. Classification Types

| Type | Meaning |
|---|---|
| canonical | Formally governed construct with correct layer placement |
| non-canonical | Formally named construct placed incorrectly or without layer anchor |
| demo-only | Legitimate construct scoped strictly to L7 demonstration packaging |
| mis-layered | Construct performing work at an incorrect layer |
| provisional | Construct not yet formally defined; current placement accepted with stated risk |

────────────────────────────────────

## 2. Construct Classifications

────────────────────────────────────

### 2.1 SSZ — Structural Stress Zone

Classification: PROVISIONAL (currently mis-layered)

Canonical layer: L3 (Derivation Layer)
Current location: L6 (Runtime Experience Layer — utils/ssz.js in ExecLens)

Definition basis:
SSZ is described as a topology-derived structural concentration marker. If formally specified, it is a derived structural state computed from evidence-bound topology inputs. This is derivation work and belongs at L3.

Current state:
SSZ is computed in the UI runtime (utils/ssz.js, computeSSZ function) using component count per capability as SSI. This is an L6 implementation of an L3 responsibility.

Classification rationale:
The concept is valid as a canonical construct. The placement is incorrect. This is not a demo construct. It is not to be removed — it is to be relocated and formally specified at L3, with L6 consuming the L3 output.

Required correction:
- Define SSZ/SSI formally at L3 with governed derivation rules and evidence inputs
- Expose SSZ as a governed output from the topology adapter or equivalent L3 artifact
- Remove derivation logic from L6 (utils/ssz.js) once L3 specification is complete
- L6 (ExecLens) consumes pre-computed SSZ from L5 presentation payloads

────────────────────────────────────

### 2.2 SSI — Structural Stress Index

Classification: PROVISIONAL (currently mis-layered)

Canonical layer: L3
Current location: L6 (same as SSZ — computed as component count within utils/ssz.js)

Classification rationale:
SSI is the numerical expression of SSZ. Same layer ownership and same correction requirement as SSZ.

Required correction:
Same as SSZ. SSI derivation belongs at L3. L6 renders only.

────────────────────────────────────

### 2.3 Executive Interpretation

Classification: PROVISIONAL (currently mis-layered for semantic shaping; template rendering correctly at L6)

Canonical layer: L4 (Semantic Shaping Layer) for shaping logic; L6 for rendering
Current location: L6 (components/ExecutiveInterpretationPanel.js — template rendering only)

Classification rationale:
The current implementation is a 4-section template renderer that populates fixed text from SSZ-derived fields. The rendering itself is correctly at L6. However, the semantic shaping logic (choice of language, framing decisions, relevance mapping) belongs at L4 and is currently absent. L6 is doing light semantic structuring that should be governed at L4.

Permitted in current form:
The template approach is evidence-bound and non-speculative. Its current L6 placement is acceptable as provisional practice provided:
- no new semantic claims are introduced at L6
- the template wording is treated as pending L4 formal governance

Required correction:
- Define L4 semantic shaping rules for executive-readable structural interpretation
- Govern allowed vocabulary and framing decisions at L4
- L6 renders the L4-governed semantic payload

────────────────────────────────────

### 2.4 Demo Sequencing

Classification: DEMO-ONLY

Canonical layer: L7

Current location: L7 (DemoController.js — DEMO_STEPS, S51_STEPS; pages/index.js — demoActive, demoStep, s51Active, s51Step)

Classification rationale:
Demo sequencing is correctly placed at L7. It packages L5/L6 outputs into guided reveal flows. It does not compute, derive, or interpret. No correction required.

────────────────────────────────────

### 2.5 Topology Highlighting

Classification: CANONICAL (presentation construct); PROVISIONAL (derivation basis)

Canonical layer: L5 (assembly), L6 (rendering)
Current location: L5/L6 (TopologyPanel.js, execlens_topology_adapter.py)

Classification rationale:
The highlight mechanism itself (applying highlighted flags to topology entities based on query match) is a valid L5 presentation assembly construct. The underlying query-to-entity mapping comes from the 42.7 adapter which sits at L3/L5 depending on whether it performs derivation or only projection. The presentation construct is canonical. The derivation basis for which entities are highlighted is provisionally accepted but requires formal L3 specification.

────────────────────────────────────

### 2.6 Evidence Deep Links

Classification: CANONICAL

Canonical layer: L5 (assembled from L2 references), L6 (rendered)

Current location: L5/L6 (utils/obsidian.js, TopologyPanel.js, TemplateRenderer.js — Obsidian vault links)

Classification rationale:
Evidence deep links are assembled from L2 evidence navigation paths (vault_path) and rendered as obsidian:// protocol links. This correctly represents L2 navigation references assembled into L5 presentation constructs and rendered at L6. No correction required.

────────────────────────────────────

### 2.7 Killer Shots (KS1–KS4)

Classification: DEMO-ONLY

Canonical layer: L7

Current location: L7 (docs/program-intelligence-demonstrations/killer-shots/)

Classification rationale:
Killer shots are presentation choreography artifacts. They package structure, navigation, SSZ, and executive interpretation reveals into a curated demo sequence. They do not define canonical logic. No correction required.

────────────────────────────────────

### 2.8 ENL (Evidence Navigation Layer)

Classification: CANONICAL

Canonical layer: L2

Current location: L2 (streams 40.x/41.x ENL chain construction; ENLRevealPanel.js renders at L6)

Classification rationale:
ENL is correctly named as L2 in the canonical model. The ENL chain adapter produces evidence navigation structures. The ENLRevealPanel renders ENL outputs at L6. Classification and layer placement are correct. No correction required.

────────────────────────────────────

### 2.9 Contracts (docs/pios/contracts/)

Classification: CANONICAL

Canonical layer: L8

Current location: L8 (docs/pios/contracts/)

Classification rationale:
Contracts constrain execution scope, validate stream boundaries, and confirm compliance. They do not define canonical architecture. Placement and classification are correct.

────────────────────────────────────

### 2.10 PiOS Scripts (scripts/pios/)

Classification: CANONICAL

Canonical layer: L1–L3 depending on script type (ingestion = L1, ENL = L2, derivation = L3, adapters = L3/L5)

Classification rationale:
PiOS scripts are execution layer artifacts. They perform governed computation and adaptation. Classification is correct.

────────────────────────────────────

## 3. Classification Summary

| Construct | Classification | Canonical Layer | Current Layer | Correction Required |
|---|---|---|---|---|
| SSZ / Structural Stress Zone | provisional / mis-layered | L3 | L6 | YES — formalize at L3 |
| SSI / Structural Stress Index | provisional / mis-layered | L3 | L6 | YES — formalize at L3 |
| Executive Interpretation | provisional / mis-layered | L4 (shaping), L6 (render) | L6 only | PARTIAL — L4 governance required |
| Demo Sequencing | demo-only | L7 | L7 | NONE |
| Topology Highlighting | canonical (render); provisional (derivation) | L3/L5/L6 | L5/L6 | PARTIAL — L3 spec required |
| Evidence Deep Links | canonical | L5/L6 | L5/L6 | NONE |
| Killer Shots | demo-only | L7 | L7 | NONE |
| ENL | canonical | L2 | L2 (chain), L6 (render) | NONE |
| Contracts | canonical | L8 | L8 | NONE |
| PiOS Scripts | canonical | L1–L3/L5 | L1–L3/L5 | NONE |

────────────────────────────────────

## 4. Confidence Summary

| Dimension | Confidence |
|---|---|
| Classification completeness | 92% |
| Classification certainty | 88% |
| Correction identification | 94% |

Overall classification confidence: 90%
Status: PROVISIONAL — SSZ, SSI, Executive Interpretation require upstream L3/L4 formal specification before classification can be upgraded to canonical.
