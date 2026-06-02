<div style="text-align: center; padding-top: 180px;">

# KRAYU BV

## Program Intelligence
## Architecture Overview

---

**CONFIDENTIAL**

**June 2026**

</div>

<div style="page-break-after: always;"></div>

---

# 1. Architectural Problem

Enterprise programs generate vast structural and operational evidence — source code, dependencies, architectural decisions, governance records, runtime artifacts — yet the analytical tools available to executives and operators cannot consume this evidence with any qualification discipline.

Traditional AI and analytics stacks suffer from fundamental architectural gaps:

- **No evidence lineage.** Outputs cannot be traced back to the specific structural evidence that produced them. Conclusions appear without provenance.
- **No qualification model.** There is no governed mechanism to distinguish a fully grounded conclusion from a speculative inference. All outputs carry equal (and therefore zero) confidence authority.
- **No replayability.** Given the same evidence, the same tool may produce different outputs. There is no deterministic guarantee.
- **No governance gates.** AI systems self-authorize conclusions without human decision boundaries. There is no architectural constraint preventing an AI system from promoting its own inferences to executive-grade status.
- **No executive-grade cognition outputs.** Raw data is surfaced to consumers who must perform their own synthesis, with no governed intermediate layer that transforms structural evidence into qualified operational intelligence.

**Program Intelligence addresses this gap.** It introduces a governed runtime layer between raw evidence and consumer outputs — a layer that ingests evidence, derives qualified cognition objects, enforces governance constraints, and delivers consumer-ready intelligence packages with full lineage and qualification metadata.

The result is an architecture where every output can answer: *what evidence produced this, how confident is it, and can it be replayed?*

<div style="page-break-after: always;"></div>

---

# 2. High-Level Architecture

The Program Intelligence architecture follows a strict unidirectional chain from evidence to qualified output:

```
┌─────────────────────┐
│   Evidence Sources   │
│  (Code, Structure,   │
│   Governance, Ops)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Program Intelligence│
│      Runtime         │
│  (Ingestion, Deriv-  │
│   ation, Governance) │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Qualification Layer │
│  (S-Level, Q-Class,  │
│   Confidence Gates)  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│        PICP          │
│  (Cognition Package) │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Consumer Intelligence│
│      Modules         │
│  (EIR, LENS, SW-Intel,│
│   Marketplace)       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Qualified Outputs   │
│  (Executive, Operator,│
│   Marketplace)       │
└─────────────────────┘
```

Each transition in this chain is governed. No stage may consume upstream output without qualification metadata. No downstream consumer may exceed the confidence authority granted by the qualification layer.

<div style="page-break-after: always;"></div>

---

# 3. Evidence Sources

Program Intelligence operates on structural evidence — observable, traceable artifacts produced by real engineering and operational activity.

## Current Evidence Sources (Operational)

| Source Category | Description |
|---|---|
| Source code repositories | File structure, import graphs, class/function inventories, dependency topology |
| Structural dependency graphs | Cross-file and cross-module dependency relationships, cluster analysis |
| Semantic domain models | Domain boundary identification, component classification, structural grouping |
| Runtime pipeline artifacts | Intermediate outputs from governed processing stages |
| Governance records | Qualification state, proposition review outcomes, promotion history |

## Reference Specimen: BlueEdge

The BlueEdge specimen — the current governed reference — demonstrates the scale of structural evidence the runtime processes:

- **680 files** ingested and structurally analyzed
- **2,139 imports** mapped across the dependency graph
- **555 classes** and **638 functions** inventoried
- **17 domains** identified through structural analysis
- **5 clusters** derived from dependency topology

## Future Evidence Sources (Planned)

- Enterprise project management data
- Operational telemetry
- Program management artifacts and governance documentation

These represent planned extension points in the evidence ingestion architecture. They are not yet implemented and are not claimed as current capability.

<div style="page-break-after: always;"></div>

---

# 4. Program Intelligence Runtime

The Program Intelligence Runtime is the core computational engine. It transforms raw structural evidence into qualified, governed cognition objects.

## Responsibilities

| Responsibility | Description |
|---|---|
| **Evidence ingestion** | Accept and normalize structural evidence from heterogeneous sources |
| **Evidence structuring** | Organize raw evidence into topological, dependency, and domain representations |
| **Cognition object derivation** | Transform structured evidence into higher-order cognition objects with semantic meaning |
| **Lineage maintenance** | Preserve full traceability from every cognition object back to its originating evidence |
| **Governance application** | Enforce qualification constraints, confidence boundaries, and authority limits at every derivation step |
| **Conclusion qualification** | Assign confidence classifications to derived cognition before it reaches consumers |
| **Consumer preparation** | Package qualified cognition into consumer-ready formats with full metadata |

## Computational Scale

The runtime operates across multiple cognitive functions organized into distinct computational strata, spanning the full derivation chain from structural observation through semantic interpretation to qualified cognition output. The specific architecture is proprietary.

## Determinism Guarantee

The runtime is designed for deterministic execution: given identical evidence inputs, the runtime produces identical cognition outputs. This property is architecturally enforced, not aspirational — it is a requirement of the governance model.

<div style="page-break-after: always;"></div>

---

# 5. Core Layers

The runtime architecture is organized into distinct computational layers, each with a defined responsibility boundary. These layers execute sequentially — upstream layers feed downstream layers, and no layer may bypass its predecessors.

## Structural Layer

The foundation. Operates directly on observable code and artifact structure.

- Topology extraction: files, modules, packages, repositories
- Dependency mapping: imports, calls, inheritance, composition
- Cluster identification: groups of structurally related components
- Component inventory: classes, functions, interfaces, configurations

This layer produces **structural observations** — factual, deterministic, and directly verifiable against source evidence.

## Semantic Layer

Maps structural observations into business and program meaning.

- Domain identification: which structural clusters correspond to which business capabilities
- Relationship classification: how domains interact, depend on, or conflict with each other
- Proposition generation: governed semantic statements about the program derived from structural evidence
- Context enrichment: adding operational meaning to structural facts

This layer produces **semantic propositions** — claims about program meaning that require qualification before they can be consumed.

## Qualification Layer

Governs confidence. Determines what may be consumed and at what authority level.

- S-Level assignment: structural and semantic maturity classification
- Q-Class assignment: grounding strength classification for individual propositions
- Decision readiness assessment: whether a cognition object has sufficient grounding for downstream consumption
- Confidence arbitration: resolving conflicts between competing semantic propositions

This layer produces **qualified cognition** — semantic propositions that carry explicit confidence metadata and consumption authority.

## Governance Layer

Enforces lineage, replayability, and constraint compliance across all other layers.

- Evidence lineage: every output traces to specific evidence inputs
- Replay guarantee: any conclusion can be regenerated from its evidence chain
- Qualification constraints: no output may exceed the confidence authority of its inputs
- Authority limits: absolute prohibitions on AI self-authorization are enforced architecturally

This layer does not produce outputs of its own — it constrains and validates the outputs of all other layers.

<div style="page-break-after: always;"></div>

---

# 6. Qualification Model

Qualification is the architectural mechanism that distinguishes Program Intelligence from conventional analytics. Every cognition object produced by the runtime carries explicit qualification metadata describing its maturity and grounding strength.

## S-Level: Structural and Semantic Maturity

S-Level describes the overall maturity of a specimen's cognition — how far the runtime has progressed in deriving qualified conclusions from raw evidence.

| Concept | Description |
|---|---|
| **S0** | Evidence ingested; structural inventory complete; no semantic derivation |
| **S1** | Semantic layer active; propositions generated; qualification pending |
| **S2** | Propositions qualified; governed confidence assigned; consumer-ready cognition available |

The BlueEdge specimen has progressed through the full S0 to S2 sequence under governed conditions, demonstrating the complete qualification lifecycle.

S-Level progression is not automatic. Each transition requires specific evidence thresholds and governance conditions to be satisfied. The transition rules are proprietary.

## Q-Class: Proposition Grounding Strength

Q-Class describes the grounding strength of individual semantic propositions — how well a specific claim is supported by structural evidence.

| Q-Class | Meaning |
|---|---|
| **Q-01** | Full Grounding — proposition is fully supported by structural evidence |
| **Q-02** | Partial Grounding — proposition is supported but with identified gaps |
| **Q-03** | Weak Grounding — proposition has limited structural support |
| **Q-04** | Withheld — insufficient grounding; proposition is not promoted to consumers |

Across the BlueEdge specimen, **85 semantic propositions** have been governed through the qualification process: **71 accepted**, **14 rejected**. This demonstrates that the qualification model actively filters — it does not rubber-stamp.

The specific scoring formulas, threshold values, and internal classification mechanics are trade secrets and are not disclosed.

<div style="page-break-after: always;"></div>

---

# 7. PICP — Program Intelligence Cognition Package

## Definition

PICP is the **portable, governed package of qualified cognition** produced by the Program Intelligence Runtime. It is the interface between the runtime and all downstream consumers.

No consumer accesses the runtime directly. All consumer intelligence is derived from PICP.

## Contents

| Component | Description |
|---|---|
| **Qualified cognition objects** | 9 governed object types representing the full spectrum of runtime-derived intelligence |
| **Evidence references** | Traceable links from every cognition object back to its originating structural evidence |
| **Lineage metadata** | Full derivation chain showing how each object was produced |
| **Semantic context** | Domain relationships, proposition status, and qualification history |
| **Governance status** | Current S-Level, Q-Class assignments, and qualification gate outcomes |
| **Consumer contract metadata** | Specifications defining how each cognition object may be consumed and projected |

## Architectural Properties

- **Versioned.** Each PICP instance carries a version identifier tied to the evidence state that produced it.
- **Immutable once produced.** A PICP cannot be modified after generation. New evidence produces a new PICP version.
- **Deterministic.** The same evidence inputs produce the same PICP. This is verified through replay.
- **Consumer-agnostic.** PICP does not know which consumers will process it. It provides a governed interface that any authorized consumer can bind to.

## Significance

PICP is the architectural boundary that enables marketplace extensibility. Because all consumer intelligence flows through a single governed package, new consumers can be added without modifying the runtime. The runtime produces cognition; consumers project it.

<div style="page-break-after: always;"></div>

---

# 8. Consumer Intelligence Modules

Consumer Intelligence Modules transform PICP cognition into outputs tailored for specific audiences and operational contexts. They do not generate intelligence — they project it.

## Current / Reference Consumers

### EIR — Executive Intelligence Report

A 9-chapter governed assessment document. Produces a structured executive-grade report covering program structure, risk posture, semantic maturity, qualification status, and architectural observations. Every chapter traces to PICP cognition objects.

### LENS — Interactive Intelligence Projection

An interactive intelligence surface with **5 persona projection modes**, each calibrated for a different cognitive need:

| Persona | Audience | Projection Style |
|---|---|---|
| **BOARDROOM** | Executive leadership | Consequence posture, strategic signals, decision surfaces |
| **BALANCED** | CTO / VP Engineering / Enterprise Architecture | Causal dynamics, operational drivers, reinforcement patterns |
| **DENSE** | Technical leads, architects | Full structural detail, topology, dependency analysis |
| **OPERATOR** | Day-to-day program operators | Operational workflow, action surfaces, qualification progression |
| **INVESTIGATION** | Verification, audit, due diligence | Evidence drill-down, lineage verification, replay confirmation |

### Software Intelligence

Specialized structural execution intelligence focused on code-level operational cognition — topology pressure, dependency dynamics, and structural consequence assessment.

### Future Marketplace Consumers

The architecture supports additional consumer modules through the PICP consumer contract. Future consumers do not require runtime modification.

## Projection Architecture

Consumer output is governed through a **three-zone projection model**:

| Zone | Authority | Description |
|---|---|---|
| **Zone A** | Deterministic | Direct rendering of qualified PICP cognition. No AI interpretation. Structural facts only. |
| **Zone B** | Governed Narrative | Bounded AI narrative generation under explicit qualification authority. Every generated statement traces to structural evidence. Subject to absolute prohibitions. |
| **Zone C** | Qualification Gate | Non-automatable decisions requiring human authority. The system surfaces evidence and qualification status but does not prescribe action. |

Zone B operates under explicit governance authorization that permits bounded interpretive projection while maintaining absolute prohibitions against organizational psychology inference, personnel attribution, and remediation prescription.

<div style="page-break-after: always;"></div>

---

# 9. Marketplace Architecture

The marketplace architecture is the commercial extensibility model. It separates what the runtime knows (PICP) from how that knowledge is projected and consumed.

```
┌──────────────────────┐
│  Program Intelligence │
│       Runtime         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        PICP           │
│  (Cognition Package)  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Consumer Contract   │
│  (Projection Rules,   │
│   Authority Bounds)   │
└──────────┬───────────┘
           │
     ┌─────┼─────┬──────────┐
     ▼     ▼     ▼          ▼
   ┌───┐ ┌────┐ ┌────┐  ┌──────┐
   │EIR│ │LENS│ │SW-I│  │Future│
   └───┘ └────┘ └────┘  └──────┘
     │     │      │         │
     ▼     ▼      ▼         ▼
┌──────────────────────────────┐
│      Qualified Outputs       │
│  (Executive, Operator,       │
│   Marketplace, Audit)        │
└──────────────────────────────┘
```

## Marketplace Equation

**Domain Modules** (evidence source specializations) **x Projection Families** (consumer output formats) **= Marketplace Surface Area**

This means:
- A new domain module (e.g., project management evidence) enriches PICP for all existing consumers simultaneously.
- A new consumer module (e.g., a compliance projection) can consume existing PICP without new evidence processing.
- The two dimensions multiply rather than add.

## Commercial Implication

One cognition package supports many value-added consumers. New consumers can be developed, bundled, and sold without rewriting or modifying the core runtime. The runtime is the moat; consumers are the revenue surface.

<div style="page-break-after: always;"></div>

---

# 10. Governance and Defensibility

## Governance Capabilities

Program Intelligence enforces governance as an architectural property, not a policy overlay.

| Capability | Description |
|---|---|
| **Evidence First** | No evidence, no output. Every cognition object must trace to structural evidence. |
| **Replayable lineage** | Any conclusion can be regenerated from its evidence chain. |
| **Qualification gates** | No cognition object reaches consumers without explicit qualification. |
| **Source traceability** | Full provenance from executive output back to specific files and structures. |
| **Confidence arbitration** | Competing semantic propositions are resolved through governed qualification, not majority vote. |
| **Executive-ready constraints** | Consumer outputs carry qualification metadata so decision-makers know the grounding strength of what they see. |
| **Absolute prohibitions** | Architectural hard limits on AI self-authorization — including prohibitions on organizational psychology inference, personnel attribution, behavioral prediction, and remediation prescription. These are enforced constraints, not guidelines. |

## Defensibility

| Layer | Defensibility Mechanism |
|---|---|
| **Runtime know-how** | The specific computational architecture for transforming structural evidence into qualified cognition objects |
| **Qualification logic** | S-Level progression rules, Q-Class assignment mechanics, confidence arbitration algorithms |
| **Cognition generation** | The derivation of governed cognition objects from raw structural evidence |
| **Fusion logic** | Cross-domain synthesis mechanics that combine evidence from multiple structural sources |
| **Consumer contract design** | The projection architecture that enables one PICP to serve many consumers with different authority levels |
| **Specimen library** | Accumulated governed specimen data representing real-world qualification progressions |
| **Trade-secret algorithmic layer** | Scoring formulas, thresholds, transition rules, and internal derivation mechanics |

The combination of governed process, proprietary algorithms, and accumulated specimen evidence creates a defensibility position that strengthens with each additional specimen processed through the runtime.

<div style="page-break-after: always;"></div>

---

# 11. Scalability and Roadmap

## Current State (June 2026)

| Capability | Status |
|---|---|
| BlueEdge specimen | **S2 Governed** — full qualification lifecycle demonstrated |
| NetBox specimen | **Validation** — secondary specimen for onboarding and generalization proof |
| EIR export | **Operational** — governed 9-chapter executive assessment |
| LENS projection | **Operational** — 5 persona modes with three-zone projection |
| Software Intelligence | **Direction established** — structural execution cognition module |
| PICP canonicalization | **Operational** — 9 governed cognition object types |
| Qualification model | **Operational** — S-Level and Q-Class assignment on governed specimens |
| Governance enforcement | **Operational** — evidence lineage, replay, qualification gates |

## Near-Term Roadmap

| Priority | Description |
|---|---|
| Repeatable export packaging | Standardized PICP and consumer output packaging for client delivery |
| Onboarding automation | Streamlined specimen intake reducing time-to-first-cognition |
| Additional specimens | Expanding the governed specimen library beyond BlueEdge and NetBox |
| Marketplace consumer hardening | Production-grade consumer contract enforcement for third-party modules |
| Commercial pilot execution | First external client engagements using the governed runtime |

## Scaling Model

The architecture scales along two independent axes:

1. **Evidence breadth** — additional domain modules process new evidence categories through the same runtime and qualification model.
2. **Consumer breadth** — additional consumer modules project existing PICP cognition to new audiences and use cases.

Each axis scales independently. Neither requires modification to the other.

<div style="page-break-after: always;"></div>

---

# 12. Why The Architecture Scales

The Program Intelligence architecture scales along two independent value dimensions:

**New evidence sources benefit all consumers.**
When a new evidence type is added to the runtime — project management data, operational telemetry, governance documentation — every existing consumer (EIR, LENS, Software Intelligence, marketplace modules) immediately benefits from richer PICP cognition. No consumer modification required.

**New consumers benefit from all existing cognition.**
When a new consumer module is added — a due diligence projection, a portfolio view, a compliance report — it consumes the full PICP immediately. No new evidence processing required.

These dimensions multiply rather than add. A platform with N evidence sources and M consumers creates N × M value surfaces. Each addition to either dimension creates value across the other.

This is a platform characteristic. Services businesses scale linearly — more clients require more consultants. Platform businesses scale multiplicatively — more evidence and more consumers compound without proportional cost increase.

<div style="page-break-after: always;"></div>

---

# 13. Architectural Moat

The defensibility of the Program Intelligence architecture is not in the user interface, the reporting format, or any single algorithm. It is in the combination of:

**Qualification discipline.** The governed lifecycle from evidence to qualified cognition — S-Level progression, Q-Class assignment, proposition review with explicit acceptance and rejection — is an operational capability that cannot be replicated from a product description.

**Evidence lineage architecture.** Every output traces to specific structural evidence through a complete derivation chain. This is not a feature — it is an architectural constraint that shapes every component in the system.

**Consumer contract architecture.** The PICP abstraction that separates cognition production from cognition consumption creates a structural moat: competitors must build both the runtime AND the consumer model, and get the interface between them right.

**Accumulated specimens.** Each governed specimen adds to the operational evidence base. The runtime's qualification patterns improve with use — not through training, but through governed operational experience.

**Governance constraints.** The absolute prohibitions, authority ceilings, and non-automatable boundaries are not policies — they are architectural constraints. Removing them would require redesigning the system, not reconfiguring it.

The moat deepens with each specimen processed, each consumer added, and each evidence source integrated.

<div style="page-break-after: always;"></div>

---

# Closing Architecture Statement

```
Evidence Sources
    → Program Intelligence Runtime
        → PICP (Qualified Cognition Package)
            → Consumer Intelligence Modules
                → Qualified Decision Outputs
```

The Program Intelligence architecture moves Krayu from expert consulting toward **repeatable, evidence-bound intelligence products**.

Every output is governed. Every conclusion is qualified. Every claim traces to evidence. Every consumer operates within explicit authority bounds.

This is not an analytics platform. It is a **governed operational cognition system** — architecturally constrained to produce only what the evidence supports, at the confidence level the qualification model authorizes, within the boundaries the governance layer enforces.

---

<div style="text-align: center; padding-top: 40px; font-size: 0.9em;">

---

**CONFIDENTIAL — KRAYU BV**

This document contains proprietary and confidential information.
No part may be copied, distributed, reproduced, or disclosed without prior written consent.

---

</div>
