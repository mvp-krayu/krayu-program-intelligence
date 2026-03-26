# ENL Traversal Runtime Model — 51.6

Stream: 51.6 — ENL Traversal Runtime Engine
Date: 2026-03-26
Authority: This document is the sequence authority for TraversalEngine.js and DemoController.js

---

## Architecture

51.6 introduces a governed traversal runtime as an orchestration-only layer.
No data mutation. No computation. No semantic alteration.

```
TraversalEngine.js     — constants: node types, flow sequences, persona auto-open
DemoController.js      — orchestration UI: flow selector, traversal bar, stage bar
pages/index.js         — state wiring: selectedFlow, traversalNodeIndex, persona auto-open
```

---

## Entry Sequence

| Stage | Action | State Change |
|---|---|---|
| 0 — Persona Selection | User selects persona in PersonaPanel | enlPersona set → PERSONA_AUTO_OPEN applied |
| 1 — Flow Selection | User selects DemoFlow in FlowSelector | selectedFlow set |
| 2 — Demo Start | User clicks Start Demo | traversalNodeIndex = 0; first flow panel opened |
| 3 — Query Execution | GQ-003 auto-selected | 42.x path executes (UNCHANGED) |

---

## Traversal Engine

### Node Types → Panel Mapping

| Node Type | Panel ID | Panel Content |
|---|---|---|
| ENTRY | persona | Persona selector + ENL |
| ANSWER | narrative | Executive narrative |
| SIGNAL | signals | Intelligence signals |
| STRUCTURE | situation | Topology + gauges |
| EVIDENCE | evidence | ENL chain |
| TRACEABILITY | evidence | ENL chain |
| NAVIGATION | evidence | NavigationPanel |

### Flow Sequences

| Flow | Sequence | Node Count |
|---|---|---|
| executive_insight | ANSWER → SIGNAL → EVIDENCE | 3 |
| structural_analysis | ANSWER → STRUCTURE → SIGNAL → EVIDENCE | 4 |
| evidence_audit | EVIDENCE → STRUCTURE → SIGNAL → ANSWER | 4 |

---

## Single-Focus-Node Rule

In traversal mode:
- Only ONE panel open at a time
- `openPanels = [focusPanel]` where `focusPanel = getFlowPanels(flow)[nodeIndex]`
- Advancing increments `traversalNodeIndex` and replaces `openPanels`
- Standard 51.4 max-2 behavior remains active outside traversal mode

---

## Progressive Disclosure Rules

Default state (no traversal active):
- SHOW: situation (topology + gauges)
- COLLAPSE: signals, persona, evidence, narrative

Traversal mode:
- Single focus panel only
- Flow determines reveal order
- User cannot open additional panels while traversal active

Standard mode (no flow selected):
- 51.4 stage-based behavior (5 stages, max-2 panels)

---

## Fallback

If no DemoFlow is selected when demo starts:
- Standard 51.4 5-stage behavior activates
- No regression from prior behavior
