# Capsule Identity Forensic Investigation

**Stream:** PI.COGNITIVE-PRIMITIVES.FORENSIC-INVESTIGATION.02
**Classification:** G2 — Architecture-Consuming
**Date:** 2026-06-03
**Prerequisite:** PI.COGNITIVE-PRIMITIVES.FORENSIC-INVESTIGATION.01 (verdict: B — primitive layer partially supported)
**Status:** FORENSIC ARTIFACT — not doctrine

---

## Challenge

The term "capsule" was introduced as a constitutional concept ("self-describing units of cognition science") and used in the PI Capsule Registry before it was rewritten as the PI Cognition Vector Registry. Six capsules were named:

| Original Capsule | Original Status |
|-----------------|-----------------|
| PI.CAPSULE.01 — Structural Cognition | DISCOVERED |
| PI.CAPSULE.02 — Governance Cognition | DISCOVERED |
| PI.CAPSULE.03 — Trajectory Cognition | DISCOVERED |
| PI.CAPSULE.04 — Transformation Cognition | HYPOTHESIS |
| PI.CAPSULE.05 — Investment Cognition | HYPOTHESIS |
| PI.CAPSULE.06 — Scenario Cognition | HYPOTHESIS |

The registry was then rewritten from capsules to vectors without a formal retirement of the capsule concept. The capsule-to-vector transition was implicit, not governed.

**Founding claim:** "Capsules are sciences. Domain Modules are commerce. Never merge them."

This investigation determines what capsules actually ARE by testing four interpretations against forensic evidence.

---

## Architectural Inventory (concepts capsules could overlap with)

Before evaluating interpretations, inventory the existing canonicalized concepts that capsules could duplicate or compete with:

| Concept | Count | Constitutional Status | Layer | What it Contains |
|---------|-------|-----------------------|-------|-----------------|
| THORR Vectors (cognitive primitives) | 7 (emergent) | HYPOTHESIZED as a layer | Between PI Core and Domain Modules | Fundamental questions PI can ask |
| PICP Cognition Objects | 9 (gate-governed) | CANONICAL | L4 | Deterministic structured artifacts answering cognitive questions |
| Domain Modules | 1 proven + N hypothesized | CANONICAL | All strata | Domain-specific interpretation of PI Core intelligence |
| Projection Families | 8 defined | CANONICAL | L5 | Rendering configurations for PRE |
| Persona Projections | 5 locked | CANONICAL | L5 output | Cognitive altitude projections |
| 22 Cognitive Functions | 22 | Forensic finding | PI Core mechanisms | How PI Core computes |
| Signal Families | 6+ (PSIG, DPSIG, BSIG, ISIG, CSIG, ESIG) | CANONICAL | L1-L2 | Structural intelligence signals |

---

## Interpretation A — Capsules as Domain Containers

### Definition under this interpretation

A capsule would contain all domain-specific cognition for one operational domain:
- Capsule: Software Cognition
- Capsule: PMO Cognition
- Capsule: Security Cognition
- Capsule: Infrastructure Cognition

### Supporting evidence

1. Domain Modules ARE described as domain-specific interpretation layers ("replaceable interpretation layer attached to the PI Spine"). A capsule could be the scientific foundation that a Domain Module commercializes.

2. The marketplace architecture already defines a module registration schema with workspace_resolver, orchestration_adapter, authority_engine, learning_derivation. A capsule could be the scientific specification that the module implements.

3. The founding claim ("capsules are sciences, modules are commerce") implies a science/commerce split. Domain-specific science + domain-specific commerce = clean separation.

### Contradictions

1. **The original 6 capsules are NOT domain-specific.** "Structural Cognition," "Governance Cognition," "Trajectory Cognition" — these are DOMAIN-NEUTRAL cognitive acts. GOVERNANCE applies to ALL domains. STRUCTURE applies to ALL domains. Domain containers would be "Software Cognition," "PMO Cognition," "Security Cognition" — but those are already called Domain Modules.

2. **Domain Modules already have a canonical definition.** The marketplace architecture (canonicalized 2026-05-26) defines domain cognition modules with a precise pattern contract. If capsules are domain containers, they duplicate this definition.

3. **The 6 original capsules don't map to domain modules.** PI.CAPSULE.01 (Structural) ≠ Software Intelligence. PI.CAPSULE.02 (Governance) ≠ any domain module. There is no domain module called "Governance Module." Structural Cognition and Governance Cognition are universal — they're consumed BY domain modules, not contained IN them.

4. **CAPSULE.05 (Investment) and CAPSULE.06 (Scenario) are domain-neutral.** Investment reasoning ("should we allocate resources here?") and scenario reasoning ("what if we change this?") apply to ANY domain — software, PMO, security. They're cognitive acts, not domains.

### Relationship to PICP cognition objects

Weak. The 9 cognition objects (structural_posture, tension_map, constraint_inventory, etc.) are domain-neutral, audience-independent L4 artifacts. Domain containers would not contain them — they'd consume them through domain-specific PICR configurations. But the current PICR has no domain-specific configuration. All 9 objects are produced from the same CIP regardless of domain.

### Relationship to Domain Modules

**Redundant.** If capsules are domain containers, they ARE Domain Modules under a different name. The marketplace architecture already has: module_id, domain, workspace_resolver, orchestration_adapter, authority_engine, learning_derivation. Adding "capsule" as a domain container creates a synonym, not a new concept.

### Relationship to THORR vectors

**Misaligned.** Vectors are domain-neutral fundamental questions ("Can this conclusion be trusted?" applies to software AND PMO AND security). Domain containers would be domain-specific. A vector cannot be IN a domain container because the same vector is consumed by ALL domains.

### Assessment: DOES NOT FIT

The original capsule list is domain-neutral. Domain Modules already own the domain-specific axis. Making capsules = domain containers creates redundancy with Domain Modules and contradicts the original capsule inventory.

---

## Interpretation B — Capsules as Primitive Containers

### Definition under this interpretation

A capsule would contain one cognitive primitive (THORR vector):
- Capsule: GOVERNANCE primitive
- Capsule: STRUCTURE primitive
- Capsule: PRESSURE primitive
- Capsule: TRAJECTORY primitive
- Capsule: TRANSFORMATION primitive
- Capsule: IMPACT primitive
- Capsule: DECISION primitive

### Supporting evidence

1. **Partial mapping exists.** The original 6 capsules partially map to THORR vectors:

   | Capsule | Vector |
   |---------|--------|
   | PI.CAPSULE.01 Structural | VEC-02 STRUCTURE |
   | PI.CAPSULE.02 Governance | VEC-01 GOVERNANCE |
   | PI.CAPSULE.03 Trajectory | VEC-04 TRAJECTORY |
   | PI.CAPSULE.04 Transformation | VEC-05 TRANSFORMATION |
   | PI.CAPSULE.05 Investment | — (no vector equivalent) |
   | PI.CAPSULE.06 Scenario | — (no vector equivalent) |
   | — (no capsule equivalent) | VEC-03 PRESSURE |
   | — (no capsule equivalent) | VEC-06 IMPACT |
   | — (no capsule equivalent) | VEC-07 DECISION |

2. **The founding claim aligns.** "Capsules are sciences" — cognitive primitives are the scientific layer. "Domain Modules are commerce" — modules commercialize the primitives. This science/commerce split is exactly what the THORR vector model describes.

3. **The registry rewrite implies equivalence.** The file PI_CAPSULE_REGISTRY.md was rewritten as "PI Cognition Vector Registry" with vectors replacing capsules. The community already treated them as the same concept.

4. **Capsule description matches primitive description.** "Self-describing units of cognition science, each with its own constitutional boundary, evidence requirements, and discovery history" — this describes what vectors claim to be.

### Contradictions

1. **The mapping is not 1:1.** 6 capsules ≠ 7 vectors. Two capsules (Investment, Scenario) have no vector equivalent. Three vectors (PRESSURE, IMPACT, DECISION) have no capsule equivalent. The concepts were independently derived and don't align.

2. **CAPSULE.05 (Investment) and CAPSULE.06 (Scenario) are absent from THORR vectors.** Either:
   - They were false discoveries that don't survive interrogation, OR
   - They are genuine primitives that THORR interrogation didn't exercise, OR
   - They are something other than primitives (e.g., Domain Module capabilities)

   This unresolved discrepancy means capsules and vectors are NOT the same concept — or at least, they were discovered through different methods that produced different inventories.

3. **Forensic investigation .01 found primitives may not be a distinct computational layer.** No runtime artifact called "primitive" exists. PI Core does not produce an intermediate output labeled "cognitive primitive." The observer classifies PI Core outputs into primitives, but the runtime produces conditions, consequences, confidence assessments — not "GOVERNANCE primitive" or "PRESSURE primitive." If primitives lack runtime identity, packaging them in capsules gives constitutional standing to an observer classification, not a computational artifact.

4. **Vectors already have lifecycle and governance.** The vector registry already records: fundamental question, PI Core status, discovery source, boundary specimens, status lifecycle (HYPOTHESIS → DISCOVERED → VALIDATED → CANONICAL). A capsule wrapping this information adds a container around something that is already self-describing. Redundant.

5. **The vector count is explicitly emergent.** "The vector count is emergent, not fixed. Future sessions may reveal more, or may collapse vectors that turn out to be the same primitive under pressure." A capsule implies a bounded, named container. A concept that may merge or split does not sit well in a container that implies permanence.

### Relationship to PICP cognition objects

**Different decomposition.** 7 vectors ≠ 9 cognition objects. The mapping is many-to-many:

| Vector | Cognition Objects (partial mapping) |
|--------|-------------------------------------|
| VEC-01 GOVERNANCE | structural_posture (qualification state component) |
| VEC-02 STRUCTURE | structural_posture (structural identity component), absence_profile |
| VEC-03 PRESSURE | tension_map, constraint_inventory |
| VEC-04 TRAJECTORY | trajectory_assessment |
| VEC-05 TRANSFORMATION | — (no direct object) |
| VEC-06 IMPACT | exposure_assessment, operational_ceiling |
| VEC-07 DECISION | decision_surface |
| — | detection_boundary (no clear vector) |

The decompositions answer different questions at different granularities. Cognition objects answer specimen-specific questions ("What is THIS program's structural identity?"). Vectors answer universal questions ("Can this conclusion be trusted?"). These are not the same axis.

### Relationship to Domain Modules

If capsules = primitives, modules consume all capsules. Every domain module consumes ALL vectors — what differs is the evidence substrate and projection families. A capsule-per-primitive doesn't help with module composition because modules don't select WHICH primitives to use — they use all of them.

### Relationship to THORR vectors

**Synonymous (with discrepancies).** If capsules are primitive containers, they ARE vectors under a different name — but with a different inventory (6 vs 7), different discovery source (pre-THORR vs THORR interrogation), and two unresolved additional capsules (Investment, Scenario).

### Assessment: CLOSEST FIT — BUT REDUNDANT

The capsule concept is closest to the primitive/vector concept. But the vector registry already serves this function. Making capsules = primitive containers creates a synonym, not a new concept. The 6→7 inventory mismatch is unresolved.

---

## Interpretation C — Capsules as Cognition Object Containers

### Definition under this interpretation

A capsule would contain one PICP cognition object:
- Capsule: structural_posture
- Capsule: tension_map
- Capsule: constraint_inventory
- etc. (9 total)

### Supporting evidence

1. **Cognition objects have the cleanest runtime identity.** They are deterministic, evidence-bound, audience-independent, projection-free L4 artifacts. They pass a 7-gate qualification test. They have constitutional standing and are produced by materializers with defined input/output contracts.

2. **Each cognition object answers a distinct cognitive question.** This matches the capsule description: "self-describing units of cognition science, each with its own constitutional boundary."

3. **Cognition objects are domain-neutral.** Like the original capsules, they are not domain-specific. structural_posture applies to software AND PMO AND security.

### Contradictions

1. **9 cognition objects ≠ 6 original capsules.** The count doesn't match. No mapping exists between the original 6 capsules and the 9 objects.

2. **Cognition objects are already contained in the PICP.** The PICP is their canonical container. Adding "capsule" as a wrapper around something already wrapped creates unnecessary indirection:
   ```
   PICP → contains → Cognition Objects       (current)
   PICP → contains → Capsules → contain → Cognition Objects   (proposed — why?)
   ```

3. **The 7-gate qualification test already governs membership.** Cognition object admission is gate-governed: Derivation, Evidence Binding, Audience Independence, Projection Freedom, Structural Novelty, Cognitive Question, Zero Authority. Capsules don't add governance that the test doesn't already provide.

4. **Capsules were conceived BEFORE PICP was canonicalized.** The capsule concept (2026-06-03 THORR session) was not designed to contain cognition objects (canonicalized 2026-05-31). The timing suggests independent invention, not deliberate containment.

5. **Cognition objects are L4 artifacts; capsules were positioned as "science."** Different abstraction levels. Science is the underlying cognitive capability. L4 artifacts are computational outputs. A capsule wrapping an L4 artifact confuses the science with its materialization.

### Relationship to PICP cognition objects

**Redundant with PICP.** The PICP IS the container for cognition objects. Capsules would be an unnecessary additional wrapper.

### Relationship to Domain Modules

**Wrong direction.** Modules don't produce cognition objects — PICR does. Domain Modules configure which evidence substrate feeds CIP, which feeds PICR, which produces cognition objects. The capsule-as-object-container doesn't participate in the module composition chain.

### Relationship to THORR vectors

**Different decomposition.** 9 objects vs 7 vectors. Objects are materialized outputs. Vectors are fundamental questions. The relationship between them is: vectors describe the cognitive science → cognition objects materialize that science as L4 artifacts. But the decomposition differs (many-to-many mapping, see §B above).

### Assessment: DOES NOT FIT

Cognition objects already have a canonical container (PICP) and a constitutional governance mechanism (7-gate test). Capsules would duplicate both without adding value. The count mismatch (6 vs 9) and independent invention timeline confirm these are separate concepts.

---

## Interpretation D — Capsules as Projection Containers

### Definition under this interpretation

A capsule would contain one projection family or persona projection:
- Capsule: Boardroom Briefing projection
- Capsule: Advisory Memo projection
- Capsule: BOARDROOM persona
- etc.

### Supporting evidence

1. **8 projection families are defined** (Report, Boardroom Briefing, Advisory Memo, M&A Assessment, Transformation Review, Portfolio Review, Executive Workshop, Investment Review). These are distinct governed surfaces.

2. **Projection families configure PRE** through ProjectionConfig (projection_type, audience, format, rendering_overrides). A capsule could be the constitutional specification of a projection family.

### Contradictions

1. **The original capsule list has no projection language.** "Structural Cognition," "Governance Cognition," "Trajectory Cognition" — none of these describe projection surfaces. A projection container would be named "Executive Report Capsule" or "Boardroom Briefing Capsule." The vocabulary doesn't match.

2. **"Capsules are sciences, modules are commerce."** Projections are commercial delivery mechanisms — they're the output surface of commerce. Capsules were positioned as science, which is the INPUT side of the architecture. Science → Commerce → Projection. Capsules are upstream of projections, not containers for them.

3. **Projections already have a container.** PRE + ProjectionConfig is the canonical projection system. 8 families parameterize PRE. Capsules don't add governance that PRE doesn't already provide.

4. **6 capsules ≠ 8 projection families ≠ 5 personas.** No count matches.

5. **Projections consume PICP.** They are downstream consumers. Capsules were positioned as upstream science. Wrong direction in the architecture.

### Relationship to PICP cognition objects

**Consumer, not container.** Projections select which cognition objects to render and at what depth/compression. They don't contain objects — they read them.

### Relationship to Domain Modules

**Output axis.** Projection families are the output side of Domain Module = Vectors × Evidence Substrate × **Projection Families**. They are one axis of the marketplace formula, not the formula itself. Capsules were positioned as the science that modules commercialize — not the delivery format.

### Relationship to THORR vectors

**No alignment.** Vectors are domain-neutral fundamental questions. Projections are audience-specific rendering configurations. Different axis entirely.

### Assessment: DOES NOT FIT

Projections are downstream commercial delivery. Capsules were positioned as upstream science. The vocabulary, count, and architectural direction all contradict this interpretation.

---

## Cross-Interpretation Analysis

### The redundancy problem

Every interpretation creates redundancy with an existing canonicalized concept:

| Interpretation | Duplicates | Why Redundant |
|---------------|------------|---------------|
| A — Domain Container | Domain Modules | Same axis, same purpose, different name |
| B — Primitive Container | THORR Vectors | Same axis (closest fit), different inventory (6 vs 7) |
| C — Cognition Object Container | PICP | Same container function, different count (6 vs 9) |
| D — Projection Container | PRE / ProjectionConfig | Same output function, opposite architectural direction |

No interpretation produces a capsule concept that is BOTH (a) distinct from existing concepts AND (b) consistent with the original capsule inventory and founding claim.

### The inventory problem

The original 6 capsules don't cleanly map to ANY of the existing concept inventories:

| Capsule | Closest Vector | Closest Cognition Object | Closest Module | Closest Projection |
|---------|----------------|--------------------------|----------------|-------------------|
| Structural | VEC-02 STRUCTURE | structural_posture | — | — |
| Governance | VEC-01 GOVERNANCE | — | — | — |
| Trajectory | VEC-04 TRAJECTORY | trajectory_assessment | — | — |
| Transformation | VEC-05 TRANSFORMATION | — | — | — |
| Investment | — | — | — | Investment Review |
| Scenario | — | — | — | — |

4 of 6 capsules map to vectors. 2 of 6 map to cognition objects. 1 of 6 maps to a projection family. 2 of 6 (Investment, Scenario) are orphaned — they exist in no current architectural inventory.

### The timing problem

The capsule concept was introduced during the same THORR session (2026-06-03) that discovered the vectors. The registry was then rewritten from capsules to vectors in the same session. This suggests capsules were a FIRST ATTEMPT at naming what vectors later named more precisely. The capsule concept was not independently validated — it was immediately superseded.

### The Investment and Scenario problem

PI.CAPSULE.05 (Investment Cognition) and PI.CAPSULE.06 (Scenario Cognition) are the most diagnostically important capsules because they DON'T map to any vector:

**Investment Cognition** — "Should we allocate resources here?"
- This is NOT a cognitive primitive in the forensic investigation .01 evidence
- No PI Core function produces investment assessment
- No signal family or condition type relates to resource allocation
- Closest existing concept: one of the 8 projection families ("Investment Review")
- Assessment: Investment Cognition may be a PROJECTION FAMILY or a DOMAIN MODULE CAPABILITY, not a cognitive primitive

**Scenario Cognition** — "What if we change this?"
- This is NOT a cognitive primitive in the forensic investigation .01 evidence
- No PI Core function produces scenario analysis
- Would require temporal infrastructure (TRAJECTORY) PLUS compositional reasoning (TRANSFORMATION) — both HYPOTHESIZED
- No existing concept maps cleanly
- Assessment: Scenario Cognition may be a FUTURE CAPABILITY that requires primitives not yet activated, or it may dissolve into TRAJECTORY + TRANSFORMATION under pressure

These two capsules suggest the original capsule list was MIXING cognitive primitives (Structural, Governance, Trajectory, Transformation) with non-primitive concepts (Investment, Scenario). This mixing weakens the capsule concept as a coherent architectural unit.

---

## Verdict

### Primary verdict: Capsules are a pre-decomposition concept that has been superseded

The capsule concept was an early attempt to name PI's cognitive science units before the architecture had been decomposed into its current precise vocabulary:

| What capsules were trying to name | What it's now called | Canonicalized? |
|-----------------------------------|---------------------|----------------|
| Fundamental cognitive questions | THORR Vectors | HYPOTHESIZED (as a layer) |
| Deterministic structured cognitive outputs | PICP Cognition Objects | CANONICAL (2026-05-31) |
| Domain-specific cognitive interpretation | Domain Modules | CANONICAL (2026-05-26) |
| Audience-specific rendering | Projection Families | CANONICAL (2026-05-31) |

The capsule concept was ONE name for FOUR distinct architectural axes. Now that those axes have their own precise vocabulary, the capsule concept creates ambiguity rather than clarity.

### Secondary verdict: The capsule concept reveals an unresolved design question

The fact that capsules were introduced AND immediately superseded suggests that the architecture needed a concept at this position — but the concept was imprecise. The question capsules were trying to answer:

> What is the constitutional unit of PI cognition science?

This question has not been definitively answered by any of the current concepts:

- **Vectors** answer fundamental questions but may not have runtime identity (forensic investigation .01, §6.2)
- **Cognition objects** have runtime identity but answer specimen-specific questions, not universal ones
- **Domain Modules** are commercial, not scientific
- **Projection Families** are delivery, not science

The capsule concept occupies a conceptual gap: **the governed boundary around a unit of cognitive science.** But the evidence does not yet support defining such a unit — because the relationship between vectors (7 universal questions) and cognition objects (9 materialized outputs) is itself unresolved (see forensic investigation .01, §7.3 item 3).

### Tertiary verdict: Investment and Scenario are diagnostically significant

The two orphaned capsules (Investment Cognition, Scenario Cognition) reveal that the original capsule inventory was mixing:
- Cognitive primitives that PI Core can produce today (Structural, Governance)
- Cognitive primitives that PI Core cannot produce today (Trajectory, Transformation)
- Capabilities that may not be primitives at all (Investment, Scenario)

This mixing confirms the capsule concept lacked the precision to distinguish between what PI Core DOES, what PI Core COULD DO, and what belongs to other architectural layers.

### Recommended disposition

| Action | Justification |
|--------|---------------|
| Do NOT canonize capsules | No interpretation survives forensic scrutiny without creating redundancy |
| Do NOT retire capsules silently | The implicit capsule→vector transition was ungoverned. If capsules are retired, the retirement should be explicit |
| Resolve the vector-to-cognition-object relationship FIRST | This is the actual unresolved question. Do 7 vectors produce 9 objects? Are they different decompositions of the same cognition? Until this is answered, any container concept (capsule or otherwise) is premature |
| Investigate Investment and Scenario | If THORR interrogation produces evidence of investment reasoning or scenario reasoning as distinct cognitive acts not reducible to existing vectors, the vector count may need to expand. If not, these capsules were false discoveries |
| Explicit retirement stream | If capsules are retired, produce a governed stream that: (a) formally retires the capsule concept, (b) maps each original capsule to its successor concept(s), (c) updates the vector registry header to acknowledge the capsule lineage |

### Outcome classification

| Interpretation | Fit | Assessment |
|---------------|-----|------------|
| A — Domain Container | DOES NOT FIT | Contradicts domain-neutral capsule inventory, duplicates Domain Modules |
| B — Primitive Container | CLOSEST FIT — BUT REDUNDANT | Best alignment with founding claim and capsule list, but duplicates THORR Vectors with inventory mismatch |
| C — Cognition Object Container | DOES NOT FIT | Duplicates PICP, wrong abstraction level, count mismatch |
| D — Projection Container | DOES NOT FIT | Wrong architectural direction (upstream science ≠ downstream delivery) |

**Final classification: The capsule concept is an architectural intermediate that should be explicitly resolved — either retired with governed lineage mapping, or reconstituted as something genuinely distinct from vectors, cognition objects, domain modules, and projection families. Current evidence supports retirement, not reconstitution.**
