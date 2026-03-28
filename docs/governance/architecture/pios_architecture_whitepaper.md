# PiOS Architecture Whitepaper

Program: Krayu — Program Intelligence Discipline
Authority: Stream 00.2 — Canonical Layer Model Restoration
Governance Status: CONFIRMED (PROVISIONAL implementation compliance)
Date: 2026-03-28

> This document is the authoritative entry point to the Krayu Program Intelligence architecture. It derives exclusively from post-A.3 canonical governance artifacts. It does not reconstruct or reinterpret. It presents what is governed.

---

## 1. Purpose

This whitepaper describes the layered architecture governing the Krayu Program Intelligence Operating System (PiOS). It serves as:

- the root navigation node of the architecture system in Obsidian
- the readable summary of the canonical layer model defined in [[canonical-layer-model]]
- the single document linking canonical truth, drift cases, remediation corpus, and reconstruction evidence

**What this document is not:**
- It is not an inference document. Every architectural claim here is sourced from [[canonical-layer-model]] (Stream 00.2).
- It is not an investor document. It is a discipline artifact written for program intelligence practitioners.
- It is not a reconstruction record. For reconstruction history, see [[pios_l1_l6_architecture_paper]].

---

## 2. System Overview

The Krayu Program Intelligence system is a deterministic, evidence-first analytical system that transforms raw execution evidence from software programs into governed, traceable program intelligence.

**Core doctrine:** Evidence First (GC-06 per [[governance_master_capsule]])
No value, signal, semantic claim, or visual output may be produced without traceable evidence lineage. The system fails closed on evidence gaps — it does not estimate, interpolate, or substitute.

**Operational name:** PiOS — Program Intelligence Operating System

**Execution model:** 9-Stage Pipeline (Stages 1–9 mapped to Streams 40.2–40.9).

**Analytical model:** Three-Layer Analytical Model — Observability Layer (Stages 1–3), Intelligence Layer (Stages 4–6), Executive Intelligence Layer (Stage 7).

**Layer model:** L0–L8 canonical, defined by [[canonical-layer-model]] (Stream 00.2). Verdict: CONFIRMED (PROVISIONAL governance status). See Section 3.

---

## 3. Layered Architecture (L0–L8)

The canonical layer model is defined in full at [[canonical-layer-model]]. The ordering is strict and authoritative. Definitions below reproduce canonical content without modification.

---

### L0 — Evidence Source Layer

**Purpose:** Own raw evidence origins.
**Ownership:** External systems and primary source repositories (git, CI/CD, issue trackers, deployment platforms, exports).
**Must Never:** compute signals, infer meaning, summarize, shape runtime behavior, introduce synthetic narrative.

---

### L1 — Evidence Normalization Layer

**Purpose:** Convert heterogeneous evidence into controlled, machine-usable structural form without changing truth claims.
**Ownership:** Ingestion, parsing, schema mapping, evidence preparation.
**Allowed Outputs:** Normalized records, canonical field mappings, typed entities, provenance-preserving structured evidence objects.
**Must Never:** derive executive signals, interpret business intent, rank business meaning, produce narrative conclusions, hide provenance.

**PiOS Runtime Map:** Streams 40.1–40.2 (evidence acquisition and normalization).

---

### L2 — Evidence Navigation Layer (ENL)

**Purpose:** Provide evidence-addressable navigation and retrieval structure across normalized evidence.
**Ownership:** Traversal, evidence pathing, evidence adjacency, governed retrieval structure.
**Allowed Outputs:** Evidence navigation structures, evidence paths, retrieval references, contextual evidence adjacency, governed evidence selection surfaces.
**Must Never:** introduce interpretation, create business conclusions, emit executive insight, behave as a scoring layer, invent semantic claims beyond evidence navigation.

**Canonical note:** ENL is not a presentation layer. ENL is not an interpretation layer.
**PiOS Runtime Map:** ENL chain construction across 40.x/41.x.

---

### L3 — Derivation Layer

**Purpose:** Perform governed computation and signal derivation from evidence-bound inputs.
**Ownership:** All formally defined computation that transforms evidence-bound structures into measurable derived outputs.
**Allowed Inputs:** L1 normalized evidence, L2 navigation outputs (where retrieval or adjacency is required), governed derivation rules.
**Allowed Outputs:** Evidence-bound derived metrics, signal primitives, topology states, formal derivation artifacts.
**Must Never:** produce freeform executive interpretation, generate investor storytelling, perform cosmetic UI packaging as logic substitution, obscure derivation lineage, claim certainty beyond evidence and rules.

**Placement Rule:** Signal derivation belongs at L3. All signal constructs, structural state markers, and derived metrics must be specified, governed, and produced here.
**PiOS Runtime Map:** Stream 40.5 — Signal Computation Engine (8 signals defined in run_01, 5 admitted: SIG-001..005).

> **SSZ/SSI Note:** SSZ and SSI are mis-layered constructs currently implemented at L6. Their canonical home is L3. They are provisional signal candidates, not canonical architecture. See Section 7 and [[drift_register]] DRIFT-001.

---

### L4 — Semantic Shaping Layer

**Purpose:** Transform derived outputs into controlled semantic representations without altering evidence truth claims.
**Ownership:** Representation shaping, semantic framing, structured explanatory forms, controlled summarization of derived outputs.
**Allowed Inputs:** L3 derived outputs, direct evidence anchors from L1/L2 (where binding preservation requires it).
**Allowed Outputs:** Semantic representations, structured explanatory forms, controlled language mappings, executive-readable but evidence-bound meaning structures.
**Must Never:** alter derivation truth, fabricate evidence bindings, introduce speculative executive interpretation, overwrite upstream signal ownership, become a freeform narrative engine.

**Precision Rule:** This layer transforms representation and structure. It must never alter ENL truth claims, evidence bindings, or governed derivation results.
**PiOS Runtime Map:** Streams 41.1–41.5 (semantic elevation: 89 components → 17 domains + 42 capabilities in run_01_blueedge).

---

### L5 — Presentation Assembly Layer

**Purpose:** Assemble evidence-bound semantic and derived outputs into presentation-ready payloads.
**Ownership:** View models, panel payloads, module assembly, ordered output bundles, deep-link wiring.
**Allowed Inputs:** L2 evidence paths, L3 derived outputs, L4 semantic structures.
**Allowed Outputs:** Presentation payloads, modules for dashboards or panels, evidence deep-link bundles, topology highlight payloads, traceable structured display objects.
**Must Never:** recompute signals ad hoc, reinterpret results because the UI wants a different story, introduce investor persuasion logic, create new business meaning without governed upstream support.

**Placement Rule:** Evidence deep links belong here as assembled presentation constructs backed by L2 references. Topology highlighting belongs here if it is a display treatment of already-derived structural states from L3.
**PiOS Runtime Map:** Streams 43.x (Signal-to-Structure Binding) and 44.x (Structural Overlay Projection).

---

### L6 — Runtime Experience Layer

**Purpose:** Render and interact with assembled outputs.
**Ownership:** Runtime UI behavior, user interaction, rendering, filters, navigation controls, visualization mechanics.
**Allowed Inputs:** L5 presentation payloads.
**Allowed Outputs:** Rendered views, interactive navigation states, user-visible panels, charts, cards, drilldowns, runtime interaction states.
**Must Never:** compute canonical signals, redefine semantics, absorb derivation logic, become the place where architecture is decided, silently fill missing upstream outputs with implied logic.

**Placement Rule:** ExecLens belongs here as a runtime consumer layer. ExecLens is not the owner of signal derivation, semantic truth, or architectural contracts.
**PiOS Runtime Map:** Streams 42.x (runtime intake, exposure validation, WOW chain).

---

### L7 — Demo / Narrative Packaging Layer

**Purpose:** Package the system for guided demonstrations, investor sequencing, and curated walkthroughs.
**Ownership:** Sequencing, cueing, framing order, reveal choreography, scenario packaging.
**Must Never:** mutate canonical logic, invent signals for dramatic effect, backfill missing architecture with storytelling, masquerade demo shorthand as canonical layer ownership.

**PiOS Runtime Map:** Streams 51.x (ExecLens demo surface). 51.x is a consumer, not an architecture layer.

---

### L8 — Governance, Contract, and Validation Layer

**Purpose:** Constrain, validate, document, and audit the system.
**Ownership:** Contracts, validation logs, architecture governance, stream controls, compliance assertions, restoration artifacts.
**Must Never:** serve as the hidden owner of runtime logic, replace missing system architecture, become a proxy derivation engine, silently redefine layer ownership inside contract prose.

**Placement Rule:** docs/pios/contracts/ belongs here. The canonical layer model ([[canonical-layer-model]]) belongs here.

---

## 4. Cross-Layer Control Rules

Source: [[canonical-layer-model]] Section 5.

### Canonical Forward Flow

```
L0 → L1 → L2 → L3 → L4 → L5 → L6 → L7
```

L8 governs and validates all layers but is not a runtime business-logic hop.

### Allowed Supporting Bindings

- L3 may bind back to L1/L2 evidence references
- L4 may preserve direct evidence anchors from L1/L2 alongside L3 meaning
- L5 may assemble deep links from L2 and semantic/derived outputs from L3/L4
- L7 may package outputs from L5/L6 without changing them
- L8 may validate artifacts from any layer

### Forbidden Flows

- L6 → L3: derivation by UI convenience
- L7 → L3: invention of signals for demo effect
- L8 → architecture ownership by contract drift
- L2 → L4: direct interpretation where governed derivation is required
- L4 → L3: mutation of computed truth
- L6 → L4: semantic rewriting during runtime
- Any downstream layer bypassing evidence lineage

### System Invariants

1. No evidence → no output
2. No derived claim without derivation lineage
3. No semantic claim without evidence binding
4. No UI convenience logic replacing governed computation
5. No contract prose redefining architecture
6. No demo packaging masquerading as canonical system behavior

---

## 5. Architectural Constraints

Source: [[canonical-layer-model]] Section 2; [[governance_master_capsule]].

| Principle | Statement |
|---|---|
| Evidence First (GC-06) | No layer may emit a truth claim unless traceable to evidence or a formally governed transformation of evidence-bound artifacts |
| Separation of Concerns | Each layer owns a distinct responsibility; no downstream layer absorbs upstream computation |
| No Silent Semantic Mutation | Truth claims, evidence bindings, provenance, and derivation lineage may not be altered without governed rules |
| Contracts Are Control Surfaces | Contracts constrain execution and validate behavior; they do not define canonical architecture |
| UI Is a Consumer | Runtime surfaces may render, navigate, and stage outputs; they may not originate canonical signals, evidence truth, or semantic ownership |
| State-Diagnosis Separation (GC-07) | Conditions (observable state) must be analytically separated from Diagnosis (systemic dynamics) |

---

## 6. Governance Structure

### Canonical Architecture (Highest Authority)

`docs/governance/architecture/canonical/`

| Document | Role |
|---|---|
| [[canonical-layer-model]] | PRIMARY — L0-L8 complete definitions, governing principles, cross-layer rules, governance lock |
| [[canonical-layer-model.validation]] | Validation record — 11/11 sections pass; governance status PROVISIONAL |
| [[canonical-layer-model.classification]] | Construct classification — 10 constructs classified against L0-L8 |
| [[canonical-layer-model.drift]] | Drift record — 6 drift items (D1-D6), corrective positioning for each |

**Authority rule:** For any layer boundary question, [[canonical-layer-model]] governs. No contract, runtime behavior, or demo artifact may redefine layer ownership.

**Governance status: PROVISIONAL**
The model is defined, in effect, and internally consistent. PROVISIONAL means implementation has known deviations under managed remediation — not that the model is tentative or uncertain.

### Drift Corpus

`docs/governance/drift/`

| Document | Role |
|---|---|
| [[drift_register]] | DRIFT-001 register — SSI/SSZ Boundary Violation |
| [[ssi-ssz-postmortem]] | Full post-mortem — incident record, governance restoration, repair chain |

### Remediation Corpus

`docs/governance/remediation/`

| Document | Stream | Role |
|---|---|---|
| [[canonical-model-closure-validation]] | 00.3 | Closure validation of full governance record |
| [[derivation-ownership-correction]] | 40.12 | Derivation ownership restoration to L3 |
| [[derivation-boundary-audit]] | 40.13 | 8 audit findings classified (F1-F8) |
| [[boundary-remediation-allocation]] | 40.14 | Violation disposition + remediation allocation |
| [[remediation-planning-framework]] | 40.15 | Execution envelopes + sequencing constraints |
| [[remediation-execution-domain-01]] | 40.16 | Domain A — L3 derivation specification |
| [[remediation-execution-domain-02]] | 40.17 | Domain B — boundary enforcement |

**Important:** Remediation corpus artifacts apply and operationalize the canonical model. They do not define it.

### Runtime Governance

| Document | Role |
|---|---|
| [[governance_master_capsule]] | 11 governing constraints (GC-01..GC-11); program-wide authority |
| [[governance_operating_model]] | Operational governance model |
| [[index]] | Governance corpus index — links all layers of truth |

---

## 7. Drift Case — DRIFT-001: SSI/SSZ Boundary Violation

**ID:** DRIFT-001
**Type:** Layer Boundary Collapse (L3–L4–L6)
**Status:** Resolved (Governance Reinforced)
**Full record:** [[ssi-ssz-postmortem]]

**What happened:** SSZ (Structural Stress Zone) and SSI (Structural Stress Index) were implemented inside the ExecLens runtime (L6, `utils/ssz.js`), performing signal derivation that canonically belongs at L3. The Runtime Experience Layer absorbed Derivation Layer computation.

**Why it happened:** Stream 51 required minimal runtime closure. Speed of closure caused the boundary to be crossed. No canonical layer model existed at time of implementation.

**Canonical position of SSZ/SSI:**
- Canonical home: L3 (Derivation Layer), per [[canonical-layer-model]] Section 4 L3 Placement Rule and Section 7
- Current state: provisional, mis-layered (L6)
- Required correction: formal L3 derivation specification, then removal from L6
- SSZ/SSI are **not** canonical architecture constructs in their current form

**Open state:** L3 derivation specification stream not yet executed. Violation is managed, bounded, and under remediation via Domain A (Stream 40.16). Must not be extended, replicated, or treated as precedent.

---

## 8. Evidence and Reconstruction (Reference Only)

These artifacts are reconstruction evidence. They are not sources of architectural authority. For architecture authority, use [[canonical-layer-model]].

| Document | Role |
|---|---|
| [[pios_l1_l6_architecture_paper]] | A.1 architecture paper — full reverse crawl; stated verdict MODIFIED (superseded by A.2b) |
| [[recovered_00x_canonical_decision]] | A.2b — 6 formal decisions; Stream 00.2 found; verdict upgraded to CONFIRMED |
| [[l1_l6_reassessment_report]] | A.2b — full L1-L6 layer table with canonical definitions |
| [[post_execution_consolidation_report]] | A.2 — lifecycle, confidence, supersession, corpus extraction |
| [[reconstruction_validation_report]] | A.1 — 7 validation rules; 7 ambiguities (AMB-001 now closed) |

**Recovery evidence:** `docs/architecture/_recovered_00x/` — original 11 recovered governance files before canonical promotion. Retained as evidence. Do not use as governance reference.

**Note on A.1 paper:** pios_l1_l6_architecture_paper.md states verdict MODIFIED. Superseded by A.2b finding: CONFIRMED (PROVISIONAL). The paper remains a valid reconstruction record.

---

## 9. Obsidian Navigation Model

This document is the **root navigation node**. All paths into the architecture system originate here.

```
[[pios_architecture_whitepaper]]   ← ROOT (you are here)
│
├── CANONICAL ARCHITECTURE
│   ├── [[canonical-layer-model]]               (primary authority — L0-L8)
│   ├── [[canonical-layer-model.validation]]    (validation record)
│   ├── [[canonical-layer-model.classification]] (construct classification)
│   └── [[canonical-layer-model.drift]]         (drift record)
│
├── GOVERNANCE
│   ├── [[index]]                               (governance corpus index)
│   ├── [[governance_master_capsule]]           (GC-01..GC-11)
│   └── [[governance_operating_model]]          (operational model)
│
├── DRIFT CORPUS
│   ├── [[drift_register]]                      (DRIFT-001 register)
│   └── [[ssi-ssz-postmortem]]                  (SSI/SSZ incident record)
│
├── REMEDIATION CORPUS
│   ├── [[canonical-model-closure-validation]]  (00.3)
│   ├── [[derivation-ownership-correction]]     (40.12)
│   ├── [[derivation-boundary-audit]]           (40.13)
│   ├── [[boundary-remediation-allocation]]     (40.14)
│   ├── [[remediation-planning-framework]]      (40.15)
│   ├── [[remediation-execution-domain-01]]     (40.16)
│   └── [[remediation-execution-domain-02]]     (40.17)
│
└── RECONSTRUCTION EVIDENCE (reference only)
    ├── [[pios_l1_l6_architecture_paper]]       (A.1 — reconstruction record)
    ├── [[recovered_00x_canonical_decision]]    (A.2b — verdict change)
    ├── [[l1_l6_reassessment_report]]           (A.2b — layer table)
    └── [[post_execution_consolidation_report]] (A.2 — consolidation)
```

---

## 10. Entry Points

| Question | Entry Point |
|---|---|
| What does L3 own? | [[canonical-layer-model]] → Section 4 L3 |
| What is ENL? | [[canonical-layer-model]] → Section 4 L2 |
| What is ExecLens's architectural role? | [[canonical-layer-model]] → Section 4 L6, Section 7 |
| Where do contracts sit? | [[canonical-layer-model]] → Section 4 L8, Section 6.1 |
| What is SSZ/SSI's canonical status? | [[drift_register]] → DRIFT-001; [[ssi-ssz-postmortem]] |
| Why is L1-L6 CONFIRMED? | [[recovered_00x_canonical_decision]] → Decision 4 |
| What governance constraints apply? | [[governance_master_capsule]] |
| What is open for remediation? | [[derivation-boundary-audit]] → F1, F2, F6 |
| What was the reconstruction method? | [[pios_l1_l6_architecture_paper]] → Section 2 |
| Where is the full governance index? | [[index]] |

---

## 11. Governance Lock

[[canonical-layer-model]] Section 10 declares:

> "This artifact is hereby declared the authoritative reference for the canonical Program Intelligence layer model. All future streams must align to this model. No contract may redefine layer ownership. No runtime surface may absorb upstream computation by convenience. No demo construct may be promoted to canonical architecture without formal governance revision. Any ambiguity must be resolved against this artifact."

This whitepaper operates under and reflects that governance lock. It does not extend, override, or reinterpret it.
