# Positioning Core — What Krayu Is

Stream: I.2 — Investor Layer Packaging
Authority: [[01_truth_boundary]], [[canonical/canonical-layer-model]], [[program_intelligence_stack]], [[pios_investor_narrative]]
Date: 2026-03-29

---

## 1. What Krayu Is

Krayu is the holder and author of the Program Intelligence discipline — a formal analytical discipline governing how execution evidence from software programs is transformed into traceable, governed intelligence.

Krayu is not a software tool vendor. Krayu is not a consulting firm. Krayu does not manufacture software in the conventional sense. Krayu develops, governs, and maintains the Program Intelligence discipline and the systems through which that discipline is operationalized. The discipline is the highest authority in the stack. Every system, product, and surface that Krayu builds derives its constraints from it.

*Source: program_intelligence_stack.md §1*

---

## 2. What Problem It Solves

The problem is not that software programs are hard to observe. Execution data is available. The problem is that systems built to transform that data into intelligence are structurally incapable of guaranteeing the integrity of their outputs.

The specific failure mode is this: when a system allows its rendering layer to derive its own signals because the upstream system did not provide them, or allows its interface to fill narrative gaps because the derivation layer was incomplete, the chain from evidence to output is broken. What reaches the surface is a mixture of what the program actually produced and what the surface decided to display in its place. These two things are not distinguishable to a viewer. They are not auditable to an engineer. Decisions made on the basis of those outputs inherit that uncertainty without being aware of it.

This is not a problem of insufficient processing power or insufficient data. It is a problem of architectural discipline: the failure occurs when layer boundaries are advisory rather than enforced — when convenience at the surface is permitted to substitute for rigor upstream.

*Source: pios_investor_narrative.md §1*

**What Krayu solves:** The structural condition that makes this failure mode impossible — by enforcing the separation between evidence acquisition, derivation, semantic shaping, and presentation as a governed architectural constraint, not an engineering guideline.

---

## 3. Why It Is Different — Architecture-Based

The difference between Krayu's approach and alternatives is not a feature set. It is a structural property.

### 3.1 The discipline governs the product — not the reverse

In most software intelligence systems, the product layer determines what the system produces. Features drive implementation. If the presentation layer requires a signal and the upstream system has not provided one, the presentation layer produces a local approximation and renders it as though it were governed. This is the mechanism by which the chain from evidence to output breaks — not through negligence, but through ordinary product development pressure.

Krayu's architecture inverts this. Constraints flow from the discipline downward to the product. Signäl, the product layer, operates under a read-only contract with PiOS outputs. Signäl may not recompute signals, reshape semantic truth, or supplement PiOS outputs with its own analysis. When PiOS outputs are absent, Signäl surfaces that absence. It does not fill it. The product cannot absorb system responsibilities.

This constraint is enforced by the canonical layer model — a formally governed document that specifies the responsibility of each of the nine layers, what inputs each layer may accept, what outputs each layer may produce, and what each layer must never do. It is not aspirational. Boundary violations are classified, tracked, and remediated through a formal governance process.

*Source: program_intelligence_stack.md §5; pios_investor_narrative.md §3*

---

### 3.2 Derivation is formally owned

Every signal the system produces is derived at L3 — the Derivation Layer — under formally specified computation rules. No downstream layer may perform derivation work. No surface layer may compute a signal approximation because the interface requires it. No governance contract may substitute for formal derivation specification.

This is not a development preference. It is the structural guarantee that makes the system's outputs trustworthy. An output whose derivation is distributed across layers — part upstream, part runtime, part interface — is an output that cannot be fully audited, because its derivation is not fully governed.

The governance record contains a documented case (DRIFT-001) in which two signal constructs (SSZ/SSI) were computed at the runtime layer because the derivation layer had not yet formally specified them. The constructs were conceptually valid. Their placement was incorrect. The resolution required not a fix to the rendering layer but a governance restoration to the entire architecture — a formal canonical model, a derivation boundary audit, a violation disposition process, and a remediation chain. This incident is referenced not as a product failure but as the concrete demonstration of why derivation ownership is treated as a structural requirement.

*Source: pios_investor_narrative.md §6; canonical-layer-model.classification.md §2.1–2.2*

---

### 3.3 Evidence primacy is constitutive, not advisory

The system's core doctrine — evidence must precede every claim — is not a quality preference or a best practice. It is the condition without which Program Intelligence is not Program Intelligence. The system fails closed on evidence gaps. It does not estimate. It does not interpolate. It does not produce output where evidence is absent.

This constraint makes the system's outputs comparable across time, programs, and people. The same evidence, under the same governed rules, produces the same governed output. A system that fills evidence gaps with approximations produces outputs that appear similar but cannot be compared — because each output carries a different mix of governed derivation and surface-level inference, and that mix is not visible.

*Source: program_intelligence_stack.md §1; canonical-layer-model.md §2.1*

---

### 3.4 Demonstrated in a governed runtime surface

The claim that the architecture enforces its stated constraints is not only a documentation claim. The ExecLens demo surface provides a demonstrable instance:

- All orchestration state is produced by a single pure function (CONTROL). The UI renders only.
- The surface fails closed when initialization returns invalid state — it does not fall back to estimated or synthetic output.
- Three personas produce three distinct, pre-defined traversal sequences — no runtime inference determines the sequence.
- Entry surface presents only what is warranted by evidence selection: query zone, situation panel, persona panel. Extended intelligence panels are withheld until execution begins.
- Operator mode is a distinct, explicitly entered state — not a default or a fallback.

These are not product claims. They are observable behaviors of a governed runtime surface, evidenced by B.1 truth extraction against commit df3eaf6.

*Source: B.1 demo_truth_registry.md; docs/pios/51.CLOSE/validation_receipt.md*

---

## 4. The Stack

The system has four levels, each constrained by the level above it:

```
Krayu
  Holds the Program Intelligence discipline
  Defines what evidence-first analytical intelligence is
  Defines what constitutes a boundary violation
  Authority: governance_master_capsule (GC-01..GC-11)

PiOS — Program Intelligence Operating System
  Operationalizes the discipline as a governed computational pipeline
  Nine layers: L0 (evidence source) → L7 (demo packaging)
  L8 governs and validates all layers
  Owns derivation (L3), semantic shaping (L4), presentation assembly (L5)
  Does not present information. Produces governed intelligence artifacts.

Signäl — Program Intelligence Surface
  Product system. Surfaces PiOS intelligence.
  Read-only contract with PiOS outputs.
  Adds packaging, navigation, consumption context.
  Does not add intelligence.

Lens — Instantiated Capability
  Scoped module within Signäl.
  Exposes a defined subset of Program Intelligence for a specific context.
  Does not hold semantic authority.
  Does not perform derivation.
  Current instance: ExecLens (L6 runtime consumer)
```

*Source: program_intelligence_stack.md §6*

---

## 5. What This Enables

Three properties follow structurally from the architecture described above. These are not product goals — they are structural consequences of enforced layer separation.

**Consistency** — The same evidence, under the same governed rules, produces the same governed output across any surface, any module, any context. Consistency is a structural consequence of derivation happening exclusively at L3 and no surface layer recomputing or reinterpreting the outputs it consumes.

**Auditability** — Every output can be traced backward through the transformation chain to its evidence source. This trace is preserved by the governed pipeline — not added as retrospective documentation. Breaking a layer boundary breaks the trace.

**Non-fragile scaling** — Because surface layers consume governed outputs rather than embedding analytical logic, changes to derivation (L3), semantic shaping (L4), or presentation assembly (L5) propagate to the surface without requiring surface-level re-engineering. The product is not fragile to upstream changes because it does not embed upstream logic.

*Source: program_intelligence_stack.md §7; pios_investor_narrative.md §5*

---

*Positioning core produced: 2026-03-29 | Stream: I.2 | Architecture-based, not marketing-based | All claims bounded to canonical record*
