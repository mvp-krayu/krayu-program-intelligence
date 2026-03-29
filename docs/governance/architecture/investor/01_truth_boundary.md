# Truth Boundary — What the System IS and IS NOT

Stream: I.2 — Investor Layer Packaging
Authority: [[canonical/canonical-layer-model]], [[program_intelligence_stack]], [[pios_investor_narrative]]
Extraction basis: B.1 demo truth registry + canonical architecture artifacts
Date: 2026-03-29

---

## Purpose

This document establishes the strict boundary between what Krayu's system demonstrably is, what is architecturally defined, and what is absent or not yet present. Every investor-facing claim must be classifiable against one of these three zones. Claims that cannot be placed in one of these zones must not be made.

---

## Zone 1: DEMONSTRATED

Things observable in the running ExecLens demo surface, directly evidenced by B.1 and the 51.x governed closure.

### What is demonstrated

**CONTROL-governed orchestration surface**
ExecLens operates as a pure projection adapter. All orchestration state transitions are routed through a single pure function (CONTROL). The runtime does not compute its own signals, does not hold semantic authority, and does not decide what evidence means. Every panel state, every mode transition, every demo step is produced by CONTROL and consumed read-only by the UI.
*Source: B.1 T2.1–T2.3, docs/pios/51.CLOSE/closure.md §4*

**Evidence-first activation model**
The demo surface requires a query (evidence selection) before guided execution can begin. Persona determines traversal sequence — not what the evidence is. Without a query, nothing runs.
*Source: B.1 T1.1–T1.2*

**Persona-scoped traversal sequences**
Three personas (EXECUTIVE, CTO, ANALYST) each produce a distinct, fixed panel traversal order when guided execution is started. EXECUTIVE: narrative → signals → evidence (3 steps). CTO: signals → evidence → narrative (3 steps). ANALYST: evidence → signals → narrative → raw/evidence (4 steps).
*Source: B.1 T3.1, Control.js:55–72*

**Progressive panel reveal**
Signals, evidence, and narrative panels are not rendered at the entry surface. They appear only when guided execution is active or operator mode is engaged. Entry renders query zone, situation panel, and persona panel only.
*Source: B.1 T1.3, T3.1*

**Fail-closed initialization**
If CONTROL initialization returns an invalid state, the runtime blocks entirely — it does not fall back to synthetic data or estimated state. The page renders "Initialization unavailable — canonical state missing." This guard is permanent.
*Source: B.1 T7.2, index.js:400–408*

**Operator mode as a distinct surface state**
Operator mode (FREE) is a clearly delineated state entered only via explicit exit action (Exit demo button or Cmd/Ctrl+K). It presents a visually distinct orange-tinted surface. All five panels are rendered and toggle-accessible. Auto-start is explicitly blocked in operator mode.
*Source: B.1 T6.1–T6.3*

**Max-2 panel rule**
In non-guided modes, no more than two panels can be open simultaneously. Enforced by CONTROL — not by the UI layer. Guided execution is step-driven; panel toggle is blocked during active demo.
*Source: B.1 T5.1, T3.4*

**Clean re-entry after completion**
After guided execution completes, the surface returns to an entry-equivalent state. Downstream panels (signals, evidence, narrative) are not shown in post-completion state. Selecting a new persona clears the completion lock.
*Source: B.1 T4.1–T4.2*

---

## Zone 2: ARCHITECTURAL

Things defined and governed in the canonical architecture but not yet fully demonstrated end-to-end in the current runtime surface.

### What is architecturally defined

**L0–L8 canonical layer model**
A nine-layer architecture is formally specified and in effect. Each layer has a defined responsibility, defined allowed inputs/outputs, and explicitly forbidden behaviors. The model is the authoritative reference; no contract, runtime surface, or demo artifact may redefine layer ownership.
*Source: canonical-layer-model.md §3–4, pios_architecture_whitepaper.md §3*
*Governance status: CONFIRMED (PROVISIONAL) — model is defined, in effect, internally consistent. PROVISIONAL means known implementation deviations are under managed remediation.*

**Evidence Navigation Layer (ENL) as canonical L2**
ENL is formally classified as canonical at L2. Its purpose is evidence-addressable navigation and retrieval structure across normalized evidence. ENL is not a presentation layer and not an interpretation layer.
*Source: canonical-layer-model.md §4 L2, canonical-layer-model.classification.md §2.8*

**Krayu / PiOS / Signäl / Lens hierarchy**
The system has a formally defined four-level hierarchy: Krayu (discipline authority) → PiOS (operationalizes the discipline) → Signäl (surfaces PiOS intelligence as a product) → Lens (scopes Signäl capability). Constraint flows opposite to data flow — no downstream element may absorb or redefine upstream responsibility.
*Source: program_intelligence_stack.md §6*

**Evidence-first doctrine (GC-06)**
No layer may emit a truth claim, value, signal, or visual output unless traceable to evidence or a formally governed transformation of evidence-bound artifacts. The system fails closed on evidence gaps — it does not estimate, interpolate, or substitute.
*Source: pios_architecture_whitepaper.md §2, program_intelligence_stack.md §1*

**Topology highlighting at L5/L6**
Topology highlighting is an architecturally classified construct: canonical as a presentation construct (L5 assembly, L6 rendering); provisional as to its derivation basis (requires formal L3 specification).
*Source: canonical-layer-model.classification.md §2.5*

**Evidence deep links at L5/L6**
Evidence deep links (assembled from L2 evidence navigation paths and rendered as navigable references) are classified as canonical at L5/L6.
*Source: canonical-layer-model.classification.md §2.6*

---

## Zone 3: NOT PRESENT

Things that are not demonstrated, not architecturally defined in current canonical governance, or explicitly classified as absent, provisional, or mis-layered.

### What is not present

**SSZ / SSI as canonical governed signals**
SSZ (Structural Stress Zone) and SSI (Structural Stress Index) are classified PROVISIONAL and MIS-LAYERED. They are currently computed at L6 (runtime UI layer) but canonically belong at L3 (Derivation Layer). They are not canonical architecture constructs in their current form. Do not present as governed signals.
*Source: canonical-layer-model.classification.md §2.1–2.2, pios_architecture_whitepaper.md §7*

**Executive interpretation as formally governed L4 output**
The current executive interpretation surface (ExecLens ExecutiveInterpretationPanel) is a template renderer at L6. Formal semantic shaping governance at L4 is absent. Current L6 placement is accepted provisionally; formal L4 specification is required before executive interpretation can be presented as a governed analytical output.
*Source: canonical-layer-model.classification.md §2.3*

**Full L0→L7 pipeline running end-to-end in a single shipped product**
The pipeline stages are defined and partially implemented across multiple streams. The full governed chain from evidence source (L0) to runtime surface (L6) is not presented as currently complete in the canonical record.
*Source: pios_architecture_whitepaper.md §2 "Execution model: 9-Stage Pipeline" — implementation noted as PROVISIONAL*

**Machine learning, AI inference, or predictive capability**
No layer of the canonical architecture includes ML inference, predictive modeling, or AI-generated output. CONTROL is a pure deterministic function. The system fails closed on evidence gaps — it does not estimate.
*Source: canonical-layer-model.md §2.1 "Evidence First"; B.1 T7.1*

**Real-time data processing**
No canonical artifact specifies real-time data ingestion, streaming evidence, or live program monitoring. Evidence acquisition operates on governed evidence exports and source system state.
*Source: canonical-layer-model.md §4 L0 — "Allowed Inputs: raw source system state, source records, logs, exports, snapshots"*

**Autonomous decision-making**
No layer of the system makes autonomous decisions. CONTROL is deterministic. All outputs are produced from governed evidence under formal rules. The system does not act on programs — it produces intelligence about them.
*Source: program_intelligence_stack.md §2; B.1 T7.1*

---

## Summary Grid

| Zone | Description | Investor Use |
|------|-------------|-------------|
| DEMONSTRATED | Observable in running ExecLens demo, B.1 evidenced | May be stated directly |
| ARCHITECTURAL | Defined in canonical governance, implementation PROVISIONAL | May be stated with architectural framing |
| NOT PRESENT | Absent, provisional, or mis-layered | Must not be stated as current capability |

---

*Truth boundary produced: 2026-03-29 | Stream: I.2 | Authority: canonical-layer-model.md, program_intelligence_stack.md, pios_investor_narrative.md, B.1 demo_truth_registry.md*
