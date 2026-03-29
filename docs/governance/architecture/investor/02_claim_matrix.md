# Claim Matrix — Classification of Investor-Facing Claims

Stream: I.2 — Investor Layer Packaging
Authority: [[01_truth_boundary]], [[canonical/canonical-layer-model]], [[program_intelligence_stack]]
Date: 2026-03-29

---

## Classification Key

| Classification | Meaning |
|----------------|---------|
| **DEMO-TRUE** | Directly observable in the ExecLens demo surface; evidenced by B.1 and 51.CLOSE |
| **ARCH-TRUE** | Stated in canonical governance artifacts; may require PROVISIONAL qualifier |
| **THESIS-ALLOWED** | A bounded thesis claim supported by architectural logic but not yet fully demonstrated end-to-end |
| **FORBIDDEN** | Not supported by evidence; inflates capability; must not appear in investor materials |

---

## Claim Matrix

### Category: System Identity

| Claim | Classification | Source | Allowed Wording |
|-------|---------------|--------|-----------------|
| Krayu is the holder of the Program Intelligence discipline | ARCH-TRUE | program_intelligence_stack.md §1 | "Krayu holds and governs the Program Intelligence discipline" |
| Program Intelligence is a formal analytical discipline, not a framework or toolset | ARCH-TRUE | program_intelligence_stack.md §1 | "Program Intelligence is a formal analytical discipline with defined constraints governing how evidence is acquired, processed, and transformed into governed intelligence" |
| PiOS is the system that operationalizes the discipline | ARCH-TRUE | program_intelligence_stack.md §2 | "PiOS is the computational system that operationalizes the Program Intelligence discipline" |
| Signäl is the product layer built on PiOS | ARCH-TRUE | program_intelligence_stack.md §3 | "Signäl is the product system that surfaces PiOS intelligence under a read-only contract with PiOS outputs" |
| Lens (ExecLens) is a scoped consumption module within Signäl | ARCH-TRUE + DEMO-TRUE | program_intelligence_stack.md §4; B.1 | "ExecLens is a Lens module — a bounded capability that exposes a defined subset of Program Intelligence for a specific consumption context" |
| Krayu is an "AI company" | FORBIDDEN | — | No equivalent. No AI/ML in system. |
| The system "intelligently analyzes" programs | FORBIDDEN | — | Use: "The system derives governed signals from evidence under formal rules" |

---

### Category: Architecture

| Claim | Classification | Source | Allowed Wording |
|-------|---------------|--------|-----------------|
| The system has a nine-layer canonical architecture (L0–L8) | ARCH-TRUE | canonical-layer-model.md §3 | "The system is governed by a nine-layer canonical architecture (L0–L8), each layer with defined responsibilities, allowed outputs, and explicitly forbidden behaviors" |
| Evidence flows forward from L0 to L7; governance constrains the whole system at L8 | ARCH-TRUE | canonical-layer-model.md §5.1 | "Evidence flows forward from source to surface. Governance constraints apply to every layer." |
| Derivation happens exclusively at L3 | ARCH-TRUE | canonical-layer-model.md §4 L3 | "All signal derivation is performed at the Derivation Layer (L3) under formal rules. No downstream layer may perform derivation work." |
| ExecLens is positioned at L6 — it is a runtime consumer, not an intelligence owner | ARCH-TRUE + DEMO-TRUE | canonical-layer-model.md §4 L6; B.1 T2.1 | "ExecLens is a runtime consumer layer. It renders governed intelligence produced upstream. It does not produce, derive, or reinterpret that intelligence." |
| The architecture enforces what it claims | ARCH-TRUE | pios_architecture_whitepaper.md §11 | "The architecture is documented, governed, and versioned. Deviations are classified, tracked, and remediated — not accepted as precedent." |
| SSZ/SSI are governed canonical signals | FORBIDDEN | canonical-layer-model.classification.md §2.1–2.2 | Do not present. If referenced: "SSZ/SSI are provisional signal constructs currently under architectural remediation." |
| Executive interpretation is formally governed | FORBIDDEN | canonical-layer-model.classification.md §2.3 | Do not present as current. If referenced: "Semantic shaping governance at L4 is in specification." |

---

### Category: Evidence-First Doctrine

| Claim | Classification | Source | Allowed Wording |
|-------|---------------|--------|-----------------|
| The system requires evidence before producing any output | ARCH-TRUE | canonical-layer-model.md §2.1; GC-06 | "No signal, no semantic assertion, no visible output may be produced without a traceable lineage from a governed evidence source. The system fails closed on evidence gaps." |
| The system does not estimate, interpolate, or substitute where evidence is absent | ARCH-TRUE | program_intelligence_stack.md §1 | "Where evidence is absent, the system fails closed. It does not estimate or substitute." |
| Evidence lineage is preserved through every transformation | THESIS-ALLOWED | pios_investor_narrative.md §5; canonical-layer-model.md §2.3 | "The architecture is designed to preserve evidence lineage through every layer transformation. Every output is intended to be traceable to its evidence source." |
| The system "never makes things up" | ARCH-TRUE (bounded) | canonical-layer-model.md §2.1; B.1 T7.1 | "The system fails closed on missing evidence. It produces no output where evidence is absent. It does not fabricate analytical content." |

---

### Category: Demo Surface (ExecLens)

| Claim | Classification | Source | Allowed Wording |
|-------|---------------|--------|-----------------|
| The demo surface operates under a single orchestration authority | DEMO-TRUE | B.1 T2.1; docs/pios/51.CLOSE/closure.md §4 | "All state transitions in the ExecLens demo are governed by a single pure function (CONTROL). The UI renders only — it does not make orchestration decisions." |
| Three personas produce three distinct guided traversal sequences | DEMO-TRUE | B.1 T3.1; Control.js:55–72 | "Three personas (Executive, CTO, Analyst) each produce a distinct guided panel sequence when demo execution begins." |
| Entry surface shows only relevant panels before execution begins | DEMO-TRUE | B.1 T1.3 | "At entry, only the query selector, situation panel, and persona panel are presented. Signals, evidence, and narrative panels appear only after guided execution begins." |
| The demo has three modes: Entry, Guided, and Operator | DEMO-TRUE | B.1 T6.1; MODES definition Control.js:108–113 | "The demo surface has three distinct states: Entry (pre-execution), Guided (active demo sequence), and Operator (free exploration after guided exit)." |
| The demo shows real governed intelligence | THESIS-ALLOWED | B.1 T3.2 note; program_intelligence_stack.md §3 | "The demo surfaces program intelligence outputs produced by the PiOS pipeline against a governed evidence set. Content comes from the API, not from synthetic or scripted text." |
| The demo proves the full pipeline is production-ready | FORBIDDEN | — | The demo demonstrates the L6/L7 surface and CONTROL governance. Pipeline implementation is PROVISIONAL. |

---

### Category: Product Capability

| Claim | Classification | Source | Allowed Wording |
|-------|---------------|--------|-----------------|
| The system provides traceable intelligence about software programs | ARCH-TRUE | pios_investor_narrative.md §7 | "The system is designed to produce intelligence about software programs that is traceable to governed evidence, derived by governed rules, and shaped by governed language." |
| The system provides consistency — same evidence produces same intelligence | THESIS-ALLOWED | program_intelligence_stack.md §7; pios_investor_narrative.md §5 | "Because derivation is governed by formal rules and no surface layer recomputes signals, the architecture is designed to produce consistent intelligence for the same evidence across contexts." |
| The system supports auditability — outputs can be traced to evidence | THESIS-ALLOWED | pios_investor_narrative.md §5 | "The layered architecture is designed to preserve a traceable chain from every surface output back to its evidence source. Auditability is a structural property of the governed pipeline." |
| The system scales non-fragility — upstream changes propagate cleanly | THESIS-ALLOWED | program_intelligence_stack.md §7 | "Because surface layers consume governed outputs rather than embedding analytical logic, changes to upstream derivation or semantics propagate to the surface without requiring surface-level re-engineering." |
| The system works in real-time | FORBIDDEN | — | No real-time processing specified in canonical artifacts. |
| The system integrates with any software tool | FORBIDDEN | — | Not evidenced in canonical record. |
| The system is production-ready for enterprise deployment | FORBIDDEN | — | Implementation status is PROVISIONAL. |
| The system uses AI/ML to analyze programs | FORBIDDEN | canonical-layer-model.md §2.1 | No equivalent. The system uses governed derivation rules, not ML inference. |

---

### Category: Differentiation

| Claim | Classification | Source | Allowed Wording |
|-------|---------------|--------|-----------------|
| The problem is architectural, not tooling | ARCH-TRUE | pios_investor_narrative.md §1 | "The failure mode of existing program intelligence systems is not insufficient data. It is architectural: systems that allow downstream layers to derive, reinterpret, or compensate for missing upstream outputs produce unverifiable outputs." |
| The difference is enforced layer separation, not a methodology | ARCH-TRUE | pios_investor_narrative.md §2 | "Program Intelligence is a discipline with enforced structural constraints — not a methodology. The separation of derivation, semantic shaping, and presentation is enforced by the architecture, not advisory." |
| Competitor systems conflate derivation and rendering | THESIS-ALLOWED | pios_investor_narrative.md §1 | "Systems that permit surface-layer derivation or gap-compensation cannot guarantee the trace from evidence to output. This is a structural property, not a quality issue." |
| Krayu's approach is uniquely architected | THESIS-ALLOWED | program_intelligence_stack.md §7 | "The combination of a formally governed derivation layer, evidence-first doctrine, and strictly enforced layer separation produces properties — consistency, auditability, non-fragile scaling — that are structural consequences, not design goals." |

---

### Category: Forbidden — No Allowed Equivalent

The following claims have no allowed equivalent and must not appear in investor materials under any phrasing:

| Forbidden Claim | Reason |
|----------------|---------|
| "AI-powered insights" | No AI/ML in system |
| "Intelligent analysis" | CONTROL is deterministic; no inference |
| "Predictive capabilities" | No prediction mechanism defined or implemented |
| "Adaptive to your workflow" | No adaptive behavior; sequences are static |
| "The system understands your program" | No semantic understanding; derivation is formal computation |
| "Real-time program monitoring" | Not specified in canonical record |
| "SSZ/SSI are production signals" | Provisional and mis-layered per governance record |
| "Executive interpretation is fully governed" | L4 semantic shaping not yet formally specified |
| "Full pipeline is production-ready" | Implementation PROVISIONAL per canonical record |
| "Enterprise-ready / at scale" | Not evidenced |
| "Automated insights" | No automation claim supported; derivation is governed, not autonomous |

---

*Claim matrix produced: 2026-03-29 | Stream: I.2 | Classifications bounded to 01_truth_boundary.md zones*
