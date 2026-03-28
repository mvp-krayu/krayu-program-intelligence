# PiOS Technical Appendix

Program: Krayu — Program Intelligence Discipline
Stream: C.1 — Canonical Narrative & Technical Pair
Authority: [[canonical-layer-model]]
Date: 2026-03-28

> All architectural claims in this document are sourced from [[canonical-layer-model]] (Stream 00.2) and [[pios_architecture_whitepaper]]. No claim is inferred or interpolated. Where an anchor is not present in canonical sources, no claim is made.

---

## 1. Canonical Reference

The root authority for all layer definitions, placement rules, cross-layer control rules, and enforcement invariants in this document is:

**[[canonical-layer-model]]** — Stream 00.2, Canonical Layer Model Restoration

All layers in this appendix derive from that document. No layer definition, layer boundary, or placement rule stated here has been reinterpreted, extended, or derived from any source other than [[canonical-layer-model]] and, where noted, [[pios_architecture_whitepaper]].

The canonical layer model is governed under the Program Intelligence discipline held by Krayu. Its authority is established by the governance lock in [[canonical-layer-model]] Section 10:

> "This artifact is hereby declared the authoritative reference for the canonical Program Intelligence layer model. All future streams must align to this model. No contract may redefine layer ownership."

The governance status of the canonical layer model is CONFIRMED (PROVISIONAL implementation compliance). CONFIRMED means the model is fully defined, internally consistent, and in effect. PROVISIONAL means the implementation carries known, managed deviations that are under active remediation — not that the model itself is uncertain.

For the complete governance corpus index, see [[index]].

---

## 2. Layer Model (L0–L8)

Source: [[canonical-layer-model]] Section 3 (inventory) and Section 4 (definitions).

The canonical layer inventory, reproduced without reinterpretation:

```
L0 — Evidence Source Layer
L1 — Evidence Normalization Layer
L2 — Evidence Navigation Layer (ENL)
L3 — Derivation Layer
L4 — Semantic Shaping Layer
L5 — Presentation Assembly Layer
L6 — Runtime Experience Layer
L7 — Demo / Narrative Packaging Layer
L8 — Governance, Contract, and Validation Layer
```

This ordering is strict and authoritative per [[canonical-layer-model]] Section 3.

---

### L0 — Evidence Source Layer

**Purpose:** Own raw evidence origins.
**Ownership:** External systems and primary source repositories.
**Allowed outputs:** Raw evidence objects, immutable source references, timestamps, IDs, hashes, source metadata, extracts.
**Must Never:** compute signals, infer meaning, summarize for executives, shape runtime behavior, introduce synthetic narrative.

*PiOS runtime anchor:* External source systems (git, CI/CD, issue trackers, deployment platforms) feeding Stream 40.2.

---

### L1 — Evidence Normalization Layer

**Purpose:** Convert heterogeneous evidence into controlled, machine-usable structural form without changing truth claims.
**Ownership:** Ingestion, parsing, schema mapping, evidence preparation.
**Allowed inputs:** L0 raw evidence.
**Allowed outputs:** Normalized records, canonical field mappings, typed entities, provenance-preserving structured evidence objects.
**Must Never:** derive executive signals, interpret business intent, rank business meaning, produce narrative conclusions, hide provenance.

*PiOS runtime anchor:* Streams 40.1–40.2, evidence acquisition and normalization.

---

### L2 — Evidence Navigation Layer (ENL)

**Purpose:** Provide evidence-addressable navigation and retrieval structure across normalized evidence.
**Ownership:** Traversal, evidence pathing, evidence adjacency, governed retrieval structure.
**Allowed inputs:** L1 normalized evidence.
**Allowed outputs:** Evidence navigation structures, evidence paths, retrieval references, contextual evidence adjacency, governed evidence selection surfaces.
**Must Never:** introduce interpretation, create business conclusions, emit executive insight, behave as a scoring layer, invent semantic claims beyond evidence navigation.

**Canonical note (reproduced from [[canonical-layer-model]]):** ENL is canonical. ENL is not a presentation layer. ENL is not an interpretation layer.

*PiOS runtime anchor:* ENL chain construction across 40.x/41.x streams.

---

### L3 — Derivation Layer

**Purpose:** Perform governed computation and signal derivation from evidence-bound inputs.
**Ownership:** All formally defined computation that transforms evidence-bound structures into measurable derived outputs.
**Allowed inputs:** L1 normalized evidence, L2 navigation outputs (where retrieval or adjacency is required), governed derivation rules.
**Allowed outputs:** Evidence-bound derived metrics, evidence-bound computed structures, signal primitives, topology states, formal derivation artifacts.
**Must Never:** produce freeform executive interpretation, generate investor storytelling, perform cosmetic UI packaging as logic substitution, obscure derivation lineage, claim certainty beyond evidence and rules.

**Placement rule (from [[canonical-layer-model]] Section 4 L3):** Signal derivation belongs here. This includes any construct equivalent to signal state zones, signal state indices, acceleration or stability computations, or topology-derived structural state markers.

*PiOS runtime anchor:* Stream 40.5 — Signal Computation Engine. 8 signals defined in run_01_blueedge; 5 admitted to canonical signal registry (SIG-001..SIG-005).

> **Drift note:** SSZ and SSI are currently implemented at L6. Their canonical home is L3. This is an open governance violation — see [[drift_register]] DRIFT-001 and Section 6 of this appendix.

---

### L4 — Semantic Shaping Layer

**Purpose:** Transform derived outputs into controlled semantic representations without altering evidence truth claims.
**Ownership:** Representation shaping, semantic framing, structured explanatory forms, controlled summarization of derived outputs.
**Allowed inputs:** L3 derived outputs, direct evidence anchors from L1/L2 (where binding preservation requires it).
**Allowed outputs:** Semantic representations, structured explanatory forms, controlled language mappings, executive-readable but evidence-bound meaning structures.
**Must Never:** alter derivation truth, fabricate evidence bindings, introduce speculative executive interpretation, overwrite upstream signal ownership, become a freeform narrative engine.

**Precision rule (from [[canonical-layer-model]] Section 4 L4):** This layer may transform representation and structure, but must never alter ENL truth claims, evidence bindings, or governed derivation results.

*PiOS runtime anchor:* Streams 41.1–41.5 — semantic elevation, PIE Vault, signal registry. run_01_blueedge: 89 structural components elevated to 17 domains + 42 capabilities.

---

### L5 — Presentation Assembly Layer

**Purpose:** Assemble evidence-bound semantic and derived outputs into presentation-ready payloads.
**Ownership:** View models, panel payloads, module assembly, ordered output bundles, deep-link wiring.
**Allowed inputs:** L2 evidence paths, L3 derived outputs, L4 semantic structures.
**Allowed outputs:** Presentation payloads, modules for dashboards or panels, evidence deep-link bundles, topology highlight payloads, traceable structured display objects.
**Must Never:** recompute signals ad hoc, reinterpret results because the UI wants a different story, introduce investor persuasion logic, create new business meaning without governed upstream support.

**Placement rule (from [[canonical-layer-model]] Section 4 L5):** Evidence deep links belong here as assembled presentation constructs backed by L2 references. Topology highlighting belongs here if it is a display treatment of already-derived structural states from L3.

*PiOS runtime anchor:* Streams 43.x (Signal-to-Structure Binding) and 44.x (Structural Overlay Projection).

---

### L6 — Runtime Experience Layer

**Purpose:** Render and interact with assembled outputs.
**Ownership:** Runtime UI behavior, user interaction, rendering, filters, navigation controls, visualization mechanics.
**Allowed inputs:** L5 presentation payloads.
**Allowed outputs:** Rendered views, interactive navigation states, user-visible panels, charts, cards, drilldowns, runtime interaction states.
**Must Never:** compute canonical signals, redefine semantics, absorb derivation logic, become the place where architecture is decided, silently fill missing upstream outputs with implied logic.

**Placement rule (from [[canonical-layer-model]] Section 4 L6):** ExecLens belongs here as a runtime consumer layer. ExecLens is not the owner of signal derivation, semantic truth, or architectural contracts.

*PiOS runtime anchor:* Streams 42.x — runtime intake (42.21), exposure validation (42.22), WOW chain (42.23).

---

### L7 — Demo / Narrative Packaging Layer

**Purpose:** Package the system for guided demonstrations, investor sequencing, and curated walkthroughs.
**Ownership:** Sequencing, cueing, framing order, reveal choreography, scenario packaging.
**Allowed inputs:** L5 assembled payloads, L6 runtime surfaces, governed references to evidence-backed outputs.
**Allowed outputs:** Demo sequences, guided flows, curated spotlight order, demonstration packaging, walkthrough structures.
**Must Never:** mutate canonical logic, invent signals for dramatic effect, backfill missing architecture with storytelling, masquerade demo shorthand as canonical layer ownership.

*PiOS runtime anchor:* Streams 51.x — ExecLens demo surface. 51.x is explicitly a consumer, not an architecture layer, per the handover boundary established in Stream 40.11.

---

### L8 — Governance, Contract, and Validation Layer

**Purpose:** Constrain, validate, document, and audit the system.
**Ownership:** Contracts, validation logs, architecture governance, stream controls, compliance assertions, restoration artifacts.
**Allowed inputs:** Outputs and artifacts from all governed layers, architectural rules, validation results, stream mandates.
**Allowed outputs:** Contracts, validation logs, governance artifacts, architectural references, drift findings, compliance statements.
**Must Never:** serve as the hidden owner of runtime logic, replace missing system architecture, become a proxy derivation engine, silently redefine layer ownership inside contract prose.

**Placement rule (from [[canonical-layer-model]] Section 6.6):** Architecture artifacts belong here. This canonical layer model and the documents in `docs/governance/architecture/canonical/` belong here.

*PiOS governance anchor:* [[governance_master_capsule]], [[canonical-layer-model]], docs/pios/contracts/, [[index]].

---

## 3. System Mapping

Source: [[pios_architecture_whitepaper]]

PiOS operates through a 9-stage pipeline that maps onto the L0–L8 canonical layers:

| Stage | Name | Layer | Stream |
|---|---|---|---|
| 1 | Evidence Acquisition | L0–L1 | 40.2 |
| 2 | Program Reconstruction | L1–L2 | 40.3 |
| 3 | Telemetry Extraction | L1–L2 | 40.4 |
| 4 | Signal Computation | L3 | 40.5 |
| 5 | Condition Activation | L3 | 40.6 |
| 6 | Diagnosis Activation | L3 | 40.6 |
| 7 | Intelligence Synthesis | L3–L4 | 40.7 |
| 8 | Agentic Orchestration | L4–L5 | 40.8 |
| 9 | Feedback | L8 | 40.9 |

The Three-Layer Analytical Model (from [[pios_architecture_whitepaper]] Section 2) groups these pipeline stages into three analytical zones:

| Analytical Layer | Stages | PiOS Streams |
|---|---|---|
| Observability Layer | 1–3 | 40.2–40.4 |
| Intelligence Layer | 4–6 | 40.5–40.6 |
| Executive Intelligence Layer | 7 | 40.7 |

Both models — the 9-Stage Pipeline and the Three-Layer Analytical Model — are CONFIRMED at HIGH confidence per reconstruction outputs archived at [[l1_l6_reassessment_report]].

---

## 4. Discipline → System → Product Mapping

Source: [[program_intelligence_stack]]

The full stack is ordered by the direction of constraint, not the direction of data flow. Data flows forward from L0 through L7. Constraints flow in the opposite direction, originating from the discipline and enforced through governance.

| Stack Element | Role | Constraint Source |
|---|---|---|
| Krayu | Discipline authority — holds Program Intelligence doctrine | [[governance_master_capsule]] |
| PiOS | System — operationalizes discipline through L0–L8 pipeline | [[canonical-layer-model]] |
| Signäl | Product line — surfaces PiOS intelligence under read-only contract | [[canonical-layer-model]] L6–L7 placement rules |
| Lens | Module — scoped presentation of Signäl capability | L0–L8 canonical layer model |

Signäl operates strictly under a read-only contract with PiOS outputs. It may not recompute, reinterpret, or supplement PiOS outputs. Where PiOS outputs are absent, Signäl surfaces the absence.

Lens is constructed from L5 presentation assemblies and exposed through L6 runtime surfaces. It does not constitute a layer and does not own layer responsibilities. It does not hold signal ownership or semantic authority.

For the full discipline articulation, see [[program_intelligence_stack]].

---

## 5. Governance Structure

Source: [[index]]

The governance corpus is organized into four zones. Authority runs from canonical to runtime; no lower zone overrides a higher zone.

| Zone | Location | Authority Level |
|---|---|---|
| Canonical Architecture | `docs/governance/architecture/canonical/` | Highest — defines all layer boundaries |
| Drift Register | `docs/governance/drift/` | Classifies and tracks boundary violations |
| Remediation Corpus | `docs/governance/remediation/` | Enforces corrections against canonical model |
| Runtime Governance | `docs/governance/` (master capsule, operating model) | Governing constraints GC-01..GC-11 |

The canonical architecture zone contains four Stream 00.2 artifacts:

| Document | Role |
|---|---|
| [[canonical-layer-model]] | Primary — L0-L8 complete definitions |
| [[canonical-layer-model.validation]] | Validation record — 11/11 sections pass |
| [[canonical-layer-model.classification]] | Construct classification — 10 constructs |
| [[canonical-layer-model.drift]] | Drift record — 6 drift items (D1-D6) |

The remediation corpus (seven artifacts, Streams 00.3 and 40.12–40.17) operationalizes corrections against the canonical model. It does not define the canonical model. See [[index]] for the complete corpus map.

---

## 6. Drift Case — DRIFT-001

Source: [[drift_register]], [[ssi-ssz-postmortem]]

**Explicit statement: drift is not architecture.**

Drift cases record instances where the implemented system deviated from the canonical layer model. They are governance records, not architectural definitions. A construct appearing in a drift case is classified as a boundary violation — not as a canonical architectural component.

| Field | Value |
|---|---|
| ID | DRIFT-001 |
| Name | SSI / SSZ Boundary Violation |
| Type | Layer Boundary Collapse (L3–L4–L6) |
| Status | Resolved (Governance Reinforced) |
| Register | [[drift_register]] |
| Post-Mortem | [[ssi-ssz-postmortem]] |

**Nature of violation:** SSZ (Structural Stress Zone) and SSI (Structural Stress Index) were implemented at L6 (ExecLens runtime) performing derivation computation that belongs at L3. The Runtime Experience Layer absorbed Derivation Layer ownership.

**Canonical position of SSZ/SSI:** L3 (Derivation Layer), per [[canonical-layer-model]] Section 4 L3 Placement Rule and Section 7 construct classification. Until formally specified at L3, SSZ and SSI are PROVISIONAL constructs. They must not appear in binding inputs, projection values, or canonical architecture references.

**Resolution state:** Governance reinforced. L3 derivation specification stream designated as Domain A (Stream 40.16) per [[remediation-planning-framework]]. Specification not yet executed — open violation remains managed and bounded.

**What this case demonstrates:** A surface-layer implementation of derivation logic, even when evidence-bound, constitutes a governed boundary violation. The evidence correctness of the approximation does not override the layer ownership violation. Correct evidence + wrong layer = boundary violation. See [[ssi-ssz-postmortem]] for the full incident record.

---

## 7. Enforcement Rules

Source: [[canonical-layer-model]] Sections 4 and 5; [[program_intelligence_stack]] Section 5.

These rules are reproduced from canonical sources without modification. They are not advisory.

**No derivation outside L3.**
All signal computation, structural state derivation, and transformation of evidence-bound inputs into measurable outputs must be specified, governed, and produced at L3. No other layer may own derivation. A layer that performs derivation work it does not own has committed a governed boundary violation. See [[canonical-layer-model]] Section 4 L3, [[derivation-boundary-audit]] findings F1 and F2.

**No semantic authority outside L4.**
Semantic shaping — the transformation of derived outputs into controlled representations — is the exclusive responsibility of L4. L6 may render semantic payloads assembled at L5. L6 may not produce semantic shaping decisions. A template renderer at L6 that makes language or framing decisions without upstream L4 governance is performing L4 work at the wrong layer. See [[canonical-layer-model]] Section 4 L4, [[canonical-layer-model.drift]] Drift D2.

**No recomputation in L6 or L7.**
L6 accepts L5 presentation payloads and renders them. L7 packages L5/L6 outputs for demonstration contexts. Neither layer may recompute signals, reinterpret derivation results, or introduce analytical logic to compensate for absent upstream outputs. Where upstream outputs are absent, the surface surfaces the absence. See [[canonical-layer-model]] Section 4 L6 and L7, [[canonical-layer-model]] Section 5.3 (forbidden flows).

**No UI-layer ownership of signals.**
ExecLens (L6) is a runtime consumer layer. It may render, navigate, and stage PiOS outputs. It may not originate canonical signals, define evidence truth, or make architectural decisions. Signal ownership belongs exclusively to L3. See [[canonical-layer-model]] Section 4 L6 Placement Rule, [[drift_register]] DRIFT-001.

**Contracts do not define architecture.**
L8 governance artifacts — contracts, validation logs, stream controls — constrain execution scope and validate stream boundaries. They do not define canonical architecture. For layer boundary questions, [[canonical-layer-model]] governs, not any contract artifact. See [[canonical-layer-model]] Section 4 L8, [[canonical-layer-model.drift]] Drift D3.

**No downstream compensation.**
Any consumer layer implementing local approximations or informal derivations to substitute for absent upstream outputs is performing compensation behavior. Compensation behavior is a governed violation regardless of the intent behind it. See [[program_intelligence_stack]] Section 5, [[ssi-ssz-postmortem]] Section 2.

---

## 8. Navigation Map (Obsidian)

Root entry point: [[pios_architecture_whitepaper]]

```
[[pios_architecture_whitepaper]]          ← Root navigation node
│
├── CANONICAL AUTHORITY
│   ├── [[canonical-layer-model]]          ← L0-L8 definitions (primary)
│   ├── [[canonical-layer-model.validation]]
│   ├── [[canonical-layer-model.classification]]
│   └── [[canonical-layer-model.drift]]
│
├── STACK ARTICULATION
│   └── [[program_intelligence_stack]]     ← Discipline → System → Product → Module
│
├── GOVERNANCE
│   ├── [[index]]                          ← Corpus index
│   ├── [[governance_master_capsule]]      ← GC-01..GC-11
│   └── [[governance_operating_model]]
│
├── DRIFT CORPUS
│   ├── [[drift_register]]                 ← DRIFT-001: SSZ/SSI
│   └── [[ssi-ssz-postmortem]]
│
├── REMEDIATION CORPUS
│   ├── [[canonical-model-closure-validation]]
│   ├── [[derivation-ownership-correction]]
│   ├── [[derivation-boundary-audit]]
│   ├── [[boundary-remediation-allocation]]
│   ├── [[remediation-planning-framework]]
│   ├── [[remediation-execution-domain-01]]
│   └── [[remediation-execution-domain-02]]
│
└── COMPANION DOCUMENTS
    ├── [[pios_investor_narrative]]         ← Discipline-first investor narrative
    └── [[pios_technical_appendix]]        ← This document
```

---

*Authority: [[canonical-layer-model]] (Stream 00.2) | Governance status: CONFIRMED (PROVISIONAL implementation compliance)*
