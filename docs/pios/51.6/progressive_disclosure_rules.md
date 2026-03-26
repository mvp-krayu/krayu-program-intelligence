# Progressive Disclosure Rules — 51.6

Stream: 51.6 — ENL Traversal Runtime Engine
Date: 2026-03-26

---

## Mode Matrix

| Mode | Panel Open State | Advance Behavior |
|---|---|---|
| No demo, no flow | up to 2 panels open (user-driven) | togglePanel |
| Demo, no flow selected | 51.4 stage-based (5 stages) | setDemoStage |
| Demo, flow selected | single focus panel | setTraversalNodeIndex + setOpenPanels |

---

## Traversal Mode Rules

1. **Single focus node** — only one panel open at a time
2. **Deterministic sequence** — defined by TRAVERSAL_FLOWS[flow].nodes
3. **Controlled advance** — Next → button or →/Enter/Space keyboard
4. **No uncontrolled expansion** — user cannot open additional panels during traversal
5. **Entry state** — first panel in flow sequence opens on demo start
6. **Exit** — at last node: Finish ✓ exits demo, resets traversalNodeIndex

---

## Default Collapse State (Entry)

When demo starts (any mode):
- SHOW: first panel of flow (or 'situation' for standard mode)
- COLLAPSE: all other panels

When demo exits:
- Return to user-driven max-2 panel behavior

---

## Topology Behavior

- topology (situation panel) is only visible when:
  - user opens it manually (non-demo mode)
  - demo stage maps to situation (standard mode: stage 1)
  - traversal node maps to STRUCTURE (traversal mode)
- topology not continuously visible — reacts to active node only

---

## Fail Conditions (from contract)

| Condition | Status |
|---|---|
| Multiple panels open by default | PREVENTED — single focus in traversal mode |
| Persona alters content | PREVENTED — PERSONA_AUTO_OPEN is visibility-only |
| Recomputation detected | PREVENTED — TraversalEngine has no computation |
| ENL rendered as static block | PREVENTED — 51.5R chain structure preserved |
| Uncontrolled expansion | PREVENTED — openPanels replaced on each advance |
| Topology always fully visible | PREVENTED — situation only in STRUCTURE node |
