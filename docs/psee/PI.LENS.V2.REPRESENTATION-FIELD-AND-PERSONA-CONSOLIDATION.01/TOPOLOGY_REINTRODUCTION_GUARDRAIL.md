# TOPOLOGY REINTRODUCTION GUARDRAIL

**Stream:** PI.LENS.V2.REPRESENTATION-FIELD-AND-PERSONA-CONSOLIDATION.01
**Authority:** This document defines what *is* and what *is not* topology in the LENS V2 flagship surface.

---

## 0. Why this document exists

The contract permits visual topology *concepts* in the Representation Field but explicitly forbids *regression* to legacy topology forms. The line between "AI-enriched representation" and "old static topology pasted back" is not self-evident; it must be made explicit and binding.

This document defines that line. Future contracts that touch topology rendering must read this document before proposing any change.

---

## 1. What was implemented as topology in this iteration

The DENSE lens introduces a small, deliberate, three-step topology:

```
ORIGIN
  ⦿  Primary Delivery        HIGH execution pressure
  │
PASS-THROUGH
  ⦿  Coordination Layer      ELEVATED throughput pressure
  │
RECEIVER
  ⦿  Secondary Delivery      MODERATE pressure   (Q-01 advisory bound)
```

This is permitted because:

- It uses **three** weighted nodes — not many.
- Each node has explicit operational role (ORIGIN / PASS-THROUGH / RECEIVER).
- Nodes are **labeled by domain alias**, not by node id.
- Edges are **gradient-faded** vertical lines, not arrows or thick connectors.
- Pressure tier is encoded by **color glow**, not by line thickness or arrow size.
- The structural insight is framed by the **dense note** prose ("coordination conducting, not generating") — the topology *supports* a sentence, it does not replace one.

This is the **AI-enriched representation** the contract permits.

---

## 2. What is forbidden

The following are **forbidden topology regressions** on the LENS V2 flagship surface:

### 2.1 Old static topology panel

A pre-existing topology panel from earlier streams, copied back into the page, in any visual form. Pasting back legacy topology HTML / SVG / images is forbidden. If a static topology fixture exists in the repo, it must NOT be re-rendered on this surface.

### 2.2 Graph-explorer behavior

A panel where the user can:

- pan / zoom a graph canvas
- expand / collapse nodes
- click a node to "drill in" to a subgraph
- toggle layout algorithms
- drag nodes around

Any of these is forbidden. The Representation Field is *read*, not *played with*.

### 2.3 Many-node visualization

A topology with more than five visible nodes simultaneously. The current three-node composition is the upper bound on this surface. Extensions to four or five would require an explicit contract amendment.

### 2.4 Force-directed clutter

Any layout algorithm that auto-arranges nodes by physics simulation, producing a "graph cloud" that the reader has to mentally re-order. Forbidden in all cases.

### 2.5 Tiny unreadable labels

Any topology node label below 11px. Currently labels are 14px (domain alias). The 9px / 10px register is reserved for role / metadata only.

### 2.6 Graph-first landing experience

A composition where the dominant focal element on first paint is a graph rather than the executive declaration. The 64px declaration must remain the dominant focal element. Topology lives in the right column, supporting — never competing.

### 2.7 Unlabeled topology nodes

A node with only a dot / glow / icon and no operational label. Every visible node must carry an operational name (domain alias) and a role tag.

### 2.8 Network spaghetti

Any visualization where edges cross or where edge density is high enough that the reader cannot trace a single source-to-receiver path with their eye. The current three-step linear layout has zero crossings, by design.

### 2.9 Generic graph icons

Pre-built graph component libraries (vis-network, cytoscape, dagre, react-flow, etc) imported into the surface. Forbidden as new dependencies. The current implementation is CSS / JSX only.

### 2.10 Decorative-only topology

Topology added to a non-DENSE lens "because it looks impressive." The topology composition is permitted only in the DENSE lens (Structural / CTO). BALANCED uses anchors not topology. INVESTIGATION uses trace bands not topology. BOARDROOM uses an atmospheric mark not topology.

---

## 3. Permitted topology concepts going forward

If a future contract proposes to extend topology rendering, the following are permitted patterns:

- Adding *role context* to a node ("Coordination Layer" + "central coordination — absorbing 68% of upstream load").
- Adding *confidence overlay* to an edge (dotted edge for Q-01 partial; solid for Q-00).
- Adding a *fourth-step* node only when an upstream report contains a fourth structural element of equal weight (currently the report has three).
- Adding a *pressure timeline* sparkline beside a node — provided it does not regress into chart-card territory.
- Adding a *propagation summary* line below the topology that states the trace operationally.

In all cases, the AI-enriched representation rule applies: the topology must *support an operational sentence*, not replace it.

---

## 4. Mandatory inspection on any topology change

Any future change to the topology composition MUST:

1. Open the change via Playwright on `/lens-v2-flagship` in DENSE mode.
2. Capture before and after at 1440 × 900.
3. Run the dashboard syndrome detection guide tests (especially component-repetition, grid-gravity, metric-first).
4. Run the rubric in `VISUAL_EVALUATION_RUBRIC.md` axes A, D, and E.
5. Verify no edge crossings.
6. Verify no force-directed library introduced.
7. Verify the declaration is still the dominant focal element.
8. Verify the topology lives only in the DENSE lens (not in BALANCED, INVESTIGATION, or BOARDROOM).

If any of these steps fails, the change is non-compliant.

---

## 5. Relationship to other doctrine

This guardrail is downstream of:

- `VISUAL_DIRECTION_DOCTRINE.md` §5.5 (structural seriousness)
- `ANTI_DASHBOARD_ENFORCEMENT.md` §3.2 (forbidden component patterns)
- `EXECUTIVE_COGNITION_MODEL.md` §3 (executives do not optimize for graph traversal)
- `CINEMATIC_REFERENCE_COMPARISON_MATRIX.md` (Palantir avoid clauses)
- `DASHBOARD_SYNDROME_DETECTION_GUIDE.md` §2.2 (grid-gravity)

If this guardrail conflicts with an upstream doctrine document, the upstream doctrine wins.

---

**End of topology reintroduction guardrail.**
