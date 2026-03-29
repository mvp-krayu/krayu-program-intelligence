# Narrative Stack — Layered Investor Explanation

Stream: I.2 — Investor Layer Packaging
Authority: [[01_truth_boundary]], [[04_positioning_core]], [[canonical/canonical-layer-model]], [[program_intelligence_stack]], [[pios_investor_narrative]]
Date: 2026-03-29

---

## How to Use This Document

This document presents investor-facing explanation in four layers, ordered from the most concrete to the most forward-looking. Each layer is labelled and bounded. Claims marked [FUTURE] are explicitly not current capability — they describe what the architecture is designed to support, not what it currently delivers in full.

No layer supersedes the canonical truth boundary in [[01_truth_boundary]]. Every claim here is traceable to a canonical source.

---

## Layer 1: System Reality
*What the system demonstrably is, right now.*

### The Problem, Stated Precisely

Software programs generate enormous quantities of execution evidence. The difficulty is not access to that evidence. The difficulty is that the systems built to interpret it — to transform raw execution state into intelligence about what a program is doing, why it is behaving as it is, and what that implies — are structurally incapable of guaranteeing the integrity of their outputs.

The failure mode is specific. It occurs when a system allows its rendering layer to derive signals the upstream system did not produce, or allows its interface to fill interpretive gaps because the analytical pipeline was incomplete. When this happens, what appears on screen is not purely what the evidence supports. It is a mixture: part governed analysis, part surface-level inference, part narrative convenience. These contributions are not labelled. They are not distinguishable. Decisions made on this output inherit its uncertainty without being aware of it.

This is not a problem that better algorithms or more data resolves. It is an architectural problem. It is resolved by enforcing the separation between evidence, derivation, and presentation as a structural constraint — not a guideline.

### What Krayu Has Built

Krayu has built a formal analytical discipline — Program Intelligence — and the system that operationalizes it: PiOS, the Program Intelligence Operating System.

PiOS is a governed nine-layer computational pipeline. Evidence enters at L0 as raw source system state from external systems: version control, CI/CD, issue trackers, deployment platforms. It is normalized at L1 into machine-usable form without interpretation. It is made navigable at L2 through governed retrieval structures — the Evidence Navigation Layer. Derivation happens at L3, and only at L3, under formally specified computation rules that transform evidence-bound inputs into measurable signals and structural state. Semantic shaping happens at L4, transforming derived outputs into controlled representations without altering derivation truth. Presentation assembly happens at L5. The runtime experience layer at L6 renders what L5 assembles. L7 packages the runtime for demonstration and curated walkthroughs. L8 governs, validates, and audits the entire system.

Each layer has a defined responsibility it owns and a defined set of behaviors it must never perform. These prohibitions are enforced — not advisory. When a boundary violation occurs, it is classified, tracked, and remediated through a formal governance process.

### The Demonstration

The ExecLens surface demonstrates a governed runtime instance of this architecture. What is observable in the demo:

- All orchestration state is produced by a single pure function. The UI renders only — it makes no analytical decisions.
- The surface fails closed when initialization state is invalid. It does not fall back to estimated or fabricated state.
- Entry shows only what is warranted: query selector, situation panel, persona panel. Extended intelligence panels are withheld until execution begins.
- Three personas (Executive, CTO, Analyst) produce three distinct guided traversal sequences through the evidence. The sequences are governed — not improvised at runtime.
- Operator mode is a distinct, explicitly entered state. All five panels are accessible. Auto-start is blocked.
- Completion of a guided sequence returns the surface to a clean entry state. No downstream panels persist.

This is not a demonstration of all nine layers in full production operation. It is a demonstration of the governance principle: a runtime surface that renders governed intelligence without performing analytical work it does not own.

*Sources: B.1 demo_truth_registry.md; docs/pios/51.CLOSE/closure.md; program_intelligence_stack.md*

---

## Layer 2: Category Meaning
*What kind of system this is and why the category matters.*

### A Discipline, Not a Product

Most software intelligence offerings are products. They have feature sets, roadmaps, and pricing. The value proposition is: "we have built a capability you do not have."

Krayu operates differently. Program Intelligence is a discipline — a formal system of constraints governing how analytical intelligence about software is produced. Krayu holds this discipline. Krayu develops and governs the systems that operationalize it. The discipline is the highest authority in the stack. Products, surfaces, and modules derive their constraints from the discipline. Not the reverse.

The significance of this distinction: a discipline can be violated. A product cannot be violated — it can only be changed. When Krayu detects that a signal construct is computed at the wrong layer, it does not ship a workaround. It classifies the violation, governs the correction, and remediates it at the layer that owns the computation. The governance record contains a documented instance of exactly this process (DRIFT-001: SSI/SSZ Boundary Violation). The constructs were conceptually valid. Their placement was incorrect. Governance responded with a boundary audit, a violation disposition, and a formal remediation chain. The constructs remain provisional pending L3 formal specification.

This is not a process story for its own sake. It is the concrete demonstration of what a discipline-governed system does when it encounters the failure mode it was designed to prevent.

### Why the Category Is Contested

The space that Program Intelligence occupies — transforming execution evidence from software programs into structured intelligence — is occupied by a range of systems that make claims of similar form: observability platforms, engineering analytics tools, developer intelligence products. The difference between Program Intelligence and these alternatives is not in the claims they make. It is in what enforces those claims.

A system that derives executive signals in its rendering layer because the derivation layer has not been built is not an intelligence system with a technical gap. It is a reporting system with an evidence problem that is invisible at the surface. A system that generates narrative summaries through language model inference may produce readable outputs but cannot provide a governed trace from those outputs to their evidence sources. A system that measures activity rather than execution state produces data that is observable but not analytical — it tells you what happened but not what it means about the program's execution health.

Program Intelligence does not compete on feature parity with these systems. It competes on the structural property that they cannot achieve without rebuilding their architecture: an unbroken, governed chain from evidence source to analytical output.

*Sources: pios_investor_narrative.md §1–2; program_intelligence_stack.md §5*

---

## Layer 3: Product Boundary
*What Signäl and Lens are, bounded precisely.*

### What Signäl Is

Signäl is the product system that surfaces PiOS intelligence. It does not produce intelligence. It surfaces intelligence that PiOS has already produced under the full constraint of the discipline.

Signäl's contract with PiOS is read-only. It may package, navigate, and render what PiOS produces. It may not recompute signals because a presentation context requires a different value. It may not reshape semantic truth because an interface would benefit from a cleaner narrative. Where PiOS outputs are absent, Signäl surfaces that absence. It does not fill it.

This constraint is not a product limitation. It is the source of Signäl's trustworthiness. A product that produces its own interpretation of the evidence it is supposed to surface is not a governed intelligence product — it is an opinion system dressed as an analytical one. Signäl's integrity depends entirely on its fidelity to what PiOS produces.

### What Lens Is

A Lens is a bounded module within Signäl that exposes a defined subset of PiOS intelligence for a specific consumption context. ExecLens is the current Lens implementation. It is positioned at L6 in the canonical layer model — a runtime consumer layer. It renders, navigates, and stages outputs. It does not originate signals, hold semantic authority, or make architectural decisions.

The ExecLens demo surface provides a working instance of the Lens capability: a governed, structured walkthrough of program intelligence outputs organized by persona, with three personas (Executive, CTO, Analyst) each producing a distinct panel traversal sequence through signals, evidence, and narrative outputs.

### What the Product Is Not

- Signäl is not an analytics dashboard. It does not aggregate metrics, display KPIs, or produce trend charts. It surfaces governed intelligence artifacts produced by PiOS.
- ExecLens is not an AI assistant. It does not respond to prompts, generate summaries, or provide conversational analysis. It presents structured intelligence in a governed guided sequence.
- Neither Signäl nor ExecLens substitutes for PiOS's analytical pipeline. They consume it. If PiOS does not produce a signal, Signäl does not show one.

*Sources: program_intelligence_stack.md §3–4; B.1 T2.1–T2.3*

---

## Layer 4: Expansion
*[FUTURE] — What the architecture is designed to support. Not current capability. Explicitly marked.*

> **[FUTURE]** — Items in this layer describe the design intent of the canonical architecture and the logical trajectory of the system as currently governed. They are not current capabilities. They are not commitments. They are architectural implications of what has been formally defined.

---

### [FUTURE] Formal Signal Governance at L3

The canonical layer model formally specifies that all signal derivation belongs at L3 under governed computation rules. Two signal constructs currently under remediation (SSZ, SSI) are provisional and mis-layered — they are computed at L6 rather than L3. Formal L3 specification would bring these constructs into full canonical governance, making their derivation traceable, auditable, and portable across any surface that consumes PiOS outputs.

When L3 signal specification is complete, any downstream surface that consumes PiOS outputs — ExecLens, future Lenses, or external consumers — would receive governed SSZ/SSI as pipeline outputs rather than computing local approximations. The signal becomes portable without requiring surface-level re-engineering.

*[FUTURE — L3 derivation specification stream not yet executed. See canonical-layer-model.classification.md §2.1–2.2]*

---

### [FUTURE] Formal Semantic Shaping at L4

The canonical layer model formally specifies L4 as the Semantic Shaping Layer — the layer responsible for transforming derived outputs into controlled semantic representations without altering their derivation truth. Formal L4 specification would govern the vocabulary, framing decisions, and relevance mapping that currently appear provisionally in L6 template rendering (Executive Interpretation Panel).

When L4 semantic shaping is formally governed, the boundary between what the system derives (L3) and what it means in executive-readable form (L4) becomes a governed output chain — not an implementation detail embedded in a rendering component.

*[FUTURE — L4 governance required before executive interpretation can be presented as a governed analytical output. See canonical-layer-model.classification.md §2.3]*

---

### [FUTURE] Multi-Lens Architecture

The canonical model defines Lens as a type — a bounded module that exposes a defined subset of PiOS intelligence for a specific context. ExecLens is the current instance. The architecture supports multiple Lens instances, each scoped to a different consumption context (engineering, executive, operations, audit), each consuming the same PiOS outputs through the same governed intake chain.

Multiple Lenses do not require changes to PiOS to produce different views. They require different L5 presentation assemblies and L6 runtime surfaces. The intelligence beneath them is the same governed pipeline.

*[FUTURE — no additional Lens instances are documented in the current canonical record]*

---

### [FUTURE] Expanded Evidence Source Coverage

The canonical architecture specifies L0 as accommodating "raw source system state, source records, logs, exports, snapshots, linked records" from "external systems and primary source repositories." Expanding evidence source coverage — additional version control systems, CI/CD platforms, issue trackers, deployment platforms — would expand the evidence base from which L3 signals are derived without changing the pipeline architecture. Evidence normalization (L1) and evidence navigation (L2) are designed to handle heterogeneous evidence sources.

*[FUTURE — specific evidence source integrations not documented in current canonical record]*

---

*Narrative stack produced: 2026-03-29 | Stream: I.2 | Layer 4 items are explicitly marked [FUTURE] and are not current capability claims*
