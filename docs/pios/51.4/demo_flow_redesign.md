# Demo Flow Redesign — 51.4

Stream: 51.4 — Progressive Disclosure & Panel-Orchestrated Demo Flow
Date: 2026-03-25
Supersedes: PIOS-51.3-RUN01-CONTRACT-v1 (step-driven navigation)

---

## Problem (51.3 state)

- 9-step navigation exposed internal system layers as "steps"
- Steps 4/5/6 (Topology / Focus / Emphasis) rendered near-identical content — perceived redundancy
- All content appeared simultaneously on query load — cognitive overload
- ENL and persona were tacked on below main output — not progressively revealed
- Demo felt mechanical (Next → button scrolling through sections)

## Solution (51.4)

Replace step navigation with **panel-driven progressive disclosure**.

Principle: **Reveal → Expand → Contextualize → Expose → Decide**

---

## Panel Flow

| Stage | Panel | Title | Opens When |
|---|---|---|---|
| 1 | Situation | Structural baseline | Demo start / always |
| 2 | Signals | Why is this critical? | Stage 2 / user click |
| 3 | Persona | What does this mean for you? | Stage 3 / user click |
| 4 | Evidence | Show evidence | Stage 4 / user click |
| 5 | Narrative | So what? | Stage 5 / user click |

## Max-2-Panel Rule

At most 2 panels open simultaneously.
Opening a third panel collapses the oldest.

| Stage | Open Panels |
|---|---|
| 1 | [situation] |
| 2 | [situation, signals] |
| 3 | [signals, persona] |
| 4 | [persona, evidence] |
| 5 | [evidence, narrative] |

---

## Demo Bar Change

| 51.3 | 51.4 |
|---|---|
| 9 step pips with labels | 5 stage dots |
| Step labels: Entry/Query/Overview/Topology/Focus/Emphasis/Persona/ENL/Narrative | Stage labels: Situation/Signals/Persona/Evidence/Narrative |
| Scroll to data-demo-section targets | Panel open (no scroll) |

---

## Behavioral Changes

| Behavior | Before (51.3) | After (51.4) |
|---|---|---|
| Entry state | All sections visible (scrolled) | Only SituationPanel open |
| Signal display | Always visible after query load | Collapsed until stage 2 |
| ENL/persona | Below main output | Inside PersonaPanel (collapsed) |
| Evidence | Always rendered | Inside ENLPanel (collapsed) |
| Narrative | Flat output | Inside NarrativePanel (collapsed) |
| Demo bar | 9 step pips | 5 stage dots |
| Navigation | Scroll to sections | Open panels |

---

## Unchanged

- All API routes (42.28 + 42.29 surface)
- All query parameters
- All response schemas
- All adapter logic
- Red-node emphasis (topology, signals)
- TopologyPanel rendering
- Query selection flow
