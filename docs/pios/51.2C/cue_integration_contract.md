# Stream 51.2C — Cue Integration Contract

Stream: 51.2C — Governed WOW Script Alignment & Cue Integration (Canonical Flat Inputs)
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Branch: feature/51-2c-wow-script-alignment-flat
Contract version: 51.2C-v1

---

## Scope

This contract defines how the governed rendering reveal is cued during a WOW demonstration.
It is an additive presenter-facing specification. It does not modify any existing canonical
flat demo artifact. It does not implement frontend or runtime behavior.

---

## Authoritative Rendering Input

Source: docs/pios/51.1/rendering_spec.md (SHA-256: 593a2996...)

Static mapping table in effect:
  high   → RENDER_RED   (red node)
  medium → RENDER_AMBER (amber node)
  low    → RENDER_NEUTRAL (neutral node)
  none   → RENDER_NONE  (no emphasis marker)

Current runtime state:
  All 5 nodes carry emphasis = none → visual state = no emphasis marker

---

## Demonstration Sequence (from canonical flat inputs)

The governing demo sequence drawn from program_intelligence_demonstration_model.md is:

  Layer 1 — Execution Environment
  Layer 2 — Evidence Layer
  Layer 3 — Signal Generation
  Layer 4 — Program Intelligence
  Layer 5 — Executive Insight

The analytical chain drawn from demonstration_signal_pipeline.md is:

  Evidence Acquisition
  → Signal Detection
  → Signal Interpretation
  → Intelligence Generation

The executive intelligence layer drawn from demonstration_exec_intelligence.md is:

  Step 1 — Signal Review
  Step 2 — Signal Contextualization
  Step 3 — Intelligence Synthesis
  Step 4 — Executive Interpretation

---

## Cue Point Definition

### CUE-01 — Topology Reveal

Trigger: topology graph becomes visible to the audience

Presenter dependency: rendering state is visible before presenter speaks about it

Governed rendering state at CUE-01 (current runtime):
  All 5 nodes: emphasis = none → no emphasis marker visible

Presenter guidance at CUE-01:
  Presenter may describe what is structurally visible in the topology.
  Presenter must not describe emphasis states that are not visually present.
  With all nodes at RENDER_NONE: presenter describes the topology structure only,
  without referencing emphasis differentiation.

Forbidden at CUE-01:
  Claiming nodes are red, amber, or neutral when all nodes carry RENDER_NONE
  Implying that emphasis values exist in the current runtime state beyond what is visible
  Asserting urgency or risk differentiation from the visual topology alone

---

### CUE-02 — Signal Intelligence Reference

Trigger: presenter moves from topology to signal layer

Presenter dependency: analytical chain is established before executive framing

Governed alignment:
  Presenter references the signal pipeline (Evidence Acquisition → Signal Detection
  → Signal Interpretation → Intelligence Generation) as defined in
  demonstration_signal_pipeline.md. No emphasis rendering state is claimed
  at this cue point. Signal states are analytical, not visual emphasis states.

Presenter guidance at CUE-02:
  "The topology reflects what the signal layer has detected and bound to execution
   nodes. Each node carries a signal state derived from observable execution evidence."

Forbidden at CUE-02:
  Jumping to executive interpretation before the visual-to-signal chain is established
  Claiming emphasis differentiation from nodes that carry RENDER_NONE

---

### CUE-03 — Emphasis State Verbal Description

Trigger: after topology is visible and signal layer is referenced

Governed rendering state at CUE-03 (current runtime):
  emphasis = none for all 5 nodes → RENDER_NONE in effect

Presenter guidance at CUE-03:
  "The governed emphasis layer shows the upstream-assigned priority state for each node.
   In this run, all nodes carry emphasis: none. This is the governed upstream state —
   no nodes have been assigned high, medium, or low emphasis in the current execution cycle."

Purpose of this phrasing:
  Preserves accuracy: the presenter does not invent emphasis differentiation
  Establishes that emphasis is an upstream-assigned value, not a presenter decision
  Opens space for downstream explanation of what high/medium/low would look like
  Does not cross into 75.x interpretation

Forbidden at CUE-03:
  Claiming that RENDER_NONE means "the program is healthy" (interpretation)
  Claiming that RENDER_NONE means "no risks exist" (inference beyond visible state)
  Introducing emphasis values not present in the governed runtime state

---

### CUE-04 — Executive Intelligence Transition

Trigger: after governed rendering state has been verbally described

Governed transition:
  Presenter transitions from visible rendering state into the executive intelligence
  layer as defined in demonstration_exec_intelligence.md.

  The executive layer answers:
    What is happening in the program?
    Why is it happening?
    What risk or opportunity does it indicate?
    What decision implications exist?

  This transition must remain grounded in the evidence-first chain.
  The executive layer does not redefine emphasis. It interprets the signal conditions
  that produced the current governed state.

Presenter guidance at CUE-04:
  "What you're seeing reflects the intelligence this system derived from observable
   execution evidence. The signal states, the bindings, and the emphasis assignments
   are all traceable upstream through a governed analytical chain."

Forbidden at CUE-04:
  Jumping to executive interpretation before the rendering state is established
  Introducing prediction, trajectory, or escalation not grounded in visible governed state
  Redefining emphasis values verbally after the governed state has been shown

---

## Cue Sequence Summary

| Cue | Trigger | Governed Dependency | Forbidden |
|---|---|---|---|
| CUE-01 | Topology becomes visible | Visual state precedes verbal claim | Claiming absent emphasis states |
| CUE-02 | Signal layer reference | Analytical chain before executive frame | Skipping signal-to-rendering chain |
| CUE-03 | Emphasis state described | Current runtime state = RENDER_NONE | Inventing emphasis differentiation |
| CUE-04 | Executive transition | Visual reveal complete | Interpretation before reveal |

---

## Alignment Traceability

Each cue point is traceable to governed artifacts:

| Cue | Rendering Authority | Demo Authority |
|---|---|---|
| CUE-01 | docs/pios/51.1/rendering_spec.md | docs/program-intelligence-demonstrations/program_intelligence_demonstration_model.md |
| CUE-02 | docs/pios/51.1/rendering_spec.md | docs/program-intelligence-demonstrations/demonstration_signal_pipeline.md |
| CUE-03 | docs/pios/51.1R/closed_set_decision.md | docs/pios/42.22/attribute_lineage.json (via 51.1R provenance) |
| CUE-04 | docs/pios/51.1/rendering_spec.md | docs/program-intelligence-demonstrations/demonstration_exec_intelligence.md |

---

## Determinism Contract

Identical rendering spec + identical demo model artifacts → identical cue sequence.
No alternate cue branches. No conditional phrasing paths. Static cue ordering.

---

## What This Contract Does NOT Govern

  - runtime behavior of 42.x
  - emphasis assignment logic (governed by 44.3)
  - rendering logic implementation (governed by 51.1)
  - executive narrative content (governed by 75.x — currently blocked)
  - migration of flat files to structured paths
