# Program Intelligence Stack Articulation

Program: Krayu — Program Intelligence Discipline
Stream: B.1 — Stack Articulation (Discipline-First)
Authority: [[canonical-layer-model]], [[pios_architecture_whitepaper]]
Date: 2026-03-28

---

## 1. The Discipline — Program Intelligence (Krayu)

Program Intelligence is a formal analytical discipline concerned with the deterministic transformation of execution evidence into governed, traceable intelligence about software programs. It is not a methodology. It is not a framework in the practitioner sense. It is a doctrine with precisely defined constraints governing how evidence is acquired, normalized, navigated, derived, shaped, assembled, rendered, and governed.

The discipline rests on a single non-negotiable principle: evidence must precede every claim. No signal, no semantic assertion, no visible output may be produced without a traceable lineage from a governed evidence source. The system does not estimate what a program is doing. It does not interpolate missing data. It does not substitute narrative convenience for analytical rigor. Where evidence is absent, the system fails closed. This is not a design choice — it is the constitutive rule of the discipline itself, codified as GC-06 in [[governance_master_capsule]].

Alongside evidence primacy, the discipline enforces a strict separation of analytical concerns. State, signal, and meaning occupy distinct analytical zones and must not be collapsed into one another. Conditions — the observable state of a program derived from governed signals — are analytically distinct from diagnosis, which concerns systemic execution dynamics. Diagnosis is analytically distinct from intelligence, which is the governed assembly of evidence-bound meaning for executive-level interpretation. Each zone has defined inputs, defined outputs, and a set of behaviors it is categorically forbidden to perform. This separation is not an implementation preference; it is the structural guarantee that intelligence remains traceable and non-fabricated at every layer of the stack.

The discipline further holds that transformation of evidence into intelligence must be deterministic. Given the same governed inputs and the same governed rules, the system must produce the same governed outputs. Interpretive latitude is bounded by formal derivation rules. Semantic shaping is constrained to controlled language mappings. Narrative packaging is isolated to a designated layer that has no authority over the layers above it. The discipline cannot be softened at the product layer without violating its constitutive structure.

Krayu is the holder and author of this discipline. Krayu does not manufacture software in the conventional sense. Krayu develops, governs, and maintains the Program Intelligence discipline and the systems and surfaces through which that discipline is operationalized. The discipline exists independently of any product interface, demonstration surface, or commercial packaging. A version of Program Intelligence that relaxes its evidence constraints, permits interpretive invention, or allows downstream surfaces to absorb upstream analytical authority is not Program Intelligence — it is something else.

All systems and products within the Krayu program derive their constraints from this discipline. The discipline is the highest authority in the stack. Refer to [[governance_master_capsule]] for the governing constraints (GC-01 through GC-11) that encode this discipline in operational form.

---

## 2. The System — PiOS (Program Intelligence Operating System)

PiOS is the system that operationalizes the Program Intelligence discipline. Where the discipline defines what must be true about evidence, signals, derivation, and intelligence, PiOS defines how those truths are produced through a governed computational pipeline. PiOS is the execution engine of Program Intelligence.

The structural foundation of PiOS is the canonical layer model, defined in [[canonical-layer-model]] and navigable through [[pios_architecture_whitepaper]]. The canonical model specifies nine layers — L0 through L8 — each with a bounded responsibility, a defined set of allowed inputs and outputs, and a set of behaviors it must never perform. The ordering of these layers is strict. L0 owns raw evidence origins. L1 normalizes that evidence into machine-usable form. L2 provides governed evidence navigation and retrieval. L3 performs all formal derivation — signal computation, structural state derivation, and any transformation of evidence-bound inputs into measurable outputs. L4 shapes derived outputs into controlled semantic representations without altering their derivation truth. L5 assembles those semantic representations into presentation-ready payloads. L6 renders those payloads in the runtime experience. L7 packages the runtime experience into demonstration and narrative sequences. L8 governs, validates, and audits the entire system without becoming its hidden logic engine.

This layering is not organizational convenience. It is the structural guarantee of the discipline's evidence-first constraint. Each layer boundary defines exactly where one analytical responsibility ends and another begins. Derivation cannot happen in the rendering layer. Semantic authority cannot be claimed by the runtime. Governance contracts cannot redefine architecture. The canonical model enforces these prohibitions in writing, and remediation streams (documented in [[derivation-boundary-audit]] and [[remediation-planning-framework]]) exist precisely because boundary discipline is difficult to maintain across a fast-moving execution program.

PiOS operates through a 9-stage pipeline that maps to the L0–L8 canonical layers: evidence acquisition and normalization (L0–L1), evidence navigation (L2), signal derivation (L3), semantic shaping (L4), presentation assembly and projection (L5), and runtime consumption (L6). Each stage accepts only governed inputs from the preceding stage, produces only governed outputs for the succeeding stage, and may not reach backward across the pipeline to access earlier stages' artifacts directly. This constraint is enforced at the stream level — each PiOS stream has a defined input boundary and a defined output boundary, and crossing those boundaries is a governed violation, not an implementation preference.

PiOS is not a product. It does not have a user interface in any meaningful product sense. PiOS does not present information to an end user. PiOS does not make decisions about what to show or how to narrate it. PiOS produces governed intelligence artifacts — evidence-bound, derivation-traced, semantically shaped, presentation-assembled outputs — that downstream surfaces may consume. The distinction between PiOS and the surfaces built on it is not semantic; it is structural. PiOS owns derivation. PiOS owns semantic truth. PiOS owns the analytical pipeline. Surfaces consume what PiOS produces. They do not reproduce it.

---

## 3. The Product Line — Signäl (Program Intelligence Surface)

Signäl is the productization layer built on top of PiOS. Where PiOS produces governed intelligence artifacts, Signäl defines how those artifacts are packaged, surfaced, and made available for consumption. Signäl is the system through which the outputs of Program Intelligence reach the people and processes that need them.

Signäl operates as a product system that consumes outputs exposed through L6 and packaged via L7. It is not equivalent to these layers and does not own their architectural responsibilities. Signäl consumes what PiOS produces. It does not participate in derivation. It does not reshape semantic truth. It does not recompute signals because a particular presentation context would benefit from a different result. The boundary between PiOS and Signäl is the boundary between the intelligence system and the intelligence surface, and it is governed by the same canonical model that governs PiOS internally. Signäl's authority begins where PiOS's output ends, and it extends only as far as rendering, navigation, and packaging.

This constraint is not a limitation on Signäl's value — it is the source of Signäl's trustworthiness. A product surface that recomputes signals, invents semantic context, or absorbs derivation logic to compensate for missing upstream outputs is not a governed intelligence surface; it is a presentation layer performing analytical work it is not equipped to govern. Signäl's integrity as a product depends on its fidelity to the PiOS outputs it consumes. The moment Signäl introduces analytical logic — even well-intentioned, plausible analytical logic — it severs the evidence lineage that makes its outputs trustworthy. This is the lesson encoded in [[ssi-ssz-postmortem]]: a surface that computes what belongs upstream creates a system whose outputs cannot be fully traced, and whose correctness cannot be governed.

Signäl is a product system in the strict sense. It has a defined scope, a defined user-facing role, and a defined relation to the system beneath it. It does not define the system beneath it. It does not own the signals it renders. It does not hold semantic authority over the outputs it displays. Its role is to make PiOS intelligence available in a form that is useful, navigable, and appropriately packaged for the context in which it is consumed.

---

## 4. The Module Layer — Lens (Instantiated Capability)

Lens is a module within Signäl. A Lens is a bounded capability that exposes a defined subset of Program Intelligence to a defined consumption context. Where Signäl is the product system, a Lens is a specific instantiation of that product system — a scoped surface through which a particular kind of intelligence is made accessible.

Lens is constructed from L5 presentation assemblies and exposed through L6 runtime surfaces. It does not constitute a layer and does not own layer responsibilities. It does not participate in derivation (L3). It does not perform semantic shaping (L4). It does not define what signals mean or which structural nodes are significant. Its function is to structure the presentation of governed outputs and to provide the runtime interaction through which those outputs are navigated and consumed.

A Lens is not an architecture unit. It is not a signal owner. It does not hold semantic authority. These are not arbitrary restrictions — they follow directly from the layer structure defined in [[canonical-layer-model]]. A module constructed from L5 assemblies and rendered at L6 cannot claim authority that belongs to L3 or L4 without crossing a governed boundary. ExecLens, the current Lens implementation, is explicitly positioned at L6 in the canonical model: it is a runtime consumer layer. It may render, navigate, and stage PiOS outputs. It may not originate canonical signals, define evidence truth, or make architectural decisions.

Lens instances may differ in their presentation scope, their navigation structure, and the subset of intelligence they expose. They share, without exception, the constraint that they derive their content from PiOS outputs consumed through Signäl's governed intake chain. A Lens that invents content, compensates for missing upstream outputs, or introduces its own derivation logic is not a governed Lens — it is a boundary violation instantiated as a product module.

---

## 5. Boundary Enforcement

The stack described in this document is only meaningful if its boundaries hold. A discipline that cannot constrain its own product layer is not a discipline — it is a set of aspirations. The following rules govern the boundaries within and between the layers of the stack, and they are not advisory.

The discipline cannot be altered by product needs. Signäl cannot redefine what constitutes a signal, what counts as a governed derivation, or what semantic shaping is permitted, because doing so would mean that the product is governing the discipline rather than the discipline governing the product. When a product need arises that appears to require an architectural change, the correct response is to govern that change through the architectural stream — not to absorb the change into the product layer and treat it as a local implementation decision.

PiOS cannot be bypassed by the runtime. If a Lens requires a signal that has not been formally derived at L3, the correct response is to derive that signal through the governed pipeline and expose it through the governed output chain. The correct response is not to compute a local approximation at L6 and render it as though it were governed. This is the lesson of [[drift_register]] DRIFT-001 made structural: an ungoverned computation at the runtime layer is not a product feature — it is a boundary collapse, and it must be corrected at the layer that owns the computation, not defended at the layer that performed it.

The product cannot absorb system responsibilities. Signäl's intake of PiOS outputs is read-only and governed. Signäl may not recompute, reinterpret, or supplement those outputs using its own logic. Where PiOS outputs are absent, Signäl surfaces that absence — it does not fill it. Compensation behavior of any form constitutes a breach of the boundary between the intelligence system and the intelligence surface.

Modules cannot redefine signals or semantics. A Lens is a scoped presentation unit. It has no authority to determine what a signal means, which signals are significant, or how evidence should be interpreted. If a Lens-level requirement would require redefining a signal, that requirement must be routed to the appropriate upstream layer (L3 for derivation, L4 for semantic shaping) and governed there before it appears in any presentation surface.

These rules apply without exception. The canonical authority for their enforcement is [[canonical-layer-model]], and boundary deviations are classified, tracked, and remediated through the drift and remediation corpora documented in [[drift_register]] and [[derivation-boundary-audit]].

---

## 6. System Hierarchy

The stack is ordered by the direction of constraint, not the direction of data flow. Data flows forward from L0 through L7. Constraints flow in the opposite direction, originating from the discipline and enforced through governance. This inversion ensures that downstream convenience cannot override upstream truth.

**Krayu** holds the Program Intelligence discipline. Krayu defines what evidence-first analytical intelligence is, what constraints govern its production, and what constitutes a boundary violation. Krayu's authority is expressed through [[governance_master_capsule]] and operationalized through the canonical layer model at [[canonical-layer-model]]. Nothing in PiOS, Signäl, or any Lens instance may contradict or circumvent the constraints Krayu holds.

**PiOS** operationalizes the discipline as a governed computational system. PiOS is constrained by Krayu's discipline and expresses that constraint as layer boundaries, pipeline stages, derivation rules, and semantic shaping governance. PiOS produces intelligence artifacts. It does not consume them. Everything downstream of PiOS — Signäl and its modules — depends on the integrity of what PiOS produces. If PiOS produces ungoverned outputs, no amount of surface-level governance can restore the integrity of what is displayed.

**Signäl** surfaces PiOS intelligence as a product system. Signäl is constrained by PiOS's output contracts and the canonical layer model's placement rules for L6 and L7. Signäl adds packaging, navigation, and consumption context. It does not add intelligence. Its constraint direction runs upward: Signäl must obey PiOS's output boundaries, and PiOS must obey Krayu's discipline constraints.

**Lens** exposes a bounded subset of Signäl's surface as a scoped consumption module. Lens is constrained by Signäl's governed intake chain and the L0–L8 canonical layer model. A Lens adds scoping, navigation mechanics, and presentation structure. It does not add derivation or semantic authority.

The hierarchy, stated plainly:

```
Krayu (Discipline Authority)
  → PiOS (Operationalizes the Discipline)
    → Signäl (Surfaces PiOS Intelligence)
      → Lens (Scopes Signäl Capability)
```

Constraint direction is the reverse of this arrow. Every downstream element is constrained by every upstream element. No downstream element may alter, circumvent, or absorb the responsibilities of an upstream element. This is not a governance preference — it is the structural condition under which Program Intelligence remains what it claims to be.

---

## 7. What This Enables

The discipline-system-product-module structure described here produces three properties that cannot be achieved by a less strictly governed stack.

The first is consistent intelligence production. Because every signal is derived at L3 under governed rules, because every semantic representation is shaped at L4 without altering derivation truth, and because every surface element is assembled and rendered without recomputing or reinterpreting upstream outputs, the system produces the same intelligence for the same evidence regardless of which surface, which module, or which presentation context is involved. Consistency is not a quality aspiration — it is a structural consequence of enforced layer boundaries.

The second is full traceability. Every output visible in a Lens can be traced backward through the presentation assembly that produced it, through the semantic shaping that structured it, through the derivation that computed it, through the evidence navigation that located its sources, and through the evidence normalization that made those sources usable. This traceability is not documentation added after the fact — it is preserved by the governed transformation chain at every layer. Breaking any layer boundary breaks the trace, which is why boundary violations are treated as governance failures rather than implementation details.

The third is non-fragile productization. Because Signäl and its modules do not own the intelligence they surface, changes to the intelligence — new signals derived at L3, updated semantic shaping at L4, revised presentation assembly at L5 — propagate through the governed output chain to the surface without requiring surface-level re-engineering. The product is not fragile to upstream changes because the product does not embed upstream logic. It consumes governed outputs. When those outputs change in a governed way, the surface reflects the change. This is the structural advantage of a strictly layered system over a system where each layer absorbs responsibilities from adjacent layers to accelerate delivery — and it is the structural lesson that the SSZ/SSI incident makes concrete.

---

## Navigation

| Document | Role |
|---|---|
| [[canonical-layer-model]] | L0-L8 layer definitions — authoritative |
| [[pios_architecture_whitepaper]] | Architecture root navigation node |
| [[governance_master_capsule]] | GC-01..GC-11 governing constraints |
| [[drift_register]] | DRIFT-001 — SSZ/SSI boundary violation |
| [[ssi-ssz-postmortem]] | Boundary failure incident record |
| [[index]] | Governance corpus index |
