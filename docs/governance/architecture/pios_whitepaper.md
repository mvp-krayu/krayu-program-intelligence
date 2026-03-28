# PiOS — Program Intelligence Operating System
## Canonical Whitepaper Entrypoint

Program: Krayu — Program Intelligence Discipline
Stream: C.2 — Whitepaper Entrypoint & Navigation Layer
Authority: canonical-layer-model, program_intelligence_stack
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[pios_investor_narrative]]
→ [[program_intelligence_stack]]
→ [[pios_technical_appendix]]
→ [[index]]

---

## 1. Purpose of this Document

This document is the canonical entrypoint to the PiOS architecture. It does not restate the architecture — it orients the reader within it and defines the sequence in which the architecture should be understood.

The PiOS documentation corpus is composed of four distinct document types, each serving a different function and written for a different mode of engagement. The **investor narrative** establishes the problem and the discipline without requiring technical background; it is the appropriate starting point for understanding why PiOS exists and what it claims. The **program intelligence stack articulation** defines the structural hierarchy of the system — discipline, operating system, product surface, and module — with precision and without commercial framing; it is the appropriate starting point for understanding how the layers relate and what constraints govern each. The **technical appendix** grounds every claim in the canonical layer model and provides the full formal apparatus — layer definitions, pipeline stages, enforcement rules, governance structure, and navigation tree; it is the appropriate reference for architectural work. The **governance index** maps the full governance corpus — canonical architecture, drift register, remediation chain, and reconstruction evidence — and is the appropriate entrypoint for governance and compliance questions.

Reading these documents in the wrong order or jumping between them without orientation produces an incomplete picture. This document defines the correct paths.

---

## 2. The Reading Paths

### Path A — Executive / Investor

This path establishes the discipline and the structural argument for why governed program intelligence is architecturally distinct from reporting or estimation systems.

1. [PiOS Investor Narrative](./pios_investor_narrative.md)
2. [Program Intelligence Stack](./program_intelligence_stack.md) *(optional — deepens the structural picture)*

The investor narrative covers the problem, the discipline, the system, the product line, the structural advantage, and the origin of the architecture's rigor. It is self-contained. The stack articulation may be read afterward for readers who want a more precise account of how the layers constrain one another.

---

### Path B — Architect / Engineer

This path establishes the structural hierarchy and then grounds it in the full canonical technical specification.

1. [Program Intelligence Stack](./program_intelligence_stack.md)
2. [PiOS Technical Appendix](./pios_technical_appendix.md)

The stack articulation provides the discipline-first framing — Krayu as discipline holder, PiOS as execution engine, Signäl as governed surface, Lens as scoped module — and the boundary enforcement rules that make the hierarchy meaningful. The technical appendix provides the complete formal apparatus: L0–L8 definitions, pipeline stage mapping, enforcement rules, and the governance structure that audits the entire system.

---

### Path C — Full System Understanding

This path is appropriate for any reader who needs to hold the complete picture: the problem, the discipline, the structural hierarchy, and the technical specification.

1. [PiOS Investor Narrative](./pios_investor_narrative.md)
2. [Program Intelligence Stack](./program_intelligence_stack.md)
3. [PiOS Technical Appendix](./pios_technical_appendix.md)

Follow this sequence. Each document builds on the framing established by the one before it. The technical appendix is not accessible at full depth without the stack articulation as prior context, and the stack articulation is most legible when the discipline has already been framed by the narrative.

---

## 3. System Overview

PiOS — the Program Intelligence Operating System — is the governed computational pipeline through which raw execution evidence is transformed into traceable, evidence-bound intelligence about software programs. The transformation is not a single operation. It proceeds through a strict sequence: evidence is acquired from source systems, normalized into machine-usable form, made navigable through governed retrieval structures, derived into measurable signals under formal rules, shaped into controlled semantic representations, assembled into presentation-ready payloads, and rendered in the runtime experience. Each of these operations belongs to a distinct layer of the canonical model, and no layer may perform operations that belong to another.

The output of this pipeline is not a report or an estimate. It is governed intelligence — a set of claims about a program's execution state that are fully traceable to the evidence that produced them, derivable from the rules that computed them, and auditable at every stage of the transformation. Where evidence is absent, the system does not interpolate or approximate. It fails closed and surfaces the gap.

PiOS is the system that owns this pipeline. Signäl is the product surface that consumes PiOS outputs under a strict read-only contract. Signäl does not recompute signals, does not reinterpret semantic outputs, and does not supplement the intelligence PiOS produces with its own analysis. The boundary between PiOS and Signäl is the boundary between the intelligence system and the intelligence surface, and it is enforced by the same canonical layer model that governs PiOS internally.

---

## 4. Architectural Layers

The PiOS architecture is organized into a set of execution streams, each of which owns a bounded responsibility within the overall pipeline. These streams are grouped by their analytical function.

The **40.x streams** constitute the core computation layer of PiOS. They govern evidence acquisition and normalization (40.2–40.4), signal derivation and the evidence navigation layer that supports it (40.5), semantic shaping (40.6), and the presentation assembly and projection mechanisms through which governed outputs are prepared for consumption (40.7–40.9). All derivation happens within this band. No stream outside it may originate a signal or hold derivation authority.

The **41.x streams** govern the semantic and Program Intelligence Expression (PIE) layer — the structures through which derived outputs are given controlled meaning and assembled into intelligence payloads that downstream surfaces can consume without reinterpreting.

The **42.x streams** govern ExecLens, the current Lens implementation, which operates as a runtime consumer of PiOS outputs. ExecLens renders, navigates, and stages the intelligence PiOS produces. It does not own or modify that intelligence.

The **43.x and 44.x streams** govern the binding and projection governance mechanisms — the contracts, projections, and output contracts that define the interface between PiOS's production chain and the surfaces that consume it.

The technical appendix provides the complete layer-by-layer specification of these streams and their canonical placement within the L0–L8 model.

---

## 5. Discipline → Architecture → Product Bridge

The Krayu stack is structured around a strict hierarchy of authority. Program Intelligence is the discipline — the formal doctrine that defines what must be true about the transformation from evidence to intelligence, what separates governed analytical output from ungoverned approximation, and what constitutes a boundary violation. This discipline is held by Krayu and expressed through the governing constraints documented in the governance corpus.

PiOS is the operating system that translates this discipline into a governed computational system. It operationalizes the discipline's constraints as layer boundaries, derivation rules, semantic shaping governance, and a nine-stage pipeline that enforces the transformation sequence from source to intelligence artifact. PiOS does not make product decisions. It produces truth — evidence-bound, derivation-traced, semantically shaped, governed — and exposes that truth through a defined output chain.

Signäl is the product surface that consumes what PiOS produces. ExecLens is a scoped module within Signäl — a bounded presentation unit that exposes a defined subset of PiOS intelligence within a structured, navigable interface. Neither Signäl nor any Lens instance holds derivation authority, semantic authority, or governance authority over the outputs it renders.

Signäl operates strictly under a read-only contract with PiOS outputs. This is not a design preference — it is the structural condition that makes Signäl's outputs trustworthy. A product surface that introduces its own analytical logic, even plausible and well-intentioned logic, severs the evidence lineage that makes its outputs verifiable. The constraint is absolute.

---

## 6. Obsidian Navigation

This repository is structured to be opened as an Obsidian vault. Every document in the governance corpus is a navigable node. Links written in relative path form (`./file.md`) resolve correctly in both GitHub and Obsidian. Links written in Obsidian wiki-link form create graph edges within the vault, connecting documents according to their structural relationships rather than their directory positions.

The governance corpus has a deliberate topology. The canonical layer model is the root node of the architecture graph. The whitepaper, the stack articulation, the investor narrative, and the technical appendix are all downstream of it — they draw their definitions and constraints from the canonical model and link back to it as their authority source. The drift register and remediation corpus are lateral — they enforce the canonical model without modifying it. The reconstruction evidence is foundational — it is the record from which the current canonical model was restored.

This document serves as the surface-level entrypoint to that graph. Stream C.3 will formalize the Obsidian vault configuration and navigation model. Until then, use the relative links in this document and the navigation tables in the technical appendix to traverse the corpus.

---

## 7. How to Use This Whitepaper

Begin with the reading path that corresponds to your purpose. If you are assessing the system's claims from an investment or strategic perspective, follow Path A. If you are working within the architecture or extending it, follow Path B. If you need to hold the complete picture — discipline, structure, and technical specification — follow Path C.

Do not begin with the technical appendix. The appendix is a reference document, not a narrative. It reproduces canonical definitions, enforcement rules, and pipeline mappings with precision, but it assumes familiarity with the discipline and the structural hierarchy. A reader who encounters the appendix without first understanding what Program Intelligence is and how PiOS relates to Signäl will have the formal apparatus without the interpretive frame that makes it coherent.

Do not jump between documents at random. The architecture is layered and the documents that describe it are similarly ordered. Each document in the reading paths has been written with the assumption that the preceding documents have been read. This is not gatekeeping — it is the acknowledgment that the discipline's complexity is real, that the layer model's boundaries are precise, and that the concepts introduced in earlier documents are load-bearing in later ones.

When a specific architectural question arises — what a layer owns, what a stream is forbidden to do, where a particular construct is classified — consult the [PiOS Technical Appendix](./pios_technical_appendix.md) and the [Governance Index](../index.md). Both are structured for reference use.

---

*Authority: canonical-layer-model (Stream 00.2) | program_intelligence_stack | pios_technical_appendix | governance_index*
