# Investigation Projection Doctrine

**Artifact:** PI.INVESTIGATION-PROJECTION.01
**Status:** DOCTRINE DEFINED — no implementation
**Date:** 2026-06-10
**Authority:** Derived from Phase 3 implementation evidence — proof steps navigate but do not project
**Depends on:** PI.NAVIGATION-SPEC.01, PCD-009 (Investigation as PiOS Primitive), PI.COGNITIVE-CONTINUATIONS.01

---

## 1 — Core Question

Given an investigation step, what cognitive outcome should the operator receive?

Not: which zone opens.
Not: which mode activates.

**What should become obvious?**

---

## 2 — The Gap Phase 3 Revealed

Phase 3 implemented the investigation lifecycle — create, advance, resolve. The Guide Runtime tracks proof. Navigation chips create investigations. Proof steps advance from Guide clicks and canvas chips.

But every proof step reduces to a mode transition. "Which runtime paths create pressure?" switches to OPERATOR. "Does this compound with Execution Blindness?" stays in DENSE. The operator arrives at the destination and sees everything — 8 zones, 20 conditions, full topology. Nothing focuses on the answer.

The investigation knows WHAT the operator is resolving. The canvas does not consume that knowledge.

---

## 3 — Step Types Are Cognitively Distinct

Phase 3 testing revealed three distinct step types. Each requires a different projection:

### 3.1 Evidence Steps (descent)

**Question pattern:** "Which runtime paths create pressure?"

**Cognitive outcome:** The operator should see the specific evidence that answers the question. Not all evidence. Not all signals. The RSIG signals that demonstrate runtime execution pressure — their affected domains, their severity, their operational scope.

**What should become obvious:** Which runtime paths exist, which domains they touch, and why they constitute pressure. Everything else recedes.

**Projection mechanism:** Zone-level focus. The relevant zone (Signal Assessment) expands with the evidence pre-filtered. Other zones collapse to single-line headers. The operator can re-expand any collapsed zone, but the default state shows only what the step demands.

### 3.2 Correlation Steps (adjacent)

**Question pattern:** "Does this compound with Execution Blindness?"

**Cognitive outcome:** The operator should see the relationship between the current finding and the adjacent surface. Not the adjacent surface in isolation — the compounding effect. What structural pattern connects them. Whether the same domains appear in both.

**What should become obvious:** Whether the two findings share structural substrate. The overlapping domains. The compounding severity. A "yes, these compound because..." or "no, these are independent because..." answer that emerges from the visual.

**Projection mechanism:** The adjacent surface card in SW-INTEL focuses. The topology highlights domains shared between the investigation finding and the adjacent surface. Domain overlap is the proof — if domains overlap, they compound.

### 3.3 Judgment Steps (challenge)

**Question pattern:** "What would disprove this?"

**Cognitive outcome:** The operator should see the falsification condition — the specific structural state that would eliminate the finding. Not evidence to examine. Not a surface to navigate to. A statement to consider.

**What should become obvious:** The inverse condition. "This finding would disappear if [specific structural change]." The operator reads it, considers whether that change is plausible or planned, and renders a judgment.

**Projection mechanism:** Inline expansion in the Guide panel. No mode transition. No zone change. The falsification text renders below the step when clicked. The operator marks it as examined after considering. This is the only step type that does not navigate.

---

## 4 — The Projection Principle

An investigation step is not a navigation action with tracking. It is a **cognitive projection contract**: given this question, the system commits to making the answer visually obvious.

The contract is:

```
step.question → projection(canvas_state, guide_state) → obvious_answer
```

If the operator clicks a step and has to search for the answer, the projection failed. The answer should be the dominant visual element after the transition. Everything else supports it or recedes.

---

## 5 — Zone Collapse Model

DENSE and OPERATOR modes contain 6-10 zones. An investigation step makes 1-2 relevant. The rest are noise for this specific question.

### 5.1 Collapse Rules

When an investigation step activates:
- Zones matching the step's evidence target: **EXPANDED** (full content)
- Topology zone: **ALWAYS EXPANDED** (the substrate never collapses)
- All other zones: **COLLAPSED** (single-line header: zone code + name)
- Collapsed zones are clickable to re-expand

### 5.2 Zone Relevance Mapping

The mapping is step-type specific, not surface-specific:

| Step Evidence Target | Relevant Zones | Rationale |
|---------------------|----------------|-----------|
| RSIG / runtime signals | Signal Assessment, Runtime Connectivity | Direct evidence for runtime pressure |
| centrality / structural spines | Structural Centrality, Topology | Direct evidence for structural authority |
| cognition_slices / conditions | SW-INTEL condition surfaces | Direct evidence for condition chain |
| domain_narratives / propagation | Propagation Flow, Absorption Load | Direct evidence for cascade dynamics |
| FALSIFICATION_PATHS | None (inline in Guide) | Judgment, not evidence |
| SURFACE_ADJACENCY | SW-INTEL target surface, Topology | Correlation between surfaces |

### 5.3 Expansion State

Zone collapse is temporary. It lasts while the investigation step is the most recent action. Any of these restore normal expansion:
- Operator manually expands a collapsed zone
- Operator clicks a different step (new collapse applies)
- Investigation resolves or is dismissed

---

## 6 — Inline Projection (Guide Panel)

Some cognitive outcomes belong in the Guide, not the canvas:

### 6.1 Falsification Condition

When a challenge/falsification step is clicked:

```
[? What would disprove this?]        ← step button (now active)
  
  This finding would disappear if code gravity
  and operational gravity converged on the same
  domains.
  
  [EXAMINED]  [INCONCLUSIVE]          ← inline resolution
```

The operator reads the condition, assesses it against their knowledge, and resolves it. No canvas change needed.

### 6.2 Qualification Disclosure

When a step's target evidence is UNQUALIFIED (per AQ-001):

```
[◈ Which runtime paths create pressure?]  OPERATOR
  
  ⚠ This question requires EVENT_FLOW evidence.
    Current specimen has STATIC_IMPORT only.
    The answer will be structurally inferred,
    not runtime-verified.
  
  [NAVIGATE ANYWAY]  [MARK INCONCLUSIVE]
```

The operator is warned BEFORE traversing an unqualified path. This connects investigation projection to AQ-001 preventive qualification.

---

## 7 — What This Changes

### Phase 3 (implemented)
Investigation lifecycle. Guide tracks proof. Steps navigate modes.

### Phase 4 (this doctrine)
Steps project cognitive outcomes. Canvas responds to investigation intent. Zones collapse to focus. Judgment steps expand inline. Qualification gates unqualified paths.

### The difference
Phase 3: "I'm investigating and tracking progress."
Phase 4: "The system shows me exactly what I need to resolve each question."

---

## 8 — Relation to Sibling Primitives

### Navigation Specs (PI.NAVIGATION-SPEC.01)
Navigation Specs define WHERE to go. Investigation Projection defines WHAT BECOMES OBVIOUS when you arrive. Navigation is the transport. Projection is the destination experience.

### Artifact Qualification (PCD-008 / AQ-001)
AQ-001 defines whether a question CAN be answered given available evidence. Investigation Projection consumes that qualification to gate or disclose before the operator traverses. Section 6.2 makes this preventive.

### Cognitive Continuations (PI.COGNITIVE-CONTINUATIONS.01)
Continuations generate the proof steps. Investigation Projection defines how each step resolves. The continuation says "this edge exists." The projection says "here's what you see when you traverse it."

---

## 9 — What Is Explicitly Out of Scope

- Zone collapse implementation (CSS, state management)
- Specific zone-to-step wiring code
- Animation or transition choreography between investigation states
- Cross-investigation continuity (carrying proof from one investigation to another)
- Investigation templates (pre-defined proof paths for common questions)

These are implementation concerns for the execution stream.
