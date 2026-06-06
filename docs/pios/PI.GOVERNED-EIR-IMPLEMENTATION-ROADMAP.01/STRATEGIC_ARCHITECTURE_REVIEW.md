# Strategic Architecture Review — SW-INTEL, Consumers, and the Cognition Boundary

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture-Consuming)
**Date:** 2026-06-01
**Scope:** Formal assessment of SW-INTEL positioning, cognition-vs-consumption boundary, consumer differentiation, and canonical marketplace hierarchy

---

## 1. Where Does SW-INTEL Live?

### Options Assessed

**Option A — SW-INTEL as consumer:**
```
PICP → PRE → SW-INTEL Consumer
```
**Rejected.** SW-INTEL concepts (execution pressure zones, propagation chains, fragility detection) are audience-independent structural computations. Making them a consumer restricts them to one projection path. The data shows these computations already exist in `SignalSynthesisEngine.js` and `ConsequenceCompiler.js` as audience-independent pipelines consumed by multiple surfaces.

**Option B — SW-INTEL produces a specialized PICP:**
**Rejected.** Fragments the cognition package. Competing PICPs (base vs SW-INTEL) force consumers to know which to read.

**Option C — SW-INTEL enriches PICP before PRE consumes it:**
**Closest, but requires refinement.** SW-INTEL doesn't "augment" existing objects — it produces additional domain-specific cognition objects that join the PICP alongside base objects.

### Canonical Model

```
CIP
 ↓
PICR ─────────────── Base Cognition (9 objects: posture, tension, constraints...)
 +
Domain Module ────── Domain Cognition (N objects: SW-INTEL-specific)
 ↓
PICP (base + domain objects — single package)
 ↓
PRE (config-driven, selects by name)
 ↓
Consumers
```

### Architectural Validation (from code audit)

- `PICPSchema.js` enforces a floor (9 required), not a ceiling — extra objects pass validation
- `PRECore.js` is 100% config-driven — accesses objects by name from `ProjectionConfig.section_mapping`, never by position or count
- The single extension seam is `PICRRuntime.MATERIALIZERS` — register a new materializer, the object flows through `PICPProducer` automatically and is consumable by any `ProjectionConfig` that names it
- Zero PRE core changes required to consume domain-module objects

The architecture already supports this. It was designed for it, even if it wasn't named.

---

## 2. Cognition vs Consumption Boundary

### The Governing Rule

A computation belongs in **PICP** if ALL of:
1. **Audience-independent** — the result is the same regardless of who reads it
2. **Deterministic** — same input produces same output
3. **Reusable** — useful to more than one consumer

A computation belongs in the **Consumer layer** if ANY of:
1. **Audience-specific** — framed for a particular reader type
2. **Narrative** — tells a story rather than states a fact
3. **Consumer-exclusive** — has no value to other consumers

**In one sentence:** If you can compute it without knowing who will read it, it belongs in PICP.

### Application to Specific Concepts

| Concept | Classification | Reason |
|---------|---------------|--------|
| Execution pressure zones | **PICP** | Audience-independent structural detection |
| Reinforcement corridors | **PICP** | Deterministic computation from condition graph |
| Propagation chains | **PICP** | Audience-independent topology derivation |
| Fragility vectors | **PICP** | Deterministic structural measurement |
| Convergence center identification | **PICP** | Already in `tension_map` materializer |
| Behavioral class activation | **PICP** | Already in `tension_map` materializer |
| Combined risk profile (class key ABCD) | **PICP** | Cross-object correlation, reusable by all consumers |
| "This convergence means your program has a structural fragility" | **Consumer** | Executive narrative framing |
| "Teams are likely experiencing this as persistent friction" | **Consumer** | Audience-calibrated language |
| "If incident post-mortems trace back to the same minor components" | **Consumer** | Leadership pattern-matching |

---

## 3. Is EIR Proving the Wrong Thing?

**Yes — partially.** EIR is demonstrating two things simultaneously, and one of them is misplaced.

### What EIR Synthesis Actually Does

The EIR synthesis module reads PICP objects directly (not PRE output) and produces 34 findings. The classification shows:

- **~40% is DOMAIN COGNITION** — `observed` fields across all 9 chapters, plus the `identifyDominantPattern()` function (computes: class key, active class list, risk label, ceiling flags, dominant severity, convergence count, systemic exposure count). This is audience-independent computation that should be in PICP.

- **~60% is genuine NARRATIVE PROJECTION** — `matters`, `operational_implication`, `leadership_implication` fields. This is legitimate consumer-specific synthesis.

### The Key Specimen

**`identifyDominantPattern()`** — the most significant domain cognition function trapped inside EIR. It performs cross-object correlation (tension_map class activation + operational_ceiling flags + exposure_assessment systemic count + structural_posture qualification). No single PICP object contains this synthesis. It's reused across chapters 1, 4, 5, and 9. It has zero audience-specific language. This is a **missing cognition object**.

### The Materializer Gap

The 9 PICR materializers already produce much of the domain cognition that EIR re-derives:
- `tension_map` → convergence centers, behavioral class activation
- `constraint_inventory` → throughput ceilings, fragility hotspots
- `exposure_assessment` → consequence exposure, governance exposure
- `trajectory_assessment` → worsening vectors
- `operational_ceiling` → ceiling drivers, advancement blockers
- `absence_profile` → unmeasured capabilities, detection gaps

The gap is not that domain cognition doesn't exist in PICP — it does. The gap is:

1. **Cross-object synthesis** (`identifyDominantPattern`) doesn't exist as a PICP object
2. **EIR synthesis re-derives** some of what materializers already compute, because it was built before the materializers were wired
3. **No consumer currently reads PICP through PRE for rendering** — the materializer path and the rendering path are unconnected

### What Should Be Extracted vs What Should Remain

**Extract to PICP:**
- `identifyDominantPattern()` — combined risk profile (cross-object synthesis)
- Convergence center identification (already in `tension_map`)
- Behavioral class activation (already in `tension_map`)
- Measurement gap detection (already in `absence_profile`)
- Ceiling constraint enumeration (already in `operational_ceiling`)

**Remain in EIR:**
- Chapter narrative arc (9 chapters ordered for executive consumption)
- "Matters" explanations (executive framing)
- "Leadership implications" (board-level pattern matching)
- Severity-to-business-language translation (audience-calibrated vocabulary)

---

## 4. Should All Consumers Receive Intelligence Modules?

### Per-Consumer Assessment

**Note:** Persona definitions below are grounded in the canonical 5-persona model locked 2026-05-29 (PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01) and the 16-field mission contracts (PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01).

| Consumer | What it is | Primary User | Primary Decision | CIM Justified? |
|----------|-----------|-------------|-----------------|---------------|
| **EIR** | Report artifact — executive synthesis document | CEO, Board, Investment Committee | "Invest, redirect, or divest?" | **YES** — narrative arc, chapter synthesis, leadership framing (~60% of output is narrative projection) |
| **BOARDROOM** | Persona — consequence posture, governance escalation | CTO, VP Engineering, Program Director | "Does this require executive escalation?" | **YES** — consequence grouping, posture synthesis, executive framing (~45% of output is narrative projection) |
| **BALANCED** | Persona — operational causality, reinforcement flows | Technical Lead, Engineering Manager, Enterprise Architect | "What operational dynamics should we intervene in?" | **YES** — reinforcement flow framing, ontology questions, operational meaning (~45% of output is narrative projection) |
| **DENSE** | Persona — maximum structural fidelity | Structural Analyst, Audit Function | "Is the complete structural record accurate?" | **NO** — value is unmediated completeness. Synthesis would reduce the very quality DENSE exists to provide. |
| **OPERATOR** | Persona — engineering evidence inspection | Engineers, Technical Analysts | "Is the evidence chain complete and trustworthy?" | **NO** — value is unmediated evidence depth at full precision. HIGH agency, operator-controlled exploration. Synthesis would compromise forensic integrity. |
| **INVESTIGATION** | Action within OPERATOR — 5-step verification protocol | Auditors, Compliance | "Is this finding substantiated?" (PASS/FAIL verdict) | **N/A** — not a consumer in the persona-switch sense. Constitutional persona with LOW agency, system-enforced sequence. Verification protocol produces deterministic PASS/FAIL, not synthesis. |

### The Inverse Correlation Principle

For DENSE, OPERATOR, and INVESTIGATION, value is **inversely correlated with mediation**:

- DENSE value = maximum fidelity. Adding synthesis hides data.
- OPERATOR value = full-precision evidence. Adding synthesis obscures derivation chains.
- INVESTIGATION value = deterministic verification. Adding synthesis introduces interpretation where only proof belongs.

Consumer Intelligence Modules are justified only where audience-specific cognitive framing adds decision value beyond raw cognition projection: EIR, BOARDROOM, BALANCED.

---

## 5. Marketplace Structure

### Three Possibilities Assessed

**Possibility A — Sell Consumers only (EIR, BOARDROOM, BALANCED, DENSE):**
Incomplete. Consumers without Domain Modules have nothing domain-specific to project. A "BOARDROOM" is not a product — it's a projection format.

**Possibility B — Sell Cognition Packages only (SW-INTEL, ORG-INTEL, PM-INTEL):**
Incomplete. Domain Modules without Consumers have no audience-specific projection. Raw cognition objects are not consumable by executives.

**Possibility C — Sell both, as a matrix product:**
**Correct.** The marketplace sells the intersection of Domain Modules and Projection Families.

### The Marketplace Matrix

```
                    ┌─────────┬────────────┬──────────┬───────┬──────────┬───────────────┐
                    │   EIR   │ BOARDROOM  │ BALANCED │ DENSE │ OPERATOR │ INVESTIGATION │
┌───────────────────┼─────────┼────────────┼──────────┼───────┼──────────┼───────────────┤
│ SW-INTEL          │  ✓ NOW  │   ✓ NOW    │  ✓ NOW   │ ✓ NOW│  ✓ NOW   │   ✓ NOW       │
│ ORG-INTEL         │    ✓    │     ✓      │    ✓     │  ✓   │    ✓     │      ✓        │
│ PM-INTEL          │    ✓    │     ✓      │    ✓     │  ✓   │    ✓     │      ✓        │
│ RISK-INTEL        │    ✓    │     ✓      │    ✓     │  ✓   │    ✓     │      ✓        │
│ M&A-INTEL         │    ✓    │     ✓      │    ✓     │  ✓   │    ✓     │      ✓        │
└───────────────────┴─────────┴────────────┴──────────┴───────┴──────────┴───────────────┘
```

### What a Customer Buys

- A **Domain Module** answers "what do you want to understand?" (software structural health, organizational dynamics, project risk, M&A due diligence)
- A **Projection Family** answers "who needs to understand it and how?" (executive report, board summary, operational briefing, structural audit, evidence inspection, verification protocol)

A specific product is one cell: "SW-INTEL × EIR" = Executive Intelligence Report about software structural health. "ORG-INTEL × BOARDROOM" = Board-level view of organizational dynamics.

### Why This Is Architecturally Aligned

The current architecture already separates these concerns:
- Domain Modules produce **domain-specific cognition objects** (audience-independent)
- PRE projects through **consumer-specific ProjectionConfigs** (audience-specific)
- The PICP sits between them as the domain-independent container

The code proves this works. `PRECore` accesses objects by config-driven name lookup. A ProjectionConfig for "ORG-INTEL × BOARDROOM" would reference `organizational_posture`, `team_tension_map`, etc. — different object names, same PRE machinery.

### Commercial Model

- Domain Modules are **capability tiers** — you buy the analytical domains you need
- Projection Families are **consumption modes** — you buy the output formats your organization needs
- Pricing: Domain Modules × Projection Families, with volume scaling by specimen count

SW-INTEL is the first Domain Module. EIR + LENS personas are the first Projection Family set.

---

## 6. Future Cognition Package Hypothesis

### The Architecture

```
Evidence Sources
        ↓
CIP (Compiled Intelligence Package)
        ↓
┌─────────────────────────────────────────────────┐
│ PICR (Cognition Formation Runtime)               │
│                                                  │
│   Base Layer:  9 structural cognition objects     │
│       +                                          │
│   Domain Modules:                                │
│     SW-INTEL  → execution pressure, fragility,   │
│                 propagation, convergence          │
│     ORG-INTEL → team coupling, coordination,     │
│                 governance alignment              │
│     PM-INTEL  → delivery velocity, schedule       │
│                 exposure, resource concentration  │
│     ...                                          │
└─────────────────────────────────────────────────┘
        ↓
PICP (Complete Cognition Package — base + domain objects)
        ↓
PRE (Projection Runtime Engine — 3 zones, consumer-generic)
        ↓
Consumers (EIR, BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION)
```

### The Separation

**PRE is fundamentally consumer-centric. Domain Modules are fundamentally domain-centric.** This is the correct separation.

| Concern | Owned by | Nature |
|---------|----------|--------|
| "What cognition exists about this specimen?" | Domain Module + PICR | Domain-centric, audience-independent |
| "How is this cognition packaged for portability?" | PICP | Container, domain-neutral |
| "How is this cognition projected for a specific audience?" | PRE + Consumer | Consumer-centric, audience-specific |

### Why This Is Cleaner Than Alternatives

1. **No cognition duplication.** A domain computation exists once (in the Domain Module), packaged once (in PICP), projected N times (by N consumers). The current problem — where EIR re-derives domain cognition that materializers already produce — disappears.

2. **Clean commercial boundary.** A customer who buys SW-INTEL gets all SW-INTEL cognition objects regardless of which consumers they use. A customer who buys EIR gets the executive projection regardless of which domains they've licensed.

3. **Independent scaling.** New Domain Modules don't require new consumers. New consumers don't require new Domain Modules. The matrix scales in both dimensions independently.

4. **Existing proof.** `PRECore` is already consumer-parameterized. `PICRRuntime.MATERIALIZERS` is the only touch point for new objects. The architecture supports this with zero core modification.

### The One Architectural Refinement Needed

PICR currently treats all 9 materializers as "base." If Domain Modules are formalized, PICR needs a registration model: base materializers always run; domain-module materializers run conditionally based on which modules are licensed/activated. This aligns with existing doctrine: SW-Intel toggle gates computation, not visibility — the toggle determines which materializers execute, not which sections render.

---

## 7. Decision-Centric Validation

### Per-Consumer Decision Analysis

**What unique decision becomes possible through this consumer that cannot be made as effectively through another?**

#### EIR — Executive Intelligence Report
**Decision:** "Should we continue investing in this program, change strategic direction, or divest?"

Only EIR synthesizes the combined risk profile across ALL domains into a single executive posture with convergence analysis, behavioral class profiling, and measurement gap disclosure. No other consumer produces the cross-domain synthesis needed for a portfolio-level investment decision. A CTO reading BOARDROOM knows *what's wrong*; a CEO reading EIR knows *whether it's worth fixing*.

#### BOARDROOM
**Decision:** "Does this structural state require executive escalation or governance intervention?"

BOARDROOM compresses 9 objects into 4 consequence-grouped themes. It answers the governance escalation question — should leadership change resource allocation, organizational structure, or strategic priority? BALANCED tells you *why things are the way they are*; BOARDROOM tells you *whether the board needs to know*.

#### BALANCED
**Decision:** "What operational dynamics should we intervene in, and how do they reinforce each other?"

Only BALANCED projects reinforcement flows — causal relationships between conditions (amplifies, concentrates, widens). A VP Engineering reading BALANCED understands that fixing fragility without addressing the constriction that feeds it will fail. DENSE shows every structural fact; BALANCED shows which facts are causally connected and which interventions have compound effect.

#### DENSE
**Decision:** "Is the structural assessment complete, consistent, and auditable?"

DENSE provides the unmediated structural record. It is the only consumer that shows ALL 9 objects with zero synthesis. A structural analyst or audit function uses DENSE to verify that no finding was omitted, no severity was softened, no condition was hidden by selective projection. The decision: "Can I trust that the other consumers are projecting from a complete record?"

#### OPERATOR
**Decision:** "Is the evidence chain complete, the governance state correct, and the inference boundaries properly enforced?"

OPERATOR provides full-precision evidence inspection — 4-decimal signal values, evidence hash chains, governance lifecycle state, inference prohibitions, forensic topology. The decision is evidentiary: "Do I trust the derivation chain?" No other consumer surfaces evidence at this precision. DENSE shows structural behavior; OPERATOR shows the evidence behind it.

#### INVESTIGATION (action from OPERATOR)
**Decision:** "Is this specific derivation reproducible and correct?" (PASS/FAIL)

INVESTIGATION runs the 5-step verification protocol: evidence anchor verification, derivation trace replay, consequence rule verification, combination pattern verification, compilation integrity. It produces a deterministic PASS/FAIL verdict. The decision is certification: "Can this finding withstand audit?" No other consumer can assert VERIFIED — only INVESTIGATION produces proof of correctness.

### The Decision Hierarchy

```
INVESTIGATION action:  "Is it correct?"         → Certification verdict (from within OPERATOR)
OPERATOR persona:      "Is it trustworthy?"      → Evidence inspection
DENSE persona:         "Is it complete?"          → Structural audit
BALANCED persona:      "Why is it this way?"      → Operational intervention
BOARDROOM persona:     "Should we escalate?"      → Governance escalation
EIR report:            "What should we do?"       → Strategic portfolio decision
```

Each consumer enables a decision that cannot be made as effectively through any other consumer. This is not formatting diversity — this is decision diversity.

---

## 8. Canonical Recommendation

### Recommended Canonical Hierarchy

```
Evidence Sources
        ↓
CIP (Compiled Intelligence Package)
        ↓
PICR ──── Base Cognition Layer (9 structural objects)
  +
Domain Modules ──── Domain Cognition [SW-INTEL, ORG-INTEL, PM-INTEL, ...]
        ↓
PICP (Complete Cognition Package)
        ↓
PRE (Projection Runtime Engine — Zones A/B/C)
        ↓
Consumer Synthesis [where justified: EIR, BOARDROOM, BALANCED]
        ↓
Consumer Output [EIR, BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION]
```

### Key Design Principles

1. **Domain Modules produce domain cognition — audience-independent, deterministic, reusable.** SW-INTEL is the first. Each Domain Module registers materializers with PICR that produce named cognition objects. These objects join the PICP alongside the 9 base objects.

2. **PICP is the domain-neutral container.** It carries base objects + domain-module objects. It is portable, versioned, and serializable. It does not know which Domain Modules produced its contents.

3. **PRE projects cognition — consumer-centric, config-driven, governed.** PRE's three zones are consumer-generic and domain-agnostic. Zone A selects objects by name from ProjectionConfig. Zone B provides governed narrative where authorized. Zone C enforces the qualification gate.

4. **Consumer Synthesis is justified for three consumers only.** EIR, BOARDROOM, and BALANCED require audience-specific cognitive framing. DENSE, OPERATOR, and INVESTIGATION derive their value from the absence of synthesis.

5. **The marketplace matrix = Domain Modules × Projection Families.** Rows are what you analyze. Columns are how you consume. Each cell is a product.

6. **The consumer-genericity invariant holds with refinement.** PRE core does not change when adding a consumer OR a domain module. What changes: `ProjectionConfig` (per consumer), `MATERIALIZERS` registration (per domain module), and optionally a Consumer Intelligence Module (per consumer that justifies synthesis).

### What Changes from the Current Architecture

Nothing structural. The architecture already supports this:
- `PICPSchema` is ceiling-open
- `PRECore` is config-driven
- The extension seam (`MATERIALIZERS`) is identified

What needs naming and formalization:
- **Domain Module** as a first-class architectural concept (not just "SW-INTEL toggle")
- **Consumer Intelligence Module** as a formal category distinct from "consumer" (only 3 of 6 consumers need one)
- **Cross-object synthesis** as a computation type that Domain Modules may produce (the `identifyDominantPattern` gap)
- **PICR registration model** for domain-module materializers (conditional execution based on module activation)

### What Needs to Happen in the Code (Eventually)

- Extract `identifyDominantPattern()` from EIR synthesis into a PICP-level cross-object synthesis object
- Wire EIR synthesis to consume PICP objects through PRE rather than re-deriving domain cognition
- Formalize `forBoardroom()` and `forBalanced()` as Consumer Intelligence Modules that consume PICP through PRE
- Converge the two disconnected computation paths (rendering path and PICP path)

### What Does NOT Need to Happen Now

Building ORG-INTEL, PM-INTEL, or any future Domain Module. The architecture must support them; the implementation waits for demand.

### The Bottom Line

Cognition that belongs at the package layer has leaked into consumers — specifically into EIR, BOARDROOM, and BALANCED. The fix is not to build more Consumer Intelligence Modules. The fix is to recognize that Domain Modules are a first-class architectural concept that produces domain cognition into PICP, and that Consumer Intelligence Modules are a narrow category justified only where audience-specific narrative synthesis adds decision value that raw cognition projection cannot.

The persona model (5 personas + EIR report artifact = 6 consumers) is correct and locked. The cognition supply chain — where domain computation lives — is what needs convergence.
