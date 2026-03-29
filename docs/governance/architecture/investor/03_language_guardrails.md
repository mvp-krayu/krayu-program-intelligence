# Language Guardrails — Investor Communication

Stream: I.2 — Investor Layer Packaging
Authority: [[02_claim_matrix]], [[canonical/canonical-layer-model]], [[program_intelligence_stack]]
Date: 2026-03-29

---

## Purpose

This document governs how Krayu's system is described in investor-facing communication. It provides forbidden phrases, allowed alternatives, and rewriting examples. Every investor communication should be checked against this document before use.

The core rule: **describe what the architecture enforces, not what the product aspires to do.**

---

## Section 1: Forbidden Phrase Register

### Category A — Fabricated Capability

These phrases describe capabilities that do not exist in the canonical record.

| Forbidden phrase | Why forbidden |
|-----------------|--------------|
| "AI-driven" / "AI-powered" | No AI or ML is present in any canonical layer |
| "Intelligent analysis" | CONTROL is a pure deterministic function; no inference occurs |
| "Predictive" / "Predictive intelligence" | No prediction mechanism is specified or implemented |
| "Adaptive" / "Adapts to your needs" | Traversal sequences are static arrays; no dynamic adaptation |
| "Learns from your program" | No learning mechanism; governed derivation only |
| "Understands your code" | No semantic understanding; formal derivation rules only |
| "Real-time monitoring" | No real-time processing in canonical architecture |
| "Automated insights" | Derivation is governed computation, not autonomous generation |
| "Generates insights" | Outputs are derived from evidence under formal rules; nothing is generated |
| "Smart" / "Intelligent surface" | No intelligence at the surface layer; rendering only |

---

### Category B — Capability Inflation

These phrases overstate the current implementation state.

| Forbidden phrase | Why forbidden |
|-----------------|--------------|
| "Production-ready" / "Enterprise-ready" | Implementation status is PROVISIONAL; not evidenced as production-deployed |
| "SSZ/SSI signals" (presented as canonical) | Provisional and mis-layered per DRIFT-001; must not be presented as governed |
| "Executive interpretation" (presented as governed) | L4 formal specification is absent; currently provisional/mis-layered |
| "Full pipeline" / "End-to-end intelligence" | Full L0→L7 implementation PROVISIONAL; not presented as complete in governance record |
| "Integrates with any tool" | Not evidenced in canonical record |
| "Works at any scale" | Not evidenced |

---

### Category C — Conflation Language

These phrases collapse the distinction between the discipline, the system, and the surface — which the architecture explicitly prohibits.

| Forbidden phrase | Why forbidden |
|-----------------|--------------|
| "ExecLens is the intelligence system" | ExecLens is an L6 consumer; it renders intelligence it does not produce |
| "The UI shows you what the program means" | Meaning is shaped at L4; the UI renders governed outputs, not meaning |
| "The demo is the product" | The demo is L7 packaging; it is not canonical architecture |
| "The signal comes from the interface" | Signals belong at L3; the interface renders them |
| "The analysis happens as you navigate" | Derivation happens upstream at L3; navigation is L2/L6 |

---

## Section 2: Allowed Phrasing Patterns

### Describing the discipline

**Pattern:** Define Program Intelligence by what it requires, not by what it produces.

> "Program Intelligence is a formal analytical discipline. Its defining constraint is that evidence must precede every claim. No signal, no output, no visible display may be produced without a traceable lineage from a governed evidence source."

**Pattern:** Distinguish discipline from product.

> "The discipline exists independently of any interface. A surface that relaxes its evidence constraints or allows its rendering layer to fill gaps with invented logic is not a governed intelligence surface — it is something else."

---

### Describing the problem

**Pattern:** Frame the problem architecturally, not aspirationally.

> "The failure mode of program intelligence systems is not insufficient data. It is structural: when a rendering layer is permitted to derive, interpret, or compensate for missing upstream outputs, the chain from evidence to conclusion is broken. Outputs cannot be audited. Decisions inherit uncertainty that is invisible to the people making them."

---

### Describing the system (PiOS)

**Pattern:** Describe what each layer owns, not what the system "does."

> "PiOS is a nine-layer governed computational system. Evidence enters at L0 as raw source system state. It is normalized at L1 without interpretation. It is made navigable at L2. Derivation happens at L3 — and only at L3 — under formally specified computation rules. No layer downstream of L3 may perform derivation work."

**Pattern:** State the invariants.

> "The system enforces three structural guarantees: no signal may be derived outside the Derivation Layer; no surface may alter the semantic truth of what it renders; no governance contract may redefine layer ownership."

---

### Describing the product (Signäl / Lens)

**Pattern:** Describe surface products as consumers, not producers.

> "Signäl operates under a read-only contract with PiOS outputs. It surfaces intelligence that has already been produced under the full constraint of the discipline. It does not add derivation. It does not reshape semantic truth. Where PiOS outputs are absent, Signäl surfaces that absence — it does not fill it."

> "ExecLens is a Lens — a scoped module that exposes a defined subset of PiOS intelligence in a structured, guided form. It renders what PiOS produces. It does not produce it."

---

### Describing the demo

**Pattern:** Describe the demo as an L7 packaging of governed outputs, not as the system itself.

> "The ExecLens demo surfaces program intelligence outputs against a governed evidence set. Three personas — Executive, CTO, Analyst — each produce a distinct guided panel sequence. The demo is choreographed; the intelligence it displays is not."

**Pattern:** State what the demo does NOT do.

> "The demo does not generate content. Panels display evidence-bound outputs from the PiOS pipeline. The guided sequence determines the order in which those outputs are revealed — not what they contain."

---

### Describing the structural advantage

**Pattern:** State the advantage as a structural consequence, not a product claim.

> "Consistency is not a quality goal in this system — it is a structural consequence of enforced layer boundaries. The same evidence, under the same governed rules, produces the same governed output. This holds regardless of which surface, which module, or which presentation context is involved."

> "Auditability is not a documentation feature. The trace from surface output to evidence source is preserved by the governed transformation chain at every layer. Breaking a layer boundary breaks the trace. This is why boundary violations are treated as governance failures — not as engineering trade-offs."

---

## Section 3: Rewriting Examples

### Example 1 — Capability claim

**Forbidden:** "Krayu's AI-driven platform intelligently analyzes your program and surfaces predictive insights."

**Allowed:** "Krayu's Program Intelligence system applies formally governed derivation rules to execution evidence from your software program, producing traceable signals and structured intelligence about its execution state."

---

### Example 2 — System description

**Forbidden:** "ExecLens automatically generates adaptive intelligence as you navigate your program."

**Allowed:** "ExecLens is a governed runtime surface that presents PiOS intelligence outputs in a structured, guided form. It renders what the pipeline produces. Navigation is user-directed; derivation is upstream and governed."

---

### Example 3 — Problem statement

**Forbidden:** "Most tools don't understand programs deeply enough. Krayu is smarter."

**Allowed:** "Most program intelligence systems allow their presentation layer to fill gaps, compensate for missing derivation, or reframe outputs for narrative convenience. When this happens, the chain from evidence to conclusion is broken and outputs are unverifiable. Krayu's architecture enforces the separation that prevents this."

---

### Example 4 — Signal claim

**Forbidden:** "Our SSZ signals show you exactly where your program is structurally stressed."

**Allowed (if SSZ/SSI must be mentioned):** "SSZ (Structural Stress Zone) is a signal construct under architectural specification. Its canonical home is the Derivation Layer (L3). Current implementation is provisional while formal specification is completed."

**Preferred:** Do not reference SSZ/SSI in investor materials until formally governed at L3.

---

### Example 5 — Auditability

**Forbidden:** "Every insight is fully traceable and AI-verified."

**Allowed:** "Every output in the system is intended to be traceable through the governed transformation chain — from the surface, through presentation assembly, semantic shaping, and derivation, back to the governed evidence source. This is a structural property of the architecture, not a documentation exercise."

---

### Example 6 — Future state

**Forbidden:** "Our system will predict program failures before they happen."

**Allowed (if future state must be described):** "The roadmap for PiOS includes formal L3 specification of signal constructs currently under architectural remediation, and formal L4 specification of semantic shaping governance. These would enable governed executive interpretation and expanded signal coverage. This is a roadmap item, not a current capability."

---

## Section 4: Tone Rules

1. **Describe architecture, not aspiration.** What the system enforces is more credible than what it aspires to do.

2. **Lead with the problem's structure, not its pain.** "The failure mode is architectural" is more precise and harder to challenge than "it's frustrating not to know what your program is doing."

3. **Name the constraints.** Investors in technical domains respond to stated constraints. "The system fails closed on evidence gaps" is a stronger claim than "the system is reliable."

4. **Distinguish demo from system.** The demo surfaces governed intelligence. The discipline governs its production. Do not let the demo carry the full weight of architectural claims.

5. **Use PROVISIONAL honestly.** The architecture is CONFIRMED and in effect. Implementation is PROVISIONAL — meaning known deviations are under managed remediation. This distinction is evidence of operational discipline, not weakness.

---

*Language guardrails produced: 2026-03-29 | Stream: I.2 | Forbidden phrase register is exhaustive for current canonical record*
